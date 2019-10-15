var url = 'https://knowledge.linghang-tech.com';
var apiPrefix = url + '/api';

var appid = 'wx715c60f8b633a6f0';//appid
var secret = '14c13de5e9d2684ba11f97eaaefd8de0';//secret
var token = 'NX2XUmKzyy$9191XuPwh6pU3HFptJI';

var config = {
    name: "东财EDP",
    wemallSession: "wemallSession",
    static: {
        imageDomain: url
    },
    api: {
      login: '/login/login',
      reqIndexData: '/index/reqIndexData',
      moreCourseList: '/course/moreCourseList',
      reqCourseDetail:'/course/reqCourseDetail',
      play: '/course/play',
      saveDuration: '/course/saveDuration',
      reqMessageDetail:'/message/reqMessageDetail',
      unifiedorder: '/pay/unifiedorder',
      notify: '/pay/notify',
      reqMyOrderList: '/order/reqMyOrderList',
      reqOrderDetail: '/order/reqOrderDetail',
      reqMyCouponList: '/coupon/reqMyCouponList',
      reqMyCouponCount: '/coupon/reqMyCouponCount',
      reqRecommendCouponList: '/coupon/reqRecommendCouponList',
      addCoupon: '/coupon/addCoupon'     
    },
    token: token
};

for (var key in config.api) {
    config.api[key] = apiPrefix + config.api[key];
}

module.exports = config;