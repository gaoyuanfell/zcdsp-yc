import {Injectable} from '@angular/core';
import {DirectionalService} from './customer/directional.service';
import {forkJoin, Observable, Subject} from 'rxjs';
import {recursionChildCheck, recursionParentCheck, recursionResult, recursionResult2} from '../store/util';
import {delay} from 'rxjs/operators';

export interface Directional {
  children?: Array<Directional>
  checked?: boolean
  checkState?: 0 | 1 | 2
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class DirectionalDataService {

  areasData;
  lbsCityData;
  audiencesListData;
  audiencesActionData;
  deviceListData;

  private _areas: Directional;
  private _lbsCity: Directional;
  private _audiencesList;
  private _audiencesAction: Directional;
  private _audiencesAction2: Directional;
  private _deviceList;

  get areas() {
    return this._areas;
  }

  set areas(value: Directional) {
    this._areas = value;
  }

  get lbsCity() {
    return this._lbsCity;
  }

  set lbsCity(value) {
    this._lbsCity = value;
  }

  get audiencesList() {
    return this._audiencesList;
  }

  set audiencesList(value) {
    this._audiencesList = value;
  }

  get audiencesAction() {
    return this._audiencesAction;
  }

  set audiencesAction(value) {
    this._audiencesAction = value;
  }

  get audiencesAction2() {
    return this._audiencesAction2;
  }

  set audiencesAction2(value) {
    this._audiencesAction2 = value;
  }

  get deviceList() {
    return this._deviceList;
  }

  set deviceList(value) {
    this._deviceList = value;
  }

  ////////////////////////*********** areas ***********////////////////////////

  areasSubject = new Subject<Directional>();

  get areas$(): Observable<Directional> {
    return this.areasSubject.asObservable();
  }

  areasChildList = [];
  areasChildListSubject = new Subject<Array<any>>();

  get areasChildList$() {
    return this.areasChildListSubject.asObservable();
  }

  areasResult = [];
  areasResultSubject = new Subject<Array<any>>();

  get areasResult$() {
    return this.areasResultSubject.asObservable();
  }

  funcAreasNextChild({value, index}) {
    this.nextAreasChild(value, index);
    this.areasChildListSubject.next(this.areasChildList);
  }

  funcCheckAreasChange(value) {
    if (typeof value == 'boolean') {
      this.areas.checked = value;
      value = this.areas;
    }
    recursionChildCheck(value);
    recursionParentCheck(value);
    this.areasResult = recursionResult(this.areas.children);
    this.areasResultSubject.next(this.areasResult);
  }

  funcQueryAreasByName(payload) {
    let {target, value} = payload;
    let index = target.findIndex(b => !!~b.name.indexOf(value));
    if (!!~index) {
      let data = target[index];
      target.splice(index, 1);
      target.unshift(data);
    }
  }

  private nextAreasChild(target = this.areas.children[0], index = 0) {
    this.areasChildList.length = index + 1;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      this.areasChildList.push(target.children);
      target = target.children[0];
    }
  }

  ////////////////////////*********** areas ***********////////////////////////

  ////////////////////////*********** lbsCity ***********////////////////////////

  lbsCitySubject = new Subject<Directional>();

  get lbsCity$() {
    return this.lbsCitySubject.asObservable();
  }

  lbsCityList = [];
  lbsCityListSubject = new Subject<Array<any>>();

  get lbsCityList$() {
    return this.lbsCityListSubject.asObservable();
  }

  lbsCityViewResult = [];
  lbsCityViewResultSubject = new Subject<Array<any>>();

  get lbsCityViewResult$() {
    return this.lbsCityViewResultSubject.asObservable();
  }

  lbsCityResult = [];
  lbsCityResultSubject = new Subject<Array<any>>();

  get lbsCityResult$() {
    return this.lbsCityResultSubject.asObservable();
  }

  funcLbsCityNextChild(payload) {
    let {value, index} = payload;
    this.funcNextLbsCityChild(value, index);
    this.lbsCityListSubject.next(this.lbsCityList);
  }

  funcCheckLbsCityChange(value) {
    if (typeof value == 'boolean') {
      this.lbsCity.checked = value;
      value = this.lbsCity;
    }
    recursionChildCheck(value);
    recursionParentCheck(value);
    this.lbsCityViewResult = recursionResult(this.lbsCity.children);
    this.lbsCityViewResultSubject.next(this.lbsCityViewResult);
    this.lbsCityResult = recursionResult2(this.lbsCity.children);
    this.lbsCityResultSubject.next(this.lbsCityResult);
  }

