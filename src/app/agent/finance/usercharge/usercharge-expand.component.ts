import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {FinanceService} from '../../../../service/agent/finance.service';


@Component({
  selector: 'yc-consume-expand',
  template: `
    <div class="parent">
      <div class="query-tool">
        <div class="left-tool">
          <input-datepicker [isRange]="true" [query]="query" [appendField]="['begin_date','end_date']" (search)="search()"></input-datepicker>
          <yc-checkbox-group [(ngModel)]="recharge_type" [list]="rechargeTypeData" (changeEvent)="search()" [props]="{value:'lookup_code',label:'meaning'}"></yc-checkbox-group>
        </div>
        <div class="right-tool">
          <div class="btn" (click)="exportUrl()">
            导出
            <i class="btn-icon-export"></i>
          </div>
        </div>
      </div>
      <yc-table #ycTable="ycTable" [data]="tableList" [query]="query" [total]="total_count" (changeEvent)="list()">
        
        <table #tableRef table>
          <thead>
            <tr style="background-color: #d3e9ff">
              <th>时间</th>
              <th>类型</th>
              <th class="text-right">金额</th>
              <th class="text-center">目标账号</th>
              <th class="text-center">目标公司</th>
              <th>备注</th>
            </tr>
          </thead>
          <tbody>
            <ng-template [ngForOf]="ycTable.data" ngFor let-data>
            <tr #tr class="text-center">
              <td (click)="tr.trigger()">{{data['creation_date'] === '小计' ? data['creation_date'] : data['creation_date'] | date:'yyyy-MM-dd HH:mm:ss' }}</td>
              <td>{{data['recharge_type_name']}}</td>
              <td class="text-right">{{data.money | currencyFormat}}</td>
              <td class="text-center">{{data['reciprocal_user_name']}}</td>
              <td class="text-center">{{data['reciprocal_nick_name']}}</td>
              <td>{{data.description}}</td>
            </tr>
          </ng-template>
          </tbody>
        </table>
        
        <yc-table-overflow #overflowRef style="background: #f9fafb;"></yc-table-overflow>
        <div paginator style="background: #f9fafb;">
          <yc-table-paginator #paginatorRef [total]="total_count" [query]="query" (changeEvent)="list()"></yc-table-paginator>
        </div>
      </yc-table>
      
    </div>
  `,
  styles: [
    `      
      .parent {
        background-color: rgba(48, 148, 255, 0.08);
      }
    `
  ]
})
export class UserchargeExpandComponent implements OnInit, AfterViewInit {
  constructor(
    private _financeService: FinanceService
  ) {
  }

  @Input() user_id;
  tableList: Array<any> = [];
  total_count;
  userData;
  recharge_type: Array<any> = [];
  rechargeTypeData;

  ngOnInit() {
    this.init();
    this.list();

  }

  init() {
    this._financeService.subsetInit({'user_id': this.user_id}).subscribe(res => {
      this.rechargeTypeData = res.result;
    })
  }
  list() {
    this.query.user_id = this.user_id;
    this._financeService.userAccountRechargeList(this.query).subscribe(res => {
      this.tableList = res.result.items;
      this.total_count = res.result.total_count;
    })
  }

  ngAfterViewInit(): void {
  }
  query: any = {
    page_index: 1,
    page_size: 20,
    begin_date: new Date().calendar(3, -6).formatDate('yyyy-MM-dd'),
    end_date: new Date().formatDate('yyyy-MM-dd'),
  }


  search() {
    if (this.recharge_type) {
      this.query.recharge_type = this.recharge_type.join(',');
    } else {
      delete  this.query.recharge_type;
    }
    this.query.page_index = 1;
    this.list();
  }

  exportUrl() {
    this.query.user_id = this.user_id;
    let url = this._financeService.userAccountConsumeExport({
      ...this.query
    });
    console.log(url)
    window.open(url);
  }
}
