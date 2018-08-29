import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ReportService} from '../../../../service/customer/report.service';
import {ActivatedRoute} from '@angular/router'

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.less']
})
export class CampaignComponent implements OnInit {
  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _reportService: ReportService,
    private route: ActivatedRoute
  ) {
  }

  listArray: Array<any> = [];
  total_count;
  tableList: Array<any>;
  listTitle;
  authList;
  authUser;

  // 保存状态 定时更新时间 装饰器 select刷新保存状态
  // @AutoCookie({
  //   defaultValue: {
  //     page_index: 1,
  //     page_size: 10
  //   },
  //   keepValue: {
  //     begin_date: new Date().calendar(2, -1).formatDate('yyyy-MM-dd'),
  //     end_date: new Date().formatDate('yyyy-MM-dd'),
  //   }
  // })
  query: any = {
    page_index: 1,
    page_size: 10,
    begin_date: new Date().formatDate('yyyy-MM-dd'),
    end_date: new Date().formatDate('yyyy-MM-dd'),
  };

  ngOnInit() {
    const obj = this.route.snapshot.data['auth'];
    this.authList = obj['jurisdiction_list']
    this.authUser = obj['user'];
    this.init();
    this.list();
  }

  /**
   * 查询条件的搜索
   */
  search() {
    // 点击查询条件的时候，默认page_size = 1 ,可能你处于第四页，这时候点击搜索，传到后端的page_size=4
    this.query.page_index = 1;
    this.list();
  }

  /**
   * 列表初始化
   */
  list() {
    this._reportService.campaignList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
      this.listTitle = res.result.other;
    })
  }

  /**
   * 头部信息初始化
   */
  init() {
    this._reportService.init().subscribe(res => {
      this.listArray = res.result.campaigns;
      this.listArray.forEach(item => {
        item.name = item.campaign_name + item.show_state_meaning;
      })
    })
  }

  /**
   * 导出
   */
  exportUrl() {
    let url = this._reportService.campaignExport({
      ...this.query
    });
    window.open(url);
  }

}
