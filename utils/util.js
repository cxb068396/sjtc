const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function SEND(url, method, data, success, fail) {
  wx.request({
    url: url,
    header: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    method: method,
    data: data,
    success(res) {
      success(res);
    },
    fail(res) {
      fail(res);
    }
  });
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/*用promise封装wx.request*/
function request(url,method='GET',data={},header={},complete=()=>{}){
  const token = wx.getStorageSync('access_token')
  return new Promise((resolve, reject) => {
		wx.request({
			url: url,
			method,
			header: {
				'Content-Type': 'application/x-www-form-urlencoded',
				...header
			},
			data: {
				token,
				...data
			},
			success: function (res) {
				if (res.data.code==true) {
					resolve(res.data.mes)
				}else if(res.data.code==false &&(res.data.mes=='请求异常'||res.data.mes=='参数错误！')){
          		wx.redirectTo({
		              	url: '/pages/logs/logs',
	                	})
				} else {
					reject(res.data)
				}
			},
			fail: function (err) {
				reject(err)
			},
			complete

		})
	})
}
class Event {
  constructor(){
      this.list = []
  }
  // 监听消息
  listen(key, fn) {
      if (!this.list[key]) {
          this.list[key] = []
      }
      this.list[key].push(fn)
  }
  // 发布消息
  notify(key, ...args) {
      if (!this.list[key] || this.list[key].length == 0) { return }
      this.list[key].forEach(fn => {
          fn(...args)
      })
  }

  // 取消监听
  remove(key,fn){
      const fns = this.list[key]
      if (!fns) { return false}
      if(!fn){
          this.list[key] = []
      }else{
          this.list[key] = this.list[key].filter(_fn => _fn !== fn)
          // for(let i = this.list[key].length;i>0;i++){
          //     if(this.list[key] === fn){
          //         this.list[key].splice(i,1)
          //     }
          // }
      }
  }
}

module.exports = {
  formatTime: formatTime,
	request:request,
  Event:Event,

}
