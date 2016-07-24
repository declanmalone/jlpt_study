if (self.CavalryLogger) { CavalryLogger.start_js(["KPSi6"]); }

__d('EgoAdsObjectSet',['csx','DOM'],function a(b,c,d,e,f,g,h){if(c.__markCompiled)c.__markCompiled();function i(){'use strict';this._allEgoUnits=[];this._egoUnits=[];}i.prototype.init=function(k){'use strict';this._allEgoUnits=k;this._egoUnits=[];this._allEgoUnits.forEach(function(l){var m=j(l);if(!m||!m.holdout)this._egoUnits.push(l);},this);};i.prototype.getCount=function(){'use strict';return this._egoUnits.length;};i.prototype.forEach=function(k,l){'use strict';this._egoUnits.forEach(k,l);};i.prototype.getUnit=function(k){'use strict';return this._egoUnits[k];};i.prototype.getHoldoutAdIDsForSpace=function(k,l){'use strict';if(!k||!l)return [];var m=[];for(var n=0;k>0&&n<this._allEgoUnits.length;n++){var o=this._allEgoUnits[n],p=l(o),q=j(o);if(k>=p&&q&&q.holdout)m.push(q.adid);k-=p;}return m;};i.prototype.getHoldoutAdIDsForNumAds=function(k){'use strict';k=Math.min(k,this._allEgoUnits.length);var l=[];for(var m=0;m<k;m++){var n=this._allEgoUnits[m],o=j(n);if(o&&o.holdout)l.push(o.adid);}return l;};function j(k){var l=c('DOM').scry(k,"div._4u8")[0],m=l&&l.getAttribute('data-ad');return m&&JSON.parse(m)||undefined;}f.exports=i;},null);
__d('DesktopHscrollUnitEventConstants',[],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();f.exports={HSCROLL_ITEM_INSERTED_EVENT:'DesktopHScrollUnit/itemInserted',HSCROLL_ITEM_SHOWN_EVENT:'DesktopHScrollUnit/itemShown',HSCROLL_ITEM_HIDE_EVENT:'DesktopHScrollUnit/HideIndividualItem',HSCROLL_ITEM_SCROLL_BEFORE_XOUT_EVENT:'DesktopHScrollUnit/scrollItemBeforeXout',HSCROLL_ITEM_UNHIDE_EVENT:'DesktopHScrollUnit/unhideIndividualItem',HSCROLL_LAST_ITEM_NFX_ACTION_TAKEN:'logLastAdXout',HSCROLL_PAGER_ITEM_HIDE_EVENT:'onXoutIndividualItem'};},null);
__d('LinkshimAsyncLink',['$','AsyncSignal','DOM','UserAgent_DEPRECATED','LinkshimHandlerConfig'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h={addTrackingToken:function(i,j){i.setAttribute('data-xt',j.token);},setupWithTrackingTokenReference:function(i,j){var k='xt='+j.token,l=i.href.split('#'),m=l[0].indexOf('?')!==-1,n=m?l[0].replace(/([\?|&]xt=[^&]*)/,'')+'&'+k+(l[1]||''):i.href+='?'+k;i.href=n;var o=i.onmousedown;i.onmousedown=function(p){h.swap(this,n);i.href=i.href.replace(/([\?|&]sig=[^&]*)/,'')+'&sig='+Math.floor(Math.random()*65535+65536);if(typeof o==='function')o();};},swap:function(i,j){var k=c('UserAgent_DEPRECATED').ie()<=8;if(k){var l=c('DOM').create('wbr',{},null);c('DOM').appendContent(i,l);}i.href=j;if(k)c('DOM').remove(l);},referrer_log:function(i,j,k){var l=c('$')('meta_referrer');l.content=c('LinkshimHandlerConfig').switched_meta_referrer_policy;h.swap(i,j);setTimeout(function(){l.content=c('LinkshimHandlerConfig').default_meta_referrer_policy;new (c('AsyncSignal'))(k,{}).send();},100);}};f.exports=h;},null);
__d('legacy:dom-asynclinkshim',['LinkshimAsyncLink'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();b.LinkshimAsyncLink=c('LinkshimAsyncLink');},3);
__d("cancelAnimationFramePolyfill",[],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||b.mozCancelAnimationFrame||b.oCancelAnimationFrame||b.msCancelAnimationFrame||b.clearTimeout;f.exports=h;},null);
__d('cancelAnimationFrame',['TimerStorage','cancelAnimationFramePolyfill'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();f.exports=function(){for(var h=arguments.length,i=Array(h),j=0;j<h;j++)i[j]=arguments[j];c('TimerStorage').unset(c('TimerStorage').ANIMATION_FRAME,i[0]);return Function.prototype.apply.call(c('cancelAnimationFramePolyfill'),b,i);};},null);
__d('FeedTrackingAsync',['Arbiter','Run','collectDataAttributes'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h;f.exports.init=function(){if(h)return;h=c('Arbiter').subscribe('AsyncRequest/send',function(i,j){var k=j.request,l=k.getRelativeTo();if(l){var m=k.getData(),n=c('collectDataAttributes')(l,['ft']);if(n.ft&&Object.keys(n.ft).length)Object.assign(m,n);}});c('Run').onLeave(function(){h.unsubscribe();h=null;});};},null);
__d('BookmarkFeedSorter',['Run'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h,i={init:function(j){h=j;c('Run').onLeave(function(){h=null;});},setChecked:function(j){if(h)h.setValue(j);}};f.exports=i;},null);
__d('tickerPhoteSnowLiftOpenStatus',['ArbiterMixin'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h='CheckIsOpen',i={registerOpenChecker:function(j){return i.subscribe(h,function(k,l){if(j())l.is_Open=true;});},checkIsOpen:function(){var j={is_Open:false};i.inform(h,j);return j.is_Open;}};Object.assign(i,c('ArbiterMixin'));f.exports=i;},null);
__d('ChatTabViewEvents',['Arbiter'],function a(b,c,d,e,f,g){'use strict';if(c.__markCompiled)c.__markCompiled();f.exports=new (c('Arbiter'))();},null);
__d("ScriptPathState",["Arbiter"],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h,i,j,k,l=100,m={setIsUIPageletRequest:function(n){j=n;},setUserURISampleRate:function(n){k=n;},reset:function(){h=null;i=false;j=false;},_shouldUpdateScriptPath:function(){return i&&!j;},_shouldSendURI:function(){return Math.random()<k;},getParams:function(){var n={};if(m._shouldUpdateScriptPath()){if(m._shouldSendURI()&&h!==null)n.user_uri=h.substring(0,l);}else n.no_script_path=1;return n;}};c("Arbiter").subscribe("pre_page_transition",function(n,o){i=true;h=o.to.getUnqualifiedURI().toString();});f.exports=b.ScriptPathState=m;},null);
__d('AjaxPipeRequest',['Arbiter','AsyncRequest','BigPipe','CSS','DOM','Env','PageEvents','PageletSet','ScriptPathState','URI','ge','goOrReplace','performance','performanceAbsoluteNow'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h,i=0;function j(m,n){var o=c('ge')(m);if(!o)return;if(!n)o.style.minHeight='100px';var p=c('PageletSet').getPageletIDs();for(var q=0;q<p.length;q++){var r=p[q];if(c('DOM').contains(o,r))c('PageletSet').removePagelet(r);}c('DOM').empty(o);c('Arbiter').inform('pagelet/destroy',{id:null,root:o});}function k(m,n){var o=c('ge')(m);if(o&&!n)o.style.minHeight='100px';}function l(m,n){'use strict';this._uri=m;this._query_data=n;this._request=new (c('AsyncRequest'))();this._canvas_id=null;this._allow_cross_page_transition=true;this._arbiter=new (c('Arbiter'))();this._requestID=i++;}l.prototype.setCanvasId=function(m){'use strict';this._canvas_id=m;return this;};l.prototype.setURI=function(m){'use strict';this._uri=m;return this;};l.prototype.setData=function(m){'use strict';this._query_data=m;return this;};l.prototype.getData=function(m){'use strict';return this._query_data;};l.prototype.setAllowCrossPageTransition=function(m){'use strict';this._allow_cross_page_transition=m;return this;};l.prototype.setAppend=function(m){'use strict';this._append=m;return this;};l.prototype.send=function(){'use strict';this._arbiter.inform(c('PageEvents').AJAXPIPE_SEND,{rid:this._requestID,quickling:!!this._isQuickling,ts:c('performanceAbsoluteNow')()},c('Arbiter').BEHAVIOR_PERSISTENT);var m={ajaxpipe:1,ajaxpipe_token:c('Env').ajaxpipe_token};Object.assign(m,c('ScriptPathState').getParams());c('ScriptPathState').reset();this._request.setOption('useIframeTransport',true).setURI(this._uri).setData(Object.assign(m,this._query_data)).setPreBootloadHandler(this._preBootloadHandler.bind(this)).setInitialHandler(this._onInitialResponse.bind(this)).setHandler(this._onResponse.bind(this)).setMethod('GET').setReadOnly(true).setAllowCrossPageTransition(this._allow_cross_page_transition).setAllowIrrelevantRequests(this._allowIrrelevantRequests);if(this._automatic){this._relevantRequest=h;}else h=this._request;if(this._isQuickling){var n=c('performance').clearResourceTimings||c('performance').webkitClearResourceTimings;if(n)n.call(c('performance'));}this._request.send();return this;};l.prototype._preBootloadFirstResponse=function(m){'use strict';return false;};l.prototype._fireDomContentCallback=function(){'use strict';this._arbiter.inform(c('PageEvents').AJAXPIPE_DOMREADY,true,c('Arbiter').BEHAVIOR_STATE);};l.prototype._fireOnloadCallback=function(){'use strict';if(window.console&&console.timeStamp)console.timeStamp('perf_trace {"name": "e2e",'+' "parent": "PageEvents.AJAXPIPE_ONLOAD"}');this._arbiter.inform(c('PageEvents').AJAXPIPE_ONLOAD,{lid:this.pipe.lid,rid:this._requestID,ts:c('performanceAbsoluteNow')()},c('Arbiter').BEHAVIOR_STATE);};l.prototype._isRelevant=function(m){'use strict';return this._request==h||this._automatic&&this._relevantRequest==h||this._jsNonBlock||h&&h._allowIrrelevantRequests;};l.prototype._preBootloadHandler=function(m){'use strict';var n=m.getPayload();if(!n||n.redirect||!this._isRelevant(m))return false;var o=false;if(m.is_first){!this._append&&!this._displayCallback&&j(this._canvas_id,this._constHeight);o=this._preBootloadFirstResponse(m);this.pipe=new (c('BigPipe'))({arbiter:this._arbiter,rootNodeID:this._canvas_id,lid:this._request.lid,rid:this._requestID,isAjax:true,domContentCallback:this._fireDomContentCallback.bind(this),onloadCallback:this._fireOnloadCallback.bind(this),domContentEvt:c('PageEvents').AJAXPIPE_DOMREADY,onloadEvt:c('PageEvents').AJAXPIPE_ONLOAD,jsNonBlock:this._jsNonBlock,automatic:this._automatic,displayCallback:this._displayCallback,allowIrrelevantRequests:this._allowIrrelevantRequests});}return o;};l.prototype._redirect=function(m){'use strict';if(m.redirect){if(m.force||!this.isPageActive(m.redirect)){var n=['ajaxpipe','ajaxpipe_token'].concat(this.getSanitizedParameters());c('goOrReplace')(window.location,new (c('URI'))(m.redirect).removeQueryData(n),true);}else{var o=b.PageTransitions;o.go(m.redirect,true);}return true;}else return false;};l.prototype.isPageActive=function(m){'use strict';return true;};l.prototype.getSanitizedParameters=function(){'use strict';return [];};l.prototype._versionCheck=function(m){'use strict';return true;};l.prototype._onInitialResponse=function(m){'use strict';var n=m.getPayload();if(!this._isRelevant(m))return false;if(!n)return true;if(this._redirect(n)||!this._versionCheck(n))return false;return true;};l.prototype._processFirstResponse=function(m){'use strict';var n=m.getPayload();if(c('ge')(this._canvas_id)&&n.canvas_class!=null)c('CSS').setClass(this._canvas_id,n.canvas_class);};l.prototype.setFirstResponseCallback=function(m){'use strict';this._firstResponseCallback=m;return this;};l.prototype.setFirstResponseHandler=function(m){'use strict';this._processFirstResponse=m;return this;};l.prototype._onResponse=function(m){'use strict';var n=m.payload;if(!this._isRelevant(m))return c('AsyncRequest').suppressOnloadToken;if(m.is_first){this._processFirstResponse(m);this._firstResponseCallback&&this._firstResponseCallback();n.provides=n.provides||[];n.provides.push('uipage_onload');}if(n){if('content' in n.content&&this._canvas_id!==null){if(this._append)n.append=this._canvas_id;var o=n.content.content;delete n.content.content;n.content[this._canvas_id]=o;}if(n.secondFlushPayload&&this.pipe.setSecondFlushPayload){this.pipe.setSecondFlushPayload(n.secondFlushPayload);}else if(n.secondFlushResources||n.secondFlushHashes){this.pipe.setSecondFlushResources(n.secondFlushResources,n.secondFlushHashes);}else this.pipe.onPageletArrive(n);}if(m.is_last)k(this._canvas_id,this._constHeight);return c('AsyncRequest').suppressOnloadToken;};l.prototype.setNectarModuleDataSafe=function(m){'use strict';this._request.setNectarModuleDataSafe(m);return this;};l.prototype.setFinallyHandler=function(m){'use strict';this._request.setFinallyHandler(m);return this;};l.prototype.setErrorHandler=function(m){'use strict';this._request.setErrorHandler(m);return this;};l.prototype.setTransportErrorHandler=function(m){'use strict';this._request.setTransportErrorHandler(m);return this;};l.prototype.abort=function(){'use strict';this._request.abort();if(h==this._request)h=null;this._request=null;return this;};l.prototype.setJSNonBlock=function(m){'use strict';this._jsNonBlock=m;return this;};l.prototype.setAutomatic=function(m){'use strict';this._automatic=m;return this;};l.prototype.setDisplayCallback=function(m){'use strict';this._displayCallback=m;return this;};l.prototype.setConstHeight=function(m){'use strict';this._constHeight=m;return this;};l.prototype.setAllowIrrelevantRequests=function(m){'use strict';this._allowIrrelevantRequests=m;return this;};l.prototype.getAsyncRequest=function(){'use strict';return this._request;};l.getCurrentRequest=function(){'use strict';return h;};l.setCurrentRequest=function(m){'use strict';h=m;};f.exports=l;},null);
__d('DocumentTitle',['Arbiter'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h=document.title,i=null,j=1500,k=[],l=0,m=null,n=false;function o(){if(k.length>0){if(!n){p(k[l].title);l=++l%k.length;}else q();}else{clearInterval(m);m=null;q();}}function p(s){document.title=s;n=true;}function q(){r.set(i||h,true);n=false;}var r={get:function(){return h;},set:function(s,t){document.title=s;if(!t){h=s;i=null;c('Arbiter').inform('update_title',s);}else i=s;},blink:function(s){var t={title:s};k.push(t);if(m===null)m=setInterval(o,j);return {stop:function(){var u=k.indexOf(t);if(u>=0){k.splice(u,1);if(l>u){l--;}else if(l==u&&l==k.length)l=0;}}};}};f.exports=r;},null);
__d("Ease",[],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h={makePowerOut:function(i){var j=h.makePowerIn(i);return function(k){return 1-j(1-k);};},makePowerIn:function(i){return function(j){var k=Math.pow(j,i);return (k*10000|0)/10000;};},makePowerInOut:function(i){var j=h.makePowerIn(i),k=h.makePowerOut(i);return function(l){return l<.5?.5*j(l*2):.5*k(l*2-1)+.5;};},expoOut:function(i){return 1-Math.pow(2,-10*i);},expoIn:function(i){return 1-h.expoOut(1-i);},expoInOut:function(i){return i<.5?.5*h.expoIn(i*2):.5*h.expoOut(i*2-1)+.5;},sineOut:function(i){return Math.sin(i*Math.PI*.5);},sineIn:function(i){return 1-Math.cos(i*Math.PI*.5);},sineInOut:function(i){return -.5*(Math.cos(Math.PI*i)-1);},circOut:function(i){i--;return Math.sqrt(1-i*i);},circIn:function(i){return 1-h.circOut(1-i);},circInOut:function(i){return i<.5?.5*h.circIn(i*2):.5*h.circOut(i*2-1)+.5;},bounceOut:function(i){if(i<1/2.75){return 7.5625*i*i;}else if(i<2/2.75){return 7.5625*(i-=1.5/2.75)*i+.75;}else if(i<2.5/2.75){return 7.5625*(i-=2.25/2.75)*i+.9375;}else return 7.5625*(i-=2.625/2.75)*i+.984375;},bounceIn:function(i){return 1-h.bounceOut(1-i);},bounceInOut:function(i){return i<.5?.5*h.bounceIn(i*2):.5*h.bounceOut(i*2-1)+.5;},makeBounceOut:function(i){i=i||1;return function(j){j=(1-Math.cos(j*Math.PI*i))*(1-j)+j;return 1-Math.abs(1-j);};},makeBounceIn:function(i){var j=h.makeBounceOut(i);return function(k){return 1-j(1-k);};},makeElasticOut:function(i,j){i<1&&(i=1);var k=Math.PI*2;return function(l){if(l===0||l===1)return l;var m=j/k*Math.asin(1/i);return i*Math.pow(2,-10*l)*Math.sin((l-m)*k/j)+1;};},makeElasticIn:function(i,j){var k=h.makeElasticOut(i,j);return function(l){return 1-k(1-l);};},makeElasticInOut:function(i,j){j*=1.5;var k=h.makeElasticIn(i,j),l=h.makeElasticOut(i,j);return function(m){return m<.5?.5*k(m*2):.5*l(m*2-1)+.5;};},makeBackOut:function(i){var j=h.makeBackIn(i);return function(k){return 1-j(1-k);};},makeBackIn:function(i){return function(j){return j*j*((i+1)*j-i);};},makeBackInOut:function(i){i*=1.525;var j=h.makeBackIn(i),k=h.makeBackOut(i);return function(l){return l<.5?.5*j(l*2):.5*k(l*2-1)+.5;};}};h.elasticOut=h.makeElasticOut(1,.3);h.elasticIn=h.makeElasticIn(1,.3);h.elasticInOut=h.makeElasticInOut(1,.3);h.backOut=h.makeBackOut(1.7);h.backIn=h.makeBackIn(1.7);h.backInOut=h.makeBackInOut(1.7);f.exports=h;},null);
__d('MenuDeprecated',['Event','Arbiter','CSS','DataStore','DOM','HTML','Keys','Parent','Style','UserAgent_DEPRECATED','emptyFunction','Run'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h='menu:mouseover',i=null;function j(t){if(c('CSS').hasClass(t,'uiMenuContainer'))return t;return c('Parent').byClass(t,'uiMenu');}function k(t){return c('Parent').byClass(t,'uiMenuItem');}function l(t){if(document.activeElement){var u=k(document.activeElement);return t.indexOf(u);}return -1;}function m(t){return c('DOM').find(t,'a.itemAnchor');}function n(t){return c('CSS').hasClass(t,'checked');}function o(t){return !c('CSS').hasClass(t,'disabled')&&c('Style').get(t,'display')!=='none';}function p(event){var t=document.activeElement;if(!t||!c('Parent').byClass(t,'uiMenu')||!c('DOM').isInputNode(t)){var u=k(event.getTarget());u&&s.focusItem(u);}}function q(t){c('UserAgent_DEPRECATED').firefox()&&m(t).blur();s.inform('select',{menu:j(t),item:t});}var r=function(){r=c('emptyFunction');var t={};t.click=function(event){var u=k(event.getTarget());if(u&&o(u)){q(u);var v=m(u),w=v.href,x=v.getAttribute('rel');return x&&x!=='ignore'||w&&w.charAt(w.length-1)!=='#';}};t.keydown=function(event){var u=event.getTarget();if(event.getModifiers().any)return;if(!i||c('DOM').isInputNode(u))return;var v=c('Event').getKeyCode(event),w;switch(v){case c('Keys').UP:case c('Keys').DOWN:var x=s.getEnabledItems(i);w=l(x);s.focusItem(x[w+(v===c('Keys').UP?-1:1)]);return false;case c('Keys').SPACE:var y=k(u);if(y){q(y);event.prevent();}break;default:var z=String.fromCharCode(v).toLowerCase(),aa=s.getEnabledItems(i);w=l(aa);var ba=w,ca=aa.length;while(~w&&(ba=++ba%ca)!==w||!~w&&++ba<ca){var da=s.getItemLabel(aa[ba]);if(da&&da.charAt(0).toLowerCase()===z){s.focusItem(aa[ba]);return false;}}}};c('Event').listen(document.body,t);},s=Object.assign(new (c('Arbiter'))(),{focusItem:function(t){if(t&&o(t)){this._removeSelected(j(t));c('CSS').addClass(t,'selected');m(t).focus();}},getEnabledItems:function(t){return s.getItems(t).filter(o);},getCheckedItems:function(t){return s.getItems(t).filter(n);},getItems:function(t){return c('DOM').scry(t,'li.uiMenuItem');},getItemLabel:function(t){return t.getAttribute('data-label',2)||'';},isItemChecked:function(t){return c('CSS').hasClass(t,'checked');},autoregister:function(t,u,v){t.subscribe('show',function(){s.register(u,v);});t.subscribe('hide',function(){s.unregister(u);});},register:function(t,u){t=j(t);r();if(!c('DataStore').get(t,h))c('DataStore').set(t,h,c('Event').listen(t,'mouseover',p));if(u!==false)i=t;},setItemEnabled:function(t,u){if(!u&&!c('DOM').scry(t,'span.disabledAnchor')[0])c('DOM').appendContent(t,c('DOM').create('span',{className:c('DOM').find(t,'a').className+' disabledAnchor'},c('HTML')(m(t).innerHTML)));c('CSS').conditionClass(t,'disabled',!u);},toggleItem:function(t){var u=!s.isItemChecked(t);s.setItemChecked(t,u);},setItemChecked:function(t,u){c('CSS').conditionClass(t,'checked',u);m(t).setAttribute('aria-checked',u);},unregister:function(t){t=j(t);var u=c('DataStore').remove(t,h);u&&u.remove();i=null;this._removeSelected(t);},_removeSelected:function(t){s.getItems(t).filter(function(u){return c('CSS').hasClass(u,'selected');}).forEach(function(u){c('CSS').removeClass(u,'selected');});}});f.exports=s;},null);
__d('FbFeedAccessible',['csx','cx','fbt','invariant','AccessibilityConfig','Arbiter','ARIA','BootloadedComponent.react','CSS','DataAttributeUtils','DOMQuery','JSResource','LitestandMessages','React','ReactDOM','SubscriptionsHandler','ge','getOrCreateDOMID'],function a(b,c,d,e,f,g,h,i,j,k){if(c.__markCompiled)c.__markCompiled();var l='Accessibility/StoriesRequested',m='Accessibility/StoriesLoaded',n='Accessibility/StoryContentInserted',o='Accessibility/SubstreamInserted',p=void 0,q=void 0,r={init:function(s){p=s;if(c('AccessibilityConfig').a11yNewsfeedStoryEnumeration){var t=new (c('SubscriptionsHandler'))();t.addSubscriptions(c('Arbiter').subscribe(c('LitestandMessages').STORIES_REQUESTED,this._onStoriesRequested.bind(this)),c('Arbiter').subscribe(c('LitestandMessages').STORIES_INSERTED,this._onInsertedSubstream.bind(this)),c('Arbiter').subscribe(c('LitestandMessages').NEWER_STORIES_INSERTED,this._onInsertedSubstream.bind(this)),c('Arbiter').subscribe(m,this._processStoriesLoaded.bind(this)),c('Arbiter').subscribe(l,this._processStoriesRequested.bind(this)),c('Arbiter').subscribe(n,this._processStoryContentInserted.bind(this)),c('Arbiter').subscribe(o,this._processInsertedSubstream.bind(this)));this._enumerateStories();}},informStoryContentInserted:function(s){c('Arbiter').inform(n,s);this.setAriaLabelledBy(s);},setAriaLabelledBy:function(s){var t=c('ge')(s),u;if(t&&this._isStory(t)){if(t.getAttribute('aria-labelledby'))return;u=this._filterForElement(t,["._4gns","._5pbw",".timestampContent",".uiStreamSponsoredLink","._5pbx"]);if(u.length>0)t.setAttribute('aria-labelledby',u.map(function(v){return c('getOrCreateDOMID')(v);}).join(' '));}},_getStories:function(s){return c('DOMQuery').scry(s||p,"._5jmm");},_onInsertedSubstream:function(s,t){if(t&&t.substream_id)c('Arbiter').inform(o,t.substream_id);},_onStoriesRequested:function(){c('Arbiter').inform(l);},_setEnumerationText:function(s,t,u){var v=c('React').createElement(c('BootloadedComponent.react'),{bootloadLoader:c('JSResource')('FbFeedPager.react').__setRef('FbFeedAccessible'),bootloadPlaceholder:c('React').createElement('div',null),position:t,total:u,'aria-hidden':'true'});c('ReactDOM').render(v,s);},_enumerateStories:function(){var s=this._getStories(p);q=s.length;s.forEach(function(t,u){this._enumerateStory(t,u+=1);}.bind(this));},_enumerateSubstream:function(s){var t=this._getStories();q=t.length;var u=this._getStories(c('ge')(s)),v=u.length||0;for(var w=0;w<v;w++)this._registerStoryEnumerationPosition(u[w],q-v+(w+1),w+1);},_enumerateStory:function(s,t){!this._isStory(s)?k(0):void 0;if(t>0){var u=c('DOMQuery').scry(s,"._4gns");if(u&&u[0])this._setEnumerationText(u[0],t,q);}},_processStoriesLoaded:function(){c('ARIA').notify(j._("More stories loaded."));},_processStoriesRequested:function(){c('ARIA').notify(j._("More stories requested."));},_processInsertedSubstream:function(s,t){this._enumerateSubstream(t);this._enumerateStories();},_processStoryContentInserted:function(s,t){var u=void 0,v=c('ge')(t);if(v)u=JSON.parse(c('DataAttributeUtils').getDataFt(v));if(u&&u.ordinal_position){var w=u.ordinal_position.split(':'),x=w[0],y=w[1];x=parseInt(x,10);y=parseInt(y,10);this._enumerateStory(v,x);if(y===1)c('Arbiter').inform(m);}},_registerStoryEnumerationPosition:function(s,t,u){var v=JSON.parse(c('DataAttributeUtils').getDataFt(s));if(v){v.ordinal_position=t+':'+u;c('DataAttributeUtils').setDataFt(s,JSON.stringify(v));}},_isStory:function(s){return c('CSS').matchesSelector(s,"._5jmm");},_filterForElement:function(s,t){return t.map(function(u){return c('DOMQuery').scry(s||document,u)[0];}).filter(function(u){return !!u;});}};f.exports=r;},null);
__d('LikeConfirmer',['AsyncDialog','AsyncRequest'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h=false,i=false,j={likeContent:function(){},like:function(k,l){this.likeContent=k;if(i)return;if(h){this.likeContent();}else{var m=new (c('AsyncRequest'))().setURI('/like/confirm_like.php').setRelativeTo(l);c('AsyncDialog').send(m,function(n){i=true;n.subscribe('hide',this.onCloseLikeConfirmDialog.bind(this));n.setCausalElement(l);}.bind(this));}return false;},isShowingConfirmation:function(){return i;},onCloseLikeConfirmDialog:function(){i=false;},likeSkipConfirmation:function(k){h=k;this.likeContent();}};f.exports=j;},null);
__d("UIPageletContentCache",[],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();var h={cache:{},getContent:function(i){if(i in this.cache)return this.cache[i];return null;},setContent:function(i,j){this.cache[i]=j;}};f.exports=h;},null);
__d('UIPagelet',['ActorURI','AjaxPipeRequest','AsyncRequest','DOM','HTML','ScriptPathState','UIPageletContentCache','URI','emptyFunction','ge','isElementNode'],function a(b,c,d,e,f,g){if(c.__markCompiled)c.__markCompiled();function h(i,j,k){'use strict';var l=i&&c('isElementNode')(i)?i.id:i;this._id=l||null;this._element=c('ge')(i||c('DOM').create('div'));this._src=j||null;this._context_data=k||{};this._data={};this._handler=c('emptyFunction');this._request=null;this._use_ajaxpipe=false;this._use_post_request=false;this._is_bundle=true;this._allow_cross_page_transition=false;this._append=false;this._cache_content=false;this._content_cache_key='';}h.prototype.getElement=function(){'use strict';return this._element;};h.prototype.setHandler=function(i){'use strict';this._handler=i;return this;};h.prototype.go=function(i,j){'use strict';if(arguments.length>=2||typeof i=='string'){this._src=i;this._data=j||{};}else if(arguments.length==1)this._data=i;this.refresh();return this;};h.prototype.setAllowCrossPageTransition=function(i){'use strict';this._allow_cross_page_transition=i;return this;};h.prototype.setBundleOption=function(i){'use strict';this._is_bundle=i;return this;};h.prototype.setErrorHandler=function(i){'use strict';this._errorHandler=i;return this;};h.prototype.setTransportErrorHandler=function(i){'use strict';this.transportErrorHandler=i;return this;};h.prototype.refresh=function(){'use strict';if(this._use_ajaxpipe){c('ScriptPathState').setIsUIPageletRequest(true);this._request=new (c('AjaxPipeRequest'))();this._request.setCanvasId(this._id).setAppend(this._append).setConstHeight(this._constHeight).setJSNonBlock(this._jsNonblock).setAutomatic(this._automatic).setDisplayCallback(this._displayCallback).setFinallyHandler(this._finallyHandler).setAllowIrrelevantRequests(this._allowIrrelevantRequests);if(this._errorHandler)this._request.setErrorHandler(this._errorHandler);if(this.transportErrorHandler)this._request.setTransportErrorHandler(this.transportErrorHandler);}else{if(this._cache_content){var i=c('UIPageletContentCache').getContent(this._content_cache_key);if(i!==null){this.handleContent(i);return this;}}var j=function(n){this._request=null;var o=c('HTML')(n.getPayload());this.handleContent(o);if(this._cache_content)c('UIPageletContentCache').setContent(this._content_cache_key,o);}.bind(this),k=this._displayCallback,l=this._finallyHandler;this._request=new (c('AsyncRequest'))().setMethod('GET').setReadOnly(true).setOption('bundle',this._is_bundle).setHandler(function(n){if(k){k(j.bind(null,n));}else j(n);l&&l();});if(this._errorHandler)this._request.setErrorHandler(this._errorHandler);if(this.transportErrorHandler)this._request.setTransportErrorHandler(this.transportErrorHandler);if(this._use_post_request)this._request.setMethod('POST');}var m=babelHelpers['extends']({},this._context_data,this._data);if(this._actorID)m[c('ActorURI').PARAMETER_ACTOR]=this._actorID;this._request.setURI(this._src).setAllowCrossPageTransition(this._allow_cross_page_transition).setData({data:JSON.stringify(m)}).send();return this;};h.prototype.handleContent=function(i){'use strict';if(this._append){c('DOM').appendContent(this._element,i);}else c('DOM').setContent(this._element,i);this._handler();};h.prototype.cancel=function(){'use strict';if(this._request)this._request.abort();};h.prototype.setUseAjaxPipe=function(i){'use strict';this._use_ajaxpipe=!!i;return this;};h.prototype.setUsePostRequest=function(i){'use strict';this._use_post_request=!!i;return this;};h.prototype.setAppend=function(i){'use strict';this._append=!!i;return this;};h.prototype.setJSNonBlock=function(i){'use strict';this._jsNonblock=!!i;return this;};h.prototype.setAutomatic=function(i){'use strict';this._automatic=!!i;return this;};h.prototype.setDisplayCallback=function(i){'use strict';this._displayCallback=i;return this;};h.prototype.setConstHeight=function(i){'use strict';this._constHeight=!!i;return this;};h.prototype.setFinallyHandler=function(i){'use strict';this._finallyHandler=i;return this;};h.prototype.setAllowIrrelevantRequests=function(i){'use strict';this._allowIrrelevantRequests=i;return this;};h.prototype.setActorID=function(i){'use strict';this._actorID=i;return this;};h.prototype.setCacheContent=function(i){'use strict';this._cache_content=i;return this;};h.prototype.setContentCacheKey=function(i){'use strict';this._content_cache_key=i;return this;};h.appendToInline=function(i,j){'use strict';var k=c('ge')(i),l=c('ge')(j);if(k&&l){while(l.firstChild)c('DOM').appendContent(k,l.firstChild);c('DOM').remove(l);}};h.loadFromEndpoint=function(i,j,k,l){'use strict';l=l||{};var m='/ajax/pagelet/generic.php/'+i;if(l.intern)m='/intern'+m;var n=new (c('URI'))(m.replace(/\/+/g,'/'));if(l.subdomain)n.setSubdomain(l.subdomain);var o=false,p='';if(l.contentCacheKey){o=true;p=i+','+String(l.contentCacheKey);}var q=new h(j,n,k).setUseAjaxPipe(l.usePipe).setBundleOption(l.bundle!==false).setAppend(l.append).setJSNonBlock(l.jsNonblock).setAutomatic(l.automatic).setDisplayCallback(l.displayCallback).setConstHeight(l.constHeight).setAllowCrossPageTransition(l.crossPage).setFinallyHandler(l.finallyHandler||c('emptyFunction')).setErrorHandler(l.errorHandler).setTransportErrorHandler(l.transportErrorHandler).setAllowIrrelevantRequests(l.allowIrrelevantRequests).setActorID(l.actorID).setCacheContent(o).setContentCacheKey(p).setUsePostRequest(l.usePostRequest);l.handler&&q.setHandler(l.handler);q.go();return q;};h.loadFromEndpointBatched=function(i,j,k){'use strict';var l=i.slice(0,k),m=i.slice(k);if(m.length>0){var n=l[l.length-1],o=c('emptyFunction');if(n.options&&n.options.finallyHandler)o=n.options.finallyHandler;n.options=babelHelpers['extends']({},n.options,{finallyHandler:function(){o();window.setTimeout(function(){h.loadFromEndpointBatched(m,j,k);},1);}});}l.forEach(function(p){h.loadFromEndpoint(p.controller,p.target_element,p.data,babelHelpers['extends']({},p.options,j,{bundle:true}));});};f.exports=h;},null);
__d("XFeedEgoImpressionLoggingController",["XController"],function a(b,c,d,e,f,g){c.__markCompiled&&c.__markCompiled();f.exports=c("XController").create("\/ego\/feed\/logging\/impression\/",{ego_id:{type:"Int",required:true},qid:{type:"Int",required:true},mf_story_key:{type:"Int",required:true}});},null);
__d("XPlatformXOutableElementController",["XController"],function a(b,c,d,e,f,g){c.__markCompiled&&c.__markCompiled();f.exports=c("XController").create("\/platform\/async\/xoutelement\/",{type:{type:"Enum",required:true,enumType:0},fbid:{type:"Int",required:true}});},null);