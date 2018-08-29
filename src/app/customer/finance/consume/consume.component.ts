import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FinanceService} from '../../../../service/customer/finance.service';
import {Dialog} from '../../../../components/dialog/dialog';
import {ActivatedRoute, Router} from '@angular/router';
import {PopoverDirective} from '../../../../components/popover/popover.directive';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-consume',
  templateUrl: './consume.component.html',
  styleUrls: ['./consume.component.less']
})
export class ConsumeComponent implements OnInit {
  // 唯一
  closeSubject = new Subject();
  _popoverRef;
  @ViewChild('templateRecharge', {read: TemplateRef}) templateRecharge: TemplateRef<any>;
  @ViewChild('chinaDataChart') chinaDataChartRef: ElementRef;

  // ngIf的限制，用set捕获
  @ViewChild('popover', {read: PopoverDirective}) set popoverRef(val) {
    this._popoverRef = val
  }

  chinaDataEcharts;
  authList;
  authUser;

  constructor(
    private _financeService: FinanceService,
    protected _dialog: Dialog,
    private route: ActivatedRoute,
    private router: Router
  ) {
  }

  tableList: Array<any> = [];
  total_count;
  echartsData;
  userData: any;
  money; // 修改的预算金额
  query: any = {
    page_index: 1,
    page_size: 10,
    begin_date: new Date().calendar(2, -1).formatDate('yyyy-MM-dd'),
    end_date: new Date().formatDate('yyyy-MM-dd'),
  };

  isPermit(type) {
    return this.authList.indexOf(type) > -1
  }

  ngOnInit() {
    const obj = this.route.snapshot.data['auth'];
    this.authList = Object.keys(obj['jurisdiction_list']);
    this.authUser = obj['user'];
    this.chinaDataChart();
    this.init();
    this.list();
  }

  search() {
    this.query.page_index = 1;
    this.list();
  }

  list() {
    this._financeService.consumeList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
    })
  }


  init() {
    this._financeService.consumeInit().subscribe(res => {
      this.echartsData = res.result.charts;
      this.userData = res.result.user;
      this.chinaDataEcharts.setOption({
        series: [
          {

            data: [{value: this.echartsData.click, name: '点击总量', body: {name: '点击率', value: (this.echartsData.ctr  * 100).toFixed(2) }}]
          },
          {
            data: [{value: this.echartsData.pv, name: '曝光总量', body: {name: '点击率', value: (this.echartsData.ctr  * 100).toFixed(2)}}]
          }
        ]
      })
      // 一灭一亮
      this.chinaDataEcharts.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
      this.chinaDataEcharts.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0,
      });
    })
  }

  exportUrl() {
    let url = this._financeService.consumeExport({
      ...this.query
    });
    window.open(url);
  }

  postBudget() {
    if (this.money) {
      this._financeService.dayMoneyUpdate({money: Number(Number(this.money).toFixed(2))}).subscribe(res => {
        if (res.success === 200) {
          this.init();
        }
      })
    }
  }


  recharge() {
    this._dialog.open(this.templateRecharge, {title: '充值流程', flag: false}).subscribe(data => {
    });
  }

  chinaDataChart() {
    // dom标签
    const chinaDataChartRef = this.chinaDataEcharts = echarts.init(this.chinaDataChartRef.nativeElement);
    chinaDataChartRef.setOption({
      tooltip: {
        trigger: 'item',
        show: false,
        formatter: '{a} <br/>{b} : {c}' // ({d}%)
      },
      color: ['#2e90ff', '#ffc94a'],
      series: [
        {
          name: '点击总量',
          type: 'pie',
          radius: ['55%', '66%'],
          avoidLabelOverlap: false,
          hoverOffset: 3,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              formatter: (params) => {
                return `{t1|${params.data.body.name}} \n {t2|${params.data.body.value}%}`;
              },
              lineHeight: 26,
              rich: {
                t1: {
                  color: '#616366',
                  fontSize: 12,
                },
                t2: {
                  color: '#616366',
                  fontSize: 12,
                }
              },
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        },
        {
          name: '曝光总量',
          type: 'pie',
          radius: ['75%', '93%'],
          avoidLabelOverlap: false,
          hoverOffset: 3,
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              formatter: (params) => {
                return `{t1|${params.data.body.name}} \n {t2|${params.data.body.value}%}`;
              },
              lineHeight: 26,
              rich: {
                t1: {
                  color: '#616366',
                  fontSize: 12,
                },
                t2: {
                  color: '#616366',
                  fontSize: 12,
                }
              },
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          }
        }
      ]
    });

    chinaDataChartRef.on('mouseover', (params) => {
      chinaDataChartRef.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
      chinaDataChartRef.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex,
      });
    });

    chinaDataChartRef.on('mouseout', (params) => {
      chinaDataChartRef.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex,
      });
    });

    // chinaDataChartRef.on('mouseover', (params) => {
    //   if (params.dataIndex === 0) return;
    //   chinaDataChartRef.dispatchAction({
    //     type: 'downplay',
    //     seriesIndex: 0,
    //     dataIndex: 0,
    //   });
    // });
    // chinaDataChartRef.on('mouseout', () => {
    //   chinaDataChartRef.dispatchAction({
    //     type: 'highlight',
    //     seriesIndex: 0,
    //     dataIndex: 0,
    //   });
    // });
    // chinaDataChartRef.dispatchAction({
    //   type: 'highlight',
    //   seriesIndex: 0,
    //   dataIndex: 0,
    // });
    /*window.addEventListener('resize', () => {
      chinaDataChartRef.resize();
    });*/
  }
}
