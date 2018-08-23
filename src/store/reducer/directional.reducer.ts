import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DirectionalState} from '../model/directional.state';
import {DirectionalActionTypes, DirectionalActionUnion} from '../actions/directional.action';
import {getMenuState} from './menu.reducer';
import {MenuState} from '../model/menu.state';


const initState: DirectionalState = {

};

export function directionalReducer(state: DirectionalState = initState, action: DirectionalActionUnion) {
  switch (action.type) {
    case DirectionalActionTypes.DIRECTIONAL_ASSIGN: {
      state = action.payload;
      return state;
    }
    default: {
      return state;
    }
  }
}

///////////////// selector /////////////////

export const getDirectionalState = createFeatureSelector<DirectionalState>('directional');

export const Areas = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.areas
);
