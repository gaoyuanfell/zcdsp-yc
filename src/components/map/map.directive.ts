import {Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2} from '@angular/core';
import {loadScript} from '../../service/util';

@Directive({
  selector: '[yc-map]',
  exportAs: 'ycMap'
})
export class MapDirective implements OnInit {

  key = 'cca72e3e21736febbf596a86e25c63a5';
  map;
  contextMenu;
  @Input('searchMap')  searchMap;

  @Input()  set echo(value) {

    if (value && value.coords) {
      let obj ={
        lng:  Number(value.coords.longitude),
        lat:  Number(value.coords.latitude),
        radius:  value.coords.radius
      }
     let marker = this.markerCache.filter( item => {
       if ( (item.getPosition().lng === obj.lng) && (item.getPosition().lat === obj.lat) ) {
          return item;
       }
     })
      let {lng, lat} = marker[0].getPosition();

      this.addressByLnglat([lng, lat]).then((result: any) => {

        this.infoWindow = new AMap.InfoWindow({
          content: ` ${result.regeocode.formattedAddress} `,
          offset: new AMap.Pixel(0, -15),
          position: marker[0].getPosition()
        });
        this.infoWindow.open(this.map);
        // // 关闭详情窗口的时候触发
        this.infoWindow.on('close', () => {   // 这边貌似只能这样拉
          // 后执行的
          marker[0].else_circle.hide();   // 继承的方法？
          marker[0].else_circleEditor.close(); // 编辑半径
        })
        marker[0].else_circle.show();
        marker[0].else_circleEditor.open(); // 编辑半径

      });
    }
  }

  @Output('pushCoordinate') pushCoordinate = new EventEmitter<any>();
  @Output('removeCoordinate') removeCoordinate = new EventEmitter<any>();

  constructor(private ref: ElementRef,
              private renderer: Renderer2) {}
  markerCache = [];  // 全部的标注
  arr = [];
  marker_only;  // 唯一删除
  @Input('marker')  marker;
  ngOnInit(): void {
    loadScript(`//webapi.amap.com/maps?v=1.4.8&key=${this.key}&plugin=AMap.Autocomplete,AMap.PlaceSearch,AMap.PolyEditor,AMap.CircleEditor`).then(() => {

      AMap.plugin('AMap.Geocoder');
      // let first_show = [this.marker[0].coords.longitude, this.marker[0].coords.latitude ];
      // console.log(first_show)
      // 初始化地图
      this.map = new AMap.Map(this.ref.nativeElement, {
        resizeEnable: true,
        center: [121.340121,31.196178],  // 中心点是要改变的
        zoom: 11
      });
      // 创建右键菜单
      this.contextMenu = new AMap.ContextMenu();
      this.contextMenu.addItem('删除标记', (e) => { // 右键删除
        let marker = this.marker_only[0];
        this.markerCache.filter( (item, index) => {
          if( item.getId() === marker.getId()) {
            this.markerCache.splice(index,1)
          }
        })
        if (marker) {
          let {lng, lat} = marker.getPosition();
          this.removeCoordinate.emit({   // 实时校验
            coords: {
              longitude: lng,
              latitude: lat,
            },
            id: marker.getId(),
          });
          this.map.remove(marker);
          if( this.infoWindow) {
            this.infoWindow.close();
          }
        }
      }, 0);


      // 添加标注的时候画圈圈  添加标注的时候默认是半径30
      this.map.on('click', (event) => {
        let {lng, lat} = event.lnglat;
        this.addressByLnglat([lng, lat]).then((result: any) => {
          let obj ={
            coords: {
              longitude: lng,
              latitude: lat,
              radius: 30,
            },
            type_id: 0,
            id: marker.getId(),  // 每一个点都是有id的
            name: result.regeocode.formattedAddress
          }
          this.pushCoordinate.emit(obj);
        });
        let marker = this.addMarker(event.lnglat);  // 添加标注事件
        let radius = 30;  // {}  不能出现常量
        this.markerClickEvent(this.contextMenu, {lng, lat, radius}, marker);
      });

      // 初始化已经存在的地址
      this.marker.map(m => ({lat: m.coords.latitude, lng: m.coords.longitude, radius: m.coords.radius}) ).forEach(m => {
        this.markerClickEvent(this.contextMenu, m);
      });
      this.init();
    });
  }

  addMarker(lnglat) {
    let {lng, lat} = lnglat;
    return new AMap.Marker({
      map: this.map,
      position: [lng, lat]
    });
  }


  // 全局围绕marker

