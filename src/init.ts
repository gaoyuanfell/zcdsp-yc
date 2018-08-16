Date.prototype.calendar = function (dateType, num) {
  switch (dateType) {
    case 1:
      let y = this.getFullYear();
      this.setFullYear(y + num);
      return this;
    case 2:
      let m = this.getMonth();
      this.setMonth(m + num);
      return this;
    case 3:
      let d = this.getDate();
      this.setDate(d + num);
      return this;
    case 4:
      let h = this.getHours();
      this.setHours(h + num);
      return this;
    case 5:
      let M = this.getMinutes();
      this.setMinutes(M + num);
      return this;
    case 6:
      let s = this.getSeconds();
      this.setSeconds(s + num);
      return this;
  }
};

Date.prototype.formatDate = function (format) {
  let o = {
    'M+': this.getMonth() + 1, // 月份
    'd+': this.getDate(), // 日
    'H+': this.getHours(), // 小时
    'm+': this.getMinutes(), // 分
    's+': this.getSeconds(), // 秒
    'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
    'S': this.getMilliseconds() // 毫秒
  };
  if (/(y+)/.test(format)) format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  for (let k in o)
    if (new RegExp('(' + k + ')').test(format)) format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length)));
  return format;
};


