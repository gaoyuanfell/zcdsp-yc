import {createFeatureSelector, createSelector} from '@ngrx/store';
import {DirectionalState} from '../model/directional.state';
import {DirectionalActionTypes, DirectionalActionUnion} from '../actions/directional.action';
import {
  recursionChildCheck,
  recursionFilter,
  recursionFilter2,
  recursionParentCheck,
  recursionResult,
  recursionResult2
} from '../../service/util';

const initState: DirectionalState = {
  areasChildList: [],
  lbsCityList: [],
  audiencesActionList: [],
  audiencesAction2List: [],
  lbsCityMapResult: [],
  audiencesAppResult: [],
};

export function directionalReducer(state: DirectionalState = initState, action: DirectionalActionUnion) {
  switch (action.type) {
    case DirectionalActionTypes.DIRECTIONAL_ASSIGN: {
      state.areas = action.payload.areas;
      state.audiences = action.payload.audiences;
      state.device = action.payload.device;
      state.areasChildList.push(state.areas.children);
      nextAreasChild();

      let {lbsCity, lbsScenes} = action.payload;
      state.lbsCity = lbsCity;
      state.lbsScenes = lbsScenes;
      state.lbsCityList.push(state.lbsCity.children);
      nextLbsCityChild();

      let {audiencesAction, audiencesAction2} = action.payload;
      state.audiencesAction = audiencesAction;
      state.audiencesActionList.push(state.audiencesAction.children);
      nextAudiencesActionChild();

      state.audiencesAction2 = audiencesAction2;
      state.audiencesAction2List.push(state.audiencesAction2.children);
      nextAudiencesActionChild2();

      if (state.result) {
        setResult();
        state.result = undefined;
      }

      return {...state};
    }
    //// -----------------AREAS-------------------- ////
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
      state.areasResult = recursionResult(state.areas.children); // .map(ar => ({id: ar.id, name: ar.name}))
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
      state.audiencesViewResult = array;

      let body: any = {};
      state.audiences.map(au => {
        return {
          key: au.key,
          value: recursionResult2(au.value.children).map(r => r.value)
        };
      }).forEach(({key, value}) => {
        body[key] = value;
      });
      state.audiencesResult = body;
      return {...state};
    }
    case DirectionalActionTypes.REMOVE_ALL_AUDIENCES: {
      state.audiences.forEach(au => {
        au.value.checked = false;
        au.value.checkState = 0;
        recursionChildCheck(au.value);
        recursionParentCheck(au.value);
      });
      state.audiencesResult = {};
      state.audiencesViewResult = [];
      return {...state};
    }
    case DirectionalActionTypes.CHECK_DEVICE_CHANGE: {
      let value = action.payload;
      recursionChildCheck(value);
      recursionParentCheck(value);
      let array = [];
      state.device.forEach(au => {
        array.push(...recursionResult2(au.value.children));
      });
      state.deviceViewResult = array;
      let body: any = {};
      state.device.map(au => {
        return {
          key: au.key,
          value: recursionResult2(au.value.children).map(r => r.value)
        };
      }).forEach(({key, value}) => {
        body[key] = value;
      });
      state.deviceResult = body;
      return {...state};
    }
    case DirectionalActionTypes.REMOVE_ALL_DEVICE: {
      state.device.forEach(au => {
        au.value.checked = false;
        au.value.checkState = 0;
        recursionChildCheck(au.value);
        recursionParentCheck(au.value);
      });
      state.deviceResult = {};
      state.deviceViewResult = [];
      return {...state};
    }

    /////// ----------- LBS ----------- /////////

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
      state.lbsCityResult = recursionResult2(state.lbsCity.children).map(ar => ({
        id: ar.id,
        name: ar.name,
        location_items: ar.location_items,
        type_id: ar.type_id
      }));
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
    case DirectionalActionTypes.LBS_CITY_MAP_PUSH: {
      state.lbsCityMapResult.push(action.payload);
      return {...state};
    }
    case DirectionalActionTypes.LBS_CITY_MAP_REMOVE: {
      if (!action.payload) return;
      let {longitude, latitude} = action.payload.coords;
      let index = state.lbsCityMapResult.findIndex(lbs => lbs.coords.longitude === longitude && lbs.coords.latitude === latitude);
      if (!!~index) {
        state.lbsCityMapResult.splice(index, 1);
      }
      return {...state};
    }

    /////// ----------- audiencesAction ----------- /////////

    case DirectionalActionTypes.AUDIENCES_ACTION_NEXT_CHILD: {
      let {value, index} = action.payload;
      console.time('1')
      nextAudiencesActionChild(value, index);
      console.timeEnd('1')
      return {...state};
    }
    case DirectionalActionTypes.AUDIENCES_ACTION_NEXT_CHILD2: {
      let {value, index} = action.payload;
      nextAudiencesActionChild2(value, index);
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
    case DirectionalActionTypes.QUERY_AUDIENCES_ACTION2_BY_NAME: {
      let {target, value} = action.payload;
      let index = target.findIndex(b => !!~b.name.indexOf(value));
      if (!!~index) {
        let data = target[index];
        target.splice(index, 1);
        target.unshift(data);
      }
      return {...state};
    }

    ////// --------------------APP--------------------///////////
    case DirectionalActionTypes.AUDIENCES_APP_ASSIGN: {
      state.audiencesApp = action.payload;
      state.audiencesAppList = [state.audiencesApp.children];
      nextAudiencesAppChild();
      if (state.result2) {
        setResult2();
        state.result2 = undefined;
      }
      return {...state};
    }
    case DirectionalActionTypes.QUERY_AUDIENCES_APP_BY_NAME: {
      let {target, value} = action.payload;
      let index = target.findIndex(b => !!~b.name.indexOf(value));
      if (!!~index) {
        let data = target[index];
        target.splice(index, 1);
        target.unshift(data);
      }
      return {...state};
    }
    case DirectionalActionTypes.AUDIENCES_APP_NEXT_CHILD: {
      let {value, index} = action.payload;
      nextAudiencesAppChild(value, index);
      return {...state};
    }
    case DirectionalActionTypes.CHECK_AUDIENCES_APP_CHANGE: {
      let value = action.payload;
      if (typeof value == 'boolean') {
        state.audiencesApp.checked = value;
        value = state.audiencesApp;
      }
      recursionChildCheck(value);
      recursionParentCheck(value);
      state.audiencesAppResult = recursionResult2(state.audiencesApp.children);
      return {...state};
    }

    /////// ---------- 功能 ------------   ///////
    case DirectionalActionTypes.DIRECTIONAL_RECOVERY: {
      if (!state.areas || !state.device || !state.audiences || !state.audiencesAction || !state.audiencesAction2 || !state.lbsCity) return state;
      state.device.forEach(au => {
        au.value.checked = false;
        au.value.checkState = 0;
        recursionChildCheck(au.value);
        recursionParentCheck(au.value);
      });
      state.deviceResult = {};
      state.deviceViewResult = [];

      state.audiences.forEach(au => {
        au.value.checked = false;
        au.value.checkState = 0;
        recursionChildCheck(au.value);
        recursionParentCheck(au.value);
      });
      state.audiencesResult = {};
      state.audiencesViewResult = [];

      state.areas.checked = false;
      state.areas.checkState = 0;
      recursionChildCheck(state.areas);
      recursionParentCheck(state.areas);
      state.areasResult = [];

      state.lbsCity.checked = false;
      state.lbsCity.checkState = 0;
      recursionChildCheck(state.lbsCity);
      recursionParentCheck(state.lbsCity);
      state.lbsCityViewResult = [];
      state.lbsCityResult = [];

      state.audiencesAction.checked = false;
      state.audiencesAction.checkState = 0;
      recursionChildCheck(state.audiencesAction);
      recursionParentCheck(state.audiencesAction);
      state.audiencesActionResult = [];

      state.audiencesAction2.checked = false;
      state.audiencesAction2.checkState = 0;
      recursionChildCheck(state.audiencesAction2);
      recursionParentCheck(state.audiencesAction2);
      state.audiencesAction2Result = [];

      return {...state};
    }

    case DirectionalActionTypes.DIRECTIONAL_SET_RESULT: {
      state.result = action.payload;
      setResult();
      return {...state};
    }

    case DirectionalActionTypes.DIRECTIONAL_RECOVERY2:{
      if (!state.audiencesApp) return state;
      state.audiencesApp.checked = false;
      state.audiencesApp.checkState = 0;
      recursionChildCheck(state.audiencesApp);
      recursionParentCheck(state.audiencesApp);
      state.audiencesAppResult = [];
      return {...state};
    }
    case DirectionalActionTypes.DIRECTIONAL_SET_RESULT2:{
      state.result2 = action.payload;
      setResult2();
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

  function nextLbsCityChild(target = state.lbsCity.children[0], index = 0) {
    state.lbsCityList.length = index + 1;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      state.lbsCityList.push(target.children);
      target = target.children[0];
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

  function nextAudiencesAppChild(target = state.audiencesApp.children[0], index = 0) {
    state.audiencesAppList.length = index + 1;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      state.audiencesAppList.push(target.children);
      target = target.children[0];
    }
  }

  function setResult() {
    if (!state.areas || !state.device || !state.audiences || !state.audiencesAction || !state.audiencesAction2 || !state.lbsCity) return state;

    let area = state.result.dtl_address.area.map(a => a.id);

    // area
    state.areas.checked = false;
    state.areas.checkState = 0;
    recursionChildCheck(state.areas)
    recursionFilter(area, state.areas.children, 'id');
    state.areasResult = recursionResult(state.areas.children); // .map(ar => ({id: ar.id, name: ar.name}));

    // audiences
    state.audiences.forEach(au => {
      au.value.checked = false;
      au.value.checkState = 0;
      recursionChildCheck(au.value)
      recursionFilter(state.result.dtl_attribute.crowdAttribute[au.key], au.value.children, 'value');
    });
    let array = [];
    state.audiences.forEach(au => {
      array.push(...recursionResult2(au.value.children));
    });
    state.audiencesViewResult = array;
    let body: any = {};
    state.audiences.map(au => {
      return {
        key: au.key,
        value: recursionResult2(au.value.children).map(r => r.value)
      };
    }).forEach(({key, value}) => {
      body[key] = value;
    });
    state.audiencesResult = body;

    // device
    state.device.forEach(au => {
      au.value.checked = false;
      au.value.checkState = 0;
      recursionChildCheck(au.value)
      recursionFilter(state.result.dtl_devices[au.key], au.value.children, 'value');
    });
    let array2 = [];
    state.device.forEach(au => {
      array2.push(...recursionResult2(au.value.children));
    });
    state.deviceViewResult = array2;
    let body2: any = {};
    state.device.map(au => {
      return {
        key: au.key,
        value: recursionResult2(au.value.children).map(r => r.value)
      };
    }).forEach(({key, value}) => {
      body2[key] = value;
    });
    state.deviceResult = body2;

    // lbsCity
    let lbsCity = state.result.dtl_address.lbs.map(a => a.id);
    state.lbsCity.checked = false;
    state.lbsCity.checkState = 0;
    recursionChildCheck(state.lbsCity)
    recursionFilter2(lbsCity, state.lbsCity.children, 'id');
    state.lbsCityViewResult = recursionResult(state.lbsCity.children);
    state.lbsCityResult = recursionResult2(state.lbsCity.children).map(ar => ({
      id: ar.id,
      name: ar.name,
      location_items: ar.location_items,
      type_id: ar.type_id
    }));

    // audiencesAction audiencesAction2
    let appAttribute = state.result.dtl_behavior.appAttribute.map(a => a.id);
    let appCategory = state.result.dtl_behavior.appCategory.map(a => a.id);
    let filterAppAttribute = state.result.dtl_behavior.filterAppAttribute.map(a => a.id);
    let filterAppCategory = state.result.dtl_behavior.filterAppCategory.map(a => a.id);

    state.audiencesAction.checked = false;
    state.audiencesAction.checkState = 0;
    recursionChildCheck(state.audiencesAction)
    recursionFilter(appAttribute.concat(appCategory), state.audiencesAction.children, 'id');
    state.audiencesActionResult = recursionResult(state.audiencesAction.children);

    state.audiencesAction2.checked = false;
    state.audiencesAction2.checkState = 0;
    recursionChildCheck(state.audiencesAction2)
    recursionFilter(filterAppAttribute.concat(filterAppCategory), state.audiencesAction2.children, 'id');
    state.audiencesAction2Result = recursionResult(state.audiencesAction2.children);
  }

  function setResult2() {
    if(!state.audiencesApp) return;
    if(!(state.result2 instanceof Array)) return;
    let audiencesApp = state.result2.map(a => a.id);
    recursionFilter(audiencesApp, state.audiencesApp.children, 'id');
    state.audiencesAppResult = recursionResult2(state.audiencesApp.children)
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

export const AudiencesViewResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesViewResult
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

export const DeviceViewResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.deviceViewResult
);

//---------------- LBS

export const LbsCity = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCity
);

export const LbsScenes = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsScenes
);

export const LbsCityList = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCityList
);

export const LbsCityResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCityResult
);

export const LbsCityMapResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCityMapResult
);

export const LbsCityViewResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.lbsCityViewResult
);

//---------------- AudiencesAction

export const AudiencesAction = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesAction
);

export const AudiencesActionList = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesActionList
);

export const AudiencesActionResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesActionResult
);

export const AudiencesAction2 = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesAction2
);

export const AudiencesAction2List = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesAction2List
);

export const AudiencesAction2Result = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesAction2Result
);

// --------------- APP ------------------//
export const AudiencesApp = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesApp
);

export const AudiencesAppList = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesAppList
);

export const AudiencesAppResult = createSelector(
  getDirectionalState,
  (state: DirectionalState) => state.audiencesAppResult
);
