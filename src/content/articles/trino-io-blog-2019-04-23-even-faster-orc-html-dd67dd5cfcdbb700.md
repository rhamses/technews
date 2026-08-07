---
title: "Even Faster ORC"
link: "https://trino.io/blog/2019/04/23/even-faster-orc.html"
guid: "https://trino.io/blog/2019/04/23/even-faster-orc.html"
pubDate: "2019-04-23T00:00:00.000Z"
site_name: "Trino"
site_feed: "https://trino.io/blog/feed.xml"
category: "Data"
summary: "Trino is known for being the fastest SQL on Hadoop engine, and our custom ORC\nreader implementation is a big reason for this speed – now it is even faster!\nWhy is this important?\nFor the TPC-DS benchmark, the new reader reduced the global query time by ~5%\nand CPU usage by ~9%, which improves user experience while reducing the cost.\nWhat improved?\nORC uses a two step system to decode data. The first step is a traditional\ncompression algorithm like gzip that generically reduces data size. The second\nstep has data type specific compression algorithms that convert the raw bytes\ninto values (e.g., text, numbers, timestamps). It is this latter step that we\nimproved.\nHow much faster is the decoder?\n\nWhy exactly is this faster?\nExplaining why the new code is faster requires a brief explanation of the\nexisting code. In the old code, a typical value reader looked like this:\n\nif (dataStream == null) {\n    presentStream.skip(nextBatchSize);\n    return RunLengthEncodedBlock.create(type, null, nextBatchSize);\n}\n\nBlockBuilder builder = type.createBlockBuilder(null, nextBatchSize);\nif (presentStream == null) {\n    for (int i = 0; i < nextBatchSize; i++) {\n        type.writeLong(builder, dataStream.next());\n    }\n}\nelse {\n    for (int i = 0; i < nextBatchSize; i++) {\n        if (presentStream.nextBit()) {\n            type.writeLong(builder, dataStream.next());\n        }\n        else {\n            builder.appendNull();\n        }\n    }\n}\nreturn builder.build();\n\n\nThis code does a few things well. First, for the all values are null case, it\nreturns a run length encoded block which has custom optimizations throughout\nTrino (this optimization was\nrecently added by Praveen Krishna). Secondly,\nit separates the unconditional no nulls loop from the conditional mixed nulls\nloop. It is common to have a column without nulls, so it makes sense to split\nthis out, since unconditional loops are faster than conditional loops.\nOn the downside, this code has several performance issues:\nMany data encodings can be efficiently read in bulk, but this code reads one\nvalue at a time.\nIn some cases, the code can be called with different type instances, which\nresult in slow dynamic dispatch call sites in the loop.\nValue reading in the null loop is conditional, which is expensive.\nOptimize for bulk reads\nAs you can see from the code above, Trino is always loading values in batches\n(typically 1024). This makes the reader and the downstream code more efficient as\nthe overhead of processing data is amortized over the batch, and in some cases\ndata can be processed in parallel. ORC has a small number of low level decoders\nfor booleans, numbers, bytes and so on. These encodings are optimized for each\ndata type, which means each must be optimized individually. In some cases, the\ndecoders already had internal batch output buffers, so the optimization was\ntrivial. In another equally trivial case, we changed the float and double stream\ndecoders from loading a value byte at a time to bulk loading an entire array of\nvalues directly from the input and improved the performance more than 10x.\nSome changes, however, were significantly more complex. One example is the\nboolean reader, which was changed from decoding a single bit at a time to\ndecoding 8 bits at a time. This sounds simple, but in practice doing this\nefficiently is complex, since reads are not aligned to 8 bits, and there is the\ngeneral problem of forming JVM friendly loops. For those interested, the code is\nhere.\nAvoid dynamic dispatch in loops\nThis is the kind of problem that is not obvious when reading code, and it is\neasily missed in benchmarks. The core problem happens when you have a loop\ncontaining a method call whose target class can vary over the lifetime of the\nexecution. For example, this simple loop from above may or may not be fast,\ndepending on how many different classes it sees for type across multiple\nexecutions:\n\nfor (int i = 0; i < nextBatchSize; i++) {\n    type.writeLong(builder, dataStream.next());\n}\n\n\nMost of the ORC column readers can only be called with a single type\nimplementation, but the LongStreamReader is called with BIGINT, INTEGER,\nSMALLINT, TINYINT and DATE types. This causes the JVM to generate a dynamic\ndispatch in the core of the loop. Besides the obvious extra work to select the\ntarget code and branch prediction problems, dynamic dispatch calls are normally\nnot inlined, which disables many powerful optimizations in the JVM. The good news\nis that the fix is trivial:\n\nif (type instanceof BigintType) {\n    BlockBuilder builder = type.createBlockBuilder(null, nextBatchSize);\n    for (int i = 0; i < nextBatchSize; i++) {\n        type.writeLong(builder, dataStream.next());\n    }\n    return builder.build();\n}\nif (type instanceof IntegerType) {\n    BlockBuilder builder = type.createBlockBuilder(null, nextBatchSize);\n    for (int i = 0; i < nextBatchSize; i++) {\n        type.writeLong(builder, dataStream.next());\n    }\n    return builder.build();\n}\n...\n\n\nThe hard part is knowing that this is a problem. The existing benchmarks for ORC\nonly tested a single type at a time, which allowed the JVM to inline the target\nmethod and produce much more optimal code. In this case, we happen to know that\nthe code is being invoked with multiple types, so we updated the benchmark to\nwarm up the JVM with multiple types before benchmarking.\nFor more information on this kind of optimization, I suggest reading Aleksey\nShipilëv’s blog posts on JVM performance. Specifically, The Black Magic of (Java)\nMethod Dispatch.\nImprove null reading\nWith the above improvements, we were getting great performance of 0.5ns to 3ns\nper value for most types without nulls, but the benchmarks with nulls were taking\nan additional ~6ns per value. Some of that is expected, since we must decode the\nadditional present boolean stream, but booleans decode at a rate of ~0.5ns per\nvalue, so that isn’t the problem. Martin Traverso\nand I built and benchmarked many different implementations, but we only found one\nwith really good performance.\nThe first implementation we built was simply to bulk read a null array, bulk read\nthe values packed into the front of an array, and then spread the nulls across\nthe array:\n\n// bulk read and count null values\nboolean[] isNull = new boolean[nextBatchSize];\nint nullCount = presentStream.getUnsetBits(nextBatchSize, isNull);\n\n// bulk read non-values into an array large enough for full results\nlong[] result = new long[nextBatchSize];\ndataStream.next(longNonNullValueTemp, nextBatchSize - nullCount);\n\n// copy non-null values into output position (in reverse order)\nint nullSuppressedPosition = nextBatchSize - nullCount - 1;\nfor (int outputPosition = isNull.length - 1; outputPosition >= 0; outputPosition--) {\n    if (isNull[outputPosition]) {\n        result[outputPosition] = 0;\n    }\n    else {\n        result[outputPosition] = result[nullSuppressedPosition];\n        nullSuppressedPosition--;\n    }\n}\n\n\nThis is better because it always bulk reads the values, but there is still a ~4ns\nper value penalty for nulls. We haven’t been able to explain why it happens, but\nwe’ve observed that the number drops dramatically after we adjusted the code to\nassign to result[outputPosition] outside the if block. We can’t do that\nin-place, as in the snippet above, so we introduce a temporary buffer:\n\n// bulk read and count null values\nboolean[] isNull = new boolean[nextBatchSize];\nint nullCount = presentStream.getUnsetBits(nextBatchSize, isNull);\n\n// bulk read non-values into a temporary array\ndataStream.next(tempBuffer, nextBatchSize - nullCount);\n\n// copy values into result\nlong[] result = new long[isNull.length];\nint position = 0;\nfor (int i = 0; i < isNull.length; i++) {\n    result[i] = tempBuffer[position];\n    if (!isNull[i]) {\n        position++;\n    }\n}\n\n\nWith this change, the null penalty drops to ~1.5ns per value, which is reasonable\ngiven that just reading the null flag counts ~0.5ns per value. There are two\ndownsides to this approach. Obviously, there is an extra temporary buffer, but\nsince the reader is single threaded, we can reuse it for the whole file read.\nSecondly, the null values are no longer zero. This should not be a problem for\ncorrectly written code, but could potentially trigger latent bugs. We did find\nanother approach that left the nulls unset, but it was a bit slower and required\nanother temp buffer, so we settled on this approach.\nHow much will my setup improve?\nWe tested the performance using the standard TPC-DS and TPC-H benchmarks on zlib\ncompressed ORC files:\nBenchmark\n      Duration\n      CPU\n    \nTPC-DS\n      5.6%\n      9.3%\n    \nTPC-H\n      4.5%\n      8.3%\n    \nThere are a number of reasons you may get a larger or smaller win:\nThe exact queries matter: In the benchmarks above, some queries saved more than\n20% CPU and others only saved 1%.\nThe compression matters: In our tests we used zlib, which is the most expensive\ncompression supported by ORC. Compression algorithms that use less CPU (e.g.,\nZstd, LZ4, or Snappy) will generally see larger relative improvements.\nThis improvement is only in Trino 309+,\nso if you are using an earlier version you will need to upgrade. Also, if you are\nstill using Facebook’s version of Presto, you can either upgrade to Trino 309+ or\nwait to see if they backport it."
author: "Dain Sundstrom, Martin Traverso"
contentHtml: "<div>\n<article>\n  <div><p><img src=\"https://trino.io/assets/blog/orc-speedup.png\">\n    </p>\n    <p>Trino is known for being the fastest SQL on Hadoop engine, and our custom ORC\nreader implementation is a big reason for this speed – now it is even faster!</p>\n<h2 id=\"why-is-this-important\">\n    Why is this important? <a target=\"_blank\" href=\"https://trino.io/blog/2019/04/23/even-faster-orc.html#why-is-this-important\">#</a>\n</h2>\n<p>For the TPC-DS benchmark, the new reader reduced the global query time by ~5%\nand CPU usage by ~9%, which improves user experience while reducing the cost.</p>\n<h2 id=\"what-improved\">\n    What improved? <a target=\"_blank\" href=\"https://trino.io/blog/2019/04/23/even-faster-orc.html#what-improved\">#</a>\n</h2>\n<p>ORC uses a two step system to decode data. The first step is a traditional\ncompression algorithm like gzip that generically reduces data size. The second\nstep has data type specific compression algorithms that convert the raw bytes\ninto values (e.g., text, numbers, timestamps). It is this latter step that we\nimproved.</p>\n<h2 id=\"how-much-faster-is-the-decoder\">\n    How much faster is the decoder? <a target=\"_blank\" href=\"https://trino.io/blog/2019/04/23/even-faster-orc.html#how-much-faster-is-the-decoder\">#</a>\n</h2>\n<p><img src=\"https://trino.io/assets/blog/orc-speedup.svg\" alt=\"ORC Speedup\"></p>\n<h2 id=\"why-exactly-is-this-faster\">\n    Why exactly is this faster? <a target=\"_blank\" href=\"https://trino.io/blog/2019/04/23/even-faster-orc.html#why-exactly-is-this-faster\">#</a>\n</h2>\n<p>Explaining why the new code is faster requires a brief explanation of the\nexisting code. In the old code, a typical value reader looked like this:</p>\n<div><pre><code><span>if</span> <span>(</span><span>dataStream</span> <span>==</span> <span>null</span><span>)</span> <span>{</span>\n    <span>presentStream</span><span>.</span><span>skip</span><span>(</span><span>nextBatchSize</span><span>);</span>\n    <span>return</span> <span>RunLengthEncodedBlock</span><span>.</span><span>create</span><span>(</span><span>type</span><span>,</span> <span>null</span><span>,</span> <span>nextBatchSize</span><span>);</span>\n<span>}</span>\n<span>BlockBuilder</span> <span>builder</span> <span>=</span> <span>type</span><span>.</span><span>createBlockBuilder</span><span>(</span><span>null</span><span>,</span> <span>nextBatchSize</span><span>);</span>\n<span>if</span> <span>(</span><span>presentStream</span> <span>==</span> <span>null</span><span>)</span> <span>{</span>\n    <span>for</span> <span>(</span><span>int</span> <span>i</span> <span>=</span> <span>0</span><span>;</span> <span>i</span> <span>&lt;</span> <span>nextBatchSize</span><span>;</span> <span>i</span><span>++)</span> <span>{</span>\n        <span>type</span><span>.</span><span>writeLong</span><span>(</span><span>builder</span><span>,</span> <span>dataStream</span><span>.</span><span>next</span><span>());</span>\n    <span>}</span>\n<span>}</span>\n<span>else</span> <span>{</span>\n    <span>for</span> <span>(</span><span>int</span> <span>i</span> <span>=</span> <span>0</span><span>;</span> <span>i</span> <span>&lt;</span> <span>nextBatchSize</span><span>;</span> <span>i</span><span>++)</span> <span>{</span>\n        <span>if</span> <span>(</span><span>presentStream</span><span>.</span><span>nextBit</span><span>())</span> <span>{</span>\n            <span>type</span><span>.</span><span>writeLong</span><span>(</span><span>builder</span><span>,</span> <span>dataStream</span><span>.</span><span>next</span><span>());</span>\n        <span>}</span>\n        <span>else</span> <span>{</span>\n            <span>builder</span><span>.</span><span>appendNull</span><span>();</span>\n        <span>}</span>\n    <span>}</span>\n<span>}</span>\n<span>return</span> <span>builder</span><span>.</span><span>build</span><span>();</span>\n</code></pre></div>\n<p>This code does a few things well. First, for the <em>all values are null</em> case, it\nreturns a run length encoded block which has custom optimizations throughout\nTrino (this <a target=\"_blank\" href=\"https://github.com/trinodb/trino/pull/229\">optimization</a> was\nrecently added by <a target=\"_blank\" href=\"https://github.com/Praveen2112\">Praveen Krishna</a>). Secondly,\nit separates the unconditional <em>no nulls</em> loop from the conditional <em>mixed nulls</em>\nloop. It is common to have a column without nulls, so it makes sense to split\nthis out, since unconditional loops are faster than conditional loops.</p>\n<p>On the downside, this code has several performance issues:</p>\n<ul>\n  <li>Many data encodings can be efficiently read in bulk, but this code reads one\nvalue at a time.</li>\n  <li>In some cases, the code can be called with different type instances, which\nresult in slow dynamic dispatch call sites in the loop.</li>\n  <li>Value reading in the null loop is conditional, which is expensive.</li>\n</ul>\n<h3 id=\"optimize-for-bulk-reads\">\n    Optimize for bulk reads <a target=\"_blank\" href=\"https://trino.io/blog/2019/04/23/even-faster-orc.html#optimize-for-bulk-reads\">#</a>\n</h3>\n<p>As you can see from the code above, Trino is always loading values in batches\n(typically 1024). This makes the reader and the downstream code more efficient as\nthe overhead of processing data is amortized over the batch, and in some cases\ndata can be processed in parallel. ORC has a small number of low level decoders\nfor booleans, numbers, bytes and so on. These encodings are optimized for each\ndata type, which means each must be optimized individually. In some cases, the\ndecoders already had internal batch output buffers, so the optimization was\ntrivial. In another equally trivial case, we changed the float and double stream\ndecoders from loading a value byte at a time to bulk loading an entire array of\nvalues directly from the input and improved the performance more than 10x.</p>\n<p>Some changes, however, were significantly more complex. One example is the\nboolean reader, which was changed from decoding a single bit at a time to\ndecoding 8 bits at a time. This sounds simple, but in practice doing this\nefficiently is complex, since reads are not aligned to 8 bits, and there is the\ngeneral problem of forming JVM friendly loops. For those interested, the code is\n<a target=\"_blank\" href=\"https://github.com/trinodb/trino/blob/308/presto-orc/src/main/java/io/prestosql/orc/stream/BooleanInputStream.java#L218\">here</a>.</p>\n<h3 id=\"avoid-dynamic-dispatch-in-loops\">\n    Avoid dynamic dispatch in loops <a target=\"_blank\" href=\"https://trino.io/blog/2019/04/23/even-faster-orc.html#avoid-dynamic-dispatch-in-loops\">#</a>\n</h3>\n<p>This is the kind of problem that is not obvious when reading code, and it is\neasily missed in benchmarks. The core problem happens when you have a loop\ncontaining a method call whose target class can vary over the lifetime of the\nexecution. For example, this simple loop from above may or may not be fast,\ndepending on how many different classes it sees for <code>type</code> across multiple\nexecutions:</p>\n<div><pre><code><span>for</span> <span>(</span><span>int</span> <span>i</span> <span>=</span> <span>0</span><span>;</span> <span>i</span> <span>&lt;</span> <span>nextBatchSize</span><span>;</span> <span>i</span><span>++)</span> <span>{</span>\n    <span>type</span><span>.</span><span>writeLong</span><span>(</span><span>builder</span><span>,</span> <span>dataStream</span><span>.</span><span>next</span><span>());</span>\n<span>}</span>\n</code></pre></div>\n<p>Most of the ORC column readers can only be called with a single type\nimplementation, but the <code>LongStreamReader</code> is called with <code>BIGINT</code>, <code>INTEGER</code>,\n<code>SMALLINT</code>, <code>TINYINT</code> and <code>DATE</code> types. This causes the JVM to generate a dynamic\ndispatch in the core of the loop. Besides the obvious extra work to select the\ntarget code and branch prediction problems, dynamic dispatch calls are normally\nnot inlined, which disables many powerful optimizations in the JVM. The good news\nis that the fix is trivial:</p>\n<div><pre><code><span>if</span> <span>(</span><span>type</span> <span>instanceof</span> <span>BigintType</span><span>)</span> <span>{</span>\n    <span>BlockBuilder</span> <span>builder</span> <span>=</span> <span>type</span><span>.</span><span>createBlockBuilder</span><span>(</span><span>null</span><span>,</span> <span>nextBatchSize</span><span>);</span>\n    <span>for</span> <span>(</span><span>int</span> <span>i</span> <span>=</span> <span>0</span><span>;</span> <span>i</span> <span>&lt;</span> <span>nextBatchSize</span><span>;</span> <span>i</span><span>++)</span> <span>{</span>\n        <span>type</span><span>.</span><span>writeLong</span><span>(</span><span>builder</span><span>,</span> <span>dataStream</span><span>.</span><span>next</span><span>());</span>\n    <span>}</span>\n    <span>return</span> <span>builder</span><span>.</span><span>build</span><span>();</span>\n<span>}</span>\n<span>if</span> <span>(</span><span>type</span> <span>instanceof</span> <span>IntegerType</span><span>)</span> <span>{</span>\n    <span>BlockBuilder</span> <span>builder</span> <span>=</span> <span>type</span><span>.</span><span>createBlockBuilder</span><span>(</span><span>null</span><span>,</span> <span>nextBatchSize</span><span>);</span>\n    <span>for</span> <span>(</span><span>int</span> <span>i</span> <span>=</span> <span>0</span><span>;</span> <span>i</span> <span>&lt;</span> <span>nextBatchSize</span><span>;</span> <span>i</span><span>++)</span> <span>{</span>\n        <span>type</span><span>.</span><span>writeLong</span><span>(</span><span>builder</span><span>,</span> <span>dataStream</span><span>.</span><span>next</span><span>());</span>\n    <span>}</span>\n    <span>return</span> <span>builder</span><span>.</span><span>build</span><span>();</span>\n<span>}</span>\n<span>...</span>\n</code></pre></div>\n<p>The hard part is knowing that this is a problem. The existing benchmarks for ORC\nonly tested a single type at a time, which allowed the JVM to inline the target\nmethod and produce much more optimal code. In this case, we happen to know that\nthe code is being invoked with multiple types, so we updated the benchmark to\nwarm up the JVM with multiple types before benchmarking.</p>\n<p>For more information on this kind of optimization, I suggest reading Aleksey\nShipilëv’s blog posts on JVM performance. Specifically, <a target=\"_blank\" href=\"https://shipilev.net/blog/2015/black-magic-method-dispatch\">The Black Magic of (Java)\nMethod Dispatch</a>.</p>\n<h3 id=\"improve-null-reading\">\n    Improve null reading <a target=\"_blank\" href=\"https://trino.io/blog/2019/04/23/even-faster-orc.html#improve-null-reading\">#</a>\n</h3>\n<p>With the above improvements, we were getting great performance of 0.5ns to 3ns\nper value for most types without nulls, but the benchmarks with nulls were taking\nan additional ~6ns per value. Some of that is expected, since we must decode the\nadditional <code>present</code> boolean stream, but booleans decode at a rate of ~0.5ns per\nvalue, so that isn’t the problem. <a target=\"_blank\" href=\"https://github.com/martint\">Martin Traverso</a>\nand I built and benchmarked many different implementations, but we only found one\nwith really good performance.</p>\n<p>The first implementation we built was simply to bulk read a null array, bulk read\nthe values packed into the front of an array, and then spread the nulls across\nthe array:</p>\n<div><pre><code><span>// bulk read and count null values</span>\n<span>boolean</span><span>[]</span> <span>isNull</span> <span>=</span> <span>new</span> <span>boolean</span><span>[</span><span>nextBatchSize</span><span>];</span>\n<span>int</span> <span>nullCount</span> <span>=</span> <span>presentStream</span><span>.</span><span>getUnsetBits</span><span>(</span><span>nextBatchSize</span><span>,</span> <span>isNull</span><span>);</span>\n<span>// bulk read non-values into an array large enough for full results</span>\n<span>long</span><span>[]</span> <span>result</span> <span>=</span> <span>new</span> <span>long</span><span>[</span><span>nextBatchSize</span><span>];</span>\n<span>dataStream</span><span>.</span><span>next</span><span>(</span><span>longNonNullValueTemp</span><span>,</span> <span>nextBatchSize</span> <span>-</span> <span>nullCount</span><span>);</span>\n<span>// copy non-null values into output position (in reverse order)</span>\n<span>int</span> <span>nullSuppressedPosition</span> <span>=</span> <span>nextBatchSize</span> <span>-</span> <span>nullCount</span> <span>-</span> <span>1</span><span>;</span>\n<span>for</span> <span>(</span><span>int</span> <span>outputPosition</span> <span>=</span> <span>isNull</span><span>.</span><span>length</span> <span>-</span> <span>1</span><span>;</span> <span>outputPosition</span> <span>&gt;=</span> <span>0</span><span>;</span> <span>outputPosition</span><span>--)</span> <span>{</span>\n    <span>if</span> <span>(</span><span>isNull</span><span>[</span><span>outputPosition</span><span>])</span> <span>{</span>\n        <span>result</span><span>[</span><span>outputPosition</span><span>]</span> <span>=</span> <span>0</span><span>;</span>\n    <span>}</span>\n    <span>else</span> <span>{</span>\n        <span>result</span><span>[</span><span>outputPosition</span><span>]</span> <span>=</span> <span>result</span><span>[</span><span>nullSuppressedPosition</span><span>];</span>\n        <span>nullSuppressedPosition</span><span>--;</span>\n    <span>}</span>\n<span>}</span>\n</code></pre></div>\n<p>This is better because it always bulk reads the values, but there is still a ~4ns\nper value penalty for nulls. We haven’t been able to explain why it happens, but\nwe’ve observed that the number drops dramatically after we adjusted the code to\nassign to <code>result[outputPosition]</code> outside the <code>if</code> block. We can’t do that\nin-place, as in the snippet above, so we introduce a temporary buffer:</p>\n<div><pre><code><span>// bulk read and count null values</span>\n<span>boolean</span><span>[]</span> <span>isNull</span> <span>=</span> <span>new</span> <span>boolean</span><span>[</span><span>nextBatchSize</span><span>];</span>\n<span>int</span> <span>nullCount</span> <span>=</span> <span>presentStream</span><span>.</span><span>getUnsetBits</span><span>(</span><span>nextBatchSize</span><span>,</span> <span>isNull</span><span>);</span>\n<span>// bulk read non-values into a temporary array</span>\n<span>dataStream</span><span>.</span><span>next</span><span>(</span><span>tempBuffer</span><span>,</span> <span>nextBatchSize</span> <span>-</span> <span>nullCount</span><span>);</span>\n<span>// copy values into result</span>\n<span>long</span><span>[]</span> <span>result</span> <span>=</span> <span>new</span> <span>long</span><span>[</span><span>isNull</span><span>.</span><span>length</span><span>];</span>\n<span>int</span> <span>position</span> <span>=</span> <span>0</span><span>;</span>\n<span>for</span> <span>(</span><span>int</span> <span>i</span> <span>=</span> <span>0</span><span>;</span> <span>i</span> <span>&lt;</span> <span>isNull</span><span>.</span><span>length</span><span>;</span> <span>i</span><span>++)</span> <span>{</span>\n    <span>result</span><span>[</span><span>i</span><span>]</span> <span>=</span> <span>tempBuffer</span><span>[</span><span>position</span><span>];</span>\n    <span>if</span> <span>(!</span><span>isNull</span><span>[</span><span>i</span><span>])</span> <span>{</span>\n        <span>position</span><span>++;</span>\n    <span>}</span>\n<span>}</span>\n</code></pre></div>\n<p>With this change, the null penalty drops to ~1.5ns per value, which is reasonable\ngiven that just reading the null flag counts ~0.5ns per value. There are two\ndownsides to this approach. Obviously, there is an extra temporary buffer, but\nsince the reader is single threaded, we can reuse it for the whole file read.\nSecondly, the null values are no longer zero. This should not be a problem for\ncorrectly written code, but could potentially trigger latent bugs. We did find\nanother approach that left the nulls unset, but it was a bit slower and required\nanother temp buffer, so we settled on this approach.</p>\n<h2 id=\"how-much-will-my-setup-improve\">\n    How much will my setup improve? <a target=\"_blank\" href=\"https://trino.io/blog/2019/04/23/even-faster-orc.html#how-much-will-my-setup-improve\">#</a>\n</h2>\n<p>We tested the performance using the standard TPC-DS and TPC-H benchmarks on zlib\ncompressed ORC files:</p>\n<table>\n  <thead>\n    <tr>\n      <th>Benchmark</th>\n      <th>Duration</th>\n      <th>CPU</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>TPC-DS</td>\n      <td>5.6%</td>\n      <td>9.3%</td>\n    </tr>\n    <tr>\n      <td>TPC-H</td>\n      <td>4.5%</td>\n      <td>8.3%</td>\n    </tr>\n  </tbody>\n</table>\n<p>There are a number of reasons you may get a larger or smaller win:</p>\n<ul>\n  <li>The exact queries matter: In the benchmarks above, some queries saved more than\n20% CPU and others only saved 1%.</li>\n  <li>The compression matters: In our tests we used zlib, which is the most expensive\ncompression supported by ORC. Compression algorithms that use less CPU (e.g.,\nZstd, LZ4, or Snappy) will generally see larger relative improvements.</li>\n  <li>This improvement is only in <a target=\"_blank\" href=\"https://trino.io/download\">Trino 309+</a>,\nso if you are using an earlier version you will need to upgrade. Also, if you are\nstill using Facebook’s version of Presto, you can either upgrade to Trino 309+ or\nwait to see if they backport it.</li>\n</ul>\n  </div>\n</article>\n</div>"
---

