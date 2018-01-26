import { Component, OnInit, Input, OnDestroy, EventEmitter, Output } from '@angular/core';
import { SpinnerService } from '../spinner.service';

@Component({
  selector: 'spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  @Input() name: string;
  @Input() loadingImage: string;
  private isShowing = false;

  constructor(private service: SpinnerService) { }

  @Input()
  get show(): boolean {
    return this.isShowing;
  }

  @Output() showChange = new EventEmitter();

  set show(val: boolean) {
    this.isShowing = val;
    this.showChange.emit(this.isShowing);
  }

  ngOnInit() {
    if (!this.name) throw new Error("Spinner must have a 'name' attribute!");

    this.service._register(this);
  }

  ngOnDestroy() {
    this.service._unregister(this);
  }
}