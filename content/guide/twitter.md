---
layout: 'guide'
title: 'Twitter'
---

### Twitter

ユーザーの Twitter アカウントを使ってログインするには、Twitter ストラテジーを使います。この認証には OAuth 1.0a を使っています。

<blockquote class="original">
The Twitter strategy allows users to sign in to a web application using their
Twitter account.  Internally, Twitter authentication works using OAuth 1.0a.
</blockquote>

Twitter サポートは [passport-twitter](https://github.com/jaredhanson/passport-twitter) によって実装されています。

<blockquote class="original">
Support for Twitter is implemented by the [passport-twitter](https://github.com/jaredhanson/passport-twitter)
module.
</blockquote>

#### インストール

```bash
$ npm install passport-twitter
```

#### 設定方法

Twitter 認証を使う前に [Twitter Developers](https://dev.twitter.com/) でアプリケーションを登録しておく必要があります。
登録が終わると、アプリケーションにコンシューマーキーとコンシューマーシークレットが発行されます。
アプリケーション側ではコールバックURLを実装しておいてください。
このURLではアクセスが許可された後にユーザーがリダイレクトされるページを示す必要があります。

<blockquote class="original">
In order to use Twitter authentication, you must first create an application at
[Twitter Developers](https://dev.twitter.com/).  When created, an application is
assigned a consumer key and consumer secret.  Your application must also
implement a callback URL, to which Twitter will redirect users after they have
approved access for your application.
</blockquote>

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
`profile` は Twitter 上のユーザープロフィール情報です（詳細は[ユーザープロフィール](/www.passportjs.org/guide/profile/)を参照してください）。

<blockquote class="original">
The verify callback for Twitter authentication accepts `token`, `tokenSecret`,
and `profile` arguments.  `profile` will contain user profile information
provided by Twitter; refer to [User Profile](/guide/profile/) for additional
information.
</blockquote>

#### ルーティング

Twitter 認証には2つのルーティングが必要です。
最初のルーティングでは OAuth トランザクションを開始し、ユーザーを Twitter へリダイレクトさせます。
次のルーティングでは Twitter サインインの後でユーザーをリダイレクトさせます。

```javascript
// 認証のために Twitter へリダイレクトさせます。認証が完了すると、Twitter は
// ユーザーをアプリケーションへとリダイレクトして戻します。
//   /auth/twitter/callback
app.get('/auth/twitter', passport.authenticate('twitter'));

// ユーザーが許可すると、Twitter はユーザーをこの URL にリダイレクトさせます。
// この認証プロセスの最後に、アクセストークンの取得をおこないます。
// この取得が成功すればユーザーはログインしたことになります。取得に失敗したとき
// は、認証が失敗したとみなされます。
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));
```

<small>注意: このコールバックルーティングの URL は、ストラテジーの設定時に `callbackURL` オプションで指定されたものです。</small>

<blockquote class="original">
Note that the URL of the callback route matches that of the `callbackURL` option
specified when configuring the strategy.
</blockquote>

#### リンク

Twitter を使った1-クリックサインインは、リンクやボタンによって実現できます。

<blockquote class="original">
A link or button can be placed on a web page, allowing one-click sign in with
Twitter.
</blockquote>

```xml
<a href="/auth/twitter">Twitter でサインイン</a>
```
