import { IHatsu } from "./IHatsu";

export class Hatsu implements IHatsu {
  private _img: HTMLImageElement = new Image();
  private _ready: boolean = false;

  public get ready(): boolean {
    return this._ready;
  }

  public get width(): number {
    return this._img.width;
  }

  public get height(): number {
    return this._img.height;
  }

  public get img(): HTMLImageElement {
    return this._img;
  }

  public load(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      this._img.onload = () => {
        this._ready = true;
        resolve(this._img);
      }
      this._img.onerror = (e) => reject(e);
      this._img.src = src + '?' + (new Date()).getTime();
    });
  }

  public loadFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      this._img.onload = () => {
        this._ready = true;
        resolve(this._img);
      }
      this._img.onerror = (e) => reject(e);
      const fileReader = new FileReader();
      fileReader.onload = (e: ProgressEvent) => {
        if (e.target) {
          this._img.src = (e.target as any).result;
        }
      };
      fileReader.readAsDataURL(file);
    });
  }
}
