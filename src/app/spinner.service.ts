import { Injectable } from '@angular/core';
import { SpinnerComponent } from './spinner/spinner.component';

@Injectable()
export class SpinnerService {
  private spinners = new Set<SpinnerComponent>();

  _register(spinner: SpinnerComponent): void {
    this.spinners.add(spinner);
  }

  _unregister(spinner: SpinnerComponent): void {
    this.spinners.delete(spinner);
  }

  show(spinnerName: string): void {
    this.spinners.forEach(spinner => {
      if (spinner.name === spinnerName) spinner.show = true;
    });
  }

  hide(spinnerName: string): void {
    this.spinners.forEach(spinner => {
      if (spinner.name === spinnerName) spinner.show = false;
    });
  }

  isShowing(spinnerName: string): boolean | undefined {
    let showing = undefined;
    this.spinners.forEach(spinner => {
      if (spinner.name === spinnerName) {
        showing = spinner.show;
      }
    });
    return showing;
  }
}