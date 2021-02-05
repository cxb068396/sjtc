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
    pay: '',    //pay_num
    fapiao: '',
    price: 0,
    methos: 3,
    titleId: 0,
    type: 1,
    num: [],
    huiyuan: '会员充值',
    ided: '',   //发票抬头选择的id
    page: '',
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
    // var myEmail = /^([1-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
    // if(that.data.fapiao == "") {
    //   wx.showToast({
    //     title: '输入发票类型',
    //     image: '/pages/static/images/icon_error.png'
    //   })
    //   return false
    // }
    if(that.data.paramsEmail == ""){
      wx.showToast({
        title: '邮箱类型错误',
        image:'/pages/static/images/icon_error.png'
      })
      return false
    }
    let token = wx.getStorageSync('access_token');
    // let res = that.data.num.push(that.data.paramsCode)
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
      var lists = JSON.parse(options.arrList);
      console.log(lists)
      let total = 0;
      for(let i = 0; i < lists.length; i++) {
        if(lists[i].checked == true) {
          total += lists[i].pay_money;
        }
      }
      var arr=lists.map(item=>{
        return item.pay_num
      })
      var arr2=lists.map(item=>{
        return item.checked && item.pay_money
      })
      var arr1 = lists.map(item => {
        return item.checked && item.pay_num
      })
      this.setData({
        lists: lists,
        num:arr1,
        order: arr,
        price: total.toFixed(2)
      })
      // console.log(lists, this.data.pay)
      var _this = this;
      wx.getStorage({
        key: 'ided',
        success: function(res) {
          console.log(res.data)
          _this.setData({
            ided: res.data
          })
          // console.log(_this.data.ided)
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
    // var pages = getCurrentPages();  //获取页面栈的实例
    // var currPage = pages[pages.length - 1];  //当前页面
    // let json = currPage.data.mydata;
    // console.log(json)
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
    var methods = e.currentTarget.dataset.methos
    if(methods=='one'){
      this.setData({
        isChecked: !this.data.isChecked,
        methos:1
      })
    }else{
      this.setData({
        isChecked: !this.data.isChecked,
        methos:2
      })
    }

  },

  changeOne(e) {
    // console.log(e);
    var tid = e.currentTarget.dataset.titleId;
    var ttype = e.currentTarget.dataset.type;
    console.log(tid,ttype)
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
    console.log(e)
    var page = e.currentTarget.dataset.page
    wx.navigateTo({
      url: '/pages/my/invoice/ivpayable/ivpayable?page=' +page,
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

  bindinputpay(e) {
    this.setData({
      pay: e.detail.value
    })
  }
})