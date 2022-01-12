CREATE DATABASE cards;
USE cards;
CREATE TABLE AuthTable (
  hasheduname VARCHAR(30),
  hashedpass VARCHAR(30),
  id INTEGER,
  lastplayed DATETIME,
  PRIMARY KEY(id)
);
CREATE TABLE StatsTable (
  id INTEGER,
  net FLOAT,
  cash FLOAT,
  achieves JSON,
  PRIMARY KEY(id)
);
CREATE TABLE CollectTable (
  id INTEGER,
  setid FLOAT,
  setcontents JSON,
  quantable FLOAT,
  PRIMARY KEY(id)
);
CREATE TABLE BagTable (
  id INTEGER,
  bagcontents JSON
  PRIMARY KEY(id)
);
