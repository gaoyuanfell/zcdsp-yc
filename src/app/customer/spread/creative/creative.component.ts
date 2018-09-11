import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild, Inject, OnDestroy } from '@angular/core';
import { AutoCookie } from '../../../../decorator/decorator';
import { CreativeService } from '../../../../service/customer/creative.service';
import { Dialog } from '../../../../components/dialog/dialog';
import { Notification } from '../../../../components/notification/notification';
import { Global } from '../../../../service/global';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent } from '../../../../components/table/table.component';
import { hoursFormat } from '../../../../service/util';
import { Sidebar, YC_SIDEBAR_DATA } from '../../../../components/sidebar/sidebar';
import {CampaignService} from '../../../../service/customer/campaign.service';

@Component({
  selector: 'app-creative',
  templateUrl: './creative.component.html',
  styleUrls: ['./creative.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class CreativeComponent implements OnInit {

  @AutoCookie({
    defaultValue: {
      page_index: 1,
      page_size: 20
    },
    keepValue: {
      begin_date: new Date().calendar(3, -7).formatDate('yyyy-MM-dd'),
      end_date: new Date().formatDate('yyyy-MM-dd'),
    },
  })
  query;
  other;
  total_count;
  tableList;
  datepicker

  audit_state_list;
  campaign_list;
  media_list;
  display_type_list;
  show_state_list;
  current_state_list;
  authList;
  authUser;
  batchUpdateMenu;
  @ViewChild('update_priceRef') update_priceRef;

  search() {
    this.query.page_index = 1;
    this.list();
  }

  exportUrl() {
    let url = this._creativeService.creativeUrl({
      ...this.query
    });
    window.open(url);
  }

  list() {
    this._creativeService.list(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
      this.other = res.result.other;
      this.changeDetectorRef.markForCheck();
    });
  }

  refresh() {
    Object.keys(this.query).forEach(key => {
      let list = ['page_index', 'page_size', 'begin_date', 'end_date'];
      if (!!~list.indexOf(key)) return;
      Reflect.deleteProperty(this.query, key);
    })
    let [begin_date, end_date] = this.datepicker = [
      new Date().calendar(3, -7).formatDate('yyyy-MM-dd'),
      new Date().formatDate('yyyy-MM-dd')
    ];
    this.query.begin_date = begin_date;
    this.query.end_date = end_date;
    this.search()
  }

  @ViewChild('ycTable', { read: TableComponent }) table: TableComponent;

  // 修改状态
  updateOneShowState(data, switchRef) {
    this._creativeService.updateState({
      creative_ids: data.creative_id,
      state: data.show_state
    }).subscribe(res => {
      if (this.query.show_state) {
        this.search();
      } else {
        this.list();
      }
    }, () => {
      setTimeout(() => {
        switchRef.trigger();
        this.changeDetectorRef.markForCheck();
      }, 200);
    });
  }

  // ----------------------------------

  // 创意预览
  @ViewChild('show_creative', { read: TemplateRef }) show_creative_ref: TemplateRef<any>;
  elements;
  elementValue;

  _showCreative(data) {
    this.elements = null;
    this.elementValue = null;
    this._creativeService.creativeDetail({ creative_id: data.creative_id }).subscribe(res => {
      this.elements = res.result.creative.material_elements;
      this.elementValue = res.result.creative.elements;
      this._dialog.open(this.show_creative_ref, { flag: false, title: `${data.creative_name}-预览` });
      this.changeDetectorRef.markForCheck();
    });
  }

  // 创意名称修改
  creative_name;

  _updateName(data) {
    this._creativeService.updateName({
      creative_name: this.creative_name,
      creative_id: data.creative_id,
    }).subscribe(res => {
      this.list();
    });
  }

  // 出价修改
  ad_price;

  _updateAdPrice(data) {
    this._creativeService.updatePrice({
      price: this.ad_price,
      creative_ids: data.creative_id,
    }).subscribe(res => {
      this.list();
    });
  }

  @ViewChild('update_state', { read: TemplateRef }) update_state_ref: TemplateRef<any>;
  update_state_data = {
    show_state: 1
  };

  @ViewChild('update_show_hours', { read: TemplateRef }) update_show_hours_ref: TemplateRef<any>;
  update_show_hours_data = {
    show_time_type: 0,
    show_hours: [],
  };

  @ViewChild('update_price', { read: TemplateRef }) update_price_ref: TemplateRef<any>;
  update_price_data = {
    price: 0,
  };
  _valid = false;

  // 批量修改
  batchUpdate(type) {
    let list = this.table.selectData.map(d => d.creative_id);
    if (!list.length) {
      this._notification.warning('批量修改！', '请至少选择一条创意');
      return;
    }
    let creative_ids = list.join(',');
    switch (type) {
      case 'update_state':
        this._dialog.open(this.update_state_ref, { title: '修改状态' }).subscribe(data => {
          if (data) {
            this._creativeService.updateState({
              creative_ids,
              state: this.update_state_data.show_state
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'update_show_hours':
        this.update_show_hours_data = {
          show_time_type: 1,
          show_hours: [],
        };
        this._dialog.open(this.update_show_hours_ref, { title: '修改投放小时', async: true }).subscribe(data => {
          console.log(data);
          if (data) {
            let flag = this.update_show_hours_data.show_hours.some(item => !!item);
            if (!flag) {
              this._notification.error('提示', '投放小时不能为空！');
              return;
            } else {
              data();
            }
            this._creativeService.updateShowHours({
              creative_ids,
              show_time_type: this.update_show_hours_data.show_time_type,
              show_hours: this.update_show_hours_data.show_hours
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'update_price':
        this._valid = false;
        this.update_price_data.price = null;
        this._dialog.open(this.update_price_ref, { title: '修改出价', async: true }).subscribe((data: any) => {
          if (data) {
            if (this.update_priceRef.invalid || this.update_price_data.price > this.bid_max || this.update_price_data.price < this.bid_min) {
              this._valid = true;
              return;
            }
            data();
            this._creativeService.updatePrice({
              creative_ids,
              price: this.update_price_data.price || 0
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'submit_audit':
        this._dialog.open('是否提交审核？', { title: '提交审核' }).subscribe(data => {
          if (data) {
            this._creativeService.submitAudit({
              creative_ids
            }).subscribe(res => {
              this.list();
            });
          }
        });
        break;
      case 'creative_delete':
        this._dialog.open('是否删除创意？', { title: '创意删除' }).subscribe(data => {
          if (data) {
            this._creativeService.creativeDelete({
              creative_ids
            }).subscribe(res => {
              this.search();
            });
          }
        });
        break;
      case 'creative_copy':
        this._dialog.open('是否复制被选创意？', { title: '创意复制' }).subscribe(data => {
          if (data) {
            this._creativeService.creativeCopy({
              creative_ids
            }).subscribe(res => {
              this.search();
            });
          }
        });
        break;
    }
  }

  //////******************************************************************//////////

  /**
   * this.elements = res.result.creative.material_elements;
   this.value = res.result.creative.elements;
   * @param data
   */
  openCampaignDetail(data) {
    this._creativeService.creativeDetail({ creative_id: data.creative_id }).subscribe(res => {
      this._sidebar.open(CreativeDetailComponent, {
        data: res.result
      });
    })
  }



  constructor(private _creativeService: CreativeService,
    private _notification: Notification,
    private _dialog: Dialog,
    private _global: Global,
    private _sidebar: Sidebar,
    private changeDetectorRef: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data;
    Object.assign(this.query, queryParams);
  }

  bid_min;
  bid_max;

  ngOnInit() {
    this.bid_min = this._global.bid_min;
    this.bid_max = this._global.bid_max;
    const obj = this.route.snapshot.data['auth'];
    this.authList = Object.keys(obj['jurisdiction_list']);
    this.authUser = obj['user'];
    this.batchUpdateMenu = obj['jurisdiction_list']['ZCMOBI_ADS_SPREAD_CREATIVE_BATCH'] ? obj['jurisdiction_list']['ZCMOBI_ADS_SPREAD_CREATIVE_BATCH']['child'].map(item => {
      return { value: item.route, label: item.name };
    }) : [];
    console.log(this.batchUpdateMenu);
    let queryParams = this.route.snapshot.queryParams;
    if (queryParams.campaign_id) {
      this.query.campaign_id = queryParams.campaign_id;
    }
    this._creativeService.init().subscribe(res => {
      this.campaign_list = res.result.campaign_list;
      this.media_list = res.result.media_list;
      this.audit_state_list = res.result.audit_state_list;
      this.display_type_list = res.result.display_type_list;

      this.current_state_list = res.result.current_state_list;
      this.show_state_list = res.result.show_state_list;
      this.changeDetectorRef.markForCheck();
    });
    this.search();
  }

}

@Component({
  selector: 'creative-detail',
  styles: [
    `
    .chart-box {
      position: relative;
      width: 100%;
      height: 300px;
    }
    .chart-box .tool {
      position: absolute;
      right: 10px;
      top: 0;
      z-index: 1;
    }
    .chart-box .chart-data{
      width: 100%;
      height: 100%;
    }
    .mini-input {
      border: 1px solid #ccc;
    }
    `
  ],
  templateUrl: 'creative-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class CreativeDetailComponent implements OnInit, OnDestroy {

  edit = false

  ngOnDestroy(): void {

  }

  ngOnInit(): void {
    this.chartData();
    this._changeCampaignAndCreativeChart(this.chartDataInstance, this.creativeChartData, this.creativeCode);
    this.changeDetectorRef.markForCheck()
  }

  show_hour_today_format
  chartDataInstance
  creativeCode = 'pv';
  creativeChartData
  creativeChartDataList
  creativeData
  direction



  orientationValue
  creativeValue
  selectMediaSize
  elementList = []
  elements

  isChart = true;

  @ViewChild('chartData') chartDataRef: ElementRef

  constructor(@Inject(YC_SIDEBAR_DATA) private data: any, private changeDetectorRef: ChangeDetectorRef,private _creativeService: CreativeService) {
    console.info(data)

    this.elements = data.creative.material_elements;
    this.elements.is_dynamic_words = data.creative.is_dynamic_words;
    this.elements.creative_name = data.creative.creative_name;
    this.creativeValue = data.creative.elements;

    this.creativeChartData = data.report;
    this.creativeData = data.creative;
    this.direction = data.direction;
    this.orientationValue = data.direction_name_values;
    if (data.show_hour_today) {
      this.show_hour_today_format = hoursFormat(data.show_hour_today).join(' ');
    } else {
      this.show_hour_today_format = undefined;
    }

    this.creativeChartDataList = this.changeDayTotalList(this.creativeChartData)

    this.selectMediaSize = {
      media_material_id: data.creative.media_material_id
    }
  }

  ///------------------------------ 详情修改

  startList: Array<any> = Array.from({length: 24}).map((a, b) => ({label: b, value: b}));
  endList: Array<any> = Array.from({length: 24}).map((a, b) => ({label: b, value: b}));

  startData;
  endData;

  startListChange() {
    console.info(this.startData);
    this.endList = Array.from({length: 24}).map((a, b) => {
      let data = {label: b, value: b, disabled: false};
      if (this.startData > b) {
        data.disabled = true;
      }
      return data;
    });
  }

  save(){

    let elements = this.elementList[0];
    console.log(this.elementList)
    if (!elements) return

    let element_data: any = {
      creative_id: this.creativeData.creative_id,
      campaign_id: this.creativeData.campaign_id,
      creative_name:  elements.creative_name,
      ad_price: this.creativeData.ad_price,
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

    let body:any = {
      creative: element_data
    }

    if(!isNaN(+this.startData) && !isNaN(+this.endData)){
      let today_show_hours = Array.from({length: 24}).map((a, b) => {
        if(this.startData <= b && this.endData >= b){
          return 1
        }
        return 0
      })

      body.today_show_hours = today_show_hours
    }

    this._creativeService.creativeDetailUpdate(body).subscribe(res => {
      this.edit = false;
      this.changeDetectorRef.markForCheck();
    })

    console.info(body);
  }

  changeDayTotalList(chartDatas){
    let x = chartDatas.x;
    let y = chartDatas.y;
    let list = [];
    x.forEach((item,index) => {
      list.push({
        'time': x[index],
        'admoney': y.admoney[index],
        'click': y.click[index],
        'cpc': y.cpc[index],
        'cpm': y.cpm[index],
        'ctr': y.ctr[index],
        'pv': y.pv[index]
      })
    })
    return list;
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
        { data: d },
      ]
    }

    if (max) {
      option.yAxis.max = max
    } else {
      option.yAxis.max = null;
    }
    echartsInstance.setOption(option);
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
        left: '3%',
        right: '4%',
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

}
