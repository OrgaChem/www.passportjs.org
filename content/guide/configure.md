---
layout: 'guide'
title: '設定'
---

### 設定

Passportを認証に用いるためには、以下の3つの項目を設定する必要があります:

 1. 認証用ストラテジーの選択
 2. アプリケーションミドルウェア 
 3. セッション管理(_省略可_)

#### ストラテジーの設定

Passportは認証のために_ストラテジー_と呼ばれるものを認証に使用します。
ストラテジーは、ユーザーIDとパスワード用いた検証や、[OAuth](http://oauth.net/)を用いた権限委譲、分散認証システムである[OpenID](http://openid.net/)を用いた認証に対応しています。

Passportを用いて認証を行う前に、必ず1つ以上のストラテジーに関する設定が必要になります。

ストラテジーやその設定は `use()` 関数にて提供されます。
以下に、`LocalStrategy` でのユーザーID、パスワードを用いた認証の例を示します。

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

```javascript
return done(null, user);
```

上記の例において、パスワードが不正であるようといった認証情報の誤りがある場合は、`false` を引数に指定し `done` を実行します。
これにより認証情報が失敗した、ということを Passport に通知します。

```javascript
return done(null, false);
```

認証が失敗した原因を詳細にメッセージとして通知することも可能です。
この機能は、フラッシュメッセージとしてユーザーに再度認証を促す場合に役立ちます。

```javascript
return done(null, false, { message: 'Incorrect password.' });
```

最後に、認証中にデータベースが機能していないといった例外が発生した際は、Node の慣用的な表現にて error 情報を指定し `done` を実行することで通知可能です。

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
