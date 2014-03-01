---
layout: 'guide'
title: 'Facebook'
---

### Facebook

ユーザーの Facebook アカウントを使ってログインするには、Facebook ストラテジーを使用します。
この認証には、OAuth2.0 を使用しています。

<blockquote class="original">
The Facebook strategy allows users to log in to a web application using their
Facebook account.  Internally, Facebook authentication works using OAuth 2.0.
</blockquote>

Facebook のサポートは [passport-facebook](https://github.com/jaredhanson/passport-facebook) によって実装されています。

<blockquote class="original">
Support for Facebook is implemented by the [passport-facebook](https://github.com/jaredhanson/passport-facebook)
module.
</blockquote>

#### インストール

```bash
$ npm install passport-facebook
```

#### 設定方法

Facebook 認証を行う前に、[Facebook Developers](https://developers.facebook.com/) にてアプリケーションを登録する必要があります。
登録が完了すると、アプリケーションIDとアプリケーションシークレットが発行されます。
アプリケーション側ではリダイレクト用のURLを実装してください。このURLは、アクセスが許可された後にユーザーがリダイレクトされるページです。

<blockquote class="original">
In order to use Facebook authentication, you must first create an app at
[Facebook Developers](https://developers.facebook.com/).  When created, an
app is assigned an App ID and App Secret.  Your application must also implement
a redirect URL, to which Facebook will redirect users after they have approved
access for your application.
</blockquote>

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
`profile` は Facebook 上のユーザープロフィール情報です（詳細は[ユーザープロフィール](/www.passportjs.org/guide/profile/)を参照してください）。

<blockquote class="original">
The verify callback for Facebook authentication accepts `accessToken`,
`refreshToken`, and `profile` arguments.  `profile` will contain user profile
information provided by Facebook; refer to [User Profile](/guide/profile/)
for additional information.
</blockquote>

<small>注意: セキュリティ上の理由で、リダイレクト用の URL は Facebook に登録したものと同じホストである必要があります。</small>

<blockquote class="original">
Note: For security reasons, the redirection URL must reside on the same host
that is registered with Facebook.
</blockquote>

#### ルーティング

Facebook 認証には2つのルーティングが必要です。
最初のルーティングではユーザーを Facebook へリダイレクトさせます。
次のルーティングでは、Facebook ログインの後でユーザーをリダイレクトさせます。

<blockquote class="original">
Two routes are required for Facebook authentication.  The first route redirects
the user to Facebook.  The second route is the URL to which Facebook will
redirect the user after they have logged in.
</blockquote>

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

<blockquote class="original">
Note that the URL of the callback route matches that of the `callbackURL` option
specified when configuring the strategy.
</blockquote>

#### アプリケーションの求めるアクセス許可

アプリケーションがユーザーへさらに特定のアクセス許可を求める場合は、`scope` オプションの設定が必要になります。

<blockquote class="original">
If your application needs extended permissions, they can be requested by setting
the `scope` option.
</blockquote>

```javascript
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: 'read_stream' })
);
```

複数のアクセス許可を指定する場合は、配列を用いて指定します。

<blockquote class="original">
Multiple permissions can be specified as an array.
</blockquote>

```javascript
app.get('/auth/facebook',
  passport.authenticate('facebook', { scope: ['read_stream', 'publish_actions'] })
);
```

#### リンク

Facebook を使った1-クリックサインインは、リンクやボタンによって実現できます。

<blockquote class="original">
A link or button can be placed on a web page, allowing one-click login with
Facebook.
</blockquote>

```xml
<a href="/auth/facebook">Login with Facebook</a>
```
