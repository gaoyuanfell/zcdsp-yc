import {Action} from '@ngrx/store';

export enum DirectionalActionTypes {
  DIRECTIONAL_ASSIGN = '[DIRECTIONAL] DIRECTIONAL_ASSIGN',
  DIRECTIONAL_INIT = '[DIRECTIONAL] DIRECTIONAL_INIT',
  AREAS_NEXT_AREAS_CHILD = '[DIRECTIONAL] AREAS_NEXT_AREAS_CHILD',
  CHECK_AREAS_ALL_CHILD = '[DIRECTIONAL] CHECK_AREAS_ALL_CHILD',
}

export class DirectionalInit implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_INIT;
}

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

// 全选下级数据
export class CheckAreasAllChild implements Action{
  readonly type = DirectionalActionTypes.CHECK_AREAS_ALL_CHILD;
  constructor(public payload: any) {

  }
}

export type DirectionalActionUnion
  = DirectionalAssign
  | DirectionalInit
  | AreasNextAreasChild
  | CheckAreasAllChild
