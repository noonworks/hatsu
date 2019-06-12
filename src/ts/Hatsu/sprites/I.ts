import { HatsuBase, BASE_ALPHA } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const I_START = 27380;
export const I_END = 33100;
const I_LENGTH = I_END - I_START;
const I_PATH = [14, 35.0, 0, 0, 13.2, -14.7, 28.8, -9.8, 16.7, 5.2, 20.2, 45.4, 21.7, 119.0];
const I_VIEWBOX_W = 127;
const I_ZOOM_MAX = 4.48;
const I_ZOOM_MIN = 0.05;

export class I extends HatsuBase {
  protected pathes: { [key: number]: SVGPathElement } = {};

  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - I_START;
    if (msec < 0 || msec > I_LENGTH) { return; }
    const { dw, dh } = this.getHatsuSize(theater);
    // 軌道パスから座標を取得
    if (!this.pathes.hasOwnProperty(theater.width16)) {
      const np = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const pathes = I_PATH.map((v, idx) => {
        return '' + (v * theater.width16 / I_VIEWBOX_W) + ((idx % 2 === 0) ? ',' : ' ') + ((idx === 1) ? 'c ' : '');
      });
      np.setAttribute('d', 'm ' + pathes.join(''));
      this.pathes[theater.width16] = np;
    }
    const p = this.pathes[theater.width16];
    const pathLength = p.getTotalLength();
    const point: DOMPoint = p.getPointAtLength(pathLength - msec * pathLength / I_LENGTH);
    // 拡大率
    const ep = this.easeInOutCubicPercent(msec, I_LENGTH);
    const z = I_ZOOM_MAX - (I_ZOOM_MAX - I_ZOOM_MIN) * ep;
    // 描画
    theater.context.globalAlpha = BASE_ALPHA;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height,
      point.x - (dw * z / 2), point.y - (dh * z / 2), dw * z, dh * z);
    theater.context.globalAlpha = 1.0;
  }
}
