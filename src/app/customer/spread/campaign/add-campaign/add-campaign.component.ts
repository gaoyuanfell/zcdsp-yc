import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {CampaignService} from '../../../../../service/customer/campaign.service';
import {Subject} from 'rxjs';
import {Notification} from '../../../../../components/notification/notification';
import {Dialog} from '../../../../../components/dialog/dialog';
import {DirectionalService} from '../../../../../service/customer/directional.service';
import {PublicService} from '../../../../../service/public.service';
import {Global} from '../../../../../service/global';
import {Util} from '../../../../../service/util-service';
import {DecimalPipe, DOCUMENT} from '@angular/common';
import {ScheduleComponent} from '../../../../../components/schedule/schedule.component';
import {TemplateService} from '../../../../../service/template.service';
import {environment} from '../../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {debounceTime} from 'rxjs/operators';
import {ScrollService} from '../../../../../service/scroll.service';

export interface CampaignModel {
  campaign_id?: number,
  // orientation?: any, // 定向
  // direction?: any, // 定向
  campaign_name?: string, // 活动名称
  day_budget?: number, // 每日预算
  speed?: string, // 投放速度
  ad_price?: number, // 广告出价
  begin_date?: string, // 投放开始日期
  end_date?: string, // 投放结束日期
  show_time_type?: string, // 投放时间类型
  click_type?: string, // 落地页类型值
  click_link?: string, // 落地页
  template_id?: string, // 落地页ID
  target_type?: string, // 推广类型
  show_hours?: Array<any>, // 活动投放小时
  frequency?: number, // 频次
  app_store_id?: string, // 应用市场
  app_package_type?: string, // app包类型
  app_bundle_id?: string, // app包类型
  app_package_name?: string, // app包类型
  app_channel_package_name?: string, // 渠道包名
  app_name?: string, // APP包名
  app_version?: string, // APP版本
  app_size?: number, // APP大小
  app_file_byte?: string, // APP大小
  app_upload_url?: number, // 针对特殊处理的账号上传的APK地址
  app_description?: string, // APP包名
  app_file_md5?: string, // app文件流md5
  download_link?: string, // APP下载地址
  is_pack_link?: string, // APP下载地址
}

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,  // 数据手动刷新
  preserveWhitespaces: true,
})
export class AddCampaignComponent implements OnInit,OnDestroy {

  id;

  _isEdit;
  _valid;

  campaignTimes;

  campaign: CampaignModel = {
    is_pack_link: 'N',
    speed: '1', // 投放速度
    show_time_type: '0', // 投放时间类型
    click_type: '2', // 落地页类型值
    target_type: '1', // 推广类型
    app_store_id: '1', // 应用市场
    app_package_type: '1', // app包类型
    show_hours: [],
    frequency: 3,
  }; // 活动提交对象

  orientation: any; // 定向
  directional: any; // 定向
  package_name; // 定向包名
  orientation_packages; // 定向包下拉
  is_need_package;

  target_types; // 推广类型
  app_stores; // 下载方式
  speeds; // 投放速度
  show_time_types; // 投放小时
  landingpage_types; // 落地页
  frequencyList = []; // 投放频次
  jurisdiction;
  authUser;
  templateList; // 落地页下拉数据

  templateUrl = environment.TEMPLATE; // 落地页地址

  private _timeSchedule: ScheduleComponent;

  get timeSchedule() {
    return this._timeSchedule;
  }

  @ViewChild('timeSchedule', {read: ScheduleComponent}) set timeSchedule(value) {
    console.dir(value);
    this._timeSchedule = value;
  }

  _isNumber(val) {
    return !/^\+?(\d*\.?\d{0,2})$/.test(val);
  }

  _isNumber2(val) {
    return !/^\+?(\d*\.?\d{0,9})$/.test(val);
  }

