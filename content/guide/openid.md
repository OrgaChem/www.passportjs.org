---
layout: 'guide'
title: 'OpenID'
---

### OpenID

[OpenID](http://openid.net/) は分散認証のオープン標準です。
ユーザーは OpenID を提示すると Web サイトにサインインできます。
ユーザーの認証は、ユーザが選んだ OpenID プロバイダーにユーザーの識別子の正当性を検証してもらうことでおこなわれます。
Web サイトは検証結果を確認し、ユーザーのサインインをおこないます。

<blockquote class="original">
[OpenID](http://openid.net/) is an open standard for federated authentication.
When visiting a website, users present their OpenID to sign in.  The user then
authenticates with their chosen OpenID provider, which issues an assertion to
confirm the user's identity.  The website verifies this assertion in order to
sign the user in.
</blockquote>

OpenID は [passport-openid](https://github.com/jaredhanson/passport-openid) モジュールによって提供されています。

<blockquote class="original">
Support for OpenID is provided by the [passport-openid](https://github.com/jaredhanson/passport-openid)
module.
</blockquote>

#### インストール

```bash
$ npm install passport-openid
```

#### 設定方法

OpenID を利用するには、`returnURL` と `realm` を明示しなければなりません。
この `returnURL` は OpenID プロバイダーによる認証後にユーザーがリダイレクトされる先の URL です。
`realm` は認証が正当である URL の範囲を示します。
通常であればこれらは Web サイトのルート URL となっています。

<blockquote class="original">
When using OpenID, a return URL and realm must be specified.  The `returnURL` is
the URL to which the user will be redirected after authenticating with their
OpenID provider.  `realm` indicates the part of URL-space for which
authentication is valid.  Typically this will be the root URL of the website.
</blockquote>

```javascript
var passport = require('passport')
  , OpenIDStrategy = require('passport-openid').Strategy;

passport.use(new OpenIDStrategy({
    returnURL: 'http://www.example.com/auth/openid/return',
    realm: 'http://www.example.com/'
  },
  function(identifier, done) {
    User.findOrCreate({ openId: identifier }, function(err, user) {
      done(err, user);
    });
  }
));
```

OpenID 認証の検証用コールバック内では、引数として `identifier` を利用できます。
`identifier` はユーザーの主張している識別子が含まれます。

<blockquote class="original">
The verify callback for OpenID authentication accepts an `identifier` argument
containing the user's claimed identifier.
</blockquote>

#### フォーム

OpenId を使ったサインインは、Web ページのフォーム上で実現できます。

<blockquote class="original">
A form is placed on a web page, allowing the user to enter their OpenID and
sign in.
</blockquote>

```xml
<form action="/auth/openid" method="post">
    <div>
        <label>OpenID:</label>
        <input type="text" name="openid_identifier"/><br/>
    </div>
    <div>
        <input type="submit" value="Sign In"/>
    </div>
</form>
```

#### ルーティング

OpenID 認証には2つのルーティングが必要です。
最初に OpenID 識別子を含むフォームの内容を送信します。
認証の際、ユーザーは OpenID プロバイダーへとリダイレクトされます。
次のルーティングでは、OpenID プロバイダーの認証後にユーザーを指定した URL に戻します。

<blockquote class="original">
Two routes are required for OpenID authentication.  The first route accepts the
form submission containing an OpenID identifier.  During authentication, the
user will be redirected to their OpenID provider.  The second route is the URL
to which the user will be returned after authenticating with their OpenID
provider.
</blockquote>

```javascript
// 認証のために OpenID 識別子を受け取った後、ユーザーを OpenID プロバイダーへと
// リダイレクトさせます。この後、OpenID プロバイダーはユーザーをアプリケーションへと
// リダイレクトして戻します：
//     /auth/openid/return
app.post('/auth/openid', passport.authenticate('openid'));

// OpenID プロバイダーがユーザーをアプリケーションへとリダイレクトして戻した後、
// 検証結果を確認して認証を終えます。検証結果の正当性が確認できれば、ユーザーは
// ログインできます。確認できなければ、認証は失敗します。
app.get('/auth/openid/return', 
  passport.authenticate('openid', { successRedirect: '/',
                                    failureRedirect: '/login' }));
```

#### プロフィール取得

OpenID では、認証されたユーザーのプロフィール情報の取得を設定できます。
プロフィール取得を有効にするには、 `profile` オプションを `true` にしてください。

<blockquote class="original">
OpenID can optionally be configured to retrieve profile information about the
user being authenticated.  Profile exchange is enabled by setting the `profile`
option to `true`.
</blockquote>

```javascript
passport.use(new OpenIDStrategy({
    returnURL: 'http://www.example.com/auth/openid/return',
    realm: 'http://www.example.com/',
    profile: true
  },
  function(identifier, profile, done) {
    // ...
  }
));
```

プロフィール交換が有効になれば、検証用コールバックの引数に `profile` が追加されます。
`profile` には OpenID プロバイダーが提供したユーザーのプロフィール情報がセットされています(詳細は[ユーザープロフィール](/www.passportjs.org/guide/profile/)を参照してください) 。

<blockquote class="original">
When profile exchange is enabled, the function signature of the verify callback
accepts an additional `profile` argument containing user profile information
provided by the OpenID provider; refer to [User Profile](/guide/profile/) for
further information.
</blockquote>
