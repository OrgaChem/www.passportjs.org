---
layout: 'guide'
title: 'Twitter'
---

### Twitter

ユーザーの Twitter アカウントを使ってログインするには、Twitter ストラテジーを使います。この認証には OAuth 1.0a を使っています。

Twitter サポートは [passport-twitter](https://github.com/jaredhanson/passport-twitter) によって実装されています。

#### インストール

```bash
$ npm install passport-twitter
```

#### 設定方法

Twitter 認証を使う前に [Twitter Developers](https://dev.twitter.com/) でアプリケーションを登録しておく必要があります。
登録が終わると、アプリケーションにコンシューマーキーとコンシューマーシークレットが発行されます。
アプリケーション側ではコールバックURLを実装しておいてください。
このURLはアクセスが許可された後にユーザーがリダイレクトされるページを示す必要があります。

```javascript
var passport = require('passport')
  , TwitterStrategy = require('passport-twitter').Strategy;

passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));
```

Twitter 認証のための検証用コールバック内では引数である `token` と `tokenSecret`、`profile` が利用できます。
`profile` は Twitter 上のユーザープロフィール情報です（詳細は[ユーザープロフィール](/guide/profile/)を参照してください）。

#### ルーティング

Twitter 認証には2つのルーティングが必要です。
最初のルーティングでは OAuth トランザクションを開始し、ユーザーを Twitter へリダイレクトさせます。
次のルーティングでは Twitter サインインの後でユーザーをリダイレクトさせます。

```javascript
// 認証のために Twitter へリダイレクトさせます。認証が完了すると、Twitter は
// ユーザーをアプリケーションへとリダイレクトして戻します。
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// ユーザーが許可を確認すると、Twitter はユーザーをこの URL にリダイレクトさせます。
// この認証プロセスの最後に、アクセストークンの取得をおこないます。
// この取得が成功すればユーザーはログインしたことになります。取得に失敗したとき
// は、認証が失敗したとみなされます。
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));
```

<small>注意: このコールバックルーティングの URL は、ストラテジーの設定時に `callbackURL` オプションで指定されたものです。</small>

#### リンク

Twitter を使った1-クリックサインインは、リンクやボタンによって実現できます。

```xml
<a href="/auth/twitter">Sign in with Twitter</a>
```
