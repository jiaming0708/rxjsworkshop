import { NgControl } from '@angular/forms';
import { Directive, AfterViewInit, Input, ElementRef } from '@angular/core';

@Directive({
  selector: '[myError]'
})
export class MyErrorDirective implements AfterViewInit {

  @Input('myError') myError:NgControl;

  ngAfterViewInit() {
    const control = this.myError;
    if (!!control) {
      control.statusChanges!.subscribe(value => {
        this.el.nativeElement.innerHtml = '';
        if (value === 'INVALID') {
          this.el.nativeElement.innerHtml = 'ERROR';
        }
      });
    }
  }

  constructor(private el:ElementRef) { }

}
