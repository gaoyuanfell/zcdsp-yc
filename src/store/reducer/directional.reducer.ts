import {createFeatureSelector, createSelector} from '@ngrx/store';
import {AudiencesActionState, DirectionalState, LbsCityState} from '../model/directional.state';
import {DirectionalActionTypes, DirectionalActionUnion} from '../actions/directional.action';
import {recursionChildCheck, recursionParentCheck, recursionResult, recursionResult2} from '../../service/util';

const initState: DirectionalState = {
  areasChildList: []
};

export function directionalReducer(state: DirectionalState = initState, action: DirectionalActionUnion) {
  switch (action.type) {
    case DirectionalActionTypes.DIRECTIONAL_ASSIGN: {
      console.info(action.payload);
      state.areas = action.payload.areas;
      state.audiences = action.payload.audiences;
      state.device = action.payload.device;
      state.areasChildList.push(state.areas.children);
      nextAreasChild();
      return {...state};
    }
    //// AREAS
    case DirectionalActionTypes.NEXT_AREAS_CHILD: {
      let {value, index} = action.payload;
      nextAreasChild(value, index);
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
      console.info(state.areasResult)
      return {...state};
    }
    case DirectionalActionTypes.QUERY_AREAS_BY_NAME: {
      let {target, value} = action.payload;
      let index = target.findIndex(b => !!~b.name.indexOf(value));
      if (!!~index) {
        let data = target[index];
        target.splice(index, 1);
        target.unshift(data);
      }
      return {...state};
    }
    //// AUDIENCES
    case DirectionalActionTypes.CHECK_AUDIENCES_CHANGE: {
      let value = action.payload;

      recursionChildCheck(value);
      recursionParentCheck(value);

      let array = [];
      state.audiences.forEach(au => {
        array.push(...recursionResult2(au.value.children));
      });

      state.audiencesResult = array;

      return {...state};
    }
    case DirectionalActionTypes.REMOVE_ALL_AUDIENCES:{
      state.audiences.forEach(au => {
        au.value.checked = false;
        recursionChildCheck(au.value);
        recursionParentCheck(au.value);
      });
      state.audiencesResult = [];
      return {...state};
    }
    case DirectionalActionTypes.CHECK_DEVICE_CHANGE:{
      let value = action.payload;

      recursionChildCheck(value);
      recursionParentCheck(value);

      let array = [];
      state.device.forEach(au => {
        array.push(...recursionResult2(au.value.children));
      });

      state.deviceResult = array;

      return {...state};
    }
    case DirectionalActionTypes.REMOVE_ALL_DEVICE:{
      state.device.forEach(au => {
        au.value.checked = false;
        recursionChildCheck(au.value);
        recursionParentCheck(au.value);
      });
      state.deviceResult = [];
      return {...state};
    }
    default: {
      return state;
    }
  }

  function nextAreasChild(target = state.areas.children[0], index = 0) {
    state.areasChildList.length = index + 1;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      state.areasChildList.push(target.children);
      target = target.children[0];
    }
  }
}

const initState2: LbsCityState = {
  lbsCityList: []
};

export function lbsCityReducer(state: LbsCityState = initState2, action: DirectionalActionUnion) {
  switch (action.type) {
    case DirectionalActionTypes.LBS_CITY_ASSIGN: {
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
      if (!target.children[0]) break;
      state.lbsCityList.push(target.children);
      target = target.children[0];
    }
  }
}

const initState3: AudiencesActionState = {
  audiencesActionList: [],
  audiencesAction2List: [],
};

export function audiencesActionReducer(state: AudiencesActionState = initState3, action: DirectionalActionUnion) {
  switch (action.type) {
    case DirectionalActionTypes.AUDIENCES_ACTION_ASSIGN: {
      state.audiencesAction = action.payload;
      state.audiencesActionList.push(state.audiencesAction.children);
      nextAudiencesActionChild();
      return state;
    }
    case DirectionalActionTypes.AUDIENCES_ACTION_ASSIGN2: {
      state.audiencesAction2 = action.payload;
      state.audiencesAction2List.push(state.audiencesAction2.children);
      nextAudiencesActionChild2();
      return state;
    }
    case DirectionalActionTypes.AUDIENCES_ACTION_NEXT_CHILD: {
      let {value, index} = action.payload;
      console.time('1');
      nextAudiencesActionChild(value, index);
      console.timeEnd('1');
      return {...state};
    }
    case DirectionalActionTypes.AUDIENCES_ACTION_NEXT_CHILD2: {
      let {value, index} = action.payload;
      console.time('1');
      nextAudiencesActionChild2(value, index);
      console.timeEnd('1');
      return {...state};
    }
    case DirectionalActionTypes.CHECK_AUDIENCES_ACTION_CHANGE: {
      let value = action.payload;
      if (typeof value == 'boolean') {
        state.audiencesAction.checked = value;
        value = state.audiencesAction;
      }
      recursionChildCheck(value);
      recursionParentCheck(value);
      state.audiencesActionResult = recursionResult(state.audiencesAction.children);
      return {...state};
    }
    case DirectionalActionTypes.CHECK_AUDIENCES_ACTION_CHANGE2: {
      let value = action.payload;
      if (typeof value == 'boolean') {
        state.audiencesAction2.checked = value;
        value = state.audiencesAction2;
      }
      recursionChildCheck(value);
      recursionParentCheck(value);
      state.audiencesAction2Result = recursionResult(state.audiencesAction2.children);
      return {...state};
    }
    case DirectionalActionTypes.QUERY_AUDIENCES_ACTION_BY_NAME: {
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

  function nextAudiencesActionChild(target = state.audiencesAction.children[0], index = 0) {
    state.audiencesActionList.length = index + 1;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      state.audiencesActionList.push(target.children);
      target = target.children[0];
    }
  }

  function nextAudiencesActionChild2(target = state.audiencesAction2.children[0], index = 0) {
    state.audiencesAction2List.length = index + 1;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      state.audiencesAction2List.push(target.children);
      target = target.children[0];
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

export const AreasChildList = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.areasChildList
);

// ------------------ Audiences
export const Audiences = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiences
);

export const AudiencesResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesResult
);

// ------------------- Device

export const Device = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.device
);

export const DeviceResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.deviceResult
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

//---------------- AudiencesAction
export const getAudiencesActionState = createFeatureSelector<AudiencesActionState>('audiencesAction');

export const AudiencesAction = createSelector(
  getAudiencesActionState,
  (state: AudiencesActionState) => state.audiencesAction
);

export const AudiencesActionList = createSelector(
  getAudiencesActionState,
  (state: AudiencesActionState) => state.audiencesActionList
);

export const AudiencesActionResult = createSelector(
  getAudiencesActionState,
  (state: AudiencesActionState) => state.audiencesActionResult
);

export const AudiencesAction2 = createSelector(
  getAudiencesActionState,
  (state: AudiencesActionState) => state.audiencesAction2
);

export const AudiencesAction2List = createSelector(
  getAudiencesActionState,
  (state: AudiencesActionState) => state.audiencesAction2List
);

export const AudiencesAction2Result = createSelector(
  getAudiencesActionState,
  (state: AudiencesActionState) => state.audiencesAction2Result
);
