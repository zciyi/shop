var toString = Object.prototype.toString;
require("promise");
var util = {}

function isType(type) {
    return function(el) {
        return Object.prototype.toString.call(el) === '[object ' + type + ']'
    }
}
var isArray = isType('Array')
var isObject = isType('Object')
var isFunction = isType('Function')
var isString = isType('String')
var isNumber = isType('Number');

var isUndefined = function(obj) {
    return typeof obj === 'undefined'
}
var extend = (function() {
    if (typeof Object.assign === 'function') {
        return Object.assign
    } else {
        return function(target) {
            if (target == null) {
                throw new TypeError('Cannot convert undefined or null to object')
            }
            target = Object(target)
            for (var index = 1; index < arguments.length; index++) {
                var source = arguments[index]
                if (source != null) {
                    for (var key in source) {
                        if (Object.prototype.hasOwnProperty.call(source, key)) {
                            target[key] = source[key]
                        }
                    }
                }
            }
            return target
        }
    }
})()
util = {
    isArray: isArray,
    isObject: isObject,
    isFunction: isFunction,
    isString: isString,
    isUndefined: isUndefined,
    isNumber: isNumber,
    extend: extend,
}


function isEmptyObject(obj) {
    return util.isObject(obj) && Object.keys(obj).length === 0
}
util.isEmptyObject = isEmptyObject


/**
 * 获取环境信息
 * @return {Object} 环境信息对象
 */
function getEnv() {
    var nav = window.navigator;
    var env = {
        "iphone": false,
        "ipad": false,
        "android": false,
        "pc": false,
        "ios": false,
        "ver": "0"
    };

    var ua = nav.userAgent;
    var android = ua.match(/(Android)\s+([\d.]+)/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);
    if (ipad) {
        env.ipad = ipad[1] && true || false;
        env.ver = ipad[2] && ipad[2].replace(/-/g, ".") || "";
        env.ios = true;
    } else if (iphone) {
        env.iphone = iphone[1] && true || false;
        env.ver = iphone[2] && iphone[2].replace(/-/g, ".") || "";
        env.ios = true;
    } else if (android) {
        env.android = android[1] && true || false;
        env.ver = android[2];
    } else {
        env.pc = true;
    }

    return env;
}

var ENV = getEnv();

util.env = ENV;

// cookie写操作，过期时间单位(s)
util.setCookie = function(name, value, config) {
    config = extend({
        path: '/'
    }, config || {})
    var defVal = {
        path: '/'
    }
    var cookie = [name + '=' + value]
    Object.keys(config).forEach(function(key) {
        if (key === 'expires' && config.expires) {
            return cookie.push('expires=' + new Date(+new Date() + config.expires * 24 * 3600 * 1000).toGMTString())
        }
        cookie.push(key + '=' + (config[key] || defVal[key] || ''))
    })
    document.cookie = cookie.join(';')
}

util.getCookie = function(name) {
    return document.cookie.replace(new RegExp('.*(?:^|; )' + name + '=([^;]*).*|.*'), '$1')
}

util.removeCookie = function(name, path) {
    path = path || '/'
        // expires=Thu, 01 Jan 1970 00:00:00 GMT
    var value = util.getCookie(name)
    if (value) {
        return document.cookie = name + '=' + value + '; expires=' + 'Thu, 01 Jan 1970 00:00:00 GMT; path=' + path
    }
}

var loaded = {}

function loadjs(url, opt) {
    opt = opt || {}
    if (!url) {
        return Promise.reject("js file url required.");
    }
    loaded[url] = loaded[url] || {}
    if (loaded[url].loading) {
        // 如果正在加载则生成一个新的 promise 对象并把它的对应处理函数丢到队列中
        if (!loaded[url].queue) {
            loaded[url].queue = [];
            loaded[url].fQueue = [];
        }
        console.warn("js file: [" + url + "] is loading.");
        return new Promise(function(resolve, reject) {
            loaded[url].queue.push(resolve);
            loaded[url].fQueue.push(reject);
        });
    }
    if (loaded[url].loaded) {
        return Promise.resolve()
    }
    loaded[url].loading = true
    loaded[url].loaded = false
    var s = document.createElement('script')
    Object.keys(opt).forEach(function(key) {
        s[key] = opt[key]
    })
    s.src = url
    s.type = 'text/javascript'
    s.async = true
    var defer = new Promise(function(resolve, reject) {
        s.onload = function() {
            // 如果加载过，不再执行，仅执行一次
            setTimeout(function() {
                s.onload = null
                document.body.removeChild(s)
                s = null
            })
            loaded[url].loaded = true
            loaded[url].loading = false
            resolve();
            if (loaded[url].queue && loaded[url].queue.length) {
                try {
                    while (loaded[url].queue.length) {
                        (loaded[url].queue.pop())();
                    }
                } catch (err) {
                    console.error(err);
                }
                loaded[url].fQueue = [];
                loaded[url].queue = [];
            }
        }
        s.onerror = function() {
            loaded[url].loading = false;
            if (loaded[url].fQueue && loaded[url].fQueue.length) {
                try {
                    while (loaded[url].fQueue.length) {
                        (loaded[url].fQueue.pop())(-404);
                    }
                } catch (err) {
                    console.error(err);
                }
                loaded[url].queue = [];
                loaded[url].fQueue = [];
            }
            reject(-404);
        }
    })
    document.body.insertBefore(s, document.body.firstChild)
    return defer
}

util.loadjs = loadjs;

var addQuery = function(url, query) {
    query = query || {}
    query = (function(query) {
        var q = []
        Object.keys(query).forEach(function(_q) {
            q.push(_q + '=' + query[_q])
        })
        return q.join('&')
    })(query)
    if (url.indexOf('?') !== -1) {
        url += '&' + query
    } else {
        url += '?' + query
    }
    return url
}

util.addQuery = addQuery;

var shareData = {};
util.defShareData = function(data) {
    if (data) {
        shareData = data;
    }
    return shareData;
}

// 获取 url 参数
function getQuery(key) {
    var q = decodeURIComponent(location.search),
        ret = {}
    if (q) {
        q = q.slice(1)
        q = q.split('&')
        q.forEach(function(qs) {
            qs = qs.split('=')
            var k = qs[0],
                v = qs[1]
            if (ret[k]) {
                ret[k] = [].concat(ret[k])
                ret[k].push(v)
            } else {
                ret[k] = v
            }
        })
    }
    if (key) {
        ret = ret[key]
    }
    return ret
}

util.getQuery = getQuery
util.RegExp = {
    "url": /^(http|https):\/\/(\w+.){2}(\w+)/,
    "mobile": /^((13\d{1}|14\d{1}|15\d{1}|18\d{1}|17\d{1}|16\d{1}|199|198)\d{8})$/,
    "number": /^0|([1-9][0-9]*)$/
}
export default util