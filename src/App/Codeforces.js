import { httpGET } from "../HttpRequest.js";
import { sleep, TimeToDate } from "../Random.js";
import { Reply } from "../Send.js";
import { App } from "./App.js";

export { Codeforces };

class Codeforces extends App {
  constructor () {
    super(1, "Codeforces");
    this.InitFunc = this.UpdateContestList;
    this.ClockeventFunc = this.UpdateContestList;

    this.CacheContestList = undefined;
    this.LastCCLTime = 0;
  }

/*
A Codeforces Contest List response JSON example:
{
  id: 1635,
  name: 'Codeforces Round #TBA (Div. 2)',
  type: 'CF',
  phase: 'BEFORE',
  frozen: false,
  durationSeconds: 7200,
  startTimeSeconds: 1645367700,
  relativeTimeSeconds: -1556217
}
*/
  async GetContestList () {
    this.CacheContestList = await httpGET("https://codeforces.com/api/contest.list");
    if (this.CacheContestList === undefined || this.CacheContestList.status != "OK") {
      console.log(this.CacheContestList, this.CacheContestList != undefined);
      this.LogError("Get Codeforces contest list failed. " + ((this.CacheContestList === undefined) ? ("") : (this.CacheContestList.status)));
      this.LastCCLTime = 0;
      return;
    }
    this.LastCCLTime = Date.now();
  }

  async ReplyUpcomingContest (msg) {
    if (this.CacheContestList != undefined && this.CacheContestList.status === 'OK') {
      var text = 'Upcoming Codeforces Contests: ';
      var ind = 0;
      while (this.CacheContestList.result[ind].phase === 'BEFORE') {
        let now = this.CacheContestList.result[ind];
        ++ind;
        text = text + '\n' + ind + '. ' + now.name + '\n' + TimeToDate(now.startTimeSeconds * 1000);
      }
      if (ind === 0) text = text + 'None';
      await Reply(msg, text);
    } else {
      await Reply(msg, "Get Codeforces contest list failed.");
    }
  }

  async UpdateContestList () {
    let NowTime = Date.now();
    if (NowTime - this.LastCCLTime >= 1000 * 60 * 30) {
      await this.GetContestList();
    }
  }
}