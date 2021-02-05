const app = getApp()
var api = require('../../../../config/api')
Page({
  data: {
    showPayPwdInput: true, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
    showPassImg: true,
    success: true
  },
  onLoad: function () {

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
  //跳转到短信验证页面
  goNote() {
    var token = wx.getStorageSync('access_token')
    var password = this.data.pwdVal
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
      var that = this
      const data = {
        token: token,
        password: password
      }
      app.request(api.setPassWord, 'GET', data).then(data => {
       wx.setStorageSync('pass', 1)
        that.setData({
          showPassImg: false,
          success: true
        })
      }).catch(err => {
        that.setData({
          showPassImg: false,
          success: false
        })
      })
    }

  }
})