---
layout: 'guide'
title: 'Configure'
---

### 設定項目

Passportを認証に用いるためには、以下の3つの項目を設定する必要があります:

 1. 認証用ストラテジーの選択
 2. アプリケーションミドルウェア 
 3. セッション管理(_省略可_)

#### ストラテジーに関する設定

Passportは認証のために_ストラテジー_と呼ばれるものを認証に使用します。
ストラテジーは、ユーザーIDとパスワード用いた検証から、[OAuth](http://oauth.net/)を用いた権限委譲認証もしくは、
分散認証システムである[OpenID](http://openid.net/)を用いた認証に対応しています。

Passportを用いて認証を行う前に、必ず１つ、もしくは複数のストラテジーに関する設定が必要になります。

ストラテジー、そしてそれらの設定は `use()` 関数にて提供されます。
以下に、 `LocalStrategy` でのユーザーID、パスワードを用いた認証の例を示します。



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

この例では重要なコンセプトが示されています。ストラテジーは_検証用コールバック_(verify callback)と呼ばれるものを必要とします。
検証用コールバックの目的は、認証情報を照合し、ユーザーを特定することにあります。



認証がリクエストされると、Passportはリクエストに含まれる認証情報を解析します。
上記の例では、ユーザーIDとパスワードが認証情報として検証用コールバックの引数に指定されます。
認証情報が正しい場合、検証用コールバックは `done` を実行し、Passportに認証済のユーザー情報を返します。

```javascript
return done(null, user);
```

上記の例において、パスワードが不正であるような、認証情報に誤りがある場合は、
`false` を引数に指定し `done` を実行します。これにより認証情報が失敗した、ということを
Passportに通知します。

```javascript
return done(null, false);
```

認証が失敗した原因を詳細にメッセージとして通知することも可能です。
この機能は、フラッシュメッセージとしてユーザーに再度認証を促す場合に
役立ちます。

```javascript
return done(null, false, { message: 'Incorrect password.' });
```

最後に、認証中にデータベースが機能していない場合のような例外が発生した際は、
Nodeの慣用的な表現にてerror情報を指定し `done` を実行することで通知可能です。

```javascript
return done(err);
```

この2つのエラーがどのような場合に発生するのか、両者を明確に区別しておくことが必要です。
後者はサーバ側での例外であり、この例外が発生した際には `err` に `null` 以外の値がセットされます。
認証時の例外は、認証に失敗したことによるもので、正常な動作により引き起こされる例外なので、サーバ側の
例外とは明確に異なります。この場合は、`err` が `null` であることは保障され、詳細なメッセージを追加する目的で
引数の最後のパラメータを使用する事が出来ます。

このようにストラテジーに処理を委譲することで、検証用コールバックは、Passportデータベースを非依存型に保ちます。
これによりアプリケーションは、認証レイヤーでの様々な前提条件にとらわれず、
ユーザー情報をどのように格納するか自由に選択できます。


#### ミドルウェアの設定

[Connect](http://senchalabs.github.com/connect/) or [Express](http://expressjs.com/)を基盤にしたアプリケーションでは、
`passport.initialize()` を用いてPassportの初期化を行うことが必要になります。
アプリケーションでログイン後のセッション管理を行う場合には、
`passport.session()` の記述も必要になります。

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

セッションのサポートは基本的にオプションとして省略可能ではありますが、殆どのアプリケーションで
推奨されています。もしセッションのサポート機能を有効にする場合は、
正しい順番でログインセッションを処理できるように、
`passport.session()` *の前に* `express.session()` を記述してください。

#### セッション管理に関する設定

現在Web上にあるアプリケーションの殆どは、都度認証を行うのではなく、
認証情報をログインリクエストのときのみ送信し、認証が成功した場合は、ブラウザ上のクッキーを利用することで、
セッションを確立・維持する作りになっています。

ログイン後のリクエストそれぞれが認証情報を含んでいるのではなく、ユニークなクッキーによって、
セッションの管理を行います。セッションのサポートのために、パスポートは `user` インスタンスを
シリアライズ/デシリアライズしてセッション情報として管理しています。

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

上記のシリアライズ、デシリアライズ内の動作はアプリケーションによって定義されるため、
アプリケーションでは認証レイヤーでの制限無しに、適切なデーターベースやオブジェクトマッパーを選択可能です。
