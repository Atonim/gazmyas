const FLAG = "flag";
const KICK = "kick";
const CATCH = "catch";
const TURN = "turn";
const DASH = "dash";

const BALL = "b";
const GOAL_RIGHT = "gr";
const GOAL_LEFT = "gl";

const FULL_SPEED = 100;
const MID_SPEED = 80;
const LOW_SPEED = 60;

const FULL_POWER = 100;
const MID_POWER = 70;
const LOW_POWER = 40;

const SEARCHING_ANGLE = 20;

const BALL_DISTANCE = 0.5;
const FLAG_DISTANCE = 3;

const HIGH_BALL_ANGLE = 20;
const LOW_BALL_ANGLE = 10;
const HIGH_BALL_DISTANCE = 70;
const MID_BALL_DISTANCE = 50;
const LOW_BALL_DISTANCE = 30;

const HIGH_FLAG_ANGLE = 20;
const MID_FLAG_ANGLE = 10;
const LOW_FLAG_ANGLE = 5;
const HIGH_FLAG_DISTANCE = 70;
const MID_FLAG_DISTANCE = 50;
const LOW_FLAG_DISTANCE = 30;

const player = [{ act: KICK, fl: BALL, goal: GOAL_RIGHT }];

const goalkeeper = [
  { act: FLAG, fl: GOAL_RIGHT },

  { act: KICK, fl: BALL, goal: GOAL_LEFT },
];

//{ act: CATCH, fl: BALL, goal: GOAL_LEFT },

//class Player {
//  constructor(){
//      this.index = 0;
//      this.actions = player;
//      this.command = null;
//      this.next = this.root
//    }

//  goNextAction() {
//    this.index = (this.index + 1) % this.actions.length;
//  }

//  root(){
//    this.next = this.isTargetVisible
//  }

//  isTargetVisible() {

//  }

//}

