import { IBack } from "./Back/IBack";
import { IHatsu } from "./Hatsu/IHatsu";

export interface ITheater {
  width16: number;
  width4: number;
  widthBar: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  msec: number;
  length: number;
  backs: IBack[];
  onend: () => void;
  addBack(back: IBack): void;
  clearBack(): void;
  addHatsu(hatsu: IHatsu): void;
  clearHatsu(): void;
  setCanvasSize(width16: number): void;
  start(stopAtEnd?: boolean): void;
  stop(): void;
  pause(): void;
}
