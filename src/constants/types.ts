export type size = {
  height: number;
  width: number;
};

interface dataInterface<T> {
  [Symbol.iterator](): Iterator<T>;
}

export type dataType = {
  date: Date;
  high: number;
  avg: number;
  low: number;
};

export type rectType = {
  x: number;
  y: number;
  height: number;
  fill: string;
};

export type radialType = {
  path: string;
  fill: string;
};

export type circleType = {
  id: number;
  x: number;
  y: number;
  radius: number;
  isCollide: boolean;
  collideWith: number[];
  collisions: number;
};

export interface area<horizontal, vertical> {
  x: horizontal;
  y: vertical;
  violations?: number;
}

export type areas = area<number, number>[];
export type data = dataInterface<dataType>;
