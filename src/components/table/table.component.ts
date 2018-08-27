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
export class TableComponent implements OnInit, AfterContentInit, OnChanges {

  tbodyList: Array<TbodyComponent> = [];
  theadList: Array<TheadComponent> = [];

  private _queryRef: ElementRef;
  private _tableRef: ElementRef;
  private _overflowRef: ElementRef;
  private _tableWrapRef: ElementRef;
  private _tableContainerRef: ElementRef;
  private _pagingRef: ElementRef;

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

  get overflowRef(): ElementRef {
    return this._overflowRef;
  }

  @ViewChild('overflowRef') set overflowRef(value: ElementRef) {
    this._overflowRef = value;
    if (value) {

      this.renderer.listen(value.nativeElement, 'scroll', (event: Event | any) => {
        this.tableWrapRef.nativeElement.scrollLeft = event.target.scrollLeft;

        let _tableRef = <HTMLElement>this.tableRef.nativeElement;
        let _tableContainerRef = <HTMLElement>this.tableContainerRef.nativeElement;
        let tableBcrt = _tableContainerRef.getBoundingClientRect();

        this.theadList.forEach(thead => {
          thead.trList.forEach(tr => {
            let array = tr.thList.map(th => th.ref.nativeElement).filter(th => th.getAttribute('fixed'));
            array.forEach((th, index, array) => {
              let fixed = th.getAttribute('fixed');

              switch (fixed) {
                case 'left': {
                  let left = event.target.scrollLeft;
                  th.style.left = `${left}px`;

                  th.classList.add('col_fixed');
                  if (index === array.length - 1) {
                    if(event.target.scrollLeft === 0){
                      th.classList.remove('col_fixed_left_border');
                    }else{
                      th.classList.add('col_fixed_left_border');
                    }
                  }
                  break;
                }
                case 'right': {
                  let left = _tableRef.clientWidth - tableBcrt.width - event.target.scrollLeft + 2;
                  th.style.left = `${-left}px`;

                  th.classList.add('col_fixed');
                  if (index === 0) {
                    th.classList.add('col_fixed_right_border');
                  }
                  break;
                }
              }
            });
          });
        });

        this.tbodyList.forEach(tbody => {
          tbody.trList.forEach(tr => {
            let array = tr.tdList.map(td => td.ref.nativeElement).filter(td => td.getAttribute('fixed'));
            array.forEach((td, index, array) => {
              let fixed = td.getAttribute('fixed');
              switch (fixed) {
                case 'left': {
                  let left = event.target.scrollLeft;
                  td.style.left = `${left}px`;

                  td.classList.add('col_fixed');
                  if (index === array.length - 1) {
                    if(event.target.scrollLeft === 0){
                      td.classList.remove('col_fixed_left_border');
                    }else{
                      td.classList.add('col_fixed_left_border');
                    }
                  }
                  break;
                }
                case 'right': {
                  let left = _tableRef.clientWidth - tableBcrt.width - event.target.scrollLeft + 2;
                  td.style.left = `${-left}px`;

                  td.classList.add('col_fixed');
                  if (index === 0) {
                    td.classList.add('col_fixed_right_border');
                  }
                  break;
                }
              }
            });
          });
        });

      });
    }
  }

  get tableContainerRef(): ElementRef {
    return this._tableContainerRef;
  }

  @ViewChild('tableContainerRef') set tableContainerRef(value: ElementRef) {
    this._tableContainerRef = value;
  }

  get pagingRef(): ElementRef {
    return this._pagingRef;
  }

  @ViewChild('pagingRef') set pagingRef(value: ElementRef) {
    this._pagingRef = value;
  }

