import {Action} from '@ngrx/store';

export enum DirectionalActionTypes {
  DIRECTIONAL_ASSIGN = '[DIRECTIONAL] DIRECTIONAL_ASSIGN',
  DIRECTIONAL_INIT = '[DIRECTIONAL] DIRECTIONAL_INIT',
  AREAS_NEXT_AREAS_CHILD = '[DIRECTIONAL] AREAS_NEXT_AREAS_CHILD',
  CHECK_AREAS_CHANGE = '[DIRECTIONAL] CHECK_AREAS_CHANGE',
  QUERY_AREAS_BY_NAME = '[DIRECTIONAL] QUERY_AREAS_BY_NAME',
}

export class DirectionalInit implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_INIT;
}

// 定向数据赋值
export class DirectionalAssign implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_ASSIGN;

  constructor(public payload: any) {
  }
}

// 获取下级数据
export class AreasNextAreasChild implements Action{
  readonly type = DirectionalActionTypes.AREAS_NEXT_AREAS_CHILD;
  constructor(public payload: any) {

  }
}

// 改变状态
export class CheckAreasChange implements Action{
  readonly type = DirectionalActionTypes.CHECK_AREAS_CHANGE;
  constructor(public payload: any) {

  }
}

// 快捷查询 by name
export class QueryAreasByName implements Action{
  readonly type = DirectionalActionTypes.QUERY_AREAS_BY_NAME;
  constructor(public payload: any) {

  }
}

export type DirectionalActionUnion
  = DirectionalAssign
  | DirectionalInit
  | AreasNextAreasChild
  | CheckAreasChange
  | QueryAreasByName
