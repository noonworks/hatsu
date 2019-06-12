import { IBack } from "./IBack";
import { ITheater } from "../ITheater";
import { CropInfo, CROP_INFO_DEFAULT, calculateCropSize } from "../Crop";

export class VideoBack implements IBack {
  private _ready: boolean = false;
  private video: HTMLVideoElement;
  private cropInfo: CropInfo = { ...CROP_INFO_DEFAULT };

  public get ready(): boolean {
    return this._ready;
  }

  public get length(): number {
    if (this._ready) {
      return this.video.duration * 1000;
    }
    return -1;
  }

  constructor() {
    this.video = document.createElement('video');
  }

  public start(): void {
    this.video.play();
  }

  public pause(): void {
    this.video.pause();
  }

  public stop(): void {
    this.video.pause();
    this.video.currentTime = 0;
  }

  public loadFile(file: File): Promise<HTMLVideoElement> {
    return new Promise((resolve, reject) => {
      this.video.onloadeddata = () => {
        this._ready = true;
        console.log(this.video.videoWidth, this.video.videoHeight);
        this.cropInfo = calculateCropSize(this.video.videoWidth, this.video.videoHeight);
        resolve(this.video);
      }
      this.video.onerror = (e) => reject(e);
      const fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent) => {
        if (e.target) {
          this.video.src = (e.target as any).result;
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
    theater.context.drawImage(this.video, this.cropInfo.x, this.cropInfo.y, this.cropInfo.w, this.cropInfo.h, x, 0, w, theater.height);
  }
}
