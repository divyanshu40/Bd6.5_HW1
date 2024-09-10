let request = require("supertest");
let http = require("http");
let { app, addGame, addTournament, validateGame, validateTournament } = require("../index");



jest.mock("../index", () => ({
  ...jest.requireActual("../index"),
  addGame: jest.fn(),
  addTournament: jest.fn(),
  validateGame: jest.fn((game) => {
    if (! game.title || typeof game.title !== "string") {
      return "Title is required and should be a string";
    } else if (! game.genre || typeof game.genre !== "string") {
      return "Genre is required and should be a string";
    } else {
      return null;
    }
  }),
  validateTournament: jest.fn((tournament) => {
    if (! tournament.name || typeof tournament.name !== "string") {
      return "Name is required and should be string";
    } else if (! tournament.gameId || typeof tournament.gameId !== "number") {
      return "Game id is required and should be a number";
    } else {
      return null;
    }
  })
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3001, done);
});

afterAll((done) => {
  server.close(done);
});

describe("API Testing", ()=> {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Exercise 3: Test Add a New Game with Valid Input
  it("POST API /api/games should add new game and return status code as 201", async () => {
    let addedGame = { id: 1, title: "The legend of Zelda", genre: "Adventure" };
    addGame.mockResolvedValue(addedGame);
    let result = await request(server).post("/api/games").send({title: "The legend of Zelda", genre: "Adventure" });
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(addedGame);
  });
  // Exercise 4: Test Add a New Game with Invalid Input
  it("POST API /api/games should return status code as 400 for invalid input", async () => {
    let result = await request(server).post("/api/games").send({title: "The legend of Zelda"});
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual("Genre is required and should be a string");
  });
  // Exercise 5: Test Add a New Tournament with Valid Input
  it("POST API /api/tournaments should add new Tournament and return a status code as 201", async () => {
    let addedTournament = { id: 1, name: "Zelda Championship", gameId: 1 };
    addTournament.mockResolvedValue(addedTournament);
    let result = await request(server).post("/api/tournaments").send({name: "Zelda Championship", gameId: 1});
    expect(result.statusCode).toEqual(201);
    expect(result.body).toEqual(addedTournament);
  });
  // Exercise 6: Test Add a New Tournament with Invalid Input
  it("POST API /api/tournaments should return status code 400 for invalid input", async () => {
    let result = await request(server).post("/api/tournaments").send({name: "Zelda Championship"});
    expect(result.statusCode).toEqual(400);
    expect(result.text).toEqual("Game id is required and should be a number");
  });
});
describe("Validation Functions Testing", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  // Exercise 7: Test Game Validation Function with Jest Mocks
  it("validateGame should validate game input correctly", () => {
    expect(validateGame({title: "The legend of Zelda", genre: "Adventure"})).toBeNull();
  });
    //Exercise 8: Test Game Validation Function Error Handling with Jest Mocks
    it("validateGame function should return an error message for invalid game input", () => {
    expect(validateGame({genre: "Adventure"})).toEqual("Title is required and should be a string");
    expect(validateGame({title: "The legend of Zelda"})).toEqual("Genre is required and should be a string");
  });
  // Exercise 9: Test Tournament Validation Function with Jest Mocks
  it("validateTournament function should return null for valid response", () => {
    expect(validateTournament({name: "Zelda Championship", gameId: 1})).toBeNull();
  });
  // Exercise 10: Test Tournament Validation Function Error Handling with Jest Mocks
it("validateTournament function should return an error message for invalid input", () => {
  expect(validateTournament({name: "Zelda Championship"})).toEqual("Game id is required and should be a number");
  expect(validateTournament({gameId: 1})).toEqual("Name is required and should be string");
});

});