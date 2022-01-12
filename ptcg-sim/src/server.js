"use strict";
const util = require("util");
const glob = require("glob");
const fs = require('fs').promises;
const mysql = require("mysql2/promise");

// OAuth
const request = require('request'); // "Request" library
const cors = require('cors');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');


/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */

const express = require("express");
const app = express();

app.use(express.static('public'))
   .use(cors())
   .use(cookieParser());

/*const db = mysql.createPool({
  host: process.env.DB_URL || 'localhost',
  port: process.env.DB_PORT || '3306',
  user: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'cards'
});*/
const multer = require("multer");
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(multer().none());

const INVALID_PARAM_ERROR = 400;
const FILE_ERROR = 500;
const SERVER_ERROR_MSG = {"error": "A database error occurred. Please try again later."};

/*
 * The credentials GET enpoint returns our unique player id and token on respective lines of text
 */
app.get("/credentials", function(req, res) {
  try {
    res.type("text");
    res.send(PID + "\n" + TOKEN);
  } catch (err) {
    res.type("json");
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});

/*
 * The GET endpoint returns the quantity of each card the user has in given set
 */
app.get("/[user]/collection/[setid]", async function(req, res) {
  try {
    res.type("json");
    let results = await selectAll();
    res.json({"pokemon": results});
  } catch (err) {
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});
/*
 * The GET endpoint returns the %complete of each set
 */
app.get("/[user]/collection", async function(req, res) {
  try {
    res.type("json");
    let results = await selectAll();
    res.json({"pokemon": results});
  } catch (err) {
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});

/*
 * The GET endpoint returns the possible achievements, their completion status and the reward
 */
app.get("/[user]/achievements", async function(req, res) {
  try {
    res.type("json");
    let results = await selectAll();
    res.json({"pokemon": results});
  } catch (err) {
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});

/*
 * The GET endpoint returns the users bag (inventory)
 */
app.get("/[user]/bag", async function(req, res) {
  try {
    res.type("json");
    let results = await selectAll();
    res.json({"pokemon": results});
  } catch (err) {
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});
/*
 * The insert POST endpoint adds the card to the user's collection
 */
app.post("/pokedex/insert", async function(req, res) {
  try {
    res.type("json");
    if (req.body.name) {
      let name = req.body.name;
      if (!(await checkPokedex(name))) {
        let nickname = name.toUpperCase();
        if (req.body.nickname) {
          nickname = req.body.nickname;
        }
        await insertPoke(name, nickname);
        res.send({"success": name + " added to your Pokedex!"});
      } else {
        res.status(INVALID_PARAM_ERROR).send({"error": name + " already found."});
      }
    } else {
      res.status(INVALID_PARAM_ERROR).send({"error": "Missing name parameter."});
    }
  } catch (err) {
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});

/*
 * The delete POST endpoint removes the pokedex entry matching the given name. If no pokedex entry
 * matches sends a 400 error.
 */
app.post("/pokedex/delete", async function(req, res) {
  try {
    res.type("json");
    if (req.body.name) {
      let name = req.body.name;
      if (await checkPokedex(name)) {
        await deletePoke(name);
        res.send({"success": name + " removed from your Pokedex!"});
      } else {
        res.status(INVALID_PARAM_ERROR).send({"error": name + " not found in your Pokedex."});
      }
    } else {
      res.status(INVALID_PARAM_ERROR).send({"error": "Missing name parameter."});
    }
  } catch (err) {
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});

/*
 * The delete all POST endpoint removes all pokedex entries.
 */
app.post("/pokedex/delete/all", async function(req, res) {
  try {
    res.type("json");
    await deleteAll();
    res.send({"success": "All Pokemon removed from your Pokedex!"});
  } catch (err) {
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});

/*
 * The trade POST endpoint swaps pokemon with someone. It requires the player to own the offered
 * pokemon and the other player to have the requested pokemon or a 400 error is sent.
 */
app.post("/pokedex/trade", async function(req, res) {
  try {
    res.type("json");
    if (req.body.mypokemon && req.body.theirpokemon) {
      let tradeAway = req.body.mypokemon;
      let tradeFor = req.body.theirpokemon;
      if (await checkPokedex(tradeAway)) {
        if (!(await checkPokedex(tradeFor))) {
          await tradePoke(tradeAway, tradeFor);
          res.send({"success": "You have traded your " + tradeAway + " for " + tradeFor + "!"});
        } else {
          res.status(INVALID_PARAM_ERROR).send({"error": "You have already found " + tradeFor +
          "."});
        }
      } else {
        res.status(INVALID_PARAM_ERROR).send({"error": tradeAway + " not found in your Pokedex."});
      }
    } else {
      res.status(INVALID_PARAM_ERROR).send({"error":
      "Missing mypokemon or theirpokemon parameter."});
    }
  } catch (err) {
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});

/*
 * The update POST endpoint changes the given pokemon's nickname. If the given pokemon isn't owned
 * it sends a 400 error. If no nickname is provided it will default to all caps of the pokemon's
 * name.
 */
app.post("/pokedex/update", async function(req, res) {
  try {
    res.type("json");
    if (req.body.name) {
      let name = req.body.name;
      let nickname = name.toUpperCase();
      if (await checkPokedex(name)) {
        if (req.body.nickname) {
          nickname = req.body.nickname;
        }
        await setName(name, nickname);
        res.send({"success": "Your " + name + " is now named " + nickname + "!"});
      } else {
        res.status(INVALID_PARAM_ERROR).send({"error": name + " not found in your Pokedex."});
      }
    } else {
      res.status(INVALID_PARAM_ERROR).send({"error": "Missing name parameter."});
    }
  } catch (err) {
    res.status(FILE_ERROR).send(SERVER_ERROR_MSG);
  }
});

/**
 * Gets all the pokedex entries in the database.
 * @return {Array} An Array of JSON pokedex entries
 */
async function selectAll() {
  try {
    let qry = "SELECT * FROM Pokedex ORDER BY datefound;";
    let results = await db.query(qry);
    return results[0];
  } catch (err) {
    console.error(err);
  }
}

/**
 * Removes entry w/ given name from database
 * @param {String} name - a lowercase String
 */
async function deletePoke(name) {
  try {
    let qry = "DELETE FROM Pokedex WHERE name = ?";
    await db.query(qry, [name.toLowerCase()]);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Removes entry w/ tradeAway name from pokedex and adds entry for tradeFor. Input nickname is
 * default.
 * @param {String} tradeAway - a lowercase String representing a name in our pokedex
 * @param {String} tradeFor - a lowercase String representing a name in another pokedex
 */
async function tradePoke(tradeAway, tradeFor) {
  try {
    await insertPoke(tradeFor, tradeFor.toUpperCase());
    await deletePoke(tradeAway);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Sets the nickname for a pokemon alredy in the pokedex
 * @param {String} name - a lowercase String representing a name in our pokedex
 * @param {String} nickname - a lowercase String representing the nickname
 */
async function setName(name, nickname) {
  try {
    let qry = "UPDATE Pokedex SET nickname = ? WHERE name = ?";
    await db.query(qry, [nickname, name.toLowerCase()]);
  } catch (err) {
    console.error(err);
  }
}

/**
 * deletes all the entries in the Pokedex
 */
async function deleteAll() {
  try {
    let qry = "DELETE FROM Pokedex";
    await db.query(qry);
  } catch (err) {
    console.error(err);
  }
}

/**
 * creates and inserts an entry for the pokedex
 * @param {String} name - a lowercase String representing a name in our pokedex
 * @param {String} nickname - a lowercase String representing the nickname
 */
async function insertPoke(name, nickname) {
  try {
    let qry = "INSERT INTO Pokedex(name, nickname, datefound) VALUES(?, ?, ?);";
    let time = getTime();
    await db.query(qry, [name.toLowerCase(), nickname, time]);
  } catch (err) {
    console.error(err);
  }
}

/**
 * Checks if pokedex contains given name entry
 * @param {String} name - a lowercase String representing a name in our pokedex
 * @return {Boolean} true if pokedex has an entry for the giveen name, false otherwise
 */
async function checkPokedex(name) {
  try {
    let flag = true;
    let qry = "SELECT * FROM Pokedex WHERE name = ?";
    let results = await db.query(qry, [name.toLowerCase()]);
    if (results[0].length === 0) {
      flag = false;
    }
    return flag;
  } catch (err) {
    console.error(err);
  }
}

/**
 * Gets the current date and time in string format.
 * @return {String} the current date and time
 */
function getTime() {
  let date = new Date();
  return date.getFullYear() +
    '-' + (date.getMonth() < 10 ? '0' : '') + (date.getMonth() + 1) +
    '-' + (date.getDate() < 10 ? '0' : '') + date.getDate() +
    ' ' + (date.getHours() < 10 ? '0' : '') + date.getHours() +
    ':' + (date.getMinutes() < 10 ? '0' : '') + date.getMinutes() +
    ':' + (date.getSeconds() < 10 ? '0' : '') + date.getSeconds();
}

const PORT = process.env.PORT || 8000;
app.listen(PORT);
