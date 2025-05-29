import {MeasureExecutionTime} from './decorator.js';

export class Racunar {
    naziv: string;
  
    constructor(naziv: string) {
      this.naziv = naziv;
    }
  
    @MeasureExecutionTime
    izracunaj(n: number): number {
      let zbir = 0;
      for (let i = 0; i < n; i++) {
        zbir += Math.sqrt(i);
      }
      return zbir;
    }
  }
