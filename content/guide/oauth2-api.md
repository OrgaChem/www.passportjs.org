---
layout: 'guide'
title: 'OAuth 2.0 API'
---

### OAuth 2.0

OAuth 2.0 は [RFC 6749](http://tools.ietf.org/html/rfc6749)で策定された、ユーザーのアクセス権限を外部のアプリケーションに付与するための枠組みです。権限付与が許可されると、アプリケーションは認証情報としてトークンを利用することになります。
この仕組みを使うと、2つの観点で安全性が高まります：

<blockquote class="original">
OAuth 2.0 (formally specified by [RFC 6749](http://tools.ietf.org/html/rfc6749))
provides an authorization framework which allows users to authorize access to
third-party applications.  When authorized, the application is issued a token to
use as an authentication credential.  This has two primary security benefits:
</blockquote>

  1. アプリケーションはユーザーIDとパスワードを保存する必要がありません
  2. トークンで付与される権限は限定的です（たとえば、読み込み権限のみ付与ということもできるでしょう）

<blockquote class="original">
  1. The application does not need to store the user's username and password.
  2. The token can have a restricted scope (for example: read-only access).
</blockquote>

これらの利点は Web アプリケーションの安全性の保証する上でも重要な要素です。
このような OAuth 2.0 は API の認証に広く使われている標準です。

<blockquote class="original">
These benefits are particularly important for ensuring the security of web
applications, making OAuth 2.0 the predominant standard for API authentication.
</blockquote>

OAuth 2.0 によって API のエンドポイントを保護するためには、3つのステップを踏む必要があります。

<blockquote class="original">
When using OAuth 2.0 to protect API endpoints, there are three distinct steps
that must be performed:
</blockquote>

  1. アプリケーションは、保護されたリソースへのアクセス許可をユーザーにリクエストします
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

Passport の姉妹プロジェクトである [OAuth2orize](https://github.com/jaredhanson/oauth2orize) は、 OAuth 2.0 の権限付与サーバー実装のためのツールキットです。

<blockquote class="original">
[OAuth2orize](https://github.com/jaredhanson/oauth2orize), a sibling project to
Passport, provides a toolkit for implementing OAuth 2.0 authorization servers.
</blockquote>

権限付与プロセスでは、アプリケーションとユーザーのリクエスト、ユーザーの許可、ユーザーが意思決定できる程度の詳細情報の提供などの複雑な手続きをとらなければなりません。

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

OAuth2orize は、実装を決定するようなことはしてくれません。
このガイドはこれらの問題点をカバーするものではありませんが、OAuth2.0での認証を提供しているサービスではセキュリティに関する問題意識を持つことを強く推奨しています。

<blockquote class="original">
As a toolkit, OAuth2orize does not attempt to make implementation decisions.
This guide does not cover these issues, but does highly recommend that
services deploying OAuth 2.0 have a complete understanding of the security
considerations involved.
</blockquote>

#### 認証トークン

OAuth 2.0 が提供する枠組みは、発行されるトークンの種類を任意に拡張できます。
しかし、実際には広く使われてるトークンの種類は限られています。

<blockquote class="original">
OAuth 2.0 provides a framework, in which an arbitrarily extensible set of token
types can be issued.  In practice, only specific token types have gained
widespread use.
</blockquote>

#### Bearer トークン

Bearer トークンは OAuth 2.0 で最も議論されているトークンの種類です。
多くの実装では、発行できるトークンは bearer トークンのみとされています。

<blockquote class="original">
Bearer tokens are the most widely issued type of token in OAuth 2.0.  So much
so, in fact, that many implementations assume that bearer tokens are the only
type of token issued.
</blockquote>

Bearer トークンの認証には [passport-http-bearer](https://github.com/jaredhanson/passport-http-bearer) モジュールを使ってください。

<blockquote class="original">
Bearer tokens can be authenticated using the [passport-http-bearer](https://github.com/jaredhanson/passport-http-bearer)
module.
</blockquote>

##### インストール

```bash
$ npm install passport-http-bearer
```

##### 設定

```javascript
passport.use(new BearerStrategy(
  function(token, done) {
    User.findOne({ token: token }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'read' });
    });
  }
));
```

Bearer トークンの検証用コールバック内では、`token` 引数が利用できます。
また、`done` の実行時に `info` を指定すると、`req.authInfo` をセットすることができます。
これは、トークンの範囲通知やアクセス制御の確認のために使うことができます。

<blockquote class="original">
The verify callback for bearer tokens accepts the `token` as an argument.
When invoking `done`, optional `info` can be passed, which will be set by
Passport at `req.authInfo`.  This is typically used to convey the scope of the
token, and can be used when making access control checks.
</blockquote>

##### エンドポイントの保護

```javascript
app.get('/api/me', 
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json(req.user);
  });
```

ユーザーへ提供するAPI のエンドポイントを、 `bearer` トークンを使った認証で保護するには、`passport.authenticate()` に `bearer` ストラテジーを指定してください。
なお、このような API にセッション管理は不要なことが多いため、無効にすることが出来ます。

<blockquote class="original">
Specify `passport.authenticate()` with the `bearer` strategy to protect API
endpoints.  Sessions are not typically needed by APIs, so they can be disabled.
</blockquote>
