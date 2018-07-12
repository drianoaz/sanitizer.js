import { isArray, isFunction, isObject, forIn, get, set, has } from 'lodash';

const RECURSIVE_SEPARATOR = '.*.';

const applyModifier = (value, modifier) => {
  if (!isFunction(modifier)) throw new TypeError('Illegal modifier!');

  if (isArray(value)) {
    return value.reduce((acc, currentValue) => {
      acc.push(modifier(currentValue));
      return acc;
    }, []);
  }

  return modifier(value);
};

const callModifier = (value, modifier) =>
  (isArray(modifier)
    ? modifier.reduce((acc, currentRule) => applyModifier(acc, currentRule), value)
    : applyModifier(value, modifier)
  );

const sanitizer = (data, modifier) => {
  if (isArray(data)) {
    data.forEach((currentValue, index) => {
      if (isObject(currentValue)) {
        sanitizer(currentValue, modifier);
        return;
      }

      // eslint-disable-next-line no-param-reassign
      data[index] = callModifier(currentValue, modifier);
    });
  } else if (isObject(data)) {
    forIn(modifier, (rule, key) => {
      if (key.includes(RECURSIVE_SEPARATOR)) {
        const keyPart = key.split(RECURSIVE_SEPARATOR);
        const baseKey = keyPart.shift();
        const values = get(data, baseKey);

        if (values) {
          values.forEach(item => sanitizer(item, {
            [keyPart.join(RECURSIVE_SEPARATOR)]: rule,
          }));
        }
      }

      if (!has(data, key)) return;

      const currentValue = get(data, key);

      set(data, key, callModifier(currentValue, rule));
    });
  }
};

export default sanitizer;
