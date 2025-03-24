const Msg = require("./msg");
const readline = require("readline");
const EnvirenmentAnalizer = require("./envirenmentAnalyzer/envirenmentAnalyzer");
const { DT } = require("./DT/dt");

const SIGNS_AFTER_COMA = 2;
const round = (number) =>
  Math.round(number * 10 * SIGNS_AFTER_COMA) / (10 * SIGNS_AFTER_COMA);

const actions = [
  { act: "flag", fl: "frb" },
  { act: "flag", fl: "gl" },
  { act: "flag", fl: "fc" },
  { act: "kick", fl: "b", goal: "gr" },
];

class Agent {
  constructor(
    teamName,
    number,
    role = "player",
    isLeader = false,
    rotatespeed = 20
  ) {
    this.position = "l"; // По умолчанию ~ левая половина поля
    this.run = false; // Игра начата
    this.act = null; // Действия
    this.rl = readline.createInterface({
      // Чтение консоли
      input: process.stdin,
      output: process.stdout,
    });
    this.rl.on("line", (input) => {
      // Обработка строки из кон—
      if (this.run) {
        // Если игра начата
        // Движения вперед, вправо, влево, удар по мячу

        if ("w" == input) this.act = { n: "dash", v: 100 };
        if ("d" == input) this.act = { n: "turn", v: 20 };
        if ("a" == input) this.act = { n: "turn", v: -20 };
        if ("s" == input) this.act = { n: "kick", v: 100 };
      }
    });
    this.rotatespeed = rotatespeed;
    this.envirenmentAnalizer = new EnvirenmentAnalizer(teamName, this.position);
    this.team = teamName;
    this.number = number;
    this.role = role;
    this.isLeader = isLeader;
    this.strategy = "flag";
    this.strategyIdx = 0;
  }
  msgGot(msg) {
    // Получение сообщения
    let data = msg.toString("utf8"); // ПРиведение
    this.processMsg(data); // Разбор сообщения
    this.sendCmd(); // Отправка команды
  }
  setSocket(socket) {
    // Настройка сокета
    this.socket = socket;
  }
  socketSend(cmd, value) {
    // Отправка команды
    console.log("send ", cmd, value);
    this.socket.sendMsg(`(${cmd} ${value})`);
  }
  processMsg(msg) {
    // Обработка сообщения
    let data = Msg.parseMsg(msg); // Разбор сообщения
    console.log(data);
    if (!data) throw new Error("Parse error\n" + msg);
    // Первое (hear) — начало игры
    if (data.cmd == "hear" && data.p[2] == "play_on") this.run = true;
    if (data.cmd == "init") this.initAgent(data.p); //MHMnmaflM3auMH
    this.analyzeEnv(data.msg, data.cmd, data.p); // Обработка
  }
  initAgent(p) {
    if (p[0] == "r") {
      this.position = "r"; // Правая половина поля
      this.envirenmentAnalizer.fieldSide = "r";
    }
    if (p[1]) this.id = p[1]; // id игрока
    this.dt = Object.create(DT[this.role]).init();
  }
  analyzeEnv(msg, cmd, p) {
    if (cmd == "hear" && p[2].includes("goal")) {
      this.run = false;
      this.strategyIdx = 0;
      this.strategy = actions[0].act;
    }
    if (cmd === "see") {
      this.envirenmentAnalizer.analyzeVisibleInformation(p);
    }

    if (this.run) {
      this.act = this.envirenmentAnalizer.getAction(this.dt);
      //switch (this.strategy) {
      //  case "flag":
      //    this.searchFlag(actions[this.strategyIdx].fl);
      //    break;
      //  case "kick":
      //    this.searchBall(actions[this.strategyIdx].goal);
      //    break;
      //}
    }
    console.log(this.printInfo());
  }

