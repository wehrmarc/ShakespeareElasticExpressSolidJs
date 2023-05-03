const int2roman = (original: number): string => {
  if (original < 1 || original > 3999) {
    throw new Error('Error: Input integer limited to 1 through 3,999');
  }

  const numerals = [
    ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'], // 1-9
    ['X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'], // 10-90
    ['C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'], // 100-900
    ['M', 'MM', 'MMM'], // 1000-3000
  ];

  const digits = Math.round(original).toString().split('');
  let position = (digits.length - 1);

  return digits.reduce((roman, digit) => {
    if (digit !== '0') {
      roman += numerals[position][parseInt(digit) - 1];
    }

    position -= 1;

    return roman;
  }, '');
}

const roman2int = (roman: string): number => {
  const romanNumeralMap: Record<string, number> = {
    I: 1,
    IV: 4,
    V: 5,
    IX: 9,
    X: 10,
    XL: 40,
    L: 50,
    XC: 90,
    C: 100,
    CD: 400,
    D: 500,
    CM: 900,
    M: 1000,
  };

  let result = 0;

  for (let i = 0; i < roman.length; i++) {
    const currentSymbol = roman[i];
    const nextSymbol = roman[i + 1];

    if (nextSymbol && romanNumeralMap[currentSymbol + nextSymbol]) {
      result += romanNumeralMap[currentSymbol + nextSymbol];
      i++;
    } else {
      result += romanNumeralMap[currentSymbol];
    }
  }

  return result;
};

const extractRomanNumeral = (text: string): string | undefined => {
  const matches = text.match(/(ACT|SCENE)\s+([IVXLCDM]+)(?:(?:\.\s+)|$)/);
  if (matches) {
    return matches[2];
  } else {
    return undefined;
  }
}

export { int2roman, roman2int, extractRomanNumeral }