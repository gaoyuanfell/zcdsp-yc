import {Action} from '@ngrx/store';

export enum DirectionalActionTypes {
  DIRECTIONAL_ASSIGN = '[DIRECTIONAL] DIRECTIONAL_ASSIGN',
  DIRECTIONAL_INIT = '[DIRECTIONAL] DIRECTIONAL_INIT',

  NEXT_AREAS_CHILD = '[DIRECTIONAL] NEXT_AREAS_CHILD',
  CHECK_AREAS_CHANGE = '[DIRECTIONAL] CHECK_AREAS_CHANGE',
  QUERY_AREAS_BY_NAME = '[DIRECTIONAL] QUERY_AREAS_BY_NAME',

  LBS_CITY_INIT = '[DIRECTIONAL] LBS_CITY_INIT',
  LBS_CITY_ASSIGN = '[DIRECTIONAL] LBS_CITY_ASSIGN',
  LBS_CITY_NEXT_CHILD = '[DIRECTIONAL] LBS_CITY_NEXT_CHILD',
  CHECK_LBS_CITY_CHANGE = '[DIRECTIONAL] CHECK_LBS_CITY_CHANGE',
  QUERY_LBS_CITY_BY_NAME = '[DIRECTIONAL] QUERY_LBS_CITY_BY_NAME',

  LBS_CITY_MAP_PUSH = '[DIRECTIONAL] LBS_CITY_MAP_PUSH',  // 定义好了
  LBS_CITY_MAP_REMOVE = '[DIRECTIONAL] LBS_CITY_MAP_REMOVE',
  LBS_CITY_MAP_REMOVE_ALL = '[DIRECTIONAL] LBS_CITY_MAP_REMOVE_ALL',

  CHECK_AUDIENCES_CHANGE = '[DIRECTIONAL] CHECK_AUDIENCES_CHANGE',
  REMOVE_ALL_AUDIENCES = '[DIRECTIONAL] REMOVE_ALL_AUDIENCES',

  CHECK_DEVICE_CHANGE = '[DIRECTIONAL] CHECK_DEVICE_CHANGE',
  REMOVE_ALL_DEVICE = '[DIRECTIONAL] REMOVE_ALL_DEVICE',

  AUDIENCES_ACTION_INIT = '[DIRECTIONAL] AUDIENCES_ACTION_INIT',
  AUDIENCES_ACTION_ASSIGN = '[DIRECTIONAL] AUDIENCES_ACTION_ASSIGN',
  AUDIENCES_ACTION_ASSIGN2 = '[DIRECTIONAL] AUDIENCES_ACTION_ASSIGN2',
  AUDIENCES_ACTION_NEXT_CHILD = '[DIRECTIONAL] AUDIENCES_ACTION_NEXT_CHILD',
  AUDIENCES_ACTION_NEXT_CHILD2 = '[DIRECTIONAL] AUDIENCES_ACTION_NEXT_CHILD2',
  CHECK_AUDIENCES_ACTION_CHANGE = '[DIRECTIONAL] CHECK_AUDIENCES_ACTION_CHANGE',
  CHECK_AUDIENCES_ACTION_CHANGE2 = '[DIRECTIONAL] CHECK_AUDIENCES_ACTION_CHANGE2',
  QUERY_AUDIENCES_ACTION_BY_NAME = '[DIRECTIONAL] QUERY_AUDIENCES_ACTION_BY_NAME',
  QUERY_AUDIENCES_ACTION2_BY_NAME = '[DIRECTIONAL] QUERY_AUDIENCES_ACTION2_BY_NAME',


  DIRECTIONAL_RECOVERY = '[DIRECTIONAL] DIRECTIONAL_RECOVERY',
  DIRECTIONAL_SET_RESULT = '[DIRECTIONAL] DIRECTIONAL_SET_RESULT',
  DIRECTIONAL_RECOVERY2 = '[DIRECTIONAL] DIRECTIONAL_RECOVERY2',
  DIRECTIONAL_SET_RESULT2 = '[DIRECTIONAL] DIRECTIONAL_SET_RESULT2',

