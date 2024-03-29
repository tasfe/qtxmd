﻿// ==UserScript==
// @name   SwfaccAdkillVideoAntiblack
// @namespace   Qingtian
// @author   Qingtian
// @description   SwfaccAdkillVideoAntiblack
// @version   2.0.0Nightly+2015.03.13pre
// @icon   http://code.google.com/p/qtxmd/logo?cct=1391043764
// @charset   utf-8
// @downloadURL   http://qtxmd.googlecode.com/svn/SwfaccAdkillVideoAntiblack.user.js
// @include   http://*
// @include   https://*
// @include   about:*
// @include   chrome:*
// @include   ftp:*
// @grant   GM_xmlhttpRequest
// @run-at   document-idle
// @updateURL   https://qtxmd.googlecode.com/svn/SwfaccAdkillVideoAntiblack.user.js
// @视频反跨域,需使用代理;方式:代理服务flvr.pandora.tv端口80;通用规则*/crossdomain.xml
// @优酷源修复代理,需使用代理;方式:代理服务202.102.81.130端口80;代理规则f.youku.com或本地hosts文件添加202.102.81.130 f.youku.com (Has expired)
// ==/UserScript==

(function() {
    Function.prototype.bind = function() {
        var fn = this, args = Array.prototype.slice.call(arguments), obj = args.shift();
        return function() {
            return fn.apply(obj, args.concat(Array.prototype.slice.call(arguments)));
        }
    };

    function ADfilterBlackscreen() {};
    ADfilterBlackscreen.prototype = {
        _players: null,
        _rules: null,
        _done: null,
        get players() {
            if(!this._players) {
                this._players = {
                    'youku': 'http://qtxmd.googlecode.com/svn/swfplayer/loader_yk.swf',//loader优酷反youku跨域,需代理,方式:代理服务api.youku.com,端口80,规则v.youku.com/crossdomain.xml
                    'tudou': 'http://qtxmd.googlecode.com/svn/swfplayer/loader_td.swf',//loader土豆反youku跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则v.youku.com/crossdomain.xml
                    'tudou_out': 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_out.swf',//tudou反out&portal跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
                    'tudou_olc': 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_olc.swf',//tudou反olc跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
                    'tudou_sp': 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_sp.swf',//tudou反sp跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
                    'ku6': 'http://qtxmd.googlecode.com/svn/swfplayer/ku6.swf',
                    'ku6_out': 'http://qtxmd.googlecode.com/svn/swfplayer/ku6_out.swf',
                    'iqiyi': 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi.swf',//iqiyi反qiyi跨域,需代理,方式:代理服务nl.rcd.iqiyi.com,端口80,规则data.video.qiyi.com/crossdomain.xml规则sf.video.qiyi.com/crossdomain.xml
                    'iqiyi5': 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi5.swf',//iqiyi反iqiyi5跨域,需代理,方式:代理服务nl.rcd.iqiyi.com,端口80,规则data.video.qiyi.com/crossdomain.xml规则sf.video.qiyi.com/crossdomain.xml
                    'iqiyi_out': 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi_out.swf',//iqiyi反out跨域,需代理,方式:代理服务nl.rcd.iqiyi.com,端口80,规则data.video.qiyi.com/crossdomain.xml规则sf.video.qiyi.com/crossdomain.xml
                    'letv': 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf',
                    'letvsdk': 'http://qtxmd.googlecode.com/svn/swfplayer/letvsdk.swf',
                    'letv_live': 'http://qtxmd.googlecode.com/svn/swfplayer/letv_live.swf',
                    'pptv': 'http://qtxmd.googlecode.com/svn/swfplayer/pptv.swf',
                    'pplive': 'http://qtxmd.googlecode.com/svn/swfplayer/pplive.swf',
                    'pps_flv': 'http://qtxmd.googlecode.com/svn/swfplayer/flvplay_s.swf',//pps反fplayer跨域,需代理,方式:代理服务ipdstat.pps.tv,端口80,规则api.ipd.pps.tv/crossdomain.xml
                    'pps': 'http://qtxmd.googlecode.com/svn/swfplayer/pps.swf',
                    'pps_out': 'http://qtxmd.googlecode.com/svn/swfplayer/pps_out.swf',//pps反sid跨域,需代理,方式:代理服务ipdstat.pps.tv,端口80,规则api.ipd.pps.tv/crossdomain.xml
                    'sina': 'http://qtxmd.googlecode.com/svn/swfplayer/sina.swf',
                    'sohu': 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf',
                    'sohu_live': 'http://qtxmd.googlecode.com/svn/swfplayer/sohu_live.swf',//sohu反live跨域,需代理,方式:代理服务v.aty.sohu.com,端口80,规则live.tv.sohu.com/crossdomain.xml
                    'TencentPlayer': 'http://static.video.qq.com/TencentPlayer.swf',
                    'KKPlayer': 'http://js.kankan.xunlei.com/player/mp4/KKPlayer2.0.swf'
                };
            }
            return this._players;
        },
        get rules() {
            if(!this._rules) {
                this._rules = {
                    'youku_youku': {
                        'find': /^http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/loaders?\.swf/i,
                        'replace': this.players['youku']
                    },
                    'youku_player': {
                        'find': /^http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/q?player[^\.]*\.swf(\?.*)?/i,
                        'replace': this.players['youku'] + '$2'
                    },
                    'youku_out': {
                        'find': /^http:\/\/player\.youku\.com\/player\.php\/.*sid\/([\w=]+).*(\/v)?\.swf.*/i,
                        'replace': this.players['youku'] + '?showAd=0&VideoIDS=$1'
                    },
                    'youku_out_par': {
                        'find': /^http:\/\/player\.youku\.com\/player\.php\/sid\/.*\/partnerid\/.*\/v.swf/i,
                        'replace': this.players['youku']
                    },
                    'tudou_tudou': {
                        'find': /^http:\/\/js\.tudouui\.com\/.*\/Portalplayer_[\d]{3}\.swf/i,
                        'replace': this.players['tudou']
                    },
                    'tudou_portal_fix': {
                        'find': /^http:\/\/js\.tudouui\.com\/.*\/Portalplayer_[\d]{2}\.swf/i,
                        'replace': this.players['tudou_olc'] + '?tvcCode=-1&swfPath=' + this.players['tudou_out']
                    },
                    'tudou_out': {
                        'find': /^http:\/\/(www\.)?tudou\.com\/.*(\/v\.swf)?/i,
                        'replace': this.players['tudou_olc'] + '?tvcCode=-1&swfPath=' + this.players['tudou_out']
                    },
                    'tudou_olc_fix': {
                        'find': /^http:\/\/js\.tudouui\.com\/bin\/.*player[^\.]*\/olc_[^.]*?\.swf.*\?(iid=\d+)/i,
                        'replace': this.players['tudou_out'] + '?tvcCode=-1&swfPath=' + this.players['tudou_olc'] + '&$1'
                    },
                    'tudou_socialplayer_fix': {
                        'find': /^http:\/\/js\.tudouui\.com\/bin\/.*SocialPlayer_[^.]*?\.swf.*\?(iid=\d+)/i,
                        'replace': this.players['tudou_out'] + '?tvcCode=-1&swfPath=' + this.players['tudou_sp'] + '&$1'
                    },
                    'tudou_nplayer_1': {
                        'find': /^http:\/\/dp\.tudou\.com\/.*nplayer[^.]*?\.swf/i,
                        'replace': this.players['tudou_olc'] + '?tvcCode=-1&swfPath=' + this.players['tudou_sp']
                    },
                    'tudou_nplayer_2': {
                        'find': /^http:\/\/js\.tudouui\.com\/.*\/nplayer[^.]*?\.swf/i,
                        'replace': this.players['tudou_olc'] + '?tvcCode=-1&swfPath=' + this.players['tudou_sp']
                    },
                    'ku6_ku6': {
                        'find': /^http:\/\/player\.ku6cdn\.com\/default\/.*\/\d+\/player\.swf/i,
                        'replace': this.players['ku6']
                    },
                    'ku6_loader': {
                        'find': /^http:\/\/player\.ku6cdn\.com\/default\/loader\/.*\/v\.swf/i,
                        'replace': this.players['ku6']
                    },
                    'ku6_pV': {
                        'find': /^http:\/\/img[\d].*\.ku6\.cn\/player\/pV([\d].*[^.]*?)\.swf/i,
                        'replace': this.players['ku6'] + '?vid=$1'
                    },
                    'ku6_out': {
                        'find': /^http:\/\/player\.ku6\.com\/(inside|refer)\/([^\/]+)\/v\.swf.*/i,
                        'replace': this.players['ku6_out'] + '?vid=$2'
                    },
                    'iqiyi_ID': {
                        'find': /^http:\/\/(www|player|dispatcher)\.(video\.)?i?qiyi\.com\/.*player.*\.swf?.*definitionID=([^\/&]+[^.]*?)/i,
                        'replace': this.players['iqiyi_out'] + '?vid=$3'
                    },
                    'iqiyi_qiyi': {
                        'find': /^http:\/\/(www|player|dispatcher)\.(video|.*)\.i?qiyi\.com\/.*\/.*player.*\.swf/i,
                        'replace': this.players['iqiyi']
                    },
                    'iqiyi_iqiyi5': {
                        'find': /^http:\/\/(www\.)?iqiyi\.com\/(player\/\d+\/player|common\/flashplayer\/\d+\/(Main)?Player_[^.]*?)\.swf/i,
                        'replace': this.players['iqiyi']
                    },
                    'iqiyi_out': {
                        'find': /^http:\/\/(player|dispatcher)\.video\.i?qiyi\.com\/(.*[\?&]vid=)?([^\/&]+).*/i,
                        'replace': this.players['iqiyi_out'] + '?vid=$3'
                    },
                    'iqiyi_duapp': {
                        'find': /^http:\/\/moedao\.duapp\.com\/i\/(.*[\?&]vid=)?([^\/&]+)\.swf/i,
                        'replace': this.players['iqiyi'] + '?vid=$1' + '$2'
                    },
                    'iqiyi_pps': {
                        'find': /^http:\/\/www\.iqiyi\.com\/common\/flashplayer\/\d+\/PPSMainPlayer_[^.]*?\.swf/i,
                        'replace': this.players['iqiyi']
                    },
                    'letv_pccs': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/newplayer\/.*Player[^\.]*\.swf(\?[^\/]+)&pccsUrl=http:\/\/www\.letv\.com\/.*\/pccs_.*.xml([^\/]+)/i,
                        'replace': this.players['letv'] + '$1' + '$2'
                    },
                    'letv_letv': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/(?!(Live|seed|Disk))(((C|S)[\w]{2,3})?(?!Live)[\w]{4}|swf)Player[^\.]*\.swf/i,
                        'replace': this.players['letv']
                    },
                    'letv_barrage': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/(acfunletv|letv-wrapper|letvbili|lbplayer)[^\.]*\.swf/i,
                        'replace': this.players['letv']
                    },
                    'letv_player': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/[^\.]*\/.*player\/(LetvPlayer|swfPlayer)[^\.]*\.swf/i,
                        'replace': this.players['letv']
                    },
                    'letv_V3LP': {
                        'find': /^http:\/\/player\.letvcdn\.com\/p\/.*\/newplayer\/V[\d]_LetvPlayer\.swf/i,
                        'replace': this.players['letv']
                    },
                    'letv_SDK': {
                        'find': /^http:\/\/player\.letvcdn\.com\/p\/.*\/newplayer\/SDKLetvPlayer\.swf/i,
                        'replace': this.players['letv']
                    },
                    'letv_vid_1': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*player\.swf\/type.*\/vid=(\d+).*/i,
                        'replace': this.players['letv'] + '?vid=$1'
                    },
                    'letv_vid_2': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*player\.swf?.*type.*(vid|id)=(\d+).*/i,
                        'replace': this.players['letv'] + '?vid=$2'
                    },
                    'letv_out': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/player\/swfplayer\.swf(\?.*)/i,
                        'replace': this.players['letv'] + '$1'
                    },
                    'letv_yuntv': {
                        'find': /^http:\/\/yuntv\.letv\.com\/bcloud\.swf|.*letv[\w]*\.com\/p\/.*\/newplayer\/bcloud\.swf/i,
                        'replace': this.players['letvsdk']
                    },
                    'letv_1': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*player[^\.]*\.swf\?v_list=[^\.]*/i,
                        'replace': this.players['letv']
                    },
                    'letv_2': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/v_list=[^\.]*\/.*\.swf/i,
                        'replace': this.players['letv']
                    },
                    'letv_3': {
                        'find': /^http:\/\/player\.hz\.letv\.com\/hzplayer\.swf\/.*v_list=[^\.]*/i,
                        'replace': this.players['letv']
                    },
                    'letv_live': {
                        'find': /^http:\/\/player\.hz\.letv\.com\/live.swf|.*letv[\w]*\.com\/.*\/[\w]LivePlayer[^\.]*\.swf/i,
                        'replace': this.players['letv_live']
                    },
                    'pptv': {
                        'find': /^http:\/\/player\.pplive\.cn\/ikan\/.*\/player4player2\.swf/i,
                        'replace': this.players['pptv']
                    },
                    'pplive': {
                        'find': /^http:\/\/player\.pplive\.cn\/live\/.*\/player4live2\.swf/i,
                        'replace': this.players['pplive']
                    },
                    'pps_iqiyi_flv': {
                        'find': /^http:\/\/(www\.)?iqiyi\.com\/player\/.*\/pps_flvplay_s\.swf?.*v=(\d+)/i,
                        'replace': this.players['pps_flv'] + '?v=$1'
                    },
                    'pps_iqiyi': {
                        'find': /^http:\/\/(www\.)?iqiyi\.com\/player\/cupid\/common\/pps_flvplay_s\.swf/i,
                        'replace': this.players['pps']
                    },
                    'pps_iqiyi_out_sid': {
                        'find': /^http:\/\/(www\.)?iqiyi\.com\/player\/.*\/pps_fplayer\.swf?.*sid=([\w]{6})([^\/]+)?/i,
                        'replace': this.players['pps_flv'] + '?url_key=$1'
                    },
                    'pps_iqiyi_out': {
                        'find': /^http:\/\/(www\.)?iqiyi\.com\/player\/cupid\/common\/pps_fplayer\.swf/i,
                        'replace': this.players['pps_out']
                    },
                    'pps': {
                        'find': /^http:\/\/player\.pps\.tv\/static\/vs\/v.*\/v\/swf\/flvplay_s\.swf/i,
                        'replace': this.players['pps']
                    },
                    'pps_out_sid': {
                        'find': /^http:\/\/player\.pps\.tv\/.*\/swf\/fplayer\.swf?.*sid=([\w]{6})([^\/]+)?/i,
                        'replace': this.players['pps_flv'] + '?url_key=$1'
                    },
                    'pps_out': {
                        'find': /^http:\/\/player\.pps\.tv\/static\/v.*\/v\/swf\/fplayer\.swf/i,
                        'replace': this.players['pps_out']
                    },
                    'pps_sid': {
                        'find': /^http:\/\/player\.pps\.tv\/player\/sid\/([\w]{6})([^\/]+)?\/v\.swf/i,
                        'replace': this.players['pps_flv'] + '?url_key=$1'
                    },
                    'sina_old-to-new_vid': {
                        'find': /^http:\/\/p\.you\.video\.sina\.com\.cn\/(player|swf)\/.*Player.*\.swf?.*(vid|vids)=(\d+)/i,
                        'replace': this.players['sina'] + '?as=0&vid=$3'
                    },
                    'sina_old-to-new_1': {
                        'find': /^http:\/\/p\.you\.video\.sina\.com\.cn\/(player|swf)\/.*Player(2014|2013|2012|2011|2010)[^.]*?\.swf/i,
                        'replace': this.players['sina'] + '?as=0'
                    },
                    'sina_old-to-new_2': {
                        'find': /^http:\/\/p\.you\.video\.sina\.com\.cn\/(player|swf)\/(?!focus).*player\.swf/i,
                        'replace': this.players['sina'] + '?as=0'
                    },
                    'sina_out-to-new_1': {
                        'find': /^http:\/\/you\.video\.sina\.com\.cn\/.*\/outplayrefer\.php\/vid=(\d+)_.*\/s\.swf/i,
                        'replace': this.players['sina'] + '?as=0&vid=$1'
                    },
                    'sina_out-to-new_2': {
                        'find': /^http:\/\/vhead\.blog\.sina\.com\.cn\/player\/outer_player\.swf?.*vid=(\d+)/i,
                        'replace': this.players['sina'] + '?as=0&vid=$1'
                    },
                    'sina_out-to-new_sinawebApi': {
                        'find': /^http:\/\/you\.video\.sina\.com\.cn\/api\/sinawebApi\/outplay\.php\/.*([^\/]+\.swf)?/i,
                        'replace': this.players['sina'] + '?as=0&actlogActive=1'
                    },
                    'sohu_main': {
                        'find': /^http:\/\/tv\.sohu\.com\/upload\/swf(\/p2p(\/yc)?)?\/(sv)?\d+\/Main\.swf/i,
                        'replace': this.players['sohu']
                    },
                    'sohu_playershell': {
                        'find': /^http:\/\/tv\.sohu\.com\/upload\/swf(\/p2p(\/yc)?)?\/(sv)?\d+\/PlayerShell\.swf/i,
                        'replace': this.players['sohu']
                    },
                    'sohu_webplayer': {
                        'find': /^http:\/\/220\.181\.90\.161\/webplayer\/(Main|PlayerShell)\.swf/i,
                        'replace': this.players['sohu_live']
                    },
                    'sohu_live': {
                        'find': /^http:\/\/tv\.sohu\.com\/upload\/swf\/live\/\d+\/(Main|PlayerShell)\.swf|61\.135\.176\.223:8080\/test\/player\/(Main|PlayerShell)\.swf/i,
                        'replace': this.players['sohu_live']
                    },
                    'sohu_out_1': {
                        'find': /^http:\/\/share\.vrs\.sohu\.com\/.*\/v.swf.*(&id=\d+)/i,
                        'replace': this.players['sohu'] + '?vid=$1'
                    },
                    'sohu_out_2': {
                        'find': /^http:\/\/share\.vrs\.sohu\.com\/(\d+)\/v\.swf/i,
                        'replace': this.players['sohu'] + '?vid=$1'
                    },
                    'sohu_out_3': {
                        'find': /^http:\/\/share\.vrs\.sohu\.com\/share\/play\/space\/\d+\/(\d+)\/.*\/v.swf/i,
                        'replace': this.players['sohu'] + '?vid=&id=$1'
                    },
                    'TencentPlayer_to_fix': {
                        'find': /^http:\/\/mat1\.qq\.com\/news\/act3\/js\/QQPlayer[^.]*?\.swf/i,
                        'replace': this.players['TencentPlayer']
                    },
                    'TencentPlayer_to_new': {
                        'find': /^http:\/\/cache\.tv\.qq\.com\/QQPlayer\.swf/i,
                        'replace': this.players['TencentPlayer']
                    },
                    'KKPlayer_to_HD': {
                        'find': /^http:\/\/js\.kankan\.xunlei\.com\/player\/mp4\/KKPlayer2\.(?!0)[\d]\.swf/i,
                        'replace': this.players['KKPlayer']
                    }
                }
            }
            return this._rules;
        },
        get done() {
            if(!this._done) {
                this._done = new Array();
            }
            return this._done;
        },
        initPreHandlers: function() {
            this.rules['iqiyi_iqiyi5']['preHandle'] = function(elem, find, replace, player) {
                if(document.querySelector('span[data-flashplayerparam-flashurl]')) {
                    replace = this.players['iqiyi5'];
                }
                this.reallyReplace.bind(this, elem, find, replace)();
            }
            this.rules['iqiyi_out']['preHandle'] = function(elem, find, replace, player) {
                var match = player.match(/(tvId|autoplay)=[\d]+/ig);
                if(match) {
                    replace += '&' + match.join('&');
                }
                this.reallyReplace.bind(this, elem, find, replace)();
            }
            this.rules['tudou_out']['preHandle'] = function(elem, find, replace, player) {
                var fn = this;
                var isFx = /firefox/i.test(navigator.userAgent);
                GM_xmlhttpRequest({
                    method: isFx ? 'HEAD' : 'GET',
                    url: isFx ? player : 'http://gesion.duapp.com/tudou.php?' + encodeURIComponent(player),
                    onload: function(response) {
                        var finalUrl = (isFx ? response.finalUrl : response.responseText);
                        var match = finalUrl.match(/(iid|youkuid|vcode|autoplay)=[^&]+/ig);
                        if(match && !/googlecode/i.test(finalUrl)) {
                            replace += '&' + match.join('&');
                            fn.reallyReplace.bind(fn, elem, find, replace)();
                        }
                    }
                });
            }
            this.rules['sina_out-to-new_sinawebApi']['preHandle'] = function(elem, find, replace, player) {
                var fn = this;
                var isFF = /firefox/i.test(navigator.userAgent);
                GM_xmlhttpRequest({
                    method: isFF ? 'HEAD' : 'GET',
                    url: isFF ? player : 'http://query.yahooapis.com/v1/public/yql?format=json&q=' + encodeURIComponent('use"http://qtxmd.googlecode.com/svn/xmlscript/tudou_redirect.yql.xml" as tudou; select * from tudou where url="' + player + '" and referer="' + window.location.href + '"'),
                    onload: function(response) {
                        var finalUrl = (isFF ? response.finalUrl : response.responseText);
                        var match = finalUrl.match(/(autoplay|vid)=[^&]+/ig);
                        if(match && !/googlecode/i.test(finalUrl)) {
                            replace += '&' + match.join('&');
                            fn.reallyReplace.bind(fn, elem, find, replace)();
                        }
                    }
                });
            }
            this.rules['sohu_main']['preHandle'] = function(elem, find, replace, player) {
                if(document.location.host.match(/live.tv.sohu.com/)) {
                    replace = this.players['sohu_live'];
                }
                this.reallyReplace.bind(this, elem, find, replace)();
            }
        },
        addAnimations: function() {
            var style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = 'object,embed{\
-webkit-animation-duration:.001s;-webkit-animation-name:playerInserted;\
-ms-animation-duration:.001s;-ms-animation-name:playerInserted;\
-o-animation-duration:.001s;-o-animation-name:playerInserted;\
animation-duration:.001s;animation-name:playerInserted;}\
@-webkit-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
@-ms-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
@-o-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}\
@keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}';
            document.getElementsByTagName('head')[0].appendChild(style);
        },
        animationsHandler: function(e) {
            if(e.animationName === 'playerInserted') {
                this.replace(e.target);
            }
        },
        replace: function(elem) {
            if(this.done.indexOf(elem) != -1) return;
            this.done.push(elem);

            var player = elem.data || elem.src;
            if(!player) return;

            var i, find, replace, isReplacing = false;
            for(i in this.rules) {
                find = this.rules[i]['find'];
                if(find.test(player)) {
                    replace = this.rules[i]['replace'];
                    if('function' === typeof this.rules[i]['preHandle']) {
                        isReplacing = true;
                        this.rules[i]['preHandle'].bind(this, elem, find, replace, player)();
                    }
                    if(!isReplacing) {
                        this.reallyReplace.bind(this, elem, find, replace)();
                    }
                    break;
                }
            }
        },
        reallyReplace: function(elem, find, replace) {
            elem.data && (elem.data = elem.data.replace(find, replace)) || elem.src && ((elem.src = elem.src.replace(find, replace)) && (elem.style.display = 'block'));
            this.reloadPlugin(elem);
        },
        reloadPlugin: function(elem) {
            var nextSibling = elem.nextSibling;
            var parentNode = elem.parentNode;
            parentNode.removeChild(elem);
            var newElem = elem.cloneNode(true);
            this.done.push(newElem);
            if(nextSibling) {
                parentNode.insertBefore(newElem, nextSibling);
            } else {
                parentNode.appendChild(newElem);
            }
        },
        init: function() {
            this.initPreHandlers();

            var handler = this.animationsHandler.bind(this);

            document.body.addEventListener('webkitAnimationStart', handler, false);
            document.body.addEventListener('msAnimationStart', handler, false);
            document.body.addEventListener('oAnimationStart', handler, false);
            document.body.addEventListener('animationstart', handler, false);

            this.addAnimations();
        }
    };

    new ADfilterBlackscreen().init();
})();

