import {getRandomInt} from "./randomIntenger";

export function getRandomItem<T>(arr: T[]): T {
  const index = getRandomInt(0, arr.length -1);
  return arr[index];
}