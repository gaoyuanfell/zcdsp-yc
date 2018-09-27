import {ConfigService} from '../config-service';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Global} from '../global';

@Injectable(
  {
    providedIn: 'root'
  }
)
export class UserService extends ConfigService {
  constructor(_http: HttpClient, _global: Global) {
    super(_http, _global);
  }


}
