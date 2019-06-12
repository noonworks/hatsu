import { ITheater } from "../ITheater";
import { IHatsuImage } from "./IHatsuImage";
import { A } from "./sprites/A";
import { B } from "./sprites/B";
import { C } from "./sprites/C";
import { D } from "./sprites/D";
import { E } from "./sprites/E";
import { F } from "./sprites/F";
import { G } from "./sprites/G";
import { H } from "./sprites/H";
import { I } from "./sprites/I";
import { J } from "./sprites/J";

export function addAllHatsus(theater: ITheater, img: IHatsuImage): void {
  [A, B, D, C, E, F, G, H, I, J].forEach((klass) => {
    theater.addHatsu(new klass({ img }));
  });
}
