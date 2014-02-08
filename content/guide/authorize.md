---
layout: 'guide'
title: '権限付与'
---

### 権限付与

アプリケーションが複数のサードパーティからの情報を必要とする場合がよくあります。
このようなとき、アプリケーションはユーザに Facebook や Twitter などのアカウント
との“連携”を要求することになるでしょう。

これは、ユーザがすでにアプリケーションから認証されていて、かつサードパーティの
アカウントからの許可・連携のみが必要な状況です。このような認証・権限付与の場合
にも Passport を使うことができます。

権限付与は `passport.authorize()` の呼び出しによって動作します。もし権限付与の
申請が承諾されれば、ストラテジーの検証用コールバックの `req.account` に結果が
セットされます。このとき、ログインセッションや `req.user` に影響は及びません。

```javascript
app.get('/connect/twitter',
  passport.authorize('twitter-authz', { failureRedirect: '/account' })
);

app.get('/connect/twitter/callback',
  passport.authorize('twitter-authz', { failureRedirect: '/account' }),
  function(req, res) {
    var user = req.user;
    var account = req.account;
    
    // ログイン済のユーザと Twitter アカウントを連携する。
    account.userId = user.id;
    account.save(function(err) {
      if (err) { return self.error(err); }
      self.redirect('/');
    });
  }
);
```

route のコールバックでは、`req.user` と `req.account` のどちらも利用可能です。
新しく連携されたアカウントはログインユーザと紐づけられてデータベースに保存
されます。

#### 設定

権限付与のストラテジーは、認証で用いたストラテジーと同じものです。
しかし、アプリケーションがサードパーティの認証と権限付与のどちらも必要とする
場合もあるでしょう。この場合では、_名前付きストラテジー_を使うことで `use()` の
呼び出し時のデフォルトの名前をオーバーライドすることができます。

```javascript
passport.use('twitter-authz', new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/connect/twitter/callback"
  },
  function(token, tokenSecret, profile, done) {
    Account.findOne({ domain: 'twitter.com', uid: profile.id }, function(err, account) {
      if (err) { return done(err); }
      if (account) { return done(null, account); }

      var account = new Account();
      account.domain = 'twitter.com';
      account.uid = profile.id;
      var t = { kind: 'oauth', token: token, attributes: { tokenSecret: tokenSecret } };
      account.tokens.push(t);
      return done(null, account);
    });
  }
));
```

上の例では、`twitter-authz` ストラテジーが Twitter のアカウント情報を保存する
ために `Account` インスタンスを確認または作成していることがわかります。この
結果は `req.account` に代入されているので、route ハンドラーは認証済のユーザを
連携させることができます。

### 検証用コールバック内での連携

このアプローチのデメリットは ストラテジー・route サポートが同じ2つのインスタンス
が必要なことです。

これを避けるためには `passReqToCallback` オプションを `true` にセットして
ください。このオプションが有効になると、 *第一*引数として `req` が検証用
コールバックに渡されるようになります。

```javascript
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/twitter/callback",
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    if (!req.user) {
	  // ログインしていない場合。Twitter アカウントを基にして認証される。
    } else {
      // ログインしている場合。Twitter アカウントはこのユーザと連携される。
      // 連携後も既存のユーザーが渡されるのでログイン状態は変わらない。
      // return done(null, req.user);
    }
  }
));
```

検証用コールバックに `req` が引数として渡されると、認証プロセスの組み立てや、
ひとつのストラテジーインスタンスによる認証・権限付与の処理、routes のセットの
ために、リクエストの状態を使うことができます。
たとえば、ユーザが既にログインしている場合でも、新しい連携アカウントを紐づける
ことができます。また、`req` にセットされたアプリケーション特有のプロパティ（
`req.session` を含む）も利用できます。
