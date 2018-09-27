import {Directive, ElementRef, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {loadScript} from '../../service/util';

@Directive({
  selector: '[yc-map]',
  exportAs: 'ycMap'
})
export class MapDirective implements OnInit {

  key = 'cca72e3e21736febbf596a86e25c63a5';
  map;
  contextMenu;

  constructor(private ref: ElementRef) {
  }


  arr = [];
  marker_only;  // 唯一删除
  marker = [];
  infoWindow;
  @Input('searchMap')  searchMap;
  @Output('pushCoordinate') pushCoordinate = new EventEmitter<any>();
  @Output('removeCoordinate') removeCoordinate = new EventEmitter<any>();
  @Output('registerEcho') registerEcho = new EventEmitter<any>();
  @Output('registerDel') registerDel = new EventEmitter<any>();
  @Output('registerRemoveMapResult') registerRemoveMapResult = new EventEmitter<any>();


  // 外界删除，地图上消失这个标注
  del(value) {
    if (value) {
      let marker = this.map.getAllOverlays('marker').filter( item => {
        return value.id_random === item.id_random;
      });
      if (marker) {
        this.map.remove(marker);
        if (this.infoWindow) {
          this.infoWindow.close();
        }
      }
    }
  }

  /**
   * 移除所有标注
   */
  removeMapResult() {
    this.marker = [];
    this.arr = [];
    this.marker_only = undefined;
    this.map.clearMap();
  }

 /**
  *  回显
  * */
  echo(value) {
    if (value && value.coords) {
      let obj = {
        lng: Number(value.coords.longitude),
        lat: Number(value.coords.latitude),
        radius: value.coords.radius
      };
      let marker = this.map.getAllOverlays('marker').filter(item => {
        if ((item.getPosition().lng === obj.lng) && (item.getPosition().lat === obj.lat)) {
          return item;
        }
      });
      if (marker && marker.length > 0) {
        let {lng, lat} = marker[0].getPosition();
        this.addressByLnglat([lng, lat]).then((result: any) => {

          this.infoWindow = new AMap.InfoWindow({
            content: ` ${result.regeocode.formattedAddress} `,
            offset: new AMap.Pixel(0, -15),
            position: marker[0].getPosition()
          });
          this.infoWindow.open(this.map);
          this.infoWindow.on('close', () => {
            marker[0].else_circle.hide();
            marker[0].else_circleEditor.close();
          })
          marker[0].else_circle.show();
          marker[0].else_circleEditor.open();

        });
      }
    }
  }


  @Input('markerList') set markerList(value) {
    value.subscribe(data => {
      this.marker = data;
    })
  }

  ngOnInit(): void {
    loadScript(`//webapi.amap.com/maps?v=1.4.8&key=${this.key}&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.PolyEditor,AMap.CircleEditor`).then(() => {
      AMap.plugin('AMap.Geocoder');


      this.map = new AMap.Map(this.ref.nativeElement, {
        resizeEnable: true,
        center: [121.340121,31.196178],
        zoom: 11
      });


      // 创建右键菜单
      this.contextMenu = new AMap.ContextMenu();

      // 右键删除
      this.contextMenu.addItem('删除标记', (e) => {
        let marker = this.marker_only[0];
        if (marker) {
          let {lng, lat} = marker.getPosition();
          this.removeCoordinateFun({lng, lat} , marker);
          this.map.remove(marker);
          if (this.infoWindow) {
            this.infoWindow.close();
          }
        }
      }, 0);


      // 添加标注
      this.map.on('click', (event) => {
        let {lng, lat} = event.lnglat;
        this.addMarkerClick({lng, lat});
      });

      // 初始化已经存在的地址
      if (this.marker && this.marker.length > 0) {
        this.marker.map(m => ({
          lat: m.coords.latitude,
          lng: m.coords.longitude,
          radius: m.coords.radius,
          id_random: m.id_random
        })).forEach(m => {
          this.markerClickEvent(this.contextMenu, m);
        });
      }

      // 不管地图存在否 这个方法都可以
      this.registerDel.emit(this.del.bind(this));
      this.registerEcho.emit(this.echo.bind(this));  // 把这个方法发射出去了
      this.registerRemoveMapResult.emit(this.removeMapResult.bind(this)); // 删除全部

      this.init();
    });
  }

  addMarker({lng, lat}) {
    return new AMap.Marker({
      map: this.map,
      position: [lng, lat]
    });
  }


  /**
   *  添加标注事件
   * */
  addMarkerClick({lng, lat}) {

    this.addressByLnglat([lng, lat]).then((result: any) => {
      marker.id_random = `80${Math.round(Math.random() * 1000000)}`;
      this.pushCoordinateFun( {lng, lat, radius}, marker, result);
    });
    let marker = this.addMarker({lng, lat});
    let radius = 30;
    this.markerClickEvent(this.contextMenu, ({lng, lat, radius}), marker);
  }



  /**
   * 全局围绕marker
   * */

  markerClickEvent(contextMenu, lnglat, marker?) {
    let {lng, lat, radius, id_random} = lnglat;
    if (!marker) {
      marker = this.addMarker({lng, lat});
      marker.id_random = id_random;
    }

    /**
     *  给每一个marker绑定右键事件
     * */
    marker.on('rightclick', (event) => {
      this.marker_only = this.map.getAllOverlays('marker').filter(item => event.target.getId() === item.getId());  // 找到这个全局的点
      contextMenu.open(this.map, event.lnglat);
      contextMenu.marker = marker;
    });


    /**
     * 标注详情
     * */

    marker.on('click', (event) => {  // 点击marker出现详情弹框
      let {lng, lat} = marker.getPosition();
      this.addressByLnglat([lng, lat]).then((result: any) => {

        this.infoWindow = new AMap.InfoWindow({   // 唯一出现一个
          content: ` ${result.regeocode.formattedAddress} `,
          offset: new AMap.Pixel(0, -15),
          position: marker.getPosition()  // 标注点的位置是唯一的，但是你点击标注点产生的位置不是唯一的，因为这个标注是有
        });
        this.infoWindow.on('open', () => {   // 事件 先注册  再调用这个方法  顺序呀
          console.log('窗口打开');
        });
        this.infoWindow.open(this.map);

        // 关闭详情窗口的时候触发
        this.infoWindow.on('close', () => {
          marker.else_circle.hide();
          marker.else_circleEditor.close(); // 编辑半径
        });
        // 点击详情的时候 展示圆
        marker.else_circle.show();
        marker.else_circleEditor.open(); // 编辑半径
      });

    });

    // 不行  因为回显  点击详情时候 初始化该标注点的圈圈
    this.editCircle({lng, lat, radius}, marker);

  }

  /**
   * 编辑圆   不能唯一  因为你点开详情窗口 圆展开，但是你没有关闭他，你去点击另一个标注， 那你关闭的就是你点击的另一个标注的窗口哦，这个时候全局就会有问题了
   * 先开再关的
   * */
  editCircle({lng, lat, radius}, marker) {

    let editor: any = {};
    editor._circle = (() => {
      let circle = new AMap.Circle({
        center: [lng, lat],
        radius: radius,
        strokeColor: '#F33', //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 3, //线粗细度
        fillColor: '#ee2200',
        fillOpacity: 0.35 //填充透明度
      });
      marker.else_circle = circle; // 给marker添加属性  绑定这个属性
      circle.setMap(this.map);
      circle.hide();  // 原型继承
      return circle;
    })();
    editor._circleEditor = new AMap.CircleEditor(this.map, editor._circle);
    marker.else_circleEditor = editor._circleEditor;

    editor._circleEditor.on('move', ({type, target, lnglat}) => {
      // 这边要改变圆心的位置
      lng = lnglat.lng;
      lat = lnglat.lat;
      let radius = target.getRadius();
      marker.setPosition(lnglat);
      this.infoWindow.setPosition(lnglat);
      this.addressByLnglat([lng, lat]).then((result: any) => {  // 移动圆心会触发这个事件
        this.infoWindow.setContent(result.regeocode.formattedAddress);
        this.pushCoordinateFun( {lng, lat, radius}, marker, result);
      });
    });

    editor._circleEditor.on('adjust', ({type, target, radius}) => {  // 移动圆的半径会触发这个事件
      this.addressByLnglat([lng, lat]).then((result: any) => {
        this.pushCoordinateFun({lng, lat, radius}, marker, result)
      });
    })

  }

  /**
   * 增加标注后 发射到父亲
   * */
  pushCoordinateFun({lng, lat, radius}, marker, result) {
    this.pushCoordinate.emit({
      coords: {
        longitude: lng,
        latitude: lat,
        radius: radius,
      },
      type_id: 0,
      id: marker.getId(),
      id_random: marker.id_random,
      name: result.regeocode.formattedAddress,
    });
  }

  /**
   * 删除标注后 发射到父亲
   * */
  removeCoordinateFun({lng, lat}, marker) {
    this.removeCoordinate.emit({
      coords: {
        longitude: lng,
        latitude: lat,
      },
      id: marker.getId(),
      id_random: marker.id_random
    });
  }

  /**
   * 地理变码 把坐标转化成地理位置  promise
   * */
  addressByLnglat(lnglat) {
    return new Promise((resolve, reject) => {
      let geocoder = new AMap.Geocoder();
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          resolve(result);
        }
      });
    });
  }


  /**
   * 搜索框 构造地点查询类
   * */
 init() {
   let autoOptions = {
     input: this.searchMap
   };
   let auto = new AMap.Autocomplete(autoOptions);
   let placeSearch = new AMap.PlaceSearch({
     map: this.map
   });
   AMap.event.addListener(auto, "select", (event)=> {
     if (event.poi.location) {
       let {lng, lat} = event.poi.location;
       this.addMarkerClick({lng, lat})
       this.map.setFitView();
     }
   })
 }


  // else 开头的是我自己给对象添加的属性
  // 操作下来  标注自带的id是会变的  这个字段再一片标注中是不会变的
  // id_random这个字段只是为了父子联系

  // let geocoder = new AMap.Geocoder();
  // geocoder.getAddress([lng, lat], (status, result) => {
  //   if (status === 'complete' && result.info === 'OK') {
  //     let infoWindow = new AMap.InfoWindow({
  //       content: ` ${result.regeocode.formattedAddress} `,
  //       offset: new AMap.Pixel(0, -15),
  //       position: [lng, lat]
  //     });
  //     infoWindow.open(this.map);
  //     marker.infoWindow  = infoWindow; // 开启必须得关
  //   }
  // });

}
