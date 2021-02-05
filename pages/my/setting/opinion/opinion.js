// pages/my/setup/opinion/opinion.js
var  api=require('../../../../config/api.js')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lastArea:0,
    information:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  getDataBindTap: function(e) {
    var information = e.detail.value;//输入的内容
    var value = e.detail.value.length;//输入内容的长度
    var that = this;
    that.setData({
      information: information,
      lastArea: value
    })
  },
  tofwuqi:function(){
    var that = this;
    if(this.data.lastArea>500){
      wx.showToast({
        title: '超过字数限制',
        image:'../../../static/icon/icon_error.png'
      })
    return false
    }
    if(this.data.lastArea<1){
    wx.showModal({
      title:'请在输入框中填写您的意见与建议',
      showCancel:false,
      confirmColor:'#F6C75C',
    })
    return false
    }
    wx.showLoading({
      title: '发送中...',
    })
    const data={
      message:this.data.information,
      token:wx.getStorageSync('access_token')
    }
    app.request(api.getIdea,'get',data).then(data=>{
     wx.hideLoading({
       success: (res) => {
        wx.showToast({
          title: '反馈成功',
          success:(res)=>{
          that.setData({
            lastArea:0,
            information:''
          })
          }
        })
       },
     })
    }).catch(err=>{
      wx.hideLoading({
        success: (res) => {
          wx.showToast({
            title: '发送失败',
            image:'../../../static/icon/icon_error.png'
          })
        },
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