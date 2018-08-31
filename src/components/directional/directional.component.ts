import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  forwardRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges
} from '@angular/core';
import {panel} from '../../app/animations/panel';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import {Observable, Subject} from 'rxjs';
import {Directional} from '../../store/model/directional.state';
import * as directionalReducer from '../../store/reducer/directional.reducer';
import * as directionalAction from '../../store/actions/directional.action';
import {DirectionalDataService} from '../../service/directional-data.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DirectionalComponent),
  multi: true
};

export function getDirectionalData() {
  return {
    dtl_address: {
      area: [],
      lbs: [],
      type: 1,
      scene_type: 1
    },
    dtl_attribute: {
      crowdAttribute: {
        age: [],
        sex: [],
        education: [],
      }
    },
    dtl_behavior: {
      appCategory: [],
      appAttribute: [],
      filterAppCategory: [],
      filterAppAttribute: [],
    },
    dtl_devices: {
      devicesType: [],
      brand: [],
      mobileOS: [],
      netType: [],
      operators: [],
      browsers: [],
    }
  };
}

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
export class DirectionalComponent implements OnInit, AfterViewInit, ControlValueAccessor, OnChanges, OnDestroy {

  areasState$: Observable<Directional>;
  areasResult$: Observable<Array<any>>;
  areasChildList$: Observable<Array<any>>;

  lbsCityState$: Observable<Directional>;
  LbsScenes$: Observable<Array<any>>;
  lbsCityList$: Observable<Array<any>>;
  lbsCityResult$: Observable<Array<any>>;
  lbsCityViewResult$: Observable<Array<any>>;

  audiences$: Observable<Array<any>>;
  audiencesResult$: Observable<Array<any>>;
  audiencesViewResult$: Observable<Array<any>>;

