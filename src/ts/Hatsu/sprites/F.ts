import { HatsuBase, BASE_ALPHA } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const F_START = 16780;
export const F_END = 22570;
const F_LENGTH = F_END - F_START;
const F_ZOOM = 1.2;

export class F extends HatsuBase {
  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - F_START;
    if (msec < 0 || msec > F_LENGTH) { return; }
    const { dw, dh } = this.getHatsuSize(theater);
    // 始点S
    const Sx = theater.width16 * 5 / 8;
    const Sy = theater.height;
    // 終点E
    const Ex = dw * F_ZOOM / 10;
    const Ey = dh * F_ZOOM * -1;
    // 座標
    const x = this.liner(Sx, Ex, F_LENGTH, msec);
    if (x > Sx || x < Ex) { return; }
    const y = this.liner(Sy, Ey, F_LENGTH, msec);
    if (y > Sy || y < Ey) { return; }
    // 描画
    theater.context.globalAlpha = BASE_ALPHA;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height, x, y, dw * F_ZOOM, dh * F_ZOOM);
    theater.context.globalAlpha = 1.0;
  }
}
