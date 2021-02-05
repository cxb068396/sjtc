// pages/my/member/member.js
var api = require('../../../config/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    recharge: 0, //余额
    nums: [100, 200, 500, 1000, 2000,''], //充值入口
    currentIndex: 0,
    total: 0.01,
    pass:0,//判断是否有支付密码
  },
  //获取余额
  Recharge() {
    var that = this
    const data = {
      token: wx.getStorageSync('access_token')
    }
    app.request(api.Recharge, 'POST', data).then(data => {
      that.setData({
        recharge: data
      })
      wx.setStorageSync('balance', data)
    })
  },

  selectNum(e) {
    var index = e.currentTarget.dataset.index
    var num = e.currentTarget.dataset.num
    this.setData({
      total: num,
      currentIndex: index
    })
  },
  numInput(e){
    var num=e.detail.value
    this.setData({
      total:num
    })
  },
  //立即充值
  RechargeRechargeAmount() {
    if(this.data.pass==0){
      wx.navigateTo({
        url: '/pages/my/person/payPassword/payPassword',
      })
      return false
    }
    var that = this
    if(!this.data.total){
      wx.showToast({
        title: '输入金额',
        icon:'none'
      })
      return false
    }
    const data = {
      total: that.data.total,
      token: wx.getStorageSync('access_token')
    }
    app.request(api.RechargeRechargeAmount, 'POST', data).then(data => {
     var nonceStrs=data.pay.nonceStr
     var packages=data.pay.package
     var paySigns= data.pay.paySign
     var  timeStamps=data.pay.timeStamp
     var signTypes=data.pay.signType
      wx.requestPayment({
        nonceStr: nonceStrs,
        package: packages,
        paySign: paySigns,
        timeStamp:timeStamps,
        signType: signTypes,
        success(res) {
          that.Recharge()
        },
        fail(res) {
          console.log(res)
          wx.showToast({
            title: '充值失败',
            image:'../../static/images/icon_error.png'
          })
        }
      })

    }).catch(err => {    
 
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.Recharge()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   this.setData({
    pass:wx.getStorageSync('pass')
   })
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

  }
})