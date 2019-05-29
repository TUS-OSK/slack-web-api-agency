'use strict';

const rp = require('request-promise-native');
const fetch = require('node-fetch');

const data = {
    "cryptedToken": "9eFeP+sdH29YAtIi/nlzTlYYlVjpid3SBSmZrTe36cLZemZeT3uN68XLw2WTEFm4FAMKGGLOUU66Gy+BFn8KL+XXD/O/jxT3VSqkfrAHBxE=",
    "iv": "pqsxcczcMT9dNg+dgM/t3Q=="
};


// rp({
//     method: 'POST',
//     uri: 'https://slack-web-api-agency.herokuapp.com/',
//     body: {
//         "cryptedToken": data.cryptedToken,
//         "iv": data.iv,
//         method: "web.chat.postMessage",  // Web API https://api.slack.com/web のMethodのみ, methods.jsonの中に含まれるもののみ
//         options: {
//             "text": `Hello World! at ${new Date().toLocaleString()}`,
//
//             // channelの値は送るチャンネル，DM特有のID ブラウザ板Slackでチャンネルを開いたときのURLに含まれる
//             // https://something.slack.com/messages/[ここ]/...
//             "channel": "CJY36U75L"  // υ-slack-api-test チャンネル
//         }
//     },
//     headers: {
//         'User-Agent': 'Request-Promise'
//     },
//     json: true
// })
//     .then(parsedBody => {
//         console.log("success!");
//     })
//     .catch(err => {
//         console.log("fail...");
//     });


fetch('https://slack-web-api-agency.herokuapp.com/', {
    method: 'POST',
    body: JSON.stringify({
        "cryptedToken": data.cryptedToken,
        "iv": data.iv,
        method: "web.chat.postMessage",  // Web API https://api.slack.com/web のMethodのみ, methods.jsonの中に含まれるもののみ
        options: {
            "text": `Hello World! at ${new Date().toLocaleString()}`,

            // channelの値は送るチャンネル，DM特有のID ブラウザ板Slackでチャンネルを開いたときのURLに含まれる
            // https://something.slack.com/messages/[ここ]/...
            "channel": "CJY36U75L"  // υ-slack-api-test チャンネル
        }
    }),
    headers: {
        'Content-Type': 'application/json'
    },
})
    .then(parsedBody => {
        console.log("success!");
    })
    .catch(err => {
        console.log("fail...");
    });