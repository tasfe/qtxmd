// ==UserScript==
// @name   AntiBlackscreenPlus
// @namespace   Qingtian
// @author   Qingtian
// @description   AntiBlackscreenPlus
// @version   2.0.0Nightly
// @icon   http://code.google.com/p/qtxmd/logo?cct=1391043764
// @charset   utf-8
// @downloadURL   http://qtxmd.googlecode.com/svn/xmlscript/AntiBlackscreenPlus.user.js
// @include   http://*
// @include   https://*
// @include   about:*
// @include   chrome:*
// @include   ftp:*
// @grant   GM_xmlhttpRequest
// @run-at   document-idle
// @updateURL   https://qtxmd.googlecode.com/svn/xmlscript/AntiBlackscreenPlus.user.js
// @视频反跨域,需使用代理;方式:代理服务flvr.ptvcdn.net端口80;通用规则*/crossdomain.xml
// @优酷源修复代理,需使用代理;方式:代理服务202.102.81.130端口80;代理规则f.youku.com或本地hosts文件添加202.102.81.130 f.youku.com
// ==/UserScript==

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
			find: /^http:\/\/js\.tudouui\.com\/bin\/.*player[^\.]*\/olc_[^.]*?\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_out.swf' + '?tvcCode=-1&swfPath=' + 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_olc.swf'
		}, { // tudou_socialplayer_fix //tudou反sp跨域,需代理,方式:代理服务v2.tudou.com,端口80,规则www.tudou.com/crossdomain.xml
			find: /^http:\/\/js\.tudouui\.com\/bin\/.*SocialPlayer_[^.]*?\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_out.swf' + '?tvcCode=-1&swfPath=' + 'http://qtxmd.googlecode.com/svn/swfplayer/tudou_sp.swf'
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
		}, { // iqiyi_iqiyi //iqiyi反qiyi跨域,需代理,方式:代理服务nl.rcd.iqiyi.com,端口80,规则data.video.qiyi.com/crossdomain.xml规则sf.video.qiyi.com/crossdomain.xml
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
		}, { // letv_pccs
			find: /^http:\/\/.*letv[\w]*\.com\/.*\/newplayer\/.*Player[^\.]*\.swf(\?[^\/]+)&pccsUrl=http:\/\/www\.letv\.com\/.*\/pccs_.*.xml([^\/]+)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/letv.swf' + '$1' + '$2'
		}, { // letv_letv
			find: /^http:\/\/.*letv[\w]*\.com\/.*\/(?!(Live|seed))((S[\w]{2,3})?(?!Live)[\w]{4}|swf)Player[^\.]*\.swf/i,
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
			find: /^http:\/\/yuntv\.letv\.com\/bcloud\.swf/i,
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
			find: /^http:\/\/p\.you\.video\.sina\.com\.cn\/(player|swf)\/.*Player(2013|2012|2011|2010)[^.]*?\.swf/i,
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
				var url = document.location.host.match(/live.tv.sohu.com/) ? 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf' : 'http://qtxmd.googlecode.com/svn/swfplayer/sohu_live.swf';
				this.Reload.bind(this, el, find, this.host + url)();
			}
		}, { // sohu_playershell
			find: /^http:\/\/tv\.sohu\.com\/upload\/swf(\/p2p(\/yc)?)?\/(sv)?\d+\/PlayerShell\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf'
		}, { // sohu_live //sohu直播反live跨域,需代理,方式:代理服务v.aty.sohu.com,端口80,规则live.tv.sohu.com/crossdomain.xml
			find: /^http:\/\/61\.135\.176\.223:8080\/test\/player\/(Main|PlayerShell)\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu_live.swf'
		}, { // sohu_out_1
			find: /^http:\/\/share\.vrs\.sohu\.com\/.*\/v.swf.*(&id=\d+)/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf' + '?vid=$1'
		}, { // sohu_out_2
			find: /^http:\/\/share\.vrs\.sohu\.com\/(\d+)\/v\.swf/i,
			replace: 'http://qtxmd.googlecode.com/svn/swfplayer/sohu.swf' + '?vid=$1'
		}, { // TencentPlayer_to_fix
			find: /^http:\/\/mat1\.qq\.com\/news\/act3\/js\/QQPlayer[^.]*?\.swf/i,
			replace: 'http://static.video.qq.com/TencentPlayer.swf'
		}, { // TencentPlayer_to_new
			find: /^http:\/\/cache\.tv\.qq\.com\/QQPlayer\.swf/i,
			replace: 'http://static.video.qq.com/TencentPlayer.swf'
		}, { // KKPlayer_to_HD
			find: /^http:\/\/js\.kankan\.xunlei\.com\/player\/mp4\/KKPlayer2\.[\d]\.swf/i,
			replace: 'http://js.kankan.xunlei.com/player/mp4/KKPlayer.swf'
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