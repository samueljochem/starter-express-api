!function(t,o) {
    "object" == typeof exports && "object" == typeof module ?
        module.exports = o() : "function" == typeof define && define.amd ?
            define([],o) : "object" == typeof exports ?
                exports["new-kt-js"] = o() : t["new-kt-js"] = o()
}(this,(() => {
    return t = {
        744: function(t,o) {
            var e,n;
            void 0 === ArrayBuffer.isView && (ArrayBuffer.isView = function(t) {
                return null != t && null != t.__proto__ && t.__proto__.__proto__ === Int8Array.prototype.__proto__
            }),
                void 0 === (n = "function" == typeof (e = function(t) {
                    "use strict";
                    var o,e,n,r,i,a,c,u,p = ArrayBuffer.isView; function s(t,o,e,n) {
                        var r,i,a,c,u,s; if(0 <= o ? (l(),a = o <= 255) : a = !1,a ?
                            (0 <= e ? (l(),c = e <= 255) : c = !1,i = c) : i = !1,i ?
                                (0 <= n ? (l(),u = n <= 255) : u = !1,r = u) : r = !1,!r)
                            throw S(null == (s = "Version components are out of range: " + o + "." + e + "." + n) ?
                                "null" : function(t) {return o = t,!!Array.isArray(o) || p(t); var o}(s) ? "[...]" :
                                    s.toString()); return ((o << 16) + (e << 8) | 0) + n | 0
                    } function f() {
                        o = this,this.a_1 = 255,this.b_1 = (null == e && new $,e).c()
                    } function l() {
                        return null == o && new f,o
                    } function d(t,o,e) {
                        l(),this.d_1 = t,this.e_1 = o,
                            this.f_1 = e,this.g_1 = s(0,this.d_1,this.e_1,this.f_1)
                    } function $() {
                        e = this
                    } function v() {} function y() {n = this} function _() {r = this} function m(t,o) {
                        null == r && new _,this.h_1 = t,this.i_1 = o
                    } function h(t,o) {
                        null != Error.captureStackTrace ? Error.captureStackTrace(t,o) :
                            t.stack = (new Error).stack
                    } function g(t,o,e) {
                        Error.call(t),function(t,o,e) {
                            if(!w(t,"message")) {
                                var n; if(null == o) {
                                    var r; if(null !== o) {
                                        var i = null == e ? null : e.toString(); r = null == i ? void 0 : i
                                    } else r = void 0; n = r
                                } else n = o; t.message = n
                            } w(t,"cause") || (t.cause = e),t.name = Object.getPrototypeOf(t).constructor.name
                        }(t,o,e)
                    } function w(t,o) {return Object.getPrototypeOf(t).hasOwnProperty(o)} function b(t,o,e,n,r,i) {
                        return C("class",t,o,e,n,r,i)
                    } function C(t,o,e,n,r,i,a) {return {kind: t,simpleName: o,interfaceId: "interface" === t ? -1 : void 0,interfaces: e || [],associatedObjectKey: n,associatedObjects: r,suspendArity: i,fastPrototype: a,$kClass$: void 0,interfacesCache: {isComplete: void 0 === a && (void 0 === e || 0 === e.length),implementInterfaceMemo: {}}}} function j(t,o,e,n,r,i) {return C("object",t,o,e,n,r,i)} function x() {
                        h(this,x)
                    } function O(t,o) {return function(t,o) {(function(t,o) {g(o,t,void 0),x.call(o)})(t,o),E.call(o)}(t,o),A.call(o),o} function S(t) {
                        var o = O(t,Object.create(A.prototype)); return h(o,S),o
                    } function A() {h(this,A)} function E() {
                        h(this,E)
                    } return x.prototype = Object.create(Error.prototype),x.prototype.constructor = x,
                        E.prototype = Object.create(x.prototype),E.prototype.constructor = E,A.prototype = Object.create(E.prototype),A.prototype.constructor = A,f.$metadata$ = j("Companion"),d.prototype.toString = function() {return this.d_1 + "." + this.e_1 + "." + this.f_1},d.$metadata$ = b("KotlinVersion",[v]),$.prototype.c = function() {return new d(1,7,20)},$.$metadata$ = j("KotlinVersionCurrentValue"),v.$metadata$ = C("interface","Comparable",i,a,c,u,void 0),y.prototype.toString = function() {
                            return "kotlin.Unit"
                        },y.$metadata$ = j("Unit"),_.$metadata$ = j("Companion"),m.prototype.toString = function() {return this.h_1},m.$metadata$ = b("Enum",[v]),x.$metadata$ = b("Exception",void 0,void 0,void 0,void 0,Error.prototype),A.$metadata$ = b("IllegalArgumentException",void 0,void 0,void 0,void 0,E.prototype),E.$metadata$ = b("RuntimeException",void 0,void 0,void 0,void 0,x.prototype),t.$_$ = t.$_$ || {},t.$_$.a = l,t.$_$.b = function() {return null == n && new y,n},t.$_$.c = b,t.$_$.d = m,t
                }) ? e.apply(o,[o]) : e) || (t.exports = n)
        },970: function(t,o,e) {
            var n,r,i; r = [o,e(744)],void 0 === (i = "function" == typeof (n = function(t,o) {
                "use strict"; var e,n,r,i = o.$_$.b,a = o.$_$.d,c = o.$_$.c,u = o.$_$.a; function p(t,o) {
                    a.call(this,t,o)
                } function s() {r || (r = !0,e = u())} return p.prototype = Object.create(a.prototype),p.prototype.constructor = p,p.$metadata$ = c("Language",void 0,void 0,void 0,void 0,a.prototype),s(),CMS.Console.log("Hello, " + (s(),"Kotlin Plugin running on version " + (s(),e).b_1 + "!")),function() {
                    if(n) return i(); n = !0,new p("JAVA",0),new p("JAVASCRIPT",1),new p("KOTLIN",2),new p("TYPESCRIPT",3),new p("PYTHON",4),new p("C",5)
                }(),CMS.Console.log(CMS.Core.version.toString()),console.log(u()),t
            }) ? n.apply(o,r) : n) || (t.exports = i)
        }
    },o = {},function e(n) {
        var r = o[n]; if(void 0 !== r) return r.exports; var i = o[n] = {
            exports: {}
        }; return t[n].call(i.exports,i,i.exports,e),i.exports
    }(970); var t,o
}));
