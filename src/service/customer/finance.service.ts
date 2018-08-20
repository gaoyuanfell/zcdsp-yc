import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from "../global";

@Injectable(
  {
    providedIn: 'root'
  }
)
export class FinanceService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  consumeList(query) {
    return this.get(`/ads/finance/userAccountConsume/list`, query)
  }

  consumeChart(body = {}) {
    return this.get(`/ads/finance/userAccountConsume/hour/get`, body)
  }

  consumeInit(body = {}) {
    return this.get(`/ads/finance/userAccountConsume/init`, body)
  }

  consumeExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/ads/finance/userAccountConsume/export`, body)
  }

  rechargeList(body = {}) {
    return this.get(`/ads/finance/userAccountRecharge/list`, body)
  }

  rechargeInit(body = {}) {
    return this.get(`/ads/finance/userAccountRecharge/init`, body)
  }

  rechargeExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/ads/finance/userAccountRecharge/export`, body)
  }

  dayMoneyUpdate(body = {}) {
    return this.postJson('/ads/finance/dayMoney/update', body)
  }
}
