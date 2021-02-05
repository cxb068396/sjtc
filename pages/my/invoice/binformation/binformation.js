// pages/my/invoice/binformation/binformation.js
var api = require('../../../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lists: [],
    isChecked: false,
    oneChecked: false,
    paramsId: '',   //发票抬头页传过来的id
    paramsTitle: '',//发票抬头页传过来的发票抬头
    paramsCode: '', //发票抬头页传过来的纳税人识别号
    paramsEmail: '',//发票抬头页传过来的邮箱地址，
    order: '',    //order_num
    fapiao: '',
    price: 0,   //发票金额
    methos: 1,
    titleId: 0,
    type: 1,
    num: [],
    ided: '',   //发票抬头选择的id
    page: ''
  },

  select(e) {
    console.log(e);
    let selectValue = e.currentTarget.dataset.name;
    let index = e.currentTarget.dataset.index;
    let lists = this.data.lists;
    let newli = 'lists[' + index + '].checked';
    this.setData({
      [newli]: !this.data.lists[index].checked
    })
    var selectedstatus = lists.every(item => {
      return item.checked == true
    })
    if(selectedstatus) {
      this.setData({selectilall: true})
    }else{
      this.setData({selectilall: false})
    }
    // console.log(this.data.select)
  },

  toinfo() {
    var that = this;
    // var myEmail = /^[a-z0-9A-Z]+[- | a-z0-9A-Z . _]+@([a-z0-9A-Z]+(-[a-z0-9A-Z]+)?\\.)+[a-z]{2,}$/;
    // if(that.data.fapiao == "") {
    //   wx.showToast({
    //     title: '输入发票类型',
    //     image: '/pages/static/images/icon_error.png'
    //   })
    //   return false
    // }
    if(that.data.paramsTitle == "") {
      wx.showToast({
        title: '请选择公司抬头',
        image: '/pages/static/images/icon_error.png'
      })
      return false
    }
    if(that.data.paramsEmail == ""){
      wx.showToast({
        title: '邮箱类型错误',
        image:'/pages/static/images/icon_error.png'
      })
      return false
    }
    let token = wx.getStorageSync('access_token');
    app.request(api.getRecharge, 'post', {
      token,
      amount: that.data.price,
      title_id: that.data.titleId,
      title_type: that.data.type,
      bill_method: that.data.methos,
      email: that.data.paramsEmail,
      num: that.data.num,
    })
    .then(data => {
      console.log(data);
      if(data == '申请成功') {
        wx.showToast({
          title: data,
          duration: 2000
        })
        setTimeout(function() {
          wx.navigateBack({
            delta: 1
          }, 1500)
        })
      }
    })
    .catch(err => {
      console.log(err)
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //接收从ordering传过来的数组list
      var list = JSON.parse(options.listData) 
      console.log(list)
      let total = 0;
      for(let i = 0; i < list.length; i++) {
        if(list[i].checked == true) {
          total += list[i].total;
        }
      }
      // 循环获取到的数组，取到order_num,判断order_num有没有值，有值的话就是商品分类和商品明细，没值就是会员充值
      var arr=list.map(item=>{
        return item.order_num
      })
      var arr1 = list.map(item => {
        return item.checked && item.order_num
      })
      
      console.log(arr1);
      this.setData({
        list: list,
        num:arr1,
        order: arr,
        price: total.toFixed(2)
      })
      console.log(list, this.data.order)
      
      var _this = this;
      wx.getStorage({
        key: 'ided',
        success: function(res) {
          console.log(res.data)
          _this.setData({
            ided: res.data
          })
          console.log(_this.data.ided)
        }
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

  // 切换change
  change(e) {
    // console.log(e)
    var methods=e.currentTarget.dataset.methos
   if(methods=='one'){
    this.setData({
      isChecked: !this.data.isChecked,
      methos:1
    })
   }else if(methods == 'two'){
    this.setData({
      isChecked: !this.data.isChecked,
      methos:2
    })
   }else{
     this.setData({
       methos: 3
     })
   }

  },

  changeOne(e) {
    console.log(e);
    var tid = e.currentTarget.dataset.titleId;
    var ttype = e.currentTarget.dataset.type;
    if(tid == 'status01' || ttype == 'one') {
      this.setData({
        oneChecked: !this.data.oneChecked,
        titleId: 0,
        type: 1
      })
    }else{
      this.setData({
        oneChecked: !this.data.oneChecked, 
        titleId: this.data.ided, 
        type: 2    
      })
    }
  },

  // 跳转到公司抬头页
  totaitou(e) {
    var page =e.currentTarget.dataset.page;
    wx.navigateTo({
      url: '/pages/my/invoice/ivpayable/ivpayable?page='+page,
    })
  },

  bindinputFapiao(e) {
    this.setData({
      fapiao: e.detail.value
    })
  },

  bindinputprice(e) {
    this.setData({
      price: e.detail.value
    })
  },

  bindinputEmail(e) {
    this.setData({
      paramsEmail: e.detail.value
    })
  },
})