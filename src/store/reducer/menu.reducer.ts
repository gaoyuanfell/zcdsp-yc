import {MenuState} from '../model/menu.state';
import {MenuActionTypes, MenuActionUnion} from '../actions/menu.action';
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
    case MenuActionTypes.SELECT_ACTIVE_MENU: {
      let path = action.payload;
      path = path.split('?')[0];  // 这边把url后面的问号截取
      state.menuList.every(m => {
        m.active = false;
        return true;
      });
      state.menuList.every(m => {
        if (m.route === path) {
          m.active = true;
          return false;
        }
        if (m.child) {
          m.child.every(c => {
            if (!!~path.indexOf(c.route)) {
              m.active = true;
              return false;
            }
            return true;
          });
        }
        return true;
      });
      return {...state};
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