Trino is known for being the fastest SQL on Hadoop engine, and our custom ORC
reader implementation is a big reason for this speed – now it is even faster!
Why is this important?
For the TPC-DS benchmark, the new reader reduced the global query time by ~5%
and CPU usage by ~9%, which improves user experience while reducing the cost.
What improved?
ORC uses a two step system to decode data. The first step is a traditional
compression algorithm like gzip that generically reduces data size. The second
step has data type specific compression algorithms that convert the raw bytes
into values (e.g., text, numbers, timestamps). It is this latter step that we
improved.
How much faster is the decoder?

Why exactly is this faster?
Explaining why the new code is faster requires a brief explanation of the
existing code. In the old code, a typical value reader looked like this:

if (dataStream == null) {
    presentStream.skip(nextBatchSize);
    return RunLengthEncodedBlock.create(type, null, nextBatchSize);
}

BlockBuilder builder = type.createBlockBuilder(null, nextBatchSize);
if (presentStream == null) {
    for (int i = 0; i < nextBatchSize; i++) {
        type.writeLong(builder, dataStream.next());
    }
}
else {
    for (int i = 0; i < nextBatchSize; i++) {
        if (presentStream.nextBit()) {
            type.writeLong(builder, dataStream.next());
        }
        else {
            builder.appendNull();
        }
    }
}
return builder.build();


