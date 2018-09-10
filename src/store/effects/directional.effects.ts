import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { forkJoin, Observable } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { DirectionalService } from '../../service/customer/directional.service';
import * as directionalActionUnion from '../actions/directional.action';
import { DirectionalActionTypes } from '../actions/directional.action';
import {recursionChild} from '../../service/util';

@Injectable()
export class DirectionalEffects {
  @Effect()
  initDirectional$ = (): Observable<Action> => {
    return this.actions$.pipe(
      ofType<directionalActionUnion.DirectionalInit>(DirectionalActionTypes.DIRECTIONAL_INIT),
      switchMap(() => {
        return new Observable(observer => {
          let service = [
            this._directionalService.directionalCity(),
            this._directionalService.directionalLbs(),
            this._directionalService.directionalAudiences(),
            this._directionalService.directionalAudiencesAction(),
            this._directionalService.directionalAudiencesAction(),
            this._directionalService.directionalDevice(),
          ];
          forkJoin(service).subscribe((arr) => {
            let [
              a,
              b,
              c,
              d,
              e,
              f,
            ] = arr;

            let { age, education, sex } = c.result;
            let { browsers, devicesType, brand, netType, operators, mobileOS } = f.result;

            let lbs_scenes = b.result.lbs_scenes
            let lbs_location = b.result.lbs_location

            let recursion = [
              recursionChild({ children: a.result }),
              recursionChild({ children: lbs_location }),
              recursionChild({ children: age, name: '年龄' }),
              recursionChild({ children: education, name: '学历' }),
              recursionChild({ children: sex, name: '性别' }),
              recursionChild({ children: d.result }),
              recursionChild({ children: e.result }),
              recursionChild({ children: browsers, name: '浏览器' }),
              recursionChild({ children: devicesType, name: '设备类型' }),
              recursionChild({ children: brand, name: '设备品牌' }),
              recursionChild({ children: netType, name: '联网方式' }),
              recursionChild({ children: operators, name: '运营商' }),
              recursionChild({ children: mobileOS, name: '操作系统' }),
            ];

            Promise.all(recursion).then(([
              areas,
              lbsCity,
              age, education, sex,
              audiencesAction,
              audiencesAction2,
              browsers, devicesType, brand, netType, operators, mobileOS]) => {

              let audiences = { age, education, sex };
              let device = { browsers, devicesType, brand, netType, operators, mobileOS };
              let audiencesList = Object.entries(audiences).map(([key, value]) => ({ key, value }));
              let deviceList = Object.entries(device).map(([key, value]) => ({ key, value }));
              observer.next(new directionalActionUnion.DirectionalAssign({
                areas: areas,
                lbsCity: lbsCity,
                lbsScenes: lbs_scenes,
                audiences: audiencesList,
                audiencesAction: audiencesAction,
                audiencesAction2: audiencesAction2,
                device: deviceList
              }));
            });
          });
        });
      })
    );
  };
  
  constructor(private actions$: Actions,
    private _directionalService: DirectionalService) {
  }
}
