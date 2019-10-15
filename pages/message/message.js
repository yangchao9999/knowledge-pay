// pages/message/message.js
var WxParse = require('../../components/wxParse/wxParse.js');
var config = require("../../config/config.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    message: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: config.api.reqMessageDetail,
      data: {
        token: config.token,
        messageId: options.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        var article = res.data.data.content;
        WxParse.wxParse('article', 'html', article, that, 5);
        
        that.setData({
          message: res.data.data
        })
      }
    });

    
  }
  ,
  pageLocation: function(){
    wx.navigateTo({
      url: this.data.message.navUrl
    })
  }
  ,

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