import {Component, ComponentFactoryResolver, ComponentRef, EventEmitter, HostListener, Injector, OnInit, Output, Type, ViewChild, ViewContainerRef} from '@angular/core';

@Component({
  selector: 'template-box',
  template: `
    <div class="template-box" [ngClass]="{'active': checked}">
      <ng-container #container></ng-container>
      <span class="remove" (click)="remove()">&times;</span>
      <span class="move"></span>
      <div class="template-box-mask">
        
      </div>
    </div>
  `,
  host: {
    '[attr.draggable]': 'true',
    '[attr.id]': 'id',
  },
  styles: [
      `
      :host {
        display: block;
      }
    `,
      `
      .template-box {
        border: 1px solid transparent;
        position: relative;
        padding: 3px 0;
      }
      
      .template-box-mask{
        position: absolute;
        z-index: 100;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
      }

      .template-box:hover, .template-box.active {
        border: 1px solid #0094d4;
      }

      .template-box:hover .remove, .template-box.active .remove {
        display: block;
      }
      
      .template-box:hover .move, .template-box.active .move {
        display: block;
      }
      
      .remove {
        display: none;
        position: absolute;
        top: -1px;
        right: -1px;
        height: 17px;
        width: 17px;
        color: #0094d4;
        border: 1px solid #0094d4;
        background-color: #fff;
        font-size: 16px;
        line-height: 17px;
        text-align: center;
        box-sizing: content-box;
        cursor: pointer;
        z-index: 101;
      }
      
      .move{
        display: none;
        position: absolute;
        z-index: 11;
        top: -1px;
        left: 50%;
        margin-left: -20px;
        height: 15px;
        width: 40px;
        border: 1px solid #0094d4;
        color: #2aa7ff;
        border-radius: 0 0 4px 4px;
        text-align: center;
        font-size: 14px;
        line-height: 15px;
        cursor: move;
        background-color: #fff;
        z-index: 101;
      }
      
      .move:before, .move:after{
        display: block;
        height: 1px;
        background-color: #0094d4;
        margin: 4px;
        content: " ";
      }
    `
  ]
})
export class TemplateBoxComponent implements OnInit {

  templateInstance
  templateType
  checked
  id

  @ViewChild('container', {read: ViewContainerRef}) containerRef: ViewContainerRef;

  createComponent<T>(componentClass: Type<T>): ComponentRef<T> {
    let componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    let instance = this.containerRef.createComponent<T>(componentFactory)
    this.templateInstance = instance.instance;
    this.templateType = this.templateInstance.type
    return instance
  }

  /////////////////////////////

  @Output('selected') selectedEvent = new EventEmitter<any>();
  @Output('dragId') dragIdEvent = new EventEmitter<any>();

  @HostListener('click')
  selected() {
    this.selectedEvent.emit(this);
  }

  @HostListener('dragstart', ['$event'])
  dragstart(event) {
    this.dragIdEvent.emit({
      id: event.target.id,
      y: event.y
    })
  }

  remove = () => {
  }

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private injector: Injector) {
  }

  ngOnInit() {

  }

}
