import {Directive, ElementRef, OnInit} from '@angular/core';
import {loadScript} from '../../service/util';

@Directive({
  selector: '[yc-map]',
  exportAs: 'ycMap'
})
export class MapDirective implements OnInit{

  key = 'Om8HV4sWMClGAToMAk5OCV8VqMkSyAZe'
  map

  constructor(private ref:ElementRef){

  }

  ngOnInit(): void {
    loadScript(`//webapi.amap.com/maps?v=1.4.8&key=${this.key}`).then(()=> {
      console.info(AMap);
      this.map = new AMap.Map(this.ref.nativeElement, {
        resizeEnable: true,
        center:[116.480983, 39.989628],
        zoom:11
      });

      this.map.on('click', (event) => {
        console.info(event)
        this.addMarker(event.lnglat)
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
