import { ITheater } from "./ITheater";
import { IHatsu } from "./IHatsu";
import { HatsuSprite } from "./HatsuSprite";
import { IHatsuSprite } from "./IHatsuSprite";

const TO_RADIAN = Math.PI / 180;
const BASE_ALPHA = 0.82;

export function addSprites(theater: ITheater, img: IHatsu): void {
  [HatsuA, HatsuB, HatsuD, HatsuC, HatsuE, HatsuF, HatsuG, HatsuH, HatsuI, HatsuJ].forEach((h) => {
    theater.addHatsu(new HatsuSprite({ img, draw: h }));
  });
}

function modular(msec: number): number {
  return msec % WHOLE_MSEC;
}

function hatsuSize(theater: ITheater, img: IHatsu): { dw: number, dh: number } {
  const dh = theater.width16 / 4;
  const dw = Math.floor(img.width * dh / img.height);
  return { dw, dh };
}

function liner(vStart: number, vEnd: number, length: number, msec: number): number {
  return (vEnd - vStart) * msec / length + vStart;
}

function easeInOutCubicPercent(msec: number, length: number) {
  const t = msec / (length / 2);
  if (t < 1) {
    return 1.0 / 2.0 * t * t * t;
  }
  const t2 = t - 2;
  return 1.0 / 2.0 * (t2 * t2 * t2 + 2);
}

const A_START = 660;
const A_END = 5130;
const A_LENGTH = A_END - A_START;
export function HatsuA(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - A_START;
  if (msec < 0 || msec > A_LENGTH) { return; }
  const { dw, dh } = hatsuSize(theater, img);
  const x1 = theater.widthBar - dw;
  const x2 = theater.widthBar + theater.width4;
  const x = liner(x1, x2, A_LENGTH, msec);
  if (x > theater.width4 + theater.widthBar) { return; }
  const y1 = Math.floor(theater.width16 / 20);
  const y2 = theater.height - y1 - dh;
  const y = liner(y1, y2, A_LENGTH, msec);
  if (y > theater.height) { return; }
  theater.context.globalAlpha = BASE_ALPHA;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height, x, y, dw, dh);
  theater.context.globalAlpha = 1.0;
}

const B_START = 3440;
const B_END = 9320;
const B_LENGTH = B_END - B_START;
export function HatsuB(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - B_START;
  if (msec < 0 || msec > B_LENGTH) { return; }
  const { dw, dh } = hatsuSize(theater, img);
  // 頂点P
  const Px = theater.width16;
  const Py = dh * -1.1;
  // (0, theater.height) を通る y = a(x - Px)^2 + Py
  const a = (theater.height - Py) / (Px * Px);
  // 始点Q
  const Qy = -1 * dh;
  const b = Math.sqrt((Qy - Py) / a);
  const Qx = Math.min(b + Px, b * -1 + Px);
  // 拡大率
  const z = liner(1.0, 2.5, B_LENGTH, msec);
  // 座標
  const x = liner(Qx, 0, B_LENGTH, msec);
  if (x > theater.width4 + theater.widthBar || x < dw * -1) { return; }
  const y = a * (x - Px) * (x - Px) + Py;
  if (y > theater.height || y < dh * -1) { return; }
  theater.context.globalAlpha = BASE_ALPHA;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height, x, y, dw * z, dh * z);
  theater.context.globalAlpha = 1.0;
}

const C_START = 7750;
const C_END = 11870;
const C_LENGTH = C_END - C_START;
export function HatsuC(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - C_START;
  if (msec < 0 || msec > C_LENGTH) { return; }
  const { dw, dh } = hatsuSize(theater, img);
  const x1 = theater.widthBar + theater.width4;
  const x2 = theater.widthBar - dw;
  const x = liner(x1, x2, C_LENGTH, msec);
  if (x > theater.width4 + theater.widthBar) { return; }
  const y1 = theater.height - dh;
  const y2 = 0;
  const y = liner(y1, y2, C_LENGTH, msec);
  if (y > theater.height) { return; }
  theater.context.globalAlpha = BASE_ALPHA;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height, x, y, dw, dh);
  theater.context.globalAlpha = 1.0;
}

