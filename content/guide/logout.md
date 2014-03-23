---
layout: 'guide'
title: 'Log Out'
---

### ログアウト

Passport は `req` 中に `logout()` メソッドを提供しています(`logOut()`という関数としてエイリアスが貼られています)。
このメソッドは、ログインセッションの終了が必要なすべてのルートハンドラで
呼び出すことが可能です。
`logout()` メソッドを実行することで、`req.user` プロパティを削除し、ログインセッションをクリアにします（ログインセッションが無い場合でも呼び出すことは可能です)。

<blockquote class="original">
Passport exposes a `logout()` function on `req` (also aliased as `logOut()`)
that can be called from any route handler which needs to terminate a login
session.  Invoking `logout()` will remove the `req.user` property and clear the
login session (if any).
</blockquote>

```javascript
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});
```
