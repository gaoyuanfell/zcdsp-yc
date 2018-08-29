import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Global {
  constructor() {

  }

  overflowSubject: Subject<{[key: string]: any}>

  private _containerFullRef: HTMLDivElement = null;
  private _token = null;
  private _auth;
  private bidMin = 0.10;  // 活動 创意 出价最小值
  private bidMax = 1000; // 活動 创意 出价最大值
  private _scrollHeight;
  private _scrollTop;

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
}
