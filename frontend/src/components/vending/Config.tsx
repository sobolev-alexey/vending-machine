import crisps1 from '../../assets/img/crisps.svg';
import crisps2 from '../../assets/img/crisps2.svg';
import crisps3 from '../../assets/img/crisps3.svg';
import crisps4 from '../../assets/img/crisps4.svg';
import crisps5 from '../../assets/img/crisps6.svg';
import cola from '../../assets/img/cola.svg';
import fanta from '../../assets/img/fanta.svg';
import sprite from '../../assets/img/sprite.svg';
import water from '../../assets/img/water2.svg';
import empty from '../../assets/img/empty.svg';

export const images: any = {
  "crisps1": crisps1,
  "crisps2": crisps2,
  "crisps3": crisps3,
  "crisps4": crisps4,
  "crisps5": crisps5,
  "cola": cola,
  "fanta": fanta,
  "sprite": sprite,
  "water": water,
  "empty": empty,
}

export const keyPad: ButtonValue[][] = [
  ["A", "1", "2"],
  ["B", "3", "4"],
  ["C", "5", "6"],
  ["D", "7", "8"],
  ["E", "9", "0"],
  ["F", "*", "CLR"],
];

export const shelves: string[] = [
  "A", "B", "C", "D", "E", "F"
]

export type Screen = "BALANCE" | "INPUT_CODE" | "MESSAGE" | "CHANGE";

export type ButtonValue =
  | "A"
  | "B"
  | "C"
  | "D"
  | "E"
  | "F"
  | "1"
  | "2"
  | "3"
  | "4"
  | "5"
  | "6"
  | "7"
  | "8"
  | "9"
  | "0"
  | "*"
  | "CLR";
