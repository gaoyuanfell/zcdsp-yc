import {Injectable} from '@angular/core';
import {DirectionalService} from './customer/directional.service';
import {forkJoin, Observable, Subject} from 'rxjs';

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

  private _areas;
  private _lbsCity;
  private _audiencesList;
  private _audiencesAction;
  private _audiencesAction2;
  private _deviceList;

  get areas() {
    return this._areas;
  }

  set areas(value) {
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

  ////////////////////////***********

  areas$ = new Subject<any>();
  lbsCity$ = new Subject<any>();
  audiencesList$ = new Subject<any>();
  audiencesAction$ = new Subject<any>();
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
        this.areasData = a.result
        this.lbsCityData = b.result
        this.audiencesListData = c.result
        this.audiencesActionData = d.result
        this.deviceListData = e.result
        this.recursionChildData().subscribe(() => {
          observer.next();
        })
      });
    });
  }

  constructor(private _directionalService: DirectionalService) {

  }

  recursionChildData(){
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
        observer.next();

        this.areas$.next(this.areas);
        this.lbsCity$.next(this.lbsCity);
        this.audiencesList$.next(this.audiencesList);
        this.deviceList$.next(this.deviceList);
        this.audiencesAction$.next(this.audiencesAction);
        this.audiencesAction2$.next(this.audiencesAction2);
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
}
