import {ChangeDetectorRef, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {PublicService} from '../../service/public.service';
import * as chinaJson from 'echarts/map/json/china.json';

export class BaseIndexComponent implements OnInit{
  // 曝光总量
  @ViewChild('todayAllSpendChartSmall') todayAllSpendChartSmallRef: ElementRef;
  todayAllSpendChartSmalls;
  // 点击总量
  @ViewChild('todayAllSpendChartLine') todayAllSpendChartLineRef: ElementRef;
  todayAllSpendChartLines;
  @ViewChild('todayReportChart') todayReportChartRef: ElementRef;
  todayReportEcharts;
  @ViewChild('todayAllDataChart') todayAllDataChartRef: ElementRef;
  todayAllDataEcharts;
  @ViewChild('todayAllSpendChart') todayAllSpendChartRef: ElementRef;
  todayAllSpendEcharts;
  // todayAllSpend = 'pv';
  @ViewChild('socialDataChart') socialDataChartRef: ElementRef;
  socialDataEcharts;
  @ViewChild('hobbyDataChart') hobbyDataChartRef: ElementRef;
  hobbyDataEcharts;
  @ViewChild('chinaDataChart') chinaDataChartRef: ElementRef;
  chinaDataEcharts;
  @ViewChild('AgeWidth') AgeWidth: ElementRef;
  color = ['#ff7f24', '#1fcf88', '#f14c5d', '#3c61ff', '#F5CDFF', '#8c5cff', '#ffba48', '#FF86A1', '#d6ca00', '#FF0C35', '#33bcfb', '#047962'];

  todayAllSpend = 'cpm';

  constructor(
    protected changeDetectorRef: ChangeDetectorRef,
    protected _publicService: PublicService,
    protected  render: Renderer2
  ) { }

  ngOnInit() {
    console.log('hahha')
    this.render.listen('window', 'resize', (res) => {
      console.dir(res)

    })
  }


  /**
   * 数据趋势
   */
  todayReportChart() {
    const todayReportChartRef = this.todayReportEcharts = echarts.init(this.todayReportChartRef.nativeElement);
    todayReportChartRef.setOption({
      title: {
        text: '2018-08-12数据趋势',
        textStyle: {
          fontWeight: 400,
          fontSize: 14,
          color: '#616366',
          align: 'left'
        },
        padding: 0
      },
      color: ['#2e90ff', '#ffa542'],
      legend: {
        itemWidth: 48,
        data: ['数据趋势'],
        right: 0,
        textStyle: {
          color: '#ccc'
        }
      },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        padding: [10, 8],
        textStyle: {
          color: 'black',
          fontSize: 10,
          fontFamily: '微软雅黑 Regular'
        },
        formatter: function (params) {
          let str = '';
          str = str + params[0].axisValue + '<div style="margin-bottom:8px"></div>';  // title
          str = str +  `
              <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${params[0].color}"></div>
              ${params[0].seriesName}<span style="margin-right:20px"></span>${params[0].data}
              `
          return str;
        }
      },
      grid: {
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
          lineStyle:{
            color:['#f7f8fa'],
            width: 2,
            type: 'dashed'
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
          lineStyle:{
            color:['#f7f8fa'],
            width: 2,
            type: 'dashed'
          }
        },
        axisLabel: {
          formatter: '{value} 次'
        }
      },
      series: [
        {
          name: '数据趋势',
          type: 'line',
          color: ['#2e90ff'],
          symbol: 'none'

        }
      ]
    });
    window.addEventListener('resize', () => {
      todayReportChartRef.resize();
    });
  }

  /**
   * 平台实时流量
   */
  todayAllDataChart() {
    const todayAllDataChartRef = this.todayAllDataEcharts = echarts.init(this.todayAllDataChartRef.nativeElement);
    todayAllDataChartRef.setOption(
      {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: [10, 8],
          textStyle: {
            color: 'black',
            fontSize: 10,
            fontFamily: '微软雅黑 Regular'
          },
          formatter: function (params) {
            let str = '';
            str = str + params[0].axisValue + '<div style="margin-bottom:8px"></div>';  // title
            str = str +  `
              <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${params[0].color}"></div>
              ${params[0].seriesName}<span style="margin-right:20px"></span>${params[0].data}
              `
            return str;
          }
        },
        xAxis : [
          {
            type : 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLabel : { // x轴字体颜色 y轴一样
              // formatter: '{value}',
              textStyle: {
                color: '#979899'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#eeecea'
              }
            },
          }
        ],
        yAxis : [
          {
            type : 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#979899'
              }
            },
            splitLine: {
              lineStyle:{
                color:['#f7f8fa'],
                width: 2,
                type: 'dashed'
              }
            }
          }
        ],
        series : [
          {
            name:'平台实时流量',
            type:'bar',
            barWidth: '7px',
            // data:[10, 52, 200, 334, 390, 330, 220],
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ['#43a3fb','#9ea7b4'];
                  return params.dataIndex % 2 === 0 ?  colorList[0] : colorList[1]
                },
                barBorderRadius:[10, 10, 0, 0]
              }
            }
          }
        ]
      }
      );
    window.addEventListener('resize', () => {
      todayAllDataChartRef.resize();
    });
  }

  /**
   * 平台实时效果
   */
  todayAllSpendChart() {
    const todayAllSpendChartRef = this.todayAllSpendEcharts = echarts.init(this.todayAllSpendChartRef.nativeElement);
    todayAllSpendChartRef.setOption(
      {
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: [10, 8],
          textStyle: {
            color: 'black',
            fontSize: 10,
            fontFamily: '微软雅黑 Regular'
          },
          formatter: function (params) {
            let str = '';
            str = str + params[0].axisValue + '<div style="margin-bottom:8px"></div>';  // title
            str = str +  `
              <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${params[0].color}"></div>
              ${params[0].seriesName}<span style="margin-right:20px"></span>${params[0].data}
              `
            return str;
          }
        },
        xAxis : [
          {
            type : 'category',
            axisTick: {
              alignWithLabel: true
            },
            axisLabel : { // x轴字体颜色 y轴一样
              // formatter: '{value}',
              textStyle: {
                color: '#979899'
              }
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#eeecea'
              }
            },
          }
        ],
        yAxis : [
          {
            type : 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
              lineStyle: {
                color: '#979899'
              }
            },
            splitLine: {
              lineStyle:{
                color:['#f7f8fa'],
                width: 2,
                type: 'dashed'
              }
            }
          }
        ],
        series : [
          {
            name:'直接访问',
            type:'bar',
            barWidth: '7px',
            // barWidth: '10%',
            itemStyle: {
              normal: {
                color: function (params) {
                  var colorList = ['#43a3fb','#9ea7b4'];
                  return params.dataIndex % 2 === 0 ?  colorList[0] : colorList[1]
                },
                barBorderRadius:[10, 10, 0, 0]
              }
            }
          }
        ]
      }
    );
    window.addEventListener('resize', () => {
      todayAllSpendChartRef.resize();
    });
  }


  /**
   * 曝光总量
   */
  todayAllSpendChartSmall() {
    const todayAllSpendChartSmallRef = this.todayAllSpendChartSmalls = echarts.init(this.todayAllSpendChartSmallRef.nativeElement);
    todayAllSpendChartSmallRef.setOption(
      {
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: [10, 8],
          textStyle: {
            color: 'black',
            fontSize: 10,
            fontFamily: '微软雅黑 Regular'
          },
          formatter: function (params) {
            let str = '';
            str = str + params[0].axisValue + '<div style="margin-bottom:8px"></div>';  // title
            str = str +  `
              <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${params[0].color}"></div>
              ${params[0].seriesName}<span style="margin-right:20px"></span>${params[0].data}
              `
            return str;
          }
        },
        color: ['#31c38f'],
        xAxis: {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },

          show:false,

          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          show:false,  // x,y周数据全部去掉 线也去 网格线也去
          type: 'value',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
        },
        series: [{
          barWidth: '30%',
          itemStyle: {
            normal: {
              // barBorderRadius:[10, 10, 0, 0]
            }
          },
          data: [120, 200, 150, 80, 70, 110, 130],
          type: 'bar'
        }]
      }
    );
  }


  /**
   * 今日在投创意 今日在投活动 类型切换
   * @param echartsInstance
   * @param data
   * @param type
   */
  changeCampaignAndCreativeChart(echartsInstance, data, type) {
    let suffix;
    let today = data.y[type].today;
    let yesterday = data.y[type].yesterday;
    let max;
    switch (type) {
      case 'pv':
      case 'click':
        suffix = '次';
        // max = (value) => {
        //   return value.max <= 5000 ? 5000 : Math.round(value.max);
        // }
        break;
      case 'ctr': // 100
        today = today.map(td => (td * 100).toFixed(2));
        yesterday = yesterday.map(yd => (yd * 100 || 0).toFixed(2));
        suffix = '%';
        break;
      case 'cpm': // 1000
        today = today.map(td => (td * 1000).toFixed(2));
        yesterday = yesterday.map(yd => (yd * 1000 || 0).toFixed(2));
        suffix = '元';
        break;
      case 'cpc':
      case 'admoney':
        today = today.map(td => (td * 1).toFixed(2));
        yesterday = yesterday.map(yd => (yd * 1 || 0).toFixed(2));
        suffix = '元';
        break;
    }
    const option: any = {
      xAxis: {
        data: data.x
      },
      yAxis: {
        axisLabel: {
          formatter: `{value} ${suffix}`
        }
      },
      series: [
        {data: today},
        {data: yesterday},
      ]
    };
    if (max) {
      option.yAxis.max = max;
    } else {
      option.yAxis.max = null;
    }
    echartsInstance.setOption(option);
  }

  /**
   * 数据趋势 实时效果数据 类型切换
   * @param echartsInstance
   * @param data
   * @param type
   */
  changeDayTotalChart(echartsInstance, data, type) {  // echarts 表单数组
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

  /**
   * 数据趋势表格数据处理
   * @param echartsInstance
   * @param data
   * @param type
   */
  dayTotalList: any = [];
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
    this.dayTotalList = list;

  }


  /**
   * 移动设备偏好
   * @param echartsInstance
   * @param data
   * @param type
   */
  socialDataChart() {
    const socialDataEcharts = this.socialDataEcharts = echarts.init(this.socialDataChartRef.nativeElement);
    socialDataEcharts.setOption({
      title: {
        textStyle: {
          fontWeight: 700,
          fontSize: 18,
          color: '#616366',
          align: 'left'
        },
        padding: 0
      },
      color: ['#2e90ff', '#1fcf88', '#f14c5d', '#3c61ff', '#ff9727', '#8c5cff', '#ffba48'],
      series: [
        {
          name: '年龄比例',
          type: 'pie',
          radius: ['60%', '99%'],  // 圆的大小是根据第二个参数来的
          avoidLabelOverlap: false,
          hoverOffset: 3,
          itemStyle: {   // 每个之间的间距
            normal: {
              borderWidth: 4,
              borderColor: '#ffffff',
              }
            },
          label: {
            normal: {
              show: false,
              position: 'center'
            },
            emphasis: {
              show: true,
              formatter: (params) => {
                return `{t1|${params.name}} \n {t2|${params.percent}%}`;
              },
              lineHeight: 26,
              rich: {
                t1: {
                  fontSize: 14,
                  fontWeight: 700,
                },
                t2: {
                  color: '#616366',
                  fontSize: 18,
                }
              },
            }
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: []
        }
      ]
    });
    socialDataEcharts.on('mouseover', (params) => {
      socialDataEcharts.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
      });
      socialDataEcharts.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex,
      });
    });
    socialDataEcharts.on('mouseout', (params) => {
      socialDataEcharts.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: params.dataIndex,
      });
    });
    window.addEventListener('resize', () => {
      socialDataEcharts.resize();
    });
  }


  /**
   * 兴趣爱好
   * @param echartsInstance
   * @param data
   * @param type
   */
  hobbyDataChart() {
    const hobbyData = this.hobbyDataEcharts = echarts.init(this.hobbyDataChartRef.nativeElement);
    hobbyData.setOption(
      {
        radar: [
          {
            indicator: [
              {text: '品牌', max: 100},
              {text: '内容', max: 100},
              {text: '可用性', max: 100},
              {text: '功能', max: 100},
              {text: '功能', max: 100},
              {text: '功能', max: 100},
              {text: '功能', max: 100},
            ],
            center: ['50%','50%'],
            radius: '80%',
            splitLine: {
              lineStyle: {
                color: [
                  'lightgray'
                ]
              }
            },
            splitArea: { // 是否显示网格背景
              show: false
            },
            axisLine: {
              show: false,  //
            }
          }
        ],
        series: [
          {
            type: 'radar',
            tooltip: {
              trigger: 'item'
            },
            symbolSize: 13,  // 拐点大小
            itemStyle: {
              normal: {
                color : "#2e90ff",  // 拐点颜色
                areaStyle: {
                  color: '#43a3fb'  // 选中部分的背景色
                },
                lineStyle: {
                  color:"#2e90ff" // 图表中各个图区域的边框线颜色
                },
              }
            },
            data: [
              {
                value: [60,73,85,40,40,40,40],
                name: '某软件'
              }
            ]
          }
        ]
      }
  );
    window.addEventListener('resize', () => {
      hobbyData.resize();
    });
  }

  /**
   * 首页点击总量
   * @param echartsInstance
   * @param data
   * @param type
   */
  todayAllSpendChartLine() {
    const todayAllSpendChartLine = this.todayAllSpendChartLines = echarts.init(this.todayAllSpendChartLineRef.nativeElement);
    todayAllSpendChartLine.setOption(
      {
        color: ['#975fe4'],
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#fff',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: [10, 8],
          textStyle: {
            color: 'black',
            fontSize: 10,
            fontFamily: '微软雅黑 Regular'
          },
          formatter: function (params, ticket, callback) {
            let str = '';
            str = str + params[0].axisValue + '<div style="margin-bottom:8px"></div>';  // title
            if (params.length > 1) {
              params.forEach( item => {
                // 模板字符串
                str = str + `
                <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${item.color}"></div>
                ${item.seriesName}<span style="margin-right:20px"></span>${item.data}<div style="margin-top:5px"></div>
              `;
                /*str = str + '<div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: "' + params.color + ' ></div>' +
                  item.seriesName + '<span style="margin-right:20px"></span>' + item.data + '<div style="margin-top:5px"></div>';*/
              });
            } else {
              str = str +  `
              <div style="display:inline-block; vertical-align: middle; margin-right: 7px; width:5px; height:5px;border-radius: 5px;background-color: ${params[0].color}"></div>
              ${params[0].seriesName}<span style="margin-right:20px"></span>${params[0].data}
              `
            }
            return str;
          }
        },
        xAxis: {
          show: false,
          type: 'category',
          boundaryGap: false,
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        },
        yAxis: {
          show: false,
          type: 'value'
        },
        series: [{

          symbol:'circle',
          symbolSize: 8,//拐点大小
          data: [820, 932, 901, 934, 1290, 1330, 1320],
          type: 'line',
          areaStyle: {}
        }]
      }
  );
    window.addEventListener('resize', () => {
      todayAllSpendChartLine.resize();
    });
  }

  /**
   *   地域流量分布图
   */
  chinaDataChart() {
    const chinaDataEcharts = this.chinaDataEcharts = echarts.init(this.chinaDataChartRef.nativeElement);
    echarts.registerMap('china', chinaJson);
    chinaDataEcharts.setOption({
      title: {
        text: '地域流量分布图',
        textStyle: {
          fontWeight: 700,
          fontSize: 18,
          color: '#616366',
          align: 'left'
        },
        padding: 0
      },
      visualMap: {
        min: 0,
        max: 10000,
        text: ['高', '低'],
        realtime: true,
        right: 0,
        inRange: {
          color: ['#d5e9ff', '#abd3ff', '#82bcff', '#58a6ff', '#2e90ff']
        }
      },
      series: [{
        type: 'map',
        map: 'china',
        data: []
      }]
    })
    window.addEventListener('resize', () => {
      chinaDataEcharts.resize();
    });
  }

  /**
   * 平台实时流量  平台实时效果
   * 今日投放建议，媒体流量top5，性别占比，年龄比例，兴趣爱好，地域流量top10，地域流量分布图数据
   */
  all_ad_Flow;
  ad_total_echarts;
  brand;
  brandTotal;
  media_flow_top5;
  media_flow_top5_color = ['#2e90ff', '#ffaf57', '#ffaf57', '#35d494', '#35d494']
  hobby;
  hobbyTotal = 0;
  top_area_data;
  all_area_data;
  age;
  ageTotal = 0;
  //
  gender;
  genderMan;
  genderWoman;
  genderTotal = 0;
  genderUndefined;
  manPro;
  womanPro
  undefinedPro;
  //
  initData() {
    this._publicService.allNetWork().subscribe(res => {
      this.all_ad_Flow = res.result.all_ad_Flow; // 平台实时流量
      this.ad_total_echarts = res.result.ad_total_echarts; // 平台实时效果
      this.changeDetectorRef.markForCheck();
      this.todayAllDataEcharts.setOption(
        {
          xAxis : [
            {
              data : this.all_ad_Flow.x,
            }
          ],
          series : [
            {
              data:this.all_ad_Flow.y.req_num,
            }
          ]
        }
      )
      this.changeDayTotalChart(this.todayAllSpendEcharts, this.ad_total_echarts, this.todayAllSpend)

    });
    this._publicService.otherData().subscribe(res => {
      this.changeDetectorRef.markForCheck();



      // 手机品牌
      this.brand = res.result.brand;
      this.brandTotal = res.result.brand.reduce((a, b) => a + b.request_num, 0); // 总和
      const brandList = res.result.brand.map((item, index) => {
        item.color = this.color[index];
        return {
          name: item.brand_name,
          value: item.request_num
        };
      })
      this.socialDataEcharts.setOption({
        color: this.color,
        series: [
          {
            data: brandList
          }
        ]
      });
      this.socialDataEcharts.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: 0,
      });
      // 媒体流量
      this.media_flow_top5 = res.result.media_flow_top5;
      this.media_flow_top5.forEach ( (item, index) => item.color = this.media_flow_top5_color[index] )

      // 兴趣爱好
      this.hobby = res.result.hobby;
      let indicator = [];
      let hobbyMaxList = this.hobby.map(item => {
        return item.hobby_proportion;
      })
      this.hobby.forEach(item => {
        this.hobbyTotal = this.hobbyTotal + item.hobby_proportion;
        indicator.push ( {
          text: item.app_category_name,
          max: Math.max(...hobbyMaxList)
        })
      })
      this.hobbyDataEcharts.setOption(
        {
          radar: [
            {
              indicator: indicator
            }
          ],
          series: [
            {
              data: [
                {
                  value: hobbyMaxList,
                }
              ]
            }
          ]
        }
      );

      // 地域流量top10
      this.top_area_data = res.result.top_area_data;
      // 地域流量分布图数据
      let dataArea = res.result.all_area_data.map(f => {
        return {
          name: f.province_name.replace(/['省''市']/g, ''),
          value: f.territory_num
        };
      });
      this.all_area_data = res.result.all_area_data;
      this.chinaDataEcharts.setOption({
        visualMap: {
          min: Math.min(...dataArea.map(d => d.value)),
          max: Math.max(...dataArea.map(d => d.value)),
        },
        series: [
          {
            data: dataArea
          }
        ]
      });


      // 年龄
      this.age = res.result.age;
      this.age.forEach((item, index) => {
        this.ageTotal = this.ageTotal + item.age_proportion;
          index = +index + 1;
          item.src = "assets/index/" + index  + ".png"
      })

      // 性别
      this.gender = res.result.gender;
      this.gender.forEach((item) => {
        if (item.gender === '男') {
          item.src = "src/assets/index/man.png";
          this.genderMan = item.gender_proportion;
        } else if (item.gender === '女'){
          item.src = "src/assets/index/woman.png";
          this.genderWoman = item.gender_proportion;
        } else {
          item.src = "src/assets/index/undefined.png";
          this.genderUndefined = item.gender_proportion;
        }
        this.genderTotal = this.genderTotal + item.gender_proportion;
      })
      this.manPro = Number((this.genderMan / this.genderTotal).toFixed(2));
      this.womanPro = Number((this.genderWoman / this.genderTotal).toFixed(2));
      this.undefinedPro = Number((this.genderUndefined / this.genderTotal).toFixed(2));
    });
  }

  @ViewChild('SexWidth') SexWidth: ElementRef;
  _getSexStyle(index) {
      return {
        'top.px': index % 3 * 12,
        'left.px': Math.floor(index / 3) * 12
      };
  }

  _getAgeStyle(index) {
    if (this.AgeWidth) {
      let width = this.AgeWidth.nativeElement.offsetWidth;
      return {
        'left.px': width * index + (width / 0.1 * 0.03) * index
      };
    } else {
       return {}
    }
  }

  sexCount = 180;
  get180() {
    let x = this.sexCount ? this.sexCount : 180;
    let arr = [];
    let obj = {};
    if(this.manPro) {
      let manCount = this.manPro * x;
      let undefinedCount = this.undefinedPro * x;
      for (let i = 0; i < x; i++) {
        if (i < undefinedCount) {    // 未知
          obj = {'value': i, 'type': 'undefined'}
        } else if (i >= undefinedCount && i < manCount + undefinedCount) {
          obj = {'value': i, 'type': 'man'}
        } else {
          obj = {'value': i, 'type': 'woman'}
        }
        arr.push(obj);
      }
    }
    return arr;
  }

  _showHighlightChart(chart, index) {
    if (!chart) return;
    chart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
    });
    chart.dispatchAction({
      type: 'highlight',
      seriesIndex: 0,
      dataIndex: index,
    });
  }

  // 处理列表
  /**
   * 今日在投创意 今日在投活动   近期出具趋势 处理列表
   * @param echartsInstance
   * @param data
   * @param type
   */
  creativeCode = 'pv';
  creativeChartList: any = [];
  campaignChartList; any = [];
  campaignCode = 'pv';
  changeCampaignAndCreativeList(chartDatas, code, type) {
    let today =  chartDatas.y[code].today;
    let yesterday = chartDatas.y[code].yesterday;
    let unit = '次'
    switch (code) {
      case 'pv':
      case 'click':
        break;
      case 'ctr': // 100
        today = today.map(td => (td * 100).toFixed(2));
        yesterday = yesterday.map(yd => (yd * 100 || 0).toFixed(2));
        unit = '%';
        break;
      case 'cpm': // 1000
        today = today.map(td => (td * 1000).toFixed(2));
        yesterday = yesterday.map(yd => (yd * 1000 || 0).toFixed(2));
        unit = '元';
        break;
      case 'cpc':
      case 'admoney':
        today = today.map(td => (td * 1).toFixed(2));
        yesterday = yesterday.map(yd => (yd * 1 || 0).toFixed(2));
        unit = '元';
        break;
    }
    let list = [];
    let obj = {};
    chartDatas.x.forEach( (item, index) => {
     list.push (
       {
         'time':  chartDatas.x[index],
         'today': today[index],
         'yesterday': yesterday[index],
         'unit': unit
       }
     )
   })
    console.log(list)

    obj = {
      'first': list.slice(0,8),
      'second': list.slice(8,16),
      'third': list.slice(17,25)
    }

    if (type === 'creative') {
      this.creativeChartList = obj;
    } else if (type === 'campaign'){
      this.campaignChartList = obj;
      console.log(this.campaignChartList)
    }

  }




}
