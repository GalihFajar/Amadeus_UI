export type Size = {
  height: number;
  width: number;
};

interface DataInterface<T> {
  [Symbol.iterator](): Iterator<T>;
}

export type DataType = {
  date: Date;
  high: number;
  avg: number;
  low: number;
};

export type RectType = {
  x: number;
  y: number;
  height: number;
  fill: string;
};

export type RadialType = {
  path: string;
  fill: string;
};

export type CircleType = {
  id: number;
  x: number;
  y: number;
  radius: number;
  isCollide: boolean;
  collideWith: number[];
  collisions: number;
};

export interface Area<Horizontal, Vertical> {
  x: Horizontal;
  y: Vertical;
  violations?: number;
}

export type Areas = Area<number, number>[];
export type Data = DataInterface<DataType>;
