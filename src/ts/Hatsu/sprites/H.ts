import { HatsuBase, BASE_ALPHA, TO_RADIAN } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const H_START = 23770;
export const H_END = 28920;
const H_LENGTH = H_END - H_START;
const H_R_HORIZON = 27720;
const H_ZOOM = 1.2;

export class H extends HatsuBase {
  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - H_START;
    if (msec < 0 || msec > H_LENGTH) { return; }
    const { dw, dh } = this.getHatsuSize(theater);
    // ※方程式は發の中心点の軌跡
    // 始点S
    const Sx = dh * H_ZOOM / 2;
    const Sy = dh * H_ZOOM / 2 * -1;
    // 点P
    const Px = theater.width16;
    const Py = theater.height * 7 / 9;
    // 2点Qを通る y = ax + b
    // b = -ax + y
    const a = (Py - Sy) / (Px - Sx);
    const b = -1 * a * Px + Py;
    // 終点E
    const Ex = theater.width16 + dh * H_ZOOM / 2;
    const Ey = a * Ex + b;
    // 座標
    const x = this.liner(Sx, Ex, H_LENGTH, msec);
    if (x > Ex || x < Sx) { return; }
    const y = this.liner(Sy, Ey, H_LENGTH, msec);
    if (y > Ey || y < Sy) { return; }
    // 回転率の方程式 r = c * msec
    const c = 270 / (H_R_HORIZON - H_START);
    const r = c * msec;
    // 描画
    theater.context.save();
    theater.context.translate(x, y);
    theater.context.rotate(r * TO_RADIAN);
    theater.context.globalAlpha = BASE_ALPHA;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height,
      dw * H_ZOOM * -0.5, dh * H_ZOOM * -0.5, dw * H_ZOOM, dh * H_ZOOM);
    theater.context.globalAlpha = 1.0;
    theater.context.restore();
  }
}
