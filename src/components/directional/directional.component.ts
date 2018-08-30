import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {panel} from '../../app/animations/panel';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import {concat, forkJoin, Observable} from 'rxjs';
import {Directional} from '../../store/model/directional.state';
import {DirectionalDataService} from '../../service/directional-data.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {concatAll} from 'rxjs/operators';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DirectionalComponent),
  multi: true
};

@Component({
  selector: 'yc-directional',
  templateUrl: './directional.component.html',
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
export class DirectionalComponent implements OnInit, AfterViewInit,ControlValueAccessor,OnChanges {

  areasState$: Observable<Directional>;
  areasResult$: Observable<Array<any>>;
  areasChildList$: Observable<Array<any>>;

  lbsCityState$: Observable<Directional>;
  lbsCityList$: Observable<Array<any>>;
  lbsCityResult$: Observable<Array<any>>;
  lbsCityViewResult$: Observable<Array<any>>;

  audiences$: Observable<Array<any>>;
  audiencesResult$: Observable<Array<any>>;

  device$: Observable<Array<any>>;
  deviceResult$: Observable<Array<any>>;

  audiencesAction$: Observable<Directional>;
  audiencesActionList$: Observable<Array<any>>;
  audiencesActionResult$: Observable<Array<any>>;

  audiencesAction2$: Observable<Directional>;
  audiencesAction2List$: Observable<Array<any>>;
  audiencesAction2Result$: Observable<Array<any>>;

  // --------------------------- Areas

  /**
   * 获取下级数据
   */
  setAreasNextChild({value, index}) {
    // this.store.dispatch(new directionalAction.AreasNextChild({value, index}));
    this._directionalDataService.funcAreasNextChild({value, index});
  }

  /**
   * 全选下级数据
   */
  checkAreasChange(value) {
    // this.store.dispatch(new directionalAction.CheckAreasChange(value));
    this._directionalDataService.funcCheckAreasChange(value);
  }

  queryAreasByName({target, value}) {
    if (!value) return;
    // this.store.dispatch(new directionalAction.QueryAreasByName({target, value}));
    this._directionalDataService.funcQueryAreasByName({target, value});
  }

  // --------------------------- LBS

  setLbsCityNextChild({value, index}) {
    // this.store.dispatch(new directionalAction.LbsCityNextChild({value, index}));
    this._directionalDataService.funcLbsCityNextChild({value, index});
  }

  checkLbsCityChange(value) {
    // this.store.dispatch(new directionalAction.CheckLbsCityChange(value));
    this._directionalDataService.funcCheckLbsCityChange(value);
  }

  queryLbsCityByName({target, value}) {
    if (!value) return;
    // this.store.dispatch(new directionalAction.QueryLbsCityByName({target, value}));
    this._directionalDataService.funcQueryLbsCityByName({target, value});
  }

  // ------------------------------- AudiencesAction

  setAudiencesActionNextChild({value, index}) {
    // this.store.dispatch(new directionalAction.AudiencesActionNextChild({value, index}));
    this._directionalDataService.funcAudiencesActionNextChild({value, index});
  }

  checkAudiencesActionChange(value) {
    // this.store.dispatch(new directionalAction.CheckAudiencesActionChange(value));
    this._directionalDataService.funcCheckAudiencesActionChange(value);
  }

  queryAudiencesActionByName({target, value}) {
    if (!value) return;
    // this.store.dispatch(new directionalAction.QueryAudiencesActionByName({target, value}));
    this._directionalDataService.funcQueryAudiencesActionByName({target, value});
  }

  setAudiencesActionNextChild2({value, index}) {
    // this.store.dispatch(new directionalAction.AudiencesActionNextChild2({value, index}));
    this._directionalDataService.funcAudiencesAction2NextChild({value, index});
  }

  checkAudiencesActionChange2(value) {
    // this.store.dispatch(new directionalAction.CheckAudiencesActionChange2(value));
    this._directionalDataService.funcCheckAudiencesAction2Change(value);
  }

  queryAudiencesAction2ByName({target, value}) {
    if (!value) return;
    this._directionalDataService.funcQueryAudiencesAction2ByName({target, value});
  }

  // -------------------------- Audiences

  checkAudiencesChange(value) {
    // this.store.dispatch(new directionalAction.CheckAudiencesChange(value));
    this._directionalDataService.funcCheckAudiencesChange(value)
  }

  removeAllAudiences() {
    // this.store.dispatch(new directionalAction.RemoveAllAudiences());
    this._directionalDataService.funcRemoveAllAudiences();
  }

  // ----------------------- Device

  checkDeviceChange(value) {
    // this.store.dispatch(new directionalAction.CheckDeviceChange(value));
    this._directionalDataService.funcCheckDeviceChange(value)
  }

  removeAllDevice() {
    // this.store.dispatch(new directionalAction.RemoveAllDevice());
    this._directionalDataService.funcRemoveAllDevice()
  }

  constructor(private store: Store<AppState>,
              private _directionalDataService: DirectionalDataService,
              private changeDetectorRef: ChangeDetectorRef) {

    // this.store.dispatch(new directionalAction.DirectionalInit());
    // this.store.dispatch(new directionalAction.LbsCityInit());
    // this.store.dispatch(new directionalAction.AudiencesActionInit());

    // this.areasState$ = store.pipe(select(directionalReducer.Areas));
    // this.areasResult$ = store.pipe(select(directionalReducer.AreasResult));
    // this.areasChildList$ = store.pipe(select(directionalReducer.AreasChildList));

    this.areasState$ = _directionalDataService.areas$;
    this.areasChildList$ = _directionalDataService.areasChildList$;
    this.areasResult$ = _directionalDataService.areasResult$;

    // this.lbsCityState$ = store.pipe(select(directionalReducer.LbsCity));
    // this.lbsCityList$ = store.pipe(select(directionalReducer.LbsCityList));
    // this.lbsCityResult$ = store.pipe(select(directionalReducer.LbsCityResult));
    // this.lbsCityViewResult$ = store.pipe(select(directionalReducer.LbsCityViewResult));

    this.lbsCityState$ = _directionalDataService.lbsCity$;
    this.lbsCityList$ = _directionalDataService.lbsCityList$;
    this.lbsCityResult$ = _directionalDataService.lbsCityResult$;
    this.lbsCityViewResult$ = _directionalDataService.lbsCityViewResult$;

    // this.audiences$ = store.pipe(select(directionalReducer.Audiences));
    // this.audiencesResult$ = store.pipe(select(directionalReducer.AudiencesResult));

    this.audiences$ = _directionalDataService.audiences$;
    this.audiencesResult$ = _directionalDataService.audiencesResult$;

    // this.device$ = store.pipe(select(directionalReducer.Device));
    // this.deviceResult$ = store.pipe(select(directionalReducer.DeviceResult));

    this.device$ = _directionalDataService.device$;
    this.deviceResult$ = _directionalDataService.deviceResult$;

    // this.audiencesAction$ = store.pipe(select(directionalReducer.AudiencesAction));
    // this.audiencesActionList$ = store.pipe(select(directionalReducer.AudiencesActionList));
    // this.audiencesActionResult$ = store.pipe(select(directionalReducer.AudiencesActionResult));

    this.audiencesAction$ = _directionalDataService.audiencesAction$;
    this.audiencesActionList$ = _directionalDataService.audiencesActionList$;
    this.audiencesActionResult$ = _directionalDataService.audiencesActionResult$;

    // this.audiencesAction2$ = store.pipe(select(directionalReducer.AudiencesAction2));
    // this.audiencesAction2List$ = store.pipe(select(directionalReducer.AudiencesAction2List));
    // this.audiencesAction2Result$ = store.pipe(select(directionalReducer.AudiencesAction2Result));

    this.audiencesAction2$ = _directionalDataService.audiencesAction2$;
    this.audiencesAction2List$ = _directionalDataService.audiencesAction2List$;
    this.audiencesAction2Result$ = _directionalDataService.audiencesAction2Result$;
  }

  get areasChildList(){
    return this._directionalDataService.areasChildList
  }
  get lbsCityList(){
    return this._directionalDataService.lbsCityList
  }
  get audiencesActionList(){
    return this._directionalDataService.audiencesActionList
  }
  get audiencesAction2List(){
    return this._directionalDataService.audiencesAction2List
  }

  trackByFn(index, item){
    return index;
  }

  ngOnInit() {
    this._directionalDataService.result$.subscribe(data => {
      this.onChange(data);
    })
  }

  ngAfterViewInit(): void {
    console.info('ngAfterViewInit');
  }

  result;

  onChange = (value) => {}
  onTouched = () => {}

  @Input() set value(result){
    if(result){
      this._directionalDataService.resultSubject.next(result);
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.result = obj;
    this._directionalDataService.resultSubject.next(this.result);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck()
  }



}