This code does a few things well. First, for the all values are null case, it
returns a run length encoded block which has custom optimizations throughout
Trino (this optimization was
recently added by Praveen Krishna). Secondly,
it separates the unconditional no nulls loop from the conditional mixed nulls
loop. It is common to have a column without nulls, so it makes sense to split
this out, since unconditional loops are faster than conditional loops.
On the downside, this code has several performance issues:
Many data encodings can be efficiently read in bulk, but this code reads one
value at a time.
In some cases, the code can be called with different type instances, which
result in slow dynamic dispatch call sites in the loop.
Value reading in the null loop is conditional, which is expensive.
Optimize for bulk reads
As you can see from the code above, Trino is always loading values in batches
(typically 1024). This makes the reader and the downstream code more efficient as
the overhead of processing data is amortized over the batch, and in some cases
data can be processed in parallel. ORC has a small number of low level decoders
for booleans, numbers, bytes and so on. These encodings are optimized for each
data type, which means each must be optimized individually. In some cases, the
decoders already had internal batch output buffers, so the optimization was
trivial. In another equally trivial case, we changed the float and double stream
decoders from loading a value byte at a time to bulk loading an entire array of
values directly from the input and improved the performance more than 10x.
Some changes, however, were significantly more complex. One example is the
boolean reader, which was changed from decoding a single bit at a time to
decoding 8 bits at a time. This sounds simple, but in practice doing this
efficiently is complex, since reads are not aligned to 8 bits, and there is the
general problem of forming JVM friendly loops. For those interested, the code is
here.
Avoid dynamic dispatch in loops
This is the kind of problem that is not obvious when reading code, and it is
easily missed in benchmarks. The core problem happens when you have a loop
containing a method call whose target class can vary over the lifetime of the
execution. For example, this simple loop from above may or may not be fast,
depending on how many different classes it sees for type across multiple
executions:

