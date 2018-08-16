export interface AutoCookieModel {
  keep?: boolean
  defaultValue?: { [key: string]: any }
  keepValue?: { [key: string]: any }
  cookieKey?: string
  ignore?: string[] // 排除自动保存字段
}

export function AutoCookie({defaultValue, keepValue, cookieKey, ignore = ['_'], keep}: AutoCookieModel) {
  return function (target: any, propertyKey: string) {
    let localKey
    if (cookieKey) {
      localKey = btoa(cookieKey);
      let keyValue = window.localStorage.getItem(localKey);
      if (keyValue) {
        defaultValue = JSON.parse(keyValue);
      }
    }
    if (keepValue) {
      Object.assign(defaultValue, keepValue);
    }
    Reflect.set(target, propertyKey, defaultValue);

    if (keep) {
      const obj = target[propertyKey];
      const proxy = new Proxy(obj, {
        get: function (tar, key, receiver) {
          return Reflect.get(tar, key, receiver);
        },
        set: function (tar, key: string, value, receiver) {
          if (ignore.indexOf(key) != -1) return true;
          let bo = Reflect.set(tar, key, value, receiver);
          if (bo && localKey) {
            window.localStorage.setItem(localKey, JSON.stringify(tar));
          }
          return bo;
        },
        deleteProperty: function (tar, key) {
          let bo = Reflect.deleteProperty(tar, key);
          if (bo && localKey) {
            window.localStorage.setItem(localKey, JSON.stringify(tar));
          }
          return bo;
        }
      });
      Reflect.set(target, propertyKey, proxy);
    }

  };
}
