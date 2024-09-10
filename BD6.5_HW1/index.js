let express = require("express");
let app = express();
app.use(express.json());

let games = [];
let tournaments = [];

// function to add new game
async function addGame(newGameData) {
  let addedGame = { id: games.length + 1, ...newGameData };
  games.push(addedGame);
  return addedGame;
}
// function to add new tournament.
async function addTournament(newTournamentData) {
  let addedTournament = { id:  tournaments.length + 1, ...newTournamentData };
  tournaments.push(addedTournament);
  return addedTournament;
}
// validate function to add new game
function validateGame(game) {
  if (! game.title || typeof game.title !== "string") {
    return "Title is required and should be a string";
  } else if (! game.genre || typeof game.genre !== "string") {
    return "Genre is required and should be a string";
  } else {
    return null;
  }
}
// validate function to add new tournament
function validateTournament(tournament) {
  if (! tournament.name || typeof tournament.name !== "string") {
    return "Name is required and should be string";
  } else if (! tournament.gameId || typeof tournament.gameId !== "number") {
    return "Game id is required and should be a number";
  } else {
    return null;
  }
}
// Exercise 1: Add a New Game
app.post("/api/games", async (req, res) => {
  let newGameData = req.body;
  try {
    let error = validateGame(newGameData);
    if (error) {
     return res.status(400).send(error);
    }
    let result = await addGame(newGameData);
   return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error"});
  }
});
// Exercise 2: Add a New Tournament
app.post("/api/tournaments", async (req, res) => {
  let newTournamentData = req.body;
  try {
    let error = validateTournament(newTournamentData);
    if (error) {
      return res.status(400).send(error);
    }
    let result = await addTournament(newTournamentData);
    return res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error"});
  }
});
module.exports = { app, addGame, addTournament, validateGame, validateTournament };