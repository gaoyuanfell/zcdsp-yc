import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class ReportService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  init(body = {}) {
    return this.get('/logs/list/init', body = {})
  }

  childExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/us/report/child/user/export`, body)
  }

  childInit(body = {}) {
    return this.get(`/us/report/child/user/init`, body)
  }

  childList(body = {}) {
    return this.get(`/us/report/child/user/list`, body)
  }

  logsList(body = {}) {
    return this.get(`/logs/list`, body)
  }

  listinit(body = {}) {
    return this.get(`/us/user/child/list/init`, body)
  }

  login(id, body = {}) {
    return this.getUrl('/ads/home?token=' + id, body)
  }

  goAct(id, body = {}) {
    return this.getUrl('/ads/spread/campaign-add/0?token=' + id, body)
  }

}
