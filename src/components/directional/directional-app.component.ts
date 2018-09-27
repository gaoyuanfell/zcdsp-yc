import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {panel} from '../../app/animations/panel';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Directional} from '../../store/model/directional.state';
import {Observable} from 'rxjs';
import * as directionalReducer from '../../store/reducer/directional.reducer';
import * as directionalAction from '../../store/actions/directional.action';
import {getDirectionalData} from './directional.component';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DirectionalAppComponent),
  multi: true
};

@Component({
  selector: 'yc-directional-app',
  templateUrl: './directional-app.component.html',
  styleUrls: ['./directional.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,  // 数据手动刷新
  preserveWhitespaces: true,
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ],
  animations: [
    panel
  ],
})
export class DirectionalAppComponent implements OnInit, ControlValueAccessor, OnChanges, OnDestroy {

  audiencesApp$: Observable<Directional>;
  audiencesAppList$: Observable<Array<any>>;
  audiencesAppResult$: Observable<Array<any>>;

  checkAudiencesAppChange(value){
    this.store.dispatch(new directionalAction.CheckAudiencesAppChange(value))
  }

  setAudiencesAppNextChild({value, index}){
    this.store.dispatch(new directionalAction.AudiencesAppNextChild({value, index}));
  }

  queryAudiencesAppByName({target, value}){
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryAudiencesAppByName({target, value}));
  }

  constructor(private store: Store<AppState>,
              private changeDetectorRef: ChangeDetectorRef) {
    this.audiencesApp$ = store.pipe(select(directionalReducer.AudiencesApp));
    this.audiencesAppList$ = store.pipe(select(directionalReducer.AudiencesAppList));
    this.audiencesAppResult$ = store.pipe(select(directionalReducer.AudiencesAppResult));
  }

  trackByFn(index, item) {
    return index;
  }

  ngOnInit(): void {
    this.store.dispatch(new directionalAction.DirectionalRecovery2());
    this.audiencesAppResult$.subscribe(result => {
      this.onChange(result.map(r => ({id: r.id, name: r.name})));
    })
  }

  result

  onChange = (value) => {

  };
  onTouched = () => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    if (!obj) return;
    this.result = obj;
    this.store.dispatch(new directionalAction.DirectionalRecovery2());
    this.store.dispatch(new directionalAction.DirectionalSetResult2(this.result));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {

  }

}
