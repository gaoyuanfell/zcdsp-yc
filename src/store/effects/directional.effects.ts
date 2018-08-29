import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {forkJoin, Observable} from 'rxjs';

import {switchMap} from 'rxjs/operators';
import {DirectionalService} from '../../service/customer/directional.service';
import * as directionalActionUnion from '../actions/directional.action';
import {DirectionalActionTypes} from '../actions/directional.action';
import {AudiencesActionAssign} from '../actions/directional.action';

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
            // this._directionalService.directionalLbs(),
            this._directionalService.directionalAudiences(),
            // this._directionalService.directionalAudiencesAction(),
            this._directionalService.directionalDevice(),
          ];
          forkJoin(service).subscribe((arr) => {
            let [a, c, e] = arr;

            let {age, education, sex} = c.result;
            let {browsers, devices_type, mobile_brand, net_type, operators, os} = e.result;

            let recursion = [
              this.recursionChild({children: a.result}),

              this.recursionChild({children: age, name: '年龄'}),
              this.recursionChild({children: education, name: '学历'}),
              this.recursionChild({children: sex, name: '性别'}),

              this.recursionChild({children: browsers, name: '浏览器'}),
              this.recursionChild({children: devices_type, name: '设备类型'}),
              this.recursionChild({children: mobile_brand, name: '设备品牌'}),
              this.recursionChild({children: net_type, name: '联网方式'}),
              this.recursionChild({children: operators, name: '运营商'}),
              this.recursionChild({children: os, name: '操作系统'}),

            ];

            Promise.all(recursion).then(([areas, age, education, sex, browsers, devices_type, mobile_brand, net_type, operators, os]) => {

              let audiences = {age, education, sex};
              let device = {browsers, devices_type, mobile_brand, net_type, operators, os};

              let audiencesList = Object.entries(audiences).map(([key, value]) => ({key, value}));
              let deviceList = Object.entries(device).map(([key, value]) => ({key, value}));

              observer.next(new directionalActionUnion.DirectionalAssign({areas: areas, audiences: audiencesList, device: deviceList}));
            });
          });
        });
      })
    );
  };

  @Effect()
  initLbsCity$ = (): Observable<Action> => {
    return this.actions$.pipe(
      ofType<directionalActionUnion.LbsCityInit>(DirectionalActionTypes.LBS_CITY_INIT),
      switchMap(() => {
        return new Observable(observer => {
          let service = [
            this._directionalService.directionalLbs(),
          ];
          forkJoin(service).subscribe((arr) => {
            let [b] = arr;
            let recursion = [
              this.recursionChild({children: b.result}),
            ];
            Promise.all(recursion).then(([lbsCity]) => {
              observer.next(new directionalActionUnion.LbsCityAssign(lbsCity));
            });
          });
        });
      })
    );
  };

  @Effect()
  initAudiencesAction$ = (): Observable<Action> => {
    return this.actions$.pipe(
      ofType<directionalActionUnion.AudiencesActionInit>(DirectionalActionTypes.AUDIENCES_ACTION_INIT),
      switchMap(() => {
        return new Observable(observer => {
          let service = [
            this._directionalService.directionalAudiencesAction(),
          ];
          forkJoin(service).subscribe((arr) => {
            let [b] = arr;
            let recursion = [
              this.recursionChild({children: b.result}),
            ];
            Promise.all(recursion).then(([audiencesAction]) => {
              observer.next(new directionalActionUnion.AudiencesActionAssign(audiencesAction));
            });
          });
        });
      })
    );
  };

  @Effect()
  initAudiencesAction2$ = (): Observable<Action> => {
    return this.actions$.pipe(
      ofType<directionalActionUnion.AudiencesActionInit>(DirectionalActionTypes.AUDIENCES_ACTION_INIT),
      switchMap(() => {
        return new Observable(observer => {
          let service = [
            this._directionalService.directionalAudiencesAction(),
          ];
          forkJoin(service).subscribe((arr) => {
            let [b] = arr;
            let recursion = [
              this.recursionChild({children: b.result}),
            ];
            Promise.all(recursion).then(([audiencesAction]) => {
              observer.next(new directionalActionUnion.AudiencesActionAssign2(audiencesAction));
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
      const blob = new Blob([fun], {type: 'application/javascript'});
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      worker.postMessage(target);
      worker.onmessage = (e) => {
        resolve(e.data);
      };
    });
  }
}
