import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class IndexService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  homeInit(body = {}) {
    return this.get('/us/home/init', body);
  }

  dayTotal(body = {}) {
    return this.get('/us/home/day/total', body);
  }

  hourChart(body = {}) {
    return this.get('/us/home/day/hourChart', body);
  }

  childList(body = {}) {
    return this.get('/us/home/childList', body);
  }

  childListChart(body = {}) {
    return this.get(`/us/home/childChart`, body);
  }

}
