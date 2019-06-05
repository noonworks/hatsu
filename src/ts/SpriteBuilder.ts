import { ITheater } from "./ITheater";
import { IHatsu } from "./IHatsu";

const WHOLE_MSEC = 5 * 1000;

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

const A_START = 56;
const A_LENGTH = 4480;
export function HatsuA(theater: ITheater, img: IHatsu) {
  const msec = modular(theater.msec) - A_START;
  if (msec < 0 || msec > A_LENGTH) { return; }
  const x1 = theater.widthBar - img.width;
  const x2 = theater.widthBar + theater.width4;
  const x = liner(x1, x2, A_LENGTH, msec);
  if (x > theater.width4 + theater.widthBar) { return; }
  const y1 = Math.floor(theater.width16 / 20);
  const y2 = theater.height - y1 - img.height;
  const y = liner(y1, y2, A_LENGTH, msec);
  if (y > theater.height) { return; }
  const { dw, dh } = hatsuSize(theater, img);
  theater.context.globalAlpha = 0.8;
  theater.context.drawImage(img.img, 0, 0, img.width, img.height, x, y, dw, dh);
  theater.context.globalAlpha = 1.0;
}