var wmodeValue = 'gpu';
var force_all = true;
var force_direct_gpu = true;
var wmodeValue = 'direct';

setTimeout(function () {
  var objects = document.getElementsByTagName('object');
  var embeds = document.getElementsByTagName('embed');
  var has_wmode;
  var toggle = function (o) {
    if (o) {
      var display = o.style.display;
      o.style.display = 'none';
      setTimeout(function () {
        o.style.display = '';
      }, 0);
    }
  };
  if (objects.length > 0) {
    for (var i = 0; i < objects.length; i++) {
      has_wmode = false;
      for (var ii = 0; ii < objects[i].childNodes.length; ii++) {
        if (objects[i].childNodes[ii].name && objects[i].childNodes[ii].name.toLowerCase() == 'wmode' || objects[i].childNodes[ii].name == 'wMode') {
          has_wmode = true;
          if (force_all) {
            objects[i].childNodes[ii].value = wmodeValue;
            toggle(objects[i]);
          } 
          else if (force_direct_gpu && objects[i].childNodes[ii].value == 'direct') {
            objects[i].childNodes[ii].value = wmodeValue;
            toggle(objects[i]);
          }
          break;
        }
      }
      if (!has_wmode) {
        var param = document.createElement('param');
        param.name = 'wmode';
        param.value = wmodeValue;
        objects[i].appendChild(param);
        toggle(objects[i]);
      }
    }
  }
  if (embeds.length > 0) {
    for (var i = 0; i < embeds.length; i++) {
      if (force_all) {
        embeds[i].setAttribute('wmode', wmodeValue);
        toggle(embeds[i]);
      } 
      else if (force_direct_gpu && embeds[i].getAttribute('wmode') == 'direct') {
        embeds[i].setAttribute('wmode', wmodeValue);
        toggle(embeds[i]);
      } 
      else if (!embeds[i].getAttribute('wmode')) {
        embeds[i].setAttribute('wmode', wmodeValue);
        toggle(embeds[i]);
      }
    }
  }
}, 100);

