export default class Timer {
  private _total: number = 0;
  private _laps: number[] = [];

  public get started(): boolean {
    return this._laps.length > 0;
  }

  public get paused(): boolean {
    return this.started && (this._laps.length % 2 === 0);
  }

  public start(): void {
    const now = (new Date()).getTime();
    if (this.started) {
      if (this.paused) {
        // started and paused - resume pause.
        this.addLap(now);
      }
      // started and not paused - do nothing.
    } else {
      // not started - start.
      this._laps.push(now);
    }
  }

  public stop(): void {
    this._total = 0;
    this._laps = [];
  }

  public pause(): void {
    if (this.started && !this.paused) {
      this.addLap((new Date()).getTime());
    }
  }

  public msec(dt?: Date): number {
    if (this._laps.length === 0) {
      return -1;
    }
    if (this.paused) {
      return this._total;
    }
    const now = (dt || new Date()).getTime();
    return this._total + (now - this._laps[this._laps.length - 1]);
  }

  private addLap(now: number): void {
    this._laps.push(now);
    this._total = this._laps.map((l, i) => {
      return (i % 2 === 0) ? 0 : l - this._laps[i - 1];
    }).reduce((s, c) => s += c, 0);
  }
}
