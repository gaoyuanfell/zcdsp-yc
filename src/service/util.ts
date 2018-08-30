/**
 * 同步子集和父级的状态
 * 递归
 * @param target
 */
export function recursionChildCheck(target) {
  let list = target.children;
  if (list && list.length > 0) {
    list.forEach(data => {
      let checked = data.parent.checked;
      data.checked = checked;
      if (checked) {
        data.checkState = 1;
        data.checked = true;
      } else {
        data.checkState = 0;
        data.checked = false;
      }
      recursionChildCheck(data);
    });
  }
}

/**
 * 判断当前对象的父级中的子集被选中的个数
 * @param data
 */
export function recursionParentCheck(data) {
  let parent = data.parent;
  if (parent) {
    let l = parent.children;
    let length = l.reduce((previousValue, currentValue) => { // 有几个全选
      return previousValue + ((currentValue.checked) ? 1 : 0);
    }, 0);
    let length2 = l.reduce((previousValue, currentValue) => {  // 有几个全选
      return previousValue + ((currentValue.checkState == 2) ? 1 : 0);
    }, 0);
    if (length == l.length) {
      parent.checkState = 1;
      parent.checked = true;
    } else if (length == 0 && length2 == 0) {
      parent.checkState = 0;
      parent.checked = false;
    } else {
      parent.checkState = 2;
      parent.checked = false;
    }
    recursionParentCheck(parent);
  }
}

/**
 * 子集全部选中不考虑子集数据
 * @param list
 * @param {any[]} result
 * @param {number} type
 * @returns {any[]}
 */
export function recursionResult(list, result = []) {
  if (list && list.length > 0) {
    list.forEach(data => {
      // 全部选中
      if (data.checked) {
        result.push(data);
      } else {
        let child = data.children;
        if (child && child.length > 0) {
          recursionResult(child, result);
        }
      }
    });
  }
  return result;
}

/**
 * 只获取最后一层的值
 * @param list
 * @param {any[]} result
 * @param {number} type
 */
export function recursionResult2(list, result = []) {
  if (list && list.length > 0) {
    list.forEach(data => {
      let child = data.children;
      if (child && child.length > 0) {
        recursionResult2(child, result);
      } else if (data.checked) {
        result.push(data);
      }
    });
  }
  return result;
}

/**
 * 数据回显
 * @param target [0,2 一组id]
 * @param list
 * @param {string} key
 */
export function recursionFilter(target, list, key = 'id') {
  if (!(target instanceof Array) || !(list instanceof Array)) return;
  list.forEach((data) => {
    let bo = target.find((d => {
      if (d == data[key]) {
        return d;
      }
    }));
    if (bo) {
      data.checked = true;
      data.checkState = 1;
      recursionChildCheck(data);
      recursionParentCheck(data);
    }
    let child = data.children;
    if (child instanceof Array && child.length > 0) {
      recursionFilter(target, child);
    }
  });
}

/**
 *
 * @param {string} url
 * @returns {Promise<any>}
 */
export function image(url: string) {
  return new Promise((resolve, reject) => {
    let img = new Image();
    img.onload = () => {
      resolve(img)
    };
    img.onerror = (err) => {
      reject(err)
    };
    img.src = url
  })
}

/**
 * 数组分割
 * @param array
 * @param {number} size
 * @returns {any[]}
 */
export function splitArray(array, size = 500) {
  let result = [];
  for (let x = 0; x < Math.ceil(array.length / size); x++) {
    let start = x * size;
    let end = start + size;
    result.push(array.slice(start, end));
  }
  return result;
}

/**
 * 定时器
 * @param time
 * @returns {Promise<any>}
 */
export function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
