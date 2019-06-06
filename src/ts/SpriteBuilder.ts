import { ITheater } from "./ITheater";
import { IHatsu } from "./IHatsu";
import { HatsuSprite } from "./HatsuSprite";

export function addSprites(theater: ITheater, img: IHatsu): void {
  [HatsuA, HatsuB, HatsuC].forEach((h) => {
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
  theater.context.globalAlpha = 0.8;
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
  theater.context.globalAlpha = 0.8;
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
  theater.context.globalAlpha = 0.8;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height, x, y, dw, dh);
  theater.context.globalAlpha = 1.0;
}


const WHOLE_MSEC = C_END + 3000;
