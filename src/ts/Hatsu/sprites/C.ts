import { HatsuBase, BASE_ALPHA } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const C_START = 7750;
export const C_END = 11870;
const C_LENGTH = C_END - C_START;

export class C extends HatsuBase {
  public get end(): number {
    return C_END;
  }

  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - C_START;
    if (msec < 0 || msec > C_LENGTH) { return; }
    const { dw, dh } = this.getHatsuSize(theater);
    // 始点 S
    const Sx = theater.widthBar + theater.width4;
    const Sy = theater.height - dh;
    // 終点 E
    const Ex = theater.widthBar - dw;
    const Ey = 0;
    // 座標
    const x = this.liner(Sx, Ex, C_LENGTH, msec);
    if (x > Sx || x < Ex) { return; }
    const y = this.liner(Sy, Ey, C_LENGTH, msec);
    if (y > Sy || y < Ey) { return; }
    // 描画
    theater.context.globalAlpha = BASE_ALPHA;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw, dh);
    theater.context.globalAlpha = 1.0;
  }
}
