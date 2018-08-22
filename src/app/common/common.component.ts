import { ChangeDetectorRef} from '@angular/core';

export class BaseIndexComponent {

  constructor(
    protected changeDetectorRef: ChangeDetectorRef
  ) { }


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

}
