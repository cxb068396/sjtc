// pages/Shopcart/Shopcart.js
var api = require('../../config/api');
var app = getApp();
Page({


  /**
   * 页面的初始数据
   */
  data: {
    carts: [],
    hasList: false,
    hasAddress: false,
    totalPrice: 0,
    selectAllStatus: false,
    Mstart: '', //记录左滑开始的位置
    index: '', //记录左滑的元素
    checkbox_goodsid: '',
    delList: [],
  },
  // 价格调用该方法
  getTotalPrice() {
    let carts = this.data.carts; // 获取购物车列表
    let total = 0;
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected) { // 判断选中才会计算价格
        total += carts[i].num * carts[i].price; // 所有价格加起来
      }
    }
    this.setData({ // 最后赋值到data中渲染到页面
      carts: carts,
      totalPrice: total.toFixed(2)
    });
  },

  /* 点击减号或加号 */
  bindModifyQuantity: function (e) {
    const {
      index,
      key
    } = e.currentTarget.dataset;
    let carts = this.data.carts;
    let num = parseFloat(carts[index].num);
    let flag = 1
    let strength = 1
    if (key === 'minus') {
      if (num <= 1) {
        return false;
      }
      num = num - 1;
      flag = 1
      strength = 0
    } else if (key === 'add') {
      if (num >= 999) {
        wx.showToast({
          title: '数量限制',
          icon: 'nne'
        })
        return false
      }
      num = num + 1
      flag = 1
      strength = 1
    }

    carts[index].num = num;

    this.modifyGoodsQuantity(flag, strength, carts[index].id)
    this.getTotalPrice()
  },

  /* 输入框事件 */
  bindManual: function (e) {
    var that = this
    let numa = parseInt(e.detail.value)
    if (numa == '' || numa == 0) {
      numa = 1;
    }
    // if (numa > 999) {
    //   numa = 999;
    //   wx.showToast({
    //     title: '数量限制',
    //     icon: 'none'
    //   })
    // }
    const index = e.currentTarget.dataset.index;
    let carts = this.data.carts;
    let num = numa
    if (carts[index].num == num) return false //如果输入框中的数量没有改变，不做请求
    carts[index].num = num
    let data = {
      num: numa,
      specs_id: carts[index].id,
    }
    console.log(data)
    app.request(api.SaveShopNum, 'POST', data)
      .then(() => {
        that.setData({
          carts:carts
        })
        that.getshoppingCartNum()
      }).catch(err => {
        wx.showToast({
          title: err.mes,
          icon: 'none'
        })
      })
    this.getTotalPrice()
    this.getcartlist()
  },

  // 请求接口 改变购物车内某一商品的数量
  modifyGoodsQuantity(num, strength, id) {
    var that = this
    const data = {
      num: num,
      strength: strength,
      specs_id: id,
    }
    app.request(api.ShopNum, 'post', data)
      .then(data => {
        that.getshoppingCartNum()
      }).catch(error=>{
        wx.showToast({
          title: '库存不足',
          icon:'none'
        })
        that.getcartlist()
      })
  },

  // 触摸开始
  touchstart: function (e) {
    // console.log(e);
    this.setData({
      Mstart: e.changedTouches[0].pageX, //开始触摸时的横坐标
      index: e.currentTarget.dataset.index,
    })
  },

  // 开始滑动
  touchmove: function (e) {
    let that = this;
    //  console.log(e);
    let list = that.data.carts;
    // 计算滑动的距离
    let moveL = that.data.Mstart - e.changedTouches[0].pageX;
    // console.log(moveL)

    list[that.data.index].left = moveL > 0 ? -moveL : 0;

    that.setData({
      carts: list,
    })
  },

  // 滑动结束 触摸结束
  touchend: function (e) {
    let that = this;
    console.log(e);
    let list = that.data.carts;
    let lastMoveL = that.data.Mstart - e.changedTouches[0].pageX; //最终移动的距离

    list[that.data.index].left = lastMoveL > 100 ? -180 : 0;

    this.setData({
      carts: list,
    })
  },

  // 删除操作
  scrollDel(e) {
    var that=this
    let _id = e.currentTarget.dataset.id;
    let list = this.data.carts;
    wx.showModal({
      title: '是否删除',
      content: '您确定要删除订单',
      confirmColor:'#BE4044',
      success(res) {
        if (res.cancel) {
        } else if (res.confirm) {
          app.request(api.DelshopCar, undefined, {
            skuid: _id
          }).then(data => {
            console.log(data)
            list = list.filter((item) => {
              return item.id != _id
            });
            that.setData({
              carts: list
            })
            that.getshoppingCartNum()
            that.getcartlist()
          }).catch(err => {
            wx.showToast({
              title: err.mes,
              icon: 'success',
            })
          })
        }
      }
    })
  },

  //删除  外面的
   deleteList(e) {
    console.log(e)
    var checkbox_goodsids = this.__data__.carts;
    var that=this
    var goodsids = checkbox_goodsids.map(function (v) {
      return v.id;
    });
    var checkbox_goodsid = goodsids.join(",")
    console.log(checkbox_goodsid)
    console.log('点击删除选中的商品id' + checkbox_goodsid)
    if (checkbox_goodsid === '') {
      wx.showToast({
        title: '您尚未选中商品',
        duration: 2000,
        icon: 'none'
      })
    } else {
      wx.showModal({
        title: '是否删除',
        content: '您确定要删除订单',
        confirmColor:'#BE4044',
        success(res) {
          if (res.cancel) {
          } else if (res.confirm) {
            app.request(api.DelshopCar, undefined, {
              skuid: checkbox_goodsid
            }).then(data => {
              that.getshoppingCartNum()
            that.getcartlist()
            }).catch(err => {
              wx.showToast({
                title: err.mes,
                icon: 'none',
              })
            })
          }
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 进去页面时请求购物车数据
  getcartlist() {
    let token = wx.getStorageSync('access_token') || ''
    if (!token) {
      return false
    }
    app.request(api.getShopCart, 'get')
      .then(data => {
        if (!data && data.length > 0) {
          return
        } else {
          data.forEach(item => {
            item.image = 'https://www.omeals.cn/sjtc/WWW/Uploads/files/' + item.img.replace(/\\/g, "/");
            item.title = item.name;
            item.id = item.id;
            item.net_content = item.net_content
            item.num = item.product_num // 如果数量大于999，只是显示999，如果不大于显示具体数量
            item.price = parseFloat(item.sell_price);
            // item.activity = item.description;
            item.selected = false
          })
          this.setData({
            hasList: true,
            selectAllStatus: false,
            carts: data,
            totalPrice: 0,
            hasAddress: true

          })
        }
      })
      .catch(err => {
        if (err.mes == '购物车空空如也，快去添加商品吧') {
          this.setData({
            carts: [],
            hasList: false,
            hasAddress: false
          })
        }
      })
  },

  onShow() {
    this.getcartlist();
    this.getshoppingCartNum();
  },

  // 单选中购物车的时候
  checkboxChange: function (e) {
    const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    let carts = this.data.carts; // 获取购物车列表
    const selected = carts[index].selected; // 获取当前商品的选中状态
    carts[index].selected = !selected; // 改变状态
    var selectedstatus = carts.every(item => {
      return item.selected == true
    })
    if (selectedstatus) {
      this.setData({
        selectAllStatus: true
      })
    } else {
      this.setData({
        selectAllStatus: false
      })
    }
    this.setData({
      carts: carts,
    });
    this.getTotalPrice();

  },

  // 全选获取总价格
  checkboxChangeAll: function (e) {
    let selectAllStatus = this.data.selectAllStatus; // 是否全选状态
    selectAllStatus = !selectAllStatus;
    let carts = this.data.carts;
    console.log(carts)
    for (let i = 0; i < carts.length; i++) {
      carts[i].selected = selectAllStatus; // 改变所有商品状态
    }
    this.setData({
      selectAllStatus: selectAllStatus,
      carts: carts
    });
    this.getTotalPrice();
  },

  // 结算跳转页面
  tosettlement: function (e) {
    if (this.data.totalPrice == '0.00') {
      wx.showToast({
        title: '请选择商品',
        image: "../static/images/icon_error.png",
        duration: 2000
      });
      return
    }
    var that = this
    let carts = that.data.carts;
    // 循环购物车，查看是否有选中的商品。没有的话提示
    var id;
    var num;
    console.log(carts)
    //结算商品，循环购物车所有的商品，找到选中的商品，把商品数据和总金额传给结算页面
    var product = {}
    console.log(carts)
    for (let i = 0; i < carts.length; i++) {
      if (carts[i].selected) {
        var sty = carts[i].id
        var valu = carts[i].num
        product[sty] = valu
      }
    }
    var str = {
      // token: token,
      formcart: 1,
      product: product,
    }
    console.log(str)

    app.request(api.OrderIndex, 'GET', str)
      .then(data => {
        console.log(data)
        wx.navigateTo({
          url: '/pages/cart/accounts/accounts?str=' + JSON.stringify(data),
        })
      })
      .catch(err => {
        wx.showToast({
          title: err.mes,
          icon: 'none'
        })
      })



  },

  onShareAppMessage: function () {},



  /**逻辑运算结束 */
  showCartNum() {
    // let cartNum = wx.getStorageSync("cartNum");
    let cartNum = app.globalData.cartNum;
    if (cartNum > 0) {
      wx.setTabBarBadge({
        index: 2,
        text: cartNum + "",
      })
    } else {
      wx.removeTabBarBadge({
        index: 2
      })
    }
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
      // wx.setStorage({
      //   key: 'cartNum',
      //   data: num,
      // })
      app.globalData.cartNum = num
      this.showCartNum()

    })
  },

  //跳转到详情页
  gotodetail(e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../shopto/shopwt?id=' + id,
      success: function () {
        console.log('跳转成功')
      }
    })
  },

})