import { HatsuBase, BASE_ALPHA } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const D_START = 10360;
export const D_END = 15480;
const D_LENGTH = D_END - D_START;
const D_MAX_ZOOM = 1.63;

export class D extends HatsuBase {
  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - D_START;
    if (msec < 0 || msec > D_LENGTH) { return; }
    const { dw, dh } = this.getHatsuSize(theater);
    // 頂点 P
    const Px = (theater.width16 - dw * D_MAX_ZOOM) / 2;
    const Py = dh * 0.1;
    // 点 Q
    const Qx = theater.width4 + theater.widthBar;
    const Qy = dh * 0.95;
    // 点Qを通る y = a(x - Px)^2 + Py
    const a = (Qy - Py) / ((Qx - Px) * (Qx - Px));
    // 始点と終点
    const Sx = dw * -1;
    const Ex = theater.width4 + theater.widthBar;
    // 拡大率
    let z: number;
    if (msec <= D_LENGTH / 2) {
      z = this.liner(1.1, D_MAX_ZOOM, D_LENGTH / 2, msec);
    } else {
      z = this.liner(D_MAX_ZOOM, 1.1, D_LENGTH / 2, msec - D_LENGTH / 2);
    }
    // 座標
    const x = this.liner(Sx, Ex, D_LENGTH, msec);
    if (x > Ex || x < Sx) { return; }
    const y = a * (x - Px) * (x - Px) + Py;
    if (y > theater.height || y < dh * z * -1) { return; }
    // 描画
    theater.context.globalAlpha = BASE_ALPHA;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw * z, dh * z);
    theater.context.globalAlpha = 1.0;
  }
}