  searchFlag(flagName) {
    //console.log(this.envirenmentAnalizer.visibleFlags);
    let flagIndex = this.envirenmentAnalizer.visibleFlags.findIndex(
      (elem) => elem[4] === flagName
    );
    if (flagIndex === -1) {
      this.keepSearchig();
    } else {
      //this.turnToFlag(flagIndex);
      this.moveToFlag(flagIndex);
    }
  }
  keepSearchig() {
    this.act = { n: "turn", v: 20 };
    //sendCmd();
  }
  turnToFlag(flagIndex) {
    const angle = this.envirenmentAnalizer.visibleFlags[flagIndex][3];
    this.act = { n: "turn", v: angle };
  }
  moveToFlag(flagIndex) {
    const target = this.envirenmentAnalizer.visibleFlags[flagIndex];
    const angle = target[3];
    const distance = target[2];
    //if (distance > 70) {
    //  this.act = { n: "dash", v: 70 };
    //} else if (distance > 40 && Math.abs(angle) < 30) {
    //  this.act = { n: "dash", v: 70 };
    //} else if (distance > 20 && Math.abs(angle) < 20) {
    //  this.act = { n: "dash", v: 100 };
    //} else if (distance > 3 && Math.abs(angle) < 5) {
    //  this.act = { n: "dash", v: 100 };
    //} else if (distance < 3) {
    //  this.goNextAction();
    //}
    console.log("distance ", distance, " angle ", angle);
    if (Math.abs(angle) > 20) {
      this.act = { n: "turn", v: angle };
    } else if (Math.abs(angle) < 5) {
      this.act = { n: "dash", v: 100 };
    } else if (Math.abs(angle) <= 10 && distance > 70) {
      this.act = { n: "dash", v: 100 };
    } else if (Math.abs(angle) <= 10 && distance > 50) {
      this.act = { n: "dash", v: 80 };
    } else if (Math.abs(angle) <= 10 && distance > 30) {
      this.act = { n: "dash", v: 60 };
    } else if (Math.abs(angle) <= 20 && distance > 50) {
      this.act = { n: "dash", v: 80 };
    } else if (distance < 3) {
      this.goNextAction();
    } else {
      this.act = { n: "turn", v: angle };
    }
  }
  searchBall() {
    const isBallFound = this.envirenmentAnalizer.isBallSeen;
    if (!isBallFound) {
      this.keepSearchig();
    } else {
      this.moveToBall();
    }
  }
  moveToBall() {
    const angle = this.envirenmentAnalizer.ballCoords.a;
    const distance = this.envirenmentAnalizer.ballCoords.d;

    console.log("ball distance ", distance, " ball angle ", angle);
    if (distance < 0.5) {
      this.kickTheBall();
    } else if (Math.abs(angle) > 20) {
      this.act = { n: "turn", v: angle };
    } else if (distance <= 30) {
      this.act = { n: "dash", v: 50 };
    } else if (Math.abs(angle) <= 10 && distance > 70) {
      this.act = { n: "dash", v: 100 };
    } else if (Math.abs(angle) <= 10 && distance > 50) {
      this.act = { n: "dash", v: 80 };
    } else if (Math.abs(angle) <= 10 && distance > 30) {
      this.act = { n: "dash", v: 60 };
    } else if (Math.abs(angle) <= 20 && distance > 50) {
      this.act = { n: "dash", v: 80 };
    } else {
      this.act = { n: "turn", v: angle };
    }
  }
  kickTheBall() {
    const gate = actions[this.strategyIdx].goal;
    const gateIdx = this.envirenmentAnalizer.visibleFlags.findIndex(
      (elem) => elem[4] === gate
    );
    if (gateIdx === -1) {
      console.log("i kicked");
      this.act = { n: "kick", v: `30 20` };
    } else {
      const angle = this.envirenmentAnalizer.visibleFlags[gateIdx][3];
      const distance = this.envirenmentAnalizer.visibleFlags[gateIdx][2];
      if (distance > 25) {
        this.act = { n: "kick", v: `70 ${angle}` };
        console.log("I KICKED THE BALL ");
      } else {
        this.act = { n: "kick", v: `100 ${angle}` };
        console.log("I KICKED THE BALLLLLLLLLLLl");
      }
    }
  }
  goNextAction() {
    console.log("strategy completed: ", this.strategy, " ", this.strategyIdx);
    this.strategyIdx = (this.strategyIdx + 1) % actions.length;
    this.strategy = actions[this.strategyIdx].act;
    console.log("next strategy: ", this.strategy, " ", this.strategyIdx);
  }

  sendCmd() {
    if (this.run) {
      // Игра начата
      if (this.act) {
        if (this.act.n === "kick" && this.act.v.includes("100")) {
          this.goNextAction();
        }
        console.log(this.act.n, this.act.v);
        this.socketSend(this.act.n, this.act.v);
      }

      this.act = null; // Сброс команды
    }
  }

  printInfo() {
    if ((this.team = "Combine")) {
      let report = `(Team ${this.team} player №${
        this.number
      }): My position (x: ${round(this.envirenmentAnalizer.x)}, y: ${round(
        this.envirenmentAnalizer.y
      )}), side: ${this.envirenmentAnalizer.fieldSide}. I see:`;

      if (!!this.envirenmentAnalizer.opponents.length) {
        for (let playerPos of this.envirenmentAnalizer.opponents) {
          report += `\n(Team ${this.team} player №${
            this.number
          }):\t\tOpponent - position (x: ${round(playerPos.x)}, y: ${round(
            playerPos.y
          )})`;
        }
      } else {
        report += ` Nothing`;
      }
      return report;
    }
  }
}

module.exports = Agent; // Экспорт игрока
