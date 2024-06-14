export const DEFAULT_SITE_NAME: string = 'Torichan Imageboard Engine';

export const DEFAULT_SITE_SLOGAN: string = 'Put your slogan here...';

export const DEFAULT_SITE_NAVBAR: string =
  '[<a href="/faq">FAQ</a>][<a href="/rules">Rules</a>] || [<a href="/admin">Management</a>][<a href="/main">Home</a>]';

export const DEFAULT_MENU_FRAME: string = `
<div class="menu-header brand">
  <a href="/" target="_blank">Torichan</a>
</div>
<a href="/main" class="menu-link" target="main">Main page</a>
<a href="/a" class="menu-link" target="main">/a/ - Anime</a>
<a href="/b" class="menu-link" target="main">/b/ - Random</a>
<a href="/c" class="menu-link" target="main">/c/ - Comics</a>
<a href="/d" class="menu-link" target="main">/d/ - Discussions about Torichan</a>
<a href="#" class="menu-link" target="main">Please edit this page...</a>
`;

export const DEFAULT_START_PAGE: string = `
<h1 class="tori-title" style="text-align: center">Torichan Imageboard Engine</h1>
<em class="tori-slogan" style="text-align: center">Put your slogan here...</em>
<p class="tori-main-links" style="text-align: center">
  [<a href="/rules">global rules</a>] / [<a href="/admin">management</a>] / [<a href="https://github.com/d-indifference/torichan">torichan engine</a>]
</p>

<table border="1" class="tori-board-list" cellpadding="5" style="margin: 0 auto">
  <tr>
    <td>
      <strong><a href="/a">/a/ - Anime</a></strong>
      <p>Lorem ipsum sit dolor amet</p>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="/b">/b/ - Random</a></strong>
      <p>Lorem ipsum sit dolor amet</p>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="/c">/b/ - Comics</a></strong>
      <p>Lorem ipsum sit dolor amet</p>
    </td>
  </tr>
  <tr>
    <td>
      <strong><a href="/d">/b/ - Discussions about Torichan</a></strong>
      <p>Lorem ipsum sit dolor amet</p>
    </td>
  </tr>
</table>
`;

export const DEFAULT_FAQ_PAGE: string = `
<div class="tori-navbar">
  [<a href="/faq">FAQ</a>] [<a href="/rules">Rules</a>] [<a href="/admin">Management</a>] [<a href="/main">Home</a>]
</div>
<br clear="all">

<h1 class="tori-title">FAQ</h1>

<div class="info-page">
  <h2>Posts markup</h2>
  <p>This imageboard based on Torichan Imageboard engine supports markup language.</p>

  <h3>Reflinks</h3>

  <p>Replies and opening posts in thread can be referenced by their number:</p>

  <a href="#">>>18000</a>

  <h3>Inline tags</h3>

  <table border="1">
    <thead><tr><td>Input</td><td>Output</td></tr></thead>
    <tbody>
    <tr><td>> quote</td><td><span class="quote">> quote</span></td></tr>
    <tr><td>%%spoiler%%</td><td><span class="spoiler">spoiler</span></td></tr>
    <tr><td>code\`\`\`console.log('code');\`\`\`</td><td><code>console.log('code');</code></td></tr>
    <tr><td>%cow%cow text%cow%</td><td><span class="cow">cow text</span></td></tr>
    <tr><td>~~stroke~~</td><td><s>stroke</s></td></tr>
    <tr><td>____underlined____</td><td><u>underlined</u></td></tr>
    <tr><td>___bold___</td><td><b>bold</b></td></tr>
    <tr><td>__italic__</td><td><i>italic</i></td></tr>
    </tbody>
  </table>

  <h3>URLs</h3>
  <p>If you post a url starting with either http:// or https://, it will automatically be linked.</p>
  <p>Attribute <code>rel="noreferrer"</code> is added to links in posts.</p>
</div>

<div class="tori-navbar">
  [<a href="/faq">FAQ</a>] [<a href="/rules">Rules</a>] [<a href="/admin">Management</a>] [<a href="/main">Home</a>]
</div>
<br clear="all">
`;

export const DEFAULT_RULES_PAGE: string = `
<div class="tori-navbar">
  [<a href="/faq">FAQ</a>] [<a href="/rules">Rules</a>] [<a href="/admin">Management</a>] [<a href="/main">Home</a>]
</div>
<br clear="all">

<h1 class="tori-title">Rules</h1>

<div class="info-page">
  <table style="text-align: left">
    <tr>
      <td>
        <ol>
          <li>No CP</li>
          <li>No shitposting</li>
          <li>Moderator is always right</li>
        </ol>
      </td>
    </tr>
  </table>
</div>

<div class="tori-navbar">
    [<a href="/faq">FAQ</a>] [<a href="/rules">Rules</a>] [<a href="/admin">Management</a>] [<a href="/main">Home</a>]
</div>
<br clear="all">
`;
