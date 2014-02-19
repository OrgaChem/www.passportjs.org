---
layout: 'guide'
title: '認証'
---

### 認証

認証リクエストは `passport.authenticate()` に使いたい認証ストラテジーを指定して呼び出すだけで実行できます。
`authenticate()`によって返される関数は [Connect](http://www.senchalabs.org/connect/) 標準に準拠しているので、[Express](http://expressjs.com/) アプリケーションのルーティングミドルウェアとして簡単に利用できます。

<div class="original">
Authenticating requests is as simple as calling `passport.authenticate()` and
specifying which strategy to employ.  `authenticate()`'s function signature is
standard [Connect](http://www.senchalabs.org/connect/) middleware, which makes it
convenient to use as route middleware in [Express](http://expressjs.com/)
applications.
</div>

```javascript
app.post('/login',
  passport.authenticate('local'),
  function(req, res) {
	// 認証に施工すると、この関数が呼び出される。
	// 認証されたユーザーは `req.user` に含まれている。
    res.redirect('/users/' + req.user.username);
  });
```

Passport は、認証に失敗したとき `401 Unauthorized` ステータスを返し、その他のルーティングハンドラーは実行しません。
認証に成功したときは、次のハンドラーを実行し、`req.user` プロパティに認証されたユーザーをセットします。

<div class="original">
By default, if authentication fails, Passport will respond with a
`401 Unauthorized` status, and any additional route handlers will not be
invoked.  If authentication succeeds, the next handler will be invoked and the
`req.user` property will be set to the authenticated user.
</div>

<small>注意: ストラテジーはルーティングされる前に設定されていなければなりません。
詳細は[設定](/www.passportjs.org/guide/configure/)の章で確認できます。</small>

<div class="original">
Note: Strategies must be configured prior to using them in a route.  Continue
reading the chapter on [configuration](/guide/configure/) for details.
</div>

#### リダイレクト

リダイレクトは、一般的にリクエストの認証後におこなわれます。

<div class="original">
A redirect is commonly issued after authenticating a request.
</div>

```javascript
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));
```

この例では、リダイレクトオプションはデフォルトの振る舞いをオーバーライドしています。
認証が成功するとユーザーはホームページにリダイレクトされ、認証が失敗するとユーザーはもう一度認証をおこなうためにログインページに戻るようリダイレクトされます。

<div class="original">
In this case, the redirect options override the default behavior.  Upon
successful authentication, the user will be redirected to the home page.  If
authentication fails, the user will be redirected back to the login page for
another attempt.
</div>

#### フラッシュメッセージ

リダイレクトの後で、ステータス情報を表示するためのフラッシュメッセージを表示することがよくあります。

<div class="original">
Redirects are often combined with flash messages in order to display status
information to the user.
</div>

```javascript
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
```

`failureFlash` オプションを `true` にセットすると、Passport はストラテジーの検証用のコールバックが生成したメッセージを `error` メッセージとして表示します。
この方法を使うと、検証用のコールバックは認証が失敗した理由について正確に判断することができます。
これは多くの場合にもっとも優れたアプローチです。

<div class="original">
Setting the `failureFlash` option to `true` instructs Passport to flash an
`error` message using the message given by the strategy's verify callback, if
any.  This is often the best approach, because the verify callback can make the
most accurate determination of why authentication failed.
</div>

あるいは、フラッシュメッセージを任意に指定することもできます。

<div class="original">
Alternatively, the flash message can be set specifically.
</div>

```javascript
passport.authenticate('local', { failureFlash: 'ユーザーIDかパスワードが間違っています。' });
```

また、認証成功時の `success` メッセージは `successFlash` オプションによって指定できます。

<div class="original">
A `successFlash` option is available which flashes a `success` message when
authentication succeeds.
</div>

```javascript
passport.authenticate('local', { successFlash: 'ようこそ！' });
```

<small>注意: フラッシュメッセージを使うためには、`req.flash()` 関数が必要です。
この関数はExpress 2.x までは提供されていましたが、Express 3.x からは取り除かれています。
Express 3.x では、[connect-flash](https://github.com/jaredhanson/connect-flash) ミドルウェアを使うことでこの機能を利用することができます。</small>

<div class="original">
Note: Using flash messages requires a `req.flash()` function.  Express 2.x
provided this functionality, however it was removed from Express 3.x.  Use of
[connect-flash](https://github.com/jaredhanson/connect-flash) middleware is
recommended to provide this functionality when using Express 3.x.
</div>

#### セッションを無効化

認証が成功した際、Passport は継続的なログインセッションを確立します。
これはユーザーがブラウザから Web アプリケーションにアクセスするといったシナリオで役に立ちます。
しかし、それ以外の場合はセッションのサポートは必要ありません。
たとえば、API サーバーはリクエスト毎に認証情報を要求するのが一般的です。
このような場合では `seeeion` オプションを `false` にすることでセッションサポートを無効にできます。

<div class="original">
After successful authentication, Passport will establish a persistent login
session.  This is useful for the common scenario of users accessing a web
application via a browser.  However, in some cases, session support is not
necessary.  For example, API servers typically require credentials to be
supplied with each request.  When this is the case, session support can be
safely disabled by setting the `session` option to `false`.
</div>

```javascript
app.get('/api/users/me',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
  });
```

#### カスタムコールバック

ビルトインオプションが認証リクエストを処理するのに十分でない場合は、カスタムコールバックによって成功・失敗を処理できます。

<div class="original">
If the built-in options are not sufficient for handling an authentication
request, a custom callback can be provided to allow the application to handle
success or failure.
</div>

```javascript
app.get('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/login'); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.redirect('/users/' + user.username);
    });
  })(req, res, next);
});
```

この例では、`authenticate()` はルーティングミドルウェアで使われずにルーティングハンドラーから呼ばれています。
こうすることで、コールバックのクロージャ内で `req` と `res` オブジェクトにアクセスできています。

<div class="original">
In this example, note that `authenticate()` is called from within the route
handler, rather than being used as route middleware.  This gives the callback
access to the `req` and `res` objects through closure.
</div>

もし認証が失敗したときは、 `user` は `false` にセットされます。
例外が発生したときは `err` がセットされます。また、ストラテジーの検証用コールバックに追加で情報を渡すときには `into` パラメータを利用できます（省略可能）。

<div class="original">
If authentication failed, `user` will be set to `false`.  If an exception
occurred, `err` will be set.  An optional `info` argument will be passed,
containing additional details provided by the strategy's verify callback.
</div>

このコールバックには必要な認証結果が引数として渡されます。
ただし、カスタムコールバックを使うときは、アプリケーションセッション確立（`req.login()`を呼び出すことによる）およびレスポンスの送信をおこなう必要があります。

<div class="original">
The callback can use the arguments supplied to handle the authentication result
as desired.  Note that when using a custom callback, it becomes the
application's responsibility to establish a session (by calling `req.login()`)
and send a response.
</div>
