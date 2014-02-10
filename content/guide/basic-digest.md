---
layout: 'guide'
title: 'Basic認証 & Digest認証'
---

### Basic認証 & Digest認証

HTTPの認証フレームワークを規定すると共に、[RFC 2617](http://tools.ietf.org/html/rfc2617) には、Basic認証、Digest認証の枠組みが策定されています。
これらの2つの枠組みは、ユーザーIDとパスワードをユーザー認証のために使用し、またAPIのエンドポイントを保護するためにも使用されます。

<small>注意: このようなユーザーIDとパスワードに依存する認証は安全性に問題があります。
特に信頼性が求められるクライアントサーバ間の通信には使用しないでください。
このような状況では、[OAuth 2.0](/guide/oauth2-api/)のようなフレームワークが推奨されています。</small>

Basic認証とDigest認証は、[passport-http](https://github.com/jaredhanson/passport-http)モジュールで提供されています。

#### インストール

```bash
$ npm install passport-http
```

### Basic認証

Basic認証はユーザーIDとパスワードを用いてユーザー認証を行います。
この認証方式では平文で情報が送信されるため、HTTPSの使用が推奨されています。

#### 設定方法

```javascript
passport.use(new BasicStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.validPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));
```

Basic認証のための検証用コールバックは、ユーザーIDとパスワードの引数を受け動作します。


#### エンドポイントの保護

```javascript
app.get('/api/me', 
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json(req.user);
  });
```

`basic` をストラテジーに指定し  `passport.authenticate()` を使用することでAPIエンドポイントを保護することができます。
APIの利用にセッション管理は必要ないことが多いので、セッションの無効化も可能です。

### Digest認証

Digest認証は、ユーザーIDとパスワードを用いてユーザー認証を行います。
この認証方式がBasic認証より優れた点は、平文でのパスワード送信を避けるため、チャレンジ/レスポンス認証を採用しているところにあります。

#### 設定方法

```javascript
passport.use(new DigestStrategy({ qop: 'auth' },
  function(username, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, user.password);
    });
  },
  function(params, done) {
    // validate nonces as necessary
    done(null, true)
  }
));
```

上記のDigest認証では2つのコールバックが引数に指定していますが、2つ目は省略可能です。

１つ目のコールバック（シークレットコールバックと呼ばれるもの）は、ユーザーIDと `done` を引数にとります。
`done` には、ユーザーIDとパスワード（平文）を指定してください。
指定されたユーザーID、パスワードからハッシュ値が計算されサーバからリクエストされるものと合致するか検証されます。

2つ目のコールバックは、検証用コールバックであり、リプレイアタック等の脅威を避けるために
サーバから受け取るランダムな文字列（nonce）の検証が可能です。

#### Protect Endpoints

```javascript
app.get('/api/me', 
  passport.authenticate('digest', { session: false }),
  function(req, res) {
    res.json(req.user);
  });
```

`digest` をストラテジーに指定し `passport.authenticate()` を使用することでAPIエンドポイントを保護することができます。
APIの利用にセッション管理は必要とされないことが多いので、セッションの無効化も可能です。
