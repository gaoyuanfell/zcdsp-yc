import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { forkJoin, Observable } from 'rxjs';

import { switchMap } from 'rxjs/operators';
import { DirectionalService } from '../../service/customer/directional.service';
import * as directionalActionUnion from '../actions/directional.action';
import { DirectionalActionTypes } from '../actions/directional.action';

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
              f] = arr;

            let { age, education, sex } = c.result;
            let { browsers, devicesType, brand, netType, operators, mobileOS } = f.result;

            let lbs_scenes = b.result.lbs_scenes
            let lbs_location = b.result.lbs_location

            let recursion = [
              this.recursionChild({ children: a.result }),
              this.recursionChild({ children: lbs_location }),
              this.recursionChild({ children: age, name: '年龄' }),
              this.recursionChild({ children: education, name: '学历' }),
              this.recursionChild({ children: sex, name: '性别' }),
              this.recursionChild({ children: d.result }),
              this.recursionChild({ children: e.result }),
              this.recursionChild({ children: browsers, name: '浏览器' }),
              this.recursionChild({ children: devicesType, name: '设备类型' }),
              this.recursionChild({ children: brand, name: '设备品牌' }),
              this.recursionChild({ children: netType, name: '联网方式' }),
              this.recursionChild({ children: operators, name: '运营商' }),
              this.recursionChild({ children: mobileOS, name: '操作系统' }),
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

  recursionChild(target) {
    return new Promise((resolve, reject) => {
      let fun = `
      onmessage = function (e) {
          function recursionChild(target) {
            if(target instanceof Array && target.length > 0){
              target.forEach(data => {
                recursionChild(data);
              });
            }else{
              let list = target.children;
              if (list && list.length > 0) {
                list.forEach(data => {
                  data.parent = target;
                  recursionChild(data);
                });
              }
            }
          }
          recursionChild(e.data)
          postMessage(e.data);
      }
    `;
      const blob = new Blob([fun], { type: 'application/javascript' });
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      worker.postMessage(target);
      worker.onmessage = (e) => {
        resolve(e.data);
      };
    });
  }
}
