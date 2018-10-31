import {
  AfterViewInit,
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
import {Observable, Subject} from 'rxjs';
import {Directional} from '../../store/model/directional.state';
import * as directionalReducer from '../../store/reducer/directional.reducer';
import * as directionalAction from '../../store/actions/directional.action';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {debounceTime} from 'rxjs/operators';

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
      scene_type: 1,
      lbs_scene_type: 1,
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
  exportAs: 'ycDirectional',
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
  lbsScenes$: Observable<Array<any>>;
  lbsCityList$: Observable<Array<any>>;
  lbsCityResult$: Observable<Array<any>>;
  lbsCityMapResult$: Observable<Array<any>>;
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
  }

  /**
   * 全选下级数据
   */
  checkAreasChange(value) {
    this.store.dispatch(new directionalAction.CheckAreasChange(value));
  }

  queryAreasByName({target, value}) {
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryAreasByName({target, value}));
  }

  // --------------------------- LBS

  setLbsCityNextChild({value, index}) {
    this.store.dispatch(new directionalAction.LbsCityNextChild({value, index}));
  }

  removeMapResult = () => {
  };

  checkLbsCityChange(value) {
    if (!value) {
      this.removeMapResult();
      this.store.dispatch(new directionalAction.LbsCityMapRemoveAll());
    }
    this.store.dispatch(new directionalAction.CheckLbsCityChange(value));
  }

  queryLbsCityByName({target, value}) {
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryLbsCityByName({target, value}));
  }

  del = (value) => {
  }; // 删除的元素  初始化
  lbsCityMapRemove(data) {
    this.del(data);
    this.store.dispatch(new directionalAction.LbsCityMapRemove(data));
  }

  // ------------------------------- AudiencesAction

  setAudiencesActionNextChild({value, index}) {
    this.store.dispatch(new directionalAction.AudiencesActionNextChild({value, index}));
  }

  checkAudiencesActionChange(value) {
    this.store.dispatch(new directionalAction.CheckAudiencesActionChange(value));
  }

  queryAudiencesActionByName({target, value}) {
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryAudiencesActionByName({target, value}));
  }

  setAudiencesActionNextChild2({value, index}) {
    this.store.dispatch(new directionalAction.AudiencesActionNextChild2({value, index}));
  }

  checkAudiencesActionChange2(value) {
    this.store.dispatch(new directionalAction.CheckAudiencesActionChange2(value));
  }

  queryAudiencesAction2ByName({target, value}) {
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryAudiencesAction2ByName({target, value}));
  }

  // -------------------------- Audiences

  checkAudiencesChange(value) {
    this.store.dispatch(new directionalAction.CheckAudiencesChange(value));
  }

  removeAllAudiences() {
    this.store.dispatch(new directionalAction.RemoveAllAudiences());
  }

  // ----------------------- Device

  checkDeviceChange(value) {
    this.store.dispatch(new directionalAction.CheckDeviceChange(value));
  }

  removeAllDevice() {
    this.store.dispatch(new directionalAction.RemoveAllDevice());
  }

  constructor(private store: Store<AppState>,
              private changeDetectorRef: ChangeDetectorRef) {

    this.areasState$ = store.pipe(select(directionalReducer.Areas));
    this.areasResult$ = store.pipe(select(directionalReducer.AreasResult));
    this.areasChildList$ = store.pipe(select(directionalReducer.AreasChildList));

    this.lbsCityState$ = store.pipe(select(directionalReducer.LbsCity));
    this.lbsScenes$ = store.pipe(select(directionalReducer.LbsScenes));
    this.lbsCityList$ = store.pipe(select(directionalReducer.LbsCityList));
    this.lbsCityResult$ = store.pipe(select(directionalReducer.LbsCityResult));
    this.lbsCityMapResult$ = store.pipe(select(directionalReducer.LbsCityMapResult));
    this.lbsCityViewResult$ = store.pipe(select(directionalReducer.LbsCityViewResult));
    this.audiences$ = store.pipe(select(directionalReducer.Audiences));
    this.audiencesResult$ = store.pipe(select(directionalReducer.AudiencesResult));
    this.audiencesViewResult$ = store.pipe(select(directionalReducer.AudiencesViewResult));

    this.device$ = store.pipe(select(directionalReducer.Device));
    this.deviceResult$ = store.pipe(select(directionalReducer.DeviceResult));
    this.deviceViewResult$ = store.pipe(select(directionalReducer.DeviceViewResult));

    this.audiencesAction$ = store.pipe(select(directionalReducer.AudiencesAction));
    this.audiencesActionList$ = store.pipe(select(directionalReducer.AudiencesActionList));
    this.audiencesActionResult$ = store.pipe(select(directionalReducer.AudiencesActionResult));

    this.audiencesAction2$ = store.pipe(select(directionalReducer.AudiencesAction2));
    this.audiencesAction2List$ = store.pipe(select(directionalReducer.AudiencesAction2List));
    this.audiencesAction2Result$ = store.pipe(select(directionalReducer.AudiencesAction2Result));
  }

  trackByFn(index, item) {
    return index;
  }

  ngOnInit() {
    this.store.dispatch(new directionalAction.DirectionalRecovery());
    this.getResultInit();
  }

  ngAfterViewInit(): void {

  }

  result: any = {};

  get scene_type() {
    if (this.result.dtl_address) {
      return this.result.dtl_address.lbs_scene_type;
    }
    return 0;
  }

  set scene_type(val) {
    if (this.result.dtl_address) {
      this.result.dtl_address.lbs_scene_type = val;
      this.onChange(this.result);
    }
  }

  areasShow = false;
  audiencesActionShow = false;
  audiencesShow = false;
  deviceShow = false;

  areasResult$$;
  lbsCityResult$$;
  lbsCityMapResult$$;
  audiencesActionResult$$;
  audiencesAction2Result$$;
  audiencesResult$$;
  deviceResult$$;

  getResultDestroy() {
    this.areasResult$$.unsubscribe();
    this.lbsCityResult$$.unsubscribe();
    this.lbsCityMapResult$$.unsubscribe();
    this.audiencesActionResult$$.unsubscribe();
    this.audiencesAction2Result$$.unsubscribe();
    this.audiencesResult$$.unsubscribe();
    this.deviceResult$$.unsubscribe();
  }

  areasResult = [];
  lbsCityResult = [];
  lbsCityMapResult = [];

  areasShowChange() {
    this.resultData.dtl_address.area = this.areasShow ? this.areasResult : [];
    this.resultData.dtl_address.lbs = this.areasShow ? this.lbsCityResult : [];
    this.resultSubject.next(this.resultData);
  }

  audiencesActionResult = [];
  audiencesAction2Result = [];

  audiencesActionShowChange() {
    if (this.audiencesActionShow) {
      this.resultData.dtl_behavior.appCategory = this.audiencesActionResult.filter(aa => isNaN(+aa.type_id)).map(aa => ({
        id: aa.id,
        name: aa.name
      }));
      this.resultData.dtl_behavior.appAttribute = this.audiencesActionResult.filter(aa => !isNaN(+aa.type_id)).map(aa => ({
        id: aa.id,
        name: aa.name
      }));
      this.resultData.dtl_behavior.filterAppCategory = this.audiencesAction2Result.filter(aa => isNaN(+aa.type_id)).map(aa => ({
        id: aa.id,
        name: aa.name
      }));
      this.resultData.dtl_behavior.filterAppAttribute = this.audiencesAction2Result.filter(aa => !isNaN(+aa.type_id)).map(aa => ({
        id: aa.id,
        name: aa.name
      }));
    } else {
      this.resultData.dtl_behavior.appCategory = [];
      this.resultData.dtl_behavior.appAttribute = [];
      this.resultData.dtl_behavior.filterAppCategory = [];
      this.resultData.dtl_behavior.filterAppAttribute = [];
    }
    this.resultSubject.next(this.resultData);
  }

  audiencesResult = {};

  audiencesShowChange() {
    this.resultData.dtl_attribute.crowdAttribute = this.audiencesShow ? this.audiencesResult : {};
    this.resultSubject.next(this.resultData);
  }


  deviceResult = {};

  deviceShowChange() {
    this.resultData.dtl_devices = this.deviceShow ? this.deviceResult : {};
  }

  resultSubject;
  resultData;

  get areasHaveResult() {
    return (this.areasResult instanceof Array && this.areasResult.length)
      || (this.lbsCityResult instanceof Array && this.lbsCityResult.length)
      || (this.lbsCityMapResult instanceof Array && this.lbsCityMapResult.length);
  }

  /**
   * 订阅获取值
   */
  getResultInit() {
    this.resultSubject = new Subject();
    this.resultSubject.pipe(debounceTime(200)).subscribe(data => {
      this.assignDefaultData(data, getDirectionalData());
      this.onChange(data);
    });

    this.resultData = getDirectionalData();

    this.areasResult$$ = this.areasResult$.subscribe(data => {
      this.areasResult = data;
      if (!data) return;
      if (this.areasHaveResult) this.areasShow = true;
      this.resultData.dtl_address.area = data.map(ar => ({id: ar.id, name: ar.name}));
      this.resultSubject.next(this.resultData);
    });

    this.lbsCityResult$$ = this.lbsCityResult$.subscribe(data => {
      this.lbsCityResult = data;
      if (!data) return;
      if (this.areasHaveResult) this.areasShow = true;
      this.resultData.dtl_address.lbs = this.resultData.dtl_address.lbs.filter(lbs => !lbs.type_id);
      let lbs = data.map(ar => ({id: ar.id, name: ar.name, coords: ar.location_items, type_id: ar.type_id}));
      lbs.forEach(l => {
        if (!this.resultData.dtl_address.lbs.find(lbs => lbs.id == l.id)) {
          this.resultData.dtl_address.lbs.push(l);
        }
      });
      this.resultSubject.next(this.resultData);
    });

    this.lbsCityMapResult$$ = this.lbsCityMapResult$.subscribe(data => {
      this.lbsCityMapResult = data;
      if (!data) return;
      if (this.areasHaveResult) this.areasShow = true;
      this.resultData.dtl_address.lbs = this.resultData.dtl_address.lbs.filter(lbs => lbs.type_id);
      let lbs = data.map(ar => ({id: ar.id_random, name: ar.name, coords: JSON.stringify(ar.coords), type_id: ar.type_id}));
      lbs.forEach(l => {
        if (!this.resultData.dtl_address.lbs.find(lbs => lbs.id == l.id)) {
          this.resultData.dtl_address.lbs.push(l);
        }
      });
      this.resultSubject.next(this.resultData);
    });

    this.audiencesActionResult$$ = this.audiencesActionResult$.subscribe(data => {
      this.audiencesActionResult = data;
      if (!data) return;
      if (data instanceof Array && data.length) this.audiencesActionShow = true;
      this.resultData.dtl_behavior.appCategory = data.filter(aa => isNaN(+aa.type_id)).map(aa => ({id: aa.id, name: aa.name}));
      this.resultData.dtl_behavior.appAttribute = data.filter(aa => !isNaN(+aa.type_id)).map(aa => ({id: aa.id, name: aa.name}));
      this.resultSubject.next(this.resultData);
    });

    this.audiencesAction2Result$$ = this.audiencesAction2Result$.subscribe(data => {
      this.audiencesAction2Result = data;
      if (!data) return;
      if (data instanceof Array && data.length) this.audiencesActionShow = true;
      this.resultData.dtl_behavior.filterAppCategory = data.filter(aa => isNaN(+aa.type_id)).map(aa => ({id: aa.id, name: aa.name}));
      this.resultData.dtl_behavior.filterAppAttribute = data.filter(aa => !isNaN(+aa.type_id)).map(aa => ({id: aa.id, name: aa.name}));
      this.resultSubject.next(this.resultData);
    });

    this.audiencesResult$$ = this.audiencesResult$.subscribe((data: any) => {
      this.audiencesResult = data;
      if (!data) return;
      Object.keys(data).every(key => {
        if (data[key] instanceof Array && data[key].length) {
          this.audiencesShow = true;
          return false;
        }
        return true;
      });
      this.resultData.dtl_attribute.crowdAttribute = data;
      this.resultSubject.next(this.resultData);
    });

    this.deviceResult$$ = this.deviceResult$.subscribe((data: any) => {
      this.deviceResult = data;
      if (!data) return;
      Object.keys(data).every(key => {
        if (data[key] instanceof Array && data[key].length) {
          this.deviceShow = true;
          this.changeDetectorRef.markForCheck();
          return false;
        }
        return true;
      });
      this.resultData.dtl_devices = data;
      this.resultSubject.next(this.resultData);
    });
  }

  /**
   * 关闭
   */
  close() {
    this.deviceShow = false;
    this.audiencesShow = false;
    this.audiencesActionShow = false;
    this.areasShow = false;
  }


  // 地图

  lbsCityType;
  echo = (value) => {
  };   // 回显字段
  toChild(value) {  // 回显事件
    this.echo(value);
  }

  echoFunction($event) {
    this.echo = $event;
  }

  arrList = [];

  pushCoordinate(event) {
    this.store.dispatch(new directionalAction.LbsCityMapPush(event));  //  触发 reducer根据type找到对应要处理的操作  携带数据的动作
    this.changeDetectorRef.markForCheck();
  }

  removeCoordinate(event) {
    this.store.dispatch(new directionalAction.LbsCityMapRemove(event));
    this.changeDetectorRef.markForCheck();
  }

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
    this.result = obj || {};
    this.assignDefaultData(this.result, getDirectionalData());
    this.store.dispatch(new directionalAction.DirectionalSetResult(this.result));
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.getResultDestroy();
    this.close();
  }

  assignDefaultData(target, source) {
    Object.keys(source).forEach(sk => {
      if (typeof target[sk] === 'object' && typeof source[sk] === 'object') {
        this.assignDefaultData(target[sk], source[sk]);
      }
      if (!target[sk]) {
        target[sk] = source[sk];
      }
    });
  }


}