for (int i = 0; i < nextBatchSize; i++) {
    type.writeLong(builder, dataStream.next());
}


Most of the ORC column readers can only be called with a single type
implementation, but the LongStreamReader is called with BIGINT, INTEGER,
SMALLINT, TINYINT and DATE types. This causes the JVM to generate a dynamic
dispatch in the core of the loop. Besides the obvious extra work to select the
target code and branch prediction problems, dynamic dispatch calls are normally
not inlined, which disables many powerful optimizations in the JVM. The good news
is that the fix is trivial:

if (type instanceof BigintType) {
    BlockBuilder builder = type.createBlockBuilder(null, nextBatchSize);
    for (int i = 0; i < nextBatchSize; i++) {
        type.writeLong(builder, dataStream.next());
    }
    return builder.build();
}
if (type instanceof IntegerType) {
    BlockBuilder builder = type.createBlockBuilder(null, nextBatchSize);
    for (int i = 0; i < nextBatchSize; i++) {
        type.writeLong(builder, dataStream.next());
    }
    return builder.build();
}
...


The hard part is knowing that this is a problem. The existing benchmarks for ORC
only tested a single type at a time, which allowed the JVM to inline the target
method and produce much more optimal code. In this case, we happen to know that
the code is being invoked with multiple types, so we updated the benchmark to
warm up the JVM with multiple types before benchmarking.
For more information on this kind of optimization, I suggest reading Aleksey
Shipilëv’s blog posts on JVM performance. Specifically, The Black Magic of (Java)
Method Dispatch.
Improve null reading
With the above improvements, we were getting great performance of 0.5ns to 3ns
per value for most types without nulls, but the benchmarks with nulls were taking
an additional ~6ns per value. Some of that is expected, since we must decode the
additional present boolean stream, but booleans decode at a rate of ~0.5ns per
value, so that isn’t the problem. Martin Traverso
and I built and benchmarked many different implementations, but we only found one
with really good performance.
The first implementation we built was simply to bulk read a null array, bulk read
the values packed into the front of an array, and then spread the nulls across
the array:

