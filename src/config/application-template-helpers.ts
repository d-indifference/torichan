/* eslint-disable prettier/prettier  */

export const templateConstants = {
  siteName: 'Torichan Imageboard Engine',
  siteSlogan: 'Put your slogan here...'
};

export const helperCollapseText = (text: string, slug: number, parent: number, displayNumber: number): string => {
  const displayParagraphsCount: number = 7;

  const collapsedText = text.split('<br>');

  if (collapsedText.length <= displayParagraphsCount) {
    return text;
  }

  return `${collapsedText.slice(0, displayParagraphsCount).join('<br>')}<br><br><span class="abbrev">Comment too long. <a href="/${slug}/res/${parent}#${displayNumber}">Click here</a> to view the full text.</span>`;
};
