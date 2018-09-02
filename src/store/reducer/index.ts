import {menuReducer} from './menu.reducer';
import {ActionReducer, MetaReducer} from '@ngrx/store';
import {environment} from '../../environments/environment';
import {AppState} from '../model';
import {directionalReducer} from './directional.reducer';

export const reducers = {
  menu: menuReducer,
  directional: directionalReducer,
};

export function logger(reducer: ActionReducer<AppState>): ActionReducer<AppState> {
  return function (state: AppState, action: any): AppState {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}

export const metaReducers: MetaReducer<AppState>[] = !environment.production ? [logger] : [];
