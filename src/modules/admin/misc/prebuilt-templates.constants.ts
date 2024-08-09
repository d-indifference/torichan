export const DEFAULT_SITE_NAME: string = 'Torichan Imageboard Engine';

export const DEFAULT_SITE_SLOGAN: string = 'Put your slogan here...';

export const DEFAULT_SITE_NAVBAR: string =
  '[<a href="/faq">FAQ</a>][<a href="/rules">Rules</a>] || [<a href="/admin">Management</a>][<a href="/main">Home</a>]';

export const DEFAULT_MENU_FRAME: string = `
<div class="menu-header brand">
  <a href="/" target="_blank">Torichan</a>
</div>
<hr>
<div class="menu-section">
    <div class="menu-section-header">Discussions</div>
    <ul>
        <li><a href="/a" target="main">/a/ — Anime</a></li>
        <li><a href="/b" target="main">/b/ — Random</a></li>
        <li><a href="/c" target="main">/c/ — Comics</a></li>
        <li><a href="/d" target="main">/d/ — Discussions about site</a></li>
    </ul>
</div>
`;

export const DEFAULT_START_PAGE: string = `
<h1 class="tori-title" style="text-align: center">Torichan Imageboard Engine</h1>
<em class="tori-slogan" style="text-align: center">Put your slogan here...</em>
<p class="tori-main-links" style="text-align: center">
  [<a href="/rules">global rules</a>] / [<a href="/admin">management</a>] / [<a href="https://github.com/d-indifference/torichan">torichan engine</a>]
</p>

<hr>
<div class="tori-description">
  <p>
    Welcome to the Torichan Imageboard Engine! 
    Here, everyone can share their thoughts, ideas, and creativity while remaining completely anonymous. 
    Our community has no limits to self-expression: discuss any topics, share interesting images, memes, and stories. 
    Respect for others and freedom of speech are the foundations of our community. 
    Join the discussions, get inspired, and create unique content with us. 
    Your anonymous space for communication and creativity awaits you!
  </p>
  <p>
    Each section of the site has a specific theme, but in the <a href="/b">/b/</a> section, you are free to communicate on any topic.
    You can submit all your suggestions, requests, and comments related to the site’s functionality in the <a href="/d">/d/</a> section.
  </p>
</div>

<table class="tori-sections">
  <thead>
    <tr>
        <td>Discussions #1</td>
        <td>Discussions #2</td>
        <td>Discussions #3</td>
    </tr>
   </thead>
   <tbody>
    <tr>
      <td><a href="/a">Anime</a></td>
      <td><a href="/a">Anime</a></td>
      <td><a href="/a">Anime</a></td>
    </tr>
    <tr>
      <td><a href="/b">Random</a></td>
      <td><a href="/b">Random</a></td>
      <td><a href="/b">Random</a></td>
    </tr>
    <tr>
      <td><a href="/c">Comics</a></td>
      <td><a href="/c">Comics</a></td>
      <td><a href="/c">Comics</a></td>
    </tr>
    <tr>
      <td><a href="/d">Discussions about site</a></td>
      <td><a href="/d">Discussions about site</a></td>
      <td><a href="/d">Discussions about site</a></td>
    </tr>
   </tbody>
</table>

<figure>
    <p></p>
    <figcaption></figcaption>
</figure>

<hr>
`;

export const DEFAULT_FAQ_PAGE: string = `
<div class="tori-navbar">
  [<a href="/faq">FAQ</a>] [<a href="/rules">Rules</a>] [<a href="/admin">Management</a>] [<a href="/main">Home</a>]
</div>
<br clear="all">

<h1 class="tori-title" style="text-align: center">FAQ</h1>

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

<h1 class="tori-title" style="text-align: center">Rules</h1>

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
