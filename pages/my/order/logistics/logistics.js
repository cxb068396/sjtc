// pages/userhome/address/address.js
//第一步，先获取物流信息的起点和终点位置；
// 第二步，通过腾讯位置服务将起始点的位置进行解析获取，起始点的坐标；
//第三步：将起始点的坐标放入腾讯位置服务，进行路线规划(如果有必要，起点位置还需要进行判断是都是最新的位置，更改起始点，重新进行路线规划)
//物流信息需要3个状态进行区分，一个是终点的物流状态，一个是当下的物流状态，还有一个是已经过去的物流状态，以便进行物流信息的渲染

var api = require('../../../../config/api.js');
var util = require('../../../../utils/util.js')
var app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../../../lib/qqmap/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'OVIBZ-EYEKS-5C6OX-6VK37-RAUGF-A2FJA' // 必填
});
Page({
  data: {
    position: 'fixed',
    height: 500,
    isshow: false,
    scale: 5,
    markers: [], //标记地图上起始点和终点的图标
    orderId: '', //获取订单的id
    startAddress: '浙江省杭州市西湖区浙商财富中心4幢1119室', //获取起点位置
    endAddress: '', // 终点位置
    startLocation: '', //起点坐标
    endLocation: '', //终点坐标
    logistics: '', //用于保存物流信息
    orderId: '', //用于保存订单的id
    company_name: '', //物流的名字
    logisticsList: [

    ], // 获取物流信息列表
    logList: [], //运输中的物流信息
    waybill_status: '', //物流状态
    waybill_num: '', //快递单号
    shopImg: '',
    courier: {}, //快递员的信息
    isNotEmpty: false,
  },
  //点击按钮将隐藏的部分显示出来
  getMore: function () {
    this.setData({
      position: 'fixed',
      height: '',
      isshow: false
    })
  },

  //获取快递员的信息
  getCourier(text) {
    var data = text.filter(function (item) {
      return item.ActionMsg.match('派送' || '派件')
    })
    console.log(data)
    if (data.length > 0) {
      let testmsg = data[0].ActionMsg
      let index = testmsg.indexOf('：') //获取第一个：的位置
      let index2 = testmsg.indexOf(',', index + 1) //获取第二个,的位置
      let index3 = testmsg.indexOf(',') //获取，的位置
      let index4 = testmsg.indexOf('给') //获取给的位置
      var name = testmsg.slice(index4 + 1, index3) //获取name
      var phone = testmsg.slice(index + 1, index2) //获取phone
      let courier = {} //创建一个快递员对象
      courier.name = name;
      courier.phone = phone
      courier.pic = '../../../static/images/courise.png'
      this.setData({
        courier: courier,
        isNotEmpty: true
      })
    } else {
      this.setData({
        isEmpty: fasle
      })
    }
  },
  onLoad: function (options) {
    // this.getCourier(this.data.test) //测试数据接口
    this.setData({
      orderId: options.orderId
    })
    this.getlogistics();
  },

  //先从后端接口获取物流信息
  getlogistics(complete = () => {}) {
    //ToDo 通过订单id获取物流信息，
    //分别获取起点位置和终点位置 startAddress endAddress
    var that = this;
    const data = {
      token: wx.getStorageSync('access_token'),
      id: this.data.orderId
    }
    app.request(api.orderLookwl, 'post', data, {}, complete).then(data => {

      //获取物流信息并进行json解
      that.setData({
        company_name: data.company_name,
        endAddress: data.address.province + data.address.city + data.address.county + data.address.area,
        shopImg: 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + data.main_images,
        waybill_num: data.waybill_num.slice(0, data.waybill_num.indexOf('_')) //截取物流的单号
      })
      that.getStartLocation();
      let list = JSON.parse(data.detail) //将物流信息进行json解析
      //console.log(list)
      //如果有物流信息
      if (list.length > 0) {

        //判断初始位置start
        // var newArr = list.filter(function (item) {
        //   return item.ActionType == 200001 && item.ActionMsg.match('【')
        // })
        // if(newArr.length>0){
        //   console.log('获取所有200001的资料', newArr)
        //   var startInfo = newArr[0]
        //   let testmsg = startInfo.ActionMsg
        //   let index = testmsg.indexOf('【') //获取第一个[的位置
        //   let index2 = testmsg.indexOf('】') //获取第二个]的位置
        //   let startAddress = testmsg.slice(index + 1, index2) //获取初始位置
        //   console.log(startAddress)
        //   this.setData({
        //     startAddress
        //   })
        // }
         //判断初始位置end

        var logistics = list //将物流信息数组列表倒叙
        for (let i = 0; i < logistics.length; i++) {
          logistics[i]['day'] = util.formatTime(new Date(parseInt(logistics[i]['ActionTime']) * 1000)).slice(5, 10) //获取日期
          logistics[i]['time'] = util.formatTime(new Date(parseInt(logistics[i]['ActionTime']) * 1000)).slice(11, 16) //获取时间

        }
        console.log(list)
        that.setData({
          logisticsList: logistics,
          isshow: true
        })

        if (list.length >= 3) {
          let loglist = logistics.slice(1, -1) //获取物流运输中的信息(排除起点坐标和终点坐标)
          that.setData({
            logList: loglist
          })
        }
        that.getCourier(this.data.logisticsList) //获取物流信息中快递员的信息

      } else {
        wx.showToast({
          title: '暂无物流信息',
          icon: 'none'
        })
      }
    }).catch(err => {
      if (err.mes) {
        wx.showLoading({
          title: '暂无信息',
          duration: 1000
        })
      }
    })
  },
  //将起点和终点位置先进行坐标的转换
  getStartLocation() {
    var that = this;
    var startAddress = that.data.startAddress
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: startAddress, //地址参数，将起点地址和终点地址分别进行解析
      success: function (res) { //成功后的回调
        var start = res.result.location.lat + "," + res.result.location.lng + "" //拼接起点坐标字符串
        that.setData({
          startLocation: start
        })
        that.getEndlocation();
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        //console.log(res);
      }
    })
  },
  getEndlocation() {
    if (this.data.logisticsList.length < 1) {

      return false
    }
    var that = this;
    var endAddress = that.data.endAddress
    //调用地址解析接口
    qqmapsdk.geocoder({
      //获取表单传入地址
      address: endAddress, //地址参数，将起点地址和终点地址分别进行解析
      success: function (res) { //成功后的回调
        var end = res.result.location.lat + "," + res.result.location.lng + "" //拼接终点坐标字符串
        console.log(typeof (end))
        that.setData({
          endLocation: end,
        })
        console.log(that.data.endLocation)
        that.routerPlanning()
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        // console.log(res);
      }
    })
  },
  scalefuc(distance) {
    //  5级 ：200公里  6级 ：100公里  7级 ：50公里  8级 ：30公里  9级 ：20公里 10级 ：10公里 11级 ：5公里  12级 ：2公里  13级 ：1公里  14级 ：500米  15级 ：200米  16级 ：100米  17级 ：50米18级 ：25米
    if (distance >= 200000) {
      this.setData({
        scale: 5
      })
    } else if (distance >= 100000) {
      this.setData({
        scale: 6
      })
    } else if (distance >= 50000) {
      this.setData({
        scale: 7
      })
    } else if (distance >= 30000) {
      this.setData({
        scale: 8
      })
    } else if (distance >= 20000) {
      this.setData({
        scale: 9
      })
    } else if (distance >= 10000) {
      this.setData({
        scale: 10
      })
    } else if (distance >= 5000) {
      this.setData({
        scale: 11
      })
    } else if (distance >= 2000) {
      this.setData({
        scale: 12
      })
    } else if (distance >= 1000) {
      this.setData({
        scale: 13
      })
    } else if (distance >= 500) {
      this.setData({
        scale: 14
      })
    } else if (distance >= 200) {
      this.setData({
        scale: 15
      })
    } else if (distance >= 100) {
      this.setData({
        scale: 16
      })
    } else if (distance >= 50) {
      this.setData({
        scale: 17
      })
    } else {
      this.setData({
        scale: 18
      })
    }
  },
  // 将解析后的起点和终点坐标进行路线规划
  routerPlanning() {
    console.log('logisticsList', this.data.logisticsList)
    if (this.data.logisticsList.length < 1) {

      return false
    }
    // console.log(this.data.startLocation,this.data.endLocation)
    var that = this;
    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving', //可选值：'driving'（驾车）、'walking'（步行）、'bicycling'（骑行），不填默认：'driving',可不填
      //from参数不填默认当前地址
      from: that.data.startLocation, //起点的坐标 String
      to: that.data.endLocation, //终点的坐标 String
      success: function (res) {
        // console.log(res);
        var ret = res;
        var coors = ret.result.routes[0].polyline,
          pl = [];
        var distance = ret.result.routes[0].distance
        that.scalefuc(distance)
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({
            latitude: coors[i],
            longitude: coors[i + 1]
          })
        }
       console.log(pl)
        var len = pl.length
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        that.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#32CD32',
            width: 6
          }],
          markers: [{
              id: 0,
              latitude: pl[0].latitude,
              longitude: pl[0].longitude,
              // 起点图标
              iconPath: '../../../static/images/start1.png',
              width: 30,
              height: 40

            },
            {
              id: 1,
              latitude: pl[len - 1].latitude,
              longitude: pl[len - 1].longitude,
              // 终点图标
              iconPath: '../../../static/images/end.png',
              width: 30,
              height: 40
            },
       
          ]
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        //  console.log(res);
      }
    });
  },
  //拨打电话
  tel: function () {
    //从物流信息中获取快递员的信息
    wx.makePhoneCall({
      phoneNumber: this.data.courier.phone ? this.data.courier.phone : '', //仅为示例，并非真实的电话号码
      success: function (res) {
        console.log(res)
      }
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {

    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})