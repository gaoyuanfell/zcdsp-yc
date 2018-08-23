import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DirectionalState} from '../model/directional.state';
import {DirectionalActionTypes, DirectionalActionUnion} from '../actions/directional.action';


const initState: DirectionalState = {};

export function directionalReducer(state: DirectionalState = initState, action: DirectionalActionUnion) {
  switch (action.type) {
    case DirectionalActionTypes.DIRECTIONAL_ASSIGN: {
      state = action.payload;
      nextChild();
      return state;
    }
    case DirectionalActionTypes.AREAS_NEXT_AREAS_CHILD: {
      let {index, number} = action.payload;
      nextChild(index, number);
      return {...state};
    }
    case DirectionalActionTypes.CHECK_AREAS_ALL_CHILD: {
      let {index, number} = action.payload;
      recursionChildCheck(state.areas[index])
      return {...state};
    }
    default: {
      return state;
    }
  }

  /**
   * 同步子集和父级的状态
   * 递归
   * @param target
   */
  function recursionChildCheck(target) {
    let list = target.children;
    if (list && list.length > 0) {
      if (target.checked) {
        target.checkedNum = list.length;
      } else {
        target.checkedNum = 0;
      }
      list.forEach(data => {
        let checked = data.parent.checked;
        data.checked = checked;
        if (checked) {
          data.checkState = 1;
          data.checked = true;
        } else {
          data.checkState = 0;
          data.checked = false;
        }
        recursionChildCheck(data);
      });
    }
  }


  function nextChild(index = 0, number = 1) {
    switch (number) {
      case 1: {
        state['areasChild' + number] = state.areas[index].children;
      }
    }
  }
}

///////////////// selector /////////////////

export const getDirectionalState = createFeatureSelector<DirectionalState>('directional');

export const Areas = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.areas
);

export const AreasChild1 = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.areasChild1
);