// bulk read and count null values
boolean[] isNull = new boolean[nextBatchSize];
int nullCount = presentStream.getUnsetBits(nextBatchSize, isNull);

// bulk read non-values into an array large enough for full results
long[] result = new long[nextBatchSize];
dataStream.next(longNonNullValueTemp, nextBatchSize - nullCount);

// copy non-null values into output position (in reverse order)
int nullSuppressedPosition = nextBatchSize - nullCount - 1;
for (int outputPosition = isNull.length - 1; outputPosition >= 0; outputPosition--) {
    if (isNull[outputPosition]) {
        result[outputPosition] = 0;
    }
    else {
        result[outputPosition] = result[nullSuppressedPosition];
        nullSuppressedPosition--;
    }
}


This is better because it always bulk reads the values, but there is still a ~4ns
per value penalty for nulls. We haven’t been able to explain why it happens, but
we’ve observed that the number drops dramatically after we adjusted the code to
assign to result[outputPosition] outside the if block. We can’t do that
in-place, as in the snippet above, so we introduce a temporary buffer:

// bulk read and count null values
boolean[] isNull = new boolean[nextBatchSize];
int nullCount = presentStream.getUnsetBits(nextBatchSize, isNull);

// bulk read non-values into a temporary array
dataStream.next(tempBuffer, nextBatchSize - nullCount);

