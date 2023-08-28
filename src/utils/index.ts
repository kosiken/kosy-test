import { MMKV } from "react-native-mmkv";

export const storage = new MMKV();

export const capitalizeFirstLetter = (str: string) => {
  return str && str.length ? str.charAt(0).toUpperCase() + str.slice(1) : str;
};

export const generateRandomNumber = (min: number, max: number) => {
  return Math.floor(min + Math.random() * (max + 1 - min));
};

export class Debug {
  static warn(...messages: any[]) {
    if (__DEV__) {
      console.warn(...messages);
    }
  }
  static log(...messages: any[]) {
    if (__DEV__) {
      console.log(...messages);
    }
  }

  static error(...messages: any[]) {
    if (__DEV__) {
      console.error(...messages);
    }
  }
}

export function putCommas(numberString: string) {
  if (numberString.length < 4) {
    return numberString;
  }
  const numberPattern = /^\d+$/;
  const chars = numberString.split("");
  const len = chars.length - 1;
  let counter = 0;
  const numberWithCommas = [];
  for (let i = len; i > -1; i--) {
    if (counter > 0 && counter % 3 === 0) {
      numberWithCommas.push(",");
    }
    if (numberPattern.test(chars[i])) {
      numberWithCommas.push(chars[i]);
      counter++;
    }
  }
  return numberWithCommas.reverse().join("");
}

export function to2DecimalPlaces(
  numString: string | number,
  withCommas = false,
) {
  let _number =
    typeof numString === "string" ? parseFloat(numString) : numString;
  if (isNaN(_number)) {
    return NaN;
  }
  _number = Math.round((_number + Number.EPSILON) * 100) / 100;
  const ans = _number.toFixed(2);
  if (!withCommas) {
    return ans;
  } else {
    const values = ans.split(".");
    if (values.length === 1) {
      return values[0];
    }
    return `${putCommas(values[0])}.${values[1]}`;
  }
}