const D_START = 10360;
const D_END = 15480;
const D_LENGTH = D_END - D_START;
const D_MAX_ZOOM = 1.63;
export function HatsuD(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - D_START;
  if (msec < 0 || msec > D_LENGTH) { return; }
  const { dw, dh } = hatsuSize(theater, img);
  // 頂点P
  const Px = (theater.width16 - dw * D_MAX_ZOOM) / 2;
  const Py = dh * 0.1;
  // 点Q
  const Qx = theater.width4 + theater.widthBar;
  const Qy = dh * 0.95;
  // 点Qを通る y = a(x - Px)^2 + Py
  const a = (Qy - Py) / ((Qx - Px) * (Qx - Px));
  // 座標
  const x = liner(dw * -1, theater.width4 + theater.widthBar, D_LENGTH, msec);
  if (x > theater.width4 + theater.widthBar || x < dw * -1) { return; }
  const y = a * (x - Px) * (x - Px) + Py;
  if (y > theater.height || y < dh * -1) { return; }
  // 拡大率
  let z: number;
  if (msec <= D_LENGTH / 2) {
    z = liner(1.1, D_MAX_ZOOM, D_LENGTH / 2, msec);
  } else {
    z = liner(D_MAX_ZOOM, 1.1, D_LENGTH / 2, msec - D_LENGTH / 2);
  }
  theater.context.globalAlpha = BASE_ALPHA;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height, x, y, dw * z, dh * z);
  theater.context.globalAlpha = 1.0;
}

const E_START = 14370;
const E_END = 18820;
const E_LENGTH = E_END - E_START;
const E_ZOOM_MIN = 0.15;
const E_ZOOM_MAX = 2.6;
export function HatsuE(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - E_START;
  if (msec < 0 || msec > E_LENGTH) { return; }
  const { dw, dh } = hatsuSize(theater, img);
  // ※方程式は發の中心点の軌跡
  // 点P
  const Px = theater.width16;
  const Py = dh * 2 / 3;
  // 点Q (Qx = 0)
  const Qy = theater.height - dh / 2;
  // 2点Qを通る y = ax + b
  const b = Qy;
  const a = (Py - b) / Px;
  // 始点S
  const Sx = theater.width16 - dw * 1.75;
  // 終点E
  const Ex = theater.widthBar - dw * E_ZOOM_MAX / 2;
  // 座標
  const x = liner(Sx, Ex, E_LENGTH, msec);
  if (x > theater.width4 + theater.widthBar || x < Ex) { return; }
  const y = a * x + b;
  if (y > theater.height) { return; }
  // 拡大率
  const z = liner(E_ZOOM_MIN, E_ZOOM_MAX, E_LENGTH, msec);
  theater.context.globalAlpha = BASE_ALPHA;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height,
    x - dw * z / 2, y - dh * z / 2, dw * z, dh * z);
  theater.context.globalAlpha = 1.0;
}

const F_START = 16780;
const F_END = 22570;
const F_LENGTH = F_END - F_START;
const F_ZOOM = 1.2;
export function HatsuF(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - F_START;
  if (msec < 0 || msec > F_LENGTH) { return; }
  const { dw, dh } = hatsuSize(theater, img);
  // 始点S
  const Sx = theater.width16 * 5 / 8;
  const Sy = theater.height;
  // 終点E
  const Ex = dw * F_ZOOM / 10;
  const Ey = dh * F_ZOOM * -1;
  // 座標
  const x = liner(Sx, Ex, F_LENGTH, msec);
  if (x > theater.width4 + theater.widthBar || x < Ex) { return; }
  const y = liner(Sy, Ey, F_LENGTH, msec);
  if (y > theater.height || y < Ey) { return; }
  theater.context.globalAlpha = BASE_ALPHA;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height, x, y, dw * F_ZOOM, dh * F_ZOOM);
  theater.context.globalAlpha = 1.0;
}

const G_START = 20120;
const G_END = 26240;
const G_LENGTH = G_END - G_START;
const G_ZOOM = 1.2;
export function HatsuG(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - G_START;
  if (msec < 0 || msec > G_LENGTH) { return; }
  const { dw, dh } = hatsuSize(theater, img);
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
  const x = liner(Sx, Ex, G_LENGTH, msec);
  if (x > Sx || x < Ex) { return; }
  const y = liner(Sy, Ey, G_LENGTH, msec);
  if (y > Ey || y < Sy) { return; }
  // 回転率
  const r = liner(0, -180, G_LENGTH, msec);
  theater.context.save();
  theater.context.translate(x, y);
  theater.context.rotate(r * TO_RADIAN);
  theater.context.globalAlpha = BASE_ALPHA;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height,
    dw * G_ZOOM * -0.5, dh * G_ZOOM * -0.5, dw * G_ZOOM, dh * G_ZOOM);
  theater.context.globalAlpha = 1.0;
  theater.context.restore();
}

const H_START = 23770;
const H_END = 28920;
const H_LENGTH = H_END - H_START;
const H_R_HORIZON = 27720;
const H_ZOOM = 1.2;
export function HatsuH(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - H_START;
  if (msec < 0 || msec > H_LENGTH) { return; }
  const { dw, dh } = hatsuSize(theater, img);
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
  const x = liner(Sx, Ex, H_LENGTH, msec);
  if (x > Ex || x < Sx) { return; }
  const y = liner(Sy, Ey, H_LENGTH, msec);
  if (y > Ey || y < Sy) { return; }
  // 回転率の方程式 r = c * msec
  const c = 270 / (H_R_HORIZON - H_START);
  const r = c * msec;
  theater.context.save();
  theater.context.translate(x, y);
  theater.context.rotate(r * TO_RADIAN);
  theater.context.globalAlpha = BASE_ALPHA;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height,
    dw * H_ZOOM * -0.5, dh * H_ZOOM * -0.5, dw * H_ZOOM, dh * H_ZOOM);
  theater.context.globalAlpha = 1.0;
  theater.context.restore();
}