  AUDIENCES_APP_ASSIGN = '[DIRECTIONAL] AUDIENCES_APP_ASSIGN',
  QUERY_AUDIENCES_APP_BY_NAME = '[DIRECTIONAL] QUERY_AUDIENCES_APP_BY_NAME',
  AUDIENCES_APP_NEXT_CHILD = '[DIRECTIONAL] AUDIENCES_APP_NEXT_CHILD',
  CHECK_AUDIENCES_APP_CHANGE = '[DIRECTIONAL] CHECK_AUDIENCES_APP_CHANGE',
}

// effects 数据初始化
export class DirectionalInit implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_INIT;
}

// effects 数据初始化 lbs
export class LbsCityInit implements Action {
  readonly type = DirectionalActionTypes.LBS_CITY_INIT;
}

// effects 数据初始化 AudiencesAction
export class AudiencesActionInit implements Action {
  readonly type = DirectionalActionTypes.AUDIENCES_ACTION_INIT;
}

// 定向数据赋值
export class DirectionalAssign implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_ASSIGN;

  constructor(public payload: any) {
  }
}

// 定向数据赋值 LBS
export class LbsCityAssign implements Action {
  readonly type = DirectionalActionTypes.LBS_CITY_ASSIGN;

  constructor(public payload: any) {
  }
}

// 定向数据赋值 AudiencesAction
export class AudiencesActionAssign implements Action {
  readonly type = DirectionalActionTypes.AUDIENCES_ACTION_ASSIGN;

  constructor(public payload: any) {
  }
}

// 定向数据赋值 AudiencesAction
export class AudiencesActionAssign2 implements Action {
  readonly type = DirectionalActionTypes.AUDIENCES_ACTION_ASSIGN2;

  constructor(public payload: any) {
  }
}

// LBS 地图数据添加 LBS_CITY_MAP_PUSH
export class LbsCityMapPush implements Action {
  readonly type = DirectionalActionTypes.LBS_CITY_MAP_PUSH;

  constructor(public payload: any) {   // $event
  }
}

// LBS 地图数据移除
export class LbsCityMapRemove implements Action {
  readonly type = DirectionalActionTypes.LBS_CITY_MAP_REMOVE;

  constructor(public payload: any) {
  }
}

// 移除所有地图数据
export class LbsCityMapRemoveAll implements Action {
  readonly type = DirectionalActionTypes.LBS_CITY_MAP_REMOVE_ALL;
}

// --------------------Areas----------------------- //

// 获取下级数据 城市Areas
export class AreasNextChild implements Action {
  readonly type = DirectionalActionTypes.NEXT_AREAS_CHILD;

  constructor(public payload: any) {

  }
}

// 改变状态 城市Areas
export class CheckAreasChange implements Action {
  readonly type = DirectionalActionTypes.CHECK_AREAS_CHANGE;

  constructor(public payload: any) {

  }
}

// 快捷查询 by name 城市Areas
export class QueryAreasByName implements Action {
  readonly type = DirectionalActionTypes.QUERY_AREAS_BY_NAME;

  constructor(public payload: any) {

  }
}

// --------------------LBS----------------------- //

// 获取下级数据
export class LbsCityNextChild implements Action {
  readonly type = DirectionalActionTypes.LBS_CITY_NEXT_CHILD;

  constructor(public payload: any) {

  }
}

// 改变状态
export class CheckLbsCityChange implements Action {
  readonly type = DirectionalActionTypes.CHECK_LBS_CITY_CHANGE;

  constructor(public payload: any) {

  }
}

// 快捷查询 by name
export class QueryLbsCityByName implements Action {
  readonly type = DirectionalActionTypes.QUERY_LBS_CITY_BY_NAME;

  constructor(public payload: any) {

  }
}

// ------------------- 受众定向 -------------------- //

// 改变状态
export class CheckAudiencesChange implements Action {
  readonly type = DirectionalActionTypes.CHECK_AUDIENCES_CHANGE;

  constructor(public payload: any) {

  }
}

// 移除Audiences所有数据
export class RemoveAllAudiences implements Action {
  readonly type = DirectionalActionTypes.REMOVE_ALL_AUDIENCES;
}

// ------------------- 设备定向 -------------------- //

