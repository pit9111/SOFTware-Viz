/*!
 * chartjs-plugin-datalabels v2.0.0
 * https://chartjs-plugin-datalabels.netlify.app
 * (c) 2017-2021 chartjs-plugin-datalabels contributors
 * Released under the MIT license
 */
!function(t, e) {
    "object" == typeof exports && "undefined" != typeof module ? module.exports = e(require("chart.js/helpers"), require("chart.js")) : "function" == typeof define && define.amd ? define(["chart.js/helpers", "chart.js"], e) : (t = "undefined" != typeof globalThis ? globalThis : t || self).ChartDataLabels = e(t.Chart.helpers, t.Chart)
}(this, (function(t, e) {
    "use strict";
    var r = function() {
        if ("undefined" != typeof window) {
            if (window.devicePixelRatio)
                return window.devicePixelRatio;
            var t = window.screen;
            if (t)
                return (t.deviceXDPI || 1) / (t.logicalXDPI || 1)
        }
        return 1
    }()
      , a = function(e) {
        var r, a = [];
        for (e = [].concat(e); e.length; )
            "string" == typeof (r = e.pop()) ? a.unshift.apply(a, r.split("\n")) : Array.isArray(r) ? e.push.apply(e, r) : t.isNullOrUndef(e) || a.unshift("" + r);
        return a
    }
      , o = function(t, e, r) {
        var a, o = [].concat(e), n = o.length, i = t.font, l = 0;
        for (t.font = r.string,
        a = 0; a < n; ++a)
            l = Math.max(t.measureText(o[a]).width, l);
        return t.font = i,
        {
            height: n * r.lineHeight,
            width: l
        }
    }
      , n = function(t, e, r) {
        return Math.max(t, Math.min(e, r))
    }
      , i = function(t, e) {
        var r, a, o, n, i = t.slice(), l = [];
        for (r = 0,
        o = e.length; r < o; ++r)
            n = e[r],
            -1 === (a = i.indexOf(n)) ? l.push([n, 1]) : i.splice(a, 1);
        for (r = 0,
        o = i.length; r < o; ++r)
            l.push([i[r], -1]);
        return l
    };
    function l(t, e) {
        var r = e.x
          , a = e.y;
        if (null === r)
            return {
                x: 0,
                y: -1
            };
        if (null === a)
            return {
                x: 1,
                y: 0
            };
        var o = t.x - r
          , n = t.y - a
          , i = Math.sqrt(o * o + n * n);
        return {
            x: i ? o / i : 0,
            y: i ? n / i : -1
        }
    }
    function s(t, e, r) {
        var a = 0;
        return t < r.left ? a |= 1 : t > r.right && (a |= 2),
        e < r.top ? a |= 8 : e > r.bottom && (a |= 4),
        a
    }
    function u(t, e) {
        var r, a, o = e.anchor, n = t;
        return e.clamp && (n = function(t, e) {
            for (var r, a, o, n = t.x0, i = t.y0, l = t.x1, u = t.y1, d = s(n, i, e), c = s(l, u, e); d | c && !(d & c); )
                8 & (r = d || c) ? (a = n + (l - n) * (e.top - i) / (u - i),
                o = e.top) : 4 & r ? (a = n + (l - n) * (e.bottom - i) / (u - i),
                o = e.bottom) : 2 & r ? (o = i + (u - i) * (e.right - n) / (l - n),
                a = e.right) : 1 & r && (o = i + (u - i) * (e.left - n) / (l - n),
                a = e.left),
                r === d ? d = s(n = a, i = o, e) : c = s(l = a, u = o, e);
            return {
                x0: n,
                x1: l,
                y0: i,
                y1: u
            }
        }(n, e.area)),
        "start" === o ? (r = n.x0,
        a = n.y0) : "end" === o ? (r = n.x1,
        a = n.y1) : (r = (n.x0 + n.x1) / 2,
        a = (n.y0 + n.y1) / 2),
        function(t, e, r, a, o) {
            switch (o) {
            case "center":
                r = a = 0;
                break;
            case "bottom":
                r = 0,
                a = 1;
                break;
            case "right":
                r = 1,
                a = 0;
                break;
            case "left":
                r = -1,
                a = 0;
                break;
            case "top":
                r = 0,
                a = -1;
                break;
            case "start":
                r = -r,
                a = -a;
                break;
            case "end":
                break;
            default:
                o *= Math.PI / 180,
                r = Math.cos(o),
                a = Math.sin(o)
            }
            return {
                x: t,
                y: e,
                vx: r,
                vy: a
            }
        }(r, a, t.vx, t.vy, e.align)
    }
    var d = function(t, e) {
        var r = (t.startAngle + t.endAngle) / 2
          , a = Math.cos(r)
          , o = Math.sin(r)
          , n = t.innerRadius
          , i = t.outerRadius;
        return u({
            x0: t.x + a * n,
            y0: t.y + o * n,
            x1: t.x + a * i,
            y1: t.y + o * i,
            vx: a,
            vy: o
        }, e)
    }
      , c = function(t, e) {
        var r = l(t, e.origin)
          , a = r.x * t.options.radius
          , o = r.y * t.options.radius;
        return u({
            x0: t.x - a,
            y0: t.y - o,
            x1: t.x + a,
            y1: t.y + o,
            vx: r.x,
            vy: r.y
        }, e)
    }
      , h = function(t, e) {
        var r = l(t, e.origin)
          , a = t.x
          , o = t.y
          , n = 0
          , i = 0;
        return t.horizontal ? (a = Math.min(t.x, t.base),
        n = Math.abs(t.base - t.x)) : (o = Math.min(t.y, t.base),
        i = Math.abs(t.base - t.y)),
        u({
            x0: a,
            y0: o + i,
            x1: a + n,
            y1: o,
            vx: r.x,
            vy: r.y
        }, e)
    }
      , f = function(t, e) {
        var r = l(t, e.origin);
        return u({
            x0: t.x,
            y0: t.y,
            x1: t.x,
            y1: t.y,
            vx: r.x,
            vy: r.y
        }, e)
    }
      , x = function(t) {
        return Math.round(t * r) / r
    };
    function y(t, e) {
        var r = e.chart.getDatasetMeta(e.datasetIndex).vScale;
        if (!r)
            return null;
        if (void 0 !== r.xCenter && void 0 !== r.yCenter)
            return {
                x: r.xCenter,
                y: r.yCenter
            };
        var a = r.getBasePixel();
        return t.horizontal ? {
            x: a,
            y: null
        } : {
            x: null,
            y: a
        }
    }
    function v(t, e, r) {
        var a = r.backgroundColor
          , o = r.borderColor
          , n = r.borderWidth;
        (a || o && n) && (t.beginPath(),
        function(t, e, r, a, o, n) {
            var i = Math.PI / 2;
            if (n) {
                var l = Math.min(n, o / 2, a / 2)
                  , s = e + l
                  , u = r + l
                  , d = e + a - l
                  , c = r + o - l;
                t.moveTo(e, u),
                s < d && u < c ? (t.arc(s, u, l, -Math.PI, -i),
                t.arc(d, u, l, -i, 0),
                t.arc(d, c, l, 0, i),
                t.arc(s, c, l, i, Math.PI)) : s < d ? (t.moveTo(s, r),
                t.arc(d, u, l, -i, i),
                t.arc(s, u, l, i, Math.PI + i)) : u < c ? (t.arc(s, u, l, -Math.PI, 0),
                t.arc(s, c, l, 0, Math.PI)) : t.arc(s, u, l, -Math.PI, Math.PI),
                t.closePath(),
                t.moveTo(e, r)
            } else
                t.rect(e, r, a, o)
        }(t, x(e.x) + n / 2, x(e.y) + n / 2, x(e.w) - n, x(e.h) - n, r.borderRadius),
        t.closePath(),
        a && (t.fillStyle = a,
        t.fill()),
        o && n && (t.strokeStyle = o,
        t.lineWidth = n,
        t.lineJoin = "miter",
        t.stroke()))
    }
    function b(t, e, r) {
        var a = t.shadowBlur
          , o = r.stroked
          , n = x(r.x)
          , i = x(r.y)
          , l = x(r.w);
        o && t.strokeText(e, n, i, l),
        r.filled && (a && o && (t.shadowBlur = 0),
        t.fillText(e, n, i, l),
        a && o && (t.shadowBlur = a))
    }
    var _ = function(t, e, r, a) {
        var o = this;
        o._config = t,
        o._index = a,
        o._model = null,
        o._rects = null,
        o._ctx = e,
        o._el = r
    };
    t.merge(_.prototype, {
        _modelize: function(r, a, n, i) {
            var l, s = this, u = s._index, x = t.toFont(t.resolve([n.font, {}], i, u)), v = t.resolve([n.color, e.defaults.color], i, u);
            return {
                align: t.resolve([n.align, "center"], i, u),
                anchor: t.resolve([n.anchor, "center"], i, u),
                area: i.chart.chartArea,
                backgroundColor: t.resolve([n.backgroundColor, null], i, u),
                borderColor: t.resolve([n.borderColor, null], i, u),
                borderRadius: t.resolve([n.borderRadius, 0], i, u),
                borderWidth: t.resolve([n.borderWidth, 0], i, u),
                clamp: t.resolve([n.clamp, !1], i, u),
                clip: t.resolve([n.clip, !1], i, u),
                color: v,
                display: r,
                font: x,
                lines: a,
                offset: t.resolve([n.offset, 0], i, u),
                opacity: t.resolve([n.opacity, 1], i, u),
                origin: y(s._el, i),
                padding: t.toPadding(t.resolve([n.padding, 0], i, u)),
                positioner: (l = s._el,
                l instanceof e.ArcElement ? d : l instanceof e.PointElement ? c : l instanceof e.BarElement ? h : f),
                rotation: t.resolve([n.rotation, 0], i, u) * (Math.PI / 180),
                size: o(s._ctx, a, x),
                textAlign: t.resolve([n.textAlign, "start"], i, u),
                textShadowBlur: t.resolve([n.textShadowBlur, 0], i, u),
                textShadowColor: t.resolve([n.textShadowColor, v], i, u),
                textStrokeColor: t.resolve([n.textStrokeColor, v], i, u),
                textStrokeWidth: t.resolve([n.textStrokeWidth, 0], i, u)
            }
        },
        update: function(e) {
            var r, o, n, i = this, l = null, s = null, u = i._index, d = i._config, c = t.resolve([d.display, !0], e, u);
            c && (r = e.dataset.data[u],
            o = t.valueOrDefault(t.callback(d.formatter, [r, e]), r),
            (n = t.isNullOrUndef(o) ? [] : a(o)).length && (s = function(t) {
                var e = t.borderWidth || 0
                  , r = t.padding
                  , a = t.size.height
                  , o = t.size.width
                  , n = -o / 2
                  , i = -a / 2;
                return {
                    frame: {
                        x: n - r.left - e,
                        y: i - r.top - e,
                        w: o + r.width + 2 * e,
                        h: a + r.height + 2 * e
                    },
                    text: {
                        x: n,
                        y: i,
                        w: o,
                        h: a
                    }
                }
            }(l = i._modelize(c, n, d, e)))),
            i._model = l,
            i._rects = s
        },
        geometry: function() {
            return this._rects ? this._rects.frame : {}
        },
        rotation: function() {
            return this._model ? this._model.rotation : 0
        },
        visible: function() {
            return this._model && this._model.opacity
        },
        model: function() {
            return this._model
        },
        draw: function(t, e) {
            var r, a = t.ctx, o = this._model, i = this._rects;
            this.visible() && (a.save(),
            o.clip && (r = o.area,
            a.beginPath(),
            a.rect(r.left, r.top, r.right - r.left, r.bottom - r.top),
            a.clip()),
            a.globalAlpha = n(0, o.opacity, 1),
            a.translate(x(e.x), x(e.y)),
            a.rotate(o.rotation),
            v(a, i.frame, o),
            function(t, e, r, a) {
                var o, n = a.textAlign, i = a.color, l = !!i, s = a.font, u = e.length, d = a.textStrokeColor, c = a.textStrokeWidth, h = d && c;
                if (u && (l || h))
                    for (r = function(t, e, r) {
                        var a = r.lineHeight
                          , o = t.w
                          , n = t.x;
                        return "center" === e ? n += o / 2 : "end" !== e && "right" !== e || (n += o),
                        {
                            h: a,
                            w: o,
                            x: n,
                            y: t.y + a / 2
                        }
                    }(r, n, s),
                    t.font = s.string,
                    t.textAlign = n,
                    t.textBaseline = "middle",
                    t.shadowBlur = a.textShadowBlur,
                    t.shadowColor = a.textShadowColor,
                    l && (t.fillStyle = i),
                    h && (t.lineJoin = "round",
                    t.lineWidth = c,
                    t.strokeStyle = d),
                    o = 0,
                    u = e.length; o < u; ++o)
                        b(t, e[o], {
                            stroked: h,
                            filled: l,
                            w: r.w,
                            x: r.x,
                            y: r.y + r.h * o
                        })
            }(a, o.lines, i.text, o),
            a.restore())
        }
    });
    var p = Number.MIN_SAFE_INTEGER || -9007199254740991
      , g = Number.MAX_SAFE_INTEGER || 9007199254740991;
    function m(t, e, r) {
        var a = Math.cos(r)
          , o = Math.sin(r)
          , n = e.x
          , i = e.y;
        return {
            x: n + a * (t.x - n) - o * (t.y - i),
            y: i + o * (t.x - n) + a * (t.y - i)
        }
    }
    function w(t, e) {
        var r, a, o, n, i, l = g, s = p, u = e.origin;
        for (r = 0; r < t.length; ++r)
            o = (a = t[r]).x - u.x,
            n = a.y - u.y,
            i = e.vx * o + e.vy * n,
            l = Math.min(l, i),
            s = Math.max(s, i);
        return {
            min: l,
            max: s
        }
    }
    function M(t, e) {
        var r = e.x - t.x
          , a = e.y - t.y
          , o = Math.sqrt(r * r + a * a);
        return {
            vx: (e.x - t.x) / o,
            vy: (e.y - t.y) / o,
            origin: t,
            ln: o
        }
    }
    var k = function() {
        this._rotation = 0,
        this._rect = {
            x: 0,
            y: 0,
            w: 0,
            h: 0
        }
    };
    function $(t, e, r) {
        var a = e.positioner(t, e)
          , o = a.vx
          , n = a.vy;
        if (!o && !n)
            return {
                x: a.x,
                y: a.y
            };
        var i = r.w
          , l = r.h
          , s = e.rotation
          , u = Math.abs(i / 2 * Math.cos(s)) + Math.abs(l / 2 * Math.sin(s))
          , d = Math.abs(i / 2 * Math.sin(s)) + Math.abs(l / 2 * Math.cos(s))
          , c = 1 / Math.max(Math.abs(o), Math.abs(n));
        return u *= o * c,
        d *= n * c,
        u += e.offset * o,
        d += e.offset * n,
        {
            x: a.x + u,
            y: a.y + d
        }
    }
    t.merge(k.prototype, {
        center: function() {
            var t = this._rect;
            return {
                x: t.x + t.w / 2,
                y: t.y + t.h / 2
            }
        },
        update: function(t, e, r) {
            this._rotation = r,
            this._rect = {
                x: e.x + t.x,
                y: e.y + t.y,
                w: e.w,
                h: e.h
            }
        },
        contains: function(t) {
            var e = this
              , r = e._rect;
            return !((t = m(t, e.center(), -e._rotation)).x < r.x - 1 || t.y < r.y - 1 || t.x > r.x + r.w + 2 || t.y > r.y + r.h + 2)
        },
        intersects: function(t) {
            var e, r, a, o = this._points(), n = t._points(), i = [M(o[0], o[1]), M(o[0], o[3])];
            for (this._rotation !== t._rotation && i.push(M(n[0], n[1]), M(n[0], n[3])),
            e = 0; e < i.length; ++e)
                if (r = w(o, i[e]),
                a = w(n, i[e]),
                r.max < a.min || a.max < r.min)
                    return !1;
            return !0
        },
        _points: function() {
            var t = this
              , e = t._rect
              , r = t._rotation
              , a = t.center();
            return [m({
                x: e.x,
                y: e.y
            }, a, r), m({
                x: e.x + e.w,
                y: e.y
            }, a, r), m({
                x: e.x + e.w,
                y: e.y + e.h
            }, a, r), m({
                x: e.x,
                y: e.y + e.h
            }, a, r)]
        }
    });
    var C = {
        prepare: function(t) {
            var e, r, a, o, n, i = [];
            for (e = 0,
            a = t.length; e < a; ++e)
                for (r = 0,
                o = t[e].length; r < o; ++r)
                    n = t[e][r],
                    i.push(n),
                    n.$layout = {
                        _box: new k,
                        _hidable: !1,
                        _visible: !0,
                        _set: e,
                        _idx: r
                    };
            return i.sort((function(t, e) {
                var r = t.$layout
                  , a = e.$layout;
                return r._idx === a._idx ? a._set - r._set : a._idx - r._idx
            }
            )),
            this.update(i),
            i
        },
        update: function(t) {
            var e, r, a, o, n, i = !1;
            for (e = 0,
            r = t.length; e < r; ++e)
                o = (a = t[e]).model(),
                (n = a.$layout)._hidable = o && "auto" === o.display,
                n._visible = a.visible(),
                i |= n._hidable;
            i && function(t) {
                var e, r, a, o, n, i, l;
                for (e = 0,
                r = t.length; e < r; ++e)
                    (o = (a = t[e]).$layout)._visible && (l = new Proxy(a._el,{
                        get: (t,e)=>t.getProps([e], !0)[e]
                    }),
                    n = a.geometry(),
                    i = $(l, a.model(), n),
                    o._box.update(i, n, a.rotation()));
                (function(t, e) {
                    var r, a, o, n;
                    for (r = t.length - 1; r >= 0; --r)
                        for (o = t[r].$layout,
                        a = r - 1; a >= 0 && o._visible; --a)
                            (n = t[a].$layout)._visible && o._box.intersects(n._box) && e(o, n)
                }
                )(t, (function(t, e) {
                    var r = t._hidable
                      , a = e._hidable;
                    r && a || a ? e._visible = !1 : r && (t._visible = !1)
                }
                ))
            }(t)
        },
        lookup: function(t, e) {
            var r, a;
            for (r = t.length - 1; r >= 0; --r)
                if ((a = t[r].$layout) && a._visible && a._box.contains(e))
                    return t[r];
            return null
        },
        draw: function(t, e) {
            var r, a, o, n, i, l;
            for (r = 0,
            a = e.length; r < a; ++r)
                (n = (o = e[r]).$layout)._visible && (i = o.geometry(),
                l = $(o._el, o.model(), i),
                n._box.update(l, i, o.rotation()),
                o.draw(t, l))
        }
    }
      , P = "$default";
    function S(e, r, a) {
        if (r) {
            var o, n = a.$context, i = a.$groups;
            r[i._set] && (o = r[i._set][i._key]) && !0 === t.callback(o, [n]) && (e.$datalabels._dirty = !0,
            a.update(n))
        }
    }
    function I(t, e) {
        var r, a, o = t.$datalabels, n = o._listeners;
        if (n.enter || n.leave) {
            if ("mousemove" === e.type)
                a = C.lookup(o._labels, e);
            else if ("mouseout" !== e.type)
                return;
            r = o._hovered,
            o._hovered = a,
            function(t, e, r, a) {
                var o, n;
                (r || a) && (r ? a ? r !== a && (n = o = !0) : n = !0 : o = !0,
                n && S(t, e.leave, r),
                o && S(t, e.enter, a))
            }(t, n, r, a)
        }
    }
    return {
        id: "datalabels",
        defaults: {
            align: "center",
            anchor: "center",
            backgroundColor: null,
            borderColor: null,
            borderRadius: 0,
            borderWidth: 0,
            clamp: !1,
            clip: !1,
            color: void 0,
            display: !0,
            font: {
                family: void 0,
                lineHeight: 1.2,
                size: void 0,
                style: void 0,
                weight: null
            },
            formatter: function(e) {
                if (t.isNullOrUndef(e))
                    return null;
                var r, a, o, n = e;
                if (t.isObject(e))
                    if (t.isNullOrUndef(e.label))
                        if (t.isNullOrUndef(e.r))
                            for (n = "",
                            o = 0,
                            a = (r = Object.keys(e)).length; o < a; ++o)
                                n += (0 !== o ? ", " : "") + r[o] + ": " + e[r[o]];
                        else
                            n = e.r;
                    else
                        n = e.label;
                return "" + n
            },
            labels: void 0,
            listeners: {},
            offset: 4,
            opacity: 1,
            padding: {
                top: 4,
                right: 4,
                bottom: 4,
                left: 4
            },
            rotation: 0,
            textAlign: "start",
            textStrokeColor: void 0,
            textStrokeWidth: 0,
            textShadowBlur: 0,
            textShadowColor: void 0
        },
        beforeInit: function(t) {
            t.$datalabels = {
                _actives: []
            }
        },
        beforeUpdate: function(t) {
            var e = t.$datalabels;
            e._listened = !1,
            e._listeners = {},
            e._datasets = [],
            e._labels = []
        },
        afterDatasetUpdate: function(e, r, a) {
            var o, n, i, l, s, u, d, c, h = r.index, f = e.$datalabels, x = f._datasets[h] = [], y = e.isDatasetVisible(h), v = e.data.datasets[h], b = function(e, r) {
                var a, o, n, i = e.datalabels, l = [];
                return !1 === i ? null : (!0 === i && (i = {}),
                r = t.merge({}, [r, i]),
                o = r.labels || {},
                n = Object.keys(o),
                delete r.labels,
                n.length ? n.forEach((function(e) {
                    o[e] && l.push(t.merge({}, [r, o[e], {
                        _key: e
                    }]))
                }
                )) : l.push(r),
                a = l.reduce((function(e, r) {
                    return t.each(r.listeners || {}, (function(t, a) {
                        e[a] = e[a] || {},
                        e[a][r._key || P] = t
                    }
                    )),
                    delete r.listeners,
                    e
                }
                ), {}),
                {
                    labels: l,
                    listeners: a
                })
            }(v, a), p = r.meta.data || [], g = e.ctx;
            for (g.save(),
            o = 0,
            i = p.length; o < i; ++o)
                if ((d = p[o]).$datalabels = [],
                y && d && e.getDataVisibility(o) && !d.skip)
                    for (n = 0,
                    l = b.labels.length; n < l; ++n)
                        u = (s = b.labels[n])._key,
                        (c = new _(s,g,d,o)).$groups = {
                            _set: h,
                            _key: u || P
                        },
                        c.$context = {
                            active: !1,
                            chart: e,
                            dataIndex: o,
                            dataset: v,
                            datasetIndex: h
                        },
                        v.data.forEach(item => {
                            if (item.display_custom == 'on') {
                            }
                        }),
                        c.update(c.$context),
                        d.$datalabels.push(c),
                        x.push(c);
            g.restore(),
            t.merge(f._listeners, b.listeners, {
                merger: function(t, e, a) {
                    e[t] = e[t] || {},
                    e[t][r.index] = a[t],
                    f._listened = !0
                }
            })
        },
        afterUpdate: function(t, e) {
            t.$datalabels._labels = C.prepare(t.$datalabels._datasets, e)
        },
        afterDatasetsDraw: function(t) {
            C.draw(t, t.$datalabels._labels)
        },
        beforeEvent: function(t, e) {
            if (t.$datalabels._listened) {
                var r = e.event;
                switch (r.type) {
                case "mousemove":
                case "mouseout":
                    I(t, r);
                    break;
                case "click":
                    !function(t, e) {
                        var r = t.$datalabels
                          , a = r._listeners.click
                          , o = a && C.lookup(r._labels, e);
                        o && S(t, a, o)
                    }(t, r)
                }
            }
        },
        afterEvent: function(t) {
            var e, r, a, o, n, l, s, u = t.$datalabels, d = u._actives, c = u._actives = t.getActiveElements(), h = i(d, c);
            for (e = 0,
            r = h.length; e < r; ++e)
                if ((n = h[e])[1])
                    for (a = 0,
                    o = (s = n[0].element.$datalabels || []).length; a < o; ++a)
                        (l = s[a]).$context.active = 1 === n[1],
                        l.update(l.$context);
            (u._dirty || h.length) && (C.update(u._labels),
            t.render()),
            delete u._dirty
        }
    }
}
));
