import { HatsuBase, BASE_ALPHA, TO_RADIAN } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const G_START = 20120;
export const G_END = 26240;
const G_LENGTH = G_END - G_START;
const G_ZOOM = 1.2;

export class G extends HatsuBase {
  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - G_START;
    if (msec < 0 || msec > G_LENGTH) { return; }
    const { dw, dh } = this.getHatsuSize(theater);
    // ※方程式は發の中心点の軌跡
    // 点P
    const Px = theater.width16;
    const Py = theater.height / 2;
    // 点Q (Qx = 0)
    const Qy = theater.height * 17 / 27;
    // 2点Qを通る y = ax + b
    const b = Qy;
    const a = (Py - b) / Px;
    // 始点S
    const Sx = theater.width4 + theater.widthBar + dw * G_ZOOM / 2;
    const Sy = a * Sx + b;
    // 終点E
    const Ex = theater.widthBar - dw * G_ZOOM / 2;
    const Ey = a * Ex + b;
    // 座標
    const x = this.liner(Sx, Ex, G_LENGTH, msec);
    if (x > Sx || x < Ex) { return; }
    const y = this.liner(Sy, Ey, G_LENGTH, msec);
    if (y > Ey || y < Sy) { return; }
    // 回転率
    const r = this.liner(0, -180, G_LENGTH, msec);
    // 描画
    theater.context.save();
    theater.context.translate(x, y);
    theater.context.rotate(r * TO_RADIAN);
    theater.context.globalAlpha = BASE_ALPHA;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height,
      dw * G_ZOOM * -0.5, dh * G_ZOOM * -0.5, dw * G_ZOOM, dh * G_ZOOM);
    theater.context.globalAlpha = 1.0;
    theater.context.restore();
  }
}
