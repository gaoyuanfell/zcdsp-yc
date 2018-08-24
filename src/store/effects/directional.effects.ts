import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {forkJoin, Observable} from 'rxjs';

import {switchMap} from 'rxjs/operators';
import {DirectionalService} from '../../service/customer/directional.service';
import * as directionalActionUnion from '../actions/directional.action';
import {DirectionalActionTypes} from '../actions/directional.action';

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
            this._directionalService.directionalDevice(),
          ];
          forkJoin(service).subscribe((arr) => {
            let [a, b, c, d, e] = arr;

            let {age, education, sex} = c.result;
            let {browsers, devices_type, mobile_brand, net_type, operators, os} = e.result;

            let recursion = [
              this.recursionChild({children: a.result}),
              this.recursionChild({children: b.result}),

              this.recursionChild({children: age}),
              this.recursionChild({children: education}),
              this.recursionChild({children: sex}),

              this.recursionChild({children: d.result}),

              this.recursionChild({children: browsers}),
              this.recursionChild({children: devices_type}),
              this.recursionChild({children: mobile_brand}),
              this.recursionChild({children: net_type}),
              this.recursionChild({children: operators}),
              this.recursionChild({children: os}),

            ];
            Promise.all(recursion).then(([areas, lbsCity, age, education, sex, audiencesAction, browsers, devices_type, mobile_brand, net_type, operators, os]) => {

              let audiences = {age, education, sex}
              let device = {browsers, devices_type, mobile_brand, net_type, operators, os}

              observer.next(new directionalActionUnion.DirectionalAssign({areas: areas, lbsCity: lbsCity, audiences: audiences, audiencesAction: audiencesAction, device: device}));
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
