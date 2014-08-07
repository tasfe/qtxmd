// ==UserScript==
// @name   ADfilter-Blackscreen
// @namespace   Qingtian
// @author   Qingtian
// @description   ADfilter-Blackscreen
// @version   1.6.9Beta+2014.08.07pre
// @icon   http://code.google.com/p/qtxmd/logo?cct=1391043764
// @charset   utf-8
// @downloadURL   http://qtxmd.googlecode.com/svn/xmlscript/ADfilter-Blackscreen.user.js
// @include   http://*
// @include   https://*
// @include   about:*
// @include   chrome:*
// @include   ftp:*
// @grant   GM_xmlhttpRequest
// @run-at   document-idle
// @updateURL   https://qtxmd.googlecode.com/svn/xmlscript/ADfilter-Blackscreen.user.js
// @视频反跨域,需使用代理;方式:代理服务flvr.ptvcdn.net端口80;通用规则*/crossdomain.xml
// @优酷源修复代理,需使用代理;方式:代理服务202.102.81.130端口80;代理规则f.youku.com或本地hosts文件添加202.102.81.130 f.youku.com
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
                    'pptv': 'http://qtxmd.googlecode.com/svn/swfplayer/pptv.swf',
                    'pplive': 'http://qtxmd.googlecode.com/svn/swfplayer/pplive.swf',
                    'pps_flv': 'http://qtxmd.googlecode.com/svn/swfplayer/flvplay_s.swf',//pps反fplayer跨域,需代理,方式:代理服务ipdstat.pps.tv,端口80,规则api.ipd.pps.tv/crossdomain.xml
                    'pps': 'http://qtxmd.googlecode.com/svn/swfplayer/pps.swf',
                    'pps_out': 'http://qtxmd.googlecode.com/svn/swfplayer/pps_out.swf',//pps反sid跨域,需代理,方式:代理服务ipdstat.pps.tv,端口80,规则api.ipd.pps.tv/crossdomain.xml
                    'sina': 'http://qtxmd.googlecode.com/svn/swfplayer/sina.swf',
                    'sohu': 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf',//sohu直播反live跨域,需代理,方式:代理服务v.aty.sohu.com,端口80,规则live.tv.sohu.com/crossdomain.xml
                    'TencentPlayer': 'http://static.video.qq.com/TencentPlayer.swf',
                    'KKPlayer': 'http://js.kankan.xunlei.com/player/mp4/KKPlayer.swf'
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
                        'find': /^http:\/\/js\.tudouui\.com\/bin\/.*player[^\.]*\/olc_[^.]*?\.swf/i,
                        'replace': this.players['tudou_out'] + '?tvcCode=-1&swfPath=' + this.players['tudou_olc']
                    },
                    'tudou_socialplayer_fix': {
                        'find': /^http:\/\/js\.tudouui\.com\/bin\/.*SocialPlayer_[^.]*?\.swf/i,
                        'replace': this.players['tudou_out'] + '?tvcCode=-1&swfPath=' + this.players['tudou_sp']
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
                    'iqiyi_qiyi': {
                        'find': /^http:\/\/(www|player|dispatcher)\.(video|.*)\.i?qiyi\.com\/.*\/.*player.*\.swf/i,
                        'replace': this.players['iqiyi']
                    },
                    'iqiyi': {
                        'find': /^http:\/\/(www\.)?iqiyi\.com\/(player\/\d+\/player|common\/flashplayer\/\d+\/MainPlayer_[^.]*?)\.swf/i,
                        'replace': this.players['iqiyi']
                    },
                    'iqiyi_out': {
                        'find': /^http:\/\/(player|dispatcher)\.video\.i?qiyi\.com\/(.*[\?&]vid=)?([^\/&]+).*/i,
                        'replace': this.players['iqiyi_out'] + '?vid=$3'
                    },
                    'letv_pccs': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/newplayer\/.*Player[^\.]*\.swf(\?[^\/]+)&pccsUrl=http:\/\/www\.letv\.com\/.*\/pccs_.*.xml([^\/]+)/i,
                        'replace': this.players['letv'] + '$1' + '$2'
                    },
                    'letv_letv': {
                        'find': /^http:\/\/.*letv[\w]*\.com\/.*\/(?!(Live|seed))((S[\w]{2,3})?(?!Live)[\w]{4}|swf)Player[^\.]*\.swf/i,
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
                        'find': /^http:\/\/yuntv\.letv\.com\/bcloud\.swf/i,
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
                        'find': /^http:\/\/(www\.)?iqiyi\.com\/player\/.*\/pps_fplayer\.swf?.*sid=([\w]{6})[^\/]+/i,
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
                        'find': /^http:\/\/player\.pps\.tv\/.*\/swf\/fplayer\.swf?.*sid=([\w]{6})[^\/]+/i,
                        'replace': this.players['pps_flv'] + '?url_key=$1'
                    },
                    'pps_out': {
                        'find': /^http:\/\/player\.pps\.tv\/static\/v.*\/v\/swf\/fplayer\.swf/i,
                        'replace': this.players['pps_out']
                    },
                    'pps_sid': {
                        'find': /^http:\/\/player\.pps\.tv\/player\/sid\/([\w]{6})[^\/]+\/v\.swf/i,
                        'replace': this.players['pps_flv'] + '?url_key=$1'
                    },
                    'sina_old-to-new_vid': {
                        'find': /^http:\/\/p\.you\.video\.sina\.com\.cn\/(player|swf)\/.*Player.*\.swf?.*(vid|vids)=(\d+)/i,
                        'replace': this.players['sina'] + '?as=0&vid=$3'
                    },
                    'sina_old-to-new_1': {
                        'find': /^http:\/\/p\.you\.video\.sina\.com\.cn\/(player|swf)\/.*Player(2013|2012|2011|2010)[^.]*?\.swf/i,
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
                        'find': /^http:\/\/tv\.sohu\.com\/upload\/swf(\/p2p(\/yc)?)?\/\d+\/Main\.swf/i,
                        'replace': this.players['sohu']
                    },
                    'sohu_playershell': {
                        'find': /^http:\/\/tv\.sohu\.com\/upload\/swf(\/p2p(\/yc)?)?\/\d+\/PlayerShell\.swf/i,
                        'replace': this.players['sohu']
                    },
                    'sohu_live': {
                        'find': /^http:\/\/61\.135\.176\.223:8080\/test\/player\/(Main|PlayerShell)\.swf/i,
                        'replace': this.players['sohu']
                    },
                    'sohu_out_1': {
                        'find': /^http:\/\/share\.vrs\.sohu\.com\/.*\/v.swf.*(&id=\d+)/i,
                        'replace': this.players['sohu'] + '?vid=$1'
                    },
                    'sohu_out_2': {
                        'find': /^http:\/\/share\.vrs\.sohu\.com\/(\d+)\/v\.swf/i,
                        'replace': this.players['sohu'] + '?vid=$1'
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
                        'find': /^http:\/\/js\.kankan\.xunlei\.com\/player\/mp4\/KKPlayer2\.[\d]\.swf/i,
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
            this.rules['iqiyi']['preHandle'] = function(elem, find, replace, player) {
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
                    replace = this.players['sohu'];
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