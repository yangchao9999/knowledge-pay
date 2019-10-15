var config = require("../../config/config.js");
var WxParse = require('../../components/wxParse/wxParse.js');
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    course:{},
    userId:0,
    cid: 0,
    cname: '',
    tname: '',
    courseType:'',
    orderId:'',

    currChapter:{},
    status:'',
    isFirstPlay: false,
    action: {
      method: 'setCurrentTime',
      data: 0
    },
    timeText: '0:0',
    per : 0,
    durationText: '',
    duration:0,
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    turner : null,

    action:'',
    //默认最小值20；
    min: 0,
    //默认最大值20；
    max: 100,
    //设置不禁用
    disabled: false,
    //设置选中默认颜色
    colorSelect: '#d24a58',
    //设置背景颜色
    backgroundColor: "#fff",
    //设置滑块的大小
    blockSize: 2,
    //设置滑块的颜色
    blockColor: "#fff",
    //是否显示当前 value
    showValue: false,
    //步长
    step: 1,
    bindchangingFlag : false,

    //video
    videoAutoplay: false,
    saveDurationSetp: 10000,

    topModalFlag: true,
    payModalFlag: true,
    payProtocol: 'checked',
    payProtocolSel: ['1'],

    coursePrice : 0,
    conoupCode :'',
    conoupText:'',
    conoupMoney: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.cid=1;
    // options.cname ='可转债市场变革方向与投资框架';
    // options.tname = '余经纬';
    // options.coursetype='audio';    
    var cid = options.cid;
    var cname = options.cname;
    var tname = options.tname;
    var title = tname + "·" + cname;
    var courseType = options.coursetype;
    var orderId = options.orderid;
    wx.setNavigationBarTitle({
      title: title
    })    
    
    console.log("courseType", courseType);
    console.log("student", app.globalData.student);
    var that = this
    that.setData({
      userId: app.globalData.student.id,
      cid: cid,
      cname: cname,
      title: title,
      courseType: courseType,
      orderId: orderId
    })
    
    that.initLoadData();
  },
  initLoadData: function(){
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: config.api.reqCourseDetail,
      data: {
        token: config.token,
        studentId: this.data.userId,
        courseId: this.data.cid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: "POST",
      success: function (res) {
        wx.hideLoading();
        var cp = res.data.data.chapter;  
        if (cp.courseType != null && cp.courseType != "") {        
          that.setData({
            courseType: cp.courseType
          })
        } else {
          that.setData({
            courseType: res.data.data.courseType
          })
        }
        that.setData({
          course: res.data.data,
          currChapter: cp,
          coursePrice: parseFloat(res.data.data.price)
        })              
        
        if (res.data.data.recommendCoupon) {
          that.setData({
            conoupText: res.data.data.recommendCoupon.name,
            conoupCode: res.data.data.recommendCoupon.code,
            conoupMoney: parseFloat(res.data.data.recommendCoupon.money)
          })
        }

        //console.log("parseFloat(res.data.data.recommendCoupon.money)", parseFloat(res.data.data.recommendCoupon.money))
        console.log("cp", cp);                
        that.audioEventRegister();
        if (that.data.courseType == "audio") {          
          innerAudioContext.src = that.data.currChapter.url;
          that.data.durationText = innerAudioContext.duration;
          if (res.data.data.last_chapter_time != null && res.data.data.last_chapter_time != "") {
            innerAudioContext.autoplay = true;
            innerAudioContext.seek(res.data.data.last_chapter_time);
          }
        } else {
          if (res.data.data.last_chapter_time != null && res.data.data.last_chapter_time != "") {
            that.videoContext.seek(res.data.data.last_chapter_time);
          }
        }

        if (cp.introduction != null && cp.introduction != "") {
          WxParse.wxParse('article', 'html', cp.introduction, that, 5);
        } else {
          WxParse.wxParse('article', 'html', res.data.data.introduction, that, 5);
        }
        wx.hideLoading();
      }
    });
  }
  ,
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      payProtocolSel: e.detail.value
    })
  },
  
  prePay: function () {
    this.setData({ payModalFlag: false, topModalFlag:true })    
  },
  toPay: function(){
    if (this.data.payProtocolSel.length > 0){
      var that = this
      wx.request({
        url: config.api.unifiedorder,
        data: {
          token: config.token,
          userId: that.data.userId,
          goodsId: that.data.cid,
          couponCode: that.data.conoupCode,
          orderId: that.data.orderId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: "POST",
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 8){
            //直接开通，course.buyFlag
            that.initLoadData();
            that.setData({ payModalFlag: true, topModalFlag: true }) 
          }else{
            wx.requestPayment({
              timeStamp: res.data.data.timeStart,
              nonceStr: res.data.data.nonceStr,
              package: "prepay_id=" + res.data.data.preId,
              signType: 'MD5',
              paySign: res.data.data.paySign,
              success(res) {
                console.log("res success=",res);
                that.initLoadData();
                that.setData({ payModalFlag: true, topModalFlag:true }) 
              },
              fail(res) {
                console.log("res fail=", res);
              }
            })
          }
        }
      });
    }    
  }
  ,
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    var cur = e.target.dataset.current;
    if (this.data.currentTaB == cur) { return false; }
    else {
      this.setData({
        currentTab: cur
      })
    }
  },
  chapterPlay: function(e){
    var chapterId = e.target.dataset.chapterid;
    var chapterObj = this.getChapter(chapterId);
    if (this.data.course.buyFlag == "0" && chapterObj.tryFlag !="1") {
      //wx.showToast({ title: '请购买本课程！', icon: 'loading', duration: 1500 });
      this.setData({ topModalFlag: false })
      return ;     
    }
    var ct = this.data.course.courseType;
    if (chapterObj.courseType != null && chapterObj.courseType != "") {
      ct = chapterObj.courseType;
    }
    this.setData({
      courseType: ct,
      isFirstPlay: false
    })

    if (chapterObj.introduction != null && chapterObj.introduction != "") {
      WxParse.wxParse('article', 'html', chapterObj.introduction, this, 5);
    } else {
      WxParse.wxParse('article', 'html', this.data.course.introduction, this, 5);
    } 

    if (ct == "audio") {
      this.setData({ videoAutoplay: false });
      innerAudioContext.stop();
      this.videoContext.stop();
      this.setData({
        currChapter: chapterObj,
        status: 'play',
        per: '0',
        action: {
          method: 'play'
        }
      }) 
      
      innerAudioContext.src = this.data.currChapter.url;
      console.log("playplay............", this.data.currChapter);
      innerAudioContext.seek(0);
      
      innerAudioContext.play();   
    }else{
      innerAudioContext.stop();//音频停止
      this.setData({ currChapter: chapterObj, videoAutoplay: true});
      this.videoContext.seek(0);
      this.videoContext.play();
      
      console.log("playplay............", chapterObj);
    }
    this.callPlay();
  },
  getChapter : function(chapterid){
    var ret = {};
    this.data.course.chapterList.forEach(function (obj) {
      if(obj.id==chapterid){
        ret = obj;
      }
    });
    return ret;
  },
  prevEvent: function(){
    var preIndex = 0;
    
    for (let i = 0; i < this.data.course.chapterList.length; i++){      
      if (this.data.course.chapterList[i].id == this.data.currChapter.id && i == 0) {
        return ;
      }else if (this.data.course.chapterList[i].id == this.data.currChapter.id && i > 0) {

        if (this.data.course.buyFlag == "0" && this.data.course.chapterList[preIndex].tryFlag != "1") {
          //wx.showToast({ title: '请购买本课程！', icon: 'loading', duration: 1500 });
          this.setData({ topModalFlag: false })
          return;  
        }
        this.setData({ videoAutoplay: false });
        innerAudioContext.stop();
        this.videoContext.stop();

        this.setData({
          per: 0,
          isFirstPlay: false
        })
        this.setData({
          currChapter: this.data.course.chapterList[preIndex],
          status: 'play',
          action: {
            method: 'play'
          }
        }) 

        var ct = this.data.course.chapterList[preIndex].courseType;
        if (ct != null && ct != "") {
          this.setData({
            courseType: ct
          })
        } else {
          this.setData({
            courseType: this.data.course.courseType
          })
        } 
        
        innerAudioContext.seek(0);
        innerAudioContext.src = this.data.currChapter.url;
        innerAudioContext.play();

        this.callPlay();
        return ;
      }

      if (this.data.course.chapterList[i].url != null && this.data.course.chapterList[i].url != "") {
        preIndex = i;
      }
    }
  },
  nextEvent: function(){    
    for (let i = 0; i < this.data.course.chapterList.length; i++) {
      if (this.data.course.chapterList[i].id == this.data.currChapter.id && i < this.data.course.chapterList.length-1) {
        for (let j = i; j < this.data.course.chapterList.length-1; j++) {
          if (this.data.course.chapterList[j+1].url != null && this.data.course.chapterList[j+1].url != "") {

            if (this.data.course.buyFlag == "0" && this.data.course.chapterList[j + 1].tryFlag != "1") {

              //wx.showToast({ title: '请购买本课程！', icon: 'loading', duration: 1500 });
              this.setData({ topModalFlag: false })
              return;  
            }

            var ct = this.data.course.chapterList[j + 1].courseType;
            if (ct != null && ct != "") {
              this.setData({
                courseType: ct,
                isFirstPlay: false
              })
            } else {
              this.setData({
                courseType: this.data.course.courseType,
                isFirstPlay: false
              })
            } 

            if (this.data.courseType == "audio") {
              innerAudioContext.stop();
              this.videoContext.stop();
              this.setData({
                per: 0
              })
              this.setData({
                currChapter: this.data.course.chapterList[j + 1],
                status: 'play',
                action: {
                  method: 'play'
                }
              })
              this.setData({ videoAutoplay: false });
              
              innerAudioContext.seek(0);
              innerAudioContext.src = this.data.currChapter.url;
              innerAudioContext.play();
            }else{
              innerAudioContext.stop();
              this.setData({ currChapter: this.data.course.chapterList[j + 1], videoAutoplay: true });
              this.videoContext.seek(0);
              this.videoContext.play();
            }

            this.callPlay();
            return;
          } 
        }       
      }
    }
  },
  actionEvent: function (e) {
    if (this.data.course.buyFlag == "0" && this.data.currChapter.tryFlag != "1") {
      //wx.showToast({ title: '请购买本课程！', icon: 'loading', duration: 1500 });
      this.setData({ topModalFlag: false })
      return;
    }
    var method = this.data.status === 'play' ? 'pause' : 'play';
    this.setData({
      status: method,
      action: {
        method: method
      }
    });
    
    if (method == 'play') {      
      innerAudioContext.src = this.data.currChapter.url;
      
      innerAudioContext.play();    
      this.callPlay();  
      
    } else if (method == 'pause') {
      innerAudioContext.pause();
    }
  }
  ,
  audioEventRegister: function(){
    innerAudioContext.onPlay(() => {
      console.log('开始播放'); 
      this.clearTurner();     
      this.saveDuration();
      //定时保存进度
      this.turner = setInterval(() => {
        this.saveDuration();
      }, this.data.saveDurationSetp);
    })
    innerAudioContext.onPause(() => {
      console.log('暂停播放')
      this.clearTurner();
    })
    innerAudioContext.onStop(() => {
      console.log('停止播放')
      this.clearTurner();
    })
    innerAudioContext.onEnded(() => {
      console.log('播放结束')
      this.clearTurner();
      innerAudioContext.stop(); 
      this.setData({
        status: 'pause',
        action: {
          method: 'pause'
        },
        per:0
      });
      innerAudioContext.seek(0);    
      this.nextEvent();
    })
    innerAudioContext.onTimeUpdate(() => {
      console.log('更新进度')
      this.timeupdateEvent();
    })
  }
  ,
  timeupdateEvent: function () {
    //console.log("update", e);
    var t = innerAudioContext.currentTime;
    var d = innerAudioContext.duration;
    //console.log("t", t);
    //console.log("d", d);
    if (this.data.bindchangingFlag == true){
      this.setData({
        timeText: this.formatTime(t)
      });
    }else{
      this.setData({
        per: Math.floor(t / d * 100),
        timeText: this.formatTime(t)
      });
    }
    //console.log(Math.floor(t / d * 100));
  },
  //定时保存
  saveDuration : function(){
    var t = innerAudioContext.currentTime;
    wx.request({
      url: config.api.saveDuration,
      data: {
        token: config.token,
        courseId: this.data.course.id,
        chapterId: this.data.currChapter.id,
        userId: this.data.userId,
        second: t
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      method: "POST",
      success: function (res) {
        
      }
    });      
  },
  formatTime: function (time) {
    time = Math.floor(time);
    var m = Math.floor(time / 60).toString();
    m = m.length < 2 ? '0' + m : m;

    var s = (time - parseInt(m) * 60).toString();
    s = s.length < 2 ? '0' + s : s;

    return `${m}:${s}`;
  } ,
  endEvent: function (e) {
    console.log("play over..................");
  },
  //音频播放器滑块
  sliderchange: function (e){
    console.log(e.detail.value);
    var v = e.detail.value;
    var t = Math.floor(v / 100 * innerAudioContext.duration)
    innerAudioContext.seek(t);
    console.log("e.detail.value", e.detail.value);
    this.setData({
     
      bindchangingFlag:false
    });
    
  },
  bindchanging: function(e){
    console.log("bindchangingbindchangingbindchangingbindchanging");
    this.data.bindchangingFlag = true;
  },
  clearTurner: function () {
    if (this.turner) {
      clearInterval(this.turner);
      this.turner = null;
    }
  },

  //视频播放事件相关  
  videoBindplay: function(){
    if (this.data.course.buyFlag == "0" && this.data.currChapter.tryFlag != "1") {
      this.setData({ topModalFlag: false })
      this.clearTurner();
      this.videoContext.stop();
      return;
    }
    this.callPlay();
    //定时保存进度
    this.clearTurner();
    this.saveDuration();
    this.turner = setInterval(() => {
      this.saveDuration();
    }, this.data.saveDurationSetp);
  },
  videoBindpause: function(){
    this.clearTurner();
  },
  videoBindended: function () {
    this.clearTurner();
    this.videoContext.stop();
    this.videoContext.seek(0);
    this.nextEvent();
  },

  //调用服务端PLAY接口
  callPlay: function(){
    if (this.data.isFirstPlay == false) {
      var that = this
      wx.request({
        url: config.api.play,
        data: {
          token: config.token,
          chapterId: this.data.currChapter.id
        },
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        method: "POST",
        success: function (res) {
          that.setData({
            isFirstPlay: true
          });
        }
      });
    }
  },
  modalClose2: function (e) {
    //console.log("111111111111111111111111");
    this.setData({ topModalFlag: true })
  },
  getCourseCoupon: function(){
    console.log(this.data.course.id);
    wx.navigateTo({
      url: '../payCoupon/payCoupon?courseId=' + this.data.course.id + '&userId=' + this.data.userId
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.videoContext = wx.createVideoContext('myVideo')
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    let pages = getCurrentPages();
    let currPage = pages[pages.length - 1];//上一页面
    console.log("conoupCode", currPage.data.conoupCode);
    console.log("conoupText", currPage.data.conoupText);
    console.log("conoupMoney", currPage.data.conoupMoney);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    if (this.data.courseType == "audio") {
      innerAudioContext.stop();
    } else {
      this.videoContext.stop();
    }
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    if (this.data.courseType == "audio") {
      innerAudioContext.stop();
    } else {
      this.videoContext.stop();
    }
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
  onShareAppMessage: function (res) {
    return {
      title: this.data.title,
      path: '/pages/index/index?autocoursenav=auto&cid=' + this.data.course.id + '&cname=' + this.data.course.courseName + '&tname=' + this.data.course.teacherName + '&coursetype=' + this.data.course.courseType + '&orderid='
    }
  },
  payModalShow: function () {
    this.setData({ payModalFlag: false })
  },
  payModalHide: function(){
    this.setData({ payModalFlag: true })
  },
  toPayProtocol: function(e){
    wx.navigateTo({
      url: '../payProtocol/payProtocol?type=' + e.target.dataset.type
    })
  }
})