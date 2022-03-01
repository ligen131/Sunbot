import {
    log,
} from 'wechaty';
import { Sun_bot } from './main.js';
import { XMLHttpRequest } from 'xmlhttprequest';
import { sleep } from './Random.js';

var httpIsOK;
var httpObj;
async function _httpGET (url, func) {
  var xmlhttp = new XMLHttpRequest();

  xmlhttp.onreadystatechange = function(){
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      log.info(Sun_bot.name(), "HttpGet URL: %s OK.", url);
      var obj = JSON.parse(xmlhttp.responseText);
      func(obj);
    }
  }
  xmlhttp.open("GET", url, true);
  log.info(`HttpGet URL: ${url} started.`);
  xmlhttp.send();
}

export async function httpGET(url) {
  httpIsOK = false;
  httpObj = undefined;
  await _httpGET(url, (obj) => {
    httpIsOK = true;
    httpObj = obj;
  });
  while(!httpIsOK) await sleep(500);
  return httpObj; 
}
