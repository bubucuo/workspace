/**
 * Created by shaoyun.gao on 2016/5/12.
 */
//var QunarAPI = require('lib/QunarAPI');
//var UA = require('lib/UA');
//require('lib/zepto');

(function(global, factory) {
    if ( typeof define === "function") { // AMD || CMD
        if(define.amd) {
            define(function() {
                return factory();
            });
        } else if(define.cmd) {
            define(function(require, exports, module) {
                module.exports = factory();
            });
        }
    } else if( typeof module === "object" && typeof module.exports === "object" ) { // commonJS
        module.exports = factory();
    } else { // global
        global.share2ends = factory();
    }
}(typeof window !== "undefined" ? window : this, function() {
    function getQueryString(key) {
        var uri = window.location.search.toString();
        var re = new RegExp("[&?]" + key + "=([^&?]*)", "i");
        return ((uri.match(re)) ? decodeURIComponent((uri.match(re)[1])) : "");
    }
    var share2ends = {
        //传参
        url: 'http://touch.qunar.com/',
        query: {
            from:'' // 来源
        },
        title: document.title,// 标题
        desc: document.title,// 描述
        img: 'http://img1.qunarzz.com/m_appPromotion/wap/1604/12/5d82469f628abaf7.png',// 图片
        domConfig:{
            wechat: ''//html
        },
        custom:'',//自定义HTML

        prdId: getQueryString('prdId'),

        shareTimeline: {},
        shareAppMessage: {},

        //机型
        is_iphone: false,
        is_android: false,
        //浏览器类型
        ua: navigator.userAgent.toLowerCase(),
        is_qunar: false,
        is_weixin: false,
        is_qqBroswer: false,
        is_uc:false,
        is_elseTouch: false,

        version_qqBroswer: 0,
        version_uc: 0,
        qApiSrc: {
            lower: "http://3gimg.qq.com/html5/js/qb.js",
            higher: "http://jsapi.qq.com/get?api=app.share"
        },
        init: function() {
            this.phoneType();//获取机型
            this.broswerType();//获取浏览器类型
            if(this.is_qunar) {
                QunarAPI.ready(function() {
                    QunarAPI.hy.setNavDisplayStatus({
                        action: "hide",  //需要设置的状态，只能为"hide"和"show"
                        hideStatusBar: true
                    });
                });
            }
        },
        success: function () {},
        cancel: function () {},
        fail: function () {},
        regist: function(para) {
            this.url = para.url || this.url;
            //this.query.from = para.query || para.query.from || this.query.from;
            this.query = para.query || this.query;
            if(this.query.from) {
                var dif = '?';
                if (this.url.indexOf('?') > -1) {
                    dif = '&';
                }
                this.url = this.url + dif + 'm=' + getQueryString('m') + '&shareFrom=' + this.query.from;
            }
            this.title = para.title || this.title;
            this.desc = para.desc || this.desc;
            this.img = para.img || this.img;
            //this.domConfig.wechat = para.domConfig || para.domConfig.wechat || this.domConfig.wechat;
            this.domConfig = para.domConfig || this.domConfig;
            this.custom = para.custom || this.custom;

            if(this.is_weixin || this.is_qunar) this.initShareInWeixinQunar();//若为微信或qunar，初始化数据
        },
        registForWeixinQunar: function () {//初始化微信和qunaer中分享数据
            this.shareTimeline = {
                title: this.title,
                desc: this.desc,
                link: this.url,
                imgUrl: this.img,
                success: function () {
                    track('timeline', prdId);
                    this.success();
                },
                cancel: function () {
                    this.cancel();
                }
            }
            this.shareAppMessage = {
                title: this.title,
                desc: this.desc,
                link: this.url,
                imgUrl: this.img,
                success: function () {
                    track('appmessage', prdId);
                    this.success();
                },
                cancel: function (res) {
                    this.cancel();
                },
                fail: function (res) {
                    this.fail();
                }
            };
        },
        phoneType: function() {
            var ua = this.ua;
            if(/iphone|ipad|ipod/.test(ua)) {
                this.is_iphone = true;
            } else if(/android/.test(ua)) {
                this.is_android = true;
            }
        },
        broswerType: function () {
            var ua = this.ua;
            if(ua.indexOf('qunar') != -1) {
                this.is_qunar = true;
            }
            else if(ua.indexOf("micromessenger")!=-1) {
                this.is_weixin = true;
            }
            else if(ua.indexOf("mqqbrowser/")!= -1) {
                this.is_qqBroswer = true;
            }
            else if(ua.indexOf("ucbrowser/")!= -1 || ua.indexOf("ubrowser/")!= -1){
                this.is_uc = true;
            }
            else {
                this.is_elseTouch = true;
            }
        },
        shareInQqUc: function() {
            var shareInqq_uc = function (config) {
                var qApiSrc = {
                    lower: "http://3gimg.qq.com/html5/js/qb.js",
                    higher: "http://jsapi.qq.com/get?api=app.share"
                };
                var bLevel = {
                    qq: {forbid: 0, lower: 1, higher: 2},
                    uc: {forbid: 0, allow: 1}
                };
                var UA = navigator.appVersion;
                var isqqBrowser = (UA.split("MQQBrowser/").length > 1) ? bLevel.qq.higher : bLevel.qq.forbid;
                var isucBrowser = (UA.split("UCBrowser/").length > 1) ? bLevel.uc.allow : bLevel.uc.forbid;
                var version = {
                    uc: "",
                    qq: ""
                };
                var isWeixin = false;

                config = config || {};
                this.url = config.url || document.location.href || '';
                this.title = config.title || document.title || '';
                this.desc = config.desc || document.title || '';
                this.img = config.img || document.getElementsByTagName('img').length > 0 && document.getElementsByTagName('img')[0].src || '';
                this.img_title = config.img_title || document.title || '';
                this.from = config.from || window.location.host || '';


                this.share = function () {
                    var title = this.title, url = this.url, desc = this.desc, img = this.img, img_title = this.img_title, from = this.from;
                    if (isucBrowser) {

                        if (typeof(ucweb) != "undefined") {
                            ucweb.startRequest("shell.page_share", [title, title, url, '', "", "@" + from, ""])
                        } else {
                            if (typeof(ucbrowser) != "undefined") {
                                ucbrowser.web_share(title, title, url, '', "", "@" + from, '')
                            } else {
                            }
                        }
                    } else {
                        if (isqqBrowser && !isWeixin) {
                            var ah = {
                                url: url,
                                title: title,
                                description: desc,
                                img_url: img,
                                img_title: img_title,
                                to_app: '',//微信好友1,腾讯微博2,QQ空间3,QQ好友4,生成二维码7,微信朋友圈8,啾啾分享9,复制网址10,分享到微博11,创意分享13
                                cus_txt: "请输入此时此刻想要分享的内容"
                            };
                            if (typeof(browser) != "undefined") {
                                if (typeof(browser.app) != "undefined" && isqqBrowser == bLevel.qq.higher) {
                                    browser.app.share('')
                                }
                            } else {
                                if (typeof(window.qb) != "undefined" && isqqBrowser == bLevel.qq.lower) {
                                    window.qb.share('')
                                } else {
                                }
                            }
                        } else {
                        }
                    }
                };

                this.isloadqqApi = function () {
                    if (isqqBrowser) {
                        var b = (version.qq < 5.4) ? qApiSrc.lower : qApiSrc.higher;
                        var d = document.createElement("script");
                        var a = document.getElementsByTagName("body")[0];
                        d.setAttribute("src", b);
                        a.appendChild(d)
                    }
                };

                this.getPlantform = function () {
                    ua = navigator.userAgent;
                    if ((ua.indexOf("iPhone") > -1 || ua.indexOf("iPod") > -1)) {
                        return "iPhone"
                    }
                    return "Android"
                };

                this.is_weixin = function () {
                    var a = UA.toLowerCase();
                    if (a.match(/MicroMessenger/i) == "micromessenger") {
                        return true
                    } else {
                        return false
                    }
                };

                this.getVersion = function (c) {
                    var a = c.split("."), b = parseFloat(a[0] + "." + a[1]);
                    return b
                };

                this.init = function () {
                    platform_os = this.getPlantform();
                    version.qq = isqqBrowser ? this.getVersion(UA.split("MQQBrowser/")[1]) : 0;
                    version.uc = isucBrowser ? this.getVersion(UA.split("UCBrowser/")[1]) : 0;
                    isWeixin = this.is_weixin();
                    if ((isqqBrowser && version.qq < 5.4 && platform_os == "iPhone") || (isqqBrowser && version.qq < 5.3 && platform_os == "Android")) {
                        isqqBrowser = bLevel.qq.forbid
                    } else {
                        if (isqqBrowser && version.qq < 5.4 && platform_os == "Android") {
                            isqqBrowser = bLevel.qq.lower
                        } else {
                            if (isucBrowser && ((version.uc < 10.2 && platform_os == "iPhone") || (version.uc < 9.7 && platform_os == "Android"))) {
                                isucBrowser = bLevel.uc.forbid
                            }
                        }
                    }
                    this.isloadqqApi();

                };

                this.init();

                return this;
            }
            var config = {
                url: this.url,
                title: this.title,
                desc: this.desc,
                img: this.imgUrl,
                img_title: '',
                from: this.query.from
            };

            var share_obj = new shareInqq_uc(config);
            share_obj.share();
        },
        shareInElseTouch: function () {
            var mask = $('.js-common-share-mask');
            if(mask.length) {
                mask.removeClass('hide');
                return;
            }
            var $mask = $([
                '<div class="m-dialog js-common-share-mask">',
                '<div class="m-dialog-bg"></div>',
                //this.domConfig.wechat,
                '<div class="share-content"><p class="title">长按复制以下链接分享给好友</p><p class="share-url">',
                    this.url,
                '</p><button class="close-btn">我知道了</button></div>',
                '</div>'
            ].join(''));

            $mask.find('.close-btn').on('click', function() {
                $mask.addClass('hide');
            });
            $('body').append($mask);
        },
        initShareInWeixinQunar: function() {
            this.registForWeixinQunar();
            if(this.is_weixin) {
                if(window.wx){
                    wx.ready(function(){
                        wx.onMenuShareAppMessage(share2ends.shareAppMessage);
                        wx.onMenuShareTimeline(share2ends.shareTimeline);
                    });
                }
            } else if(this.is_qunar) {
                QunarAPI.ready(function() {
                    QunarAPI.onMenuShareAppMessage(share2ends.shareAppMessage);
                    QunarAPI.onMenuShareTimeline(share2ends.shareTimeline);
                    //QunarAPI.hideOptionMenu({});
                });
            }
        },
        shareInWeixin: function () {
            var mask = $('.js-wx-mask');
            if(mask.length) {
                mask.removeClass('hide');
                return;
            }
            var $mask = $([
                '<div class="m-dialog m-share-wx js-wx-mask">',
                '<div class="m-dialog-bg"></div>',
                this.domConfig.wechat,
                '<span></span>',
                '</div>'
            ].join(''));

            $mask.on('click', function() {
                $mask.addClass('hide');
                return false;
            });
            $('body').append($mask);
        },
        shareInQunar: function () {
            var mask = $('.js-qunar-share');
            if(mask.length) {
                mask.removeClass('hide');
                return;
            }
            var $mask = $([
                '<div class="js-qunar-share">',
                '<div class="r-shareMask r-ani"></div>',
                '<div class="r-shareSlide r-tran">',
                '<div class="r-shareBtns">',
                '<button class="r-toFrnd">发送给朋友</button>',
                '<button class="r-toAll">分享到朋友圈</button>',
                '</div>',
                '<button class="r-cancel">取消</button>',
                '</div>',
                '</div>',
                '</div>'
            ].join(''));

            $mask.find('.r-toFrnd').on('click', function() {
                QunarAPI.ready(function() {
                    QunarAPI.hy.shareAppMessage(share2ends.shareAppMessage);
                })
            });

            $mask.find('.r-toAll').on('tap', function() {
                QunarAPI.hy.shareTimeline(share2ends.shareTimeline);
            });

            $mask.find('.r-cancel').on('click', function() {
                $mask.addClass('hide');
            });

            $('body').append($mask);

            setTimeout(function() {
                $mask.find('.r-shareSlide').addClass('r-ani');
            }, 50);
        },
        shareNow: function(para) {// 唤起分享，可以覆盖注册时的内容
            this.regist(para);
            if(this.is_uc || this.is_qqBroswer) {
                this.shareInQqUc();
            } else if(this.is_elseTouch){
                this.shareInElseTouch();
            } else if(this.is_weixin){
                this.shareInWeixin();
            } else if(this.is_qunar){
                this.shareInQunar();
            }
        },
        on: function(result) {
            if(result=="success") this.success();
            else if(result=="fail") this.fail();
            else if(result=="cancel") this.cancel();
        },
        ona: function(object) {
        }
    }
    share2ends.init();
    return share2ends;
}));