const DT = {
  player: {
    init() {
      this.state = {
        index: 0,
        goNextAction() {
          this.index = (this.index + 1) % this.actions.length;
        },
        actions: player,
        command: null,
      };
      return this;
    },
    root: {
      exec(manager, state) {
        state.action = state.actions[state.index];
        state.command = null;
      },
      next: "isTargetVisible",
    },
    isTargetVisible: {
      condition: (manager, state) => manager.isVisible(state.action.fl),
      trueCond: "isFlagSearching",
      falseCond: "rotate",
    },
    rotate: {
      exec(manager, state) {
        state.command = { n: TURN, v: SEARCHING_ANGLE };
      },
      next: "sendCommand",
    },
    isFlagSearching: {
      condition: (manager, state) => state.action.act == FLAG,
      trueCond: "isFlagClose",
      falseCond: "isBallClose",
    },
    isFlagClose: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) < FLAG_DISTANCE,
      trueCond: "nextAction",
      falseCond: "isFlagAngleHigh",
    },
    nextAction: {
      exec(manager, state) {
        state.index++;
        state.action = state.actions[state.index];
      },
      next: "isTargetVisible",
    },
    isFlagAngleHigh: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) > HIGH_FLAG_ANGLE,
      trueCond: "rotateToTarget",
      falseCond: "isFlagAngleLow",
    },
    isFlagAngleLow: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) < LOW_FLAG_ANGLE,
      trueCond: "rotateToTarget",
      falseCond: "isFlagDistanceHighAndAngleMid",
    },
    isFlagDistanceHighAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > HIGH_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= MID_FLAG_ANGLE,
      trueCond: "runFullSpeed",
      falseCond: "isFlagDistanceMidAndAngleMid",
    },
    isFlagDistanceMidAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= MID_FLAG_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "isFlagDistanceLowAndAngleMid",
    },
    isFlagDistanceLowAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > LOW_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= MID_FLAG_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "isFlagDistanceMidAndAngleBelowHigh",
    },
    isFlagDistanceMidAndAngleBelowHigh: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= HIGH_FLAG_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "rotateToTarget",
    },
    rotateToTarget: {
      exec(manager, state) {
        state.command = { n: TURN, v: manager.getAngle(state.action.fl) };
      },
      next: "sendCommand",
    },
    runFullSpeed: {
      exec(manager, state) {
        state.command = { n: DASH, v: FULL_SPEED };
      },
      next: "sendCommand",
    },
    runMidSpeed: {
      exec(manager, state) {
        state.command = { n: DASH, v: MID_SPEED };
      },
      next: "sendCommand",
    },
    runLowSpeed: {
      exec(manager, state) {
        state.command = { n: DASH, v: LOW_SPEED };
      },
      next: "sendCommand",
    },
    sendCommand: {
      command: (manager, state) => state.command,
    },
    isBallClose: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) < BALL_DISTANCE,
      trueCond: "isGoalVisible",
      falseCond: "isBallAngleHigh",
    },
    isBallAngleHigh: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) > HIGH_BALL_ANGLE,
      trueCond: "rotateToTarget",
      falseCond: "isBallDistanceLow",
    },
    isBallDistanceLow: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) <= LOW_BALL_DISTANCE,
      trueCond: "runLowSpeed",
      falseCond: "isBallDistanceHighAndAngleLow",
    },
    isBallDistanceHighAndAngleLow: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > HIGH_BALL_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= LOW_BALL_ANGLE,
      trueCond: "runFullSpeed",
      falseCond: "isBallDistanceMidAndAngleLow",
    },
    isBallDistanceMidAndAngleLow: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_BALL_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= LOW_BALL_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "isBallDistanceLowAndAngleLow",
    },
    isBallDistanceLowAndAngleLow: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > LOW_BALL_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= LOW_BALL_ANGLE,
      trueCond: "runLowSpeed",
      falseCond: "isBallDistanceMidAndAngleMid",
    },
    isBallDistanceMidAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_BALL_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= HIGH_BALL_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "rotateToTarget",
    },
    isGoalVisible: {
      condition: (manager, state) => manager.isVisible(state.action.goal),
      trueCond: "kickFullPower",
      falseCond: "kickLowPower",
    },
    kickFullPower: {
      exec(manager, state) {
        state.command = {
          n: KICK,
          v: `${FULL_POWER} ${manager.getAngle(state.action.goal)}`,
        };
      },
      next: "sendCommand",
    },
    kickMidPower: {
      exec(manager, state) {
        state.command = {
          n: KICK,
          v: `${MID_POWER} ${manager.getAngle(state.action.goal)}`,
        };
      },
      next: "sendCommand",
    },
    kickLowPower: {
      exec(manager, state) {
        state.command = { n: KICK, v: `${LOW_POWER} ${SEARCHING_ANGLE}` };
      },
      next: "sendCommand",
    },
  },

  groupPlayer: {
    init() {
      this.state = {
        index: 0,

        goNextAction() {
          this.index = (this.index + 1) % this.actions.length;
        },

        actions: player,

        command: null,
      };

      return this;
    },

    root: {
      exec(manager, state) {
        state.action = state.actions[state.index];

        state.command = null;
      },

      next: "isLeader",
    },

    isLeader: {
      condition: (manager, state) => manager.isLeader,

      trueCond: "isTargetVisible",

      falseCond: "leaderVisible",
    },

    isTargetVisible: {
      condition: (manager, state) => manager.isVisible(state.action.fl),
      trueCond: "isFlagSearching",
      falseCond: "rotate",
    },
    rotate: {
      exec(manager, state) {
        state.command = { n: TURN, v: SEARCHING_ANGLE };
      },
      next: "sendCommand",
    },
    isFlagSearching: {
      condition: (manager, state) => state.action.act == FLAG,
      trueCond: "isFlagClose",
      falseCond: "isBallClose",
    },
    isFlagClose: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) < FLAG_DISTANCE,
      trueCond: "nextAction",
      falseCond: "isFlagAngleHigh",
    },
    nextAction: {
      exec(manager, state) {
        state.index++;
        state.action = state.actions[state.index];
      },
      next: "isTargetVisible",
    },
    isFlagAngleHigh: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) > HIGH_FLAG_ANGLE,
      trueCond: "rotateToTarget",
      falseCond: "isFlagAngleLow",
    },
    isFlagAngleLow: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) < LOW_FLAG_ANGLE,
      trueCond: "rotateToTarget",
      falseCond: "isFlagDistanceHighAndAngleMid",
    },
    isFlagDistanceHighAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > HIGH_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= MID_FLAG_ANGLE,
      trueCond: "runFullSpeed",
      falseCond: "isFlagDistanceMidAndAngleMid",
    },
    isFlagDistanceMidAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= MID_FLAG_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "isFlagDistanceLowAndAngleMid",
    },
    isFlagDistanceLowAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > LOW_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= MID_FLAG_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "isFlagDistanceMidAndAngleBelowHigh",
    },
    isFlagDistanceMidAndAngleBelowHigh: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= HIGH_FLAG_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "rotateToTarget",
    },
    rotateToTarget: {
      exec(manager, state) {
        state.command = { n: TURN, v: manager.getAngle(state.action.fl) };
      },
      next: "sendCommand",
    },
    runFullSpeed: {
      exec(manager, state) {
        state.command = { n: DASH, v: FULL_SPEED };
      },
      next: "sendCommand",
    },
    runMidSpeed: {
      exec(manager, state) {
        state.command = { n: DASH, v: MID_SPEED };
      },
      next: "sendCommand",
    },
    runLowSpeed: {
      exec(manager, state) {
        state.command = { n: DASH, v: LOW_SPEED };
      },
      next: "sendCommand",
    },
    sendCommand: {
      command: (manager, state) => state.command,
    },
    isBallClose: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) < BALL_DISTANCE,
      trueCond: "isGoalVisible",
      falseCond: "isBallAngleHigh",
    },
    isBallAngleHigh: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) > HIGH_BALL_ANGLE,
      trueCond: "rotateToTarget",
      falseCond: "isBallDistanceLow",
    },
    isBallDistanceLow: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) <= LOW_BALL_DISTANCE,
      trueCond: "runLowSpeed",
      falseCond: "isBallDistanceHighAndAngleLow",
    },
    isBallDistanceHighAndAngleLow: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > HIGH_BALL_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= LOW_BALL_ANGLE,
      trueCond: "runFullSpeed",
      falseCond: "isBallDistanceMidAndAngleLow",
    },
    isBallDistanceMidAndAngleLow: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_BALL_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= LOW_BALL_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "isBallDistanceLowAndAngleLow",
    },
    isBallDistanceLowAndAngleLow: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > LOW_BALL_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= LOW_BALL_ANGLE,
      trueCond: "runLowSpeed",
      falseCond: "isBallDistanceMidAndAngleMid",
    },
    isBallDistanceMidAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_BALL_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= HIGH_BALL_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "rotateToTarget",
    },
    isGoalVisible: {
      condition: (manager, state) => manager.isVisible(state.action.goal),
      trueCond: "kickFullPower",
      falseCond: "kickLowPower",
    },
    kickFullPower: {
      exec(manager, state) {
        state.command = {
          n: KICK,
          v: `${FULL_POWER} ${manager.getAngle(state.action.goal)}`,
        };
      },
      next: "sendCommand",
    },
    kickMidPower: {
      exec(manager, state) {
        state.command = {
          n: KICK,
          v: `${MID_POWER} ${manager.getAngle(state.action.goal)}`,
        };
      },
      next: "sendCommand",
    },
    kickLowPower: {
      exec(manager, state) {
        state.command = { n: KICK, v: `${LOW_POWER} ${SEARCHING_ANGLE}` };
      },
      next: "sendCommand",
    },

    leaderVisible: {
      condition: (manager, state) => manager.teammates.length > 0,

      trueCond: "closeToLeader",

      falseCond: "rotate90",
    },

    closeToLeader: {
      condition: (manager, state) =>
        manager.teammates[0].cmd.p[0] <= 1 &&
        Math.abs(manager.teammates[0].cmd.p[1]) < 40,

      trueCond: "rotate30",

      falseCond: "farToLeader",
    },

    farToLeader: {
      condition: (manager, state) => manager.teammates[0].cmd.p[0] > 10,

      trueCond: "goToLeader",

      falseCond: "midDistToLeader",
    },

    midDistToLeader: {
      condition: (manager, state) =>
        manager.teammates[0].cmd.p[1] > 40 ||
        manager.teammates[0].cmd.p[1] < 25,

      trueCond: "rotateMinus30",

      falseCond: "midMidDistToLeader",
    },

    midMidDistToLeader: {
      condition: (manager, state) => manager.teammates[0].cmd.p[0] < 7,

      trueCond: "dash20",

      falseCond: "dash40",
    },

    goToLeader: {
      condition: (manager, state) =>
        Math.abs(manager.teammates[0].cmd.p[1]) > 5,

      trueCond: "rotateToLeader",

      falseCond: "runToGoal",
    },

    rotateToLeader: {
      exec(manager, state) {
        state.command = { n: "turn", v: manager.teammates[0].cmd.p[1] };
      },

      next: "sendCommand",
    },

    isTargetVisible: {
      condition: (manager, state) => manager.isVisible(state.action.fl),

      trueCond: "rootNext",

      falseCond: "rotate90",
    },

    rotate90: {
      exec(manager, state) {
        state.command = { n: "turn", v: "90" };
      },

      next: "sendCommand",
    },

    rotate30: {
      exec(manager, state) {
        state.command = { n: "turn", v: "30" };
      },

      next: "sendCommand",
    },

    rotateMinus30: {
      exec(manager, state) {
        state.command = { n: "turn", v: "-30" };
      },

      next: "sendCommand",
    },

    rootNext: {
      condition: (manager, state) => state.action.act == FLAG,

      trueCond: "flagSeek",

      falseCond: "isBallClose",
    },

    flagSeek: {
      condition: (manager, state) => 3 > manager.getDistance(state.action.fl),

      trueCond: "closeFlag",

      falseCond: "farGoal",
    },

    closeFlag: {
      exec(manager, state) {
        state.increaseNext();

        state.action = state.actions[state.index];
      },

      next: "isTargetVisible",
    },

    farGoal: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) > 4,

      trueCond: "rotateToGoal",

      falseCond: "runToGoal",
    },

    rotateToGoal: {
      exec(manager, state) {
        state.command = { n: "turn", v: manager.getAngle(state.action.fl) };
      },

      next: "sendCommand",
    },

    runToGoal: {
      exec(manager, state) {
        state.command = { n: "dash", v: 100 };
      },

      next: "sendCommand",
    },

    dash20: {
      exec(manager, state) {
        state.command = { n: "dash", v: 20 };
      },

      next: "sendCommand",
    },

    dash40: {
      exec(manager, state) {
        state.command = { n: "dash", v: 40 };
      },

      next: "sendCommand",
    },

    sendCommand: {
      command: (manager, state) => state.command,
    },

    isBallClose: {
      condition: (manager, state) => 0.5 > manager.getDistance(state.action.fl),

      trueCond: "closeBall",

      falseCond: "farGoal",
    },

    closeBall: {
      // exec(manager, state) {

      // 	state.command = { n: 'kick', v: `100 ${manager.getKickAngle(state.action.goal)}` };

      // },

      // next: 'sendCommand',

      condition: (manager, state) => manager.isVisible(state.action.goal),

      trueCond: "ballGoalVisible",

      falseCond: "ballGoalInvisible",
    },

    ballGoalVisible: {
      exec(manager, state) {
        state.command = {
          n: "kick",

          v: `100 ${manager.getAngle(state.action.goal)}`,
        };
      },

      next: "sendCommand",
    },

    ballGoalInvisible: {
      exec(manager, state) {
        state.command = { n: "kick", v: "10 45" };
      },

      next: "sendCommand",
    },
  },

  goalkeeper: {
    init() {
      this.state = {
        index: 0,
        goNextAction() {
          this.index = (this.index + 1) % this.actions.length;
        },
        actions: goalkeeper,
        command: null,
      };
      return this;
    },
    root: {
      exec(manager, state) {
        state.action = state.actions[state.index];
        state.command = null;
      },
      next: "isGoalkeeperInPenaltyZone",
    },
    isGoalkeeperInPenaltyZone: {
      condition: (manager, state) => {
        return manager.isGoalkeeperInPenaltyZone();
      },
      trueCond: "isActionFlag",
      falseCond: "isGoalVisible",
    },
    isGoalVisible: {
      condition: (manager, state) => manager.isVisible(state.action.fl),
      trueCond: "isGoalDirected",
      falseCond: "rotate",
    },
    isGoalDirected: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) < LOW_FLAG_ANGLE,
      trueCond: "runFullSpeed",
      falseCond: "rotateToTarget",
    },
    isActionFlag: {
      condition: (manager, state) => {
        return state.action.act === FLAG;
      },

      trueCond: "switchToBall",
      falseCond: "isBallVisible",
    },
    isBallVisible: {
      condition: (manager, state) => {
        console.log("ball", manager.isBallSeen);
        console.log(state.action.act);
        return manager.isBallSeen;
      },

      trueCond: "isBallClose",
      falseCond: "rotate",
    },
    isBallClose: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) < BALL_DISTANCE,
      trueCond: "isEnemyGoalVisible",
      falseCond: "isBallInPenaltyZone",
    },
    isEnemyGoalVisible: {
      condition: (manager, state) => manager.isVisible(state.action.goal),
      trueCond: "ballKick",
      falseCond: "rotate",
    },
    isBallInPenaltyZone: {
      condition: (manager, state) => manager.isBallInPenaltyZone(),

      trueCond: "isBallDirected",

      falseCond: "rotateToTarget",
    },
    isBallDirected: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) < LOW_BALL_ANGLE,
      trueCond: "runFullSpeed",
      falseCond: "rotateToTarget",
    },
    switchToBall: {
      exec(manager, state) {
        state.index++;
        state.action = state.actions[state.index];
      },
      next: "isBallVisible",
    },
    isTargetVisible: {
      condition: (manager, state) => manager.isVisible(state.action.fl),
      trueCond: "isFlagSearching",
      falseCond: "rotate",
    },
    rotate: {
      exec(manager, state) {
        state.command = { n: "turn", v: SEARCHING_ANGLE };
      },
      next: "sendCommand",
    },

    isFlagSearching: {
      condition: (manager, state) => state.action.act == FLAG,
      trueCond: "isFlagClose",
      falseCond: "isCatchAction",
    },
    isFlagClose: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) < FLAG_DISTANCE,
      trueCond: "nextAction",
      falseCond: "isFlagAngleHigh",
    },
    nextAction: {
      exec(manager, state) {
        state.index++;
        state.action = state.actions[state.index];
      },
      next: "isTargetVisible",
    },
    isFlagAngleHigh: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) > HIGH_FLAG_ANGLE,
      trueCond: "rotateToTarget",
      falseCond: "isFlagAngleLow",
    },
    isFlagAngleLow: {
      condition: (manager, state) =>
        Math.abs(manager.getAngle(state.action.fl)) < LOW_FLAG_ANGLE,
      trueCond: "rotateToTarget",
      falseCond: "isFlagDistanceHighAndAngleMid",
    },
    isFlagDistanceHighAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > HIGH_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= MID_FLAG_ANGLE,
      trueCond: "runFullSpeed",
      falseCond: "isFlagDistanceMidAndAngleMid",
    },
    isFlagDistanceMidAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= MID_FLAG_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "isFlagDistanceLowAndAngleMid",
    },
    isFlagDistanceLowAndAngleMid: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > LOW_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= MID_FLAG_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "isFlagDistanceMidAndAngleBelowHigh",
    },
    isFlagDistanceMidAndAngleBelowHigh: {
      condition: (manager, state) =>
        manager.getDistance(state.action.fl) > MID_FLAG_DISTANCE &&
        Math.abs(manager.getAngle(state.action.fl)) <= HIGH_FLAG_ANGLE,
      trueCond: "runMidSpeed",
      falseCond: "rotateToTarget",
    },
    rotateToTarget: {
      exec(manager, state) {
        state.command = { n: TURN, v: manager.getAngle(state.action.fl) };
      },
      next: "sendCommand",
    },
    runFullSpeed: {
      exec(manager, state) {
        state.command = { n: DASH, v: FULL_SPEED };
      },
      next: "sendCommand",
    },
    runMidSpeed: {
      exec(manager, state) {
        state.command = { n: DASH, v: MID_SPEED };
      },
      next: "sendCommand",
    },
    runLowSpeed: {
      exec(manager, state) {
        state.command = { n: DASH, v: LOW_SPEED };
      },
      next: "sendCommand",
    },
    sendCommand: {
      command: (manager, state) => state.command,
    },

    isCatchAction: {
      condition: (manager, state) => state.action.act == CATCH,

      trueCond: "isBallClose",

      falseCond: "isInPenaltyZoneAndInContact",
    },
    flagSeek: {
      condition: (manager, state) => 5 > manager.getDistance(state.action.fl),

      trueCond: "closeFlag",

      falseCond: "farGoal",
    },

    closeFlag: {
      exec(manager, state) {
        state.increaseNext();

        state.action = state.actions[state.index];
      },

      next: "isTargetVisible",
    },

    rotateToGoal: {
      exec(manager, state) {
        state.command = { n: "turn", v: manager.getAngle(state.action.fl) };
      },

      next: "sendCommand",
    },

    sendCommand: {
      command: (manager, state) => state.command,
    },

    isBallInContact: {
      condition: (manager, state) =>
        BALL_DISTANCE > manager.getDistance(state.action.fl),

      trueCond: "ballKick",

      falseCond: "catchBall",
    },

    catchBall: {
      exec(manager, state) {
        state.command = {
          n: CATCH,
          v: `${manager.getAngle(state.action.fl)}`,
        };

        state.increaseNext();
      },

      next: "sendCommand",
    },

    isInPenaltyZoneAndInContact: {
      condition: (manager, state) =>
        BALL_DISTANCE > manager.getDistance(state.action.fl) &&
        manager.isInPenaltyZone(),

      trueCond: "ballKick",

      falseCond: "runToGoal",
    },

    ballKick: {
      exec(manager, state) {
        state.command = {
          n: KICK,

          v: `${FULL_POWER} ${manager.getAngle(state.action.goal)}`,
        };

        state.increaseNext();
      },

      next: "sendCommand",
    },

    stay: {
      exec(manager, state) {
        state.command = null;
      },

      next: "sendCommand",
    },
  },
};

module.exports = { DT };
