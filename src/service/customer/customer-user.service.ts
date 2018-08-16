import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

@Injectable(
  {
    // 在每一个服务加这个 在模块中使用时  就不用provider，直接引入用即可
    providedIn: 'root'
  }
)
export class CustomerUserService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  logsList(body = {}) {
    return this.get(`/logs/list`, body);
  }

  remindList(body = {}) {
    return this.get(`/ads/user/remind/get`, body);
  }

  editList(body = {}) {
    return this.get(`/ads/user/edit/init`, body);
  }

  remindUpdate(body = {}) {
    return this.postJson('/ads/user/remind/update', body);
  }

  editUpdate(body = {}) {
    return this.postJson('/ads/user/edit/update', body);
  }

  userLog(body = {}) {
    return this.postFormData('/ws-api/img/user/logo', body);
  }

  imgQualification(body = {}) {
    return this.postFormData('/ws-api/img/qualification', body);
  }

  updatePwd(body = {}) {
    return this.postJson('/jurisdiction/update/pwd', body);
  }

  init(body = {}) {
    return this.get('/logs/list/init', body = {});
  }
}
