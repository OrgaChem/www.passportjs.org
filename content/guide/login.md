---
layout: 'guide'
title: 'Log In'
---

### ログイン

Passport はログインセッションを確立するための `login()` 関数を `req` のメソッドとして
用意しています。( `lonIn()` としてエイリアスも貼られています。)


<blockquote class="original">
Passport exposes a `login()` function on `req` (also aliased as `logIn()`) that
can be used to establish a login session.
</blockquote>

```javascript
req.login(user, function(err) {
  if (err) { return next(err); }
  return res.redirect('/users/' + req.user.username);
});
```

ログイン操作が完了すると、`user` は `req.user` に割り当てられます。

<blockquote class="original">
When the login operation completes, `user` will be assigned to `req.user`.
</blockquote>

<small>注意: `passport.authentocate()` ミドルウェアは自動的に `req.login()` を実行します。
この関数は主にユーザーのサインアップのために用いられ、その際に `req.login()` 関数を実行し
自動的にログインを行います。</small>

<blockquote class="original">
Note: `passport.authenticate()` middleware invokes `req.login()` automatically.
This function is primarily used when users sign up, during which `req.login()`
can be invoked to automatically log in the newly registered user.
</blockquote>
