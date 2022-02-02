import {
    log,
} from 'wechaty'
import { Sun_bot } from './main.js'
import { XMLHttpRequest } from 'xmlhttprequest'

var Cache_obj
var LastURL
var LastHttpGetTime
var LastIsOK = false
export async function httpGET (url, func) {
  var NowTime = Date.now()
  var obj
  if (url === LastURL && NowTime - LastHttpGetTime < 1000 * 60 * 30 && LastIsOK) {
    log.info(Sun_bot.name(), "HttpGet URL: %s, Cache obj read.", url)
    obj = Cache_obj
    func(obj)
    return
  }
  LastURL = url
  LastHttpGetTime = Date.now()
  LastIsOK = false
  var xmlhttp = new XMLHttpRequest()

  xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
      log.info(Sun_bot.name(), "HttpGet URL: %s, New obj read.", url)
      obj = JSON.parse(xmlhttp.responseText)
      Cache_obj = obj
      LastIsOK = true
      func(obj)
    }
  }
  xmlhttp.open("GET", url, true)
  log.info("HttpGet URL: %s started.", url)
  xmlhttp.send()
}
