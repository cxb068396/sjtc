// pages/cart/accounts/accounts.js
var api = require('../../../config/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    baseUrl: 'https://www.omeals.cn/sjtc/WWW/Uploads/files/',
    isdefault: true, //控制是否自提或者物流
    isShowAddress: false,
    wechatPay: true, //控制走的是微信支付或者余额支付
    addressInfo: '', //收货地址
    order_type: 1, //物流方式
    pay_type: 1, //支付方式
    carts: [],
    freight: '',
    formcart: '',
    discount_id: '',
    balance: '',
    totalPrice: '',
    discount: '',
    nums: 0,
    remark:'',
    payment: 0,  //支付金额
    page:'',
    address_id:0

  },
    // 支付金额等于总金额减去优惠金额加上运费
    paymen() {
      let totalPrice = Number(this.data.totalPrice);
      let freight = Number(this.data.freight);
      let discount = Number(this.data.discount);
     
      this.setData({
        payment: Math.round((totalPrice - discount + freight)*100)/100
      })
      console.log(this.data.payment)
    },
  //选择自提，还是走物流
  selectWay(e) {
    this.setData({
      isdefault: !this.data.isdefault
    })
    if (e.currentTarget.dataset.way == "logistics") {
      this.setData({
        isShowAddress: true,
        order_type: 2
      })
    } else {
      this.setData({
        isShowAddress: false,
        order_type: 1
      })
    }
    console.log(this.data.order_type)
  },

  gotoAddress(e) {
    // console.log(e)
    var page=e.currentTarget.dataset.page
    wx.navigateTo({
      url: '/pages/my/person/address/address?page='+page,
    })
  },
  //选择微信支付或者余额支付
  payWay(e) {
    this.setData({
      wechatPay: !this.data.wechatPay
    })
    if (e.currentTarget.dataset.way == "wechat") {
      this.setData({
        pay_type: 1
      })
    } else {
      this.setData({
        pay_type: 2
      })
    }
    console.log(this.data.pay_type)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // // 来自购物车的数据
    var data = JSON.parse(options.str);
   console.log(data)
   if(options.page!='detail'){
    data.list.forEach(item => {
      item.img = item.img.replace(/\\/g, "/")
      item.sell_price = (item.sell_price / 100).toFixed(2)
    })
  
    this.setData({
      nums: data.nums,
      carts: data.list,
     // balance: (data.balance/100).toFixed(2),
      freight: data.freight,
      discount: (data.discounts/100).toFixed(2),
      formcart: data.formcart,
      discount_id: data.discount_id

    })
   }else{
     this.setData({
      nums: data.nums,
      carts: data.product,
      balance: data.balance,
      freight: data.freight,
      discount: data.discounts,
      formcart: 0,
      discount_id: data.discount_id,
      page:'detail'
     })
   }

    this.getTotalPrice()
    this.paymen()
  },
  //获取购物车的地址
  getCartAddress() {
    var that = this
    const data = {
      token: wx.getStorageSync('access_token'),
      address_id:this.data.address_id
    }
    app.request(api.shopCartAddress, 'GET', data).then(data => {
      that.setData({
        addressInfo: data,
        address_id:data.id
      })
    }).catch(err => {
      //that.getCartAddress()
      that.setData({
        addressInfo:'',
        address_id:0
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
    console.log(this.data.discount,this.data.discount_id)
    var discount = this.data.discount
    this.setData({
      discount: discount,
      balance:wx.getStorageSync('balance')
    })
    this.getCartAddress()
    this.getTotalPrice()

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
  onReachBottom: function () {},

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  gopay() {
    wx.navigateTo({
      url: '/pages/cart/pay/pay',
    })
  },
  /* 点击减号 */
  bindMinus: function (e) {
    var that=this
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = carts[index].num;
    if (num <= 1) {
      return false;
    }
    num = num - 1;
    carts[index].num = num;
    let flag = 1
    let strength = 0
    const data = {
      num: 1,
      strength: strength,
      specs_id:  carts[index].id
    }
    app.request(api.ShopNum, 'post', data).then(data=>{
      carts[index].num = num;
      that.setData({
      carts: carts,
      discount: 0,
      discount_id: 0
    });
 }).catch(err=>{
   that.setData({
     carts: carts
   });
 })
    this.getTotalPrice()
  },
  /* 点击加号 */
  bindPlus: function (e) {
    var that=this
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = parseInt(carts[index].num);
    console.log(num)
    if (num > 999) {
      num = 999
      return false;
    }
    num = parseInt(num + 1)
    let flag = 1
    let strength = 1
    const data = {
      num: 1,
      strength: strength,
      specs_id:  carts[index].id
    }
    app.request(api.ShopNum, 'post', data).then(data=>{
         carts[index].num = num;
         that.setData({
         carts: carts
       });
    }).catch(err=>{
      that.setData({
        carts: carts
      });
    wx.showToast({
      title: '库存不足',
      icon:'none'
    })
    })

    this.getTotalPrice();
  },
  /* 输入框事件 */
  bindManual: function (e) {
    let numa = e.detail.value
    if (numa == '' || numa == 0) {
      numa = 1;
    }
    if (numa > 999) {
      wx.showToast({
        title: '数量最大999',
        icon: 'none'
      })
      return false
    }
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = numa
    carts[index].num = parseFloat(num);
    this.setData({
      carts: carts
    });
    this.getTotalPrice()
  },
  bindin: function (e) {
    var that = this
    var str = e.detail.value;
    that.setData({
      remark: str
    })

  },
  // 价格调用该方法
  getTotalPrice() {
    var nums = 0
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {
      // if(carts[i].selected){                   // 判断选中才会计算价格
      total += carts[i].num * carts[i].sell_price || carts[i].num * carts[i].price; // 所有价格加起来
      nums += parseInt(carts[i].num)
      // }
    }
    console.log(nums)
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2),
      nums: nums
    });
    this.paymen()
  },


  // 跳转至优惠券页面
  navigateToCoupon() {
    let carts = this.data.carts
    var product = {}
    for (let i = 0; i < carts.length; i++) {
      var sty = carts[i].id
      var valu = carts[i].num
      product[sty] = valu
    }
    var pro = JSON.stringify(product)
    wx.navigateTo({
      url: `/pages/my/coupon/coupon?from=accoounts&pro=${pro}`
    })
  },
//提交订单
  topayment: function () {
    var that = this
    var address_id = that.data.address_id
    var token = wx.getStorageSync('access_token')
    var product = {};
    var discount_id = this.data.discount_id?this.data.discount_id:0;
    var freight = that.data.freight;
    var remark = that.data.remark;
    var carts = that.data.carts;
    var from_cart = that.data.formcart
    var pay_type=that.data.pay_type
    var order_type=that.data.order_type
    console.log(carts)
    for (let i = 0; i < carts.length; i++) {
      var sty = carts[i].id
      var valu = carts[i].num
      product[sty] = valu;
    }
    if(that.data.pay_type==2){
      if(that.data.payment>that.data.balance){
        wx.showModal({
          title:'提示',
          content:'余额不足，是否充值',
          confirmColor:'#BD4044',
          success(res){
            if(res.cancel){
          
            }
            if(res.confirm){
              wx.navigateTo({
                url: '/pages/my/member/member',
              })
            }
          }
        })
        return false
      }

    }
    if(that.data.order_type==1){
      var str = {
        token: token,
        product: product,
        discount_id: discount_id,
        freight: freight,
        remark: remark,
        formcart: from_cart,
        pay_type:pay_type,
        order_type:order_type
      }
      app.request(api.CreateOrder, undefined, str)
        .then(data => {
          console.log(data)
          data.remark = remark
          app.globalData.strs = data
          wx.redirectTo({url: '/pages/cart/pay/pay'})
        })
        .catch(err => {
          wx.showModal({
            title: '提示',
            content: err.mes || ''
          })
        })
    }else if(that.data.order_type==2){
      var str = {
        token: token,
        address_id: address_id,
        product: product,
        discount_id: discount_id,
        freight: freight,
        remark: remark,
        formcart: from_cart,
        pay_type:pay_type,
        order_type:order_type
      }
      app.request(api.CreateOrder, undefined, str)
        .then(data => {
          console.log(data)
          data.remark = remark
          app.globalData.strs = data
         wx.redirectTo({url: '/pages/cart/pay/pay'})
        })
        .catch(err => {
        wx.showToast({
          title: err.mes,
          icon:'none'
        })
        })
    }

  },

})