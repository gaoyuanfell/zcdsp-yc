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
      state.areasChild1 = action.payload.children;
      return {...state};
    }
    case DirectionalActionTypes.CHECK_AREAS_CHANGE: {
      let value = action.payload;
      recursionChildCheck(value);
      recursionParentCheck(value);
      state.areasResult = recursionResult(state.areas);
      return {...state};
    }
    case DirectionalActionTypes.QUERY_AREAS_BY_NAME: {
      let {number, value} = action.payload;
      let body;
      if (number === 0) {
        body = state.areas;
      } else {
        body = state['areasChild' + number];
      }
      let index = body.findIndex(b => !!~b.name.indexOf(value));
      if (!!~index) {
        let data = body[index];
        body.splice(index, 1);
        body.unshift(data);
      }
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

  /**
   * 判断当前对象的父级中的子集被选中的个数
   * @param data
   */
  function recursionParentCheck(data) {
    let parent = data.parent;
    if (parent) {
      let l = parent.children;
      let length = l.reduce((previousValue, currentValue) => { // 有几个全选
        return previousValue + ((currentValue.checked) ? 1 : 0);
      }, 0);
      let length2 = l.reduce((previousValue, currentValue) => {  // 有几个全选
        return previousValue + ((currentValue.checkState == 2) ? 1 : 0);
      }, 0);
      if (length == l.length) {
        parent.checkState = 1;
        parent.checked = true;
      } else if (length == 0 && length2 == 0) {
        parent.checkState = 0;
        parent.checked = false;
      } else {
        parent.checkState = 2;
        parent.checked = false;
      }
      recursionParentCheck(parent);
    }
  }

  /**
   * 子集全部选中不考虑子集数据
   * @param list
   * @param {any[]} result
   * @param {number} type
   * @returns {any[]}
   */
  function recursionResult(list, result = []) {
    if (list && list.length > 0) {
      list.forEach(data => {
        // 全部选中
        if (data.checked) {
          result.push(data);
        } else {
          let child = data.children;
          if (child && child.length > 0) {
            recursionResult(child, result);
          }
        }
      });
    }
    return result;
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

export const AreasResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.areasResult
);

export const AreasChild1 = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.areasChild1
);
