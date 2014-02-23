---
layout: 'guide'
title: 'Log In'
---

### Log In

Passport はログインセッションを確立するための `login()` 関数を `req` のメソッドとして
用意しています。( `lonIn()` としてエイリアスも貼られています。)

```javascript
req.login(user, function(err) {
  if (err) { return next(err); }
  return res.redirect('/users/' + req.user.username);
});
```

ログイン操作が完了すると、`user` は `req.user` に割り当てられます。

<small>注意: `passport.authentocate()` ミドルウェアは自動的に `req.login()` を実行します。
この関数は主にユーザーのサインアップのために用いられ、その際に `req.login()` 関数を実行し
自動的にログインを行います。</small>
