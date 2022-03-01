import { log } from "wechaty";

export { App };

class App {
  constructor (_AppId, _AppName, _InitFunc, _ClockeventFunc) {
    this.AppId = _AppId;
    this.AppName = _AppName;
    this.InitFunc = _InitFunc;
    this.ClockeventFunc = _ClockeventFunc;
  }
  LogError (text) {
    log.error(`In [App:${this.AppName}] ${text}`);
  }
  LogWarn (text) {
    log.warn(`In [App:${this.AppName}] ${text}`);
  }
  LogInfo (text) {
    log.info(`In [App:${this.AppName}] ${text}`);
  }
  LogDebug (text) {
    log.debug(`In [App:${this.AppName}] ${text}`);
  }
}