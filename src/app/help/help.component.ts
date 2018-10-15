import {Component, ElementRef, OnInit, ViewChild, Renderer2} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ScrollService} from '../../components/back-top/scroll.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private _scrollService: ScrollService,
    private renderer: Renderer2
    ) {}


  @ViewChild('containerRight') containerRightRef: ElementRef;

  ngOnInit(): void {}



  num = 0;

  changeElement(index) {
    this.num = index;
  }
}