  private funcNextLbsCityChild(target = this.lbsCity.children[0], index = 0) {
    this.lbsCityList.length = index + 1;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      this.lbsCityList.push(target.children);
      target = target.children[0];
    }
  }

  funcQueryLbsCityByName(payload) {
    let {target, value} = payload;
    let index = target.findIndex(b => !!~b.name.indexOf(value));
    if (!!~index) {
      let data = target[index];
      target.splice(index, 1);
      target.unshift(data);
    }
  }

  ////////////////////////*********** lbsCity ***********////////////////////////


  ////////////////////////*********** audiencesAction ***********////////////////////////

  audiencesActionSubject = new Subject<Directional>();

  get audiencesAction$() {
    return this.audiencesActionSubject.asObservable();
  }

  audiencesActionList = [];
  audiencesActionListSubject = new Subject<Array<Array<any>>>();

  get audiencesActionList$() {
    return this.audiencesActionListSubject.asObservable();
  }

  audiencesActionResult = [];
  audiencesActionResultSubject = new Subject<Array<any>>();

  get audiencesActionResult$() {
    return this.audiencesActionResultSubject.asObservable();
  }

  funcAudiencesActionNextChild(payload) {
    let {value, index} = payload;
    this.funcNextAudiencesActionChild(value, index)
    this.audiencesActionListSubject.next(this.audiencesActionList);
  }

  funcCheckAudiencesActionChange(value) {
    if (typeof value == 'boolean') {
      this.audiencesAction.checked = value;
      value = this.audiencesAction;
    }
    recursionChildCheck(value);
    recursionParentCheck(value);
    this.audiencesActionResult = recursionResult(this.audiencesAction.children);
    this.audiencesActionResultSubject.next(this.audiencesActionResult);
  }

  funcQueryAudiencesActionByName(payload) {
    let {target, value} = payload;
    let index = target.findIndex(b => !!~b.name.indexOf(value));
    if (!!~index) {
      let data = target[index];
      target.splice(index, 1);
      target.unshift(data);
    }
  }

  private funcNextAudiencesActionChild(target = this.audiencesAction.children[0], index = 0) {
    this.audiencesActionList.length = index + 1;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      this.audiencesActionList.push(target.children);
      target = target.children[0];
    }
  }

  ////////////////////////*********** audiencesAction ***********////////////////////////

  audiencesList$ = new Subject<any>();
  audiencesAction2$ = new Subject<any>();
  deviceList$ = new Subject<any>();

  ////////////////////////***********

  initDirectional$() {
    return new Observable(observer => {
      let service = [
        this._directionalService.directionalCity(),
        this._directionalService.directionalLbs(),
        this._directionalService.directionalAudiences(),
        this._directionalService.directionalAudiencesAction(),
        this._directionalService.directionalDevice(),
      ];

      forkJoin(service).subscribe((arr) => {
        let [a, b, c, d, e] = arr;
        this.areasData = a.result;
        this.lbsCityData = b.result;
        this.audiencesListData = c.result;
        this.audiencesActionData = d.result;
        this.deviceListData = e.result;
        this.recursionChildData().subscribe(() => {
          observer.next();
        });
      });
    });
  }

  constructor(private _directionalService: DirectionalService) {

  }

  nextSubject() {
    this.areasSubject.next(this.areas);
    this.areasChildList.push(this.areas.children);
    this.nextAreasChild();
    this.areasChildListSubject.next(this.areasChildList);

    this.lbsCitySubject.next(this.lbsCity);
    this.lbsCityList.push(this.lbsCity.children);
    this.funcNextLbsCityChild();
    this.lbsCityListSubject.next(this.lbsCityList);

    this.audiencesActionSubject.next(this.audiencesAction);
    this.audiencesActionList.push(this.audiencesAction.children);
    this.funcNextAudiencesActionChild();
    this.audiencesActionListSubject.next(this.audiencesActionList);


    this.audiencesList$.next(this.audiencesList);
    this.deviceList$.next(this.deviceList);
    this.audiencesAction2$.next(this.audiencesAction2);
  }


  recursionChildData() {
    return new Observable(observer => {
      let {age, education, sex} = this.audiencesListData;
      let {browsers, devices_type, mobile_brand, net_type, operators, os} = this.deviceListData;
      let recursion = [
        this.recursionChild({children: this.areasData}),
        this.recursionChild({children: this.lbsCityData}),
        this.recursionChild({children: age, name: '年龄'}),
        this.recursionChild({children: education, name: '学历'}),
        this.recursionChild({children: sex, name: '性别'}),
        this.recursionChild({children: this.audiencesActionData}),
        this.recursionChild({children: this.audiencesActionData}),
        this.recursionChild({children: browsers, name: '浏览器'}),
        this.recursionChild({children: devices_type, name: '设备类型'}),
        this.recursionChild({children: mobile_brand, name: '设备品牌'}),
        this.recursionChild({children: net_type, name: '联网方式'}),
        this.recursionChild({children: operators, name: '运营商'}),
        this.recursionChild({children: os, name: '操作系统'}),
      ];
      Promise.all(recursion).then(([areas, lbsCity, age, education, sex, audiencesAction, audiencesAction2, browsers, devices_type, mobile_brand, net_type, operators, os]) => {
        let audiences = {age, education, sex};
        let device = {browsers, devices_type, mobile_brand, net_type, operators, os};
        let audiencesList = Object.entries(audiences).map(([key, value]) => ({key, value}));
        let deviceList = Object.entries(device).map(([key, value]) => ({key, value}));

        this.areas = areas;
        this.lbsCity = lbsCity;
        this.audiencesList = audiencesList;
        this.deviceList = deviceList;
        this.audiencesAction = audiencesAction;
        this.audiencesAction2 = audiencesAction2;
        this.nextSubject();
        observer.next();
      });
    });
  }

  private recursionChild(target) {
    return new Promise((resolve, reject) => {
      let fun = `
      onmessage = function (e) {
          function recursionChild(target) {
            if(target instanceof Array && target.length > 0){
              target.forEach(data => {
                recursionChild(data);
              });
            }else{
              let list = target.children;
              if (list && list.length > 0) {
                list.forEach(data => {
                  data.parent = target;
                  recursionChild(data);
                });
              }
            }
          }
          recursionChild(e.data)
          postMessage(e.data);
      }
    `;
      const blob = new Blob([fun], {type: 'application/javascript'});
      const url = URL.createObjectURL(blob);
      const worker = new Worker(url);
      worker.postMessage(target);
      worker.onmessage = (e) => {
        resolve(e.data);
      };
    });
  }

  private splitArray(array, size = 50) {
    let result = [];
    for (let x = 0; x < Math.ceil(array.length / size); x++) {
      let start = x * size;
      let end = start + size;
      result.push(array.slice(start, end));
    }
    return result;
  }
}