  _targetTypeChange() {
    delete this.campaign.click_link;
    delete this.campaign.download_link;
    this.campaign.app_store_id = '1';
    this.campaign.app_package_type = '1';
    delete this.campaign.app_bundle_id;

    delete this.campaign.app_package_name;
    delete this.campaign.app_channel_package_name;

    delete this.campaign.app_name;
    delete this.campaign.app_description;
    delete this.campaign.app_size;
    delete this.campaign.app_version;
  }

  _landingChange() {
    delete this.campaign.click_link;
    delete this.campaign.template_id;
    this._previewCodeUrl = null;
  }

  _appStoreIdChange() {
    this.campaign.app_package_type = '1';
    delete this.campaign.app_bundle_id;
    delete this.campaign.app_channel_package_name;
  }

  _appPackageTypeChange() {
    delete this.campaign.app_channel_package_name;
  }

  /**
   * apk上传
   */
  uploadParseApk(uploadData) {
    this._campaignService.apkExisted({
      md5: uploadData.md5
    }).subscribe(res => {
      if (res.result.is_existed) {
        this.setAppInfo(res.result.apk_info);
      } else {
        uploadData.upload();
      }
    });

    uploadData.chunkNext.subscribe(data => {
      this._campaignService.uploadParseApk({
        file: data.files[0],
        chunk: data.chunk,
        chunk_size: data.chunk_size,
        chunks: data.chunks,
        guid: data.md5
      }).subscribe(res => {
        if (res.result.is_uploaded && res.result.is_all_uploaded) {
          if (res.result.apk_info) {
            this.setAppInfo(res.result.apk_info);
          } else {
            this.setAppInfo({});
          }
        } else {
          this._notification.error(res.result.msg, '');
        }
      });
    });
  }

  setAppInfo(result) {
    this.campaign.app_name = result.app_name;
    this.campaign.app_description = result.description;
    this.campaign.app_size = this._util.pipes(result.file_size / 1024 / 1024 || 0, [{transform: DecimalPipe}]);
    this.campaign.app_file_byte = String(result.file_size || '');
    this.campaign.app_file_md5 = result.md5;
    this.campaign.app_package_name = result.package_name;
    this.campaign.app_version = result.version;
    this.campaign.app_upload_url = result.upload_url;
  }

  _appIdSubject = new Subject<any>();

  /*1053012308*/
  parseIos() {
    this._campaignService.parseIos({appid: this.campaign.app_bundle_id}).subscribe(
      res => {
        this.setAppInfo(res.result);
      },
      () => {
        this.setAppInfo({});
      }
    );
  }

  _audienceCount;

  audienceCount() {
    // let body = {
    //   ...this.orientation,
    // };
    // delete  body.dtl_address.selected_lbs_locations;
    // delete  body.dtl_address.selected_lbs_location_details;
    // this._publicService.getAudienceCount(body).subscribe(res => {
    //   this._audienceCount = res.result || 0;
    // });
  }

  get containerFullRef() {
    return this._global.containerFullRef;
  }

