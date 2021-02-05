//const ApiRootUrl = 'http://192.168.0.227/sjtc/WWW/home'   //公共的api

const ApiRootUrl = 'https://www.omeals.cn/sjtc/WWW/home'  

//首页相关的api
const index={
HomeIndex:ApiRootUrl+'/Main/index',//首页信息
Maindetail:ApiRootUrl+'/Main/detail',//商品详情
showNewCoupon:ApiRootUrl+'/Coupon/showNewCoupon',//显示新人优惠券
getNewCoupon:ApiRootUrl+'/Coupon/getNewCoupon',//获取新人优惠券
GoodIndex:ApiRootUrl+'/Good/index',//获得搜索的内容
getKeyword:ApiRootUrl+'/Good/getKeyword',//获得关键词
}

//分类相关的api
const category={
  GoodCategory:ApiRootUrl+'/Good/category',//获取分类的一级目录和二级目录 Good/getGood  
  getGood:ApiRootUrl+'/Good/getGood',//获取分类内容
}

//购物车相关的api
const shopCart={
shopCartAddress:ApiRootUrl+'/ShopCar/get_shop_car_address',//获取购物车的地址 
addShopGood:ApiRootUrl+'/ShopCar/addshopGood',//添加商品到购物车
getShopCart:ApiRootUrl+'/ShopCar/getshopCar',//获取购物车详情
SaveShopNum:ApiRootUrl+'/ShopCar/saveshopCarNum', //修改购物车的数量
ShopNum:ApiRootUrl+'/ShopCar/addshopCarNum',//订单商品数量的添加或者减少
DelshopCar:ApiRootUrl+'/ShopCar/delshopCar', //删除订单
shoppingCartNum:ApiRootUrl+'/ShopCar/shopping_cart_statistics',//获取购物车的商品数量 
OrderIndex:ApiRootUrl+'/Order/index.html',//生成订单
CreateOrder:ApiRootUrl+'/Order/order.html',//提交订单
OrderPay:ApiRootUrl+'/Order/pay.html',//支付方式不同
YuePay:ApiRootUrl+'/Order/yuepay.html',//余额支付的接口 
OrderCancelLation:ApiRootUrl+'/Order/cancellation.html',//未支付取消订单
}

//我的相关的api
const mine={
  wxChatLogin:ApiRootUrl+'/login/weixinlogin.html' ,// 微信登录  
  GetCouponCount:ApiRootUrl+'/Coupon/getCount', // 获取未使用优惠券的总数 
  Recharge:ApiRootUrl+'/Recharge/index', //获取余额充值页面  
  RechargeRechargeAmount:ApiRootUrl+'/Recharge/rechargeAmount', //余额充值 
  getAddress:ApiRootUrl+'/Address/getAddress.html',//获得收货地址 
  addAddress:ApiRootUrl+'/Address/addAddress.html',//添加地址  
  deleteAddress:ApiRootUrl+'/Address/deladdress.html',//删除地址  
  EditAddress:ApiRootUrl+'/Address/editAddress.html',//编辑地址 
  LoginGetUser:ApiRootUrl+'/Login/getuser.html',//获取用户的信息
  setPassWord:ApiRootUrl+'/Login/setp.html',//设置密码
  CheckpPassWord:ApiRootUrl+'/Login/checkp.html',//检查密码
  changPassword:ApiRootUrl+'/Login/changep.html',//重置密码
  smsCode:ApiRootUrl+'/Sms/code.html',//发送验证码
  bindingMobile:ApiRootUrl+'/Login/binding_mobile.html',//获取手机验证码登陆的sign
  getIdea: ApiRootUrl + '/keyword/get_idea.html',  //意见反馈
}


//优惠券相关的api
const coupon={
  ShowCoupon:ApiRootUrl+'/Coupon/showCoupon', //显示所有的优惠券 Coupon/getCoupon 
  GetCoupon:ApiRootUrl+'/Coupon/getCoupon',//获取优惠券
  PersonalCoupon:ApiRootUrl+'/Coupon/personalCoupon', //显示已获取的优惠券 
  CheckCoup:ApiRootUrl+'/Order/check_cop.html',//参看优惠券是否有效
}

// 发票相关api
const invoice={
  ivpayable: ApiRootUrl+ '/Invoice/get_title',   //发票抬头
  addPayable: ApiRootUrl + '/Invoice/add_title',    //添加发票抬头
  editPayable: ApiRootUrl + '/Invoice/edit_title',  //编辑发票抬头
  delPayable: ApiRootUrl + '/Invoice/del_title',    //删除发票抬头
  ivRecords: ApiRootUrl + '/Invoice/get_invoice',   //发票记录
  ordering: ApiRootUrl + '/Invoice/get_order',      //订单开票
  billing: ApiRootUrl + '/Invoice/get_recharge',    //充值开票
  getRecharge: ApiRootUrl + '/Invoice/add_invoice', //新增开票信息
}

//品酒预订相关
const wineTasting={
  wineIndex:ApiRootUrl+'/Wine/index.html',//获得品酒的相关信息 
  wineDesk:ApiRootUrl+'/Wine/desk.html',//坐位信息
  wineOrder:ApiRootUrl+'/Wine/wine_order.html',//生成订单
}

//订单相关
const order={
  allOrder:ApiRootUrl+'/order/allorder.html',//所有的订单
  orderDetail:ApiRootUrl+'/order/detail.html',//订单详情
  orderRepay:ApiRootUrl+'/order/repay.html',//再次发起购买
  orderAbrogate:ApiRootUrl+'/order/abrogate.html',//删除订单
  buyAgain:ApiRootUrl+'/order/buy_again.html',//再次购买
  orderArrival:ApiRootUrl+'/order/arrival.html',//已到店
  orderCancel:ApiRootUrl+'/order/cancel.html',//已付款的取消点单		
  orderLookwl:ApiRootUrl+'/order/lookwl.html',//查看物流 
  orderReceipt:ApiRootUrl+'/order/receipt.html',//确认收货

}

module.exports={
  ...index,
  ...category,
  ...shopCart,
  ...mine,
  ...coupon,
  ...invoice,
  ...wineTasting,
  ...order
}