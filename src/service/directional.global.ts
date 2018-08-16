import {Injectable} from '@angular/core';
import {DirectionalService} from './customer/directional.service';
import {Subject} from 'rxjs/index';
import {bufferCount} from 'rxjs/operators';

export interface Directional {
  areas? // 地域
  tier_cities? // 一二线城市
  lbs_scenes? // 场景
  lbs_hot_cities? // 定位城市
  lbs_cities? // 定位城市
  lbs_types? // 商圈
  _lbs_cities?
  _lbs_hot_cities?
  _lbs_scenes?
  _lbs_types_back?
  _directional?
  selectCity?
  chinaResult?
  selectLbsType?
  lbs_types_back?
  _directionalselectLbsType?
  lbsLocations?
  genders?
  educations?
  ages?
  brand?
  browser?
  device_type?
  device_os?
  net_type?
  operators?
  categories?
}

@Injectable(
  {
    providedIn: 'root'  // 这个已经注册到appModule
  }
)
export class DirectionalGlobal {
  constructor(private _directionalService: DirectionalService) {

  }

  private _directional: Directional = {};
  private provincesCities;
  private lbsTypeSceneCities;
  private crowd;
  private device;
  private action;

  get directional(): Directional {
    return this._directional;
  }

  set directional(value: Directional) {
    this._directional = value;
  }

  areas;
  tier_cities;
  genders;
  educations;
  ages;
  brand;
  browser;
  device_type;
  device_os;
  net_type;
  operators;
  categories;
  Promise1;
  Promise2;
  Promise3;
  Promise4;


  init() {

    let countSubscribe = new Subject(); // 计数器

// 地域
    if (!this.provincesCities) {
      this._directionalService.provincesCities().subscribe(res => {
        this.provincesCities = res.result;
        let areasPartition = res.result.areas;

        let areas = {
          children: [].concat(...areasPartition.map(a => a.province_cities))
        };

        this.tier_cities = {
          children: [
            {
              name: '一线',
              children: res.result.tier_cities.first_tier
            },
            {
              name: '二线',
              children: res.result.tier_cities.second_tier
            },
          ]
        };
        Promise.all([this.recursionChild(areas), this.recursionChild(this.tier_cities)]).then(([data1, data2]) => {
          this._directional.areas = data1;
          this._directional.tier_cities = data2;
          countSubscribe.next();
        });

      });
    } else {
      console.log('area');
      countSubscribe.next();
    }

    // LBS
    // if (!this.lbsTypeSceneCities) {
    //   this._directionalService.lbsTypeSceneCities().subscribe(res => {
    //     this._directional._lbs_cities = res.result.lbs_cities;
    //     this._directional._lbs_hot_cities = res.result.lbs_hot_cities;
    //     this._directional._lbs_scenes = res.result.lbs_scenes;
    //     res.result.lbs_types.push({
    //       name: '自定义',
    //       id: 1
    //     });
    //     this._directional._lbs_types_back = res.result.lbs_types;
    //     // 默认选中地域
    //     if (this._directional.lbs_hot_cities instanceof Array && this._directional.lbs_hot_cities.length) {
    //       // this.lbsLocations(this._directional.lbs_hot_cities[0])
    //     }
    //   });
    // } else {
    //   countSubscribe.next()
    // }


    // 人群定向
    if (!this.crowd) {
      this._directionalService.orientationCrowd().subscribe(res => {
        this.crowd = res.result;
        let genders = {
          children: res.result.genders,
        };
        let educations = {
          children: res.result.educations,
        };
        let ages = {
          children: res.result.ages,
        };
        Promise.all([this.recursionChild(genders), this.recursionChild(educations), this.recursionChild(ages)]).then(([data1, data2, data3]) => {
          this._directional.genders = data1;
          this._directional.educations = data2;
          this._directional.ages = data3;
          countSubscribe.next();
        });
        // this.setResult()     // 统一设置

      });
    } else {
      console.log('crowd');
      countSubscribe.next();
    }


// 设备定向

    if (!this.device) {
      this._directionalService.orientationDevice().subscribe(res => {
        this.device = res.result;
        let brand = {
          children: res.result.brand
        };
        let browser = {
          children: res.result.browser
        };
        let device_type = {
          children: res.result.device_type
        };
        let device_os = {
          children: res.result.device_os
        };
        let net_type = {
          children: res.result.net_type
        };
        let operators = {
          children: res.result.operators
        };

        Promise.all([this.recursionChild(brand), this.recursionChild(browser), this.recursionChild(device_type)
          , this.recursionChild(device_os), this.recursionChild(net_type), this.recursionChild(operators)]).then(([data1, data2, data3, data4, data5, data6]) => {
          this._directional.brand = data1;
          this._directional.browser = data2;
          this._directional.device_type = data3;
          this._directional.device_os = data4;
          this._directional.net_type = data5;
          this._directional.operators = data6;
          countSubscribe.next();
        });

      });
    } else {
      console.log('device');
      countSubscribe.next();
    }


    // 行为分类
    if (!this.action) {
      this._directionalService.appCategories().subscribe(res => {
        this.action = res.result;
        let categories = {
          children: res.result
        };
        Promise.all([this.recursionChild(categories)]).then(([data1]) => {
          this._directional.categories = data1;
          countSubscribe.next();
        });
      });
    } else {
      console.log('action');
      countSubscribe.next();
    }

    return countSubscribe.pipe(
      bufferCount(4),
    );
  }


