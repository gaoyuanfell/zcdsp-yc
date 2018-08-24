import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DirectionalState} from '../model/directional.state';
import {DirectionalActionTypes, DirectionalActionUnion} from '../actions/directional.action';

const initState: DirectionalState = {};

export function directionalReducer(state: DirectionalState = initState, action: DirectionalActionUnion) {
  switch (action.type) {
    case DirectionalActionTypes.DIRECTIONAL_ASSIGN: {
      state = action.payload;
      nextAreasChild();
      nextLbsCityChild();
      return state;
    }
    case DirectionalActionTypes.NEXT_AREAS_CHILD: {
      console.info('ok')
      state.areasChild1 = action.payload.children;
      return {...state};
    }
    case DirectionalActionTypes.CHECK_AREAS_CHANGE: {
      let value = action.payload;
      if (typeof value == 'boolean') {
        state.areas.checked = value;
        value = state.areas;
      }
      recursionChildCheck(value);
      recursionParentCheck(value);
      state.areasResult = recursionResult(state.areas.children);
      return {...state};
    }
    case DirectionalActionTypes.QUERY_AREAS_BY_NAME: {
      let {number, value} = action.payload;
      let body;
      if (number === 0) {
        body = state.areas.children;
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
    case DirectionalActionTypes.LBS_CITY_NEXT_CHILD: {
      let {number, index} = action.payload;
      nextLbsCityChild(index, number);
      return {...state};
    }
    case DirectionalActionTypes.CHECK_LBS_CITY_CHANGE: {
      let value = action.payload;
      if (typeof value == 'boolean') {
        state.lbsCity.checked = value;
        value = state.lbsCity;
      }
      recursionChildCheck(value);
      recursionParentCheck(value);
      state.lbsCityViewResult = recursionResult(state.lbsCity.children);
      state.lbsCityResult = recursionResult2(state.lbsCity.children);
      return {...state};
    }
    case DirectionalActionTypes.QUERY_LBS_CITY_BY_NAME: {
      let {number, value} = action.payload;
      let body;
      if (number === 0) {
        body = state.lbsCity.children;
      } else {
        body = state['lbsCityChild' + number];
      }
      let index = body.findIndex(b => !!~b.name.indexOf(value));
      if (!!~index) {
        let data = body[index];
        body.splice(index, 1);
        body.unshift(data);
      }
      return {...state};
    }
    case DirectionalActionTypes.CHECK_AUDIENCES_CHANGE: {
      let value = action.payload;

      recursionChildCheck(value);
      recursionParentCheck(value);

      let age = recursionResult2(state.audiences.age.children);
      let education = recursionResult2(state.audiences.education.children);
      let sex = recursionResult2(state.audiences.sex.children);

      state.audiencesResult = [...age, ...education, ...sex];

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

  /**
   * 只获取最后一层的值
   * @param list
   * @param {any[]} result
   * @param {number} type
   */
  function recursionResult2(list, result = []) {
    if (list && list.length > 0) {
      list.forEach(data => {
        let child = data.children;
        if (child && child.length > 0) {
          recursionResult2(child, result);
        } else if (data.checked) {
          result.push(data);
        }
      });
    }
    return result;
  }

  function nextAreasChild(index = 0, number = 1) {
    switch (number) {
      case 1: {
        state['areasChild' + number] = state.areas.children[index].children;
      }
    }
  }

  function nextLbsCityChild(index = 0, number = 0) {
    let body = state.lbsCity.children;
    switch (number) {
      case 0: {
        ++number;
        state['lbsCityChild' + number] = body[index].children;
        index = 0;
      }
      case 1: {
        body = state['lbsCityChild' + number];
        ++number;
        if (!body || !body.length) {
          state['lbsCityChild' + number] = null;
        } else {
          state['lbsCityChild' + number] = body[index].children;
        }
        index = 0;
      }
      case 2: {
        body = state['lbsCityChild' + number];
        ++number;
        if (!body || !body.length) {
          state['lbsCityChild' + number] = null;
        } else {
          state['lbsCityChild' + number] = body[index].children;
        }
        index = 0;
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

export const LbsCity = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCity
);

export const LbsCityResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCityResult
);

export const LbsCityViewResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCityViewResult
);

export const LbsCityChild1 = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCityChild1
);

export const LbsCityChild2 = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCityChild2
);

export const LbsCityChild3 = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCityChild3
);

export const Audiences = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiences
);

export const AudiencesResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesResult
);

