---
layout: 'guide'
title: '設定'
---

### 設定

Passportを認証に用いるためには、以下の3つの項目を設定する必要があります:

 1. 認証用ストラテジーの選択
 2. アプリケーションミドルウェア 
 3. セッション管理(_省略可_)

 <blockquote class="original">
 Three pieces need to be configured to use Passport for authentication:
 
 1. Authentication strategies
 2. Application middleware
 3. Sessions (_optional_)
 </blockquote>

#### ストラテジーの設定

Passportは認証のために_ストラテジー_と呼ばれるものを認証に使用します。
ストラテジーは、ユーザーIDとパスワード用いた検証や、[OAuth](http://oauth.net/)を用いた権限委譲、分散認証システムである[OpenID](http://openid.net/)を用いた認証に対応しています。

Passportを用いて認証を行う前に、必ず1つ以上のストラテジーに関する設定が必要になります。

ストラテジーやその設定は `use()` 関数にて提供されます。
以下に、`LocalStrategy` でのユーザーID、パスワードを用いた認証の例を示します。

<blockquote class="original">
Passport uses what are termed _strategies_ to authenticate requests.  Strategies
range from verifying a username and password, delegated authentication using [OAuth](http://oauth.net/)
or federated authentication using [OpenID](http://openid.net/).

Before asking Passport to authenticate a request, the strategy (or strategies)
used by an application must be configured.

Strategies, and their configuration, are supplied via the `use()` function.  For
example, the following uses the `LocalStrategy` for username/password
authentication.
</blockquote>

```javascript
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));
```

##### 検証用コールバックに関する設定

この例では重要なコンセプトを説明します。
ストラテジーは_検証用コールバック_(_verify callback_)と呼ばれるものを必要とします。
検証用コールバックの目的は、認証情報を照合し、ユーザーを特定することです。


認証がリクエストされると、Passportはリクエストに含まれる認証情報を解析します。
上の例では、ユーザーIDとパスワードが認証情報として検証用コールバックの引数に指定されます。
認証情報が正しい場合は、検証用コールバック内で `done` を実行する際に Passport に認証済のユーザー情報を返してください。

<blockquote class="original">
This example introduces an important concept.  Strategies require what is known
as a _verify callback_.  The purpose of a verify callback is to find the user
that possesses a set of credentials.

When Passport authenticates a request, it parses the credentials contained in
the request.  It then invokes the verify callback with those credentials as
arguments, in this case `username` and `password`.  If the credentials are
valid, the verify callback invokes `done` to supply Passport with the user that
authenticated.
</blockquote>

```javascript
return done(null, user);
```

上記の例において、パスワードが不正であるようといった認証情報の誤りがある場合は、`false` を引数に指定し `done` を実行します。
これにより認証情報が失敗した、ということを Passport に通知します。

<blockquote class="original">
If the credentials are not valid (for example, if the password is incorrect),
`done` should be invoked with `false` instead of a user to indicate an
authentication failure.
</blockquote>

```javascript
return done(null, false);
```

認証が失敗した原因を詳細にメッセージとして通知することも可能です。
この機能は、フラッシュメッセージとしてユーザーに再度認証を促す場合に役立ちます。

<blockquote class="original">
An additional info message can be supplied to indicate the reason for the
failure.  This is useful for displaying a flash message prompting the user to
try again.
</blockquote>

```javascript
return done(null, false, { message: 'Incorrect password.' });
```

最後に、認証中にデータベースが機能していないといった例外が発生した際は、Node の慣用的な表現にて error 情報を指定し `done` を実行することで通知可能です。

<blockquote class="original">
Finally, if an exception occurred while verifying the credentials (for example,
if the database is not available), `done` should be invoked with an error, in
conventional Node style.
</blockquote>

```javascript
return done(err);
```

この2つのエラーがどのような場合に発生するのか、両者を明確に区別しておくことが重要です。
後者はサーバ側での例外であり、この例外が発生した際には `err` に `null` 以外の値がセットされます。
認証時の例外は、認証に失敗したことによるものですから、正常な動作により引き起こされる例外です。
この点はサーバ側の例外と明確に異なっています。
この場合は、`err` が `null` であることは保障され、詳細なメッセージを追加する目的で引数の最後のパラメータを使用する事が出来ます。

このようにストラテジーに処理を委譲することで、検証用コールバックは、Passportとデータベースを疎に保ちます。
これによりアプリケーションは、認証レイヤーでの様々な前提条件にとらわれず、ユーザー情報をどのように格納するか自由に選択できます。

<blockquote class="original">
Note that it is important to distinguish the two failure cases that can occur.
The latter is a server exception, in which `err` is set to a non-`null` value.
Authentication failures are natural conditions, in which the server is operating
normally.  Ensure that `err` remains `null`, and use the final argument to pass
additional details.

By delegating in this manner, the verify callback keeps Passport database
agnostic.  Applications are free to choose how user information is stored,
without any assumptions imposed by the authentication layer.
</blockquote>

#### ミドルウェアの設定

[Connect](http://senchalabs.github.com/connect/) or [Express](http://expressjs.com/)を基盤にしたアプリケーションでは、`passport.initialize()` を用いて Passport の初期化を行うことが必要になります。
アプリケーションでログイン後のセッション管理を行う場合には、`passport.session()` の記述も必要になります。

```javascript
app.configure(function() {
  app.use(express.static('public'));
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.session({ secret: 'keyboard cat' }));
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(app.router);
});
```

セッションのサポートはほとんどのアプリケーションで推奨されていますが、オプションで省略することができます。
セッションのサポート機能を有効にする場合は、正しい順番でログインセッションを処理できるように、`passport.session()` *の前に* `express.session()` を記述してください。

#### セッション管理に関する設定

現在Web上にあるほとんどのアプリケーションは、都度認証を行うのではなく、認証情報をログインリクエストのときのみ送信しています。
そして、認証が成功した場合は、ブラウザ上のクッキーを利用することでセッションを確立・維持する作りになっています。

この仕組みは、ユニークなクッキーによるセッション管理によって実現されています。
ログイン後のリクエストそれぞれに認証情報を含むことはありません。
セッションのサポートのために、パスポートは `user` インスタンスをシリアライズ/デシリアライズしてセッション情報として管理しています。

<blockquote class="original">
In a typical web application, the credentials used to authenticate a user will
only be transmitted during the login request.  If authentication succeeds, a
session will be established and maintained via a cookie set in the user's
browser.

Each subsequent request will not contain credentials, but rather the unique
cookie that identifies the session.  In order to support login sessions,
Passport will serialize and deserialize `user` instances to and from the
session.
</blockquote>

```javascript
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});
```

この例では、`userID` をシリアライズしてセッションに埋め込み、データをコンパクトにしています。
リクエストを受け取ると、IDからユーザーを特定し、`req.user` 内に格納します。

上記のシリアライズ、デシリアライズ内の動作はアプリケーションによって定義されるため、アプリケーションでは認証レイヤーでの制限無しに、適切なデーターベースやオブジェクトマッパーを選択可能です。

<blockquote class="original">
In this example, only the user ID is serialized to the session, keeping the
amount of data stored within the session small.  When subsequent requests are
received, this ID is used to find the user, which will be restored to
`req.user`.

The serialization and deserialization logic is supplied by the application,
allowing the application to choose an appropriate database and/or object mapper,
without imposition by the authentication layer.
</blockquote>
