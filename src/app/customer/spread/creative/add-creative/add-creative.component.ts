import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ScrollService} from '../../../../../components/back-top/scroll.service';
import {CreativeService} from '../../../../../service/customer/creative.service';
import {Notification} from '../../../../../components/notification/notification';
import {ActivatedRoute, Router} from '@angular/router';
import * as qs from 'querystring';
import {Dialog} from '../../../../../components/dialog/dialog';
import {PublicService} from '../../../../../service/public.service';
import {Global} from '../../../../../service/global';
import {DOCUMENT} from '@angular/common';
import {DirectionalService} from '../../../../../service/customer/directional.service';
import {AppState} from '../../../../../store/model';
import {Store} from '@ngrx/store';
import * as directionalAction from '../../../../../store/actions/directional.action';
import {recursionChild} from '../../../../../service/util';

@Component({
  selector: 'app-add-creative',
  templateUrl: './add-creative.component.html',
  styleUrls: ['./add-creative.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class AddCreativeComponent implements OnInit {

  navList = [
    {
      name: '选择活动',
      status: 2,
      child: [{
        name: '选择活动',
        id: 'tuiguangmubiao',
        status: 2,
      }, {
        name: '落地页',
        id: 'tuiguangmubiao',
        status: 0,
      }]
    }, {
      name: '投放媒体',
      status: 0,
      child: [{
        name: '媒体选择',
        id: 'huodongshezhi',
        status: 0,
      }, {
        name: '创意上传',
        id: 'huodongshezhi',
        status: 0,
      }]
    }, {
      name: '投放应用',
      status: 0,
      child: [{
        name: '应用选择',
        id: 'dingxiangshezhi',
        status: 0,
      }]
    }, {
      name: '出价',
      status: 0,
      child: [
        {
          name: '出价',
          id: 'chujia',
          status: 0,
        }
      ]
    }
  ];

  campaign: any = {};
  campaignList;
  campaign_id;
  show_hours; // 小时
  direction; // 定向
  _valid;

  elementList = [];
  template_size_list = [];
  @ViewChild('toufangmeiti') toufangmeiti;
  @ViewChild('ad_price_ref') ad_price_ref;

  campaignChange(data) {
    this.show_hours = [];
    this.init(data.campaign_id);
  }

  /**
   * 创意上传
   * @param files
   * @param body
   * @param file_index
   * @param data_index
   */
  upload(files, body, data_index, file_index) {
    this._creativeService.creativeUpload({
      file: files[0],
      media_material_id: this.selectMediaSize.media_material_id,
      file_index: file_index,
      data_index: data_index
    }).subscribe(res => {
      let data = res.result;
      let filePath = data.filePath;
      delete data.filePath;
      body[body.name] = `${filePath}?${qs.stringify(data)}`;
      body.validate = true;
      this.changeDetectorRef.markForCheck();
    });
  }

  private creativeNumber = 0;

  /**
   * 添加创意 最多5个
   */
  addCreative = () => {
  };

  elementChange() {
    this.addCreative();
  }

  /**
   * 注册创意添加
   * @param fn
   */
  registerAddCreative(fn) {
    this.addCreative = fn;
  }

  removeCreative(index) {
    this.elementList.splice(index, 1);
  }

  // /////////媒体
  media_search_text;
  media_search_letters;
  material_search_first_char;
  material_search_first_text;
  first_char_list;
  ad_price; // 出价
  private _media_list;
  rec_media_list; // 建议媒体
  rec_media_type = '1';

  /**
   * 获取媒体列表
   * @returns {any}
   */
  get media_list() {
    let list = this._media_list;
    if (this.media_search_text && list instanceof Array) {
      list = list.filter(ml => !!~ml.media_name.toLocaleLowerCase().indexOf(this.media_search_text.toLocaleLowerCase()));
    }
    if (this.media_search_letters && list instanceof Array) {
      list = list.filter(ml => ml.first_char == this.media_search_letters);
    }
    return list;
  }

  set media_list(value) {
    this._media_list = value;
  }

  selectMedia;

  /**
   * 获取媒体筛选条件
   * @returns {any}
   */
  get material_first_char_list() {
    if (this.selectMedia) {
      return this.selectMedia.material_first_char_list;
    }
    return null;
  }

  /**
   * 获取媒体下所有尺寸
   * @returns {any}
   */
  get media_material_list() {
    if (this.selectMedia) {
      let list = this.selectMedia.media_material_list;
      if (this.material_search_first_char && list instanceof Array) {
        list = list.filter(mml => mml.material_first_char == this.material_search_first_char);
      }
      if (this.material_search_first_text && list instanceof Array) {
        list = list.filter(ml => !!~(`${ml.material_width}*${ml.material_height}`).indexOf(this.material_search_first_text));
      }
      if (this.material_search_first_char && list instanceof Array) {
        list = list.filter(mml => mml.material_first_char == this.material_search_first_char);
      }
      return list;
    }
    return null;
  }

  /**
   * 是否需要应用定向
   * @returns {any}
   */
  get is_need_app() {
    if (this.selectMediaSize) {
      return this.selectMediaSize.is_need_app;
    }
    return false;
  }

  /**
   * 获取logo
   * @returns {any}
   */
  getLogoElement() {
    if (this.selectMediaSize) {
      let elements = this.selectMediaSize.elements;
      let logo = elements.logo;
      if (logo) {
        if (logo.logo_size) {
          logo.size = logo.logo_size.split('X');
          logo.extensions = logo.support_file_type.split(',');
        }
      }
      if (logo) {
        logo.logo_src = '';
      }
      return logo;
    }
    return null;
  }

  /**
   * 选择媒体
   */
  changeMedia(media) {
    if (media === this.selectMedia) return;
    this.material_search_first_char = '';

    this.removeElementList();
    this.selectMedia = media;
    if (this.media_material_list instanceof Array) {
      this.changeMediaSize(this.media_material_list[0]);
    }
  }

  /**
   * 新建创意，选择一个媒体模板后，
   * 只要填了内容。切换模板时就提示
   */
  changeMediaTest(media) {
    let flag = false;
    for (let i = 0; i < this.elementList.length; i++) {
      if (this.elementList[i].is_dynamic_words === 1) {  // 是否用作动词
        flag = true;
        break;
      }
      for (let item = 0; item < this.elementList[i].data_list.length; item++) {
        for (let child = 0; child < this.elementList[i].data_list[item].file_list.length; child++) { // 快速制图哪一块的图片
          let file = this.elementList[i].data_list[item].file_list[child];
          let index = child + 1;
          if (file['file_src' + index]) {
            flag = true;
            break;
          }
        }
        if (this.elementList[i].data_list[item].text_list) {
          for (let child1 = 0; child1 < this.elementList[i].data_list[item].text_list.length; child1++) { // title content
            let text = this.elementList[i].data_list[item].text_list[child1];
            if (text['title'] || text['content']) {
              flag = true;
              break;
            }
          }
        }

      }
    }
    if (flag && media !== this.selectMedia) { // 重复点击被选择项
      this._dialog.open('您还没提交，是否放弃当前编辑的内容？', {btn1: '取消', btn2: '确定'}).subscribe(data => {
        if (data) { // 确定
          this.changeMedia(media);
        }
      });
    }
    if (!flag) {
      this.changeMedia(media);
    }
  }

  recMediaChange() {
    this.selectMedia = null;
    this.selectMediaSize = null;
    switch (this.rec_media_type) {
      case '1':
        if (this.rec_media_list instanceof Array && this.rec_media_list.length) {
          this.changeMediaSize(this.rec_media_list[0]);
        }
        break;
      case '2':
        if (this._media_list instanceof Array) {
          this.changeMedia(this._media_list[0]);
        }
        break;
    }
  }


  selectMediaSize;
  adPricePlaceholder;
  default_price_range;
  // element;
  logoElement;

  /**
   * 新建创意，选择一个媒体模板后，
   * 只要填了内容。切换模板时就提示
   */
  changeContentTip(mediaSize) {
    let flag = false;
    if (this.logoElement) {
      if (this.logoElement.logo_src) {  // 最上面那张图片
        flag = true;
      }
    }
    for (let i = 0; i < this.elementList.length; i++) {
      if (this.elementList[i].is_dynamic_words === 1) {  // 是否用作动词
        flag = true;
        break;
      }
      for (let item = 0; item < this.elementList[i].data_list.length; item++) {
        for (let child = 0; child < this.elementList[i].data_list[item].file_list.length; child++) { // 快速制图哪一块的图片
          let file = this.elementList[i].data_list[item].file_list[child];
          let index = child + 1;
          if (file['file_src' + index]) {
            flag = true;
            break;
          }
        }
        if (this.elementList[i].data_list[item].text_list) {
          for (let child1 = 0; child1 < this.elementList[i].data_list[item].text_list.length; child1++) { // title content
            let text = this.elementList[i].data_list[item].text_list[child1];
            if (text['title'] || text['content']) {
              flag = true;
              break;
            }
          }
        }

      }
    }
    if (flag && mediaSize !== this.selectMediaSize) { // 重复点击被选择项
      this._dialog.open('您还没提交，是否放弃当前编辑的内容？', {btn1: '取消', btn2: '确定'}).subscribe(data => {
        if (data) { // 确定
          this.changeMediaSize(mediaSize);
        }
      });
    }
    if (!flag) {
      this.changeMediaSize(mediaSize);
    }
  }

  /**
   * 选择媒体尺寸
   * @param mediaSize
   */
  changeMediaSize(mediaSize) {
    if (mediaSize === this.selectMediaSize) return;

    this.dtlApp = {} // 改变媒体 清除app定向

    this.removeElementList();
    this.showAppAudiences(mediaSize);

    // 判断是否需要 快速制图 和 历史图库
    mediaSize.elements.data_list.forEach(ed => {
      ed.file_list.forEach(fl => {
        let index = this.template_size_list.indexOf(fl.file_size);
        if (index != -1 && mediaSize.is_support_tpl == 'Y') {
          fl.is_support_tpl = true;
        } else {
          fl.is_support_tpl = false;
        }
        if (mediaSize.is_support_history == 'Y') {
          fl.is_support_history = true;
        } else {
          fl.is_support_history = false;
        }
      });
    });

    this.selectMediaSize = mediaSize; // 赋值 被选中的项
    this.logoElement = this.getLogoElement();
    if (mediaSize.is_recommend) {
      this.adPricePlaceholder = `（建议出价${mediaSize.cpc_recommend || '0.00~0.00'} CPC）`;
      this.changeDetectorRef.markForCheck();
    } else {
      /**
       * 媒体尺寸 对应出价
       */
      this._creativeService.recommendPrice({
        media_material_id: mediaSize.media_material_id
      }).subscribe(res => {
        this.adPricePlaceholder = '';
        this.default_price_range = null;
        if (res.result) {
          this.adPricePlaceholder = `（推荐出价${res.result} CPC）`;
          this.default_price_range = res.result.split('~');
        }
        this.changeDetectorRef.markForCheck();
      });
    }

  }

  showAppAudiences(mediaSize) {
    let is_need_app = mediaSize.is_need_app;
    if (!is_need_app) return;
    let media_material_id = mediaSize.media_material_id;
    this._directionalService.directionalNeedAudiences({
      media_material_id: media_material_id
    }).subscribe(res => {
      console.info(res.result);
      recursionChild({children: res.result}).then(result => {
        this.store.dispatch(new directionalAction.AudiencesAppAssign(result));
        this.changeDetectorRef.markForCheck();
      });
    });
  }

  /**
   * logo 上传
   */
  logoChange(files) {
    this._creativeService.logoUpload({
      file: files[0],
      media_material_id: this.selectMediaSize.media_material_id
    }).subscribe(res => {
      let data = res.result;
      let filePath = data.filePath;
      delete data.filePath;
      this.logoElement[this.logoElement.name] = `${filePath}?${qs.stringify(data)}`;
      this.changeDetectorRef.markForCheck();
    });
  }

  imgError(error) {
    this._notification.error('上传', error.message);
  }

  /**
   * 清除创意数据
   */
  removeElementList() {
    this.elementList = [];
    this.selectMediaSize = null;
    this.creativeNumber = 0;
  }

  _audienceCount;

  audienceCount() {
    if (!this.direction) return;
    let body = {
      ...this.direction,
    };
    this._publicService.getAudienceCount(body).subscribe(res => {
      this._audienceCount = res.result || 0;
      this.changeDetectorRef.markForCheck();
    });
  }

  _isNumber(val) {
    return !/^\+?(\d*\.?\d{0,2})$/.test(val);
  }

  valid() {
    this._valid = true;
    if (this.ad_price_ref.invalid || this.ad_price > this.bid_max || this.ad_price < this.bid_min) {
      let chujiaRef = this.document.getElementById('chujia');
      if (chujiaRef) {
        let offsetTop = chujiaRef.offsetTop;
        this._scrollService.scrollTo(this.containerFullRef, {top: offsetTop});
      }
      return true;
    }
  }

  save() {
    if (this.valid()) return;
    let result = [];
    let validate = true;
    this.elementList.every((elements, index) => {
      let element_data: any = {
        campaign_id: this.campaign_id,
        creative_name: elements.creative_name,
        media_id: this.selectMediaSize.media_id,
        material_type_id: this.selectMediaSize.material_type_id,
        material_id: this.selectMediaSize.material_id,
        media_material_id: this.selectMediaSize.media_material_id,
        display_type: this.selectMediaSize.display_type,
        total_type: this.campaign.total_type,
        ad_price: this.ad_price || this.selectMediaSize.default_bottom_price || 0,
        ad_width: this.selectMediaSize.material_width,
        ad_height: this.selectMediaSize.material_height,
        is_dynamic_words: elements.is_dynamic_words ? elements.is_dynamic_words : 0,
        elements: {
          data_list: []
        }
      };
      let element = elements.data_list;

      element.every((ele, inx) => {
        let body = {};
        Object.keys(ele).every(oke => {
          if (ele[oke] instanceof Array) {
            body[oke] = [];
            ele[oke].every(el => {
              body[oke].push({
                [el.name]: el[el.name]
              });
              validate = el.validate;

              // 内容校验
              if (!validate) {
                if (el.element_type === 'img' || el.element_type === 'video') {
                  this._notification.error('创意', `第${index + 1}个创意中第${inx + 1}组素材未上传！`);
                } else {
                  this._notification.error('创意', `第${index + 1}个创意中第${inx + 1}组内容填写有误！`);
                }

                let creativeBox = this.document.getElementById('creative-box');
                if (creativeBox) {
                  let offsetTop = creativeBox.offsetTop;
                  this._scrollService.scrollTo(this.containerFullRef, {top: offsetTop});
                }

              }
              return validate;
            });
          }
          return validate;
        });
        element_data.elements.data_list.push(body);
        return validate;
      });

      let logo = this.selectMediaSize.elements.logo;
      if (logo) {
        element_data.elements.logo = {
          [logo.name]: logo[logo.name]
        };
      }
      result.push(element_data);
      return validate;
    });

    if (!validate) return;

    let body: any = {
      campaign_id: this.campaign_id,
      creative_list: result,
      show_hours: this.show_hours,
    };

    if (this.is_need_app) {
      let dtl_app = {
        appAttribute: [],
        filterAppAttribute: []
      };
      if (this.dtlAppType === 1) {
        dtl_app.appAttribute = this.dtlApp;
      } else {
        dtl_app.filterAppAttribute = this.dtlApp;
      }
      body.directional = {dtl_app};
    }

    this._creativeService.addCreative(body).subscribe(() => {
      this._dialog.open('新建创意成功，是否继续添加？', {btn1: '取消', btn2: '继续添加'}).subscribe(data => {
        if (data) {
          this.elementList.length = 0;
          this.addCreative();
          this.changeDetectorRef.markForCheck();
          this._scrollService.setScrollTopByElement(this._global.containerFullRef, this.document.getElementById('toufangmeiti'))
          // this._scrollService.scrollTo(this._global.containerFullRef, {top: this.toufangmeiti.nativeElement.offsetTop - this.toufangmeiti.nativeElement.clientHeight});
        } else {
          this.router.navigate(['/ads/spread/creative']);
        }
      });
    });
  }

  /////// dtlApp

  dtlApp;
  dtlAppType = 1;

  qRiousImgUrl

  /////////////// 快速导航栏

  get containerFullRef() {
    return this._global.containerFullRef;
  }

  constructor(private _scrollService: ScrollService,
              private _notification: Notification,
              private _global: Global,
              @Inject(DOCUMENT) private document: Document,
              private router: Router,
              private route: ActivatedRoute,
              private store: Store<AppState>,
              private changeDetectorRef: ChangeDetectorRef,
              private _publicService: PublicService,
              private _creativeService: CreativeService,
              private _directionalService: DirectionalService,
              private _dialog: Dialog) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data;
    this.campaign_id = queryParams.campaign_id;
  }

  _campaignShow = false;

  init(campaign_id) {
    this._creativeService.addInit({campaign_id: campaign_id}).subscribe(
      res => {
        this._campaignShow = true;
        this.elementList = [];
        this.template_size_list = res.result.template_size_list.map(ts => {
          return `${ts.width}X${ts.height}`;
        });
        this.campaign = res.result.campaign;
        this.show_hours = res.result.show_hours;
        this.media_list = res.result.media_list;
        this.rec_media_list = res.result.rec_media_list;
        this.first_char_list = res.result.first_char_list;

        if (this.rec_media_list instanceof Array && this.rec_media_list.length) {
          this.changeMediaSize(this.rec_media_list[0]);
        } else {
          if (this._media_list instanceof Array) {
            this.rec_media_type = '2';
            this.changeMedia(this._media_list[0]);
          }
        }

        // 获取覆盖人数
        this.audienceCount();

        let qr = new QRious({
          value: this.campaign.click_link
        });
        this.qRiousImgUrl = qr.toDataURL('image/jpeg');

        this.changeDetectorRef.markForCheck();
      },
      (error) => {
        this.campaign_id = null;
        this._campaignShow = false;
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  bid_min;
  bid_max;

  ngOnInit() {
    this.bid_min = this._global.bid_min;
    this.bid_max = this._global.bid_max;
    this.campaign_id = this.route.snapshot.queryParams.campaign_id;
    if (this.campaign_id) {
      this.init(this.campaign_id);
    }
    this._creativeService.campaignList().subscribe(res => {
      this.campaignList = res.result;
      if(this.campaignList instanceof Array && this.campaignList.length){
        let data = this.campaignList[0]
        this.campaign_id = data.campaign_id
        this.campaignChange(data)
      }
      this.changeDetectorRef.markForCheck();
    });
  }

  operating(overflowRef, clientWidth) {
    this._scrollService.scrollTo(overflowRef, {top: 0, left: overflowRef.scrollLeft + clientWidth});
  }
}
