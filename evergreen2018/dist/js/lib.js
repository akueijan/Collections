;(function ($) {
  $.fn.menu = function (opts) {
    // default configuration
    var config = $.extend({}, {
      opt1: null
    }, opts);
    // main function
    function init(obj) {
      var dObj = $(obj);
      var dMenulink = dObj.find('.nav-btn');
      var dAllLink = dObj.find('.nav-menu a');
      var dMenuClose = dObj.find('.nav-close');
      dMenulink.click(function () {
        dObj.toggleClass('nav--active');
        $('body').toggleClass('_freeze');
      });
      dMenuClose.click(function () { 
        dObj.removeClass("nav--active");
        $('body').removeClass('_freeze');
      })

      dAllLink.click(function () {
        dObj.removeClass('nav--active')
        $('body').removeClass('_freeze');
      });
    }
    // initialize every element
    return this.each(function () {
      init($(this));
    });
  };
  // start
  
})(jQuery);

/* 標籤滑動感測
 * include: jqeury.min.js
 * 2015/06/918
 */
;
(function($) {
    $.fn.navscroll = function(settings) {
        var _defaultset = {
            easing: "linear",
            sec: 500,
            url_hash: false, //IE9 + 
            head_hight: 0 //px
        }
        var wait = false,
            cwait = false;
        var anchor = [];
        var _settings = $.extend(_defaultset, settings);

        var animate_scroll = function(scrolltop) {
            $("html, body").stop().animate({
                scrollTop: scrolltop - _settings.head_hight
            }, _settings.sec, _settings.linear);
        }
        var scroll_event = function ($ele) {
            console.log($ele)
            $(window).off("scroll").on("scroll", function() {
                wait = true;
                for (var x = 0; x < anchor.length; x++) {
                    var anchor_id = anchor[x].anchor;
                    if ($(document).find("[data-anchor=" + anchor_id + "]").length > 0) {
                        if (!cwait && $(window).scrollTop() >= $(document).find("[data-anchor=" + anchor_id + "]").offset().top - _settings.head_hight && $(window).scrollTop() < $(document).find("[data-anchor=" + anchor_id + "]").offset().top + $(document).find("[data-anchor=" + anchor_id + "]").height() - _settings.head_hight) {
                            if ($ele.find(".active").data("nav") != anchor[x].anchor) {
                                if (_settings.url_hash) location.hash = anchor[x].anchor;
                                $("[data-nav]").removeClass("active");
                                console.log(anchor[x].anchor, $ele.find("[data-nav=" + anchor[x].anchor + "]").addClass("active"));
                                $("[data-nav=" + anchor[x].anchor + "]").addClass("active");
                                $("[data-anchor]").removeClass("active");
                                $("[data-anchor=" + anchor[x].anchor + "]").addClass("active");
                                var callback = $("[data-anchor=" + anchor[x].anchor + "]").data("callback");
                                if (callback){
                                    var sp = callback.split("(");
                                    var fun = sp[0];
                                    var params = sp[1].replace(")", "").split(",");
                                    var fun = window[fun];
                                    fun.apply(null, params);
                                }
                            }
                            break;
                        }
                    } else {
                        console.log("%c not find " + anchor_id, "background:#000; color:red;");
                    }
                    if (x == anchor.length - 1) {
                        $ele.find("[data-nav]").removeClass("active");
                    }
                }
            });
        }
        if (_settings.url_hash) {
            var hash = location.hash.replace("#", "");
            if ("onhashchange" in window) {
                $(window).bind('hashchange', function(e) {
                    e.preventDefault();
                    hash = location.hash.replace("#", "");
                    if (!wait) {
                        animate_scroll($(document).find("[data-anchor=" + hash + "]").offset().top);
                    }
                    wait = false;
                    return false;
                });
            }
            if (hash != "" && $(document).find("[data-anchor=" + hash + "]").length > 0) {
                animate_scroll($(document).find("[data-anchor=" + hash + "]").offset().top);
            }
        }
        return this.each(function(idx) {
            var main_obj = $(this);
            var child = $(this).find("[data-nav]");
            child.each(function(inx) {
                var anchor_id = $(this).data("nav");
                $(this).click(function(e) {
                    e.preventDefault();
                    wait = true;
                    cwait = true;
                    var div_top = ($(document).find("[data-anchor=" + anchor_id + "]").length > 0) ? $(document).find("[data-anchor=" + anchor_id + "]").offset().top : 0;
                    if (_settings.url_hash) location.hash = anchor_id;
                    $("html, body").stop().animate({
                        scrollTop: div_top - _settings.head_hight
                    }, _settings.sec, _settings.linear, function() {
                        cwait = false;
                    });
                });
                obj_data = {
                    anchor: anchor_id
                }
                anchor.push(obj_data);
            });
            scroll_event($(this));
        });
    }
})(jQuery);

/*
 Copyright (c) 2009-2013 Petr Vostrel (http://petr.vostrel.cz/)
 Licensed under the MIT License (LICENSE.txt).

 jQuery Reel
 http://reel360.org
 Version: 1.3.0
 Updated: 2013-11-04

 Requires jQuery 1.6.2 or higher
*/
(function(k){var U=typeof define=="function"&&define.amd&&(define(["jquery"],k)||true),X=!U&&typeof module=="object"&&typeof module.exports=="object"&&(module.exports=k);!U&&!X&&k()})(function(){return jQuery.reel||function(k,U,X,s){function Bc(f){return n.instances.push(f[0])&&f}function Cc(f){return(n.instances=n.instances.not(Ca(f.attr(ka))))&&f}function Y(f){return n.instances.first().data(f)}function Dc(f){return"data:image/gif;base64,R0lGODlh"+f}function V(f){return"<"+f+"/>"}function x(f){return"."+
(f||"")}function Va(f){return f.replace(Da,n.cdn)}function Ea(f){return"url('"+$b(f)+"')"}function ac(f,j){return typeof j==tb?j[f]:j}function Fa(f,j,o){return ub(f,Ga(j,o))}function Ha(f,j){return H(f)*(j?-1:1)}function Wa(f){return f.touch||f.originalEvent.touches&&f.originalEvent.touches[0]||f}function vb(f){return f.originalEvent}function y(f){return f===s?0:typeof f==wb?f:f+"px"}function Ca(f){return"#"+f}function bc(f,j,o){for(;f.length<j;)f=o+f;return f}function xb(f){return bc(f,2,"0")}function $b(f){return encodeURI(decodeURI(f))}
function yb(f){return n.re.array.exec(f)?f.split(n.re.array):f}function Ec(f){return!f.parents(zb).length}function cc(f){return typeof f==wb?f:k.each(f,function(j,o){f[j]=o?+o:s})}function Ab(f){try{console.error("[ Reel ] "+f)}catch(j){}}if(k){var Z=k&&k().jquery.split(/\./);if(!Z||+(xb(Z[0])+xb(Z[1])+xb(Z[2]||""))<10602)return Ab("Too old jQuery library. Please upgrade your jQuery to version 1.6.2 or higher");var n=k.reel={version:"1.3.0",def:{frame:1,frames:36,loops:true,clickfree:false,draggable:true,
scrollable:true,steppable:true,throwable:true,wheelable:true,orientable:false,cw:false,revolution:s,stitched:0,directional:false,row:1,rows:0,rowlock:false,framelock:false,orbital:0,vertical:false,inversed:false,footage:6,spacing:0,horizontal:true,suffix:"-reel",image:s,images:"",path:"",preload:"fidelity",shy:false,speed:0,delay:0,timeout:2,duration:s,rebound:0.5,entry:s,opening:0,brake:0.23,velocity:0,tempo:36,laziness:6,cursor:s,hint:"",indicator:0,klass:"",preloader:2,area:s,attr:{},annotations:s,
responsive:false,graph:s,monitor:s},scan:function(){return k(x(z)+":not("+x(Bb)+" > "+x(z)+")").each(function(f,j){f=k(j);j=f.data();j.images=yb(j.images);var o={};k(x(dc)+"[data-for="+f.attr(ka)+"]").each(function(t,r){t=k(r);r=t.data();r.x=cc(yb(r.x));r.y=cc(yb(r.y));var g=t.attr(ka);r.node=t.removeData();o[g]=r});j.annotations=o;f.removeData().reel(j)})},fn:{reel:function(){var f=arguments,j=k(this),o=j.data(),t=f[0]||{},r=f[1];if(typeof t!="object")if(t.slice(0,1)==":")return j.trigger(t.slice(1),
r);else if(f.length==1)return o[t];else{if(r!==s){n.normal[t]&&(r=n.normal[t](r,o));if(o[t]===s)o[t]=r;else if(o[t]!==r)j.trigger(t+"Change",[s,o[t]=r])}return j}else{var g=k.extend({},n.def,t),K=[];j.filter(Xa).unreel().filter(function(){var h=k(this),e=g.attr,a=e.src||h.attr(ra),I=e.width||h.attr(L)||h.width();h=e.height||h.attr(D)||h.height();if(!a)return Ab("`src` attribute missing on target image");if(!I||!h)return Ab("Dimension(s) of the target image unknown");return true}).each(function(){var h=
k(this),e=function(c,d){return h.reel(c,d)&&a(c)},a=function(c){return h.data(c)},I={setup:function(){if(!(h.hasClass(z)&&h.parent().hasClass(Bb))){e(Ia,g);var c={src:h.attr(ra),width:h.attr(D)||null,height:h.attr(L)||null,style:h.attr($)||null,"class":h.attr(ec)||null},d=h.attr(g.attr).attr(ra),b=e(ka,h.attr(ka)||h.attr(ka,z+"-"+ +new Date).attr(ka)),i=k.extend({},h.data()),p=e(aa,g.images||[]),m=e(W,g.stitched),l=!p.length||m;l=e(Ya,g.responsive&&(Fc?true:!l));var q=e(fc,{}),u=g.loops,v=g.orbital,
E=g.revolution,ba=g.rows,ca=e(sa,Ga(g.footage,g.frames));e(Za,g.spacing);var Cb=e(D,+h.attr(D)||h.width()),Db=e(L,+h.attr(L)||h.height()),Gc=e(Ja,g.shy),gc=e(O,v&&ca||ba<=1&&p.length||g.frames),Hc=ba>1||v;e(Ka,ac("x",E)||m/2||Cb*2);e(Eb,!Hc?0:ac("y",E)||(ba>3?Db:Db/(5-ba)));ba=m?1:la(gc/ca);e(Fb,m-(u?0:Cb));e($a,0);b=Ca(b+g.suffix);u=h.attr(ec);u=!u?P:u+A;u=k(V(ta),{id:b.substr(1),"class":u+A+Bb+A+hc+"0"});u=h.wrap(u.addClass(g.klass)).addClass(z);K.push(Bc(u)[0]);u=u.parent().bind(I.instance);e(Gb,
p.length?P:g.image||d.replace(n.re.image,"$1"+g.suffix+".$2"));e(ab,k(V(ta),{"class":Hb}).appendTo("body"));e(La,k());e(ic,[]);e(J,null);e(B,null);e(Q,g.row);e(ua,0);e(Ib,ba);e(jc,g.rowlock);e(kc,g.framelock);e(bb,e(Ma,e(cb,0)));e(db,1/gc);e(lc,b);e(M,e(va,g.speed)<0);e(Na,false);e(ma,0);e(wa,g.vertical);e(da,0);e(xa,Ha(1,!g.cw&&!m));e(eb,{});e(ea,false);e(fb,e(Jb,0));e(gb,e(hb,0));e(Oa,false);e(Kb,false);e(fa,false);e(mc,g.brake);e(Lb,!!v);e(ga,g.tempo/(n.lazy?g.laziness:1));e(ya,-1);e(ib,-1);e(Pa,
g.annotations||u.unbind(x(Pa))&&{});e(Mb,1);e(nc,{attr:c,data:i});g.steppable||u.unbind("up.steppable");g.indicator||u.unbind(".indicator");C(P,{overflow:Nb,position:"relative"});l||C(P,{width:Cb,height:Db});l&&k.each(Ic,function(cd,oc){q[oc]=a(oc)});C(na+A+x(z),{display:Ob});C(x(Hb),{position:"fixed",left:y(-100),top:y(-100)},true);C(x(Hb)+A+Xa,{position:Qa,width:10,height:10},true);ha.bind(I.pool);h.trigger(Gc?"prepare":"setup")}},instance:{teardown:function(){var c=h.data(nc);h.parent().unbind(I.instance);
if(a(Ja))h.parent().unbind(jb,ia);else a($).remove()&&a(La).unbind(F);a(ab).empty();clearTimeout(Pb);clearTimeout(Qb);k(U).unbind(pc,qc);k(U).unbind(F);ha.unbind(I.pool);oa.unbind(ja);h.siblings().unbind(F).remove();kb();h.removeAttr("onloaded");Cc(h.unbind(F).removeData().unwrap().attr(c.attr).data(c.data));h.attr($)==P&&h.removeAttr($)},setup:function(){function c(q){return h.trigger("down",[Wa(q).clientX,Wa(q).clientY,q])&&q.give}function d(q,u){return!u||h.trigger("wheel",[u,q])&&q.give}var b=
h.parent().append(za()),i=e(La,k(g.area||b)),p=g.rows>1,m=g.cursor,l=m==rc?Jc:m||Kc;m=m==rc?Lc+A+"!important":s;C(A+x(z),{MozUserSelect:lb,WebkitUserSelect:lb,MozTransform:"translateZ(0)"});h.unbind(jb,ia);i.bind(Mc,c).bind(g.clickfree?Nc:Oc,c).bind(g.wheelable?Pc:null,d).bind(Qc,function(){return false});C(P,{cursor:Va(l)});C(x(Rb),{cursor:"wait"});C(x(mb)+na+x(mb)+" *",{cursor:Va(m||l)},true);if(a(Ya)){C(A+x(z),{width:"100%",height:Sb});k(U).bind(pc,qc)}g.hint&&i.attr("title",g.hint);g.indicator&&
b.append(Ra("x"));p&&g.indicator&&b.append(Ra("y"));g.monitor&&b.append(sc=k(V(ta),{"class":tc}))&&C(A+x(tc),{position:Qa,left:0,top:0})},preload:function(){function c(){var q=l.children(":not([src]):first");return q.attr(ra,q.data(ra))}var d=h.parent(),b=a(aa),i=!b.length,p=n.preload[g.preload]||n.preload[n.def.preload];b=i?[a(Gb)]:p(b.slice(0),g,a);e(da,i?0.5:0);var m=0,l=a(ab).empty();i=[];d.addClass(Rb);e($,a($)||k("<"+$+' type="text/css">'+C.rules.join("\n")+"</"+$+">").prependTo(Tb));e(Na,true);
h.trigger("stop");g.responsive&&Ub();for(h.trigger("resize",true);b.length;){p=n.substitute(g.path+b.shift(),a);k(V(Xa)).data(ra,p).appendTo(l).bind("load error abort",function(q){q.type!="load"&&h.trigger(q.type);return!Ec(d)&&h.trigger("preloaded")&&c()&&false});i.push(p)}setTimeout(function(){for(;++m<n.concurrent_requests;)c()},0);e(ic,i);e(Ja,false)},preloaded:function(){var c=a(aa).length||1,d=e(da,Ga(a(da)+1,c));d===1&&h.trigger("frameChange",[s,a(J)]);if(d===c){h.parent().removeClass(Rb);
h.trigger("loaded")}},loaded:function(){a(aa).length>1||h.css({backgroundImage:Ea(n.substitute(g.path+a(Gb),a))}).attr({src:Va(uc)});a(W)&&h.attr({src:Va(uc)});a(Kb)||e(ma,g.velocity||0);e(Na,false);pa=true},prepare:function(){h.css("display",Ob).parent().one(jb,ia)},opening:function(){if(!g.opening)return h.trigger("openingDone");e(fa,true);e(Vb,!a(va));var c=g.entry||g.speed,d=a(B),b=g.opening;e(B,d-c*b);e(ya,la(b*Y(ga)))},openingDone:function(){function c(b){return h.trigger("orient",[vb(b).alpha,
vb(b).beta,vb(b).gamma,b])&&b.give}e(Sa,false);e(fa,false);var d=nb+x(fa);ha.unbind(d,I.pool[d]);g.orientable&&k(U).bind(Rc,c);if(g.delay>0)Pb=setTimeout(function(){h.trigger("play")},g.delay*1E3);else h.trigger("play")},play:function(c,d){d=d?e(va,d):a(va)*Ha(1,a(M));(c=g.duration)&&e(ib,la(c*Y(ga)));e(M,d<0);d=e(Sa,!!d);e(Vb,!d);Aa()},reach:function(c,d,b){if(d!=a(J)){c=a(O);e(Q,la(d/c));var i=e(bb,a(J));d=e(Ma,d);d=e(cb,n.math.distance(i,d,c));b=H(b||a(va))*Ha(1,d<0);h.trigger("play",b)}},pause:function(){w()},
stop:function(){var c=e(Vb,true);e(Sa,!c)},down:function(c,d,b,i){function p(l){return h.trigger("pan",[Wa(l).clientX,Wa(l).clientY,l])&&l.give}function m(l){return h.trigger("up",[l])&&l.give}if(!(!g.clickfree&&i&&i.button!==s&&i.button!=Sc))if(g.draggable){e(ea,a(J));c=g.clickfree;e(ma,0);i=c?a(La):oa;ob=pb(a(Ka),d,b);w();kb();G=0;k(zb,oa).addClass(mb);i.bind(Tc+A+Uc,p).bind(Vc+A+Wc,m).bind(c?Xc:Yc,m)}},up:function(){e(ea,false);e(Oa,false);var c=g.throwable,d=H(Ta[0]+Ta[1])/60;N=e(ma,!c?0:c===
true?d:Ga(c,d))?1:0;w();kb();k(zb,oa).removeClass(mb);(g.clickfree?a(La):oa).unbind(ja)},pan:function(c,d,b,i){if(g.draggable&&Ua){Ua=false;w();c=g.rows;var p=g.orbital,m=!a(Oa)&&c<=1&&!p&&g.scrollable,l={x:d-ob.x,y:b-ob.y},q={x:H(l.x),y:H(l.y)};if(i&&m&&q.x<q.y)return i.give=true;if(q.x>0||q.y>0){i&&(i.give=false);G=ub(q.x,q.y);ob={x:d,y:b};i=a(Ka);m=a(eb);q=a(wa);if(!a(kc)){var u=e(B,vc(q?b-m.y:d-m.x,a(fb),i,a(gb),a(hb),a(xa),q?b-m.y:d-m.x));e(Oa,a(Oa)||a(J)!=a(ea));(l=wc(q?l.y:l.x||0))&&e(M,l<
0)}if(p&&a(Lb)){e(wa,H(b-m.y)>H(d-m.x));m=pb(i,d,b)}if(c>1&&!a(jc)){c=a(Eb);p=a(Jb);l=-p*c;e(ua,n.math.envelope(b-m.y,p,c,l,l+c,-1))}!(u%1)&&!g.loops&&pb(i,d,b)}}},wheel:function(c,d,b){if(d){qb=true;c=la(qa.sqrt(H(d))/2);c=Ha(c,d>0);d=0.0833*a(Ka);pb(d);c&&e(M,c<0);e(ma,0);e(B,vc(c,a(fb),d,a(gb),a(hb),a(xa)));b&&b.preventDefault();b&&(b.give=false);w();h.trigger("up",[b])}},orient:function(c,d){if(!(!Ua||R)){xc=true;c=d/360;fraction=e(B,+(g.stitched||g.cw?1-c:c).toFixed(2));Ua=false}},fractionChange:function(c,
d,b){if(d===s){c=1+rb(b/a(db));d=g.rows>1;b=g.orbital;e(Lb,!!b&&(c<=b||c>=a(sa)-b+2));if(d)c+=(a(Q)-1)*a(O);e(J,c)}},tierChange:function(c,d,b){if(d===s){c=e(Q,S(Wb(b,1,g.rows)));d=a(O);b=a(J)%d||d;e(J,b+c*d-d)}},rowChange:function(c,d,b){d===s&&Xb(ua,s,b,g.rows)},frameChange:function(c,d,b){if(d===s){this.className=this.className.replace(n.re.frame_klass,hc+b);c=a(O);d=g.rows;var i=g.path,p=b%c||c,m=((b-p)/c+1-1)/(d-1),l=a(Q);!d?a(ua):Xb(ua,m,l,d);var q=Xb(B,s,p,c),u=a(sa);if(g.orbital&&a(wa)){b=
g.inversed?u+1-b:b;b+=u}var v=a(W);c=a(aa);if(!c.length||v){p=a(Za);var E=a(D);m=a(L);if(v){b=e($a,S(Wb(q,0,a(Fb)))%v);d=d<=1?0:(m+p)*(d-l);b=[y(-b),y(-d)];c=c.length>1&&c[l-1];d=n.substitute(i+c,a);c&&h.css("backgroundImage").search(d)<0&&h.css({backgroundImage:Ea(d)})}else{i=g.horizontal;l=b%u-1;l=l<0?u-1:l;b=rb((b-0.1)/u);b+=d>1?0:a(M)?0:!g.directional?0:a(Ib);b=b*((i?m:E)+p);d=l*((i?E:m)+p);b=c.length?[0,0]:i?[y(-d),y(-b)]:[y(-b),y(-d)]}h.css({backgroundPosition:b.join(A)})}else{a(Ya)&&Ub();a(da)&&
h.attr({src:$b(n.substitute(i+c[b-1],a))})}}},"frameChange.reach":function(c,d,b){if(!(!a(Ma)||d!==s)){c=n.math.distance(a(bb),b,a(O));if(H(c)>=H(a(cb))){e(J,e(Ma));e(Ma,e(cb,e(bb,0)));h.trigger("stop")}}},"imageChange imagesChange":function(){h.trigger("preload")},"fractionChange.indicator":function(c,d,b){if(g.indicator&&d===s){c=g.indicator;var i=g.orbital;d=i&&a(wa)?a(L):a(D);i=i?a(sa):g.images.length||a(O);i=la(d/i);d-=i;b=S(Wb(b,0,d));b=!g.cw||a(W)?b:d-b;Ra.$x.css(a(wa)?{left:0,top:y(b),bottom:Sb,
width:c,height:i}:{bottom:0,left:y(b),top:Sb,width:i,height:c})}},"tierChange.indicator":function(c,d,b){if(g.rows>1&&g.indicator&&d===s){var i=a(L);c=g.indicator;d=la(i/g.rows);i-=d;b=S(b*i);Ra.$y.css({left:0,top:b,width:c,height:d})}},"setup.annotations":function(){var c=h.parent();k.each(a(Pa),function(d,b){var i=typeof b.node==wb?k(b.node):b.node||{};i=i.jquery?i:k(V(ta),i);i=i.attr({id:d}).addClass(dc);var p=b.image?k(V(Xa),b.image):k(),m=b.link?k(V("a"),b.link).click(function(){h.trigger("up.annotations",
{target:m})}):k();C(Ca(d),{display:lb,position:Qa},true);b.image||b.link&&i.append(m);b.link||b.image&&i.append(p);b.link&&b.image&&i.append(m.append(p));i.appendTo(c)})},"prepare.annotations":function(){k.each(a(Pa),function(c){k(Ca(c)).hide()})},"frameChange.annotations":function(c,d){if(!(!a(da)||d!==s)){var b=a(D),i=a(W),p=a($a);k.each(a(Pa),function(m,l){m=k(Ca(m));var q=l.start||1,u=l.end,v=v||a(J),E=v-1,ba=l.at?l.at[E]=="+":false;E=l.at?E:E-q+1;v=typeof l.x!=tb?l.x:l.x[E];var ca=typeof l.y!=
tb?l.y:l.y[E];l=v!==s&&ca!==s&&(l.at?ba:E>=0&&(!u||E<=u-q));if(i){q=v>i-b&&p>=0&&p<b;v=!(v<b&&p>i-b)?v:v+i;v=!q?v:v-i;v-=p}if(a(Ya)){q=a(Mb);v=v&&v*q;ca=ca&&ca*q}v={display:l?Ob:lb,left:y(v),top:y(ca)};m.css(v)})}},"up.annotations":function(c,d){if(!(G>10||qb)){c=k(d.target);(c.is("a")?c:c.parents("a")).attr("href")&&(G=10)}},"up.steppable":function(){G||qb||h.trigger(a(eb).x-h.offset().left>0.5*a(D)?"stepRight":"stepLeft")},"stepLeft stepRight":function(){w()},stepLeft:function(){e(M,false);e(B,
a(B)-a(db)*a(xa))},stepRight:function(){e(M,true);e(B,a(B)+a(db)*a(xa))},stepUp:function(){e(Q,a(Q)-1)},stepDown:function(){e(Q,a(Q)+1)},resize:function(c,d){if(!(a(Na)&&!d)){var b=a(W),i=a(Za);c=a(L);var p=!a(aa).length||b,m=g.rows||1;b=a(aa).length?!b?s:y(b)+A+y(c):b&&y(b)+A+y((c+i)*m-i)||y((a(D)+i)*a(sa)-i)+A+y((c+i)*a(Ib)*m*(g.directional?2:1)-i);h.css({height:p?y(c):null,backgroundSize:b||null});d||h.trigger("imagesChange")}},"setup.fu":function(){e(J,g.frame+(a(Q)-1)*a(O));h.trigger("preload")},
"wheel.fu":function(){qb=false},"clean.fu":function(){h.trigger("teardown")},"loaded.fu":function(){h.trigger("opening")}},pool:{"tick.reel.preload":function(){if(!(!(pa||a(Na))||a(Ja))){var c=a(D),d=Zc(za.$.css(D)),b=a(aa).length||1,i=S(1/b*a(da)*c);za.$.css({width:d+(i-d)/3+1});if(a(da)===b&&d>c-1){pa=false;za.$.fadeOut(300,function(){za.$.css({opacity:1,width:0})})}}},"tick.reel":function(c){if(!a(Ja)){var d=a(ma),b=Y(ga),i=g.monitor;if(!(!n.intense&&$c())){if(N){d=d-a(mc)/b*N;d=e(ma,d>0.1?d:(N=
R=0))}i&&sc.text(a(i));d&&N++;R&&R++;wc(0);Ua=true;if(R&&!d)return T(c);if(a(ea))return T(c,w());if(!(a(ya)>0)){if(!g.loops&&g.rebound){!R&&!(a(B)%1)?Yb++:(Yb=0);Yb>=g.rebound*1E3/b&&e(M,!a(M))}c=a(xa)*Ha(1,a(M));b=a(ib);d=(!a(Sa)||xc||!b?d:H(a(va))+d)/Y(ga);e(B,a(B)-d*c);b=!g.duration?b:b>0&&e(ib,b-1);!b&&a(Sa)&&h.trigger("stop")}}}},"tick.reel.opening":function(){if(a(fa)){var c=(g.entry||g.speed)/Y(ga)*(g.cw?-1:1),d=e(ya,a(ya)-1);e(B,a(B)+c);d||h.trigger("openingDone")}}}},pa=false,T=function(c,
d){return c.stopImmediatePropagation()||d},ia=function(){h.trigger("setup")},R,N=0,Aa=function(){return R=0},w=function(){clearTimeout(Pb);ha.unbind(nb+x(fa),I.pool[nb+x(fa)]);e(ya,0);e(Kb,true);return R=-g.timeout*Y(ga)},G=0,qb=false,xc=false,sc=k(),za=function(){C(A+x(yc),{position:Qa,left:0,bottom:0,height:g.preloader,overflow:Nb,backgroundColor:"#000"});return za.$=k(V(ta),{"class":yc})},Ra=function(c){C(A+x(zc)+x(c),{position:Qa,width:0,height:0,overflow:Nb,backgroundColor:"#000"});return Ra["$"+
c]=k(V(ta),{"class":zc+A+c})},C=function(c,d,b){function i(p){var m=[];k.each(p,function(l,q){m.push(l.replace(/([A-Z])/g,"-$1").toLowerCase()+":"+y(q)+";")});return"{"+m.join(P)+"}"}b=b?P:a(lc);c=c.replace(/^/,b).replace(na,na+b);return C.rules.push(c+i(d))&&d},$c=function(){var c=a(L),d=a(D),b=h[0].getBoundingClientRect();return b.top<-c||b.left<-d||b.right>d+k(U).width()||b.bottom>c+k(U).height()},Yb=0,ob={x:0,y:0},wc=function(c){return Ta.push(c)&&Ta.shift()&&c},kb=function(){return Ta=[0,0]},
Ta=kb(),vc=g.graph||n.math[g.loops?"hatch":"envelope"],qc=function(){clearTimeout(Qb);Qb=setTimeout(Ub,n.resize_gauge)},Ub=function(){if(h.width()!=a(D)){var c=a(fc),d=e(Mb,h.width()/c.width);k.each(c,function(b,i){e(b,S(i*d))});h.trigger("resize")}},Pb,Qb,pb=function(c,d,b){var i=e(fb,a(B));e(Jb,a(ua));var p=g.loops;e(gb,p?0:-i*c);e(hb,p?c:c-i*c);return d!==s&&e(eb,{x:d,y:b})||s},Ua=true,Xb=function(c,d,b,i){if(i){var p=a(c)||0;b=d!==s?d:(b-1)/(i-1);b=c!=B?b:Ga(b,0.9999);return d=+H(p-b).toFixed(8)>=
+(1/(i-1)).toFixed(8)?e(c,b):d||p}},oa=ha;try{if(ha[0]!=top.document)oa=ha.add(top.document)}catch(dd){}top===self?k():function(c){k("iframe",oa.last()).each(function(){try{if(k(this).contents().find(Tb).html()==k(Tb).html())return(c=k(this))&&false}catch(d){}});return c}();C.rules=[];I.setup()});sb=sb||function h(){var e=+new Date,a=Y(ga);if(!a)return sb=null;ha.trigger(nb);n.cost=(+new Date+n.cost-e)/2;return sb=setTimeout(h,ub(4,1E3/a-n.cost))}();return k(K)}},unreel:function(){return this.trigger("teardown")}},
re:{image:/^(.*)\.(jpg|jpeg|png|gif)\??.*$/i,ua:[/(msie|opera|firefox|chrome|safari)[ \/:]([\d.]+)/i,/(webkit)\/([\d.]+)/i,/(mozilla)\/([\d.]+)/i],array:/ *, */,lazy_agent:/\(iphone|ipod|android|fennec|blackberry/i,frame_klass:/frame-\d+/,substitution:/(@([A-Z]))/g,no_match:/^(undefined|)$/,sequence:/(^[^#|]*([#]+)[^#|]*)($|[|]([0-9]+)\.\.([0-9]+))($|[|]([0-9]+)$)/},cdn:"//cdn.jsdelivr.net/jquery.reel/1.3/",math:{envelope:function(f,j,o,t,r,g){return j+Fa(t,r,-f*g)/o},hatch:function(f,j,o,t,r,g){f=(f<t?r:0)+
f%r;f=j+-f*g/o;return f-rb(f)},interpolate:function(f,j,o){return j+f*(o-j)},distance:function(f,j,o){var t=o/2;f=j-f;return f<-t?f+o:f>t?f-o:f}},preload:{fidelity:function(f,j,o){function t(e,a,I){function pa(G){for(;!(G>=1&&G<=N);)G+=G<1?+N:-N;return h[I+G]||(h[I+G]=!!T.push(G))}if(!e.length)return[];var T=[],ia=4*a,R=j.frame,N=e.length;a=true;for(var Aa=N/ia,w=0;w<ia;w++)pa(R+S(w*Aa));for(;Aa>1;){w=0;ia=T.length;Aa/=2;for(a=!a;w<ia;w++)pa(T[w]+(a?1:-1)*S(Aa))}for(w=0;w<=N;w++)pa(w);for(w=0;w<T.length;w++)T[w]=
e[T[w]-1];return T}var r=j.orbital,g=r?2:j.rows||1,K=r?o(sa):o(O);o=(j.row-1)*K;r=[].concat(f);var h=new Array(f.length+1);f=g<2?[]:r.slice(o,o+K);return t(f,1,o).concat(t(r,g,0))},linear:function(f){return f}},substitute:function(f,j){return f.replace(n.re.substitution,function(o,t,r){return typeof n.substitutes[r]=="function"?n.substitutes[r](j):Ac[r]?j(Ac[r]):t})},substitutes:{T:function(){return+new Date}},normal:{fraction:function(f,j){if(f===null)return f;return j[Ia].loops?f-rb(f):Fa(0,1,f)},
tier:function(f){if(f===null)return f;return Fa(0,1,f)},row:function(f,j){if(f===null)return f;return S(Fa(1,j[Ia].rows,f))},frame:function(f,j){if(f===null)return f;var o=j[Ia];j=j[O]*(o.orbital?2:o.rows||1);f=S(o.loops?f%j||j:Fa(1,j,f));return f<0?f+j:f},images:function(f,j){var o=n.re.sequence.exec(f);return!o?f:n.sequence(o,j[Ia])}},sequence:function(f,j){if(f.length<=1)return j.images;var o=[],t=j.orbital,r=f[1],g=f[2],K=f[4];K=n.re.no_match.test(K+P)?1:+K;var h=t?2:j.rows||1;j=t?j.footage:j.stitched?
1:j.frames;h=+(f[5]||h*j)-K;f=+f[7]||1;for(j=0;j<=h;){o.push(r.replace(g,bc(K+j+P,g.length,"0")));j+=f}return o},instances:k(),leader:Y,resize_gauge:300,concurrent_requests:4,cost:0},ha=k(X);X=navigator.userAgent;var Ba=n.re.ua[0].exec(X)||n.re.ua[1].exec(X)||n.re.ua[2].exec(X);Z=+Ba[2].split(".").slice(0,2).join(".");Ba=Ba[1]=="MSIE";var ad=!(Ba&&Z<8),Fc=!(Ba&&Z<9),sb,z="reel",Bb=z+"-overlay",Hb=z+"-cache",zc=z+"-indicator",yc=z+"-preloader",tc=z+"-monitor",dc=z+"-annotation",mb=z+"-panning",Rb=
z+"-loading",hc="frame-",qa=Math,S=qa.round,rb=qa.floor,la=qa.ceil,Ga=qa.min,ub=qa.max,H=qa.abs,Zc=parseInt,Wb=n.math.interpolate,Pa="annotations",La="area",Sb="auto",nc="backup",M="backwards",db="bit",mc="brake",ab="cache",ic=ab+"d",Lb="center",ec="class",jb="click",ea=jb+"ed",eb=ea+"_location",fb=ea+"_on",Jb=ea+"_tier",xa="cwish",bb="departure",Ma="destination",cb="distance",sa="footage",B="fraction",J="frame",kc="framelock",O="frames",L="height",hb="hi",Nb="hidden",Gb="image",aa="images",gb="lo",
Na="loading",fa="opening",ya=fa+"_ticks",Ia="options",Sa="playing",da="preloaded",Mb="ratio",Oa="reeling",Kb="reeled",Ya="responsive",Ka="revolution",Eb="revolution_y",Q="row",jc="rowlock",Ib="rows",Ja="shy",Za="spacing",va="speed",ra="src",lc="stage",W="stitched",$a=W+"_shift",Fb=W+"_travel",Vb="stopped",$="style",ga="tempo",ib="ticks",ua="tier",fc="truescale",ma="velocity",wa="vertical",D="width",F=x(z),ja=x("pan")+F,Rc="deviceorientation"+F,Qc="dragstart"+F,Oc="mousedown"+F,Nc="mouseenter"+F,Xc=
"mouseleave"+ja,Uc="mousemove"+ja,Yc="mouseup"+ja,Pc="mousewheel"+F,nb="tick"+F,Wc="touchcancel"+ja,Vc="touchend"+ja,Mc="touchstart"+F,Tc="touchmove"+ja,pc="resize"+F,P="",A=" ",na=",",Qa="absolute",Ob="block",Da="@CDN@",ta="div",rc="hand",Tb="head",zb="html",ka="id",Xa="img",Zb="jquery."+z,lb="none",tb="object",wb="string",Ic=[D,L,Za,Ka,Eb,W,$a,Fb],Ac={W:D,H:L},uc=ad?Dc("CAAIAIAAAAAAAAAAACH5BAEAAAAALAAAAAAIAAgAAAIHhI+py+1dAAA7"):Da+"blank.gif",Kc=Ea(Da+Zb+".cur")+na+"move",Jc=Ea(Da+Zb+"-drag.cur")+
na+"move",Lc=Ea(Da+Zb+"-drag-down.cur")+na+"move";n.lazy=n.re.lazy_agent.test(X);var Sc=Ba&&Z<9?1:0,bd=k.cleanData;k.cleanData=function(f){k(f).each(function(){k(this).triggerHandler("clean")});return bd.apply(this,arguments)};k.extend(k.fn,n.fn)&&k(n.scan);return n}}(jQuery,window,document)});
; (function ($) {
	$.fn.loadpage = function (action, opts) {
		action = action ? action : "init";
		var progressValue = 0;
		var loadHtml = [
			'<div class="mdLoading">',
			'    <div class="loadingBox">',
			// '        <img class="line2" src="images/load-pic.png">',
			'        <img class="line2" src="../images/eva787-1.png">',
			'        <div class="progressBar">',
			'            <div class="progress js-bar" style="width:0"></div>',
			'        </div>',
			'    </div>',
			'</div>'
		].join('');
		var dLoad,dCount,dBar;
		var config = $.extend({
			async:false
		}, opts);
		
		function init(obj) {
			$(loadHtml).appendTo('body');
			dLoad = obj.find('.mdLoading');
			dCount = dLoad.find('.js-count');
			dBar = dLoad.find('.js-bar');
			if(window.width > 768) {
				TweenMax.to(".line2", 0.9, {left: 2000});
			} else {
				TweenMax.to(".line2", 0.9, {left: 500});
			}
			return new Promise(function (resolve, reject){
				if (!config.async) {
					var queue = new createjs.LoadQueue();
					queue.setMaxConnections(200);
					var loadArray = [];
					obj.find("img").each(function (i) {
						loadArray.push({
							id: i,
							src: $(this).attr("src")
						});
					})
					queue.loadManifest(loadArray);

					var handleComplete = function () {

						$(window).trigger("loadCompleted");
						$('.js-wrap').css({ 'visibility': 'visible' });
						TweenMax.fromTo(dLoad, 0.5, { opacity: 1 }, {
							delay: .8,
							opacity: 0, ease: Power4.easeOut, onComplete: function () {
								dLoad.remove();
								resolve(true);
							}
						});
	   
					};

					queue.on("progress", function () {
						var procValue = Math.min(Math.ceil(queue.progress * 100), 100);
						dCount.text(procValue + '%');
						dBar.css({
							'width': procValue + '%'
						});
					});

					queue.on("complete", handleComplete, this);
				}
				else {
					resolve(true);
				}
			});
		}
		if(action == 'init'){
			return init($(this));	
		}
		if (action == 'close') {
			dLoad = $(this).find('.mdLoading');
			dCount = dLoad.find('.js-count');
			dBar = dLoad.find('.js-bar');
			dCount.text('100%');
			dBar.css({
				'width':'100%'
			});
			TweenMax.to(".line2", 0.9, {left:2000});
			TweenMax.fromTo(dLoad, 0.5, { opacity: 1 }, {
				delay: .8,
				opacity: 0, ease: Power4.easeOut, onComplete: function () {
					dLoad.remove();
				}
			});
		}
	}
})(jQuery);
"use strict";!function(l,m){l(function(){"use strict";function n(v,w){return null!=v&&null!=w&&v.toLowerCase()===w.toLowerCase()}function o(v,w){var x,y,z=v.length;if(!z||!w)return!1;for(x=w.toLowerCase(),y=0;y<z;++y)if(x===v[y].toLowerCase())return!0;return!1}function p(v){for(var w in v)u.call(v,w)&&(v[w]=new RegExp(v[w],"i"))}function q(v){return(v||"").substr(0,500)}function r(v,w){this.ua=q(v),this._cache={},this.maxPhoneWidth=w||600}var s={mobileDetectRules:{phones:{iPhone:"\\biPhone\\b|\\biPod\\b",BlackBerry:"BlackBerry|\\bBB10\\b|rim[0-9]+",HTC:"HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m|Android [0-9.]+; Pixel",Nexus:"Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 6",Dell:"Dell[;]? (Streak|Aero|Venue|Venue Pro|Flash|Smoke|Mini 3iX)|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",Motorola:"Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b|XT1068|XT1092|XT1052",Samsung:"\\bSamsung\\b|SM-G950F|SM-G955F|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350|SM-J120F|SM-G920F|SM-G920V|SM-G930F|SM-N910C|SM-A310F|GT-I9190|SM-J500FN|SM-G903F|SM-J330F",LG:"\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323|M257)",Sony:"SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533",Asus:"Asus.*Galaxy|PadFone.*Mobile",NokiaLumia:"Lumia [0-9]{3,4}",Micromax:"Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",Palm:"PalmSource|Palm",Vertu:"Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",Pantech:"PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",Fly:"IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",Wiko:"KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA(?!nna)|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",iMobile:"i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",SimValley:"\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",Wolfgang:"AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",Alcatel:"Alcatel",Nintendo:"Nintendo (3DS|Switch)",Amoi:"Amoi",INQ:"INQ",GenericPhone:"Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"},tablets:{iPad:"iPad|iPad.*Mobile",NexusTablet:"Android.*Nexus[\\s]+(7|9|10)",GoogleTablet:"Android.*Pixel C",SamsungTablet:"SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-T116BU|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561|SM-T713|SM-T719|SM-T813|SM-T819|SM-T580|SM-T355Y?|SM-T280|SM-T817A|SM-T820|SM-W700|SM-P580|SM-T587|SM-P350|SM-P555M|SM-P355M|SM-T113NU|SM-T815Y|SM-T585|SM-T285|SM-T825|SM-W708",Kindle:"Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI|KFARWI|KFFOWI|KFGIWI|KFMEWI)\\b|Android.*Silk/[0-9.]+ like Chrome/[0-9.]+ (?!Mobile)",SurfaceTablet:"Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",HPTablet:"HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",AsusTablet:"^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K011 | K017 | K01E |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C|P01Y|PO1MA|P01Z|\\bP027\\b|\\bP024\\b|\\bP00C\\b",BlackBerryTablet:"PlayBook|RIM Tablet",HTCtablet:"HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",MotorolaTablet:"xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",NookTablet:"Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",AcerTablet:"Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b|\\bA3-A20\\b|\\bA3-A30",ToshibaTablet:"Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",LGTablet:"\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",FujitsuTablet:"Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",PrestigioTablet:"PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",LenovoTablet:"Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|YT3-850M|YT3-X90L|YT3-X90F|YT3-X90X|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)|TB-X103F|TB-X304F|TB-X304L|TB-8703F|Tab2A7-10F",DellTablet:"Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",YarvikTablet:"Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",MedionTablet:"Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",ArnovaTablet:"97G4|AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",IntensoTablet:"INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",IRUTablet:"M702pro",MegafonTablet:"MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",EbodaTablet:"E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",AllViewTablet:"Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",ArchosTablet:"\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|c|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",AinolTablet:"NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",NokiaLumiaTablet:"Lumia 2520",SonyTablet:"Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP612|SOT31",PhilipsTablet:"\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",CubeTablet:"Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",CobyTablet:"MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",MIDTablet:"M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",MSITablet:"MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",SMiTTablet:"Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",RockChipTablet:"Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",FlyTablet:"IQ310|Fly Vision",bqTablet:"Android.*(bq)?.*(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris ([E|M]10|M8))|Maxwell.*Lite|Maxwell.*Plus",HuaweiTablet:"MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim|M2-A01L|BAH-L09|BAH-W09",NecTablet:"\\bN-06D|\\bN-08D",PantechTablet:"Pantech.*P4100",BronchoTablet:"Broncho.*(N701|N708|N802|a710)",VersusTablet:"TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",ZyncTablet:"z1000|Z99 2G|z99|z930|z999|z990|z909|Z919|z900",PositivoTablet:"TB07STA|TB10STA|TB07FTA|TB10FTA",NabiTablet:"Android.*\\bNabi",KoboTablet:"Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",DanewTablet:"DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",TexetTablet:"NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",PlaystationTablet:"Playstation.*(Portable|Vita)",TrekstorTablet:"ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",PyleAudioTablet:"\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",AdvanTablet:"Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",DanyTechTablet:"Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",GalapadTablet:"Android.*\\bG1\\b",MicromaxTablet:"Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",KarbonnTablet:"Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",AllFineTablet:"Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",PROSCANTablet:"\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",YONESTablet:"BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",ChangJiaTablet:"TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",GUTablet:"TX-A1301|TX-M9002|Q702|kf026",PointOfViewTablet:"TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",OvermaxTablet:"OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)|Qualcore 1027",HCLTablet:"HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",DPSTablet:"DPS Dream 9|DPS Dual 7",VistureTablet:"V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",CrestaTablet:"CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",MediatekTablet:"\\bMT8125|MT8389|MT8135|MT8377\\b",ConcordeTablet:"Concorde([ ]+)?Tab|ConCorde ReadMan",GoCleverTablet:"GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",ModecomTablet:"FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",VoninoTablet:"\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",ECSTablet:"V07OT2|TM105A|S10OT1|TR10CS1",StorexTablet:"eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",VodafoneTablet:"SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7|VF-1497",EssentielBTablet:"Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",RossMoorTablet:"RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",iMobileTablet:"i-mobile i-note",TolinoTablet:"tolino tab [0-9.]+|tolino shine",AudioSonicTablet:"\\bC-22Q|T7-QC|T-17B|T-17P\\b",AMPETablet:"Android.* A78 ",SkkTablet:"Android.* (SKYPAD|PHOENIX|CYCLOPS)",TecnoTablet:"TECNO P9|TECNO DP8D",JXDTablet:"Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",iJoyTablet:"Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",FX2Tablet:"FX2 PAD7|FX2 PAD10",XoroTablet:"KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",ViewsonicTablet:"ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",VerizonTablet:"QTAQZ3|QTAIR7|QTAQTZ3|QTASUN1|QTASUN2|QTAXIA1",OdysTablet:"LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",CaptivaTablet:"CAPTIVA PAD",IconbitTablet:"NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",TeclastTablet:"T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",OndaTablet:"\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+",JaytechTablet:"TPC-PA762",BlaupunktTablet:"Endeavour 800NG|Endeavour 1010",DigmaTablet:"\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",EvolioTablet:"ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",LavaTablet:"QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",AocTablet:"MW0811|MW0812|MW0922|MTK8382|MW1031|MW0831|MW0821|MW0931|MW0712",MpmanTablet:"MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",CelkonTablet:"CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",WolderTablet:"miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",MediacomTablet:"M-MPI10C3G|M-SP10EG|M-SP10EGP|M-SP10HXAH|M-SP7HXAH|M-SP10HXBH|M-SP8HXAH|M-SP8MXA",MiTablet:"\\bMI PAD\\b|\\bHM NOTE 1W\\b",NibiruTablet:"Nibiru M1|Nibiru Jupiter One",NexoTablet:"NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",LeaderTablet:"TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",UbislateTablet:"UbiSlate[\\s]?7C",PocketBookTablet:"Pocketbook",KocasoTablet:"\\b(TB-1207)\\b",HisenseTablet:"\\b(F5281|E2371)\\b",Hudl:"Hudl HT7S3|Hudl 2",TelstraTablet:"T-Hub2",GenericTablet:"Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bTP750\\b|\\bQTAQZ3\\b|WVT101|TM1088|KT107"},oss:{AndroidOS:"Android",BlackBerryOS:"blackberry|\\bBB10\\b|rim tablet os",PalmOS:"PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",SymbianOS:"Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",WindowsMobileOS:"Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Window Mobile|Windows Phone [0-9.]+|WCE;",WindowsPhoneOS:"Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",iOS:"\\biPhone.*Mobile|\\biPod|\\biPad|AppleCoreMedia",MeeGoOS:"MeeGo",MaemoOS:"Maemo",JavaOS:"J2ME/|\\bMIDP\\b|\\bCLDC\\b",webOS:"webOS|hpwOS",badaOS:"\\bBada\\b",BREWOS:"BREW"},uas:{Chrome:"\\bCrMo\\b|CriOS|Android.*Chrome/[.0-9]* (Mobile)?",Dolfin:"\\bDolfin\\b",Opera:"Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR/[0-9.]+|Coast/[0-9.]+",Skyfire:"Skyfire",Edge:"Mobile Safari/[.0-9]* Edge",IE:"IEMobile|MSIEMobile",Firefox:"fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile|FxiOS",Bolt:"bolt",TeaShark:"teashark",Blazer:"Blazer",Safari:"Version.*Mobile.*Safari|Safari.*Mobile|MobileSafari",UCBrowser:"UC.*Browser|UCWEB",baiduboxapp:"baiduboxapp",baidubrowser:"baidubrowser",DiigoBrowser:"DiigoBrowser",Puffin:"Puffin",Mercury:"\\bMercury\\b",ObigoBrowser:"Obigo",NetFront:"NF-Browser",GenericBrowser:"NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger",PaleMoon:"Android.*PaleMoon|Mobile.*PaleMoon"},props:{Mobile:"Mobile/[VER]",Build:"Build/[VER]",Version:"Version/[VER]",VendorID:"VendorID/[VER]",iPad:"iPad.*CPU[a-z ]+[VER]",iPhone:"iPhone.*CPU[a-z ]+[VER]",iPod:"iPod.*CPU[a-z ]+[VER]",Kindle:"Kindle/[VER]",Chrome:["Chrome/[VER]","CriOS/[VER]","CrMo/[VER]"],Coast:["Coast/[VER]"],Dolfin:"Dolfin/[VER]",Firefox:["Firefox/[VER]","FxiOS/[VER]"],Fennec:"Fennec/[VER]",Edge:"Edge/[VER]",IE:["IEMobile/[VER];","IEMobile [VER]","MSIE [VER];","Trident/[0-9.]+;.*rv:[VER]"],NetFront:"NetFront/[VER]",NokiaBrowser:"NokiaBrowser/[VER]",Opera:[" OPR/[VER]","Opera Mini/[VER]","Version/[VER]"],"Opera Mini":"Opera Mini/[VER]","Opera Mobi":"Version/[VER]",UCBrowser:["UCWEB[VER]","UC.*Browser/[VER]"],MQQBrowser:"MQQBrowser/[VER]",MicroMessenger:"MicroMessenger/[VER]",baiduboxapp:"baiduboxapp/[VER]",baidubrowser:"baidubrowser/[VER]",SamsungBrowser:"SamsungBrowser/[VER]",Iron:"Iron/[VER]",Safari:["Version/[VER]","Safari/[VER]"],Skyfire:"Skyfire/[VER]",Tizen:"Tizen/[VER]",Webkit:"webkit[ /][VER]",PaleMoon:"PaleMoon/[VER]",Gecko:"Gecko/[VER]",Trident:"Trident/[VER]",Presto:"Presto/[VER]",Goanna:"Goanna/[VER]",iOS:" \\bi?OS\\b [VER][ ;]{1}",Android:"Android [VER]",BlackBerry:["BlackBerry[\\w]+/[VER]","BlackBerry.*Version/[VER]","Version/[VER]"],BREW:"BREW [VER]",Java:"Java/[VER]","Windows Phone OS":["Windows Phone OS [VER]","Windows Phone [VER]"],"Windows Phone":"Windows Phone [VER]","Windows CE":"Windows CE/[VER]","Windows NT":"Windows NT [VER]",Symbian:["SymbianOS/[VER]","Symbian/[VER]"],webOS:["webOS/[VER]","hpwOS/[VER];"]},utils:{Bot:"Googlebot|facebookexternalhit|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|YandexMobileBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom",MobileBot:"Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker/M1A1-R2D2",DesktopMode:"WPDesktop",TV:"SonyDTV|HbbTV",WebKit:"(webkit)[ /]([\\w.]+)",Console:"\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|Nintendo Switch|PLAYSTATION|Xbox)\\b",Watch:"SM-V700"}},detectMobileBrowsers:{fullPattern:/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,shortPattern:/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,tabletPattern:/android|ipad|playbook|silk/i}},t,u=Object.prototype.hasOwnProperty;return s.FALLBACK_PHONE="UnknownPhone",s.FALLBACK_TABLET="UnknownTablet",s.FALLBACK_MOBILE="UnknownMobile",t="isArray"in Array?Array.isArray:function(v){return"[object Array]"===Object.prototype.toString.call(v)},function(){var v,w,x,y,z,A,B=s.mobileDetectRules;for(v in B.props)if(u.call(B.props,v)){for(w=B.props[v],t(w)||(w=[w]),z=w.length,y=0;y<z;++y)x=w[y],A=x.indexOf("[VER]"),0<=A&&(x=x.substring(0,A)+"([\\w._\\+]+)"+x.substring(A+5)),w[y]=new RegExp(x,"i");B.props[v]=w}p(B.oss),p(B.phones),p(B.tablets),p(B.uas),p(B.utils),B.oss0={WindowsPhoneOS:B.oss.WindowsPhoneOS,WindowsMobileOS:B.oss.WindowsMobileOS}}(),s.findMatch=function(v,w){for(var x in v)if(u.call(v,x)&&v[x].test(w))return x;return null},s.findMatches=function(v,w){var x=[];for(var y in v)u.call(v,y)&&v[y].test(w)&&x.push(y);return x},s.getVersionStr=function(v,w){var x,y,z,A,B=s.mobileDetectRules.props;if(u.call(B,v))for(x=B[v],z=x.length,y=0;y<z;++y)if(A=x[y].exec(w),null!==A)return A[1];return null},s.getVersion=function(v,w){var x=s.getVersionStr(v,w);return x?s.prepareVersionNo(x):NaN},s.prepareVersionNo=function(v){var w;return w=v.split(/[a-z._ \/\-]/i),1===w.length&&(v=w[0]),1<w.length&&(v=w[0]+".",w.shift(),v+=w.join("")),+v},s.isMobileFallback=function(v){return s.detectMobileBrowsers.fullPattern.test(v)||s.detectMobileBrowsers.shortPattern.test(v.substr(0,4))},s.isTabletFallback=function(v){return s.detectMobileBrowsers.tabletPattern.test(v)},s.prepareDetectionCache=function(v,w,x){if(v.mobile===m){var y,z,A;return(z=s.findMatch(s.mobileDetectRules.tablets,w))?(v.mobile=v.tablet=z,void(v.phone=null)):(y=s.findMatch(s.mobileDetectRules.phones,w))?(v.mobile=v.phone=y,void(v.tablet=null)):void(s.isMobileFallback(w)?(A=r.isPhoneSized(x),A===m?(v.mobile=s.FALLBACK_MOBILE,v.tablet=v.phone=null):A?(v.mobile=v.phone=s.FALLBACK_PHONE,v.tablet=null):(v.mobile=v.tablet=s.FALLBACK_TABLET,v.phone=null)):s.isTabletFallback(w)?(v.mobile=v.tablet=s.FALLBACK_TABLET,v.phone=null):v.mobile=v.tablet=v.phone=null)}},s.mobileGrade=function(v){var w=null!==v.mobile();return v.os("iOS")&&4.3<=v.version("iPad")||v.os("iOS")&&3.1<=v.version("iPhone")||v.os("iOS")&&3.1<=v.version("iPod")||2.1<v.version("Android")&&v.is("Webkit")||7<=v.version("Windows Phone OS")||v.is("BlackBerry")&&6<=v.version("BlackBerry")||v.match("Playbook.*Tablet")||1.4<=v.version("webOS")&&v.match("Palm|Pre|Pixi")||v.match("hp.*TouchPad")||v.is("Firefox")&&12<=v.version("Firefox")||v.is("Chrome")&&v.is("AndroidOS")&&4<=v.version("Android")||v.is("Skyfire")&&4.1<=v.version("Skyfire")&&v.is("AndroidOS")&&2.3<=v.version("Android")||v.is("Opera")&&11<v.version("Opera Mobi")&&v.is("AndroidOS")||v.is("MeeGoOS")||v.is("Tizen")||v.is("Dolfin")&&2<=v.version("Bada")||(v.is("UC Browser")||v.is("Dolfin"))&&2.3<=v.version("Android")||v.match("Kindle Fire")||v.is("Kindle")&&3<=v.version("Kindle")||v.is("AndroidOS")&&v.is("NookTablet")||11<=v.version("Chrome")&&!w||5<=v.version("Safari")&&!w||4<=v.version("Firefox")&&!w||7<=v.version("MSIE")&&!w||10<=v.version("Opera")&&!w?"A":v.os("iOS")&&4.3>v.version("iPad")||v.os("iOS")&&3.1>v.version("iPhone")||v.os("iOS")&&3.1>v.version("iPod")||v.is("Blackberry")&&5<=v.version("BlackBerry")&&6>v.version("BlackBerry")||5<=v.version("Opera Mini")&&6.5>=v.version("Opera Mini")&&(2.3<=v.version("Android")||v.is("iOS"))||v.match("NokiaN8|NokiaC7|N97.*Series60|Symbian/3")||11<=v.version("Opera Mobi")&&v.is("SymbianOS")?"B":(5>v.version("BlackBerry")||v.match("MSIEMobile|Windows CE.*Mobile")||5.2>=v.version("Windows Mobile"),"C")},s.detectOS=function(v){return s.findMatch(s.mobileDetectRules.oss0,v)||s.findMatch(s.mobileDetectRules.oss,v)},s.getDeviceSmallerSide=function(){return window.screen.width<window.screen.height?window.screen.width:window.screen.height},r.prototype={constructor:r,mobile:function mobile(){return s.prepareDetectionCache(this._cache,this.ua,this.maxPhoneWidth),this._cache.mobile},phone:function phone(){return s.prepareDetectionCache(this._cache,this.ua,this.maxPhoneWidth),this._cache.phone},tablet:function tablet(){return s.prepareDetectionCache(this._cache,this.ua,this.maxPhoneWidth),this._cache.tablet},userAgent:function userAgent(){return this._cache.userAgent===m&&(this._cache.userAgent=s.findMatch(s.mobileDetectRules.uas,this.ua)),this._cache.userAgent},userAgents:function userAgents(){return this._cache.userAgents===m&&(this._cache.userAgents=s.findMatches(s.mobileDetectRules.uas,this.ua)),this._cache.userAgents},os:function os(){return this._cache.os===m&&(this._cache.os=s.detectOS(this.ua)),this._cache.os},version:function version(v){return s.getVersion(v,this.ua)},versionStr:function versionStr(v){return s.getVersionStr(v,this.ua)},is:function is(v){return o(this.userAgents(),v)||n(v,this.os())||n(v,this.phone())||n(v,this.tablet())||o(s.findMatches(s.mobileDetectRules.utils,this.ua),v)},match:function match(v){return v instanceof RegExp||(v=new RegExp(v,"i")),v.test(this.ua)},isPhoneSized:function isPhoneSized(v){return r.isPhoneSized(v||this.maxPhoneWidth)},mobileGrade:function mobileGrade(){return this._cache.grade===m&&(this._cache.grade=s.mobileGrade(this)),this._cache.grade}},r.isPhoneSized="undefined"!=typeof window&&window.screen?function(v){return 0>v?m:s.getDeviceSmallerSide()<=v}:function(){},r._impl=s,r.version="1.4.2 2018-06-10",r})}(function(){if("undefined"!=typeof module&&module.exports)return function(m){module.exports=m()};if("function"==typeof define&&define.amd)return define;if("undefined"!=typeof window)return function(m){window.MobileDetect=m()};throw new Error("unknown environment")}());
/*!
 * vue-i18n v8.1.0 
 * (c) 2018 kazuya kawaguchi
 * Released under the MIT License.
 */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VueI18n = factory());
}(this, (function () { 'use strict';

  /*  */

  /**
   * utilites
   */

  function warn (msg, err) {
    if (typeof console !== 'undefined') {
      console.warn('[vue-i18n] ' + msg);
      /* istanbul ignore if */
      if (err) {
        console.warn(err.stack);
      }
    }
  }

  function isObject (obj) {
    return obj !== null && typeof obj === 'object'
  }

  var toString = Object.prototype.toString;
  var OBJECT_STRING = '[object Object]';
  function isPlainObject (obj) {
    return toString.call(obj) === OBJECT_STRING
  }

  function isNull (val) {
    return val === null || val === undefined
  }

  function parseArgs () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var locale = null;
    var params = null;
    if (args.length === 1) {
      if (isObject(args[0]) || Array.isArray(args[0])) {
        params = args[0];
      } else if (typeof args[0] === 'string') {
        locale = args[0];
      }
    } else if (args.length === 2) {
      if (typeof args[0] === 'string') {
        locale = args[0];
      }
      /* istanbul ignore if */
      if (isObject(args[1]) || Array.isArray(args[1])) {
        params = args[1];
      }
    }

    return { locale: locale, params: params }
  }

  function getOldChoiceIndexFixed (choice) {
    return choice
      ? choice > 1
        ? 1
        : 0
      : 1
  }

  function getChoiceIndex (choice, choicesLength) {
    choice = Math.abs(choice);

    if (choicesLength === 2) { return getOldChoiceIndexFixed(choice) }

    return choice ? Math.min(choice, 2) : 0
  }

  function fetchChoice (message, choice) {
    /* istanbul ignore if */
    if (!message && typeof message !== 'string') { return null }
    var choices = message.split('|');

    choice = getChoiceIndex(choice, choices.length);
    if (!choices[choice]) { return message }
    return choices[choice].trim()
  }

  function looseClone (obj) {
    return JSON.parse(JSON.stringify(obj))
  }

  function remove (arr, item) {
    if (arr.length) {
      var index = arr.indexOf(item);
      if (index > -1) {
        return arr.splice(index, 1)
      }
    }
  }

  var hasOwnProperty = Object.prototype.hasOwnProperty;
  function hasOwn (obj, key) {
    return hasOwnProperty.call(obj, key)
  }

  function merge (target) {
    var arguments$1 = arguments;

    var output = Object(target);
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments$1[i];
      if (source !== undefined && source !== null) {
        var key = (void 0);
        for (key in source) {
          if (hasOwn(source, key)) {
            if (isObject(source[key])) {
              output[key] = merge(output[key], source[key]);
            } else {
              output[key] = source[key];
            }
          }
        }
      }
    }
    return output
  }

  function looseEqual (a, b) {
    if (a === b) { return true }
    var isObjectA = isObject(a);
    var isObjectB = isObject(b);
    if (isObjectA && isObjectB) {
      try {
        var isArrayA = Array.isArray(a);
        var isArrayB = Array.isArray(b);
        if (isArrayA && isArrayB) {
          return a.length === b.length && a.every(function (e, i) {
            return looseEqual(e, b[i])
          })
        } else if (!isArrayA && !isArrayB) {
          var keysA = Object.keys(a);
          var keysB = Object.keys(b);
          return keysA.length === keysB.length && keysA.every(function (key) {
            return looseEqual(a[key], b[key])
          })
        } else {
          /* istanbul ignore next */
          return false
        }
      } catch (e) {
        /* istanbul ignore next */
        return false
      }
    } else if (!isObjectA && !isObjectB) {
      return String(a) === String(b)
    } else {
      return false
    }
  }

  var canUseDateTimeFormat =
    typeof Intl !== 'undefined' && typeof Intl.DateTimeFormat !== 'undefined';

  var canUseNumberFormat =
    typeof Intl !== 'undefined' && typeof Intl.NumberFormat !== 'undefined';

  /*  */

  function extend (Vue) {
    // $FlowFixMe
    Object.defineProperty(Vue.prototype, '$i18n', {
      get: function get () { return this._i18n }
    });

    Vue.prototype.$t = function (key) {
      var values = [], len = arguments.length - 1;
      while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];

      var i18n = this.$i18n;
      return i18n._t.apply(i18n, [ key, i18n.locale, i18n._getMessages(), this ].concat( values ))
    };

    Vue.prototype.$tc = function (key, choice) {
      var values = [], len = arguments.length - 2;
      while ( len-- > 0 ) values[ len ] = arguments[ len + 2 ];

      var i18n = this.$i18n;
      return i18n._tc.apply(i18n, [ key, i18n.locale, i18n._getMessages(), this, choice ].concat( values ))
    };

    Vue.prototype.$te = function (key, locale) {
      var i18n = this.$i18n;
      return i18n._te(key, i18n.locale, i18n._getMessages(), locale)
    };

    Vue.prototype.$d = function (value) {
      var ref;

      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
      return (ref = this.$i18n).d.apply(ref, [ value ].concat( args ))
    };

    Vue.prototype.$n = function (value) {
      var ref;

      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];
      return (ref = this.$i18n).n.apply(ref, [ value ].concat( args ))
    };
  }

  /*  */

  var mixin = {
    beforeCreate: function beforeCreate () {
      var options = this.$options;
      options.i18n = options.i18n || (options.__i18n ? {} : null);

      if (options.i18n) {
        if (options.i18n instanceof VueI18n) {
          // init locale messages via custom blocks
          if (options.__i18n) {
            try {
              var localeMessages = {};
              options.__i18n.forEach(function (resource) {
                localeMessages = merge(localeMessages, JSON.parse(resource));
              });
              Object.keys(localeMessages).forEach(function (locale) {
                options.i18n.mergeLocaleMessage(locale, localeMessages[locale]);
              });
            } catch (e) {
              {
                warn("Cannot parse locale messages via custom blocks.", e);
              }
            }
          }
          this._i18n = options.i18n;
          this._i18nWatcher = this._i18n.watchI18nData();
          this._i18n.subscribeDataChanging(this);
          this._subscribing = true;
        } else if (isPlainObject(options.i18n)) {
          // component local i18n
          if (this.$root && this.$root.$i18n && this.$root.$i18n instanceof VueI18n) {
            options.i18n.root = this.$root.$i18n;
            options.i18n.formatter = this.$root.$i18n.formatter;
            options.i18n.fallbackLocale = this.$root.$i18n.fallbackLocale;
            options.i18n.silentTranslationWarn = this.$root.$i18n.silentTranslationWarn;
          }

          // init locale messages via custom blocks
          if (options.__i18n) {
            try {
              var localeMessages$1 = {};
              options.__i18n.forEach(function (resource) {
                localeMessages$1 = merge(localeMessages$1, JSON.parse(resource));
              });
              options.i18n.messages = localeMessages$1;
            } catch (e) {
              {
                warn("Cannot parse locale messages via custom blocks.", e);
              }
            }
          }

          this._i18n = new VueI18n(options.i18n);
          this._i18nWatcher = this._i18n.watchI18nData();
          this._i18n.subscribeDataChanging(this);
          this._subscribing = true;

          if (options.i18n.sync === undefined || !!options.i18n.sync) {
            this._localeWatcher = this.$i18n.watchLocale();
          }
        } else {
          {
            warn("Cannot be interpreted 'i18n' option.");
          }
        }
      } else if (this.$root && this.$root.$i18n && this.$root.$i18n instanceof VueI18n) {
        // root i18n
        this._i18n = this.$root.$i18n;
        this._i18n.subscribeDataChanging(this);
        this._subscribing = true;
      } else if (options.parent && options.parent.$i18n && options.parent.$i18n instanceof VueI18n) {
        // parent i18n
        this._i18n = options.parent.$i18n;
        this._i18n.subscribeDataChanging(this);
        this._subscribing = true;
      }
    },

    beforeDestroy: function beforeDestroy () {
      if (!this._i18n) { return }

      if (this._subscribing) {
        this._i18n.unsubscribeDataChanging(this);
        delete this._subscribing;
      }

      if (this._i18nWatcher) {
        this._i18nWatcher();
        delete this._i18nWatcher;
      }

      if (this._localeWatcher) {
        this._localeWatcher();
        delete this._localeWatcher;
      }

      this._i18n = null;
    }
  }

  /*  */

  var component = {
    name: 'i18n',
    functional: true,
    props: {
      tag: {
        type: String,
        default: 'span'
      },
      path: {
        type: String,
        required: true
      },
      locale: {
        type: String
      },
      places: {
        type: [Array, Object]
      }
    },
    render: function render (h, ref) {
      var props = ref.props;
      var data = ref.data;
      var children = ref.children;
      var parent = ref.parent;

      var i18n = parent.$i18n;

      children = (children || []).filter(function (child) {
        return child.tag || (child.text = child.text.trim())
      });

      if (!i18n) {
        {
          warn('Cannot find VueI18n instance!');
        }
        return children
      }

      var path = props.path;
      var locale = props.locale;

      var params = {};
      var places = props.places || {};

      var hasPlaces = Array.isArray(places)
        ? places.length > 0
        : Object.keys(places).length > 0;

      var everyPlace = children.every(function (child) {
        if (child.data && child.data.attrs) {
          var place = child.data.attrs.place;
          return (typeof place !== 'undefined') && place !== ''
        }
      });

      if (hasPlaces && children.length > 0 && !everyPlace) {
        warn('If places prop is set, all child elements must have place prop set.');
      }

      if (Array.isArray(places)) {
        places.forEach(function (el, i) {
          params[i] = el;
        });
      } else {
        Object.keys(places).forEach(function (key) {
          params[key] = places[key];
        });
      }

      children.forEach(function (child, i) {
        var key = everyPlace
          ? ("" + (child.data.attrs.place))
          : ("" + i);
        params[key] = child;
      });

      return h(props.tag, data, i18n.i(path, locale, params))
    }
  }

  /*  */

  function bind (el, binding, vnode) {
    if (!assert(el, vnode)) { return }

    t(el, binding, vnode);
  }

  function update (el, binding, vnode, oldVNode) {
    if (!assert(el, vnode)) { return }

    if (localeEqual(el, vnode) && looseEqual(binding.value, binding.oldValue)) { return }

    t(el, binding, vnode);
  }

  function unbind (el, binding, vnode, oldVNode) {
    var vm = vnode.context;
    if (!vm) {
      warn('Vue instance does not exists in VNode context');
      return
    }

    el.textContent = '';
    el._vt = undefined;
    delete el['_vt'];
    el._locale = undefined;
    delete el['_locale'];
  }

  function assert (el, vnode) {
    var vm = vnode.context;
    if (!vm) {
      warn('Vue instance doest not exists in VNode context');
      return false
    }

    if (!vm.$i18n) {
      warn('VueI18n instance does not exists in Vue instance');
      return false
    }

    return true
  }

  function localeEqual (el, vnode) {
    var vm = vnode.context;
    return el._locale === vm.$i18n.locale
  }

  function t (el, binding, vnode) {
    var ref$1, ref$2;

    var value = binding.value;

    var ref = parseValue(value);
    var path = ref.path;
    var locale = ref.locale;
    var args = ref.args;
    var choice = ref.choice;
    if (!path && !locale && !args) {
      warn('value type not supported');
      return
    }

    if (!path) {
      warn('`path` is required in v-t directive');
      return
    }

    var vm = vnode.context;
    if (choice) {
      el._vt = el.textContent = (ref$1 = vm.$i18n).tc.apply(ref$1, [ path, choice ].concat( makeParams(locale, args) ));
    } else {
      el._vt = el.textContent = (ref$2 = vm.$i18n).t.apply(ref$2, [ path ].concat( makeParams(locale, args) ));
    }
    el._locale = vm.$i18n.locale;
  }

  function parseValue (value) {
    var path;
    var locale;
    var args;
    var choice;

    if (typeof value === 'string') {
      path = value;
    } else if (isPlainObject(value)) {
      path = value.path;
      locale = value.locale;
      args = value.args;
      choice = value.choice;
    }

    return { path: path, locale: locale, args: args, choice: choice }
  }

  function makeParams (locale, args) {
    var params = [];

    locale && params.push(locale);
    if (args && (Array.isArray(args) || isPlainObject(args))) {
      params.push(args);
    }

    return params
  }

  var Vue;

  function install (_Vue) {
    Vue = _Vue;

    var version = (Vue.version && Number(Vue.version.split('.')[0])) || -1;
    /* istanbul ignore if */
    if (install.installed) {
      warn('already installed.');
      return
    }
    install.installed = true;

    /* istanbul ignore if */
    if (version < 2) {
      warn(("vue-i18n (" + (install.version) + ") need to use Vue 2.0 or later (Vue: " + (Vue.version) + ")."));
      return
    }

    extend(Vue);
    Vue.mixin(mixin);
    Vue.directive('t', { bind: bind, update: update, unbind: unbind });
    Vue.component(component.name, component);

    // use simple mergeStrategies to prevent i18n instance lose '__proto__'
    var strats = Vue.config.optionMergeStrategies;
    strats.i18n = function (parentVal, childVal) {
      return childVal === undefined
        ? parentVal
        : childVal
    };
  }

  /*  */

  var BaseFormatter = function BaseFormatter () {
    this._caches = Object.create(null);
  };

  BaseFormatter.prototype.interpolate = function interpolate (message, values) {
    if (!values) {
      return [message]
    }
    var tokens = this._caches[message];
    if (!tokens) {
      tokens = parse(message);
      this._caches[message] = tokens;
    }
    return compile(tokens, values)
  };



  var RE_TOKEN_LIST_VALUE = /^(\d)+/;
  var RE_TOKEN_NAMED_VALUE = /^(\w)+/;

  function parse (format) {
    var tokens = [];
    var position = 0;

    var text = '';
    while (position < format.length) {
      var char = format[position++];
      if (char === '{') {
        if (text) {
          tokens.push({ type: 'text', value: text });
        }

        text = '';
        var sub = '';
        char = format[position++];
        while (char !== '}') {
          sub += char;
          char = format[position++];
        }

        var type = RE_TOKEN_LIST_VALUE.test(sub)
          ? 'list'
          : RE_TOKEN_NAMED_VALUE.test(sub)
            ? 'named'
            : 'unknown';
        tokens.push({ value: sub, type: type });
      } else if (char === '%') {
        // when found rails i18n syntax, skip text capture
        if (format[(position)] !== '{') {
          text += char;
        }
      } else {
        text += char;
      }
    }

    text && tokens.push({ type: 'text', value: text });

    return tokens
  }

  function compile (tokens, values) {
    var compiled = [];
    var index = 0;

    var mode = Array.isArray(values)
      ? 'list'
      : isObject(values)
        ? 'named'
        : 'unknown';
    if (mode === 'unknown') { return compiled }

    while (index < tokens.length) {
      var token = tokens[index];
      switch (token.type) {
        case 'text':
          compiled.push(token.value);
          break
        case 'list':
          compiled.push(values[parseInt(token.value, 10)]);
          break
        case 'named':
          if (mode === 'named') {
            compiled.push((values)[token.value]);
          } else {
            {
              warn(("Type of token '" + (token.type) + "' and format of value '" + mode + "' don't match!"));
            }
          }
          break
        case 'unknown':
          {
            warn("Detect 'unknown' type of token!");
          }
          break
      }
      index++;
    }

    return compiled
  }

  /*  */

  /**
   *  Path paerser
   *  - Inspired:
   *    Vue.js Path parser
   */

  // actions
  var APPEND = 0;
  var PUSH = 1;
  var INC_SUB_PATH_DEPTH = 2;
  var PUSH_SUB_PATH = 3;

  // states
  var BEFORE_PATH = 0;
  var IN_PATH = 1;
  var BEFORE_IDENT = 2;
  var IN_IDENT = 3;
  var IN_SUB_PATH = 4;
  var IN_SINGLE_QUOTE = 5;
  var IN_DOUBLE_QUOTE = 6;
  var AFTER_PATH = 7;
  var ERROR = 8;

  var pathStateMachine = [];

  pathStateMachine[BEFORE_PATH] = {
    'ws': [BEFORE_PATH],
    'ident': [IN_IDENT, APPEND],
    '[': [IN_SUB_PATH],
    'eof': [AFTER_PATH]
  };

  pathStateMachine[IN_PATH] = {
    'ws': [IN_PATH],
    '.': [BEFORE_IDENT],
    '[': [IN_SUB_PATH],
    'eof': [AFTER_PATH]
  };

  pathStateMachine[BEFORE_IDENT] = {
    'ws': [BEFORE_IDENT],
    'ident': [IN_IDENT, APPEND],
    '0': [IN_IDENT, APPEND],
    'number': [IN_IDENT, APPEND]
  };

  pathStateMachine[IN_IDENT] = {
    'ident': [IN_IDENT, APPEND],
    '0': [IN_IDENT, APPEND],
    'number': [IN_IDENT, APPEND],
    'ws': [IN_PATH, PUSH],
    '.': [BEFORE_IDENT, PUSH],
    '[': [IN_SUB_PATH, PUSH],
    'eof': [AFTER_PATH, PUSH]
  };

  pathStateMachine[IN_SUB_PATH] = {
    "'": [IN_SINGLE_QUOTE, APPEND],
    '"': [IN_DOUBLE_QUOTE, APPEND],
    '[': [IN_SUB_PATH, INC_SUB_PATH_DEPTH],
    ']': [IN_PATH, PUSH_SUB_PATH],
    'eof': ERROR,
    'else': [IN_SUB_PATH, APPEND]
  };

  pathStateMachine[IN_SINGLE_QUOTE] = {
    "'": [IN_SUB_PATH, APPEND],
    'eof': ERROR,
    'else': [IN_SINGLE_QUOTE, APPEND]
  };

  pathStateMachine[IN_DOUBLE_QUOTE] = {
    '"': [IN_SUB_PATH, APPEND],
    'eof': ERROR,
    'else': [IN_DOUBLE_QUOTE, APPEND]
  };

  /**
   * Check if an expression is a literal value.
   */

  var literalValueRE = /^\s?(true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
  function isLiteral (exp) {
    return literalValueRE.test(exp)
  }

  /**
   * Strip quotes from a string
   */

  function stripQuotes (str) {
    var a = str.charCodeAt(0);
    var b = str.charCodeAt(str.length - 1);
    return a === b && (a === 0x22 || a === 0x27)
      ? str.slice(1, -1)
      : str
  }

  /**
   * Determine the type of a character in a keypath.
   */

  function getPathCharType (ch) {
    if (ch === undefined || ch === null) { return 'eof' }

    var code = ch.charCodeAt(0);

    switch (code) {
      case 0x5B: // [
      case 0x5D: // ]
      case 0x2E: // .
      case 0x22: // "
      case 0x27: // '
      case 0x30: // 0
        return ch

      case 0x5F: // _
      case 0x24: // $
      case 0x2D: // -
        return 'ident'

      case 0x20: // Space
      case 0x09: // Tab
      case 0x0A: // Newline
      case 0x0D: // Return
      case 0xA0:  // No-break space
      case 0xFEFF:  // Byte Order Mark
      case 0x2028:  // Line Separator
      case 0x2029:  // Paragraph Separator
        return 'ws'
    }

    // a-z, A-Z
    if ((code >= 0x61 && code <= 0x7A) || (code >= 0x41 && code <= 0x5A)) {
      return 'ident'
    }

    // 1-9
    if (code >= 0x31 && code <= 0x39) { return 'number' }

    return 'else'
  }

  /**
   * Format a subPath, return its plain form if it is
   * a literal string or number. Otherwise prepend the
   * dynamic indicator (*).
   */

  function formatSubPath (path) {
    var trimmed = path.trim();
    // invalid leading 0
    if (path.charAt(0) === '0' && isNaN(path)) { return false }

    return isLiteral(trimmed) ? stripQuotes(trimmed) : '*' + trimmed
  }

  /**
   * Parse a string path into an array of segments
   */

  function parse$1 (path) {
    var keys = [];
    var index = -1;
    var mode = BEFORE_PATH;
    var subPathDepth = 0;
    var c;
    var key;
    var newChar;
    var type;
    var transition;
    var action;
    var typeMap;
    var actions = [];

    actions[PUSH] = function () {
      if (key !== undefined) {
        keys.push(key);
        key = undefined;
      }
    };

    actions[APPEND] = function () {
      if (key === undefined) {
        key = newChar;
      } else {
        key += newChar;
      }
    };

    actions[INC_SUB_PATH_DEPTH] = function () {
      actions[APPEND]();
      subPathDepth++;
    };

    actions[PUSH_SUB_PATH] = function () {
      if (subPathDepth > 0) {
        subPathDepth--;
        mode = IN_SUB_PATH;
        actions[APPEND]();
      } else {
        subPathDepth = 0;
        key = formatSubPath(key);
        if (key === false) {
          return false
        } else {
          actions[PUSH]();
        }
      }
    };

    function maybeUnescapeQuote () {
      var nextChar = path[index + 1];
      if ((mode === IN_SINGLE_QUOTE && nextChar === "'") ||
        (mode === IN_DOUBLE_QUOTE && nextChar === '"')) {
        index++;
        newChar = '\\' + nextChar;
        actions[APPEND]();
        return true
      }
    }

    while (mode !== null) {
      index++;
      c = path[index];

      if (c === '\\' && maybeUnescapeQuote()) {
        continue
      }

      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap['else'] || ERROR;

      if (transition === ERROR) {
        return // parse error
      }

      mode = transition[0];
      action = actions[transition[1]];
      if (action) {
        newChar = transition[2];
        newChar = newChar === undefined
          ? c
          : newChar;
        if (action() === false) {
          return
        }
      }

      if (mode === AFTER_PATH) {
        return keys
      }
    }
  }





  function empty (target) {
    /* istanbul ignore else */
    if (Array.isArray(target)) {
      return target.length === 0
    } else {
      return false
    }
  }

  var I18nPath = function I18nPath () {
    this._cache = Object.create(null);
  };

  /**
   * External parse that check for a cache hit first
   */
  I18nPath.prototype.parsePath = function parsePath (path) {
    var hit = this._cache[path];
    if (!hit) {
      hit = parse$1(path);
      if (hit) {
        this._cache[path] = hit;
      }
    }
    return hit || []
  };

  /**
   * Get path value from path string
   */
  I18nPath.prototype.getPathValue = function getPathValue (obj, path) {
    if (!isObject(obj)) { return null }

    var paths = this.parsePath(path);
    if (empty(paths)) {
      return null
    } else {
      var length = paths.length;
      var ret = null;
      var last = obj;
      var i = 0;
      while (i < length) {
        var value = last[paths[i]];
        if (value === undefined) {
          last = null;
          break
        }
        last = value;
        i++;
      }

      ret = last;
      return ret
    }
  };

  /*  */



  var numberFormatKeys = [
    'style',
    'currency',
    'currencyDisplay',
    'useGrouping',
    'minimumIntegerDigits',
    'minimumFractionDigits',
    'maximumFractionDigits',
    'minimumSignificantDigits',
    'maximumSignificantDigits',
    'localeMatcher',
    'formatMatcher'
  ];

  var VueI18n = function VueI18n (options) {
    var this$1 = this;
    if ( options === void 0 ) options = {};

    // Auto install if it is not done yet and `window` has `Vue`.
    // To allow users to avoid auto-installation in some cases,
    // this code should be placed here. See #290
    /* istanbul ignore if */
    if (!Vue && typeof window !== 'undefined' && window.Vue) {
      install(window.Vue);
    }

    var locale = options.locale || 'en-US';
    var fallbackLocale = options.fallbackLocale || 'en-US';
    var messages = options.messages || {};
    var dateTimeFormats = options.dateTimeFormats || {};
    var numberFormats = options.numberFormats || {};

    this._vm = null;
    this._formatter = options.formatter || new BaseFormatter();
    this._missing = options.missing || null;
    this._root = options.root || null;
    this._sync = options.sync === undefined ? true : !!options.sync;
    this._fallbackRoot = options.fallbackRoot === undefined
      ? true
      : !!options.fallbackRoot;
    this._silentTranslationWarn = options.silentTranslationWarn === undefined
      ? false
      : !!options.silentTranslationWarn;
    this._dateTimeFormatters = {};
    this._numberFormatters = {};
    this._path = new I18nPath();
    this._dataListeners = [];

    this._exist = function (message, key) {
      if (!message || !key) { return false }
      return !isNull(this$1._path.getPathValue(message, key))
    };

    this._initVM({
      locale: locale,
      fallbackLocale: fallbackLocale,
      messages: messages,
      dateTimeFormats: dateTimeFormats,
      numberFormats: numberFormats
    });
  };

  var prototypeAccessors = { vm: { configurable: true },messages: { configurable: true },dateTimeFormats: { configurable: true },numberFormats: { configurable: true },locale: { configurable: true },fallbackLocale: { configurable: true },missing: { configurable: true },formatter: { configurable: true },silentTranslationWarn: { configurable: true } };

  VueI18n.prototype._initVM = function _initVM (data) {
    var silent = Vue.config.silent;
    Vue.config.silent = true;
    this._vm = new Vue({ data: data });
    Vue.config.silent = silent;
  };

  VueI18n.prototype.subscribeDataChanging = function subscribeDataChanging (vm) {
    this._dataListeners.push(vm);
  };

  VueI18n.prototype.unsubscribeDataChanging = function unsubscribeDataChanging (vm) {
    remove(this._dataListeners, vm);
  };

  VueI18n.prototype.watchI18nData = function watchI18nData () {
    var self = this;
    return this._vm.$watch('$data', function () {
      var i = self._dataListeners.length;
      while (i--) {
        Vue.nextTick(function () {
          self._dataListeners[i] && self._dataListeners[i].$forceUpdate();
        });
      }
    }, { deep: true })
  };

  VueI18n.prototype.watchLocale = function watchLocale () {
    /* istanbul ignore if */
    if (!this._sync || !this._root) { return null }
    var target = this._vm;
    return this._root.vm.$watch('locale', function (val) {
      target.$set(target, 'locale', val);
      target.$forceUpdate();
    }, { immediate: true })
  };

  prototypeAccessors.vm.get = function () { return this._vm };

  prototypeAccessors.messages.get = function () { return looseClone(this._getMessages()) };
  prototypeAccessors.dateTimeFormats.get = function () { return looseClone(this._getDateTimeFormats()) };
  prototypeAccessors.numberFormats.get = function () { return looseClone(this._getNumberFormats()) };

  prototypeAccessors.locale.get = function () { return this._vm.locale };
  prototypeAccessors.locale.set = function (locale) {
    this._vm.$set(this._vm, 'locale', locale);
  };

  prototypeAccessors.fallbackLocale.get = function () { return this._vm.fallbackLocale };
  prototypeAccessors.fallbackLocale.set = function (locale) {
    this._vm.$set(this._vm, 'fallbackLocale', locale);
  };

  prototypeAccessors.missing.get = function () { return this._missing };
  prototypeAccessors.missing.set = function (handler) { this._missing = handler; };

  prototypeAccessors.formatter.get = function () { return this._formatter };
  prototypeAccessors.formatter.set = function (formatter) { this._formatter = formatter; };

  prototypeAccessors.silentTranslationWarn.get = function () { return this._silentTranslationWarn };
  prototypeAccessors.silentTranslationWarn.set = function (silent) { this._silentTranslationWarn = silent; };

  VueI18n.prototype._getMessages = function _getMessages () { return this._vm.messages };
  VueI18n.prototype._getDateTimeFormats = function _getDateTimeFormats () { return this._vm.dateTimeFormats };
  VueI18n.prototype._getNumberFormats = function _getNumberFormats () { return this._vm.numberFormats };

  VueI18n.prototype._warnDefault = function _warnDefault (locale, key, result, vm, values) {
    if (!isNull(result)) { return result }
    if (this._missing) {
      var missingRet = this._missing.apply(null, [locale, key, vm, values]);
      if (typeof missingRet === 'string') {
        return missingRet
      }
    } else {
      if (!this._silentTranslationWarn) {
        warn(
          "Cannot translate the value of keypath '" + key + "'. " +
          'Use the value of keypath as default.'
        );
      }
    }
    return key
  };

  VueI18n.prototype._isFallbackRoot = function _isFallbackRoot (val) {
    return !val && !isNull(this._root) && this._fallbackRoot
  };

  VueI18n.prototype._interpolate = function _interpolate (
    locale,
    message,
    key,
    host,
    interpolateMode,
    values
  ) {
    if (!message) { return null }

    var pathRet = this._path.getPathValue(message, key);
    if (Array.isArray(pathRet) || isPlainObject(pathRet)) { return pathRet }

    var ret;
    if (isNull(pathRet)) {
      /* istanbul ignore else */
      if (isPlainObject(message)) {
        ret = message[key];
        if (typeof ret !== 'string') {
          if (!this._silentTranslationWarn) {
            warn(("Value of key '" + key + "' is not a string!"));
          }
          return null
        }
      } else {
        return null
      }
    } else {
      /* istanbul ignore else */
      if (typeof pathRet === 'string') {
        ret = pathRet;
      } else {
        if (!this._silentTranslationWarn) {
          warn(("Value of key '" + key + "' is not a string!"));
        }
        return null
      }
    }

    // Check for the existance of links within the translated string
    if (ret.indexOf('@:') >= 0) {
      ret = this._link(locale, message, ret, host, interpolateMode, values);
    }

    return this._render(ret, interpolateMode, values)
  };

  VueI18n.prototype._link = function _link (
    locale,
    message,
    str,
    host,
    interpolateMode,
    values
  ) {
      var this$1 = this;

    var ret = str;

    // Match all the links within the local
    // We are going to replace each of
    // them with its translation
    var matches = ret.match(/(@:[\w\-_|.]+)/g);
    for (var idx in matches) {
      // ie compatible: filter custom array
      // prototype method
      if (!matches.hasOwnProperty(idx)) {
        continue
      }
      var link = matches[idx];
      // Remove the leading @:
      var linkPlaceholder = link.substr(2);
      // Translate the link
      var translated = this$1._interpolate(
        locale, message, linkPlaceholder, host,
        interpolateMode === 'raw' ? 'string' : interpolateMode,
        interpolateMode === 'raw' ? undefined : values
      );

      if (this$1._isFallbackRoot(translated)) {
        if (!this$1._silentTranslationWarn) {
          warn(("Fall back to translate the link placeholder '" + linkPlaceholder + "' with root locale."));
        }
        /* istanbul ignore if */
        if (!this$1._root) { throw Error('unexpected error') }
        var root = this$1._root;
        translated = root._translate(
          root._getMessages(), root.locale, root.fallbackLocale,
          linkPlaceholder, host, interpolateMode, values
        );
      }
      translated = this$1._warnDefault(
        locale, linkPlaceholder, translated, host,
        Array.isArray(values) ? values : [values]
      );

      // Replace the link with the translated
      ret = !translated ? ret : ret.replace(link, translated);
    }

    return ret
  };

  VueI18n.prototype._render = function _render (message, interpolateMode, values) {
    var ret = this._formatter.interpolate(message, values);
    // if interpolateMode is **not** 'string' ('row'),
    // return the compiled data (e.g. ['foo', VNode, 'bar']) with formatter
    return interpolateMode === 'string' ? ret.join('') : ret
  };

  VueI18n.prototype._translate = function _translate (
    messages,
    locale,
    fallback,
    key,
    host,
    interpolateMode,
    args
  ) {
    var res =
      this._interpolate(locale, messages[locale], key, host, interpolateMode, args);
    if (!isNull(res)) { return res }

    res = this._interpolate(fallback, messages[fallback], key, host, interpolateMode, args);
    if (!isNull(res)) {
      if (!this._silentTranslationWarn) {
        warn(("Fall back to translate the keypath '" + key + "' with '" + fallback + "' locale."));
      }
      return res
    } else {
      return null
    }
  };

  VueI18n.prototype._t = function _t (key, _locale, messages, host) {
      var ref;

      var values = [], len = arguments.length - 4;
      while ( len-- > 0 ) values[ len ] = arguments[ len + 4 ];
    if (!key) { return '' }

    var parsedArgs = parseArgs.apply(void 0, values);
    var locale = parsedArgs.locale || _locale;

    var ret = this._translate(
      messages, locale, this.fallbackLocale, key,
      host, 'string', parsedArgs.params
    );
    if (this._isFallbackRoot(ret)) {
      if (!this._silentTranslationWarn) {
        warn(("Fall back to translate the keypath '" + key + "' with root locale."));
      }
      /* istanbul ignore if */
      if (!this._root) { throw Error('unexpected error') }
      return (ref = this._root).t.apply(ref, [ key ].concat( values ))
    } else {
      return this._warnDefault(locale, key, ret, host, values)
    }
  };

  VueI18n.prototype.t = function t (key) {
      var ref;

      var values = [], len = arguments.length - 1;
      while ( len-- > 0 ) values[ len ] = arguments[ len + 1 ];
    return (ref = this)._t.apply(ref, [ key, this.locale, this._getMessages(), null ].concat( values ))
  };

  VueI18n.prototype._i = function _i (key, locale, messages, host, values) {
    var ret =
      this._translate(messages, locale, this.fallbackLocale, key, host, 'raw', values);
    if (this._isFallbackRoot(ret)) {
      if (!this._silentTranslationWarn) {
        warn(("Fall back to interpolate the keypath '" + key + "' with root locale."));
      }
      if (!this._root) { throw Error('unexpected error') }
      return this._root.i(key, locale, values)
    } else {
      return this._warnDefault(locale, key, ret, host, [values])
    }
  };

  VueI18n.prototype.i = function i (key, locale, values) {
    /* istanbul ignore if */
    if (!key) { return '' }

    if (typeof locale !== 'string') {
      locale = this.locale;
    }

    return this._i(key, locale, this._getMessages(), null, values)
  };

  VueI18n.prototype._tc = function _tc (
    key,
    _locale,
    messages,
    host,
    choice
  ) {
      var ref;

      var values = [], len = arguments.length - 5;
      while ( len-- > 0 ) values[ len ] = arguments[ len + 5 ];
    if (!key) { return '' }
    if (choice === undefined) {
      choice = 1;
    }
    return fetchChoice((ref = this)._t.apply(ref, [ key, _locale, messages, host ].concat( values )), choice)
  };

  VueI18n.prototype.tc = function tc (key, choice) {
      var ref;

      var values = [], len = arguments.length - 2;
      while ( len-- > 0 ) values[ len ] = arguments[ len + 2 ];
    return (ref = this)._tc.apply(ref, [ key, this.locale, this._getMessages(), null, choice ].concat( values ))
  };

  VueI18n.prototype._te = function _te (key, locale, messages) {
      var args = [], len = arguments.length - 3;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 3 ];

    var _locale = parseArgs.apply(void 0, args).locale || locale;
    return this._exist(messages[_locale], key)
  };

  VueI18n.prototype.te = function te (key, locale) {
    return this._te(key, this.locale, this._getMessages(), locale)
  };

  VueI18n.prototype.getLocaleMessage = function getLocaleMessage (locale) {
    return looseClone(this._vm.messages[locale] || {})
  };

  VueI18n.prototype.setLocaleMessage = function setLocaleMessage (locale, message) {
    this._vm.$set(this._vm.messages, locale, message);
  };

  VueI18n.prototype.mergeLocaleMessage = function mergeLocaleMessage (locale, message) {
    this._vm.$set(this._vm.messages, locale, Vue.util.extend(this._vm.messages[locale] || {}, message));
  };

  VueI18n.prototype.getDateTimeFormat = function getDateTimeFormat (locale) {
    return looseClone(this._vm.dateTimeFormats[locale] || {})
  };

  VueI18n.prototype.setDateTimeFormat = function setDateTimeFormat (locale, format) {
    this._vm.$set(this._vm.dateTimeFormats, locale, format);
  };

  VueI18n.prototype.mergeDateTimeFormat = function mergeDateTimeFormat (locale, format) {
    this._vm.$set(this._vm.dateTimeFormats, locale, Vue.util.extend(this._vm.dateTimeFormats[locale] || {}, format));
  };

  VueI18n.prototype._localizeDateTime = function _localizeDateTime (
    value,
    locale,
    fallback,
    dateTimeFormats,
    key
  ) {
    var _locale = locale;
    var formats = dateTimeFormats[_locale];

    // fallback locale
    if (isNull(formats) || isNull(formats[key])) {
      {
        warn(("Fall back to '" + fallback + "' datetime formats from '" + locale + " datetime formats."));
      }
      _locale = fallback;
      formats = dateTimeFormats[_locale];
    }

    if (isNull(formats) || isNull(formats[key])) {
      return null
    } else {
      var format = formats[key];
      var id = _locale + "__" + key;
      var formatter = this._dateTimeFormatters[id];
      if (!formatter) {
        formatter = this._dateTimeFormatters[id] = new Intl.DateTimeFormat(_locale, format);
      }
      return formatter.format(value)
    }
  };

  VueI18n.prototype._d = function _d (value, locale, key) {
    /* istanbul ignore if */
    if (!VueI18n.availabilities.dateTimeFormat) {
      warn('Cannot format a Date value due to not supported Intl.DateTimeFormat.');
      return ''
    }

    if (!key) {
      return new Intl.DateTimeFormat(locale).format(value)
    }

    var ret =
      this._localizeDateTime(value, locale, this.fallbackLocale, this._getDateTimeFormats(), key);
    if (this._isFallbackRoot(ret)) {
      {
        warn(("Fall back to datetime localization of root: key '" + key + "' ."));
      }
      /* istanbul ignore if */
      if (!this._root) { throw Error('unexpected error') }
      return this._root.d(value, key, locale)
    } else {
      return ret || ''
    }
  };

  VueI18n.prototype.d = function d (value) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var locale = this.locale;
    var key = null;

    if (args.length === 1) {
      if (typeof args[0] === 'string') {
        key = args[0];
      } else if (isObject(args[0])) {
        if (args[0].locale) {
          locale = args[0].locale;
        }
        if (args[0].key) {
          key = args[0].key;
        }
      }
    } else if (args.length === 2) {
      if (typeof args[0] === 'string') {
        key = args[0];
      }
      if (typeof args[1] === 'string') {
        locale = args[1];
      }
    }

    return this._d(value, locale, key)
  };

  VueI18n.prototype.getNumberFormat = function getNumberFormat (locale) {
    return looseClone(this._vm.numberFormats[locale] || {})
  };

  VueI18n.prototype.setNumberFormat = function setNumberFormat (locale, format) {
    this._vm.$set(this._vm.numberFormats, locale, format);
  };

  VueI18n.prototype.mergeNumberFormat = function mergeNumberFormat (locale, format) {
    this._vm.$set(this._vm.numberFormats, locale, Vue.util.extend(this._vm.numberFormats[locale] || {}, format));
  };

  VueI18n.prototype._localizeNumber = function _localizeNumber (
    value,
    locale,
    fallback,
    numberFormats,
    key,
    options
  ) {
    var _locale = locale;
    var formats = numberFormats[_locale];

    // fallback locale
    if (isNull(formats) || isNull(formats[key])) {
      {
        warn(("Fall back to '" + fallback + "' number formats from '" + locale + " number formats."));
      }
      _locale = fallback;
      formats = numberFormats[_locale];
    }

    if (isNull(formats) || isNull(formats[key])) {
      return null
    } else {
      var format = formats[key];

      var formatter;
      if (options) {
        // If options specified - create one time number formatter
        formatter = new Intl.NumberFormat(_locale, Object.assign({}, format, options));
      } else {
        var id = _locale + "__" + key;
        formatter = this._numberFormatters[id];
        if (!formatter) {
          formatter = this._numberFormatters[id] = new Intl.NumberFormat(_locale, format);
        }
      }
      return formatter.format(value)
    }
  };

  VueI18n.prototype._n = function _n (value, locale, key, options) {
    /* istanbul ignore if */
    if (!VueI18n.availabilities.numberFormat) {
      warn('Cannot format a Number value due to not supported Intl.NumberFormat.');
      return ''
    }

    if (!key) {
      var nf = !options ? new Intl.NumberFormat(locale) : new Intl.NumberFormat(locale, options);
      return nf.format(value)
    }

    var ret =
      this._localizeNumber(value, locale, this.fallbackLocale, this._getNumberFormats(), key, options);
    if (this._isFallbackRoot(ret)) {
      {
        warn(("Fall back to number localization of root: key '" + key + "' ."));
      }
      /* istanbul ignore if */
      if (!this._root) { throw Error('unexpected error') }
      return this._root.n(value, Object.assign({}, { key: key, locale: locale }, options))
    } else {
      return ret || ''
    }
  };

  VueI18n.prototype.n = function n (value) {
      var args = [], len = arguments.length - 1;
      while ( len-- > 0 ) args[ len ] = arguments[ len + 1 ];

    var locale = this.locale;
    var key = null;
    var options = null;

    if (args.length === 1) {
      if (typeof args[0] === 'string') {
        key = args[0];
      } else if (isObject(args[0])) {
        if (args[0].locale) {
          locale = args[0].locale;
        }
        if (args[0].key) {
          key = args[0].key;
        }

        // Filter out number format options only
        options = Object.keys(args[0]).reduce(function (acc, key) {
            var obj;

          if (numberFormatKeys.includes(key)) {
            return Object.assign({}, acc, ( obj = {}, obj[key] = args[0][key], obj ))
          }
          return acc
        }, null);
      }
    } else if (args.length === 2) {
      if (typeof args[0] === 'string') {
        key = args[0];
      }
      if (typeof args[1] === 'string') {
        locale = args[1];
      }
    }

    return this._n(value, locale, key, options)
  };

  Object.defineProperties( VueI18n.prototype, prototypeAccessors );

  VueI18n.availabilities = {
    dateTimeFormat: canUseDateTimeFormat,
    numberFormat: canUseNumberFormat
  };
  VueI18n.install = install;
  VueI18n.version = '8.1.0';

  return VueI18n;

})));
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImpxdWVyeS5uYXYuanMiLCJqcXVlcnkubmF2c2Nyb2xsLmpzIiwianF1ZXJ5LnJlZWwuanMiLCJsb2FkLmpzIiwibW9iaWxlLWRldGVjdC5taW4uanMiLCJ2dWUtaTE4bi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RkE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoibGliLmpzIiwic291cmNlc0NvbnRlbnQiOlsiOyhmdW5jdGlvbiAoJCkge1xyXG4gICQuZm4ubWVudSA9IGZ1bmN0aW9uIChvcHRzKSB7XHJcbiAgICAvLyBkZWZhdWx0IGNvbmZpZ3VyYXRpb25cclxuICAgIHZhciBjb25maWcgPSAkLmV4dGVuZCh7fSwge1xyXG4gICAgICBvcHQxOiBudWxsXHJcbiAgICB9LCBvcHRzKTtcclxuICAgIC8vIG1haW4gZnVuY3Rpb25cclxuICAgIGZ1bmN0aW9uIGluaXQob2JqKSB7XHJcbiAgICAgIHZhciBkT2JqID0gJChvYmopO1xyXG4gICAgICB2YXIgZE1lbnVsaW5rID0gZE9iai5maW5kKCcubmF2LWJ0bicpO1xyXG4gICAgICB2YXIgZEFsbExpbmsgPSBkT2JqLmZpbmQoJy5uYXYtbWVudSBhJyk7XHJcbiAgICAgIHZhciBkTWVudUNsb3NlID0gZE9iai5maW5kKCcubmF2LWNsb3NlJyk7XHJcbiAgICAgIGRNZW51bGluay5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZE9iai50b2dnbGVDbGFzcygnbmF2LS1hY3RpdmUnKTtcclxuICAgICAgICAkKCdib2R5JykudG9nZ2xlQ2xhc3MoJ19mcmVlemUnKTtcclxuICAgICAgfSk7XHJcbiAgICAgIGRNZW51Q2xvc2UuY2xpY2soZnVuY3Rpb24gKCkgeyBcclxuICAgICAgICBkT2JqLnJlbW92ZUNsYXNzKFwibmF2LS1hY3RpdmVcIik7XHJcbiAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdfZnJlZXplJyk7XHJcbiAgICAgIH0pXHJcblxyXG4gICAgICBkQWxsTGluay5jbGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZE9iai5yZW1vdmVDbGFzcygnbmF2LS1hY3RpdmUnKVxyXG4gICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnX2ZyZWV6ZScpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIC8vIGluaXRpYWxpemUgZXZlcnkgZWxlbWVudFxyXG4gICAgcmV0dXJuIHRoaXMuZWFjaChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGluaXQoJCh0aGlzKSk7XHJcbiAgICB9KTtcclxuICB9O1xyXG4gIC8vIHN0YXJ0XHJcbiAgXHJcbn0pKGpRdWVyeSk7XHJcbiIsIi8qIOaomeexpOa7keWLleaEn+a4rFxyXG4gKiBpbmNsdWRlOiBqcWV1cnkubWluLmpzXHJcbiAqIDIwMTUvMDYvOTE4XHJcbiAqL1xyXG47XHJcbihmdW5jdGlvbigkKSB7XHJcbiAgICAkLmZuLm5hdnNjcm9sbCA9IGZ1bmN0aW9uKHNldHRpbmdzKSB7XHJcbiAgICAgICAgdmFyIF9kZWZhdWx0c2V0ID0ge1xyXG4gICAgICAgICAgICBlYXNpbmc6IFwibGluZWFyXCIsXHJcbiAgICAgICAgICAgIHNlYzogNTAwLFxyXG4gICAgICAgICAgICB1cmxfaGFzaDogZmFsc2UsIC8vSUU5ICsgXHJcbiAgICAgICAgICAgIGhlYWRfaGlnaHQ6IDAgLy9weFxyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgd2FpdCA9IGZhbHNlLFxyXG4gICAgICAgICAgICBjd2FpdCA9IGZhbHNlO1xyXG4gICAgICAgIHZhciBhbmNob3IgPSBbXTtcclxuICAgICAgICB2YXIgX3NldHRpbmdzID0gJC5leHRlbmQoX2RlZmF1bHRzZXQsIHNldHRpbmdzKTtcclxuXHJcbiAgICAgICAgdmFyIGFuaW1hdGVfc2Nyb2xsID0gZnVuY3Rpb24oc2Nyb2xsdG9wKSB7XHJcbiAgICAgICAgICAgICQoXCJodG1sLCBib2R5XCIpLnN0b3AoKS5hbmltYXRlKHtcclxuICAgICAgICAgICAgICAgIHNjcm9sbFRvcDogc2Nyb2xsdG9wIC0gX3NldHRpbmdzLmhlYWRfaGlnaHRcclxuICAgICAgICAgICAgfSwgX3NldHRpbmdzLnNlYywgX3NldHRpbmdzLmxpbmVhcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHZhciBzY3JvbGxfZXZlbnQgPSBmdW5jdGlvbiAoJGVsZSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkZWxlKVxyXG4gICAgICAgICAgICAkKHdpbmRvdykub2ZmKFwic2Nyb2xsXCIpLm9uKFwic2Nyb2xsXCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgd2FpdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IGFuY2hvci5sZW5ndGg7IHgrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBhbmNob3JfaWQgPSBhbmNob3JbeF0uYW5jaG9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICgkKGRvY3VtZW50KS5maW5kKFwiW2RhdGEtYW5jaG9yPVwiICsgYW5jaG9yX2lkICsgXCJdXCIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjd2FpdCAmJiAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPj0gJChkb2N1bWVudCkuZmluZChcIltkYXRhLWFuY2hvcj1cIiArIGFuY2hvcl9pZCArIFwiXVwiKS5vZmZzZXQoKS50b3AgLSBfc2V0dGluZ3MuaGVhZF9oaWdodCAmJiAkKHdpbmRvdykuc2Nyb2xsVG9wKCkgPCAkKGRvY3VtZW50KS5maW5kKFwiW2RhdGEtYW5jaG9yPVwiICsgYW5jaG9yX2lkICsgXCJdXCIpLm9mZnNldCgpLnRvcCArICQoZG9jdW1lbnQpLmZpbmQoXCJbZGF0YS1hbmNob3I9XCIgKyBhbmNob3JfaWQgKyBcIl1cIikuaGVpZ2h0KCkgLSBfc2V0dGluZ3MuaGVhZF9oaWdodCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCRlbGUuZmluZChcIi5hY3RpdmVcIikuZGF0YShcIm5hdlwiKSAhPSBhbmNob3JbeF0uYW5jaG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKF9zZXR0aW5ncy51cmxfaGFzaCkgbG9jYXRpb24uaGFzaCA9IGFuY2hvclt4XS5hbmNob3I7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIltkYXRhLW5hdl1cIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYW5jaG9yW3hdLmFuY2hvciwgJGVsZS5maW5kKFwiW2RhdGEtbmF2PVwiICsgYW5jaG9yW3hdLmFuY2hvciArIFwiXVwiKS5hZGRDbGFzcyhcImFjdGl2ZVwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIltkYXRhLW5hdj1cIiArIGFuY2hvclt4XS5hbmNob3IgKyBcIl1cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIltkYXRhLWFuY2hvcl1cIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIltkYXRhLWFuY2hvcj1cIiArIGFuY2hvclt4XS5hbmNob3IgKyBcIl1cIikuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNhbGxiYWNrID0gJChcIltkYXRhLWFuY2hvcj1cIiArIGFuY2hvclt4XS5hbmNob3IgKyBcIl1cIikuZGF0YShcImNhbGxiYWNrXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChjYWxsYmFjayl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzcCA9IGNhbGxiYWNrLnNwbGl0KFwiKFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGZ1biA9IHNwWzBdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGFyYW1zID0gc3BbMV0ucmVwbGFjZShcIilcIiwgXCJcIikuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZnVuID0gd2luZG93W2Z1bl07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZ1bi5hcHBseShudWxsLCBwYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCIlYyBub3QgZmluZCBcIiArIGFuY2hvcl9pZCwgXCJiYWNrZ3JvdW5kOiMwMDA7IGNvbG9yOnJlZDtcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh4ID09IGFuY2hvci5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRlbGUuZmluZChcIltkYXRhLW5hdl1cIikucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKF9zZXR0aW5ncy51cmxfaGFzaCkge1xyXG4gICAgICAgICAgICB2YXIgaGFzaCA9IGxvY2F0aW9uLmhhc2gucmVwbGFjZShcIiNcIiwgXCJcIik7XHJcbiAgICAgICAgICAgIGlmIChcIm9uaGFzaGNoYW5nZVwiIGluIHdpbmRvdykge1xyXG4gICAgICAgICAgICAgICAgJCh3aW5kb3cpLmJpbmQoJ2hhc2hjaGFuZ2UnLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGhhc2ggPSBsb2NhdGlvbi5oYXNoLnJlcGxhY2UoXCIjXCIsIFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghd2FpdCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhbmltYXRlX3Njcm9sbCgkKGRvY3VtZW50KS5maW5kKFwiW2RhdGEtYW5jaG9yPVwiICsgaGFzaCArIFwiXVwiKS5vZmZzZXQoKS50b3ApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB3YWl0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGhhc2ggIT0gXCJcIiAmJiAkKGRvY3VtZW50KS5maW5kKFwiW2RhdGEtYW5jaG9yPVwiICsgaGFzaCArIFwiXVwiKS5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBhbmltYXRlX3Njcm9sbCgkKGRvY3VtZW50KS5maW5kKFwiW2RhdGEtYW5jaG9yPVwiICsgaGFzaCArIFwiXVwiKS5vZmZzZXQoKS50b3ApO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLmVhY2goZnVuY3Rpb24oaWR4KSB7XHJcbiAgICAgICAgICAgIHZhciBtYWluX29iaiA9ICQodGhpcyk7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZCA9ICQodGhpcykuZmluZChcIltkYXRhLW5hdl1cIik7XHJcbiAgICAgICAgICAgIGNoaWxkLmVhY2goZnVuY3Rpb24oaW54KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYW5jaG9yX2lkID0gJCh0aGlzKS5kYXRhKFwibmF2XCIpO1xyXG4gICAgICAgICAgICAgICAgJCh0aGlzKS5jbGljayhmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHdhaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGN3YWl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgZGl2X3RvcCA9ICgkKGRvY3VtZW50KS5maW5kKFwiW2RhdGEtYW5jaG9yPVwiICsgYW5jaG9yX2lkICsgXCJdXCIpLmxlbmd0aCA+IDApID8gJChkb2N1bWVudCkuZmluZChcIltkYXRhLWFuY2hvcj1cIiArIGFuY2hvcl9pZCArIFwiXVwiKS5vZmZzZXQoKS50b3AgOiAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChfc2V0dGluZ3MudXJsX2hhc2gpIGxvY2F0aW9uLmhhc2ggPSBhbmNob3JfaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgJChcImh0bWwsIGJvZHlcIikuc3RvcCgpLmFuaW1hdGUoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzY3JvbGxUb3A6IGRpdl90b3AgLSBfc2V0dGluZ3MuaGVhZF9oaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIH0sIF9zZXR0aW5ncy5zZWMsIF9zZXR0aW5ncy5saW5lYXIsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjd2FpdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICBvYmpfZGF0YSA9IHtcclxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IGFuY2hvcl9pZFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYW5jaG9yLnB1c2gob2JqX2RhdGEpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgc2Nyb2xsX2V2ZW50KCQodGhpcykpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KShqUXVlcnkpO1xyXG4iLCIvKlxyXG4gQ29weXJpZ2h0IChjKSAyMDA5LTIwMTMgUGV0ciBWb3N0cmVsIChodHRwOi8vcGV0ci52b3N0cmVsLmN6LylcclxuIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTElDRU5TRS50eHQpLlxyXG5cclxuIGpRdWVyeSBSZWVsXHJcbiBodHRwOi8vcmVlbDM2MC5vcmdcclxuIFZlcnNpb246IDEuMy4wXHJcbiBVcGRhdGVkOiAyMDEzLTExLTA0XHJcblxyXG4gUmVxdWlyZXMgalF1ZXJ5IDEuNi4yIG9yIGhpZ2hlclxyXG4qL1xyXG4oZnVuY3Rpb24oayl7dmFyIFU9dHlwZW9mIGRlZmluZT09XCJmdW5jdGlvblwiJiZkZWZpbmUuYW1kJiYoZGVmaW5lKFtcImpxdWVyeVwiXSxrKXx8dHJ1ZSksWD0hVSYmdHlwZW9mIG1vZHVsZT09XCJvYmplY3RcIiYmdHlwZW9mIG1vZHVsZS5leHBvcnRzPT1cIm9iamVjdFwiJiYobW9kdWxlLmV4cG9ydHM9ayk7IVUmJiFYJiZrKCl9KShmdW5jdGlvbigpe3JldHVybiBqUXVlcnkucmVlbHx8ZnVuY3Rpb24oayxVLFgscyl7ZnVuY3Rpb24gQmMoZil7cmV0dXJuIG4uaW5zdGFuY2VzLnB1c2goZlswXSkmJmZ9ZnVuY3Rpb24gQ2MoZil7cmV0dXJuKG4uaW5zdGFuY2VzPW4uaW5zdGFuY2VzLm5vdChDYShmLmF0dHIoa2EpKSkpJiZmfWZ1bmN0aW9uIFkoZil7cmV0dXJuIG4uaW5zdGFuY2VzLmZpcnN0KCkuZGF0YShmKX1mdW5jdGlvbiBEYyhmKXtyZXR1cm5cImRhdGE6aW1hZ2UvZ2lmO2Jhc2U2NCxSMGxHT0RsaFwiK2Z9ZnVuY3Rpb24gVihmKXtyZXR1cm5cIjxcIitmK1wiLz5cIn1mdW5jdGlvbiB4KGYpe3JldHVyblwiLlwiK1xyXG4oZnx8XCJcIil9ZnVuY3Rpb24gVmEoZil7cmV0dXJuIGYucmVwbGFjZShEYSxuLmNkbil9ZnVuY3Rpb24gRWEoZil7cmV0dXJuXCJ1cmwoJ1wiKyRiKGYpK1wiJylcIn1mdW5jdGlvbiBhYyhmLGope3JldHVybiB0eXBlb2Ygaj09dGI/altmXTpqfWZ1bmN0aW9uIEZhKGYsaixvKXtyZXR1cm4gdWIoZixHYShqLG8pKX1mdW5jdGlvbiBIYShmLGope3JldHVybiBIKGYpKihqPy0xOjEpfWZ1bmN0aW9uIFdhKGYpe3JldHVybiBmLnRvdWNofHxmLm9yaWdpbmFsRXZlbnQudG91Y2hlcyYmZi5vcmlnaW5hbEV2ZW50LnRvdWNoZXNbMF18fGZ9ZnVuY3Rpb24gdmIoZil7cmV0dXJuIGYub3JpZ2luYWxFdmVudH1mdW5jdGlvbiB5KGYpe3JldHVybiBmPT09cz8wOnR5cGVvZiBmPT13Yj9mOmYrXCJweFwifWZ1bmN0aW9uIENhKGYpe3JldHVyblwiI1wiK2Z9ZnVuY3Rpb24gYmMoZixqLG8pe2Zvcig7Zi5sZW5ndGg8ajspZj1vK2Y7cmV0dXJuIGZ9ZnVuY3Rpb24geGIoZil7cmV0dXJuIGJjKGYsMixcIjBcIil9ZnVuY3Rpb24gJGIoZil7cmV0dXJuIGVuY29kZVVSSShkZWNvZGVVUkkoZikpfVxyXG5mdW5jdGlvbiB5YihmKXtyZXR1cm4gbi5yZS5hcnJheS5leGVjKGYpP2Yuc3BsaXQobi5yZS5hcnJheSk6Zn1mdW5jdGlvbiBFYyhmKXtyZXR1cm4hZi5wYXJlbnRzKHpiKS5sZW5ndGh9ZnVuY3Rpb24gY2MoZil7cmV0dXJuIHR5cGVvZiBmPT13Yj9mOmsuZWFjaChmLGZ1bmN0aW9uKGosbyl7ZltqXT1vPytvOnN9KX1mdW5jdGlvbiBBYihmKXt0cnl7Y29uc29sZS5lcnJvcihcIlsgUmVlbCBdIFwiK2YpfWNhdGNoKGope319aWYoayl7dmFyIFo9ayYmaygpLmpxdWVyeS5zcGxpdCgvXFwuLyk7aWYoIVp8fCsoeGIoWlswXSkreGIoWlsxXSkreGIoWlsyXXx8XCJcIikpPDEwNjAyKXJldHVybiBBYihcIlRvbyBvbGQgalF1ZXJ5IGxpYnJhcnkuIFBsZWFzZSB1cGdyYWRlIHlvdXIgalF1ZXJ5IHRvIHZlcnNpb24gMS42LjIgb3IgaGlnaGVyXCIpO3ZhciBuPWsucmVlbD17dmVyc2lvbjpcIjEuMy4wXCIsZGVmOntmcmFtZToxLGZyYW1lczozNixsb29wczp0cnVlLGNsaWNrZnJlZTpmYWxzZSxkcmFnZ2FibGU6dHJ1ZSxcclxuc2Nyb2xsYWJsZTp0cnVlLHN0ZXBwYWJsZTp0cnVlLHRocm93YWJsZTp0cnVlLHdoZWVsYWJsZTp0cnVlLG9yaWVudGFibGU6ZmFsc2UsY3c6ZmFsc2UscmV2b2x1dGlvbjpzLHN0aXRjaGVkOjAsZGlyZWN0aW9uYWw6ZmFsc2Uscm93OjEscm93czowLHJvd2xvY2s6ZmFsc2UsZnJhbWVsb2NrOmZhbHNlLG9yYml0YWw6MCx2ZXJ0aWNhbDpmYWxzZSxpbnZlcnNlZDpmYWxzZSxmb290YWdlOjYsc3BhY2luZzowLGhvcml6b250YWw6dHJ1ZSxzdWZmaXg6XCItcmVlbFwiLGltYWdlOnMsaW1hZ2VzOlwiXCIscGF0aDpcIlwiLHByZWxvYWQ6XCJmaWRlbGl0eVwiLHNoeTpmYWxzZSxzcGVlZDowLGRlbGF5OjAsdGltZW91dDoyLGR1cmF0aW9uOnMscmVib3VuZDowLjUsZW50cnk6cyxvcGVuaW5nOjAsYnJha2U6MC4yMyx2ZWxvY2l0eTowLHRlbXBvOjM2LGxhemluZXNzOjYsY3Vyc29yOnMsaGludDpcIlwiLGluZGljYXRvcjowLGtsYXNzOlwiXCIscHJlbG9hZGVyOjIsYXJlYTpzLGF0dHI6e30sYW5ub3RhdGlvbnM6cyxcclxucmVzcG9uc2l2ZTpmYWxzZSxncmFwaDpzLG1vbml0b3I6c30sc2NhbjpmdW5jdGlvbigpe3JldHVybiBrKHgoeikrXCI6bm90KFwiK3goQmIpK1wiID4gXCIreCh6KStcIilcIikuZWFjaChmdW5jdGlvbihmLGope2Y9ayhqKTtqPWYuZGF0YSgpO2ouaW1hZ2VzPXliKGouaW1hZ2VzKTt2YXIgbz17fTtrKHgoZGMpK1wiW2RhdGEtZm9yPVwiK2YuYXR0cihrYSkrXCJdXCIpLmVhY2goZnVuY3Rpb24odCxyKXt0PWsocik7cj10LmRhdGEoKTtyLng9Y2MoeWIoci54KSk7ci55PWNjKHliKHIueSkpO3ZhciBnPXQuYXR0cihrYSk7ci5ub2RlPXQucmVtb3ZlRGF0YSgpO29bZ109cn0pO2ouYW5ub3RhdGlvbnM9bztmLnJlbW92ZURhdGEoKS5yZWVsKGopfSl9LGZuOntyZWVsOmZ1bmN0aW9uKCl7dmFyIGY9YXJndW1lbnRzLGo9ayh0aGlzKSxvPWouZGF0YSgpLHQ9ZlswXXx8e30scj1mWzFdO2lmKHR5cGVvZiB0IT1cIm9iamVjdFwiKWlmKHQuc2xpY2UoMCwxKT09XCI6XCIpcmV0dXJuIGoudHJpZ2dlcih0LnNsaWNlKDEpLFxyXG5yKTtlbHNlIGlmKGYubGVuZ3RoPT0xKXJldHVybiBvW3RdO2Vsc2V7aWYociE9PXMpe24ubm9ybWFsW3RdJiYocj1uLm5vcm1hbFt0XShyLG8pKTtpZihvW3RdPT09cylvW3RdPXI7ZWxzZSBpZihvW3RdIT09cilqLnRyaWdnZXIodCtcIkNoYW5nZVwiLFtzLG9bdF09cl0pfXJldHVybiBqfWVsc2V7dmFyIGc9ay5leHRlbmQoe30sbi5kZWYsdCksSz1bXTtqLmZpbHRlcihYYSkudW5yZWVsKCkuZmlsdGVyKGZ1bmN0aW9uKCl7dmFyIGg9ayh0aGlzKSxlPWcuYXR0cixhPWUuc3JjfHxoLmF0dHIocmEpLEk9ZS53aWR0aHx8aC5hdHRyKEwpfHxoLndpZHRoKCk7aD1lLmhlaWdodHx8aC5hdHRyKEQpfHxoLmhlaWdodCgpO2lmKCFhKXJldHVybiBBYihcImBzcmNgIGF0dHJpYnV0ZSBtaXNzaW5nIG9uIHRhcmdldCBpbWFnZVwiKTtpZighSXx8IWgpcmV0dXJuIEFiKFwiRGltZW5zaW9uKHMpIG9mIHRoZSB0YXJnZXQgaW1hZ2UgdW5rbm93blwiKTtyZXR1cm4gdHJ1ZX0pLmVhY2goZnVuY3Rpb24oKXt2YXIgaD1cclxuayh0aGlzKSxlPWZ1bmN0aW9uKGMsZCl7cmV0dXJuIGgucmVlbChjLGQpJiZhKGMpfSxhPWZ1bmN0aW9uKGMpe3JldHVybiBoLmRhdGEoYyl9LEk9e3NldHVwOmZ1bmN0aW9uKCl7aWYoIShoLmhhc0NsYXNzKHopJiZoLnBhcmVudCgpLmhhc0NsYXNzKEJiKSkpe2UoSWEsZyk7dmFyIGM9e3NyYzpoLmF0dHIocmEpLHdpZHRoOmguYXR0cihEKXx8bnVsbCxoZWlnaHQ6aC5hdHRyKEwpfHxudWxsLHN0eWxlOmguYXR0cigkKXx8bnVsbCxcImNsYXNzXCI6aC5hdHRyKGVjKXx8bnVsbH0sZD1oLmF0dHIoZy5hdHRyKS5hdHRyKHJhKSxiPWUoa2EsaC5hdHRyKGthKXx8aC5hdHRyKGthLHorXCItXCIrICtuZXcgRGF0ZSkuYXR0cihrYSkpLGk9ay5leHRlbmQoe30saC5kYXRhKCkpLHA9ZShhYSxnLmltYWdlc3x8W10pLG09ZShXLGcuc3RpdGNoZWQpLGw9IXAubGVuZ3RofHxtO2w9ZShZYSxnLnJlc3BvbnNpdmUmJihGYz90cnVlOiFsKSk7dmFyIHE9ZShmYyx7fSksdT1nLmxvb3BzLHY9Zy5vcmJpdGFsLFxyXG5FPWcucmV2b2x1dGlvbixiYT1nLnJvd3MsY2E9ZShzYSxHYShnLmZvb3RhZ2UsZy5mcmFtZXMpKTtlKFphLGcuc3BhY2luZyk7dmFyIENiPWUoRCwraC5hdHRyKEQpfHxoLndpZHRoKCkpLERiPWUoTCwraC5hdHRyKEwpfHxoLmhlaWdodCgpKSxHYz1lKEphLGcuc2h5KSxnYz1lKE8sdiYmY2F8fGJhPD0xJiZwLmxlbmd0aHx8Zy5mcmFtZXMpLEhjPWJhPjF8fHY7ZShLYSxhYyhcInhcIixFKXx8bS8yfHxDYioyKTtlKEViLCFIYz8wOmFjKFwieVwiLEUpfHwoYmE+Mz9EYjpEYi8oNS1iYSkpKTtiYT1tPzE6bGEoZ2MvY2EpO2UoRmIsbS0odT8wOkNiKSk7ZSgkYSwwKTtiPUNhKGIrZy5zdWZmaXgpO3U9aC5hdHRyKGVjKTt1PSF1P1A6dStBO3U9ayhWKHRhKSx7aWQ6Yi5zdWJzdHIoMSksXCJjbGFzc1wiOnUrQStCYitBK2hjK1wiMFwifSk7dT1oLndyYXAodS5hZGRDbGFzcyhnLmtsYXNzKSkuYWRkQ2xhc3Moeik7Sy5wdXNoKEJjKHUpWzBdKTt1PXUucGFyZW50KCkuYmluZChJLmluc3RhbmNlKTtlKEdiLFxyXG5wLmxlbmd0aD9QOmcuaW1hZ2V8fGQucmVwbGFjZShuLnJlLmltYWdlLFwiJDFcIitnLnN1ZmZpeCtcIi4kMlwiKSk7ZShhYixrKFYodGEpLHtcImNsYXNzXCI6SGJ9KS5hcHBlbmRUbyhcImJvZHlcIikpO2UoTGEsaygpKTtlKGljLFtdKTtlKEosbnVsbCk7ZShCLG51bGwpO2UoUSxnLnJvdyk7ZSh1YSwwKTtlKEliLGJhKTtlKGpjLGcucm93bG9jayk7ZShrYyxnLmZyYW1lbG9jayk7ZShiYixlKE1hLGUoY2IsMCkpKTtlKGRiLDEvZ2MpO2UobGMsYik7ZShNLGUodmEsZy5zcGVlZCk8MCk7ZShOYSxmYWxzZSk7ZShtYSwwKTtlKHdhLGcudmVydGljYWwpO2UoZGEsMCk7ZSh4YSxIYSgxLCFnLmN3JiYhbSkpO2UoZWIse30pO2UoZWEsZmFsc2UpO2UoZmIsZShKYiwwKSk7ZShnYixlKGhiLDApKTtlKE9hLGZhbHNlKTtlKEtiLGZhbHNlKTtlKGZhLGZhbHNlKTtlKG1jLGcuYnJha2UpO2UoTGIsISF2KTtlKGdhLGcudGVtcG8vKG4ubGF6eT9nLmxhemluZXNzOjEpKTtlKHlhLC0xKTtlKGliLC0xKTtlKFBhLFxyXG5nLmFubm90YXRpb25zfHx1LnVuYmluZCh4KFBhKSkmJnt9KTtlKE1iLDEpO2UobmMse2F0dHI6YyxkYXRhOml9KTtnLnN0ZXBwYWJsZXx8dS51bmJpbmQoXCJ1cC5zdGVwcGFibGVcIik7Zy5pbmRpY2F0b3J8fHUudW5iaW5kKFwiLmluZGljYXRvclwiKTtDKFAse292ZXJmbG93Ok5iLHBvc2l0aW9uOlwicmVsYXRpdmVcIn0pO2x8fEMoUCx7d2lkdGg6Q2IsaGVpZ2h0OkRifSk7bCYmay5lYWNoKEljLGZ1bmN0aW9uKGNkLG9jKXtxW29jXT1hKG9jKX0pO0MobmErQSt4KHopLHtkaXNwbGF5Ok9ifSk7Qyh4KEhiKSx7cG9zaXRpb246XCJmaXhlZFwiLGxlZnQ6eSgtMTAwKSx0b3A6eSgtMTAwKX0sdHJ1ZSk7Qyh4KEhiKStBK1hhLHtwb3NpdGlvbjpRYSx3aWR0aDoxMCxoZWlnaHQ6MTB9LHRydWUpO2hhLmJpbmQoSS5wb29sKTtoLnRyaWdnZXIoR2M/XCJwcmVwYXJlXCI6XCJzZXR1cFwiKX19LGluc3RhbmNlOnt0ZWFyZG93bjpmdW5jdGlvbigpe3ZhciBjPWguZGF0YShuYyk7aC5wYXJlbnQoKS51bmJpbmQoSS5pbnN0YW5jZSk7XHJcbmlmKGEoSmEpKWgucGFyZW50KCkudW5iaW5kKGpiLGlhKTtlbHNlIGEoJCkucmVtb3ZlKCkmJmEoTGEpLnVuYmluZChGKTthKGFiKS5lbXB0eSgpO2NsZWFyVGltZW91dChQYik7Y2xlYXJUaW1lb3V0KFFiKTtrKFUpLnVuYmluZChwYyxxYyk7ayhVKS51bmJpbmQoRik7aGEudW5iaW5kKEkucG9vbCk7b2EudW5iaW5kKGphKTtoLnNpYmxpbmdzKCkudW5iaW5kKEYpLnJlbW92ZSgpO2tiKCk7aC5yZW1vdmVBdHRyKFwib25sb2FkZWRcIik7Q2MoaC51bmJpbmQoRikucmVtb3ZlRGF0YSgpLnVud3JhcCgpLmF0dHIoYy5hdHRyKS5kYXRhKGMuZGF0YSkpO2guYXR0cigkKT09UCYmaC5yZW1vdmVBdHRyKCQpfSxzZXR1cDpmdW5jdGlvbigpe2Z1bmN0aW9uIGMocSl7cmV0dXJuIGgudHJpZ2dlcihcImRvd25cIixbV2EocSkuY2xpZW50WCxXYShxKS5jbGllbnRZLHFdKSYmcS5naXZlfWZ1bmN0aW9uIGQocSx1KXtyZXR1cm4hdXx8aC50cmlnZ2VyKFwid2hlZWxcIixbdSxxXSkmJnEuZ2l2ZX12YXIgYj1cclxuaC5wYXJlbnQoKS5hcHBlbmQoemEoKSksaT1lKExhLGsoZy5hcmVhfHxiKSkscD1nLnJvd3M+MSxtPWcuY3Vyc29yLGw9bT09cmM/SmM6bXx8S2M7bT1tPT1yYz9MYytBK1wiIWltcG9ydGFudFwiOnM7QyhBK3goeikse01velVzZXJTZWxlY3Q6bGIsV2Via2l0VXNlclNlbGVjdDpsYixNb3pUcmFuc2Zvcm06XCJ0cmFuc2xhdGVaKDApXCJ9KTtoLnVuYmluZChqYixpYSk7aS5iaW5kKE1jLGMpLmJpbmQoZy5jbGlja2ZyZWU/TmM6T2MsYykuYmluZChnLndoZWVsYWJsZT9QYzpudWxsLGQpLmJpbmQoUWMsZnVuY3Rpb24oKXtyZXR1cm4gZmFsc2V9KTtDKFAse2N1cnNvcjpWYShsKX0pO0MoeChSYikse2N1cnNvcjpcIndhaXRcIn0pO0MoeChtYikrbmEreChtYikrXCIgKlwiLHtjdXJzb3I6VmEobXx8bCl9LHRydWUpO2lmKGEoWWEpKXtDKEEreCh6KSx7d2lkdGg6XCIxMDAlXCIsaGVpZ2h0OlNifSk7ayhVKS5iaW5kKHBjLHFjKX1nLmhpbnQmJmkuYXR0cihcInRpdGxlXCIsZy5oaW50KTtnLmluZGljYXRvciYmXHJcbmIuYXBwZW5kKFJhKFwieFwiKSk7cCYmZy5pbmRpY2F0b3ImJmIuYXBwZW5kKFJhKFwieVwiKSk7Zy5tb25pdG9yJiZiLmFwcGVuZChzYz1rKFYodGEpLHtcImNsYXNzXCI6dGN9KSkmJkMoQSt4KHRjKSx7cG9zaXRpb246UWEsbGVmdDowLHRvcDowfSl9LHByZWxvYWQ6ZnVuY3Rpb24oKXtmdW5jdGlvbiBjKCl7dmFyIHE9bC5jaGlsZHJlbihcIjpub3QoW3NyY10pOmZpcnN0XCIpO3JldHVybiBxLmF0dHIocmEscS5kYXRhKHJhKSl9dmFyIGQ9aC5wYXJlbnQoKSxiPWEoYWEpLGk9IWIubGVuZ3RoLHA9bi5wcmVsb2FkW2cucHJlbG9hZF18fG4ucHJlbG9hZFtuLmRlZi5wcmVsb2FkXTtiPWk/W2EoR2IpXTpwKGIuc2xpY2UoMCksZyxhKTtlKGRhLGk/MC41OjApO3ZhciBtPTAsbD1hKGFiKS5lbXB0eSgpO2k9W107ZC5hZGRDbGFzcyhSYik7ZSgkLGEoJCl8fGsoXCI8XCIrJCsnIHR5cGU9XCJ0ZXh0L2Nzc1wiPicrQy5ydWxlcy5qb2luKFwiXFxuXCIpK1wiPC9cIiskK1wiPlwiKS5wcmVwZW5kVG8oVGIpKTtlKE5hLHRydWUpO1xyXG5oLnRyaWdnZXIoXCJzdG9wXCIpO2cucmVzcG9uc2l2ZSYmVWIoKTtmb3IoaC50cmlnZ2VyKFwicmVzaXplXCIsdHJ1ZSk7Yi5sZW5ndGg7KXtwPW4uc3Vic3RpdHV0ZShnLnBhdGgrYi5zaGlmdCgpLGEpO2soVihYYSkpLmRhdGEocmEscCkuYXBwZW5kVG8obCkuYmluZChcImxvYWQgZXJyb3IgYWJvcnRcIixmdW5jdGlvbihxKXtxLnR5cGUhPVwibG9hZFwiJiZoLnRyaWdnZXIocS50eXBlKTtyZXR1cm4hRWMoZCkmJmgudHJpZ2dlcihcInByZWxvYWRlZFwiKSYmYygpJiZmYWxzZX0pO2kucHVzaChwKX1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7Zm9yKDsrK208bi5jb25jdXJyZW50X3JlcXVlc3RzOyljKCl9LDApO2UoaWMsaSk7ZShKYSxmYWxzZSl9LHByZWxvYWRlZDpmdW5jdGlvbigpe3ZhciBjPWEoYWEpLmxlbmd0aHx8MSxkPWUoZGEsR2EoYShkYSkrMSxjKSk7ZD09PTEmJmgudHJpZ2dlcihcImZyYW1lQ2hhbmdlXCIsW3MsYShKKV0pO2lmKGQ9PT1jKXtoLnBhcmVudCgpLnJlbW92ZUNsYXNzKFJiKTtcclxuaC50cmlnZ2VyKFwibG9hZGVkXCIpfX0sbG9hZGVkOmZ1bmN0aW9uKCl7YShhYSkubGVuZ3RoPjF8fGguY3NzKHtiYWNrZ3JvdW5kSW1hZ2U6RWEobi5zdWJzdGl0dXRlKGcucGF0aCthKEdiKSxhKSl9KS5hdHRyKHtzcmM6VmEodWMpfSk7YShXKSYmaC5hdHRyKHtzcmM6VmEodWMpfSk7YShLYil8fGUobWEsZy52ZWxvY2l0eXx8MCk7ZShOYSxmYWxzZSk7cGE9dHJ1ZX0scHJlcGFyZTpmdW5jdGlvbigpe2guY3NzKFwiZGlzcGxheVwiLE9iKS5wYXJlbnQoKS5vbmUoamIsaWEpfSxvcGVuaW5nOmZ1bmN0aW9uKCl7aWYoIWcub3BlbmluZylyZXR1cm4gaC50cmlnZ2VyKFwib3BlbmluZ0RvbmVcIik7ZShmYSx0cnVlKTtlKFZiLCFhKHZhKSk7dmFyIGM9Zy5lbnRyeXx8Zy5zcGVlZCxkPWEoQiksYj1nLm9wZW5pbmc7ZShCLGQtYypiKTtlKHlhLGxhKGIqWShnYSkpKX0sb3BlbmluZ0RvbmU6ZnVuY3Rpb24oKXtmdW5jdGlvbiBjKGIpe3JldHVybiBoLnRyaWdnZXIoXCJvcmllbnRcIixbdmIoYikuYWxwaGEsXHJcbnZiKGIpLmJldGEsdmIoYikuZ2FtbWEsYl0pJiZiLmdpdmV9ZShTYSxmYWxzZSk7ZShmYSxmYWxzZSk7dmFyIGQ9bmIreChmYSk7aGEudW5iaW5kKGQsSS5wb29sW2RdKTtnLm9yaWVudGFibGUmJmsoVSkuYmluZChSYyxjKTtpZihnLmRlbGF5PjApUGI9c2V0VGltZW91dChmdW5jdGlvbigpe2gudHJpZ2dlcihcInBsYXlcIil9LGcuZGVsYXkqMUUzKTtlbHNlIGgudHJpZ2dlcihcInBsYXlcIil9LHBsYXk6ZnVuY3Rpb24oYyxkKXtkPWQ/ZSh2YSxkKTphKHZhKSpIYSgxLGEoTSkpOyhjPWcuZHVyYXRpb24pJiZlKGliLGxhKGMqWShnYSkpKTtlKE0sZDwwKTtkPWUoU2EsISFkKTtlKFZiLCFkKTtBYSgpfSxyZWFjaDpmdW5jdGlvbihjLGQsYil7aWYoZCE9YShKKSl7Yz1hKE8pO2UoUSxsYShkL2MpKTt2YXIgaT1lKGJiLGEoSikpO2Q9ZShNYSxkKTtkPWUoY2Isbi5tYXRoLmRpc3RhbmNlKGksZCxjKSk7Yj1IKGJ8fGEodmEpKSpIYSgxLGQ8MCk7aC50cmlnZ2VyKFwicGxheVwiLGIpfX0scGF1c2U6ZnVuY3Rpb24oKXt3KCl9LFxyXG5zdG9wOmZ1bmN0aW9uKCl7dmFyIGM9ZShWYix0cnVlKTtlKFNhLCFjKX0sZG93bjpmdW5jdGlvbihjLGQsYixpKXtmdW5jdGlvbiBwKGwpe3JldHVybiBoLnRyaWdnZXIoXCJwYW5cIixbV2EobCkuY2xpZW50WCxXYShsKS5jbGllbnRZLGxdKSYmbC5naXZlfWZ1bmN0aW9uIG0obCl7cmV0dXJuIGgudHJpZ2dlcihcInVwXCIsW2xdKSYmbC5naXZlfWlmKCEoIWcuY2xpY2tmcmVlJiZpJiZpLmJ1dHRvbiE9PXMmJmkuYnV0dG9uIT1TYykpaWYoZy5kcmFnZ2FibGUpe2UoZWEsYShKKSk7Yz1nLmNsaWNrZnJlZTtlKG1hLDApO2k9Yz9hKExhKTpvYTtvYj1wYihhKEthKSxkLGIpO3coKTtrYigpO0c9MDtrKHpiLG9hKS5hZGRDbGFzcyhtYik7aS5iaW5kKFRjK0ErVWMscCkuYmluZChWYytBK1djLG0pLmJpbmQoYz9YYzpZYyxtKX19LHVwOmZ1bmN0aW9uKCl7ZShlYSxmYWxzZSk7ZShPYSxmYWxzZSk7dmFyIGM9Zy50aHJvd2FibGUsZD1IKFRhWzBdK1RhWzFdKS82MDtOPWUobWEsIWM/MDpjPT09XHJcbnRydWU/ZDpHYShjLGQpKT8xOjA7dygpO2tiKCk7ayh6YixvYSkucmVtb3ZlQ2xhc3MobWIpOyhnLmNsaWNrZnJlZT9hKExhKTpvYSkudW5iaW5kKGphKX0scGFuOmZ1bmN0aW9uKGMsZCxiLGkpe2lmKGcuZHJhZ2dhYmxlJiZVYSl7VWE9ZmFsc2U7dygpO2M9Zy5yb3dzO3ZhciBwPWcub3JiaXRhbCxtPSFhKE9hKSYmYzw9MSYmIXAmJmcuc2Nyb2xsYWJsZSxsPXt4OmQtb2IueCx5OmItb2IueX0scT17eDpIKGwueCkseTpIKGwueSl9O2lmKGkmJm0mJnEueDxxLnkpcmV0dXJuIGkuZ2l2ZT10cnVlO2lmKHEueD4wfHxxLnk+MCl7aSYmKGkuZ2l2ZT1mYWxzZSk7Rz11YihxLngscS55KTtvYj17eDpkLHk6Yn07aT1hKEthKTttPWEoZWIpO3E9YSh3YSk7aWYoIWEoa2MpKXt2YXIgdT1lKEIsdmMocT9iLW0ueTpkLW0ueCxhKGZiKSxpLGEoZ2IpLGEoaGIpLGEoeGEpLHE/Yi1tLnk6ZC1tLngpKTtlKE9hLGEoT2EpfHxhKEopIT1hKGVhKSk7KGw9d2MocT9sLnk6bC54fHwwKSkmJmUoTSxsPFxyXG4wKX1pZihwJiZhKExiKSl7ZSh3YSxIKGItbS55KT5IKGQtbS54KSk7bT1wYihpLGQsYil9aWYoYz4xJiYhYShqYykpe2M9YShFYik7cD1hKEpiKTtsPS1wKmM7ZSh1YSxuLm1hdGguZW52ZWxvcGUoYi1tLnkscCxjLGwsbCtjLC0xKSl9ISh1JTEpJiYhZy5sb29wcyYmcGIoaSxkLGIpfX19LHdoZWVsOmZ1bmN0aW9uKGMsZCxiKXtpZihkKXtxYj10cnVlO2M9bGEocWEuc3FydChIKGQpKS8yKTtjPUhhKGMsZD4wKTtkPTAuMDgzMyphKEthKTtwYihkKTtjJiZlKE0sYzwwKTtlKG1hLDApO2UoQix2YyhjLGEoZmIpLGQsYShnYiksYShoYiksYSh4YSkpKTtiJiZiLnByZXZlbnREZWZhdWx0KCk7YiYmKGIuZ2l2ZT1mYWxzZSk7dygpO2gudHJpZ2dlcihcInVwXCIsW2JdKX19LG9yaWVudDpmdW5jdGlvbihjLGQpe2lmKCEoIVVhfHxSKSl7eGM9dHJ1ZTtjPWQvMzYwO2ZyYWN0aW9uPWUoQiwrKGcuc3RpdGNoZWR8fGcuY3c/MS1jOmMpLnRvRml4ZWQoMikpO1VhPWZhbHNlfX0sZnJhY3Rpb25DaGFuZ2U6ZnVuY3Rpb24oYyxcclxuZCxiKXtpZihkPT09cyl7Yz0xK3JiKGIvYShkYikpO2Q9Zy5yb3dzPjE7Yj1nLm9yYml0YWw7ZShMYiwhIWImJihjPD1ifHxjPj1hKHNhKS1iKzIpKTtpZihkKWMrPShhKFEpLTEpKmEoTyk7ZShKLGMpfX0sdGllckNoYW5nZTpmdW5jdGlvbihjLGQsYil7aWYoZD09PXMpe2M9ZShRLFMoV2IoYiwxLGcucm93cykpKTtkPWEoTyk7Yj1hKEopJWR8fGQ7ZShKLGIrYypkLWQpfX0scm93Q2hhbmdlOmZ1bmN0aW9uKGMsZCxiKXtkPT09cyYmWGIodWEscyxiLGcucm93cyl9LGZyYW1lQ2hhbmdlOmZ1bmN0aW9uKGMsZCxiKXtpZihkPT09cyl7dGhpcy5jbGFzc05hbWU9dGhpcy5jbGFzc05hbWUucmVwbGFjZShuLnJlLmZyYW1lX2tsYXNzLGhjK2IpO2M9YShPKTtkPWcucm93czt2YXIgaT1nLnBhdGgscD1iJWN8fGMsbT0oKGItcCkvYysxLTEpLyhkLTEpLGw9YShRKTshZD9hKHVhKTpYYih1YSxtLGwsZCk7dmFyIHE9WGIoQixzLHAsYyksdT1hKHNhKTtpZihnLm9yYml0YWwmJmEod2EpKXtiPVxyXG5nLmludmVyc2VkP3UrMS1iOmI7Yis9dX12YXIgdj1hKFcpO2M9YShhYSk7aWYoIWMubGVuZ3RofHx2KXtwPWEoWmEpO3ZhciBFPWEoRCk7bT1hKEwpO2lmKHYpe2I9ZSgkYSxTKFdiKHEsMCxhKEZiKSkpJXYpO2Q9ZDw9MT8wOihtK3ApKihkLWwpO2I9W3koLWIpLHkoLWQpXTtjPWMubGVuZ3RoPjEmJmNbbC0xXTtkPW4uc3Vic3RpdHV0ZShpK2MsYSk7YyYmaC5jc3MoXCJiYWNrZ3JvdW5kSW1hZ2VcIikuc2VhcmNoKGQpPDAmJmguY3NzKHtiYWNrZ3JvdW5kSW1hZ2U6RWEoZCl9KX1lbHNle2k9Zy5ob3Jpem9udGFsO2w9YiV1LTE7bD1sPDA/dS0xOmw7Yj1yYigoYi0wLjEpL3UpO2IrPWQ+MT8wOmEoTSk/MDohZy5kaXJlY3Rpb25hbD8wOmEoSWIpO2I9YiooKGk/bTpFKStwKTtkPWwqKChpP0U6bSkrcCk7Yj1jLmxlbmd0aD9bMCwwXTppP1t5KC1kKSx5KC1iKV06W3koLWIpLHkoLWQpXX1oLmNzcyh7YmFja2dyb3VuZFBvc2l0aW9uOmIuam9pbihBKX0pfWVsc2V7YShZYSkmJlViKCk7YShkYSkmJlxyXG5oLmF0dHIoe3NyYzokYihuLnN1YnN0aXR1dGUoaStjW2ItMV0sYSkpfSl9fX0sXCJmcmFtZUNoYW5nZS5yZWFjaFwiOmZ1bmN0aW9uKGMsZCxiKXtpZighKCFhKE1hKXx8ZCE9PXMpKXtjPW4ubWF0aC5kaXN0YW5jZShhKGJiKSxiLGEoTykpO2lmKEgoYyk+PUgoYShjYikpKXtlKEosZShNYSkpO2UoTWEsZShjYixlKGJiLDApKSk7aC50cmlnZ2VyKFwic3RvcFwiKX19fSxcImltYWdlQ2hhbmdlIGltYWdlc0NoYW5nZVwiOmZ1bmN0aW9uKCl7aC50cmlnZ2VyKFwicHJlbG9hZFwiKX0sXCJmcmFjdGlvbkNoYW5nZS5pbmRpY2F0b3JcIjpmdW5jdGlvbihjLGQsYil7aWYoZy5pbmRpY2F0b3ImJmQ9PT1zKXtjPWcuaW5kaWNhdG9yO3ZhciBpPWcub3JiaXRhbDtkPWkmJmEod2EpP2EoTCk6YShEKTtpPWk/YShzYSk6Zy5pbWFnZXMubGVuZ3RofHxhKE8pO2k9bGEoZC9pKTtkLT1pO2I9UyhXYihiLDAsZCkpO2I9IWcuY3d8fGEoVyk/YjpkLWI7UmEuJHguY3NzKGEod2EpP3tsZWZ0OjAsdG9wOnkoYiksYm90dG9tOlNiLFxyXG53aWR0aDpjLGhlaWdodDppfTp7Ym90dG9tOjAsbGVmdDp5KGIpLHRvcDpTYix3aWR0aDppLGhlaWdodDpjfSl9fSxcInRpZXJDaGFuZ2UuaW5kaWNhdG9yXCI6ZnVuY3Rpb24oYyxkLGIpe2lmKGcucm93cz4xJiZnLmluZGljYXRvciYmZD09PXMpe3ZhciBpPWEoTCk7Yz1nLmluZGljYXRvcjtkPWxhKGkvZy5yb3dzKTtpLT1kO2I9UyhiKmkpO1JhLiR5LmNzcyh7bGVmdDowLHRvcDpiLHdpZHRoOmMsaGVpZ2h0OmR9KX19LFwic2V0dXAuYW5ub3RhdGlvbnNcIjpmdW5jdGlvbigpe3ZhciBjPWgucGFyZW50KCk7ay5lYWNoKGEoUGEpLGZ1bmN0aW9uKGQsYil7dmFyIGk9dHlwZW9mIGIubm9kZT09d2I/ayhiLm5vZGUpOmIubm9kZXx8e307aT1pLmpxdWVyeT9pOmsoVih0YSksaSk7aT1pLmF0dHIoe2lkOmR9KS5hZGRDbGFzcyhkYyk7dmFyIHA9Yi5pbWFnZT9rKFYoWGEpLGIuaW1hZ2UpOmsoKSxtPWIubGluaz9rKFYoXCJhXCIpLGIubGluaykuY2xpY2soZnVuY3Rpb24oKXtoLnRyaWdnZXIoXCJ1cC5hbm5vdGF0aW9uc1wiLFxyXG57dGFyZ2V0Om19KX0pOmsoKTtDKENhKGQpLHtkaXNwbGF5OmxiLHBvc2l0aW9uOlFhfSx0cnVlKTtiLmltYWdlfHxiLmxpbmsmJmkuYXBwZW5kKG0pO2IubGlua3x8Yi5pbWFnZSYmaS5hcHBlbmQocCk7Yi5saW5rJiZiLmltYWdlJiZpLmFwcGVuZChtLmFwcGVuZChwKSk7aS5hcHBlbmRUbyhjKX0pfSxcInByZXBhcmUuYW5ub3RhdGlvbnNcIjpmdW5jdGlvbigpe2suZWFjaChhKFBhKSxmdW5jdGlvbihjKXtrKENhKGMpKS5oaWRlKCl9KX0sXCJmcmFtZUNoYW5nZS5hbm5vdGF0aW9uc1wiOmZ1bmN0aW9uKGMsZCl7aWYoISghYShkYSl8fGQhPT1zKSl7dmFyIGI9YShEKSxpPWEoVykscD1hKCRhKTtrLmVhY2goYShQYSksZnVuY3Rpb24obSxsKXttPWsoQ2EobSkpO3ZhciBxPWwuc3RhcnR8fDEsdT1sLmVuZCx2PXZ8fGEoSiksRT12LTEsYmE9bC5hdD9sLmF0W0VdPT1cIitcIjpmYWxzZTtFPWwuYXQ/RTpFLXErMTt2PXR5cGVvZiBsLnghPXRiP2wueDpsLnhbRV07dmFyIGNhPXR5cGVvZiBsLnkhPVxyXG50Yj9sLnk6bC55W0VdO2w9diE9PXMmJmNhIT09cyYmKGwuYXQ/YmE6RT49MCYmKCF1fHxFPD11LXEpKTtpZihpKXtxPXY+aS1iJiZwPj0wJiZwPGI7dj0hKHY8YiYmcD5pLWIpP3Y6ditpO3Y9IXE/djp2LWk7di09cH1pZihhKFlhKSl7cT1hKE1iKTt2PXYmJnYqcTtjYT1jYSYmY2EqcX12PXtkaXNwbGF5Omw/T2I6bGIsbGVmdDp5KHYpLHRvcDp5KGNhKX07bS5jc3Modil9KX19LFwidXAuYW5ub3RhdGlvbnNcIjpmdW5jdGlvbihjLGQpe2lmKCEoRz4xMHx8cWIpKXtjPWsoZC50YXJnZXQpOyhjLmlzKFwiYVwiKT9jOmMucGFyZW50cyhcImFcIikpLmF0dHIoXCJocmVmXCIpJiYoRz0xMCl9fSxcInVwLnN0ZXBwYWJsZVwiOmZ1bmN0aW9uKCl7R3x8cWJ8fGgudHJpZ2dlcihhKGViKS54LWgub2Zmc2V0KCkubGVmdD4wLjUqYShEKT9cInN0ZXBSaWdodFwiOlwic3RlcExlZnRcIil9LFwic3RlcExlZnQgc3RlcFJpZ2h0XCI6ZnVuY3Rpb24oKXt3KCl9LHN0ZXBMZWZ0OmZ1bmN0aW9uKCl7ZShNLGZhbHNlKTtlKEIsXHJcbmEoQiktYShkYikqYSh4YSkpfSxzdGVwUmlnaHQ6ZnVuY3Rpb24oKXtlKE0sdHJ1ZSk7ZShCLGEoQikrYShkYikqYSh4YSkpfSxzdGVwVXA6ZnVuY3Rpb24oKXtlKFEsYShRKS0xKX0sc3RlcERvd246ZnVuY3Rpb24oKXtlKFEsYShRKSsxKX0scmVzaXplOmZ1bmN0aW9uKGMsZCl7aWYoIShhKE5hKSYmIWQpKXt2YXIgYj1hKFcpLGk9YShaYSk7Yz1hKEwpO3ZhciBwPSFhKGFhKS5sZW5ndGh8fGIsbT1nLnJvd3N8fDE7Yj1hKGFhKS5sZW5ndGg/IWI/czp5KGIpK0EreShjKTpiJiZ5KGIpK0EreSgoYytpKSptLWkpfHx5KChhKEQpK2kpKmEoc2EpLWkpK0EreSgoYytpKSphKEliKSptKihnLmRpcmVjdGlvbmFsPzI6MSktaSk7aC5jc3Moe2hlaWdodDpwP3koYyk6bnVsbCxiYWNrZ3JvdW5kU2l6ZTpifHxudWxsfSk7ZHx8aC50cmlnZ2VyKFwiaW1hZ2VzQ2hhbmdlXCIpfX0sXCJzZXR1cC5mdVwiOmZ1bmN0aW9uKCl7ZShKLGcuZnJhbWUrKGEoUSktMSkqYShPKSk7aC50cmlnZ2VyKFwicHJlbG9hZFwiKX0sXHJcblwid2hlZWwuZnVcIjpmdW5jdGlvbigpe3FiPWZhbHNlfSxcImNsZWFuLmZ1XCI6ZnVuY3Rpb24oKXtoLnRyaWdnZXIoXCJ0ZWFyZG93blwiKX0sXCJsb2FkZWQuZnVcIjpmdW5jdGlvbigpe2gudHJpZ2dlcihcIm9wZW5pbmdcIil9fSxwb29sOntcInRpY2sucmVlbC5wcmVsb2FkXCI6ZnVuY3Rpb24oKXtpZighKCEocGF8fGEoTmEpKXx8YShKYSkpKXt2YXIgYz1hKEQpLGQ9WmMoemEuJC5jc3MoRCkpLGI9YShhYSkubGVuZ3RofHwxLGk9UygxL2IqYShkYSkqYyk7emEuJC5jc3Moe3dpZHRoOmQrKGktZCkvMysxfSk7aWYoYShkYSk9PT1iJiZkPmMtMSl7cGE9ZmFsc2U7emEuJC5mYWRlT3V0KDMwMCxmdW5jdGlvbigpe3phLiQuY3NzKHtvcGFjaXR5OjEsd2lkdGg6MH0pfSl9fX0sXCJ0aWNrLnJlZWxcIjpmdW5jdGlvbihjKXtpZighYShKYSkpe3ZhciBkPWEobWEpLGI9WShnYSksaT1nLm1vbml0b3I7aWYoISghbi5pbnRlbnNlJiYkYygpKSl7aWYoTil7ZD1kLWEobWMpL2IqTjtkPWUobWEsZD4wLjE/ZDooTj1cclxuUj0wKSl9aSYmc2MudGV4dChhKGkpKTtkJiZOKys7UiYmUisrO3djKDApO1VhPXRydWU7aWYoUiYmIWQpcmV0dXJuIFQoYyk7aWYoYShlYSkpcmV0dXJuIFQoYyx3KCkpO2lmKCEoYSh5YSk+MCkpe2lmKCFnLmxvb3BzJiZnLnJlYm91bmQpeyFSJiYhKGEoQiklMSk/WWIrKzooWWI9MCk7WWI+PWcucmVib3VuZCoxRTMvYiYmZShNLCFhKE0pKX1jPWEoeGEpKkhhKDEsYShNKSk7Yj1hKGliKTtkPSghYShTYSl8fHhjfHwhYj9kOkgoYSh2YSkpK2QpL1koZ2EpO2UoQixhKEIpLWQqYyk7Yj0hZy5kdXJhdGlvbj9iOmI+MCYmZShpYixiLTEpOyFiJiZhKFNhKSYmaC50cmlnZ2VyKFwic3RvcFwiKX19fX0sXCJ0aWNrLnJlZWwub3BlbmluZ1wiOmZ1bmN0aW9uKCl7aWYoYShmYSkpe3ZhciBjPShnLmVudHJ5fHxnLnNwZWVkKS9ZKGdhKSooZy5jdz8tMToxKSxkPWUoeWEsYSh5YSktMSk7ZShCLGEoQikrYyk7ZHx8aC50cmlnZ2VyKFwib3BlbmluZ0RvbmVcIil9fX19LHBhPWZhbHNlLFQ9ZnVuY3Rpb24oYyxcclxuZCl7cmV0dXJuIGMuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCl8fGR9LGlhPWZ1bmN0aW9uKCl7aC50cmlnZ2VyKFwic2V0dXBcIil9LFIsTj0wLEFhPWZ1bmN0aW9uKCl7cmV0dXJuIFI9MH0sdz1mdW5jdGlvbigpe2NsZWFyVGltZW91dChQYik7aGEudW5iaW5kKG5iK3goZmEpLEkucG9vbFtuYit4KGZhKV0pO2UoeWEsMCk7ZShLYix0cnVlKTtyZXR1cm4gUj0tZy50aW1lb3V0KlkoZ2EpfSxHPTAscWI9ZmFsc2UseGM9ZmFsc2Usc2M9aygpLHphPWZ1bmN0aW9uKCl7QyhBK3goeWMpLHtwb3NpdGlvbjpRYSxsZWZ0OjAsYm90dG9tOjAsaGVpZ2h0OmcucHJlbG9hZGVyLG92ZXJmbG93Ok5iLGJhY2tncm91bmRDb2xvcjpcIiMwMDBcIn0pO3JldHVybiB6YS4kPWsoVih0YSkse1wiY2xhc3NcIjp5Y30pfSxSYT1mdW5jdGlvbihjKXtDKEEreCh6YykreChjKSx7cG9zaXRpb246UWEsd2lkdGg6MCxoZWlnaHQ6MCxvdmVyZmxvdzpOYixiYWNrZ3JvdW5kQ29sb3I6XCIjMDAwXCJ9KTtyZXR1cm4gUmFbXCIkXCIrXHJcbmNdPWsoVih0YSkse1wiY2xhc3NcIjp6YytBK2N9KX0sQz1mdW5jdGlvbihjLGQsYil7ZnVuY3Rpb24gaShwKXt2YXIgbT1bXTtrLmVhY2gocCxmdW5jdGlvbihsLHEpe20ucHVzaChsLnJlcGxhY2UoLyhbQS1aXSkvZyxcIi0kMVwiKS50b0xvd2VyQ2FzZSgpK1wiOlwiK3kocSkrXCI7XCIpfSk7cmV0dXJuXCJ7XCIrbS5qb2luKFApK1wifVwifWI9Yj9QOmEobGMpO2M9Yy5yZXBsYWNlKC9eLyxiKS5yZXBsYWNlKG5hLG5hK2IpO3JldHVybiBDLnJ1bGVzLnB1c2goYytpKGQpKSYmZH0sJGM9ZnVuY3Rpb24oKXt2YXIgYz1hKEwpLGQ9YShEKSxiPWhbMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7cmV0dXJuIGIudG9wPC1jfHxiLmxlZnQ8LWR8fGIucmlnaHQ+ZCtrKFUpLndpZHRoKCl8fGIuYm90dG9tPmMrayhVKS5oZWlnaHQoKX0sWWI9MCxvYj17eDowLHk6MH0sd2M9ZnVuY3Rpb24oYyl7cmV0dXJuIFRhLnB1c2goYykmJlRhLnNoaWZ0KCkmJmN9LGtiPWZ1bmN0aW9uKCl7cmV0dXJuIFRhPVswLDBdfSxcclxuVGE9a2IoKSx2Yz1nLmdyYXBofHxuLm1hdGhbZy5sb29wcz9cImhhdGNoXCI6XCJlbnZlbG9wZVwiXSxxYz1mdW5jdGlvbigpe2NsZWFyVGltZW91dChRYik7UWI9c2V0VGltZW91dChVYixuLnJlc2l6ZV9nYXVnZSl9LFViPWZ1bmN0aW9uKCl7aWYoaC53aWR0aCgpIT1hKEQpKXt2YXIgYz1hKGZjKSxkPWUoTWIsaC53aWR0aCgpL2Mud2lkdGgpO2suZWFjaChjLGZ1bmN0aW9uKGIsaSl7ZShiLFMoaSpkKSl9KTtoLnRyaWdnZXIoXCJyZXNpemVcIil9fSxQYixRYixwYj1mdW5jdGlvbihjLGQsYil7dmFyIGk9ZShmYixhKEIpKTtlKEpiLGEodWEpKTt2YXIgcD1nLmxvb3BzO2UoZ2IscD8wOi1pKmMpO2UoaGIscD9jOmMtaSpjKTtyZXR1cm4gZCE9PXMmJmUoZWIse3g6ZCx5OmJ9KXx8c30sVWE9dHJ1ZSxYYj1mdW5jdGlvbihjLGQsYixpKXtpZihpKXt2YXIgcD1hKGMpfHwwO2I9ZCE9PXM/ZDooYi0xKS8oaS0xKTtiPWMhPUI/YjpHYShiLDAuOTk5OSk7cmV0dXJuIGQ9K0gocC1iKS50b0ZpeGVkKDgpPj1cclxuKygxLyhpLTEpKS50b0ZpeGVkKDgpP2UoYyxiKTpkfHxwfX0sb2E9aGE7dHJ5e2lmKGhhWzBdIT10b3AuZG9jdW1lbnQpb2E9aGEuYWRkKHRvcC5kb2N1bWVudCl9Y2F0Y2goZGQpe310b3A9PT1zZWxmP2soKTpmdW5jdGlvbihjKXtrKFwiaWZyYW1lXCIsb2EubGFzdCgpKS5lYWNoKGZ1bmN0aW9uKCl7dHJ5e2lmKGsodGhpcykuY29udGVudHMoKS5maW5kKFRiKS5odG1sKCk9PWsoVGIpLmh0bWwoKSlyZXR1cm4oYz1rKHRoaXMpKSYmZmFsc2V9Y2F0Y2goZCl7fX0pO3JldHVybiBjfSgpO0MucnVsZXM9W107SS5zZXR1cCgpfSk7c2I9c2J8fGZ1bmN0aW9uIGgoKXt2YXIgZT0rbmV3IERhdGUsYT1ZKGdhKTtpZighYSlyZXR1cm4gc2I9bnVsbDtoYS50cmlnZ2VyKG5iKTtuLmNvc3Q9KCtuZXcgRGF0ZStuLmNvc3QtZSkvMjtyZXR1cm4gc2I9c2V0VGltZW91dChoLHViKDQsMUUzL2Etbi5jb3N0KSl9KCk7cmV0dXJuIGsoSyl9fSx1bnJlZWw6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy50cmlnZ2VyKFwidGVhcmRvd25cIil9fSxcclxucmU6e2ltYWdlOi9eKC4qKVxcLihqcGd8anBlZ3xwbmd8Z2lmKVxcPz8uKiQvaSx1YTpbLyhtc2llfG9wZXJhfGZpcmVmb3h8Y2hyb21lfHNhZmFyaSlbIFxcLzpdKFtcXGQuXSspL2ksLyh3ZWJraXQpXFwvKFtcXGQuXSspL2ksLyhtb3ppbGxhKVxcLyhbXFxkLl0rKS9pXSxhcnJheTovICosICovLGxhenlfYWdlbnQ6L1xcKGlwaG9uZXxpcG9kfGFuZHJvaWR8ZmVubmVjfGJsYWNrYmVycnkvaSxmcmFtZV9rbGFzczovZnJhbWUtXFxkKy8sc3Vic3RpdHV0aW9uOi8oQChbQS1aXSkpL2csbm9fbWF0Y2g6L14odW5kZWZpbmVkfCkkLyxzZXF1ZW5jZTovKF5bXiN8XSooWyNdKylbXiN8XSopKCR8W3xdKFswLTldKylcXC5cXC4oWzAtOV0rKSkoJHxbfF0oWzAtOV0rKSQpL30sY2RuOlwiLy9jZG4uanNkZWxpdnIubmV0L2pxdWVyeS5yZWVsLzEuMy9cIixtYXRoOntlbnZlbG9wZTpmdW5jdGlvbihmLGosbyx0LHIsZyl7cmV0dXJuIGorRmEodCxyLC1mKmcpL299LGhhdGNoOmZ1bmN0aW9uKGYsaixvLHQscixnKXtmPShmPHQ/cjowKStcclxuZiVyO2Y9aistZipnL287cmV0dXJuIGYtcmIoZil9LGludGVycG9sYXRlOmZ1bmN0aW9uKGYsaixvKXtyZXR1cm4gaitmKihvLWopfSxkaXN0YW5jZTpmdW5jdGlvbihmLGosbyl7dmFyIHQ9by8yO2Y9ai1mO3JldHVybiBmPC10P2YrbzpmPnQ/Zi1vOmZ9fSxwcmVsb2FkOntmaWRlbGl0eTpmdW5jdGlvbihmLGosbyl7ZnVuY3Rpb24gdChlLGEsSSl7ZnVuY3Rpb24gcGEoRyl7Zm9yKDshKEc+PTEmJkc8PU4pOylHKz1HPDE/K046LU47cmV0dXJuIGhbSStHXXx8KGhbSStHXT0hIVQucHVzaChHKSl9aWYoIWUubGVuZ3RoKXJldHVybltdO3ZhciBUPVtdLGlhPTQqYSxSPWouZnJhbWUsTj1lLmxlbmd0aDthPXRydWU7Zm9yKHZhciBBYT1OL2lhLHc9MDt3PGlhO3crKylwYShSK1ModypBYSkpO2Zvcig7QWE+MTspe3c9MDtpYT1ULmxlbmd0aDtBYS89Mjtmb3IoYT0hYTt3PGlhO3crKylwYShUW3ddKyhhPzE6LTEpKlMoQWEpKX1mb3Iodz0wO3c8PU47dysrKXBhKHcpO2Zvcih3PTA7dzxULmxlbmd0aDt3KyspVFt3XT1cclxuZVtUW3ddLTFdO3JldHVybiBUfXZhciByPWoub3JiaXRhbCxnPXI/MjpqLnJvd3N8fDEsSz1yP28oc2EpOm8oTyk7bz0oai5yb3ctMSkqSztyPVtdLmNvbmNhdChmKTt2YXIgaD1uZXcgQXJyYXkoZi5sZW5ndGgrMSk7Zj1nPDI/W106ci5zbGljZShvLG8rSyk7cmV0dXJuIHQoZiwxLG8pLmNvbmNhdCh0KHIsZywwKSl9LGxpbmVhcjpmdW5jdGlvbihmKXtyZXR1cm4gZn19LHN1YnN0aXR1dGU6ZnVuY3Rpb24oZixqKXtyZXR1cm4gZi5yZXBsYWNlKG4ucmUuc3Vic3RpdHV0aW9uLGZ1bmN0aW9uKG8sdCxyKXtyZXR1cm4gdHlwZW9mIG4uc3Vic3RpdHV0ZXNbcl09PVwiZnVuY3Rpb25cIj9uLnN1YnN0aXR1dGVzW3JdKGopOkFjW3JdP2ooQWNbcl0pOnR9KX0sc3Vic3RpdHV0ZXM6e1Q6ZnVuY3Rpb24oKXtyZXR1cm4rbmV3IERhdGV9fSxub3JtYWw6e2ZyYWN0aW9uOmZ1bmN0aW9uKGYsail7aWYoZj09PW51bGwpcmV0dXJuIGY7cmV0dXJuIGpbSWFdLmxvb3BzP2YtcmIoZik6RmEoMCwxLGYpfSxcclxudGllcjpmdW5jdGlvbihmKXtpZihmPT09bnVsbClyZXR1cm4gZjtyZXR1cm4gRmEoMCwxLGYpfSxyb3c6ZnVuY3Rpb24oZixqKXtpZihmPT09bnVsbClyZXR1cm4gZjtyZXR1cm4gUyhGYSgxLGpbSWFdLnJvd3MsZikpfSxmcmFtZTpmdW5jdGlvbihmLGope2lmKGY9PT1udWxsKXJldHVybiBmO3ZhciBvPWpbSWFdO2o9altPXSooby5vcmJpdGFsPzI6by5yb3dzfHwxKTtmPVMoby5sb29wcz9mJWp8fGo6RmEoMSxqLGYpKTtyZXR1cm4gZjwwP2YrajpmfSxpbWFnZXM6ZnVuY3Rpb24oZixqKXt2YXIgbz1uLnJlLnNlcXVlbmNlLmV4ZWMoZik7cmV0dXJuIW8/ZjpuLnNlcXVlbmNlKG8saltJYV0pfX0sc2VxdWVuY2U6ZnVuY3Rpb24oZixqKXtpZihmLmxlbmd0aDw9MSlyZXR1cm4gai5pbWFnZXM7dmFyIG89W10sdD1qLm9yYml0YWwscj1mWzFdLGc9ZlsyXSxLPWZbNF07Sz1uLnJlLm5vX21hdGNoLnRlc3QoSytQKT8xOitLO3ZhciBoPXQ/MjpqLnJvd3N8fDE7aj10P2ouZm9vdGFnZTpqLnN0aXRjaGVkP1xyXG4xOmouZnJhbWVzO2g9KyhmWzVdfHxoKmopLUs7Zj0rZls3XXx8MTtmb3Ioaj0wO2o8PWg7KXtvLnB1c2goci5yZXBsYWNlKGcsYmMoSytqK1AsZy5sZW5ndGgsXCIwXCIpKSk7ais9Zn1yZXR1cm4gb30saW5zdGFuY2VzOmsoKSxsZWFkZXI6WSxyZXNpemVfZ2F1Z2U6MzAwLGNvbmN1cnJlbnRfcmVxdWVzdHM6NCxjb3N0OjB9LGhhPWsoWCk7WD1uYXZpZ2F0b3IudXNlckFnZW50O3ZhciBCYT1uLnJlLnVhWzBdLmV4ZWMoWCl8fG4ucmUudWFbMV0uZXhlYyhYKXx8bi5yZS51YVsyXS5leGVjKFgpO1o9K0JhWzJdLnNwbGl0KFwiLlwiKS5zbGljZSgwLDIpLmpvaW4oXCIuXCIpO0JhPUJhWzFdPT1cIk1TSUVcIjt2YXIgYWQ9IShCYSYmWjw4KSxGYz0hKEJhJiZaPDkpLHNiLHo9XCJyZWVsXCIsQmI9eitcIi1vdmVybGF5XCIsSGI9eitcIi1jYWNoZVwiLHpjPXorXCItaW5kaWNhdG9yXCIseWM9eitcIi1wcmVsb2FkZXJcIix0Yz16K1wiLW1vbml0b3JcIixkYz16K1wiLWFubm90YXRpb25cIixtYj16K1wiLXBhbm5pbmdcIixSYj1cclxueitcIi1sb2FkaW5nXCIsaGM9XCJmcmFtZS1cIixxYT1NYXRoLFM9cWEucm91bmQscmI9cWEuZmxvb3IsbGE9cWEuY2VpbCxHYT1xYS5taW4sdWI9cWEubWF4LEg9cWEuYWJzLFpjPXBhcnNlSW50LFdiPW4ubWF0aC5pbnRlcnBvbGF0ZSxQYT1cImFubm90YXRpb25zXCIsTGE9XCJhcmVhXCIsU2I9XCJhdXRvXCIsbmM9XCJiYWNrdXBcIixNPVwiYmFja3dhcmRzXCIsZGI9XCJiaXRcIixtYz1cImJyYWtlXCIsYWI9XCJjYWNoZVwiLGljPWFiK1wiZFwiLExiPVwiY2VudGVyXCIsZWM9XCJjbGFzc1wiLGpiPVwiY2xpY2tcIixlYT1qYitcImVkXCIsZWI9ZWErXCJfbG9jYXRpb25cIixmYj1lYStcIl9vblwiLEpiPWVhK1wiX3RpZXJcIix4YT1cImN3aXNoXCIsYmI9XCJkZXBhcnR1cmVcIixNYT1cImRlc3RpbmF0aW9uXCIsY2I9XCJkaXN0YW5jZVwiLHNhPVwiZm9vdGFnZVwiLEI9XCJmcmFjdGlvblwiLEo9XCJmcmFtZVwiLGtjPVwiZnJhbWVsb2NrXCIsTz1cImZyYW1lc1wiLEw9XCJoZWlnaHRcIixoYj1cImhpXCIsTmI9XCJoaWRkZW5cIixHYj1cImltYWdlXCIsYWE9XCJpbWFnZXNcIixnYj1cImxvXCIsXHJcbk5hPVwibG9hZGluZ1wiLGZhPVwib3BlbmluZ1wiLHlhPWZhK1wiX3RpY2tzXCIsSWE9XCJvcHRpb25zXCIsU2E9XCJwbGF5aW5nXCIsZGE9XCJwcmVsb2FkZWRcIixNYj1cInJhdGlvXCIsT2E9XCJyZWVsaW5nXCIsS2I9XCJyZWVsZWRcIixZYT1cInJlc3BvbnNpdmVcIixLYT1cInJldm9sdXRpb25cIixFYj1cInJldm9sdXRpb25feVwiLFE9XCJyb3dcIixqYz1cInJvd2xvY2tcIixJYj1cInJvd3NcIixKYT1cInNoeVwiLFphPVwic3BhY2luZ1wiLHZhPVwic3BlZWRcIixyYT1cInNyY1wiLGxjPVwic3RhZ2VcIixXPVwic3RpdGNoZWRcIiwkYT1XK1wiX3NoaWZ0XCIsRmI9VytcIl90cmF2ZWxcIixWYj1cInN0b3BwZWRcIiwkPVwic3R5bGVcIixnYT1cInRlbXBvXCIsaWI9XCJ0aWNrc1wiLHVhPVwidGllclwiLGZjPVwidHJ1ZXNjYWxlXCIsbWE9XCJ2ZWxvY2l0eVwiLHdhPVwidmVydGljYWxcIixEPVwid2lkdGhcIixGPXgoeiksamE9eChcInBhblwiKStGLFJjPVwiZGV2aWNlb3JpZW50YXRpb25cIitGLFFjPVwiZHJhZ3N0YXJ0XCIrRixPYz1cIm1vdXNlZG93blwiK0YsTmM9XCJtb3VzZWVudGVyXCIrRixYYz1cclxuXCJtb3VzZWxlYXZlXCIramEsVWM9XCJtb3VzZW1vdmVcIitqYSxZYz1cIm1vdXNldXBcIitqYSxQYz1cIm1vdXNld2hlZWxcIitGLG5iPVwidGlja1wiK0YsV2M9XCJ0b3VjaGNhbmNlbFwiK2phLFZjPVwidG91Y2hlbmRcIitqYSxNYz1cInRvdWNoc3RhcnRcIitGLFRjPVwidG91Y2htb3ZlXCIramEscGM9XCJyZXNpemVcIitGLFA9XCJcIixBPVwiIFwiLG5hPVwiLFwiLFFhPVwiYWJzb2x1dGVcIixPYj1cImJsb2NrXCIsRGE9XCJAQ0ROQFwiLHRhPVwiZGl2XCIscmM9XCJoYW5kXCIsVGI9XCJoZWFkXCIsemI9XCJodG1sXCIsa2E9XCJpZFwiLFhhPVwiaW1nXCIsWmI9XCJqcXVlcnkuXCIreixsYj1cIm5vbmVcIix0Yj1cIm9iamVjdFwiLHdiPVwic3RyaW5nXCIsSWM9W0QsTCxaYSxLYSxFYixXLCRhLEZiXSxBYz17VzpELEg6TH0sdWM9YWQ/RGMoXCJDQUFJQUlBQUFBQUFBQUFBQUNINUJBRUFBQUFBTEFBQUFBQUlBQWdBQUFJSGhJK3B5KzFkQUFBN1wiKTpEYStcImJsYW5rLmdpZlwiLEtjPUVhKERhK1piK1wiLmN1clwiKStuYStcIm1vdmVcIixKYz1FYShEYStaYitcIi1kcmFnLmN1clwiKStcclxubmErXCJtb3ZlXCIsTGM9RWEoRGErWmIrXCItZHJhZy1kb3duLmN1clwiKStuYStcIm1vdmVcIjtuLmxhenk9bi5yZS5sYXp5X2FnZW50LnRlc3QoWCk7dmFyIFNjPUJhJiZaPDk/MTowLGJkPWsuY2xlYW5EYXRhO2suY2xlYW5EYXRhPWZ1bmN0aW9uKGYpe2soZikuZWFjaChmdW5jdGlvbigpe2sodGhpcykudHJpZ2dlckhhbmRsZXIoXCJjbGVhblwiKX0pO3JldHVybiBiZC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9O2suZXh0ZW5kKGsuZm4sbi5mbikmJmsobi5zY2FuKTtyZXR1cm4gbn19KGpRdWVyeSx3aW5kb3csZG9jdW1lbnQpfSk7IiwiOyAoZnVuY3Rpb24gKCQpIHtcclxuXHQkLmZuLmxvYWRwYWdlID0gZnVuY3Rpb24gKGFjdGlvbiwgb3B0cykge1xyXG5cdFx0YWN0aW9uID0gYWN0aW9uID8gYWN0aW9uIDogXCJpbml0XCI7XHJcblx0XHR2YXIgcHJvZ3Jlc3NWYWx1ZSA9IDA7XHJcblx0XHR2YXIgbG9hZEh0bWwgPSBbXHJcblx0XHRcdCc8ZGl2IGNsYXNzPVwibWRMb2FkaW5nXCI+JyxcclxuXHRcdFx0JyAgICA8ZGl2IGNsYXNzPVwibG9hZGluZ0JveFwiPicsXHJcblx0XHRcdC8vICcgICAgICAgIDxpbWcgY2xhc3M9XCJsaW5lMlwiIHNyYz1cImltYWdlcy9sb2FkLXBpYy5wbmdcIj4nLFxyXG5cdFx0XHQnICAgICAgICA8aW1nIGNsYXNzPVwibGluZTJcIiBzcmM9XCIuLi9pbWFnZXMvZXZhNzg3LTEucG5nXCI+JyxcclxuXHRcdFx0JyAgICAgICAgPGRpdiBjbGFzcz1cInByb2dyZXNzQmFyXCI+JyxcclxuXHRcdFx0JyAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwcm9ncmVzcyBqcy1iYXJcIiBzdHlsZT1cIndpZHRoOjBcIj48L2Rpdj4nLFxyXG5cdFx0XHQnICAgICAgICA8L2Rpdj4nLFxyXG5cdFx0XHQnICAgIDwvZGl2PicsXHJcblx0XHRcdCc8L2Rpdj4nXHJcblx0XHRdLmpvaW4oJycpO1xyXG5cdFx0dmFyIGRMb2FkLGRDb3VudCxkQmFyO1xyXG5cdFx0dmFyIGNvbmZpZyA9ICQuZXh0ZW5kKHtcclxuXHRcdFx0YXN5bmM6ZmFsc2VcclxuXHRcdH0sIG9wdHMpO1xyXG5cdFx0XHJcblx0XHRmdW5jdGlvbiBpbml0KG9iaikge1xyXG5cdFx0XHQkKGxvYWRIdG1sKS5hcHBlbmRUbygnYm9keScpO1xyXG5cdFx0XHRkTG9hZCA9IG9iai5maW5kKCcubWRMb2FkaW5nJyk7XHJcblx0XHRcdGRDb3VudCA9IGRMb2FkLmZpbmQoJy5qcy1jb3VudCcpO1xyXG5cdFx0XHRkQmFyID0gZExvYWQuZmluZCgnLmpzLWJhcicpO1xyXG5cdFx0XHRpZih3aW5kb3cud2lkdGggPiA3NjgpIHtcclxuXHRcdFx0XHRUd2Vlbk1heC50byhcIi5saW5lMlwiLCAwLjksIHtsZWZ0OiAyMDAwfSk7XHJcblx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0VHdlZW5NYXgudG8oXCIubGluZTJcIiwgMC45LCB7bGVmdDogNTAwfSk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3Qpe1xyXG5cdFx0XHRcdGlmICghY29uZmlnLmFzeW5jKSB7XHJcblx0XHRcdFx0XHR2YXIgcXVldWUgPSBuZXcgY3JlYXRlanMuTG9hZFF1ZXVlKCk7XHJcblx0XHRcdFx0XHRxdWV1ZS5zZXRNYXhDb25uZWN0aW9ucygyMDApO1xyXG5cdFx0XHRcdFx0dmFyIGxvYWRBcnJheSA9IFtdO1xyXG5cdFx0XHRcdFx0b2JqLmZpbmQoXCJpbWdcIikuZWFjaChmdW5jdGlvbiAoaSkge1xyXG5cdFx0XHRcdFx0XHRsb2FkQXJyYXkucHVzaCh7XHJcblx0XHRcdFx0XHRcdFx0aWQ6IGksXHJcblx0XHRcdFx0XHRcdFx0c3JjOiAkKHRoaXMpLmF0dHIoXCJzcmNcIilcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KVxyXG5cdFx0XHRcdFx0cXVldWUubG9hZE1hbmlmZXN0KGxvYWRBcnJheSk7XHJcblxyXG5cdFx0XHRcdFx0dmFyIGhhbmRsZUNvbXBsZXRlID0gZnVuY3Rpb24gKCkge1xyXG5cclxuXHRcdFx0XHRcdFx0JCh3aW5kb3cpLnRyaWdnZXIoXCJsb2FkQ29tcGxldGVkXCIpO1xyXG5cdFx0XHRcdFx0XHQkKCcuanMtd3JhcCcpLmNzcyh7ICd2aXNpYmlsaXR5JzogJ3Zpc2libGUnIH0pO1xyXG5cdFx0XHRcdFx0XHRUd2Vlbk1heC5mcm9tVG8oZExvYWQsIDAuNSwgeyBvcGFjaXR5OiAxIH0sIHtcclxuXHRcdFx0XHRcdFx0XHRkZWxheTogLjgsXHJcblx0XHRcdFx0XHRcdFx0b3BhY2l0eTogMCwgZWFzZTogUG93ZXI0LmVhc2VPdXQsIG9uQ29tcGxldGU6IGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0XHRcdGRMb2FkLnJlbW92ZSgpO1xyXG5cdFx0XHRcdFx0XHRcdFx0cmVzb2x2ZSh0cnVlKTtcclxuXHRcdFx0XHRcdFx0XHR9XHJcblx0XHRcdFx0XHRcdH0pO1xyXG5cdCAgIFxyXG5cdFx0XHRcdFx0fTtcclxuXHJcblx0XHRcdFx0XHRxdWV1ZS5vbihcInByb2dyZXNzXCIsIGZ1bmN0aW9uICgpIHtcclxuXHRcdFx0XHRcdFx0dmFyIHByb2NWYWx1ZSA9IE1hdGgubWluKE1hdGguY2VpbChxdWV1ZS5wcm9ncmVzcyAqIDEwMCksIDEwMCk7XHJcblx0XHRcdFx0XHRcdGRDb3VudC50ZXh0KHByb2NWYWx1ZSArICclJyk7XHJcblx0XHRcdFx0XHRcdGRCYXIuY3NzKHtcclxuXHRcdFx0XHRcdFx0XHQnd2lkdGgnOiBwcm9jVmFsdWUgKyAnJSdcclxuXHRcdFx0XHRcdFx0fSk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHJcblx0XHRcdFx0XHRxdWV1ZS5vbihcImNvbXBsZXRlXCIsIGhhbmRsZUNvbXBsZXRlLCB0aGlzKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdFx0ZWxzZSB7XHJcblx0XHRcdFx0XHRyZXNvbHZlKHRydWUpO1xyXG5cdFx0XHRcdH1cclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRpZihhY3Rpb24gPT0gJ2luaXQnKXtcclxuXHRcdFx0cmV0dXJuIGluaXQoJCh0aGlzKSk7XHRcclxuXHRcdH1cclxuXHRcdGlmIChhY3Rpb24gPT0gJ2Nsb3NlJykge1xyXG5cdFx0XHRkTG9hZCA9ICQodGhpcykuZmluZCgnLm1kTG9hZGluZycpO1xyXG5cdFx0XHRkQ291bnQgPSBkTG9hZC5maW5kKCcuanMtY291bnQnKTtcclxuXHRcdFx0ZEJhciA9IGRMb2FkLmZpbmQoJy5qcy1iYXInKTtcclxuXHRcdFx0ZENvdW50LnRleHQoJzEwMCUnKTtcclxuXHRcdFx0ZEJhci5jc3Moe1xyXG5cdFx0XHRcdCd3aWR0aCc6JzEwMCUnXHJcblx0XHRcdH0pO1xyXG5cdFx0XHRUd2Vlbk1heC50byhcIi5saW5lMlwiLCAwLjksIHtsZWZ0OjIwMDB9KTtcclxuXHRcdFx0VHdlZW5NYXguZnJvbVRvKGRMb2FkLCAwLjUsIHsgb3BhY2l0eTogMSB9LCB7XHJcblx0XHRcdFx0ZGVsYXk6IC44LFxyXG5cdFx0XHRcdG9wYWNpdHk6IDAsIGVhc2U6IFBvd2VyNC5lYXNlT3V0LCBvbkNvbXBsZXRlOiBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0XHRkTG9hZC5yZW1vdmUoKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdH1cclxufSkoalF1ZXJ5KTsiLCJcInVzZSBzdHJpY3RcIjshZnVuY3Rpb24obCxtKXtsKGZ1bmN0aW9uKCl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gbih2LHcpe3JldHVybiBudWxsIT12JiZudWxsIT13JiZ2LnRvTG93ZXJDYXNlKCk9PT13LnRvTG93ZXJDYXNlKCl9ZnVuY3Rpb24gbyh2LHcpe3ZhciB4LHksej12Lmxlbmd0aDtpZighenx8IXcpcmV0dXJuITE7Zm9yKHg9dy50b0xvd2VyQ2FzZSgpLHk9MDt5PHo7Kyt5KWlmKHg9PT12W3ldLnRvTG93ZXJDYXNlKCkpcmV0dXJuITA7cmV0dXJuITF9ZnVuY3Rpb24gcCh2KXtmb3IodmFyIHcgaW4gdil1LmNhbGwodix3KSYmKHZbd109bmV3IFJlZ0V4cCh2W3ddLFwiaVwiKSl9ZnVuY3Rpb24gcSh2KXtyZXR1cm4odnx8XCJcIikuc3Vic3RyKDAsNTAwKX1mdW5jdGlvbiByKHYsdyl7dGhpcy51YT1xKHYpLHRoaXMuX2NhY2hlPXt9LHRoaXMubWF4UGhvbmVXaWR0aD13fHw2MDB9dmFyIHM9e21vYmlsZURldGVjdFJ1bGVzOntwaG9uZXM6e2lQaG9uZTpcIlxcXFxiaVBob25lXFxcXGJ8XFxcXGJpUG9kXFxcXGJcIixCbGFja0JlcnJ5OlwiQmxhY2tCZXJyeXxcXFxcYkJCMTBcXFxcYnxyaW1bMC05XStcIixIVEM6XCJIVEN8SFRDLiooU2Vuc2F0aW9ufEV2b3xWaXNpb258RXhwbG9yZXJ8NjgwMHw4MTAwfDg5MDB8QTcyNzJ8UzUxMGV8QzExMGV8TGVnZW5kfERlc2lyZXxUODI4Mil8QVBYNTE1Q0tUfFF0ZWs5MDkwfEFQQTkyOTJLVHxIRF9taW5pfFNlbnNhdGlvbi4qWjcxMGV8UEc4NjEwMHxaNzE1ZXxEZXNpcmUuKihBODE4MXxIRCl8QURSNjIwMHxBRFI2NDAwTHxBRFI2NDI1fDAwMUhUfEluc3BpcmUgNEd8QW5kcm9pZC4qXFxcXGJFVk9cXFxcYnxULU1vYmlsZSBHMXxaNTIwbXxBbmRyb2lkIFswLTkuXSs7IFBpeGVsXCIsTmV4dXM6XCJOZXh1cyBPbmV8TmV4dXMgU3xHYWxheHkuKk5leHVzfEFuZHJvaWQuKk5leHVzLipNb2JpbGV8TmV4dXMgNHxOZXh1cyA1fE5leHVzIDZcIixEZWxsOlwiRGVsbFs7XT8gKFN0cmVha3xBZXJvfFZlbnVlfFZlbnVlIFByb3xGbGFzaHxTbW9rZXxNaW5pIDNpWCl8WENEMjh8WENEMzV8XFxcXGIwMDFETFxcXFxifFxcXFxiMTAxRExcXFxcYnxcXFxcYkdTMDFcXFxcYlwiLE1vdG9yb2xhOlwiTW90b3JvbGF8RFJPSURYfERST0lEIEJJT05JQ3xcXFxcYkRyb2lkXFxcXGIuKkJ1aWxkfEFuZHJvaWQuKlhvb218SFJJMzl8TU9ULXxBMTI2MHxBMTY4MHxBNTU1fEE4NTN8QTg1NXxBOTUzfEE5NTV8QTk1NnxNb3Rvcm9sYS4qRUxFQ1RSSUZZfE1vdG9yb2xhLippMXxpODY3fGk5NDB8TUIyMDB8TUIzMDB8TUI1MDF8TUI1MDJ8TUI1MDh8TUI1MTF8TUI1MjB8TUI1MjV8TUI1MjZ8TUI2MTF8TUI2MTJ8TUI2MzJ8TUI4MTB8TUI4NTV8TUI4NjB8TUI4NjF8TUI4NjV8TUI4NzB8TUU1MDF8TUU1MDJ8TUU1MTF8TUU1MjV8TUU2MDB8TUU2MzJ8TUU3MjJ8TUU4MTF8TUU4NjB8TUU4NjN8TUU4NjV8TVQ2MjB8TVQ3MTB8TVQ3MTZ8TVQ3MjB8TVQ4MTB8TVQ4NzB8TVQ5MTd8TW90b3JvbGEuKlRJVEFOSVVNfFdYNDM1fFdYNDQ1fFhUMzAwfFhUMzAxfFhUMzExfFhUMzE2fFhUMzE3fFhUMzE5fFhUMzIwfFhUMzkwfFhUNTAyfFhUNTMwfFhUNTMxfFhUNTMyfFhUNTM1fFhUNjAzfFhUNjEwfFhUNjExfFhUNjE1fFhUNjgxfFhUNzAxfFhUNzAyfFhUNzExfFhUNzIwfFhUODAwfFhUODA2fFhUODYwfFhUODYyfFhUODc1fFhUODgyfFhUODgzfFhUODk0fFhUOTAxfFhUOTA3fFhUOTA5fFhUOTEwfFhUOTEyfFhUOTI4fFhUOTI2fFhUOTE1fFhUOTE5fFhUOTI1fFhUMTAyMXxcXFxcYk1vdG8gRVxcXFxifFhUMTA2OHxYVDEwOTJ8WFQxMDUyXCIsU2Ftc3VuZzpcIlxcXFxiU2Ftc3VuZ1xcXFxifFNNLUc5NTBGfFNNLUc5NTVGfFNNLUc5MjUwfEdULTE5MzAwfFNHSC1JMzM3fEJHVC1TNTIzMHxHVC1CMjEwMHxHVC1CMjcwMHxHVC1CMjcxMHxHVC1CMzIxMHxHVC1CMzMxMHxHVC1CMzQxMHxHVC1CMzczMHxHVC1CMzc0MHxHVC1CNTUxMHxHVC1CNTUxMnxHVC1CNTcyMnxHVC1CNjUyMHxHVC1CNzMwMHxHVC1CNzMyMHxHVC1CNzMzMHxHVC1CNzM1MHxHVC1CNzUxMHxHVC1CNzcyMnxHVC1CNzgwMHxHVC1DMzAxMHxHVC1DMzAxMXxHVC1DMzA2MHxHVC1DMzIwMHxHVC1DMzIxMnxHVC1DMzIxMkl8R1QtQzMyNjJ8R1QtQzMyMjJ8R1QtQzMzMDB8R1QtQzMzMDBLfEdULUMzMzAzfEdULUMzMzAzS3xHVC1DMzMxMHxHVC1DMzMyMnxHVC1DMzMzMHxHVC1DMzM1MHxHVC1DMzUwMHxHVC1DMzUxMHxHVC1DMzUzMHxHVC1DMzYzMHxHVC1DMzc4MHxHVC1DNTAxMHxHVC1DNTIxMnxHVC1DNjYyMHxHVC1DNjYyNXxHVC1DNjcxMnxHVC1FMTA1MHxHVC1FMTA3MHxHVC1FMTA3NXxHVC1FMTA4MHxHVC1FMTA4MXxHVC1FMTA4NXxHVC1FMTA4N3xHVC1FMTEwMHxHVC1FMTEwN3xHVC1FMTExMHxHVC1FMTEyMHxHVC1FMTEyNXxHVC1FMTEzMHxHVC1FMTE2MHxHVC1FMTE3MHxHVC1FMTE3NXxHVC1FMTE4MHxHVC1FMTE4MnxHVC1FMTIwMHxHVC1FMTIxMHxHVC1FMTIyNXxHVC1FMTIzMHxHVC1FMTM5MHxHVC1FMjEwMHxHVC1FMjEyMHxHVC1FMjEyMXxHVC1FMjE1MnxHVC1FMjIyMHxHVC1FMjIyMnxHVC1FMjIzMHxHVC1FMjIzMnxHVC1FMjI1MHxHVC1FMjM3MHxHVC1FMjU1MHxHVC1FMjY1MnxHVC1FMzIxMHxHVC1FMzIxM3xHVC1JNTUwMHxHVC1JNTUwM3xHVC1JNTcwMHxHVC1JNTgwMHxHVC1JNTgwMXxHVC1JNjQxMHxHVC1JNjQyMHxHVC1JNzExMHxHVC1JNzQxMHxHVC1JNzUwMHxHVC1JODAwMHxHVC1JODE1MHxHVC1JODE2MHxHVC1JODE5MHxHVC1JODMyMHxHVC1JODMzMHxHVC1JODM1MHxHVC1JODUzMHxHVC1JODcwMHxHVC1JODcwM3xHVC1JODkxMHxHVC1JOTAwMHxHVC1JOTAwMXxHVC1JOTAwM3xHVC1JOTAxMHxHVC1JOTAyMHxHVC1JOTAyM3xHVC1JOTA3MHxHVC1JOTA4MnxHVC1JOTEwMHxHVC1JOTEwM3xHVC1JOTIyMHxHVC1JOTI1MHxHVC1JOTMwMHxHVC1JOTMwNXxHVC1JOTUwMHxHVC1JOTUwNXxHVC1NMzUxMHxHVC1NNTY1MHxHVC1NNzUwMHxHVC1NNzYwMHxHVC1NNzYwM3xHVC1NODgwMHxHVC1NODkxMHxHVC1ONzAwMHxHVC1TMzExMHxHVC1TMzMxMHxHVC1TMzM1MHxHVC1TMzM1M3xHVC1TMzM3MHxHVC1TMzY1MHxHVC1TMzY1M3xHVC1TMzc3MHxHVC1TMzg1MHxHVC1TNTIxMHxHVC1TNTIyMHxHVC1TNTIyOXxHVC1TNTIzMHxHVC1TNTIzM3xHVC1TNTI1MHxHVC1TNTI1M3xHVC1TNTI2MHxHVC1TNTI2M3xHVC1TNTI3MHxHVC1TNTMwMHxHVC1TNTMzMHxHVC1TNTM1MHxHVC1TNTM2MHxHVC1TNTM2M3xHVC1TNTM2OXxHVC1TNTM4MHxHVC1TNTM4MER8R1QtUzU1NjB8R1QtUzU1NzB8R1QtUzU2MDB8R1QtUzU2MDN8R1QtUzU2MTB8R1QtUzU2MjB8R1QtUzU2NjB8R1QtUzU2NzB8R1QtUzU2OTB8R1QtUzU3NTB8R1QtUzU3ODB8R1QtUzU4MzB8R1QtUzU4Mzl8R1QtUzYxMDJ8R1QtUzY1MDB8R1QtUzcwNzB8R1QtUzcyMDB8R1QtUzcyMjB8R1QtUzcyMzB8R1QtUzcyMzN8R1QtUzcyNTB8R1QtUzc1MDB8R1QtUzc1MzB8R1QtUzc1NTB8R1QtUzc1NjJ8R1QtUzc3MTB8R1QtUzgwMDB8R1QtUzgwMDN8R1QtUzg1MDB8R1QtUzg1MzB8R1QtUzg2MDB8U0NILUEzMTB8U0NILUE1MzB8U0NILUE1NzB8U0NILUE2MTB8U0NILUE2MzB8U0NILUE2NTB8U0NILUE3OTB8U0NILUE3OTV8U0NILUE4NTB8U0NILUE4NzB8U0NILUE4OTB8U0NILUE5MzB8U0NILUE5NTB8U0NILUE5NzB8U0NILUE5OTB8U0NILUkxMDB8U0NILUkxMTB8U0NILUk0MDB8U0NILUk0MDV8U0NILUk1MDB8U0NILUk1MTB8U0NILUk1MTV8U0NILUk2MDB8U0NILUk3MzB8U0NILUk3NjB8U0NILUk3NzB8U0NILUk4MzB8U0NILUk5MTB8U0NILUk5MjB8U0NILUk5NTl8U0NILUxDMTF8U0NILU4xNTB8U0NILU4zMDB8U0NILVIxMDB8U0NILVIzMDB8U0NILVIzNTF8U0NILVI0MDB8U0NILVI0MTB8U0NILVQzMDB8U0NILVUzMTB8U0NILVUzMjB8U0NILVUzNTB8U0NILVUzNjB8U0NILVUzNjV8U0NILVUzNzB8U0NILVUzODB8U0NILVU0MTB8U0NILVU0MzB8U0NILVU0NTB8U0NILVU0NjB8U0NILVU0NzB8U0NILVU0OTB8U0NILVU1NDB8U0NILVU1NTB8U0NILVU2MjB8U0NILVU2NDB8U0NILVU2NTB8U0NILVU2NjB8U0NILVU3MDB8U0NILVU3NDB8U0NILVU3NTB8U0NILVU4MTB8U0NILVU4MjB8U0NILVU5MDB8U0NILVU5NDB8U0NILVU5NjB8U0NTLTI2VUN8U0dILUExMDd8U0dILUExMTd8U0dILUExMjd8U0dILUExMzd8U0dILUExNTd8U0dILUExNjd8U0dILUExNzd8U0dILUExODd8U0dILUExOTd8U0dILUEyMjd8U0dILUEyMzd8U0dILUEyNTd8U0dILUE0Mzd8U0dILUE1MTd8U0dILUE1OTd8U0dILUE2Mzd8U0dILUE2NTd8U0dILUE2Njd8U0dILUE2ODd8U0dILUE2OTd8U0dILUE3MDd8U0dILUE3MTd8U0dILUE3Mjd8U0dILUE3Mzd8U0dILUE3NDd8U0dILUE3Njd8U0dILUE3Nzd8U0dILUE3OTd8U0dILUE4MTd8U0dILUE4Mjd8U0dILUE4Mzd8U0dILUE4NDd8U0dILUE4Njd8U0dILUE4Nzd8U0dILUE4ODd8U0dILUE4OTd8U0dILUE5Mjd8U0dILUIxMDB8U0dILUIxMzB8U0dILUIyMDB8U0dILUIyMjB8U0dILUMxMDB8U0dILUMxMTB8U0dILUMxMjB8U0dILUMxMzB8U0dILUMxNDB8U0dILUMxNjB8U0dILUMxNzB8U0dILUMxODB8U0dILUMyMDB8U0dILUMyMDd8U0dILUMyMTB8U0dILUMyMjV8U0dILUMyMzB8U0dILUM0MTd8U0dILUM0NTB8U0dILUQzMDd8U0dILUQzNDd8U0dILUQzNTd8U0dILUQ0MDd8U0dILUQ0MTV8U0dILUQ3ODB8U0dILUQ4MDd8U0dILUQ5ODB8U0dILUUxMDV8U0dILUUyMDB8U0dILUUzMTV8U0dILUUzMTZ8U0dILUUzMTd8U0dILUUzMzV8U0dILUU1OTB8U0dILUU2MzV8U0dILUU3MTV8U0dILUU4OTB8U0dILUYzMDB8U0dILUY0ODB8U0dILUkyMDB8U0dILUkzMDB8U0dILUkzMjB8U0dILUk1NTB8U0dILUk1Nzd8U0dILUk2MDB8U0dILUk2MDd8U0dILUk2MTd8U0dILUk2Mjd8U0dILUk2Mzd8U0dILUk2Nzd8U0dILUk3MDB8U0dILUk3MTd8U0dILUk3Mjd8U0dILWk3NDdNfFNHSC1JNzc3fFNHSC1JNzgwfFNHSC1JODI3fFNHSC1JODQ3fFNHSC1JODU3fFNHSC1JODk2fFNHSC1JODk3fFNHSC1JOTAwfFNHSC1JOTA3fFNHSC1JOTE3fFNHSC1JOTI3fFNHSC1JOTM3fFNHSC1JOTk3fFNHSC1KMTUwfFNHSC1KMjAwfFNHSC1MMTcwfFNHSC1MNzAwfFNHSC1NMTEwfFNHSC1NMTUwfFNHSC1NMjAwfFNHSC1OMTA1fFNHSC1ONTAwfFNHSC1ONjAwfFNHSC1ONjIwfFNHSC1ONjI1fFNHSC1ONzAwfFNHSC1ONzEwfFNHSC1QMTA3fFNHSC1QMjA3fFNHSC1QMzAwfFNHSC1QMzEwfFNHSC1QNTIwfFNHSC1QNzM1fFNHSC1QNzc3fFNHSC1RMTA1fFNHSC1SMjEwfFNHSC1SMjIwfFNHSC1SMjI1fFNHSC1TMTA1fFNHSC1TMzA3fFNHSC1UMTA5fFNHSC1UMTE5fFNHSC1UMTM5fFNHSC1UMjA5fFNHSC1UMjE5fFNHSC1UMjI5fFNHSC1UMjM5fFNHSC1UMjQ5fFNHSC1UMjU5fFNHSC1UMzA5fFNHSC1UMzE5fFNHSC1UMzI5fFNHSC1UMzM5fFNHSC1UMzQ5fFNHSC1UMzU5fFNHSC1UMzY5fFNHSC1UMzc5fFNHSC1UNDA5fFNHSC1UNDI5fFNHSC1UNDM5fFNHSC1UNDU5fFNHSC1UNDY5fFNHSC1UNDc5fFNHSC1UNDk5fFNHSC1UNTA5fFNHSC1UNTE5fFNHSC1UNTM5fFNHSC1UNTU5fFNHSC1UNTg5fFNHSC1UNjA5fFNHSC1UNjE5fFNHSC1UNjI5fFNHSC1UNjM5fFNHSC1UNjU5fFNHSC1UNjY5fFNHSC1UNjc5fFNHSC1UNzA5fFNHSC1UNzE5fFNHSC1UNzI5fFNHSC1UNzM5fFNHSC1UNzQ2fFNHSC1UNzQ5fFNHSC1UNzU5fFNHSC1UNzY5fFNHSC1UODA5fFNHSC1UODE5fFNHSC1UODM5fFNHSC1UOTE5fFNHSC1UOTI5fFNHSC1UOTM5fFNHSC1UOTU5fFNHSC1UOTg5fFNHSC1VMTAwfFNHSC1VMjAwfFNHSC1VODAwfFNHSC1WMjA1fFNHSC1WMjA2fFNHSC1YMTAwfFNHSC1YMTA1fFNHSC1YMTIwfFNHSC1YMTQwfFNHSC1YNDI2fFNHSC1YNDI3fFNHSC1YNDc1fFNHSC1YNDk1fFNHSC1YNDk3fFNHSC1YNTA3fFNHSC1YNjAwfFNHSC1YNjEwfFNHSC1YNjIwfFNHSC1YNjMwfFNHSC1YNzAwfFNHSC1YODIwfFNHSC1YODkwfFNHSC1aMTMwfFNHSC1aMTUwfFNHSC1aMTcwfFNHSC1aWDEwfFNHSC1aWDIwfFNIVy1NMTEwfFNQSC1BMTIwfFNQSC1BNDAwfFNQSC1BNDIwfFNQSC1BNDYwfFNQSC1BNTAwfFNQSC1BNTYwfFNQSC1BNjAwfFNQSC1BNjIwfFNQSC1BNjYwfFNQSC1BNzAwfFNQSC1BNzQwfFNQSC1BNzYwfFNQSC1BNzkwfFNQSC1BODAwfFNQSC1BODIwfFNQSC1BODQwfFNQSC1BODgwfFNQSC1BOTAwfFNQSC1BOTQwfFNQSC1BOTYwfFNQSC1ENjAwfFNQSC1ENzAwfFNQSC1ENzEwfFNQSC1ENzIwfFNQSC1JMzAwfFNQSC1JMzI1fFNQSC1JMzMwfFNQSC1JMzUwfFNQSC1JNTAwfFNQSC1JNjAwfFNQSC1JNzAwfFNQSC1MNzAwfFNQSC1NMTAwfFNQSC1NMjIwfFNQSC1NMjQwfFNQSC1NMzAwfFNQSC1NMzA1fFNQSC1NMzIwfFNQSC1NMzMwfFNQSC1NMzUwfFNQSC1NMzYwfFNQSC1NMzcwfFNQSC1NMzgwfFNQSC1NNTEwfFNQSC1NNTQwfFNQSC1NNTUwfFNQSC1NNTYwfFNQSC1NNTcwfFNQSC1NNTgwfFNQSC1NNjEwfFNQSC1NNjIwfFNQSC1NNjMwfFNQSC1NODAwfFNQSC1NODEwfFNQSC1NODUwfFNQSC1NOTAwfFNQSC1NOTEwfFNQSC1NOTIwfFNQSC1NOTMwfFNQSC1OMTAwfFNQSC1OMjAwfFNQSC1OMjQwfFNQSC1OMzAwfFNQSC1ONDAwfFNQSC1aNDAwfFNXQy1FMTAwfFNDSC1pOTA5fEdULU43MTAwfEdULU43MTA1fFNDSC1JNTM1fFNNLU45MDBBfFNHSC1JMzE3fFNHSC1UOTk5THxHVC1TNTM2MEJ8R1QtSTgyNjJ8R1QtUzY4MDJ8R1QtUzYzMTJ8R1QtUzYzMTB8R1QtUzUzMTJ8R1QtUzUzMTB8R1QtSTkxMDV8R1QtSTg1MTB8R1QtUzY3OTBOfFNNLUc3MTA1fFNNLU45MDA1fEdULVM1MzAxfEdULUk5Mjk1fEdULUk5MTk1fFNNLUMxMDF8R1QtUzczOTJ8R1QtUzc1NjB8R1QtQjc2MTB8R1QtSTU1MTB8R1QtUzc1ODJ8R1QtUzc1MzBFfEdULUk4NzUwfFNNLUc5MDA2VnxTTS1HOTAwOFZ8U00tRzkwMDlEfFNNLUc5MDBBfFNNLUc5MDBEfFNNLUc5MDBGfFNNLUc5MDBIfFNNLUc5MDBJfFNNLUc5MDBKfFNNLUc5MDBLfFNNLUc5MDBMfFNNLUc5MDBNfFNNLUc5MDBQfFNNLUc5MDBSNHxTTS1HOTAwU3xTTS1HOTAwVHxTTS1HOTAwVnxTTS1HOTAwVzh8U0hWLUUxNjBLfFNDSC1QNzA5fFNDSC1QNzI5fFNNLVQyNTU4fEdULUk5MjA1fFNNLUc5MzUwfFNNLUoxMjBGfFNNLUc5MjBGfFNNLUc5MjBWfFNNLUc5MzBGfFNNLU45MTBDfFNNLUEzMTBGfEdULUk5MTkwfFNNLUo1MDBGTnxTTS1HOTAzRnxTTS1KMzMwRlwiLExHOlwiXFxcXGJMR1xcXFxiO3xMR1stIF0/KEM4MDB8QzkwMHxFNDAwfEU2MTB8RTkwMHxFLTkwMHxGMTYwfEYxODBLfEYxODBMfEYxODBTfDczMHw4NTV8TDE2MHxMUzc0MHxMUzg0MHxMUzk3MHxMVTYyMDB8TVM2OTB8TVM2OTV8TVM3NzB8TVM4NDB8TVM4NzB8TVM5MTB8UDUwMHxQNzAwfFA3MDV8Vk02OTZ8QVM2ODB8QVM2OTV8QVg4NDB8QzcyOXxFOTcwfEdTNTA1fDI3MnxDMzk1fEU3MzlCS3xFOTYwfEw1NUN8TDc1Q3xMUzY5NnxMUzg2MHxQNzY5Qkt8UDM1MHxQNTAwfFA1MDl8UDg3MHxVTjI3MnxVUzczMHxWUzg0MHxWUzk1MHxMTjI3MnxMTjUxMHxMUzY3MHxMUzg1NXxMVzY5MHxNTjI3MHxNTjUxMHxQNTA5fFA3Njl8UDkzMHxVTjIwMHxVTjI3MHxVTjUxMHxVTjYxMHxVUzY3MHxVUzc0MHxVUzc2MHxVWDI2NXxVWDg0MHxWTjI3MXxWTjUzMHxWUzY2MHxWUzcwMHxWUzc0MHxWUzc1MHxWUzkxMHxWUzkyMHxWUzkzMHxWWDkyMDB8VlgxMTAwMHxBWDg0MEF8TFc3NzB8UDUwNnxQOTI1fFA5OTl8RTYxMnxEOTU1fEQ4MDJ8TVMzMjN8TTI1NylcIixTb255OlwiU29ueVNUfFNvbnlMVHxTb255RXJpY3Nzb258U29ueUVyaWNzc29uTFQxNWl2fExUMThpfEUxMGl8TFQyOGh8TFQyNnd8U29ueUVyaWNzc29uTVQyN2l8QzUzMDN8QzY5MDJ8QzY5MDN8QzY5MDZ8QzY5NDN8RDI1MzNcIixBc3VzOlwiQXN1cy4qR2FsYXh5fFBhZEZvbmUuKk1vYmlsZVwiLE5va2lhTHVtaWE6XCJMdW1pYSBbMC05XXszLDR9XCIsTWljcm9tYXg6XCJNaWNyb21heC4qXFxcXGIoQTIxMHxBOTJ8QTg4fEE3MnxBMTExfEExMTBRfEExMTV8QTExNnxBMTEwfEE5MFN8QTI2fEE1MXxBMzV8QTU0fEEyNXxBMjd8QTg5fEE2OHxBNjV8QTU3fEE5MClcXFxcYlwiLFBhbG06XCJQYWxtU291cmNlfFBhbG1cIixWZXJ0dTpcIlZlcnR1fFZlcnR1LipMdGR8VmVydHUuKkFzY2VudHxWZXJ0dS4qQXl4dGF8VmVydHUuKkNvbnN0ZWxsYXRpb24oRnxRdWVzdCk/fFZlcnR1LipNb25pa2F8VmVydHUuKlNpZ25hdHVyZVwiLFBhbnRlY2g6XCJQQU5URUNIfElNLUE4NTBTfElNLUE4NDBTfElNLUE4MzBMfElNLUE4MzBLfElNLUE4MzBTfElNLUE4MjBMfElNLUE4MTBLfElNLUE4MTBTfElNLUE4MDBTfElNLVQxMDBLfElNLUE3MjVMfElNLUE3ODBMfElNLUE3NzVDfElNLUE3NzBLfElNLUE3NjBTfElNLUE3NTBLfElNLUE3NDBTfElNLUE3MzBTfElNLUE3MjBMfElNLUE3MTBLfElNLUE2OTBMfElNLUE2OTBTfElNLUE2NTBTfElNLUE2MzBLfElNLUE2MDBTfFZFR0EgUFRMMjF8UFQwMDN8UDgwMTB8QURSOTEwTHxQNjAzMHxQNjAyMHxQOTA3MHxQNDEwMHxQOTA2MHxQNTAwMHxDRE04OTkyfFRYVDgwNDV8QURSODk5NXxJUzExUFR8UDIwMzB8UDYwMTB8UDgwMDB8UFQwMDJ8SVMwNnxDRE04OTk5fFA5MDUwfFBUMDAxfFRYVDgwNDB8UDIwMjB8UDkwMjB8UDIwMDB8UDcwNDB8UDcwMDB8Qzc5MFwiLEZseTpcIklRMjMwfElRNDQ0fElRNDUwfElRNDQwfElRNDQyfElRNDQxfElRMjQ1fElRMjU2fElRMjM2fElRMjU1fElRMjM1fElRMjQ1fElRMjc1fElRMjQwfElRMjg1fElRMjgwfElRMjcwfElRMjYwfElRMjUwXCIsV2lrbzpcIktJVEUgNEd8SElHSFdBWXxHRVRBV0FZfFNUQUlSV0FZfERBUktTSURFfERBUktGVUxMfERBUktOSUdIVHxEQVJLTU9PTnxTTElERXxXQVggNEd8UkFJTkJPV3xCTE9PTXxTVU5TRVR8R09BKD8hbm5hKXxMRU5OWXxCQVJSWXxJR0dZfE9aWll8Q0lOSyBGSVZFfENJTksgUEVBWHxDSU5LIFBFQVggMnxDSU5LIFNMSU18Q0lOSyBTTElNIDJ8Q0lOSyArfENJTksgS0lOR3xDSU5LIFBFQVh8Q0lOSyBTTElNfFNVQkxJTVwiLGlNb2JpbGU6XCJpLW1vYmlsZSAoSVF8aS1TVFlMRXxpZGVhfFpBQXxIaXR6KVwiLFNpbVZhbGxleTpcIlxcXFxiKFNQLTgwfFhULTkzMHxTWC0zNDB8WFQtOTMwfFNYLTMxMHxTUC0zNjB8U1A2MHxTUFQtODAwfFNQLTEyMHxTUFQtODAwfFNQLTE0MHxTUFgtNXxTUFgtOHxTUC0xMDB8U1BYLTh8U1BYLTEyKVxcXFxiXCIsV29sZmdhbmc6XCJBVC1CMjREfEFULUFTNTBIRHxBVC1BUzQwV3xBVC1BUzU1SER8QVQtQVM0NXEyfEFULUIyNkR8QVQtQVM1MFFcIixBbGNhdGVsOlwiQWxjYXRlbFwiLE5pbnRlbmRvOlwiTmludGVuZG8gKDNEU3xTd2l0Y2gpXCIsQW1vaTpcIkFtb2lcIixJTlE6XCJJTlFcIixHZW5lcmljUGhvbmU6XCJUYXBhdGFsa3xQREE7fFNBR0VNfFxcXFxibW1wXFxcXGJ8cG9ja2V0fFxcXFxicHNwXFxcXGJ8c3ltYmlhbnxTbWFydHBob25lfHNtYXJ0Zm9ufHRyZW98dXAuYnJvd3Nlcnx1cC5saW5rfHZvZGFmb25lfFxcXFxid2FwXFxcXGJ8bm9raWF8U2VyaWVzNDB8U2VyaWVzNjB8UzYwfFNvbnlFcmljc3NvbnxOOTAwfE1BVUkuKldBUC4qQnJvd3NlclwifSx0YWJsZXRzOntpUGFkOlwiaVBhZHxpUGFkLipNb2JpbGVcIixOZXh1c1RhYmxldDpcIkFuZHJvaWQuKk5leHVzW1xcXFxzXSsoN3w5fDEwKVwiLEdvb2dsZVRhYmxldDpcIkFuZHJvaWQuKlBpeGVsIENcIixTYW1zdW5nVGFibGV0OlwiU0FNU1VORy4qVGFibGV0fEdhbGF4eS4qVGFifFNDLTAxQ3xHVC1QMTAwMHxHVC1QMTAwM3xHVC1QMTAxMHxHVC1QMzEwNXxHVC1QNjIxMHxHVC1QNjgwMHxHVC1QNjgxMHxHVC1QNzEwMHxHVC1QNzMwMHxHVC1QNzMxMHxHVC1QNzUwMHxHVC1QNzUxMHxTQ0gtSTgwMHxTQ0gtSTgxNXxTQ0gtSTkwNXxTR0gtSTk1N3xTR0gtSTk4N3xTR0gtVDg0OXxTR0gtVDg1OXxTR0gtVDg2OXxTUEgtUDEwMHxHVC1QMzEwMHxHVC1QMzEwOHxHVC1QMzExMHxHVC1QNTEwMHxHVC1QNTExMHxHVC1QNjIwMHxHVC1QNzMyMHxHVC1QNzUxMXxHVC1OODAwMHxHVC1QODUxMHxTR0gtSTQ5N3xTUEgtUDUwMHxTR0gtVDc3OXxTQ0gtSTcwNXxTQ0gtSTkxNXxHVC1OODAxM3xHVC1QMzExM3xHVC1QNTExM3xHVC1QODExMHxHVC1OODAxMHxHVC1OODAwNXxHVC1OODAyMHxHVC1QMTAxM3xHVC1QNjIwMXxHVC1QNzUwMXxHVC1ONTEwMHxHVC1ONTEwNXxHVC1ONTExMHxTSFYtRTE0MEt8U0hWLUUxNDBMfFNIVi1FMTQwU3xTSFYtRTE1MFN8U0hWLUUyMzBLfFNIVi1FMjMwTHxTSFYtRTIzMFN8U0hXLU0xODBLfFNIVy1NMTgwTHxTSFctTTE4MFN8U0hXLU0xODBXfFNIVy1NMzAwV3xTSFctTTMwNVd8U0hXLU0zODBLfFNIVy1NMzgwU3xTSFctTTM4MFd8U0hXLU00MzBXfFNIVy1NNDgwS3xTSFctTTQ4MFN8U0hXLU00ODBXfFNIVy1NNDg1V3xTSFctTTQ4Nld8U0hXLU01MDBXfEdULUk5MjI4fFNDSC1QNzM5fFNDSC1JOTI1fEdULUk5MjAwfEdULVA1MjAwfEdULVA1MjEwfEdULVA1MjEwWHxTTS1UMzExfFNNLVQzMTB8U00tVDMxMFh8U00tVDIxMHxTTS1UMjEwUnxTTS1UMjExfFNNLVA2MDB8U00tUDYwMXxTTS1QNjA1fFNNLVA5MDB8U00tUDkwMXxTTS1UMjE3fFNNLVQyMTdBfFNNLVQyMTdTfFNNLVA2MDAwfFNNLVQzMTAwfFNHSC1JNDY3fFhFNTAwfFNNLVQxMTB8R1QtUDUyMjB8R1QtSTkyMDBYfEdULU41MTEwWHxHVC1ONTEyMHxTTS1QOTA1fFNNLVQxMTF8U00tVDIxMDV8U00tVDMxNXxTTS1UMzIwfFNNLVQzMjBYfFNNLVQzMjF8U00tVDUyMHxTTS1UNTI1fFNNLVQ1MzBOVXxTTS1UMjMwTlV8U00tVDMzME5VfFNNLVQ5MDB8WEU1MDBUMUN8U00tUDYwNVZ8U00tUDkwNVZ8U00tVDMzN1Z8U00tVDUzN1Z8U00tVDcwN1Z8U00tVDgwN1Z8U00tUDYwMFh8U00tUDkwMFh8U00tVDIxMFh8U00tVDIzMHxTTS1UMjMwWHxTTS1UMzI1fEdULVA3NTAzfFNNLVQ1MzF8U00tVDMzMHxTTS1UNTMwfFNNLVQ3MDV8U00tVDcwNUN8U00tVDUzNXxTTS1UMzMxfFNNLVQ4MDB8U00tVDcwMHxTTS1UNTM3fFNNLVQ4MDd8U00tUDkwN0F8U00tVDMzN0F8U00tVDUzN0F8U00tVDcwN0F8U00tVDgwN0F8U00tVDIzN3xTTS1UODA3UHxTTS1QNjA3VHxTTS1UMjE3VHxTTS1UMzM3VHxTTS1UODA3VHxTTS1UMTE2TlF8U00tVDExNkJVfFNNLVA1NTB8U00tVDM1MHxTTS1UNTUwfFNNLVQ5MDAwfFNNLVA5MDAwfFNNLVQ3MDVZfFNNLVQ4MDV8R1QtUDMxMTN8U00tVDcxMHxTTS1UODEwfFNNLVQ4MTV8U00tVDM2MHxTTS1UNTMzfFNNLVQxMTN8U00tVDMzNXxTTS1UNzE1fFNNLVQ1NjB8U00tVDY3MHxTTS1UNjc3fFNNLVQzNzd8U00tVDU2N3xTTS1UMzU3VHxTTS1UNTU1fFNNLVQ1NjF8U00tVDcxM3xTTS1UNzE5fFNNLVQ4MTN8U00tVDgxOXxTTS1UNTgwfFNNLVQzNTVZP3xTTS1UMjgwfFNNLVQ4MTdBfFNNLVQ4MjB8U00tVzcwMHxTTS1QNTgwfFNNLVQ1ODd8U00tUDM1MHxTTS1QNTU1TXxTTS1QMzU1TXxTTS1UMTEzTlV8U00tVDgxNVl8U00tVDU4NXxTTS1UMjg1fFNNLVQ4MjV8U00tVzcwOFwiLEtpbmRsZTpcIktpbmRsZXxTaWxrLipBY2NlbGVyYXRlZHxBbmRyb2lkLipcXFxcYihLRk9UfEtGVFR8S0ZKV0l8S0ZKV0F8S0ZPVEV8S0ZTT1dJfEtGVEhXSXxLRlRIV0F8S0ZBUFdJfEtGQVBXQXxXRkpXQUV8S0ZTQVdBfEtGU0FXSXxLRkFTV0l8S0ZBUldJfEtGRk9XSXxLRkdJV0l8S0ZNRVdJKVxcXFxifEFuZHJvaWQuKlNpbGsvWzAtOS5dKyBsaWtlIENocm9tZS9bMC05Ll0rICg/IU1vYmlsZSlcIixTdXJmYWNlVGFibGV0OlwiV2luZG93cyBOVCBbMC05Ll0rOyBBUk07LiooVGFibGV0fEFSTUJKUylcIixIUFRhYmxldDpcIkhQIFNsYXRlICg3fDh8MTApfEhQIEVsaXRlUGFkIDkwMHxocC10YWJsZXR8RWxpdGVCb29rLipUb3VjaHxIUCA4fFNsYXRlIDIxfEhQIFNsYXRlQm9vayAxMFwiLEFzdXNUYWJsZXQ6XCJeLipQYWRGb25lKCg/IU1vYmlsZSkuKSokfFRyYW5zZm9ybWVyfFRGMTAxfFRGMTAxR3xURjMwMFR8VEYzMDBUR3xURjMwMFRMfFRGNzAwVHxURjcwMEtMfFRGNzAxVHxURjgxMEN8TUUxNzF8TUUzMDFUfE1FMzAyQ3xNRTM3MU1HfE1FMzcwVHxNRTM3Mk1HfE1FMTcyVnxNRTE3M1h8TUU0MDBDfFNsaWRlciBTTDEwMXxcXFxcYkswMEZcXFxcYnxcXFxcYkswMENcXFxcYnxcXFxcYkswMEVcXFxcYnxcXFxcYkswMExcXFxcYnxUWDIwMUxBfE1FMTc2Q3xNRTEwMkF8XFxcXGJNODBUQVxcXFxifE1FMzcyQ0x8TUU1NjBDR3xNRTM3MkNHfE1FMzAyS0x8IEswMTAgfCBLMDExIHwgSzAxNyB8IEswMUUgfE1FNTcyQ3xNRTEwM0t8TUUxNzBDfE1FMTcxQ3xcXFxcYk1FNzBDXFxcXGJ8TUU1ODFDfE1FNTgxQ0x8TUU4NTEwQ3xNRTE4MUN8UDAxWXxQTzFNQXxQMDFafFxcXFxiUDAyN1xcXFxifFxcXFxiUDAyNFxcXFxifFxcXFxiUDAwQ1xcXFxiXCIsQmxhY2tCZXJyeVRhYmxldDpcIlBsYXlCb29rfFJJTSBUYWJsZXRcIixIVEN0YWJsZXQ6XCJIVENfRmx5ZXJfUDUxMnxIVEMgRmx5ZXJ8SFRDIEpldHN0cmVhbXxIVEMtUDcxNWF8SFRDIEVWTyBWaWV3IDRHfFBHNDEyMDB8UEcwOTQxMFwiLE1vdG9yb2xhVGFibGV0OlwieG9vbXxzaG9sZXN0fE1aNjE1fE1aNjA1fE1aNTA1fE1aNjAxfE1aNjAyfE1aNjAzfE1aNjA0fE1aNjA2fE1aNjA3fE1aNjA4fE1aNjA5fE1aNjE1fE1aNjE2fE1aNjE3XCIsTm9va1RhYmxldDpcIkFuZHJvaWQuKk5vb2t8Tm9va0NvbG9yfG5vb2sgYnJvd3NlcnxCTlJWMjAwfEJOUlYyMDBBfEJOVFYyNTB8Qk5UVjI1MEF8Qk5UVjQwMHxCTlRWNjAwfExvZ2ljUEQgWm9vbTJcIixBY2VyVGFibGV0OlwiQW5kcm9pZC4qOyBcXFxcYihBMTAwfEExMDF8QTExMHxBMjAwfEEyMTB8QTIxMXxBNTAwfEE1MDF8QTUxMHxBNTExfEE3MDB8QTcwMXxXNTAwfFc1MDBQfFc1MDF8VzUwMVB8VzUxMHxXNTExfFc3MDB8RzEwMHxHMTAwV3xCMS1BNzF8QjEtNzEwfEIxLTcxMXxBMS04MTB8QTEtODExfEExLTgzMClcXFxcYnxXMy04MTB8XFxcXGJBMy1BMTBcXFxcYnxcXFxcYkEzLUExMVxcXFxifFxcXFxiQTMtQTIwXFxcXGJ8XFxcXGJBMy1BMzBcIixUb3NoaWJhVGFibGV0OlwiQW5kcm9pZC4qKEFUMTAwfEFUMTA1fEFUMjAwfEFUMjA1fEFUMjcwfEFUMjc1fEFUMzAwfEFUMzA1fEFUMVM1fEFUNTAwfEFUNTcwfEFUNzAwfEFUODMwKXxUT1NISUJBLipGT0xJT1wiLExHVGFibGV0OlwiXFxcXGJMLTA2Q3xMRy1WOTA5fExHLVY5MDB8TEctVjcwMHxMRy1WNTEwfExHLVY1MDB8TEctVjQxMHxMRy1WNDAwfExHLVZLODEwXFxcXGJcIixGdWppdHN1VGFibGV0OlwiQW5kcm9pZC4qXFxcXGIoRi0wMUR8Ri0wMkZ8Ri0wNUV8Ri0xMER8TTUzMnxRNTcyKVxcXFxiXCIsUHJlc3RpZ2lvVGFibGV0OlwiUE1QMzE3MEJ8UE1QMzI3MEJ8UE1QMzQ3MEJ8UE1QNzE3MEJ8UE1QMzM3MEJ8UE1QMzU3MEN8UE1QNTg3MEN8UE1QMzY3MEJ8UE1QNTU3MEN8UE1QNTc3MER8UE1QMzk3MEJ8UE1QMzg3MEN8UE1QNTU4MEN8UE1QNTg4MER8UE1QNTc4MER8UE1QNTU4OEN8UE1QNzI4MEN8UE1QNzI4MEMzR3xQTVA3MjgwfFBNUDc4ODBEfFBNUDU1OTdEfFBNUDU1OTd8UE1QNzEwMER8UEVSMzQ2NHxQRVIzMjc0fFBFUjM1NzR8UEVSMzg4NHxQRVI1Mjc0fFBFUjU0NzR8UE1QNTA5N0NQUk98UE1QNTA5N3xQTVA3MzgwRHxQTVA1Mjk3Q3xQTVA1Mjk3Q19RVUFEfFBNUDgxMkV8UE1QODEyRTNHfFBNUDgxMkZ8UE1QODEwRXxQTVA4ODBURHxQTVQzMDE3fFBNVDMwMzd8UE1UMzA0N3xQTVQzMDU3fFBNVDcwMDh8UE1UNTg4N3xQTVQ1MDAxfFBNVDUwMDJcIixMZW5vdm9UYWJsZXQ6XCJMZW5vdm8gVEFCfElkZWEoVGFifFBhZCkoIEExfEExMHwgSzF8KXxUaGlua1BhZChbIF0rKT9UYWJsZXR8WVQzLTg1ME18WVQzLVg5MEx8WVQzLVg5MEZ8WVQzLVg5MFh8TGVub3ZvLiooUzIxMDl8UzIxMTB8UzUwMDB8UzYwMDB8SzMwMTF8QTMwMDB8QTM1MDB8QTEwMDB8QTIxMDd8QTIxMDl8QTExMDd8QTU1MDB8QTc2MDB8QjYwMDB8QjgwMDB8QjgwODApKC18KShGTHxGfEhWfEh8KXxUQi1YMTAzRnxUQi1YMzA0RnxUQi1YMzA0THxUQi04NzAzRnxUYWIyQTctMTBGXCIsRGVsbFRhYmxldDpcIlZlbnVlIDExfFZlbnVlIDh8VmVudWUgN3xEZWxsIFN0cmVhayAxMHxEZWxsIFN0cmVhayA3XCIsWWFydmlrVGFibGV0OlwiQW5kcm9pZC4qXFxcXGIoVEFCMjEwfFRBQjIxMXxUQUIyMjR8VEFCMjUwfFRBQjI2MHxUQUIyNjR8VEFCMzEwfFRBQjM2MHxUQUIzNjR8VEFCNDEwfFRBQjQxMXxUQUI0MjB8VEFCNDI0fFRBQjQ1MHxUQUI0NjB8VEFCNDYxfFRBQjQ2NHxUQUI0NjV8VEFCNDY3fFRBQjQ2OHxUQUIwNy0xMDB8VEFCMDctMTAxfFRBQjA3LTE1MHxUQUIwNy0xNTF8VEFCMDctMTUyfFRBQjA3LTIwMHxUQUIwNy0yMDEtM0d8VEFCMDctMjEwfFRBQjA3LTIxMXxUQUIwNy0yMTJ8VEFCMDctMjE0fFRBQjA3LTIyMHxUQUIwNy00MDB8VEFCMDctNDg1fFRBQjA4LTE1MHxUQUIwOC0yMDB8VEFCMDgtMjAxLTNHfFRBQjA4LTIwMS0zMHxUQUIwOS0xMDB8VEFCMDktMjExfFRBQjA5LTQxMHxUQUIxMC0xNTB8VEFCMTAtMjAxfFRBQjEwLTIxMXxUQUIxMC00MDB8VEFCMTAtNDEwfFRBQjEzLTIwMXxUQUIyNzRFVUt8VEFCMjc1RVVLfFRBQjM3NEVVS3xUQUI0NjJFVUt8VEFCNDc0RVVLfFRBQjktMjAwKVxcXFxiXCIsTWVkaW9uVGFibGV0OlwiQW5kcm9pZC4qXFxcXGJPWU9cXFxcYnxMSUZFLiooUDkyMTJ8UDk1MTR8UDk1MTZ8Uzk1MTIpfExJRkVUQUJcIixBcm5vdmFUYWJsZXQ6XCI5N0c0fEFOMTBHMnxBTjdiRzN8QU43ZkczfEFOOEczfEFOOGNHM3xBTjdHM3xBTjlHM3xBTjdkRzN8QU43ZEczU1R8QU43ZEczQ2hpbGRQYWR8QU4xMGJHM3xBTjEwYkczRFR8QU45RzJcIixJbnRlbnNvVGFibGV0OlwiSU5NODAwMktQfElOTTEwMTBGUHxJTk04MDVORHxJbnRlbnNvIFRhYnxUQUIxMDA0XCIsSVJVVGFibGV0OlwiTTcwMnByb1wiLE1lZ2Fmb25UYWJsZXQ6XCJNZWdhRm9uIFY5fFxcXFxiWlRFIFY5XFxcXGJ8QW5kcm9pZC4qXFxcXGJNVDdBXFxcXGJcIixFYm9kYVRhYmxldDpcIkUtQm9kYSAoU3VwcmVtZXxJbXByZXNzcGVlZHxJenp5Y29tbXxFc3NlbnRpYWwpXCIsQWxsVmlld1RhYmxldDpcIkFsbHZpZXcuKihWaXZhfEFsbGRyb3xDaXR5fFNwZWVkfEFsbCBUVnxGcmVuenl8UXVhc2FyfFNoaW5lfFRYMXxBWDF8QVgyKVwiLEFyY2hvc1RhYmxldDpcIlxcXFxiKDEwMUc5fDgwRzl8QTEwMUlUKVxcXFxifFFpbGl2ZSA5N1J8QXJjaG9zNXxcXFxcYkFSQ0hPUyAoNzB8Nzl8ODB8OTB8OTd8MTAxfEZBTUlMWVBBRHwpKGJ8Y3wpKEcxMHwgQ29iYWx0fCBUSVRBTklVTShIRHwpfCBYZW5vbnwgTmVvbnxYU0t8IDJ8IFhTIDJ8IFBMQVRJTlVNfCBDQVJCT058R0FNRVBBRClcXFxcYlwiLEFpbm9sVGFibGV0OlwiTk9WTzd8Tk9WTzh8Tk9WTzEwfE5vdm83QXVyb3JhfE5vdm83QmFzaWN8Tk9WTzdQQUxBRElOfG5vdm85LVNwYXJrXCIsTm9raWFMdW1pYVRhYmxldDpcIkx1bWlhIDI1MjBcIixTb255VGFibGV0OlwiU29ueS4qVGFibGV0fFhwZXJpYSBUYWJsZXR8U29ueSBUYWJsZXQgU3xTTy0wM0V8U0dQVDEyfFNHUFQxM3xTR1BUMTE0fFNHUFQxMjF8U0dQVDEyMnxTR1BUMTIzfFNHUFQxMTF8U0dQVDExMnxTR1BUMTEzfFNHUFQxMzF8U0dQVDEzMnxTR1BUMTMzfFNHUFQyMTF8U0dQVDIxMnxTR1BUMjEzfFNHUDMxMXxTR1AzMTJ8U0dQMzIxfEVCUkQxMTAxfEVCUkQxMTAyfEVCUkQxMjAxfFNHUDM1MXxTR1AzNDF8U0dQNTExfFNHUDUxMnxTR1A1MjF8U0dQNTQxfFNHUDU1MXxTR1A2MjF8U0dQNjEyfFNPVDMxXCIsUGhpbGlwc1RhYmxldDpcIlxcXFxiKFBJMjAxMHxQSTMwMDB8UEkzMTAwfFBJMzEwNXxQSTMxMTB8UEkzMjA1fFBJMzIxMHxQSTM5MDB8UEk0MDEwfFBJNzAwMHxQSTcxMDApXFxcXGJcIixDdWJlVGFibGV0OlwiQW5kcm9pZC4qKEs4R1R8VTlHVHxVMTBHVHxVMTZHVHxVMTdHVHxVMThHVHxVMTlHVHxVMjBHVHxVMjNHVHxVMzBHVCl8Q1VCRSBVOEdUXCIsQ29ieVRhYmxldDpcIk1JRDEwNDJ8TUlEMTA0NXxNSUQxMTI1fE1JRDExMjZ8TUlENzAxMnxNSUQ3MDE0fE1JRDcwMTV8TUlENzAzNHxNSUQ3MDM1fE1JRDcwMzZ8TUlENzA0MnxNSUQ3MDQ4fE1JRDcxMjd8TUlEODA0MnxNSUQ4MDQ4fE1JRDgxMjd8TUlEOTA0MnxNSUQ5NzQwfE1JRDk3NDJ8TUlENzAyMnxNSUQ3MDEwXCIsTUlEVGFibGV0OlwiTTk3MDF8TTkwMDB8TTkxMDB8TTgwNnxNMTA1MnxNODA2fFQ3MDN8TUlENzAxfE1JRDcxM3xNSUQ3MTB8TUlENzI3fE1JRDc2MHxNSUQ4MzB8TUlENzI4fE1JRDkzM3xNSUQxMjV8TUlEODEwfE1JRDczMnxNSUQxMjB8TUlEOTMwfE1JRDgwMHxNSUQ3MzF8TUlEOTAwfE1JRDEwMHxNSUQ4MjB8TUlENzM1fE1JRDk4MHxNSUQxMzB8TUlEODMzfE1JRDczN3xNSUQ5NjB8TUlEMTM1fE1JRDg2MHxNSUQ3MzZ8TUlEMTQwfE1JRDkzMHxNSUQ4MzV8TUlENzMzfE1JRDRYMTBcIixNU0lUYWJsZXQ6XCJNU0kgXFxcXGIoUHJpbW8gNzNLfFByaW1vIDczTHxQcmltbyA4MUx8UHJpbW8gNzd8UHJpbW8gOTN8UHJpbW8gNzV8UHJpbW8gNzZ8UHJpbW8gNzN8UHJpbW8gODF8UHJpbW8gOTF8UHJpbW8gOTB8RW5qb3kgNzF8RW5qb3kgN3xFbmpveSAxMClcXFxcYlwiLFNNaVRUYWJsZXQ6XCJBbmRyb2lkLiooXFxcXGJNSURcXFxcYnxNSUQtNTYwfE1UVi1UMTIwMHxNVFYtUE5ENTMxfE1UVi1QMTEwMXxNVFYtUE5ENTMwKVwiLFJvY2tDaGlwVGFibGV0OlwiQW5kcm9pZC4qKFJLMjgxOHxSSzI4MDhBfFJLMjkxOHxSSzMwNjYpfFJLMjczOHxSSzI4MDhBXCIsRmx5VGFibGV0OlwiSVEzMTB8Rmx5IFZpc2lvblwiLGJxVGFibGV0OlwiQW5kcm9pZC4qKGJxKT8uKihFbGNhbm98Q3VyaWV8RWRpc29ufE1heHdlbGx8S2VwbGVyfFBhc2NhbHxUZXNsYXxIeXBhdGlhfFBsYXRvbnxOZXd0b258TGl2aW5nc3RvbmV8Q2VydmFudGVzfEF2YW50fEFxdWFyaXMgKFtFfE1dMTB8TTgpKXxNYXh3ZWxsLipMaXRlfE1heHdlbGwuKlBsdXNcIixIdWF3ZWlUYWJsZXQ6XCJNZWRpYVBhZHxNZWRpYVBhZCA3IFlvdXRofElERU9TIFM3fFM3LTIwMWN8UzctMjAydXxTNy0xMDF8UzctMTAzfFM3LTEwNHxTNy0xMDV8UzctMTA2fFM3LTIwMXxTNy1TbGltfE0yLUEwMUx8QkFILUwwOXxCQUgtVzA5XCIsTmVjVGFibGV0OlwiXFxcXGJOLTA2RHxcXFxcYk4tMDhEXCIsUGFudGVjaFRhYmxldDpcIlBhbnRlY2guKlA0MTAwXCIsQnJvbmNob1RhYmxldDpcIkJyb25jaG8uKihONzAxfE43MDh8TjgwMnxhNzEwKVwiLFZlcnN1c1RhYmxldDpcIlRPVUNIUEFELipbNzg5MTBdfFxcXFxiVE9VQ0hUQUJcXFxcYlwiLFp5bmNUYWJsZXQ6XCJ6MTAwMHxaOTkgMkd8ejk5fHo5MzB8ejk5OXx6OTkwfHo5MDl8WjkxOXx6OTAwXCIsUG9zaXRpdm9UYWJsZXQ6XCJUQjA3U1RBfFRCMTBTVEF8VEIwN0ZUQXxUQjEwRlRBXCIsTmFiaVRhYmxldDpcIkFuZHJvaWQuKlxcXFxiTmFiaVwiLEtvYm9UYWJsZXQ6XCJLb2JvIFRvdWNofFxcXFxiSzA4MFxcXFxifFxcXFxiVm94XFxcXGIgQnVpbGR8XFxcXGJBcmNcXFxcYiBCdWlsZFwiLERhbmV3VGFibGV0OlwiRFNsaWRlLipcXFxcYig3MDB8NzAxUnw3MDJ8NzAzUnw3MDR8ODAyfDk3MHw5NzF8OTcyfDk3M3w5NzR8MTAxMHwxMDEyKVxcXFxiXCIsVGV4ZXRUYWJsZXQ6XCJOYXZpUGFkfFRCLTc3MkF8VE0tNzA0NXxUTS03MDU1fFRNLTk3NTB8VE0tNzAxNnxUTS03MDI0fFRNLTcwMjZ8VE0tNzA0MXxUTS03MDQzfFRNLTcwNDd8VE0tODA0MXxUTS05NzQxfFRNLTk3NDd8VE0tOTc0OHxUTS05NzUxfFRNLTcwMjJ8VE0tNzAyMXxUTS03MDIwfFRNLTcwMTF8VE0tNzAxMHxUTS03MDIzfFRNLTcwMjV8VE0tNzAzN1d8VE0tNzAzOFd8VE0tNzAyN1d8VE0tOTcyMHxUTS05NzI1fFRNLTk3MzdXfFRNLTEwMjB8VE0tOTczOFd8VE0tOTc0MHxUTS05NzQzV3xUQi04MDdBfFRCLTc3MUF8VEItNzI3QXxUQi03MjVBfFRCLTcxOUF8VEItODIzQXxUQi04MDVBfFRCLTcyM0F8VEItNzE1QXxUQi03MDdBfFRCLTcwNUF8VEItNzA5QXxUQi03MTFBfFRCLTg5MEhEfFRCLTg4MEhEfFRCLTc5MEhEfFRCLTc4MEhEfFRCLTc3MEhEfFRCLTcyMUhEfFRCLTcxMEhEfFRCLTQzNEhEfFRCLTg2MEhEfFRCLTg0MEhEfFRCLTc2MEhEfFRCLTc1MEhEfFRCLTc0MEhEfFRCLTczMEhEfFRCLTcyMkhEfFRCLTcyMEhEfFRCLTcwMEhEfFRCLTUwMEhEfFRCLTQ3MEhEfFRCLTQzMUhEfFRCLTQzMEhEfFRCLTUwNnxUQi01MDR8VEItNDQ2fFRCLTQzNnxUQi00MTZ8VEItMTQ2U0V8VEItMTI2U0VcIixQbGF5c3RhdGlvblRhYmxldDpcIlBsYXlzdGF0aW9uLiooUG9ydGFibGV8Vml0YSlcIixUcmVrc3RvclRhYmxldDpcIlNUMTA0MTYtMXxWVDEwNDE2LTF8U1Q3MDQwOC0xfFNUNzAyeHgtMXxTVDcwMnh4LTJ8U1Q4MDIwOHxTVDk3MjE2fFNUNzAxMDQtMnxWVDEwNDE2LTJ8U1QxMDIxNi0yQXxTdXJmVGFiXCIsUHlsZUF1ZGlvVGFibGV0OlwiXFxcXGIoUFRCTDEwQ0VVfFBUQkwxMEN8UFRCTDcyQkN8UFRCTDcyQkNFVXxQVEJMN0NFVXxQVEJMN0N8UFRCTDkyQkN8UFRCTDkyQkNFVXxQVEJMOUNFVXxQVEJMOUNVS3xQVEJMOUMpXFxcXGJcIixBZHZhblRhYmxldDpcIkFuZHJvaWQuKiBcXFxcYihFM0F8VDNYfFQ1Q3xUNUJ8VDNFfFQzQ3xUM0J8VDFKfFQxRnxUMkF8VDFIfFQxaXxFMUN8VDEtRXxUNS1BfFQ0fEUxLUJ8VDJDaXxUMS1CfFQxLUR8TzEtQXxFMS1BfFQxLUF8VDNBfFQ0aSlcXFxcYiBcIixEYW55VGVjaFRhYmxldDpcIkdlbml1cyBUYWIgRzN8R2VuaXVzIFRhYiBTMnxHZW5pdXMgVGFiIFEzfEdlbml1cyBUYWIgRzR8R2VuaXVzIFRhYiBRNHxHZW5pdXMgVGFiIEctSUl8R2VuaXVzIFRBQiBHSUl8R2VuaXVzIFRBQiBHSUlJfEdlbml1cyBUYWIgUzFcIixHYWxhcGFkVGFibGV0OlwiQW5kcm9pZC4qXFxcXGJHMVxcXFxiXCIsTWljcm9tYXhUYWJsZXQ6XCJGdW5ib29rfE1pY3JvbWF4LipcXFxcYihQMjUwfFA1NjB8UDM2MHxQMzYyfFA2MDB8UDMwMHxQMzUwfFA1MDB8UDI3NSlcXFxcYlwiLEthcmJvbm5UYWJsZXQ6XCJBbmRyb2lkLipcXFxcYihBMzl8QTM3fEEzNHxTVDh8U1QxMHxTVDd8U21hcnQgVGFiM3xTbWFydCBUYWIyKVxcXFxiXCIsQWxsRmluZVRhYmxldDpcIkZpbmU3IEdlbml1c3xGaW5lNyBTaGluZXxGaW5lNyBBaXJ8RmluZTggU3R5bGV8RmluZTkgTW9yZXxGaW5lMTAgSm95fEZpbmUxMSBXaWRlXCIsUFJPU0NBTlRhYmxldDpcIlxcXFxiKFBFTTYzfFBMVDEwMjNHfFBMVDEwNDF8UExUMTA0NHxQTFQxMDQ0R3xQTFQxMDkxfFBMVDQzMTF8UExUNDMxMVBMfFBMVDQzMTV8UExUNzAzMHxQTFQ3MDMzfFBMVDcwMzNEfFBMVDcwMzV8UExUNzAzNUR8UExUNzA0NEt8UExUNzA0NUt8UExUNzA0NUtCfFBMVDcwNzFLR3xQTFQ3MDcyfFBMVDcyMjNHfFBMVDcyMjVHfFBMVDc3NzdHfFBMVDc4MTBLfFBMVDc4NDlHfFBMVDc4NTFHfFBMVDc4NTJHfFBMVDgwMTV8UExUODAzMXxQTFQ4MDM0fFBMVDgwMzZ8UExUODA4MEt8UExUODA4MnxQTFQ4MDg4fFBMVDgyMjNHfFBMVDgyMzRHfFBMVDgyMzVHfFBMVDg4MTZLfFBMVDkwMTF8UExUOTA0NUt8UExUOTIzM0d8UExUOTczNXxQTFQ5NzYwR3xQTFQ5NzcwRylcXFxcYlwiLFlPTkVTVGFibGV0OlwiQlExMDc4fEJDMTAwM3xCQzEwNzd8Uks5NzAyfEJDOTczMHxCQzkwMDF8SVQ5MDAxfEJDNzAwOHxCQzcwMTB8QkM3MDh8QkM3Mjh8QkM3MDEyfEJDNzAzMHxCQzcwMjd8QkM3MDI2XCIsQ2hhbmdKaWFUYWJsZXQ6XCJUUEM3MTAyfFRQQzcxMDN8VFBDNzEwNXxUUEM3MTA2fFRQQzcxMDd8VFBDNzIwMXxUUEM3MjAzfFRQQzcyMDV8VFBDNzIxMHxUUEM3NzA4fFRQQzc3MDl8VFBDNzcxMnxUUEM3MTEwfFRQQzgxMDF8VFBDODEwM3xUUEM4MTA1fFRQQzgxMDZ8VFBDODIwM3xUUEM4MjA1fFRQQzg1MDN8VFBDOTEwNnxUUEM5NzAxfFRQQzk3MTAxfFRQQzk3MTAzfFRQQzk3MTA1fFRQQzk3MTA2fFRQQzk3MTExfFRQQzk3MTEzfFRQQzk3MjAzfFRQQzk3NjAzfFRQQzk3ODA5fFRQQzk3MjA1fFRQQzEwMTAxfFRQQzEwMTAzfFRQQzEwMTA2fFRQQzEwMTExfFRQQzEwMjAzfFRQQzEwMjA1fFRQQzEwNTAzXCIsR1VUYWJsZXQ6XCJUWC1BMTMwMXxUWC1NOTAwMnxRNzAyfGtmMDI2XCIsUG9pbnRPZlZpZXdUYWJsZXQ6XCJUQUItUDUwNnxUQUItbmF2aS03LTNHLU18VEFCLVA1MTd8VEFCLVAtNTI3fFRBQi1QNzAxfFRBQi1QNzAzfFRBQi1QNzIxfFRBQi1QNzMxTnxUQUItUDc0MXxUQUItUDgyNXxUQUItUDkwNXxUQUItUDkyNXxUQUItUFI5NDV8VEFCLVBMMTAxNXxUQUItUDEwMjV8VEFCLVBJMTA0NXxUQUItUDEzMjV8VEFCLVBST1RBQlswLTldK3xUQUItUFJPVEFCMjV8VEFCLVBST1RBQjI2fFRBQi1QUk9UQUIyN3xUQUItUFJPVEFCMjZYTHxUQUItUFJPVEFCMi1JUFM5fFRBQi1QUk9UQUIzMC1JUFM5fFRBQi1QUk9UQUIyNVhYTHxUQUItUFJPVEFCMjYtSVBTMTB8VEFCLVBST1RBQjMwLUlQUzEwXCIsT3Zlcm1heFRhYmxldDpcIk9WLShTdGVlbENvcmV8TmV3QmFzZXxCYXNlY29yZXxCYXNlb25lfEV4ZWxsZW58UXVhdHRvcnxFZHVUYWJ8U29sdXRpb258QUNUSU9OfEJhc2ljVGFifFRlZGR5VGFifE1hZ2ljVGFifFN0cmVhbXxUQi0wOHxUQi0wOSl8UXVhbGNvcmUgMTAyN1wiLEhDTFRhYmxldDpcIkhDTC4qVGFibGV0fENvbm5lY3QtM0ctMi4wfENvbm5lY3QtMkctMi4wfE1FIFRhYmxldCBVMXxNRSBUYWJsZXQgVTJ8TUUgVGFibGV0IEcxfE1FIFRhYmxldCBYMXxNRSBUYWJsZXQgWTJ8TUUgVGFibGV0IFN5bmNcIixEUFNUYWJsZXQ6XCJEUFMgRHJlYW0gOXxEUFMgRHVhbCA3XCIsVmlzdHVyZVRhYmxldDpcIlY5NyBIRHxpNzUgM0d8VmlzdHVyZSBWNCggSEQpP3xWaXN0dXJlIFY1KCBIRCk/fFZpc3R1cmUgVjEwXCIsQ3Jlc3RhVGFibGV0OlwiQ1RQKC0pPzgxMHxDVFAoLSk/ODE4fENUUCgtKT84Mjh8Q1RQKC0pPzgzOHxDVFAoLSk/ODg4fENUUCgtKT85Nzh8Q1RQKC0pPzk4MHxDVFAoLSk/OTg3fENUUCgtKT85ODh8Q1RQKC0pPzk4OVwiLE1lZGlhdGVrVGFibGV0OlwiXFxcXGJNVDgxMjV8TVQ4Mzg5fE1UODEzNXxNVDgzNzdcXFxcYlwiLENvbmNvcmRlVGFibGV0OlwiQ29uY29yZGUoWyBdKyk/VGFifENvbkNvcmRlIFJlYWRNYW5cIixHb0NsZXZlclRhYmxldDpcIkdPQ0xFVkVSIFRBQnxBN0dPQ0xFVkVSfE0xMDQyfE03ODQxfE03NDJ8UjEwNDJCS3xSMTA0MXxUQUIgQTk3NXxUQUIgQTc4NDJ8VEFCIEE3NDF8VEFCIEE3NDFMfFRBQiBNNzIzR3xUQUIgTTcyMXxUQUIgQTEwMjF8VEFCIEk5MjF8VEFCIFI3MjF8VEFCIEk3MjB8VEFCIFQ3NnxUQUIgUjcwfFRBQiBSNzYuMnxUQUIgUjEwNnxUQUIgUjgzLjJ8VEFCIE04MTNHfFRBQiBJNzIxfEdDVEE3MjJ8VEFCIEk3MHxUQUIgSTcxfFRBQiBTNzN8VEFCIFI3M3xUQUIgUjc0fFRBQiBSOTN8VEFCIFI3NXxUQUIgUjc2LjF8VEFCIEE3M3xUQUIgQTkzfFRBQiBBOTMuMnxUQUIgVDcyfFRBQiBSODN8VEFCIFI5NzR8VEFCIFI5NzN8VEFCIEExMDF8VEFCIEExMDN8VEFCIEExMDR8VEFCIEExMDQuMnxSMTA1Qkt8TTcxM0d8QTk3MkJLfFRBQiBBOTcxfFRBQiBSOTc0LjJ8VEFCIFIxMDR8VEFCIFI4My4zfFRBQiBBMTA0MlwiLE1vZGVjb21UYWJsZXQ6XCJGcmVlVEFCIDkwMDB8RnJlZVRBQiA3LjR8RnJlZVRBQiA3MDA0fEZyZWVUQUIgNzgwMHxGcmVlVEFCIDIwOTZ8RnJlZVRBQiA3LjV8RnJlZVRBQiAxMDE0fEZyZWVUQUIgMTAwMSB8RnJlZVRBQiA4MDAxfEZyZWVUQUIgOTcwNnxGcmVlVEFCIDk3MDJ8RnJlZVRBQiA3MDAzfEZyZWVUQUIgNzAwMnxGcmVlVEFCIDEwMDJ8RnJlZVRBQiA3ODAxfEZyZWVUQUIgMTMzMXxGcmVlVEFCIDEwMDR8RnJlZVRBQiA4MDAyfEZyZWVUQUIgODAxNHxGcmVlVEFCIDk3MDR8RnJlZVRBQiAxMDAzXCIsVm9uaW5vVGFibGV0OlwiXFxcXGIoQXJndXNbIF9dP1N8RGlhbW9uZFsgX10/NzlIRHxFbWVyYWxkWyBfXT83OEV8THVuYVsgX10/NzBDfE9ueXhbIF9dP1N8T255eFsgX10/WnxPcmluWyBfXT9IRHxPcmluWyBfXT9TfE90aXNbIF9dP1N8U3BlZWRTdGFyWyBfXT9TfE1hZ25ldFsgX10/TTl8UHJpbXVzWyBfXT85NFsgX10/M0d8UHJpbXVzWyBfXT85NEhEfFByaW11c1sgX10/UVN8QW5kcm9pZC4qXFxcXGJROFxcXFxifFNpcml1c1sgX10/RVZPWyBfXT9RU3xTaXJpdXNbIF9dP1FTfFNwaXJpdFsgX10/UylcXFxcYlwiLEVDU1RhYmxldDpcIlYwN09UMnxUTTEwNUF8UzEwT1QxfFRSMTBDUzFcIixTdG9yZXhUYWJsZXQ6XCJlWmVlW18nXT8oVGFifEdvKVswLTldK3xUYWJMQzd8TG9vbmV5IFR1bmVzIFRhYlwiLFZvZGFmb25lVGFibGV0OlwiU21hcnRUYWIoWyBdKyk/WzAtOV0rfFNtYXJ0VGFiSUkxMHxTbWFydFRhYklJN3xWRi0xNDk3XCIsRXNzZW50aWVsQlRhYmxldDpcIlNtYXJ0WyAnXT9UQUJbIF0rP1swLTldK3xGYW1pbHlbICddP1RBQjJcIixSb3NzTW9vclRhYmxldDpcIlJNLTc5MHxSTS05OTd8Uk1ELTg3OEd8Uk1ELTk3NFJ8Uk1ULTcwNUF8Uk1ULTcwMXxSTUUtNjAxfFJNVC01MDF8Uk1ULTcxMVwiLGlNb2JpbGVUYWJsZXQ6XCJpLW1vYmlsZSBpLW5vdGVcIixUb2xpbm9UYWJsZXQ6XCJ0b2xpbm8gdGFiIFswLTkuXSt8dG9saW5vIHNoaW5lXCIsQXVkaW9Tb25pY1RhYmxldDpcIlxcXFxiQy0yMlF8VDctUUN8VC0xN0J8VC0xN1BcXFxcYlwiLEFNUEVUYWJsZXQ6XCJBbmRyb2lkLiogQTc4IFwiLFNra1RhYmxldDpcIkFuZHJvaWQuKiAoU0tZUEFEfFBIT0VOSVh8Q1lDTE9QUylcIixUZWNub1RhYmxldDpcIlRFQ05PIFA5fFRFQ05PIERQOERcIixKWERUYWJsZXQ6XCJBbmRyb2lkLiogXFxcXGIoRjMwMDB8QTMzMDB8SlhENTAwMHxKWEQzMDAwfEpYRDIwMDB8SlhEMzAwQnxKWEQzMDB8UzU4MDB8Uzc4MDB8UzYwMmJ8UzUxMTBifFM3MzAwfFM1MzAwfFM2MDJ8UzYwM3xTNTEwMHxTNTExMHxTNjAxfFM3MTAwYXxQMzAwMEZ8UDMwMDBzfFAxMDF8UDIwMHN8UDEwMDBtfFAyMDBtfFA5MTAwfFAxMDAwc3xTNjYwMGJ8UzkwOHxQMTAwMHxQMzAwfFMxOHxTNjYwMHxTOTEwMClcXFxcYlwiLGlKb3lUYWJsZXQ6XCJUYWJsZXQgKFNwaXJpdCA3fEVzc2VudGlhfEdhbGF0ZWF8RnVzaW9ufE9uaXggN3xMYW5kYXxUaXRhbnxTY29vYnl8RGVveHxTdGVsbGF8VGhlbWlzfEFyZ29ufFVuaXF1ZSA3fFN5Z251c3xIZXhlbnxGaW5pdHkgN3xDcmVhbXxDcmVhbSBYMnxKYWRlfE5lb24gN3xOZXJvbiA3fEthbmR5fFNjYXBlfFNhcGh5ciA3fFJlYmVsfEJpb3h8UmViZWx8UmViZWwgOEdCfE15c3R8RHJhY28gN3xNeXN0fFRhYjctMDA0fE15c3R8VGFkZW8gSm9uZXN8VGFibGV0IEJvaW5nfEFycm93fERyYWNvIER1YWwgQ2FtfEF1cml4fE1pbnR8QW1pdHl8UmV2b2x1dGlvbnxGaW5pdHkgOXxOZW9uIDl8VDl3fEFtaXR5IDRHQiBEdWFsIENhbXxTdG9uZSA0R0J8U3RvbmUgOEdCfEFuZHJvbWVkYXxTaWxrZW58WDJ8QW5kcm9tZWRhIElJfEhhbGxleXxGbGFtZXxTYXBoeXIgOSw3fFRvdWNoIDh8UGxhbmV0fFRyaXRvbnxVbmlxdWUgMTB8SGV4ZW4gMTB8TWVtcGhpcyA0R0J8TWVtcGhpcyA4R0J8T25peCAxMClcIixGWDJUYWJsZXQ6XCJGWDIgUEFEN3xGWDIgUEFEMTBcIixYb3JvVGFibGV0OlwiS2lkc1BBRCA3MDF8UEFEWyBdPzcxMnxQQURbIF0/NzE0fFBBRFsgXT83MTZ8UEFEWyBdPzcxN3xQQURbIF0/NzE4fFBBRFsgXT83MjB8UEFEWyBdPzcyMXxQQURbIF0/NzIyfFBBRFsgXT83OTB8UEFEWyBdPzc5MnxQQURbIF0/OTAwfFBBRFsgXT85NzE1RHxQQURbIF0/OTcxNkRSfFBBRFsgXT85NzE4RFJ8UEFEWyBdPzk3MTlRUnxQQURbIF0/OTcyMFFSfFRlbGVQQUQxMDMwfFRlbGVwYWQxMDMyfFRlbGVQQUQ3MzB8VGVsZVBBRDczMXxUZWxlUEFENzMyfFRlbGVQQUQ3MzVRfFRlbGVQQUQ4MzB8VGVsZVBBRDk3MzB8VGVsZVBBRDc5NXxNZWdhUEFEIDEzMzF8TWVnYVBBRCAxODUxfE1lZ2FQQUQgMjE1MVwiLFZpZXdzb25pY1RhYmxldDpcIlZpZXdQYWQgMTBwaXxWaWV3UGFkIDEwZXxWaWV3UGFkIDEwc3xWaWV3UGFkIEU3MnxWaWV3UGFkN3xWaWV3UGFkIEUxMDB8Vmlld1BhZCA3ZXxWaWV3U29uaWMgVkI3MzN8VkIxMDBhXCIsVmVyaXpvblRhYmxldDpcIlFUQVFaM3xRVEFJUjd8UVRBUVRaM3xRVEFTVU4xfFFUQVNVTjJ8UVRBWElBMVwiLE9keXNUYWJsZXQ6XCJMT09YfFhFTk8xMHxPRFlTWyAtXShTcGFjZXxFVk98WHByZXNzfE5PT04pfFxcXFxiWEVMSU9cXFxcYnxYZWxpbzEwUHJvfFhFTElPN1BIT05FVEFCfFhFTElPMTBFWFRSRU1FfFhFTElPUFQyfE5FT19RVUFEMTBcIixDYXB0aXZhVGFibGV0OlwiQ0FQVElWQSBQQURcIixJY29uYml0VGFibGV0OlwiTmV0VEFCfE5ULTM3MDJ8TlQtMzcwMlN8TlQtMzcwMlN8TlQtMzYwM1B8TlQtMzYwM1B8TlQtMDcwNFN8TlQtMDcwNFN8TlQtMzgwNUN8TlQtMzgwNUN8TlQtMDgwNkN8TlQtMDgwNkN8TlQtMDkwOVR8TlQtMDkwOVR8TlQtMDkwN1N8TlQtMDkwN1N8TlQtMDkwMlN8TlQtMDkwMlNcIixUZWNsYXN0VGFibGV0OlwiVDk4IDRHfFxcXFxiUDgwXFxcXGJ8XFxcXGJYOTBIRFxcXFxifFg5OCBBaXJ8WDk4IEFpciAzR3xcXFxcYlg4OVxcXFxifFA4MCAzR3xcXFxcYlg4MGhcXFxcYnxQOTggQWlyfFxcXFxiWDg5SERcXFxcYnxQOTggM0d8XFxcXGJQOTBIRFxcXFxifFA4OSAzR3xYOTggM0d8XFxcXGJQNzBoXFxcXGJ8UDc5SEQgM0d8RzE4ZCAzR3xcXFxcYlA3OUhEXFxcXGJ8XFxcXGJQODlzXFxcXGJ8XFxcXGJBODhcXFxcYnxcXFxcYlAxMEhEXFxcXGJ8XFxcXGJQMTlIRFxcXFxifEcxOCAzR3xcXFxcYlA3OEhEXFxcXGJ8XFxcXGJBNzhcXFxcYnxcXFxcYlA3NVxcXFxifEcxN3MgM0d8RzE3aCAzR3xcXFxcYlA4NXRcXFxcYnxcXFxcYlA5MFxcXFxifFxcXFxiUDExXFxcXGJ8XFxcXGJQOTh0XFxcXGJ8XFxcXGJQOThIRFxcXFxifFxcXFxiRzE4ZFxcXFxifFxcXFxiUDg1c1xcXFxifFxcXFxiUDExSERcXFxcYnxcXFxcYlA4OHNcXFxcYnxcXFxcYkE4MEhEXFxcXGJ8XFxcXGJBODBzZVxcXFxifFxcXFxiQTEwaFxcXFxifFxcXFxiUDg5XFxcXGJ8XFxcXGJQNzhzXFxcXGJ8XFxcXGJHMThcXFxcYnxcXFxcYlA4NVxcXFxifFxcXFxiQTcwaFxcXFxifFxcXFxiQTcwXFxcXGJ8XFxcXGJHMTdcXFxcYnxcXFxcYlAxOFxcXFxifFxcXFxiQTgwc1xcXFxifFxcXFxiQTExc1xcXFxifFxcXFxiUDg4SERcXFxcYnxcXFxcYkE4MGhcXFxcYnxcXFxcYlA3NnNcXFxcYnxcXFxcYlA3NmhcXFxcYnxcXFxcYlA5OFxcXFxifFxcXFxiQTEwSERcXFxcYnxcXFxcYlA3OFxcXFxifFxcXFxiUDg4XFxcXGJ8XFxcXGJBMTFcXFxcYnxcXFxcYkExMHRcXFxcYnxcXFxcYlA3NmFcXFxcYnxcXFxcYlA3NnRcXFxcYnxcXFxcYlA3NmVcXFxcYnxcXFxcYlA4NUhEXFxcXGJ8XFxcXGJQODVhXFxcXGJ8XFxcXGJQODZcXFxcYnxcXFxcYlA3NUhEXFxcXGJ8XFxcXGJQNzZ2XFxcXGJ8XFxcXGJBMTJcXFxcYnxcXFxcYlA3NWFcXFxcYnxcXFxcYkExNVxcXFxifFxcXFxiUDc2VGlcXFxcYnxcXFxcYlA4MUhEXFxcXGJ8XFxcXGJBMTBcXFxcYnxcXFxcYlQ3NjBWRVxcXFxifFxcXFxiVDcyMEhEXFxcXGJ8XFxcXGJQNzZcXFxcYnxcXFxcYlA3M1xcXFxifFxcXFxiUDcxXFxcXGJ8XFxcXGJQNzJcXFxcYnxcXFxcYlQ3MjBTRVxcXFxifFxcXFxiQzUyMFRpXFxcXGJ8XFxcXGJUNzYwXFxcXGJ8XFxcXGJUNzIwVkVcXFxcYnxUNzIwLTNHRXxUNzIwLVdpRmlcIixPbmRhVGFibGV0OlwiXFxcXGIoVjk3NWl8VmkzMHxWWDUzMHxWNzAxfFZpNjB8VjcwMXN8Vmk1MHxWODAxc3xWNzE5fFZ4NjEwd3xWWDYxMFd8VjgxOWl8VmkxMHxWWDU4MFd8VmkxMHxWNzExc3xWODEzfFY4MTF8VjgyMHd8VjgyMHxWaTIwfFY3MTF8VkkzMFd8VjcxMnxWODkxd3xWOTcyfFY4MTl3fFY4MjB3fFZpNjB8VjgyMHd8VjcxMXxWODEzc3xWODAxfFY4MTl8Vjk3NXN8VjgwMXxWODE5fFY4MTl8VjgxOHxWODExfFY3MTJ8Vjk3NW18VjEwMXd8Vjk2MXd8VjgxMnxWODE4fFY5NzF8Vjk3MXN8VjkxOXxWOTg5fFYxMTZ3fFYxMDJ3fFY5NzN8Vmk0MClcXFxcYltcXFxcc10rXCIsSmF5dGVjaFRhYmxldDpcIlRQQy1QQTc2MlwiLEJsYXVwdW5rdFRhYmxldDpcIkVuZGVhdm91ciA4MDBOR3xFbmRlYXZvdXIgMTAxMFwiLERpZ21hVGFibGV0OlwiXFxcXGIoaUR4MTB8aUR4OXxpRHg4fGlEeDd8aUR4RDd8aUR4RDh8aURzUTh8aURzUTd8aURzUTh8aURzRDEwfGlEbkQ3fDNUUzgwNEh8aURzUTExfGlEajd8aURzMTApXFxcXGJcIixFdm9saW9UYWJsZXQ6XCJBUklBX01pbmlfd2lmaXxBcmlhWyBfXU1pbml8RXZvbGlvIFgxMHxFdm9saW8gWDd8RXZvbGlvIFg4fFxcXFxiRXZvdGFiXFxcXGJ8XFxcXGJOZXVyYVxcXFxiXCIsTGF2YVRhYmxldDpcIlFQQUQgRTcwNHxcXFxcYkl2b3J5U1xcXFxifEUtVEFCIElWT1JZfFxcXFxiRS1UQUJcXFxcYlwiLEFvY1RhYmxldDpcIk1XMDgxMXxNVzA4MTJ8TVcwOTIyfE1USzgzODJ8TVcxMDMxfE1XMDgzMXxNVzA4MjF8TVcwOTMxfE1XMDcxMlwiLE1wbWFuVGFibGV0OlwiTVAxMSBPQ1RBfE1QMTAgT0NUQXxNUFFDMTExNHxNUFFDMTAwNHxNUFFDOTk0fE1QUUM5NzR8TVBRQzk3M3xNUFFDODA0fE1QUUM3ODR8TVBRQzc4MHxcXFxcYk1QRzdcXFxcYnxNUERDRzc1fE1QRENHNzF8TVBEQzEwMDZ8TVAxMDFEQ3xNUERDOTAwMHxNUERDOTA1fE1QREM3MDZIRHxNUERDNzA2fE1QREM3MDV8TVBEQzExMHxNUERDMTAwfE1QREM5OXxNUERDOTd8TVBEQzg4fE1QREM4fE1QREM3N3xNUDcwOXxNSUQ3MDF8TUlENzExfE1JRDE3MHxNUERDNzAzfE1QUUMxMDEwXCIsQ2Vsa29uVGFibGV0OlwiQ1Q2OTV8Q1Q4ODh8Q1RbXFxcXHNdPzkxMHxDVDcgVGFifENUOSBUYWJ8Q1QzIFRhYnxDVDIgVGFifENUMSBUYWJ8QzgyMHxDNzIwfFxcXFxiQ1QtMVxcXFxiXCIsV29sZGVyVGFibGV0OlwibWlUYWIgXFxcXGIoRElBTU9ORHxTUEFDRXxCUk9PS0xZTnxORU98RkxZfE1BTkhBVFRBTnxGVU5LfEVWT0xVVElPTnxTS1l8R09DQVJ8SVJPTnxHRU5JVVN8UE9QfE1JTlR8RVBTSUxPTnxCUk9BRFdBWXxKVU1QfEhPUHxMRUdFTkR8TkVXIEFHRXxMSU5FfEFEVkFOQ0V8RkVFTHxGT0xMT1d8TElLRXxMSU5LfExJVkV8VEhJTkt8RlJFRURPTXxDSElDQUdPfENMRVZFTEFORHxCQUxUSU1PUkUtR0h8SU9XQXxCT1NUT058U0VBVFRMRXxQSE9FTklYfERBTExBU3xJTiAxMDF8TWFzdGVyQ2hlZilcXFxcYlwiLE1lZGlhY29tVGFibGV0OlwiTS1NUEkxMEMzR3xNLVNQMTBFR3xNLVNQMTBFR1B8TS1TUDEwSFhBSHxNLVNQN0hYQUh8TS1TUDEwSFhCSHxNLVNQOEhYQUh8TS1TUDhNWEFcIixNaVRhYmxldDpcIlxcXFxiTUkgUEFEXFxcXGJ8XFxcXGJITSBOT1RFIDFXXFxcXGJcIixOaWJpcnVUYWJsZXQ6XCJOaWJpcnUgTTF8TmliaXJ1IEp1cGl0ZXIgT25lXCIsTmV4b1RhYmxldDpcIk5FWE8gTk9WQXxORVhPIDEwfE5FWE8gQVZJT3xORVhPIEZSRUV8TkVYTyBHT3xORVhPIEVWT3xORVhPIDNHfE5FWE8gU01BUlR8TkVYTyBLSURET3xORVhPIE1PQklcIixMZWFkZXJUYWJsZXQ6XCJUQkxUMTBRfFRCTFQxMEl8VEJMLTEwV0RLQnxUQkwtMTBXREtCTzIwMTN8VEJMLVcyMzBWMnxUQkwtVzQ1MHxUQkwtVzUwMHxTVjU3MnxUQkxUN0l8VEJBLUFDNy04R3xUQkxUNzl8VEJMLThXMTZ8VEJMLTEwVzMyfFRCTC0xMFdLQnxUQkwtVzEwMFwiLFViaXNsYXRlVGFibGV0OlwiVWJpU2xhdGVbXFxcXHNdPzdDXCIsUG9ja2V0Qm9va1RhYmxldDpcIlBvY2tldGJvb2tcIixLb2Nhc29UYWJsZXQ6XCJcXFxcYihUQi0xMjA3KVxcXFxiXCIsSGlzZW5zZVRhYmxldDpcIlxcXFxiKEY1MjgxfEUyMzcxKVxcXFxiXCIsSHVkbDpcIkh1ZGwgSFQ3UzN8SHVkbCAyXCIsVGVsc3RyYVRhYmxldDpcIlQtSHViMlwiLEdlbmVyaWNUYWJsZXQ6XCJBbmRyb2lkLipcXFxcYjk3RFxcXFxifFRhYmxldCg/IS4qUEMpfEJOVFYyNTBBfE1JRC1XQ0RNQXxMb2dpY1BEIFpvb20yfFxcXFxiQTdFQlxcXFxifENhdE5vdmE4fEExXzA3fENUNzA0fENUMTAwMnxcXFxcYk03MjFcXFxcYnxyazMwc2RrfFxcXFxiRVZPVEFCXFxcXGJ8TTc1OEF8RVQ5MDR8QUxVTUlVTTEwfFNtYXJ0ZnJlbiBUYWJ8RW5kZWF2b3VyIDEwMTB8VGFibGV0LVBDLTR8VGFnaSBUYWJ8XFxcXGJNNnByb1xcXFxifENUMTAyMFd8YXJjIDEwSER8XFxcXGJUUDc1MFxcXFxifFxcXFxiUVRBUVozXFxcXGJ8V1ZUMTAxfFRNMTA4OHxLVDEwN1wifSxvc3M6e0FuZHJvaWRPUzpcIkFuZHJvaWRcIixCbGFja0JlcnJ5T1M6XCJibGFja2JlcnJ5fFxcXFxiQkIxMFxcXFxifHJpbSB0YWJsZXQgb3NcIixQYWxtT1M6XCJQYWxtT1N8YXZhbnRnb3xibGF6ZXJ8ZWxhaW5lfGhpcHRvcHxwYWxtfHBsdWNrZXJ8eGlpbm9cIixTeW1iaWFuT1M6XCJTeW1iaWFufFN5bWJPU3xTZXJpZXM2MHxTZXJpZXM0MHxTWUItWzAtOV0rfFxcXFxiUzYwXFxcXGJcIixXaW5kb3dzTW9iaWxlT1M6XCJXaW5kb3dzIENFLiooUFBDfFNtYXJ0cGhvbmV8TW9iaWxlfFswLTldezN9eFswLTldezN9KXxXaW5kb3cgTW9iaWxlfFdpbmRvd3MgUGhvbmUgWzAtOS5dK3xXQ0U7XCIsV2luZG93c1Bob25lT1M6XCJXaW5kb3dzIFBob25lIDEwLjB8V2luZG93cyBQaG9uZSA4LjF8V2luZG93cyBQaG9uZSA4LjB8V2luZG93cyBQaG9uZSBPU3xYQkxXUDd8WnVuZVdQN3xXaW5kb3dzIE5UIDYuWzIzXTsgQVJNO1wiLGlPUzpcIlxcXFxiaVBob25lLipNb2JpbGV8XFxcXGJpUG9kfFxcXFxiaVBhZHxBcHBsZUNvcmVNZWRpYVwiLE1lZUdvT1M6XCJNZWVHb1wiLE1hZW1vT1M6XCJNYWVtb1wiLEphdmFPUzpcIkoyTUUvfFxcXFxiTUlEUFxcXFxifFxcXFxiQ0xEQ1xcXFxiXCIsd2ViT1M6XCJ3ZWJPU3xocHdPU1wiLGJhZGFPUzpcIlxcXFxiQmFkYVxcXFxiXCIsQlJFV09TOlwiQlJFV1wifSx1YXM6e0Nocm9tZTpcIlxcXFxiQ3JNb1xcXFxifENyaU9TfEFuZHJvaWQuKkNocm9tZS9bLjAtOV0qIChNb2JpbGUpP1wiLERvbGZpbjpcIlxcXFxiRG9sZmluXFxcXGJcIixPcGVyYTpcIk9wZXJhLipNaW5pfE9wZXJhLipNb2JpfEFuZHJvaWQuKk9wZXJhfE1vYmlsZS4qT1BSL1swLTkuXSt8Q29hc3QvWzAtOS5dK1wiLFNreWZpcmU6XCJTa3lmaXJlXCIsRWRnZTpcIk1vYmlsZSBTYWZhcmkvWy4wLTldKiBFZGdlXCIsSUU6XCJJRU1vYmlsZXxNU0lFTW9iaWxlXCIsRmlyZWZveDpcImZlbm5lY3xmaXJlZm94LiptYWVtb3woTW9iaWxlfFRhYmxldCkuKkZpcmVmb3h8RmlyZWZveC4qTW9iaWxlfEZ4aU9TXCIsQm9sdDpcImJvbHRcIixUZWFTaGFyazpcInRlYXNoYXJrXCIsQmxhemVyOlwiQmxhemVyXCIsU2FmYXJpOlwiVmVyc2lvbi4qTW9iaWxlLipTYWZhcml8U2FmYXJpLipNb2JpbGV8TW9iaWxlU2FmYXJpXCIsVUNCcm93c2VyOlwiVUMuKkJyb3dzZXJ8VUNXRUJcIixiYWlkdWJveGFwcDpcImJhaWR1Ym94YXBwXCIsYmFpZHVicm93c2VyOlwiYmFpZHVicm93c2VyXCIsRGlpZ29Ccm93c2VyOlwiRGlpZ29Ccm93c2VyXCIsUHVmZmluOlwiUHVmZmluXCIsTWVyY3VyeTpcIlxcXFxiTWVyY3VyeVxcXFxiXCIsT2JpZ29Ccm93c2VyOlwiT2JpZ29cIixOZXRGcm9udDpcIk5GLUJyb3dzZXJcIixHZW5lcmljQnJvd3NlcjpcIk5va2lhQnJvd3NlcnxPdmlCcm93c2VyfE9uZUJyb3dzZXJ8VHdvbmt5QmVhbUJyb3dzZXJ8U0VNQy4qQnJvd3NlcnxGbHlGbG93fE1pbmltb3xOZXRGcm9udHxOb3ZhcnJhLVZpc2lvbnxNUVFCcm93c2VyfE1pY3JvTWVzc2VuZ2VyXCIsUGFsZU1vb246XCJBbmRyb2lkLipQYWxlTW9vbnxNb2JpbGUuKlBhbGVNb29uXCJ9LHByb3BzOntNb2JpbGU6XCJNb2JpbGUvW1ZFUl1cIixCdWlsZDpcIkJ1aWxkL1tWRVJdXCIsVmVyc2lvbjpcIlZlcnNpb24vW1ZFUl1cIixWZW5kb3JJRDpcIlZlbmRvcklEL1tWRVJdXCIsaVBhZDpcImlQYWQuKkNQVVthLXogXStbVkVSXVwiLGlQaG9uZTpcImlQaG9uZS4qQ1BVW2EteiBdK1tWRVJdXCIsaVBvZDpcImlQb2QuKkNQVVthLXogXStbVkVSXVwiLEtpbmRsZTpcIktpbmRsZS9bVkVSXVwiLENocm9tZTpbXCJDaHJvbWUvW1ZFUl1cIixcIkNyaU9TL1tWRVJdXCIsXCJDck1vL1tWRVJdXCJdLENvYXN0OltcIkNvYXN0L1tWRVJdXCJdLERvbGZpbjpcIkRvbGZpbi9bVkVSXVwiLEZpcmVmb3g6W1wiRmlyZWZveC9bVkVSXVwiLFwiRnhpT1MvW1ZFUl1cIl0sRmVubmVjOlwiRmVubmVjL1tWRVJdXCIsRWRnZTpcIkVkZ2UvW1ZFUl1cIixJRTpbXCJJRU1vYmlsZS9bVkVSXTtcIixcIklFTW9iaWxlIFtWRVJdXCIsXCJNU0lFIFtWRVJdO1wiLFwiVHJpZGVudC9bMC05Ll0rOy4qcnY6W1ZFUl1cIl0sTmV0RnJvbnQ6XCJOZXRGcm9udC9bVkVSXVwiLE5va2lhQnJvd3NlcjpcIk5va2lhQnJvd3Nlci9bVkVSXVwiLE9wZXJhOltcIiBPUFIvW1ZFUl1cIixcIk9wZXJhIE1pbmkvW1ZFUl1cIixcIlZlcnNpb24vW1ZFUl1cIl0sXCJPcGVyYSBNaW5pXCI6XCJPcGVyYSBNaW5pL1tWRVJdXCIsXCJPcGVyYSBNb2JpXCI6XCJWZXJzaW9uL1tWRVJdXCIsVUNCcm93c2VyOltcIlVDV0VCW1ZFUl1cIixcIlVDLipCcm93c2VyL1tWRVJdXCJdLE1RUUJyb3dzZXI6XCJNUVFCcm93c2VyL1tWRVJdXCIsTWljcm9NZXNzZW5nZXI6XCJNaWNyb01lc3Nlbmdlci9bVkVSXVwiLGJhaWR1Ym94YXBwOlwiYmFpZHVib3hhcHAvW1ZFUl1cIixiYWlkdWJyb3dzZXI6XCJiYWlkdWJyb3dzZXIvW1ZFUl1cIixTYW1zdW5nQnJvd3NlcjpcIlNhbXN1bmdCcm93c2VyL1tWRVJdXCIsSXJvbjpcIklyb24vW1ZFUl1cIixTYWZhcmk6W1wiVmVyc2lvbi9bVkVSXVwiLFwiU2FmYXJpL1tWRVJdXCJdLFNreWZpcmU6XCJTa3lmaXJlL1tWRVJdXCIsVGl6ZW46XCJUaXplbi9bVkVSXVwiLFdlYmtpdDpcIndlYmtpdFsgL11bVkVSXVwiLFBhbGVNb29uOlwiUGFsZU1vb24vW1ZFUl1cIixHZWNrbzpcIkdlY2tvL1tWRVJdXCIsVHJpZGVudDpcIlRyaWRlbnQvW1ZFUl1cIixQcmVzdG86XCJQcmVzdG8vW1ZFUl1cIixHb2FubmE6XCJHb2FubmEvW1ZFUl1cIixpT1M6XCIgXFxcXGJpP09TXFxcXGIgW1ZFUl1bIDtdezF9XCIsQW5kcm9pZDpcIkFuZHJvaWQgW1ZFUl1cIixCbGFja0JlcnJ5OltcIkJsYWNrQmVycnlbXFxcXHddKy9bVkVSXVwiLFwiQmxhY2tCZXJyeS4qVmVyc2lvbi9bVkVSXVwiLFwiVmVyc2lvbi9bVkVSXVwiXSxCUkVXOlwiQlJFVyBbVkVSXVwiLEphdmE6XCJKYXZhL1tWRVJdXCIsXCJXaW5kb3dzIFBob25lIE9TXCI6W1wiV2luZG93cyBQaG9uZSBPUyBbVkVSXVwiLFwiV2luZG93cyBQaG9uZSBbVkVSXVwiXSxcIldpbmRvd3MgUGhvbmVcIjpcIldpbmRvd3MgUGhvbmUgW1ZFUl1cIixcIldpbmRvd3MgQ0VcIjpcIldpbmRvd3MgQ0UvW1ZFUl1cIixcIldpbmRvd3MgTlRcIjpcIldpbmRvd3MgTlQgW1ZFUl1cIixTeW1iaWFuOltcIlN5bWJpYW5PUy9bVkVSXVwiLFwiU3ltYmlhbi9bVkVSXVwiXSx3ZWJPUzpbXCJ3ZWJPUy9bVkVSXVwiLFwiaHB3T1MvW1ZFUl07XCJdfSx1dGlsczp7Qm90OlwiR29vZ2xlYm90fGZhY2Vib29rZXh0ZXJuYWxoaXR8QWRzQm90LUdvb2dsZXxHb29nbGUgS2V5d29yZCBTdWdnZXN0aW9ufEZhY2Vib3R8WWFuZGV4Qm90fFlhbmRleE1vYmlsZUJvdHxiaW5nYm90fGlhX2FyY2hpdmVyfEFocmVmc0JvdHxFem9vbXN8R1NMRmJvdHxXQlNlYXJjaEJvdHxUd2l0dGVyYm90fFR3ZWV0bWVtZUJvdHxUd2lrbGV8UGFwZXJMaUJvdHxXb3Rib3h8VW53aW5kRmV0Y2hvcnxFeGFib3R8TUoxMmJvdHxZYW5kZXhJbWFnZXN8VHVybml0aW5Cb3R8UGluZ2RvbVwiLE1vYmlsZUJvdDpcIkdvb2dsZWJvdC1Nb2JpbGV8QWRzQm90LUdvb2dsZS1Nb2JpbGV8WWFob29TZWVrZXIvTTFBMS1SMkQyXCIsRGVza3RvcE1vZGU6XCJXUERlc2t0b3BcIixUVjpcIlNvbnlEVFZ8SGJiVFZcIixXZWJLaXQ6XCIod2Via2l0KVsgL10oW1xcXFx3Ll0rKVwiLENvbnNvbGU6XCJcXFxcYihOaW50ZW5kb3xOaW50ZW5kbyBXaWlVfE5pbnRlbmRvIDNEU3xOaW50ZW5kbyBTd2l0Y2h8UExBWVNUQVRJT058WGJveClcXFxcYlwiLFdhdGNoOlwiU00tVjcwMFwifX0sZGV0ZWN0TW9iaWxlQnJvd3NlcnM6e2Z1bGxQYXR0ZXJuOi8oYW5kcm9pZHxiYlxcZCt8bWVlZ28pLittb2JpbGV8YXZhbnRnb3xiYWRhXFwvfGJsYWNrYmVycnl8YmxhemVyfGNvbXBhbHxlbGFpbmV8ZmVubmVjfGhpcHRvcHxpZW1vYmlsZXxpcChob25lfG9kKXxpcmlzfGtpbmRsZXxsZ2UgfG1hZW1vfG1pZHB8bW1wfG1vYmlsZS4rZmlyZWZveHxuZXRmcm9udHxvcGVyYSBtKG9ifGluKWl8cGFsbSggb3MpP3xwaG9uZXxwKGl4aXxyZSlcXC98cGx1Y2tlcnxwb2NrZXR8cHNwfHNlcmllcyg0fDYpMHxzeW1iaWFufHRyZW98dXBcXC4oYnJvd3NlcnxsaW5rKXx2b2RhZm9uZXx3YXB8d2luZG93cyBjZXx4ZGF8eGlpbm8vaSxzaG9ydFBhdHRlcm46LzEyMDd8NjMxMHw2NTkwfDNnc298NHRocHw1MFsxLTZdaXw3NzBzfDgwMnN8YSB3YXxhYmFjfGFjKGVyfG9vfHNcXC0pfGFpKGtvfHJuKXxhbChhdnxjYXxjbyl8YW1vaXxhbihleHxueXx5dyl8YXB0dXxhcihjaHxnbyl8YXModGV8dXMpfGF0dHd8YXUoZGl8XFwtbXxyIHxzICl8YXZhbnxiZShja3xsbHxucSl8YmkobGJ8cmQpfGJsKGFjfGF6KXxicihlfHYpd3xidW1ifGJ3XFwtKG58dSl8YzU1XFwvfGNhcGl8Y2N3YXxjZG1cXC18Y2VsbHxjaHRtfGNsZGN8Y21kXFwtfGNvKG1wfG5kKXxjcmF3fGRhKGl0fGxsfG5nKXxkYnRlfGRjXFwtc3xkZXZpfGRpY2F8ZG1vYnxkbyhjfHApb3xkcygxMnxcXC1kKXxlbCg0OXxhaSl8ZW0obDJ8dWwpfGVyKGljfGswKXxlc2w4fGV6KFs0LTddMHxvc3x3YXx6ZSl8ZmV0Y3xmbHkoXFwtfF8pfGcxIHV8ZzU2MHxnZW5lfGdmXFwtNXxnXFwtbW98Z28oXFwud3xvZCl8Z3IoYWR8dW4pfGhhaWV8aGNpdHxoZFxcLShtfHB8dCl8aGVpXFwtfGhpKHB0fHRhKXxocCggaXxpcCl8aHNcXC1jfGh0KGMoXFwtfCB8X3xhfGd8cHxzfHQpfHRwKXxodShhd3x0Yyl8aVxcLSgyMHxnb3xtYSl8aTIzMHxpYWMoIHxcXC18XFwvKXxpYnJvfGlkZWF8aWcwMXxpa29tfGltMWt8aW5ub3xpcGFxfGlyaXN8amEodHx2KWF8amJyb3xqZW11fGppZ3N8a2RkaXxrZWppfGtndCggfFxcLyl8a2xvbnxrcHQgfGt3Y1xcLXxreW8oY3xrKXxsZShub3x4aSl8bGcoIGd8XFwvKGt8bHx1KXw1MHw1NHxcXC1bYS13XSl8bGlid3xseW54fG0xXFwtd3xtM2dhfG01MFxcL3xtYSh0ZXx1aXx4byl8bWMoMDF8MjF8Y2EpfG1cXC1jcnxtZShyY3xyaSl8bWkobzh8b2F8dHMpfG1tZWZ8bW8oMDF8MDJ8Yml8ZGV8ZG98dChcXC18IHxvfHYpfHp6KXxtdCg1MHxwMXx2ICl8bXdicHxteXdhfG4xMFswLTJdfG4yMFsyLTNdfG4zMCgwfDIpfG41MCgwfDJ8NSl8bjcoMCgwfDEpfDEwKXxuZSgoY3xtKVxcLXxvbnx0Znx3Znx3Z3x3dCl8bm9rKDZ8aSl8bnpwaHxvMmltfG9wKHRpfHd2KXxvcmFufG93ZzF8cDgwMHxwYW4oYXxkfHQpfHBkeGd8cGcoMTN8XFwtKFsxLThdfGMpKXxwaGlsfHBpcmV8cGwoYXl8dWMpfHBuXFwtMnxwbyhja3xydHxzZSl8cHJveHxwc2lvfHB0XFwtZ3xxYVxcLWF8cWMoMDd8MTJ8MjF8MzJ8NjB8XFwtWzItN118aVxcLSl8cXRla3xyMzgwfHI2MDB8cmFrc3xyaW05fHJvKHZlfHpvKXxzNTVcXC98c2EoZ2V8bWF8bW18bXN8bnl8dmEpfHNjKDAxfGhcXC18b298cFxcLSl8c2RrXFwvfHNlKGMoXFwtfDB8MSl8NDd8bWN8bmR8cmkpfHNnaFxcLXxzaGFyfHNpZShcXC18bSl8c2tcXC0wfHNsKDQ1fGlkKXxzbShhbHxhcnxiM3xpdHx0NSl8c28oZnR8bnkpfHNwKDAxfGhcXC18dlxcLXx2ICl8c3koMDF8bWIpfHQyKDE4fDUwKXx0NigwMHwxMHwxOCl8dGEoZ3R8bGspfHRjbFxcLXx0ZGdcXC18dGVsKGl8bSl8dGltXFwtfHRcXC1tb3x0byhwbHxzaCl8dHMoNzB8bVxcLXxtM3xtNSl8dHhcXC05fHVwKFxcLmJ8ZzF8c2kpfHV0c3R8djQwMHx2NzUwfHZlcml8dmkocmd8dGUpfHZrKDQwfDVbMC0zXXxcXC12KXx2bTQwfHZvZGF8dnVsY3x2eCg1Mnw1M3w2MHw2MXw3MHw4MHw4MXw4M3w4NXw5OCl8dzNjKFxcLXwgKXx3ZWJjfHdoaXR8d2koZyB8bmN8bncpfHdtbGJ8d29udXx4NzAwfHlhc1xcLXx5b3VyfHpldG98enRlXFwtL2ksdGFibGV0UGF0dGVybjovYW5kcm9pZHxpcGFkfHBsYXlib29rfHNpbGsvaX19LHQsdT1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O3JldHVybiBzLkZBTExCQUNLX1BIT05FPVwiVW5rbm93blBob25lXCIscy5GQUxMQkFDS19UQUJMRVQ9XCJVbmtub3duVGFibGV0XCIscy5GQUxMQkFDS19NT0JJTEU9XCJVbmtub3duTW9iaWxlXCIsdD1cImlzQXJyYXlcImluIEFycmF5P0FycmF5LmlzQXJyYXk6ZnVuY3Rpb24odil7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHYpfSxmdW5jdGlvbigpe3ZhciB2LHcseCx5LHosQSxCPXMubW9iaWxlRGV0ZWN0UnVsZXM7Zm9yKHYgaW4gQi5wcm9wcylpZih1LmNhbGwoQi5wcm9wcyx2KSl7Zm9yKHc9Qi5wcm9wc1t2XSx0KHcpfHwodz1bd10pLHo9dy5sZW5ndGgseT0wO3k8ejsrK3kpeD13W3ldLEE9eC5pbmRleE9mKFwiW1ZFUl1cIiksMDw9QSYmKHg9eC5zdWJzdHJpbmcoMCxBKStcIihbXFxcXHcuX1xcXFwrXSspXCIreC5zdWJzdHJpbmcoQSs1KSksd1t5XT1uZXcgUmVnRXhwKHgsXCJpXCIpO0IucHJvcHNbdl09d31wKEIub3NzKSxwKEIucGhvbmVzKSxwKEIudGFibGV0cykscChCLnVhcykscChCLnV0aWxzKSxCLm9zczA9e1dpbmRvd3NQaG9uZU9TOkIub3NzLldpbmRvd3NQaG9uZU9TLFdpbmRvd3NNb2JpbGVPUzpCLm9zcy5XaW5kb3dzTW9iaWxlT1N9fSgpLHMuZmluZE1hdGNoPWZ1bmN0aW9uKHYsdyl7Zm9yKHZhciB4IGluIHYpaWYodS5jYWxsKHYseCkmJnZbeF0udGVzdCh3KSlyZXR1cm4geDtyZXR1cm4gbnVsbH0scy5maW5kTWF0Y2hlcz1mdW5jdGlvbih2LHcpe3ZhciB4PVtdO2Zvcih2YXIgeSBpbiB2KXUuY2FsbCh2LHkpJiZ2W3ldLnRlc3QodykmJngucHVzaCh5KTtyZXR1cm4geH0scy5nZXRWZXJzaW9uU3RyPWZ1bmN0aW9uKHYsdyl7dmFyIHgseSx6LEEsQj1zLm1vYmlsZURldGVjdFJ1bGVzLnByb3BzO2lmKHUuY2FsbChCLHYpKWZvcih4PUJbdl0sej14Lmxlbmd0aCx5PTA7eTx6OysreSlpZihBPXhbeV0uZXhlYyh3KSxudWxsIT09QSlyZXR1cm4gQVsxXTtyZXR1cm4gbnVsbH0scy5nZXRWZXJzaW9uPWZ1bmN0aW9uKHYsdyl7dmFyIHg9cy5nZXRWZXJzaW9uU3RyKHYsdyk7cmV0dXJuIHg/cy5wcmVwYXJlVmVyc2lvbk5vKHgpOk5hTn0scy5wcmVwYXJlVmVyc2lvbk5vPWZ1bmN0aW9uKHYpe3ZhciB3O3JldHVybiB3PXYuc3BsaXQoL1thLXouXyBcXC9cXC1dL2kpLDE9PT13Lmxlbmd0aCYmKHY9d1swXSksMTx3Lmxlbmd0aCYmKHY9d1swXStcIi5cIix3LnNoaWZ0KCksdis9dy5qb2luKFwiXCIpKSwrdn0scy5pc01vYmlsZUZhbGxiYWNrPWZ1bmN0aW9uKHYpe3JldHVybiBzLmRldGVjdE1vYmlsZUJyb3dzZXJzLmZ1bGxQYXR0ZXJuLnRlc3Qodil8fHMuZGV0ZWN0TW9iaWxlQnJvd3NlcnMuc2hvcnRQYXR0ZXJuLnRlc3Qodi5zdWJzdHIoMCw0KSl9LHMuaXNUYWJsZXRGYWxsYmFjaz1mdW5jdGlvbih2KXtyZXR1cm4gcy5kZXRlY3RNb2JpbGVCcm93c2Vycy50YWJsZXRQYXR0ZXJuLnRlc3Qodil9LHMucHJlcGFyZURldGVjdGlvbkNhY2hlPWZ1bmN0aW9uKHYsdyx4KXtpZih2Lm1vYmlsZT09PW0pe3ZhciB5LHosQTtyZXR1cm4oej1zLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLnRhYmxldHMsdykpPyh2Lm1vYmlsZT12LnRhYmxldD16LHZvaWQodi5waG9uZT1udWxsKSk6KHk9cy5maW5kTWF0Y2gocy5tb2JpbGVEZXRlY3RSdWxlcy5waG9uZXMsdykpPyh2Lm1vYmlsZT12LnBob25lPXksdm9pZCh2LnRhYmxldD1udWxsKSk6dm9pZChzLmlzTW9iaWxlRmFsbGJhY2sodyk/KEE9ci5pc1Bob25lU2l6ZWQoeCksQT09PW0/KHYubW9iaWxlPXMuRkFMTEJBQ0tfTU9CSUxFLHYudGFibGV0PXYucGhvbmU9bnVsbCk6QT8odi5tb2JpbGU9di5waG9uZT1zLkZBTExCQUNLX1BIT05FLHYudGFibGV0PW51bGwpOih2Lm1vYmlsZT12LnRhYmxldD1zLkZBTExCQUNLX1RBQkxFVCx2LnBob25lPW51bGwpKTpzLmlzVGFibGV0RmFsbGJhY2sodyk/KHYubW9iaWxlPXYudGFibGV0PXMuRkFMTEJBQ0tfVEFCTEVULHYucGhvbmU9bnVsbCk6di5tb2JpbGU9di50YWJsZXQ9di5waG9uZT1udWxsKX19LHMubW9iaWxlR3JhZGU9ZnVuY3Rpb24odil7dmFyIHc9bnVsbCE9PXYubW9iaWxlKCk7cmV0dXJuIHYub3MoXCJpT1NcIikmJjQuMzw9di52ZXJzaW9uKFwiaVBhZFwiKXx8di5vcyhcImlPU1wiKSYmMy4xPD12LnZlcnNpb24oXCJpUGhvbmVcIil8fHYub3MoXCJpT1NcIikmJjMuMTw9di52ZXJzaW9uKFwiaVBvZFwiKXx8Mi4xPHYudmVyc2lvbihcIkFuZHJvaWRcIikmJnYuaXMoXCJXZWJraXRcIil8fDc8PXYudmVyc2lvbihcIldpbmRvd3MgUGhvbmUgT1NcIil8fHYuaXMoXCJCbGFja0JlcnJ5XCIpJiY2PD12LnZlcnNpb24oXCJCbGFja0JlcnJ5XCIpfHx2Lm1hdGNoKFwiUGxheWJvb2suKlRhYmxldFwiKXx8MS40PD12LnZlcnNpb24oXCJ3ZWJPU1wiKSYmdi5tYXRjaChcIlBhbG18UHJlfFBpeGlcIil8fHYubWF0Y2goXCJocC4qVG91Y2hQYWRcIil8fHYuaXMoXCJGaXJlZm94XCIpJiYxMjw9di52ZXJzaW9uKFwiRmlyZWZveFwiKXx8di5pcyhcIkNocm9tZVwiKSYmdi5pcyhcIkFuZHJvaWRPU1wiKSYmNDw9di52ZXJzaW9uKFwiQW5kcm9pZFwiKXx8di5pcyhcIlNreWZpcmVcIikmJjQuMTw9di52ZXJzaW9uKFwiU2t5ZmlyZVwiKSYmdi5pcyhcIkFuZHJvaWRPU1wiKSYmMi4zPD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2LmlzKFwiT3BlcmFcIikmJjExPHYudmVyc2lvbihcIk9wZXJhIE1vYmlcIikmJnYuaXMoXCJBbmRyb2lkT1NcIil8fHYuaXMoXCJNZWVHb09TXCIpfHx2LmlzKFwiVGl6ZW5cIil8fHYuaXMoXCJEb2xmaW5cIikmJjI8PXYudmVyc2lvbihcIkJhZGFcIil8fCh2LmlzKFwiVUMgQnJvd3NlclwiKXx8di5pcyhcIkRvbGZpblwiKSkmJjIuMzw9di52ZXJzaW9uKFwiQW5kcm9pZFwiKXx8di5tYXRjaChcIktpbmRsZSBGaXJlXCIpfHx2LmlzKFwiS2luZGxlXCIpJiYzPD12LnZlcnNpb24oXCJLaW5kbGVcIil8fHYuaXMoXCJBbmRyb2lkT1NcIikmJnYuaXMoXCJOb29rVGFibGV0XCIpfHwxMTw9di52ZXJzaW9uKFwiQ2hyb21lXCIpJiYhd3x8NTw9di52ZXJzaW9uKFwiU2FmYXJpXCIpJiYhd3x8NDw9di52ZXJzaW9uKFwiRmlyZWZveFwiKSYmIXd8fDc8PXYudmVyc2lvbihcIk1TSUVcIikmJiF3fHwxMDw9di52ZXJzaW9uKFwiT3BlcmFcIikmJiF3P1wiQVwiOnYub3MoXCJpT1NcIikmJjQuMz52LnZlcnNpb24oXCJpUGFkXCIpfHx2Lm9zKFwiaU9TXCIpJiYzLjE+di52ZXJzaW9uKFwiaVBob25lXCIpfHx2Lm9zKFwiaU9TXCIpJiYzLjE+di52ZXJzaW9uKFwiaVBvZFwiKXx8di5pcyhcIkJsYWNrYmVycnlcIikmJjU8PXYudmVyc2lvbihcIkJsYWNrQmVycnlcIikmJjY+di52ZXJzaW9uKFwiQmxhY2tCZXJyeVwiKXx8NTw9di52ZXJzaW9uKFwiT3BlcmEgTWluaVwiKSYmNi41Pj12LnZlcnNpb24oXCJPcGVyYSBNaW5pXCIpJiYoMi4zPD12LnZlcnNpb24oXCJBbmRyb2lkXCIpfHx2LmlzKFwiaU9TXCIpKXx8di5tYXRjaChcIk5va2lhTjh8Tm9raWFDN3xOOTcuKlNlcmllczYwfFN5bWJpYW4vM1wiKXx8MTE8PXYudmVyc2lvbihcIk9wZXJhIE1vYmlcIikmJnYuaXMoXCJTeW1iaWFuT1NcIik/XCJCXCI6KDU+di52ZXJzaW9uKFwiQmxhY2tCZXJyeVwiKXx8di5tYXRjaChcIk1TSUVNb2JpbGV8V2luZG93cyBDRS4qTW9iaWxlXCIpfHw1LjI+PXYudmVyc2lvbihcIldpbmRvd3MgTW9iaWxlXCIpLFwiQ1wiKX0scy5kZXRlY3RPUz1mdW5jdGlvbih2KXtyZXR1cm4gcy5maW5kTWF0Y2gocy5tb2JpbGVEZXRlY3RSdWxlcy5vc3MwLHYpfHxzLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLm9zcyx2KX0scy5nZXREZXZpY2VTbWFsbGVyU2lkZT1mdW5jdGlvbigpe3JldHVybiB3aW5kb3cuc2NyZWVuLndpZHRoPHdpbmRvdy5zY3JlZW4uaGVpZ2h0P3dpbmRvdy5zY3JlZW4ud2lkdGg6d2luZG93LnNjcmVlbi5oZWlnaHR9LHIucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjpyLG1vYmlsZTpmdW5jdGlvbiBtb2JpbGUoKXtyZXR1cm4gcy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGUodGhpcy5fY2FjaGUsdGhpcy51YSx0aGlzLm1heFBob25lV2lkdGgpLHRoaXMuX2NhY2hlLm1vYmlsZX0scGhvbmU6ZnVuY3Rpb24gcGhvbmUoKXtyZXR1cm4gcy5wcmVwYXJlRGV0ZWN0aW9uQ2FjaGUodGhpcy5fY2FjaGUsdGhpcy51YSx0aGlzLm1heFBob25lV2lkdGgpLHRoaXMuX2NhY2hlLnBob25lfSx0YWJsZXQ6ZnVuY3Rpb24gdGFibGV0KCl7cmV0dXJuIHMucHJlcGFyZURldGVjdGlvbkNhY2hlKHRoaXMuX2NhY2hlLHRoaXMudWEsdGhpcy5tYXhQaG9uZVdpZHRoKSx0aGlzLl9jYWNoZS50YWJsZXR9LHVzZXJBZ2VudDpmdW5jdGlvbiB1c2VyQWdlbnQoKXtyZXR1cm4gdGhpcy5fY2FjaGUudXNlckFnZW50PT09bSYmKHRoaXMuX2NhY2hlLnVzZXJBZ2VudD1zLmZpbmRNYXRjaChzLm1vYmlsZURldGVjdFJ1bGVzLnVhcyx0aGlzLnVhKSksdGhpcy5fY2FjaGUudXNlckFnZW50fSx1c2VyQWdlbnRzOmZ1bmN0aW9uIHVzZXJBZ2VudHMoKXtyZXR1cm4gdGhpcy5fY2FjaGUudXNlckFnZW50cz09PW0mJih0aGlzLl9jYWNoZS51c2VyQWdlbnRzPXMuZmluZE1hdGNoZXMocy5tb2JpbGVEZXRlY3RSdWxlcy51YXMsdGhpcy51YSkpLHRoaXMuX2NhY2hlLnVzZXJBZ2VudHN9LG9zOmZ1bmN0aW9uIG9zKCl7cmV0dXJuIHRoaXMuX2NhY2hlLm9zPT09bSYmKHRoaXMuX2NhY2hlLm9zPXMuZGV0ZWN0T1ModGhpcy51YSkpLHRoaXMuX2NhY2hlLm9zfSx2ZXJzaW9uOmZ1bmN0aW9uIHZlcnNpb24odil7cmV0dXJuIHMuZ2V0VmVyc2lvbih2LHRoaXMudWEpfSx2ZXJzaW9uU3RyOmZ1bmN0aW9uIHZlcnNpb25TdHIodil7cmV0dXJuIHMuZ2V0VmVyc2lvblN0cih2LHRoaXMudWEpfSxpczpmdW5jdGlvbiBpcyh2KXtyZXR1cm4gbyh0aGlzLnVzZXJBZ2VudHMoKSx2KXx8bih2LHRoaXMub3MoKSl8fG4odix0aGlzLnBob25lKCkpfHxuKHYsdGhpcy50YWJsZXQoKSl8fG8ocy5maW5kTWF0Y2hlcyhzLm1vYmlsZURldGVjdFJ1bGVzLnV0aWxzLHRoaXMudWEpLHYpfSxtYXRjaDpmdW5jdGlvbiBtYXRjaCh2KXtyZXR1cm4gdiBpbnN0YW5jZW9mIFJlZ0V4cHx8KHY9bmV3IFJlZ0V4cCh2LFwiaVwiKSksdi50ZXN0KHRoaXMudWEpfSxpc1Bob25lU2l6ZWQ6ZnVuY3Rpb24gaXNQaG9uZVNpemVkKHYpe3JldHVybiByLmlzUGhvbmVTaXplZCh2fHx0aGlzLm1heFBob25lV2lkdGgpfSxtb2JpbGVHcmFkZTpmdW5jdGlvbiBtb2JpbGVHcmFkZSgpe3JldHVybiB0aGlzLl9jYWNoZS5ncmFkZT09PW0mJih0aGlzLl9jYWNoZS5ncmFkZT1zLm1vYmlsZUdyYWRlKHRoaXMpKSx0aGlzLl9jYWNoZS5ncmFkZX19LHIuaXNQaG9uZVNpemVkPVwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cmJndpbmRvdy5zY3JlZW4/ZnVuY3Rpb24odil7cmV0dXJuIDA+dj9tOnMuZ2V0RGV2aWNlU21hbGxlclNpZGUoKTw9dn06ZnVuY3Rpb24oKXt9LHIuX2ltcGw9cyxyLnZlcnNpb249XCIxLjQuMiAyMDE4LTA2LTEwXCIscn0pfShmdW5jdGlvbigpe2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUmJm1vZHVsZS5leHBvcnRzKXJldHVybiBmdW5jdGlvbihtKXttb2R1bGUuZXhwb3J0cz1tKCl9O2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClyZXR1cm4gZGVmaW5lO2lmKFwidW5kZWZpbmVkXCIhPXR5cGVvZiB3aW5kb3cpcmV0dXJuIGZ1bmN0aW9uKG0pe3dpbmRvdy5Nb2JpbGVEZXRlY3Q9bSgpfTt0aHJvdyBuZXcgRXJyb3IoXCJ1bmtub3duIGVudmlyb25tZW50XCIpfSgpKTsiLCIvKiFcclxuICogdnVlLWkxOG4gdjguMS4wIFxyXG4gKiAoYykgMjAxOCBrYXp1eWEga2F3YWd1Y2hpXHJcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZS5cclxuICovXHJcbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XHJcbiAgdHlwZW9mIGV4cG9ydHMgPT09ICdvYmplY3QnICYmIHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnID8gbW9kdWxlLmV4cG9ydHMgPSBmYWN0b3J5KCkgOlxyXG4gIHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCA/IGRlZmluZShmYWN0b3J5KSA6XHJcbiAgKGdsb2JhbC5WdWVJMThuID0gZmFjdG9yeSgpKTtcclxufSh0aGlzLCAoZnVuY3Rpb24gKCkgeyAndXNlIHN0cmljdCc7XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICAvKipcclxuICAgKiB1dGlsaXRlc1xyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiB3YXJuIChtc2csIGVycikge1xyXG4gICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ1t2dWUtaTE4bl0gJyArIG1zZyk7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoZXJyKSB7XHJcbiAgICAgICAgY29uc29sZS53YXJuKGVyci5zdGFjayk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlzT2JqZWN0IChvYmopIHtcclxuICAgIHJldHVybiBvYmogIT09IG51bGwgJiYgdHlwZW9mIG9iaiA9PT0gJ29iamVjdCdcclxuICB9XHJcblxyXG4gIHZhciB0b1N0cmluZyA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmc7XHJcbiAgdmFyIE9CSkVDVF9TVFJJTkcgPSAnW29iamVjdCBPYmplY3RdJztcclxuICBmdW5jdGlvbiBpc1BsYWluT2JqZWN0IChvYmopIHtcclxuICAgIHJldHVybiB0b1N0cmluZy5jYWxsKG9iaikgPT09IE9CSkVDVF9TVFJJTkdcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGlzTnVsbCAodmFsKSB7XHJcbiAgICByZXR1cm4gdmFsID09PSBudWxsIHx8IHZhbCA9PT0gdW5kZWZpbmVkXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZUFyZ3MgKCkge1xyXG4gICAgdmFyIGFyZ3MgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aDtcclxuICAgIHdoaWxlICggbGVuLS0gKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuIF07XHJcblxyXG4gICAgdmFyIGxvY2FsZSA9IG51bGw7XHJcbiAgICB2YXIgcGFyYW1zID0gbnVsbDtcclxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICBpZiAoaXNPYmplY3QoYXJnc1swXSkgfHwgQXJyYXkuaXNBcnJheShhcmdzWzBdKSkge1xyXG4gICAgICAgIHBhcmFtcyA9IGFyZ3NbMF07XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgbG9jYWxlID0gYXJnc1swXTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgbG9jYWxlID0gYXJnc1swXTtcclxuICAgICAgfVxyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgICAgaWYgKGlzT2JqZWN0KGFyZ3NbMV0pIHx8IEFycmF5LmlzQXJyYXkoYXJnc1sxXSkpIHtcclxuICAgICAgICBwYXJhbXMgPSBhcmdzWzFdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHsgbG9jYWxlOiBsb2NhbGUsIHBhcmFtczogcGFyYW1zIH1cclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldE9sZENob2ljZUluZGV4Rml4ZWQgKGNob2ljZSkge1xyXG4gICAgcmV0dXJuIGNob2ljZVxyXG4gICAgICA/IGNob2ljZSA+IDFcclxuICAgICAgICA/IDFcclxuICAgICAgICA6IDBcclxuICAgICAgOiAxXHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBnZXRDaG9pY2VJbmRleCAoY2hvaWNlLCBjaG9pY2VzTGVuZ3RoKSB7XHJcbiAgICBjaG9pY2UgPSBNYXRoLmFicyhjaG9pY2UpO1xyXG5cclxuICAgIGlmIChjaG9pY2VzTGVuZ3RoID09PSAyKSB7IHJldHVybiBnZXRPbGRDaG9pY2VJbmRleEZpeGVkKGNob2ljZSkgfVxyXG5cclxuICAgIHJldHVybiBjaG9pY2UgPyBNYXRoLm1pbihjaG9pY2UsIDIpIDogMFxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZmV0Y2hDaG9pY2UgKG1lc3NhZ2UsIGNob2ljZSkge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoIW1lc3NhZ2UgJiYgdHlwZW9mIG1lc3NhZ2UgIT09ICdzdHJpbmcnKSB7IHJldHVybiBudWxsIH1cclxuICAgIHZhciBjaG9pY2VzID0gbWVzc2FnZS5zcGxpdCgnfCcpO1xyXG5cclxuICAgIGNob2ljZSA9IGdldENob2ljZUluZGV4KGNob2ljZSwgY2hvaWNlcy5sZW5ndGgpO1xyXG4gICAgaWYgKCFjaG9pY2VzW2Nob2ljZV0pIHsgcmV0dXJuIG1lc3NhZ2UgfVxyXG4gICAgcmV0dXJuIGNob2ljZXNbY2hvaWNlXS50cmltKClcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGxvb3NlQ2xvbmUgKG9iaikge1xyXG4gICAgcmV0dXJuIEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkob2JqKSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHJlbW92ZSAoYXJyLCBpdGVtKSB7XHJcbiAgICBpZiAoYXJyLmxlbmd0aCkge1xyXG4gICAgICB2YXIgaW5kZXggPSBhcnIuaW5kZXhPZihpdGVtKTtcclxuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICByZXR1cm4gYXJyLnNwbGljZShpbmRleCwgMSlcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIGhhc093blByb3BlcnR5ID0gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eTtcclxuICBmdW5jdGlvbiBoYXNPd24gKG9iaiwga2V5KSB7XHJcbiAgICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChvYmosIGtleSlcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIG1lcmdlICh0YXJnZXQpIHtcclxuICAgIHZhciBhcmd1bWVudHMkMSA9IGFyZ3VtZW50cztcclxuXHJcbiAgICB2YXIgb3V0cHV0ID0gT2JqZWN0KHRhcmdldCk7XHJcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzJDFbaV07XHJcbiAgICAgIGlmIChzb3VyY2UgIT09IHVuZGVmaW5lZCAmJiBzb3VyY2UgIT09IG51bGwpIHtcclxuICAgICAgICB2YXIga2V5ID0gKHZvaWQgMCk7XHJcbiAgICAgICAgZm9yIChrZXkgaW4gc291cmNlKSB7XHJcbiAgICAgICAgICBpZiAoaGFzT3duKHNvdXJjZSwga2V5KSkge1xyXG4gICAgICAgICAgICBpZiAoaXNPYmplY3Qoc291cmNlW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgb3V0cHV0W2tleV0gPSBtZXJnZShvdXRwdXRba2V5XSwgc291cmNlW2tleV0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgIG91dHB1dFtrZXldID0gc291cmNlW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBvdXRwdXRcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGxvb3NlRXF1YWwgKGEsIGIpIHtcclxuICAgIGlmIChhID09PSBiKSB7IHJldHVybiB0cnVlIH1cclxuICAgIHZhciBpc09iamVjdEEgPSBpc09iamVjdChhKTtcclxuICAgIHZhciBpc09iamVjdEIgPSBpc09iamVjdChiKTtcclxuICAgIGlmIChpc09iamVjdEEgJiYgaXNPYmplY3RCKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIGlzQXJyYXlBID0gQXJyYXkuaXNBcnJheShhKTtcclxuICAgICAgICB2YXIgaXNBcnJheUIgPSBBcnJheS5pc0FycmF5KGIpO1xyXG4gICAgICAgIGlmIChpc0FycmF5QSAmJiBpc0FycmF5Qikge1xyXG4gICAgICAgICAgcmV0dXJuIGEubGVuZ3RoID09PSBiLmxlbmd0aCAmJiBhLmV2ZXJ5KGZ1bmN0aW9uIChlLCBpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb29zZUVxdWFsKGUsIGJbaV0pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0gZWxzZSBpZiAoIWlzQXJyYXlBICYmICFpc0FycmF5Qikge1xyXG4gICAgICAgICAgdmFyIGtleXNBID0gT2JqZWN0LmtleXMoYSk7XHJcbiAgICAgICAgICB2YXIga2V5c0IgPSBPYmplY3Qua2V5cyhiKTtcclxuICAgICAgICAgIHJldHVybiBrZXlzQS5sZW5ndGggPT09IGtleXNCLmxlbmd0aCAmJiBrZXlzQS5ldmVyeShmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgICAgICAgIHJldHVybiBsb29zZUVxdWFsKGFba2V5XSwgYltrZXldKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cclxuICAgICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICAgIH1cclxuICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXHJcbiAgICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAoIWlzT2JqZWN0QSAmJiAhaXNPYmplY3RCKSB7XHJcbiAgICAgIHJldHVybiBTdHJpbmcoYSkgPT09IFN0cmluZyhiKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICB2YXIgY2FuVXNlRGF0ZVRpbWVGb3JtYXQgPVxyXG4gICAgdHlwZW9mIEludGwgIT09ICd1bmRlZmluZWQnICYmIHR5cGVvZiBJbnRsLkRhdGVUaW1lRm9ybWF0ICE9PSAndW5kZWZpbmVkJztcclxuXHJcbiAgdmFyIGNhblVzZU51bWJlckZvcm1hdCA9XHJcbiAgICB0eXBlb2YgSW50bCAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIEludGwuTnVtYmVyRm9ybWF0ICE9PSAndW5kZWZpbmVkJztcclxuXHJcbiAgLyogICovXHJcblxyXG4gIGZ1bmN0aW9uIGV4dGVuZCAoVnVlKSB7XHJcbiAgICAvLyAkRmxvd0ZpeE1lXHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVnVlLnByb3RvdHlwZSwgJyRpMThuJywge1xyXG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCAoKSB7IHJldHVybiB0aGlzLl9pMThuIH1cclxuICAgIH0pO1xyXG5cclxuICAgIFZ1ZS5wcm90b3R5cGUuJHQgPSBmdW5jdGlvbiAoa2V5KSB7XHJcbiAgICAgIHZhciB2YWx1ZXMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDE7XHJcbiAgICAgIHdoaWxlICggbGVuLS0gPiAwICkgdmFsdWVzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xyXG5cclxuICAgICAgdmFyIGkxOG4gPSB0aGlzLiRpMThuO1xyXG4gICAgICByZXR1cm4gaTE4bi5fdC5hcHBseShpMThuLCBbIGtleSwgaTE4bi5sb2NhbGUsIGkxOG4uX2dldE1lc3NhZ2VzKCksIHRoaXMgXS5jb25jYXQoIHZhbHVlcyApKVxyXG4gICAgfTtcclxuXHJcbiAgICBWdWUucHJvdG90eXBlLiR0YyA9IGZ1bmN0aW9uIChrZXksIGNob2ljZSkge1xyXG4gICAgICB2YXIgdmFsdWVzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAyO1xyXG4gICAgICB3aGlsZSAoIGxlbi0tID4gMCApIHZhbHVlc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDIgXTtcclxuXHJcbiAgICAgIHZhciBpMThuID0gdGhpcy4kaTE4bjtcclxuICAgICAgcmV0dXJuIGkxOG4uX3RjLmFwcGx5KGkxOG4sIFsga2V5LCBpMThuLmxvY2FsZSwgaTE4bi5fZ2V0TWVzc2FnZXMoKSwgdGhpcywgY2hvaWNlIF0uY29uY2F0KCB2YWx1ZXMgKSlcclxuICAgIH07XHJcblxyXG4gICAgVnVlLnByb3RvdHlwZS4kdGUgPSBmdW5jdGlvbiAoa2V5LCBsb2NhbGUpIHtcclxuICAgICAgdmFyIGkxOG4gPSB0aGlzLiRpMThuO1xyXG4gICAgICByZXR1cm4gaTE4bi5fdGUoa2V5LCBpMThuLmxvY2FsZSwgaTE4bi5fZ2V0TWVzc2FnZXMoKSwgbG9jYWxlKVxyXG4gICAgfTtcclxuXHJcbiAgICBWdWUucHJvdG90eXBlLiRkID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgIHZhciByZWY7XHJcblxyXG4gICAgICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcclxuICAgICAgd2hpbGUgKCBsZW4tLSA+IDAgKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xyXG4gICAgICByZXR1cm4gKHJlZiA9IHRoaXMuJGkxOG4pLmQuYXBwbHkocmVmLCBbIHZhbHVlIF0uY29uY2F0KCBhcmdzICkpXHJcbiAgICB9O1xyXG5cclxuICAgIFZ1ZS5wcm90b3R5cGUuJG4gPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgdmFyIHJlZjtcclxuXHJcbiAgICAgIHZhciBhcmdzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgICB3aGlsZSAoIGxlbi0tID4gMCApIGFyZ3NbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAxIF07XHJcbiAgICAgIHJldHVybiAocmVmID0gdGhpcy4kaTE4bikubi5hcHBseShyZWYsIFsgdmFsdWUgXS5jb25jYXQoIGFyZ3MgKSlcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgdmFyIG1peGluID0ge1xyXG4gICAgYmVmb3JlQ3JlYXRlOiBmdW5jdGlvbiBiZWZvcmVDcmVhdGUgKCkge1xyXG4gICAgICB2YXIgb3B0aW9ucyA9IHRoaXMuJG9wdGlvbnM7XHJcbiAgICAgIG9wdGlvbnMuaTE4biA9IG9wdGlvbnMuaTE4biB8fCAob3B0aW9ucy5fX2kxOG4gPyB7fSA6IG51bGwpO1xyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuaTE4bikge1xyXG4gICAgICAgIGlmIChvcHRpb25zLmkxOG4gaW5zdGFuY2VvZiBWdWVJMThuKSB7XHJcbiAgICAgICAgICAvLyBpbml0IGxvY2FsZSBtZXNzYWdlcyB2aWEgY3VzdG9tIGJsb2Nrc1xyXG4gICAgICAgICAgaWYgKG9wdGlvbnMuX19pMThuKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgdmFyIGxvY2FsZU1lc3NhZ2VzID0ge307XHJcbiAgICAgICAgICAgICAgb3B0aW9ucy5fX2kxOG4uZm9yRWFjaChmdW5jdGlvbiAocmVzb3VyY2UpIHtcclxuICAgICAgICAgICAgICAgIGxvY2FsZU1lc3NhZ2VzID0gbWVyZ2UobG9jYWxlTWVzc2FnZXMsIEpTT04ucGFyc2UocmVzb3VyY2UpKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICBPYmplY3Qua2V5cyhsb2NhbGVNZXNzYWdlcykuZm9yRWFjaChmdW5jdGlvbiAobG9jYWxlKSB7XHJcbiAgICAgICAgICAgICAgICBvcHRpb25zLmkxOG4ubWVyZ2VMb2NhbGVNZXNzYWdlKGxvY2FsZSwgbG9jYWxlTWVzc2FnZXNbbG9jYWxlXSk7XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3YXJuKFwiQ2Fubm90IHBhcnNlIGxvY2FsZSBtZXNzYWdlcyB2aWEgY3VzdG9tIGJsb2Nrcy5cIiwgZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICB0aGlzLl9pMThuID0gb3B0aW9ucy5pMThuO1xyXG4gICAgICAgICAgdGhpcy5faTE4bldhdGNoZXIgPSB0aGlzLl9pMThuLndhdGNoSTE4bkRhdGEoKTtcclxuICAgICAgICAgIHRoaXMuX2kxOG4uc3Vic2NyaWJlRGF0YUNoYW5naW5nKHRoaXMpO1xyXG4gICAgICAgICAgdGhpcy5fc3Vic2NyaWJpbmcgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdChvcHRpb25zLmkxOG4pKSB7XHJcbiAgICAgICAgICAvLyBjb21wb25lbnQgbG9jYWwgaTE4blxyXG4gICAgICAgICAgaWYgKHRoaXMuJHJvb3QgJiYgdGhpcy4kcm9vdC4kaTE4biAmJiB0aGlzLiRyb290LiRpMThuIGluc3RhbmNlb2YgVnVlSTE4bikge1xyXG4gICAgICAgICAgICBvcHRpb25zLmkxOG4ucm9vdCA9IHRoaXMuJHJvb3QuJGkxOG47XHJcbiAgICAgICAgICAgIG9wdGlvbnMuaTE4bi5mb3JtYXR0ZXIgPSB0aGlzLiRyb290LiRpMThuLmZvcm1hdHRlcjtcclxuICAgICAgICAgICAgb3B0aW9ucy5pMThuLmZhbGxiYWNrTG9jYWxlID0gdGhpcy4kcm9vdC4kaTE4bi5mYWxsYmFja0xvY2FsZTtcclxuICAgICAgICAgICAgb3B0aW9ucy5pMThuLnNpbGVudFRyYW5zbGF0aW9uV2FybiA9IHRoaXMuJHJvb3QuJGkxOG4uc2lsZW50VHJhbnNsYXRpb25XYXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIC8vIGluaXQgbG9jYWxlIG1lc3NhZ2VzIHZpYSBjdXN0b20gYmxvY2tzXHJcbiAgICAgICAgICBpZiAob3B0aW9ucy5fX2kxOG4pIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICB2YXIgbG9jYWxlTWVzc2FnZXMkMSA9IHt9O1xyXG4gICAgICAgICAgICAgIG9wdGlvbnMuX19pMThuLmZvckVhY2goZnVuY3Rpb24gKHJlc291cmNlKSB7XHJcbiAgICAgICAgICAgICAgICBsb2NhbGVNZXNzYWdlcyQxID0gbWVyZ2UobG9jYWxlTWVzc2FnZXMkMSwgSlNPTi5wYXJzZShyZXNvdXJjZSkpO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIG9wdGlvbnMuaTE4bi5tZXNzYWdlcyA9IGxvY2FsZU1lc3NhZ2VzJDE7XHJcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICB3YXJuKFwiQ2Fubm90IHBhcnNlIGxvY2FsZSBtZXNzYWdlcyB2aWEgY3VzdG9tIGJsb2Nrcy5cIiwgZSk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpcy5faTE4biA9IG5ldyBWdWVJMThuKG9wdGlvbnMuaTE4bik7XHJcbiAgICAgICAgICB0aGlzLl9pMThuV2F0Y2hlciA9IHRoaXMuX2kxOG4ud2F0Y2hJMThuRGF0YSgpO1xyXG4gICAgICAgICAgdGhpcy5faTE4bi5zdWJzY3JpYmVEYXRhQ2hhbmdpbmcodGhpcyk7XHJcbiAgICAgICAgICB0aGlzLl9zdWJzY3JpYmluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgaWYgKG9wdGlvbnMuaTE4bi5zeW5jID09PSB1bmRlZmluZWQgfHwgISFvcHRpb25zLmkxOG4uc3luYykge1xyXG4gICAgICAgICAgICB0aGlzLl9sb2NhbGVXYXRjaGVyID0gdGhpcy4kaTE4bi53YXRjaExvY2FsZSgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB7XHJcbiAgICAgICAgICAgIHdhcm4oXCJDYW5ub3QgYmUgaW50ZXJwcmV0ZWQgJ2kxOG4nIG9wdGlvbi5cIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuJHJvb3QgJiYgdGhpcy4kcm9vdC4kaTE4biAmJiB0aGlzLiRyb290LiRpMThuIGluc3RhbmNlb2YgVnVlSTE4bikge1xyXG4gICAgICAgIC8vIHJvb3QgaTE4blxyXG4gICAgICAgIHRoaXMuX2kxOG4gPSB0aGlzLiRyb290LiRpMThuO1xyXG4gICAgICAgIHRoaXMuX2kxOG4uc3Vic2NyaWJlRGF0YUNoYW5naW5nKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuX3N1YnNjcmliaW5nID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIGlmIChvcHRpb25zLnBhcmVudCAmJiBvcHRpb25zLnBhcmVudC4kaTE4biAmJiBvcHRpb25zLnBhcmVudC4kaTE4biBpbnN0YW5jZW9mIFZ1ZUkxOG4pIHtcclxuICAgICAgICAvLyBwYXJlbnQgaTE4blxyXG4gICAgICAgIHRoaXMuX2kxOG4gPSBvcHRpb25zLnBhcmVudC4kaTE4bjtcclxuICAgICAgICB0aGlzLl9pMThuLnN1YnNjcmliZURhdGFDaGFuZ2luZyh0aGlzKTtcclxuICAgICAgICB0aGlzLl9zdWJzY3JpYmluZyA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH0sXHJcblxyXG4gICAgYmVmb3JlRGVzdHJveTogZnVuY3Rpb24gYmVmb3JlRGVzdHJveSAoKSB7XHJcbiAgICAgIGlmICghdGhpcy5faTE4bikgeyByZXR1cm4gfVxyXG5cclxuICAgICAgaWYgKHRoaXMuX3N1YnNjcmliaW5nKSB7XHJcbiAgICAgICAgdGhpcy5faTE4bi51bnN1YnNjcmliZURhdGFDaGFuZ2luZyh0aGlzKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fc3Vic2NyaWJpbmc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLl9pMThuV2F0Y2hlcikge1xyXG4gICAgICAgIHRoaXMuX2kxOG5XYXRjaGVyKCk7XHJcbiAgICAgICAgZGVsZXRlIHRoaXMuX2kxOG5XYXRjaGVyO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5fbG9jYWxlV2F0Y2hlcikge1xyXG4gICAgICAgIHRoaXMuX2xvY2FsZVdhdGNoZXIoKTtcclxuICAgICAgICBkZWxldGUgdGhpcy5fbG9jYWxlV2F0Y2hlcjtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5faTE4biA9IG51bGw7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgdmFyIGNvbXBvbmVudCA9IHtcclxuICAgIG5hbWU6ICdpMThuJyxcclxuICAgIGZ1bmN0aW9uYWw6IHRydWUsXHJcbiAgICBwcm9wczoge1xyXG4gICAgICB0YWc6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgZGVmYXVsdDogJ3NwYW4nXHJcbiAgICAgIH0sXHJcbiAgICAgIHBhdGg6IHtcclxuICAgICAgICB0eXBlOiBTdHJpbmcsXHJcbiAgICAgICAgcmVxdWlyZWQ6IHRydWVcclxuICAgICAgfSxcclxuICAgICAgbG9jYWxlOiB7XHJcbiAgICAgICAgdHlwZTogU3RyaW5nXHJcbiAgICAgIH0sXHJcbiAgICAgIHBsYWNlczoge1xyXG4gICAgICAgIHR5cGU6IFtBcnJheSwgT2JqZWN0XVxyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiByZW5kZXIgKGgsIHJlZikge1xyXG4gICAgICB2YXIgcHJvcHMgPSByZWYucHJvcHM7XHJcbiAgICAgIHZhciBkYXRhID0gcmVmLmRhdGE7XHJcbiAgICAgIHZhciBjaGlsZHJlbiA9IHJlZi5jaGlsZHJlbjtcclxuICAgICAgdmFyIHBhcmVudCA9IHJlZi5wYXJlbnQ7XHJcblxyXG4gICAgICB2YXIgaTE4biA9IHBhcmVudC4kaTE4bjtcclxuXHJcbiAgICAgIGNoaWxkcmVuID0gKGNoaWxkcmVuIHx8IFtdKS5maWx0ZXIoZnVuY3Rpb24gKGNoaWxkKSB7XHJcbiAgICAgICAgcmV0dXJuIGNoaWxkLnRhZyB8fCAoY2hpbGQudGV4dCA9IGNoaWxkLnRleHQudHJpbSgpKVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmICghaTE4bikge1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIHdhcm4oJ0Nhbm5vdCBmaW5kIFZ1ZUkxOG4gaW5zdGFuY2UhJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjaGlsZHJlblxyXG4gICAgICB9XHJcblxyXG4gICAgICB2YXIgcGF0aCA9IHByb3BzLnBhdGg7XHJcbiAgICAgIHZhciBsb2NhbGUgPSBwcm9wcy5sb2NhbGU7XHJcblxyXG4gICAgICB2YXIgcGFyYW1zID0ge307XHJcbiAgICAgIHZhciBwbGFjZXMgPSBwcm9wcy5wbGFjZXMgfHwge307XHJcblxyXG4gICAgICB2YXIgaGFzUGxhY2VzID0gQXJyYXkuaXNBcnJheShwbGFjZXMpXHJcbiAgICAgICAgPyBwbGFjZXMubGVuZ3RoID4gMFxyXG4gICAgICAgIDogT2JqZWN0LmtleXMocGxhY2VzKS5sZW5ndGggPiAwO1xyXG5cclxuICAgICAgdmFyIGV2ZXJ5UGxhY2UgPSBjaGlsZHJlbi5ldmVyeShmdW5jdGlvbiAoY2hpbGQpIHtcclxuICAgICAgICBpZiAoY2hpbGQuZGF0YSAmJiBjaGlsZC5kYXRhLmF0dHJzKSB7XHJcbiAgICAgICAgICB2YXIgcGxhY2UgPSBjaGlsZC5kYXRhLmF0dHJzLnBsYWNlO1xyXG4gICAgICAgICAgcmV0dXJuICh0eXBlb2YgcGxhY2UgIT09ICd1bmRlZmluZWQnKSAmJiBwbGFjZSAhPT0gJydcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKGhhc1BsYWNlcyAmJiBjaGlsZHJlbi5sZW5ndGggPiAwICYmICFldmVyeVBsYWNlKSB7XHJcbiAgICAgICAgd2FybignSWYgcGxhY2VzIHByb3AgaXMgc2V0LCBhbGwgY2hpbGQgZWxlbWVudHMgbXVzdCBoYXZlIHBsYWNlIHByb3Agc2V0LicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwbGFjZXMpKSB7XHJcbiAgICAgICAgcGxhY2VzLmZvckVhY2goZnVuY3Rpb24gKGVsLCBpKSB7XHJcbiAgICAgICAgICBwYXJhbXNbaV0gPSBlbDtcclxuICAgICAgICB9KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBPYmplY3Qua2V5cyhwbGFjZXMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xyXG4gICAgICAgICAgcGFyYW1zW2tleV0gPSBwbGFjZXNba2V5XTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY2hpbGRyZW4uZm9yRWFjaChmdW5jdGlvbiAoY2hpbGQsIGkpIHtcclxuICAgICAgICB2YXIga2V5ID0gZXZlcnlQbGFjZVxyXG4gICAgICAgICAgPyAoXCJcIiArIChjaGlsZC5kYXRhLmF0dHJzLnBsYWNlKSlcclxuICAgICAgICAgIDogKFwiXCIgKyBpKTtcclxuICAgICAgICBwYXJhbXNba2V5XSA9IGNoaWxkO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBoKHByb3BzLnRhZywgZGF0YSwgaTE4bi5pKHBhdGgsIGxvY2FsZSwgcGFyYW1zKSlcclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qICAqL1xyXG5cclxuICBmdW5jdGlvbiBiaW5kIChlbCwgYmluZGluZywgdm5vZGUpIHtcclxuICAgIGlmICghYXNzZXJ0KGVsLCB2bm9kZSkpIHsgcmV0dXJuIH1cclxuXHJcbiAgICB0KGVsLCBiaW5kaW5nLCB2bm9kZSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiB1cGRhdGUgKGVsLCBiaW5kaW5nLCB2bm9kZSwgb2xkVk5vZGUpIHtcclxuICAgIGlmICghYXNzZXJ0KGVsLCB2bm9kZSkpIHsgcmV0dXJuIH1cclxuXHJcbiAgICBpZiAobG9jYWxlRXF1YWwoZWwsIHZub2RlKSAmJiBsb29zZUVxdWFsKGJpbmRpbmcudmFsdWUsIGJpbmRpbmcub2xkVmFsdWUpKSB7IHJldHVybiB9XHJcblxyXG4gICAgdChlbCwgYmluZGluZywgdm5vZGUpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gdW5iaW5kIChlbCwgYmluZGluZywgdm5vZGUsIG9sZFZOb2RlKSB7XHJcbiAgICB2YXIgdm0gPSB2bm9kZS5jb250ZXh0O1xyXG4gICAgaWYgKCF2bSkge1xyXG4gICAgICB3YXJuKCdWdWUgaW5zdGFuY2UgZG9lcyBub3QgZXhpc3RzIGluIFZOb2RlIGNvbnRleHQnKTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgZWwudGV4dENvbnRlbnQgPSAnJztcclxuICAgIGVsLl92dCA9IHVuZGVmaW5lZDtcclxuICAgIGRlbGV0ZSBlbFsnX3Z0J107XHJcbiAgICBlbC5fbG9jYWxlID0gdW5kZWZpbmVkO1xyXG4gICAgZGVsZXRlIGVsWydfbG9jYWxlJ107XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBhc3NlcnQgKGVsLCB2bm9kZSkge1xyXG4gICAgdmFyIHZtID0gdm5vZGUuY29udGV4dDtcclxuICAgIGlmICghdm0pIHtcclxuICAgICAgd2FybignVnVlIGluc3RhbmNlIGRvZXN0IG5vdCBleGlzdHMgaW4gVk5vZGUgY29udGV4dCcpO1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXZtLiRpMThuKSB7XHJcbiAgICAgIHdhcm4oJ1Z1ZUkxOG4gaW5zdGFuY2UgZG9lcyBub3QgZXhpc3RzIGluIFZ1ZSBpbnN0YW5jZScpO1xyXG4gICAgICByZXR1cm4gZmFsc2VcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdHJ1ZVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbG9jYWxlRXF1YWwgKGVsLCB2bm9kZSkge1xyXG4gICAgdmFyIHZtID0gdm5vZGUuY29udGV4dDtcclxuICAgIHJldHVybiBlbC5fbG9jYWxlID09PSB2bS4kaTE4bi5sb2NhbGVcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIHQgKGVsLCBiaW5kaW5nLCB2bm9kZSkge1xyXG4gICAgdmFyIHJlZiQxLCByZWYkMjtcclxuXHJcbiAgICB2YXIgdmFsdWUgPSBiaW5kaW5nLnZhbHVlO1xyXG5cclxuICAgIHZhciByZWYgPSBwYXJzZVZhbHVlKHZhbHVlKTtcclxuICAgIHZhciBwYXRoID0gcmVmLnBhdGg7XHJcbiAgICB2YXIgbG9jYWxlID0gcmVmLmxvY2FsZTtcclxuICAgIHZhciBhcmdzID0gcmVmLmFyZ3M7XHJcbiAgICB2YXIgY2hvaWNlID0gcmVmLmNob2ljZTtcclxuICAgIGlmICghcGF0aCAmJiAhbG9jYWxlICYmICFhcmdzKSB7XHJcbiAgICAgIHdhcm4oJ3ZhbHVlIHR5cGUgbm90IHN1cHBvcnRlZCcpO1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXBhdGgpIHtcclxuICAgICAgd2FybignYHBhdGhgIGlzIHJlcXVpcmVkIGluIHYtdCBkaXJlY3RpdmUnKTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIHZtID0gdm5vZGUuY29udGV4dDtcclxuICAgIGlmIChjaG9pY2UpIHtcclxuICAgICAgZWwuX3Z0ID0gZWwudGV4dENvbnRlbnQgPSAocmVmJDEgPSB2bS4kaTE4bikudGMuYXBwbHkocmVmJDEsIFsgcGF0aCwgY2hvaWNlIF0uY29uY2F0KCBtYWtlUGFyYW1zKGxvY2FsZSwgYXJncykgKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBlbC5fdnQgPSBlbC50ZXh0Q29udGVudCA9IChyZWYkMiA9IHZtLiRpMThuKS50LmFwcGx5KHJlZiQyLCBbIHBhdGggXS5jb25jYXQoIG1ha2VQYXJhbXMobG9jYWxlLCBhcmdzKSApKTtcclxuICAgIH1cclxuICAgIGVsLl9sb2NhbGUgPSB2bS4kaTE4bi5sb2NhbGU7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBwYXJzZVZhbHVlICh2YWx1ZSkge1xyXG4gICAgdmFyIHBhdGg7XHJcbiAgICB2YXIgbG9jYWxlO1xyXG4gICAgdmFyIGFyZ3M7XHJcbiAgICB2YXIgY2hvaWNlO1xyXG5cclxuICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgIHBhdGggPSB2YWx1ZTtcclxuICAgIH0gZWxzZSBpZiAoaXNQbGFpbk9iamVjdCh2YWx1ZSkpIHtcclxuICAgICAgcGF0aCA9IHZhbHVlLnBhdGg7XHJcbiAgICAgIGxvY2FsZSA9IHZhbHVlLmxvY2FsZTtcclxuICAgICAgYXJncyA9IHZhbHVlLmFyZ3M7XHJcbiAgICAgIGNob2ljZSA9IHZhbHVlLmNob2ljZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4geyBwYXRoOiBwYXRoLCBsb2NhbGU6IGxvY2FsZSwgYXJnczogYXJncywgY2hvaWNlOiBjaG9pY2UgfVxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbWFrZVBhcmFtcyAobG9jYWxlLCBhcmdzKSB7XHJcbiAgICB2YXIgcGFyYW1zID0gW107XHJcblxyXG4gICAgbG9jYWxlICYmIHBhcmFtcy5wdXNoKGxvY2FsZSk7XHJcbiAgICBpZiAoYXJncyAmJiAoQXJyYXkuaXNBcnJheShhcmdzKSB8fCBpc1BsYWluT2JqZWN0KGFyZ3MpKSkge1xyXG4gICAgICBwYXJhbXMucHVzaChhcmdzKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyYW1zXHJcbiAgfVxyXG5cclxuICB2YXIgVnVlO1xyXG5cclxuICBmdW5jdGlvbiBpbnN0YWxsIChfVnVlKSB7XHJcbiAgICBWdWUgPSBfVnVlO1xyXG5cclxuICAgIHZhciB2ZXJzaW9uID0gKFZ1ZS52ZXJzaW9uICYmIE51bWJlcihWdWUudmVyc2lvbi5zcGxpdCgnLicpWzBdKSkgfHwgLTE7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmIChpbnN0YWxsLmluc3RhbGxlZCkge1xyXG4gICAgICB3YXJuKCdhbHJlYWR5IGluc3RhbGxlZC4nKTtcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBpbnN0YWxsLmluc3RhbGxlZCA9IHRydWU7XHJcblxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAodmVyc2lvbiA8IDIpIHtcclxuICAgICAgd2FybigoXCJ2dWUtaTE4biAoXCIgKyAoaW5zdGFsbC52ZXJzaW9uKSArIFwiKSBuZWVkIHRvIHVzZSBWdWUgMi4wIG9yIGxhdGVyIChWdWU6IFwiICsgKFZ1ZS52ZXJzaW9uKSArIFwiKS5cIikpO1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBleHRlbmQoVnVlKTtcclxuICAgIFZ1ZS5taXhpbihtaXhpbik7XHJcbiAgICBWdWUuZGlyZWN0aXZlKCd0JywgeyBiaW5kOiBiaW5kLCB1cGRhdGU6IHVwZGF0ZSwgdW5iaW5kOiB1bmJpbmQgfSk7XHJcbiAgICBWdWUuY29tcG9uZW50KGNvbXBvbmVudC5uYW1lLCBjb21wb25lbnQpO1xyXG5cclxuICAgIC8vIHVzZSBzaW1wbGUgbWVyZ2VTdHJhdGVnaWVzIHRvIHByZXZlbnQgaTE4biBpbnN0YW5jZSBsb3NlICdfX3Byb3RvX18nXHJcbiAgICB2YXIgc3RyYXRzID0gVnVlLmNvbmZpZy5vcHRpb25NZXJnZVN0cmF0ZWdpZXM7XHJcbiAgICBzdHJhdHMuaTE4biA9IGZ1bmN0aW9uIChwYXJlbnRWYWwsIGNoaWxkVmFsKSB7XHJcbiAgICAgIHJldHVybiBjaGlsZFZhbCA9PT0gdW5kZWZpbmVkXHJcbiAgICAgICAgPyBwYXJlbnRWYWxcclxuICAgICAgICA6IGNoaWxkVmFsXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgLyogICovXHJcblxyXG4gIHZhciBCYXNlRm9ybWF0dGVyID0gZnVuY3Rpb24gQmFzZUZvcm1hdHRlciAoKSB7XHJcbiAgICB0aGlzLl9jYWNoZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gIH07XHJcblxyXG4gIEJhc2VGb3JtYXR0ZXIucHJvdG90eXBlLmludGVycG9sYXRlID0gZnVuY3Rpb24gaW50ZXJwb2xhdGUgKG1lc3NhZ2UsIHZhbHVlcykge1xyXG4gICAgaWYgKCF2YWx1ZXMpIHtcclxuICAgICAgcmV0dXJuIFttZXNzYWdlXVxyXG4gICAgfVxyXG4gICAgdmFyIHRva2VucyA9IHRoaXMuX2NhY2hlc1ttZXNzYWdlXTtcclxuICAgIGlmICghdG9rZW5zKSB7XHJcbiAgICAgIHRva2VucyA9IHBhcnNlKG1lc3NhZ2UpO1xyXG4gICAgICB0aGlzLl9jYWNoZXNbbWVzc2FnZV0gPSB0b2tlbnM7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29tcGlsZSh0b2tlbnMsIHZhbHVlcylcclxuICB9O1xyXG5cclxuXHJcblxyXG4gIHZhciBSRV9UT0tFTl9MSVNUX1ZBTFVFID0gL14oXFxkKSsvO1xyXG4gIHZhciBSRV9UT0tFTl9OQU1FRF9WQUxVRSA9IC9eKFxcdykrLztcclxuXHJcbiAgZnVuY3Rpb24gcGFyc2UgKGZvcm1hdCkge1xyXG4gICAgdmFyIHRva2VucyA9IFtdO1xyXG4gICAgdmFyIHBvc2l0aW9uID0gMDtcclxuXHJcbiAgICB2YXIgdGV4dCA9ICcnO1xyXG4gICAgd2hpbGUgKHBvc2l0aW9uIDwgZm9ybWF0Lmxlbmd0aCkge1xyXG4gICAgICB2YXIgY2hhciA9IGZvcm1hdFtwb3NpdGlvbisrXTtcclxuICAgICAgaWYgKGNoYXIgPT09ICd7Jykge1xyXG4gICAgICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgICAgICB0b2tlbnMucHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWU6IHRleHQgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0ZXh0ID0gJyc7XHJcbiAgICAgICAgdmFyIHN1YiA9ICcnO1xyXG4gICAgICAgIGNoYXIgPSBmb3JtYXRbcG9zaXRpb24rK107XHJcbiAgICAgICAgd2hpbGUgKGNoYXIgIT09ICd9Jykge1xyXG4gICAgICAgICAgc3ViICs9IGNoYXI7XHJcbiAgICAgICAgICBjaGFyID0gZm9ybWF0W3Bvc2l0aW9uKytdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIHR5cGUgPSBSRV9UT0tFTl9MSVNUX1ZBTFVFLnRlc3Qoc3ViKVxyXG4gICAgICAgICAgPyAnbGlzdCdcclxuICAgICAgICAgIDogUkVfVE9LRU5fTkFNRURfVkFMVUUudGVzdChzdWIpXHJcbiAgICAgICAgICAgID8gJ25hbWVkJ1xyXG4gICAgICAgICAgICA6ICd1bmtub3duJztcclxuICAgICAgICB0b2tlbnMucHVzaCh7IHZhbHVlOiBzdWIsIHR5cGU6IHR5cGUgfSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoY2hhciA9PT0gJyUnKSB7XHJcbiAgICAgICAgLy8gd2hlbiBmb3VuZCByYWlscyBpMThuIHN5bnRheCwgc2tpcCB0ZXh0IGNhcHR1cmVcclxuICAgICAgICBpZiAoZm9ybWF0Wyhwb3NpdGlvbildICE9PSAneycpIHtcclxuICAgICAgICAgIHRleHQgKz0gY2hhcjtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGV4dCArPSBjaGFyO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGV4dCAmJiB0b2tlbnMucHVzaCh7IHR5cGU6ICd0ZXh0JywgdmFsdWU6IHRleHQgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRva2Vuc1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gY29tcGlsZSAodG9rZW5zLCB2YWx1ZXMpIHtcclxuICAgIHZhciBjb21waWxlZCA9IFtdO1xyXG4gICAgdmFyIGluZGV4ID0gMDtcclxuXHJcbiAgICB2YXIgbW9kZSA9IEFycmF5LmlzQXJyYXkodmFsdWVzKVxyXG4gICAgICA/ICdsaXN0J1xyXG4gICAgICA6IGlzT2JqZWN0KHZhbHVlcylcclxuICAgICAgICA/ICduYW1lZCdcclxuICAgICAgICA6ICd1bmtub3duJztcclxuICAgIGlmIChtb2RlID09PSAndW5rbm93bicpIHsgcmV0dXJuIGNvbXBpbGVkIH1cclxuXHJcbiAgICB3aGlsZSAoaW5kZXggPCB0b2tlbnMubGVuZ3RoKSB7XHJcbiAgICAgIHZhciB0b2tlbiA9IHRva2Vuc1tpbmRleF07XHJcbiAgICAgIHN3aXRjaCAodG9rZW4udHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ3RleHQnOlxyXG4gICAgICAgICAgY29tcGlsZWQucHVzaCh0b2tlbi52YWx1ZSk7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgJ2xpc3QnOlxyXG4gICAgICAgICAgY29tcGlsZWQucHVzaCh2YWx1ZXNbcGFyc2VJbnQodG9rZW4udmFsdWUsIDEwKV0pO1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICduYW1lZCc6XHJcbiAgICAgICAgICBpZiAobW9kZSA9PT0gJ25hbWVkJykge1xyXG4gICAgICAgICAgICBjb21waWxlZC5wdXNoKCh2YWx1ZXMpW3Rva2VuLnZhbHVlXSk7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgd2FybigoXCJUeXBlIG9mIHRva2VuICdcIiArICh0b2tlbi50eXBlKSArIFwiJyBhbmQgZm9ybWF0IG9mIHZhbHVlICdcIiArIG1vZGUgKyBcIicgZG9uJ3QgbWF0Y2ghXCIpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlICd1bmtub3duJzpcclxuICAgICAgICAgIHtcclxuICAgICAgICAgICAgd2FybihcIkRldGVjdCAndW5rbm93bicgdHlwZSBvZiB0b2tlbiFcIik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICB9XHJcbiAgICAgIGluZGV4Kys7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGNvbXBpbGVkXHJcbiAgfVxyXG5cclxuICAvKiAgKi9cclxuXHJcbiAgLyoqXHJcbiAgICogIFBhdGggcGFlcnNlclxyXG4gICAqICAtIEluc3BpcmVkOlxyXG4gICAqICAgIFZ1ZS5qcyBQYXRoIHBhcnNlclxyXG4gICAqL1xyXG5cclxuICAvLyBhY3Rpb25zXHJcbiAgdmFyIEFQUEVORCA9IDA7XHJcbiAgdmFyIFBVU0ggPSAxO1xyXG4gIHZhciBJTkNfU1VCX1BBVEhfREVQVEggPSAyO1xyXG4gIHZhciBQVVNIX1NVQl9QQVRIID0gMztcclxuXHJcbiAgLy8gc3RhdGVzXHJcbiAgdmFyIEJFRk9SRV9QQVRIID0gMDtcclxuICB2YXIgSU5fUEFUSCA9IDE7XHJcbiAgdmFyIEJFRk9SRV9JREVOVCA9IDI7XHJcbiAgdmFyIElOX0lERU5UID0gMztcclxuICB2YXIgSU5fU1VCX1BBVEggPSA0O1xyXG4gIHZhciBJTl9TSU5HTEVfUVVPVEUgPSA1O1xyXG4gIHZhciBJTl9ET1VCTEVfUVVPVEUgPSA2O1xyXG4gIHZhciBBRlRFUl9QQVRIID0gNztcclxuICB2YXIgRVJST1IgPSA4O1xyXG5cclxuICB2YXIgcGF0aFN0YXRlTWFjaGluZSA9IFtdO1xyXG5cclxuICBwYXRoU3RhdGVNYWNoaW5lW0JFRk9SRV9QQVRIXSA9IHtcclxuICAgICd3cyc6IFtCRUZPUkVfUEFUSF0sXHJcbiAgICAnaWRlbnQnOiBbSU5fSURFTlQsIEFQUEVORF0sXHJcbiAgICAnWyc6IFtJTl9TVUJfUEFUSF0sXHJcbiAgICAnZW9mJzogW0FGVEVSX1BBVEhdXHJcbiAgfTtcclxuXHJcbiAgcGF0aFN0YXRlTWFjaGluZVtJTl9QQVRIXSA9IHtcclxuICAgICd3cyc6IFtJTl9QQVRIXSxcclxuICAgICcuJzogW0JFRk9SRV9JREVOVF0sXHJcbiAgICAnWyc6IFtJTl9TVUJfUEFUSF0sXHJcbiAgICAnZW9mJzogW0FGVEVSX1BBVEhdXHJcbiAgfTtcclxuXHJcbiAgcGF0aFN0YXRlTWFjaGluZVtCRUZPUkVfSURFTlRdID0ge1xyXG4gICAgJ3dzJzogW0JFRk9SRV9JREVOVF0sXHJcbiAgICAnaWRlbnQnOiBbSU5fSURFTlQsIEFQUEVORF0sXHJcbiAgICAnMCc6IFtJTl9JREVOVCwgQVBQRU5EXSxcclxuICAgICdudW1iZXInOiBbSU5fSURFTlQsIEFQUEVORF1cclxuICB9O1xyXG5cclxuICBwYXRoU3RhdGVNYWNoaW5lW0lOX0lERU5UXSA9IHtcclxuICAgICdpZGVudCc6IFtJTl9JREVOVCwgQVBQRU5EXSxcclxuICAgICcwJzogW0lOX0lERU5ULCBBUFBFTkRdLFxyXG4gICAgJ251bWJlcic6IFtJTl9JREVOVCwgQVBQRU5EXSxcclxuICAgICd3cyc6IFtJTl9QQVRILCBQVVNIXSxcclxuICAgICcuJzogW0JFRk9SRV9JREVOVCwgUFVTSF0sXHJcbiAgICAnWyc6IFtJTl9TVUJfUEFUSCwgUFVTSF0sXHJcbiAgICAnZW9mJzogW0FGVEVSX1BBVEgsIFBVU0hdXHJcbiAgfTtcclxuXHJcbiAgcGF0aFN0YXRlTWFjaGluZVtJTl9TVUJfUEFUSF0gPSB7XHJcbiAgICBcIidcIjogW0lOX1NJTkdMRV9RVU9URSwgQVBQRU5EXSxcclxuICAgICdcIic6IFtJTl9ET1VCTEVfUVVPVEUsIEFQUEVORF0sXHJcbiAgICAnWyc6IFtJTl9TVUJfUEFUSCwgSU5DX1NVQl9QQVRIX0RFUFRIXSxcclxuICAgICddJzogW0lOX1BBVEgsIFBVU0hfU1VCX1BBVEhdLFxyXG4gICAgJ2VvZic6IEVSUk9SLFxyXG4gICAgJ2Vsc2UnOiBbSU5fU1VCX1BBVEgsIEFQUEVORF1cclxuICB9O1xyXG5cclxuICBwYXRoU3RhdGVNYWNoaW5lW0lOX1NJTkdMRV9RVU9URV0gPSB7XHJcbiAgICBcIidcIjogW0lOX1NVQl9QQVRILCBBUFBFTkRdLFxyXG4gICAgJ2VvZic6IEVSUk9SLFxyXG4gICAgJ2Vsc2UnOiBbSU5fU0lOR0xFX1FVT1RFLCBBUFBFTkRdXHJcbiAgfTtcclxuXHJcbiAgcGF0aFN0YXRlTWFjaGluZVtJTl9ET1VCTEVfUVVPVEVdID0ge1xyXG4gICAgJ1wiJzogW0lOX1NVQl9QQVRILCBBUFBFTkRdLFxyXG4gICAgJ2VvZic6IEVSUk9SLFxyXG4gICAgJ2Vsc2UnOiBbSU5fRE9VQkxFX1FVT1RFLCBBUFBFTkRdXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogQ2hlY2sgaWYgYW4gZXhwcmVzc2lvbiBpcyBhIGxpdGVyYWwgdmFsdWUuXHJcbiAgICovXHJcblxyXG4gIHZhciBsaXRlcmFsVmFsdWVSRSA9IC9eXFxzPyh0cnVlfGZhbHNlfC0/W1xcZC5dK3wnW14nXSonfFwiW15cIl0qXCIpXFxzPyQvO1xyXG4gIGZ1bmN0aW9uIGlzTGl0ZXJhbCAoZXhwKSB7XHJcbiAgICByZXR1cm4gbGl0ZXJhbFZhbHVlUkUudGVzdChleHApXHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTdHJpcCBxdW90ZXMgZnJvbSBhIHN0cmluZ1xyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBzdHJpcFF1b3RlcyAoc3RyKSB7XHJcbiAgICB2YXIgYSA9IHN0ci5jaGFyQ29kZUF0KDApO1xyXG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChzdHIubGVuZ3RoIC0gMSk7XHJcbiAgICByZXR1cm4gYSA9PT0gYiAmJiAoYSA9PT0gMHgyMiB8fCBhID09PSAweDI3KVxyXG4gICAgICA/IHN0ci5zbGljZSgxLCAtMSlcclxuICAgICAgOiBzdHJcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZSB0aGUgdHlwZSBvZiBhIGNoYXJhY3RlciBpbiBhIGtleXBhdGguXHJcbiAgICovXHJcblxyXG4gIGZ1bmN0aW9uIGdldFBhdGhDaGFyVHlwZSAoY2gpIHtcclxuICAgIGlmIChjaCA9PT0gdW5kZWZpbmVkIHx8IGNoID09PSBudWxsKSB7IHJldHVybiAnZW9mJyB9XHJcblxyXG4gICAgdmFyIGNvZGUgPSBjaC5jaGFyQ29kZUF0KDApO1xyXG5cclxuICAgIHN3aXRjaCAoY29kZSkge1xyXG4gICAgICBjYXNlIDB4NUI6IC8vIFtcclxuICAgICAgY2FzZSAweDVEOiAvLyBdXHJcbiAgICAgIGNhc2UgMHgyRTogLy8gLlxyXG4gICAgICBjYXNlIDB4MjI6IC8vIFwiXHJcbiAgICAgIGNhc2UgMHgyNzogLy8gJ1xyXG4gICAgICBjYXNlIDB4MzA6IC8vIDBcclxuICAgICAgICByZXR1cm4gY2hcclxuXHJcbiAgICAgIGNhc2UgMHg1RjogLy8gX1xyXG4gICAgICBjYXNlIDB4MjQ6IC8vICRcclxuICAgICAgY2FzZSAweDJEOiAvLyAtXHJcbiAgICAgICAgcmV0dXJuICdpZGVudCdcclxuXHJcbiAgICAgIGNhc2UgMHgyMDogLy8gU3BhY2VcclxuICAgICAgY2FzZSAweDA5OiAvLyBUYWJcclxuICAgICAgY2FzZSAweDBBOiAvLyBOZXdsaW5lXHJcbiAgICAgIGNhc2UgMHgwRDogLy8gUmV0dXJuXHJcbiAgICAgIGNhc2UgMHhBMDogIC8vIE5vLWJyZWFrIHNwYWNlXHJcbiAgICAgIGNhc2UgMHhGRUZGOiAgLy8gQnl0ZSBPcmRlciBNYXJrXHJcbiAgICAgIGNhc2UgMHgyMDI4OiAgLy8gTGluZSBTZXBhcmF0b3JcclxuICAgICAgY2FzZSAweDIwMjk6ICAvLyBQYXJhZ3JhcGggU2VwYXJhdG9yXHJcbiAgICAgICAgcmV0dXJuICd3cydcclxuICAgIH1cclxuXHJcbiAgICAvLyBhLXosIEEtWlxyXG4gICAgaWYgKChjb2RlID49IDB4NjEgJiYgY29kZSA8PSAweDdBKSB8fCAoY29kZSA+PSAweDQxICYmIGNvZGUgPD0gMHg1QSkpIHtcclxuICAgICAgcmV0dXJuICdpZGVudCdcclxuICAgIH1cclxuXHJcbiAgICAvLyAxLTlcclxuICAgIGlmIChjb2RlID49IDB4MzEgJiYgY29kZSA8PSAweDM5KSB7IHJldHVybiAnbnVtYmVyJyB9XHJcblxyXG4gICAgcmV0dXJuICdlbHNlJ1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRm9ybWF0IGEgc3ViUGF0aCwgcmV0dXJuIGl0cyBwbGFpbiBmb3JtIGlmIGl0IGlzXHJcbiAgICogYSBsaXRlcmFsIHN0cmluZyBvciBudW1iZXIuIE90aGVyd2lzZSBwcmVwZW5kIHRoZVxyXG4gICAqIGR5bmFtaWMgaW5kaWNhdG9yICgqKS5cclxuICAgKi9cclxuXHJcbiAgZnVuY3Rpb24gZm9ybWF0U3ViUGF0aCAocGF0aCkge1xyXG4gICAgdmFyIHRyaW1tZWQgPSBwYXRoLnRyaW0oKTtcclxuICAgIC8vIGludmFsaWQgbGVhZGluZyAwXHJcbiAgICBpZiAocGF0aC5jaGFyQXQoMCkgPT09ICcwJyAmJiBpc05hTihwYXRoKSkgeyByZXR1cm4gZmFsc2UgfVxyXG5cclxuICAgIHJldHVybiBpc0xpdGVyYWwodHJpbW1lZCkgPyBzdHJpcFF1b3Rlcyh0cmltbWVkKSA6ICcqJyArIHRyaW1tZWRcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFBhcnNlIGEgc3RyaW5nIHBhdGggaW50byBhbiBhcnJheSBvZiBzZWdtZW50c1xyXG4gICAqL1xyXG5cclxuICBmdW5jdGlvbiBwYXJzZSQxIChwYXRoKSB7XHJcbiAgICB2YXIga2V5cyA9IFtdO1xyXG4gICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICB2YXIgbW9kZSA9IEJFRk9SRV9QQVRIO1xyXG4gICAgdmFyIHN1YlBhdGhEZXB0aCA9IDA7XHJcbiAgICB2YXIgYztcclxuICAgIHZhciBrZXk7XHJcbiAgICB2YXIgbmV3Q2hhcjtcclxuICAgIHZhciB0eXBlO1xyXG4gICAgdmFyIHRyYW5zaXRpb247XHJcbiAgICB2YXIgYWN0aW9uO1xyXG4gICAgdmFyIHR5cGVNYXA7XHJcbiAgICB2YXIgYWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIGFjdGlvbnNbUFVTSF0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChrZXkgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGtleXMucHVzaChrZXkpO1xyXG4gICAgICAgIGtleSA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBhY3Rpb25zW0FQUEVORF0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChrZXkgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIGtleSA9IG5ld0NoYXI7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAga2V5ICs9IG5ld0NoYXI7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgYWN0aW9uc1tJTkNfU1VCX1BBVEhfREVQVEhdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICBhY3Rpb25zW0FQUEVORF0oKTtcclxuICAgICAgc3ViUGF0aERlcHRoKys7XHJcbiAgICB9O1xyXG5cclxuICAgIGFjdGlvbnNbUFVTSF9TVUJfUEFUSF0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGlmIChzdWJQYXRoRGVwdGggPiAwKSB7XHJcbiAgICAgICAgc3ViUGF0aERlcHRoLS07XHJcbiAgICAgICAgbW9kZSA9IElOX1NVQl9QQVRIO1xyXG4gICAgICAgIGFjdGlvbnNbQVBQRU5EXSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHN1YlBhdGhEZXB0aCA9IDA7XHJcbiAgICAgICAga2V5ID0gZm9ybWF0U3ViUGF0aChrZXkpO1xyXG4gICAgICAgIGlmIChrZXkgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2VcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgYWN0aW9uc1tQVVNIXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBtYXliZVVuZXNjYXBlUXVvdGUgKCkge1xyXG4gICAgICB2YXIgbmV4dENoYXIgPSBwYXRoW2luZGV4ICsgMV07XHJcbiAgICAgIGlmICgobW9kZSA9PT0gSU5fU0lOR0xFX1FVT1RFICYmIG5leHRDaGFyID09PSBcIidcIikgfHxcclxuICAgICAgICAobW9kZSA9PT0gSU5fRE9VQkxFX1FVT1RFICYmIG5leHRDaGFyID09PSAnXCInKSkge1xyXG4gICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgbmV3Q2hhciA9ICdcXFxcJyArIG5leHRDaGFyO1xyXG4gICAgICAgIGFjdGlvbnNbQVBQRU5EXSgpO1xyXG4gICAgICAgIHJldHVybiB0cnVlXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB3aGlsZSAobW9kZSAhPT0gbnVsbCkge1xyXG4gICAgICBpbmRleCsrO1xyXG4gICAgICBjID0gcGF0aFtpbmRleF07XHJcblxyXG4gICAgICBpZiAoYyA9PT0gJ1xcXFwnICYmIG1heWJlVW5lc2NhcGVRdW90ZSgpKSB7XHJcbiAgICAgICAgY29udGludWVcclxuICAgICAgfVxyXG5cclxuICAgICAgdHlwZSA9IGdldFBhdGhDaGFyVHlwZShjKTtcclxuICAgICAgdHlwZU1hcCA9IHBhdGhTdGF0ZU1hY2hpbmVbbW9kZV07XHJcbiAgICAgIHRyYW5zaXRpb24gPSB0eXBlTWFwW3R5cGVdIHx8IHR5cGVNYXBbJ2Vsc2UnXSB8fCBFUlJPUjtcclxuXHJcbiAgICAgIGlmICh0cmFuc2l0aW9uID09PSBFUlJPUikge1xyXG4gICAgICAgIHJldHVybiAvLyBwYXJzZSBlcnJvclxyXG4gICAgICB9XHJcblxyXG4gICAgICBtb2RlID0gdHJhbnNpdGlvblswXTtcclxuICAgICAgYWN0aW9uID0gYWN0aW9uc1t0cmFuc2l0aW9uWzFdXTtcclxuICAgICAgaWYgKGFjdGlvbikge1xyXG4gICAgICAgIG5ld0NoYXIgPSB0cmFuc2l0aW9uWzJdO1xyXG4gICAgICAgIG5ld0NoYXIgPSBuZXdDaGFyID09PSB1bmRlZmluZWRcclxuICAgICAgICAgID8gY1xyXG4gICAgICAgICAgOiBuZXdDaGFyO1xyXG4gICAgICAgIGlmIChhY3Rpb24oKSA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHJldHVyblxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG1vZGUgPT09IEFGVEVSX1BBVEgpIHtcclxuICAgICAgICByZXR1cm4ga2V5c1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgZnVuY3Rpb24gZW1wdHkgKHRhcmdldCkge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cclxuICAgIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcclxuICAgICAgcmV0dXJuIHRhcmdldC5sZW5ndGggPT09IDBcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgdmFyIEkxOG5QYXRoID0gZnVuY3Rpb24gSTE4blBhdGggKCkge1xyXG4gICAgdGhpcy5fY2FjaGUgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xyXG4gIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVybmFsIHBhcnNlIHRoYXQgY2hlY2sgZm9yIGEgY2FjaGUgaGl0IGZpcnN0XHJcbiAgICovXHJcbiAgSTE4blBhdGgucHJvdG90eXBlLnBhcnNlUGF0aCA9IGZ1bmN0aW9uIHBhcnNlUGF0aCAocGF0aCkge1xyXG4gICAgdmFyIGhpdCA9IHRoaXMuX2NhY2hlW3BhdGhdO1xyXG4gICAgaWYgKCFoaXQpIHtcclxuICAgICAgaGl0ID0gcGFyc2UkMShwYXRoKTtcclxuICAgICAgaWYgKGhpdCkge1xyXG4gICAgICAgIHRoaXMuX2NhY2hlW3BhdGhdID0gaGl0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaGl0IHx8IFtdXHJcbiAgfTtcclxuXHJcbiAgLyoqXHJcbiAgICogR2V0IHBhdGggdmFsdWUgZnJvbSBwYXRoIHN0cmluZ1xyXG4gICAqL1xyXG4gIEkxOG5QYXRoLnByb3RvdHlwZS5nZXRQYXRoVmFsdWUgPSBmdW5jdGlvbiBnZXRQYXRoVmFsdWUgKG9iaiwgcGF0aCkge1xyXG4gICAgaWYgKCFpc09iamVjdChvYmopKSB7IHJldHVybiBudWxsIH1cclxuXHJcbiAgICB2YXIgcGF0aHMgPSB0aGlzLnBhcnNlUGF0aChwYXRoKTtcclxuICAgIGlmIChlbXB0eShwYXRocykpIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBsZW5ndGggPSBwYXRocy5sZW5ndGg7XHJcbiAgICAgIHZhciByZXQgPSBudWxsO1xyXG4gICAgICB2YXIgbGFzdCA9IG9iajtcclxuICAgICAgdmFyIGkgPSAwO1xyXG4gICAgICB3aGlsZSAoaSA8IGxlbmd0aCkge1xyXG4gICAgICAgIHZhciB2YWx1ZSA9IGxhc3RbcGF0aHNbaV1dO1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICBsYXN0ID0gbnVsbDtcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGxhc3QgPSB2YWx1ZTtcclxuICAgICAgICBpKys7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldCA9IGxhc3Q7XHJcbiAgICAgIHJldHVybiByZXRcclxuICAgIH1cclxuICB9O1xyXG5cclxuICAvKiAgKi9cclxuXHJcblxyXG5cclxuICB2YXIgbnVtYmVyRm9ybWF0S2V5cyA9IFtcclxuICAgICdzdHlsZScsXHJcbiAgICAnY3VycmVuY3knLFxyXG4gICAgJ2N1cnJlbmN5RGlzcGxheScsXHJcbiAgICAndXNlR3JvdXBpbmcnLFxyXG4gICAgJ21pbmltdW1JbnRlZ2VyRGlnaXRzJyxcclxuICAgICdtaW5pbXVtRnJhY3Rpb25EaWdpdHMnLFxyXG4gICAgJ21heGltdW1GcmFjdGlvbkRpZ2l0cycsXHJcbiAgICAnbWluaW11bVNpZ25pZmljYW50RGlnaXRzJyxcclxuICAgICdtYXhpbXVtU2lnbmlmaWNhbnREaWdpdHMnLFxyXG4gICAgJ2xvY2FsZU1hdGNoZXInLFxyXG4gICAgJ2Zvcm1hdE1hdGNoZXInXHJcbiAgXTtcclxuXHJcbiAgdmFyIFZ1ZUkxOG4gPSBmdW5jdGlvbiBWdWVJMThuIChvcHRpb25zKSB7XHJcbiAgICB2YXIgdGhpcyQxID0gdGhpcztcclxuICAgIGlmICggb3B0aW9ucyA9PT0gdm9pZCAwICkgb3B0aW9ucyA9IHt9O1xyXG5cclxuICAgIC8vIEF1dG8gaW5zdGFsbCBpZiBpdCBpcyBub3QgZG9uZSB5ZXQgYW5kIGB3aW5kb3dgIGhhcyBgVnVlYC5cclxuICAgIC8vIFRvIGFsbG93IHVzZXJzIHRvIGF2b2lkIGF1dG8taW5zdGFsbGF0aW9uIGluIHNvbWUgY2FzZXMsXHJcbiAgICAvLyB0aGlzIGNvZGUgc2hvdWxkIGJlIHBsYWNlZCBoZXJlLiBTZWUgIzI5MFxyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoIVZ1ZSAmJiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVnVlKSB7XHJcbiAgICAgIGluc3RhbGwod2luZG93LlZ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGxvY2FsZSA9IG9wdGlvbnMubG9jYWxlIHx8ICdlbi1VUyc7XHJcbiAgICB2YXIgZmFsbGJhY2tMb2NhbGUgPSBvcHRpb25zLmZhbGxiYWNrTG9jYWxlIHx8ICdlbi1VUyc7XHJcbiAgICB2YXIgbWVzc2FnZXMgPSBvcHRpb25zLm1lc3NhZ2VzIHx8IHt9O1xyXG4gICAgdmFyIGRhdGVUaW1lRm9ybWF0cyA9IG9wdGlvbnMuZGF0ZVRpbWVGb3JtYXRzIHx8IHt9O1xyXG4gICAgdmFyIG51bWJlckZvcm1hdHMgPSBvcHRpb25zLm51bWJlckZvcm1hdHMgfHwge307XHJcblxyXG4gICAgdGhpcy5fdm0gPSBudWxsO1xyXG4gICAgdGhpcy5fZm9ybWF0dGVyID0gb3B0aW9ucy5mb3JtYXR0ZXIgfHwgbmV3IEJhc2VGb3JtYXR0ZXIoKTtcclxuICAgIHRoaXMuX21pc3NpbmcgPSBvcHRpb25zLm1pc3NpbmcgfHwgbnVsbDtcclxuICAgIHRoaXMuX3Jvb3QgPSBvcHRpb25zLnJvb3QgfHwgbnVsbDtcclxuICAgIHRoaXMuX3N5bmMgPSBvcHRpb25zLnN5bmMgPT09IHVuZGVmaW5lZCA/IHRydWUgOiAhIW9wdGlvbnMuc3luYztcclxuICAgIHRoaXMuX2ZhbGxiYWNrUm9vdCA9IG9wdGlvbnMuZmFsbGJhY2tSb290ID09PSB1bmRlZmluZWRcclxuICAgICAgPyB0cnVlXHJcbiAgICAgIDogISFvcHRpb25zLmZhbGxiYWNrUm9vdDtcclxuICAgIHRoaXMuX3NpbGVudFRyYW5zbGF0aW9uV2FybiA9IG9wdGlvbnMuc2lsZW50VHJhbnNsYXRpb25XYXJuID09PSB1bmRlZmluZWRcclxuICAgICAgPyBmYWxzZVxyXG4gICAgICA6ICEhb3B0aW9ucy5zaWxlbnRUcmFuc2xhdGlvbldhcm47XHJcbiAgICB0aGlzLl9kYXRlVGltZUZvcm1hdHRlcnMgPSB7fTtcclxuICAgIHRoaXMuX251bWJlckZvcm1hdHRlcnMgPSB7fTtcclxuICAgIHRoaXMuX3BhdGggPSBuZXcgSTE4blBhdGgoKTtcclxuICAgIHRoaXMuX2RhdGFMaXN0ZW5lcnMgPSBbXTtcclxuXHJcbiAgICB0aGlzLl9leGlzdCA9IGZ1bmN0aW9uIChtZXNzYWdlLCBrZXkpIHtcclxuICAgICAgaWYgKCFtZXNzYWdlIHx8ICFrZXkpIHsgcmV0dXJuIGZhbHNlIH1cclxuICAgICAgcmV0dXJuICFpc051bGwodGhpcyQxLl9wYXRoLmdldFBhdGhWYWx1ZShtZXNzYWdlLCBrZXkpKVxyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLl9pbml0Vk0oe1xyXG4gICAgICBsb2NhbGU6IGxvY2FsZSxcclxuICAgICAgZmFsbGJhY2tMb2NhbGU6IGZhbGxiYWNrTG9jYWxlLFxyXG4gICAgICBtZXNzYWdlczogbWVzc2FnZXMsXHJcbiAgICAgIGRhdGVUaW1lRm9ybWF0czogZGF0ZVRpbWVGb3JtYXRzLFxyXG4gICAgICBudW1iZXJGb3JtYXRzOiBudW1iZXJGb3JtYXRzXHJcbiAgICB9KTtcclxuICB9O1xyXG5cclxuICB2YXIgcHJvdG90eXBlQWNjZXNzb3JzID0geyB2bTogeyBjb25maWd1cmFibGU6IHRydWUgfSxtZXNzYWdlczogeyBjb25maWd1cmFibGU6IHRydWUgfSxkYXRlVGltZUZvcm1hdHM6IHsgY29uZmlndXJhYmxlOiB0cnVlIH0sbnVtYmVyRm9ybWF0czogeyBjb25maWd1cmFibGU6IHRydWUgfSxsb2NhbGU6IHsgY29uZmlndXJhYmxlOiB0cnVlIH0sZmFsbGJhY2tMb2NhbGU6IHsgY29uZmlndXJhYmxlOiB0cnVlIH0sbWlzc2luZzogeyBjb25maWd1cmFibGU6IHRydWUgfSxmb3JtYXR0ZXI6IHsgY29uZmlndXJhYmxlOiB0cnVlIH0sc2lsZW50VHJhbnNsYXRpb25XYXJuOiB7IGNvbmZpZ3VyYWJsZTogdHJ1ZSB9IH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLl9pbml0Vk0gPSBmdW5jdGlvbiBfaW5pdFZNIChkYXRhKSB7XHJcbiAgICB2YXIgc2lsZW50ID0gVnVlLmNvbmZpZy5zaWxlbnQ7XHJcbiAgICBWdWUuY29uZmlnLnNpbGVudCA9IHRydWU7XHJcbiAgICB0aGlzLl92bSA9IG5ldyBWdWUoeyBkYXRhOiBkYXRhIH0pO1xyXG4gICAgVnVlLmNvbmZpZy5zaWxlbnQgPSBzaWxlbnQ7XHJcbiAgfTtcclxuXHJcbiAgVnVlSTE4bi5wcm90b3R5cGUuc3Vic2NyaWJlRGF0YUNoYW5naW5nID0gZnVuY3Rpb24gc3Vic2NyaWJlRGF0YUNoYW5naW5nICh2bSkge1xyXG4gICAgdGhpcy5fZGF0YUxpc3RlbmVycy5wdXNoKHZtKTtcclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS51bnN1YnNjcmliZURhdGFDaGFuZ2luZyA9IGZ1bmN0aW9uIHVuc3Vic2NyaWJlRGF0YUNoYW5naW5nICh2bSkge1xyXG4gICAgcmVtb3ZlKHRoaXMuX2RhdGFMaXN0ZW5lcnMsIHZtKTtcclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS53YXRjaEkxOG5EYXRhID0gZnVuY3Rpb24gd2F0Y2hJMThuRGF0YSAoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICByZXR1cm4gdGhpcy5fdm0uJHdhdGNoKCckZGF0YScsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgdmFyIGkgPSBzZWxmLl9kYXRhTGlzdGVuZXJzLmxlbmd0aDtcclxuICAgICAgd2hpbGUgKGktLSkge1xyXG4gICAgICAgIFZ1ZS5uZXh0VGljayhmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICBzZWxmLl9kYXRhTGlzdGVuZXJzW2ldICYmIHNlbGYuX2RhdGFMaXN0ZW5lcnNbaV0uJGZvcmNlVXBkYXRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0sIHsgZGVlcDogdHJ1ZSB9KVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLndhdGNoTG9jYWxlID0gZnVuY3Rpb24gd2F0Y2hMb2NhbGUgKCkge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoIXRoaXMuX3N5bmMgfHwgIXRoaXMuX3Jvb3QpIHsgcmV0dXJuIG51bGwgfVxyXG4gICAgdmFyIHRhcmdldCA9IHRoaXMuX3ZtO1xyXG4gICAgcmV0dXJuIHRoaXMuX3Jvb3Qudm0uJHdhdGNoKCdsb2NhbGUnLCBmdW5jdGlvbiAodmFsKSB7XHJcbiAgICAgIHRhcmdldC4kc2V0KHRhcmdldCwgJ2xvY2FsZScsIHZhbCk7XHJcbiAgICAgIHRhcmdldC4kZm9yY2VVcGRhdGUoKTtcclxuICAgIH0sIHsgaW1tZWRpYXRlOiB0cnVlIH0pXHJcbiAgfTtcclxuXHJcbiAgcHJvdG90eXBlQWNjZXNzb3JzLnZtLmdldCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX3ZtIH07XHJcblxyXG4gIHByb3RvdHlwZUFjY2Vzc29ycy5tZXNzYWdlcy5nZXQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBsb29zZUNsb25lKHRoaXMuX2dldE1lc3NhZ2VzKCkpIH07XHJcbiAgcHJvdG90eXBlQWNjZXNzb3JzLmRhdGVUaW1lRm9ybWF0cy5nZXQgPSBmdW5jdGlvbiAoKSB7IHJldHVybiBsb29zZUNsb25lKHRoaXMuX2dldERhdGVUaW1lRm9ybWF0cygpKSB9O1xyXG4gIHByb3RvdHlwZUFjY2Vzc29ycy5udW1iZXJGb3JtYXRzLmdldCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIGxvb3NlQ2xvbmUodGhpcy5fZ2V0TnVtYmVyRm9ybWF0cygpKSB9O1xyXG5cclxuICBwcm90b3R5cGVBY2Nlc3NvcnMubG9jYWxlLmdldCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX3ZtLmxvY2FsZSB9O1xyXG4gIHByb3RvdHlwZUFjY2Vzc29ycy5sb2NhbGUuc2V0ID0gZnVuY3Rpb24gKGxvY2FsZSkge1xyXG4gICAgdGhpcy5fdm0uJHNldCh0aGlzLl92bSwgJ2xvY2FsZScsIGxvY2FsZSk7XHJcbiAgfTtcclxuXHJcbiAgcHJvdG90eXBlQWNjZXNzb3JzLmZhbGxiYWNrTG9jYWxlLmdldCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX3ZtLmZhbGxiYWNrTG9jYWxlIH07XHJcbiAgcHJvdG90eXBlQWNjZXNzb3JzLmZhbGxiYWNrTG9jYWxlLnNldCA9IGZ1bmN0aW9uIChsb2NhbGUpIHtcclxuICAgIHRoaXMuX3ZtLiRzZXQodGhpcy5fdm0sICdmYWxsYmFja0xvY2FsZScsIGxvY2FsZSk7XHJcbiAgfTtcclxuXHJcbiAgcHJvdG90eXBlQWNjZXNzb3JzLm1pc3NpbmcuZ2V0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fbWlzc2luZyB9O1xyXG4gIHByb3RvdHlwZUFjY2Vzc29ycy5taXNzaW5nLnNldCA9IGZ1bmN0aW9uIChoYW5kbGVyKSB7IHRoaXMuX21pc3NpbmcgPSBoYW5kbGVyOyB9O1xyXG5cclxuICBwcm90b3R5cGVBY2Nlc3NvcnMuZm9ybWF0dGVyLmdldCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHRoaXMuX2Zvcm1hdHRlciB9O1xyXG4gIHByb3RvdHlwZUFjY2Vzc29ycy5mb3JtYXR0ZXIuc2V0ID0gZnVuY3Rpb24gKGZvcm1hdHRlcikgeyB0aGlzLl9mb3JtYXR0ZXIgPSBmb3JtYXR0ZXI7IH07XHJcblxyXG4gIHByb3RvdHlwZUFjY2Vzc29ycy5zaWxlbnRUcmFuc2xhdGlvbldhcm4uZ2V0ID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpcy5fc2lsZW50VHJhbnNsYXRpb25XYXJuIH07XHJcbiAgcHJvdG90eXBlQWNjZXNzb3JzLnNpbGVudFRyYW5zbGF0aW9uV2Fybi5zZXQgPSBmdW5jdGlvbiAoc2lsZW50KSB7IHRoaXMuX3NpbGVudFRyYW5zbGF0aW9uV2FybiA9IHNpbGVudDsgfTtcclxuXHJcbiAgVnVlSTE4bi5wcm90b3R5cGUuX2dldE1lc3NhZ2VzID0gZnVuY3Rpb24gX2dldE1lc3NhZ2VzICgpIHsgcmV0dXJuIHRoaXMuX3ZtLm1lc3NhZ2VzIH07XHJcbiAgVnVlSTE4bi5wcm90b3R5cGUuX2dldERhdGVUaW1lRm9ybWF0cyA9IGZ1bmN0aW9uIF9nZXREYXRlVGltZUZvcm1hdHMgKCkgeyByZXR1cm4gdGhpcy5fdm0uZGF0ZVRpbWVGb3JtYXRzIH07XHJcbiAgVnVlSTE4bi5wcm90b3R5cGUuX2dldE51bWJlckZvcm1hdHMgPSBmdW5jdGlvbiBfZ2V0TnVtYmVyRm9ybWF0cyAoKSB7IHJldHVybiB0aGlzLl92bS5udW1iZXJGb3JtYXRzIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLl93YXJuRGVmYXVsdCA9IGZ1bmN0aW9uIF93YXJuRGVmYXVsdCAobG9jYWxlLCBrZXksIHJlc3VsdCwgdm0sIHZhbHVlcykge1xyXG4gICAgaWYgKCFpc051bGwocmVzdWx0KSkgeyByZXR1cm4gcmVzdWx0IH1cclxuICAgIGlmICh0aGlzLl9taXNzaW5nKSB7XHJcbiAgICAgIHZhciBtaXNzaW5nUmV0ID0gdGhpcy5fbWlzc2luZy5hcHBseShudWxsLCBbbG9jYWxlLCBrZXksIHZtLCB2YWx1ZXNdKTtcclxuICAgICAgaWYgKHR5cGVvZiBtaXNzaW5nUmV0ID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgIHJldHVybiBtaXNzaW5nUmV0XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICghdGhpcy5fc2lsZW50VHJhbnNsYXRpb25XYXJuKSB7XHJcbiAgICAgICAgd2FybihcclxuICAgICAgICAgIFwiQ2Fubm90IHRyYW5zbGF0ZSB0aGUgdmFsdWUgb2Yga2V5cGF0aCAnXCIgKyBrZXkgKyBcIicuIFwiICtcclxuICAgICAgICAgICdVc2UgdGhlIHZhbHVlIG9mIGtleXBhdGggYXMgZGVmYXVsdC4nXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGtleVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLl9pc0ZhbGxiYWNrUm9vdCA9IGZ1bmN0aW9uIF9pc0ZhbGxiYWNrUm9vdCAodmFsKSB7XHJcbiAgICByZXR1cm4gIXZhbCAmJiAhaXNOdWxsKHRoaXMuX3Jvb3QpICYmIHRoaXMuX2ZhbGxiYWNrUm9vdFxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLl9pbnRlcnBvbGF0ZSA9IGZ1bmN0aW9uIF9pbnRlcnBvbGF0ZSAoXHJcbiAgICBsb2NhbGUsXHJcbiAgICBtZXNzYWdlLFxyXG4gICAga2V5LFxyXG4gICAgaG9zdCxcclxuICAgIGludGVycG9sYXRlTW9kZSxcclxuICAgIHZhbHVlc1xyXG4gICkge1xyXG4gICAgaWYgKCFtZXNzYWdlKSB7IHJldHVybiBudWxsIH1cclxuXHJcbiAgICB2YXIgcGF0aFJldCA9IHRoaXMuX3BhdGguZ2V0UGF0aFZhbHVlKG1lc3NhZ2UsIGtleSk7XHJcbiAgICBpZiAoQXJyYXkuaXNBcnJheShwYXRoUmV0KSB8fCBpc1BsYWluT2JqZWN0KHBhdGhSZXQpKSB7IHJldHVybiBwYXRoUmV0IH1cclxuXHJcbiAgICB2YXIgcmV0O1xyXG4gICAgaWYgKGlzTnVsbChwYXRoUmV0KSkge1xyXG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xyXG4gICAgICBpZiAoaXNQbGFpbk9iamVjdChtZXNzYWdlKSkge1xyXG4gICAgICAgIHJldCA9IG1lc3NhZ2Vba2V5XTtcclxuICAgICAgICBpZiAodHlwZW9mIHJldCAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgIGlmICghdGhpcy5fc2lsZW50VHJhbnNsYXRpb25XYXJuKSB7XHJcbiAgICAgICAgICAgIHdhcm4oKFwiVmFsdWUgb2Yga2V5ICdcIiArIGtleSArIFwiJyBpcyBub3QgYSBzdHJpbmchXCIpKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXHJcbiAgICAgIGlmICh0eXBlb2YgcGF0aFJldCA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICByZXQgPSBwYXRoUmV0O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICghdGhpcy5fc2lsZW50VHJhbnNsYXRpb25XYXJuKSB7XHJcbiAgICAgICAgICB3YXJuKChcIlZhbHVlIG9mIGtleSAnXCIgKyBrZXkgKyBcIicgaXMgbm90IGEgc3RyaW5nIVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBudWxsXHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICAvLyBDaGVjayBmb3IgdGhlIGV4aXN0YW5jZSBvZiBsaW5rcyB3aXRoaW4gdGhlIHRyYW5zbGF0ZWQgc3RyaW5nXHJcbiAgICBpZiAocmV0LmluZGV4T2YoJ0A6JykgPj0gMCkge1xyXG4gICAgICByZXQgPSB0aGlzLl9saW5rKGxvY2FsZSwgbWVzc2FnZSwgcmV0LCBob3N0LCBpbnRlcnBvbGF0ZU1vZGUsIHZhbHVlcyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX3JlbmRlcihyZXQsIGludGVycG9sYXRlTW9kZSwgdmFsdWVzKVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLl9saW5rID0gZnVuY3Rpb24gX2xpbmsgKFxyXG4gICAgbG9jYWxlLFxyXG4gICAgbWVzc2FnZSxcclxuICAgIHN0cixcclxuICAgIGhvc3QsXHJcbiAgICBpbnRlcnBvbGF0ZU1vZGUsXHJcbiAgICB2YWx1ZXNcclxuICApIHtcclxuICAgICAgdmFyIHRoaXMkMSA9IHRoaXM7XHJcblxyXG4gICAgdmFyIHJldCA9IHN0cjtcclxuXHJcbiAgICAvLyBNYXRjaCBhbGwgdGhlIGxpbmtzIHdpdGhpbiB0aGUgbG9jYWxcclxuICAgIC8vIFdlIGFyZSBnb2luZyB0byByZXBsYWNlIGVhY2ggb2ZcclxuICAgIC8vIHRoZW0gd2l0aCBpdHMgdHJhbnNsYXRpb25cclxuICAgIHZhciBtYXRjaGVzID0gcmV0Lm1hdGNoKC8oQDpbXFx3XFwtX3wuXSspL2cpO1xyXG4gICAgZm9yICh2YXIgaWR4IGluIG1hdGNoZXMpIHtcclxuICAgICAgLy8gaWUgY29tcGF0aWJsZTogZmlsdGVyIGN1c3RvbSBhcnJheVxyXG4gICAgICAvLyBwcm90b3R5cGUgbWV0aG9kXHJcbiAgICAgIGlmICghbWF0Y2hlcy5oYXNPd25Qcm9wZXJ0eShpZHgpKSB7XHJcbiAgICAgICAgY29udGludWVcclxuICAgICAgfVxyXG4gICAgICB2YXIgbGluayA9IG1hdGNoZXNbaWR4XTtcclxuICAgICAgLy8gUmVtb3ZlIHRoZSBsZWFkaW5nIEA6XHJcbiAgICAgIHZhciBsaW5rUGxhY2Vob2xkZXIgPSBsaW5rLnN1YnN0cigyKTtcclxuICAgICAgLy8gVHJhbnNsYXRlIHRoZSBsaW5rXHJcbiAgICAgIHZhciB0cmFuc2xhdGVkID0gdGhpcyQxLl9pbnRlcnBvbGF0ZShcclxuICAgICAgICBsb2NhbGUsIG1lc3NhZ2UsIGxpbmtQbGFjZWhvbGRlciwgaG9zdCxcclxuICAgICAgICBpbnRlcnBvbGF0ZU1vZGUgPT09ICdyYXcnID8gJ3N0cmluZycgOiBpbnRlcnBvbGF0ZU1vZGUsXHJcbiAgICAgICAgaW50ZXJwb2xhdGVNb2RlID09PSAncmF3JyA/IHVuZGVmaW5lZCA6IHZhbHVlc1xyXG4gICAgICApO1xyXG5cclxuICAgICAgaWYgKHRoaXMkMS5faXNGYWxsYmFja1Jvb3QodHJhbnNsYXRlZCkpIHtcclxuICAgICAgICBpZiAoIXRoaXMkMS5fc2lsZW50VHJhbnNsYXRpb25XYXJuKSB7XHJcbiAgICAgICAgICB3YXJuKChcIkZhbGwgYmFjayB0byB0cmFuc2xhdGUgdGhlIGxpbmsgcGxhY2Vob2xkZXIgJ1wiICsgbGlua1BsYWNlaG9sZGVyICsgXCInIHdpdGggcm9vdCBsb2NhbGUuXCIpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgICAgaWYgKCF0aGlzJDEuX3Jvb3QpIHsgdGhyb3cgRXJyb3IoJ3VuZXhwZWN0ZWQgZXJyb3InKSB9XHJcbiAgICAgICAgdmFyIHJvb3QgPSB0aGlzJDEuX3Jvb3Q7XHJcbiAgICAgICAgdHJhbnNsYXRlZCA9IHJvb3QuX3RyYW5zbGF0ZShcclxuICAgICAgICAgIHJvb3QuX2dldE1lc3NhZ2VzKCksIHJvb3QubG9jYWxlLCByb290LmZhbGxiYWNrTG9jYWxlLFxyXG4gICAgICAgICAgbGlua1BsYWNlaG9sZGVyLCBob3N0LCBpbnRlcnBvbGF0ZU1vZGUsIHZhbHVlc1xyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgICAgdHJhbnNsYXRlZCA9IHRoaXMkMS5fd2FybkRlZmF1bHQoXHJcbiAgICAgICAgbG9jYWxlLCBsaW5rUGxhY2Vob2xkZXIsIHRyYW5zbGF0ZWQsIGhvc3QsXHJcbiAgICAgICAgQXJyYXkuaXNBcnJheSh2YWx1ZXMpID8gdmFsdWVzIDogW3ZhbHVlc11cclxuICAgICAgKTtcclxuXHJcbiAgICAgIC8vIFJlcGxhY2UgdGhlIGxpbmsgd2l0aCB0aGUgdHJhbnNsYXRlZFxyXG4gICAgICByZXQgPSAhdHJhbnNsYXRlZCA/IHJldCA6IHJldC5yZXBsYWNlKGxpbmssIHRyYW5zbGF0ZWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXRcclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS5fcmVuZGVyID0gZnVuY3Rpb24gX3JlbmRlciAobWVzc2FnZSwgaW50ZXJwb2xhdGVNb2RlLCB2YWx1ZXMpIHtcclxuICAgIHZhciByZXQgPSB0aGlzLl9mb3JtYXR0ZXIuaW50ZXJwb2xhdGUobWVzc2FnZSwgdmFsdWVzKTtcclxuICAgIC8vIGlmIGludGVycG9sYXRlTW9kZSBpcyAqKm5vdCoqICdzdHJpbmcnICgncm93JyksXHJcbiAgICAvLyByZXR1cm4gdGhlIGNvbXBpbGVkIGRhdGEgKGUuZy4gWydmb28nLCBWTm9kZSwgJ2JhciddKSB3aXRoIGZvcm1hdHRlclxyXG4gICAgcmV0dXJuIGludGVycG9sYXRlTW9kZSA9PT0gJ3N0cmluZycgPyByZXQuam9pbignJykgOiByZXRcclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS5fdHJhbnNsYXRlID0gZnVuY3Rpb24gX3RyYW5zbGF0ZSAoXHJcbiAgICBtZXNzYWdlcyxcclxuICAgIGxvY2FsZSxcclxuICAgIGZhbGxiYWNrLFxyXG4gICAga2V5LFxyXG4gICAgaG9zdCxcclxuICAgIGludGVycG9sYXRlTW9kZSxcclxuICAgIGFyZ3NcclxuICApIHtcclxuICAgIHZhciByZXMgPVxyXG4gICAgICB0aGlzLl9pbnRlcnBvbGF0ZShsb2NhbGUsIG1lc3NhZ2VzW2xvY2FsZV0sIGtleSwgaG9zdCwgaW50ZXJwb2xhdGVNb2RlLCBhcmdzKTtcclxuICAgIGlmICghaXNOdWxsKHJlcykpIHsgcmV0dXJuIHJlcyB9XHJcblxyXG4gICAgcmVzID0gdGhpcy5faW50ZXJwb2xhdGUoZmFsbGJhY2ssIG1lc3NhZ2VzW2ZhbGxiYWNrXSwga2V5LCBob3N0LCBpbnRlcnBvbGF0ZU1vZGUsIGFyZ3MpO1xyXG4gICAgaWYgKCFpc051bGwocmVzKSkge1xyXG4gICAgICBpZiAoIXRoaXMuX3NpbGVudFRyYW5zbGF0aW9uV2Fybikge1xyXG4gICAgICAgIHdhcm4oKFwiRmFsbCBiYWNrIHRvIHRyYW5zbGF0ZSB0aGUga2V5cGF0aCAnXCIgKyBrZXkgKyBcIicgd2l0aCAnXCIgKyBmYWxsYmFjayArIFwiJyBsb2NhbGUuXCIpKTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcmVzXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gbnVsbFxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLl90ID0gZnVuY3Rpb24gX3QgKGtleSwgX2xvY2FsZSwgbWVzc2FnZXMsIGhvc3QpIHtcclxuICAgICAgdmFyIHJlZjtcclxuXHJcbiAgICAgIHZhciB2YWx1ZXMgPSBbXSwgbGVuID0gYXJndW1lbnRzLmxlbmd0aCAtIDQ7XHJcbiAgICAgIHdoaWxlICggbGVuLS0gPiAwICkgdmFsdWVzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgNCBdO1xyXG4gICAgaWYgKCFrZXkpIHsgcmV0dXJuICcnIH1cclxuXHJcbiAgICB2YXIgcGFyc2VkQXJncyA9IHBhcnNlQXJncy5hcHBseSh2b2lkIDAsIHZhbHVlcyk7XHJcbiAgICB2YXIgbG9jYWxlID0gcGFyc2VkQXJncy5sb2NhbGUgfHwgX2xvY2FsZTtcclxuXHJcbiAgICB2YXIgcmV0ID0gdGhpcy5fdHJhbnNsYXRlKFxyXG4gICAgICBtZXNzYWdlcywgbG9jYWxlLCB0aGlzLmZhbGxiYWNrTG9jYWxlLCBrZXksXHJcbiAgICAgIGhvc3QsICdzdHJpbmcnLCBwYXJzZWRBcmdzLnBhcmFtc1xyXG4gICAgKTtcclxuICAgIGlmICh0aGlzLl9pc0ZhbGxiYWNrUm9vdChyZXQpKSB7XHJcbiAgICAgIGlmICghdGhpcy5fc2lsZW50VHJhbnNsYXRpb25XYXJuKSB7XHJcbiAgICAgICAgd2FybigoXCJGYWxsIGJhY2sgdG8gdHJhbnNsYXRlIHRoZSBrZXlwYXRoICdcIiArIGtleSArIFwiJyB3aXRoIHJvb3QgbG9jYWxlLlwiKSk7XHJcbiAgICAgIH1cclxuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICAgIGlmICghdGhpcy5fcm9vdCkgeyB0aHJvdyBFcnJvcigndW5leHBlY3RlZCBlcnJvcicpIH1cclxuICAgICAgcmV0dXJuIChyZWYgPSB0aGlzLl9yb290KS50LmFwcGx5KHJlZiwgWyBrZXkgXS5jb25jYXQoIHZhbHVlcyApKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX3dhcm5EZWZhdWx0KGxvY2FsZSwga2V5LCByZXQsIGhvc3QsIHZhbHVlcylcclxuICAgIH1cclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS50ID0gZnVuY3Rpb24gdCAoa2V5KSB7XHJcbiAgICAgIHZhciByZWY7XHJcblxyXG4gICAgICB2YXIgdmFsdWVzID0gW10sIGxlbiA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xyXG4gICAgICB3aGlsZSAoIGxlbi0tID4gMCApIHZhbHVlc1sgbGVuIF0gPSBhcmd1bWVudHNbIGxlbiArIDEgXTtcclxuICAgIHJldHVybiAocmVmID0gdGhpcykuX3QuYXBwbHkocmVmLCBbIGtleSwgdGhpcy5sb2NhbGUsIHRoaXMuX2dldE1lc3NhZ2VzKCksIG51bGwgXS5jb25jYXQoIHZhbHVlcyApKVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLl9pID0gZnVuY3Rpb24gX2kgKGtleSwgbG9jYWxlLCBtZXNzYWdlcywgaG9zdCwgdmFsdWVzKSB7XHJcbiAgICB2YXIgcmV0ID1cclxuICAgICAgdGhpcy5fdHJhbnNsYXRlKG1lc3NhZ2VzLCBsb2NhbGUsIHRoaXMuZmFsbGJhY2tMb2NhbGUsIGtleSwgaG9zdCwgJ3JhdycsIHZhbHVlcyk7XHJcbiAgICBpZiAodGhpcy5faXNGYWxsYmFja1Jvb3QocmV0KSkge1xyXG4gICAgICBpZiAoIXRoaXMuX3NpbGVudFRyYW5zbGF0aW9uV2Fybikge1xyXG4gICAgICAgIHdhcm4oKFwiRmFsbCBiYWNrIHRvIGludGVycG9sYXRlIHRoZSBrZXlwYXRoICdcIiArIGtleSArIFwiJyB3aXRoIHJvb3QgbG9jYWxlLlwiKSk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCF0aGlzLl9yb290KSB7IHRocm93IEVycm9yKCd1bmV4cGVjdGVkIGVycm9yJykgfVxyXG4gICAgICByZXR1cm4gdGhpcy5fcm9vdC5pKGtleSwgbG9jYWxlLCB2YWx1ZXMpXHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gdGhpcy5fd2FybkRlZmF1bHQobG9jYWxlLCBrZXksIHJldCwgaG9zdCwgW3ZhbHVlc10pXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgVnVlSTE4bi5wcm90b3R5cGUuaSA9IGZ1bmN0aW9uIGkgKGtleSwgbG9jYWxlLCB2YWx1ZXMpIHtcclxuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgaWYgKCFrZXkpIHsgcmV0dXJuICcnIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIGxvY2FsZSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgbG9jYWxlID0gdGhpcy5sb2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2koa2V5LCBsb2NhbGUsIHRoaXMuX2dldE1lc3NhZ2VzKCksIG51bGwsIHZhbHVlcylcclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS5fdGMgPSBmdW5jdGlvbiBfdGMgKFxyXG4gICAga2V5LFxyXG4gICAgX2xvY2FsZSxcclxuICAgIG1lc3NhZ2VzLFxyXG4gICAgaG9zdCxcclxuICAgIGNob2ljZVxyXG4gICkge1xyXG4gICAgICB2YXIgcmVmO1xyXG5cclxuICAgICAgdmFyIHZhbHVlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gNTtcclxuICAgICAgd2hpbGUgKCBsZW4tLSA+IDAgKSB2YWx1ZXNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyA1IF07XHJcbiAgICBpZiAoIWtleSkgeyByZXR1cm4gJycgfVxyXG4gICAgaWYgKGNob2ljZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGNob2ljZSA9IDE7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmV0Y2hDaG9pY2UoKHJlZiA9IHRoaXMpLl90LmFwcGx5KHJlZiwgWyBrZXksIF9sb2NhbGUsIG1lc3NhZ2VzLCBob3N0IF0uY29uY2F0KCB2YWx1ZXMgKSksIGNob2ljZSlcclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS50YyA9IGZ1bmN0aW9uIHRjIChrZXksIGNob2ljZSkge1xyXG4gICAgICB2YXIgcmVmO1xyXG5cclxuICAgICAgdmFyIHZhbHVlcyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcclxuICAgICAgd2hpbGUgKCBsZW4tLSA+IDAgKSB2YWx1ZXNbIGxlbiBdID0gYXJndW1lbnRzWyBsZW4gKyAyIF07XHJcbiAgICByZXR1cm4gKHJlZiA9IHRoaXMpLl90Yy5hcHBseShyZWYsIFsga2V5LCB0aGlzLmxvY2FsZSwgdGhpcy5fZ2V0TWVzc2FnZXMoKSwgbnVsbCwgY2hvaWNlIF0uY29uY2F0KCB2YWx1ZXMgKSlcclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS5fdGUgPSBmdW5jdGlvbiBfdGUgKGtleSwgbG9jYWxlLCBtZXNzYWdlcykge1xyXG4gICAgICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMztcclxuICAgICAgd2hpbGUgKCBsZW4tLSA+IDAgKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMyBdO1xyXG5cclxuICAgIHZhciBfbG9jYWxlID0gcGFyc2VBcmdzLmFwcGx5KHZvaWQgMCwgYXJncykubG9jYWxlIHx8IGxvY2FsZTtcclxuICAgIHJldHVybiB0aGlzLl9leGlzdChtZXNzYWdlc1tfbG9jYWxlXSwga2V5KVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLnRlID0gZnVuY3Rpb24gdGUgKGtleSwgbG9jYWxlKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fdGUoa2V5LCB0aGlzLmxvY2FsZSwgdGhpcy5fZ2V0TWVzc2FnZXMoKSwgbG9jYWxlKVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLmdldExvY2FsZU1lc3NhZ2UgPSBmdW5jdGlvbiBnZXRMb2NhbGVNZXNzYWdlIChsb2NhbGUpIHtcclxuICAgIHJldHVybiBsb29zZUNsb25lKHRoaXMuX3ZtLm1lc3NhZ2VzW2xvY2FsZV0gfHwge30pXHJcbiAgfTtcclxuXHJcbiAgVnVlSTE4bi5wcm90b3R5cGUuc2V0TG9jYWxlTWVzc2FnZSA9IGZ1bmN0aW9uIHNldExvY2FsZU1lc3NhZ2UgKGxvY2FsZSwgbWVzc2FnZSkge1xyXG4gICAgdGhpcy5fdm0uJHNldCh0aGlzLl92bS5tZXNzYWdlcywgbG9jYWxlLCBtZXNzYWdlKTtcclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS5tZXJnZUxvY2FsZU1lc3NhZ2UgPSBmdW5jdGlvbiBtZXJnZUxvY2FsZU1lc3NhZ2UgKGxvY2FsZSwgbWVzc2FnZSkge1xyXG4gICAgdGhpcy5fdm0uJHNldCh0aGlzLl92bS5tZXNzYWdlcywgbG9jYWxlLCBWdWUudXRpbC5leHRlbmQodGhpcy5fdm0ubWVzc2FnZXNbbG9jYWxlXSB8fCB7fSwgbWVzc2FnZSkpO1xyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLmdldERhdGVUaW1lRm9ybWF0ID0gZnVuY3Rpb24gZ2V0RGF0ZVRpbWVGb3JtYXQgKGxvY2FsZSkge1xyXG4gICAgcmV0dXJuIGxvb3NlQ2xvbmUodGhpcy5fdm0uZGF0ZVRpbWVGb3JtYXRzW2xvY2FsZV0gfHwge30pXHJcbiAgfTtcclxuXHJcbiAgVnVlSTE4bi5wcm90b3R5cGUuc2V0RGF0ZVRpbWVGb3JtYXQgPSBmdW5jdGlvbiBzZXREYXRlVGltZUZvcm1hdCAobG9jYWxlLCBmb3JtYXQpIHtcclxuICAgIHRoaXMuX3ZtLiRzZXQodGhpcy5fdm0uZGF0ZVRpbWVGb3JtYXRzLCBsb2NhbGUsIGZvcm1hdCk7XHJcbiAgfTtcclxuXHJcbiAgVnVlSTE4bi5wcm90b3R5cGUubWVyZ2VEYXRlVGltZUZvcm1hdCA9IGZ1bmN0aW9uIG1lcmdlRGF0ZVRpbWVGb3JtYXQgKGxvY2FsZSwgZm9ybWF0KSB7XHJcbiAgICB0aGlzLl92bS4kc2V0KHRoaXMuX3ZtLmRhdGVUaW1lRm9ybWF0cywgbG9jYWxlLCBWdWUudXRpbC5leHRlbmQodGhpcy5fdm0uZGF0ZVRpbWVGb3JtYXRzW2xvY2FsZV0gfHwge30sIGZvcm1hdCkpO1xyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLl9sb2NhbGl6ZURhdGVUaW1lID0gZnVuY3Rpb24gX2xvY2FsaXplRGF0ZVRpbWUgKFxyXG4gICAgdmFsdWUsXHJcbiAgICBsb2NhbGUsXHJcbiAgICBmYWxsYmFjayxcclxuICAgIGRhdGVUaW1lRm9ybWF0cyxcclxuICAgIGtleVxyXG4gICkge1xyXG4gICAgdmFyIF9sb2NhbGUgPSBsb2NhbGU7XHJcbiAgICB2YXIgZm9ybWF0cyA9IGRhdGVUaW1lRm9ybWF0c1tfbG9jYWxlXTtcclxuXHJcbiAgICAvLyBmYWxsYmFjayBsb2NhbGVcclxuICAgIGlmIChpc051bGwoZm9ybWF0cykgfHwgaXNOdWxsKGZvcm1hdHNba2V5XSkpIHtcclxuICAgICAge1xyXG4gICAgICAgIHdhcm4oKFwiRmFsbCBiYWNrIHRvICdcIiArIGZhbGxiYWNrICsgXCInIGRhdGV0aW1lIGZvcm1hdHMgZnJvbSAnXCIgKyBsb2NhbGUgKyBcIiBkYXRldGltZSBmb3JtYXRzLlwiKSk7XHJcbiAgICAgIH1cclxuICAgICAgX2xvY2FsZSA9IGZhbGxiYWNrO1xyXG4gICAgICBmb3JtYXRzID0gZGF0ZVRpbWVGb3JtYXRzW19sb2NhbGVdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc051bGwoZm9ybWF0cykgfHwgaXNOdWxsKGZvcm1hdHNba2V5XSkpIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBmb3JtYXQgPSBmb3JtYXRzW2tleV07XHJcbiAgICAgIHZhciBpZCA9IF9sb2NhbGUgKyBcIl9fXCIgKyBrZXk7XHJcbiAgICAgIHZhciBmb3JtYXR0ZXIgPSB0aGlzLl9kYXRlVGltZUZvcm1hdHRlcnNbaWRdO1xyXG4gICAgICBpZiAoIWZvcm1hdHRlcikge1xyXG4gICAgICAgIGZvcm1hdHRlciA9IHRoaXMuX2RhdGVUaW1lRm9ybWF0dGVyc1tpZF0gPSBuZXcgSW50bC5EYXRlVGltZUZvcm1hdChfbG9jYWxlLCBmb3JtYXQpO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBmb3JtYXR0ZXIuZm9ybWF0KHZhbHVlKVxyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLl9kID0gZnVuY3Rpb24gX2QgKHZhbHVlLCBsb2NhbGUsIGtleSkge1xyXG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXHJcbiAgICBpZiAoIVZ1ZUkxOG4uYXZhaWxhYmlsaXRpZXMuZGF0ZVRpbWVGb3JtYXQpIHtcclxuICAgICAgd2FybignQ2Fubm90IGZvcm1hdCBhIERhdGUgdmFsdWUgZHVlIHRvIG5vdCBzdXBwb3J0ZWQgSW50bC5EYXRlVGltZUZvcm1hdC4nKTtcclxuICAgICAgcmV0dXJuICcnXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFrZXkpIHtcclxuICAgICAgcmV0dXJuIG5ldyBJbnRsLkRhdGVUaW1lRm9ybWF0KGxvY2FsZSkuZm9ybWF0KHZhbHVlKVxyXG4gICAgfVxyXG5cclxuICAgIHZhciByZXQgPVxyXG4gICAgICB0aGlzLl9sb2NhbGl6ZURhdGVUaW1lKHZhbHVlLCBsb2NhbGUsIHRoaXMuZmFsbGJhY2tMb2NhbGUsIHRoaXMuX2dldERhdGVUaW1lRm9ybWF0cygpLCBrZXkpO1xyXG4gICAgaWYgKHRoaXMuX2lzRmFsbGJhY2tSb290KHJldCkpIHtcclxuICAgICAge1xyXG4gICAgICAgIHdhcm4oKFwiRmFsbCBiYWNrIHRvIGRhdGV0aW1lIGxvY2FsaXphdGlvbiBvZiByb290OiBrZXkgJ1wiICsga2V5ICsgXCInIC5cIikpO1xyXG4gICAgICB9XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoIXRoaXMuX3Jvb3QpIHsgdGhyb3cgRXJyb3IoJ3VuZXhwZWN0ZWQgZXJyb3InKSB9XHJcbiAgICAgIHJldHVybiB0aGlzLl9yb290LmQodmFsdWUsIGtleSwgbG9jYWxlKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHJldCB8fCAnJ1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLmQgPSBmdW5jdGlvbiBkICh2YWx1ZSkge1xyXG4gICAgICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcclxuICAgICAgd2hpbGUgKCBsZW4tLSA+IDAgKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xyXG5cclxuICAgIHZhciBsb2NhbGUgPSB0aGlzLmxvY2FsZTtcclxuICAgIHZhciBrZXkgPSBudWxsO1xyXG5cclxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAga2V5ID0gYXJnc1swXTtcclxuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChhcmdzWzBdKSkge1xyXG4gICAgICAgIGlmIChhcmdzWzBdLmxvY2FsZSkge1xyXG4gICAgICAgICAgbG9jYWxlID0gYXJnc1swXS5sb2NhbGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhcmdzWzBdLmtleSkge1xyXG4gICAgICAgICAga2V5ID0gYXJnc1swXS5rZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKGFyZ3MubGVuZ3RoID09PSAyKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgYXJnc1swXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBrZXkgPSBhcmdzWzBdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0eXBlb2YgYXJnc1sxXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICBsb2NhbGUgPSBhcmdzWzFdO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2QodmFsdWUsIGxvY2FsZSwga2V5KVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLmdldE51bWJlckZvcm1hdCA9IGZ1bmN0aW9uIGdldE51bWJlckZvcm1hdCAobG9jYWxlKSB7XHJcbiAgICByZXR1cm4gbG9vc2VDbG9uZSh0aGlzLl92bS5udW1iZXJGb3JtYXRzW2xvY2FsZV0gfHwge30pXHJcbiAgfTtcclxuXHJcbiAgVnVlSTE4bi5wcm90b3R5cGUuc2V0TnVtYmVyRm9ybWF0ID0gZnVuY3Rpb24gc2V0TnVtYmVyRm9ybWF0IChsb2NhbGUsIGZvcm1hdCkge1xyXG4gICAgdGhpcy5fdm0uJHNldCh0aGlzLl92bS5udW1iZXJGb3JtYXRzLCBsb2NhbGUsIGZvcm1hdCk7XHJcbiAgfTtcclxuXHJcbiAgVnVlSTE4bi5wcm90b3R5cGUubWVyZ2VOdW1iZXJGb3JtYXQgPSBmdW5jdGlvbiBtZXJnZU51bWJlckZvcm1hdCAobG9jYWxlLCBmb3JtYXQpIHtcclxuICAgIHRoaXMuX3ZtLiRzZXQodGhpcy5fdm0ubnVtYmVyRm9ybWF0cywgbG9jYWxlLCBWdWUudXRpbC5leHRlbmQodGhpcy5fdm0ubnVtYmVyRm9ybWF0c1tsb2NhbGVdIHx8IHt9LCBmb3JtYXQpKTtcclxuICB9O1xyXG5cclxuICBWdWVJMThuLnByb3RvdHlwZS5fbG9jYWxpemVOdW1iZXIgPSBmdW5jdGlvbiBfbG9jYWxpemVOdW1iZXIgKFxyXG4gICAgdmFsdWUsXHJcbiAgICBsb2NhbGUsXHJcbiAgICBmYWxsYmFjayxcclxuICAgIG51bWJlckZvcm1hdHMsXHJcbiAgICBrZXksXHJcbiAgICBvcHRpb25zXHJcbiAgKSB7XHJcbiAgICB2YXIgX2xvY2FsZSA9IGxvY2FsZTtcclxuICAgIHZhciBmb3JtYXRzID0gbnVtYmVyRm9ybWF0c1tfbG9jYWxlXTtcclxuXHJcbiAgICAvLyBmYWxsYmFjayBsb2NhbGVcclxuICAgIGlmIChpc051bGwoZm9ybWF0cykgfHwgaXNOdWxsKGZvcm1hdHNba2V5XSkpIHtcclxuICAgICAge1xyXG4gICAgICAgIHdhcm4oKFwiRmFsbCBiYWNrIHRvICdcIiArIGZhbGxiYWNrICsgXCInIG51bWJlciBmb3JtYXRzIGZyb20gJ1wiICsgbG9jYWxlICsgXCIgbnVtYmVyIGZvcm1hdHMuXCIpKTtcclxuICAgICAgfVxyXG4gICAgICBfbG9jYWxlID0gZmFsbGJhY2s7XHJcbiAgICAgIGZvcm1hdHMgPSBudW1iZXJGb3JtYXRzW19sb2NhbGVdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChpc051bGwoZm9ybWF0cykgfHwgaXNOdWxsKGZvcm1hdHNba2V5XSkpIHtcclxuICAgICAgcmV0dXJuIG51bGxcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHZhciBmb3JtYXQgPSBmb3JtYXRzW2tleV07XHJcblxyXG4gICAgICB2YXIgZm9ybWF0dGVyO1xyXG4gICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgIC8vIElmIG9wdGlvbnMgc3BlY2lmaWVkIC0gY3JlYXRlIG9uZSB0aW1lIG51bWJlciBmb3JtYXR0ZXJcclxuICAgICAgICBmb3JtYXR0ZXIgPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoX2xvY2FsZSwgT2JqZWN0LmFzc2lnbih7fSwgZm9ybWF0LCBvcHRpb25zKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdmFyIGlkID0gX2xvY2FsZSArIFwiX19cIiArIGtleTtcclxuICAgICAgICBmb3JtYXR0ZXIgPSB0aGlzLl9udW1iZXJGb3JtYXR0ZXJzW2lkXTtcclxuICAgICAgICBpZiAoIWZvcm1hdHRlcikge1xyXG4gICAgICAgICAgZm9ybWF0dGVyID0gdGhpcy5fbnVtYmVyRm9ybWF0dGVyc1tpZF0gPSBuZXcgSW50bC5OdW1iZXJGb3JtYXQoX2xvY2FsZSwgZm9ybWF0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGZvcm1hdHRlci5mb3JtYXQodmFsdWUpXHJcbiAgICB9XHJcbiAgfTtcclxuXHJcbiAgVnVlSTE4bi5wcm90b3R5cGUuX24gPSBmdW5jdGlvbiBfbiAodmFsdWUsIGxvY2FsZSwga2V5LCBvcHRpb25zKSB7XHJcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cclxuICAgIGlmICghVnVlSTE4bi5hdmFpbGFiaWxpdGllcy5udW1iZXJGb3JtYXQpIHtcclxuICAgICAgd2FybignQ2Fubm90IGZvcm1hdCBhIE51bWJlciB2YWx1ZSBkdWUgdG8gbm90IHN1cHBvcnRlZCBJbnRsLk51bWJlckZvcm1hdC4nKTtcclxuICAgICAgcmV0dXJuICcnXHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFrZXkpIHtcclxuICAgICAgdmFyIG5mID0gIW9wdGlvbnMgPyBuZXcgSW50bC5OdW1iZXJGb3JtYXQobG9jYWxlKSA6IG5ldyBJbnRsLk51bWJlckZvcm1hdChsb2NhbGUsIG9wdGlvbnMpO1xyXG4gICAgICByZXR1cm4gbmYuZm9ybWF0KHZhbHVlKVxyXG4gICAgfVxyXG5cclxuICAgIHZhciByZXQgPVxyXG4gICAgICB0aGlzLl9sb2NhbGl6ZU51bWJlcih2YWx1ZSwgbG9jYWxlLCB0aGlzLmZhbGxiYWNrTG9jYWxlLCB0aGlzLl9nZXROdW1iZXJGb3JtYXRzKCksIGtleSwgb3B0aW9ucyk7XHJcbiAgICBpZiAodGhpcy5faXNGYWxsYmFja1Jvb3QocmV0KSkge1xyXG4gICAgICB7XHJcbiAgICAgICAgd2FybigoXCJGYWxsIGJhY2sgdG8gbnVtYmVyIGxvY2FsaXphdGlvbiBvZiByb290OiBrZXkgJ1wiICsga2V5ICsgXCInIC5cIikpO1xyXG4gICAgICB9XHJcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xyXG4gICAgICBpZiAoIXRoaXMuX3Jvb3QpIHsgdGhyb3cgRXJyb3IoJ3VuZXhwZWN0ZWQgZXJyb3InKSB9XHJcbiAgICAgIHJldHVybiB0aGlzLl9yb290Lm4odmFsdWUsIE9iamVjdC5hc3NpZ24oe30sIHsga2V5OiBrZXksIGxvY2FsZTogbG9jYWxlIH0sIG9wdGlvbnMpKVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuIHJldCB8fCAnJ1xyXG4gICAgfVxyXG4gIH07XHJcblxyXG4gIFZ1ZUkxOG4ucHJvdG90eXBlLm4gPSBmdW5jdGlvbiBuICh2YWx1ZSkge1xyXG4gICAgICB2YXIgYXJncyA9IFtdLCBsZW4gPSBhcmd1bWVudHMubGVuZ3RoIC0gMTtcclxuICAgICAgd2hpbGUgKCBsZW4tLSA+IDAgKSBhcmdzWyBsZW4gXSA9IGFyZ3VtZW50c1sgbGVuICsgMSBdO1xyXG5cclxuICAgIHZhciBsb2NhbGUgPSB0aGlzLmxvY2FsZTtcclxuICAgIHZhciBrZXkgPSBudWxsO1xyXG4gICAgdmFyIG9wdGlvbnMgPSBudWxsO1xyXG5cclxuICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAga2V5ID0gYXJnc1swXTtcclxuICAgICAgfSBlbHNlIGlmIChpc09iamVjdChhcmdzWzBdKSkge1xyXG4gICAgICAgIGlmIChhcmdzWzBdLmxvY2FsZSkge1xyXG4gICAgICAgICAgbG9jYWxlID0gYXJnc1swXS5sb2NhbGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChhcmdzWzBdLmtleSkge1xyXG4gICAgICAgICAga2V5ID0gYXJnc1swXS5rZXk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBGaWx0ZXIgb3V0IG51bWJlciBmb3JtYXQgb3B0aW9ucyBvbmx5XHJcbiAgICAgICAgb3B0aW9ucyA9IE9iamVjdC5rZXlzKGFyZ3NbMF0pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCBrZXkpIHtcclxuICAgICAgICAgICAgdmFyIG9iajtcclxuXHJcbiAgICAgICAgICBpZiAobnVtYmVyRm9ybWF0S2V5cy5pbmNsdWRlcyhrZXkpKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBhY2MsICggb2JqID0ge30sIG9ialtrZXldID0gYXJnc1swXVtrZXldLCBvYmogKSlcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBhY2NcclxuICAgICAgICB9LCBudWxsKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmIChhcmdzLmxlbmd0aCA9PT0gMikge1xyXG4gICAgICBpZiAodHlwZW9mIGFyZ3NbMF0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAga2V5ID0gYXJnc1swXTtcclxuICAgICAgfVxyXG4gICAgICBpZiAodHlwZW9mIGFyZ3NbMV0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgbG9jYWxlID0gYXJnc1sxXTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLl9uKHZhbHVlLCBsb2NhbGUsIGtleSwgb3B0aW9ucylcclxuICB9O1xyXG5cclxuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyggVnVlSTE4bi5wcm90b3R5cGUsIHByb3RvdHlwZUFjY2Vzc29ycyApO1xyXG5cclxuICBWdWVJMThuLmF2YWlsYWJpbGl0aWVzID0ge1xyXG4gICAgZGF0ZVRpbWVGb3JtYXQ6IGNhblVzZURhdGVUaW1lRm9ybWF0LFxyXG4gICAgbnVtYmVyRm9ybWF0OiBjYW5Vc2VOdW1iZXJGb3JtYXRcclxuICB9O1xyXG4gIFZ1ZUkxOG4uaW5zdGFsbCA9IGluc3RhbGw7XHJcbiAgVnVlSTE4bi52ZXJzaW9uID0gJzguMS4wJztcclxuXHJcbiAgcmV0dXJuIFZ1ZUkxOG47XHJcblxyXG59KSkpOyJdfQ==
