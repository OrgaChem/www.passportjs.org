---
layout: 'guide'
title: '権限付与'
---

### 権限付与

アプリケーションが複数のサードパーティからの情報を必要とする場合がよくあります。
このようなとき、アプリケーションはユーザーに Facebook や Twitter などのアカウントとの“連携”を要求することになるでしょう。

これは、ユーザーがすでにアプリケーションから認証されていて、かつサードパーティのアカウントからの許可や連携のみが必要な状況です。
このような認証や権限付与の場合にも Passport を使うことができます。

権限付与は `passport.authorize()` の呼び出しによって動作します。
権限付与の申請が承諾されれば、ストラテジーの検証用コールバックの `req.account` に結果がセットされます。
ログインセッションや `req.user` に影響は及びません。

```javascript
app.get('/connect/twitter',
  passport.authorize('twitter-authz', { failureRedirect: '/account' })
);

app.get('/connect/twitter/callback',
  passport.authorize('twitter-authz', { failureRedirect: '/account' }),
  function(req, res) {
    var user = req.user;
    var account = req.account;
    
    // ログイン済のユーザーと Twitter アカウントを連携する。
    account.userId = user.id;
    account.save(function(err) {
      if (err) { return self.error(err); }
      self.redirect('/');
    });
  }
);
```

ルーティングのコールバックでは、`req.user` と `req.account` のどちらも利用可能です。
新しく連携されたアカウントはログインユーザーと紐づけられてデータベースに保存されます。

#### 設定

権限付与のストラテジーは、認証で用いたストラテジーと同じものです。
しかし、アプリケーションがサードパーティの認証と権限付与のどちらも必要とする場合もあるでしょう。
この場合では、_名前付きストラテジー_を使うことで `use()` の呼び出し時のデフォルトの名前をオーバーライドすることができます。

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

上の例では、`twitter-authz` ストラテジーが Twitter のアカウント情報を保存するために `Account` インスタンスを確認または作成していることがわかります。
この結果は `req.account` に代入されているので、ルーティングハンドラーは認証済のユーザーを連携させることができます。

### 検証用コールバック内での連携

このアプローチのデメリットは2つのストラテジーのインスタンスが必要なことです。

これを避けるためには `passReqToCallback` オプションを `true` にセットしてください。
このオプションが有効になると、 *第一*引数として `req` が検証用コールバックに渡されるようになります。

```javascript
passport.use(new TwitterStrategy({
    consumerKey: TWITTER_CONSUMER_KEY,
    consumerSecret: TWITTER_CONSUMER_SECRET,
    callbackURL: "http://www.example.com/auth/twitter/callback",
    passReqToCallback: true
  },
  function(req, token, tokenSecret, profile, done) {
    if (!req.user) {
	  // ログインしていない場合。Twitter アカウントを基にして認証されます。
    } else {
      // ログインしている場合。Twitter アカウントはこのユーザーと連携されます。
      // 連携後も既存のユーザーが渡されるのでログイン状態は変わりません。
      // return done(null, req.user);
    }
  }
));
```

検証用コールバックに `req` が引数として渡されると、リクエストの状態を、認証プロセスの組み立てやひとつのストラテジーインスタンスによる認証・権限付与の処理、ルーティングの設定のために使うことができるようになります。
たとえば、ユーザーが既にログインしている場合でも、新しい連携アカウントを紐づけることができます。
また、`req` にセットされたアプリケーション特有のプロパティ（`req.session` を含む）も利用できます。
