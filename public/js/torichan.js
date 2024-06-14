function setCookie(name, value, days) {
  var expires = '';

  if (days) {
    var date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    expires = '; expires=' + date.toUTCString();
  }

  document.cookie = name + '=' + (value || '') + expires + '; path=/';
}

function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1, c.length);
    }

    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    }
  }

  return null;
}

function eraseCookie(name) {
  document.cookie = name + '=; Max-Age=-99999999;';
}

function getFrameByName(name) {
  var frames = window.parent.frames;
  for (var i = 0; i < frames.length; i++) {
    if (name === frames[i].name) {
      return(frames[i]);
    }
  }
}

function insert(formId, text) {
  var form = document.getElementById(formId);

  if (form) {
    if (form.comment) {
      form.comment.value += text + '\n';
    }
  }
}

function setStyle(cookieName) {
  if (!getCookie(cookieName)) {
    setCookie(cookieName, 'Burichan', 365);
  }

  var currentStyle = getCookie(cookieName);

  $('link[rel][title]').each(function () {
    this.disabled = this.title !== currentStyle;
  });

  $('select[name=styleList]').each(function () {
    for (var i = 0; i < this.options.length; i++) {
      if (this.options[i].value === currentStyle) {
        this.options[i].selected = true;
      } else {
        this.options[i].selected = false;
      }
    }
  });
}

function changeStyle(select, cookieName) {
  var selectedStyle = select.selectedOptions[0].value;

  setCookie(cookieName, selectedStyle, 365);

  setStyle(cookieName);

  var menuFrame = getFrameByName('menu');

  menuFrame.setStyle(cookieName);
}

function setNameFromCookies(cookieName, formId) {
  var name = getCookie(cookieName);
  var form = document.getElementById(formId);

  if (form) {
    if (form.name) {
      form.name.value = decodeURIComponent(name);
    }
  }
}