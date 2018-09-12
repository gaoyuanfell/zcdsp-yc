import {ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'yc-table-overflow',
  template: `
    <div class="overflow" #overflow>
      <div class="overflow-tool" [ngStyle]="{'width.px':width}"></div>
    </div>
  `,
  styles: [
      `
      :host {
        height: 20px;
        display: block;
      }

      .overflow {
        padding: 10px 0;
        z-index: 30;
        height: 10px;
        overflow-x: auto;
        width: 100%;
        overflow-y: hidden;
      }

      .overflow-tool {
        height: 10px;
      }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  preserveWhitespaces: true,
})
export class TableOverflowComponent implements OnInit {
  private _width;

  get width() {
    return this._width;
  }

  set width(value) {
    this._width = value;
    this.changeDetectorRef.markForCheck();
  }

  @ViewChild('overflow') overflow

  overflowSubject = new Subject();

  constructor(private changeDetectorRef: ChangeDetectorRef, private ref: ElementRef, private renderer:Renderer2) {

  }

  ngOnInit(): void {
    this.renderer.listen(this.overflow.nativeElement ,'scroll', (event)=> {
      this.overflowSubject.next({
        top: event.target.scrollTop,
        left: event.target.scrollLeft,
      })
    })
  }


}
