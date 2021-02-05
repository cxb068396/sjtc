// pages/components/order-item/index.js
Component({
  options: {
    multipleSlots: true,
    styleIsolation: 'apply-shared',
  },
  properties: {
    order: Object
  },
  data: {},
  methods: {
    // 跳转至订单详情页面
    navigateToDetail(e) {
      wx.navigateTo({
        url: `/pages/my/order/orderDetail/orderDetail?id=${this.data.order.id}&status=${this.data.order.order_status}&type=${this.data.order.order_type}`
      })
    }
  },
  lifetimes: {},
  pageLifetimes: {}
})