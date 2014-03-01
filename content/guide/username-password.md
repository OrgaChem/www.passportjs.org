---
layout: 'guide'
title: 'ユーザーID & パスワード'
---

### ユーザーID & パスワード

多くの Web サイトの認証に、ユーザーID/パスワード認証が使われています。この認証メカニズムは [passport-local](https://github.com/jaredhanson/passport-local) モジュールによって提供されています。

<blockquote class="original">
The most widely used way for websites to authenticate users is via a username
and password.  Support for this mechanism is provided by the [passport-local](https://github.com/jaredhanson/passport-local)
module.
</blockquote>


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

ローカルの認証に検証用コールバックには、アプリケーションのログインフォームによって送信されてきた `username` と `password` が引数として与えられています。

The verify callback for local authentication accepts `username` and `password`
arguments, which are submitted to the application via a login form.

#### フォーム

ユーザーは Web ページ上のフォームから認証情報を入力できます。


```xml
<form action="/login" method="post">
    <div>
        <label>ユーザーID：</label>
        <input type="text" name="username"/>
    </div>
    <div>
        <label>パスワード：</label>
        <input type="password" name="password"/>
    </div>
    <div>
        <input type="submit" value="Log In"/>
    </div>
</form>
```

#### ルート

ログインフォームの内容は `POST` メソッドでサーバーに送信されます。
`local` ストラテジーでログイン要求を処理するためには、`authenticate()` を使います。

```javascript
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
```

検証用コールバック内で指定した `message` オプションで `error` メッセージなどをフラッシュメッセージとして表示するには、`failureFlash` オプションを `true` にしてください。

#### パラメーター

`LocalStrategy` は認証情報を `username` と `password` の2つのパラメータ名で確認しています。
別のフィールド名を使っている場合は、確認するパラメータ名を変更してください。

    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'passwd'
      },
      function(username, password, done) {
        // ...
      }
    ));
