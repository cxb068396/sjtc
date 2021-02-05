// pages/my/invoice/ordering/ordering.js
var api = require('../../../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectilall: false,  
    list:[],
    totalPrice: 0,   //总价
    totalNum: 0,   //订单数量
  },
  // 单选
  select(e) {
    console.log(e);
    let selectValue = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let list = this.data.list;
    let newli = 'list[' + index + '].checked';
    this.setData({
      [newli]: !this.data.list[index].checked
    })
    var selectedstatus = list.every(item => {
      return item.checked == true
    })
    if(selectedstatus) {
      this.setData({selectilall: true})
    }else{
      this.setData({selectilall: false})
    }
    // console.log(this.data.select)
    this.getTotalPrice();
  },

  // 全选，全不选
  selactAll(e) {
    let list = this.data.list;
    let selectilall = this.data.selectilall;
    if(selectilall == false) {
      for(let i = 0; i < list.length; i++) {
        let newli = 'list[' + i + '].checked';
        this.setData({
          [newli]: true,
          selectilall: true
        })
      }
    }else {
      for(let i = 0; i < list.length; i++ ) {
        let newli = 'list[' + i + '].checked';
        this.setData({
          [newli]: false,
          selectilall: false
        })
      }
    }
    console.log(list)
    this.getTotalPrice();
  },

  // 开票信息页
  toInformation(e) {
    console.log(e)
    if(this.data.totalPrice == '0.00') {
      wx.showToast({
        title: '请选择发票',
        image: '/pages/static/images/icon_error.png',
        duration: 2000
      });
      return false
    }
    var model = JSON.stringify(this.data.list)
    wx.navigateTo({
      url: '/pages/my/invoice/binformation/binformation?listData='+ model,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
//获取订单开票列表
getOrderingList(){
  var that = this;
  let token = wx.getStorageSync('access_token')
  app.request(api.ordering, 'post', {token})
  .then(data => {
    console.log(data);
    that.setData({
      list: data
    })
  })
  .catch(err => {
    console.log(err)
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
this.getOrderingList()
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

  // 价格调用该方法
  getTotalPrice(){
    var list = this.data.list;   //获取发票列表
    let total = 0;
    let nums = 0
    for(let i = 0; i < list.length; i++) {
      if(list[i].checked == true) {
        total += list[i].total
        nums = nums+1;
      }
    }
    this.setData({
      list: list,
      totalPrice: total.toFixed(2),
      totalNum: nums
    })
  },
})