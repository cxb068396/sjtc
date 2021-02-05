// pages/components/modal/index.js
Component({
  options:{
    multipleSlots: true,
  },
  properties: {
    title: String,
    content: Array,
    confirmText: { type: String, value: '确定' },
    cancelText: { type: String, value: '取消' },
    show: {type: Boolean,value: false},
    openapi: {type:Boolean,value: true}
    // cancel: Function,
    // confirm: Function
  },

  data: {success: null,
    fail: null,},

  methods: {
    initModal(){
      wx.ysShop = wx.ysShop || {}
      wx.ysShop.showModal = (options) => {
        const {
          title='',
          content=[],
          confirmText = '确定',
          cancelText = '取消',
          show = true,
          success=null,
          fail=null
        } = options
        this.setData({title,content,confirmText,cancelText,show,success,fail})
        return this
      }
    },
    preventTouchMove() { },
    // 取消 点击事件处理函数
    hideModal(){
      let detail = 'cancel'
      const {success} = this.data
      success && success({
        confirm: false,
        cancel: true,
        errMsg: 'showModal: cancel'
      })
      this.setData({
        show: !this.data.show
      });
      this.triggerEvent('hideModal',detail,{})
    },
    // 确认点击事件处理函数
    onConfirm(){
      let detail = 'confirm'
      const {success} = this.data
      success && success({
        confirm: true,
        cancel: false,
        errMsg: 'showModal: success'
      })
      this.setData({
        show: !this.data.show
      });
      this.triggerEvent('confirm',detail,{})
    },
  },
  lifetimes: {
    attached(){
      if(this.data.openapi){
        this.initModal()
      }
      let content = this.data.content
      this.setData({content})
    }
  },
  pageLifetimes: {
    show(){
      if(this.data.openapi){
        this.initModal()
      }
    }
  },
})
