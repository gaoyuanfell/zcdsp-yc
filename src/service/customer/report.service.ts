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


  campaignList(query) {
    return this.get(`/ads/report/campaign/list`, query);
  }

  creativeList(query) {
    return this.get(`/ads/report/creative/list`, query);
  }

  dateList(query) {
    return this.get(`/ads/report/date/list`, query);
  }

  areaList(query) {
    return this.get(`/ads/report/area/list`, query);
  }

  init(body = {}) {
    return this.get('/ads/report/campaign/init', body = {});
  }

  creativeInit(body = {}) {
    return this.get(`/ads/report/creative/init`, body = {});
  }

  datetimeChart(body = {}) {
    return this.get(`/ads/report/date/hourChart`, body);
  }

  campaignChart(body = {}) {
    return this.get(`/ads/report/campaign/chart`, body);
  }

  creativeChart(body = {}) {
    return this.get(`/ads/report/creative/chart`, body);
  }

  creativeExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/ads/report/creative/export`, body);
  }

  hourExport(body = {}) {
    return this.getUrl(`/ads/report/date/hourExport `, body);
  }

  datetimeExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/ads/report/date/export`, body);
  }

  campaignExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/ads/report/campaign/export`, body);
  }

  areaExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/ads/report/area/export`, body);
  }

  // list(type, query) {
  //   let url;
  //   switch (type) {
  //     case 'creative-report':
  //       url = '/ads/report/creative/list';
  //       break;
  //     case 'customer-report':
  //       url = '/ads/report/campaign/list';
  //       break;
  //   }
  //   return this.get(url, query)
  // }
  // chart(url, obj) {
  //   return this.get(url, obj)
  // }

}
