var api = require('../../../../config/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showPayPwdInput: true, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
    codemsg: 60,
    hidden: true,
    disabled: true,
    currentTime: 60,
    phone: '',
    code: '',
    sign:'',
    nextsuccess:true,
    showImg:true,
    success:true
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {
    var val = this.data.pwdVal;
    this.setData({
      payFocus: false,
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({
      payFocus: true
    });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({
      pwdVal: e.detail.value
    });

    if (e.detail.value.length >= 6) {
      this.hidePayLayer();
    }
  },
  //修改支付密码
  goNote() {
    if (!this.data.pwdVal) {
      wx.showToast({
        title: '输入密码',
        image: '../../../static/images/icon_error.png'
      })
      return false
    }
    if (this.data.pwdVal.length < 6) {
      wx.showToast({
        title: '密码长度为6',
        image: '../../../static/images/icon_error.png'
      })
      return false
    }

    if (this.data.pwdVal.length == 6) {
      var password=this.data.pwdVal
      var token=wx.getStorageSync('access_token')
      var sign=this.data.sign
      const data={
        token,
        password,
        sign
      }
      var that=this
      app.request(api.changPassword,'GET',data).then(data=>{
       that.setData({
         showImg:false,
         success:true
       })
      }).catch(err=>{
        that.setData({
          showImg:false,
          success:false
        })
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    //首次加载获取sessionid来进行请求头的cookie的伪造，用于获取验证码和登录操作
    var that = this
    wx.request({
      url: 'https://www.omeals.cn/sjtc/WWW/home/Login/get_sessionid.html',
      method: 'get',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == true) {
          var sessionid = 'PHPSESSID=' + res.data.mes
          wx.setStorageSync('sessionid', sessionid)
        }
      }
    })
  },
  //获取手机号码
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取短信验证码
  codeInput: function (e) {
    this.setData({
      code: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  textCode: function () {
    var that = this;
    var phone = that.data.phone
    var currentTime = that.data.currentTime
    if (phone == '') {
      wx.showToast({
        title: '号码不能为空',
        icon: 'none'
      })
    } else if (phone.trim().length != 11 || !/^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/.test(phone)) {
      wx.showToast({
        title: '号码不正确',
        icon: 'none'
      })
    } else {

      that.setData({
        hidden: false
      })
      //设置一分钟倒计时
      var timer = setInterval(function () {
        currentTime--; //每执行一次让其减一
        that.setData({
          codemsg: currentTime
        })
        ////如果当秒数小于等于0时 停止计时器 且按钮文字变成重新发送
        // 且按钮变成可用状态 倒计时的秒数也要恢复成默认秒数 即让获取验证码的按钮恢复到初始化状态只改变按钮文字
        if (currentTime <= 0) {
          clearInterval(timer)
          that.setData({
            codemsg: 0,
            currentTime: 60,
            hidden: true,
            disabled: true
          })
        }
      }, 1000)
      //获取短信验证码 
      that.getSmsCode();
    }
  },
  //发送验证码
  getSmsCode() {
    var that = this
    wx.request({
      url: api.smsCode,
      data: {
        mobile: this.data.phone,
        template: 3,
        token: wx.getStorageSync('access_token')
      },
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "Cookie": wx.getStorageSync('sessionid')
      },
      success: function (res) {
        if (res.data.code == true) {
          wx.showToast({
            title: '验证码已发送',
          })
          that.setData({
            disabled: false
          })
        }

      }
    })

  },
  //完成手机验证码的发送
  confirmBtn() {
    if (this.data.phone == '') {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return false
    }
    if (this.data.code == '') {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none'
      })
      return false
    }

    var that = this
    wx.request({
      url: api.bindingMobile,
      data: {
        mobile: this.data.phone,
        code: this.data.code,
        token:wx.getStorageSync('access_token')

      },
      method: 'post',
      header: {
        "content-type": "application/x-www-form-urlencoded",
        "Cookie": wx.getStorageSync('sessionid')
      },
      success: function (res) {
        console.log(res)
        if (res.data.code == true) {
         that.setData({
           sign:res.data.mes,
           nextsuccess:false
         })
        } else {
          wx.showToast({
            title: res.data.mes,
            image: '../../../static/images/icon_error.png'
          })
        }
      }
    })

  },
})