import fs from 'fs';
import { log } from 'wechaty';

var folder = 'data/';

export async function FileAppend(file, text) {
  var dirExist = fs.existsSync(folder);
  if(!dirExist) fs.mkdirSync(folder);
  try {
    file = folder + file;
    fs.appendFileSync(file, text);
    log.info(`${file} append file ok.`);
  } catch(e) { log.error(e); }
}

export async function FileWrite(file, text) {
  var dirExist = fs.existsSync(folder);
  if(!dirExist) fs.mkdirSync(folder);
  try {
    file = folder + file;
    fs.writeFileSync(file, text);
    log.info(`${file} write file ok.`);
  } catch(e) { log.error(e); }
}

export async function FileRead(file) {
  file = folder + file;
  var fileExist = fs.existsSync(file);
  if(!fileExist) return undefined;
  try {
    var data = fs.readFileSync(file);
    log.info(`${file} read file ok.`);
    return data.toString();
  } catch(e) { log.error(e); }
  return undefined;
}

export async function FileReadJSON(file) {
  var text = await FileRead(file);
  if(undefined == text) return undefined;
  try {
    var obj = await JSON.parse(text);
    log.info(`${file} read json file ok.`);
    return obj;
  } catch(e) { log.error(e); }
  return undefined;
}

export async function FileWriteJSON(file, obj) {
  var text = JSON.stringify(obj);
  FileWrite(file, text);
}