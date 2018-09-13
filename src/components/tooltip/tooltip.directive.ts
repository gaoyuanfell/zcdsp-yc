import {ComponentFactoryResolver, ComponentRef, Directive, ElementRef, HostBinding,  HostListener, Input, OnDestroy, OnInit, Optional, Renderer2, ViewContainerRef, ComponentFactory, ChangeDetectorRef} from '@angular/core';
import {TooltipComponent} from './tooltip.component';
import {Global} from '../../service/global';
import {Overlay, OverlayConfig, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {PublicService} from '../../service/public.service';


export const POSITION_MAP: { [key: string]: any } = {
  'top': {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom'
  },
  'topCenter': {
    originX: 'center',
    originY: 'top',
    overlayX: 'center',
    overlayY: 'bottom'
  },
  'topLeft': {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom'
  },
  'topRight': {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom'
  },
  'right': {
    originX: 'end',
    originY: 'center',
    overlayX: 'start',
    overlayY: 'center',
  },
  'rightTop': { // 右下
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
  },
  'rightBottom': {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'bottom',
  },
  'bottom': {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
  },
  'bottomCenter': {
    originX: 'center',
    originY: 'bottom',
    overlayX: 'center',
    overlayY: 'top',
  },
  'bottomLeft': {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
  },
  'bottomRight': {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
  },
  'left': {
    originX: 'start',
    originY: 'center',
    overlayX: 'end',
    overlayY: 'center',
  },
  'leftTop': {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
  },
  'leftBottom': {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'bottom',
  },
};

@Directive({
  selector: '[yc-tooltip]',
  exportAs: 'ycTooltip',
  host: {}
})
export class TooltipDirective implements OnInit, OnDestroy {
  constructor(
    private _overlay: Overlay,
    private elementRef: ElementRef,   // 宿主元素
    private _viewContainer: ViewContainerRef,
    private _resolve: ComponentFactoryResolver,
    private render: Renderer2,
    private _global: Global,
    public resolver: ComponentFactoryResolver,
    private _publicService: PublicService,
    private changeDetectorRef: ChangeDetectorRef,
    @Optional() public tooltipComponent: TooltipComponent
  ) {
    // this.factory = this._resolve.resolveComponentFactory(TooltipComponent);
  }
  factory: ComponentFactory<TooltipComponent> = this.resolver.resolveComponentFactory(TooltipComponent);
  tooltipPortal: ComponentPortal<TooltipComponent>;
  popupRef: OverlayRef;
  componentRef: ComponentRef<TooltipComponent>;
  result;  // 存储的content
  @Input('ycTitle') ycTitle;   // title名称
  @Input('widthExp') widthExp = 400;   // width
  @Input('ycContent') ycContent;  //  内容或者是一个订阅
  @Input() placement: 'topLeft' | 'top' | 'topRight' | 'leftTop' | 'left' | 'leftBottom' | 'rightTop' | 'right' | 'rightBottom' | 'bottomLeft' | 'bottom' | 'bottomRight' = 'bottomLeft';
  // @HostBinding(':hover') isHover = true;
  @HostListener('mouseenter', ['$event'])
  open() {
      this.result = this.ycContent;
      this.init();
  }

  @HostListener('mouseleave', ['$event'])
   close(event) {
    // console.log('鼠标移出事件应该先执行')     // 按理来说应该是这样子的，但是mouseleav 不太好掌控，有时数据来先执行
    // 移出去的时候 判断是否移动到覆盖物的位置
    // 如果是的话 檢查是否有attach東西上去，如果有，就執行detach()  不是销毁哦
    // this.popupRef 这个create后是一直存在的
    if (String(event.toElement.id) !== 'popover' && this.popupRef && this.popupRef.hasAttached()) {  // 鼠标进来的时候，out事件和init(),不知道谁先执行的，
      this.result = undefined;
      this.popupRef.detach()
    }
  }

  init() {
    if (!this.tooltipPortal) {
      this.tooltipPortal = new ComponentPortal(TooltipComponent, this._viewContainer);
    }
    if (!this.popupRef) {
      let positions = Object.values(POSITION_MAP);
      positions.unshift(POSITION_MAP[this.placement]);  // 开头添加
      const overlayConfig = new OverlayConfig({
        panelClass: 'popover-content-portal',
        hasBackdrop: false,   // 會顯示一個基本的灰底backdrop。
        backdropClass: '',
        scrollStrategy: this._overlay.scrollStrategies.block(),
        positionStrategy: this._overlay.position()
          .flexibleConnectedTo(this.elementRef)    // 要与某个物件连接的策略
          .withFlexibleDimensions(false)
          .withViewportMargin(8)
          .withDefaultOffsetY(4)
          .withDefaultOffsetX(-30)
          .withPush(false)
          .withPositions([   // bottomLeft
            // ...positions
            // originX 源  overlay：覆盖物的位置
            {
              originX: 'start',
              originY: 'bottom',
              overlayX: 'start',
              overlayY: 'top',
            }
          ])
      });
      this.popupRef = this._overlay.create(overlayConfig); // 建立一個新的OverlayRef  Overlay正是使用Portal的功能，來決定要把什麼東西放到Overlay上面！
    }
    if (!this.popupRef.hasAttached()) { // 是否附着上去
      this.componentRef = this.popupRef.attach(this.tooltipPortal); // 放进去
      this.componentRef.instance.placement = this.placement;
      this.componentRef.instance.ycTitle = this.ycTitle;
      this.componentRef.instance.result = this.result;
      this.componentRef.instance.widthExp = this.widthExp;
      this.changeDetectorRef.markForCheck();  // 这句话不加的话，tooltip页面渲染不出来(ngOninit 根本打印不出来)
    }
    // 给覆盖物添加事件
    this.render.listen(this.componentRef.location.nativeElement, 'mouseenter', (event) => {
    })
    this.render.listen(this.componentRef.location.nativeElement, 'mouseleave', (event) => {
      let arr = [];
      for (let x of event.toElement.attributes) {  // 判断鼠标离开的时候，是否回到宿主元素上
        arr.push(x.name);
      }
      if (arr.indexOf('yc-tooltip') === -1) {
        this.popupRef.detach();
        this.result = undefined;
      }

    })
  }

  ngOnDestroy() {}

  ngOnInit(): void {
      this.render.setStyle(this.elementRef.nativeElement, 'cursor', 'pointer');
      // this.render.setStyle(this.elementRef.nativeElement, 'transition', 'all 2s');
  }

}


// open() {
//   console.log('yidong')
//   if (typeof this.ycContent === 'string') {
//     this.result = this.ycContent;
//     this.init();
//   } else {
//     if (!this.result) {  // 这边就请求一次数据  鼠标移上去请求数据会有一层遮罩层，遮罩层消失的时候数据也就回来了 所以不管你移动几次，指执行一次
//       this.ycContent.subscribe( res => {
//         // console.log('数据应该后到吧')
//         this.result = res.result;
//         this.changeDetectorRef.markForCheck();
//         setTimeout(() => {
//           console.log('鼠标一出去后我再执行')
//           this.init();
//         }, 500)  // 因为有一个鼠标移出去事件，会把附着上去的东西detach掉，这个要比鼠标移除事件先执行，后执行的话，会把attach的马上detach，你就什么也看不到了
//
//       })
//     }
//   }
// }
