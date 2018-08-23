import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {panel} from '../../app/animations/panel';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import * as directionalReducer from '../../store/reducer/directional.reducer';
import * as directionalAction from '../../store/actions/directional.action';
import {Observable} from 'rxjs';

@Component({
  selector: 'yc-directional',
  templateUrl: './directional.component.html',
  styleUrls: ['./directional.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,  // 数据手动刷新
  preserveWhitespaces: false,
  animations: [
    panel
  ],
})
export class DirectionalComponent implements OnInit {

  areasState$: Observable<Array<any>>;
  areasResult$: Observable<Array<any>>;
  areasChild1State$: Observable<Array<any>>;

  /**
   * 获取下级数据
   */
  setNextChild(value) {
    this.store.dispatch(new directionalAction.AreasNextAreasChild(value));
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

  constructor(private store: Store<AppState>) {
    this.areasState$ = store.pipe(select(directionalReducer.Areas));
    this.areasResult$ = store.pipe(select(directionalReducer.AreasResult));
    this.areasChild1State$ = store.pipe(select(directionalReducer.AreasChild1));

  }

  ngOnInit() {
    this.store.dispatch(new directionalAction.DirectionalInit());
  }

}
