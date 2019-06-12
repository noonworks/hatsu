import { HatsuBase, BASE_ALPHA, TO_RADIAN } from "../HatsuBase";
import { ITheater } from "../../ITheater";

export const J_START = 37580;
export const J_END = 56270;
const J_LENGTH = J_END - J_START;
const J_ZOOM_MIN = 0.05;
const J_ZOOM_END = 44370;
const J_ZOOM_MAX = 1.26;
const J_ALPHA_MIN = 0.1;
const J_ALPHA_IN_END = 38450;
const J_ALPHA_OUT_START = 55540;
const J_ROTATE_PATH: SVGPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
J_ROTATE_PATH.setAttribute('d', 'M 0 76.785 C 84.712 68.367 116.849 64.897 141.276 0');
const J_ROTATE_PATH_MAX = J_ROTATE_PATH.getTotalLength();
const J_ROTATE_PATH_X_MAX = 141.276;
const J_ROTATE_PATH_Y_MAX = 76.785;
const J_ROTATE_MAX = 4680;

export class J extends HatsuBase {
  private rotatePathPos: number = 0;

  public get end(): number {
    return J_END;
  }

  public draw(theater: ITheater): void {
    const msec = this.modular(theater.msec) - J_START;
    if (msec < 0 || msec > J_LENGTH) {
      this.rotatePathPos = 0;
      return;
    }
    const { dw, dh } = this.getHatsuSize(theater);
    // 中心点
    const x = theater.width16 * 140 / 480;
    const y = theater.height * 165 / 270;
    // 拡大率
    let z = J_ZOOM_MAX;
    if (msec < J_ZOOM_END - J_START) {
      z = this.liner(J_ZOOM_MIN, J_ZOOM_MAX, J_ZOOM_END - J_START, msec);
    }
    // 透過率
    let o = BASE_ALPHA;
    if (msec < J_ALPHA_IN_END - J_START) {
      o = this.liner(J_ALPHA_MIN, BASE_ALPHA, J_ALPHA_IN_END - J_START, msec);
    }
    if (msec >= J_ALPHA_OUT_START - J_START) {
      o = this.liner(BASE_ALPHA, J_ALPHA_MIN, J_END - J_ALPHA_OUT_START, msec - (J_ALPHA_OUT_START - J_START));
    }
    // 回転角度 r = f(msec)
    let r = 0;
    while (this.rotatePathPos <= J_ROTATE_PATH_MAX) {
      const p = J_ROTATE_PATH.getPointAtLength(this.rotatePathPos);
      const x_msec = p.x * J_LENGTH / J_ROTATE_PATH_X_MAX;
      if (x_msec >= msec) {
        r = p.y / J_ROTATE_PATH_Y_MAX * J_ROTATE_MAX * -1;
        break;
      }
      this.rotatePathPos += 0.1;
    }
    // 描画
    theater.context.save();
    theater.context.translate(x, y);
    theater.context.rotate(r * TO_RADIAN);
    theater.context.globalAlpha = o;
    theater.context.drawImage(this.img.img, 0, 0, this.img.width, this.img.height,
      -(dw * z / 2), -(dh * z / 2), dw * z, dh * z);
    theater.context.globalAlpha = 1.0;
    theater.context.restore();
  }
}
