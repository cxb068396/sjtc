// pages/my/my.js
var api = require('../../config/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    avatar: '',
    showUserInfo: false,
    balance: '0.00', // 会员余额
    couponCounts: '',
    token: ''

  },
  login() {
    wx.navigateTo({
      url: '/pages/logs/logs',
    })
  },

  //显示未使用优惠券的数量
  GetCouponCount() {
    var token = wx.getStorageSync('access_token')
    if (!token) {
      return false
    }
    var that = this
    const data = {
      token: token
    }
    app.request(api.GetCouponCount, 'POST', data).then(data => {
      that.setData({
        couponCounts: data
      })
    }).catch(err => {
      that.setData({
        couponCounts: err.mes
      })
    })
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

  },
  UserInfo() {
    //     var token = wx.getStorageSync('access_token')
    //     if (!token) {
    //       return false
    //     }
    // const data={
    //   token :token
    // }
    //  app.send(api.LoginGetUser,'GET',data).then(data=>{
    //   console.log(data)
    //   console.log('123')
    //   })
    var that = this
    let token = wx.getStorageSync('access_token')
    wx.request({
      url: api.LoginGetUser,
      data: {
        token: token,
      },
      method: 'GET',
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.code == true) {
          wx.setStorageSync('pass', res.data.pass)
          wx.setStorageSync('balance', (res.data.balance / 100).toFixed(2))
          console.log(res.data)
          that.setData({
            avatar: res.data.avatar,
            username: res.data.username,
            showUserInfo: true,
            balance: (res.data.balance / 100).toFixed(2)
          })
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      token: wx.getStorageSync('access_token')
    })
    this.GetCouponCount()
    this.UserInfo()

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
  gotoPerson() {
    wx.navigateTo({
      url: "/pages/my/person/person",
    })
  },
  gotoMember() {
    wx.navigateTo({
      url: "/pages/my/member/member",
    })
  },
  goOrder() {
    if (!this.data.token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/my/order/order',
    })
  },
  gotoCoupon() {
    wx.navigateTo({
      url: '/pages/my/coupon/coupon',
    })
  },
  // 去支票页面
  goInvoice() {
    if (!this.data.token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/my/invoice/invoice',
    })
  },
  //跳转到品酒预订
  goWineTast() {
    if (!this.data.token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/my/wineTasting/wineTasting',
    })
  },

  // 去设置页
  goSetting() {
    if (!this.data.token) {
      wx.showToast({
        title: '请先登录',
        icon: 'none'
      })
      return false
    }
    wx.navigateTo({
      url: '/pages/my/setting/setting',
    })
  }
})