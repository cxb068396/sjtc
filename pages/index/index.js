var api = require('../../config/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: false, //控制新人优惠券的显示隐藏
    bannars: [], //轮播图
    category: [], // 首页分类
    recommend: [], //推荐酒品
    hostList: [], //热卖酒品
    wineList: [], //默认酒品
    coupon_price:'',//优惠的价格
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getHomeIndex()
    var token=wx.getStorageSync('access_token')
    this.getshoppingCartNum(token)
    this.showNewCoupon(token)
    this.showCartNum()
  },
  //获取所有的商品信息
  getHomeIndex() {
    var that = this
    app.request(api.HomeIndex, 'GET').then(data => {
      var bannar = data[0]
      var category = data[1]
      var wineList = data[2]
      var recommend = data[3]
      var hostList = data[4]
      if(bannar){
        bannar.forEach(item => {
          item.img = 'https://www.omeals.cn/sjtc/WWW/Uploads/banner/' + item.img.replace(/\\/g, "/")
        })
      }
     if(wineList){
      wineList.forEach(item => {
        item.img = 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + item.img.replace(/\\/g, "/")
      })
     }
     if(category){
      category.forEach(item => {
        item.img = 'https://www.omeals.cn/sjtc/WWW/Uploads/banner/' + item.img.replace(/\\/g, "/")
      })
     }
     if(recommend){
      recommend.forEach(item => {
        item.img = 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + item.img.replace(/\\/g, "/")
      })
     }
    if(hostList){
      hostList.forEach(item => {
        item.img = 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + item.img.replace(/\\/g, "/")
      })
    }
      that.setData({
        bannars: bannar,
        category: category,
        wineList: wineList,
        recommend: recommend,
        hostList: hostList
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
   this.showCartNum()
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
    this.getHomeIndex()
    setTimeout(function () {
      // 不加这个方法真机下拉会一直处于刷新状态，无法复位
      wx.stopPullDownRefresh()
    }, 2000)
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
  close() {
    this.setData({
      isShow: false
    })
  },
  //跳转到详情页
  goToDetail(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/index/detail/detail?id=' + id
    })
  },
  //跳转分类页面
  goCategory() {
    wx.switchTab({
      url: '/pages/category/category',
    })
  },
  //轮播图或者类别的跳转
 //如果是cor_type=1,跳转分类，如果是2，跳转到详情页
 go_detail_catagory(e){
   console.log(e)
   var id=e.currentTarget.dataset.id
   var type=e.currentTarget.dataset.type
   getApp().globalData.cor_id=id
   if(type==1){
     wx.switchTab({
       url: '/pages/category/category?id='+id,
     })
   }else{
     wx.navigateTo({
       url: '/pages/index/detail/detail?id='+id,
     })
   }
 },
//显示优惠券

showNewCoupon(token) {
  if (!token) {
    this.setData({
      isShow: false
    })
    app.$event.listen('token', this.showNewCoupon)
    return false
  }
  app.request(api.showNewCoupon, 'get', {
      token: token
    })
    .then(data => {
      var Time = new Date().getTime()
      if (new Date(data.limit_time).getTime() - Time >0){
      this.setData({
        isShow:true,
        coupon_price:(data.minus)/100
      })
      }
      app.$event.remove('token', this.showNewCoupon)

    })
    .catch(err => {
      console.log(err);
      this.setData({
        isShow: false
      })
    })
},
//添加购物车
addShopCart(e){
  var that=this
  wx.showLoading()
  var id=e.currentTarget.dataset.id
  var num=1
  var token=wx.getStorageSync('access_token')
  const data={
    specs_id:id,
    num:num,
    token:token
  }
  app.request(api.addShopGood,'POST',data).then(data=>{
  wx.showToast({
    title: '加入成功',
  })
  that.getshoppingCartNum(token)
  wx.hideLoading()
  }).catch(err=>{
    wx.showToast({
      title: err.mes,
      icon:'none'
    })
    wx.hideLoading()
  })
},
//显示购物车的数量
getshoppingCartNum(token) {
  if (!token) {
    app.$event.listen('token', this.getshoppingCartNum)
    return false
  }
  app.request(api.shoppingCartNum, 'get', {
      token: token
    })
    .then(data => {
      let num = data == null ? 0 : data
      app.globalData.cartNum = num

      this.showCartNum()

     app.$event.remove('token', this.getshoppingCartNum)
    })

},
showCartNum() {
  let cartNum = app.globalData.cartNum;
  // let cartNum = wx.getStorageSync("cartNum");
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