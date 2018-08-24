import {Action} from '@ngrx/store';

export enum DirectionalActionTypes {
  DIRECTIONAL_ASSIGN = '[DIRECTIONAL] DIRECTIONAL_ASSIGN',
  DIRECTIONAL_INIT = '[DIRECTIONAL] DIRECTIONAL_INIT',
  NEXT_AREAS_CHILD = '[DIRECTIONAL] NEXT_AREAS_CHILD',
  CHECK_AREAS_CHANGE = '[DIRECTIONAL] CHECK_AREAS_CHANGE',
  QUERY_AREAS_BY_NAME = '[DIRECTIONAL] QUERY_AREAS_BY_NAME',
  LBS_CITY_NEXT_CHILD = '[DIRECTIONAL] LBS_CITY_NEXT_CHILD',
  CHECK_LBS_CITY_CHANGE = '[DIRECTIONAL] CHECK_LBS_CITY_CHANGE',
  QUERY_LBS_CITY_BY_NAME = '[DIRECTIONAL] QUERY_LBS_CITY_BY_NAME',
  CHECK_AUDIENCES_CHANGE = '[DIRECTIONAL] CHECK_AUDIENCES_CHANGE',
}

// effects 数据初始化
export class DirectionalInit implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_INIT;
}

// 定向数据赋值
export class DirectionalAssign implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_ASSIGN;

  constructor(public payload: any) {
  }
}

// --------------------Areas----------------------- //

// 获取下级数据 城市Areas
export class AreasNextChild implements Action{
  readonly type = DirectionalActionTypes.NEXT_AREAS_CHILD;
  constructor(public payload: any) {

  }
}

// 改变状态 城市Areas
export class CheckAreasChange implements Action{
  readonly type = DirectionalActionTypes.CHECK_AREAS_CHANGE;
  constructor(public payload: any) {

  }
}

// 快捷查询 by name 城市Areas
export class QueryAreasByName implements Action{
  readonly type = DirectionalActionTypes.QUERY_AREAS_BY_NAME;
  constructor(public payload: any) {

  }
}

// --------------------LBS----------------------- //

// 获取下级数据
export class LbsCityNextChild implements Action{
  readonly type = DirectionalActionTypes.LBS_CITY_NEXT_CHILD;
  constructor(public payload: any) {

  }
}

// 改变状态
export class CheckLbsCityChange implements Action{
  readonly type = DirectionalActionTypes.CHECK_LBS_CITY_CHANGE;
  constructor(public payload: any) {

  }
}

// 快捷查询 by name
export class QueryLbsCityByName implements Action{
  readonly type = DirectionalActionTypes.QUERY_LBS_CITY_BY_NAME;
  constructor(public payload: any) {

  }
}

// ------------------- 受众定向 -------------------- //

// 改变状态
export class CheckAudiencesChange implements Action{
  readonly type = DirectionalActionTypes.CHECK_AUDIENCES_CHANGE;
  constructor(public payload: any) {

  }
}

export type DirectionalActionUnion
  = DirectionalAssign
  | DirectionalInit
  | AreasNextChild
  | CheckAreasChange
  | QueryAreasByName
  | LbsCityNextChild
  | CheckLbsCityChange
  | QueryLbsCityByName
  | CheckAudiencesChange
