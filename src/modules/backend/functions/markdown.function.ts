const processReplyLink = (text: string[], slug: string, parent: number) =>
  text.map(str => str.replace(/^&#x3E;&#x3E;(\d.*)$/, `<a href="/${slug}/res/${parent}#$1" onclick="highlightPost('$1')">>>$1</a>`));

const processNewLine = (text: string): string[] => text.split(/\r\n/);

const processQuote = (text: string[]): string[] => text.map(symbol => symbol.replace(/^&#x3E;([^&#x3E;].*)$/, '<span class="quote">>$1</span>'));

const processSpoiler = (text: string): string => text.replace(/%%(.*)%%/gm, '<span class="spoiler">$1</span>');

const processCode = (text: string): string => text.replace(/code&#x60;&#x60;&#x60;(.*)&#x60;&#x60;&#x60;/gm, '<code>$1</code>');

const processCowText = (text: string): string => text.replace(/%cow%(.*)%cow%/gm, '<span class="cow">$1</span>');

const processStrokeText = (text: string): string => text.replace(/~~(.*)~~/gm, '<s>$1</s>');

const processUnderlineText = (text: string): string => text.replace(/____(.*)____/gm, '<u>$1</u>');

const processBoldText = (text: string): string => text.replace(/___(.*)___/gm, '<b>$1</b>');

const processItalicText = (text: string): string => text.replace(/__(.*)__/gm, '<i>$1</i>');

const processHyperLinks = (text: string[]): string[] =>
  text.map(symbol =>
    symbol.replace(/^(http:\/\/|https:\/\/|ftp:\/\/|irc:\/\/|mailto:|news:)(\S+)$/gm, '<a href="$1$2" rel="noreferrer" target="_blank">$1$2</a>')
  );

export const threadSimpleMarkdown = (text: string): string => {
  return processHyperLinks(processQuote(processNewLine(text))).join('<br>');
};

export const replySimpleMarkdown = (text: string, slug: string, parent: number): string => {
  return processHyperLinks(processQuote(processReplyLink(processNewLine(text), slug, parent))).join('<br>');
};

export const threadMarkdown = (text: string): string => {
  const markdownInitial = threadSimpleMarkdown(text);

  return processItalicText(processBoldText(processUnderlineText(processStrokeText(processCowText(processCode(processSpoiler(markdownInitial)))))));
};

export const replyMarkdown = (text: string, slug: string, parent: number): string => {
  const markdownInitial = replySimpleMarkdown(text, slug, parent);

  return processItalicText(processBoldText(processUnderlineText(processStrokeText(processCowText(processCode(processSpoiler(markdownInitial)))))));
};
