var config = require("../../config/config.js");
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myOrderList: {}, 
    userId: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的订单'
    }) 
    wx.showLoading({
      title: '加载中',
    })
    var userId = app.globalData.student.id; 
    this.setData({
      userId: userId
    })
    console.log(userId);
    var that = this
    wx.request({
      url: config.api.reqMyOrderList,
      data: {
        token: config.token,
        userId: userId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        that.setData({
          myOrderList: res.data.data
        })
        console.log("data", res.data.data);
        wx.hideLoading();
      }
    });
  },
  toPay: function(e){

    wx.redirectTo({
      url: '../course/course?cid=' + e.currentTarget.dataset.cid + '&cname=' + e.currentTarget.dataset.cname + '&tname=' + e.currentTarget.dataset.tname + '&coursetype=' + e.currentTarget.dataset.coursetype + '&orderid=' + e.currentTarget.dataset.orderid
    });
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