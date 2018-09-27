import {Action} from '@ngrx/store';

export enum MenuActionTypes {
  ASSIGN_MENU = '[MENU] ASSIGN_MENU',
  SELECT_ACTIVE_MENU = '[MENU] SELECT_ACTIVE_MENU',
}

export class AssignMenu implements Action {
  readonly type = MenuActionTypes.ASSIGN_MENU;

  constructor(public payload: Array<any>) {
  }
}

// 展开对应的菜单
export class SelectActiveMenu implements Action {
  readonly type = MenuActionTypes.SELECT_ACTIVE_MENU;

  constructor(public payload: string) {
  }
}

export type MenuActionUnion
  = AssignMenu
  | SelectActiveMenu
