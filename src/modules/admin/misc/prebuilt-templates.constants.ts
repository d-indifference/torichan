export const DEFAULT_SITE_NAME: string = 'Torichan Imageboard Engine';

export const DEFAULT_SITE_SLOGAN: string = 'Put your slogan here...';

export const DEFAULT_SITE_NAVBAR: string =
  '[<a href="/faq">FAQ</a>][<a href="/rules">Rules</a>] || [<a href="/admin">Management</a>][<a href="/">Home</a>]';

export const DEFAULT_FAQ_PAGE: string = `
<div class="tori-navbar">
  [<a href="/faq">FAQ</a>] [<a href="/rules">Rules</a>] [<a href="/admin">Management</a>] [<a href="/">Home</a>]
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
  [<a href="/faq">FAQ</a>] [<a href="/rules">Rules</a>] [<a href="/admin">Management</a>] [<a href="/">Home</a>]
</div>
<br clear="all">
`;

export const DEFAULT_RULES_PAGE: string = `
<div class="tori-navbar">
  [<a href="/faq">FAQ</a>] [<a href="/rules">Rules</a>] [<a href="/admin">Management</a>] [<a href="/">Home</a>]
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
    [<a href="/faq">FAQ</a>] [<a href="/rules">Rules</a>] [<a href="/admin">Management</a>] [<a href="/">Home</a>]
</div>
<br clear="all">
`;