const I_START = 27380;
const I_END = 33100;
const I_LENGTH = I_END - I_START;
const I_PATH = [14, 35.0, 0, 0, 13.2, -14.7, 28.8, -9.8, 16.7, 5.2, 20.2, 45.4, 21.7, 119.0];
const I_VIEWBOX_W = 127;
const I_PATHES: { [key: number]: SVGPathElement } = {};
const I_ZOOM_MAX = 4.48;
const I_ZOOM_MIN = 0.05;
export function HatsuI(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - I_START;
  if (msec < 0 || msec > I_LENGTH) { return; }
  const { dw, dh } = hatsuSize(theater, img);
  // 軌道パスから座標を取得
  if (!I_PATHES.hasOwnProperty(theater.width16)) {
    const np = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const pathes = I_PATH.map((v, idx) => {
      return '' + (v * theater.width16 / I_VIEWBOX_W) + ((idx % 2 === 0) ? ',' : ' ') + ((idx === 1) ? 'c ' : '');
    });
    np.setAttribute('d', 'm ' + pathes.join(''));
    I_PATHES[theater.width16] = np;
  }
  const p = I_PATHES[theater.width16];
  const pathLength = p.getTotalLength();
  const point: DOMPoint = p.getPointAtLength(pathLength - msec * pathLength / I_LENGTH);
  // 拡大率
  const ep = easeInOutCubicPercent(msec, I_LENGTH);
  const z = I_ZOOM_MAX - (I_ZOOM_MAX - I_ZOOM_MIN) * ep;
  theater.context.globalAlpha = BASE_ALPHA;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height,
    point.x - (dw * z / 2), point.y - (dh * z / 2), dw * z, dh * z);
  theater.context.globalAlpha = 1.0;
}

const J_START = 37580;
const J_END = 56270;
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
const J_ROTATE_PATH_KEY = 'rotate_path_pos';
const J_ROTATE_PATH_X_MAX = 141.276;
const J_ROTATE_PATH_Y_MAX = 76.785;
const J_ROTATE_MAX = 4680;
export function HatsuJ(theater: ITheater, img: IHatsu, sprite: IHatsuSprite) {
  const msec = modular(theater.msec) - J_START;
  if (msec < 0 || msec > J_LENGTH) {
    sprite.setState(J_ROTATE_PATH_KEY, 0);
    return;
  }
  const { dw, dh } = hatsuSize(theater, img);
  // 中心点
  const x = theater.width16 * 140 / 480;
  const y = theater.height * 165 / 270;
  // 拡大率
  let z = J_ZOOM_MAX;
  if (msec < J_ZOOM_END - J_START) {
    z = liner(J_ZOOM_MIN, J_ZOOM_MAX, J_ZOOM_END - J_START, msec);
  }
  // 透過率
  let o = BASE_ALPHA;
  if (msec < J_ALPHA_IN_END - J_START) {
    o = liner(J_ALPHA_MIN, BASE_ALPHA, J_ALPHA_IN_END - J_START, msec);
  }
  if (msec >= J_ALPHA_OUT_START - J_START) {
    o = liner(BASE_ALPHA, J_ALPHA_MIN, J_END - J_ALPHA_OUT_START, msec - (J_ALPHA_OUT_START - J_START));
  }
  // 回転角度 r = f(msec)
  const v = sprite.getState(J_ROTATE_PATH_KEY);
  let len = (typeof (v) === 'number') ? v : 0;
  let r = 0;
  while (len <= J_ROTATE_PATH_MAX) {
    const p = J_ROTATE_PATH.getPointAtLength(len);
    const x_msec = p.x * J_LENGTH / J_ROTATE_PATH_X_MAX;
    if (x_msec >= msec) {
      r = p.y / J_ROTATE_PATH_Y_MAX * J_ROTATE_MAX * -1;
      // console.log(len, msec, x_msec, r);
      break;
    }
    len += 0.1;
  }
  sprite.setState(J_ROTATE_PATH_KEY, len);
  theater.context.save();
  theater.context.translate(x, y);
  theater.context.rotate(r * TO_RADIAN);
  theater.context.globalAlpha = o;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height,
    -(dw * z / 2), -(dh * z / 2), dw * z, dh * z);
  theater.context.globalAlpha = 1.0;
  theater.context.restore();
}

const WHOLE_MSEC = J_END + 1000;