(function() {

	var parentArray = new Array(),
		player = null,
		fullStatus = false,
		backStyle = new Array(),
		childStyle = new Array(),
		playerStyle, parent, type, iframe;

	function init() {
		createButton();
		window.addEventListener("keydown", function(e) {
			if (e.ctrlKey && e.keyCode == 13 || e.altKey && e.keyCode == 13) {
				playerControl();
			}
		}, false);
		console.log('Video Player Toothbrush 初始化');
	}

	function createButton() {
		var leftButton = document.createElement('span');
		leftButton.id = 'leftFullStackButton';
		leftButton.onclick = function() {
			playerControl();
		};
		document.body.appendChild(leftButton);
		addStyle('#leftFullStackButton{position:fixed;width:1px;height:100%;top:0;left:0;z-index:2147483646;}');
		var rightButton = document.createElement('span');
		rightButton.id = 'rightFullStackButton';
		rightButton.onclick = function() {
			playerControl();
		};
		document.body.appendChild(rightButton);
		addStyle('#rightFullStackButton{position:fixed;width:1px;height:100%;top:0;right:0;z-index:2147483646;}');
	}

	function addStyle(css) {
		var style = document.createElement('style');
		style.type = 'text/css';
		var node = document.createTextNode(css);
		style.appendChild(node);
		document.head.appendChild(style);
	}

	function playerControl() {
		if (!player) {
			checkPlayer();
			fullWin();
		} else {
			if (!fullStatus) {
				switch (type) {
					case 'object':
						var objectArray = parent.getElementsByTagName('object');
						checkObject(objectArray);
						break;
					case 'embed':
						var embedArray = parent.getElementsByTagName('embed');
						checkEmbed(embedArray);
						break;
					case 'html5':
						var html5Array = parent.getElementsByTagName('html5');
						checkHtml5(html5Array);
						break;
					case 'innerIframe':
						var innerIframeArray = parent.getElementsByTagName('innerIframe');
						checkInnerIframe(innerIframeArray);
						break;
					case 'iframe':
						var iframeArray = parent.getElementsByTagName('iframe');
						checkIframe(iframeArray);
						break;
				}
				fullWin();
			} else {
				smallWin();
			}
		}
	}

	function checkPlayer() {
		var objectArray = document.getElementsByTagName('object');
		console.log('object数量' + objectArray.length);
		checkObject(objectArray);
		if (!player) {
			console.log('未找到object播放器');
			var embedArray = document.getElementsByTagName('embed');
			console.log('embed数量' + embedArray.length);
			checkEmbed(embedArray);
		}
		if (!player) {
			console.log('未找到embed播放器');
			var html5Array = document.getElementsByTagName('video');
			console.log('html5视频数量' + html5Array.length);
			checkHtml5(html5Array);
		}
		if (!player) {
			console.log('未找到html5播放器');
			var iframeArray = document.getElementsByTagName('iframe');
			console.log('iframe数量' + iframeArray.length);
			checkIframe(iframeArray);
		}
		if (!player) {
			console.log('未找到iframe引用的播放器');
			return;
		}
		parent = player.parentNode;
		var full = player;
		while (full = full.parentNode) {
			if (full.getAttribute && full.nodeName != 'OBJECT') {
				full.setAttribute('full_stack', true);
				parentArray.push(full);
			}
			if (full.nodeName == 'HTML') {
				break;
			}
		}
		if (type == 'innerIframe') {
			full = iframe;
			do {
				if (full.getAttribute) {
					full.setAttribute('full_stack', true);
					parentArray.push(full);
				}
				if (full.nodeName == 'HTML') {
					break;
				}
			} while (full = full.parentNode);
		}
	}

	function checkObject(objectArray) {
		if (objectArray.length > 0) {
			for (i = 0; i < objectArray.length; i++) {
				console.log('object播放器检测' + i);
				if (objectArray[i].type == 'application/x-shockwave-flash' && objectArray[i].offsetWidth > 256 && objectArray[i].offsetHeight > 128) {
					player = objectArray[i];
					type = 'object';
					console.log('找到object播放器');
					break;
				}
			}
		}
	}

	function checkEmbed(embedArray) {
		if (embedArray.length > 0) {
			for (i = 0; i < embedArray.length; i++) {
				console.log('embed播放器检测' + i);
				if (embedArray[i].type == 'application/x-shockwave-flash' && embedArray[i].offsetWidth > 256 && embedArray[i].offsetHeight > 128) {
					player = embedArray[i];
					type = 'embed';
					console.log('找到embed播放器');
					break;
				}
			}
		}
	}

	function checkHtml5(html5Array) {
		if (html5Array.length > 0) {
			for (i = 0; i < html5Array.length; i++) {
				console.log('html5播放器检测' + i);
				if (html5Array[i].offsetWidth > 256 && html5Array[i].offsetHeight > 128) {
					player = html5Array[i];
					type = 'html5';
					console.log('找到html5播放器');
					break;
				}
			}
		}
	}

	function checkIframe(iframeArray) {
		if (iframeArray.length > 0) {
			for (var i = 0; i < iframeArray.length; i++) {
				if (iframeArray[i].offsetWidth > 256 && iframeArray[i].offsetHeight > 128) {
					try {
						var objectArray = iframeArray[i].contentWindow.document.getElementsByTagName('object');
						console.log('iframe' + i + '中object数量' + objectArray.length);
						checkObject(objectArray);
						if (!player) {
							console.log('iframe' + i + '中未找到object播放器');
							var embedArray = iframeArray[i].contentWindow.document.getElementsByTagName('embed');
							console.log('iframe' + i + '中embed数量' + embedArray.length);
							checkEmbed(embedArray);
						}
						if (player) {
							iframe = iframeArray[i];
							type = 'innerIframe';
							break;
						} else {
							console.log('未找到iframe' + i + '中的播放器');
						}
					} catch (e) {
						player = iframeArray[i];
						type = 'iframe';
						console.log('找到可能通过iframe跨域引用的播放器');
						break;
					}
				}
			}
		}
	}

	function fullWin() {
		if (!fullStatus) {
			window.addEventListener('resize', fullWin, false);
			playerStyle = player.style.cssText;
		}
		for (var i = 0; i < parentArray.length; i++) {
			if (!fullStatus) {
				backStyle[i] = parentArray[i].style.cssText;
			}
			parentArray[i].style.cssText = 'width:100% !important;height:100% !important;max-width:100% !important;margin:0px !important;padding:0px !important;top:0px !important;left:0px !important;z-index:2147483645 !important;overflow:hidden !important;position:fixed !important;background:#000 !important;';
		}
		player.style.cssText = 'width:calc(100% - 2px) !important;height:100% !important;z-index:2147483645 !important;left:1px !important;position:relative !important;visibility:visible !important;'
		console.log('网页全屏完成');
		fullStatus = true;
	}

	function smallWin() {
		window.removeEventListener('resize', fullWin, false);
		for (var i = 0; i < parentArray.length; i++) {
			parentArray[i].style.cssText = backStyle[i];
		}
		player.style.cssText = playerStyle;
		console.log('恢复完成');
		fullStatus = false;
	}

	init();
})();

