import { ITheater } from "../ITheater";
import { IBack } from "./IBack";
import { CropInfo, calculateCropSize, CROP_INFO_DEFAULT } from "../Crop";

export class ImageBack implements IBack {
  private img: HTMLImageElement = new Image();
  private _ready: boolean = false;
  private cropInfo: CropInfo = { ...CROP_INFO_DEFAULT };

  public get ready(): boolean {
    return this._ready;
  }

  public load(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      this.img.onload = () => {
        this._ready = true;
        this.cropInfo = calculateCropSize(this.img.width, this.img.height);
        resolve(this.img);
      }
      this.img.onerror = (e) => reject(e);
      this.img.src = src + '?' + (new Date()).getTime();
    });
  }

  public loadFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      this.img.onload = () => {
        this._ready = true;
        this.cropInfo = calculateCropSize(this.img.width, this.img.height);
        resolve(this.img);
      }
      this.img.onerror = (e) => reject(e);
      const fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent) => {
        if (e.target) {
          this.img.src = (e.target as any).result;
        }
      };
      fileReader.onerror = (e) => reject(e);
      fileReader.readAsDataURL(file);
    });
  }

  public draw(theater: ITheater): void {
    theater.context.fillRect(0, 0, theater.width16, theater.height);
    if (!this.ready) {
      return;
    }
    const x = this.cropInfo.hasSideBar ? theater.widthBar : 0;
    const w = this.cropInfo.hasSideBar ? theater.width4 : theater.width16;
    theater.context.drawImage(this.img, this.cropInfo.x, this.cropInfo.y, this.cropInfo.w, this.cropInfo.h, x, 0, w, theater.height);
  }
}
