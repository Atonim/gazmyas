const FLAG = "flag",
  KICK = "kick",
  PLAYER = "p",
  BALL = "b",
  GATE = "gr",
  FLAG_TOP = "ftr20";
const gate_angle = 4;

const rotate = 75;

const full_speed = 100;
const mid_speed = 60;
const low_speed = 40;
const superlow_speed = 5;

const far_player_dist = 13;
const mid_player_dist = 7;
const close_player_dist = 2;

const holded_angle = 35;
const around_angle_low = 20;
const around_angle_high = 30;

const ball_distance = 0.5;
const ball_close_angle = 5;
const ball_close_distance = 14;

const flag_close_distance = 3;
const gate_close_angle = 4;

const leader_close_distance = 14;
const leader_stop = 7;

const face_dir_acceptable = 90;

const kick_low = 15;

const DT = {
  state: {
    next: 0,
    sequence: [
      { act: FLAG, fl: FLAG_TOP },
      { act: KICK, fl: BALL, goal: GATE },
    ],
    command: null,
    leader: null,
  },
  root: {
    exec(mgr, state, p) {
      state.action = state.sequence[state.next];
      state.command = null;
    },
    next: "isLeaderDefined",
  },
  isLeaderDefined: {
    condition: (mgr, state, p) => state.leader === null,
    trueCond: "isPlayerVisible",
    falseCond: "isLeader",
  },
  isPlayerVisible: {
    condition: (mgr, state, p) => mgr.getVisible(PLAYER, p),
    trueCond: "setSlave",
    falseCond: "setLeader",
  },
  setLeader: {
    exec(mgr, state, p) {
      state.leader = true;
    },
    next: "isSlaveVisible",
  },
  setSlave: {
    exec(mgr, state, p) {
      state.leader = false;
    },
    next: "isLeaderVisible",
  },
  isLeader: {
    condition: (mgr, state, p) => state.leader,
    trueCond: "isSlaveVisible",
    falseCond: "isLeaderVisible",
  },
  isLeaderVisible: {
    condition: (mgr, state, p) => mgr.getVisible(PLAYER, p),
    trueCond: "getLeaderStats",
    falseCond: "rotate",
  },
  getLeaderStats: {
    exec(mgr, state, p) {
      //state.command = null;
      state.dist = mgr.getDistance(PLAYER, p);
      state.angle = mgr.getAngle(PLAYER, p);
    },
    next: "isLeaderClose",
  },
  isLeaderClose: {
    condition: (mgr, state, p) => state.dist <= leader_close_distance,
    trueCond: "getLeaderFaceDir",
    falseCond: "isCollisionPossible",
  },
  getLeaderFaceDir: {
    exec(mgr, state, p) {
      state.faceDir = mgr.getFaceDir(PLAYER, p);
    },
    next: "isFaceDirAcceptable",
  },
  isFaceDirAcceptable: {
    condition: (mgr, state, p) =>
      Math.abs(state.faceDir) <= face_dir_acceptable,
    trueCond: "isCollisionPossible",
    falseCond: "around",
  },
  around: {
    condition: (mgr, state, p) =>
      state.angle >= -around_angle_high && state.angle <= -around_angle_low,
    trueCond: "runFull",
    falseCond: "turnByFaceDir",
  },
  turnByFaceDir: {
    exec(mgr, state, p) {
      state.command = { n: "turn", v: state.angle + around_angle_high };
    },
    next: "sendCommand",
  },
  isCollisionPossible: {
    condition: (mgr, state, p) =>
      state.dist < close_player_dist && Math.abs(state.angle) < 40,
    trueCond: "rotate30",
    falseCond: "isPlayerFar",
  },
  rotate30: {
    exec(mgr, state, p) {
      state.command = { n: "turn", v: 30 };
    },
    next: "sendCommand",
  },
  isPlayerFar: {
    condition: (mgr, state, p) => state.dist > far_player_dist,
    trueCond: "isAngleHigh",
    falseCond: "isAngleAcceptable",
  },
  isAngleHigh: {
    condition: (mgr, state, p) => Math.abs(state.angle) > 5,
    trueCond: "rotateToLeader",
    falseCond: "runFull",
  },
  rotateToLeader: {
    exec(mgr, state, p) {
      state.command = { n: "turn", v: state.angle };
    },
    next: "sendCommand",
  },
  runFull: {
    exec(mgr, state, p) {
      state.command = { n: "dash", v: full_speed };
    },
    next: "sendCommand",
  },
  isAngleAcceptable: {
    condition: (mgr, state, p) => state.angle > 40 || state.angle < 30,
    trueCond: "holdAngle",
    falseCond: "holdDistance",
  },
  holdAngle: {
    exec(mgr, state, p) {
      state.command = { n: "turn", v: state.angle - holded_angle };
    },
    next: "sendCommand",
  },
  holdDistance: {
    condition: (mgr, state, p) => state.dist < mid_player_dist,
    trueCond: "runLow",
    falseCond: "runMid",
  },
  runLow: {
    exec(mgr, state, p) {
      state.command = { n: "dash", v: low_speed };
    },
    next: "sendCommand",
  },
  runMid: {
    exec(mgr, state, p) {
      state.command = { n: "dash", v: mid_speed };
    },
    next: "sendCommand",
  },
  isSlaveVisible: {
    condition: (mgr, state, p) => mgr.getVisible("p", p),
    trueCond: "isSlaveClose",
    falseCond: "isBallVisible",
  },
  isSlaveClose: {
    condition(mgr, state, p) {
      return mgr.getDistance("p", p) < leader_stop; //close_player_dist;
    },
    trueCond: "runSuperLow",
    falseCond: "isBallVisible",
  },
  runSuperLow: {
    exec(mgr, state, p) {
      state.command = { n: "dash", v: superlow_speed };
    },
    next: "sendCommand",
  },
  isBallVisible: {
    condition(mgr, state, p) {
      return mgr.getVisible(state.action.fl, p);
    },
    trueCond: "isActionFlag",
    falseCond: "rotate",
  },
  rotate: {
    exec(mgr, state, p) {
      state.command = { n: "turn", v: rotate };
    },
    next: "sendCommand",
  },
  isActionFlag: {
    condition: (mgr, state, p) => state.action.act == FLAG,
    trueCond: "isFlagClose",
    falseCond: "isBallClose",
  },
  isFlagClose: {
    condition: (mgr, state, p) =>
      flag_close_distance > mgr.getDistance(state.action.fl, p),
    trueCond: "setNextAction",
    falseCond: "isDirectedToGate",
  },
  setNextAction: {
    exec(mgr, state, p) {
      state.next++;
      state.action = state.sequence[state.next];
    },
    next: "isSlaveVisible",
  },
  isDirectedToGate: {
    condition: (mgr, state, p) =>
      Math.abs(mgr.getAngle(state.action.fl, p)) < gate_angle,
    trueCond: "runMid",
    falseCond: "rotateToGate",
  },
  rotateToGate: {
    exec(mgr, state, p) {
      state.command = { n: "turn", v: mgr.getAngle(state.action.fl, p) };
    },
    next: "sendCommand",
  },
  sendCommand: {
    command: (mgr, state) => state.command,
  },
  isBallClose: {
    condition: (mgr, state, p) =>
      ball_distance > mgr.getDistance(state.action.fl, p),
    trueCond: "isGateVisible",
    falseCond: "isDirectedToGate",
  },
  isGateVisible: {
    condition: (mgr, state, p) => mgr.getVisible(state.action.goal, p),
    trueCond: "kickFull",
    falseCond: "isLookingBottom",
  },
  kickFull: {
    exec(mgr, state, p) {
      state.command = {
        n: "kick",
        v: `100 ${mgr.getAngle(state.action.goal, p)}`,
      };
    },
    next: "sendCommand",
  },
  isLookingBottom: {
    condition: (mgr, state, p) => mgr.lookAtBottomFlags(p),
    trueCond: "kickLowBottom",
    falseCond: "kickLowTop",
  },
  kickLowTop: {
    exec(mgr, state, p) {
      state.command = { n: "kick", v: `${kick_low} ${55}` };
    },
    next: "sendCommand",
  },
  kickLowBottom: {
    exec(mgr, state, p) {
      state.command = { n: "kick", v: `${kick_low} ${-55}` };
    },
    next: "sendCommand",
  },
};

module.exports = DT;
