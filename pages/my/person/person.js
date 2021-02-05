// pages/my/person/person.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
   avatar:'',
   username:'',
   sex:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  this.setData({
    avatar:wx.getStorageSync('avatar')||'',
    username:wx.getStorageSync('usrename')||'',
    sex:wx.getStorageSync('sex')||''
  })
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
  //跳转收货地址
  gotoAddress(){
    wx.navigateTo({
      url: '/pages/my/person/address/address',
    })
  },
  //退出登录
  loginOut(){
    wx.showModal({
      title: '',
      confirmColor: '#BD4044',
      content: '退出登录？',
      success: function(res) {
        if (res.confirm==true) {
          wx.clearStorageSync('access_token')
          wx.reLaunch({
            url: '/pages/logs/logs',
          })
        }
      }
    })
  }
})