// copy values into result
long[] result = new long[isNull.length];
int position = 0;
for (int i = 0; i < isNull.length; i++) {
    result[i] = tempBuffer[position];
    if (!isNull[i]) {
        position++;
    }
}


With this change, the null penalty drops to ~1.5ns per value, which is reasonable
given that just reading the null flag counts ~0.5ns per value. There are two
downsides to this approach. Obviously, there is an extra temporary buffer, but
since the reader is single threaded, we can reuse it for the whole file read.
Secondly, the null values are no longer zero. This should not be a problem for
correctly written code, but could potentially trigger latent bugs. We did find
another approach that left the nulls unset, but it was a bit slower and required
another temp buffer, so we settled on this approach.
How much will my setup improve?
We tested the performance using the standard TPC-DS and TPC-H benchmarks on zlib
compressed ORC files:
Benchmark
      Duration
      CPU
    
TPC-DS
      5.6%
      9.3%
    
TPC-H
      4.5%
      8.3%
    
There are a number of reasons you may get a larger or smaller win:
The exact queries matter: In the benchmarks above, some queries saved more than
20% CPU and others only saved 1%.
The compression matters: In our tests we used zlib, which is the most expensive
compression supported by ORC. Compression algorithms that use less CPU (e.g.,
Zstd, LZ4, or Snappy) will generally see larger relative improvements.
This improvement is only in Trino 309+,
so if you are using an earlier version you will need to upgrade. Also, if you are
still using Facebook’s version of Presto, you can either upgrade to Trino 309+ or
wait to see if they backport it.
