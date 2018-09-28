import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CreativeService} from '../../../../service/customer/creative.service';
import {ScrollService} from '../../../../components/back-top/scroll.service';
import {Dialog} from '../../../../components/dialog/dialog';
import {Notification} from '../../../../components/notification/notification';
import {hoursFormat} from '../../../../service/util';

@Component({
  selector: 'yc-creative-expand',
  template: `
    <div class="expand-content">

      <div class="expand-content-left">

        <div class="expand-title">
          <span>创意详情</span>
          <span class="pointer-outline-none m-l-1" (click)="_copy()" *ngIf="isPermit('ZCMOBI_ADS_SPREAD_CREATIVE_COPY')">复制</span>
          <span class="pointer-outline-none m-l-1" [routerLink]="['/ads/spread/creative/edit',id]" *ngIf="isPermit('ZCMOBI_ADS_SPREAD_CREATIVE_UPDATE')">修改</span>
          <span class="pointer-outline-none m-l-1" (click)="_delete()" *ngIf="isPermit('ZCMOBI_ADS_SPREAD_CREATIVE_DELETE')">删除</span>
        </div>

        <div class="expand-content-bottom">
          <div class="expand-info">
            <i class="right-operating" (click)="operating(operatingRef, 227)"></i>
            <i class="left-operating" (click)="operating(operatingRef, -227)"></i>
            <div style="overflow: auto;width: 228px;margin: 0 auto;" #operatingRef>
              <yc-creative-box [(ngModel)]="value" [preview]="true" *ngIf="elements" [elements]="elements"></yc-creative-box>
            </div>
          </div>

          <div class="expand-info">

            <div class="item">
              <span class="info-key">投放小时</span>
              <div class="info-value">
                <ng-template [ngIf]="show_hour_today_format">
                  <p><span>{{show_hour_today_format}}</span></p>
                </ng-template>
                <ng-template [ngIf]="!show_hour_today_format">
                  <span>不投</span>
                </ng-template>
                <i class="icon-img-edit" (click)="_editHourToday(schedule)"></i>
              </div>
            </div>

            <div class="item">
              <span class="info-key">投放日期</span>
              <div class="info-value">
                <p><span>{{creative?.begin_date | date:'yyyy/MM/dd'}}~{{creative?.end_date | date:'yyyy/MM/dd'}}</span></p>
              </div>
            </div>

            <div class="item">
              <span class="info-key">所属活动</span>
              <div class="info-value">
                <p><span>{{creative?.campaign_name}}</span></p>
              </div>
            </div>

            <div class="item">
              <span class="info-key">媒体样式</span>
              <div class="info-value">
                <p>{{creative?.media_name}}-{{creative?.ad_width}}X{{creative?.ad_height}}-{{creative?.material_type_name}}</p>
              </div>
            </div>
            <div class="item">
              <span class="info-key">投放应用</span>
              <div class="info-value overflow-box">
                <!--<i class="icon-img-edit" (click)="_editDirectional(directional)"></i>-->
                <ng-template [ngIf]="_orientationValue?.length">
                  <p *ngFor="let ov of _orientationValue">{{ov.name}}：{{ov.value}}</p>
                </ng-template>
                <ng-template [ngIf]="!_orientationValue?.length">
                  不限
                </ng-template>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div class="expand-content-right">
        <div class="chart-box">
          <yc-button-group class="tool"
                           [(ngModel)]="creativeCode"
                           (changeEvent)="_changeCampaignAndCreativeChart(chartDataInstance,creativeChartData,creativeCode)"
                           [list]="[{value:'pv',label:'曝光量'},{value:'click',label:'点击量'},{value:'ctr',label:'点击率'},{value:'cpc',label:'点击成本'},{value:'cpm',label:'曝光成本'},{value:'admoney',label:'花费'}]"></yc-button-group>
          <div class="chart-data" #chartData></div>
        </div>
      </div>

      <ng-template #schedule>
        <yc-time-schedule [grain]="1" [(ngModel)]="show_hour_today"></yc-time-schedule>
      </ng-template>

      <!--<ng-template #directional>
        <yc-directional></yc-directional>
      </ng-template>-->

    </div>
  `,
  styleUrls: [
    'creative-expand.component.less'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class CreativeExpandComponent implements OnInit {

  @ViewChild('chartData') chartDataRef: ElementRef;
  @Input() id = 0;
  @Input() authList;
  @Output('change') selectChange = new EventEmitter<any>();

  creative_name;
  chartDataInstance;
  creative;
  creativeChartData;
  creativeCode = 'pv';
  orientation;
  direction;

  elements;
  value;
  show_hour_today = [];
  show_hour_today_format;
  show_time_type = '1';

  _copy() {
    this._dialog.open('是否复制被选创意？', {title: '创意复制'}).subscribe(data => {
      if (data) {
        this._creativeService.creativeCopy({
          creative_ids: this.id,
        }).subscribe(res => {
          this.selectChange.emit();
        });
      }
    });
  }

  _delete() {
    this._dialog.open('是否删除创意？', {title: '删除创意'}).subscribe(data => {
      if (data) {
        this._creativeService.creativeDelete({
          creative_ids: this.id,
        }).subscribe(res => {
          this.selectChange.emit();
        });
      }
    });
  }

  _editHourToday(schedule) {
    this.show_hour_today = [...this.show_hour_today_ori];
    this._dialog.open(schedule, {title: '修改投放小时', async: true}).subscribe(data => {
      if (data) {
        let flag = this.show_hour_today.some(item => !!item);
        if (!flag) {
          this._notification.error('提示', '投放小时不能为空！');
          return;
        } else {
          data();
        }
        this._creativeService.batchUpdateHours({
          creative_ids: this.id,
          show_time_type: this.show_time_type,
          show_hours: this.show_hour_today
        }).subscribe(res => {
          this.init();
        });
      }
    });
  }

  // _editDirectional(directional) {
  //   this._dialog.open(directional, {title: '修改定向'}).subscribe(data => {
  //     if (data) {
  //       this.direction.creative_ids = [this.id];
  //       this.direction.campaign_ids = [this.creative.campaign_id];
  //       this._creativeService.updateDirection({
  //         // creative_id: this.id,
  //         // campaign_id: this.creative.campaign_id,
  //         direction: this.direction,
  //       }).subscribe(res => {
  //         this.init();
  //       })
  //     }
  //   })
  // }

  chartData() {
    const chartDataRef = this.chartDataInstance = echarts.init(this.chartDataRef.nativeElement);
    chartDataRef.setOption({
      title: {
        text: '实时数据',
        textStyle: {
          fontWeight: 700,
          fontSize: 16,
          color: '#616366',
          align: 'left'
        },
        padding: 0
      },
      color: ['#2e90ff', '#ffa542'],
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        top: 120,
        left: 0,
        right: 10,
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        axisLine: {
          show: false,
          lineStyle: {
            color: '#979899'
          }
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#e7ecf3'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: {
            color: '#979899'
          }
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: '#e7ecf3'
          }
        },
        axisLabel: {
          formatter: '{value} 次'
        }
      },
      series: [
        {
          name: '今日数据',
          type: 'line',
          stack: '总量',
          areaStyle: {
            color: 'rgba(46, 144, 255, 0.3)'
          }
        }
      ]
    });
    window.addEventListener('resize', () => {
      chartDataRef.resize();
    });
  }

  isPermit(type) {
    return this.authList[type]
  }

  show_hour_today_ori;

  init() {
    this._creativeService.creativeDetail({creative_id: this.id}).subscribe(res => {
      this.creativeChartData = res.result.report;
      this.show_hour_today = res.result.show_hour_today;
      this.show_hour_today_ori = [...res.result.show_hours];
      this.show_hour_today = [...res.result.show_hours];
      if (res.result.show_hour_today) {
        this.show_hour_today_format = hoursFormat(res.result.show_hour_today).join(' ');
      } else {
        this.show_hour_today_format = undefined;
      }
      this.creative = res.result.creative;
      this.elements = res.result.creative.material_elements;
      this.value = res.result.creative.elements;
      this.direction = res.result.direction;
      this._orientationValue = res.result.direction_name_values;
      this.chartData();
      this._changeCampaignAndCreativeChart(this.chartDataInstance, this.creativeChartData, this.creativeCode);
      this.changeDetectorRef.markForCheck();
    });
  }

  ngOnInit(): void {
    this.init();
  }

  constructor(private _creativeService: CreativeService,
              private _scrollService: ScrollService,
              private _dialog: Dialog,
              private _notification: Notification,
              private changeDetectorRef: ChangeDetectorRef) {

  }

  /**
   * 今日在投创意 今日在投活动 类型切换
   * @param echartsInstance
   * @param data
   * @param type
   */
  _changeCampaignAndCreativeChart(echartsInstance, data, type) {  // echarts 表单数组
    if (!data) return;
    let suffix;
    let d = data.y[type];
    let max;
    switch (type) {
      case 'pv':
      case 'click':
        suffix = '次';
        // max = (value) => {
        //   return value.max <= 5000 ? 5000 : Math.round(value.max);
        // };
        break;
      case 'ctr':
        suffix = '%';
        d = d.map(td => (td * 100).toFixed(2));
        break;
      case 'cpm':
        suffix = '元';
        d = d.map(td => (td * 1000).toFixed(2));
        break;
      case 'cpc':
      case 'admoney':
        d = d.map(td => (td * 1).toFixed(2));
        suffix = '元';
        break;
    }

    let option: any = {
      xAxis: {
        data: data.x
      },
      yAxis: {
        axisLabel: {
          formatter: `{value} ${suffix}`
        }
      },
      series: [
        {data: d},
      ]
    };

    if (max) {
      option.yAxis.max = max;
    } else {
      option.yAxis.max = null;
    }
    echartsInstance.setOption(option);
  }

  // 定向
  _orientationValue;

  getOrientationValue() {
    let orientation = [];
    if (!this.orientation) return orientation;
    let dtl_address = this.orientation.dtl_address;
    if (dtl_address) {
      switch (dtl_address.type) {
        case 1:
          if (dtl_address.area instanceof Array && dtl_address.area.length) {
            orientation.push({
              name: '定向省份',
              value: dtl_address.area.map(a => a.name).join('，')
            });
          }
          break;
        case 2:
          if (dtl_address.city instanceof Array && dtl_address.city.length) {
            orientation.push({
              name: '一二线城市',
              value: dtl_address.city.map(a => a.name).join('，')
            });
          }
          break;
        case 3:
          if (dtl_address.lbs instanceof Array && dtl_address.lbs.length) {
            orientation.push({
              name: 'LBS',
              value: dtl_address.lbs.map(a => a.name).join('，')
            });
          }
          break;
      }
    }

    let dtl_attribute = this.orientation.dtl_attribute;
    if (dtl_attribute && dtl_attribute.crowdAttribute) {
      let attribute = dtl_attribute.crowdAttribute;
      if (attribute.age instanceof Array && attribute.age.length) {
        orientation.push({
          name: '年龄',
          value: attribute.age.map(a => a.name).join('，')
        });
      }
      if (attribute.sex instanceof Array && attribute.sex.length) {
        orientation.push({
          name: '性别',
          value: attribute.sex.map(a => a.name).join('，')
        });
      }
      if (attribute.education instanceof Array && attribute.education.length) {
        orientation.push({
          name: '学位',
          value: attribute.education.map(a => a.name).join('，')
        });
      }
    }

    let dtl_devices = this.orientation.dtl_devices;
    if (dtl_devices) {
      if (dtl_devices.brand instanceof Array && dtl_devices.brand.length) {
        orientation.push({
          name: '设备品牌',
          value: dtl_devices.brand.map(a => a.name).join('，')
        });
      }
      if (dtl_devices.browsers instanceof Array && dtl_devices.browsers.length) {
        orientation.push({
          name: '浏览器',
          value: dtl_devices.browsers.map(a => a.name).join('，')
        });
      }
      if (dtl_devices.devicesType instanceof Array && dtl_devices.devicesType.length) {
        orientation.push({
          name: '设备类型',
          value: dtl_devices.devicesType.map(a => a.name).join('，')
        });
      }
      if (dtl_devices.netType instanceof Array && dtl_devices.netType.length) {
        orientation.push({
          name: '联网方式',
          value: dtl_devices.netType.map(a => a.name).join('，')
        });
      }
      if (dtl_devices.mobileOS instanceof Array && dtl_devices.mobileOS.length) {
        orientation.push({
          name: '操作系统',
          value: dtl_devices.mobileOS.map(a => a.name).join('，')
        });
      }
      if (dtl_devices.operators instanceof Array && dtl_devices.operators.length) {
        orientation.push({
          name: '运营商',
          value: dtl_devices.operators.map(a => a.name).join('，')
        });
      }
    }

    let dtl_behavior = this.orientation.dtl_behavior;
    if (dtl_behavior) {
      if (dtl_behavior.appCategory instanceof Array && dtl_behavior.appCategory.length) {
        orientation.push({
          name: '行为分类',
          value: dtl_behavior.appCategory.map(a => a.name).join('，')
        });
      }
      if (dtl_behavior.appAttribute instanceof Array && dtl_behavior.appAttribute.length) {
        orientation.push({
          name: '行为指定',
          value: dtl_behavior.appAttribute.map(a => a.name).join('，')
        });
      }
      if (dtl_behavior.filterAppAttribute instanceof Array && dtl_behavior.filterAppAttribute.length) {
        orientation.push({
          name: '行为过滤',
          value: dtl_behavior.filterAppAttribute.map(a => a.name).join('，')
        });
      }
    }
    return orientation;
  }

  operating(overflowRef, clientWidth) {
    this._scrollService.scrollTo(overflowRef, {top: 0, left: overflowRef.scrollLeft + clientWidth});
  }
}
