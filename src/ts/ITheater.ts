import { IBack } from "./IBack";
import { IHatsuSprite } from "./IHatsuSprite";

export interface ITheater {
  width16: number;
  width4: number;
  widthBar: number;
  height: number;
  context: CanvasRenderingContext2D;
  addBack(back: IBack): void;
  clearBack(): void;
  addHatsu(hatsu: IHatsuSprite): void;
  clearHatsu(): void;
  draw(): void;
}
