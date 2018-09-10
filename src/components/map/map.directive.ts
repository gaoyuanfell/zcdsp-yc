import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';
import {loadScript} from '../../service/util';

@Directive({
  selector: '[yc-map]',
  exportAs: 'ycMap'
})
export class MapDirective implements OnInit{

  key = 'Om8HV4sWMClGAToMAk5OCV8VqMkSyAZe'
  map

  constructor(
              private ref:ElementRef,
              private renderer: Renderer2){

  }

  arr = [];
  marker_only;
  ngOnInit(): void {
    loadScript(`//webapi.amap.com/maps?v=1.4.8&key=${this.key}`).then(()=> {
      console.info(AMap);
      this.map = new AMap.Map(this.ref.nativeElement, {
        resizeEnable: true,
        center:[116.480983, 39.989628],
        zoom:11
      });
      var contextMenu = new AMap.ContextMenu();  //创建右键菜单
      contextMenu.addItem("删除标记", (e) => {
        console.log(e);
        this.map.remove(this.marker_only[0])
      }, 0);

      // 添加标注
      this.map.on('click', (event) => {
        console.info(event)
        let  marker = this.addMarker(event.lnglat);
        this.arr.push(marker)
        console.log(event.target.content)

        // 给每一个创建的标注增加右键删除功能
        marker.on('rightclick', (event) => {

          this.marker_only = this.arr.filter( item => event.target.getId()=== item.getId())
          contextMenu.open(this.map, event.lnglat);
          contextMenu.marker = marker;
        })

      })





    })
  }

  addMarker(lnglat){
    let {lat, lng} = lnglat;
    return new AMap.Marker({
      map: this.map,
      position: [lng, lat]
    })
  }

}
