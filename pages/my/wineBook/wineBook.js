// pages/my/wineBook/wineBook.js
var api = require('../../../config/api')
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //日期
    timeList: [],
    //可预约天数
    yyDay: 30,
    //是否显示
    timeShow: false,
    //预约时间段
    hourList: [{
        hour: "10:00",
        n: 10,
        isShow: true
      },
      {
        hour: "11:00",
        n: 11,
        isShow: true
      },
      {
        hour: "12:00",
        n: 12,
        isShow: true
      },
      {
        hour: "13:00",
        n: 13,
        isShow: true
      },
      {
        hour: "14:00",
        n: 14,
        isShow: true
      },
      {
        hour: "15:00",
        n: 15,
        isShow: true
      },
      {
        hour: "16:00",
        n: 16,
        isShow: true
      },
      {
        hour: "17:00",
        n: 17,
        isShow: true
      },

    ],
    //预约时间
    serviceNeedTime: '',
    //选择时间
    chooseHour: "",
    //选择日期
    chooseTime: "",
    hourIndex: -1,
    wechatPay: true, //控制走的是微信支付或者余额支付
    pay_type: 1, //支付方式
    balance: '', //余额
    showPayPwdInput: false, //是否展示密码输入层
    pwdVal: '', //输入的密码
    payFocus: true, //文本框焦点
    id: '', //获取坐位id
    max_num: '', //最大人数,
    mobile: '', //手机号
    num: '', //最终输入的人数，
    reserve_date: '', //到店时间
    arrival_time: '', //预约时间
    order_id: '', //余额生成的订单id
    price:''
  },
  //获取人数
  inputnum(e) {
    console.log(e.detail.value)
    var num = e.detail.value
    this.setData({
      num: num
    })
    if (num > this.data.max_num) {
      wx.showToast({
        title: '超出人数限制',
        icon: 'none'
      })
      this.setData({
        num: this.data.max_num
      })
    }
  },
  //获取电话
  inputMobile(e) {
    console.log(e.detail.value)
    var mobile = e.detail.value
    this.setData({
      mobile: mobile
    })
  },
  //弹出按钮
  showTimeModel: function () {
    this.setData({
      timeShow: !this.data.timeShow,
      chooseTime: this.data.timeList[0].date,
    });
  },
  //点击外部取消
  modelCancel: function () {
    this.setData({
      timeShow: !this.data.timeShow,
      chooseTime: this.data.timeList[0].date,
    });
  },
  //日期选择
  timeClick: function (e) {
    //非今天-不判断超过当前时间点(所有时间点都可选择)
    if (e.currentTarget.dataset.index != 0) {
      var list = this.data.hourList;
      for (var i = 0; i < list.length; i++) {
        list[i].isShow = true;
      }
      this.setData({
        hourList: list
      })
    } else {
      //今天-过时不可预约
      var hour = new Date().getHours();
      for (var i = 0; i < this.data.hourList.length; i++) {
        var list = this.data.hourList;
        if (this.data.hourList[i].n <= hour) {
          list[i].isShow = false;
          this.setData({
            hourList: list
          })
        }
      }
    }
    this.setData({
      currentTab: e.currentTarget.dataset.index,
      chooseTime: this.data.timeList[e.currentTarget.dataset.index].date,
      serviceNeedTime: '',
      chooseHour: "",
      hourIndex: -1
    });
    console.log(this.data.chooseTime)
  },
  // 时间选择
  hourClick: function (e) {
    var that = this;
    // 时间不可选择
    if (!e.currentTarget.dataset.isshow) {
      return false;
    }
    this.setData({
      hourIndex: e.currentTarget.dataset.index,
      chooseHour: this.data.hourList[e.currentTarget.dataset.index].hour,

    });
    var chooseTime = new Date().getFullYear() + "/" + (this.data.chooseTime ? this.data.chooseTime : new Date().getMonth() + 1 + "/" + new Date().getDate()) + " " + this.data.chooseHour + ':00'
    this.setData({
      serviceNeedTime: chooseTime,
      reserve_date: new Date().getFullYear() + "/" + (this.data.chooseTime ? this.data.chooseTime : new Date().getMonth() + 1 + "/" + new Date().getDate()),
      arrival_time: this.data.chooseHour + ':00'
    })
    console.log(chooseTime)
  },
  //获得坐位的信息
  getDeskInfo() {
    var that = this
    const data = {
      id: that.data.id,
      token: wx.getStorageSync('access_token')
    }
    app.request(api.wineDesk, 'GET', data).then(data => {
      wx.setStorageSync('balance', (data.balance/100).toFixed(2))
      this.setData({
        max_num: data.max_num,
        mobile: data.mobile
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      id: options.id,
      price:options.price
    })
    this.getDeskInfo()
    Date.prototype.Format = function (format) {
      var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
      }
      if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      }
      for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
          format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
      }
      return format;
    }
    Date.prototype.DateAdd = function (interval, number) {
      number = parseInt(number);
      var date = new Date(this.getTime());
      switch (interval) {
        case "y":
          date.setFullYear(this.getFullYear() + number);
          break;
        case "m":
          date.setMonth(this.getMonth() + number);
          break;
        case "d":
          date.setDate(this.getDate() + number);
          break;
        case "w":
          date.setDate(this.getDate() + 7 * number);
          break;
        case "h":
          date.setHours(this.getHours() + number);
          break;
        case "n":
          date.setMinutes(this.getMinutes() + number);
          break;
        case "s":
          date.setSeconds(this.getSeconds() + number);
          break;
        case "l":
          date.setMilliseconds(this.getMilliseconds() + number);
          break;
      }
      return date;
    }



    var dateList = [];
    var now = new Date();
    for (var i = 0; i < this.data.yyDay; i++) {
      var d = {};
      var day = new Date().DateAdd('d', i).getDay();
      if (day == 1) {
        var w = "周一"
      }
      if (day == 2) {
        var w = "周二"
      }
      if (day == 3) {
        var w = "周三"
      }
      if (day == 4) {
        var w = "周四"
      }
      if (day == 5) {
        var w = "周五"
      }
      if (day == 6) {
        var w = "周六"
      }
      if (day == 0) {
        var w = "周日"
      }
      d.name = w;
      d.date = new Date().DateAdd('d', i).Format("MM/dd");
      dateList.push(d)
    }
    this.setData({
      timeList: dateList
    });
    //初始化判断
    //当前时间
    var hour = new Date().getHours();

    for (var i = 0; i < this.data.hourList.length; i++) {
      var list = this.data.hourList;
      //过时不可选
      if (this.data.hourList[i].n <= hour) {
        list[i].isShow = false;
        this.setData({
          hourList: list
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
      if(this.data.price>this.data.balance){
        wx.navigateTo({
          url: '/pages/my/member/member',
        })
      }
      this.setData({
        pay_type: 2
      })

    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      balance: wx.getStorageSync('balance') || 0
    })
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
  onShareAppMessage: function () {},
  //立即预订按钮
  //判定人数，预约时间，预约手机号
  //选择支付方式，如果是微信直接调用requsetment，
  //如果是余额方式，判断是否够支付，不够先充值，够了，然后走余额支付方式
  bookConfirm() {
    if (this.data.num == '') {
      wx.showToast({
        title: '填写人数',
        icon: 'none'
      })
      return false
    }
    if (this.data.mobile == '') {
      wx.showToast({
        title: '号码不能为空',
        icon: 'none'
      })
      return false
    }
    if (this.data.mobile.trim().length != 11 || !/^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/.test(this.data.mobile)) {
      wx.showToast({
        title: '号码不正确',
        icon: 'none'
      })
    }
    if (this.data.serviceNeedTime == '') {
      wx.showToast({
        title: '选择预约时间',
        icon: 'none'
      })
      return false
    }
    var that = this
    const data = {
      token: wx.getStorageSync('access_token'),
      id: this.data.id,
      num: this.data.num,
      reserve_date: this.data.reserve_date,
      arrival_time: this.data.arrival_time,
      mobile: this.data.mobile,
      pay_type: this.data.pay_type
    }

    app.request(api.wineOrder, 'GET', data).then(data => {
      var data={
        pay_type:data.pay_type,
        id:data.id
      }
      app.request(api.OrderPay,'GET',data).then(data=>{
        if (data.pay_type == 1) {
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
                wx.showToast({
                  title: '支付成功！',
                  icon: 'success',
                })
              that.setData({
                num:'',
                serviceNeedTime:'',
                mobile:''
              })
  
              },
              fail(res) {
                console.log(res)
                wx.showToast({
                  title: '支付失败',
                  image: '../../static/images/icon_error.png'
                })
                that.setData({
                  num:'',
                  serviceNeedTime:'',
                  mobile:''
                })
              },
              complete:function(){
                wx.navigateBack({
                  delta: 1,
                })
              }
            })
          }
        } else if (data.pay_type == 2) {
          that.setData({
            showPayPwdInput: true,
            payFocus: true,
            order_id: data.id
          });
        }
      })
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
  //忘记密码
  goNote() {
    wx.navigateTo({
      url: '/pages/my/person/note/note',
    })
  },
  /**
   * 输入密码监听
   */
  inputPwd: function (e) {
    var that = this
    this.setData({
      pwdVal: e.detail.value
    });

    if (e.detail.value.length >= 6) {
      var id = this.data.order_id
      var token = wx.getStorageSync('access_token')
      var password = this.data.pwdVal
      var that = this
      const data = {
        id,
        token,
        password
      }
      app.request(api.YuePay, 'GET', data).then(data => {
        that.hidePayLayer()
        that.setData({
          num:'',
          serviceNeedTime:'',
          mobile:''
        })
        wx.showToast({
          title: '支付成功',
        })
        wx.navigateBack({
          delta: 1,
        })
      }).catch(err => {
        wx.showToast({
          title: err.mes,
          image: '../../static/images/icon_error.png'
        })
        that.setData({
          num:'',
          serviceNeedTime:'',
          mobile:''
        })
        that.hidePayLayer()
      })

    }
  },
})