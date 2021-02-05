var app=getApp()
var api=require('../../../../config/api')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userStars: [
      "../../../static/images/start_select.png",
      "../../../static/images/start_select.png",
      "../../../static/images/start_select.png",
      "../../../static/images/start_select.png",
      "../../../static/images/start_select.png"
    ],
    good_grade: 10, // 商品评分默认是5分
    good_message: '',
    packaging: 0,
    speed: 0,
    service: 0,
    video: '',
    count: 9,
    orderPic: '', //图片的的路径
    imgPic: [],
    pic: [],
    picId: '',
    isshow: true,
    flag: [0, 0, 0],
    startext: [0, 0, 0],
    stardata: [1, 2, 3, 4, 5],
    order_type:''
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let orderInfo = JSON.parse(options.orderInfo)
    this.setData({
      id: options.orderId,
      orderPic: orderInfo.main_images,
      order_type:options.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('prew_video');

  },

  //物流服务的评价
  changeColor: function (e) {
    console.log(e)
    var index = e.currentTarget.dataset.index;
    var num = e.currentTarget.dataset.no;
    var a = 'flag[' + index + ']';
    var b = 'startext[' + index + ']';
    var that = this;
    if (num == 1) {
      that.setData({
        [a]: 1,
        [b]: 1
      });
    } else if (num == 2) {
      that.setData({
        [a]: 2,
        [b]: 2
      });
    } else if (num == 3) {
      that.setData({
        [a]: 3,
        [b]: 3
      });
    } else if (num == 4) {
      that.setData({
        [a]: 4,
        [b]: 4
      });
    } else if (num == 5) {
      that.setData({
        [a]: 5,
        [b]: 5
      });
    }
    that.setData({
      packaging: that.data.startext[0] * 2,
      speed: that.data.startext[1] * 2,
      service: that.data.startext[2] * 2,
    })
  },
  // 商品评分的点击事件
  starTap: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars; // 暂存星星数组
    var len = tempUserStars.length; // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = "../../../static/images/start_select.png";
        that.setData({
          good_grade: (i + 1) * 2,
        })
      } else { // 其他是空心
        tempUserStars[i] = "../../../static/images/start.png"
      }
    }
    // 重新赋值就可以显示了
    that.setData({
      userStars: tempUserStars
    })
  },
  // 文本框
  getDataBindTap: function (e) {
    var value = e.detail.value
    var that = this;
    that.setData({
      good_message: value,
    })
  },


  // 为评论添加视频
  addVideo() {
    var that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      compressed: true,
      camera: 'back',
      success(res) {
        console.log(res.tempFilePath)
        that.setData({
          video: res.tempFilePath,
          pic: []
        })
      }
    })
  },


  // 为评论添加图片
  addImage(e) {
    const index = e.currentTarget.dataset.index
    const options = {
      count: this.data.count - this.data.imgPic.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
    }
    var that = this
    wx.chooseImage({
      ...options,
      success: function (res) {
        //console.log(res.tempFilePaths)
        var tempFilePaths = res.tempFilePaths
        that.setData({
          imgPic: that.data.imgPic.concat(tempFilePaths),
          pic: []
        })
      },
      fail: function (err) {},
      complete: (res) => {},
    })
  },

  //删除图片
  deleteImg(e) {
    console.log(e)
    var currIndex = e.currentTarget.dataset.index
    var imgpic = this.data.imgPic.splice(currIndex, currIndex + 1)
    this.setData({
      imgPic: this.data.imgPic,
      pic: []
    })
  },

  //删除视频
  deleteVideo() {
    this.setData({
      video: '',
      pic: []
    })
  },
    //不上传图片
    upload() {
      wx. showLoading({
        title: '上传中...',
      })
      var that = this
      console.log(this.data.good_message)
       if(this.data.order_type==2){
        var data = {
          token: wx.getStorageSync('access_token'),
          id: this.data.id,
          good_grade: this.data.good_grade ,
          good_message: this.data.good_message,
          packaging: this.data.packaging ,
          speed: this.data.speed,
          service: this.data.service,
        } 
       } else{
        var data = {
          token: wx.getStorageSync('access_token'),
          id: this.data.id,
          good_grade: this.data.good_grade ,
          good_message: this.data.good_message,
        } 
       }
 
 
      app.request('https://www.omeals.cn/sjtc/WWW/home/order/evaluate.html', 'post', data).then(data => {
        wx.hideLoading({
          success: (res) => {
            wx.navigateBack({
              delta: 1,
            })
          },
        })
      })
    },

      //上传单张或者多张图片
  imagesUpload(name) {
    wx.showLoading({
      title: '上传中...',
    })
    var that = this
    let picId = that.data.picId
    var picList=this.data.pic.slice(1)
    for (let i = 0; i < picList.length; i++) {
      var imgUrl = picList[i]
      wx.uploadFile({
        //上传图片的网路请求地址
        url: 'https://www.omeals.cn/sjtc/WWW/home/order/up_vp.html',
        //选择
        filePath: imgUrl,
        name: name,
        header: {
          'content-type': 'multipart/form-data',
        },
        formData: {
          id: picId
        },
        success: function (res) {
          wx.hideLoading()
          var res = JSON.parse(res.data)
          console.log('单张图片', res)
          if (res.code == true) {
            that.setData({
              picId: res.mes
            })
          }


        },
        fail: function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '上传失败',
            image: '../../../static/images/icon_error.png'
          })
        }
      });
    }


  },
    //单一图片视频上传
    singleUpload(name) {
      wx.showLoading({
        title: '上传中...',
      })
      var that = this
      if(this.data.order_type==2){
        var data = {
          token: wx.getStorageSync('access_token'),
          id: this.data.id,
          good_grade: this.data.good_grade ,
          good_message: this.data.good_message,
          packaging: this.data.packaging ,
          speed: this.data.speed,
          service: this.data.service,
        } 
       } else{
        var data = {
          token: wx.getStorageSync('access_token'),
          id: this.data.id,
          good_grade: this.data.good_grade ,
          good_message: this.data.good_message,
        } 
       }
      let imgUrl = this.data.pic[0]
      wx.uploadFile({
        //上传图片的网路请求地址
        url: 'https://www.omeals.cn/sjtc/WWW/home/order/evaluate.html',
        //选择
        filePath: imgUrl,
        name: name,
        header: {
          'content-type': 'multipart/form-data',
        },
        formData:data,
        success: function (res) {
          wx.hideLoading()
          var res = JSON.parse(res.data)
          console.log('单张图片', res)
          if (res.code == true) {
            that.setData({
              picId: res.mes
            })
            wx.navigateBack({
              delta: 1,
            })
          }
  
  
        },
        fail: function (res) {
          wx.hideLoading()
          wx.showToast({
            title: '上传失败',
            image: '../../../static/images/icon_error.png'
          })
        }
      });
  
  
  
    },

  // ToDo 请求后台接口，发布评价
  postEvaluation() {
    if (this.data.video || this.data.imgPic) {
      var pics = this.data.video + ',' + (this.data.imgPic).join()
      pics = pics.split(',')
      pics=pics.filter(item=>{
       return item !=""
      })

      this.setData({
        pic: pics
      })
   
    }
    if (this.data.good_message.length < 10) {
      wx.showModal({
        title: '评价字数不低于10个字',
        showCancel: false,
        confirmColor: '#BD4044',
      })
      return false
    }
    if(this.data.order_type==2){
      if (this.data.packaging == '' || this.data.speed == '' || this.data.service == '') {
        wx.showToast({
          title: '请将物流评分完善',
          icon: 'none'
        })
        return false
      }
    }
    this.setData({
      isshow: false
    })
    //判断如果是传文字信息
    if (this.data.pic.length == 0) {
      this.upload()
    }
    //如果传的是一张图片或者一个视频的话，需要根据name的值‘pic’,'video',两个进行分别的判断
    if (this.data.pic.length == 1) {
      //如果是数组中的字符串中含有jpg，就是图片上传
      var pic = this.data.pic.some(function (item) {
        return item.match(/.jpg/)
      })
      //如果是数组中的字符串中含有MP4，就是图片上传
      var video = this.data.pic.some(function (item) {
        return item.match(/.mp4/)
      })


      if (pic) {
        this.singleUpload('pic')
      }
      if (video) {
        this.singleUpload('video')
      }
    }
    //如果是图片和视频同时上传
    if (this.data.pic.length > 1) {
      console.log('pic', this.data.pic)
      //先获取数组中的图片路径
      var reg = /.mp4/
      var videoList = this.data.pic.some(function (item) {
        return item.match(reg)
      })
      console.log('videoList', videoList)
      var that = this
      if(this.data.order_type==2){
        var data = {
          token: wx.getStorageSync('access_token'),
          id: this.data.id,
          good_grade: this.data.good_grade ,
          good_message: this.data.good_message,
          packaging: this.data.packaging ,
          speed: this.data.speed,
          service: this.data.service,
        } 
       } else{
        var data = {
          token: wx.getStorageSync('access_token'),
          id: this.data.id,
          good_grade: this.data.good_grade ,
          good_message: this.data.good_message,
        } 
       }
      let imgUrl = this.data.pic[0]
      let name=videoList?'video':'pic'
      wx.uploadFile({
        //上传图片的网路请求地址
        url: 'https://www.omeals.cn/sjtc/WWW/home/order/evaluate.html',
        //选择
        filePath: imgUrl,
        name: name,
        header: {
          'content-type': 'multipart/form-data',
        },
        formData:data,
        success: function (res) {
          var res = JSON.parse(res.data)
          console.log('单张图片', res)
          if (res.code == true) {
            that.setData({
              picId: res.mes
            })
            that.imagesUpload('pic')
          }


        },
        fail: function (res) {
          wx.showToast({
            title: '上传失败',
            image: '../../../static/images/icon_error.png'
          })
        },
        complete:function(){
          wx.navigateBack({
            delta: 1,
          })
        }
      });


    }

  },
})