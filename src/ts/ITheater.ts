import { IBack } from "./IBack";
import { IHatsu } from "./Hatsu/IHatsu";

export interface ITheater {
  width16: number;
  width4: number;
  widthBar: number;
  height: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  msec: number;
  addBack(back: IBack): void;
  clearBack(): void;
  addHatsu(hatsu: IHatsu): void;
  clearHatsu(): void;
  setCanvasSize(width16: number): void;
  start(): void;
  stop(): void;
  pause(): void;
}
