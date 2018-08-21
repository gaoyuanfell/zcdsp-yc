import {Action} from '@ngrx/store';

export enum MenuActionTypes {
  INIT_MENU = '[MENU] INIT_MENU',
  SELECT_MENU = '[MENU] SELECT_MENU',
  ASSIGN_MENU = '[MENU] ASSIGN_MENU',
  ASSIGN_CHILD_LIST = '[MENU] ASSIGN_CHILD_LIST',
  ASSIGN_CHILD_LIST_BY_PATH = '[MENU] ASSIGN_CHILD_LIST_BY_PATH',
}

// ---- ///
export class InitMenu implements Action {
  readonly type = MenuActionTypes.INIT_MENU;
}

// ---- ///
export class SelectMenu implements Action {
  readonly type = MenuActionTypes.SELECT_MENU;

  constructor(public payload: string) {
  }
}

export class AssignMenu implements Action {
  readonly type = MenuActionTypes.ASSIGN_MENU;

  constructor(public payload: Array<any>) {
  }
}

// ---- ///
export class AssignChildList implements Action {
  readonly type = MenuActionTypes.ASSIGN_CHILD_LIST;

  constructor(public payload: Array<any>) {
  }
}

// ---- ///
export class AssignChildListByPath implements Action {
  readonly type = MenuActionTypes.ASSIGN_CHILD_LIST_BY_PATH;

  constructor(public payload: String) {
  }
}

export type MenuActionUnion
  = AssignMenu
  | AssignChildList
  | AssignChildListByPath
  | SelectMenu
