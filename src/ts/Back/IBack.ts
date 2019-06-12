import { ITheater } from "../ITheater";

export interface IBack {
  length: number;
  draw(theater: ITheater): void;
  start(): void;
  pause(): void;
  stop(): void;
}
