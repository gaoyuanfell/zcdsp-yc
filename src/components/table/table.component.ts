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

  get queryRef(): ElementRef {
    return this._queryRef;
  }

  @ContentChild('queryRef') set queryRef(value: ElementRef) {
    console.info(value);
    this._queryRef = value;
  }

  get tableRef(): ElementRef {
    return this._tableRef;
  }

  @ContentChild('tableRef') set tableRef(value: ElementRef) {
    console.info(value);
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
        console.info(event.target.scrollLeft);
        console.info(this.tableRef.nativeElement);

        this.tableWrapRef.nativeElement.scrollLeft = event.target.scrollLeft;

      });
    }
  }

  constructor(private renderer: Renderer2,
              private _global: Global) {
  }

  ngAfterViewInit(): void {

  }

  ngAfterContentInit(): void {

  }

  ngOnInit() {
    this._global.overflowSubject.subscribe(data => {
      let _top = data.top;
      if (this.queryRef) {
        let _queryRef = <HTMLElement>this.queryRef.nativeElement;
        let {left, top} = _queryRef.getBoundingClientRect();
        if(_top >= 66){
          _queryRef.style.top = `${_top - 66}px`;
        }else{
          _queryRef.style.top = `0px`;
        }
      }
    });

    let _overflowRef = <HTMLElement>this.overflowRef.nativeElement;
    console.info(_overflowRef.getBoundingClientRect())
    console.info()

    let {width, height} = this._global.containerFullRef.getBoundingClientRect()

    _overflowRef.style.top = `${height - 75}px`


  }

}
