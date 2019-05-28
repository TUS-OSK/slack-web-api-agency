'use strict';

const rp = require('request-promise-native');

const data = { // ユーザーが承認して，得られたもの
    "cryptedToken": "9eFeP+sdH29YAtIi/nlzTlYYlVjpid3SBSmZrTe36cLZemZeT3uN68XLw2WTEFm4FAMKGGLOUU66Gy+BFn8KL+XXD/O/jxT3VSqkfrAHBxE=",
    "iv": "pqsxcczcMT9dNg+dgM/t3Q=="
};

const options = {
    method: 'POST',
    uri: 'https://slack-web-api-agency.herokuapp.com/',
    qs: {
        "cryptedToken": data.cryptedToken,
        "iv": data.iv,
        method: "web.chat.postMessage",
        options: {
            "text": `Hello World! at ${new Date().toLocaleString()}`,
            "channel": "CJY36U75L"  // υ-slack-api-test チャンネル
        }
    },
    headers: {
        'User-Agent': 'Request-Promise'
    },
    json: true
};


rp(options)
    .then(parsedBody => {
        console.log("success!");
        console.log(parsedBody)
    })
    .catch(err => {
        console.log("fail...");
        console.error(err)
    });