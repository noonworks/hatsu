import { HatsuBase, BASE_ALPHA } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const E_START = 14370;
export const E_END = 18820;
const E_LENGTH = E_END - E_START;
const E_ZOOM_MIN = 0.15;
const E_ZOOM_MAX = 2.6;

export class E extends HatsuBase {
  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - E_START;
    if (msec < 0 || msec > E_LENGTH) { return; }
    const { dw, dh } = this.getHatsuSize(theater);
    // ※方程式は發の中心点の軌跡
    // 点 P
    const Px = theater.width16;
    const Py = dh * 2 / 3;
    // 点 Q (Qx = 0)
    const Qy = theater.height - dh / 2;
    // 2点を通る y = ax + b
    const b = Qy;
    const a = (Py - b) / Px;
    // 始点S
    const Sx = theater.width16 - dw * 1.75;
    // 終点E
    const Ex = theater.widthBar - dw * E_ZOOM_MAX / 2;
    // 拡大率
    const z = this.liner(E_ZOOM_MIN, E_ZOOM_MAX, E_LENGTH, msec);
    // 座標
    const x = this.liner(Sx, Ex, E_LENGTH, msec);
    if (x > Sx || x < Ex) { return; }
    const y = a * x + b;
    if (y > theater.height || y < dh * z * -1) { return; }
    theater.context.globalAlpha = BASE_ALPHA;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height,
      x - dw * z / 2, y - dh * z / 2, dw * z, dh * z);
    theater.context.globalAlpha = 1.0;
  }
}
