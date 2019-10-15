var config = require("../../config/config.js");
const app = getApp()
var that;
Page({
  data: {
    motto: 'Hello World',
    showModal: false,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '微信登录授权'
    })
  },
  bindGetUserInfo: function (e) {
    var that = this;
    wx.showLoading({
      title: '请稍候',
    })

    wx.login({
      success: res => {
        var code = res.code

        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) {
              wx.getUserInfo({
                success: function (res) {

                  // 可以将 res 发送给后台解码出 unionId
                  //this.globalData.userInfo = res.userInfo
                  console.log("res=", res.userInfo)
                  var nickName = res.userInfo.nickName;
                  var gender = res.userInfo.gender;
                  var language = res.userInfo.language;
                  var city = res.userInfo.city;
                  var province = res.userInfo.province;
                  var country = res.userInfo.country;
                  var avatarUrl = res.userInfo.avatarUrl;

                  wx.setStorageSync('userInfo', res.userInfo);
                  app.globalData.userInfo = res.userInfo

                  // 登录
                  // wx.login({
                  //   success: res => {

                  //   }
                  // })

                  // 发送 res.code 到后台换取 openId, sessionKey, unionId        
                  wx.request({
                    url: config.api.login,
                    data: {
                      token: config.token,
                      code: code,
                      nickName: nickName,
                      gender: gender,
                      language: language,
                      city: city,
                      province: province,
                      country: country,
                      avatarUrl: avatarUrl
                    },
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    method: "POST",
                    success: function (res2) {
                      wx.setStorageSync('student', res2.data.data);
                      app.globalData.student = res2.data.data
                      //that.globalData.student = res2.data.data
                      console.log("stu=", res2.data.data)

                      wx.switchTab({
                        url: '../index/index'
                      });                      
                      //this.globalData.id = res.data
                    }
                  });
                },
                fail: function () {
                  console.log('获取用户信息失败')
                  //获取用户信息失败后。请跳转授权页面
                  wx.showModal({
                    title: '警告',
                    content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
                    success: function (res) {
                      if (res.confirm) {
                        console.log('用户点击确定')
                        wx.navigateTo({
                          url: '../tologin/tologin',
                        })
                      }
                    }
                  })
                }
              })
            }
          }

        })
      }
    });
    // var code = wx.getStorageSync('code');
    
  }

})