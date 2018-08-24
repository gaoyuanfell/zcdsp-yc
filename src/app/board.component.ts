import {Component, ElementRef, OnInit, Renderer2, ViewChild,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {AppState} from '../store/model';
import * as reducerMenu from '../store/reducer/menu.reducer';
import {ScrollService} from "../service/scroll.service";
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class BoardComponent implements OnInit{
  @ViewChild('container') containerFullRef : ElementRef;
  @ViewChild('picList') picList : ElementRef;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private store: Store<AppState>,
              private renderer:Renderer2,
              private _scrollService:ScrollService,
  ) {
    /*store.pipe(select(reducerMenu.getMenuState)).subscribe(menu => {
      if (menu.menuList && menu.menuList.length > 1) {
        router.navigate([menu.menuList[0].route], {queryParams: {...route.snapshot.queryParams}, replaceUrl: true});
      }
    });*/
  }

  hash = 'home'
  leftTo;
  background={
    background:'rgba(255,255,255,0.7)'
  }
  time = 3000
  currentPic = 0
  ngOnInit(): void {
    this.renderer.listen(this.containerFullRef.nativeElement, 'scroll', (event) => {
        if(event.target.scrollTop > 180){
          this.background={
            background:'rgba(255,255,255,1)'
          }
        }else {
          this.background={
            background:'rgba(255,255,255,0.7)'
          }
        }
    })
    setInterval(() => {
      this.currentPic++
      if(this.currentPic > 1){
        this.currentPic = 0
      }
      this.leftTo={
        'left.px': -this.currentPic * 1352
      }
    },this.time)
    this.renderer.listen(this.picList.nativeElement, 'mouseenter', (event) => {
      console.info(event)
      clearInterval(this.time)
    })
   }
  num = 0
  changeElement(index){
    this.num = index
  }
  scrollTop(name){
    this.hash = name
    this._scrollService.scrollTo(this.containerFullRef.nativeElement, {top:document.getElementById(name).offsetTop-80})
  }
  current(index){
     this.currentPic = index
     this.leftTo={
        'left.px': -(index * 1352)
     }
  }
  make(){

  }

}
