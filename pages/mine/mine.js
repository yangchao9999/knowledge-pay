var config = require("../../config/config.js");
var app = getApp();
Page({
    data: {
      userInfo: null,
      couponCountStr :'',
      couponCount:0
    },
    onUserInfoCallback(userInfo) {
        this.setData({
            userInfo: userInfo
        })
    },
    onLoad: function() {      
      var userInfo = app.globalData.userInfo;
      this.setData({
        userInfo: userInfo
      })
      //console.log("student", app.globalData.student)
      
    },
    onShow: function () {
      this.initLoadData();
    }
    ,
    initLoadData: function(){
      var that = this
      //req data
      wx.showLoading({
        title: '加载中',
      })
      var userId = app.globalData.student.id;
      wx.request({
        url: config.api.reqMyCouponCount,
        data: {
          token: config.token,
          userId: userId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          var couponCountTemp = '暂无';
          if (res.data.data > 0) {
            couponCountTemp = res.data.data + '张优惠券';
          }
          that.setData({
            couponCountStr: couponCountTemp,
            couponCount: res.data.data
          })
          wx.hideLoading();
        }
      });
    }
    ,
    callTelephone: function(e){      
      wx.makePhoneCall({
        phoneNumber: e.currentTarget.dataset.tel, 
        success: function () {
          console.log("拨打电话成功！")
        },
        fail: function () {
          console.log("拨打电话失败！")
        }
      })
    },
    goMyCoupon: function(e){
      var userId = app.globalData.student.id; 
      var count = e.currentTarget.dataset.count;
      wx.navigateTo({
        url: '../mycoupon/mycoupon?userId=' + userId
      })
    },
    goMyOrder:function(e){
      wx.navigateTo({
        url: '../myorder/myorder'
      })
    }
})