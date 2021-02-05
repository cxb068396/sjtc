// pages/signin/signin.js
var api = require('../../config/api');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ishsow: true,
    iShsow: false,
    listdata: ''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checksession()
    // var that = this;
    // //     //查看是否授权
    // wx.getSetting({
    //   success: function (res) {
    //     if (res.authSetting['scope.userInfo']) {

    //       wx.switchTab({
    //         url: '/pages/index/index'
    //       })
    //     } else {
    //       //用户没有授权
    //       console.log("用户没有授权");
    //       that.setData({
    //         iShsow: false,
    //         ishsow: true

    //       })

    //     }
    //   }
    // });

  },
  bindGetUserInfo: function (res) {
    if (res.detail.errMsg !== 'getUserInfo:ok') {
      if (res.detail.errMsg === 'getUserInfo:fail auth deny') {
        return false
      }
      wx.showToast({
        title: '微信登录失败',
      })
      return false
    }
    if (res.detail.userInfo) {
      //用户按了允许授权按钮
      var that = this;
      //  获取用户的头像和昵称
      wx.getUserInfo({
        success: function (res) {
          var avatarUrl = 'userInfo.avatarUrl';
          var nickName = 'userInfo.nickName';
          that.setData({
            [avatarUrl]: res.userInfo.avatarUrl,
            [nickName]: res.userInfo.nickName,  //011zczec0nlmuz1a8Wcc0qdzec0zczeL
            isShow: true,
            isShown: false
          });
        // console.log('getUserInfo',res)
          var date = res;
          wx.login({
            success: res => {
              console.log('logincode'+res.code)
              // 获取到用户的 code 之后：res.code
              // console.log("用户的code:" + res.code);
              // 请求自己后台获取用户openid       
              if (res.code) {
                wx.request({
                  url: api.wxChatLogin,
                  method: 'POST',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  data: {
                    code: res.code,
                    date: JSON.stringify(date)
                  },
                  success: function (res_user) {
                    console.log('res_user',res_user)
                    app.$event.notify('token',res_user.data.token)
                    var access_token = res_user.data.token
                    var usrename = res_user.data.username
                    var avatar = res_user.data.avatar
                    var sex =res_user.data.sex
                    var balance=(res_user.data.balance/100).toFixed(2)

                    wx.setStorageSync("usrename", usrename)
                    wx.setStorageSync("avatar", avatar)
                    wx.setStorageSync("sex", sex)
                    wx.setStorageSync('balance', balance)
                    wx.setStorageSync("access_token", access_token)
                    that.getnewCou()
                    wx.switchTab({
                      url: '/pages/index/index'
                    })
                  },
                  fail: function () {
                    // console.log('获取授权信息失败')
                  }
                })
              } else {

                console.log('登录失败');
              }       
            }
          });
        }
      })
   }
  },
//首次注册获取新人优惠券

   //获取新人优惠券
   getnewCou() {
    const data={
      token:wx.getStorageSync('access_token')
    }
    app.request(api.getNewCoupon, 'GET',data)
      .then(data => {
  
      })
      .catch(err => {
        console.log(err);
      })
  },

//检测用户的code是否过期
checksession:function(){
  wx.checkSession({
    success: (res) => {},
    fail:(res)=>{
      wx.login({
        success: res => {
          console.log(res)   
          if (res.code) {
            wx.request({
              url: api.wxChatLogin,
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              data: {
                code: res.code,
                date: JSON.stringify(date)
              },
              success: function (res_user) {
                var access_token = res_user.data.token
                var usrename = res_user.data.username
                var avatar = res_user.data.avatar
                var sex =res_user.data.sex
                var balance=res_user.data.balance
                wx.setStorageSync("usrename", usrename)
                wx.setStorageSync("avatar", avatar)
                wx.setStorageSync("access_token", access_token)
                wx.setStorageSync("sex", sex)
                wx.setStorageSync('balance', balance)
                wx.switchTab({
                  url: '/pages/index/index',
                })
              },
              fail: function () {
                // console.log('获取授权信息失败')
              }
            })
          } else {

            console.log('登录失败');
          }       
        }
      });
    }
  })
},

  tiindex: function () {
  wx.navigateBack({
    delta: 1,
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }




})