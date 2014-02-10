---
layout: 'guide'
title: 'ユーザープロフィール'
---

### ユーザープロフィール

Facebook や Twitter のような外部のサービスの認証を利用する場合の多くはユーザーのプロフォール情報が利用できます。これらのサービスでは、プロフィール
情報のエンコーディングが異なっていることが多いため、対応が面倒になっています。
そのため、Passport はこれらのプロフィール情報を正規化する機能を持っています。

プロフィール情報は [Portable Contacts](http://portablecontacts.net/) によって策定された [コンタクトスキーマ](http://portablecontacts.net/draft-spec.html#schema) の形式で正規化されます。
共通するフィールドについては下の表をご覧ください。

<dl>
  <dt><code>provider</code> {String}<dt>
  <dd>サービスの提供者 (`facebook` や `twitter` など)。</dd>
  <dt><code>id</code> {String}<dt>
  <dd>サービスの提供者によって生成されたユーザーのユニークな識別子。</dd>
  <dt><code>displayName</code> {String}<dt>
  <dd>表示されるユーザID</dd>
  <dt><code>name</code> {Object}<dt>
  <dd>
    <dl>
      <dt><code>familyName</code> {String}<dt>
      <dd>ユーザーの姓（欧米圏ではラストネーム）。</dd>
      <dt><code>givenName</code> {String}<dt>
      <dd>ユーザーの名（欧米圏ではファーストネーム）。</dd>
      <dt><code>middleName</code> {String}<dt>
      <dd>ユーザーのミドルネーム。</dd>
    </dl>
  </dd>
  <dt><code>emails</code> {Array} [n]<dt>
  <dd>
    <dl>
      <dt><code>value</code> {String}<dt>
      <dd>メールアドレス。</dd>
      <dt><code>type</code> {String}<dt>
      <dd>メールアドレスの種類（自宅や職場など）。</dd>
    </dl>
  </dd>
  <dt><code>photos</code> {Array} [n]<dt>
  <dd>
    <dl>
      <dt><code>value</code> {String}<dt>
      <dd>写真の URL。</dd>
    </dl>
  </dd>
</dl>

<small>注意：全てのサービスで、これら全てのフィールドが利用できるとは限りません。
また、サービスの提供者によっては上のリストに記載されていない情報も利用できることがあります。
詳細については各サービス提供者のドキュメントを参照してください。</small>
