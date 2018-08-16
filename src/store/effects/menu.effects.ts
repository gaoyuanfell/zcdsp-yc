import {Injectable} from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import {Action} from '@ngrx/store';
import {asyncScheduler, Observable} from 'rxjs';
import {AssignMenu, InitMenu, MenuActionTypes} from '../actions/menu.action';
import {switchMap} from 'rxjs/operators';

@Injectable()
export class MenuEffects {
  @Effect()
  updateMenu$ = (): Observable<Action> => {
    return this.actions$.pipe(
      ofType<InitMenu>(MenuActionTypes.INIT_MENU),
      switchMap(() => {
        return new Observable((observer) => {
          setTimeout(() => {
            console.info('ok');
            observer.next(new AssignMenu([{a: 1}]));
          }, 2000);
        });
      })
    );
  };

  constructor(private actions$: Actions) {

  }
}
