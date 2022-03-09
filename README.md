# Sunbot

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/wechaty/wechaty)

## TODO

- [x] ~~Wrapper applications class `App` and make `CodeforcesRecentContest` as an `App` Class (`App: Codeforces`).~~
- [ ] Storage the received message throught database.
- [x] ~~Set timed events (e.g. Codeforces contest list updating).~~
- [x] ~~Generate wordcloud according to the statistic on the message (`App: WordCloud`).~~
- [x] ~~Game: 1A2B (`App: Game_1A2B`).~~
- [ ] Game: Daily Wordle (`App: Game_Wordle`).
- [ ] Codeforces random daily problem (`App: Codeforces: Dailypro`).
- [ ] Student enroll helper for some university in China (`App: Stuenrollhelper`).
- [ ] Make a command parser to parse every message which is probably a command.

## How to run the bot

1. Clone this repo.

2. Run `npm install`.

3. Edit `src/config.js`, you may change the following things:

- `AdminName` is your Wechat/Whatsapp name.
- `WechatyPuppet` is what puppet you are using. For more details, see [Wechaty Puppet Providers](https://wechaty.js.org/docs/puppet-providers/).
- `WechatyPuppetToken` is your puppet token. If your puppet don't need token, you needn't change it.

4. Python and PIP are required. Run `pip install jieba wordcloud` to install dependencies.

5. Download upgit from [here](https://github.com/pluveto/upgit/releases) according to your operator system. Rename it to upgit (For Windows users, `upgit.exe`), save it to somewhere you like. To access it from anywhere, add its directory to the PATH environment variable. You may create `config.toml` in the same directory of upgit, and fill it in following [this sample config file](https://github.com/pluveto/upgit/blob/main/config.sample.toml). Here is a simplist sample config file:

```toml
rename = "{year}/{month}/upgit_{year}{month}{day}_{unix_ts}{ext}"
[uploaders.github]
pat = "ghp_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
repo = "repo-name"
username = "username"
```

   You can test if upgit works by running `upgit your.png`. For more, please visit [upgit](https://github.com/pluveto/upgit).


5. Run `npm run start` to start bot.

## LICENSE

GNU General Public License v3.0