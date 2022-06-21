
import { FileBox } from 'file-box';
import { log } from 'wechaty';
import { AppCodeforces, AppEnrollHelper, AppGame_1A2B, AppGame_Wordle, AppWordcloud } from './main.js';

import { Reply } from './Send.js';

export { SunMessage, isRoom };

async function isRoom (msg) {
  if (undefined == await msg.room()) return false;
  return true;
}

async function SunMessage (msg) {
  if (msg.text() === 'ding') {
    // var file_box = FileBox.fromFile("./data/Game_1A2B.json");
    // Reply(msg, file_box);
    Reply(msg, "dong");
  }

  AppCodeforces.ExecuteFunc(msg);
  AppWordcloud.ExecuteFunc(msg);
  AppGame_1A2B.ExecuteFunc(msg);
  AppGame_Wordle.ExecuteFunc(msg);
  AppEnrollHelper.ExecuteFunc(msg);

  var msgfrom = await msg.talker().name();
  var msgfromid = await msg.talker().id;
  var mss = "From: " + msgfrom + '(' + msgfromid + ')\n';
  if (await isRoom(msg)) {
    var msgroom = await msg.room().topic();
    var msgroomid = await msg.room().id;
    mss += "Room: " + msgroom + '(' + msgroomid + ')\n';
  }
  mss += "Time: " + await msg.date() + '\n';
  mss += '----------------------------------------\n' + msg.text() + '\n----------------------------------------';
  log.info(mss);
}