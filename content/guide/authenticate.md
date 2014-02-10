---
layout: 'guide'
title: '認証'
---

### 認証

認証リクエストは `passport.authenticate()` に使いたい認証ストラテジーを指定して呼び出すだけで実行できます。
`authenticate()`によって返される関数は [Connect](http://www.senchalabs.org/connect/) 標準に準拠しているので、[Express](http://expressjs.com/) アプリケーションのルーティングミドルウェアとして簡単に利用できます。

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

<small>注意: ストラテジーはルーティングされる前に設定されていなければなりません。
詳細は[設定](/www.passportjs.org/guide/configure/)の章で確認できます。</small>

#### リダイレクト

リダイレクトは、一般的にリクエストの認証後におこなわれます。

```javascript
app.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login' }));
```

この例では、リダイレクトオプションはデフォルトの振る舞いをオーバーライドしています。
認証が成功するとユーザーはホームページにリダイレクトされ、認証が失敗するとユーザーはもう一度認証をおこなうためにログインページに戻るようリダイレクトされます。

#### フラッシュメッセージ

リダイレクトの後で、ステータス情報を表示するためのフラッシュメッセージを表示することがよくあります。

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

あるいは、フラッシュメッセージを任意に指定することもできます。

```javascript
passport.authenticate('local', { failureFlash: 'ユーザーIDかパスワードが間違っています。' });
```

また、認証成功時の `success` メッセージは `successFlash` オプションによって指定できます。

```javascript
passport.authenticate('local', { successFlash: 'ようこそ！' });
```

注意: フラッシュメッセージを使うためには、`req.flash()` 関数が必要です。
この関数はExpress 2.x までは提供されていましたが、Express 3.x からは取り除かれています。
Express 3.x では、[connect-flash](https://github.com/jaredhanson/connect-flash) ミドルウェアを使うことでこの機能を利用することができます。

#### セッションを無効化

認証が成功した際、Passport は継続的なログインセッションを確立します。
これはユーザーがブラウザから Web アプリケーションにアクセスするといったシナリオで役に立ちます。
しかし、それ以外の場合はセッションのサポートは必要ありません。
たとえば、API サーバーはリクエスト毎に認証情報を要求するのが一般的です。
このような場合では `seeeion` オプションを `false` にすることでセッションサポートを無効にできます。

```javascript
app.get('/api/users/me',
  passport.authenticate('basic', { session: false }),
  function(req, res) {
    res.json({ id: req.user.id, username: req.user.username });
  });
```

#### カスタムコールバック

ビルトインオプションが認証リクエストを処理するのに十分でない場合は、カスタムコールバックによって成功・失敗を処理できます。

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

もし認証が失敗したときは、 `user` は `false` にセットされます。
例外が発生したときは `err` がセットされます。また、ストラテジーの検証用コールバックに追加で情報を渡すときには `into` パラメータを利用できます（省略可能）。

このコールバックには必要な認証結果が引数として渡されます。
ただし、カスタムコールバックを使うときは、アプリケーションセッション確立（`req.login()`を呼び出すことによる）およびレスポンスの送信をおこなう必要があります。
