import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Notification} from '../../../../../components/notification/notification';
import {ActivatedRoute, Router} from '@angular/router';
import {ScrollService} from '../../../../../components/back-top/scroll.service';
import {CreativeService} from '../../../../../service/customer/creative.service';
import {Dialog} from '../../../../../components/dialog/dialog';
import * as qs from 'querystring';
import {CreativeBoxComponent} from '../../../../../components/creative-box/creative-box.component';
import {PublicService} from '../../../../../service/public.service';
import {Global} from '../../../../../service/global';
import * as directionalAction from '../../../../../store/actions/directional.action';
import {recursionChild} from '../../../../../service/util';
import {DirectionalService} from '../../../../../service/customer/directional.service';
import {AppState} from '../../../../../store/model';
import {Store} from '@ngrx/store';

@Component({
  selector: 'app-edit-creative',
  templateUrl: './edit-creative.component.html',
  styleUrls: ['./edit-creative.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class EditCreativeComponent implements OnInit {

  id;

  show_hours;

  creative: any = {};

  elementList = [];

  elements;
  selectMediaSize;
  value;

  @ViewChild('ad_price') ad_price;

  @ViewChild('creativeBox', {read: CreativeBoxComponent}) set creativeBoxRef(ref: CreativeBoxComponent) {
    if (!ref) return;
    ref.setValue([this.value]);
  }

  logoChange(files) {
    this._creativeService.logoUpload({
      file: files[0],
      media_material_id: this.creative.media_material_id
    }).subscribe(res => {
      let data = res.result;
      let filePath = data.filePath;
      delete data.filePath;
      this.elements.logo[this.elements.logo.name] = `${filePath}?${qs.stringify(data)}`;
      this.changeDetectorRef.markForCheck();
    });
  }

  imgError(error) {
    this._notification.error('上传', error.message);
  }

  upload(files, body, file_index, data_index) {
    this._creativeService.creativeUpload({
      file: files[0],
      media_material_id: this.creative.media_material_id,
      file_index: file_index,
      data_index: data_index
    }).subscribe(res => {
      let data = res.result;
      let filePath = data.filePath;
      delete data.filePath;
      body[body.name] = `${filePath}?${qs.stringify(data)}`;
      this.changeDetectorRef.markForCheck();
    });
  }

  directional;
  template_size_list;
  is_need_app;
  dtlApp;
  dtlAppType = 1;

  init(creative_id) {
    this._creativeService.updateInit({creative_id: creative_id}).subscribe(
      res => {
        this.template_size_list = res.result.template_size_list.map(ts => {
          return `${ts.width}X${ts.height}`;
        }) || [];
        this.is_need_app = res.result.is_need_app;

        this.creative = res.result.creative;
        this.show_hours = res.result.show_hours;
        this.directional = res.result.directional;

        if (this.is_need_app) {
          let dtl_app = this.directional.dtl_app;
          if (dtl_app) {
            this.dtlApp = dtl_app.appAttribute;
            if (dtl_app.filterAppAttribute instanceof Array && dtl_app.filterAppAttribute.length) {
              this.dtlApp = dtl_app.filterAppAttribute;
              this.dtlAppType = 2;
            }
          }

          this._directionalService.directionalNeedAudiences({
            media_material_id: this.creative.media_material_id
          }).subscribe(res => {
            recursionChild({children: res.result}).then(result => {
              this.store.dispatch(new directionalAction.AudiencesAppAssign(result));
            });
          });

        }


        this.elements = res.result.creative.material_elements;
        this.elements.data_list.forEach(ed => {
          ed.file_list.forEach(fl => {
            let index = this.template_size_list.indexOf(fl.file_size);
            if (index != -1 && this.creative.is_support_tpl == 'Y') {
              fl.is_support_tpl = true;
            } else {
              fl.is_support_tpl = false;
            }
            if (this.creative.is_support_history == 'Y') {
              fl.is_support_history = true;
            } else {
              fl.is_support_history = false;
            }
          });
        });

        this.selectMediaSize = {
          media_material_id: this.creative.media_material_id
        };
        this.elements.is_dynamic_words = res.result.creative.is_dynamic_words;
        this.elements.creative_name = res.result.creative.creative_name;
        this.value = res.result.creative.elements;

        if (this.elements.logo) {
          this.elements.logo[this.elements.logo.name] = this.value.logo[this.elements.logo.name];
        }
        // 获取覆盖人数
        // this.audienceCount();
        this.changeDetectorRef.markForCheck();
      }
    );
  }

  _isNumber(val) {
    return !/^\+?(\d*\.?\d{0,2})$/.test(val);
  }

  _audienceCount;

  audienceCount() {
    if (!this.directional) return;
    let body = {
      ...this.directional,
    };
    this._publicService.getAudienceCount(body).subscribe(res => {
      this._audienceCount = res.result || 0;
      this.changeDetectorRef.markForCheck();
    });
  }

  _valid;

  get containerFullRef() {
    return this._global.containerFullRef;
  }

  @ViewChild('chujia') chujia;

  save() {
    this._valid = true;
    if (this.ad_price.invalid || this.creative.ad_price > this.bid_max || this.creative.ad_price < this.bid_min) {
      this._scrollService.setScrollTopByElement(this.containerFullRef, document.getElementById('chujia'));
      return;
    }
    // if (!/^\+?(\d*\.?\d{0,2})$/.test(this.creative.ad_price) || !this.creative.ad_price) return;
    let elements = this.elementList[0];
    if (!elements) return;

    let element_data: any = {
      creative_id: this.id,
      campaign_id: this.creative.campaign_id,
      creative_name: elements.creative_name,
      ad_price: this.creative.ad_price,
      is_dynamic_words: elements.is_dynamic_words ? elements.is_dynamic_words : 0,
      elements: {
        data_list: []
      }
    };
    if (!elements.creative_name) {
      this._notification.error('创意', `创意名称不能为空！`);
      this._scrollService.setScrollTopByElement(this.containerFullRef, document.getElementById('chuangyi'));
      return;
    }

    let element = elements.data_list;

    if (!element) return;

    let validate = true;

    element.every(ele => {
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
                this._notification.error('创意', `素材未上传！`);
              } else {
                this._notification.error('创意', `内容填写有误！`);
              }
              this._scrollService.setScrollTopByElement(this.containerFullRef, document.getElementById('chuangyi'));
            }
            return validate;
          });
        }
        return validate;
      });
      element_data.elements.data_list.push(body);
      return validate;
    });

    if (!validate) return;

    let logo = this.elements.logo;
    if (logo) {
      element_data.elements.logo = {
        [logo.name]: logo[logo.name]
      };
    }

    let flag = this.show_hours.some(item => !!item);
    if (!flag) {
      this._scrollService.scrollTo(this.containerFullRef, {top: 0});
      this._notification.error('提示', '投放小时不能为空！');
      return;
    }
    let body = {
      creative: element_data,
      show_hours: this.show_hours,
      directional: this.directional,
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


    this._creativeService.editSave(body).subscribe(res => {
      this.router.navigate(['/ads/spread/creative']);
    });
  }

  constructor(private _scrollService: ScrollService,
              private _notification: Notification,
              private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private store: Store<AppState>,
              private _creativeService: CreativeService,
              private _publicService: PublicService,
              private _directionalService: DirectionalService,
              private _global: Global,
              private _dialog: Dialog) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data;
    this.id = params.id;
    this.init(this.id);
  }

  bid_min;
  bid_max;

  ngOnInit() {
    this.bid_min = this._global.bid_min;
    this.bid_max = this._global.bid_max;
  }

}
