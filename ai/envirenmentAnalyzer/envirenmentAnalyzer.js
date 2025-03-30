const Flags = require("./flags");
const CalcPos = require("./positionCalculator");

class EnvirenmentAnalyzer {
  constructor(team, side = "l") {
    this.time = 0;
    this.team = team;
    this.fieldSide = side;
    this.x = Infinity;
    this.y = Infinity;

    this.visibleFlags = [];
    this.teammates = [];
    this.opponents = [];

    this.isBallSeen = false;
    this.ballCoords = { x: NaN, y: NaN, d: NaN, a: NaN };

    this.isLeader;
  }
  getPlayerCoords() {
    let [x, y] = [this.x, this.y];
    if (this.fieldSide === "r") {
      return [x, y];
    }
    return [x, y];
  }
  changeCoordsBySide(coords) {
    if (this.fieldSide === "r") {
      return [coords[0], coords[1]];
    }
    return [coords[0], coords[1]];
  }

  analyzeVisibleInformation(information) {
    this.opponents = [];
    this.visibleFlags = [];
    this.isBallSeen = false;
    information = this.__parseTimeFrom(information);
    this.__parseVisible(information);

    this.__calculateAgentPosition();
  }

  isGoalkeeperInPenaltyZone(side = "r") {
    // console.log('inPenaltyZone', this.pos)
    const x = this.x;
    const y = this.y;
    const { fprt, fprb, fplt, fplb } = Flags;
    console.log(x, y);
    console.log(fprt.x);
    console.log(fprt.y);
    console.log(fprb.y);
    console.log(side === "r", x > fprt.x, y > fprt.y, y < fprb.y);

    return (
      (side === "r" && x > fprt.x && y > fprt.y && y < fprb.y) ||
      (side === "l" && x < fplt.x && y > fplt.y && y < fplb.y)
    );
  }
  isBallInPenaltyZone(side = "r") {
    console.log(this.isBallSeen);
    const x = this.ballCoords.x;
    const y = this.ballCoords.y;
    const { fprt, fprb, fplt, fplb } = Flags;
    console.log("ball coords", x, y);
    console.log(fprt.x);
    console.log(fprt.y);
    console.log(fprb.y);
    console.log(side === "r", x > fprt.x, y > fprt.y, y < fprb.y);

    return (
      (side === "r" && x > fprt.x && y > fprt.y && y < fprb.y) ||
      (side === "l" && x < fplt.x && y > fplt.y && y < fplb.y)
    );
  }

  getAction(dt) {
    return this.execute(dt, "root");
  }

  execute(dt, title) {
    const manager = this;
    const action = dt[title];
    // Exec node
    if (typeof action.exec == "function") {
      action.exec(manager, dt.state);
      console.log(action.next);
      return this.execute(dt, action.next);
    }
    // Condition node
    if (typeof action.condition == "function") {
      const cond = action.condition(manager, dt.state);

      if (cond) {
        console.log(action.trueCond);
        return this.execute(dt, action.trueCond);
      }
      console.log(action.falseCond);
      return this.execute(dt, action.falseCond);
    }
    // Command node
    if (typeof action.command == "function") {
      return action.command(manager, dt.state);
    }
    throw new Error(`Unexpected node in DT: ${title}`);
  }

  isVisible(flagName) {
    if (flagName === "b") {
      console.log(this.isBallSeen);
      return this.isBallSeen;
    }

    let flagIndex = this.visibleFlags.findIndex((elem) => elem[4] === flagName);
    console.log(flagIndex);
    return flagIndex != -1 ? true : false;
  }

  getDistance(flagName) {
    if (flagName === "b") {
      return this.ballCoords.d;
    }
    let flagIndex = this.visibleFlags.findIndex((elem) => elem[4] === flagName);
    const distance = this.visibleFlags[flagIndex][2];
    return distance;
  }

  getAngle(flagName) {
    if (flagName === "b") {
      return this.ballCoords.a;
    }
    let flagIndex = this.visibleFlags.findIndex((elem) => elem[4] === flagName);
    const angle = this.visibleFlags[flagIndex][3];
    return angle;
  }

  __parseTimeFrom(information) {
    if (information.length > 0) {
      this.time = information[0];
      console.log(this.time, " )");
      information.splice(0, 1);
    }
    return information;
  }
  __parseVisible(information) {
    for (const visibleObject of information) {
      let visibleObjectName = visibleObject.cmd.p.join("");

      this.__parseFlagFrom(visibleObject, visibleObjectName);
      this.__parsePlayerFrom(visibleObject, visibleObjectName);
      this.__parseBallInfo(visibleObject, visibleObjectName);
    }
  }
  __parseFlagFrom(visibleObject, visibleObjectName) {
    if (Flags[visibleObjectName]) {
      const fX = Flags[visibleObjectName].x;
      const fY = Flags[visibleObjectName].y;
      const flag = [fX, fY]
        .concat(visibleObject.p.slice(0, 2))
        .concat([visibleObjectName]);
      this.visibleFlags.push(flag);
    }
  }
  __parsePlayerFrom(visibleObject, visibleObjectName) {
    if (visibleObjectName.startsWith("p")) {
      const playerTeam = visibleObject.cmd.p[1];
      const playerNumero = visibleObject.cmd.p[2];
      const playerLocation = visibleObject.p;
      const playerPosition = this.changeCoordsBySide(
        CalcPos.calculateObjectPosition(
          this.visibleFlags,
          this.getPlayerCoords(),
          playerLocation
        )
      );
      if (playerTeam !== this.team) {
        this.opponents.push({ x: playerPosition[0], y: playerPosition[1] });
      }
    }
  }
  __parseBallInfo(visibleObject, visibleObjectName) {
    if (visibleObjectName.startsWith("b")) {
      this.ballCoords.d = visibleObject.p[0];
      this.ballCoords.a = visibleObject.p[1];
      this.isBallSeen = true;
      console.log("visflags", this.visibleFlags);
      console.log("playercoords", this.getPlayerCoords());
      console.log("visobject", visibleObject.p);
      const ballPosition = CalcPos.calculateObjectPosition(
        this.visibleFlags,
        this.getPlayerCoords(),
        visibleObject.p
      );
      console.log("balls coords", ballPosition[0], ballPosition[1]);
      this.ballCoords.x = ballPosition[0];
      this.ballCoords.y = ballPosition[1];
    }
  }

  __calculateAgentPosition() {
    [this.x, this.y] = this.changeCoordsBySide(
      CalcPos.calculatePlayerPosition(this.visibleFlags)
    );
  }
}

module.exports = EnvirenmentAnalyzer; // Экспорт
