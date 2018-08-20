import {MenuState} from '../model/menu.state';
import {MenuActionUnion, MenuActionTypes} from '../actions/menu.action';
import {createFeatureSelector, createSelector} from '@ngrx/store';

const initState: MenuState = {
  menuList: []
};

export function menuReducer(state: MenuState = initState, action: MenuActionUnion) {
  switch (action.type) {
    case MenuActionTypes.ASSIGN_MENU: {
      state.menuList = action.payload;
      return state;
    }
    case MenuActionTypes.ASSIGN_CHILD_LIST: {
      state.childList = action.payload;
      return state;
    }
    case MenuActionTypes.ASSIGN_CHILD_LIST_BY_PATH: {
      let path = action.payload;
      let r = path.match(/^\/([a-zA-Z]+)\//i);
      if (!r) return state;
      state.menuList.every(sm => {
        if (~sm.navigation_url.indexOf(r[1])) {
          state.childList = sm.child;
          return false;
        }
        return true;
      });
      return state;
    }
    case MenuActionTypes.SELECT_MENU: {
      state.menu = state.menuList.find(ml => ml.id == action.payload)
      return state;
    }
    default: {
      return state;
    }
  }
}

///////////////// selector /////////////////

export const getMenuState = createFeatureSelector<MenuState>('menu');

export const MenuList = createSelector(
  getMenuState,
  (state: MenuState) => state.menuList
);

export const ChildList = createSelector(
  getMenuState,
  (state: MenuState) => state.childList
);
