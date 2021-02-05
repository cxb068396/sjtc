//index.js 
//获取应用实例 
var api = require('../../../config/api')
var app = getApp() 
Page( { 
 data: { 
    /** 
      * 页面配置 
      */ 
    winWidth: 0, 
    winHeight: 0, 
    // tab切换 
    currentTab: 0, 
    hsalist:false,
    arrList: [],   //未使用的数组
    arrList1: [],  //已使用的数组
    arrList2: [],  //已过期/作废的数组
    status: 2,  //未使用
    status1: 3, //已使用
    status2:4,//已过期，已作废
    from: '', // 从哪个页面跳转过来的，默认空
    product: {},
 }, 
 onLoad: function(options) { 
  if(Object.keys(options).length!=0){
    const {
      from
    } = options
    let pro = JSON.parse(options.pro)
    this.setData({
      from:from,
      product:pro
    })
  }
    var that = this; 
 
    /** 
     * 获取系统信息 
     */ 
    wx.getSystemInfo( { 
  
      success: function( res ) { 
        that.setData( { 
          winWidth: res.windowWidth, 
          winHeight: res.windowHeight 
        }); 
      } 
    }); 

  

 }, 
 onShow(){
  this.getCoupon(this.data.status)
  this.getCoupon(this.data.status2)
  this.getCoupon1(this.data.status1)
 },
 /** 
   * 滑动切换tab 
   */ 
 bindChange: function(e) { 
  var that = this; 
  that.setData( { currentTab: e.detail.current }); 
 }, 

 /** 
  * 点击tab切换 
  */ 
 swichNav: function (e) {
  // console.log(e)
  var that = this;
  if (that.data.currentTab === e.target.dataset.current) {
    return false;
  } else {
    var current = e.target.dataset.current;
    that.setData({
      currentTab: parseInt(current) - 2,
      isStatus: e.target.dataset.otype,
    });

    if (current == 2 ) {
      that.getCoupon(that.data.status)
    } else if (
      current == 3
    ) {
      that.getCoupon1(that.data.status1)
    }else if( current == 4){
      that.getCoupon(that.data.status2)
    }
  };
},

 /**
  * 领取更多的优惠券 
  */
 drawCoupon(){
   wx.navigateTo({
     url: '/pages/my/coupon/drawCoupon/drawCoupon',
   })
 },

 //得到优惠券
 getCoupon(status) {
  var token = wx.getStorageSync('access_token')
  app.request(api.PersonalCoupon, 'POST', {
    status,
    token
  })
  .then(data => {
    // console.log(data);
    data.coupon.forEach(item=>{
      if(item.coupon_type==1){
        item.minus=item.minus/100
      }else{
        item.minus=item.minus/10
      }
    })
    if(status == 2) {
      this.setData({arrList: data.coupon})
      // wx.setStorageSync('coupons', data)
    }else if (status == 4) {
      this.setData({arrList2: data.coupon}) 
    }
  }).catch(err => {
    console.log(err.mes)
  })
 },

 //已经使用的
 getCoupon1(status1) {
  var token = wx.getStorageSync('access_token')
  const status = this.data.status1
  app.request(api.PersonalCoupon, 'post', {
      status
    })
    .then(data => {
      data.coupon.forEach(item=>{
        if(item.coupon_type==1){
          item.minus=item.minus/100
        }else{
          item.minus=item.minus/10
        }
      })
      this.setData({
        arrList1: data.coupon
      })

    }).catch(err => {})
 },

 getOrderStatus: function () {
    return this.data.currentTab == 0 ? 2 : this.data.currentTab == 2 ? 3 : this.data.currentTab == 3 ? 4 : 0;
 },

  // 优惠券点击事件处理函数
  useCoupon(e) {
    if (this.data.from === 'accoounts') { // 从 ettlement 页面过来的
      const data = {
        token: wx.getStorageSync('access_token'),
        cid: e.currentTarget.dataset.id,
        product: this.data.product
      }
      app.request(api.CheckCoup, 'get', data).then(data => {
       console.log(data)
      const currPages = getCurrentPages();
      const prevPage = currPages[currPages.length - 2]
      prevPage.setData({
        discount:( data.discounts/100).toFixed(2),
        discount_id: data.discount_id
      })
          wx.navigateBack()
      }).catch(err=>{
        wx.showModal({
         title:err.mes,
         showCancel:false,
         confirmColor:'#BE4044'
        })
     
      })
    }
  },

}) 
