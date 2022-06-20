
import { FileBox } from 'file-box';
import { log } from 'wechaty';
import { AppCodeforces, AppGame_1A2B, AppGame_Wordle, AppWordcloud } from './main.js';

import { Reply } from './Send.js';

export { SunMessage, isRoom };

async function isRoom (msg) {
  if (undefined == await msg.room()) return false;
  return true;
}

const EnrollWord = [
  `招生`,
  `计划`,
  `分数`,
  `录取`,
  `人数`,
  `招`,
  `高考`,
  `专业`,
  `华科`,
  `华中大`,
  `hust`,
  `HUST`,
  `华中科技大学`,
  `广东`,
];
const EnrollAskWord = [
  `请问`,
  `吗`,
  `呢`,
  `?`,
  `？`,
  `咨询`,
  `询问`,
  `问`,
  `多少`,
  `几何`,
];
const EnrollReply = [
  {
    type: "url",
    content: `https://pan.ligen131.com/api/v3/file/get/9/HUST2022%20%E6%8B%9B%E7%94%9F%E8%AE%A1%E5%88%92.jpg?sign=zkPpG3DJUF1QwifvW7554yyvUEyjym4hiPkiZrzAJPw%3D%3A0`,
  },
  {
    type: "text",
    content: `华中科技大学 2022 年在广东省计划共招收 221 人，其中历史类 202 组 27 人，物理类 204 组 153 人，203 组 9 人，207 组 20 人，高校专项 1 人，艺术类 11 人。其中 203 组与 207 组需再选生物或化学。
去年（2021 年）最各组别最低分数 / 位次为：历史类 202 组 614/1548 ，物理类 204 组 641/4967 ，203 组 653/2585 ，207 组 620/12381 。
更多招生信息请关注微信公众号：华中科技大学招生办公室。
欢迎大家报考华中科技大学！`,
  },
];
async function EnrollHelper(msg) {
  var text = await msg.text();
  var ok1 = false, ok2 = false;
  EnrollWord.forEach((word) => {
    if (text.indexOf(word) > -1) ok1 = true;
  });
  EnrollAskWord.forEach((word) => {
    if (text.indexOf(word) > -1) ok2 = true;
  });
  console.log(`StuEnroll`, ok1, ok2, text);
  if (!ok1 || !ok2) return;
  EnrollReply.forEach(async (rep) => {
    var content;
    if (rep.type === "url") {
      content = FileBox.fromUrl(rep.content);
    } else if (rep.type === "text") {
      content = rep.content;
    }
    await Reply(msg, content);
  });
}

async function SunMessage (msg) {
  if (msg.text() === 'ding') {
    // var file_box = FileBox.fromFile("./data/Game_1A2B.json");
    // Reply(msg, file_box);
    Reply(msg, "dong");
  }

  EnrollHelper(msg);

  AppCodeforces.ExecuteFunc(msg);
  AppWordcloud.ExecuteFunc(msg);
  AppGame_1A2B.ExecuteFunc(msg);
  AppGame_Wordle.ExecuteFunc(msg);

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