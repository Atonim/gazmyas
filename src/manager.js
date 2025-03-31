const utils = require("./calc");

class Manager {
  getAction(dt, p) {
    function execute(dt, title, p) {
      const action = dt[title];
      console.log(title);

      if (typeof action.exec == "function") {
        action.exec(Manager, dt.state, p);
        return execute(dt, action.next, p);
      }
      if (typeof action.condition == "function") {
        const cond = action.condition(Manager, dt.state, p);
        if (cond) {
          return execute(dt, action.trueCond, p);
        }
        return execute(dt, action.falseCond, p);
      }
      if (typeof action.command == "function") {
        return action.command(Manager, dt.state);
      }
      throw new Error(`Unexpected node in DT: ${title}`);
    }
    return execute(dt, "root", p);
  }

  static getVisible(obj_name, p) {
    let obj = utils.see_object(obj_name, p);

    if (obj) {
      return true;
    }
    return false;
  }

  static getDistance(obj_name, p) {
    let obj = utils.see_object(obj_name, p);
    return obj[0];
  }

  static getAngle(obj_name, p) {
    let obj = utils.see_object(obj_name, p);
    return obj[1];
  }

  static getFaceDir(obj_name, p) {
    let obj = utils.see_object(obj_name, p);
    return obj[4];
  }

  static lookAtBottomFlags(p) {
    return utils.seeBottomFlags(p);
  }

  static lookAtTopFlags(p) {
    return utils.seeTopFlags(p);
  }
}

module.exports = Manager;
