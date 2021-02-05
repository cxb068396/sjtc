// pages/my/setForget/setForget.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pass:true
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
   var passWord=wx.getStorageSync('pass')
   if(passWord==0){
     this.setData({
       pass:true
     })
   }else{
     this.setData({
       pass:false
     })
   }
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
  gopayPassword(){
    wx.navigateTo({
      url: '/pages/my/person/payPassword/payPassword',
    })
  },
  goSet(){
  wx.navigateTo({
    url: '/pages/my/person/restPassword/restPassword',
  })
  },
  goForget(){
    wx.navigateTo({
      url: '/pages/my/person/note/note',
    })
  }
})