var address = require("../mock.js")
var api=require('../../../../config/api')
var app=getApp()

Page({
  /**
   * 控件当前显示的数据
   * provinces:所有省份
   * citys 选择省对应的所有市,
   * areas 选择市对应的所有区
   * areaInfo：点击确定时选择的省市县结果
   * animationAddressMenu：动画
   * addressMenuIsShow：是否可见
   */
  data: {
    str: {
    },
    animationAddressMenu: {},
    addressMenuIsShow: false,
    value: [0, 0, 0],
    provinces: [],
    citys: [],
    areas: [],
    province:0, //省Id
    city:0,  //市Id
    county:0,  //区Id
    address:'',// 详细地址
    areaInfo: '',
    name: '',
    mobile: '',
    is_default: 0,
    from:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  //设置是否为默认地址
  bindIsDefault: function(e) {
    var that = this
    if (e.detail.value == "") {
      that.setData({
        is_default: 0
      })
    } else {
      that.setData({
        is_default: 1
      })
    }
  },
  bindinputName: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindinputMobile: function(e) {
   this.setData({
     mobile:e.detail.value
   })
  },
  bindinputAddress: function(e) {
   this.setData({
     address: e.detail.value
   })
  },
  //获取省市区的信息
  // getRegionList() {
  //   var that=this
  //   wx.request({
  //     url:'https://www.omeals.cn/home/Address/getcity.html', 
  //     success: function (res) {
  //       console.log(res.data.mes)
  //         if(res.data.code==true){
  //           that.setData({
  //             address:res.data.mes
  //           })
  //         }
  //     }
  //   })

  // },
  onLoad: function(options) {
    // this.getRegionList();
    // 默认联动显示北京
    var id = address.provinces[0].id
    this.setData({
      provinces: address.provinces,
      citys: address.citys[id],
      areas: address.areas[address.citys[id][0].id],
      from:options.from
    })
  },
  // 点击所在地区弹出选择框
  select: function(e) {
    // 如果已经显示，不在执行显示动画
    if (this.data.addressMenuIsShow) {
      return false
    } else {
      // 执行显示动画
      this.startAddressAnimation(true)
    }
  },
  // 执行动画
  startAddressAnimation: function(isShow) {
    if (isShow) {
      // vh是用来表示尺寸的单位，高度全屏是100vh
      this.animation.translateY(0 + 'vh').step()
    } else {
      this.animation.translateY(40 + 'vh').step()
    }
    this.setData({
      animationAddressMenu: this.animation.export(),
      addressMenuIsShow: isShow,
    })
  },
  // 点击地区选择取消按钮
  cityCancel: function(e) {
    this.startAddressAnimation(false)
  },
  // 点击地区选择确定按钮
  citySure: function(e) {
    var that = this
    var city = that.data.city
    var value = that.data.value
    this.startAddressAnimation(false)
    // 将选择的城市信息显示到输入框
    var areaInfo = that.data.provinces[value[0]].name + ' ' + that.data.citys[value[1]].name + ' ' + that.data.areas[value[2]].name
    var province= that.data.provinces[value[0]].id
     var city= that.data.citys[value[1]].id
    var county= that.data.areas[value[2]].id
    that.setData({
      areaInfo: areaInfo,
      province: province,
      city: city,
      county: county

    })
    // console.log(that.data.areaInfo)
    // console.log(that.data.county,that.data.city,that.data.province)
  },
  // 处理省市县联动逻辑
  cityChange: function(e) {
    var value = e.detail.value
    var provinces = this.data.provinces
    var citys = this.data.citys
    var areas = this.data.areas
    var provinceNum = value[0]
    var cityNum = value[1]
    var countyNum = value[2]
    // 如果省份选择项和之前不一样，表示滑动了省份，此时市默认是省的第一组数据，
    if (this.data.value[0] != provinceNum) {
      var id = provinces[provinceNum].id
      this.setData({
        value: [provinceNum, 0, 0],
        citys: address.citys[id],
        areas: address.areas[address.citys[id][0].id],
      })
    } else if (this.data.value[1] != cityNum) {
      // 滑动选择了第二项数据，即市，此时区显示省市对应的第一组数据
      var id = citys[cityNum].id
      this.setData({
        value: [provinceNum, cityNum, 0],
        areas: address.areas[citys[cityNum].id],
      })
    } else {
      // 滑动选择了区
      this.setData({
        value: [provinceNum, cityNum, countyNum]
      })
    }
  },
  onShow: function() {
    var animation = wx.createAnimation({
      duration: 500,
      timingFunction: 'linear',
    })
    this.animation = animation
  },

  //保存地址
  toeaddres: function() {
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (this.data.name == "") {
       wx.showToast({   //wx:
        title: '输入姓名',
        image: "../../../static/images/icon_error.png"
      })
      return false
    }
    if(this.data.mobile==''){
      wx.showToast({
        title: '输入手机号码',
        image: "../../../static/images/icon_error.png"
      })
      return false
    }
    if (this.data.mobile.length<11) {
      wx.showToast({
        title: '号码长度有误',
        image: "../../../static/images/icon_error.png"
      })
      return false
    }
    if (!myreg.test(this.data.mobile)) {
      wx.showToast({
        title: '号码错误',
        image: "../../../static/images/icon_error.png"
      })
      return false
    }
    if (this.data.province == 0 || this.data.city == 0 || this.data.county==0){
      wx.showToast({
        title: '所在位置信息不全',
        image: "../../../static/images/icon_error.png"
      })
      return false
    }
    if(this.data.address==''){
      wx.showToast({
        title: '填写详细地址',
        image: "../../../static/images/icon_error.png"
      })
      return false
    }
    var that=this
    let token = wx.getStorageSync('access_token')
    wx.request({
      url: api.addAddress,
      data:{
        token:token,
        name:that.data.name,
        mobile:that.data.mobile,
        province:that.data.province,
        city:that.data.city,
        county:that.data.county,
        area:that.data.address,
        is_default:that.data.is_default
      },
      method: 'post',
      header: { "content-type": "application/x-www-form-urlencoded" },
      success:function(res){
      if(res.data.code==true){
        wx.showToast({
          title: res.data.mes,
          icon: "none",
          duration: 1000,
          success:function(){
            wx.navigateBack({
              delta: 1,
            })
          }
        })
      } else{
        wx.showToast({
          title: res.data.mes,
          icon: "none",
          duration: 1000
        })
      }
      }
    })
 
   
  }



})