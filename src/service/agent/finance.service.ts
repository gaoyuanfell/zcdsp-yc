import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

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
    return this.get(`/us/finance/userAccountBalance/list`, query);
  }

  consumeChart(body = {}) {
    return this.get(`/ads/finance/userAccountConsume/hour/get`, body);
  }

  consumeInit(body = {}) {
    return this.get(`/us/finance/userAccountBalance/init`, body);
  }

  consumeExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/us/finance/userAccountBalance/export`, body);
  }

  rechargeList(body = {}) {
    return this.get(`/us/finance/userAccountRecharge/list`, body);
  }

  rechargeInit(body = {}) {
    return this.get(`/us/finance/userAccountRecharge/init`, body);
  }

  rechargeExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/us/finance/userAccountRecharge/export`, body);
  }

  // 财务消费展开详情init
  subsetInit(body = {}) {
    return this.get(`/us/finance/userAccountRecharge/subset/init`, body);
  }

  // 财务消费展开详情list
  userAccountRechargeList(body = {}) {
    return this.get(`/us/finance/userAccountRecharge/list`, body);
  }

  userAccountConsumeExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/us/finance/userAccountRecharge/export `, body);
  }

  // 转入详情
  transferInit(body = {}) {
    return this.get(`/us/finance/transfer/init`, body);
  }

  transferPost(body = {}) {
    return this.postJson('/us/finance/transfer', body);
  }
}
