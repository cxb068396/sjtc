var api=require('../../../config/api')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   wineIndexList:[],
   baseUrl:'https://www.omeals.cn/sjtc/WWW/Uploads/desk/'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
//获得品酒预订的信息
getWineIndex(){
  var that=this
  app.request(api.wineIndex).then(data=>{
    data.forEach(item=>{
      item.price=(item.price/100).toFixed(2)
    })
this.setData({
  wineIndexList:data
})
  }).catch(err=>{
    wx.showToast({
      title: err.mes,
      image:'../../static/images/icon_error.png'
    })
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
  this.getWineIndex()
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
//跳转到预订信息页面
goBookInfo(e){
  console.log(e)
var id=e.currentTarget.dataset.id
var price=e.currentTarget.dataset.price
wx.navigateTo({
  url: '/pages/my/wineBook/wineBook?id='+id+'&price='+price,
})
},
})