  // lbsLocations(city) {
  //   this._directional.selectCity = city;
  //   if (this._directional.chinaResult[city.id]) {
  //     this._directional.lbs_types = this._directional.chinaResult[city.id];
  //     if (this._directional.lbs_types.length) {
  //       this._directional.selectLbsType = this._directional.lbs_types[0];
  //     }
  //   } else {this._directionalService.lbsLocations({lbs_city_id: city.id}).subscribe(res => {
  //     if (this._directional.chinaResult[city.id]) return;
  //     this._directional.lbs_types = this._directional.chinaResult[city.id] = JSON.parse(JSON.stringify(this._directional.lbs_types_back))
  //     if (this._directional.lbs_types instanceof Array && res.result) {
  //       this._directional.lbs_types.forEach(lbs => {   // 每一个对象进行递归
  //         lbs.children = res.result[lbs.id];
  //
  //         Promise.all([this.recursionChild(lbs)]).then(([data1]) => {
  //           this._directional.areas = data1;
  //           countSubscribe.next()
  //         })
  //         // this.recursionChild(lbs)
  //       });
  //     }
  //   })
  //   }
  // }


  recursionChild(target) {
    return new Promise((resolve, reject) => {
      let fun = `
      onmessage = function (e) {
          function recursionChild(target) {
            let list = target.children;
            if (list && list.length > 0) {
              list.forEach(data => {
                data.parent = target;
                recursionChild(data);
              });
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

  toPromise(observable) {
    return new Promise<any>((resolve, reject) => {
      observable.subscribe(res => {
        resolve(res);
      });
    });
  }


  //   init() {
//
// // 地域
//     if (!this.provincesCities) {
//
//       const readFileAsync = async function () {
//         const f1 = await this._directionalService.provincesCities()
//         f1.subscribe(res => {
//           this.provincesCities = res.result;
//           let areasPartition = res.result.areas;
//
//           this.areas = {
//             children: [].concat(...areasPartition.map(a => a.province_cities))
//           };
//           this.tier_cities = {
//             children: [
//               {
//                 name: '一线',
//                 children: res.result.tier_cities.first_tier} ,
//               {
//                 name: '二线',
//                 children: res.result.tier_cities.second_tier
//               },
//             ]
//           };
//           Promise.all([this.recursionChild( this.areas), this.recursionChild( this.tier_cities)]).then(([data1, data2]) => {
//             this._directional.areas = data1;
//             this._directional.tier_cities = data2;
//             // 处理完递归后
//           })
//         });
//
//       }
//
//       // 地域
//       this._directionalService.provincesCities().subscribe(res => {
//         this.provincesCities = res.result;
//         let areasPartition = res.result.areas;
//
//         this.areas = {
//           children: [].concat(...areasPartition.map(a => a.province_cities))
//         };
//         this.tier_cities = {
//           children: [
//             {
//               name: '一线',
//               children: res.result.tier_cities.first_tier
//             },
//             {
//               name: '二线',
//               children: res.result.tier_cities.second_tier
//             },
//           ]
//         };
//         Promise.all([this.recursionChild( this.areas), this.recursionChild( this.tier_cities)]).then(([data1, data2]) => {
//           this._directional.areas = data1;
//           this._directional.tier_cities = data2;
//           // 处理完递归后
//
//         })
//       });
//
//
//     } else {
//     }
//
//     // LBS
//     // if (!this.lbsTypeSceneCities) {
//     //   this._directionalService.lbsTypeSceneCities().subscribe(res => {
//     //     this._directional._lbs_cities = res.result.lbs_cities;
//     //     this._directional._lbs_hot_cities = res.result.lbs_hot_cities;
//     //     this._directional._lbs_scenes = res.result.lbs_scenes;
//     //     res.result.lbs_types.push({
//     //       name: '自定义',
//     //       id: 1
//     //     });
//     //     this._directional._lbs_types_back = res.result.lbs_types;
//     //     // 默认选中地域
//     //     if (this._directional.lbs_hot_cities instanceof Array && this._directional.lbs_hot_cities.length) {
//     //       // this.lbsLocations(this._directional.lbs_hot_cities[0])
//     //     }
//     //   });
//     // } else {
//     //   countSubscribe.next()
//     // }
//
//
//     // 人群定向
//     if (!this.crowd) {
//       this.Promise2 = this._directionalService.orientationCrowd();
//     } else {
//     }
//
//
// // 设备定向
//
//     if (!this.device) {
//       this.Promise3 = this._directionalService.orientationDevice();
//     } else {
//     }
//
//
//     // 行为分类
//     if (!this.action) {
//       this.Promise4 = this._directionalService.appCategories();
//     } else {
//     }
//
//
//     if (!this.provincesCities || !this.crowd || !this.device || !this.action) {
//       Promise.all([ this.Promise1, this.Promise2, this.Promise3, this.Promise4]).then( ([data1, data2, data3, data4]) => {
//
//         // 人群定向
//         data2.subscribe(res => {
//           this.crowd = res.result;
//           this.genders = {
//             children: res.result.genders,
//           };
//           this.educations = {
//             children: res.result.educations,
//           };
//           this.ages = {
//             children: res.result.ages,
//           };
//
//         });
//         // 设备定向
//         data3.subscribe(res => {
//           this.device = res.result;
//           this.brand = {
//             children: res.result.brand
//           };
//           this.browser = {
//             children: res.result.browser
//           };
//           this.device_type = {
//             children: res.result.device_type
//           };
//           this.device_os = {
//             children: res.result.device_os
//           };
//           this.net_type = {
//             children: res.result.net_type
//           };
//           this.operators = {
//             children: res.result.operators
//           };
//
//         });
//         // // 行为分类
//         data4.subscribe(res => {
//           this.action = res.result;
//           this.categories = {
//             children: res.result
//           };
//         });
//
//
//
//         Promise.all([this.recursionChild( this.areas), this.recursionChild( this.tier_cities),
//           this.recursionChild(this.genders), this.recursionChild(this.educations), this.recursionChild(this.ages),
//           this.recursionChild(this.brand), this.recursionChild(this.browser), this.recursionChild(this.device_type)
//           , this.recursionChild(this.device_os), this.recursionChild(this.net_type), this.recursionChild(this.operators),
//           this.recursionChild(this.categories)
//         ]).then(([data1, data2, data3, data4, data5, data6, data7, data8, data9, data10, data11, data12]) => {
//           this._directional.areas = data1;
//           this._directional.tier_cities = data2;
//           this._directional.genders = data3;
//           this._directional.educations = data4;
//           this._directional.ages = data5;
//           this._directional.brand = data6;
//           this._directional.browser = data7;
//           this._directional.device_type = data8;
//           this._directional.device_os = data9;
//           this._directional.net_type = data10;
//           this._directional.operators = data11;
//           this._directional.categories = data12;
//           return this.directional
//         })
//       })
//
//     } else {
//       return this.directional
//     }
//
//
//
//   }

}
