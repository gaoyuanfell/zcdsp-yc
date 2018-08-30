import {Injectable} from '@angular/core';
import {DirectionalService} from './customer/directional.service';
import {forkJoin, Observable, Subject, merge} from 'rxjs';
import {recursionChildCheck, recursionFilter, recursionParentCheck, recursionResult, recursionResult2, sleep, splitArray} from './util';

export interface Directional {
  children?: Array<Directional>
  checked?: boolean
  checkState?: 0 | 1 | 2
}

export interface AppState{
  areas?:any
  lbsCity?:any
  audiences?:any
  audiencesAction?:any
  audiencesAction2?:any
  device?:any
}

@Injectable(
  {
    providedIn: 'root'
  }
)
export class DirectionalDataService {

  State: AppState = {}

  splitTime = 100;

  areasData;
  lbsCityData;
  audiencesListData;
  audiencesActionData;
  deviceListData;

  private _areas: Directional;
  private _lbsCity: Directional;
  private _audiences;
  private _audiencesAction: Directional;
  private _audiencesAction2: Directional;
  private _device;

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

  get audiences() {
    return this._audiences;
  }

  set audiences(value) {
    this._audiences = value;
  }

  get device() {
    return this._device;
  }

  set device(value) {
    this._device = value;
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

  ////////////////////////*********** areas ***********////////////////////////

  private areasSubject = new Subject<Directional>();

  get areas$(): Observable<Directional> {
    return this.areasSubject.asObservable();
  }

  areasChildList = [];
  private areasChildListSubject = new Subject<Array<any>>();

  get areasChildList$() {
    return this.areasChildListSubject.asObservable();
  }

  areasResult = [];
  private areasResultSubject = new Subject<Array<any>>();

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
    this.resultSubject.next(this.getResult());
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

  private lbsCitySubject = new Subject<Directional>();

  get lbsCity$() {
    return this.lbsCitySubject.asObservable();
  }

  lbsCityList = [];
  private lbsCityListSubject = new Subject<Array<any>>();

  get lbsCityList$() {
    return this.lbsCityListSubject.asObservable();
  }

  lbsCityViewResult = [];
  private lbsCityViewResultSubject = new Subject<Array<any>>();

  get lbsCityViewResult$() {
    return this.lbsCityViewResultSubject.asObservable();
  }

  lbsCityResult = [];
  private lbsCityResultSubject = new Subject<Array<any>>();

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
    this.resultSubject.next(this.getResult());
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

  private audiencesActionSubject = new Subject<Directional>();

  get audiencesAction$() {
    return this.audiencesActionSubject.asObservable();
  }

  audiencesActionList = [];
  private audiencesActionListSubject = new Subject<Array<Array<any>>>();

  get audiencesActionList$() {
    return this.audiencesActionListSubject.asObservable();
  }

  audiencesActionResult = [];
  private audiencesActionResultSubject = new Subject<Array<any>>();

  get audiencesActionResult$() {
    return this.audiencesActionResultSubject.asObservable();
  }

  funcAudiencesActionNextChild(payload) {
    let {value, index} = payload;
    if (this.audiencesActionSplitSubject) {
      this.audiencesActionSplitSubject.complete();
    }
    this.audiencesActionSplitSubject = new Subject<any>();
    this.audiencesActionSplitSubject.subscribe(data => {
      let {array, index} = data;
      this.audiencesActionList[index].push(...array);
      this.audiencesActionListSubject.next(this.audiencesActionList);
    });
    this.funcNextAudiencesActionChild(value, index);
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
    this.resultSubject.next(this.getResult());
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

  audiencesActionSplitSubject: Subject<any>;

  private async funcNextAudiencesActionChild(target = this.audiencesAction.children[0], index = 0) {
    this.audiencesActionList.length = index + 1;
    let subject = this.audiencesActionSplitSubject;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      let array = splitArray(target.children);
      target.children.length = 0;
      let index = this.audiencesActionList.push(target.children);
      for (let i = 0; i < array.length; i++) {
        if (subject != this.audiencesActionSplitSubject && index == 0) return;
        this.audiencesActionSplitSubject.next({
          array: array[i],
          index: index - 1
        });
        await sleep(this.splitTime);
      }
      target = target.children[0];
    }
    return this.audiencesActionList;
  }

  ////////////////////////*********** audiencesAction ***********////////////////////////

  ////////////////////////*********** audiencesAction2 ***********////////////////////////


  private audiencesAction2Subject = new Subject<Directional>();

  get audiencesAction2$() {
    return this.audiencesAction2Subject.asObservable();
  }

  audiencesAction2List = [];
  private audiencesAction2ListSubject = new Subject<Array<Array<any>>>();

  get audiencesAction2List$() {
    return this.audiencesAction2ListSubject.asObservable();
  }

  audiencesAction2Result = [];
  private audiencesAction2ResultSubject = new Subject<Array<any>>();

  get audiencesAction2Result$() {
    return this.audiencesAction2ResultSubject.asObservable();
  }

  funcAudiencesAction2NextChild(payload) {
    let {value, index} = payload;
    if (this.audiencesAction2SplitSubject) {
      this.audiencesAction2SplitSubject.complete();
    }
    this.audiencesAction2SplitSubject = new Subject<any>();
    this.audiencesAction2SplitSubject.subscribe(data => {
      let {array, index} = data;
      this.audiencesAction2List[index].push(...array);
      this.audiencesAction2ListSubject.next(this.audiencesAction2List);
    });
    this.funcNextAudiencesAction2Child(value, index);
  }

  funcCheckAudiencesAction2Change(value) {
    if (typeof value == 'boolean') {
      this.audiencesAction2.checked = value;
      value = this.audiencesAction2;
    }
    recursionChildCheck(value);
    recursionParentCheck(value);
    this.audiencesAction2Result = recursionResult(this.audiencesAction2.children);
    this.audiencesAction2ResultSubject.next(this.audiencesAction2Result);
    this.resultSubject.next(this.getResult());
  }

  funcQueryAudiencesAction2ByName(payload) {
    let {target, value} = payload;
    let index = target.findIndex(b => !!~b.name.indexOf(value));
    if (!!~index) {
      let data = target[index];
      target.splice(index, 1);
      target.unshift(data);
    }
  }

  audiencesAction2SplitSubject: Subject<any>;

  private async funcNextAudiencesAction2Child(target = this.audiencesAction2.children[0], index = 0) {
    this.audiencesAction2List.length = index + 1;
    let subject = this.audiencesAction2SplitSubject;
    while (target.children && target.children.length) {
      if (!target.children[0]) break;
      let array = splitArray(target.children);
      target.children.length = 0;
      let index = this.audiencesAction2List.push(target.children);
      for (let i = 0; i < array.length; i++) {
        if (subject != this.audiencesAction2SplitSubject && index == 0) return;
        this.audiencesAction2SplitSubject.next({
          array: array[i],
          index: index - 1
        });
        await sleep(this.splitTime);
      }
      target = target.children[0];
    }
    return this.audiencesAction2List;
  }


  ////////////////////////*********** audiencesAction2 ***********////////////////////////


  ////////////////////////*********** audiences ***********////////////////////////

  private audiencesSubject = new Subject<any>();

  get audiences$() {
    return this.audiencesSubject.asObservable();
  }

  audiencesResult = [];
  private audiencesResultSubject = new Subject<any>();

  get audiencesResult$() {
    return this.audiencesResultSubject.asObservable();
  }

  funcCheckAudiencesChange(value) {
    recursionChildCheck(value);
    recursionParentCheck(value);
    let array = [];
    this.audiences.forEach(au => {
      array.push(...recursionResult2(au.value.children));
    });
    this.audiencesResult = array;
    this.audiencesResultSubject.next(this.audiencesResult);
    this.resultSubject.next(this.getResult());
  }

  funcRemoveAllAudiences() {
    this.audiences.forEach(au => {
      au.value.checked = false;
      au.value.checkState = 0;
      recursionChildCheck(au.value);
      recursionParentCheck(au.value);
    });
    this.audiencesResult = [];
    this.audiencesResultSubject.next(this.audiencesResult);
    this.resultSubject.next(this.getResult());
  }

  ////////////////////////*********** audiences ***********////////////////////////


  ////////////////////////*********** device ***********////////////////////////

  private deviceSubject = new Subject<any>();

  get device$() {
    return this.deviceSubject.asObservable();
  }

  deviceResult = [];
  private deviceResultSubject = new Subject<any>();

  get deviceResult$() {
    return this.deviceResultSubject.asObservable();
  }

  funcCheckDeviceChange(value) {
    recursionChildCheck(value);
    recursionParentCheck(value);
    let array = [];
    this.device.forEach(au => {
      array.push(...recursionResult2(au.value.children));
    });
    this.deviceResult = array;
    this.deviceResultSubject.next(this.deviceResult);
    this.resultSubject.next(this.getResult());
  }

  funcRemoveAllDevice() {
    this.device.forEach(au => {
      au.value.checked = false;
      au.value.checkState = 0;
      recursionChildCheck(au.value);
      recursionParentCheck(au.value);
    });
    this.deviceResult = [];
    this.deviceResultSubject.next(this.deviceResult);
    this.resultSubject.next(this.getResult());
  }

  ////////////////////////*********** device ***********////////////////////////


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

  init() {

    if(!this.initStatus){
      this.initDirectional$().subscribe(res => {
      }, error => {
      });
    }else{
      this.recursionChildData()
    }

    
  }

  result;

  // 获取结果订阅
  resultSubject = new Subject();

  get result$() {
    return this.resultSubject.asObservable();
  }

  setResult(result = this.result) {
    if(!result) return;
    if(!this.initStatus) return;

    if (result.dtl_address && Object.keys(result.dtl_address).length) {
      recursionFilter(result.dtl_address.area, this.areas.children);
      this.areasResult = recursionResult(this.areas.children);
      this.areasResultSubject.next(this.areasResult);

      recursionFilter(result.dtl_address.lbs, this.lbsCity.children);
      this.lbsCityResult = recursionResult2(this.lbsCity.children);
      this.lbsCityResultSubject.next(this.lbsCityResult);
    }

  }

  getResult() {
    let result = {
      dtl_address: {
        area: [],
        lbs: [],
        type: 1,
        scene_type: 1
      },
      dtl_attribute: {
        crowdAttribute: {
          age: [],
          sex: [],
          education: [],
        }
      },
      dtl_behavior: {
        appCategory: [],
        appAttribute: [],
        filterAppCategory: [],
        filterAppAttribute: [],
      },
      dtl_devices: {
        devicesType: [],
        brand: [],
        mobileOS: [],
        netType: [],
        operators: [],
        browsers: [],
      }
    };

    result.dtl_address.area = this.areasResult.map(ar => ({id: ar.id, name: ar.name}));
    result.dtl_address.lbs = this.lbsCityResult.map(ar => ({id: ar.id, name: ar.name, coords: ar.location_items, type_id: ar.type_id}));

    result.dtl_behavior.appCategory = this.audiencesActionResult.filter(aa => !aa.type_id).map(aa => ({id: aa.id, name: aa.name}));
    result.dtl_behavior.appAttribute = this.audiencesActionResult.filter(aa => aa.type_id).map(aa => ({id: aa.id, name: aa.name}));

    result.dtl_behavior.filterAppCategory = this.audiencesAction2Result.filter(aa => !aa.type_id).map(aa => ({id: aa.id, name: aa.name}));
    result.dtl_behavior.filterAppAttribute = this.audiencesAction2Result.filter(aa => aa.type_id).map(aa => ({id: aa.id, name: aa.name}));

    this.audiences.forEach(ac => {
      let r = recursionResult2(ac.value.children).map(r => r.value);
      switch (ac.key) {
        case 'age': {
          result.dtl_attribute.crowdAttribute.age = r;
          break;
        }
        case 'education': {
          result.dtl_attribute.crowdAttribute.education = r;
          break;
        }
        case 'sex': {
          result.dtl_attribute.crowdAttribute.sex = r;
          break;
        }
      }
    });
    this.device.forEach(ac => {
      let r = recursionResult2(ac.value.children).map(r => r.value);
      switch (ac.key) {
        case 'devices_type': {
          result.dtl_devices.devicesType = r;
          break;
        }
        case 'mobile_brand': {
          result.dtl_devices.brand = r;
          break;
        }
        case 'os': {
          result.dtl_devices.mobileOS = r;
          break;
        }
        case 'net_type': {
          result.dtl_devices.netType = r;
          break;
        }
        case 'operators': {
          result.dtl_devices.operators = r;
          break;
        }
        case 'browsers': {
          result.dtl_devices.browsers = r;
          break;
        }
      }
    });
    return result;
  }

  constructor(private _directionalService: DirectionalService) {
    this.result$.subscribe((data) => {
      this.result = data;
      this.setResult(data)
    });
  }

  //TODO
  initStatus
  nextSubject() {
    console.info('nextSubject')
    // areas
    this.areasResultSubject.next([])
    this.areasSubject.next(this.areas);
    this.areasChildList.push(this.areas.children);
    this.nextAreasChild();
    this.areasChildListSubject.next(this.areasChildList);

    // lbsCity
    this.lbsCityResultSubject.next([])
    this.lbsCitySubject.next(this.lbsCity);
    this.lbsCityList.push(this.lbsCity.children);
    this.funcNextLbsCityChild();
    this.lbsCityListSubject.next(this.lbsCityList);

    // audiencesAction
    this.audiencesActionResultSubject.next([])
    this.audiencesActionSubject.next(this.audiencesAction);
    this.audiencesActionList.push(this.audiencesAction.children);
    this.audiencesActionSplitSubject = new Subject();
    this.audiencesActionSplitSubject.subscribe(data => {
      let {array, index} = data;
      this.audiencesActionList[index].push(...array);
      this.audiencesActionListSubject.next(this.audiencesActionList);
    });
    this.funcNextAudiencesActionChild();

    // audiencesAction2
    this.audiencesAction2ResultSubject.next([])
    this.audiencesAction2Subject.next(this.audiencesAction2);
    this.audiencesAction2List.push(this.audiencesAction2.children);
    this.audiencesAction2SplitSubject = new Subject();
    this.audiencesAction2SplitSubject.subscribe(data => {
      let {array, index} = data;
      this.audiencesAction2List[index].push(...array);
      this.audiencesAction2ListSubject.next(this.audiencesAction2List);
    });
    this.funcNextAudiencesAction2Child();


    this.audiencesSubject.next(this.audiences);

    this.deviceSubject.next(this.device);

    this.initStatus = true;

    this.setResult()
  }

  private recursionChildData() {
    return new Observable(observer => {
      let {age, education, sex} = this.audiencesListData;
      let {browsers, devicesType, brand, netType, operators, mobileOS} = this.deviceListData;
      let recursion = [
        this.recursionChild({children: this.areasData}),
        this.recursionChild({children: this.lbsCityData}),
        this.recursionChild({children: age, name: '年龄'}),
        this.recursionChild({children: education, name: '学历'}),
        this.recursionChild({children: sex, name: '性别'}),
        this.recursionChild({children: this.audiencesActionData}),
        this.recursionChild({children: this.audiencesActionData}),
        this.recursionChild({children: browsers, name: '浏览器'}),
        this.recursionChild({children: devicesType, name: '设备类型'}),
        this.recursionChild({children: brand, name: '设备品牌'}),
        this.recursionChild({children: netType, name: '联网方式'}),
        this.recursionChild({children: operators, name: '运营商'}),
        this.recursionChild({children: mobileOS, name: '操作系统'}),
      ];
      Promise.all(recursion).then(([areas, lbsCity, age, education, sex, audiencesAction, audiencesAction2, browsers, devices_type, mobile_brand, net_type, operators, os]) => {
        let audiences = {age, education, sex};
        let device = {browsers, devices_type, mobile_brand, net_type, operators, os};
        let audiencesList = Object.entries(audiences).map(([key, value]) => ({key, value}));
        let deviceList = Object.entries(device).map(([key, value]) => ({key, value}));

        this.areas = areas;
        this.lbsCity = lbsCity;
        this.audiences = audiencesList;
        this.device = deviceList;
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
}
