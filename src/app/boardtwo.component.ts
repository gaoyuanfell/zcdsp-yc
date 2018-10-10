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
      icon:"https://img.zcdsp.com/zcmobi-assets/index/icon1.png",
      name:"10亿+",
      desc:"移动终端"
    },
    {
      icon:"https://img.zcdsp.com/zcmobi-assets/index/icon2.png",
      name:"30亿+",
      desc:"日均流量"
    },
    {
      icon:"https://img.zcdsp.com/zcmobi-assets/index/icon3.png",
      name:"20000+",
      desc:"主流APP资源"
    },
    {
      icon:"https://img.zcdsp.com/zcmobi-assets/index/icon4.png",
      name:"精准",
      desc:"人群定向"
    },
    {
      icon:"https://img.zcdsp.com/zcmobi-assets/index/icon5.png",
      name:"智能推荐",
      desc:"投放策略"
    }
  ]

  @ViewChild('code_template', {read: TemplateRef}) code_template_ref: TemplateRef<any>;
  @ViewChild('containerFull') containerFullRef: ElementRef;
  @ViewChild('imgParent') imgParentRef: ElementRef;
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
  login_show = false;

  ngOnInit() {
    this.scrollSetInterval();


    this.verifyCode();
    // 滚动条在哪里 就监听哪里
    this.renderer.listen(this.containerFullRef.nativeElement, 'scroll', (event) => {

      if (this.containerFullRef.nativeElement.scrollTop > 0 && !this.login_show) {
        this.renderer.removeClass(this.loginRef.nativeElement, 'login_Show')
        this.renderer.addClass(this.loginRef.nativeElement, 'login_Hide')
      }


      // 顶部箭头
      if (this.containerFullRef.nativeElement.scrollTop > 860) {
        this.arrow = true;
      } else {
        this.arrow = false;
      }

      if (this.containerFullRef.nativeElement.scrollTop > 3300) {
           this.renderer.addClass(this.footer.nativeElement, 'footerTransition')
           this.renderer.addClass(this.loginRef.nativeElement, 'loginTransition')

      } else {
        this.renderer.removeClass(this.footer.nativeElement, 'footerTransition')
        this.renderer.removeClass(this.loginRef.nativeElement, 'loginTransition')
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


  // 成功方案
  success_program = [
    [
      {
        'name': 'UC浏览器',
        'icon': 'https://img.zcdsp.com/zcmobi-assets/index/cont3_logo_uc.png',
        'bg': 'http://img.zcdsp.com/common/1f809a7a9ac7e8f2a0c6ab1e9466a32b.jpg',
        'type': 'tool0',
        'index': '0',
        'text': {
          'type': '案例类型：工具类',
          'platform': '投放平台：智橙移动端',
          'cpc': 'CPC成本：0.56 元',
          'act': '激活成本：5 元',
          'cpr':'点击率：8.00%'
        }
      },
      {
        'name': '快手',
        'icon': 'https://img.zcdsp.com/zcmobi-assets/index/cont3_logo_kuai.png',
        'bg': 'http://img.zcdsp.com/common/9ddefeff524898acd2a6992df9a0ee0c.jpg',
        'type': 'tool1',
        'index': '1',
        'text': {
          'type': '案例类型：工具类',
          'platform': '投放平台：智橙移动端',
          'cpc': 'CPA成本：<5元',
          'act':'日均新增用户：500+'
        }
      }
    ],
    [
      {
        'name': '魔域',
        'icon': 'https://img.zcdsp.com/zcmobi-assets/index/cont3_logo_moyu.png',
        'bg': 'http://img.zcdsp.com/common/fdea634cdac8fa30ce468cf34b590829.jpg',
        'type': 'game0',
        'index': '0',
        'text': {
          'type': '案例类型：游戏类',
          'platform': '投放平台：智橙移动端',
          'cpc': 'CPC成本：0.48元',
          'act':'激活成本：39元',
          'cpr':'点击率：1.76%'
        }
      }
    ],
    [
      {
        'name': '饿了么',
        'icon': 'https://img.zcdsp.com/zcmobi-assets/index/cont3_logo_e.png',
        'bg': 'http://img.zcdsp.com/common/af7d5d135a5f7f70f7123214686066bb.jpg',
        'type': 'network0',
        'index': '0',
        'text': {
          'target': '营销目标：通过智橙平台精准广告推送，高效传递品牌信息，有效提升精准度和转化效果，为品牌带来更多有效用户。',
          'type': '案例类型：网服类',
          'platform': '投放平台：智橙移动端',
          'cpc': 'CPC成本：0.38元',
          'act':'激活成本：6元',
          'cpr':'点击率：3.4%'
        }
      },
      {
        'name': '每日优鲜',
        'icon': 'https://img.zcdsp.com/zcmobi-assets/index/cont3_logo_xian.png',
        'bg': 'http://img.zcdsp.com/common/eb3de8e877a9119e92b7ec9d2b131e13.jpg',
        'type': 'network1',
        'index': '1',
        'text': {
          'type': '案例类型：网服类',
          'platform': '投放平台：智橙移动端',
          'cpc': 'CPC成本：0.50元',
          'act':'激活成本：6元',
          'cpr':'点击率：2.50%'
        }
      }
    ],
    [
      {
        'name': '拼多多',
        'icon': 'https://img.zcdsp.com/zcmobi-assets/index/cont3_logo_ping.png',
        'bg': 'http://img.zcdsp.com/common/8a978bbc9e41d2b897c4c7982aa1b50d.jpg',
        'type':'electric0',
        'index': '0',
        'text': {
          'type': '案例类型：电商类',
          'platform': '投放平台：智橙移动端',
          'cpc': 'CPC成本：0.28元',
          'act':'激活成本：5元',
          'cpr':'点击率：3.52%'
        }
      },
      {
        'name': '网易考拉',
        'icon': 'https://img.zcdsp.com/zcmobi-assets/index/cont3_logo_bear.png',
        'bg': 'http://img.zcdsp.com/common/43f3410b2a17eedd8d6201ed059047d9.jpg',
        'type':'electric1',
        'index': '1',
        'text': {
          'type': '案例类型：电商类',
          'platform': '投放平台：智橙移动端',
          'cpc': 'CPC成本：0.30元',
          'act':'激活成本：15元',
        }
      }
    ],
    [
      {
        'name': '拍拍贷',
        'icon': 'https://img.zcdsp.com/zcmobi-assets/index/cont3_logo_pai.png',
        'bg': 'http://img.zcdsp.com/common/d57540d58befc5c680f82f3717734a25.jpg',
        'type':'money0',
        'index': '0',
        'text': {
          'type': '案例类型：金融类',
          'platform': '投放平台：智橙移动端',
          'cpc': 'CPC成本：0.40元',
          'act':'点击率：2.50%',
        }
      },
      {
        'name': '你我贷',
        'icon': 'https://img.zcdsp.com/zcmobi-assets/index/cont3_logo_dai.png',
        'bg': 'http://img.zcdsp.com/common/4899ea625a7a279f6d5f8d8bedb25581.jpg',
        'type':'money1',
        'index': '1',
        'text': {
          'type': '案例类型：金融类',
          'platform': '投放平台：智橙移动端',
          'cpc':' CPC成本：0.30-0.50元',
          'act':'激活成本：10-12元',
          'cpr':'点击率：3.00%-5.00%',
        }
      }
    ],
  ]
  success_obj = this.success_program[0][0];
  success_arr = this.success_program[0];
  scroll_index = 0;
  scrollAdd() {
    clearInterval(this.time);
    this.imgParentRef.nativeElement.style.transform = `translate(0, ${-370 * this.scroll_index}px)`;

  }
  scrollMunus() {
    this.time = setInterval( ()=> {
      this.setIntervalFun();
    }, 1000)
  }
// 切换工具的时候
  change_head(){
    this.scroll_index = 0;
    this.imgParentRef.nativeElement.style.transform = `translate(0, ${-370 * 0}px)`;
  }
  time;
  timeFlag = true;   // 开关
  setIntervalFun() {
    // 2张或者以上图片才滑动
    if(this.success_arr.length > 1) {


      if (this.timeFlag) {
        if(this.scroll_index < this.success_arr.length - 1) {
          this.scroll_index ++;
          this.imgParentRef.nativeElement.style.transform = `translate(0, ${-370 * this.scroll_index}px)`;
        } else {
          this.timeFlag = false;
        }
      } else {
         if (this.scroll_index > 0) {
           this.scroll_index --;
           this.imgParentRef.nativeElement.style.transform = `translate(0, ${-370 * this.scroll_index}px)`;
         } else {
           this.timeFlag = true;
         }
      }
    this.success_obj = this.success_arr[this.scroll_index];
    this.isTrueChild = this.success_obj.type;
    }
  }
  scrollSetInterval() {
    this.time = setInterval( ()=> {
      this.setIntervalFun();
    }, 1000)
  }






}
