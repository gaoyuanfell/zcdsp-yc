import {Action} from '@ngrx/store';

export enum DirectionalActionTypes {
  DIRECTIONAL_ASSIGN = '[DIRECTIONAL] DIRECTIONAL_ASSIGN',
  DIRECTIONAL_INIT = '[DIRECTIONAL] DIRECTIONAL_INIT',
}

export class DirectionalInit implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_INIT;
}

export class DirectionalAssign implements Action {
  readonly type = DirectionalActionTypes.DIRECTIONAL_ASSIGN;

  constructor(public payload: any) {
  }
}

export type DirectionalActionUnion
  = DirectionalAssign
  | DirectionalInit
