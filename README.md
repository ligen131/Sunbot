# Sunbot

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/wechaty/wechaty)

## TODO

- [x] Wrapper applications class "App" and make "CodeforcesRecentContest" as an App Class (App: Codeforces).
- [ ] Storage the received message throught database.
- [ ] Set timed events (e.g. Codeforces contest list updating).
- [ ] Generate wordcloud according to the statistic on the message (App: WordCloud).
- [ ] Game: 1A2B (App: Game_1A2B).
- [ ] Game: Daily Wordle (App: Game_Wordle).
- [ ] Codeforces random daily problem (App: Codeforces: Dailypro).
- [ ] Student enroll helper for some university in China (App: Stuenrollhelper).
- [ ] Make a command parser to parse every message which is probably a command.

## How to run the bot

1. Clone this repo.

2. Run `npm install`.

3. Edit `src/config.js`, you may change the following things:

- `AdminName` is your Wechat/Whatsapp name.
- `WechatyPuppet` is what puppet you are using. For more details, see [Wechaty Puppet Providers](https://wechaty.js.org/docs/puppet-providers/).
- `WechatyPuppetToken` is your puppet token. If your puppet don't need token, you needn't change it.

4. Run `npm run start` to start bot.

## LICENSE

GNU General Public License v3.0