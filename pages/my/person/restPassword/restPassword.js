const app = getApp()
var api=require('../../../../config/api')
Page({
  data: {
    showPayPwdInput: true, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
    showPayPwdInput1: true, //是否展示密码输入层
    pwdVal1: '', //输入的密码
    payFocus1: true, //文本框焦点
    secondShow:true,
    sign:'', //签名
    showImg:true, //控制图片的显示
    success:true ,//控制失败或者成功图片的显示
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
  hidePayLayer1: function () {
    var val = this.data.pwdVal1;
    this.setData({
      payFocus1: false,
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
  getFocus1: function () {
    this.setData({
      payFocus1: true
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
  inputPwd1: function (e) {
    this.setData({
      pwdVal1: e.detail.value
    });

    if (e.detail.value.length >= 6) {
      this.hidePayLayer1();
    }
  },
  //跳转到短信验证页面
  goNote() {
    console.log(this.data.pwdVal)
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
      const data={
        token,
        password
      }
      var that=this
      app.request(api.CheckpPassWord,'GET',data).then(data=>{
        this.setData({
          secondShow:false,
          sign:data
        })
      }).catch(err=>{
        wx.showToast({
          title: '原密码不正确',
          image:'../../../static/images/icon_error.png'
        })
        this.setData({
          secondShow:true,
        })
      })
    
    }

  },
  confirm() {
    if (!this.data.pwdVal1) {
      wx.showToast({
        title: '输入密码',
        image: '../../../static/images/icon_error.png'
      })
      return false
    }
    if (this.data.pwdVal1.length < 6) {
      wx.showToast({
        title: '密码长度为6',
        image: '../../../static/images/icon_error.png'
      })
      return false
    }

    if (this.data.pwdVal1.length == 6) {
      var password=this.data.pwdVal1
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

  }
})