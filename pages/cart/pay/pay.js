// pages/cart/pay/pay.js
var api = require('../../../config/api')
var app = getApp()
var util = require('../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // showcancel: false,
    id: '',
    countdown: '',
    pay_type: '',
    showPayPwdInput: false, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = app.globalData.strs
    console.log(data)
    // let short = {}
    // short.expiration_time = data.expiration_time
    // short.order_num = data.order_num
    // short.remark = data.remark
    // debugger
    data.totalnum = 0
    for (let index = 0; index < data.product.length; index++) {
      const element = 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + data.product[index].main_images;
      data.product[index].main_images = element
      data.product[index].sell_price = (data.product[index].sell_price / 100).toFixed(2)
    }
    this.countDown(data.expiration_time)
    console.log(data)
    this.setData({
      address: data.address,
      expiration_time: data.expiration_time,
      create_time: data.create_time,
      id: data.id,
      order_num: data.order_num,
      carts: data.product,
      total: ((data.total) / 100).toFixed(2),
      remark: data.remark,
      totalnum: ((data.totalnum - data.total) / 100).toFixed(2),
      freight: ((data.freight) / 100).toFixed(2),
      pay_type: data.pay_type,
      discounts:(data.discounts/100).toFixed(2)
    })
  },

  //发起支付
  paymaney: function () {
    var that = this
    const data = {
      token: wx.getStorageSync('access_token'),
      pay_type: this.data.pay_type,
      id: this.data.id
    }
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
            setTimeout(() => {
              wx.redirectTo({
                url: `/pages/my/order/orderDetail/orderDetail?id=${that.data.id}&status=${2}`,
              })
            }, 2000)

          },
          fail(res) {
            console.log(res)
            wx.showToast({
              title: '支付失败',
              image: '../../static/images/icon_error.png'
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
              status: 7
            })
            clearInterval(timer)
          }
        }

      }, 1000)
    } else {
      this.setData({
        status: 7
      })
    }
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
  // 取消按钮
  cancelOrder() {
    const options = {
      title: '取消订单',
      content: [`您确定取消订单${this.data.order_num}？`]
    }
    app.promisic(wx.ysShop.showModal)(options)
      .then(({
        confirm,
        cancel
      }) => {
        if (confirm && !cancel) {
          return app.request(api.OrderCancelLation, 'post', {
              id: this.data.id
            }).then(data => {
              wx.showToast({
                title: '取消订单成功'
              })
              wx.navigateBack({
                delta: 2
              })
            })
            .catch(err => wx.showToast({
              title: '取消订单失败'
            }))
        }
      })

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
        var res = {
          order_num: data,
          total: that.data.total,
          name: that.data.carts[0]['title'],
          create_time: that.data.create_time
        }
        console.log(res)
        wx.redirectTo({
          url: '/pages/cart/transaction/transaction?orderInfo=' + JSON.stringify(res),
        })
      }).catch(err => {
        wx.showToast({
          title: err.mes,
          image: '../../static/images/icon_error.png'
        })
      })
    }
  },
  //忘记密码
  goNote() {
    wx.navigateTo({
      url: '/pages/my/person/note/note',
    })
  }
})