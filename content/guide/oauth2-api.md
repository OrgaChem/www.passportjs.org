---
layout: 'guide'
title: 'OAuth 2.0 API'
---

### OAuth 2.0

OAuth 2.0 は [RFC 6749](http://tools.ietf.org/html/rfc6749) に策定された認可フレームワークの一種で、ユーザーのアクセス権限を外部のアプリケーションに付与するための仕組みです。権限付与が成功すると、アプリケーションは認証情報としてトークンを利用することになります。
このような仕組みを使うと、2つの観点で安全性が高まります：

  1. アプリケーションはユーザー名とパスワードを保存する必要がありません
  2. トークンで付与される権限は限定的です（たとえば、読み込み権限のみ付与ということもできるでしょう）

これらの利点は Web アプリケーションの安全性の保証する上でも重要な要素です。
このような、OAuth 2.0 は API の認証に広く使われている標準です。

OAuth 2.0 によって API のエンドポイントを保護するためには、3つのステップを踏む必要があります。

  1. アプリケーションは、ユーザーに保護されたリソースへのアクセス許可をリクエストします
  2. ユーザーに許可されると、アプリケーションにトークンが発行されます
  3. アプリケーションはトークンを使って、保護されたリソースにアクセスします
     
#### トークンの発行

Passport の姉妹プロジェクトである [OAuth2orize](https://github.com/jaredhanson/oauth2orize) は、 OAuth 2.0 の権限付与サーバー実装のためのツールキットです。

権限付与プロセスでは、アプリケーションとユーザーのリクエスト、ユーザーの許可、ユーザーが意思決定できる程度の詳細情報の提供などの複雑な手続きをとらなければなりません。

加えて、アプリケーションのアクセスできる範囲をどの程度で制限するかという判断は実装者ごとに異なります。

OAuth2orize は、実装を決定するようなことはしてくれません。
しかし、OAuth 2.0 を利用するサービスにおけるセキュリティの懸念事項を理解するために、OAuth2orize を利用することを強く勧めます。

#### 認証トークン

OAuth 2.0 が提供する枠組みは、発行されるトークンの種類を任意に拡張できます。
しかし、実際には広く使われていますトークンの種類は限られています。

#### Bearer トークン

Bearer トークンは OAuth 2.0 で最も議論されているトークンの種類です。
多くの実装では、発行できるトークンは bearer トークンのみとされています。

Bearer トークンの認証には [passport-http-bearer](https://github.com/jaredhanson/passport-http-bearer) モジュールを使ってください。

##### インストール

```bash
$ npm install passport-http-bearer
```

##### Configuration

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

##### エンドポイントの保護

```javascript
app.get('/api/me', 
  passport.authenticate('bearer', { session: false }),
  function(req, res) {
    res.json(req.user);
  });
```

API のエンドポイントを `bearer` トークンを使った認証で保護するには、`passport.authenticate()` に `bearer` ストラテジーを指定してください。
なお、このような API にセッション管理は不要なことが多いため、無効にすることが出来ます。
