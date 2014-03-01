---
layout: 'guide'
title: 'はじめに'
---

### はじめに

Passport は [Node](http://nodejs.org/) のための認証ミドルウェアです。
認証リクエストをおこなうための必要最低限の機能をもつように設計されています。
この Passport の素晴らしいところは、認証リクエスト以外の全ての機能をアプリケーション側で自由に実現できるということに尽きます。
このように Passport とアプリケーションを疎結合に保つことによって、コードは簡潔になり保守性が高まることでしょう。
さらに、Passport はとても簡単にアプリケーションに組み込むことができるのです。

<blockquote class="original">
Passport is authentication middleware for [Node](http://nodejs.org/).  It is
designed to serve a singular purpose: authenticate requests.  When writing
modules, encapsulation is a virtue, so Passport delegates all other
functionality to the application.  This separation of concerns keeps code clean
and maintainable, and makes Passport extremely easy to integrate into an
application.
</blockquote>

モダンな Web アプリケーションは多くの認証形態を採用しています。
これまで、ユーザーはユーザーIDとパスワードでログインしてきました。
しかし、いまどきは[Facebook](https://www.facebook.com/) や [Twitter](https://twitter.com/) などのソーシャルネットワーキングと連携し、 [OAuth](http://oauth.net/) を使ったシングルサインオンをおこなう手法が一般的に普及してきています。
これらの API を公開しているサービスでは、アクセスを保護するためにトークンベースの認証情報を必要としています。

<blockquote class="original">
In modern web applications, authentication can take a variety of forms.
Traditionally, users log in by providing a username and password.  With the rise
of social networking, single sign-on using an [OAuth](http://oauth.net/)
provider such as [Facebook](https://www.facebook.com/) or [Twitter](https://twitter.com/)
has become a popular authentication method.  Services that expose an API often
require token-based credentials to protect access.
</blockquote>

Passport はアプリケーション毎に、それぞれ適した認証があることを踏まえてつくられています。
アプリケーションへの認証機能の組み込みは、_ストラテジー_と呼ばれる独立した認証メカニズムのモジュールを選ぶだけで実現できます。

<blockquote class="original">
Passport recognizes that each application has unique authentication
requirements.  Authentication mechanisms, known as _strategies_, are packaged as
individual modules.  Applications can choose which strategies to employ, without
creating unnecessary dependencies.
</blockquote>

認証作業は複雑かもしれませんが、何もコードまでも複雑なものになる必要はもうないのです。

<blockquote class="original">
Despite the complexities involved in authentication, code does not have to be
complicated.
</blockquote>

```javascript
app.post('/login', passport.authenticate('local', { successRedirect: '/',
                                                    failureRedirect: '/login' }));
```

#### インストール

```bash
$ npm install passport
```
