/* eslint-disable prettier/prettier  */

import { GlobalSettingsDto } from '@admin/dto';

export const templateConstants = {
  siteName: () => (global['global-settings'] as GlobalSettingsDto).siteName,
  siteSlogan: () => (global['global-settings'] as GlobalSettingsDto).siteSlogan,
  siteNavbar: () => (global['global-settings'] as GlobalSettingsDto).siteNavbar,
  menuFrame: () => (global['global-settings'] as GlobalSettingsDto).menuFrame,
  startPage: () => (global['global-settings'] as GlobalSettingsDto).startPage,
  faqPage: () => (global['global-settings'] as GlobalSettingsDto).faqPage,
  rulesPage: () => (global['global-settings'] as GlobalSettingsDto).rulesPage,
};

export const helperCollapseText = (text: string, slug: number, parent: number, displayNumber: number): string => {
  const displayParagraphsCount: number = 7;

  const collapsedText = text.split('<br>');

  if (collapsedText.length <= displayParagraphsCount) {
    return text;
  }

  return `${collapsedText.slice(0, displayParagraphsCount).join('<br>')}<br><br><span class="abbrev">Comment too long. <a href="/${slug}/res/${parent}#${displayNumber}">Click here</a> to view the full text.</span>`;
};

export const parseTripcode = (dbValue: string, isAdmin: boolean): string => {
  const [name, tripcode] = dbValue.split('◆');

  if (isAdmin) {
    return `<span class="admin-name" title="Highlight posts by Moderators">##&nbsp;${name}</span>
    <span class="admin-tripcode" title="Highlight posts by Moderators">!!${tripcode}</span>`;
  }

  return `<span class="name">${name}</span><span class="tripcode">!${tripcode}</span>`;
};
