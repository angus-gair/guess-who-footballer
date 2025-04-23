// Footballer related models and types

export enum Position {
  GK = 'GK',
  DEF = 'DEF',
  MID = 'MID',
  FWD = 'FWD',
}

export interface FootballerAttributes {
  pace: number;
  shooting: number;
  passing: number;
  dribbling: number;
  defending: number;
  physical: number;
}

export interface Footballer {
  id: string;
  name: string;
  country: string;
  club: string;
  position: string;
  age: number;
  imageUrl: string;
  attributes: FootballerAttributes;
}

export interface FootballerCreate {
  name: string;
  image: string;
  club: string;
  nation: string;
  position: Position;
  ageBracket: string;
  hairColor: string;
  facialHair: boolean;
  bootsColor: string;
} 