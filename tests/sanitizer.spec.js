import sanitizer from '../src/sanitizer';
import { replaceNonNumbersToNone } from '../src/helpers';

const expect = require('chai').expect;

describe('Sanitizer Library', () => {
  describe('Smoke tests', () => {
    it('should exist the method `sanitizer`', () => {
      expect(sanitizer).to.exist; // eslint-disable-line no-unused-expressions
      expect(sanitizer).to.be.a.function; // eslint-disable-line no-unused-expressions
    });
  });

  describe('Object', () => {
    it('should return 1234 when sanitizer apply callback modifier at value from key of object', () => {
      const obj = {
        value: '1234',
      };
      sanitizer(obj, {
        value(item) {
          return +item;
        },
      });
      expect(obj.value).to.be.equal(1234);
    });

    it('should return default data when sanitizer try apply modifier for a nonexistent key in object', () => {
      const obj = {
        value: '1234',
      };
      sanitizer(obj, {
        anotherValue(item) {
          return +item;
        },
      });
      expect(obj).to.be.equal(obj);
    });

    it('should return "12341234" when sanitizer apply the Regex /\\D/g modifier at value from key of object', () => {
      const obj = {
        value: '1234.1234',
      };
      sanitizer(obj, {
        value: replaceNonNumbersToNone,
      });
      expect(obj.value).to.be.equal('12341234');
    });

    it('should return 12341234 when sanitizer apply multiple modifier at value from key of object', () => {
      const obj = {
        value: '1234.1234',
      };
      sanitizer(obj, {
        value: [
          replaceNonNumbersToNone,
          item => +item,
        ],
      });
      expect(obj.value).to.be.equal(12341234);
    });

    it('should throw TypeError when sanitizer try apply a invalid modifier at value from key of object', () => {
      const obj = {
        value: '1234.1234',
      };

      expect(() => {
        sanitizer(obj, {
          value: 'invalid_modifier',
        });
      }).to.throw(TypeError);
    });

    it('should return "12341234" when sanitizer apply the Regex /\\D/g modifier at value from key of object insede of array using index', () => {
      const obj = {
        value: [
          {
            anotherValue: '1234.1234',
          },
          {
            anotherValue: '1234.1234',
          },
        ],
      };

      sanitizer(obj, {
        'value.0.anotherValue': replaceNonNumbersToNone,
        'value.1.anotherValue': replaceNonNumbersToNone,
      });

      expect(obj.value[0].anotherValue).to.be.equal('12341234');
      expect(obj.value[1].anotherValue).to.be.equal('12341234');
    });

    it('should return 12341234 when sanitizer apply multiples modifiers at values of complex object', () => {
      const obj = {
        value: [
          {
            anotherValue: '1234.1234',
          },
          {
            anotherValue: '1234.1234',
          },
        ],
        object1: [
          {
            object2: [
              {
                object3: '1234.1234',
              },
            ],
          },
        ],
      };

      sanitizer(obj, {
        'value.*.anotherValue': [
          replaceNonNumbersToNone,
          item => +item,
        ],
        'object1.*.object2.*.object3': [
          replaceNonNumbersToNone,
          item => +item,
        ],
      });

      expect(obj).to.deep.equal({
        value: [
          {
            anotherValue: 12341234,
          },
          {
            anotherValue: 12341234,
          },
        ],
        object1: [
          {
            object2: [
              {
                object3: 12341234,
              },
            ],
          },
        ],
      });
    });
  });

  describe('Array', () => {
    it('should return "1234" when sanitizer apply callback modifier at values from array', () => {
      const arr = [
        '12.34',
        '12.34',
      ];
      sanitizer(arr, replaceNonNumbersToNone);
      expect(arr).to.deep.equal(['1234', '1234']);
    });

    it('should return 1234 when sanitizer apply multiple modifier at value from array', () => {
      const arr = [
        '12.34',
        '12.34',
      ];
      sanitizer(arr, [
        replaceNonNumbersToNone,
        item => +item,
      ]);
      expect(arr).to.deep.equal([1234, 1234]);
    });

    it('should return 12341234 when sanitizer apply multiples modifiers at values of complex array', () => {
      const arr = [
        {
          value: {
            value: '1234.1234',
            anotherValue: [
              '1234.1234',
              '1234.1234',
            ],
            tretaValue: [
              {
                value: '1234.1234',
              },
            ],
          },
        },
        {
          value: {
            value: '1234.1234',
          },
        },
      ];

      sanitizer(arr, {
        'value.value': [
          replaceNonNumbersToNone,
          item => +item,
        ],
        'value.anotherValue': [
          replaceNonNumbersToNone,
          item => +item,
        ],
        'value.tretaValue.*.value': [
          replaceNonNumbersToNone,
          item => +item,
        ],
      });
      expect(arr).to.deep.equal([
        {
          value: {
            value: 12341234,
            anotherValue: [
              12341234,
              12341234,
            ],
            tretaValue: [
              {
                value: 12341234,
              },
            ],
          },
        },
        {
          value: {
            value: 12341234,
          },
        },
      ]);
    });
  });


  describe('README', () => {
    it('Aplica exemplo 1 do README', () => {
      const toUpper = text => text.toUpperCase();
      const onlyNumbers = text => text.replace(/\D/g, '');
      const data = {
        name: 'Adriano de Azevedo',
        phones: [
          '(66) 9 9999-6666',
          '(66) 9 9999-7777',
          '(66) 9 9999-8888',
        ],
      };

      sanitizer(data, {
        name: toUpper,
        phones: onlyNumbers,
      });

      expect(data).to.deep.equal({
        name: 'ADRIANO DE AZEVEDO',
        phones: [
          '66999996666',
          '66999997777',
          '66999998888',
        ],
      });
    });

    it('Aplica exemplo 2 do README', () => {
      const toUpper = text => text.toUpperCase();
      const onlyNumbers = text => text.replace(/\D/g, '');
      const data = {
        name: 'Adriano de Azevedo',
        phones: [
          {
            phone: '(66) 9 9999-6666',
            type: 'mobile',
          },
          {
            phone: '(66) 3544-7800',
            type: 'landline',
          },
        ],
      };

      sanitizer(data, {
        name: toUpper,
        'phones.*.phone': onlyNumbers,
      });

      expect(data).to.deep.equal({
        name: 'ADRIANO DE AZEVEDO',
        phones: [
          {
            phone: '66999996666',
            type: 'mobile',
          },
          {
            phone: '6635447800',
            type: 'landline',
          },
        ],
      });
    });

    it('Aplica exemplo 3 do README', () => {
      const toUpper = text => text.toUpperCase();
      const onlyNonNumbers = text => text.replace(/\d/g, '');
      const reverseString = text => text.split('').reverse().join('').trim();

      const data = {
        value: '123456789 O Sanitizer é legal 123456789',
      };

      sanitizer(data, {
        value: [
          toUpper,
          onlyNonNumbers,
          reverseString,
        ],
      });

      expect(data.value).to.be.equal('LAGEL É REZITINAS O');
    });
  });
});
