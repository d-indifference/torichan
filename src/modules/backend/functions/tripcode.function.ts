import { createTrip } from '2ch-trip';

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

  return createTrip(`${username}#${password}`);
};
