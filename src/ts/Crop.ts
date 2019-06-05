export type CropInfo = {
  hasSideBar: boolean;
  x: number;
  y: number;
  w: number;
  h: number;
};

export const CROP_INFO_DEFAULT: CropInfo = {
  hasSideBar: false,
  x: 0,
  y: 0,
  w: 0,
  h: 0,
};

const H_P_W_16_9 = 9 / 16;
const H_P_W_4_3 = 3 / 4;

export function calculateCropSize(width: number, height: number): CropInfo {
  const hPw = height / width;
  // crop 16 : 9 with max-height
  if (hPw < H_P_W_16_9) {
    const w = Math.floor(height * 16 / 9);
    return {
      hasSideBar: false,
      x: Math.floor((width - w) / 2),
      y: 0,
      w,
      h: height,
    };
  }
  // crop 4 : 3 with max-height
  if (hPw < H_P_W_4_3) {
    const w = Math.floor(height * 4 / 3);
    return {
      hasSideBar: true,
      x: Math.floor((width - w) / 2),
      y: 0,
      w,
      h: height,
    }
  }
  // crop 4 : 3 with max-width
  const h = Math.floor(width * 3 / 4);
  return {
    hasSideBar: true,
    x: 0,
    y: Math.floor((height - h) / 2),
    w: width,
    h,
  };
}
