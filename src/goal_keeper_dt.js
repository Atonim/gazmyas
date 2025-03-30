const right_gate = "gr";
const left_gate = "gl";

const rotate_angle = 90;

const ball_distance = 0.5;
const ball_close_angle = 5;
const ball_close_distance = 14;

const gate_close_distance = 3;
const gate_close_angle = 4;

const run_full = 100;
const kick_full = 100;

const DT = {
  state: {
    inGates: false,
    command: null,
    kick: { act: "kick", fl: "b", goal: "gl" },
    catch: 0,
  },
  root: {
    exec(mgr, state, p) {
      state.command = null;
    },
    next: "isGoalieInGates",
  },
  isGoalieInGates: {
    condition: (mgr, state, p) => state.inGates,
    trueCond: "isBallCatched",
    falseCond: "isRGateVisible",
  },
  isBallCatched: {
    condition: (mgr, state, p) => state.catch > 0,
    trueCond: "isLGateVisible",
    falseCond: "isBallVisible",
  },
  isLGateVisible: {
    condition: (mgr, state, p) => mgr.getVisible(left_gate, p),
    trueCond: "getLGateAngle",
    falseCond: "rotate",
  },
  getLGateAngle: {
    exec(mgr, state, p) {
      state.left_gates_angle = mgr.getAngle(left_gate, p);
    },
    next: "kickFull",
  },
  kickFull: {
    exec(mgr, state, p) {
      state.command = {
        n: "kick",
        v: kick_full + " " + state.left_gates_angle,
      };
    },
    next: "reset",
  },
  reset: {
    exec(mgr, state, p) {
      state.inGates = false;
      state.catch = 0;
    },
    next: "sendCommand",
  },
  isBallVisible: {
    condition: (mgr, state, p) => mgr.getVisible("b", p),
    trueCond: "getBallStats",
    falseCond: "rotate",
  },
  getBallStats: {
    exec(mgr, state, p) {
      state.ballAngle = mgr.getAngle("b", p);
      state.ballDistance = mgr.getDistance("b", p);
    },
    next: "isBallCatchable",
  },
  isBallCatchable: {
    condition: (mgr, state, p) => state.ballDistance < ball_distance,
    trueCond: "catchBall",
    falseCond: "isDirectedToBall",
  },
  catchBall: {
    exec(mgr, state, p) {
      state.command = { n: "catch", v: -state.ballAngle };
      state.catched = true;
    },
    next: "sendCommand",
  },
  isDirectedToBall: {
    condition: (mgr, state, p) => Math.abs(state.ballAngle) < ball_close_angle,
    trueCond: "isBallClose",
    falseCond: "rotateToBall",
  },
  isBallClose: {
    condition: (mgr, state, p) => state.ballDistance < ball_close_distance,
    trueCond: "isPlayerVisible",
    falseCond: "sendCommand",
  },
  isPlayerVisible: {
    condition: (mgr, state, p) => mgr.getVisible("p", p),
    trueCond: "getPlayerDistance",
    falseCond: "runFull",
  },
  getPlayerDistance: {
    exec(mgr, state, p) {
      state.playerDistance = mgr.getDistance("p", p);
    },
    next: "isPlayerClose",
  },
  isPlayerClose: {
    condition: (mgr, state, p) =>
      state.playerDistance - state.ballDistance > 0 &&
      state.playerDistance - state.ballDistance > state.ballDistance,
    trueCond: "runFull",
    falseCond: "sendCommand",
  },
  rotateToBall: {
    exec(mgr, state, p) {
      state.command = { n: "turn", v: state.ballAngle };
    },
    next: "sendCommand",
  },
  isRGateVisible: {
    condition(mgr, state, p) {
      return mgr.getVisible(right_gate, p);
    },
    trueCond: "isGateClose",
    falseCond: "rotate",
  },
  rotate: {
    exec(mgr, state, p) {
      state.command = { n: "turn", v: rotate_angle };
    },
    next: "sendCommand",
  },
  isGateClose: {
    condition: (mgr, state, p) =>
      mgr.getDistance(right_gate, p) < gate_close_distance,
    trueCond: "setInGates",
    falseCond: "isDirectedToGate",
  },
  setInGates: {
    exec(mgr, state, p) {
      state.inGates = true;
      let angle = mgr.getAngle(right_gate, p);
      let turnAngle = angle + 180;
      if (turnAngle > 180) {
        turnAngle = -(360 - turnAngle);
      }
      state.command;
    },
    next: "sendCommand",
  },
  isDirectedToGate: {
    condition: (mgr, state, p) =>
      mgr.getAngle(right_gate, p) <= gate_close_angle,
    trueCond: "runFull",
    falseCond: "rotateToGate",
  },
  rotateToGate: {
    exec(mgr, state, p) {
      state.command = { n: "turn", v: mgr.getAngle(right_gate, p) };
    },
    next: "sendCommand",
  },
  runFull: {
    exec(mgr, state, p) {
      state.command = { n: "dash", v: run_full };
    },
    next: "sendCommand",
  },
  sendCommand: {
    command: (mgr, state) => state.command,
  },
};

module.exports = DT;
