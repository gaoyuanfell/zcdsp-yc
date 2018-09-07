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
import {CampaignService} from '../../../../service/customer/campaign.service';
import {ActivatedRoute} from '@angular/router';
import {Dialog} from '../../../../components/dialog/dialog';
import {PopoverDirective} from '../../../../components/popover/popover.directive';
import {Notification} from '../../../../components/notification/notification';
import {hoursFormat} from '../../../../service/util';

@Component({
  selector: 'yc-campaign-expand',
  template: `
    <div class="expand-content">

      <div class="expand-content-left">

        <div class="expand-title">
          <span>活动详情</span>
          <span class="pointer-outline-none m-l-1" (click)="_copy()">复制</span>
          <span class="pointer-outline-none m-l-1" [routerLink]="['/ads/spread/campaign/edit',id]" *ngIf="isPermit('ZCMOBI_ADS_SPREAD_CAMPAIGN_EDIT')">修改</span>
          <span class="pointer-outline-none m-l-1" (click)="_delete()" *ngIf="isPermit('ZCMOBI_ADS_SPREAD_CAMPAIGN_DELETE')">删除</span>
        </div>

        <div class="expand-content-bottom">
          <div class="expand-info">
            <div class="item">
              <span class="info-key">投放小时</span>
              <div class="info-value">
                <ng-template [ngIf]="show_hour_today_format">
                  <p><span>{{show_hour_today_format}}</span></p>
                </ng-template>
                <ng-template [ngIf]="!show_hour_today_format && show_time_type === 1">
                  <span>不投</span>
                </ng-template>
                <ng-template [ngIf]="!show_hour_today_format && show_time_type === 0">
                  <p><span>00:00~23:59</span></p>
                </ng-template>
                <i class="icon-img-edit" (click)="_editHourToday(schedule)"></i>
              </div>
            </div>

            <div class="item">
              <span class="info-key">投放日期</span>
              <div class="info-value">
                <p>
                  <span>{{date?.begin_date}}~{{date?.end_date}}</span>
                  <i class="icon-img-edit" yc-popover [template]="temp3" #popover2="ycPopover" (openEvent)="_newDate()"></i>
                </p>

                <ng-template #temp3>
                  <div class="day-money-home">
                    <label class="form-label">修改投放日期</label>
                    <div style="" class="form-group flex-center">
                      <div class="form-input">
                        <input-datepicker [isShortcutKey]="false" [width]="215" [disabledTodayBefore]="true"  [isRange]="true" [query]="new_date" [appendField]="['begin_date','end_date']"></input-datepicker>
                      </div>
                    </div>
                    <div class="text-right">
                      <button class="btn btn-border" (click)="popover2.close()">取消</button>
                      <button class="btn btn-small" (click)="_updateDate();popover2.close()">确认</button>
                    </div>
                  </div>
                </ng-template>

              </div>
            </div>

            <div class="item">
              <span class="info-key">定向</span>
              <div class="info-value overflow-box">
                <i class="icon-img-edit" (click)="_editDirectional(directionalRef)"></i>
                <ng-template [ngIf]="_orientationValue?.length">
                  <p *ngFor="let ov of _orientationValue">{{ov.name}}：{{ov.value}}</p>
                </ng-template>
                <ng-template [ngIf]="!_orientationValue?.length">
                  不限
                </ng-template>
              </div>
            </div>
          </div>

          <div class="expand-info">
            <div class="info-value">
              <p class="is-title">
                <span>创意列表</span>
                <i class="icon-img-add  m-l-1" [routerLink]="['/ads/spread/creative-add/0']" [queryParams]="{campaign_id:id}" *ngIf="isPermit('ZCMOBI_ADS_SPREAD_CAMPAIGN_CREATIVE_ADD')"></i>
              </p>
              <div class="overflow-box">
                <p *ngFor="let c of creatives">
                  <span>{{c.creative_name}}</span>
                  <i class="icon-img-edit" [routerLink]="['/ads/spread/creative/edit',c.creative_id]"></i>
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

      <div class="expand-content-right">
        <div class="chart-box">
          <!--<yc-radio-group class="tool" [list]="[{value:'1',label:'广告数据'},{value:'2',label:'落地页数据'}]"></yc-radio-group>-->
          <yc-button-group class="tool"
                           [(ngModel)]="campaignCode"
                           (changeEvent)="_changeCampaignAndCreativeChart(chartDataInstance,creativeChartData,campaignCode)"
                           [list]="[{value:'pv',label:'曝光量'},{value:'click',label:'点击量'},{value:'ctr',label:'点击率'},{value:'cpc',label:'点击成本'},{value:'cpm',label:'曝光成本'},{value:'admoney',label:'花费'}]"></yc-button-group>
          <div class="chart-data" #chartData></div>
        </div>
      </div>

      <ng-template #schedule>
        <yc-radio-group [(ngModel)]="show_time_type" [list]="[{value:0,label:'不限'},{value:1,label:'指定时间段'}]"></yc-radio-group>
        <yc-time-schedule [grain]="1" [(ngModel)]="show_hour_today" *ngIf="show_time_type === 1"></yc-time-schedule>
      </ng-template>
      <ng-template #directionalRef>
        <yc-directional [(ngModel)]="directional"></yc-directional>
      </ng-template>
    </div>
  `,
  styleUrls: [
    'campaign-expand.component.less'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
})
export class CampaignExpandComponent implements OnInit {

  @ViewChild('chartData') chartDataRef: ElementRef;
  @Input() id = 0;
  @Input() authList;
  @Output('change') selectChange = new EventEmitter<any>();

  show_time_type: any;
  campaignCode = 'pv';
  chartDataInstance;
  creativeChartData;
  directional;
  creatives;
  new_campaign_name;

  campaign_name;
  show_hour_today = [];
  show_hour_today_format

  date: any = {}

  _updateName() {
    this._campaignService.updateName({
      campaign_name: this.new_campaign_name,
      campaign_id: this.id,
    }).subscribe(res => {
      this.init();
    })
  }

  new_date = {};
  _editDirectional(directional) {
    this._dialog.open(directional, {title: '修改定向'}).subscribe(data => {
      if (data) {
        this._campaignService.batchAddUpdate({
          campaign_ids: [this.id],
          ...this.directional
        }).subscribe(res => {
          this.init();
        })
      }
    })
  }

  _updateDate() {
    this._campaignService.batchUpdateBeginEndDate({
      campaign_ids: this.id,
      ...this.new_date
    }).subscribe(res => {
      this.init();
      this.selectChange.emit()
    })
  }

  _newDate() {
    this.new_date = {...this.date}
  }

  _editHourToday(schedule) {
    this.show_hour_today = [...this.show_hour_today_ori];
    this._dialog.open(schedule, {title: '修改投放小时', async: true}).subscribe((data: any) => {
     if (data) {
       if (this.show_time_type === 1) {
         let flag = this.show_hour_today.some( item => !!item);
         if (!flag) {
           this._notification.error('提示', '投放小时不能为空！');
           return
         } else { data()}
       } else {
         data();
       }
       this._campaignService.batchUpdateHours({
         campaign_ids: this.id,
         show_time_type: this.show_time_type,
         show_hours:  this.show_hour_today = this.show_time_type === 0 ? null : this.show_hour_today
       }).subscribe(res => {
         this.init();
       })
     }
    })
  }

  _copy() {
    this._dialog.open('是否复制被选活动？', {title: '复制活动'}).subscribe(data => {
      if (data) {
        this._campaignService.batchCopy({
          campaign_ids: this.id
        }).subscribe(res => {
          this._notification.success('成功', '复制成功！')
        })
      }
    })
  }

  _delete() {
    this._dialog.open('是否删除被选活动？', {title: '删除活动'}).subscribe(data => {
      if (data) {
        this._campaignService.batchDelete({
          campaign_ids: this.id
        }).subscribe(res => {
          this.selectChange.emit()
        })
      }
    })
  }

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
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210],
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
    return this.authList.indexOf(type) > -1
  }

  ngOnInit(): void {
    this.init();
  }
  show_hour_today_ori;

  init() {
    this._campaignService.campaignDetail({campaign_id: this.id}).subscribe(res => {
      this.creatives = res.result.creatives;
      this.campaign_name = res.result.campaign.campaign_name;
      //  show_hours是全周的, show_hours_today是当天的

      // 弹出的表格是显示全周的 投放小时显示的当天的 type = 1:是表格
      this.show_time_type = res.result.show_time_type;
      this.show_hour_today_ori = res.result.show_hours ? [...res.result.show_hours] : [];
      this.show_hour_today = res.result.show_hours ? [...res.result.show_hours] : [];


      if (res.result.show_hours_today) {
        this.show_hour_today_format = hoursFormat(res.result.show_hours_today).join(' ');
      } else {
        this.show_hour_today_format = undefined;
      }

      this.date = {
        begin_date: res.result.campaign.begin_date,
        end_date: res.result.campaign.end_date,
      };
      this.directional = res.result.directional;

      this._orientationValue = res.result.direction_name_values;

      this.changeDetectorRef.markForCheck();
    });
    this._campaignService.charData({campaign_id: this.id}).subscribe(res => {
      this.chartData();
      this.creativeChartData = res.result;
      this._changeCampaignAndCreativeChart(this.chartDataInstance, this.creativeChartData, this.campaignCode)
    })
  }

  constructor(private _campaignService: CampaignService,
              private _dialog: Dialog,
              private _notification: Notification,
              private changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute) {

  }

  /**
   * 今日在投创意 今日在投活动 类型切换
   * @param echartsInstance
   * @param data
   * @param type
   */
  _changeCampaignAndCreativeChart(echartsInstance, data, type) {  // echarts 表单数组
    if (!data) return
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
    }

    if (max) {
      option.yAxis.max = max
    } else {
      option.yAxis.max = null;
    }

    echartsInstance.setOption(option);
  }

  _orientationValue;
}
