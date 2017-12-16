import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})
export class AppComponent {
  formData = this.fb.group({
    'firstName': ['jimmy', Validators.required],
    'lastName': [{ value: 'ho', disabled: true }, Validators.required],
    'phone': ['', [Validators.required, Validators.minLength(8)]]
  });
  // formData = new FormGroup({
  //   'firstName': new FormControl('jimmy', Validators.required),
  //   'lastName': new FormControl({ value: '', disabled: true }),
  //   'phone': new FormControl('', Validators.required)
  // })
  submit(form) {
    // console.log(form);
    console.log('value', this.formData.value);
    console.log('rawValue', this.formData.getRawValue());
  }

  constructor(private fb:FormBuilder) {}
}