(function() {
	Function.prototype.bind = function() {
		var fn = this,
			arg = Array.prototype.slice.call(arguments),
			obj = arg.shift();
		return function() {
			return fn.apply(obj, arg.concat(Array.prototype.slice.call(arguments)));
		};
	};

	var AntiBlackscreenPlus = {
		host: [],
		list: [],
		done: [],
		rule: [{ // youku_youku //loader优酷反youku跨域,需代理,方式:代理服务api.youku.com,端口80,规则v.youku.com/crossdomain.xml
			find: /^http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/loaders?\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/loader_yk.swf'
		}, { // youku_player //loader优酷反youku跨域,需代理,方式:代理服务api.youku.com,端口80,规则v.youku.com/crossdomain.xml
			find: /^http:\/\/static\.youku\.com(\/v[\d\.]+)?\/v\/swf\/q?player[^\.]*\.swf(\?.*)?/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/loader_yk.swf' + '$2'
		}, { // youku_out //loader优酷反youku跨域,需代理,方式:代理服务api.youku.com,端口80,规则v.youku.com/crossdomain.xml
			find: /^http:\/\/player\.youku\.com\/player\.php\/.*sid\/([\w=]+).*(\/v)?\.swf.*/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/loader_yk.swf' + '?showAd=0&VideoIDS=$1'
		}, { // youku_out_par //loader优酷反youku跨域,需代理,方式:代理服务api.youku.com,端口80,规则v.youku.com/crossdomain.xml
			find: /^http:\/\/player\.youku\.com\/player\.php\/sid\/.*\/partnerid\/.*\/v.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/loader_yk.swf'
		}, { // tudou_tudou //loader土豆反youku跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则v.youku.com/crossdomain.xml
			find: /^http:\/\/js\.tudouui\.com\/.*\/Portalplayer_[\d]{3}\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/loader_td.swf'
		}, { // tudou_portal_fix //tudou反out&portal跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
			find: /^http:\/\/js\.tudouui\.com\/.*\/Portalplayer_[\d]{2}\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_olc.swf' + '?tvcCode=-1&swfPath=' + 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_out.swf'
		}, { // tudou_out //tudou反youku跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则v.youku.com/crossdomain.xml //tudou反olc&sp跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
			find: /^http:\/\/(www\.)?tudou\.com\/.*(\/v\.swf)?/i,
			replace: function(el, find) {
				var isFF = /firefox/i.test(navigator.userAgent),
					player = el.data || el.src;
				GM_xmlhttpRequest({
					url: isFF ? player : 'http://gesion.duapp.com/tudou.php?' + encodeURIComponent(player),
					method: isFF ? 'HEAD' : 'GET',
					onload: function(response) {
						var url = isFF ? response.finalUrl : response.responseText;
						if (url) {
							url = url.replace(/http:\/\/js\.tudouui\.com\/.*?\/olc_[^.]*?\.swf\?.*(iid=[\w]*)/i, this.host + 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_olc.swf?tvcCode=-1&' + '$1');
							url = url.replace(/http:\/\/js\.tudouui\.com\/.*?\/SocialPlayer_[^.]*?\.swf([^\/]+)tvcCode=-?.*/i, this.host + 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_out.swf' + '$1' + 'autoPlay=true');
							this.Reload.bind(this, el, find, url)();
						}
					}.bind(this)
				});
			}
		}, { // tudou_olc_fix //tudou反olc跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
			find: /^http:\/\/js\.tudouui\.com\/bin\/.*player[^\.]*\/olc_[^.]*?\.swf.*\?(iid=\d+)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_out.swf' + '?tvcCode=-1&swfPath=' + 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_olc.swf' + '&$1'
		}, { // tudou_socialplayer_fix //tudou反sp跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
			find: /^http:\/\/js\.tudouui\.com\/bin\/.*SocialPlayer_[^.]*?\.swf.*\?(iid=\d+)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_out.swf' + '?tvcCode=-1&swfPath=' + 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_sp.swf' + '&$1'
		}, { // tudou_nplayer_1 //tudou反olc&sp跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
			find: /^http:\/\/dp\.tudou\.com\/.*nplayer[^.]*?\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_olc.swf' + '?tvcCode=-1&swfPath=' + 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_sp.swf'
		}, { // tudou_nplayer_2 //tudou反olc&sp跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
			find: /^http:\/\/js\.tudouui\.com\/.*\/nplayer[^.]*?\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_olc.swf' + '?tvcCode=-1&swfPath=' + 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_sp.swf'
		}, { // ku6_ku6
			find: /^http:\/\/player\.ku6cdn\.com\/default\/.*\/\d+\/player\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/ku6.swf'
		}, { // ku6_loader
			find: /^http:\/\/player\.ku6cdn\.com\/default\/loader\/.*\/v\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/ku6.swf'
		}, { // ku6_pV
			find: /^http:\/\/img[\d].*\.ku6\.cn\/player\/pV([\d].*[^.]*?)\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/ku6.swf' + '?vid=$1'
		}, { // ku6_out
			find: /^http:\/\/player\.ku6\.com\/(inside|refer)\/([^\/]+)\/v\.swf.*/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/ku6.swf' + '?vid=$2'
		}, { // iqiyi_ID //iqiyi反out跨域,需代理,方式:代理服务nl.rcd.iqiyi.com,端口80,规则data.video.qiyi.com/crossdomain.xml规则sf.video.qiyi.com/crossdomain.xml
			find: /^http:\/\/(www|player|dispatcher)\.(video\.)?i?qiyi\.com\/.*player.*\.swf?.*definitionID=([^\/&]+[^.]*?)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi_out.swf' + '?vid=$3'
		}, { // iqiyi_qiyi //iqiyi反qiyi跨域,需代理,方式:代理服务nl.rcd.iqiyi.com,端口80,规则data.video.qiyi.com/crossdomain.xml规则sf.video.qiyi.com/crossdomain.xml
			find: /^http:\/\/(www|player|dispatcher)\.(video|.*)\.i?qiyi\.com\/.*\/.*player.*\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi.swf'
		}, { // iqiyi_iqiyi5 //iqiyi反qiyi5跨域,需代理,方式:代理服务nl.rcd.iqiyi.com,端口80,规则data.video.qiyi.com/crossdomain.xml规则sf.video.qiyi.com/crossdomain.xml
			find: /^http:\/\/(www\.)?iqiyi\.com\/(player\/\d+\/player|common\/flashplayer\/\d+\/(Main)?Player_[^.]*?)\.swf/i,
			replace: function(el, find) {
				var url = document.querySelector('span[data-flashplayerparam-flashurl]') ? 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi5.swf' : 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi.swf';
				this.Reload.bind(this, el, find, this.host + url)();
			}
		}, { // iqiyi_out //iqiyi反out跨域,需代理,方式:代理服务nl.rcd.iqiyi.com,端口80,规则data.video.qiyi.com/crossdomain.xml规则sf.video.qiyi.com/crossdomain.xml
			find: /^http:\/\/(player|dispatcher)\.video\.i?qiyi\.com\/(.*[\?&]vid=)?([^\/&]+).*/i,
			replace: function(el, find) {
				var url = 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi_out.swf?vid=$3',
					match = (el.data || el.src).match(/(tvId|autoplay)=[\d]+/ig);
				if (match)
					url += '&' + match.join('&');

				this.Reload.bind(this, el, find, this.host + url)();
			}
		}, { // iqiyi_duapp
			find: /^http:\/\/moedao\.duapp\.com\/i\/(.*[\?&]vid=)?([^\/&]+)\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi.swf' + '?vid=$1' + '$2'
		}, { // iqiyi_pps
			find: /^http:\/\/www\.iqiyi\.com\/common\/flashplayer\/\d+\/PPSMainPlayer_[^.]*?\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/iqiyi.swf'
		}, { // letv_pccs
			find: /^http:\/\/.*letv[\w]*\.com\/.*\/newplayer\/.*Player[^\.]*\.swf(\?[^\/]+)&pccsUrl=http:\/\/www\.letv\.com\/.*\/pccs_.*.xml([^\/]+)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf' + '$1' + '$2'
		}, { // letv_letv
			find: /^http:\/\/.*letv[\w]*\.com\/.*\/(?!(Live|seed|Disk))(((C|S)[\w]{2,3})?(?!Live)[\w]{4}|swf)Player[^\.]*\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf'
		}, { // letv_barrage
			find: /^http:\/\/.*letv[\w]*\.com\/.*\/(acfunletv|letv-wrapper|letvbili|lbplayer)[^\.]*\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf'
		}, { // letv_player
			find: /^http:\/\/.*letv[\w]*\.com\/[^\.]*\/.*player\/(LetvPlayer|swfPlayer)[^\.]*\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf'
		}, { // letv_V3LP
			find: /^http:\/\/player\.letvcdn\.com\/p\/.*\/newplayer\/V[\d]_LetvPlayer\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf'
		}, { // letv_SDK
			find: /^http:\/\/player\.letvcdn\.com\/p\/.*\/newplayer\/SDKLetvPlayer\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf'
		}, { // letv_vid_1
			find: /^http:\/\/.*letv[\w]*\.com\/.*player\.swf\/type.*\/vid=(\d+).*/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf' + '?vid=$1'
		}, { // letv_vid_2
			find: /^http:\/\/.*letv[\w]*\.com\/.*player\.swf?.*type.*(vid|id)=(\d+).*/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf' + '?vid=$2'
		}, { // letv_out
			find: /^http:\/\/.*letv[\w]*\.com\/player\/swfplayer\.swf(\?.*)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf' + '$1'
		}, { // letv_yuntv
			find: /^http:\/\/yuntv\.letv\.com\/bcloud\.swf|.*letv[\w]*\.com\/p\/.*\/newplayer\/bcloud\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letvsdk.swf'
		}, { // letv_1
			find: /^http:\/\/.*letv[\w]*\.com\/.*player[^\.]*\.swf\?v_list=[^\.]*/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf'
		}, { // letv_2
			find: /^http:\/\/.*letv[\w]*\.com\/.*\/v_list=[^\.]*\/.*\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf'
		}, { // letv_3
			find: /^http:\/\/player\.hz\.letv\.com\/hzplayer\.swf\/.*v_list=[^\.]*/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf'
		}, { // letv_live
			find: /^http:\/\/player\.hz\.letv\.com\/live.swf|.*letv[\w]*\.com\/.*\/[\w]LivePlayer[^\.]*\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv_live.swf'
		}, { // pptv
			find: /^http:\/\/player\.pplive\.cn\/ikan\/.*\/player4player2\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/pptv.swf'
		}, { // pplive
			find: /^http:\/\/player\.pplive\.cn\/live\/.*\/player4live2\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/pplive.swf'
		}, { // pps_iqiyi_flv
			find: /^http:\/\/(www\.)?iqiyi\.com\/player\/.*\/pps_flvplay_s\.swf?.*v=(\d+)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/flvplay_s.swf' + '?v=$1'
		}, { // pps_iqiyi
			find: /^http:\/\/(www\.)?iqiyi\.com\/player\/cupid\/common\/pps_flvplay_s\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/pps.swf'
		}, { // pps_iqiyi_out_sid //pps反fplayer跨域,需代理,方式:代理服务ipdstat.pps.tv,端口80,规则api.ipd.pps.tv/crossdomain.xml
			find: /^http:\/\/(www\.)?iqiyi\.com\/player\/.*\/pps_fplayer\.swf?.*sid=([\w]{6})([^\/]+)?/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/flvplay_s.swf' + '?url_key=$1'
		}, { // pps_iqiyi_out
			find: /^http:\/\/(www\.)?iqiyi\.com\/player\/cupid\/common\/pps_fplayer\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/pps_out.swf'
		}, { // pps
			find: /^http:\/\/player\.pps\.tv\/static\/vs\/v.*\/v\/swf\/flvplay_s\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/pps.swf'
		}, { // pps_out_sid //pps反fplayer跨域,需代理,方式:代理服务ipdstat.pps.tv,端口80,规则api.ipd.pps.tv/crossdomain.xml
			find: /^http:\/\/player\.pps\.tv\/.*\/swf\/fplayer\.swf?.*sid=([\w]{6})([^\/]+)?/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/flvplay_s.swf' + '?url_key=$1'
		}, { // pps_out
			find: /^http:\/\/player\.pps\.tv\/static\/v.*\/v\/swf\/fplayer\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/pps_out.swf'
		}, { // pps_sid //pps反sid跨域,需代理,方式:代理服务ipdstat.pps.tv,端口80,规则api.ipd.pps.tv/crossdomain.xml
			find: /^http:\/\/player\.pps\.tv\/player\/sid\/([\w]{6})([^\/]+)?\/v\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/flvplay_s.swf' + '?url_key=$1'
		}, { // sina_old-to-new_vid
			find: /^http:\/\/p\.you\.video\.sina\.com\.cn\/(player|swf)\/.*Player.*\.swf?.*(vid|vids)=(\d+)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sina.swf' + '?as=0&vid=$3'
		}, { // sina_old-to-new_1
			find: /^http:\/\/p\.you\.video\.sina\.com\.cn\/(player|swf)\/.*Player(2014|2013|2012|2011|2010)[^.]*?\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sina.swf' + '?as=0'
		}, { // sina_old-to-new_2
			find: /^http:\/\/p\.you\.video\.sina\.com\.cn\/(player|swf)\/(?!focus).*player\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sina.swf' + '?as=0'
		}, { // sina_out-to-new_1
			find: /^http:\/\/you\.video\.sina\.com\.cn\/.*\/outplayrefer\.php\/vid=(\d+)_.*\/s\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sina.swf' + '?as=0&vid=$1'
		}, { // sina_out-to-new_2
			find: /^http:\/\/vhead\.blog\.sina\.com\.cn\/player\/outer_player\.swf?.*vid=(\d+)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sina.swf' + '?as=0&vid=$1'
		}, { // sina_out-to-new_sinawebApi
			find: /^http:\/\/you\.video\.sina\.com\.cn\/api\/sinawebApi\/outplay\.php\/.*([^\/]+\.swf)?/i,
			replace: function(el, find) {
				var isFx = /firefox/i.test(navigator.userAgent),
					player = el.data || el.src;
				GM_xmlhttpRequest({
					url: isFx ? player : 'http://gesion.duapp.com/tudou.php?' + encodeURIComponent(player),
					method: isFx ? 'HEAD' : 'GET',
					onload: function(response) {
						var url = isFx ? response.finalUrl : response.responseText;
						if (url) {
							url = url.replace(/http:\/\/p\.you\.video\.sina\.com\.cn\/swf\/quotePlayer([\d]{8})_V([\w]{9})\.swf\?.*(&vid=\d+&)-?.*/i, this.host + 'http://qtxmd.googlecode.com/svn/swfplayer/sina.swf?as=0&actlogActive=1' + '$3' + 'autoPlay=1');
							this.Reload.bind(this, el, find, url)();
						}
					}.bind(this)
				});
			}
		}, { // sohu_main //sohu反live跨域,需代理,方式:代理服务v.aty.sohu.com,端口80,规则live.tv.sohu.com/crossdomain.xml
			find: /^http:\/\/tv\.sohu\.com\/upload\/swf(\/p2p(\/yc)?)?\/(sv)?\d+\/Main\.swf/i,
			replace: function(el, find) {
				var url = document.location.host.match(/live.tv.sohu.com/) ? 'http://qtxmd.googlecode.com/svn/swfplayer/sohu_live.swf' : 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf';
				this.Reload.bind(this, el, find, this.host + url)();
			}
		}, { // sohu_playershell
			find: /^http:\/\/tv\.sohu\.com\/upload\/swf(\/p2p(\/yc)?)?\/(sv)?\d+\/PlayerShell\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf'
		}, { // sohu_webplayer
			find: /^http:\/\/220\.181\.90\.161\/webplayer\/(Main|PlayerShell)\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu_live.swf'
		}, { // sohu_live //sohu直播反live跨域,需代理,方式:代理服务v.aty.sohu.com,端口80,规则live.tv.sohu.com/crossdomain.xml
			find: /^http:\/\/tv\.sohu\.com\/upload\/swf\/live\/\d+\/(Main|PlayerShell)\.swf|61\.135\.176\.223:8080\/test\/player\/(Main|PlayerShell)\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu_live.swf'
		}, { // sohu_out_1
			find: /^http:\/\/share\.vrs\.sohu\.com\/.*\/v.swf.*(&id=\d+)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf' + '?vid=$1'
		}, { // sohu_out_2
			find: /^http:\/\/share\.vrs\.sohu\.com\/(\d+)\/v\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf' + '?vid=$1'
		}, { // sohu_out_3
			find: /^http:\/\/share\.vrs\.sohu\.com\/share\/play\/space\/\d+\/(\d+)\/.*\/v.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf' + '?vid=&id=$1'
		}, { // TencentPlayer_to_fix
			find: /^http:\/\/mat1\.qq\.com\/news\/act3\/js\/QQPlayer[^.]*?\.swf/i,
			replace: 'http://static.video.qq.com/TencentPlayer.swf'
		}, { // TencentPlayer_to_new
			find: /^http:\/\/cache\.tv\.qq\.com\/QQPlayer\.swf/i,
			replace: 'http://static.video.qq.com/TencentPlayer.swf'
		}, { // KKPlayer_to_HD
			find: /^http:\/\/js\.kankan\.xunlei\.com\/player\/mp4\/KKPlayer2\.(?!0)[\d]\.swf/i,
			replace: 'http://js.kankan.xunlei.com/player/mp4/KKPlayer2.0.swf'
		}],

		style: 'object,embed{-webkit-animation-duration:.001s;-webkit-animation-name:playerInserted;-ms-animation-duration:.001s;-ms-animation-name:playerInserted;-o-animation-duration:.001s;-o-animation-name:playerInserted;animation-duration:.001s;animation-name:playerInserted;}@-webkit-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}@-ms-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}@-o-keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}@keyframes playerInserted{from{opacity:0.99;}to{opacity:1;}}',

		Handler: function(e) {
			if (e.animationName != 'playerInserted')
				return;

			var el = e.target;
			if (this.done.indexOf(el) != -1)
				return;

			this.done.push(el);

			var player = el.data || el.src;
			if (!player)
				return;
			for (var i in this.rule) {
				var find = this.rule[i]['find'];
				if (find.test(player)) {
					var replace = this.rule[i]['replace'];
					typeof replace == 'function' ? this.list.push(replace.bind(this, el, find)) : this.Reload.bind(this, el, find, this.host + replace)();
				}
			}
		},

		Reload: function(el, find, replace) {
			el.data && (el.data = el.data.replace(find, replace)) || el.src && ((el.src = el.src.replace(find, replace)) && (el.style.display = 'block'));
			var next = el.nextSibling,
				node = el.parentNode,
				elem = el.cloneNode(true);
			this.done.push(elem);
			if (node) {
				node.removeChild(el);
				next ? node.insertBefore(elem, next) : node.appendChild(elem);
			}
		},

		Style: function(css) {
			var style = document.createElement('style');
			style.setAttribute('type', 'text/css');
			style.innerHTML = css || this.style;
			document.getElementsByTagName('head')[0].appendChild(style);
		},

		Timer: function() {
			setInterval(function() {
				this.list.length && this.list.shift()();
			}.bind(this), 200);
		},

		Init: function() {
			var events = ['webkitAnimationStart', 'msAnimationStart', 'oAnimationStart', 'animationstart'];
			for (var i in events)
				document.addEventListener(events[i], this.Handler.bind(this), false);

			this.Style();
			this.Timer();
		}
	};

	AntiBlackscreenPlus.Init();
})();