// pages/my/invoice/ivpayable/ivpayable.js
//获取应用实例
var api = require('../../../../config/api.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrList: [],
    Mstart: '', //记录左滑开始的位置
    index: '', //记录左滑的元素
    from:'',
    ided: '',   //选择的发票的id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      from: options.page
    })   
  },

  onShow: function() {
    this.goivList();
  },

  goivList() {
    var token = wx.getStorageSync('access_token');
    app.request(api.ivpayable, 'post', {token})
    .then(data => {
      if(data.length !== ' ') {
        this.setData({
          arrList: data
        })
      }
      // console.log(data)
    })
    .catch(err => {
      console.log(err)
    })
  },

  // 触摸开始
  touchstart: function (e) {
    // console.log(e);
    if(this.data.from == 'biRecharge' || this.data.from == 'biInformation') {
      return false;
    }
    this.setData({
      Mstart: e.changedTouches[0].pageX, //开始触摸时的横坐标
      index: e.currentTarget.dataset.index,
    })
  },

  // 开始滑动
  touchmove: function (e) {
    if(this.data.from == 'biRecharge' || this.data.from == 'biInformation') {
      return false;
    }
    let that = this;
    //  console.log(e);
    let list = that.data.arrList;
    // 计算滑动的距离
    let moveL = that.data.Mstart - e.changedTouches[0].pageX;
    // console.log(moveL)

    list[that.data.index].left = moveL > 0 ? -moveL : 0;

    that.setData({
      arrList: list,
    })
  },

  // 滑动结束 触摸结束
  touchend: function (e) {
    if(this.data.from == 'biRecharge' || this.data.from == 'biInformation') {
      return false;
    }
    let that = this;
    // console.log(e);
    let list = that.data.arrList;
    let lastMoveL = that.data.Mstart - e.changedTouches[0].pageX; //最终移动的距离

    list[that.data.index].left = lastMoveL > 100 ? -150 : 0;

    this.setData({
      arrList: list,
    })
  },

  // 去添加抬头发票页
  toaddPayable() {
    let from = this.data.from
    wx.navigateTo({
      url: '/pages/my/invoice/ivpayable/addpayable/addpayable?from='+from,
    })
  },

  // 编辑抬头信息
  tochose(e) {
    if(this.data.from == 'biRecharge' || this.data.from == 'biInformation') {
      return false;
    }
    console.log(e);
    var index = e.currentTarget.dataset.index
    var from = this.data.from
    // console.log(from)
    var address = this.data.arrList[index]
    wx.navigateTo({
      url: '/pages/my/invoice/ivpayable/editpayable/editpayable?address=' + JSON.stringify(address)+'&from='+from
    })
  },

  // 选择发票
  chooseOne(e) {
      // console.log(e);
      if(this.data.from != 'biRecharge' || this.data.from != 'biInformation') {
        return false;
      }
      let bill_id = e.currentTarget.dataset.id;
      let bill_title = e.currentTarget.dataset.title;
      let bill_code = e.currentTarget.dataset.code;
      let bill_email = e.currentTarget.dataset.email;
      var pages = getCurrentPages();  //获取页面栈的实例
      // var currPage = pages[pages.length - 1];  //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      prevPage.setData({
        //paramsXX在上一页中已声明 直接赋值
          paramsId : bill_id,
          paramsTitle:bill_title,
          paramsCode: bill_code,
          paramsEmail: bill_email
      
      })
      console.log(bill_id,bill_title,bill_code,bill_email)
      wx.navigateBack({//默认返回上一页
        delta: 1
      })
      
      this.setData({
        ided: bill_id
      })
      console.log(this.data.ided)
      var that = this;
      wx.setStorage({
        data: that.data.ided,
        key: 'ided',
        success: function(res) {
          // console.log(that.data.ided + 'hjhghvhgvhg')
          console.log(res)
        }
      })
  },

  // 删除地址
  scrollDel(e) {
    console.log(e);
    let that = this;
    var ivId = e.currentTarget.dataset.id
    var list = that.data.arrList
    wx.showLoading({
      title: '',
    })
    wx.request({
      url: api.delPayable,
      data:{
        token: wx.getStorageSync('access_token'),
        id: ivId
      },
      method: 'POST',
      header: { "content-type": "application/x-www-form-urlencoded" },
      success:function(res){
        // console.log(res)
         that.goivList()
         wx.hideLoading()
      },
      error: function(err) {
        console.log(err)
      }
    })
    list = list.filter((item) => {
      return item.id = ivId
    });
    that.setData({
      arrList: list
    })
  },
})