const rotation_angle = -45;
const gate_angle = 3;
const flag_distance = 3;
const ball_distance = 0.5;
const run_speed = 85;
const distance_for_slowdown = 3;
const slow_down = 0.8;

const DT = {
  state: {
    next: 0,
    go: 0,
    previous_play_on: false,
    cur_play_on: false,
    start_coords: [-20, 25],
    turn_angle: 0,
    sequence: [
      { act: "flag", fl: "fplb" },
      { act: "flag", fl: "fgrb" },
      { act: "kick", fl: "b", goal: "gr" },
    ],
  },
  root: {
    exec(mgr, state, p, cmd) {
      state.action = state.sequence[state.next];
      state.command = null;
    },
    next: "start",
  },
  start: {
    condition: (mgr, state, p, cmd) => cmd === "hear",
    trueCond: "hearProcessing",
    falseCond: "seeOrSenseProcessing",
  },
  seeOrSenseProcessing: {
    condition: (mgr, state, p, cmd) => cmd === "see",
    trueCond: "seeProcessing",
    falseCond: "senseProcessing",
  },
  senseProcessing: {
    exec(mgr, state, p, cmd) {
      if (cmd === "sense_body") {
        //console.log(p);
        state.turn_angle = p[3]["p"][1];
      }
    },
    next: "sendCommand",
  },

  hearProcessing: {
    exec(mgr, state, p, cmd) {
      state.previous_play_on = state.cur_play_on;
      state.cur_play_on = mgr.isPlayOn(p, state.cur_play_on);
    },
    next: "checkPlayMode",
  },
  checkPlayMode: {
    condition: (mgr, state, p, cmd) => state.cur_play_on,
    trueCond: "goCheck",
    falseCond: "isMoved",
  },
  goCheck: {
    exec(mgr, state, p, cmd) {
      let curGo = mgr.hearGo(p);
      if (curGo) {
        state.go = true;
      }
    },
    next: "sendCommand",
  },
  isMoved: {
    condition: (mgr, state, p, cmd) => state.previous_play_on,
    trueCond: "move2start",
    falseCond: "sendCommand",
  },
  move2start: {
    exec(mgr, state, p, cmd) {
      state.command = {
        n: "move",
        v: state.start_coords[0] + " " + state.start_coords[1],
      };
      state.next = 0;
      state.go = false;
    },
    next: "sendCommand",
  },
  seeProcessing: {
    condition: (mgr, state, p, cmd) => state.cur_play_on,
    trueCond: "goalPath",
    falseCond: "sendCommand",
  },
  goalPath: {
    condition(mgr, state, p, cmd) {
      return mgr.getVisible(state.action.fl, p);
    },
    trueCond: "rootNext",
    falseCond: "rotate",
  },
  rotate: {
    exec(mgr, state, p, cmd) {
      state.command = { n: "turn", v: rotation_angle };
    },
    next: "sendCommand",
  },
  rootNext: {
    condition: (mgr, state, p, cmd) => state.action.fl === "b",
    trueCond: "ballSeek",
    falseCond: "flagSeek",
  },
  ballSeek: {
    condition: (mgr, state, p) =>
      ball_distance > mgr.getDistance(state.action.fl, p),
    trueCond: "closeBall",
    falseCond: "checkFar",
  },
  checkFar: {
    condition: (mgr, state, p, cmd) =>
      distance_for_slowdown > mgr.getDistance(state.action.fl, p),
    trueCond: "slowRun",
    falseCond: "farGoal",
  },
  slowRun: {
    condition: (mgr, state, p, cmd) =>
      Math.abs(mgr.getAngle(state.action.fl, p)) > gate_angle,
    trueCond: "rotateToGoal",
    falseCond: "runSlow",
  },
  runSlow: {
    exec(mgr, state, p, cmd) {
      state.command = {
        n: "dash",
        v: Math.floor(run_speed * slow_down),
      };
    },
    next: "sendCommand",
  },
  closeBall: {
    condition: (mgr, state, p) => mgr.getVisible(state.action.goal, p),
    trueCond: "ballGoalVisible",
    falseCond: "ballGoalInvisible",
  },
  ballGoalVisible: {
    exec(mgr, state, p) {
      state.command = {
        n: "kick",
        v: `100 ${mgr.getAngle(state.action.goal, p)}`,
      };
    },
    next: "sendCommand",
  },
  ballGoalInvisible: {
    condition: (mgr, state, p) => mgr.lookAtBottomFlags(p),
    trueCond: "ballGoalInvisibleBottom",
    falseCond: "ballGoalInvisibleTop",
  },
  ballGoalInvisibleTop: {
    exec(mgr, state, p) {
      state.command = { n: "kick", v: `10 ${55}` };
    },
    next: "sendCommand",
  },
  ballGoalInvisibleBottom: {
    exec(mgr, state, p) {
      state.command = { n: "kick", v: `10 ${-55}` };
    },
    next: "sendCommand",
  },
  flagSeek: {
    condition: (mgr, state, p, cmd) => state.go && mgr.getVisible("b", p),
    trueCond: "score",
    falseCond: "catchFlag",
  },
  score: {
    exec(mgr, state, p, cmd) {
      state.next = 2;
    },
    next: "ballSeek",
  },
  catchFlag: {
    condition: (mgr, state, p, cmd) =>
      flag_distance > mgr.getDistance(state.action.fl, p),
    trueCond: "closeFlag",
    falseCond: "farGoal",
  },
  closeFlag: {
    exec(mgr, state, p, cmd) {
      state.next++;
      state.action = state.sequence[state.next];
    },
    next: "seeProcessing",
  },
  farGoal: {
    condition: (mgr, state, p, cmd) =>
      Math.abs(mgr.getAngle(state.action.fl, p)) > gate_angle,
    trueCond: "rotateToGoal",
    falseCond: "runToGoal",
  },
  rotateToGoal: {
    exec(mgr, state, p, cmd) {
      state.command = { n: "turn", v: mgr.getAngle(state.action.fl, p) };
    },
    next: "sendCommand",
  },
  runToGoal: {
    exec(mgr, state, p, cmd) {
      state.command = { n: "dash", v: run_speed };
    },
    next: "sendCommand",
  },
  sendCommand: {
    command: (mgr, state, p, cmd) => state.command,
  },
};

module.exports = DT;
