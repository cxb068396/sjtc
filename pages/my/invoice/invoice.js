// pages/my/invoice/invoice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 去订单开票页
   */
  toOrdering() {
    wx.navigateTo({
      url: '/pages/my/invoice/ordering/ordering',
    })
  },

  /**
   * 去充值开票页
   */
  toBilling() {
    wx.navigateTo({
      url: '/pages/my/invoice/billing/billing',
    })
  },

  /**
   * 去发票记录页
   */
  toIvrecords() {
    wx.navigateTo({
      url: '/pages/my/invoice/ivrecords/ivrecords',
    })
  },

  /**
   * 去发票抬头页
   */
  toIvpayable() {
    wx.navigateTo({
      url: '/pages/my/invoice/ivpayable/ivpayable',
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

  }
})