---
layout: 'guide'
title: 'Facebook'
---

### Facebook

ユーザーの Facebook アカウントを使ってログインするには、Facebook ストラテジーを使用します。
この認証には、OAuth2.0 を使用しています。

Facebook のサポートは [passport-facebook](https://github.com/jaredhanson/passport-facebook) によって実装されています。

#### インストール

```bash
$ npm install passport-facebook
```

#### 設定方法

Facebook 認証を行う前に、[Facebook Developers](https://developers.facebook.com/) にてアプリケーションを登録する必要があります。
登録が完了すると、アプリケーションIDとアプリケーションシークレットが発行されます。
アプリケーション側ではリダイレクト用のURLを実装してください。このURLは、アクセスが許可された後にユーザーがリダイレクトされるページです。


```javascript
var passport = require('passport')
  , FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: FACEBOOK_APP_ID,
    clientSecret: FACEBOOK_APP_SECRET,
    callbackURL: "http://www.example.com/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
      if (err) { return done(err); }
      done(null, user);
    });
  }
));
```

Facebook 認証のための検証用コールバック内では引数である `accessToken` と `refreshtoken`、`profile` が利用できます。
`profile` は Facebook 上のユーザープロフィール情報です（詳細は[ユーザープロフィール](/guide/profile/)を参照してください）。

<small>注意: セキュリティ上の理由で、リダイレクト用の URL は Facebook に登録したものと同じホストである必要があります。</small>

#### ルーティング

Facebook 認証には2つのルーティングが必要です。
最初のルーティングではユーザーを Facebook へリダイレクトさせます。
次のルーティングでは、Facebook ログインの後でユーザーをリダイレクトさせます。

```javascript
// 認証のためにユーザーを Facebook へリダイレクトさせます。認証が完了すると、
// ユーザーをアプリケーション上の以下のURLへとリダイレクトして戻します。
//     /auth/facebook/callback
app.get('/auth/facebook', passport.authenticate('facebook'));

// ユーザーが許可すると、Facebook はユーザーをこのURLへリダイレクトします。
// アクセストークンの取得によって認証プロセスは完了します。
// 取得が成功すればユーザーはログインしたことになります。取得が失敗した場合は、
// 認証も失敗したとみなされます。
app.get('/auth/facebook/callback', 
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));
```

<small>注意: このコールバックルーティングの URL は、ストラテジーの設定時に `callbackURL` オプションで指定されたものです。</small>

#### アプリケーションの求めるアクセス許可

アプリケーションがユーザーへさらに特定のアクセス許可を求める場合は、`scope` オプションの設定が必要になります。

```javascript
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'read_stream' })
);
```

複数のアクセス許可を指定する場合は、配列を用いて指定します。

```javascript
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] })
);
```

#### Link

Facebook 用の1-クリックサインインは、リンクかボタンによって実現できます。

```xml
<a href="/auth/facebook">Login with Facebook</a>
```
