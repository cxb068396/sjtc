// pages/index/detail/detail.js
var api = require('../../../config/api')
var WxParse = require('../../../lib/wxParse/wxParse.js');
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: 'https://www.omeals.cn/sjtc/WWW/Uploads/files/', // 图片的公共url
    imgUrls: [], //轮播图
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    duration: 1000, //  滑动动画时长1s
    interval: 3000,
    showSku: false,
    id: 0, // 商品的id
    detailInfo: '', //商品详情
    skuList: [], //商品规格参数
    skus: [], // 商品规格数组
    selectSku: {}, //选中的商品规格参数
    currentIndex: 0, //选中的规格的下标
    num: 1, //加入购物车的数量
    inventory: 0, //商品库存量
    specs_id:0,
    cartNum:0,
    way:'',//判断是加入购物还是立即购买
  },
  //规格参数的选择
  sleectSku(e) {
    var index = e.currentTarget.dataset.index
    this.setData({
      currentIndex: index,
      selectSku: this.data.skuList[index], //选中的规格参数
      inventory: this.data.skuList[index].inventory, //
      specs_id:this.data.skuList[index].id
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    this.getMianDetail();
    this.getshoppingCartNum()
  },
  close() {
    this.setData({
      showSku: false
    })
  },
  //购物车的总数量
getshoppingCartNum(){
  var that=this
  const data={
    token:wx.getStorageSync('access_token')
  }
  app.request(api.shoppingCartNum,'get',data).then(data=>{
    let num = data == null ? 0 : data
    that.setData({
      cartNum:num
    })
      app.globalData.cartNum = num
      
  })
},

  //获取商品详情
  getMianDetail() {
    var that = this
    const data = {
      id: that.data.id
    }
    app.request(api.Maindetail, 'GET', data).then(data => {
      var skuArr = data[1].filter((item, index) => {
        return item.specs_name!=''
      })
      var sku=skuArr.map((item,index)=>{
        return item.specs_name
      })
      data[1].forEach(item => {
        item.img = item.img.replace(/\\/g, "/")
      })
      console.log(data[1][0].id)
      that.setData({
        imgUrls: data[0].images, //获得轮播图
        detailInfo: data[0], //获得商品的详情
        skuList: data[1], //获得商品商品规格参数
        skus: sku, //获得商品的规格数组
        selectSku: data[1][0], //默认商品规格选中的是第一个,
        inventory: data[1][0].inventory, //显示商品的默认库存
        specs_id:data[1][0].id
      })
      WxParse.wxParse('desc', 'html', data[0].detail, that, 0, {
        type: 'detailImg'
      }); //对商品详情这块进行富文本解析

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
  //购物车的减少
  bindMinus() {
    var num = this.data.num
    if (num > 1) {
      num--
    } else {
      num = 1
    }
    this.setData({
      num: num
    })
  },
  //购物车数量的增加
  bindAdd() {
    var num = this.data.num
    num++
    if (num > this.data.inventory) {
      wx.showToast({
        title: '库存不足',
        image: '../../static/images/icon_error.png'
      })
      num = this.data.inventory
      return false
    }
    this.setData({
      num: num
    })
  },
  //输入框事件
  bindManual(e) {
    var val = e.detail.value
    if (val < 1) {
      val = 1
    }
    if (val > this.data.inventory) {
      val = this.data.inventory
    }
    this.setData({
      num: val
    })
  },
  confirm() {
   if(this.data.way=='add'){
    var that = this
    const data = {
      token: wx.getStorageSync('access_token'),
      specs_id: this.data.specs_id,
      num: this.data.num
    }
    app.request(api.addShopGood, 'POST', data).then(data => {
      console.log(data)
     that.getshoppingCartNum()
    })
    this.setData({
      showSku: false
    })
   }else if(this.data.way=='buy'){
     var that=this
     var token=wx.getStorageSync('access_token')
     var id =this.data.specs_id
     var num=this.data.num
     var str={
      token:token,
      formcart:0,
      product:{
        [id]:num
      }
    }
      app.request(api.OrderIndex, 'GET', str)
      .then(data => {
        this.setData({
          showSku: false
        })
        wx.navigateTo({
          url: '/pages/cart/accounts/accounts?str=' + JSON.stringify(data),
        })
      })
      .catch(err => {
        wx.showToast({
          title: err.mes,
          image:'../../static/images/icon_error.png'
        })
      })
     }
  },
  //购物车input框的增加减少
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  addCar(e) {
    var way=e.currentTarget.dataset.way
    this.setData({
      showSku: true,
      num:1,
      way
    })
  },
    // 立即购买
    immeBuy(e) {
      var way=e.currentTarget.dataset.way
      this.setData({
        showSku: true,
        num:1,
        way
      })
     
    },
    toCar(){
      wx.switchTab({
        url: '/pages/cart/cart',
      })
    },
    // 跳转到领取优惠券
    goDrawCoupon(){
      wx.navigateTo({
        url: '/pages/my/coupon/drawCoupon/drawCoupon',
      })
    }
})