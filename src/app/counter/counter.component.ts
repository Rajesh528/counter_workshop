import { Subject, merge, combineLatest, EMPTY, Observable, interval, concat, empty } from 'rxjs';
import { mapTo, map,startWith, withLatestFrom, switchMap, tap, pluck, first, switchMapTo, shareReplay, take } from 'rxjs/operators';
import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';

import { RxState, stateful } from '@rx-angular/state';
interface InputEvent {
  target: {
    value: any
  }
}
interface CounterState {
    isTicking: boolean,
    count: number,
    countUp: boolean,
    count_speed: number,
    countDiff: number,
    firstValue: number
  };
const initialCounterState = {
    isTicking: false,
    count: 0,
    countUp: true,
    count_speed: 200,
    countDiff: 1,
    firstValue: 0
  };
  
@Component({
  selector: 'counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent extends RxState<CounterState>  {
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

  counter$ = this.select('count');

  constructor(private fb: FormBuilder) {
    super();
    this.set(initialCounterState);
    const counterDiffChanges$ = this.workshopForm.controls.countDiff.valueChanges.pipe(map(v => +v));

  //   this.workshopForm.get("countDiff").valueChanges.subscribe(x => {
  //     console.log(x)
  //  });
    this.connect('isTicking', this.isTickingChange$);
    this.connect('countUp', this.countUpChange$);
    this.connect('countDiff', counterDiffChanges$);
    this.connect(this.counterForm$.pipe(onchange_fn( 'count_speed')));

    const setTo$ = this.btnSetToClick$.pipe(
      map(_ => +this.workshopForm.controls.firstValue.value)
    );

    const initialState$ = this.select().pipe(
      first(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );

    const initalStartingValue$ = initialState$.pipe(pluck('firstValue'));

    const resetStartingValue$ = this.resetClick$.pipe(
      withLatestFrom(initalStartingValue$),
      map(([_, value]) => value)
    );
    const startingValueChanges$ = merge(setTo$, resetStartingValue$);
    this.connect('firstValue', startingValueChanges$);

    var inter = true ? interval(100):EMPTY;

    console.log(inter);
const tick$ = combineLatest(this.select('isTicking'), this.select('count_speed'))
      .pipe(switchMap(([isTicking, ms]) => isTicking ? interval(ms): EMPTY));
this.isTickingChange$.subscribe(h=>{
  console.log(h);
});


    const counter$ = concat(initalStartingValue$, startingValueChanges$).pipe(
      switchMap(firstValue => tick$.pipe(
        withLatestFrom(this.select()),
        map(([, s]) => s.count + (s.countUp ? 1 : -1)* s.countDiff),
        startWith(firstValue)
      ))
    )
    this.connect('count', counter$);

    // OUTPUTS
    const patchForm$ = merge(
      this.pick('countDiff'),
      this.pick('count_speed'),
      this.pick('firstValue'),
      // startingValue might not have changed, yet setTo input element might have 
      // been typed into and therefore needs synchronizing with the CounterState
      this.resetClick$.pipe(switchMap(() => this.pick('firstValue').pipe(first())))
    ).pipe(
      tap(state => this.workshopForm.patchValue(state, { emitEvent: false }))
    );
    this.hold(patchForm$);
  }

  private pick(key: keyof CounterState) {
    console.log(key);
    return this.select(key).pipe(
      map(value => ({ [key]: value}))
    )
  }
}

function  onchange_fn<T>(key: string) {
    return o$ => o$.pipe(stateful(pluck(key), 
    map(v => ({[key]: v}))))
  }
