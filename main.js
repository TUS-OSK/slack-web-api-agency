'use strict';
const rp = require('request-promise-native');

const express = require('express');
const morgan = require('morgan');
const http = require('http');
const crypto = require('crypto');
const {WebClient} = require('@slack/web-api');
const methods = require("./methods");

const {PORT, CLIENT_ID, CLIENT_SECRET, PASSWORD, SALT} = process.env;
const port = PORT || 3000;
if (!PASSWORD || !SALT) {
    throw new Error('password, saltがありません');
}
const scope = 'chat:write:user';
const cryptAlgorithm = 'aes-256-cbc';


const app = express();
app.use(morgan('short'));

http.createServer(app).listen(port, () => {
    console.log(`server open port: ${port}`);
});


const url = encodeURI(`https://slack.com/oauth/authorize?client_id=${CLIENT_ID}&scope=${scope}&state=${"mytest"}`);
console.log(url);


const key = crypto.scryptSync(PASSWORD, SALT, 32);


const wrap = fn => (...args) => fn(...args).catch(args[2]);
app.get("/", (req, res) => {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Hello, world!");
});

app.post('/', wrap(async (req, res) => {
    const {cryptedToken, iv, method, options} = req.query;
    const access_token = decrypt(cryptedToken, Buffer.from(iv, 'base64'));
    const web = new WebClient(access_token);

    const methodScopes = method.split(".");
    if (methodScopes[0] !== "web" || methods.includes(methodScopes.slice(1).join(""))) {
        res.status(500).json()
    }
    methodScopes[0] = web;
    const webAPIMethod = methodScopes.reduce((previous, current) => previous[current]);

    webAPIMethod(options)
        .then(response => {
            res.json(response);
        })
        .catch(err => {
            res.status(500).json(err.data || err.message);
        })
}));

app.get('/oauth', wrap(async (req, res) => {
    const {code, state} = req.query;

    const options = {
        uri: 'https://slack.com/api/oauth.access',
        qs: {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code: code
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    rp(options)
        .then(repos => {
            const {access_token} = repos;
            res.header('Content-Type', 'text/plain; charset=utf-8');
            res.end(`次のフレーズをコピーしてください\n\n${JSON.stringify(encrypt(access_token))}`);
        })
        .catch(err => {
            res.status(500).json(err.message);
        });
}));

const decrypt = (cryptedToken, iv) => {
    const decipher = crypto.createDecipheriv(cryptAlgorithm, key, iv);
    return decipher.update(cryptedToken, 'base64', 'utf-8') + decipher.final('utf-8');
};

const encrypt = (accessToken) => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(cryptAlgorithm, key, iv);
    const a = cipher.update(accessToken, 'utf-8', 'base64');
    const b = cipher.final('base64');
    const crypted = a + b;

    const decrypedToken = decrypt(crypted, iv);
    if (accessToken !== decrypedToken) {
        throw new Error("復号がきちんとできません");
    }
    return {cryptedToken: crypted, iv: iv.toString('base64')};
};

