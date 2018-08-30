import {Component, ElementRef, OnInit, Renderer2, ViewChild,} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import {AppState} from '../store/model';
import {ScrollService} from "../service/scroll.service";

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.less']
})
export class BoardComponent implements OnInit {
  @ViewChild('container') containerFullRef: ElementRef;
  @ViewChild('picList') picList: ElementRef;
  @ViewChild('caseMainLeft') caseMainLeft: ElementRef;
  @ViewChild('caseMainRight') caseMainRight: ElementRef;

  constructor(private renderer: Renderer2,
              private _scrollService: ScrollService,) {
  }

  hash = 'home'
  leftTo;
  height;
  topTo;
  background: any = {
    background: 'rgba(255,255,255,0.7)',
    'top.px': 0
  }
  bottom = {
    'bottom.px': 0
  };
  setIntervalNum;
  setInterval1;
  setInterval2;
  currentPic = 0
  num = 0
  user: any = {}
  flags = false;
  ngOnInit(): void {
    this.renderer.listen(this.containerFullRef.nativeElement, 'scroll', (event) => {

      this.background['top.px'] = event.target.scrollTop
      this.bottom = {
        'bottom.px': -event.target.scrollTop
      }

      this.background['background'] = `rgba(255,255,255,${(event.target.scrollTop / 180) * 0.3 + 0.7})`

    })
    this.scrolls()
    this.renderer.listen(this.picList.nativeElement, 'mouseenter', (event) => {
      clearInterval(this.setIntervalNum)
    })
    this.renderer.listen(this.picList.nativeElement, 'mouseleave', (event) => {
      this.scrolls()
    })
    this.renderer.listen('window', 'resize', (res) => {
      console.dir(res.target.innerWidth)
      if (res.target.innerWidth <= 1366) {
        document.getElementById('footer').style.bottom = '10px'
      } else {
        document.getElementById('footer').style.bottom = '0px'
      }
    })
    this.scrolls1()
    this.scrolls2()
    this.renderer.listen(this.caseMainLeft.nativeElement, 'mouseenter', (event) => {
      event.stopPropagation();
      event.preventDefault();
      clearInterval(this.setInterval1)
      clearInterval(this.setInterval2)
    })
    this.renderer.listen(this.caseMainLeft.nativeElement, 'mouseleave', (event) => {
      this.scrolls1()
      this.scrolls2()
    })
    this.renderer.listen(this.caseMainRight.nativeElement, 'mouseenter', (event) => {
      event.stopPropagation();
      event.preventDefault();
      clearInterval(this.setInterval1)
      clearInterval(this.setInterval2)
    })
    this.renderer.listen(this.caseMainRight.nativeElement, 'mouseleave', (event) => {
      this.scrolls1()
      this.scrolls2()
    })
  }

  scrolls() {
    this.setIntervalNum = setInterval(() => {
      this.currentPic++
      if (this.currentPic > 1) {
        this.currentPic = 0
      }
      if (this.currentPic < 1) {
        this.currentPic = 0
      }
      this.leftTo = {
        'left.px': -this.currentPic * 1352
      }
    }, 3000)
  }

  scrolls1() {
    this.setInterval1 = setInterval(() => {
      this.currentPic++
      // console.info(this.currentPic)
      if (this.currentPic > document.querySelector('.imgbox .list').children.length - 1) {
        this.currentPic = 0
      }
      this.height = {
        'top.px': -this.currentPic * 450
      }
    }, 3000)
  }

  scrolls2() {
    this.setInterval2 = setInterval(() => {
      this.currentPic++
      // console.info(this.currentPic)
      if (this.currentPic > document.querySelector('.text-list .list').children.length - 1) {
        this.currentPic = 0
      }
      this.topTo = {
        'top.px': -this.currentPic * 298
      }
    }, 3000)
  }

  changeElement(index) {
    this.num = index
  }

  scrollTop(name) {
    this.hash = name
    this.containerFullRef.nativeElement.scrollTop = `document.getElementById(name).offsetTop - 80px`
    if (name === 'home') {
      this.containerFullRef.nativeElement.scrollTop = 0
      // this._scrollService.scrollTo(this.containerFullRef.nativeElement, {top: 0})
    }
  }

  current(index) {
    this.currentPic = index
    this.leftTo = {
      'left.px': -(index * 1352)
    }
  }

  make() {
    if (!this.user.company || !this.user.name || !this.user.phone) {
      alert('不能为空（必填）')
    } else {
      this.flags = !this.flags
    }
  }
}
