import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ReportService} from '../../../../service/customer/report.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.less']
})

export class DatetimeComponent implements OnInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private _reportService: ReportService,
    private route: ActivatedRoute
  ) {
  }

  tableList: Array<any> = [];
  listArray: Array<any> = [];
  total_count;
  listTitle;
  authList;
  authUser;
  query: any = {
    page_index: 1,
    page_size: 20,
    begin_date: new Date().calendar(3, -6).formatDate('yyyy-MM-dd'),
    end_date: new Date().formatDate('yyyy-MM-dd'),
  };

  ngOnInit() {
    const obj = this.route.snapshot.data['auth'];
    this.authList = obj['jurisdiction_list']
    this.authUser = obj['user'];
    this.init();
    this.list();
  }

  search() {
    this.query.page_index = 1;
    this.list();
  }

  list() {
    this._reportService.dateList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
      this.listTitle = res.result.other;
    })
  }

  init() {
    this._reportService.init().subscribe(res => {
      this.listArray = res.result.campaigns;
      this.listArray.forEach(item => {
        item.name = item.campaign_name + item.show_state_meaning;
      })
    })
  }

  exportUrl() {
    let url = this._reportService.datetimeExport({...this.query});
    window.open(url);
  }

}
