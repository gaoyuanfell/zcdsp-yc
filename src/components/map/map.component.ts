import {Component, EventEmitter, forwardRef, Input, OnInit, Output, Renderer2, ViewChild} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';


// 首先注册成为表单控件
const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MapComponent),
  multi: true
};

@Component({
  selector: 'yc-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class MapComponent implements OnInit, ControlValueAccessor {

  constructor(
    private renderer: Renderer2
  ) {
  }

  @ViewChild('allmap') allmap;
  @ViewChild('suggestId') suggestId;


  arrCoordinate: any;

  ngOnInit() {
    this.init();
  }

  @Input('city') city;
  @Output('pushCoordinate') pushCoordinate = new EventEmitter<any>();
  @Output('removeCoordinate') removeCoordinate = new EventEmitter<any>();
  map;
  geoc;
  myValue;

  //  删除标注事件
  private removeMarker(marker) {
    //  marker.closeInfoWindow();
    this.map.closeInfoWindow();   // 谁开的  谁关
    this.map.removeOverlay(marker);

    // this.arrCoordinate.find((item, index): boolean => {
    //   let flag = item.X === marker.point.lng && item.Y === marker.point.lat;
    //   if (flag) {
    //     this.arrCoordinate.splice(index, 1);
    //   }
    //   return flag;
    // });

    this.removeCoordinate.emit({
      coords:{
        longitude:marker.point.lng,
        latitude:marker.point.lat,
      }
    })
  }

  // 搜索框处理
  local;

  setPlace() {
    this.map.clearOverlays();
    this.local = new BMap.LocalSearch(this.map, { // 智能搜索
      onSearchComplete: this.myFun.bind(this)
    });
    this.local.search(this.myValue);
  }

  private myFun() {
    let pp = this.local.getResults().getPoi(0).point;    // 获取第一个智能搜索的结果
    this.map.centerAndZoom(pp, 18);
    let marker = new BMap.Marker(pp);
    this.map.addOverlay(marker);    // 添加标注
    // 将标注
    this.geoc.getLocation(pp, (rs) => {
      // 弹框显示详细信息
      this.getLocationOpen(pp, rs);
      this.arrCoordinate.push({
        lbslocationName: rs.surroundingPois.length === 0 ? rs.address : rs.surroundingPois[0].title,
        X: pp.lng,
        Y: pp.lat
      });
    });
    // 创建右键菜单  给每一个标注添加右键删除事件
    let markerMenu = new BMap.ContextMenu();   // 给每一个标注加事件  每次都要new一个新的对象 ！！！！
    markerMenu.addItem(new BMap.MenuItem('删除', this.removeMarker.bind(this, marker)));
    marker.addContextMenu(markerMenu);

    // 鼠标移上去 显示详情
    this.renderer.listen(marker, 'click', (e) => {  // 与父亲的click事件不冲突  取消冒泡 封装后e改变了
      e.domEvent.stopPropagation();
      e.domEvent.preventDefault();
      this.geoc.getLocation(pp, (rs) => {
        this.getLocationOpen(pp, rs);
      });
    });
  }

  init() {
    this.map = new BMap.Map(this.allmap.nativeElement);    // 创建Map实例
    let  point = new BMap.Point(116.404, 39.915);
    this.map.centerAndZoom(point, 15);  // 初始化地图,设置中心点坐标和地图级别  里的11是地图缩放级别，数字越大， 搜索的范围越大，
    this.map.enableScrollWheelZoom(true);     // 开启鼠标滚轮缩放
    this.geoc = new BMap.Geocoder();  // 获取标注的地址对象

    // 建立一个自动完成的对象  搜索
    let ac = new BMap.Autocomplete(
      {
        'input': this.suggestId.nativeElement,
        'location': this.map,
      }
    );
    // 鼠标点击下拉列表后的事件
    this.renderer.listen(ac, 'confirm', (e) => {
      let _value = e.item.value;
      this.myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
      this.setPlace();
    });

    // 点击事件 添加标注
    this.renderer.listen(this.map, 'click', (e) => {
      let pt = e.point;
      let point = new BMap.Point(pt.lng, pt.lat);
      let marker = new BMap.Marker(point);  // 创建标注
      this.map.addOverlay(marker);               // 将标注添加到地图中

      // 我在点击详情的时候就会顺带给每一个标注添加详情
      this.renderer.listen(marker, 'click', (e) => {
        e.domEvent.stopPropagation();
        e.domEvent.preventDefault();
        this.geoc.getLocation(pt, (rs) => {
          this.getLocationOpen(pt, rs);
        });
      });

      // 创建右键菜单  给每一个标注添加右键删除事件
      let markerMenu = new BMap.ContextMenu();   // 给每一个标注加事件  每次都要new一个新的对象 ！！！！
      markerMenu.addItem(new BMap.MenuItem('删除', this.removeMarker.bind(this, marker)));  // this 传递参数  这边一定要绑定this
      marker.addContextMenu(markerMenu);
      // 获取标注的名字和地址   回调 异步 操作写在回调里面
      this.geoc.getLocation(pt, (rs) => {
        // 弹框处理
        this.getLocationOpen(pt, rs);

        // this.arrCoordinate.push({
        //   lbslocationName: rs.surroundingPois.length === 0 ? rs.address : rs.surroundingPois[0].title,
        //   X: pt.lng,
        //   Y: pt.lat
        // });

        this.pushCoordinate.emit({
          coords:{
            longitude:pt.lng,
            latitude:pt.lat,
            radius: 30,
          },
          type_id:0,
          id:`80${Math.round(Math.random()* 1000000)}`,
          name: rs.surroundingPois.length === 0 ? rs.address : rs.surroundingPois[0].title,
        })

      });
    });
  }

  // 弹框处理
  private getLocationOpen(pp, rs) {
    let opts = {
      offset: {
        width: 0,
        height: -20,
      },
      width: 200,     // 信息窗口宽度
      height: 100,     // 信息窗口高度
      title: rs.surroundingPois.length === 0 ? '' : rs.surroundingPois[0].title, // 信息窗口标题
    };
    let str = '<br/>地址：' + rs.address + '<br/>经纬度：( ' + pp.lng + ',' + pp.lat + ')';
    let infoWindow = new BMap.InfoWindow(str, opts);  // 创建信息窗口对象
    this.map.openInfoWindow(infoWindow, pp); // 开启信息窗口
  }


  onChange = (value) => {
  };

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {

  }

  writeValue(obj: any): void {
    this.arrCoordinate = obj;
  }

}
