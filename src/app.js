const Agent = require("./agent");
const Socket = require("./socket");
const Manager = require("./manager");
const dt = require("./player_dt");
const goal_keep_dt = require("./goal_keeper_dt");
const VERSION = 7;

(async () => {
  let teamA = "Gazmyas";
  let teamB = "Combine";
  let x1 = -15,
    y1 = -5;
  let x2 = -14,
    y2 = 4;
  let x3 = -20,
    y3 = 0;
  let player1 = new Agent(teamA, x1, y1);
  player1.dt = dt;
  player1.manager = new Manager();

  let player2 = new Agent(teamA, x2, y2);
  player2.dt = dt;
  player2.manager = new Manager();

  let goalKeeper = new Agent(teamB, x3, y3);
  goalKeeper.dt = goal_keep_dt;
  goalKeeper.manager = new Manager();
  goalKeeper.goalie = true;

  await Socket(player1, teamA, VERSION);
  await Socket(player2, teamA, VERSION);
  await Socket(goalKeeper, teamB, VERSION, true);

  await player1.socketSend("move", `${x1} ${y1}`);
  await player2.socketSend("move", `${x2} ${y2}`);
  await goalKeeper.socketSend("move", `${x3} ${y3}`);
})();
