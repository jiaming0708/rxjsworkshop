import { Component, OnInit, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})
export class AppComponent implements OnInit, AfterViewInit {
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

  firstName = 'firstName';

  ngOnInit() {
    this.formData.reset({
      firstName: 'jimmy'
    });

    const firstNameCtonrol = this.formData.get('firstName');
    if (!!firstNameCtonrol) {
      firstNameCtonrol.setValidators(Validators.required);
    }
  }

  ngAfterViewInit() {
    const firstNameCtonrol = this.formData.get('firstName');
    if (!!firstNameCtonrol) {
      firstNameCtonrol.setErrors({ 'must': true });
    }
  }

  constructor(private fb:FormBuilder) {}
}
