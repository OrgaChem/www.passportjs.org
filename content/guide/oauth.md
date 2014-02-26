---
layout: 'guide'
title: 'OAuth'
---

### OAuth

[OAuth](http://oauth.net/) とは、ユーザーがデスクトップアプリケーションやモバイルアプリケーションに API アクセスへの権限を付与するための手続きの規格です。
権限が付与されたアプリケーションは、ユーザーに代わって API を操作できます。
また、OAuth は、[委譲型認証](http://hueniverse.com/2009/04/introducing-sign-in-with-twitter-oauth-style-connect/)の為の仕組みとしてよく知られています。

<blockquote class="original">
[OAuth](http://oauth.net/) is a standard protocol that allows users to authorize
API access to web and desktop or mobile applications.  Once access has been
granted, the authorized application can utilize the API on behalf of the user.
OAuth has also emerged as a popular mechanism for [delegated authentication](http://hueniverse.com/2009/04/introducing-sign-in-with-twitter-oauth-style-connect/).
</blockquote>

OAuthは2つの大きな流れから生み出されており、どちらも広く展開されています。

<blockquote class="original">
OAuth comes in two primary flavors, both of which are widely deployed.
</blockquote>

最初のバージョンは、ゆるく組織されたWebデベロッパーの集団によって、オープンであり
標準的な規格として開発されました。その結果、[OAuth 1.0](http://oauth.net/core/1.0/)が生み出され、その後[OAuth 1.0a](http://oauth.net/core/1.0a/)となりました。
現在では、[IETF](http://www.ietf.org/)によって、[RFC 5849](http://tools.ietf.org/html/rfc5849)として標準化されています。

<blockquote class="original">
The initial version of OAuth was developed as an open standard by a loosely
organized collective of web developers.  Their work resulted in [OAuth 1.0](http://oauth.net/core/1.0/),
which was superseded by [OAuth 1.0a](http://oauth.net/core/1.0a/).  This work
has now been standardized by the [IETF](http://www.ietf.org/) as [RFC 5849](http://tools.ietf.org/html/rfc5849).
</blockquote>

最近では、[Web Authorization Protocol Working Group](http://tools.ietf.org/wg/oauth/)によって
[OAuth 2.0](http://tools.ietf.org/html/rfc6749)の策定が行われています。
標準化の策定に時間がかかり、いくつかの草案が展開、実装されており、それぞれ少しずつ
異なる仕様となっています。

<blockquote class="original">
Recent efforts undertaken by the [Web Authorization Protocol Working Group](http://tools.ietf.org/wg/oauth/)
have focused on defining [OAuth 2.0](http://tools.ietf.org/html/rfc6749).  Due
to the lengthy standardization effort, providers have proceeded to deploy
implementations conforming to various drafts, each with slightly different
semantics.
</blockquote>

幸運にも、Passport は OAuth との複雑なやり取りからアプリケーションを守る作りとなっています。
多くの場合、特定のプロバイダーには対応のストラテジーを用いることで一般的なOAuthストラテジーの役割をかわりに果たす
ことが可能です。この方法により、設定の煩わしさや、特定のプロバイダーの奇抜な実装を包括した
認証が可能です。

[Facebook](/www.passportjs.org/guide/facebook/)、 [Twitter](/www.passportjs.org/guide/twitter/)、
それ以外にも様々なプロバイダー([providers](/www.passportjs.org/guide/providers/))に対応しています。

<blockquote class="original">
Thankfully, Passport shields an application from the complexities of dealing
with OAuth variants.  In many cases, a provider-specific strategy can be used
instead of the generic OAuth strategies described below.  This cuts down on the
necessary configuration, and accommodates any provider-specific quirks. See
[Facebook](/www.passportjs.org/guide/facebook/), [Twitter](/www.passportjs.org/guide/twitter/) or the list of
[providers](/www.passportjs.org/guide/providers/) for preferred usage.
</blockquote>

一般的な OAuth 認証は [passport-oauth](https://github.com/jaredhanson/passport-oauth) モジュールによって提供されています。

<blockquote class="original">
Support for OAuth is provided by the [passport-oauth](https://github.com/jaredhanson/passport-oauth)
module.
</blockquote>

#### インストール

```bash
$ npm install passport-oauth
```

### OAuth 1.0

OAuth 1.0 は、権限移譲型の認証用ストラテジーであり、認証にはいくつかのステップがあります。
まず１つ目に、リクエストトークンを得る必要があります。
次に、ユーザーをサービス・プロバイダーへ認証を行うためにリダイレクトさせます。
最後に、承認が得られた後、アプリケーションへとユーザーをリダイレクトさせ、リクエストトークンと
アクセストークンの交換を行います。
サービスプロバイダーへのアクセスを要求するアプリケーションは、コンシューマキー及び
コンシューマシークレットによって特定されます。


<blockquote class="original">
OAuth 1.0 is a delegated authentication strategy that involves multiple steps.
First, a request token must be obtained.  Next, the user is redirected to the
service provider to authorize access.  Finally, after authorization has been
granted, the user is redirected back to the application and the request token
can be exchanged for an access token.  The application requesting access, known
as a _consumer_, is identified by a consumer key and consumer secret.
</blockquote>

#### Configuration

一般的な OAuth 認証では、コンシューマキー及びシークレット、また、ユーザーに提供する
APIのエンドポイントを設定によって明示します。

<blockquote class="original">
When using the generic OAuth strategy, the key, secret, and endpoints are
specified as options.
</blockquote>

```javascript
var passport = require('passport')
  , OAuthStrategy = require('passport-oauth').OAuthStrategy;

passport.use('provider', new OAuthStrategy({
    requestTokenURL: 'https://www.provider.com/oauth/request_token',
    accessTokenURL: 'https://www.provider.com/oauth/access_token',
    userAuthorizationURL: 'https://www.provider.com/oauth/authorize',
    consumerKey: '123-456-789',
    consumerSecret: 'shhh-its-a-secret'
    callbackURL: 'https://www.example.com/auth/provider/callback'
  },
  function(token, tokenSecret, profile, done) {
    User.findOrCreate(..., function(err, user) {
      done(err, user);
    });
  }
));
```

OAuth認証に基づくストラテジーのための検証用コールバックは、`token`、`tokenSecret`、
また、`profile`、`argumentes`を提供します。`token` はアクセストークンであり、`tokenSecret` は
アクセストークンに紐づくシークレットです。`profile` にはサービスプロバイダーによって提供される
ユーザー情報が格納されています。詳しくは、[User Profile](/www.passportjs.org/guide/profile/)を御覧ください。

<blockquote class="original">
The verify callback for OAuth-based strategies accepts `token`, `tokenSecret`,
and `profile` arguments.  `token` is the access token and `tokenSecret` is its
corresponding secret.  `profile` will contain user profile information provided
by the service provider; refer to [User Profile](/www.passportjs.org/guide/profile/) for
additional information.
</blockquote>

#### ルーティング

OAuth認証には2つのルーティングが求められます。
1つ目は、OAuth認証の開始とサービスプロバイダーへユーザをリダイレクトするためのルーティング、
2つ目に、プロバイダーにて認証を終えたユーザーをリダイレクトさせるURLへのルーティングです。

<blockquote class="original">
Two routes are required for OAuth authentication.  The first route initiates an
OAuth transaction and redirects the user to the service provider.  The second
route is the URL to which the user will be redirected after authenticating with
the provider.
</blockquote>

```javascript
//認証のため、プロバイダーへユーザーをリダイレクトします。
//完了すると、プロバイダーはユーザーをアプリケーション内の下記のURLへとリダイレクトさせます。
//     /auth/provider/callback

//OAuth 認証を行うプロバイダーはアプリケーションへとユーザーをリダイレクトさせます。
//認証プロセスはアクセストークンを取得することによって完了します。
//アクセストークンを取得できていれば成功とみなし、それ以外は失敗とみなされます。

app.get('/auth/provider/callback', 
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }));
```

#### リンク

リンクやボタンをWebページに配置することにより、クリックによる認証プロセスを
開始することが可能です。

<blockquote class="original">
A link or button can be placed on a web page, which will start the
authentication process when clicked.
</blockquote>

```xml
<a href="/auth/provider">Log In with OAuth Provider</a>
```

### OAuth 2.0

OAuth 2.0 は、OAuth 1.0 の正式な後継者であり、短所を補うように設計されています。
認証フローにおいて、本質的な部分に違いはありません。
ユーザーはまず始めにサービスプロバイダーへと認証のためにリダイレクトされます。
その後、承認が得られた後アクセストークンと交換可能なコードと共にアプリケーションへと
再びリダイレクトされます。
サービスプロバイダーへのアクセスを要求するアプリケーションは、それぞれID及びシークレットによって
特定されます。

<blockquote class="original">
OAuth 2.0 is the successor to OAuth 1.0, and is designed to overcome perceived
shortcomings in the earlier version.  The authentication flow is essentially the
same.  The user is first redirected to the service provider to authorize access.
After authorization has been granted, the user is redirected back to the
application with a code that can be exchanged for an access token.  The
application requesting access, known as a _client_, is identified by an ID and
secret.
</blockquote>

#### 設定

一般的なOAuth 2.0 ストラテジーでは、クライアントID及びクライントシークレット、また、
ユーザーへ提供するエンドポイントを設定により明示します。

<blockquote class="original">
When using the generic OAuth 2.0 strategy, the client ID, client secret, and
endpoints are specified as options.
</blockquote>

```javascript
var passport = require('passport')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

passport.use('provider', new OAuth2Strategy({
    authorizationURL: 'https://www.provider.com/oauth2/authorize',
    tokenURL: 'https://www.provider.com/oauth2/token',
    clientID: '123-456-789',
    clientSecret: 'shhh-its-a-secret'
    callbackURL: 'https://www.example.com/auth/provider/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate(..., function(err, user) {
      done(err, user);
    });
  }
));
```

OAuth 2.0 に基づくストラテジーの為の検証用コールバックでは、`accessToken`、`refreshToken`、
また、`profile`が提供されます。`refreshToken` は新しいアクセストークンを取得するために使用され、
プロバイダーによってリフレッシュトークンが提供されない場合は、`undefined` となります。
`profile` はサービスプロバイダーによって提供されるユーザー情報が格納されています。
詳しくは、[User Profile](/www.passportjs.org/guide/profile/)を参照してください。

<blockquote class="original">
The verify callback for OAuth 2.0-based strategies accepts `accessToken`,
`refreshToken`, and `profile` arguments.  `refreshToken` can be used to obtain
new access tokens, and may be `undefined` if the provider does not issue refresh
tokens.  `profile` will contain user profile information provided by the service
provider; refer to [User Profile](/www.passportjs.org/guide/profile/) for additional information.
</blockquote>

#### ルーティング

OAuth 2.0 認証には2つのルーティングが求められます。
1つ目は、サービスプロバイダーへユーザをリダイレクトするためのルーティング、
2つ目に、プロバイダーにて認証を終えたユーザーをリダイレクトさせるURLへのルーティングです。

<blockquote class="original">
Two routes are required for OAuth 2.0 authentication.  The first route redirects
the user to the service provider.  The second route is the URL to which the user
will be redirected after authenticating with the provider.
</blockquote>

```javascript
//認証のため、プロバイダーへユーザーをリダイレクトします。
//完了すると、プロバイダーはユーザーをアプリケーション内の下記のURLへとリダイレクトさせます。
//     /auth/provider/callback

//OAuth 認証を行うプロバイダーはアプリケーションへとユーザーをリダイレクトさせます。
//認証プロセスはアクセストークンを取得することによって完了します。
//アクセストークンを取得できていれば成功とみなし、それ以外は失敗とみなされます。

app.get('/auth/provider/callback', 
  passport.authenticate('provider', { successRedirect: '/',
                                      failureRedirect: '/login' }));
```

#### スコープ

OAuth 2.0 を用いたアクセスをリクエストする際は、スコープオプションによってアクセスを行う範囲の
制約を設けることが可能です。

<blockquote class="original">
When requesting access using OAuth 2.0, the scope of access is controlled by the
scope option.
</blockquote>

```javascript
app.get('/auth/provider',
  passport.authenticate('provider', { scope: 'email' })
);
```

複数のスコープをアレイとして指定することも可能です。

<blockquote class="original">
Multiple scopes can be specified as an array.
</blockquote>

```javascript
app.get('/auth/provider',
  passport.authenticate('provider', { scope: ['email', 'sms'] })
);
```

プロバイダーごとにスコープオプションに指定する値は様々です。
どのようなスコープをサポートしているかはプロバイダーのドキュメントを参照してください。

<blockquote class="original">
Values for the `scope` option are provider-specific.  Consult the provider's
documentation for details regarding supported scopes.
</blockquote>

#### リンク

リンクやボタンをWebページに配置することによって、認証プロセスをクリックにより開始することが可能です。

<blockquote class="original">
A link or button can be placed on a web page, which will start the
authentication process when clicked.
</blockquote>

```xml
<a href="/auth/provider">Log In with OAuth 2.0 Provider</a>
```