  device$: Observable<Array<any>>;
  deviceResult$: Observable<Array<any>>;
  deviceViewResult$: Observable<Array<any>>;

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
    this.store.dispatch(new directionalAction.AreasNextChild({value, index}));
    // this._directionalDataService.funcAreasNextChild({value, index});
  }

  /**
   * 全选下级数据
   */
  checkAreasChange(value) {
    this.store.dispatch(new directionalAction.CheckAreasChange(value));
    // this._directionalDataService.funcCheckAreasChange(value);
  }

  queryAreasByName({target, value}) {
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryAreasByName({target, value}));
    // this._directionalDataService.funcQueryAreasByName({target, value});
  }

  // --------------------------- LBS

  setLbsCityNextChild({value, index}) {
    this.store.dispatch(new directionalAction.LbsCityNextChild({value, index}));
    // this._directionalDataService.funcLbsCityNextChild({value, index});
  }

  checkLbsCityChange(value) {
    this.store.dispatch(new directionalAction.CheckLbsCityChange(value));
    // this._directionalDataService.funcCheckLbsCityChange(value);
  }

  queryLbsCityByName({target, value}) {
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryLbsCityByName({target, value}));
    // this._directionalDataService.funcQueryLbsCityByName({target, value});
  }

  // ------------------------------- AudiencesAction

  setAudiencesActionNextChild({value, index}) {
    this.store.dispatch(new directionalAction.AudiencesActionNextChild({value, index}));
    // this._directionalDataService.funcAudiencesActionNextChild({value, index});
  }

  checkAudiencesActionChange(value) {
    this.store.dispatch(new directionalAction.CheckAudiencesActionChange(value));
    // this._directionalDataService.funcCheckAudiencesActionChange(value);
  }

  queryAudiencesActionByName({target, value}) {
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryAudiencesActionByName({target, value}));
    // this._directionalDataService.funcQueryAudiencesActionByName({target, value});
  }

  setAudiencesActionNextChild2({value, index}) {
    this.store.dispatch(new directionalAction.AudiencesActionNextChild2({value, index}));
    // this._directionalDataService.funcAudiencesAction2NextChild({value, index});
  }

  checkAudiencesActionChange2(value) {
    this.store.dispatch(new directionalAction.CheckAudiencesActionChange2(value));
    // this._directionalDataService.funcCheckAudiencesAction2Change(value);
  }

  queryAudiencesAction2ByName({target, value}) {
    if (!value) return;
    this._directionalDataService.funcQueryAudiencesAction2ByName({target, value});
  }

  // -------------------------- Audiences

  checkAudiencesChange(value) {
    this.store.dispatch(new directionalAction.CheckAudiencesChange(value));
    // this._directionalDataService.funcCheckAudiencesChange(value)
  }

  removeAllAudiences() {
    this.store.dispatch(new directionalAction.RemoveAllAudiences());
    // this._directionalDataService.funcRemoveAllAudiences();
  }

  // ----------------------- Device

  checkDeviceChange(value) {
    this.store.dispatch(new directionalAction.CheckDeviceChange(value));
    // this._directionalDataService.funcCheckDeviceChange(value)
  }

  removeAllDevice() {
    this.store.dispatch(new directionalAction.RemoveAllDevice());
    // this._directionalDataService.funcRemoveAllDevice()
  }

  constructor(private store: Store<AppState>,
              private _directionalDataService: DirectionalDataService,
              private changeDetectorRef: ChangeDetectorRef) {

    // this.store.dispatch(new directionalAction.DirectionalInit());
    // this.store.dispatch(new directionalAction.LbsCityInit());
    // this.store.dispatch(new directionalAction.AudiencesActionInit());

    this.areasState$ = store.pipe(select(directionalReducer.Areas));
    this.areasResult$ = store.pipe(select(directionalReducer.AreasResult));
    this.areasChildList$ = store.pipe(select(directionalReducer.AreasChildList));

    // this.areasState$ = _directionalDataService.areas$;
    // this.areasChildList$ = _directionalDataService.areasChildList$;
    // this.areasResult$ = _directionalDataService.areasResult$;

    this.lbsCityState$ = store.pipe(select(directionalReducer.LbsCity));
    this.LbsScenes$ = store.pipe(select(directionalReducer.LbsScenes));
    this.lbsCityList$ = store.pipe(select(directionalReducer.LbsCityList));
    this.lbsCityResult$ = store.pipe(select(directionalReducer.LbsCityResult));
    this.lbsCityViewResult$ = store.pipe(select(directionalReducer.LbsCityViewResult));

    // this.lbsCityState$ = _directionalDataService.lbsCity$;
    // this.lbsCityList$ = _directionalDataService.lbsCityList$;
    // this.lbsCityResult$ = _directionalDataService.lbsCityResult$;
    // this.lbsCityViewResult$ = _directionalDataService.lbsCityViewResult$;

    this.audiences$ = store.pipe(select(directionalReducer.Audiences));
    this.audiencesResult$ = store.pipe(select(directionalReducer.AudiencesResult));
    this.audiencesViewResult$ = store.pipe(select(directionalReducer.AudiencesViewResult));

    // this.audiences$ = _directionalDataService.audiences$;
    // this.audiencesResult$ = _directionalDataService.audiencesResult$;

    this.device$ = store.pipe(select(directionalReducer.Device));
    this.deviceResult$ = store.pipe(select(directionalReducer.DeviceResult));
    this.deviceViewResult$ = store.pipe(select(directionalReducer.DeviceViewResult));

    // this.device$ = _directionalDataService.device$;
    // this.deviceResult$ = _directionalDataService.deviceResult$;

    this.audiencesAction$ = store.pipe(select(directionalReducer.AudiencesAction));
    this.audiencesActionList$ = store.pipe(select(directionalReducer.AudiencesActionList));
    this.audiencesActionResult$ = store.pipe(select(directionalReducer.AudiencesActionResult));

    // this.audiencesAction$ = _directionalDataService.audiencesAction$;
    // this.audiencesActionList$ = _directionalDataService.audiencesActionList$;
    // this.audiencesActionResult$ = _directionalDataService.audiencesActionResult$;

    this.audiencesAction2$ = store.pipe(select(directionalReducer.AudiencesAction2));
    this.audiencesAction2List$ = store.pipe(select(directionalReducer.AudiencesAction2List));
    this.audiencesAction2Result$ = store.pipe(select(directionalReducer.AudiencesAction2Result));

    // this.audiencesAction2$ = _directionalDataService.audiencesAction2$;
    // this.audiencesAction2List$ = _directionalDataService.audiencesAction2List$;
    // this.audiencesAction2Result$ = _directionalDataService.audiencesAction2Result$;
  }

  trackByFn(index, item) {
    return index;
  }

  ngOnInit() {
    this.getResultInit();
  }

  ngAfterViewInit(): void {

  }

  result;

  /**
   * 订阅获取值
   */
  getResultInit() {
    let resultSubject = new Subject();
    resultSubject.subscribe(data => {
      this.onChange(data);
      console.info(data);
    });

    let result = getDirectionalData();

    this.areasResult$.subscribe(data => {
      if (!data) return;
      result.dtl_address.area = data.map(ar => ({id: ar.id, name: ar.name}));
      resultSubject.next(result);
    });

    this.lbsCityResult$.subscribe(data => {
      if (!data) return;
      result.dtl_address.lbs = data.map(ar => ({id: ar.id, name: ar.name, coords: ar.location_items, type_id: ar.type_id}));
      resultSubject.next(result);
    });

    this.audiencesActionResult$.subscribe(data => {
      if (!data) return;
      result.dtl_behavior.appCategory = data.filter(aa => isNaN(+aa.type_id)).map(aa => ({id: aa.id, name: aa.name}));
      result.dtl_behavior.appAttribute = data.filter(aa => !isNaN(+aa.type_id)).map(aa => ({id: aa.id, name: aa.name}));
      resultSubject.next(result);
    });

    this.audiencesAction2Result$.subscribe(data => {
      if (!data) return;
      result.dtl_behavior.filterAppCategory = data.filter(aa => isNaN(+aa.type_id)).map(aa => ({id: aa.id, name: aa.name}));
      result.dtl_behavior.filterAppAttribute = data.filter(aa => !isNaN(+aa.type_id)).map(aa => ({id: aa.id, name: aa.name}));
      resultSubject.next(result);
    });

    this.audiencesResult$.subscribe((data: any) => {
      if (!data) return;
      result.dtl_attribute.crowdAttribute = data;
      resultSubject.next(result);
    });

    this.deviceResult$.subscribe((data: any) => {
      if (!data) return;
      result.dtl_devices = data;
      resultSubject.next(result);
    });
  }

  onChange = (value) => {
  };
  onTouched = () => {
  };

  @Input() set value(result) {

  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.result = obj;

    let asd = {
      'dtl_address': {
        'area': [{'id': 60}, {'id': 40}, {'id': 47}, {'id': 206}, {'id': 87}, {'id': 112}, {'id': 1}, {'id': 39}, {'id': 2}, {'id': 113}, {'id': 275}, {'id': 236}, {'id': 22}, {'id': 239}, {'id': 234}, {'id': 9}, {'id': 111}, {'id': 125}, {'id': 250}, {'id': 115}, {'id': 124}, {'id': 189}, {'id': 126}, {'id': 153}, {'id': 296}],
        'lbs': []
      },
      'dtl_attribute': {'sex': [0, 1, 2], 'age': [0, 8, 7, 5, 6]},
      'dtl_behavior': {
        'appAttribute': [],
        'appCategory': [{'id': 35}, {'id': 33}, {'id': 100}, {'id': 102}, {'id': 106}, {'id': 74}, {'id': 34}, {'id': 25}, {'id': 28}]
      },
      'dtl_devices': {
        'devicesType': [1],
        'operators': [0, 1, 3],
        'netType': [0, 3, 2, 1, 4],
        'brand': [84, 1, 29, 63, 6, 45, 58, 4, 107],
        'mobileOS': [1, 2, 0]
      },
    };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.store.dispatch(new directionalAction.DirectionalRecovery());
  }

  assignDefaultData(target, source) {
    Object.keys(source).forEach(sk => {

      if (typeof target[sk] === 'object' && typeof source[sk] === 'object') {
        this.assignDefaultData(target[sk], source[sk])
      }else{

      }

    });
  }
}
