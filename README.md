# slack-web-api-agency
SlackのメンバーそれぞれがTokenを取得でき，botでの投稿などをなどをできるようにするもの。
メンバーは初回時認証し，以降はサーバにRESTで[Slack Web API](https://api.slack.com/web)が使える。


## Setup
- **PORT**: 任意, localで動かすとき用
- **CLIENT_ID**: [Slackk API](https://api.slack.com/)からAppを作成し，App - Credentialsからコピー
- **CLIENT_SECRET**: 同上
- **PASSWORD**: 暗号化に必要, 新たに生成するときは`main.js`を参照
- **SALT**: 同上

1. これらの環境変数を設定し，Herokuとかのhttpsサーバー上で`node app.js`を実行し起動
2. Slack API, appの`OAuth & Permissions` > `Redirect URLs` に立ち上げた`https://.../oauth`を追加し保存

## Usage
### token取得
1. ユーザーに認証ページ(https://slack.com/oauth/authorize?client_id=[CLIENT_ID]&scope=chat:write:user)にて認証してもらう。
2. その(遷移先)ページにて`cryptedToken`, `iv`が入ったJSON形式の文字列が表示されるので，保存する

### REST
参考: `example.js`
