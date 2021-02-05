// pages/my/invoice/ivpayable/editpayable/editpayable.js
var api = require('../../../../../config/api.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taitou: '',
    code: '',
    email: '',
    is_default: "",
    from:'',
    id: '',
  },

  bindinputTaitou(e) {
    this.setData({
      taitou: e.detail.value
    })
  },
  bindinputCode(e) {
    this.setData({
      code: e.detail.value
    })
  },
  bindinputAddress(e) {
    this.setData({
      email: e.detail.value
    })
  },
  //设置是否为默认地址
  bindIsDefault(e) {
    var that = this;
    if(e.detail.value == "") {
      that.setData({
        is_default: 2
      })
    }else{
      that.setData({
        is_default: 1
      })
    }
  },

  // 编辑页保存
  toeditPayable() {
    if(this.data.taitou == "") {
      wx.showToast({
        title: '请输入发票抬头',
        image: '/pages/static/images/icon_error.png'
      })
      return false
    }
    if(this.data.code == "") {
      wx.showToast({
        title: '输入纳税人识别号',
        image: '/pages/static/images/icon_error.png'
      })
      return false
    }
    if(this.data.email == "") {
      wx.showToast({
        title: '输入邮箱',
        image: '/pages/static/images/icon_error.png'
      })
      return false
    }
    var that = this;
    let token = wx.getStorageSync('access_token')
    console.log(that.data.taitou)
    wx.request({
      url: api.editPayable,
      data:{
        token:token,
        invoice_title:that.data.taitou,
        invoice_number:that.data.code,
        email:that.data.email,
        is_default:that.data.is_default,
        id: that.data.id
      },
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      success:function(res){
        console.log(res)
        if(res.data.code==true){
          wx.showToast({
            title: res.data.mes,
            success:function(){
            if(that.data.from=='ivpayable'){
              wx.reLaunch({
                url: '/pages/my/invoice/ivpayable/ivpayable',
              })
            }else{
              wx.navigateBack({
                delta: 1,
              })
            }
              }
            })
        } else{
          wx.showToast({
            title: '设置为默认',
            image:'/pages/static/images/icon_error.png'
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var editInfo = JSON.parse(options.address)
    console.log(editInfo);
    this.setData({
      taitou: editInfo.invoice_title,
      code: editInfo.invoice_number,
      email: editInfo.email,
      is_default: editInfo.is_default==2?'':1,
      id: editInfo.id
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