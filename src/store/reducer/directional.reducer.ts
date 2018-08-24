import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DirectionalState, LbsCityState} from '../model/directional.state';
import {DirectionalActionTypes, DirectionalActionUnion} from '../actions/directional.action';
import {recursionChildCheck, recursionParentCheck, recursionResult, recursionResult2} from '../util';

const initState: DirectionalState = {};

export function directionalReducer(state: DirectionalState = initState, action: DirectionalActionUnion) {
  switch (action.type) {
    case DirectionalActionTypes.DIRECTIONAL_ASSIGN: {
      state = action.payload;
      nextAreasChild();
      // nextLbsCityChild();
      return state;
    }
    //// AREAS
    case DirectionalActionTypes.NEXT_AREAS_CHILD: {
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
    //// LBS
    /*case DirectionalActionTypes.LBS_CITY_NEXT_CHILD: {
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
    }*/
    //// AUDIENCES
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

  function nextAreasChild(index = 0, number = 1) {
    switch (number) {
      case 1: {
        state['areasChild' + number] = state.areas.children[index].children;
      }
    }
  }
}

const initState2: LbsCityState = {
  lbsCityList: []
};

export function lbsCityReducer(state: LbsCityState = initState2, action: DirectionalActionUnion) {
  switch (action.type) {
    case DirectionalActionTypes.LBS_CITY_ASSIGN:{
      state.lbsCity = action.payload;
      state.lbsCityList.push(state.lbsCity.children);
      nextLbsCityChild();
      return state;
    }
    case DirectionalActionTypes.LBS_CITY_NEXT_CHILD: {
      let {value, index} = action.payload;
      nextLbsCityChild(value, index);
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
      let {target, value} = action.payload;
      let index = target.findIndex(b => !!~b.name.indexOf(value));
      if (!!~index) {
        let data = target[index];
        target.splice(index, 1);
        target.unshift(data);
      }
      return {...state};
    }
    default: {
      return state;
    }
  }

  function nextLbsCityChild(target = state.lbsCity.children[0], index = 0) {
    state.lbsCityList.length = index + 1;
    while (target.children && target.children.length) {
      if(!target.children[0]) break;
      state.lbsCityList.push(target.children);
      target = target.children[0]
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

export const Audiences = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiences
);

export const AudiencesResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesResult
);

//---------------- LBS
export const getLbsCityState = createFeatureSelector<LbsCityState>('lbsCity');

export const LbsCity = createSelector(
  getLbsCityState,
  (state: LbsCityState) => state.lbsCity
);

export const LbsCityList = createSelector(
  getLbsCityState,
  (state: LbsCityState) => state.lbsCityList
);

export const LbsCityResult = createSelector(
  getLbsCityState,
  (state: LbsCityState) => state.lbsCityResult
);

export const LbsCityViewResult = createSelector(
  getLbsCityState,
  (state: LbsCityState) => state.lbsCityViewResult
);
