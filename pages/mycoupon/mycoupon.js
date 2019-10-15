// pages/mycoupon/mycoupon.js
var config = require("../../config/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList:{},
    hiddenmodalput: true,
    couponCode : '',
    userId:0,
    count: -1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    that.setData({
      userId: options.userId
    })

    console.log(options.count);
    wx.request({
      url: config.api.reqMyCouponList,
      data: {
        token: config.token,
        userId: this.data.userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        that.setData({
          couponList: res.data.data,
          count: res.data.data.length
        })
        wx.hideLoading();
      }
    });
  },
  /**
   * 添加优惠券方法
   */
  addCoupon: function(){
    this.setData({
      couponCode: ""
    })
    this.setData({
      hiddenmodalput: false,
    })
  },

  saveCoupon: function(){
    if (this.data.couponCode==""){
      wx.showToast({
        title: '优惠券号码不能为空！',
        icon: 'loading',
        duration: 1000,
        mask: true,
        success: function () {
          this.setData({
            hiddenmodalput: true,
          })
        }
      })      
    }else{
      var that = this
      wx.showLoading({
        title: '处理中',
      })
      wx.request({
        url: config.api.addCoupon,
        data: {
          token: config.token,
          userId: this.data.userId,
          code: that.data.couponCode
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          wx.hideLoading();
          that.setData({
            couponList: res.data.data,
            hiddenmodalput: true
          })   

          if (res.data.code == 1) {
            wx.showToast({
              title: '请勿重复领取！',
              icon: 'loading',
              duration: 1000,
              mask: true
            })  
          } else if (res.data.code == 2){
            wx.showToast({
              title: '不存在的优惠券！',
              icon: 'loading',
              duration: 1000,
              mask: true
            }) 
          }             
        }
      });
    }
  },
  cancel: function () {
    this.setData({
      hiddenmodalput: true,
    })
  },
  bindInputCouponCode: function (e) {
    this.setData({
      couponCode: e.detail.value
    })
  },
  goIndex:function(){
    var pagelist = getCurrentPages();
    var len = pagelist.length;
    var init = 0;
    var index = 0;
    for (var i = 0; i < len; i++) {
      if (pagelist[i].route.indexOf("../index/index") >= 0) {//看路由里面是否有首页
        init = 1;
        index = i;
      }
    }
    if (init == 1) {
      wx.navigateBack({
        delta: len - i - 1
      });
    } else {
      wx.reLaunch({
        url: "../index/index"//这个是默认的单页
      });
    }
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