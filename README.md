# Sunbot

[![Powered by Wechaty](https://img.shields.io/badge/Powered%20By-Wechaty-brightgreen.svg)](https://github.com/wechaty/wechaty)

## Feature

1. Send `ding` to it. It will reply you `dong`.

2. Wordcloud application. Send `wordcloud` in a group. It will generate a word cloud which included words sent in this group.

3. 1A2B Game. Send `1A2B` to it to start a game. Rule: When a game start, bot will generate a string. Your goal is to guess it. Every time you can send a 4-letter string containing numbers and upper case English letters. If there is an correct character in the right place, you will get an A. If there is an correct character but it isn't in the right place, you will get an B. Bot will reply you as `XAXB` to show how many As and Bs you got. For example, if the answer is `1A2B` and you guess `A32B`, you will get `2A1B`.
   
4. Wordle Game. Every day has a different word and one people can guess only one time per day. For common wordle rule, please visit [https://wd.ligen131.com](https://wd.ligen131.com). Send `wordle` to check today status.

5. [Codeforces](http://codeforces.com/) recent contest querier. Send `cf` to it and you will got the list of upcoming codeforces contests.

## How to run the bot

1. Clone this repo.

2. Run `npm install`.

3. Rename `src/config-example.js` to `src/config.js` or just run `mv src/config-example.js src/config.js`. Edit `src/config.js`, you may change the following things:

- `ADMIN_NAME` is your Wechat/Whatsapp name.
- `ADMIN_WXID` is your Wechat/Whatsapp id. You may see it in the personal profile page in WeChat/Whatsapp.
- `WECHATY_PUPPET` is what puppet you are using. For more details, see [Wechaty Puppet Providers](https://wechaty.js.org/docs/puppet-providers/).
- `WECHATY_PUPPET_TOKEN` is your puppet token. If your puppet don't need token, you needn't change it.

    If you want to use wordcloud application, the following two things are required. Or, turn to step 6.

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


6. Finally, run `npm run start` to start bot.

## TODO

- [x] ~~Wrapper applications class `App` and make `CodeforcesRecentContest` as an `App` Class (`App: Codeforces`).~~
- [ ] Storage the received message throught database.
- [x] ~~Set timed events (e.g. Codeforces contest list updating).~~
- [x] ~~Generate wordcloud according to the statistic on the message (`App: WordCloud`).~~
- [x] ~~Game: 1A2B (`App: Game_1A2B`).~~
- [x] ~~Game: Daily Wordle (`App: Game_Wordle`).~~
- [ ] Codeforces random daily problem (`App: Codeforces: Dailypro`).
- [ ] Student enroll helper for some university in China (`App: Stuenrollhelper`).
- [ ] Make a command parser to parse every message which is probably a command.

## LICENSE

GNU General Public License v3.0