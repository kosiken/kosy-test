/* eslint-disable @typescript-eslint/no-explicit-any */
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
