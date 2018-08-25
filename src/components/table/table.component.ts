import {
  AfterContentInit,
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {Global} from '../../service/global';

@Component({
  selector: 'yc-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: false,
  encapsulation: ViewEncapsulation.None
})
export class TableComponent implements OnInit, AfterContentInit, AfterViewInit {

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
    if (value) {

    }
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
        Array.from(_tableRef.querySelectorAll<HTMLDivElement>('th[fixed]')).forEach((th, index, array) => {
          let thBcrt = th.getBoundingClientRect();
          let fixed = th.getAttribute('fixed');
          switch (fixed) {
            case 'left': {
              let left = event.target.scrollLeft;
              th.style.left = `${left}px`;
              // if(index != array.length) break;
              // if(left === 0){
              //   th.classList.remove('col_fixed')
              //   th.classList.remove('col_fixed_right_border')
              // }else{
              //   th.classList.add('col_fixed')
              //   th.classList.add('col_fixed_right_border')
              // }
              break;
            }
            case 'right': {
              let left = _tableRef.clientWidth - tableBcrt.width - event.target.scrollLeft + 2;
              th.style.left = `${-left}px`;
              // if(index != 1) break;
              // if(left === 0){
              //   th.classList.remove('col_fixed')
              //   th.classList.remove('col_fixed_right_border')
              // }else{
              //   th.classList.add('col_fixed')
              //   th.classList.add('col_fixed_right_border')
              // }
              break;
            }
          }
        });

        Array.from(_tableRef.querySelectorAll<HTMLDivElement>('td[fixed]')).forEach((td, index, array) => {
          let thBcrt = td.getBoundingClientRect();
          let fixed = td.getAttribute('fixed');
          switch (fixed) {
            case 'left': {
              let left = event.target.scrollLeft;
              td.style.left = `${left}px`;
              // if(index != array.length) break;
              // if(left === 0){
              //   td.classList.remove('col_fixed')
              //   td.classList.remove('col_fixed_right_border')
              // }else{
              //   td.classList.add('col_fixed')
              //   td.classList.add('col_fixed_right_border')
              // }
              break;
            }
            case 'right': {
              let left = _tableRef.clientWidth - tableBcrt.width - event.target.scrollLeft + 2;
              td.style.left = `${-left}px`;
              // if(index != 1) break;
              // if(left === 0){
              //   td.classList.remove('col_fixed')
              //   td.classList.remove('col_fixed_right_border')
              // }else{
              //   td.classList.add('col_fixed')
              //   td.classList.add('col_fixed_right_border')
              // }
              break;
            }
          }
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
              private _global: Global) {
  }

  ngAfterViewInit(): void {

  }

  ngAfterContentInit(): void {
    let _tableRef = <HTMLElement>this.tableRef.nativeElement;
    let _tableContainerRef = <HTMLElement>this.tableContainerRef.nativeElement;
    let tableBcrt = _tableContainerRef.getBoundingClientRect();
    let cfBcrt = this._global.containerFullRef.getBoundingClientRect();
    let blankHeight = tableBcrt.top - cfBcrt.top;
    let navHeight = cfBcrt.top;

    this.overflowRef.nativeElement.firstChild.style.width = `${_tableRef.clientWidth}px`; // 设置滚动条

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

    let _overflowRef = <HTMLElement>this.overflowRef.nativeElement;
    let _pagingRef = <HTMLElement>this.pagingRef.nativeElement;
    let _pagingHeight = _pagingRef.clientHeight;

    let maxBottom = tableBcrt.height - (cfBcrt.height - blankHeight);
    _overflowRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;
    _pagingRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;
    this._global.overflowSubject.subscribe(data => {
      cfBcrt = this._global.containerFullRef.getBoundingClientRect();
      blankHeight = tableBcrt.top - cfBcrt.top;
      navHeight = cfBcrt.top;
      maxBottom = tableBcrt.height - (cfBcrt.height - blankHeight);

      let bottom = maxBottom - data.top;
      if (bottom < -_pagingHeight) {
        bottom = -_pagingHeight;
      }
      _overflowRef.style.bottom = `${bottom + _pagingHeight}px`;
      _pagingRef.style.bottom = `${bottom + _pagingHeight}px`;
    });

    this._global.overflowSubject.subscribe(data => {
      let _tableRef = <HTMLElement>this.tableRef.nativeElement;

      Array.from(_tableRef.querySelectorAll('th')).forEach(th => {
        if (data.top >= navHeight) {
          th.style.top = `${data.top - navHeight}px`;
        } else {
          th.style.top = `0px`;
        }
      });
    });

    this.renderer.listen('window', 'resize', () => {
      tableBcrt = _tableContainerRef.getBoundingClientRect();
      cfBcrt = this._global.containerFullRef.getBoundingClientRect();
      let maxBottom = tableBcrt.height - (cfBcrt.height - blankHeight);
      _overflowRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;
      _pagingRef.style.bottom = `${maxBottom > 0 ? maxBottom + _pagingHeight : 0}px`;
    })

    //  ---------------------- //

    Array.from(_tableRef.querySelectorAll<HTMLDivElement>('th[fixed]')).forEach(th => {
      let thBcrt = th.getBoundingClientRect();
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

    Array.from(_tableRef.querySelectorAll<HTMLDivElement>('td[fixed]')).forEach(td => {
      let thBcrt = td.getBoundingClientRect();
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

    this.renderer.listen('window', 'resize', () => {
      tableBcrt = _tableContainerRef.getBoundingClientRect();
      Array.from(_tableRef.querySelectorAll<HTMLDivElement>('th[fixed]')).forEach(th => {
        let thBcrt = th.getBoundingClientRect();
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

      Array.from(_tableRef.querySelectorAll<HTMLDivElement>('td[fixed]')).forEach(td => {
        let thBcrt = td.getBoundingClientRect();
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

  }

  ngOnInit() {

  }

}
