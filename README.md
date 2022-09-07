# Sunbot

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/wechaty/wechaty)
![Node.js v16](https://img.shields.io/badge/node-%3E%3D16-green.svg)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)

A WeChat bot powered by [WeChaty](https://github.com/wechaty/wechaty).

The `dev` branch is a refactoring of the `main` branch based on [TypeScript](https://www.typescriptlang.org/).

**WARNING: This project is under development and stability is not guaranteed.**

## Feature and Command

All operations of Sunbot is based on command call. You just need to send simple command in the chat window of WeChat/WhatsApp to the bot, and it will reply to you automatically.

1. ding-dong bot: Send `ding` to the bot in wherever room or private talk. If the bot running normally, it will reply you `dong`.

## Usage

1. Rename `config/config-example.json` to `config/config.json`. Modify the configuration file according to your actual situation.  
  `bot.puppet` is what puppet you are using. For more details, see [Wechaty Puppet Providers](https://wechaty.js.org/docs/puppet-providers/).  
  `bot.puppetOptions.token` is your puppet token. If your puppet don't need token, you needn't change it.  
  Note: You may need to run `npm install YOUR_PUPPET_HERE` according to your puppet. For example, run `npm install wechaty-puppet-padlocal` before you get to the next step.  
2. Run  
  ```shell
  $ npm install
  $ npm run start
  ```

## Build

```shell
$ npm run build
```

The built file will generate into folder `dist`.

## LICENSE

GNU General Public License v3.0