  constructor(private renderer: Renderer2,
              private _global: Global,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngAfterContentInit(): void {
    let _tableRef = <HTMLElement>this.tableRef.nativeElement;
    let _tableContainerRef = <HTMLElement>this.tableContainerRef.nativeElement;
    let tableBcrt = _tableContainerRef.getBoundingClientRect();
    let cfBcrt = this._global.containerFullRef.getBoundingClientRect();
    let blankHeight = tableBcrt.top - cfBcrt.top; // 只能计算一次
    let navHeight = cfBcrt.top;

    this.overflowRef.nativeElement.children[0].style.width = `${_tableRef.clientWidth}px`; // 设置滚动条

    // 设置搜索工具条位置
    this._global.overflowSubject.subscribe(data => {
      cfBcrt = this._global.containerFullRef.getBoundingClientRect();
      navHeight = cfBcrt.top;
      let _top = data.top;
      if (this.queryRef) {
        let _queryRef = <HTMLElement>this.queryRef.nativeElement;
        if (_top >= navHeight) {
          _queryRef.style.top = `${_top - navHeight}px`;
        } else {
          _queryRef.style.top = `0px`;
        }
      }
    });

    // 设置分页滚动条位置
    let _overflowRef = <HTMLElement>this.overflowRef.nativeElement;
    let _pagingHeight = 0;
    let maxBottom = tableBcrt.height - (cfBcrt.height - blankHeight);
    let _pagingRef;
    if (this.pagingRef) {
      _pagingRef = <HTMLElement>this.pagingRef.nativeElement;
      _pagingHeight = _pagingRef.clientHeight;
      _pagingRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;
    }
    _overflowRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;


    this._global.overflowSubject.subscribe(data => {
      cfBcrt = this._global.containerFullRef.getBoundingClientRect();
      tableBcrt = _tableContainerRef.getBoundingClientRect();
      navHeight = cfBcrt.top;
      maxBottom = tableBcrt.height - (cfBcrt.height - blankHeight);
      let bottom = maxBottom - data.top;
      if (bottom < -_pagingHeight) {
        bottom = -_pagingHeight;
      }
      if (_pagingRef) {
        _pagingHeight = _pagingRef.clientHeight;
        _pagingRef.style.bottom = `${bottom + _pagingHeight}px`;
      }
      _overflowRef.style.bottom = `${bottom + _pagingHeight}px`;
    });

    // 设置表单头的位置
    this._global.overflowSubject.subscribe(data => {
      this.theadList.forEach(thead => {
        thead.trList.forEach(tr => {
          tr.thList.forEach(th => {
            let _th = <HTMLDivElement>th.ref.nativeElement;
            if (data.top >= navHeight) {
              _th.style.top = `${data.top - navHeight}px`;
            } else {
              _th.style.top = `0px`;
            }
          });
        });
      });
    });

    this.theadList.forEach(thead => {
      thead.trList.forEach(tr => {
        let array = tr.thList.map(th => th.ref.nativeElement).filter(th => th.getAttribute('fixed'));
        array.forEach((th, index, array) => {
          let fixed = th.getAttribute('fixed');

          switch (fixed) {
            case 'left': {
              th.classList.add('col_fixed');
              break;
            }
            case 'right': {
              th.style.left = `${-(_tableRef.clientWidth - tableBcrt.width + 2)}px`;
              break;
            }
          }
        });
      });
    });

    this.tbodyList.forEach(tbody => {
      tbody.trList.forEach(tr => {
        let array = tr.tdList.map(td => td.ref.nativeElement).filter(td => td.getAttribute('fixed'));
        array.forEach((td, index, array) => {
          let fixed = td.getAttribute('fixed');
          switch (fixed) {
            case 'left': {
              td.classList.add('col_fixed');
              break;
            }
            case 'right': {
              td.style.left = `${-(_tableRef.clientWidth - tableBcrt.width + 2)}px`;
              break;
            }
          }
        });
      });
    });

    this.renderer.listen('window', 'resize', () => {
      // 设置分页滚动条位置
      tableBcrt = _tableContainerRef.getBoundingClientRect();
      cfBcrt = this._global.containerFullRef.getBoundingClientRect();
      let maxBottom = tableBcrt.height - (cfBcrt.height - blankHeight);
      _overflowRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;
      _pagingRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;

      // 设置固定项的位置
      this.theadList.forEach(thead => {
        thead.trList.forEach(tr => {
          let array = tr.thList.map(th => th.ref.nativeElement).filter(th => th.getAttribute('fixed'));
          array.forEach((th, index, array) => {
            let fixed = th.getAttribute('fixed');

            switch (fixed) {
              case 'left': {
                th.classList.add('col_fixed');
                break;
              }
              case 'right': {
                th.style.left = `${-(_tableRef.clientWidth - tableBcrt.width + 2)}px`;
                console.info(th.style.left)
                break;
              }
            }
          });
        });
      });

      this.tbodyList.forEach(tbody => {
        tbody.trList.forEach(tr => {
          let array = tr.tdList.map(td => td.ref.nativeElement).filter(td => td.getAttribute('fixed'));
          array.forEach((td, index, array) => {
            let fixed = td.getAttribute('fixed');
            switch (fixed) {
              case 'left': {
                td.classList.add('col_fixed');
                break;
              }
              case 'right': {
                td.style.left = `${-(_tableRef.clientWidth - tableBcrt.width + 2)}px`;
                break;
              }
            }
          });
        });
      });
    });
  }

  ngOnInit() {
    this.checkAllObservable.subscribe((data) => {
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
        let checkList = allList.filter(l => l.checked);

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
      console.info(params)
      if(this.theadList[0]){
        let allList = this.theadList[0].trList.map(tr => tr.thList.filter(th => th.showSort))[0];
        if(allList instanceof Array && allList.length) {
          allList.forEach(th => {
            th.status = '2'
          })
          this.query.sort_expression = params.sort_expression;
          this.query.sort_direction = params.sort_direction;
          this.changeEvent.emit(this.query);  // 发射到页面
        }
      }
    })
  }

  // ------------------ 数据 ------------------ //

  selectData = [];
  pageList;

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

  private _query;

  @Input() set query(query) {
    this._query = query;
    if (!this._query[this._props.page_index]) this._query[this._props.page_index] = 1;
    if (!this._query[this._props.page_size]) this._query[this._props.page_size] = 10;
  }

  get query() {
    return this._query;
  }

  private _data: Array<any>;
  private _total: number;
  @Input() pagination = true;
  @Output() selectChange = new EventEmitter<any>();
  @Output() changeEvent = new EventEmitter<any>();

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

    setTimeout(()=> {
      let _tableContainerRef = <HTMLElement>this.tableContainerRef.nativeElement;
      let tableBcrt = _tableContainerRef.getBoundingClientRect();
      let cfBcrt = this._global.containerFullRef.getBoundingClientRect();
      let blankHeight = tableBcrt.top - cfBcrt.top;
      // 设置分页滚动条位置
      let _overflowRef = <HTMLElement>this.overflowRef.nativeElement;
      let _pagingHeight = 0;
      let maxBottom = tableBcrt.height - (cfBcrt.height - blankHeight);
      let _pagingRef;
      if (this.pagingRef) {
        _pagingRef = <HTMLElement>this.pagingRef.nativeElement;
        _pagingHeight = _pagingRef.clientHeight;
        _pagingRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;
      }
      _overflowRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;
    })

  }

  checkAllObservable = new Subject<any>();
  changeCheckObservable = new Subject<any>();
  changeTdStateObservable = new Subject<any>();
  changeSortObservable = new Subject<any>();

  // ------------------ 分页 ------------------ //

  get total(): number {
    return this._total;
  }

  get totalPage(): number {
    let totalPage = 0;
    if (this.total % this.query[this._props.page_size]) {
      totalPage = Math.floor(this.total / this.query[this._props.page_size]) + 1;
    } else {
      totalPage = this.total / this.query[this._props.page_size];
    }
    return totalPage || 0;
  }

  get pageIndex() {
    if (!this._query) return 0;
    return this._query[this._props.page_index];
  }

  @Input() set total(value: number) {
    this._total = value;
    this.pageList = this.getPageList(this.pageNum, this.totalPage, this.query[this._props.page_index]);
  }

  @Input() pageText: string = '...';
  @Input() pageNum: number = 3;

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

  go(number) {
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


  // ------------------------------------ //

  ngOnChanges(changes: SimpleChanges): void {
    this.changeDetectorRef.markForCheck();
  }
}