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
