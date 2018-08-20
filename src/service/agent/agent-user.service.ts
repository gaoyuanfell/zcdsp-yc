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
export class AgentUserService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }

  logsList(query) {
    return this.get(`logs/list`, query)
  }

  addInit(body = {}) {
    return this.get(`/us/user/child/add/init`, body)
  }

  editInit(body = {}) {
    return this.get(`/us/user/child/edit/init`, body)
  }

  addSave(body = {}) {
    return this.postJson('/us/user/child/add/save', body);
  }

  editUpdate(body = {}) {
    return this.postJson('/us/user/child/edit/update', body);
  }

  selfSave(body = {}) {
    return this.postJson('/us/user/edit/update', body);
  }

  userLog(body = {}) {
    return this.postFormData('/ws-api/img/user/logo', body);
  }

  imgQualification(body = {}) {
    return this.postFormData('/ws-api/img/qualification', body);
  }

  listInit(body = {}) {
    return this.get(`/us/user/child/list/init`, body)
  }

  childList(body = {}) {
    return this.get(`/us/user/child/list`, body)
  }

  listExport(body = {}) {
    Reflect.deleteProperty(body, 'page_index');
    Reflect.deleteProperty(body, 'page_size');
    return this.getUrl(`/us/user/child/list/export`, body)
  }

  updatePwd(body = {}) {
    return this.postJson('/jurisdiction/update/pwd', body);
  }

  selfInit(body = {}) {
    return this.get(`/us/user/edit/init`, body)
  }

  existUser(body = {}) {
    return this.get(`/us/user/exist/user_name` , body)
  }
}
