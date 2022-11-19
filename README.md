# Sunbot for Bingyan

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/wechaty/wechaty)
[![Node.js v16](https://img.shields.io/badge/node-%3E%3D16-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-blue.svg)](https://www.typescriptlang.org/)
[![GitHub last commit (branch)](https://img.shields.io/github/last-commit/ligen131/Sunbot/bingyan-wechat-bot)](https://github.com/ligen131/Sunbot/tree/bingyan-wechat-bot)
[![License](https://img.shields.io/github/license/ligen131/Sunbot)](https://www.gnu.org/licenses/gpl-3.0.html)

[![Wechaty Contributor Program](https://img.shields.io/badge/Wechaty-Contributor%20Program-green.svg)](https://wechaty.js.org/docs/contributing/)
[![OSCS Status](https://www.oscs1024.com/platform/badge/ligen131/Sunbot.svg?size=small)](https://www.oscs1024.com/project/ligen131/Sunbot?ref=badge_small)

A WeChat bot powered by [WeChaty](https://github.com/wechaty/wechaty).

The `bingyan-wechat-bot` branch is extended from [`dev` branch](https://github.com/ligen131/Sunbot/tree/dev) and adds some proprietary functions.

**WARNING: This project is under development and stability is not guaranteed.**

## Feature and Command

All operations of Sunbot is based on command call. You just need to send simple command in the chat window of WeChat/WhatsApp to the bot, and it will reply to you automatically.

1. ding-dong bot: Send `ding` to the bot in wherever room or private talk. If the bot running normally, it will reply you `dong`.
2. repeater: If 4 consecutive identical text messages are detected in the current room chat, the message will be automatically repeated.
3. Cats' and Dogs' photo: Send `发猫猫` or `发狗狗` to the bot and it will reply you the cats' or dogs' photo.

## Status Page

After bot starts normally, it will automatically start the status page, which listens at `http://localhost:4721` by default. You can change the default port in the configuration.

```json
  "statusPage": {
    "enable": true,
    "port": 4721
  },
```

## See also

[Sunbot `dev` Branch](https://github.com/ligen131/Sunbot/tree/dev), refactoring of the `main` branch based on [TypeScript](https://www.typescriptlang.org/).

[Sunbot `main` Branch](https://github.com/ligen131/Sunbot/tree/main), many interesting and fun features, such as Wordle, 1A2B game and wordcloud.

## Usage

1. Rename `config/config-example.json` to `config/config.json`. Modify the configuration file according to your actual situation.  

   `bot.puppet` is what puppet you are using. For more details, see [Wechaty Puppet Providers](https://wechaty.js.org/docs/puppet-providers/).  

   `bot.puppetOptions.token` is your puppet token. If your puppet don't need token, you needn't change it.  

   Note: You may need to run `npm install YOUR_PUPPET_HERE` according to your puppet. For example, run `npm install wechaty-puppet-padlocal` before you get to the next step.

2. (Optional) If you need to use some database-based plugins, you need to install mysql client and mysql server.

   The following plugins are implemented based on the database:

   ```
   repeater(optional)
   ```
   
   Modify the `database` settings in the configuration file. If you keep the default configuration, then you need to execute the following commands. Otherwise, modify the command according to your configuration before executing it.

   ```sql
   $ mysql -u root -p
   -- Enter your password for root
   -- The following command will be run in mysql client
   CREATE DATABASE `sunbot`;
   CREATE USER `sun` IDENTIFIED BY '123456';
   GRANT ALL ON `sunbot`.* TO `sun`;
   EXIT;
   ```

3. Run

   ```shell
   $ npm install
   $ npm run start
   ```

By the way, you can set whether to enable each plugin in the configuration.

```json
  "plugins": {
    "dingdong": {
      "enable": true
    },
    "repeater": {
      "enable": true
    },
    "cats": {
      "enable": true
    },
    "dogs": {
      "enable": true
    }
  }
```

## Build

```shell
$ npm run build
```

The built file will generate into folder `dist`.

## Development

Run the following command, which supports real-time compilation and operation.

```shell
$ npm run dev
```

Run the following command, which supports performs TypeScript code inspection with `ESLint` and auto-formatting code with `prettier`.

```shell
$ npm run check
```

Code formatting and inspection will be performed automatically every time you commit, and the commit will not be allowed if the inspection fails.

In order to make the commit more standardized (git-emoji-commit), please use the following command to commit:

```shell
$ npm run check && git add . && npm run commit
```

## Dependencies

The following NPM packages are used by this project.

```
wechaty
wechaty-puppet-*
typescript
ts-node
express
@types/express
jsdom
@types/jsdom
mysql2
@types/mysql
file-box
```

## LICENSE

GNU General Public License v3.0
