var api = require('../../../../config/api')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadMore: false, //显示隐藏的数据
    isShowBtn: true, //控制更多按钮的显示和隐藏
    wechatPay: true, //控制支付方式
    id: '',
    order_status: '',
    order_type: '',
    address: '',
    product: '',
    orderInfo: '',
    countdown: '',
    balance: '',
    pay_type: 1,
    re: '',
    showPayPwdInput: false, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
    total:''
  },
  //选择微信支付或者余额支付
  payWay(e) {
  console.log(e)
  var that=this
    if (e.currentTarget.dataset.way == 'wechat') {
      that.setData({
        wechatPay: !this.data.wechatPay,
        pay_type: 1
      })
    } else {
      that.setData({
        wechatPay: !this.data.wechatPay,
        pay_type: 2
      })
      if(that.data.total>that.data.balance){
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

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      order_status: options.status,
      order_type: options.type
    })

  },

  //获取详情
  getOrderDetail() {
    var that = this
    const data = {
      id: this.data.id
    }
    app.request(api.orderDetail, 'GET', data).then(data => {
      if (data.order_type == 1 || data.order_type == 2) {
        var address = data.address
        var order_status = data.order_status
        var product = data.product
        product.forEach(item => {
          if (item.main_images) {
            item.main_images = 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + item.main_images
          } else {
            item.desk_image = 'https://www.omeals.cn/sjtc/WWW/Uploads/desk/' + item.desk_image
          }
          item.price = (item.price / 100).toFixed(2)
        })
        data.original_price = (data.original_price / 100).toFixed(2)
        data.discounts = (data.discounts / 100).toFixed(2)
        data.freight = (data.freight / 100).toFixed(2)
        data.total = (data.total / 100).toFixed(2)
        if (data.order_status == 1) {
          this.countDown(data.expiration_time);
        }
        that.setData({
          address,
          order_status,
          product,
          orderInfo: data,
          re: data.re,
          total:data.total
        })
      } else if (data.order_type == 3) {
        data.original_price = (data.original_price / 100).toFixed(2)
        data.discounts = (data.discounts / 100).toFixed(2)
        data.freight = (data.freight / 100).toFixed(2)
        data.total = (data.total / 100).toFixed(2)
        data.product.desk_image = 'https://www.omeals.cn/sjtc/WWW/Uploads/desk/' + data.product.desk_image
        data.product.price = (data.product.price / 100).toFixed(2)
        if (data.order_status == 1) {
          this.countDown(data.expiration_time);
        }
        this.setData({
          orderInfo: data,
          re: data.re,
          total:data.total
        })
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
    this.setData({
      balance: wx.getStorageSync('balance')
    })
    this.getOrderDetail()
  },
  countDown(endTime) {
    let end = 0;
    if (endTime instanceof Date) {
      end = endTime.getTime()
    } else if (typeof endTime == 'string') {
      end = new Date(endTime.replace(/-/g, '/')).getTime()
    }
    const now = new Date().getTime()
    const diff = end - now
    let m = 0
    let s = 0
    if (end - now > 0) { // 离订单失效时间
      let num = diff / 1000 / 60
      m = parseInt(num)
      s = parseInt((num - m) * 60)
      if (s == 0 && m > 1) {
        m = m - 1
        s = 59
      }
      this.setData({
        countdown: `${('0' + m).slice(-2)}分${('0' + s).slice(-2)}秒`
      })
      const timer = setInterval(() => {
        if (s > 0) {
          s = s - 1
          this.setData({
            countdown: `${('0' + m).slice(-2)}分${('0' + s).slice(-2)}秒`
          })
        } else if (s == 0) {
          if (m > 0) {
            m = m - 1
            s = 59
            this.setData({
              countdown: `${('0' + m).slice(-2)}分${('0' + s).slice(-2)}秒`
            })
          } else if (m == 0) {
            this.setData({
              countdown: `${('0' + m).slice(-2)}分${('0' + s).slice(-2)}秒`
            })
            this.setData({
              status: 6
            })
            clearInterval(timer)
          }
        }

      }, 1000)
    } else {
      this.setData({
        status: 6
      })
    }
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

  //加载更多
  loadMore() {
    this.setData({
      loadMore: true,
      isShowBtn: false
    })
  },
  gotransaction() {
    wx.navigateTo({
      url: "/pages/cart/transaction/transaction",
    })
  },
  //取消未支付成功的订单
  cancelOrder(e) {
    var num = e.currentTarget.dataset.num
    var that = this
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
              id: that.data.id
            }).then(data => {
              wx.showToast({
                title: '取消订单成功'
              })
              that.getOrderDetail()
            })
            .catch(err => wx.showToast({
              title: '取消订单失败'
            }))
        }
      })

  },
    //永久删除订单
    orderAbrogate(e) {
      var num = e.currentTarget.dataset.num
      var that = this
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
                id: that.data.id
              }).then(data => {
                wx.showToast({
                  title: '删除订单成功'
                })
              wx.navigateBack({
                delta: 1,
              })
              })
              .catch(err => wx.showToast({
                title: '删除订单失败'
              }))
          }
        })
  
    },
  //发起支付
  goBuy() {
    var that = this
    const data = {
      token: wx.getStorageSync('access_token'),
      pay_type: this.data.pay_type,
      id: this.data.id
    }
    if (this.data.re == 1) {
      app.request(api.orderRepay, 'GET', data).then(data => {
        if (data.pay_type == 1) {
          var timestamps = data.pay.timeStamp
          var nonceStrs = data.pay.nonceStr
          var packages = data.pay.package
          var signTypes = data.pay.signType
          var paySigns = data.pay.paySign
          wx.requestPayment({
            timeStamp: timestamps,
            nonceStr: nonceStrs,
            package: packages,
            signType: signTypes,
            paySign: paySigns,
            success(res) {
              console.log(res)
              wx.showToast({
                title: '支付成功！',
                icon: 'success',
              })
            },
            fail(res) {
              console.log(res)
              wx.showToast({
                title: '支付失败',
                image: '../../../static/images/icon_error.png'
              })
            }
          })
        } else if (data.pay_type == 2) {
          that.setData({
            showPayPwdInput: true,
            payFocus: true,
            id: data.id
          });
        }
      })
    }
    if (this.data.re == 2) {
      app.request(api.OrderPay, 'GET', data).then(data => {
        if (data.pay_type == 1) {
          var timestamps = data.pay.timeStamp
          var nonceStrs = data.pay.nonceStr
          var packages = data.pay.package
          var signTypes = data.pay.signType
          var paySigns = data.pay.paySign
          wx.requestPayment({
            timeStamp: timestamps,
            nonceStr: nonceStrs,
            package: packages,
            signType: signTypes,
            paySign: paySigns,
            success(res) {
              console.log(res)
              wx.showToast({
                title: '支付成功！',
                icon: 'success',
              })
            },
            fail(res) {
              console.log(res)
              wx.showToast({
                title: '支付失败',
                image: '../../../static/images/icon_error.png'
              })
            }
          })
        } else if (data.pay_type == 2) {
          that.setData({
            showPayPwdInput: true,
            payFocus: true,
            id: data.id
          });
        }
      })
    }
  },
  /**
   * 隐藏支付密码输入层
   */
  hidePayLayer: function () {
    var val = this.data.pwdVal;
    this.setData({
      showPayPwdInput: false,
      payFocus: false,
      pwdVal: ''
    });

  },
  /**
   * 获取焦点
   */
  getFocus: function () {
    this.setData({
      payFocus: true
    });
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    this.setData({
      pwdVal: e.detail.value
    });

    if (e.detail.value.length >= 6) {
      var id = this.data.id
      var token = wx.getStorageSync('access_token')
      var password = this.data.pwdVal
      var that = this
      const data = {
        id,
        token,
        password
      }
      app.request(api.YuePay, 'GET', data).then(data => {
       that.getOrderDetail()
       that.hidePayLayer()
      }).catch(err => {
        wx.showToast({
          title: err.mes,
          image: '../../../static/images/icon_error.png'
        })
      })
    }
  },
  //忘记密码
  goNote() {
    wx.navigateTo({
      url: '/pages/my/person/note/note',
    })
  },
  //再次购买
  buyAgain(){
    var that=this
    let orderDetail=this.data.orderInfo
    const data={
      id:this.data.id
    }
    app.request(api.buyAgain,'GET',data).then(data=>{
      for (let i = 0; i < orderDetail['product'].length; i++) {
        orderDetail['product'][i]['id'] = data['products'][i]['pid']
        orderDetail['product'][i]['num'] = data['products'][i]['num']
      }
      wx.navigateTo({
        url: '/pages/cart/accounts/accounts?str=' + JSON.stringify(orderDetail) + '&page=detail'
      })
    }).catch(err=>{
      if (err.mes && err.mes == '商品不存在或者已经下架') {
        wx.showToast({
          title: '商品下架',
          image: '../../../static/images/icon_error.png'
        })
      }
    })
  },
  //对于已付款的单子进行取消
  orderCancel(e) {
    var num = e.currentTarget.dataset.num
    var that = this
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
              id: that.data.id
            }).then(data => {
              wx.showToast({
                title: '取消订单成功'
              })
              that.getOrderDetail()
            })
            .catch(err => wx.showToast({
              title: '取消订单失败'
            }))
        }
      })

  },
  //确认收货
  recOrder() {
    var that = this
    const options = {
      title: '取消订单',
      content: [`您确定已经收到货品？？`]
    }
    app.promisic(wx.ysShop.showModal)(options)
      .then(({
        confirm,
        cancel
      }) => {
        if (confirm && !cancel) {
          return app.request(api.orderCancel, 'post', {
              id: that.data.id
            }).then(data => {
              wx.showToast({
                title: '取消订单成功'
              })
              that.getOrderDetail()
            })
            .catch(err => wx.showToast({
              title: '取消订单失败'
            }))
        }
      })

  },
  //查看物流信息
  goLogistics(){
    var orderId=this.data.id
    wx.navigateTo({
      url: `/pages/my/order/logistics/logistics?orderId=${orderId}`
    })
  },
  //跳转到评价
    gotoAssess() {
      let product = this.data.product[0]
      let orderInfo = JSON.stringify(product)
      let type=this.data.order_type
      wx.navigateTo({
        url: '/pages/my/order/assess/assess?orderId=' + this.data.orderId + '&orderInfo=' + orderInfo+'&type='+type
      })
    },
})