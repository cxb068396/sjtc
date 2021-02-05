var api = require('../../../config/api')
var app = getApp()
//订单类型 1自提，2物流，3预订
//订单状态 1代付款 2已支付/待发货 3待收货 4待评价 5售后/退款 6订单取消 7交易关闭
Page({
  data: {
    /** 
     * 页面配置 
     */
    winWidth: 0,
    winHeight: 0,
    // tab切换 
    currentTab: 0,
    hsalist: false,
    allOrderList: [], //所有的订单
    allpage: 0, //全部订单的页码
    ziTiList: [], //自提订单
    ztpage: 0, //自提的页码
    wuLiuList: [], //物流订单
    wlpage: 0, //物流的页码
    bookList: [], //预订订单
    bookpage: 0, //预订的页码
  },
  onLoad: function () {
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
  onShow(){
    this.getAllOrder()
    this.getZiTiList()
    this.getwuliuList()
    this.getbookList()
  },
  //获取所有的订单
  getAllOrder() {
    var that = this
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    const data = {
      token: wx.getStorageSync('access_token'),
      page: this.data.allpage,
    }
    app.request(api.allOrder, 'GET', data).then(data => {
      let goods = data
      for (let index = 0; index < goods.length; index++) {
        goods[index].total = ((goods[index].total) / 100).toFixed(2)
        var nums = 0
        for (let i = 0; i < goods[index]['product'].length; i++) {
          if(goods[index]['product'][i].main_images){var element = 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + goods[index]['product'][i].main_images;}
          if(goods[index]['product'][i].desk_image){var element = 'https://www.omeals.cn/sjtc/WWW/Uploads/desk/' + goods[index]['product'][i].desk_image;}
          goods[index]['product'][i].main_images = element
          goods[index]['product'][i].price = ((goods[index]['product'][i].price) / 100).toFixed(2)
          nums += parseInt(goods[index]['product'][i].num)
          goods[index].nums = nums
        }
      }
      let goodsList = []
      if (that.data.allpage != 0) {
        goodsList = that.data.allOrderList.concat(goods)
      } else {
        goodsList = goods
      }
      that.setData({
        allOrderList: goodsList
      })
      wx.hideLoading()
    }).catch(err => {
      wx.showToast({
        title: err.mes,
        image: '../../static/images/icon_error.png'
      })
      wx.hideLoading()
    })

  },
  //获取自提的订单
  getZiTiList() {
    var that = this
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    const data = {
      token: wx.getStorageSync('access_token'),
      page: this.data.ztpage,
      order_type: 1
    }
    app.request(api.allOrder, 'GET', data).then(data => {
      let goods = data
      for (let index = 0; index < goods.length; index++) {
        goods[index].total = ((goods[index].total) / 100).toFixed(2)
        var nums = 0
        for (let i = 0; i < goods[index]['product'].length; i++) {
          const element = 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + goods[index]['product'][i].main_images;
          goods[index]['product'][i].main_images = element
          goods[index]['product'][i].price = ((goods[index]['product'][i].price) / 100).toFixed(2)
          nums += parseInt(goods[index]['product'][i].num)
          goods[index].nums = nums
        }
      }
      let goodsList = []
      if (that.data.ztpage != 0) {
        goodsList = that.data.ziTiList.concat(goods)
      } else {
        goodsList = goods
      }
      that.setData({
        ziTiList: goodsList
      })
      wx.hideLoading()
    }).catch(err => {
      wx.showToast({
        title: err.mes,
        image: '../../static/images/icon_error.png'
      })
      wx.hideLoading()
    })

  },
  //获取物流的订单
  getwuliuList() {
    var that = this
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    const data = {
      token: wx.getStorageSync('access_token'),
      page: this.data.wlpage,
      order_type: 2
    }
    app.request(api.allOrder, 'GET', data).then(data => {
      let goods = data
      for (let index = 0; index < goods.length; index++) {
        goods[index].total = ((goods[index].total) / 100).toFixed(2)
        var nums = 0
        for (let i = 0; i < goods[index]['product'].length; i++) {
          const element = 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + goods[index]['product'][i].main_images;
          goods[index]['product'][i].main_images = element
          goods[index]['product'][i].price = ((goods[index]['product'][i].price) / 100).toFixed(2)
          nums += parseInt(goods[index]['product'][i].num)
          goods[index].nums = nums
        }
      }
      let goodsList = []
      if (that.data.wlpage != 0) {
        goodsList = that.data.wuLiuList.concat(goods)
      } else {
        goodsList = goods
      }
      that.setData({
        wuLiuList: goodsList
      })
      wx.hideLoading()
    }).catch(err => {
      wx.showToast({
        title: err.mes,
        image: '../../static/images/icon_error.png'
      })
      wx.hideLoading()
    })

  },
  //获取预订的订单
  getbookList() {
    var that = this
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    const data = {
      token: wx.getStorageSync('access_token'),
      page: this.data.bookpage,
      order_type: 3
    }
    app.request(api.allOrder, 'GET', data).then(data => {
      let goods = data
      for (let index = 0; index < goods.length; index++) {
        goods[index].total = ((goods[index].total) / 100).toFixed(2)
        var nums = 0
        for (let i = 0; i < goods[index]['product'].length; i++) {
          const element = 'https://www.omeals.cn/sjtc/WWW/Uploads/desk/' + goods[index]['product'][i].desk_image;
          goods[index]['product'][i].main_images = element
          goods[index]['product'][i].price = ((goods[index]['product'][i].price) / 100).toFixed(2)
          nums += parseInt(goods[index]['product'][i].num)
          goods[index].nums = nums
        }
      }
      let goodsList = []
      if (that.data.bookpage != 0) {
        goodsList = that.data.bookList.concat(goods)
      } else {
        goodsList = goods
      }
      that.setData({
        bookList: goodsList
      })
      wx.hideLoading()
    }).catch(err => {
      wx.showToast({
        title: err.mes,
        image: '../../static/images/icon_error.png'
      })
      wx.hideLoading()
    })

  },
  /** 
   * 滑动切换tab 
   */
  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
    if(this.data.currentTab==0){
      this.getAllOrder()
    }else if(this.data.currentTab==1){
      this.getZiTiList()
    }else if(this.data.currentTab==2){
      this.getwuliuList()
    }else if(this.data.currentTab==3){
      this.getbookList()
    }
  },
  /** 
   * 点击tab切换 
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      if(this.data.currentTab==0){
        this.getAllOrder()
      }else if(this.data.currentTab==1){
        this.getZiTiList()
      }else if(this.data.currentTab==2){
        this.getwuliuList()
      }else if(this.data.currentTab==3){
        this.getbookList()
      }
    }
  },
  scrollbot(e) {
    let page = this.data.allpage;
    page++
    this.setData({
      allpage: page
    })
    this.getAllOrder()
  },
  scrollbot1(e) {
    let page = this.data.ztpage;
    page++
    this.setData({
      ztpage: page
    })
    this.getZiTiList()
  },
  scrollbot2(e) {
    let page = this.data.wlpage;
    page++
    this.setData({
      wlpage: page
    })
    this.getwuliuList()
  },
  scrollbot3(e) {
    let page = this.data.bookpage;
    page++
    this.setData({
      bookpage: page
    })
    this.getbookList()
  },
//取消已支付的订单
  cancelOrder(e){
    var id=e.currentTarget.dataset.id
    var num=e.currentTarget.dataset.num
    var that=this
    const options = {
      title: '取消订单',
      content: [`您确定取消订单${num}？`]
    }
    app.promisic(wx.ysShop.showModal)(options)
      .then(({
        confirm,
        cancel
      }) => {
        if (confirm && !cancel) {
          return app.request(api.orderCancel, 'post', {
              id:id
            }).then(data => {
              wx.showToast({
                title: '取消订单成功'
              })
              this.getAllOrder()
              this.getZiTiList()
              this.getwuliuList()
              this.getbookList()
            })
            .catch(err => wx.showToast({
              title: '取消订单失败'
            }))
        }
      })
  },
  
  //取消未支付成功的订单
  closeOrder(e) {
      var id=e.currentTarget.dataset.id
      var num=e.currentTarget.dataset.num
      var that=this
      const options = {
        title: '取消订单',
        content: [`您确定取消订单${num}？`]
      }
      app.promisic(wx.ysShop.showModal)(options)
        .then(({
          confirm,
          cancel
        }) => {
          if (confirm && !cancel) {
            return app.request(api.OrderCancelLation, 'post', {
                id:id
              }).then(data => {
                wx.showToast({
                  title: '取消订单成功'
                })
                this.getAllOrder()
                this.getZiTiList()
                this.getwuliuList()
                this.getbookList()
              })
              .catch(err => wx.showToast({
                title: '取消订单失败'
              }))
          }
        })
  
    },
    //永久删除订单
    orderAbrogate(e){
      var id=e.currentTarget.dataset.id
      var num=e.currentTarget.dataset.num
      var that=this
      const options = {
        title: '取消订单',
        content: [`您确定删除订单${num}？`]
      }
      app.promisic(wx.ysShop.showModal)(options)
        .then(({
          confirm,
          cancel
        }) => {
          if (confirm && !cancel) {
            return app.request(api.orderAbrogate, 'post', {
                id:id
              }).then(data => {
                wx.showToast({
                  title: '删除订单成功'
                })
                this.getAllOrder()
                this.getZiTiList()
                this.getwuliuList()
                this.getbookList()
              })
              .catch(err => wx.showToast({
                title: '删除订单失败'
              }))
          }
        })
    },
    //立即支付
    buyNow(e){
      var id=e.currentTarget.dataset.id
      var type=e.currentTarget.dataset.type
      var status=e.currentTarget.dataset.status
      wx.navigateTo({
        url: `/pages/my/order/orderDetail/orderDetail?id=${id}&status=${status}&type=${type}`
      })
    },
    //已经到店
    goarrival(e){
      var id=e.currentTarget.dataset.id
      var that=this
      const options = {
        title: '取消订单',
        content: [`您确定已到店？`]
      }
      app.promisic(wx.ysShop.showModal)(options)
        .then(({
          confirm,
          cancel
        }) => {
          if (confirm && !cancel) {
            return app.request(api.orderArrival, 'post', {
                id:id
              }).then(data => {
                wx.showToast({
                  title: '已到店'
                })
                this.getAllOrder()
                this.getZiTiList()
                this.getwuliuList()
                this.getbookList()
              })
              .catch(err => wx.showToast({
                title: err.mes,
                icon:'none'
              }))
          }
        })
    },
    //确认收货
    recOrder(e) {
      var that=this
      const orderId=e.currentTarget.dataset.id
      const data={
        id:orderId,
        token : wx.getStorageSync('access_token'),
      }
          let modalOptions = {
            title: '确认',
            content: ['您确定已经收到货品？']
          }
          app.promisic(wx.ysShop.showModal)(modalOptions)
            .then(({ confirm, cancel }) => {
              // ToDo 请求后台接口，实现 确认收货
              if (confirm && !cancel) {
             app.request(api.orderReceipt,'post',data).then(data=>{
              wx.showToast({
                title: '确认成功',
              })
              this.getAllOrder()
              this.getZiTiList()
              this.getwuliuList()
              this.getbookList()
             }).catch(err=>{
              wx.showToast({
                title: err.mes,
                image:'../../static/images/icon_error.png'
              })
             }     
             )
              }
            })
        },
        //跳转到物流页面
        goLogistics(e){
         let orderId = e.currentTarget.dataset.id
         wx.navigateTo({
          url: `/pages/my/order/logistics/logistics?orderId=${orderId}`
        })
        },
        //跳转到待评价
        goAssess(e){
          let orderId = e.currentTarget.dataset.id
          var type=e.currentTarget.dataset.type
          let orderInfo=JSON.stringify(e.currentTarget.dataset.info[0])
          wx.navigateTo({
            url: `/pages/my/order/assess/assess?orderId=${orderId}&orderInfo=${orderInfo}&type=${type}`,
          })
        }
})