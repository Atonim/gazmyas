const Agent = require("./agent");
const Socket = require("./socket");

const VERSION = 7;

const teamNameLeft = "Gazmyas";
const teamNameRight = "Combine";

let x1, y1, x2, y2, rotate_speed;
try {
  x1 = process.argv[2];
  y1 = process.argv[3];
  x2 = process.argv[4];
  y2 = process.argv[5];
  rotate_speed = process.argv[6];
  if (
    x1 == null ||
    y1 == null ||
    x2 == null ||
    y2 == null ||
    rotate_speed == null
  )
    throw new Error();
  console.log("Params setted succesfully");
} catch {
  x1 = -15;
  y1 = 0;
  x2 = -10;
  y2 = 0;
  rotate_speed = 30;
}
tL = setTeamLeft();
//tR = setTeamRight()
tL[0].socketSend("move", `${x1} ${y1}`);
//tR[0].socketSend("move", `${x2} ${y2}`);
function setTeamLeft() {
  let team = [];
  team.push(new Agent(teamNameLeft, 1));
  Socket(team[0], teamNameLeft, VERSION);
  return team;
}
function setTeamRight() {
  let team = [];
  team.push(new Agent(teamNameRight, 1));
  Socket(team[0], teamNameRight, VERSION);
  return team;
}
