CREATE TABLE blogs (
  id SERIAL PRIMARY KEY UNIQUE,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title) 
VALUES (
  'George W Bush',
  'http://wwww.example.fi',
  'My days as POTUS'
);

INSERT INTO blogs (author, url, title) 
VALUES (
  'Albert Einstein',
  'http://wwww.example.fi',
  'Big bang theory'
);