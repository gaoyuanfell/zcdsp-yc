import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {panel} from '../../app/animations/panel';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import * as directionalReducer from '../../store/reducer/directional.reducer';
import * as directionalAction from '../../store/actions/directional.action';
import {MenuState} from '../../store/model/menu.state';
import {Observable} from 'rxjs';
import {DirectionalState} from '../../store/model/directional.state';

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
  areasChild1State$: Observable<Array<any>>;

  /**
   * 获取下级数据
   * @param {any} number
   * @param {any} index
   */
  setNextChild({number, index}){
    this.store.dispatch(new directionalAction.AreasNextAreasChild({number, index}))
  }

  /**
   * 全选下级数据
   * @param {any} number
   * @param {any} index
   */
  checkAllChild({number, index}){
    this.store.dispatch(new directionalAction.CheckAreasAllChild({number, index}))
  }


  constructor(private store: Store<AppState>) {
    this.areasState$ = store.pipe(select(directionalReducer.Areas));
    this.areasChild1State$ = store.pipe(select(directionalReducer.AreasChild1));
    this.areasChild1State$.subscribe(data => {
      console.info('ok')
    })
  }

  ngOnInit() {
    this.store.dispatch(new directionalAction.DirectionalInit())
  }

}
