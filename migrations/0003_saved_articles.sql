CREATE TABLE saved_articles (
  user_id TEXT NOT NULL,
  article_id TEXT NOT NULL,
  saved_at TEXT NOT NULL,
  PRIMARY KEY (user_id, article_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX saved_articles_user_id_idx ON saved_articles(user_id);