// 改变状态
export class CheckDeviceChange implements Action {
  readonly type = DirectionalActionTypes.CHECK_DEVICE_CHANGE;

  constructor(public payload: any) {

  }
}

// 移除Device所有数据
export class RemoveAllDevice implements Action {
  readonly type = DirectionalActionTypes.REMOVE_ALL_DEVICE;
}

// --------------------受众行为---------------------- //

// 获取下级数据
export class AudiencesActionNextChild implements Action {
  readonly type = DirectionalActionTypes.AUDIENCES_ACTION_NEXT_CHILD;

  constructor(public payload: any) {

  }
}

export class AudiencesActionNextChild2 implements Action {
  readonly type = DirectionalActionTypes.AUDIENCES_ACTION_NEXT_CHILD2;

  constructor(public payload: any) {

  }
}

// 改变状态
export class CheckAudiencesActionChange implements Action {
  readonly type = DirectionalActionTypes.CHECK_AUDIENCES_ACTION_CHANGE;

  constructor(public payload: any) {

  }
}

export class CheckAudiencesActionChange2 implements Action {
  readonly type = DirectionalActionTypes.CHECK_AUDIENCES_ACTION_CHANGE2;

  constructor(public payload: any) {

  }
}

// 快捷查询 by name
export class QueryAudiencesActionByName implements Action {
  readonly type = DirectionalActionTypes.QUERY_AUDIENCES_ACTION_BY_NAME;

  constructor(public payload: any) {

  }
}

// 快捷查询 by name
export class QueryAudiencesAction2ByName implements Action {
  readonly type = DirectionalActionTypes.QUERY_AUDIENCES_ACTION2_BY_NAME;

  constructor(public payload: any) {

  }
}

// ------------------   app   ---------------------- //

export class AudiencesAppAssign implements Action {
  readonly type = DirectionalActionTypes.AUDIENCES_APP_ASSIGN;

  constructor(public payload: any) {

  }
}

export class QueryAudiencesAppByName implements Action {
  readonly type = DirectionalActionTypes.QUERY_AUDIENCES_APP_BY_NAME;

  constructor(public payload: any) {

  }
}

export class AudiencesAppNextChild implements Action {
  readonly type = DirectionalActionTypes.AUDIENCES_APP_NEXT_CHILD;

  constructor(public payload: any) {

  }
}

export class CheckAudiencesAppChange implements Action {
  readonly type = DirectionalActionTypes.CHECK_AUDIENCES_APP_CHANGE;

  constructor(public payload: any) {

  }
}

// ------------------  功能 ------------------------ //

// 数据恢复 原始状态
export class DirectionalRecovery implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_RECOVERY;
}

// 数据回显
export class DirectionalSetResult implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_SET_RESULT;

  constructor(public payload: any) {

  }
}

// 数据恢复 原始状态 APP
export class DirectionalRecovery2 implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_RECOVERY2;
}

// 数据回显 APP
export class DirectionalSetResult2 implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_SET_RESULT2;

  constructor(public payload: any) {

  }
}

// 这边为啥类型不一样
export type DirectionalActionUnion
  = DirectionalAssign
  | DirectionalInit
  | LbsCityAssign
  | LbsCityMapPush
  | LbsCityMapRemove
  | LbsCityMapRemoveAll
  | LbsCityInit
  | AudiencesActionAssign
  | AudiencesActionAssign2
  | AudiencesActionInit
  | AreasNextChild
  | CheckAreasChange
  | QueryAreasByName
  | LbsCityNextChild
  | CheckLbsCityChange
  | QueryLbsCityByName
  | CheckAudiencesChange
  | RemoveAllAudiences
  | CheckDeviceChange
  | RemoveAllDevice
  | AudiencesActionNextChild
  | AudiencesActionNextChild2
  | CheckAudiencesActionChange
  | CheckAudiencesActionChange2
  | QueryAudiencesActionByName
  | QueryAudiencesAction2ByName

  | DirectionalRecovery
  | DirectionalSetResult

  | AudiencesAppAssign
  | QueryAudiencesAppByName
  | AudiencesAppNextChild
  | CheckAudiencesAppChange
  | DirectionalRecovery2
  | DirectionalSetResult2

