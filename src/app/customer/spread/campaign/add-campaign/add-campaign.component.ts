import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-add-campaign',
  templateUrl: './add-campaign.component.html',
  styleUrls: ['./add-campaign.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,  // 数据手动刷新
  preserveWhitespaces: false,
  animations: [
    trigger('panel', [
      state('false', style({height: '0px', visibility: 'hidden'})),
      state('true', style({height: '*', visibility: 'visible'})),
      transition('true <=> false', animate('225ms cubic-bezier(0.4,0.0,0.2,1)')),
      state('', style({
        height: '0px', visibility: 'hidden'
      })),
    ])
  ],
})
export class AddCampaignComponent implements OnInit {

  test;

  campaign: any = {};

  constructor() {
  }

  ngOnInit() {
  }

}
