import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})
export class AppComponent implements OnInit {
  formData = this.fb.group({
    'firstName': [, Validators.required],
    'lastName': [, Validators.required],
    'phone': [, [Validators.required, Validators.minLength(8)]]
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

  ngOnInit() {
    this.formData.reset({
      'firstName': 'jimmy'
    })
  }

  constructor(private fb:FormBuilder) {}
}
