import {Component, OnInit} from '@angular/core';
import {Global} from '../service/global';
import {ActivatedRoute, Router} from '@angular/router';
import {SwUpdate} from '@angular/service-worker';
import {Notification} from '../components/notification/notification';

@Component({
  selector: 'app-home',
  template: ``,
})
export class HomeComponent{
  constructor(private _global: Global,
              private _notification: Notification,
              private router: Router,
              private route: ActivatedRoute,
              private swUpdate: SwUpdate) {
    console.log("hahahahhaha")
    let menus = this._global.menus
    if (menus && menus.length > 1) {
      router.navigate([menus[0].route], {queryParams: {...route.snapshot.queryParams}, replaceUrl: true})
    }
  }
}
