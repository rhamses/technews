CREATE TABLE read_later_articles (
  user_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  source_url TEXT NOT NULL,
  title TEXT NOT NULL,
  site_name TEXT,
  author TEXT,
  summary TEXT,
  pub_date TEXT,
  saved_at TEXT NOT NULL,
  PRIMARY KEY (user_id, article_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX read_later_articles_user_id_idx ON read_later_articles(user_id);
CREATE INDEX read_later_articles_article_id_idx ON read_later_articles(article_id);
