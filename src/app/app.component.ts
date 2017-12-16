import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, NgControl, AbstractControl } from '@angular/forms';
import { tap, map, debounceTime, mergeMap } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { defer } from 'rxjs/observable/defer';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { startWith } from 'rxjs/operators/startWith';
import { shareReplay } from 'rxjs/operators/shareReplay';
import { of } from 'rxjs/observable/of';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
  });

  canAPI$ = defer(() => {
    if (this.formData) {
      return this.formData.get('canAPI')!.valueChanges
        .pipe(startWith(!!this.formData.get('canAPI')!.value));
    }
  })

  reload$: BehaviorSubject<boolean> = new BehaviorSubject(true);

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

  searchResult$ = combineLatest(this.searchKeyword$, this.canAPI$, this.reload$,
    (v1, canAPI) => ({ v1, canAPI }))
    .pipe(
    map(({ v1, canAPI }) => {
      console.log(v1, canAPI);
      return ({ v1, canAPI });
    }),
    debounceTime(750),
    mergeMap(({ v1, canAPI }) => {
      console.log('call api', canAPI);
      if (canAPI) {
        return this.http.jsonp<any[0]>(this.searchUrl(v1, this.wikiUrl), 'callback')
      }

      return of([]);
    } , ({ v1, canAPI }, data) => ( data)
    ),
    map((data) => {
      if (data.length == 0) {
        return [];
      }
      data.shift();
      return data[0];
    }),
    shareReplay()
  );
  
  reload() {
    this.reload$.next(true);
  }

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
