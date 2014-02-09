---
layout: 'guide'
title: 'ユーザーID & パスワード'
---

### ユーザーID & パスワード

多くの Web サイトの認証に、ユーザーID/パスワード認証が使われています。この認証
メカニズムは [passport-local](https://github.com/jaredhanson/passport-local)
モジュールによって提供されています。

#### インストール

```bash
$ npm install passport-local
```

#### 設定

```javascript
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
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

ローカルの認証に検証用コールバックには、アプリケーションのログインフォームに
よって送信されてきた `username` と `password` が引数として与えられています。

#### フォーム

ユーザーは Web ページ上のフォームから認証情報を入力できます。


```xml
<form action="/login" method="post">
    <div>
        <label>Username:</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>Password:</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
</form>
```

#### ルート

ログインフォームの内容は `POST` メソッドでサーバーに送信されます。
`local` ストラテジーでログイン要求を処理するためには、`authenticate()` を
使います。

```javascript
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
```

検証用コールバック内で指定した `message` オプションで `error` メッセージなどを
フラッシュメッセージとして表示するには、`failureFlash` オプションを `true` に
してください。

#### パラメーター

`LocalStrategy` は認証情報を `username` と `password` の2つのパラメータ名で確認
しています。別のフィールド名を使っている場合は、確認するパラメータ名を変更して
ください。

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd'
      },
      function(username, password, done) {
        // ...
      }
    ));
