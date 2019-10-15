//app.js
var config = require("config/config.js");
App({
  onLaunch: function () {
    // 展示本地存储能力
    
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    var that = this  
    // wx.login({
    //   success: res => { 
    //     console.log("0000000000000000");
    //   }
    // });  
    // // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              // this.globalData.userInfo = res.userInfo
              // wx.setStorageSync('userInfo', res.userInfo);
              // console.log("init res=", res.userInfo)
              // var nickName = res.userInfo.nickName;
              // var gender = res.userInfo.gender;
              // var language = res.userInfo.language;
              // var city = res.userInfo.city;
              // var province = res.userInfo.province;
              // var country = res.userInfo.country;
              // var avatarUrl = res.userInfo.avatarUrl;
              // 登录
              // wx.login({
              //   success: res => {
              //     wx.setStorageSync('code', res.code);
              //     // 发送 res.code 到后台换取 openId, sessionKey, unionId        
              //     wx.request({
              //       url: config.api.login,
              //       data: {
              //         token: config.token,
              //         code: res.code,
              //         nickName: nickName,
              //         gender: gender,
              //         language: language,
              //         city: city,
              //         province: province,
              //         country: country,
              //         avatarUrl: avatarUrl
              //       },
              //       header: {
              //         'content-type': 'application/x-www-form-urlencoded'
              //       },
              //       method: "POST",
              //       success: function (res2) {
              //         that.globalData.student = res2.data.data
              //         wx.setStorageSync('student', res2.data.data);
              //         console.log("stu=", res2.data.data)
              //         //this.globalData.id = res.data
              //       }
              //     });
              //   }
              // })
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
    
  },
  globalData: {
    userInfo: null,
    student:null
  }
})