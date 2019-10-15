// pages/payCoupon/payCoupon.js
var config = require("../../config/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    couponList: {},
    couponCode: '',
    userId: 0,
    count : -1,
    courseId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '优惠券'
    }) 

    wx.showLoading({
      title: '加载中',
    })
    var that = this
    that.setData({
      userId: options.userId,
      courseId: options.courseId
    })

    console.log("courseId" ,options.courseId);
    wx.request({
      url: config.api.reqRecommendCouponList,
      data: {
        token: config.token,
        userId: this.data.userId,
        courseId: this.data.courseId
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
  useCoupon: function(e){
    let pages=getCurrentPages();
    let prevPage = pages[pages.length - 2];//上一页面
    prevPage.setData({
      conoupCode: e.currentTarget.dataset.code,
      conoupText: e.currentTarget.dataset.name,
      conoupMoney: e.currentTarget.dataset.money
    });
    wx.navigateBack({
      conoupCode: e.currentTarget.dataset.code,
      conoupText: e.currentTarget.dataset.name,
      conoupMoney: parseFloat(e.currentTarget.dataset.money)
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