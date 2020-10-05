import { Component, VERSION } from '@angular/core';

import { FormGroup, FormControl, Validators, FormBuilder }  from '@angular/forms';
import { RxState, stateful } from '@rx-angular/state';
import { Subject, merge, combineLatest, EMPTY, Observable, interval, concat } from 'rxjs';
import { mapTo, map,startWith, withLatestFrom, switchMap, tap, pluck, first, switchMapTo, shareReplay, take } from 'rxjs/operators';


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.scss' ]
})
export class AppComponent  {
  count$
 workshopForm = this.fb.group({
    count_speed: [],
    firstValue: [],
    countDiff: []
  });
  counterForm$ = this.workshopForm.valueChanges;
  isTickingChange$: Subject<boolean> = new Subject<boolean>();
  btnSetToClick$: Subject<Event> = new Subject<Event>();
  countUpChange$: Subject<boolean> = new Subject<boolean>();
  resetClick$: Subject<Event> = new Subject<Event>();
  constructor(public fb: FormBuilder){
  const counterDiffChanges$ = this.workshopForm.controls.countDiff.valueChanges.pipe(map(v => +v));


  }
}
