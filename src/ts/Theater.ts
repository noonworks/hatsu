import { ITheater } from "./ITheater";
import { IBack } from "./Back/IBack";
import Timer from "./Timer";
import { Options } from "./Options";
import { IHatsu } from "./Hatsu/IHatsu";

export class Theater implements ITheater {
  private id: string;
  private options: Options;
  private _canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private _width16: number = 480;
  private _width4: number = 320;
  private _widthBar: number = 60;
  private _height: number = 270;

  private back: IBack[] = [];
  private hatsu: IHatsu[] = [];
  private _timer: Timer = new Timer();
  private _requestId: number = -1;

  public get width16(): number {
    return this._width16;
  }

  public get width4(): number {
    return this._width4;
  }

  public get widthBar(): number {
    return this._widthBar;
  }

  public get height(): number {
    return this._height;
  }

  public get canvas(): HTMLCanvasElement {
    return this._canvas;
  }

  public get context(): CanvasRenderingContext2D {
    return this.ctx;
  }

  public get msec(): number {
    return this._timer.msec();
  }

  constructor(id: string, options: Options) {
    this.id = id;
    this.options = options;
    this._canvas = document.createElement('canvas');
    this._canvas.setAttribute('id', this.id);
    this.setCanvasSize(this.options.options.size);
    const c = this._canvas.getContext('2d');
    if (c === null) {
      throw new Error('Can not get 2d context.');
    }
    this.ctx = c;
  }

  public addBack(back: IBack): void {
    this.back.push(back);
  }

  public clearBack(): void {
    this.back.length = 0;
  }

  public addHatsu(hatsu: IHatsu): void {
    this.hatsu.push(hatsu);
  }

  public clearHatsu(): void {
    this.hatsu.length = 0;
  }

  public start(): void {
    if (this._timer.started && !this._timer.paused) {
      return;
    }
    this.back.forEach((b) => b.start());
    this._timer.start();
    const loop = () => {
      this.draw();
      this._requestId = window.requestAnimationFrame(loop);
    };
    window.requestAnimationFrame(loop);
  }

  public stop(): void {
    this.back.forEach((b) => b.stop());
    this._timer.stop();
    window.cancelAnimationFrame(this._requestId);
    this._requestId = -1;
  }

  public pause(): void {
    if (this._timer.started && !this._timer.paused) {
      this.back.forEach((b) => b.pause());
      this._timer.pause();
      window.cancelAnimationFrame(this._requestId);
      this._requestId = -1;
    }
  }

  public setCanvasSize(width16: number): void {
    this._width16 = width16;
    this._width4 = width16 * 3 / 4;
    this._widthBar = width16 / 8;
    this._height = width16 * 9 / 16;
    this._canvas.width = this._width16;
    this._canvas.height = this._height;
  }

  private draw(): void {
    this.ctx.clearRect(0, 0, this._width16, this._height);
    this.back.forEach((b) => b.draw(this));
    this.hatsu.forEach((h) => h.draw(this));
    this.drawSideBar();
  }

  private drawSideBar(): void {
    this.ctx.fillRect(0, 0, this._widthBar, this._height);
    this.ctx.fillRect(this._widthBar + this._width4, 0, this._widthBar, this._height);
  }
}
