import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AutoCookie} from '../../../../decorator/decorator';
import {ActivatedRoute, Router} from '@angular/router';
import {Global} from '../../../../service/global';
import {Dialog} from '../../../../components/dialog/dialog';
import {Notification} from '../../../../components/notification/notification';
import {CampaignService} from '../../../../service/customer/campaign.service';

@Component({
  selector: 'app-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.less']
})
export class CampaignComponent implements OnInit {

  @AutoCookie({
    defaultValue: {
      page_index: 1,
      page_size: 10
    },
    keepValue: {
      begin_date: new Date().calendar(2, -1).formatDate('yyyy-MM-dd'),
      end_date: new Date().formatDate('yyyy-MM-dd')
    },
    cookieKey: 'CampaignComponent'
  })
  query;
  other;
  total_count;

  current_state_list;
  show_state_list;
  tableList = Array.from({length: 30}).fill(1)

  search() {
    this.query.page_index = 1;
    this.list();
  }

  exportUrl() {
    let url = this._campaignService.campaignUrl({
      ...this.query
    });
    window.open(url);
  }

  list() {

  }

  batchUpdate(type) {

  }

  constructor(private changeDetectorRef: ChangeDetectorRef,
              private router: Router,
              private route: ActivatedRoute,
              private _notification: Notification,
              private  _global: Global,
              private _dialog: Dialog,
              private _campaignService: CampaignService) {
    let params = route.snapshot.params;
    let queryParams = route.snapshot.queryParams;
    let data = route.snapshot.data;
  }

  ngOnInit() {
    this._campaignService.init().subscribe(res => {
      this.current_state_list = res.result.current_state_list;
      this.show_state_list = res.result.show_state_list;
    });
  }

}
