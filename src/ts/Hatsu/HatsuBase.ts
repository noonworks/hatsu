import { IHatsu } from "./IHatsu";
import { ITheater } from "../ITheater";
import { IHatsuImage } from "./IHatsuImage";

export const BASE_ALPHA = 0.82;
export const TO_RADIAN = Math.PI / 180;
const WHOLE_MSEC = 56270 + 1000; // J_END + 1000

export abstract class HatsuBase implements IHatsu {
  protected img: IHatsuImage;
  abstract end: number;

  constructor(opt: { img: IHatsuImage }) {
    this.img = opt.img;
  }

  public abstract draw(theater: ITheater): void;

  protected modular(msec: number): number {
    return msec % WHOLE_MSEC;
  }

  protected getHatsuSize(theater: ITheater): { dw: number, dh: number } {
    const dh = theater.width16 / 4;
    const dw = Math.floor(this.img.width * dh / this.img.height);
    return { dw, dh };
  }

  protected liner(vStart: number, vEnd: number, length: number, msec: number): number {
    return (vEnd - vStart) * msec / length + vStart;
  }

  protected easeInOutCubicPercent(msec: number, length: number) {
    const t = msec / (length / 2);
    if (t < 1) {
      return 1.0 / 2.0 * t * t * t;
    }
    const t2 = t - 2;
    return 1.0 / 2.0 * (t2 * t2 * t2 + 2);
  }
}
