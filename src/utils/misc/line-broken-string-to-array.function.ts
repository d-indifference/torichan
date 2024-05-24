export const lineBrokenStringToArray = (value: string): string[] =>
  value
    .trim()
    .split('\r\n')
    .filter(val => val !== '');