  valid() {
    this._valid = true;
    if (!this.campaign.campaign_name) {
      // this._scrollService.scrollTo(this.containerFullRef, {top: 0});
      return true;
    }
    if (this._isNumber(this.campaign.day_budget) || !this.campaign.day_budget) {
      // this._scrollService.scrollTo(this.containerFullRef, {top: 0});
      return true;
    }
    if (+this.campaign.day_budget < 100) {
      // this._scrollService.scrollTo(this.containerFullRef, {top: 0});
      this._notification.warning('提示', '预算不能小于100元');
      return true;
    }
    if (!this.campaign.begin_date) {
      // this._scrollService.scrollTo(this.containerFullRef, {top: 0});
      return true;
    }
    if (this.campaign.show_time_type === '1') {
      let flag = this.campaign.show_hours.some(item => !!item);
      if (!flag) {  // 当用户选择时间段没有选择某一格的时候，提示用户
        this._notification.error('提示', '投放小时不能为空！');
        // this._scrollService.scrollTo(this.containerFullRef, {top: 0});
        return true;
      }
    }
    if (this.campaign.target_type == '1') {
      if (this.campaign.click_type == '2') {
        if (!this.campaign.click_link) {
          // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
          return true;
        }
      }
    }
    if (this.campaign.target_type == '2') {
      if (!this.campaign.download_link) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
      if (this.campaign.app_store_id == '1') {
        if (!this.campaign.app_bundle_id) {
          // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
          return true;
        }
        if (this.campaign.app_package_type == '2') {
          if (!this.campaign.app_channel_package_name) {
            // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
            return true;
          }
        }
      }
      if (!this.campaign.app_package_name) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
      if (!this.campaign.app_name) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
      if (!this.campaign.app_version) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
      if (this._isNumber2(this.campaign.app_size) || !this.campaign.app_size) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
    }
    if (this.campaign.target_type == '3') {
      if (!this.campaign.download_link) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
      if (!this.campaign.app_bundle_id) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
      if (!this.campaign.app_package_name) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
      if (!this.campaign.app_name) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
      if (!this.campaign.app_version) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
      if (!this.campaign.app_size) {
        // this._scrollService.scrollTo(this.containerFullRef, {top: 430});
        return true;
      }
    }

    if (this._isNumber(this.campaign.ad_price) || !this.campaign.ad_price || this.campaign.ad_price > this.bid_max || this.campaign.ad_price < this.bid_min) {
      // let chujiaRef = this.document.getElementById('chujia')
      // if (chujiaRef) {
      //   this._scrollService.scrollTo(this.containerFullRef, {top: chujiaRef.offsetTop});
      // }
      return true;
    }
  }


  save(type) {
    if (this.valid()) return;
    let body: any = {
      campaign:this.campaign
    }

    if(this.directional){
      body.directional = this.directional
    }

    this._campaignService.save(body).subscribe((res) => {
      this._notification.success('提示', '提交活动成功！');
      switch (type) {
        case 1:
          this.router.navigate(['/ads/spread/campaign']);
          break;
        case 2:
          this.router.navigate(['/ads/spread/creative-add/0'], {queryParams: {campaign_id: res.result}});
          break;
      }
    });

    // if (this.is_need_package && this.package_name) {
    //   this.saveDirectional();
    // }
  }

  setOrientation(data) {
    this._directionalService.getOrientationDetail({search_text: data.value}).subscribe(res => {
      this.orientation = {
        dtl_address: res.result.dtl_address,
        dtl_attribute: res.result.dtl_attribute,
        dtl_behavior: res.result.dtl_behavior,
        dtl_devices: res.result.dtl_devices,
        lbs_scene_type: res.result.lbs_scene_type,
      };
    });
  }

  saveDirectional() {
    this._directionalService.addOrientation({...this.directional, package_name: this.package_name}).subscribe(res => {
      // this._notification.success('提示', '保存定向包成功！')
    });
  }

  templateChange(data) {
    this.campaign.click_link = `${this.templateUrl}/template/${data.id}`;
    this.templatePreviewCode();
  }

  /**
   * 二维码预览
   */
  _previewCodeUrl;
  template_temp_id;

  /**
   * 通过模板id获取预览id
   */
  templatePreviewCode() {
    this.template_temp_id = null;
    this._templateService.templatePreview({id: this.campaign.template_id}).subscribe(res => {
      this.template_temp_id = res.result.id;
      this._previewCodeUrl = this._templateService.previewTpl({
        tmp_tpl_id: this.template_temp_id,
        render_url: `${this.templateUrl}/template/preview`,
        _: Date.now()
      });
    });
  }

  /**
   * 落地页预览
   */
  templatePreview() {
    if (this.template_temp_id) {
      let w = window.open();
      w.location.href = `${this.templateUrl}/template/preview/${this.template_temp_id}`;
    }
  }

  // 侧边导航栏设置

