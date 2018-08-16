import {Component, OnInit} from '@angular/core';
import {Global} from '../service/global';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-board',
  template: ``,
})
export class BoardComponent{
  constructor(private _global: Global,
              private router: Router,
              private route: ActivatedRoute) {
    // let menus = this._global.menus
    // if (menus && menus.length > 1) {
    //   router.navigate([menus[0].route], {queryParams: {...route.snapshot.queryParams}, replaceUrl: true})
    // }
  }
}
