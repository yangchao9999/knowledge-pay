var config = require("../../config/config.js");
//获取应用实例
const app = getApp()

Page({
  data: {
    messageList:{},
    sectionList:{},
    //是否显示指适点
    indicatorDots: true,
    //是否轮播
    autoplay: true,
    //
    interval: 3000,
    duration: 1000,
    inputShowed: true,
    inputVal: "",
    //轮播页当前index
    swiperCurrent: 0,
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //轮播图的切换事件
  swiperChange: function (e) {
    console.log('swiperChangeswiperChangeswiperChange');
    // this.setData({
    //   swiperCurrent: e.detail.current
    // })
  },
  //轮播图点击事件
  swipclick: function (e) {
    console.log(this.data.swiperCurrent)
  },
  changeGoodsSwip: function (detail) {
    if (detail.detail.source == "touch") {
      //当页面卡死的时候，current的值会变成0 
      if (detail.detail.current == 0) {
        //有时候这算是正常情况，所以暂定连续出现3次就是卡了
        let swiperError = this.data.swiperError
        swiperError += 1
        this.setData({ swiperError: swiperError })
        if (swiperError >= 3) { //在开关被触发3次以上
          console.error(this.data.swiperError)
          this.setData({ swiperCurrent: this.data.preIndex });//，重置current为正确索引
          this.setData({ swiperError: 0 })
        }
      } else {//正常轮播时，记录正确页码索引
        this.setData({ preIndex: detail.detail.current });
        //将开关重置为0
        this.setData({ swiperError: 0 })
      }
    }
  },
  // 跳转至详情页
  navigateCourseDetail: function (e) {
    wx.navigateTo({
      url: '../course/course?cid=' + e.currentTarget.dataset.id + '&cname=' + e.currentTarget.dataset.cname + '&tname=' + e.currentTarget.dataset.tname + '&coursetype=' + e.currentTarget.dataset.coursetype + '&orderid='
    })
  },
  onLoad: function (options) {   
    var student = wx.getStorageSync('student');
    var userInfo = wx.getStorageSync('userInfo');
    console.log(student);
    if (student == null) {
      wx.redirectTo({
        url: '../tologin/tologin'
      })
    } else {
      app.globalData.student = student;
      app.globalData.userInfo = userInfo;
      console.log("app", app.globalData.student);
    }

    if (options.autocoursenav != null && options.autocoursenav == 'auto'){
      //自动跳转课程页
      var navParam = '../course/course?cid=' + options.cid + '&cname=' + options.cname + '&tname=' + options.tname + '&coursetype=' + options.coursetype + '&orderid=';

      wx.navigateTo({
        url: navParam
      })
    }
    
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse){
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }      
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }

  },
  onShow: function () {    

    var that = this
    //req data
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: config.api.reqIndexData,
      data: {
        token: config.token
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        that.setData({
          messageList: res.data.data.messageList,
          sectionList: res.data.data.sectionList
        })

        wx.hideLoading();
      }
    });
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
