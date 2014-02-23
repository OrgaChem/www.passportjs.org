---
layout: 'guide'
title: 'Google'
---

### Google

ユーザーの Google アカウントを使ってログインするには、Google ストラテジーを使用します。
この認証には、OpenID を使用しています。

<blockquote class="original">
The Google strategy allows users to sign in to a web application using their
Google account.  Internally, Google authentication works using OpenID.
</blockquote>

OpenID ストラテジーは汎用的に利用できる一方、Google ストラテジーでは
認証情報を入力しない、１クリックサインインを提供しています。
選択可能なプロバイダには制限があるものの、ユーザビリティは格段に向上します。

<blockquote class="original">
Using this strategy directly, as opposed to the general-purpose OpenID strategy,
allows a site to offer one-click sign in.  The user does not have to enter an
identifier, which improves usability, albeit at the expense of limiting choice
of provider.
</blockquote>

Google のサポートは、 [passport-google](https://github.com/jaredhanson/passport-google)によって実装されています。

<blockquote class="original">
Support for Google is implemented by the [passport-google](https://github.com/jaredhanson/passport-google)
module.
</blockquote>

#### インストール

```bash
$ npm install passport-google
```

#### 設定項目

Google ストラテジーを用いる場合は、リダイレクト用のURLを実装する必要があります。
このURLはアプリケーションが許可された場合に Google からリダイレクトされるページです。
`realm` は認証要求が有効なURLスコープを示すもので、多くの場合はリダイレクト用のページの
ルートURLが指定されます。

<blockquote class="original">
When using Google for sign in, your application must implement a return
URL, to which Google will redirect users after they have authenticated.
The `realm` indicates the part of URL-space for which authentication is valid.
Typically this will be the root URL of your website.
</blockquote>


```javascript
var passport = require('passport')
  , GoogleStrategy = require('passport-google').Strategy;

passport.use(new GoogleStrategy({
    returnURL: 'http://www.example.com/auth/google/return',
    realm: 'http://www.example.com/'
  },
  function(identifier, profile, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));
```

Google 認証のための検証用コールバックでは認証のために `identifier` と `profile` を引数として使用できます。
`profile` は Google から提供されるユーザー情報を提供します。
詳しくは、[User Profile](/www.passportjs.org/guide/profile/) を参照してください。

<blockquote class="original">
The verify callback for Google authentication accepts `identifier` and `profile`
arguments.  `profile` will contain user profile information provided by Google;
refer to [User Profile](/www.passportjs.org/guide/profile/) for additional information.
</blockquote>

#### Routes

Google 認証には２つのルーティングが必要です。
最初のルーティングではユーザーを Google へリダイレクトさせます。
次のルーティングでは、Google での認証が行われた後ユーザーをリダイレクトさせます。

<blockquote class="original">
Two routes are required for Google authentication.  The first route redirects
the user to Google.  The second route is the URL to which Google will return the
user after they have signed in.
</blockquote>

```javascript
// 認証のためにユーザーを Google へリダイレクトし、認証が完了すると、
// ユーザーを下記のURLにリダイレクトします。
//     /auth/google/return
app.get('/auth/google', passport.authenticate('google'));

// Google は認証が完了すると、下記のURLにユーザーをリダイレクトさせます。
// 一連のプロセスは、ログインが成功したことを検証することで認証の完了とし、
// さもなければ認証失敗とみなされます。
app.get('/auth/google/return', 
  passport.authenticate('google', { successRedirect: '/',
                                    failureRedirect: '/login' }));
```

<small>注意:上記のリターン用ルートはストラテジーの設定時に設定しているものと一致させなければなりません。</small>

<blockquote class="original">
Note that the URL of the return route matches that of the `returnURL` option
specified when configuring the strategy.
</blockquote>

#### リンク

Google での1-クリックサインインは、リンクやボタンによって実現できます。

<blockquote class="original">
A link or button can be placed on a web page, allowing one-click sign in with
Google.
</blockquote>

```xml
<a href="/auth/google">Sign In with Google</a>
```
