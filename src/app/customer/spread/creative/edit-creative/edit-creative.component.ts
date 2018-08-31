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

  elementList = []

  elements
  selectMediaSize
  value

  @ViewChild('ad_price') ad_price;
  @ViewChild('creativeBox', {read: CreativeBoxComponent}) set creativeBoxRef(ref: CreativeBoxComponent) {
    if (!ref) return;
    ref.setValue([this.value])
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
      this.changeDetectorRef.markForCheck()
    })
  }

  imgError(error) {
    this._notification.error('上传', error.message)
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
      this.changeDetectorRef.markForCheck()
    })
  }

  direction;

  init(creative_id) {
    this._creativeService.updateInit({creative_id: creative_id}).subscribe(
      res => {
        this.creative = res.result.creative;
        this.show_hours = res.result.show_hours;
        this.direction = res.result.direction;
        this.elements = res.result.creative.material_elements;
        this.selectMediaSize = {
          media_material_id: this.creative.media_material_id
        }
        this.elements.is_dynamic_words = res.result.creative.is_dynamic_words;
        this.elements.creative_name = res.result.creative.creative_name;
        this.value = res.result.creative.elements;

        if (this.elements.logo) {
          this.elements.logo[this.elements.logo.name] = this.value.logo[this.elements.logo.name]
        }
        // 获取覆盖人数
        // this.audienceCount();
        this.changeDetectorRef.markForCheck()
      }
    )
  }

  _isNumber(val) {
    return !/^\+?(\d*\.?\d{0,2})$/.test(val)
  }

  _audienceCount;

  audienceCount() {
    let body = {
      ...this.direction,
    }
    delete  body.dtl_address.selected_lbs_locations
    delete  body.dtl_address.selected_lbs_location_details
    this._publicService.getAudienceCount(body).subscribe(res => {
      this._audienceCount = res.result || 0;
      this.changeDetectorRef.markForCheck()
    })
  }

  _valid;

  get containerFullRef() {
    return this._global.containerFullRef;
  }

  @ViewChild('chujia') chujia;

  save() {
    this._valid = true;
    if ( this.ad_price.invalid || this.creative.ad_price > this.bid_max || this.creative.ad_price < this.bid_min) {
      this._scrollService.scrollTo(this.containerFullRef, {top: this.chujia.nativeElement.offsetTop})
      return;
    }
    // if (!/^\+?(\d*\.?\d{0,2})$/.test(this.creative.ad_price) || !this.creative.ad_price) return;
    let elements = this.elementList[0];
    console.log(this.elementList)
    if (!elements) return

    let element_data: any = {
      creative_id: this.id,
      campaign_id: this.creative.campaign_id,
      creative_name:  elements.creative_name,
      ad_price: this.creative.ad_price,
      is_dynamic_words: elements.is_dynamic_words ? elements.is_dynamic_words : 0,
      elements: {
        data_list: []
      }
    };

    let element = elements.data_list

    if (!element) return

    element.forEach(ele => {
      let body = {};
      Object.keys(ele).forEach(oke => {
        if (ele[oke] instanceof Array) {
          body[oke] = [];
          ele[oke].forEach(el => {
            body[oke].push({
              [el.name]: el[el.name]
            })
          })
        }
      });
      element_data.elements.data_list.push(body);
    });
    let logo = this.elements.logo;
    if (logo) {
      element_data.elements.logo = {
        [logo.name]: logo[logo.name]
      }
    }

    let flag = this.show_hours.some(item => !!item);
    if (!flag) {
      this._scrollService.scrollTo(this.containerFullRef, {top: 0});
      this._notification.error('提示', '投放小时不能为空！');
      return
    }
    let body = {
      creative: element_data,
      show_hours: this.show_hours,
      direction: this.direction,
    }
    this._creativeService.editSave(body).subscribe(res => {
      this.router.navigate(['/ads/spread/creative'])
    })
  }

  constructor(private _scrollService: ScrollService,
              private _notification: Notification,
              private router: Router,
              private route: ActivatedRoute,
              private changeDetectorRef: ChangeDetectorRef,
              private _creativeService: CreativeService,
              private _publicService: PublicService,
              private _global: Global,
              private _dialog: Dialog) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data;
    this.id = params.id
    this.init(this.id);
  }
  bid_min;
  bid_max;
  ngOnInit() {
    this.bid_min = this._global.bid_min
    this.bid_max = this._global.bid_max
  }

}
