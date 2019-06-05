import { ITheater } from "./ITheater";
import { IBack } from "./IBack";
import { IHatsuSprite } from "./IHatsuSprite";

export class Theater implements ITheater {
  private id: string;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  private _width16: number;
  private _width4: number;
  private _widthBar: number;
  private _height: number;

  private back: IBack[] = [];
  private hatsu: IHatsuSprite[] = [];

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

  public get context(): CanvasRenderingContext2D {
    return this.ctx;
  }

  constructor(id: string, width16: number) {
    this.id = id;
    this._width16 = width16;
    this._width4 = width16 * 3 / 4;
    this._widthBar = width16 / 8;
    this._height = width16 * 9 / 16;
    this.canvas = document.createElement('canvas');
    this.canvas.setAttribute('id', this.id);
    this.canvas.width = this._width16;
    this.canvas.height = this._height;
    const c = this.canvas.getContext('2d');
    if (c === null) {
      throw new Error('Can not get 2d context.');
    }
    this.ctx = c;
  }

  public append(parent: HTMLElement): void {
    parent.append(this.canvas);
  }

  public addBack(back: IBack): void {
    this.back.push(back);
  }

  public clearBack(): void {
    this.back.length = 0;
  }

  public addHatsu(hatsu: IHatsuSprite): void {
    this.hatsu.push(hatsu);
  }

  public clearHatsu(): void {
    this.hatsu.length = 0;
  }

  public draw(): void {
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
