import { STATUS_PAGE_PORT } from '../config.js';
import express from 'express';
import path from 'path';

const __dirname = path.resolve();

export {
  Server
};

function Server() {
  process.env.NODE_CONFIG_DIR = './';
  process.env.NODE_ENV = 'config';
  let port = STATUS_PAGE_PORT || 4720;
  
  const app = express();

  app.all('*', function(req, res, next) {
      res.header("Access-Control-Allow-Origin","*");
    res.header('Access-Control-Allow-Methods','PUT,GET,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers","X-Requested-With");
    res.header('Access-Control-Allow-Headers','Content-Type');
    next();
  });

  app.get('/', (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, 'src', 'status', 'index.html'));
  });

  app.listen(port, function() {
    console.log(`Bot status page listening at http://localhost:${port}`);
  });
}