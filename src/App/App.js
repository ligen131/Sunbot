import { log } from "wechaty";

export { App };

class App {
  constructor (_AppId, _AppName) {
    this.AppId = _AppId;
    this.AppName = _AppName;
    this.InitFunc = undefined;
    this.ClockeventFunc = undefined;
    this.ExecuteFunc = undefined;
  }
  LogError (text) {
    log.error(`[App:${this.AppName}] ${text}`);
  }
  LogWarn (text) {
    log.warn(`[App:${this.AppName}] ${text}`);
  }
  LogInfo (text) {
    log.info(`[App:${this.AppName}] ${text}`);
  }
  LogDebug (text) {
    log.debug(`[App:${this.AppName}] ${text}`);
  }
}