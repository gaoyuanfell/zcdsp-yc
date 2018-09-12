import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output} from '@angular/core';

export interface PageData {
  number?: number
  type?: number
  text?: string
}

export interface Props {
  page_size?: string;
  page_index?: string;
  sort_expression?: string; // 排序字段
  sort_direction?: string; // 1 :降序，0：升序
}

@Component({
  selector: 'yc-table-paginator',
  template: `
    <div class="paging" #pagingRef [hidden]="!(pageList?.length)" [ngStyle]="{'bottom.px': bottom}">
      <span class="first" (click)="go(1)">
        首页
      </span>
      <span class="up" (click)="prev(-1)" data-type="1" data-number="-1" title="上一页">
        上一页
      </span>

      <ng-template ngFor [ngForOf]="pageList" let-p>
        <span (click)="go(p.number)" data-type="2" *ngIf="p.type === 1" [title]="'第'+ p.number +'页'" [attr.data-number]="p.number"
              [class.active]="p.number == pageIndex">
          {{p.number}}
        </span>
        <span data-type="2" *ngIf="p.type === 0">
          {{p.text}}
        </span>
      </ng-template>

      <span class="down" (click)="next(1)" data-type="3" data-number="1" title="下一页">
        下一页
      </span>
      <span class="last" (click)="go(totalPage)">
        尾页
      </span>
    </div>
  `,
  styles: [
      `
      :host {
        height: 70px;
        display: block;
        background-color: inherit;
      }

      .paging {
        text-align: right;
        z-index: 30;
        padding: 20px 0;
        position: relative;
        background-color: inherit;
      }

      .paging > span {
        border: 1px solid #e2e6eb;
        background-color: #ffffff;
        font-size: 14px;
        font-weight: 400;
        color: #333333;
        padding: 4px 14px;
        display: inline-block;
        margin-right: 1px;
        cursor: pointer;
      }

      .paging > span.active {
        background-color: #efefef;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class TablePaginatorComponent {

  private _bottom

  get bottom() {
    return this._bottom;
  }

  set bottom(value) {
    this._bottom = value;
    this.changeDetectorRef.markForCheck();
  }

  constructor(public ref: ElementRef,private changeDetectorRef:ChangeDetectorRef){

  }


  private _query: any = {};
  private _total;

  pageList;

  private _props: Props = {
    page_size: 'page_size',
    page_index: 'page_index',
    sort_expression: 'sort_expression',
    sort_direction: 'sort_direction',
  };

  @Input() pageText: string = '...';
  @Input() pageNum: number = 3;
  @Output() changeEvent = new EventEmitter<any>();

  @Input() set query(query) {
    this._query = query;
  }

  get query() {
    return this._query;
  }

  get total() {
    return this._total;
  }

  get pageIndex() {
    if (!this._query) return 0;
    return this._query[this._props.page_index];
  }

  get totalPage(): number {
    let totalPage = 0;
    if (this.total % this.query[this._props.page_size]) {  //
      totalPage = Math.floor(this.total / this.query[this._props.page_size]) + 1;
    } else {
      totalPage = this.total / this.query[this._props.page_size];
    }
    return totalPage || 0;
  }

  @Input() set total(value) {
    this._total = value;
    this.pageList = this.getPageList(this.pageNum, this.totalPage, this.query[this._props.page_index]);
  }

  go(number) {
    console.log(number);
    this.query[this._props.page_index] = number;
    this.pageList = this.getPageList(this.pageNum, this.totalPage, this.query[this._props.page_index]);
    this.changeEvent.next(this._query);
  }

  prev(number) {
    if (this.query[this._props.page_index] <= 1) return;
    this.query[this._props.page_index] += number;
    this.pageList = this.getPageList(this.pageNum, this.totalPage, this.query[this._props.page_index]);
    this.changeEvent.next(this._query);
  }

  next(number) {
    if (this.totalPage <= this.query[this._props.page_index]) return;
    this.query[this._props.page_index] += number;
    this.pageList = this.getPageList(this.pageNum, this.totalPage, this.query[this._props.page_index]);
    this.changeEvent.next(this._query);
  }


  getPageList(n: number, tp: number, p: number) {
    n = +n;
    tp = +tp;
    p = +p;
    if (p > tp) {
      p = 1;
    }
    let arr: PageData[] = [];
    let s = n * 2 + 5;
    if (tp >= s) {
      let _n = n;
      let _p = p;
      if (p - n - 2 < 1) {
        while (_p) {
          arr.unshift({number: _p, type: 1});
          --_p;
        }
        _p = p;
        while (++_p <= n * 2 + 3) {
          arr.push({number: _p, type: 1});
        }
        arr.push({text: this.pageText, type: 0}, {number: tp, type: 1});
      } else if (p + n + 2 > tp) {
        while (_p <= tp) {
          arr.push({number: _p, type: 1});
          ++_p;
        }
        _p = p;
        while (--_p > tp - n * 2 - 3) {
          arr.unshift({number: _p, type: 1});
        }
        arr.unshift({number: 1, type: 1}, {text: this.pageText, type: 0});
      } else {
        while (_n) {
          arr.push({number: p - _n, type: 1});
          --_n;
        }
        arr.push({number: p, type: 1});
        _n = n;
        let i = 1;
        while (i <= _n) {
          arr.push({number: p + i, type: 1});
          ++i;
        }
        arr.unshift({number: 1, type: 1}, {text: this.pageText, type: 0});
        arr.push({text: this.pageText, type: 0}, {number: tp, type: 1});
      }
    } else {
      while (tp) {
        arr.unshift({number: tp--, type: 1});
      }
    }
    return arr;
  }
}
