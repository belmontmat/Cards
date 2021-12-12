CREATE DATABASE cards;
USE cards;
CREATE TABLE SessionScore (
  name VARCHAR(30),
  packs INTEGER,
  profit FLOAT,
  dateplayed DATETIME,
  PRIMARY KEY(name)
);
