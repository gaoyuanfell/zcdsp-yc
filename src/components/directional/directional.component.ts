import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {panel} from '../../app/animations/panel';
import {select, Store} from '@ngrx/store';
import {AppState} from '../../store/model';
import * as directionalReducer from '../../store/reducer/directional.reducer';
import * as directionalAction from '../../store/actions/directional.action';
import {MenuState} from '../../store/model/menu.state';
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

  constructor(private store: Store<AppState>) {
    this.areasState$ = store.pipe(select(directionalReducer.Areas));
    this.areasState$.subscribe(data => {
      console.info(data)
    })
  }

  ngOnInit() {
    this.store.dispatch(new directionalAction.DirectionalInit())
  }

}
