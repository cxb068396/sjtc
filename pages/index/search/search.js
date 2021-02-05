var api=require('../../../config/api')
var app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyList: [],
    hotList:[],
    inputValue: null,
    resultList:[],
    cartnum:0
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    var that = this;
    this.setData({
      historyList:wx.getStorageSync('historySearch')||[]
    })
    this.getKeyWord()
  },
  onShow(){
    this.getshoppingCartNum()
  },
  //热门关键词
  getKeyWord(){
    var that=this
    
    app.request(api.getKeyword).then(data=>{
      that.setData({
        hotList:data
      })
    })
  },
  blur: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
    this.search();
  },
  search:function(){
  //ToDo 获取关键词进行请求,如果请求成功的， 在成功的回调函数中将关键词进行保存  tiayong调用this.save()
  var that=this
  this.setData({
    resultList:[]
  })
  const data={
    keyword:this.data.inputValue
  }
  app.request(api.GoodIndex,'get',data).then(data=>{
    console.log(data)
   let list=data
  list.forEach(item=>{
    item.image='https://www.omeals.cn/sjtc/WWW/Uploads/files/'+item.main_images
  })
that.setData({
  resultList:list
})
that.save()
  }).catch(err=>{
    wx.showToast({
      title: '暂无数据',
      image:'../../static/images/icon_error.png'
    })
  })
  },

  //保存搜索历史
  save: function () {
    var list = this.data.historyList;
    if (list.indexOf(this.data.inputValue) == -1 && this.data.inputValue != '') {
       //将搜索值放入历史记录中,只能放前10条
     if(list.length<10){
       list.unshift(this.data.inputValue)
     }else{
       list.pop() //删掉旧的时间最早的第一条
       list.unshift(this.data.inputValue)
     }
    }
    this.setData({
      historyList: list
    })
    wx.setStorageSync('historySearch', list)
  },
  searchName: function (e) {
    this.setData({
      inputValue: e.currentTarget.dataset.value
    })
    this.search();
  },
  remove: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '确认清空所有记录？',
      success(res) {
        if (res.confirm) {
          wx.removeStorage({
            key: 'historySearch',
            success() {
              that.setData({
                historyList: []
              })
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  clean:function(){
     var that=this
    setTimeout(function () {
      that.setData({
        inputValue: '',

      })
    },100)
  },
  detail: function (e) {
    this.save();
   //ToDo跳转到详情页

  },

  //单个历史记录的删除
  deletehistory(e){
    let value=e.currentTarget.dataset.value
    let list=this.data.historyList
    console.log(list)
    let index=list.indexOf(value)
    if(index>-1){
      list.splice(index,1)
      this.setData({
        historyList:list
      })
      wx.setStorageSync('historySearch',list)
    }
   },
   //跳转到详情页
   goDetail(e){
     var id=e.currentTarget.dataset.id
     wx.navigateTo({
       url: '/pages/index/detail/detail?id='+id,
     })
   },
   //添加购物车
addShopCart(e){
  var that=this
  wx.showLoading()
  var id=e.currentTarget.dataset.id
  var num=1
  var token=wx.getStorageSync('access_token')
  const data={
    specs_id:id,
    num:num,
    token:token
  }
  app.request(api.addShopGood,'POST',data).then(data=>{
  wx.showToast({
    title: '加入成功',
  })
  that.getshoppingCartNum()
  wx.hideLoading()
  }).catch(err=>{
    wx.showToast({
      title: err.mes,
      icon:'none'
    })
    wx.hideLoading()
  })
},

  // 获取购物车数目
  getshoppingCartNum() {
    let token = wx.getStorageSync('access_token')
    if (!token) {
      return false
    }
    const data = {
      token: token
    }
    app.request(api.shoppingCartNum, 'get', data).then(data => {

      let num = data == null ? 0 : data
      this.setData({
        cartnum:num
      })
      app.globalData.cartNum = num
    })
  },
  toCar(){
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  }
  })