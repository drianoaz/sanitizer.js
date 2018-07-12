const createReplaceFunction = (regex, replace) =>
  text => text.replace(regex, replace);

export const replaceNonNumbersToNone = createReplaceFunction(/\D/g, '');
export const replaceNumbersToNone = createReplaceFunction(/\d/g, '');

export default {
  replaceNonNumbersToNone,
  replaceNumbersToNone,
};