  navList = [{
    name: '推广目标',
    status: 2,
    child:[{
      name: '目标类型',
      id: 'tuiguangmubiao',
      status: 2,
    },{
      name: '落地页',
      id: 'tuiguangmubiao',
      status: 0,
    }]
  },{
    name: '活动设置',
    status: 0,
    child:[{
      name: '预算',
      id: 'huodongshezhi',
      status: 0,
    },{
      name: '排期',
      id: 'huodongshezhi',
      status: 0,
    }]
  },{
    name: '定向',
    status: 0,
    child:[{
      name: '地域定向',
      id: 'dingxiangshezhi',
      status: 0,
    },{
      name: '人群定向',
      id: 'dingxiangshezhi',
      status: 0,
    },{
      name: '行为定向',
      id: 'dingxiangshezhi',
      status: 0,
    },{
      name: '设备定向',
      id: 'dingxiangshezhi',
      status: 0,
    }]
  },{
    name:'出价',
    status: 0,
    child:[
      {
        name:'出价',
        id: 'chujia',
        status: 0,
      }
    ]
  }]

  navScrollTo(id){
    this._scrollService.scrollTo(this._global.containerFullRef, {top: this.document.getElementById(id).offsetTop})
  }

  constructor(private router: Router,
              private route: ActivatedRoute,
              @Inject(DOCUMENT) private document: Document,
              private domSanitizer: DomSanitizer,
              private changeDetectorRef: ChangeDetectorRef,
              private _notification: Notification,
              private _dialog: Dialog,
              private _directionalService: DirectionalService,
              private _publicService: PublicService,
              private _scrollService: ScrollService,
              private _global: Global,
              private _util: Util,
              private _templateService: TemplateService,
              private _campaignService: CampaignService) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data;
    this.id = params.id;

    _templateService.getUserTpls({is_select_data: true}).subscribe(res => {
      this.templateList = res.result
    })
  }

  isPermit(type) {
    return this.jurisdiction[type]
  }

  can_modify: boolean = true;

  bid_min;
  bid_max;

  ngOnInit() {
    this.bid_min = this._global.bid_min;
    this.bid_max = this._global.bid_max;

    let auth = this.route.snapshot.data.auth;
    console.info(auth)
    this.jurisdiction = auth.jurisdiction_list;
    this.authUser = auth.user;
    if (+this.id) {
      this._isEdit = true;
    }

    // 关于创意的一系列状态 待提交创意数量(need_check_count)、审核中数量(in_check_count)、审核通过数量(check_success_count)、审核未通过数量(check_failed_count)
    // 和总数量(total_count)。用来处理这个需求：


    this._campaignService.addEditInit({
      campaign_id: this.id
    }).subscribe(res => {
      this.can_modify = res.result.hasOwnProperty('can_modify') ? res.result.can_modify : true;  // false的时候 不可编辑
      this.app_stores = res.result.app_stores;
      this.orientation = res.result.orientation;
      this.target_types = res.result.target_types;
      this.speeds = res.result.speeds;
      this.show_time_types = res.result.show_time_types;
      this.landingpage_types = res.result.landingpage_types;
      this.orientation_packages = res.result.orientation_packages;
      if (res.result.campaign) {
        this.campaign = res.result.campaign;
        this.campaignTimes = [this.campaign.begin_date, this.campaign.end_date]
      }
      this.changeDetectorRef.markForCheck();
    });

    for (let i = 1; i <= 20; i++) {
      this.frequencyList.push({
        label: i,
        value: i,
      })
    }
    this.frequencyList.unshift({
      label: '不限',
      value: 0,
    });

    this._appIdSubject.pipe(
      debounceTime(500)
    ).subscribe(() => {
      this.parseIos();
    })
  }

  ngOnDestroy(): void {
    this._appIdSubject.unsubscribe()
  }

  flag = true;

  getFlags(flag) {
    this.flag = flag;
  }
}
