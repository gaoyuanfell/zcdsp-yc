import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Global} from '../../service/global';
import {TheadComponent} from './thead.component';
import {TbodyComponent} from './tbody.component';
import {Subject} from 'rxjs';
import {TfootComponent} from './tfoot.component';
import {TableOverflowComponent} from './table-overflow.component';
import {TablePaginatorComponent} from './table-paginator.component';

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
  selector: 'yc-table',
  exportAs: 'ycTable',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit, AfterContentInit, OnChanges, OnDestroy {

  @Input() total;
  @Input() fixed;

  tbodyList: Array<TbodyComponent> = [];
  theadList: Array<TheadComponent> = [];
  tfootList: Array<TfootComponent> = [];

  private _queryRef: ElementRef;
  private _tableRef: ElementRef;
  private _tableWrapRef: ElementRef;
  private _tableContainerRef: ElementRef;
  private _overflowRef: TableOverflowComponent;
  private _paginatorRef: TablePaginatorComponent;

  get queryRef(): ElementRef {
    return this._queryRef;
  }

  @ContentChild('queryRef') set queryRef(value: ElementRef) {
    this._queryRef = value;
  }

  get tableRef(): ElementRef {
    return this._tableRef;
  }

  @ContentChild('tableRef') set tableRef(value: ElementRef) {
    this._tableRef = value;
  }

  get tableWrapRef(): ElementRef {
    return this._tableWrapRef;
  }

  @ViewChild('tableWrapRef') set tableWrapRef(value: ElementRef) {
    this._tableWrapRef = value;
  }

  get tableContainerRef(): ElementRef {
    return this._tableContainerRef;
  }

  @ViewChild('tableContainerRef') set tableContainerRef(value: ElementRef) {
    this._tableContainerRef = value;
  }

  @ContentChild('overflowRef') set overflowRef(val: TableOverflowComponent) {
    console.info(val)
    this._overflowRef = val;
  }

  get overflowRef():TableOverflowComponent {
    return this._overflowRef;
  }

  @ContentChild('paginatorRef') set paginatorRef(val: TablePaginatorComponent){
    this._paginatorRef = val
  }

  get paginatorRef():TablePaginatorComponent {
    return this._paginatorRef;
  }


  constructor(private renderer: Renderer2,
              private _global: Global,
              private changeDetectorRef: ChangeDetectorRef) {
  }


  ngAfterContentInit(): void {

    if(this.overflowRef){
      this.overflowRef.overflowSubject.subscribe(({left}) => {
        this.tableWrapRef.nativeElement.scrollLeft = left;
      })
    }

    let _queryRef: HTMLElement;
    if (this.queryRef) {
      _queryRef = <HTMLElement>this.queryRef.nativeElement;
      (<HTMLElement>this.tableWrapRef.nativeElement).style.paddingTop = `${_queryRef.clientHeight}px`;
      let bcrt1 = this._global.containerFullRef.getBoundingClientRect();
      let bcrt2 = this.tableContainerRef.nativeElement.getBoundingClientRect();
      let offsetTop = bcrt2.top - bcrt1.top;
      this._global.overflowSubject.subscribe(({top}) => {
        if (offsetTop < top) {
          _queryRef.style.top = `${top - offsetTop}px`;
        } else {
          _queryRef.style.top = `0px`;
        }
      });
    }

  }

  overflowHeight = 0
  paginatorHeight = 0

  ngOnInit() {
    this.checkAllObservable.subscribe((data) => {
      if (data) {
        this.selectData.push(...this.data);
      } else {
        this.selectData.length = 0;
      }
      this.tbodyList.forEach(tbody => {
        tbody.trList.forEach(tr => {
          let list = tr.tdList.filter(td => td.showCheckbox);
          list.forEach(l => {
            l.checked = data;
          });
        });
      });
    });

    this.changeCheckObservable.subscribe(params => {

      if (params.checked) {
        this.selectData.push(params.data);
      } else {
        let index = this.selectData.indexOf(params.data);
        this.selectData.splice(index, 1);
      }

      this.tbodyList.forEach(tbody => {

        let allList = tbody.trList.map(tr => tr.tdList.filter(td => td.showCheckbox)[0]);
        let checkList = allList.filter(l => l && l.checked);

        if (checkList.length === allList.length && checkList.length && allList.length) {
          // 全选状态
          this.changeTdStateObservable.next({
            checked: true,
            checkState: 1
          });
        } else if (checkList.length != allList.length && checkList.length) {
          // 非全选状态
          this.changeTdStateObservable.next({
            checked: false,
            checkState: 2
          });
        } else {
          // 都没有选中
          this.changeTdStateObservable.next({
            checked: false,
            checkState: 0
          });
        }

      });
    });

    this.changeSortObservable.subscribe(params => {
      if (this.theadList[0]) {
        let allList = this.theadList[0].trList.map(tr => tr.thList.filter(th => th.showSort))[0];
        if (allList instanceof Array && allList.length) {
          allList.forEach(th => {
            th.status = '2';
          });
          this.query.sort_expression = params.sort_expression;
          this.query.sort_direction = params.sort_direction;
          this.changeEvent.emit(this.query);  // 发射到页面
        }
      }
    });

    ////
    if(this.overflowRef) {
      this.overflowHeight = this.overflowRef.ref.nativeElement.getBoundingClientRect().height
    }
    if(this.paginatorRef) {
      this.paginatorHeight = this.paginatorRef.ref.nativeElement.getBoundingClientRect().height
    }

    this._global.overflowSubject.subscribe(({top}) => {
      this.position();
    })
  }

  // ------------------ 数据 ------------------ //

  selectData = [];

  _props: Props = {
    page_size: 'page_size',
    page_index: 'page_index',
    sort_expression: 'sort_expression',
    sort_direction: 'sort_direction',
  };

  @Input('props') set props(val: Props) {
    if (val) {
      Object.assign(this._props, val);
      Object.assign(val, this._props);
      this._props = val;
    }
  };

  private _query: any = {};

  @Input() set query(query) {
    if (query) {
      this._query = query;
      if (!this._query[this._props.page_index]) this._query[this._props.page_index] = 1;
      if (!this._query[this._props.page_size]) this._query[this._props.page_size] = 10;
    }
  }

  get query() {
    return this._query;
  }

  @Output() selectChange = new EventEmitter<any>();
  @Output() changeEvent = new EventEmitter<any>();

  private _data: Array<any> = [];

  get data(): Array<any> {
    return this._data;
  }

  @Input() set data(value: Array<any>) {
    this._data = value;
    this.changeTdStateObservable.next({
      checked: false,
      checkState: 0
    });
    this.selectData = [];

    if(!value) return

    setTimeout(()=> {
      if(this.overflowRef){
        let _tableRef = <HTMLElement>this.tableRef.nativeElement;
        this.overflowRef.width = _tableRef.clientWidth
      }
      this.position()
    })
  }

  position(){
    let bcrt1 = this._global.containerFullRef.getBoundingClientRect();
    let bcrt2 = this.tableWrapRef.nativeElement.getBoundingClientRect();
    let bottom = bcrt2.bottom - bcrt1.bottom + this.paginatorHeight + this.overflowHeight;
    if(bottom < 0) bottom = 0;
    if(this.tfootList.length){
      this.tfootList[0].trList.forEach(tr => {
        tr.tdList.forEach(td => {
          td.ref.nativeElement.style.bottom = `${bottom}px`
        })
      })
    }
    if(this.overflowRef){
      this.overflowRef.bottom = `${bottom}`;
    }
    if(this.paginatorRef){
      this.paginatorRef.bottom = `${bottom}`;
    }
  }

  checkAllObservable = new Subject<any>();
  changeCheckObservable = new Subject<any>();
  changeTdStateObservable = new Subject<any>();
  changeSortObservable = new Subject<any>();
  changeExpandObservable = new Subject<any>();

  // ------------------------------------ //

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }

  ngOnDestroy(): void {
    this.checkAllObservable.unsubscribe();
    this.changeCheckObservable.unsubscribe();
    this.changeTdStateObservable.unsubscribe();
    this.changeSortObservable.unsubscribe();
    this.changeExpandObservable.unsubscribe();
  }
}
