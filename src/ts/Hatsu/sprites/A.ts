import { HatsuBase, BASE_ALPHA } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const A_START = 660;
export const A_END = 5130;
const A_LENGTH = A_END - A_START;

export class A extends HatsuBase {
  public get end(): number {
    return A_END;
  }

  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - A_START;
    if (msec < 0 || msec > A_LENGTH) { return; }
    const { dw, dh } = this.getHatsuSize(theater);
    // 始点 S
    const Sx = theater.widthBar - dw;
    const Sy = Math.floor(theater.width16 / 20);
    // 終点 E
    const Ex = theater.widthBar + theater.width4;
    const Ey = theater.height - Sy - dh;
    // 座標
    const x = this.liner(Sx, Ex, A_LENGTH, msec);
    if (x > Ex || x < Sx) { return; }
    const y = this.liner(Sy, Ey, A_LENGTH, msec);
    if (y > Ey || y < Sy) { return; }
    // 描画
    theater.context.globalAlpha = BASE_ALPHA;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw, dh);
    theater.context.globalAlpha = 1.0;
  }
}
