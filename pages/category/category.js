// pages/category/category.js
var api = require('.././../config/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: 'https://www.omeals.cn/sjtc/WWW/Uploads/files/',
    isshowMenu: false, //显示遮罩
    cateItems: [], //一级目录
    rightTopList: [], //二级目录
    cateId: 0, //默认选中的一级目录
    rightId: '', //默认选中二级目录
    categoryList: [], //获取内容
    index: 0,
    winHeight: 0,
    cate:0

  },
  //显示遮罩
  showMenu() {
    this.setData({
      isshowMenu: !this.data.isshowMenu
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({

      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
  },
  //获得分类的一级二级目录
  getCatagory() {
    app.request(api.GoodCategory, 'GET').then(data => {
      var id = getApp().globalData.cor_id
      var index = data.map(item => item.id).indexOf(id)
      if (index == -1) {
        this.setData({
          index: 0,
        })
      } else {
        this.setData({
          index: index,
        })
      }

      this.setData({
        cateItems: data,
        rightTopList: data[this.data.index].child,
        cateId: data[this.data.index].id,
        cate:data[this.data.index].id,
      })
      this.getGoods()
    })
  },

  // 获取分类内容
  getGoods() {
    var that = this
    const data = {
      cate: this.data.cate
    }
    app.request(api.getGood, 'GET', data).then(data => {
      that.setData({
        categoryList: data
      })

    }).catch(err => {

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
    this.setData({
      rightId:'',
      categoryList: [],
      cateId: getApp().globalData.cor_id,
      cate:getApp().globalData.cor_id,
    })
    this.getCatagory()
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
  //选中一级目录
  switchRightTab(e) {
    console.log(e)
    this.setData({
      rightId: '',
      categoryList: []
    })
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    this.setData({
      cateId: id,
      cate:id,
      rightTopList: this.data.cateItems[index]['child'],
    })
    this.getGoods()
  },
  //选中二级目录
  onRightTab(e) {
    this.setData({
      categoryList: []
    })
    var id = e.currentTarget.dataset.id
    var index = e.currentTarget.dataset.index
    this.setData({
      rightId: id,
      cate:id
    
    })
    this.getGoods()
  },
  //跳转到详情
  goTodetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/detail/detail?id=' + id
    })
  },
  //添加购物车
  addShopCart(e) {
    console.log(e)
    var that = this
    wx.showLoading()
    var id = e.currentTarget.dataset.id
    var num = 1
    var token = wx.getStorageSync('access_token')
    const data = {
      specs_id: id,
      num: num,
      token: token
    }
    app.request(api.addShopGood, 'POST', data).then(data => {
      wx.showToast({
        title: '加入成功',
      })
      that.getshoppingCartNum()
      wx.hideLoading()
    }).catch(err => {
      wx.showToast({
        title: err.mes,
        icon: 'none'
      })
      wx.hideLoading()
    })
  },

  // 获取购物车数目
  getshoppingCartNum() {
    let token = wx.getStorageSync('access_token')
    if (!token) {
      return false
    }
    const data = {
      token: token
    }
    app.request(api.shoppingCartNum, 'get', data).then(data => {

      let num = data == null ? 0 : data
      // wx.setStorage({
      //   key: 'cartNum',
      //   data: num,
      // })
      app.globalData.cartNum = num
      this.showCartNum()

    })
  },
  showCartNum() {
    // let cartNum = wx.getStorageSync("cartNum");
    let cartNum = app.globalData.cartNum;
    if (cartNum > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: cartNum + "",
      })
    } else {
      wx.removeTabBarBadge({
        index: 2
      })
    }
  },
})