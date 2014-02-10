---
layout: 'guide'
title: '認証スキーム'
---

### 認証スキーム

API のエンドポイントを保護するための認証スキームのストラテジーを下のリストにまとめました。。


<table class="table table-condensed table-striped">
  <thead>
    <tr>
      <th>認証スキーム</th>
      <th>仕様</th>
      <th>開発者</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>[Anonymous](https://github.com/jaredhanson/passport-anonymous)</td>
      <td>N/A</td>
      <td>[Jared Hanson](https://github.com/jaredhanson)</td>
    </tr>
    <tr>
      <td>[Bearer](https://github.com/jaredhanson/passport-http-bearer)</td>
      <td>[RFC 6750](http://tools.ietf.org/html/rfc6750)</td>
      <td>[Jared Hanson](https://github.com/jaredhanson)</td>
    </tr>
    <tr>
      <td>[Basic認証](https://github.com/jaredhanson/passport-http)</td>
      <td>[RFC 2617](http://tools.ietf.org/html/rfc2617)</td>
      <td>[Jared Hanson](https://github.com/jaredhanson)</td>
    </tr>
    <tr>
      <td>[Digest認証](https://github.com/jaredhanson/passport-http)</td>
      <td>[RFC 2617](http://tools.ietf.org/html/rfc2617)</td>
      <td>[Jared Hanson](https://github.com/jaredhanson)</td>
    </tr>
    <tr>
      <td>[Hash](https://github.com/yuri-karadzhov/passport-hash)</td>
      <td>N/A</td>
      <td>[Yuri Karadzhov](https://github.com/yuri-karadzhov)</td>
    </tr>
    <tr>
      <td>[Hawk](https://github.com/jfromaniello/passport-hawk)</td>
      <td>[hueniverse/hawk](https://github.com/hueniverse/hawk)</td>
      <td>[José F. Romaniello](https://github.com/jfromaniello)</td>
    </tr>
    <tr>
      <td>[Local API Key](https://github.com/cholalabs/passport-localapikey)</td>
      <td>N/A</td>
      <td>[Sudhakar Mani](https://github.com/cholalabs)</td>
    </tr>
    <tr>
      <td>[OAuth](https://github.com/jaredhanson/passport-http-oauth)</td>
      <td>[RFC 5849](http://tools.ietf.org/html/rfc5849)</td>
      <td>[Jared Hanson](https://github.com/jaredhanson)</td>
    </tr>
    <tr>
      <td>[OAuth 2.0 Client Password](https://github.com/jaredhanson/passport-oauth2-client-password)</td>
      <td>[RFC 6749](http://tools.ietf.org/html/rfc6749#section-2.3.1)</td>
      <td>[Jared Hanson](https://github.com/jaredhanson)</td>
    </tr>
    <tr>
      <td>[OAuth 2.0 JWT Client Assertion](https://github.com/xtuple/passport-oauth2-jwt-bearer)</td>
      <td>[draft-jones-oauth-jwt-bearer](http://tools.ietf.org/html/draft-jones-oauth-jwt-bearer)</td>
      <td>[xTuple](https://github.com/xtuple)</td>
    </tr>
    <tr>
      <td>[OAuth 2.0 Public Client](https://github.com/timshadel/passport-oauth2-public-client)</td>
      <td>[RFC 6749](http://tools.ietf.org/html/rfc6749)</td>
      <td>[Tim Shadel](https://github.com/timshadel)</td>
    </tr>
  </tbody>
</table>
