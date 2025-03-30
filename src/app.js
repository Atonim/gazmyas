const Agent = require("./agent");
const Socket = require("./socket");
const Manager = require("./manager");
const goal_scorer_dt = require("./goal_scorer_dt");
const assist_player_dt = require("./assist_player_dt");
const VERSION = 7;

(async () => {
  let teamA = "Gazmyas";
  let teamB = "Combine";
  let player1 = new Agent(teamA);
  player1.dt = assist_player_dt;
  player1.playerName = "assistant";
  player1.manager = new Manager();

  let player2 = new Agent(teamA);
  player2.dt = goal_scorer_dt;
  player2.playerName = "scorer";
  player2.manager = new Manager();

  await Socket(player1, teamA, VERSION);
  await Socket(player2, teamA, VERSION);

  let npc1 = new Agent("Combine");
  let npc2 = new Agent("Combine");
  await Socket(npc1, "Combine", VERSION);
  await Socket(npc2, "Combine", VERSION);

  await player1.socketSend("move", "-20 -10");
  await player2.socketSend("move", "-20 25");

  await npc1.socketSend("move", `-51 -9`);
  await npc2.socketSend("move", `-51 9`);
})();