  infoWindow;
  markerClickEvent(contextMenu, lnglat, marker?) {
    let {lng, lat, radius} = lnglat;
    if (!marker) {
      marker = this.addMarker({lng, lat});
      // 初始化已经存在的点
      console.log('%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%')
      console.log(marker)
      console.log(marker.getId())
    }
    this.markerCache.push(marker); // 有所有的标注


    marker.on('rightclick', (event) => {  // 给每一个marker绑定右键事件
      this.marker_only = this.markerCache.filter(item => event.target.getId() === item.getId());  // 找到这个全局的点
      contextMenu.open(this.map, event.lnglat);
      contextMenu.marker = marker;
    });



    marker.on('click', (event) => {  // 点击marker出现详情弹框
      let {lng, lat} = marker.getPosition();
      console.log('不一样的marker')
      console.log(marker)
      this.addressByLnglat([lng, lat]).then((result: any) => {

        this.infoWindow = new AMap.InfoWindow({   // 唯一出现一个
          content: ` ${result.regeocode.formattedAddress} `,
          offset: new AMap.Pixel(0, -15),
          position: marker.getPosition()  // 标注点的位置是唯一的，但是你点击标注点产生的位置不是唯一的，因为这个标注是有
        });
        this.infoWindow.open(this.map);

        this.infoWindow.on('open', () => {   // 这边貌似只能这样拉   先关再开 但是这个事件不起效果
          console.log('窗口打开')
        })

        // this.infoWindow.on('change', () => {   // 这边貌似只能这样拉   先关再开
        //   console.log('属性该百年')
        // })

        // 关闭详情窗口的时候触发
        this.infoWindow.on('close', () => {   // 这边貌似只能这样拉   先关再开
           // 后执行的
          console.log('窗口关闭')
          console.log(marker)
          marker.else_circle.hide();   // 继承的方法？  自动绑定的是上一个marker 虽然说是点击事件先执行
          marker.else_circleEditor.close(); // 编辑半径
        })
        // 点击详情的时候 展示圆
        marker.else_circle.show();
        marker.else_circleEditor.open(); // 编辑半径
      });

    });

    // 不行  因为回显  点击详情时候 初始化该标注点的圈圈
    this.editCircle({lng, lat, radius}, marker);

  }

  // 编辑圆   不能唯一  因为你点开详情窗口 圆展开，但是你没有关闭他，你去点击另一个标注， 那你关闭的就是你点击的另一个标注的窗口哦，这个时候全局就会有问题了
  editCircle({lng,lat,radius}, marker) {
    let editor:any = {};
    editor._circle=( ()=> {
      let circle = new AMap.Circle({
        center: [lng, lat],// 圆心位置
        radius: radius, //半径
        strokeColor: "#F33", //线颜色
        strokeOpacity: 1, //线透明度
        strokeWeight: 3, //线粗细度
        fillColor: "#ee2200", //
        fillOpacity: 0.35//填充透明度
      });
      marker.else_circle = circle; // 给marker添加属性  绑定这个属性
      this.markerCache.filter ( (item) => {
        if (item.getId() === marker.getId()) {
          item.else_circle = circle;
        }
      })
      circle.setMap(this.map);
      circle.hide();  // 原型继承  我咋没看见有这个方法
      return circle;
    })();
    // this.map.setFitView(); // 重新绘制
    editor._circleEditor= new AMap.CircleEditor(this.map, editor._circle);
    marker.else_circleEditor =  editor._circleEditor;
    this.markerCache.filter ( (item, index) => {
      if (item.getId() === marker.getId()) {
        item.else_circleEditor =  editor._circleEditor;
      }
    })
    editor._circleEditor.on('move', ({type, target, lnglat}) => {
      marker.setPosition(lnglat)
      this.infoWindow.setPosition(lnglat)
      this.addressByLnglat([lnglat.lng, lnglat.lat]).then((result: any) => {  // 移动圆心会触发这个事件
        this.infoWindow.setContent(result.regeocode.formattedAddress);
        this.pushCoordinate.emit({
          coords: {
            longitude: lnglat.lng,
            latitude: lnglat.lat,
            radius: target.getRadius(),
          },
          type_id: 0,
          id: marker.getId(),
          name: result.regeocode.formattedAddress,
        });
      });

    })
    editor._circleEditor.on('adjust', ({type, target, radius})=> {  // 移动圆的半径会触发这个事件
      this.addressByLnglat([lng, lat]).then((result: any) => {
        this.pushCoordinate.emit({
          coords: {
            longitude: lng,
            latitude: lat,
            radius: radius,
          },
          type_id: 0,
          id: marker.getId(),
          name: result.regeocode.formattedAddress,
        });
      });

    })
  }



  addressByLnglat(lnglat) {  // 地理编码 封装成一个promise 地址坐标之间的转化
    return new Promise((resolve, reject) => {
      let geocoder = new AMap.Geocoder();
      geocoder.getAddress(lnglat, (status, result) => {
        if (status === 'complete' && result.info === 'OK') {
          resolve(result);  // 状态回来 不可改变
        }
      });
    });
  }

  // 搜索框
 init() {
   let autoOptions = {
     input: this.searchMap
   };
   let auto = new AMap.Autocomplete(autoOptions);
   let placeSearch = new AMap.PlaceSearch({
     map: this.map
   });  //构造地点查询类
   AMap.event.addListener(auto, "select", select);//注册监听，当选中某条记录时会触发
   function select(e) {
     placeSearch.setCity(e.poi.adcode);
     placeSearch.search(e.poi.name);  //关键字查询查询
   }
 }


 // else 开头的是我自己给对象添加的属性


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
