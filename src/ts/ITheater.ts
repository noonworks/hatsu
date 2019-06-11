import { IBack } from "./IBack";
import { IHatsuSprite } from "./IHatsuSprite";

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
  addHatsu(hatsu: IHatsuSprite): void;
  clearHatsu(): void;
  setCanvasSize(width16: number): void;
  start(): void;
  stop(): void;
  pause(): void;
}
