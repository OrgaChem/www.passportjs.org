---
layout: 'guide'
title: 'OAuth APIs'
---

### OAuth

[OAuth](http://oauth.net/) は [RFC 5849](http://tools.ietf.org/html/rfc5849) で策定された、外部のアプリケーションがユーザーのデータへのアクセス権を獲得できるようにする枠組みです。
この枠組みでは、ユーザーはアプリケーションにパスワードを供与する必要がありません。

<blockquote class="original">
[OAuth](http://oauth.net/) (formally specified by [RFC 5849](http://tools.ietf.org/html/rfc5849))
provides a means for users to grant third-party applications access to their
data without exposing their password to those applications.
</blockquote>

このプロトコルを利用すれば、Web アプリケーションのセキュリティを改善することができます。
たとえば、パスワードを外部のサービスに供与することによるリスクを避けることができます。

<blockquote class="original">
The protocol greatly improves the security of web applications, in particular,
and OAuth has been important in bringing attention to the potential dangers of
exposing passwords to external services.
</blockquote>

OAuth 1.0 は未だに広く使われていますが、改良版である [OAuth 2.0](/www.passportjs.org/guide/oauth2-api/) への切り替えが推奨されています。

<blockquote class="original">
While OAuth 1.0 is still widely used, it has been superseded by [OAuth 2.0](/guide/oauth2-api/).
It is recommended to base new implementations on OAuth 2.0.
</blockquote>

OAuth によって API のエンドポイントを保護するためには、3つのステップを踏む必要があります。

<blockquote class="original">
When using OAuth to protect API endpoints, there are three distinct steps that
that must be performed:
</blockquote>

  1. アプリケーションは、ユーザーに保護されたリソースへのアクセス許可をリクエストします
  2. ユーザーに許可されると、アプリケーションにトークンが発行されます
  3. アプリケーションはトークンを使って、保護されたリソースにアクセスします

<blockquote class="original">
  1. The application requests permission from the user for access to protected
     resources.
  2. A token is issued to the application, if permission is granted by the user.
  3. The application authenticates using the token to access protected
     resources.
</blockquote>

#### トークンの発行

Passportの姉妹プロジェクトである[OAuthorize](https://github.com/jaredhanson/oauthorize)は、
OAuth認証を行うためのToolKitです。

<blockquote class="original">
[OAuthorize](https://github.com/jaredhanson/oauthorize), a sibling project to
Passport, provides a tookit for implementing OAuth service providers.
</blockquote>

権限付与プロセスでは、アプリケーションとユーザーのリクエスト、ユーザーの許可、
ユーザーが意思決定できる程度の詳細情報の提供などの複雑な手続きをとらなければなりません。

<blockquote class="original">
The authorization process is a complex sequence that involves authenticating
both the requesting application and the user, as well as prompting the user for
permission, ensuring that enough detail is provided for the user to make an
informed decision.
</blockquote>

加えて、アプリケーションのアクセスできる範囲をどの程度で制限するかという判断は実装者ごとに異なります。

<blockquote class="original">
Additionally, it is up to the implementor to determine what limits can be placed
on the application regarding scope of access, as well as subsequently enforcing
those limits.
</blockquote>

そしてツールキットであるOAuthorizeは実装を決定してくれるものではありません。
このガイドはこれらの問題を解決するものではありませんが、セキュリティに関する
懸念事項を理解するためにも、OAuthを使用することを強くオススメします。

<blockquote class="original">
As a toolkit, OAuthorize does not attempt to make implementation decisions.
This guide does not cover these issues, but does highly recommended that
services deploying OAuth have a complete understanding of the security
considerations involved.
</blockquote>

#### トークンの認証

OAuthトークンは[passport-http-oauth](https://github.com/jaredhanson/passport-http-oauth)を用いて認証が行えます。

<blockquote class="original">
Once issued, OAuth tokens can be authenticated using the [passport-http-oauth](https://github.com/jaredhanson/passport-http-oauth)
module.
</blockquote>

##### インストール

```bash
$ npm install passport-http-oauth
```

##### 設定

```javascript
passport.use('token', new TokenStrategy(
  function(consumerKey, done) {
    Consumer.findOne({ key: consumerKey }, function (err, consumer) {
      if (err) { return done(err); }
      if (!consumer) { return done(null, false); }
      return done(null, consumer, consumer.secret);
    });
  },
  function(accessToken, done) {
    AccessToken.findOne({ token: accessToken }, function (err, token) {
      if (err) { return done(err); }
      if (!token) { return done(null, false); }
      Users.findById(token.userId, function(err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        // ４つ目の引数はオプションです。  
        // 認証要求に求められる詳細な情報がよく指定されます。 (ex: `scope`)
        return done(null, user, token.secret, { scope: token.scope });
      });
    });
  },
  function(timestamp, nonce, done) {
    // validate the timestamp and nonce as necessary
    done(null, true)
  }
));
```

他のストラテジーとは対照的に、OAuth には2つのコールバックが求められます。
OAuthでは、アプリケーションが求める個人情報及びユーザー固有のトークンはどちらも証明書として
エンコードされています。

<blockquote class="original">
In contrast to other strategies, there are two callbacks required by OAuth.  In
OAuth, both an identifier for the requesting application and the user-specific
token are encoded as credentials.
</blockquote>

１つ目のコールバックは、"コンシュマコールバック"として知られており、アプリケーションが作成した
秘密情報を含んだリクエストを見つけ出すものです。
２つ目は、"トークンコールバック"と呼ばれており、ユーザー及びトークン、さらに対応するシークレットを
特定するためのものです。
コンシューマ及びトークンコールバックによって提供されるシークレットは証明書の作成のために用いられ、
リクエストの証明書と異なっていた場合には認証失敗となります。

<blockquote class="original">
The first callback is known as the "consumer callback", and is used to find the
application making the request, including the secret assigned to it.  The second
callback is the "token callback", which is used to indentify the user as well as
the token's corresponding secret.  The secrets supplied by the consumer and
token callbacks are used to compute a signature, and authentication fails if it
does not match the request signature.
</blockquote>

最後に、オプションとして"検証用コールバック"があります。
このコールバックは、リクエスト中のタイムスタンプや、名前を確認することにより
リプレイアタックの脅威を防ぐためによく使われます。

<blockquote class="original">
A final "validate callback" is optional, which can be used to prevent replay
attacks by checking the timestamp and nonce used in the request.
</blockquote>

##### エンドポイントの保護

```javascript
app.get('/api/me', 
  passport.authenticate('token', { session: false }),
  function(req, res) {
    res.json(req.user);
  });
```

`token` をストラテジーに指定し、 `passport.authenticate()` を用いることによってユーザーへ提供するAPIのエンドポイントを保護することができます。
APIの利用にセッション管理は必要とされないことが多いので、セッションの無効化も可能です。

<blockquote class="original">
Specify `passport.authenticate()` with the `token` strategy to protect API
endpoints.  Sessions are not typically needed by APIs, so they can be disabled.
</blockquote>
