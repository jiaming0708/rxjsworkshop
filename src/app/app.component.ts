import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgControl, AbstractControl } from '@angular/forms';
import { tap, map, debounceTime, mergeMap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { defer } from 'rxjs/observable/defer';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { startWith } from 'rxjs/operators/startWith';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styles: []
})
export class AppComponent implements OnInit, AfterViewInit {
  formData = this.fb.group({
    'firstName': [, Validators.required],
    'lastName': [, Validators.required],
    'phone': [, [Validators.required, Validators.minLength(8)]],
    'search': [, Validators.required],
    'canAPI': []
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
  wikiUrl = '//en.wikipedia.org/w/api.php';

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
      // firstNameCtonrol.setErrors({ 'must': true });
      firstNameCtonrol.valueChanges.pipe(this.toggle(this.formData))
        .subscribe();
    }
  }

  searchKeyword$ = defer(() => {
    if (this.formData) {
      return this.formData.get('search')!.valueChanges;
    }
  }).pipe(tap(value => console.log('send', value)));

  canAPI$ = defer(() => {
    if (this.formData) {
      return this.formData.get('canAPI')!.valueChanges
        .pipe(startWith(false));
    }
  })

  // searchResult$ = this.searchKeyword$.pipe(
  //   debounceTime(750),
  //   mergeMap(value => this.http.jsonp(this.searchUrl(value, this.wikiUrl), 'callback')),
  //   map((data: any[]) => {
  //     if (!data) {
  //       return [];
  //     }
  //     data.shift();
  //     return data[0];
  //   })
  // );

  searchResult$ = combineLatest(this.searchKeyword$, this.canAPI$,
    (v1, v2) => ({ v1, v2 }))
    .pipe(
    debounceTime(750),
    mergeMap(({ v1, v2 }) => this.http.jsonp<any[0]>(this.searchUrl(v1, this.wikiUrl), 'callback'), ({ v1, v2 }, data) => ({ v2, data })
    ),
    map(({ v2, data }) => {
      console.log(v2, data);
        if (data.length == 0 || v2) {
          return [];
        }
        data.shift();
        return data[0];
      })
    );

  search() {
    // const result = this.http.jsonp(this.searchUrl(this.searchKeyword$.value, this.wikiUrl), 'callback')
    //   .subscribe();
  }

  searchUrl(term, base) {
    let params = new HttpParams()
      .append('action', 'opensearch')
      .append('search', encodeURIComponent(term))
      .append('format', 'json');
    return `${base}?${params.toString()}`;
  }

  toggle(form) {
    return obs => obs.pipe(
      tap(val => {
        if (val === 'jimmy') {
          form.get('lastName')!.enable();
        } else {
          form.get('lastName')!.disable();
        }
      })
    );
  }

  constructor(private fb:FormBuilder, private http:HttpClient) {}
}
