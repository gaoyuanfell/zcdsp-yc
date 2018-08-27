import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {panel} from '../../app/animations/panel';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import * as directionalReducer from '../../store/reducer/directional.reducer';
import * as directionalAction from '../../store/actions/directional.action';
import {Observable} from 'rxjs';
import {Audiences, Directional} from '../../store/model/directional.state';

@Component({
  selector: 'yc-directional',
  templateUrl: './directional.component.html',
  styleUrls: ['./directional.component.less'],
  // changeDetection: ChangeDetectionStrategy.OnPush,  // 数据手动刷新
  preserveWhitespaces: true,
  animations: [
    panel
  ],
})
export class DirectionalComponent implements OnInit, AfterViewInit {

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


  // --------------------------- Areas

  /**
   * 获取下级数据
   */
  setAreasNextChild({value,index}) {
    this.store.dispatch(new directionalAction.AreasNextChild({value,index}));
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

  checkLbsCityChange(value) {
    this.store.dispatch(new directionalAction.CheckLbsCityChange(value));
  }

  queryLbsCityByName({target, value}) {
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryLbsCityByName({target, value}));
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

  // -------------------------- Audiences

  checkAudiencesChange(value){
    this.store.dispatch(new directionalAction.CheckAudiencesChange(value));
  }

  removeAllAudiences(){
    this.store.dispatch(new directionalAction.RemoveAllAudiences());
  }

  // ----------------------- Device

  checkDeviceChange(value){
    this.store.dispatch(new directionalAction.CheckDeviceChange(value));
  }

  removeAllDevice(){
    this.store.dispatch(new directionalAction.RemoveAllDevice());
  }

  constructor(private store: Store<AppState>) {

    this.store.dispatch(new directionalAction.DirectionalInit());
    this.store.dispatch(new directionalAction.LbsCityInit());
    this.store.dispatch(new directionalAction.AudiencesActionInit());

    this.areasState$ = store.pipe(select(directionalReducer.Areas));
    this.areasResult$ = store.pipe(select(directionalReducer.AreasResult));
    this.areasChildList$ = store.pipe(select(directionalReducer.AreasChildList));

    this.lbsCityState$ = store.pipe(select(directionalReducer.LbsCity));
    this.lbsCityList$ = store.pipe(select(directionalReducer.LbsCityList));
    this.lbsCityResult$ = store.pipe(select(directionalReducer.LbsCityResult));
    this.lbsCityViewResult$ = store.pipe(select(directionalReducer.LbsCityViewResult));

    this.audiences$ = store.pipe(select(directionalReducer.Audiences));
    this.audiencesResult$ = store.pipe(select(directionalReducer.AudiencesResult));

    this.device$ = store.pipe(select(directionalReducer.Device));
    this.deviceResult$ = store.pipe(select(directionalReducer.DeviceResult));

    this.audiencesAction$ = store.pipe(select(directionalReducer.AudiencesAction));
    this.audiencesActionList$ = store.pipe(select(directionalReducer.AudiencesActionList));
    this.audiencesActionResult$ = store.pipe(select(directionalReducer.AudiencesActionResult));

  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    console.info('ngAfterViewInit');

  }

}
