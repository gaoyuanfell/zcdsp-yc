import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ScrollService} from '../../components/back-top/scroll.service';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.less']
})
export class HelpComponent implements OnInit {

  constructor(private router: Router,
              private route: ActivatedRoute,
              private _scrollService: ScrollService,) {

    // this.auth = route.snapshot.data.auth
  }

  // auth

  ngOnInit(): void {

  }



  num = 0;

  changeElement(index) {
    this.num = index;
  }
}
