export interface IHatsuOptions {
  type: 'default' | 'file';
  file?: File;
}

export interface IBackOptions {
  type: 'default' | 'image';
  file?: File;
}

export interface IOptions {
  hatsu: IHatsuOptions;
  back: IBackOptions;
  size: number;
}

function getChecked(inputs: NodeListOf<HTMLElement>): HTMLElement | null {
  for (let i = 0; i < inputs.length; i++) {
    const checked = (inputs[i] as HTMLInputElement).checked;
    if (checked) {
      return inputs[i];
    }
  }
  return null;
}

type OptionDictionary = { [key: string]: any };

function _diffOption(oldOne: OptionDictionary, newOne: OptionDictionary): OptionDictionary {
  const ret: OptionDictionary = {};
  const oldKeys = Object.keys(oldOne);
  oldKeys.forEach(k => {
    if (oldOne.hasOwnProperty(k) && newOne.hasOwnProperty(k)) {
      if (typeof (oldOne[k]) === 'object' && typeof (newOne[k]) === 'object') {
        ret[k] = _diffOption(oldOne[k], newOne[k]);
      } else if (oldOne[k] !== newOne[k]) {
        ret[k] = newOne[k];
      }
    }
  });
  return ret;
}

type IOptionsDiff = {
  hatsu?: IHatsuOptions;
  back?: IBackOptions;
  size?: number;
};

function diffOption(oldOne: IOptions, newOne: IOptions): IOptionsDiff {
  const ret: IOptionsDiff = {};
  const h = _diffOption(oldOne.hatsu, newOne.hatsu);
  if (Object.keys(h).length > 0) {
    ret.hatsu = newOne.hatsu;
  }
  const b = _diffOption(oldOne.back, newOne.back);
  if (Object.keys(b).length > 0) {
    ret.back = newOne.back;
  }
  if (oldOne.size !== newOne.size) {
    ret.size = newOne.size;
  }
  return ret;
}

export class Options {
  private _opt: IOptions;

  constructor() {
    this._opt = this.getOptions();
  }

  public get options(): IOptions {
    return this._opt;
  }

  public diff(): IOptionsDiff {
    const option = this.getOptions();
    const changed = diffOption(this._opt, option);
    this._opt = option;
    return changed;
  }

  private getOptions(): IOptions {
    return {
      hatsu: this.getHatsu(),
      back: this.getBack(),
      size: this.getSize(),
    };
  }

  private getFile(id: string): File | null {
    const f = document.getElementById(id);
    if (!f) { return null; }
    const fi = f as HTMLInputElement;
    if (fi && fi.files && typeof (fi.files[0]) !== 'undefined') {
      return fi.files[0];
    }
    return null;
  }

  private getHatsu(): IHatsuOptions {
    const hatsuInput = getChecked(document.getElementsByName('hatsu'));
    if (hatsuInput) {
      const s = hatsuInput.id.replace('hatsu_', '');
      if (s === 'file') {
        const file = this.getFile('hatsu_file_path');
        if (file) {
          return {
            type: 'file',
            file,
          };
        }
      }
    }
    return {
      type: 'default',
    };
  }

  private getBack(): IBackOptions {
    const backRadio = getChecked(document.getElementsByName('back'));
    if (backRadio) {
      const s = backRadio.id.replace('back_', '');
      if (s === 'file') {
        const file = this.getFile('back_file_path');
        if (file) {
          if (file.type.startsWith('image/')) {
            return {
              type: 'image',
              file,
            };
          }
        }
      }
    }
    return {
      type: 'default',
    };
  }

  private getSize(): number {
    const sizeInput = getChecked(document.getElementsByName('size'));
    let size = 480;
    if (sizeInput) {
      const s = sizeInput.id.replace('size_', '');
      const i = parseInt(s, 10);
      if (!isNaN(i)) { size = i; }
    }
    return size;
  }
}
