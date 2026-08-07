---
title: "Optimizing the Casts Away"
link: "https://trino.io/blog/2019/05/21/optimizing-the-casts-away.html"
guid: "https://trino.io/blog/2019/05/21/optimizing-the-casts-away.html"
pubDate: "2019-05-21T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "The next release of Presto (version 312) will include a new optimization to remove unnecessary casts \nwhich might have been added implicitly by the query planner or explicitly by users when they wrote the query.\nThis is a long post explaining how the optimization works. If you’re only interested in the results,\nskip to the last section. For the full details, read on!\nLike many programming languages, SQL allows certain operations between values of different \ntypes if there are implicit conversions (a.k.a., implicit casts or coercions) between those types.\nThis improves usability, as it allows writing expressions like 1.5 > 2 without worrying too much\nwhether the types are compatible (1.5 is of type decimal(2,1), while 2 is an integer).\nDuring query analysis and planning, Presto introduces explicit casts for any implicit conversion in the\noriginal query as it translates it into the intermediate query plan representation the engine uses \ninternally for optimization and execution. This eliminates a layer of complexity for the optimizer, \nwhich, as a result, doesn’t need to reason about types (type inference) or worry about whether expressions \nare properly typed.\nMore importantly, it simplifies the job of defining and implementing operators (e.g., >, <, =, etc). \nWithout implicit conversions, there would need to exist a variant of every operator for every combination\n of compatible types. For example, it would be necessary to have an implementation of the = operator for \n (tinyint, tinyint), (tinyint, smallint), (tinyint, integer), \n(tinyint, bigint), (smallint, integer), and so on.\nGiven two columns, s :: tinyint and t :: smallint, and an expression such as s = t, the planner \ndetermines that tinyint can be implicitly coerced to smallint and derives the following expression:\n\nCAST(s AS smallint) = t   \n\n\nThis is not without challenges. The predicate pushdown logic relies on simple equality and \nrange comparisons to move predicates around, and importantly, to infer that certain predicates\nin one branch of a join can be used to constrain the values on the other side of the join. An\nexpression like the one above is not “simple” from this perspective due to the type conversion \ninvolved, and it can defeat the (arguably simplistic) predicate inference algorithm.\nSecondly, if t is a constant (or an expression that is effectively constant), the engine has to \nconvert every value of s it sees during query execution in order to compare it with t. This \nbrings up the obvious question: “can’t it somehow convert t to tinyint and compare directly”?\nIt would look like:\n\ns = CAST(t AS tinyint)\n\n\nSince t is a constant, the term CAST(t AS tinyint) can be trivially pre-computed and reused \nfor the entire query. It’s not that simple in the general case, though. Narrowing cast, such \nas a conversion from smallint to tinyint, or from double to integer can fail or alter\nthe value due to rounding or truncation, so we must take special care to avoid errors or \nchange query semantics. We discuss this at length in the sections below.\nSome properties of (well-behaved) implicit casts\nLet’s take a short detour and talk briefly about some properties of well-behaved implicit \ncasts we can exploit to do the transformation we described in the previous section.\nSince the query engine is free to insert implicit casts wherever it sees fit, these functions\nneed to follow some ground rules. Failure to do so can result in queries producing incorrect\nresults due to changes in query semantics.\nImplicit casts need to have the following properties:\nInjective. Given \\(\\cast{S}{T}\\) every value in S \nmust map to a distinct value in T (this does not imply that every value in T has to map to a value \nin S, though).\nOrder-preserving. Given \\(s_1 \\in S\\) and \\(s_2 \\in S\\),\nFor exact numeric types (e.g., smallint, integer, decimal, etc.), this holds as long as \nT has enough integer digits to hold the integral part of S and enough fractional digits to \nhold the fractional part of S.\nAs an example, the picture below depicts how every value of type tinyint, which has a range\nof \\([-128, 127]\\), maps to a distinct value of a wider type such as smallint. Also, every value \nof the wider type that is within the range of representable values of tinyint has a distinct \nmapping to a tinyint. So, for the values within the tinyint range, the tinyint → smallint\nconversion is bijective. This is not necessary for the \ntransformation to work, but it simplifies one of the cases we’ll consider. We’ll cover this more later.\n\nOn the other hand, some conversions such as those between integer types and decimal types with fractional\nparts are injective but not bijective, even when excluding the values outside the range of the narrower\n type.\n\nThe properties clearly hold for tinyint → smallint → integer → biginteger. They also hold for:\ntinyint → decimal(3,0) → decimal(4,1) → decimal(5,2) → …\nsmallint → decimal(5,0) → decimal(6,1) → decimal(7,2) → …\ninteger → decimal(10,0) → decimal(11,1) → …\nbigint → decimal(19,0) → decimal(20, 1) → …\nIt even works for conversions between exact and approximate numbers, such as:\nsmallint → real\nreal → double\ninteger → double\nIt does not work for bigint → double, integer → real, or decimal → double when precision is large\nbecause not all bigints fit in a double (64 bits vs 53-bit mantissa) and not all integers fit in a real \n(32 bits vs 23-bit mantissa). Sadly, for legacy reasons Presto allows those conversions implicitly. We “justify” \nit with the argument that “since they are dealing with approximate numerics anyway, and given the conversions only \nlose precision in the least significant part, they are sort of ok”. This is something we’ll revisit in the\nfuture once we have a reasonable story around dealing with inherent break in backward-compatibility\nof removing such conversions.\nFinally, the properties also apply for varchar to varchar conversions:\nvarchar(0) → varchar(1) → varchar(2) → … → varchar\nGetting to the point…\nWith this in mind, let’s look at the simplest scenario: conversions between integer types.\nAs in the example we covered in the introduction, the transformation is straightforward \nwhen the constant can be represented in the narrower type. Given s :: tinyint:\n\nCAST(s AS smallint) = smallint '1'     ⟺  s = tinyint '1'\nCAST(s AS smallint) = smallint '127'   ⟺  s = tinyint '127'\nCAST(s AS smallint) = smallint '-128'  ⟺  s = tinyint '-128'\n\nCAST(s AS smallint) > smallint '10'    ⟺  s > tinyint '10'\nCAST(s AS smallint) < smallint '10'    ⟺  s < tinyint '10'\n\n\nOf course, when the value is at the edge of the range of the narrower type, we can cleverly \nturn some inequalities into equalities:\n\nCAST(s AS smallint) >= smallint '127'   ⟺  s >= tinyint '127'  \n                                        ⟺  s =  tinyint '127'\n                                       \nCAST(s AS smallint) <= smallint '-128'  ⟺  s <= tinyint '-128'  \n                                        ⟺  s =  tinyint '-128'\n\n\nAdditionally, we may be able to tell that an expression is always true or false. Special\ncare needs to be taken when the value is null, though, since in SQL any comparison with null \nyields null:\n\nCAST(s AS smallint) > smallint '127'    ⟺  s > tinyint '127'  \n                                        ⟺  if(s is null, null, false)\n                                        \nCAST(s AS smallint) <= smallint '127'   ⟺  s <= tinyint '127'  \n                                        ⟺  if(s is null, null, true)\n\nCAST(s AS smallint) < smallint '-128'   ⟺  s < tinyint '-128'  \n                                        ⟺  if(s is null, null, false)\n                                        \nCAST(s AS smallint) >= smallint '-128'  ⟺  s >= tinyint '-128'  \n                                        ⟺  if(s is null, null, true)\n\n\nWe can make similar inferences when the value is outside the range of possible values\nfor tinyint. For equality comparisons, it’s trivial.\n\nCAST(s AS smallint) = smallint '1000'  ⟺  if(s is null, null, false)    \n\n\nConversely,\n\nCAST(s AS smallint) <> smallint '1000'  ⟺  if(s is null, null, true)\n\n\nJust like the earlier cases involving comparisons with values at the edge of the range,\nwe can apply the same idea when the value falls outside of the range:\n\nCAST(s AS smallint) < smallint '1000'   ⟺  if(s is null, null, true) \nCAST(s AS smallint) < smallint '-1000'  ⟺  if(s is null, null, false)\n\nCAST(s AS smallint) > smallint '1000'   ⟺  if(s is null, null, false) \nCAST(s AS smallint) > smallint '-1000'  ⟺  if(s is null, null, true)\n\n\nUnrepresentable values\nValues that are outside the range of the narrower type may not be the only ones without a mapping. \nFor example, for a type such as decimal(2,1), any value with a fractional part (e.g., 1.5, 2.3) cannot \nbe represented as a tinyint.\nWe can tell whether a value t in T is representable in S by converting it to S and back to T. We’ll \ncall this value t'.\nIf t <> t', t is not representable in S, and similar rules as for out-of-range values apply when the \nexpression involves an equality. For example, given s :: tinyint:\n\nCAST(s AS double) =  double '1.1'  ⟺  if(s is null, null, false)    \nCAST(s AS double) <> double '1.1'  ⟺  if(s is null, null, true)\n\n\nWhen some values in T are not representable in S, the cast between T → S will generally either truncate\nor round. The SQL specification doesn’t mandate which of those alternatives an implementation should follow,\nand even allows that to vary for conversions between various combinations of types.\nThis throws a bit of a wrench in our plans, so to speak. If we can’t tell whether a cast will round or truncate,\nhow would we know whether a > comparison should turn into a > or >= in the resulting expression? To \nillustrate, let’s consider this example. Given s :: tinyint:\n\nCAST(s AS double) > double '1.9'\n\n\nIf the conversion from double → tinyint truncates, the expression above is equivalent to:\n\ns > tinyint '1'\n\n\nOn the other hand, if the conversion rounds, 1.9 becomes 2, and the expression is equivalent to:\n\ns >= tinyint '2'              \n\n\nIn order to know which operator to use in the transformed expression (e.g., > vs >=), it is therefore \ncrucial to distinguish between those two behaviors. The good news is that there’s a simple and elegant way\nout of this hole.\nAn important observation is that we don’t need to know how the conversion behaves in general, but only how \nit behaves when applied to the constant t. Regardless of whether the conversion truncates or rounds, for a \ngiven value of t, the outcome can be seen to round up or round down, as depicted below.\n\n      \n    \nWe can easily tell which of those scenarios applies by comparing t with t': if t > t', the operation rounded\ndown. Conversely, if t < t', it rounded up. If t = t', the value is representable in S, and the rules from the \nprevious section apply.\nOh, the nullability\nLet’s take another quick detour and talk about the issue of nullability. After all, no discussion about\nSQL is complete without an exploration of the semantics of null.\nSQL uses three-valued logic. In addition\nto true and false, logical expressions can evaluate to an unknown value, which is indicated by null.\nLogical operations AND and OR behave according to the following rules:\nThe logical comparison operators =, <>, >, ≥, <, ≤ evaluate to null when one or both operands are null.\nHence, if t is null, our expression cast(s as smallint) = t can be simply replaced with a constant null.\nAs we mentioned in the previous section, there are cases where cast(s as smallint) = t can be reduced to \ntrue or false, except for the fact that if s is null, the expression needs to return null to preserve\nsemantics. So, we use the following forms to capture this:\n\nif(s IS null, null, false)\nif(s IS null, null, true)\n\n\nThe catch with that is that the optimizer does not understand the semantics of these if expressions and cannot \nuse them for deriving additional properties. In essence, it becomes an optimization barrier. On the other hand,\nthe optimizer is pretty good at manipulating logical conjunctions (AND) and disjunctions (OR). So, let’s see \nhow we can use boolean logic to obtain an equivalent formulation.\nWe can exploit the properties of SQL boolean logic to derive expressions that behave in the same manner as the \nif() constructs from above:\nLet’s break it down to see why that works.\nPutting it all together\nNow that we’ve had a taste of how this optimization works, let’s put it all together into one rule to rule\nthem all.\nGiven an expression of the following form,\nwe derive a transformation based on the rules below.\nIf \\(t \\text{ is null} \\Rightarrow \\cast{S}{T}(s) \\otimes t \\iff \\text{null} \\tag{1}\\) \\(\\\\[5pt]\\)\nIf \\(\\exists s' \\in S \\ldotp s' = \\cast{T}{S}(t)\\), we calculate \\(t' = \\cast{S}{T}(s')\\) and consider \nthe following cases:\n    \n If \\(t = t' \\Rightarrow \\cast{S}{T}(s) \\otimes t \\iff s \\otimes \\cast{T}{S}(t) \\tag{2.1}\\) \\(\\\\[5pt]\\)\n        \n In the special case where \\(\\\\[5pt]\\) \\(\\quad  s' = \\text{min}_S  \\Rightarrow   \n \\left\\{\n  \\begin{array}{@{}ll@{}}\n \\cast{S}{T}(s) > t   & \\iff s \\ne \\text{min}_{S}     \\\\\n \\cast{S}{T}(s) \\ge t & \\iff \\trueOrNull{s}           \\\\\n \\cast{S}{T}(s) <   t & \\iff \\falseOrNull{s}          \\\\\n \\cast{S}{T}(s) \\le t & \\iff s = \\text{min}_{S}\n  \\end{array}\\right. \\tag{2.1.1}  \\\\[5pt]\\)\n In the special case where \\(\\\\[5pt]\\) \\(\\quad s' = \\text{max}_S  \\Rightarrow \n \\left\\{\n  \\begin{array}{@{}ll@{}}\n\\cast{S}{T}(s) > t   & \\iff \\falseOrNull{s}        \\\\\n\\cast{S}{T}(s) \\ge t & \\iff s = \\text{max}_{S}     \\\\\n\\cast{S}{T}(s) <   t & \\iff s \\ne \\text{max}_{S}   \\\\\n\\cast{S}{T}(s) \\le t & \\iff \\trueOrNull{s}\n  \\end{array}\\right. \\tag{2.1.2} \\\\[5pt]\\)\nOtherwise, \\(\\\\[5pt]\\) \\(\\quad  t \\ne t' \\Rightarrow \n \\left\\{\n  \\begin{array}{@{}ll@{}}\n   \\cast{S}{T}(s) = t   & \\iff \\falseOrNull{s}        \\\\\n   \\cast{S}{T}(s) \\ne t & \\iff \\trueOrNull{s}            \n  \\end{array}\\right. \\tag{2.2} \\\\[5pt]\\)\nFurther, if \\(\\\\[5pt]\\) \\(\\quad \\quad  t < t' \\Rightarrow \n \\left\\{\n  \\begin{array}{@{}ll@{}}\n\\cast{S}{T}(s) > t   & \\iff s \\ge \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) \\ge t & \\iff s \\ge \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) <   t & \\iff s <  \\cast{T}{S}(t)     \\\\\n\\cast{S}{T}(s) \\le t & \\iff s <  \\cast{T}{S}(t)\n  \\end{array}\\right. \\tag{2.2.1} \\\\[5pt]\\)\nOtherwise, if \\(\\\\[5pt]\\) \\(\\quad \\quad  t > t' \\Rightarrow\n \\left\\{\n  \\begin{array}{@{}ll@{}}\n\\cast{S}{T}(s) > t   & \\iff s >    \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) \\ge t & \\iff s >    \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) <   t & \\iff s \\le  \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) \\le t & \\iff s \\le  \\cast{T}{S}(t)\n  \\end{array}\\right. \\\\[5pt] \\tag{2.2.2}\\)\nIf \\(\\cast{T}{S}\\) is undefined or \\(\\cast{T}{S}(t)\\) fails, \\(\\\\[5pt]\\) \\(t < \\cast{S}{T}(\\text{min}_S) \\Rightarrow  \n  \\left\\{\n \\begin{array}{@{}ll@{}}\n         \\cast{S}{T}(s) =   t & \\iff \\falseOrNull{s}    \\\\\n         \\cast{S}{T}(s) \\ne t & \\iff \\trueOrNull{s}     \\\\\n         \\cast{S}{T}(s) <   t & \\iff \\falseOrNull{s}    \\\\\n         \\cast{S}{T}(s) \\le t & \\iff \\falseOrNull{s}    \\\\\n         \\cast{S}{T}(s) >   t & \\iff \\trueOrNull{s}     \\\\\n         \\cast{S}{T}(s) \\ge t & \\iff \\trueOrNull{s}     \n\\end{array}\\right. \\\\[5pt] \\tag{3.1}\\)\n\\(t = \\cast{S}{T}(\\text{min}_S) \\Rightarrow  \n  \\left\\{\n \\begin{array}{@{}ll@{}}\n         \\cast{S}{T}(s) =   t & \\iff s = \\text{min}_S       \\\\\n         \\cast{S}{T}(s) \\ne t & \\iff s > \\text{min}_S       \\\\\n         \\cast{S}{T}(s) <   t & \\iff \\falseOrNull{s}        \\\\\n         \\cast{S}{T}(s) \\le t & \\iff s = \\text{min}_S       \\\\\n         \\cast{S}{T}(s) >   t & \\iff s > \\text{min}_S       \\\\\n         \\cast{S}{T}(s) \\ge t & \\iff \\trueOrNull{s}     \n\\end{array}\\right. \\\\[5pt] \\tag{3.2}\\)\n\\(t > \\cast{S}{T}(\\text{max}_S) \\Rightarrow  \n  \\left\\{\n    \\begin{array}{@{}ll@{}}\n            \\cast{S}{T}(s) =   t & \\iff \\falseOrNull{s}    \\\\\n            \\cast{S}{T}(s) \\ne t & \\iff \\trueOrNull{s}     \\\\\n            \\cast{S}{T}(s) <   t & \\iff \\trueOrNull{s}     \\\\\n            \\cast{S}{T}(s) \\le t & \\iff \\trueOrNull{s}     \\\\\n            \\cast{S}{T}(s) >   t & \\iff \\falseOrNull{s}    \\\\\n            \\cast{S}{T}(s) \\ge t & \\iff \\falseOrNull{s}    \n   \\end{array}\\right. \\\\[5pt] \\tag{3.3}\\)\n\\(t = \\cast{S}{T}(\\text{max}_S) \\Rightarrow  \n \\left\\{\n   \\begin{array}{@{}ll@{}}\n           \\cast{S}{T}(s) =   t & \\iff s = \\text{max}_S   \\\\\n           \\cast{S}{T}(s) \\ne t & \\iff s < \\text{max}_S   \\\\\n           \\cast{S}{T}(s) <   t & \\iff s < \\text{max}_S   \\\\\n           \\cast{S}{T}(s) \\le t & \\iff \\trueOrNull{s}     \\\\\n           \\cast{S}{T}(s) >   t & \\iff \\falseOrNull{s}    \\\\\n           \\cast{S}{T}(s) \\ge t & \\iff s = \\text{max}_S       \n  \\end{array}\\right. \\\\[5pt] \\tag{3.4}\\) \nOMGWTFNaN\nAs if all of this weren’t enough, there’s an additional complication we need to handle for types such\nas real and double. Those types are what the SQL specification calls approximate numeric types.\nPresto implements them as IEEE-754 single and double \nprecision floating point numbers, respectively.\nIn addition to finite numbers, IEEE-754 defines an additional set of values: ∞ and NaN (not a number).\nIt is worth noting that -∞ and +∞ do not behave like ∞ in the mathematical sense. They are actual values\nin the ordered set of numbers, but they don’t represent any finite number. Therefore, the following relations hold:\n\n-∞ < -1.23E30 < 0 < 3.45E25 < +∞\n-∞ = -∞\n+∞ = +∞ \n\n\nSince -∞ and +∞ can be treated as regular values, we can use them as the minimum and maximum values of the range\nfor these types. Any other choice would not work, since all values of a type must be contained within the range of the type\nfor the transformation to be valid. That is,\nLet’s look at an example to understand why this is necessary. Instead of using \\([-∞, ∞]\\) as the range, \nlet’s say we picked the minimum and maximum representable values for the real type (-3.4028235E38 and 3.4028235E38), and\nconsider this expression (s :: real):\n\ncast(s AS double) >= double '3.4028235E38'\n\n\nFrom the rules in the previous section, \\(t = 3.4028235\\text{E}38\\), \\(s'= 3.4028235\\text{E}38\\) and \\(t' = 3.4028235E38\\). Since \n\\(t = t'\\) and \\(s' = max_S\\), from rule 2.1.2, the expression reduces to:\n\ns = 3.4028235E38 \n\n\nThis is clearly incorrect. When s = Infinity, cast(s AS double) results in double 'Infinity', which is not equal\nto 3.4028235E38.\nOn the other hand, NaN doesn’t obey any of the comparison rules. It’s neither equal nor distinct from itself, and\nit’s neither larger, nor smaller than any other value:\n\nNaN =  NaN  ⟺  false  \nNaN <> NaN  ⟺  false\nNaN > 0     ⟺  false\nNaN = 0     ⟺  false\nNaN < 0     ⟺  false\n\n\nSo, NaN is not part of the ordered set of values for these types, and the requirement that every value be contained \nin the range doesn’t hold. From rule 2.1.1, an expression such as:\n\ncast(s AS double) >= double '-Infinity'\n\n\nreduces to if(s is null, null, true), which is incorrect, since the expression returns false when s is NaN.\nIs all hope lost for real and double? Fortunately, not. The range is only needed as an optimization. If we\nforgo defining a range for types that don’t have the required properties, the special cases 2.1.1 and \n2.1.2 don’t apply, and by rule 2.1, the expression is equivalent to:\n\ns >= real '-Infinity'\n\n\nwhich correctly returns false when s is NaN.\n Show me the money!\nSo, does all of this even matter? Why, yes! Glad you asked.\nAs with any performance optimization, you can improve things by working smarter (can you avoid work that can be \nproven to be unnecessary) or by working harder (can you do the work you have to do more efficiently). This\noptimization does a little of both. Let’s consider three scenarios when it has a positive effect.\nDead code\nSince in some cases it can prove that the comparisons will always produce false, regardless of the input,\nit can short-circuit entire conditions or subplans before even a single row of data is read. Some query generation \ntools are not sophisticated enough and may emit queries that contain that kind of construct. Also, everyone makes\nmistakes, and it’s not hard to end up with queries that contain what’s effectively dead code.  The last thing you\nwant is to sit in front of the screen waiting for a query to complete … waiting … waiting … just for Presto\nto tell you ¯\\_(ツ)_/¯.\nFor example, given:\n\nCREATE TABLE t(x smallint);\n\n-- <insert lots of rows into t> --\n\n\n\nSELECT * \nFROM t \nWHERE x IS NOT NULL AND x > 1000000 \n\n\nProduces the following query plan (Values is an empty inline table):\n\n- Output[x]\n  - Values\n\n\nImproved JOIN performance\nWhat’s nice about this optimization is that it enables other optimizations to work better. We mentioned earlier\nthat comparisons that are not simple expressions between columns, or between columns and constants, make it harder for the\npredicate pushdown optimization to infer predicates that can be propagated to the other branch of a join.\nGiven two tables:\n\nCREATE TABLE t1 (v smallint);\nCREATE TABLE t2 (v bigint);\n\n\nAnd the following query:\n\nSELECT *\nFROM t1 JOIN t2 ON t1.v = t2.v\nWHERE t1.v = BIGINT '1';\n\n\nThe query plan without this optimization is:\n\n- Output[name]\n  - InnerJoin[expr = v]\n    - ScanFilterProject[t1, filter = CAST(v AS bigint) = BIGINT '1']\n        expr := CAST(v AS bigint)\n    - TableScan[t2]\n\n\nThe optimization allows the predicate pushdown logic to apply the condition to the other side of the join, producing\na much better plan. If data in t1 and t2 is somehow organized by v (e.g., a partition key in Hive), or if the\nconnector understands how to apply the filter at the source, the query won’t need to even read certain parts of the\ntable. The query plan with the optimization enabled:\n\n- Output[name]\n  - CrossJoin\n    - ScanFilterProject[t1, filter = (v = SMALLINT '1')]\n    - ScanFilterProject[t2, filter = (v = BIGINT '1')]\n\n\nBest bang for the buck\nFinally, if the condition absolutely needs to be evaluated, the transformed expression could be significantly\nmore efficient, especially when the cast between the two types is expensive. To illustrate, given a table\nwith 1 billion rows and a column k :: bigint:\n\nSELECT count_if(k > CAST(0 as decimal(19)) \nFROM t\n\n\nWithout the optimization:\n\n- [...]\n    - ScanProject\n===>    CPU: 3.75m (66.34%), Scheduled: 5.56m (145.22%)\n        expr := (CAST(\"k\" AS decimal(19,0)) > CAST(DECIMAL '0' AS decimal(19,0)))\n        \n        \nQuery 20190515_072240_00006_rgzb4, FINISHED, 4 nodes\nSplits: 110 total, 110 done (100.00%)\n0:22 [1000M rows, 8.4GB] [46M rows/s, 395MB/s]\n\n\nWith the optimization:\n\n- [...]\n    - ScanProject\n===>    CPU: 29.93s (58.17%), Scheduled: 47.44s (145.07%)\n        expr := (\"k\" > BIGINT '0')\n        \n        \nQuery 20190515_071912_00005_bz6cb, FINISHED, 4 nodes\nSplits: 110 total, 110 done (100.00%)\n0:03 [1000M rows, 8.4GB] [335M rows/s, 2.81GB/s]        \n\n\nThirsty for more? Here’s the code. \nHappy querying!\nMany thanks to kasiafi for their thoughtful and thorough feedback on early\ndrafts of this post."
author: "Martin Traverso"
contentHtml: "<p>The next release of Presto (version 312) will include a new optimization to remove unnecessary casts \nwhich might have been added implicitly by the query planner or explicitly by users when they wrote the query.</p>\n\n<p>This is a long post explaining how the optimization works. If you’re only interested in the results,\nskip to the <a href=\"#results\">last section</a>. For the full details, read on!</p>\n\n\n\n<div style=\"display:none\">\n$$ \n\\newcommand\\cast[2]{\n    \\text{cast}_{\\text{#1} \\rightarrow \\text{#2}}\n} \n\\newcommand\\trueOrNull[1]{\n  \\text{if}(#1 \\text{ is null}, \\text{null}, \\text{true})\n} \n\\newcommand\\falseOrNull[1]{\n  \\text{if}(#1 \\text{ is null}, \\text{null}, \\text{false})\n} \n$$\n</div>\n\n<p>Like many programming languages, SQL allows certain operations between values of different \ntypes if there are implicit conversions (a.k.a., implicit casts or coercions) between those types.\nThis improves usability, as it allows writing expressions like <code class=\"language-plaintext highlighter-rouge\">1.5 &gt; 2</code> without worrying <em>too much</em>\nwhether the types are compatible (<code class=\"language-plaintext highlighter-rouge\">1.5</code> is of type <code class=\"language-plaintext highlighter-rouge\">decimal(2,1)</code>, while <code class=\"language-plaintext highlighter-rouge\">2</code> is an <code class=\"language-plaintext highlighter-rouge\">integer</code>).</p>\n\n<p>During query analysis and planning, Presto introduces explicit casts for any implicit conversion in the\noriginal query as it translates it into the intermediate query plan representation the engine uses \ninternally for optimization and execution. This eliminates a layer of complexity for the optimizer, \nwhich, as a result, doesn’t need to reason about types (type inference) or worry about whether expressions \nare properly typed.</p>\n\n<p>More importantly, it simplifies the job of defining and implementing operators (e.g., <code class=\"language-plaintext highlighter-rouge\">&gt;</code>, <code class=\"language-plaintext highlighter-rouge\">&lt;</code>, <code class=\"language-plaintext highlighter-rouge\">=</code>, etc). \nWithout implicit conversions, there would need to exist a variant of every operator for every combination\n of compatible types. For example, it would be necessary to have an implementation of the <code class=\"language-plaintext highlighter-rouge\">=</code> operator for \n <code class=\"language-plaintext highlighter-rouge\">(tinyint, tinyint)</code>, <code class=\"language-plaintext highlighter-rouge\">(tinyint, smallint)</code>, <code class=\"language-plaintext highlighter-rouge\">(tinyint, integer)</code>, \n<code class=\"language-plaintext highlighter-rouge\">(tinyint, bigint)</code>, <code class=\"language-plaintext highlighter-rouge\">(smallint, integer)</code>, and so on.</p>\n\n<p>Given two columns, <code class=\"language-plaintext highlighter-rouge\">s :: tinyint</code> and <code class=\"language-plaintext highlighter-rouge\">t :: smallint</code>, and an expression such as <code class=\"language-plaintext highlighter-rouge\">s = t</code>, the planner \ndetermines that <code class=\"language-plaintext highlighter-rouge\">tinyint</code> can be implicitly coerced to <code class=\"language-plaintext highlighter-rouge\">smallint</code> and derives the following expression:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CAST(s AS smallint) = t   \n</code></pre></div></div>\n\n<p>This is not without challenges. The predicate pushdown logic relies on simple equality and \nrange comparisons to move predicates around, and importantly, to infer that certain predicates\nin one branch of a join can be used to constrain the values on the other side of the join. An\nexpression like the one above is not “simple” from this perspective due to the type conversion \ninvolved, and it can defeat the (arguably simplistic) predicate inference algorithm.</p>\n\n<p>Secondly, if <code class=\"language-plaintext highlighter-rouge\">t</code> is a constant (or an expression that is effectively constant), the engine has to \nconvert every value of <code class=\"language-plaintext highlighter-rouge\">s</code> it sees during query execution in order to compare it with <code class=\"language-plaintext highlighter-rouge\">t</code>. This \nbrings up the obvious question: “can’t it somehow convert <code class=\"language-plaintext highlighter-rouge\">t</code> to <code class=\"language-plaintext highlighter-rouge\">tinyint</code> and compare directly”?\nIt would look like:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>s = CAST(t AS tinyint)\n</code></pre></div></div>\n\n<p>Since <code class=\"language-plaintext highlighter-rouge\">t</code> is a constant, the term <code class=\"language-plaintext highlighter-rouge\">CAST(t AS tinyint)</code> can be trivially pre-computed and reused \nfor the entire query. It’s not that simple in the general case, though. Narrowing cast, such \nas a conversion from <code class=\"language-plaintext highlighter-rouge\">smallint</code> to <code class=\"language-plaintext highlighter-rouge\">tinyint</code>, or from <code class=\"language-plaintext highlighter-rouge\">double</code> to <code class=\"language-plaintext highlighter-rouge\">integer</code> can fail or alter\nthe value due to rounding or truncation, so we must take special care to avoid errors or \nchange query semantics. We discuss this at length in the sections below.</p>\n\n<h1 id=\"some-properties-of-well-behaved-implicit-casts\">Some properties of (well-behaved) implicit casts</h1>\n\n<p>Let’s take a short detour and talk briefly about some properties of well-behaved implicit \ncasts we can exploit to do the transformation we described in the previous section.</p>\n\n<p>Since the query engine is free to insert implicit casts wherever it sees fit, these functions\nneed to follow some ground rules. Failure to do so can result in queries producing incorrect\nresults due to changes in query semantics.</p>\n\n<p>Implicit casts need to have the following properties:</p>\n<ul>\n  <li><a href=\"https://en.wikipedia.org/wiki/Injective_function\">Injective</a>. Given \\(\\cast{S}{T}\\) every value in <code class=\"language-plaintext highlighter-rouge\">S</code> \nmust map to a distinct value in <code class=\"language-plaintext highlighter-rouge\">T</code> (this does not imply that every value in <code class=\"language-plaintext highlighter-rouge\">T</code> has to map to a value \nin <code class=\"language-plaintext highlighter-rouge\">S</code>, though).</li>\n  <li>Order-preserving. Given \\(s_1 \\in S\\) and \\(s_2 \\in S\\),</li>\n</ul>\n\n\\[\\begin{equation}\ns_1 = s_2 \\quad \\Rightarrow \\quad \\cast{S}{T}(s_1) = \\cast{S}{T}(s_2) \\\\\ns_1 &lt; s_2 \\quad \\Rightarrow \\quad \\cast{S}{T}(s_1) &lt; \\cast{S}{T}(s_2) \\\\\ns_1 &gt; s_2 \\quad \\Rightarrow \\quad \\cast{S}{T}(s_1) &gt; \\cast{S}{T}(s_2)\n\\end{equation}\\]\n\n<p>For exact numeric types (e.g., <code class=\"language-plaintext highlighter-rouge\">smallint</code>, <code class=\"language-plaintext highlighter-rouge\">integer</code>, <code class=\"language-plaintext highlighter-rouge\">decimal</code>, etc.), this holds as long as \n<code class=\"language-plaintext highlighter-rouge\">T</code> has enough integer digits to hold the integral part of <code class=\"language-plaintext highlighter-rouge\">S</code> and enough fractional digits to \nhold the fractional part of <code class=\"language-plaintext highlighter-rouge\">S</code>.</p>\n\n<p>As an example, the picture below depicts how every value of type <code class=\"language-plaintext highlighter-rouge\">tinyint</code>, which has a range\nof \\([-128, 127]\\), maps to a distinct value of a wider type such as <code class=\"language-plaintext highlighter-rouge\">smallint</code>. Also, every value \nof the wider type that is within the range of representable values of <code class=\"language-plaintext highlighter-rouge\">tinyint</code> has a distinct \nmapping to a <code class=\"language-plaintext highlighter-rouge\">tinyint</code>. So, for the values within the <code class=\"language-plaintext highlighter-rouge\">tinyint</code> range, the <code class=\"language-plaintext highlighter-rouge\">tinyint</code> → <code class=\"language-plaintext highlighter-rouge\">smallint</code>\nconversion is <a href=\"https://en.wikipedia.org/wiki/Bijection\">bijective</a>. This is not necessary for the \ntransformation to work, but it simplifies one of the cases we’ll consider. We’ll cover this more later.</p>\n\n<p><img src=\"/assets/blog/optimizing-casts/tinyint-integer.svg\" alt=\"\" /></p>\n\n<p>On the other hand, some conversions such as those between integer types and decimal types with fractional\nparts are injective but not bijective, even when excluding the values outside the range of the narrower\n type.</p>\n\n<p><img src=\"/assets/blog/optimizing-casts/tinyint-decimal.svg\" alt=\"\" /></p>\n\n<p>The properties clearly hold for <code class=\"language-plaintext highlighter-rouge\">tinyint</code> → <code class=\"language-plaintext highlighter-rouge\">smallint</code> → <code class=\"language-plaintext highlighter-rouge\">integer</code> → <code class=\"language-plaintext highlighter-rouge\">biginteger</code>. They also hold for:</p>\n<ul>\n  <li><code class=\"language-plaintext highlighter-rouge\">tinyint</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(3,0)</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(4,1)</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(5,2)</code> → …</li>\n  <li><code class=\"language-plaintext highlighter-rouge\">smallint</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(5,0)</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(6,1)</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(7,2)</code> → …</li>\n  <li><code class=\"language-plaintext highlighter-rouge\">integer</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(10,0)</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(11,1)</code> → …</li>\n  <li><code class=\"language-plaintext highlighter-rouge\">bigint</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(19,0)</code> → <code class=\"language-plaintext highlighter-rouge\">decimal(20, 1)</code> → …</li>\n</ul>\n\n<p>It even works for conversions between exact and approximate numbers, such as:</p>\n<ul>\n  <li><code class=\"language-plaintext highlighter-rouge\">smallint</code> → <code class=\"language-plaintext highlighter-rouge\">real</code></li>\n  <li><code class=\"language-plaintext highlighter-rouge\">real</code> → <code class=\"language-plaintext highlighter-rouge\">double</code></li>\n  <li><code class=\"language-plaintext highlighter-rouge\">integer</code> → <code class=\"language-plaintext highlighter-rouge\">double</code></li>\n</ul>\n\n<p>It does <em>not</em> work for <code class=\"language-plaintext highlighter-rouge\">bigint</code> → <code class=\"language-plaintext highlighter-rouge\">double</code>, <code class=\"language-plaintext highlighter-rouge\">integer</code> → <code class=\"language-plaintext highlighter-rouge\">real</code>, or <code class=\"language-plaintext highlighter-rouge\">decimal</code> → <code class=\"language-plaintext highlighter-rouge\">double</code> when precision is large\nbecause not all <code class=\"language-plaintext highlighter-rouge\">bigint</code>s fit in a <code class=\"language-plaintext highlighter-rouge\">double</code> (64 bits vs 53-bit mantissa) and not all <code class=\"language-plaintext highlighter-rouge\">integer</code>s fit in a <code class=\"language-plaintext highlighter-rouge\">real</code> \n(32 bits vs 23-bit mantissa). Sadly, for legacy reasons Presto allows those conversions implicitly. We “justify” \nit with the argument that “since they are dealing with approximate numerics anyway, and given the conversions only \nlose precision in the least significant part, they are sort of ok”. This is something we’ll revisit in the\nfuture once we have a reasonable story around dealing with inherent break in backward-compatibility\nof removing such conversions.</p>\n\n<p>Finally, the properties also apply for <code class=\"language-plaintext highlighter-rouge\">varchar</code> to <code class=\"language-plaintext highlighter-rouge\">varchar</code> conversions:</p>\n<ul>\n  <li><code class=\"language-plaintext highlighter-rouge\">varchar(0)</code> → <code class=\"language-plaintext highlighter-rouge\">varchar(1)</code> → <code class=\"language-plaintext highlighter-rouge\">varchar(2)</code> → … → <code class=\"language-plaintext highlighter-rouge\">varchar</code></li>\n</ul>\n\n<h1 id=\"getting-to-the-point\">Getting to the point…</h1>\n\n<p>With this in mind, let’s look at the simplest scenario: conversions between integer types.</p>\n\n<p>As in the example we covered in the introduction, the transformation is straightforward \nwhen the constant can be represented in the narrower type. Given <code class=\"language-plaintext highlighter-rouge\">s :: tinyint</code>:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CAST(s AS smallint) = smallint '1'     ⟺  s = tinyint '1'\nCAST(s AS smallint) = smallint '127'   ⟺  s = tinyint '127'\nCAST(s AS smallint) = smallint '-128'  ⟺  s = tinyint '-128'\n\nCAST(s AS smallint) &gt; smallint '10'    ⟺  s &gt; tinyint '10'\nCAST(s AS smallint) &lt; smallint '10'    ⟺  s &lt; tinyint '10'\n</code></pre></div></div>\n\n<p>Of course, when the value is at the edge of the range of the narrower type, we can cleverly \nturn some inequalities into equalities:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CAST(s AS smallint) &gt;= smallint '127'   ⟺  s &gt;= tinyint '127'  \n                                        ⟺  s =  tinyint '127'\n                                       \nCAST(s AS smallint) &lt;= smallint '-128'  ⟺  s &lt;= tinyint '-128'  \n                                        ⟺  s =  tinyint '-128'\n</code></pre></div></div>\n\n<p>Additionally, we may be able to tell that an expression is always <code class=\"language-plaintext highlighter-rouge\">true</code> or <code class=\"language-plaintext highlighter-rouge\">false</code>. Special\ncare needs to be taken when the value is <code class=\"language-plaintext highlighter-rouge\">null</code>, though, since in SQL any comparison with <code class=\"language-plaintext highlighter-rouge\">null</code> \nyields <code class=\"language-plaintext highlighter-rouge\">null</code>:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CAST(s AS smallint) &gt; smallint '127'    ⟺  s &gt; tinyint '127'  \n                                        ⟺  if(s is null, null, false)\n                                        \nCAST(s AS smallint) &lt;= smallint '127'   ⟺  s &lt;= tinyint '127'  \n                                        ⟺  if(s is null, null, true)\n\nCAST(s AS smallint) &lt; smallint '-128'   ⟺  s &lt; tinyint '-128'  \n                                        ⟺  if(s is null, null, false)\n                                        \nCAST(s AS smallint) &gt;= smallint '-128'  ⟺  s &gt;= tinyint '-128'  \n                                        ⟺  if(s is null, null, true)\n</code></pre></div></div>\n\n<p>We can make similar inferences when the value is outside the range of possible values\nfor <code class=\"language-plaintext highlighter-rouge\">tinyint</code>. For equality comparisons, it’s trivial.</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CAST(s AS smallint) = smallint '1000'  ⟺  if(s is null, null, false)    \n</code></pre></div></div>\n\n<p>Conversely,</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CAST(s AS smallint) &lt;&gt; smallint '1000'  ⟺  if(s is null, null, true)\n</code></pre></div></div>\n\n<p>Just like the earlier cases involving comparisons with values at the edge of the range,\nwe can apply the same idea when the value falls outside of the range:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CAST(s AS smallint) &lt; smallint '1000'   ⟺  if(s is null, null, true) \nCAST(s AS smallint) &lt; smallint '-1000'  ⟺  if(s is null, null, false)\n\nCAST(s AS smallint) &gt; smallint '1000'   ⟺  if(s is null, null, false) \nCAST(s AS smallint) &gt; smallint '-1000'  ⟺  if(s is null, null, true)\n</code></pre></div></div>\n\n<h1 id=\"unrepresentable-values\">Unrepresentable values</h1>\n\n<p>Values that are outside the range of the narrower type may not be the only ones without a mapping. \nFor example, for a type such as <code class=\"language-plaintext highlighter-rouge\">decimal(2,1)</code>, any value with a fractional part (e.g., <code class=\"language-plaintext highlighter-rouge\">1.5</code>, <code class=\"language-plaintext highlighter-rouge\">2.3</code>) cannot \nbe represented as a <code class=\"language-plaintext highlighter-rouge\">tinyint</code>.</p>\n\n<p>We can tell whether a value <code class=\"language-plaintext highlighter-rouge\">t</code> in <code class=\"language-plaintext highlighter-rouge\">T</code> is representable in <code class=\"language-plaintext highlighter-rouge\">S</code> by converting it to <code class=\"language-plaintext highlighter-rouge\">S</code> and back to <code class=\"language-plaintext highlighter-rouge\">T</code>. We’ll \ncall this value <code class=\"language-plaintext highlighter-rouge\">t'</code>.</p>\n\n<p>If <code class=\"language-plaintext highlighter-rouge\">t &lt;&gt; t'</code>, <code class=\"language-plaintext highlighter-rouge\">t</code> is not representable in <code class=\"language-plaintext highlighter-rouge\">S</code>, and similar rules as for out-of-range values apply when the \nexpression involves an equality. For example, given <code class=\"language-plaintext highlighter-rouge\">s :: tinyint</code>:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CAST(s AS double) =  double '1.1'  ⟺  if(s is null, null, false)    \nCAST(s AS double) &lt;&gt; double '1.1'  ⟺  if(s is null, null, true)\n</code></pre></div></div>\n\n<p>When some values in <code class=\"language-plaintext highlighter-rouge\">T</code> are not representable in <code class=\"language-plaintext highlighter-rouge\">S</code>, the cast between <code class=\"language-plaintext highlighter-rouge\">T → S</code> will generally either truncate\nor round. The SQL specification doesn’t mandate which of those alternatives an implementation should follow,\nand even allows that to vary for conversions between various combinations of types.</p>\n\n<p>This throws a bit of a wrench in our plans, so to speak. If we can’t tell whether a cast will round or truncate,\nhow would we know whether a <code class=\"language-plaintext highlighter-rouge\">&gt;</code> comparison should turn into a <code class=\"language-plaintext highlighter-rouge\">&gt;</code> or <code class=\"language-plaintext highlighter-rouge\">&gt;=</code> in the resulting expression? To \nillustrate, let’s consider this example. Given <code class=\"language-plaintext highlighter-rouge\">s :: tinyint</code>:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>CAST(s AS double) &gt; double '1.9'\n</code></pre></div></div>\n\n<p>If the conversion from <code class=\"language-plaintext highlighter-rouge\">double</code> → <code class=\"language-plaintext highlighter-rouge\">tinyint</code> truncates, the expression above is equivalent to:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>s &gt; tinyint '1'\n</code></pre></div></div>\n\n<p>On the other hand, if the conversion rounds, <code class=\"language-plaintext highlighter-rouge\">1.9</code> becomes <code class=\"language-plaintext highlighter-rouge\">2</code>, and the expression is equivalent to:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>s &gt;= tinyint '2'              \n</code></pre></div></div>\n\n<p>In order to know which operator to use in the transformed expression (e.g., <code class=\"language-plaintext highlighter-rouge\">&gt;</code> vs <code class=\"language-plaintext highlighter-rouge\">&gt;=</code>), it is therefore \ncrucial to distinguish between those two behaviors. The good news is that there’s a simple and elegant way\nout of this hole.</p>\n\n<p>An important observation is that we don’t need to know how the conversion behaves <em>in general</em>, but only how \nit behaves when applied to the constant <code class=\"language-plaintext highlighter-rouge\">t</code>. Regardless of whether the conversion truncates or rounds, for a \ngiven value of <code class=\"language-plaintext highlighter-rouge\">t</code>, the outcome can be seen to <em>round up</em> or <em>round down</em>, as depicted below.</p>\n\n<table>\n  <tbody>\n    <tr>\n      <td><img src=\"/assets/blog/optimizing-casts/round-down.svg\" alt=\"\" /></td>\n      <td><img src=\"/assets/blog/optimizing-casts/round-up.svg\" alt=\"\" /></td>\n    </tr>\n  </tbody>\n</table>\n\n<p>We can easily tell which of those scenarios applies by comparing <code class=\"language-plaintext highlighter-rouge\">t</code> with <code class=\"language-plaintext highlighter-rouge\">t'</code>: if <code class=\"language-plaintext highlighter-rouge\">t &gt; t'</code>, the operation rounded\ndown. Conversely, if <code class=\"language-plaintext highlighter-rouge\">t &lt; t'</code>, it rounded up. If <code class=\"language-plaintext highlighter-rouge\">t = t'</code>, the value is representable in <code class=\"language-plaintext highlighter-rouge\">S</code>, and the rules from the \nprevious section apply.</p>\n\n<h1 id=\"oh-the-nullability\">Oh, the nullability</h1>\n\n<p>Let’s take another quick detour and talk about the issue of nullability. After all, no discussion about\nSQL is complete without an exploration of the semantics of <code class=\"language-plaintext highlighter-rouge\">null</code>.</p>\n\n<p>SQL uses <a href=\"https://en.wikipedia.org/wiki/Three-valued_logic#Application_in_SQL\">three-valued logic</a>. In addition\nto <code class=\"language-plaintext highlighter-rouge\">true</code> and <code class=\"language-plaintext highlighter-rouge\">false</code>, logical expressions can evaluate to an <em>unknown</em> value, which is indicated by <code class=\"language-plaintext highlighter-rouge\">null</code>.\nLogical operations <code class=\"language-plaintext highlighter-rouge\">AND</code> and <code class=\"language-plaintext highlighter-rouge\">OR</code> behave according to the following rules:</p>\n\n\\[\\begin{array}{|c|c|c|c|}\n\\hline\n\\text{A} &amp; \\text{B} &amp; \\text{A and B} &amp; \\text{A or B} \\\\ \n\\hline\n\\text{true}&amp; \\text{null} &amp; \\text{null} &amp; \\text{true} \\\\ \n\\hline\n\\text{false}&amp; \\text{null} &amp; \\text{false} &amp; \\text{null} \\\\ \n\\hline\n\\end{array}\\]\n\n<p>The logical comparison operators =, &lt;&gt;, &gt;, ≥, &lt;, ≤ evaluate to <code class=\"language-plaintext highlighter-rouge\">null</code> when one or both operands are <code class=\"language-plaintext highlighter-rouge\">null</code>.\nHence, if <code class=\"language-plaintext highlighter-rouge\">t</code> is <code class=\"language-plaintext highlighter-rouge\">null</code>, our expression <code class=\"language-plaintext highlighter-rouge\">cast(s as smallint) = t</code> can be simply replaced with a constant <code class=\"language-plaintext highlighter-rouge\">null</code>.</p>\n\n<p>As we mentioned in the previous section, there are cases where <code class=\"language-plaintext highlighter-rouge\">cast(s as smallint) = t</code> can be reduced to \n<code class=\"language-plaintext highlighter-rouge\">true</code> or <code class=\"language-plaintext highlighter-rouge\">false</code>, <em>except</em> for the fact that if <code class=\"language-plaintext highlighter-rouge\">s</code> is null, the expression needs to return <code class=\"language-plaintext highlighter-rouge\">null</code> to preserve\nsemantics. So, we use the following forms to capture this:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>if(s IS null, null, false)\nif(s IS null, null, true)\n</code></pre></div></div>\n\n<p>The catch with that is that the optimizer does not understand the semantics of these <code class=\"language-plaintext highlighter-rouge\">if</code> expressions and cannot \nuse them for deriving additional properties. In essence, it becomes an optimization barrier. On the other hand,\nthe optimizer is pretty good at manipulating logical conjunctions (<code class=\"language-plaintext highlighter-rouge\">AND</code>) and disjunctions (<code class=\"language-plaintext highlighter-rouge\">OR</code>). So, let’s see \nhow we can use boolean logic to obtain an equivalent formulation.</p>\n\n<p>We can exploit the properties of SQL boolean logic to derive expressions that behave in the same manner as the \n<code class=\"language-plaintext highlighter-rouge\">if()</code> constructs from above:</p>\n\n\\[\\begin{align}\n    \\text{if}(s \\text{ is null}, \\text{null}, \\text{false}) &amp; \\iff (s \\text{ is null}) \\text{ and null} \\\\\n    \\text{if}(s \\text{ is null}, \\text{null}, \\text{true})  &amp; \\iff (s \\text{ is not null}) \\text{ or null} \\\\\n\\end{align}\\]\n\n<p>Let’s break it down to see why that works.</p>\n\n\\[\\begin{align}         \n   \\text{if}(s \\text{ is null}, \\text{null}, \\text{false}) &amp; = (s \\text{ is null}) \\text{ and null} \\\\ \n      &amp; = \\begin{cases}\n             \\text{true and null}  &amp; = \\text{null},   &amp; \\text{if } s \\text{ is null} \\\\\n             \\text{false and null} &amp; = \\text{false},  &amp; \\text{if } s \\text{ is not null} \n          \\end{cases} \\\\[5pt]\n   \\text{if}(s \\text{ is null}, \\text{null}, \\text{true})  &amp; = (s \\text{ is not null}) \\text{ or null} \\\\\n      &amp; = \\begin{cases}\n              \\text{false or null}  &amp; = \\text{null},   &amp; \\text{if } s \\text{ is null} \\\\\n              \\text{true or null}   &amp; = \\text{true},   &amp; \\text{if } s \\text{ is not null} \n           \\end{cases}\n\\end{align}\\]\n\n<h1 id=\"putting-it-all-together\">Putting it all together</h1>\n\n<p>Now that we’ve had a taste of how this optimization works, let’s put it all together into one rule to rule\nthem all.</p>\n\n<p>Given an expression of the following form,</p>\n\n\\[\\cast{S}{T}(s) \\otimes t \\quad s \\in S, t \\in T, \\otimes \\in [=, \\ne, &lt;, \\le, &gt;, \\ge]\\]\n\n<p>we derive a transformation based on the rules below.</p>\n\n<ol>\n  <li>If \\(t \\text{ is null} \\Rightarrow \\cast{S}{T}(s) \\otimes t \\iff \\text{null} \\tag{1}\\) \\(\\\\[5pt]\\)</li>\n  <li>If \\(\\exists s' \\in S \\ldotp s' = \\cast{T}{S}(t)\\), we calculate \\(t' = \\cast{S}{T}(s')\\) and consider \nthe following cases:\n    <ol>\n      <li><a name=\"2.1\"></a> If \\(t = t' \\Rightarrow \\cast{S}{T}(s) \\otimes t \\iff s \\otimes \\cast{T}{S}(t) \\tag{2.1}\\) \\(\\\\[5pt]\\)\n        <ul>\n          <li><a name=\"2.1.1\"></a> In the special case where \\(\\\\[5pt]\\) \\(\\quad  s' = \\text{min}_S  \\Rightarrow   \n \\left\\{\n  \\begin{array}{@{}ll@{}}\n \\cast{S}{T}(s) &gt; t   &amp; \\iff s \\ne \\text{min}_{S}     \\\\\n \\cast{S}{T}(s) \\ge t &amp; \\iff \\trueOrNull{s}           \\\\\n \\cast{S}{T}(s) &lt;   t &amp; \\iff \\falseOrNull{s}          \\\\\n \\cast{S}{T}(s) \\le t &amp; \\iff s = \\text{min}_{S}\n  \\end{array}\\right. \\tag{2.1.1}  \\\\[5pt]\\)</li>\n          <li><a name=\"2.1.2\"></a> In the special case where \\(\\\\[5pt]\\) \\(\\quad s' = \\text{max}_S  \\Rightarrow \n \\left\\{\n  \\begin{array}{@{}ll@{}}\n\\cast{S}{T}(s) &gt; t   &amp; \\iff \\falseOrNull{s}        \\\\\n\\cast{S}{T}(s) \\ge t &amp; \\iff s = \\text{max}_{S}     \\\\\n\\cast{S}{T}(s) &lt;   t &amp; \\iff s \\ne \\text{max}_{S}   \\\\\n\\cast{S}{T}(s) \\le t &amp; \\iff \\trueOrNull{s}\n  \\end{array}\\right. \\tag{2.1.2} \\\\[5pt]\\)</li>\n        </ul>\n      </li>\n      <li>\n        <p>Otherwise, \\(\\\\[5pt]\\) \\(\\quad  t \\ne t' \\Rightarrow \n \\left\\{\n  \\begin{array}{@{}ll@{}}\n   \\cast{S}{T}(s) = t   &amp; \\iff \\falseOrNull{s}        \\\\\n   \\cast{S}{T}(s) \\ne t &amp; \\iff \\trueOrNull{s}            \n  \\end{array}\\right. \\tag{2.2} \\\\[5pt]\\)</p>\n\n        <ul>\n          <li>\n            <p>Further, if \\(\\\\[5pt]\\) \\(\\quad \\quad  t &lt; t' \\Rightarrow \n \\left\\{\n  \\begin{array}{@{}ll@{}}\n\\cast{S}{T}(s) &gt; t   &amp; \\iff s \\ge \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) \\ge t &amp; \\iff s \\ge \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) &lt;   t &amp; \\iff s &lt;  \\cast{T}{S}(t)     \\\\\n\\cast{S}{T}(s) \\le t &amp; \\iff s &lt;  \\cast{T}{S}(t)\n  \\end{array}\\right. \\tag{2.2.1} \\\\[5pt]\\)<br />\n In the special case where \\(\\\\[5pt]\\) \\(\\quad \\quad s' = \\text{max}_S  \\Rightarrow  \n \\left\\{\n  \\begin{array}{@{}ll@{}}\n\\cast{S}{T}(s) &gt; t   &amp; \\iff s = \\text{max}_{S}    \\\\\n\\cast{S}{T}(s) \\ge t &amp; \\iff s = \\text{max}_{S}    \\\\\n  \\end{array}\\right. \\\\[5pt] \\tag{2.2.1.1}\\)</p>\n          </li>\n          <li>\n            <p>Otherwise, if \\(\\\\[5pt]\\) \\(\\quad \\quad  t &gt; t' \\Rightarrow\n \\left\\{\n  \\begin{array}{@{}ll@{}}\n\\cast{S}{T}(s) &gt; t   &amp; \\iff s &gt;    \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) \\ge t &amp; \\iff s &gt;    \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) &lt;   t &amp; \\iff s \\le  \\cast{T}{S}(t)    \\\\\n\\cast{S}{T}(s) \\le t &amp; \\iff s \\le  \\cast{T}{S}(t)\n  \\end{array}\\right. \\\\[5pt] \\tag{2.2.2}\\)<br />\n In the special case where \\(\\\\[5pt]\\) \\(\\quad \\quad s' = \\text{min}_S  \\Rightarrow  \n  \\left\\{\n  \\begin{array}{@{}ll@{}}\n\\cast{S}{T}(s) &lt;   t &amp; \\iff s = \\text{min}_{S}    \\\\\n\\cast{S}{T}(s) \\le t &amp; \\iff s = \\text{min}_{S}\n \\end{array}\\right. \\\\[5pt] \\tag{2.2.2.1}\\)</p>\n          </li>\n        </ul>\n      </li>\n    </ol>\n  </li>\n  <li>If \\(\\cast{T}{S}\\) is undefined or \\(\\cast{T}{S}(t)\\) fails, \\(\\\\[5pt]\\) \\(t &lt; \\cast{S}{T}(\\text{min}_S) \\Rightarrow  \n  \\left\\{\n \\begin{array}{@{}ll@{}}\n         \\cast{S}{T}(s) =   t &amp; \\iff \\falseOrNull{s}    \\\\\n         \\cast{S}{T}(s) \\ne t &amp; \\iff \\trueOrNull{s}     \\\\\n         \\cast{S}{T}(s) &lt;   t &amp; \\iff \\falseOrNull{s}    \\\\\n         \\cast{S}{T}(s) \\le t &amp; \\iff \\falseOrNull{s}    \\\\\n         \\cast{S}{T}(s) &gt;   t &amp; \\iff \\trueOrNull{s}     \\\\\n         \\cast{S}{T}(s) \\ge t &amp; \\iff \\trueOrNull{s}     \n\\end{array}\\right. \\\\[5pt] \\tag{3.1}\\)\n\\(t = \\cast{S}{T}(\\text{min}_S) \\Rightarrow  \n  \\left\\{\n \\begin{array}{@{}ll@{}}\n         \\cast{S}{T}(s) =   t &amp; \\iff s = \\text{min}_S       \\\\\n         \\cast{S}{T}(s) \\ne t &amp; \\iff s &gt; \\text{min}_S       \\\\\n         \\cast{S}{T}(s) &lt;   t &amp; \\iff \\falseOrNull{s}        \\\\\n         \\cast{S}{T}(s) \\le t &amp; \\iff s = \\text{min}_S       \\\\\n         \\cast{S}{T}(s) &gt;   t &amp; \\iff s &gt; \\text{min}_S       \\\\\n         \\cast{S}{T}(s) \\ge t &amp; \\iff \\trueOrNull{s}     \n\\end{array}\\right. \\\\[5pt] \\tag{3.2}\\)\n\\(t &gt; \\cast{S}{T}(\\text{max}_S) \\Rightarrow  \n  \\left\\{\n    \\begin{array}{@{}ll@{}}\n            \\cast{S}{T}(s) =   t &amp; \\iff \\falseOrNull{s}    \\\\\n            \\cast{S}{T}(s) \\ne t &amp; \\iff \\trueOrNull{s}     \\\\\n            \\cast{S}{T}(s) &lt;   t &amp; \\iff \\trueOrNull{s}     \\\\\n            \\cast{S}{T}(s) \\le t &amp; \\iff \\trueOrNull{s}     \\\\\n            \\cast{S}{T}(s) &gt;   t &amp; \\iff \\falseOrNull{s}    \\\\\n            \\cast{S}{T}(s) \\ge t &amp; \\iff \\falseOrNull{s}    \n   \\end{array}\\right. \\\\[5pt] \\tag{3.3}\\)\n\\(t = \\cast{S}{T}(\\text{max}_S) \\Rightarrow  \n \\left\\{\n   \\begin{array}{@{}ll@{}}\n           \\cast{S}{T}(s) =   t &amp; \\iff s = \\text{max}_S   \\\\\n           \\cast{S}{T}(s) \\ne t &amp; \\iff s &lt; \\text{max}_S   \\\\\n           \\cast{S}{T}(s) &lt;   t &amp; \\iff s &lt; \\text{max}_S   \\\\\n           \\cast{S}{T}(s) \\le t &amp; \\iff \\trueOrNull{s}     \\\\\n           \\cast{S}{T}(s) &gt;   t &amp; \\iff \\falseOrNull{s}    \\\\\n           \\cast{S}{T}(s) \\ge t &amp; \\iff s = \\text{max}_S       \n  \\end{array}\\right. \\\\[5pt] \\tag{3.4}\\) <br />\n Otherwise, the transformation is not applicable.</li>\n</ol>\n\n<h1 id=\"omgwtfnan\">OMGWTFNaN</h1>\n\n<p>As if all of this weren’t enough, there’s an additional complication we need to handle for types such\nas <code class=\"language-plaintext highlighter-rouge\">real</code> and <code class=\"language-plaintext highlighter-rouge\">double</code>. Those types are what the SQL specification calls <em>approximate numeric</em> types.\nPresto implements them as <a href=\"https://en.wikipedia.org/wiki/IEEE_754\">IEEE-754</a> single and double \nprecision floating point numbers, respectively.</p>\n\n<p>In addition to finite numbers, IEEE-754 defines an additional set of values: <code class=\"language-plaintext highlighter-rouge\">∞</code> and <code class=\"language-plaintext highlighter-rouge\">NaN</code> (not a number).\nIt is worth noting that <code class=\"language-plaintext highlighter-rouge\">-∞</code> and <code class=\"language-plaintext highlighter-rouge\">+∞</code> do not behave like <code class=\"language-plaintext highlighter-rouge\">∞</code> in the mathematical sense. They are actual values\nin the ordered set of numbers, but they don’t represent any finite number. Therefore, the following relations hold:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>-∞ &lt; -1.23E30 &lt; 0 &lt; 3.45E25 &lt; +∞\n-∞ = -∞\n+∞ = +∞ \n</code></pre></div></div>\n\n<p>Since <code class=\"language-plaintext highlighter-rouge\">-∞</code> and <code class=\"language-plaintext highlighter-rouge\">+∞</code> can be treated as regular values, we can use them as the minimum and maximum values of the range\nfor these types. Any other choice would not work, since all values of a type must be contained within the range of the type\nfor the transformation to be valid. That is,</p>\n\n\\[\\forall v \\in T \\quad T_{\\text{min}} \\le v \\le T_{\\text{max}}\\]\n\n<p>Let’s look at an example to understand why this is necessary. Instead of using \\([-∞, ∞]\\) as the range, \nlet’s say we picked the minimum and maximum representable values for the <code class=\"language-plaintext highlighter-rouge\">real</code> type (-3.4028235E38 and 3.4028235E38), and\nconsider this expression (<code class=\"language-plaintext highlighter-rouge\">s :: real</code>):</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>cast(s AS double) &gt;= double '3.4028235E38'\n</code></pre></div></div>\n\n<p>From the rules in the previous section, \\(t = 3.4028235\\text{E}38\\), \\(s'= 3.4028235\\text{E}38\\) and \\(t' = 3.4028235E38\\). Since \n\\(t = t'\\) and \\(s' = max_S\\), from <a href=\"#2.1.2\">rule 2.1.2</a>, the expression reduces to:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>s = 3.4028235E38 \n</code></pre></div></div>\n\n<p>This is clearly incorrect. When <code class=\"language-plaintext highlighter-rouge\">s = Infinity</code>, <code class=\"language-plaintext highlighter-rouge\">cast(s AS double)</code> results in <code class=\"language-plaintext highlighter-rouge\">double 'Infinity'</code>, which is not equal\nto 3.4028235E38.</p>\n\n<p>On the other hand, <code class=\"language-plaintext highlighter-rouge\">NaN</code> doesn’t obey any of the comparison rules. It’s neither equal nor distinct from itself, and\nit’s neither larger, nor smaller than any other value:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>NaN =  NaN  ⟺  false  \nNaN &lt;&gt; NaN  ⟺  false\nNaN &gt; 0     ⟺  false\nNaN = 0     ⟺  false\nNaN &lt; 0     ⟺  false\n</code></pre></div></div>\n\n<p>So, <code class=\"language-plaintext highlighter-rouge\">NaN</code> is not part of the ordered set of values for these types, and the requirement that every value be contained \nin the range doesn’t hold. From <a href=\"#2.1.1\">rule 2.1.1</a>, an expression such as:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>cast(s AS double) &gt;= double '-Infinity'\n</code></pre></div></div>\n\n<p>reduces to <code class=\"language-plaintext highlighter-rouge\">if(s is null, null, true)</code>, which is incorrect, since the expression returns <code class=\"language-plaintext highlighter-rouge\">false</code> when <code class=\"language-plaintext highlighter-rouge\">s</code> is <code class=\"language-plaintext highlighter-rouge\">NaN</code>.</p>\n\n<p>Is all hope lost for <code class=\"language-plaintext highlighter-rouge\">real</code> and <code class=\"language-plaintext highlighter-rouge\">double</code>? Fortunately, not. The range is only needed as an optimization. If we\nforgo defining a range for types that don’t have the required properties, the special cases <a href=\"#2.1.1\">2.1.1</a> and \n<a href=\"#2.1.2\">2.1.2</a> don’t apply, and by <a href=\"#2.1\">rule 2.1</a>, the expression is equivalent to:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>s &gt;= real '-Infinity'\n</code></pre></div></div>\n\n<p>which correctly returns <code class=\"language-plaintext highlighter-rouge\">false</code> when <code class=\"language-plaintext highlighter-rouge\">s</code> is <code class=\"language-plaintext highlighter-rouge\">NaN</code>.</p>\n\n<h1 id=\"-show-me-the-money\"><a name=\"results\"></a> Show me the money!</h1>\n\n<p>So, does all of this even matter? Why, yes! Glad you asked.</p>\n\n<p>As with any performance optimization, you can improve things by working smarter (can you avoid work that can be \nproven to be unnecessary) or by working harder (can you do the work you have to do more efficiently). This\noptimization does a little of both. Let’s consider three scenarios when it has a positive effect.</p>\n\n<h4 id=\"dead-code\">Dead code</h4>\n\n<p>Since in some cases it can prove that the comparisons will always produce <code class=\"language-plaintext highlighter-rouge\">false</code>, regardless of the input,\nit can short-circuit entire conditions or subplans before even a single row of data is read. Some query generation \ntools are not sophisticated enough and may emit queries that contain that kind of construct. Also, everyone makes\nmistakes, and it’s not hard to end up with queries that contain what’s effectively <em>dead code</em>.  The last thing you\nwant is to sit in front of the screen waiting for a query to complete … waiting … waiting … just for Presto\nto tell you <code class=\"language-plaintext highlighter-rouge\">¯\\_(ツ)_/¯</code>.</p>\n\n<p>For example, given:</p>\n\n<div class=\"language-sql highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code><span class=\"k\">CREATE</span> <span class=\"k\">TABLE</span> <span class=\"n\">t</span><span class=\"p\">(</span><span class=\"n\">x</span> <span class=\"nb\">smallint</span><span class=\"p\">);</span>\n\n<span class=\"c1\">-- &lt;insert lots of rows into t&gt; --</span>\n</code></pre></div></div>\n\n<div class=\"language-sql highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code><span class=\"k\">SELECT</span> <span class=\"o\">*</span> \n<span class=\"k\">FROM</span> <span class=\"n\">t</span> \n<span class=\"k\">WHERE</span> <span class=\"n\">x</span> <span class=\"k\">IS</span> <span class=\"k\">NOT</span> <span class=\"k\">NULL</span> <span class=\"k\">AND</span> <span class=\"n\">x</span> <span class=\"o\">&gt;</span> <span class=\"mi\">1000000</span> \n</code></pre></div></div>\n\n<p>Produces the following query plan (<code class=\"language-plaintext highlighter-rouge\">Values</code> is an empty inline table):</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>- Output[x]\n  - Values\n</code></pre></div></div>\n\n<h4 id=\"improved-join-performance\">Improved JOIN performance</h4>\n\n<p>What’s nice about this optimization is that it <em>enables</em> other optimizations to work better. We mentioned earlier\nthat comparisons that are not simple expressions between columns, or between columns and constants, make it harder for the\npredicate pushdown optimization to infer predicates that can be propagated to the other branch of a join.</p>\n\n<p>Given two tables:</p>\n\n<div class=\"language-sql highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code><span class=\"k\">CREATE</span> <span class=\"k\">TABLE</span> <span class=\"n\">t1</span> <span class=\"p\">(</span><span class=\"n\">v</span> <span class=\"nb\">smallint</span><span class=\"p\">);</span>\n<span class=\"k\">CREATE</span> <span class=\"k\">TABLE</span> <span class=\"n\">t2</span> <span class=\"p\">(</span><span class=\"n\">v</span> <span class=\"nb\">bigint</span><span class=\"p\">);</span>\n</code></pre></div></div>\n\n<p>And the following query:</p>\n\n<div class=\"language-sql highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code><span class=\"k\">SELECT</span> <span class=\"o\">*</span>\n<span class=\"k\">FROM</span> <span class=\"n\">t1</span> <span class=\"k\">JOIN</span> <span class=\"n\">t2</span> <span class=\"k\">ON</span> <span class=\"n\">t1</span><span class=\"p\">.</span><span class=\"n\">v</span> <span class=\"o\">=</span> <span class=\"n\">t2</span><span class=\"p\">.</span><span class=\"n\">v</span>\n<span class=\"k\">WHERE</span> <span class=\"n\">t1</span><span class=\"p\">.</span><span class=\"n\">v</span> <span class=\"o\">=</span> <span class=\"nb\">BIGINT</span> <span class=\"s1\">'1'</span><span class=\"p\">;</span>\n</code></pre></div></div>\n\n<p>The query plan without this optimization is:</p>\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>- Output[name]\n  - InnerJoin[expr = v]\n    - ScanFilterProject[t1, filter = CAST(v AS bigint) = BIGINT '1']\n        expr := CAST(v AS bigint)\n    - TableScan[t2]\n</code></pre></div></div>\n\n<p>The optimization allows the predicate pushdown logic to apply the condition to the other side of the join, producing\na much better plan. If data in <code class=\"language-plaintext highlighter-rouge\">t1</code> and <code class=\"language-plaintext highlighter-rouge\">t2</code> is somehow organized by <code class=\"language-plaintext highlighter-rouge\">v</code> (e.g., a partition key in Hive), or if the\nconnector understands how to apply the filter at the source, the query won’t need to even read certain parts of the\ntable. The query plan with the optimization enabled:</p>\n\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>- Output[name]\n  - CrossJoin\n    - ScanFilterProject[t1, filter = (v = SMALLINT '1')]\n    - ScanFilterProject[t2, filter = (v = BIGINT '1')]\n</code></pre></div></div>\n\n<h4 id=\"best-bang-for-the-buck\">Best bang for the buck</h4>\n\n<p>Finally, if the condition absolutely needs to be evaluated, the transformed expression could be significantly\nmore efficient, especially when the cast between the two types is expensive. To illustrate, given a table\nwith 1 billion rows and a column <code class=\"language-plaintext highlighter-rouge\">k :: bigint</code>:</p>\n\n<div class=\"language-sql highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code><span class=\"k\">SELECT</span> <span class=\"n\">count_if</span><span class=\"p\">(</span><span class=\"n\">k</span> <span class=\"o\">&gt;</span> <span class=\"k\">CAST</span><span class=\"p\">(</span><span class=\"mi\">0</span> <span class=\"k\">as</span> <span class=\"nb\">decimal</span><span class=\"p\">(</span><span class=\"mi\">19</span><span class=\"p\">))</span> \n<span class=\"k\">FROM</span> <span class=\"n\">t</span>\n</code></pre></div></div>\n\n<p>Without the optimization:</p>\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>- [...]\n    - ScanProject\n===&gt;    CPU: 3.75m (66.34%), Scheduled: 5.56m (145.22%)\n        expr := (CAST(\"k\" AS decimal(19,0)) &gt; CAST(DECIMAL '0' AS decimal(19,0)))\n        \n        \nQuery 20190515_072240_00006_rgzb4, FINISHED, 4 nodes\nSplits: 110 total, 110 done (100.00%)\n0:22 [1000M rows, 8.4GB] [46M rows/s, 395MB/s]\n</code></pre></div></div>\n\n<p>With the optimization:</p>\n<div class=\"language-plaintext highlighter-rouge\"><div class=\"highlight\"><pre class=\"highlight\"><code>- [...]\n    - ScanProject\n===&gt;    CPU: 29.93s (58.17%), Scheduled: 47.44s (145.07%)\n        expr := (\"k\" &gt; BIGINT '0')\n        \n        \nQuery 20190515_071912_00005_bz6cb, FINISHED, 4 nodes\nSplits: 110 total, 110 done (100.00%)\n0:03 [1000M rows, 8.4GB] [335M rows/s, 2.81GB/s]        \n</code></pre></div></div>\n\n<p>Thirsty for more? Here’s the <a href=\"https://github.com/trinodb/trino/blob/master/presto-main/src/main/java/io/prestosql/sql/planner/iterative/rule/UnwrapCastInComparison.java\">code</a>. \nHappy querying!</p>\n\n<p><em>Many thanks to <a href=\"https://github.com/kasiafi\">kasiafi</a> for their thoughtful and thorough feedback on early\ndrafts of this post.</em></p>"
---

The next release of Presto (version 312) will include a new optimization to remove unnecessary casts 
which might have been added implicitly by the query planner or explicitly by users when they wrote the query.
This is a long post explaining how the optimization works. If you’re only interested in the results,
skip to the last section. For the full details, read on!
Like many programming languages, SQL allows certain operations between values of different 
types if there are implicit conversions (a.k.a., implicit casts or coercions) between those types.
This improves usability, as it allows writing expressions like 1.5 > 2 without worrying too much
whether the types are compatible (1.5 is of type decimal(2,1), while 2 is an integer).
During query analysis and planning, Presto introduces explicit casts for any implicit conversion in the
original query as it translates it into the intermediate query plan representation the engine uses 
internally for optimization and execution. This eliminates a layer of complexity for the optimizer, 
which, as a result, doesn’t need to reason about types (type inference) or worry about whether expressions 
are properly typed.
More importantly, it simplifies the job of defining and implementing operators (e.g., >, <, =, etc). 
Without implicit conversions, there would need to exist a variant of every operator for every combination
 of compatible types. For example, it would be necessary to have an implementation of the = operator for 
 (tinyint, tinyint), (tinyint, smallint), (tinyint, integer), 
(tinyint, bigint), (smallint, integer), and so on.
Given two columns, s :: tinyint and t :: smallint, and an expression such as s = t, the planner 
determines that tinyint can be implicitly coerced to smallint and derives the following expression:

CAST(s AS smallint) = t   


This is not without challenges. The predicate pushdown logic relies on simple equality and 
range comparisons to move predicates around, and importantly, to infer that certain predicates
in one branch of a join can be used to constrain the values on the other side of the join. An
expression like the one above is not “simple” from this perspective due to the type conversion 
involved, and it can defeat the (arguably simplistic) predicate inference algorithm.
Secondly, if t is a constant (or an expression that is effectively constant), the engine has to 
convert every value of s it sees during query execution in order to compare it with t. This 
brings up the obvious question: “can’t it somehow convert t to tinyint and compare directly”?
It would look like:

s = CAST(t AS tinyint)


Since t is a constant, the term CAST(t AS tinyint) can be trivially pre-computed and reused 
for the entire query. It’s not that simple in the general case, though. Narrowing cast, such 
as a conversion from smallint to tinyint, or from double to integer can fail or alter
the value due to rounding or truncation, so we must take special care to avoid errors or 
change query semantics. We discuss this at length in the sections below.
Some properties of (well-behaved) implicit casts
Let’s take a short detour and talk briefly about some properties of well-behaved implicit 
casts we can exploit to do the transformation we described in the previous section.
Since the query engine is free to insert implicit casts wherever it sees fit, these functions
need to follow some ground rules. Failure to do so can result in queries producing incorrect
results due to changes in query semantics.
Implicit casts need to have the following properties:
Injective. Given \(\cast{S}{T}\) every value in S 
must map to a distinct value in T (this does not imply that every value in T has to map to a value 
in S, though).
Order-preserving. Given \(s_1 \in S\) and \(s_2 \in S\),
For exact numeric types (e.g., smallint, integer, decimal, etc.), this holds as long as 
T has enough integer digits to hold the integral part of S and enough fractional digits to 
hold the fractional part of S.
As an example, the picture below depicts how every value of type tinyint, which has a range
of \([-128, 127]\), maps to a distinct value of a wider type such as smallint. Also, every value 
of the wider type that is within the range of representable values of tinyint has a distinct 
mapping to a tinyint. So, for the values within the tinyint range, the tinyint → smallint
conversion is bijective. This is not necessary for the 
transformation to work, but it simplifies one of the cases we’ll consider. We’ll cover this more later.

On the other hand, some conversions such as those between integer types and decimal types with fractional
parts are injective but not bijective, even when excluding the values outside the range of the narrower
 type.

The properties clearly hold for tinyint → smallint → integer → biginteger. They also hold for:
tinyint → decimal(3,0) → decimal(4,1) → decimal(5,2) → …
smallint → decimal(5,0) → decimal(6,1) → decimal(7,2) → …
integer → decimal(10,0) → decimal(11,1) → …
bigint → decimal(19,0) → decimal(20, 1) → …
It even works for conversions between exact and approximate numbers, such as:
smallint → real
real → double
integer → double
It does not work for bigint → double, integer → real, or decimal → double when precision is large
because not all bigints fit in a double (64 bits vs 53-bit mantissa) and not all integers fit in a real 
(32 bits vs 23-bit mantissa). Sadly, for legacy reasons Presto allows those conversions implicitly. We “justify” 
it with the argument that “since they are dealing with approximate numerics anyway, and given the conversions only 
lose precision in the least significant part, they are sort of ok”. This is something we’ll revisit in the
future once we have a reasonable story around dealing with inherent break in backward-compatibility
of removing such conversions.
Finally, the properties also apply for varchar to varchar conversions:
varchar(0) → varchar(1) → varchar(2) → … → varchar
Getting to the point…
With this in mind, let’s look at the simplest scenario: conversions between integer types.
As in the example we covered in the introduction, the transformation is straightforward 
when the constant can be represented in the narrower type. Given s :: tinyint:

CAST(s AS smallint) = smallint '1'     ⟺  s = tinyint '1'
CAST(s AS smallint) = smallint '127'   ⟺  s = tinyint '127'
CAST(s AS smallint) = smallint '-128'  ⟺  s = tinyint '-128'

CAST(s AS smallint) > smallint '10'    ⟺  s > tinyint '10'
CAST(s AS smallint) < smallint '10'    ⟺  s < tinyint '10'


Of course, when the value is at the edge of the range of the narrower type, we can cleverly 
turn some inequalities into equalities:

CAST(s AS smallint) >= smallint '127'   ⟺  s >= tinyint '127'  
                                        ⟺  s =  tinyint '127'
                                       
CAST(s AS smallint) <= smallint '-128'  ⟺  s <= tinyint '-128'  
                                        ⟺  s =  tinyint '-128'


Additionally, we may be able to tell that an expression is always true or false. Special
care needs to be taken when the value is null, though, since in SQL any comparison with null 
yields null:

CAST(s AS smallint) > smallint '127'    ⟺  s > tinyint '127'  
                                        ⟺  if(s is null, null, false)
                                        
CAST(s AS smallint) <= smallint '127'   ⟺  s <= tinyint '127'  
                                        ⟺  if(s is null, null, true)

CAST(s AS smallint) < smallint '-128'   ⟺  s < tinyint '-128'  
                                        ⟺  if(s is null, null, false)
                                        
CAST(s AS smallint) >= smallint '-128'  ⟺  s >= tinyint '-128'  
                                        ⟺  if(s is null, null, true)


We can make similar inferences when the value is outside the range of possible values
for tinyint. For equality comparisons, it’s trivial.

CAST(s AS smallint) = smallint '1000'  ⟺  if(s is null, null, false)    


Conversely,

CAST(s AS smallint) <> smallint '1000'  ⟺  if(s is null, null, true)


Just like the earlier cases involving comparisons with values at the edge of the range,
we can apply the same idea when the value falls outside of the range:

CAST(s AS smallint) < smallint '1000'   ⟺  if(s is null, null, true) 
CAST(s AS smallint) < smallint '-1000'  ⟺  if(s is null, null, false)

CAST(s AS smallint) > smallint '1000'   ⟺  if(s is null, null, false) 
CAST(s AS smallint) > smallint '-1000'  ⟺  if(s is null, null, true)


Unrepresentable values
Values that are outside the range of the narrower type may not be the only ones without a mapping. 
For example, for a type such as decimal(2,1), any value with a fractional part (e.g., 1.5, 2.3) cannot 
be represented as a tinyint.
We can tell whether a value t in T is representable in S by converting it to S and back to T. We’ll 
call this value t'.
If t <> t', t is not representable in S, and similar rules as for out-of-range values apply when the 
expression involves an equality. For example, given s :: tinyint:

CAST(s AS double) =  double '1.1'  ⟺  if(s is null, null, false)    
CAST(s AS double) <> double '1.1'  ⟺  if(s is null, null, true)


When some values in T are not representable in S, the cast between T → S will generally either truncate
or round. The SQL specification doesn’t mandate which of those alternatives an implementation should follow,
and even allows that to vary for conversions between various combinations of types.
This throws a bit of a wrench in our plans, so to speak. If we can’t tell whether a cast will round or truncate,
how would we know whether a > comparison should turn into a > or >= in the resulting expression? To 
illustrate, let’s consider this example. Given s :: tinyint:

CAST(s AS double) > double '1.9'


If the conversion from double → tinyint truncates, the expression above is equivalent to:

s > tinyint '1'


On the other hand, if the conversion rounds, 1.9 becomes 2, and the expression is equivalent to:

s >= tinyint '2'              


In order to know which operator to use in the transformed expression (e.g., > vs >=), it is therefore 
crucial to distinguish between those two behaviors. The good news is that there’s a simple and elegant way
out of this hole.
An important observation is that we don’t need to know how the conversion behaves in general, but only how 
it behaves when applied to the constant t. Regardless of whether the conversion truncates or rounds, for a 
given value of t, the outcome can be seen to round up or round down, as depicted below.

      
    
We can easily tell which of those scenarios applies by comparing t with t': if t > t', the operation rounded
down. Conversely, if t < t', it rounded up. If t = t', the value is representable in S, and the rules from the 
previous section apply.
Oh, the nullability
Let’s take another quick detour and talk about the issue of nullability. After all, no discussion about
SQL is complete without an exploration of the semantics of null.
SQL uses three-valued logic. In addition
to true and false, logical expressions can evaluate to an unknown value, which is indicated by null.
Logical operations AND and OR behave according to the following rules:
The logical comparison operators =, <>, >, ≥, <, ≤ evaluate to null when one or both operands are null.
Hence, if t is null, our expression cast(s as smallint) = t can be simply replaced with a constant null.
As we mentioned in the previous section, there are cases where cast(s as smallint) = t can be reduced to 
true or false, except for the fact that if s is null, the expression needs to return null to preserve
semantics. So, we use the following forms to capture this:

if(s IS null, null, false)
if(s IS null, null, true)


The catch with that is that the optimizer does not understand the semantics of these if expressions and cannot 
use them for deriving additional properties. In essence, it becomes an optimization barrier. On the other hand,
the optimizer is pretty good at manipulating logical conjunctions (AND) and disjunctions (OR). So, let’s see 
how we can use boolean logic to obtain an equivalent formulation.
We can exploit the properties of SQL boolean logic to derive expressions that behave in the same manner as the 
if() constructs from above:
Let’s break it down to see why that works.
Putting it all together
Now that we’ve had a taste of how this optimization works, let’s put it all together into one rule to rule
them all.
Given an expression of the following form,
we derive a transformation based on the rules below.
If \(t \text{ is null} \Rightarrow \cast{S}{T}(s) \otimes t \iff \text{null} \tag{1}\) \(\\[5pt]\)
If \(\exists s' \in S \ldotp s' = \cast{T}{S}(t)\), we calculate \(t' = \cast{S}{T}(s')\) and consider 
the following cases:
    
 If \(t = t' \Rightarrow \cast{S}{T}(s) \otimes t \iff s \otimes \cast{T}{S}(t) \tag{2.1}\) \(\\[5pt]\)
        
 In the special case where \(\\[5pt]\) \(\quad  s' = \text{min}_S  \Rightarrow   
 \left\{
  \begin{array}{@{}ll@{}}
 \cast{S}{T}(s) > t   & \iff s \ne \text{min}_{S}     \\
 \cast{S}{T}(s) \ge t & \iff \trueOrNull{s}           \\
 \cast{S}{T}(s) <   t & \iff \falseOrNull{s}          \\
 \cast{S}{T}(s) \le t & \iff s = \text{min}_{S}
  \end{array}\right. \tag{2.1.1}  \\[5pt]\)
 In the special case where \(\\[5pt]\) \(\quad s' = \text{max}_S  \Rightarrow 
 \left\{
  \begin{array}{@{}ll@{}}
\cast{S}{T}(s) > t   & \iff \falseOrNull{s}        \\
\cast{S}{T}(s) \ge t & \iff s = \text{max}_{S}     \\
\cast{S}{T}(s) <   t & \iff s \ne \text{max}_{S}   \\
\cast{S}{T}(s) \le t & \iff \trueOrNull{s}
  \end{array}\right. \tag{2.1.2} \\[5pt]\)
Otherwise, \(\\[5pt]\) \(\quad  t \ne t' \Rightarrow 
 \left\{
  \begin{array}{@{}ll@{}}
   \cast{S}{T}(s) = t   & \iff \falseOrNull{s}        \\
   \cast{S}{T}(s) \ne t & \iff \trueOrNull{s}            
  \end{array}\right. \tag{2.2} \\[5pt]\)
Further, if \(\\[5pt]\) \(\quad \quad  t < t' \Rightarrow 
 \left\{
  \begin{array}{@{}ll@{}}
\cast{S}{T}(s) > t   & \iff s \ge \cast{T}{S}(t)    \\
\cast{S}{T}(s) \ge t & \iff s \ge \cast{T}{S}(t)    \\
\cast{S}{T}(s) <   t & \iff s <  \cast{T}{S}(t)     \\
\cast{S}{T}(s) \le t & \iff s <  \cast{T}{S}(t)
  \end{array}\right. \tag{2.2.1} \\[5pt]\)
Otherwise, if \(\\[5pt]\) \(\quad \quad  t > t' \Rightarrow
 \left\{
  \begin{array}{@{}ll@{}}
\cast{S}{T}(s) > t   & \iff s >    \cast{T}{S}(t)    \\
\cast{S}{T}(s) \ge t & \iff s >    \cast{T}{S}(t)    \\
\cast{S}{T}(s) <   t & \iff s \le  \cast{T}{S}(t)    \\
\cast{S}{T}(s) \le t & \iff s \le  \cast{T}{S}(t)
  \end{array}\right. \\[5pt] \tag{2.2.2}\)
If \(\cast{T}{S}\) is undefined or \(\cast{T}{S}(t)\) fails, \(\\[5pt]\) \(t < \cast{S}{T}(\text{min}_S) \Rightarrow  
  \left\{
 \begin{array}{@{}ll@{}}
         \cast{S}{T}(s) =   t & \iff \falseOrNull{s}    \\
         \cast{S}{T}(s) \ne t & \iff \trueOrNull{s}     \\
         \cast{S}{T}(s) <   t & \iff \falseOrNull{s}    \\
         \cast{S}{T}(s) \le t & \iff \falseOrNull{s}    \\
         \cast{S}{T}(s) >   t & \iff \trueOrNull{s}     \\
         \cast{S}{T}(s) \ge t & \iff \trueOrNull{s}     
\end{array}\right. \\[5pt] \tag{3.1}\)
\(t = \cast{S}{T}(\text{min}_S) \Rightarrow  
  \left\{
 \begin{array}{@{}ll@{}}
         \cast{S}{T}(s) =   t & \iff s = \text{min}_S       \\
         \cast{S}{T}(s) \ne t & \iff s > \text{min}_S       \\
         \cast{S}{T}(s) <   t & \iff \falseOrNull{s}        \\
         \cast{S}{T}(s) \le t & \iff s = \text{min}_S       \\
         \cast{S}{T}(s) >   t & \iff s > \text{min}_S       \\
         \cast{S}{T}(s) \ge t & \iff \trueOrNull{s}     
\end{array}\right. \\[5pt] \tag{3.2}\)
\(t > \cast{S}{T}(\text{max}_S) \Rightarrow  
  \left\{
    \begin{array}{@{}ll@{}}
            \cast{S}{T}(s) =   t & \iff \falseOrNull{s}    \\
            \cast{S}{T}(s) \ne t & \iff \trueOrNull{s}     \\
            \cast{S}{T}(s) <   t & \iff \trueOrNull{s}     \\
            \cast{S}{T}(s) \le t & \iff \trueOrNull{s}     \\
            \cast{S}{T}(s) >   t & \iff \falseOrNull{s}    \\
            \cast{S}{T}(s) \ge t & \iff \falseOrNull{s}    
   \end{array}\right. \\[5pt] \tag{3.3}\)
\(t = \cast{S}{T}(\text{max}_S) \Rightarrow  
 \left\{
   \begin{array}{@{}ll@{}}
           \cast{S}{T}(s) =   t & \iff s = \text{max}_S   \\
           \cast{S}{T}(s) \ne t & \iff s < \text{max}_S   \\
           \cast{S}{T}(s) <   t & \iff s < \text{max}_S   \\
           \cast{S}{T}(s) \le t & \iff \trueOrNull{s}     \\
           \cast{S}{T}(s) >   t & \iff \falseOrNull{s}    \\
           \cast{S}{T}(s) \ge t & \iff s = \text{max}_S       
  \end{array}\right. \\[5pt] \tag{3.4}\) 
OMGWTFNaN
As if all of this weren’t enough, there’s an additional complication we need to handle for types such
as real and double. Those types are what the SQL specification calls approximate numeric types.
Presto implements them as IEEE-754 single and double 
precision floating point numbers, respectively.
In addition to finite numbers, IEEE-754 defines an additional set of values: ∞ and NaN (not a number).
It is worth noting that -∞ and +∞ do not behave like ∞ in the mathematical sense. They are actual values
in the ordered set of numbers, but they don’t represent any finite number. Therefore, the following relations hold:

-∞ < -1.23E30 < 0 < 3.45E25 < +∞
-∞ = -∞
+∞ = +∞ 


Since -∞ and +∞ can be treated as regular values, we can use them as the minimum and maximum values of the range
for these types. Any other choice would not work, since all values of a type must be contained within the range of the type
for the transformation to be valid. That is,
Let’s look at an example to understand why this is necessary. Instead of using \([-∞, ∞]\) as the range, 
let’s say we picked the minimum and maximum representable values for the real type (-3.4028235E38 and 3.4028235E38), and
consider this expression (s :: real):

cast(s AS double) >= double '3.4028235E38'


From the rules in the previous section, \(t = 3.4028235\text{E}38\), \(s'= 3.4028235\text{E}38\) and \(t' = 3.4028235E38\). Since 
\(t = t'\) and \(s' = max_S\), from rule 2.1.2, the expression reduces to:

s = 3.4028235E38 


This is clearly incorrect. When s = Infinity, cast(s AS double) results in double 'Infinity', which is not equal
to 3.4028235E38.
On the other hand, NaN doesn’t obey any of the comparison rules. It’s neither equal nor distinct from itself, and
it’s neither larger, nor smaller than any other value:

NaN =  NaN  ⟺  false  
NaN <> NaN  ⟺  false
NaN > 0     ⟺  false
NaN = 0     ⟺  false
NaN < 0     ⟺  false


So, NaN is not part of the ordered set of values for these types, and the requirement that every value be contained 
in the range doesn’t hold. From rule 2.1.1, an expression such as:

cast(s AS double) >= double '-Infinity'


reduces to if(s is null, null, true), which is incorrect, since the expression returns false when s is NaN.
Is all hope lost for real and double? Fortunately, not. The range is only needed as an optimization. If we
forgo defining a range for types that don’t have the required properties, the special cases 2.1.1 and 
2.1.2 don’t apply, and by rule 2.1, the expression is equivalent to:

s >= real '-Infinity'


which correctly returns false when s is NaN.
 Show me the money!
So, does all of this even matter? Why, yes! Glad you asked.
As with any performance optimization, you can improve things by working smarter (can you avoid work that can be 
proven to be unnecessary) or by working harder (can you do the work you have to do more efficiently). This
optimization does a little of both. Let’s consider three scenarios when it has a positive effect.
Dead code
Since in some cases it can prove that the comparisons will always produce false, regardless of the input,
it can short-circuit entire conditions or subplans before even a single row of data is read. Some query generation 
tools are not sophisticated enough and may emit queries that contain that kind of construct. Also, everyone makes
mistakes, and it’s not hard to end up with queries that contain what’s effectively dead code.  The last thing you
want is to sit in front of the screen waiting for a query to complete … waiting … waiting … just for Presto
to tell you ¯\_(ツ)_/¯.
For example, given:

CREATE TABLE t(x smallint);

-- <insert lots of rows into t> --



SELECT * 
FROM t 
WHERE x IS NOT NULL AND x > 1000000 


Produces the following query plan (Values is an empty inline table):

- Output[x]
  - Values


Improved JOIN performance
What’s nice about this optimization is that it enables other optimizations to work better. We mentioned earlier
that comparisons that are not simple expressions between columns, or between columns and constants, make it harder for the
predicate pushdown optimization to infer predicates that can be propagated to the other branch of a join.
Given two tables:

CREATE TABLE t1 (v smallint);
CREATE TABLE t2 (v bigint);


And the following query:

SELECT *
FROM t1 JOIN t2 ON t1.v = t2.v
WHERE t1.v = BIGINT '1';


The query plan without this optimization is:

- Output[name]
  - InnerJoin[expr = v]
    - ScanFilterProject[t1, filter = CAST(v AS bigint) = BIGINT '1']
        expr := CAST(v AS bigint)
    - TableScan[t2]


The optimization allows the predicate pushdown logic to apply the condition to the other side of the join, producing
a much better plan. If data in t1 and t2 is somehow organized by v (e.g., a partition key in Hive), or if the
connector understands how to apply the filter at the source, the query won’t need to even read certain parts of the
table. The query plan with the optimization enabled:

- Output[name]
  - CrossJoin
    - ScanFilterProject[t1, filter = (v = SMALLINT '1')]
    - ScanFilterProject[t2, filter = (v = BIGINT '1')]


Best bang for the buck
Finally, if the condition absolutely needs to be evaluated, the transformed expression could be significantly
more efficient, especially when the cast between the two types is expensive. To illustrate, given a table
with 1 billion rows and a column k :: bigint:

SELECT count_if(k > CAST(0 as decimal(19)) 
FROM t


Without the optimization:

- [...]
    - ScanProject
===>    CPU: 3.75m (66.34%), Scheduled: 5.56m (145.22%)
        expr := (CAST("k" AS decimal(19,0)) > CAST(DECIMAL '0' AS decimal(19,0)))
        
        
Query 20190515_072240_00006_rgzb4, FINISHED, 4 nodes
Splits: 110 total, 110 done (100.00%)
0:22 [1000M rows, 8.4GB] [46M rows/s, 395MB/s]


With the optimization:

- [...]
    - ScanProject
===>    CPU: 29.93s (58.17%), Scheduled: 47.44s (145.07%)
        expr := ("k" > BIGINT '0')
        
        
Query 20190515_071912_00005_bz6cb, FINISHED, 4 nodes
Splits: 110 total, 110 done (100.00%)
0:03 [1000M rows, 8.4GB] [335M rows/s, 2.81GB/s]        


Thirsty for more? Here’s the code. 
Happy querying!
Many thanks to kasiafi for their thoughtful and thorough feedback on early
drafts of this post.
