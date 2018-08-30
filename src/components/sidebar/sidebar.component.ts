import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Subject} from 'rxjs';

@Component({
  selector: 'yc-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.less'],
  preserveWhitespaces: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {

  @ViewChild('container', {read: ViewContainerRef}) containerRef: ViewContainerRef;

  closeSubject = new Subject();

  opened

  open(){
    this.opened = true;
    this.changeDetectorRef.markForCheck()
  }

  _close(){
    this.opened = false;
    this.changeDetectorRef.markForCheck()
    this.closeSubject.next()
  }

  close(){
    this.opened = false;
    this.changeDetectorRef.markForCheck()
  }

  constructor(private changeDetectorRef: ChangeDetectorRef) { }

  ngOnInit() {

  }

}
