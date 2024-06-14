import * as CryptoJS from 'crypto-js';

const desEncrypt = (key: string, text: string): string => {
  return CryptoJS.DES.encrypt(text, key).toString();
};

const makeTripcodeCredentials = (name: string): [string, string] => {
  const splitName = name.split('#');
  const username = splitName[0];
  const passwordFragments = splitName.slice(1);

  let password: string;

  if (passwordFragments.length > 1) {
    password = passwordFragments.join('#');
  } else {
    password = passwordFragments[0];
  }

  return [username, password];
};

export const generateTripcode = (name: string): string => {
  const [username, password] = makeTripcodeCredentials(name);

  if (!password) {
    return username;
  }

  let salt = password.slice(0, 2);
  salt = salt.replace(/[^.-z]/g, '.');
  salt = salt.replace(/:/g, 'A');
  salt += 'H.';

  const tripcode = desEncrypt(Buffer.from(salt.slice(0, 8), 'ascii').toString(), password);

  return `!${tripcode.slice(0, 10)}`;
};
