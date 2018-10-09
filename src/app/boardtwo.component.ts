import {Component, ElementRef, Inject, OnDestroy, OnInit, Renderer2, TemplateRef, ViewChild} from '@angular/core';
import {PublicService} from '../service/public.service';
import SparkMD5 from 'spark-md5';
import {ActivatedRoute, Router} from '@angular/router';
import {Dialog} from '../components/dialog/dialog';
import {Notification} from '../components/notification/notification';
import {Global} from '../service/global';
import {fromEvent} from 'rxjs';

import {ScrollService} from '../components/back-top/scroll.service';
import {DOCUMENT} from '@angular/common';
import {filter} from 'rxjs/operators';
import {Observable} from 'rxjs/src/internal/Observable';


@Component({
  selector: 'app-boardtwo',
  templateUrl: './boardtwo.component.html',
  styleUrls: ['./boardtwo.component.less']
})
export class BoardtwoComponent implements OnInit, OnDestroy {
  userName;
  passWord;
  vertCode;
  userTrue;
  passTrue;
  codeTrue;
  vertCodeUrl;
  hash = 'home';
  banngerList:Array<any> = [
    {
      icon:"",
      name:"10亿+",
      desc:"移动终端"
    },
    {
      icon:"",
      name:"30亿+",
      desc:"日均流量"
    },
    {
      icon:"",
      name:"20000+",
      desc:"主流APP资源"
    },
    {
      icon:"",
      name:"精准",
      desc:"人群定向"
    },
    {
      icon:"",
      name:"智能推荐",
      desc:"投放策略"
    }
  ]

  @ViewChild('code_template', {read: TemplateRef}) code_template_ref: TemplateRef<any>;
  @ViewChild('containerFull') containerFullRef: ElementRef;
  @ViewChild('footer') footer: ElementRef;
  @ViewChild('login') loginRef: ElementRef;
  // @ViewChild('containerFull', {read: ElementRef}) containerFull: ElementRef<any>;
  constructor(
    private _publicService: PublicService,
    private router: Router,
    private _dialog: Dialog,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private _notification: Notification,
    private _global: Global,
    private _scrollService: ScrollService,
    private route: ActivatedRoute
  ) { }


  year;
  domain;
  arrow = false;
  keyupEvent;

  ngOnInit() {
    this.verifyCode();
    // 滚动条在哪里 就监听哪里
    this.renderer.listen(this.containerFullRef.nativeElement, 'scroll', (event) => {
      if (this.containerFullRef.nativeElement.scrollTop > 860) {
        this.arrow = true;
      } else {
        this.arrow = false;
      }
      if (this.containerFullRef.nativeElement.scrollTop > 3300) {
           this.renderer.addClass(this.footer.nativeElement, 'footerTransition')
           this.renderer.addClass(this.loginRef.nativeElement, 'loginTransition')
           this.footer.nativeElement.style.transition="all 1s"
            this.loginRef.nativeElement.style.transition="all 1s"

      } else {
        this.renderer.removeClass(this.footer.nativeElement, 'footerTransition')
        this.renderer.removeClass(this.loginRef.nativeElement, 'loginTransition')
        this.footer.nativeElement.style.transition="all 1s"
        this.loginRef.nativeElement.style.transition="all 1s"
      }
    });


     this.year = new Date().getFullYear() + 1
     this.domain=document.domain.split(".");
     this.domain.length > 2 ? this.domain.shift() : this.domain


    this.keyupEvent = fromEvent(this.document, 'keyup').pipe(
      filter((event:KeyboardEvent) => event.keyCode === 13)
    ).subscribe(event => {
      this.loginFun()
    })


    this.route.queryParams.subscribe((params)=> {
      console.log(params)
      if (params.title) {
        this.title = params.title;
        this._scrollService.setScrollTopByElement(this.containerFullRef.nativeElement, document.getElementById(params.title));
      }
      if(params.user_name) {
        this.userName = params.user_name;
      }
    })

  }


  title:string;
  scrollTop(name?) {

    if (!name) {
      this.title = 'home';
      this.router.navigate(['/'], {queryParams:{'title': this.title}})
      this._scrollService.scrollTo(this.containerFullRef.nativeElement, {left: 0, top: 20});
    } else {
      this.router.navigate(['/'], {queryParams:{'title': this.title}})
      this._scrollService.setScrollTopByElement(this.containerFullRef.nativeElement, name);
    }

  }

  userData() {
    this.userTrue = !this.userName
  }

  passData() {
    this.passTrue = !this.passWord
  }

  codeData() {
    this.codeTrue = !this.vertCode
  }
  /**
   * 客户预约
   * */
  companyTrue;
  customerTrue;
  phoneTrue;
  // 预约
  company_name;
  customer_name;
  phone;
  companyData() {
    this.companyTrue = !this.company_name
  }

  customerData() {
    this.customerTrue = !this.customer_name
  }

  phoneData() {
    let str = /^1\d{10}$/;
    this.phoneTrue = !str.test(this.phone);
  }

  verifyCode() {
    let obj = {
      _: Date.now(),
      w: 90,
      h: 34
    };
    this.vertCodeUrl = this._publicService.verifyCode(obj);
    console.log(this.vertCodeUrl)
  }

  loginFun() {
    this.userTrue = !this.userName;
    this.passTrue = !this.passWord;
    this.codeTrue = !this.vertCode;

    if (this.userTrue || this.passTrue || this.codeTrue) return;

    this._publicService.login({
      username: this.userName,
      password: SparkMD5.hash(this.passWord),
      veritycode: this.vertCode
    }).subscribe(res => {
      if (res.success === 200) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/']);
      }
    })
  }

  /**
   * 点击预约的时候
   * */

  error;
  errorText;
  _valid = false;
  order() {
    this._valid = false;
    this.img_code = '';
    this.imgCode_vertify();
    this._dialog.open(this.code_template_ref, {title: '请您输入图形验证码', flag: true, async: true}).subscribe((data: any) => {
      // 点击确定后 触发
      //
      if (data && this.img_code) {
        this._valid = true;
        let obj = {
          company_name: this.company_name,
          img_code: this.img_code,
          customer_name: this.customer_name,
          phone: this.phone
        };
        this._publicService.customer(obj).subscribe(res => {
          if (res.success === 200) {
            data();
            this._notification.success('预约成功！', ' ');
            // 数据清空
            this.company_name = '';
            this.customer_name = '';
            this.phone = '';
            this.img_code = ''
          }
        }, error => {  // 这边做了处理 前端是抛出异常
          this.error = error.errorList[0]._code;
          this.errorText = error.errorList[0]._description;
        });
      }
    });
  }

  number = 0;
  codeUrl;
  img_code;
  imgCode_vertify() {
    ++this.number;
    if (document.getElementById('freshen')) {
      this.renderer.setStyle(document.getElementById('freshen'), 'transform', `rotate(${this.number * 360}deg)`);
    }
    let obj = {
      _: Date.now(),
      w: 500,
      h: 45
    };
    this.codeUrl = this._publicService.verifyCode(obj);
  }

  isTrue: string = 'tool';
  isTrueChild: string = 'tool0';

  ngOnDestroy(): void {
    this.keyupEvent.unsubscribe()
  }
}