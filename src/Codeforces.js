import { httpGET } from "./HttpRequest.js"
import { TimeToDate } from "./Random.js"
import { Send } from "./Send.js"
import { log } from 'wechaty'
import { Sun_bot } from "./main.js"

// {
//     id: 1635,
//     name: 'Codeforces Round #TBA (Div. 2)',
//     type: 'CF',
//     phase: 'BEFORE',
//     frozen: false,
//     durationSeconds: 7200,
//     startTimeSeconds: 1645367700,
//     relativeTimeSeconds: -1556217
//   }


export async function CodeforcesRecentContest (msg) {
    log.info(Sun_bot.name(), "Getting Codeforces Recent Contest List...")
    await httpGET("https://codeforces.com/api/contest.list", (obj) => SendCodeforcesRecentContest(msg, obj))
}

function SendCodeforcesRecentContest (msg, ContestList) {
    if (ContestList.status === 'OK') {
        var text = 'Upcoming Codeforces Contests: '
        var ind = 0
        while (ContestList.result[ind].phase === 'BEFORE') {
            let now = ContestList.result[ind]
            ++ind
            text = text + '\n' + ind + '. ' + now.name + '\n' + TimeToDate(now.startTimeSeconds * 1000)
        }
        if (ind === 0) text = text + 'None'
        Send(msg, text)
    } else {
        Send(msg, "Get Codeforces contest list error:" + ContestList.comment)
    }
}