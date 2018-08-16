import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Global {
  constructor() {
  }

  private _menus = [];
  private _menuChild = null;
  private _userMenu = null;
  private _scrollTop = 0;
  private _scrollHeight = 0;
  private _containerFullRef: HTMLDivElement = null;
  private _token = null;
  private _auth;
  private bidMin = 0.10;  // 活動 创意 出价最小值
  private bidMax = 1000; // 活動 创意 出价最大值

  get bid_min() {
    return this.bidMin;
  }

  get bid_max() {
    return this.bidMax;
  }

  get auth() {
    return this._auth;
  }

  set auth(value) {
    this._auth = value;
  }

  get token() {
    return this._token;
  }

  set token(value) {
    this._token = value;
  }

  get containerFullRef(): HTMLDivElement {
    return this._containerFullRef;
  }

  set containerFullRef(value) {
    this._containerFullRef = value;
  }

  get scrollTop(): number {
    return this._scrollTop;
  }

  set scrollTop(value) {
    this._scrollTop = value;
  }

  get scrollHeight(): number {
    return this._scrollHeight;
  }

  set scrollHeight(value) {
    this._scrollHeight = value;
  }

  get menus(): Array<any> {
    return this._menus;
  }

  set menus(value) {
    this._menus = value;
  }

  get menuChild(): Array<any> {
    return this._menuChild;
  }

  set menuChild(value) {
    this._menuChild = value;
  }

  get userMenu(): object {
    return this._userMenu;
  }

  set userMenu(value) {
    this._userMenu = value;
  }

  get menuAll() {
    return [...this.menus, this.userMenu];
  }
}
