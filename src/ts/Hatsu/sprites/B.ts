import { HatsuBase, BASE_ALPHA } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const B_START = 3440;
export const B_END = 9320;
const B_LENGTH = B_END - B_START;

export class B extends HatsuBase {
  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - B_START;
    if (msec < 0 || msec > B_LENGTH) { return; }
    const { dw, dh } = this.getHatsuSize(theater);
    // 頂点 P
    const Px = theater.width16;
    const Py = dh * -1.1;
    // (0, theater.height) を通る y = a(x - Px)^2 + Py
    const a = (theater.height - Py) / (Px * Px);
    // 始点 Q
    const Qy = -1 * dh;
    const b = Math.sqrt((Qy - Py) / a);
    const Qx = Math.min(b + Px, b * -1 + Px);
    // 拡大率
    const z = this.liner(1.0, 2.5, B_LENGTH, msec);
    // 座標
    const x = this.liner(Qx, 0, B_LENGTH, msec);
    if (x > theater.width4 + theater.widthBar || x < dw * z * -1) { return; }
    const y = a * (x - Px) * (x - Px) + Py;
    if (y > theater.height || y < dh * z * -1) { return; }
    // 描画
    theater.context.globalAlpha = BASE_ALPHA;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw * z, dh * z);
    theater.context.globalAlpha = 1.0;
  }
}
