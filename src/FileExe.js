import fs from 'fs';

var folder = 'data/';

export async function FileAppend(file, text) {
  var dirExist = fs.existsSync(folder);
  if(!dirExist) fs.mkdirSync(folder);
  try{
    file = folder + file;
    fs.appendFileSync(file, text);
  } catch(e) {console.log(e);}
}
export async function FileWrite(file, text) {
  var dirExist = fs.existsSync(folder);
  if(!dirExist) fs.mkdirSync(folder);
  try{
    file = folder + file;
    fs.writeFileSync(file, text);
  } catch(e) {console.log(e);}
}