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
  preserveWhitespaces: false,
  animations: [
    panel
  ],
})
export class DirectionalComponent implements OnInit, AfterViewInit {

  areasState$: Observable<Directional>;
  areasResult$: Observable<Array<any>>;
  areasChild1State$: Observable<Array<any>>;

  lbsCityState$: Observable<Directional>;
  lbsCityList$: Observable<Array<any>>;
  lbsCityResult$: Observable<Array<any>>;
  lbsCityViewResult$: Observable<Array<any>>;

  audiences$: Observable<Audiences>;
  audiences: Audiences;
  audiencesResult$: Observable<Array<any>>;

  // --------------------------- Areas

  /**
   * 获取下级数据
   */
  setAreasNextChild(value) {
    this.store.dispatch(new directionalAction.AreasNextChild(value));
  }

  /**
   * 全选下级数据
   */
  checkAreasChange(value) {
    this.store.dispatch(new directionalAction.CheckAreasChange(value));
  }

  queryAreasByName({number, value}) {
    if (!value) return;
    this.store.dispatch(new directionalAction.QueryAreasByName({number, value}));
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

  // -------------------------------

  checkAudiencesChange(value){
    this.store.dispatch(new directionalAction.CheckAudiencesChange(value));
  }

  constructor(private store: Store<AppState>) {

    this.store.dispatch(new directionalAction.DirectionalInit());
    this.store.dispatch(new directionalAction.LbsCityInit());

    this.areasState$ = store.pipe(select(directionalReducer.Areas));
    this.areasResult$ = store.pipe(select(directionalReducer.AreasResult));
    this.areasChild1State$ = store.pipe(select(directionalReducer.AreasChild1));

    this.lbsCityState$ = store.pipe(select(directionalReducer.LbsCity));
    this.lbsCityList$ = store.pipe(select(directionalReducer.LbsCityList));


    this.lbsCityResult$ = store.pipe(select(directionalReducer.LbsCityResult));
    this.lbsCityViewResult$ = store.pipe(select(directionalReducer.LbsCityViewResult));

    this.audiences$ = store.pipe(select(directionalReducer.Audiences));
    this.audiencesResult$ = store.pipe(select(directionalReducer.AudiencesResult));
    this.audiences$.subscribe(data => {
      this.audiences = data;
    })
  }

  ngOnInit() {

  }

  ngAfterViewInit(): void {
    console.info('ngAfterViewInit');

  }

}
