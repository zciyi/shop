var promise = require("promise");
var config = require('../../config')
var util = require('./util').default
var ajxa = function (Vue, options) {
    var uri_map = {};
    var err_code = {};
    var Token = localStorage.getItem("_SHOP_PASS_IN_TOKEN")||""
    var request = (function(){
        
        var defConf = {
            method: 'get',
            dataType: 'json',
            cache: false,
            autoNotify: true
        }
        var defHeaders = {}
        var addQuery = function(config) {
            var query = config.query,
                url = config.url
            query = parseQuery(query)
            if(url.indexOf('?') !== -1){
                url += '&' + query
            }else{
                url += '?' + query
            }
            config.url = url
        }
        var replaceParams = function(config) {
            var params = config.params,
                url = config.url

            Object.keys(params).forEach(function(key){
                var reg = new RegExp('{'+key+'}','g')
                url = url.replace(reg,params[key])
            })
            config.url = url
        }
        var parseData = function(config) {
            var data = config.data
            if (util.isString(data)) {
                return data.replace(/\+/g,'%2B')
            }
            return JSON.stringify(data)
        }
        var parseQuery = function(query) {
            var q = []
            Object.keys(query).forEach(function(_q){
                q.push(_q + '=' + encodeURIComponent(query[_q]))
            })
            return q.join('&')
        }
        var parseFormData = function(config) {
            var fd = new FormData
            var data = config.data
            if (util.isObject(data)) {
                Object.keys(data).forEach(function(key){
                    fd.append(key,data[key])
                })
            }
            return fd
        }
        var getUrlHost = (function(){
            var a = document.createElement('a')
            return function(url){
                a.href = url
                return a.host
            }
        })()
        function request(config) {
            var xhr = new XMLHttpRequest
            var req = new Promise(function(resolve,reject){
                config = util.extend({},defConf,config)
                config.headers = util.extend({},defHeaders,config.headers)
                if(uri_map.hasOwnProperty(config.url)){
                    config.url = uri_map[config.url];
                }

                var method = config.method.toLowerCase(),
                    dataType = config.dataType  .toLowerCase(),
                    headers = config.headers,
                    crossOrigin = getUrlHost(config.url) !== location.host,
                    data

                if(util.isObject(config.params)) {
                    replaceParams(config)
                }

                if(util.isObject(config.query)){
                    addQuery(config)
                }

                if(!/get|head|delete/.test(method)){
                    if (!headers.hasOwnProperty('Content-Type')) {
                        headers['Content-Type'] = 'application/json'
                    }

                    if (headers['Content-Type'] === null) {
                        // formdata 文件上传
                        delete headers['Content-Type']
                        data = parseFormData(config)
                    } else {
                        // 默认json
                        data = parseData(config)
                    }
                }

                xhr.open(method, config.url, true)

                if(crossOrigin) {
                    if (config.credentials) {
                        xhr.withCredentials = true
                    }
                    delete headers['X-Requested-With']
                }
                if(Token){
                    headers['X-Authorization'] = Token;
                }
                Object.keys(headers).forEach(function(key) {
                    xhr.setRequestHeader(key,headers[key])
                });

                if(config.timeout) {
                    xhr.timeout = config.timeout
                }

                xhr.onload = function(){
                    if(request.onResponseCallback && request.onResponseCallback(this,config) === false){
                        return
                    }
                    if(this.status === 401||this.status === 403){
                        localStorage.setItem("_SHOP_PASS_IN_WITHOUT_TOKEN",0)
                        window.location.href ="/#/login"
                        return
                    }else{
                        localStorage.setItem("_SHOP_PASS_IN_WITHOUT_TOKEN",1)
                    }
                    if(this.status >= 200 && this.status < 300 || this.status === 304){
                        var value = this.responseText
                        if(dataType.toLowerCase() === 'json'){
                            try {
                                value = JSON.parse(value)
                            } catch(err) {
                                reject(err)
                                return
                            }
                        }
                        if(value.token){
                            Token = value.token;
                            localStorage.setItem("_SHOP_PASS_IN_TOKEN",Token)
                            Vue.prototype.$Token = Token;
                            
                        }

                        if (value && value.code===0) {
                            resolve(value.result || {});
                        } else {
                            //如果自动提示
                            if(config.autoNotify){
                                if (err_code) {
                                    // 错误提示
                                    var tipTxt = err_code[value.code];
                                    if (tipTxt) {
                                        Vue.$notify({
                                            title: tipTxt || '',
                                            type: 'warning',
                                            duration:1000
                                        });
                                    }
                                }
                                
                                resolve(null);
                            }else{
                                if (err_code) {
                                    var tipTxt = err_code[value.code];
                                    var obj = value || {};
                                    obj.tip = tipTxt;
                                    reject(obj);
                                }
                            }
                        }
                    }else{
                        reject(this)
                    }
                }

                xhr.ontimeout = xhr.onerror = function(e){
                    reject(e)
                }

                xhr.onabort = function() {
                    reject({
                        type: 'abort'
                    })
                }

                if(request.onRequestCallback && request.onRequestCallback(config) === false) return

                xhr.upload.onprogress = function(e){
                    if (e.lengthComputable) {
                        xhr.progressHandler && xhr.progressHandler(event.loaded,event.total)
                    }
                }

                xhr.send(data)
            })

            req.abort = function() {
                xhr.abort()
            }

            req.progress = function(cb) {
                xhr.progressHandler = cb
                return this
            }

            this._requestQueue = this._requestQueue || []
            this._requestQueue.push(xhr)

            return req
        }

        request.onRequest = function(callback) {
            this.onRequestCallback = callback
        }
        request.onResponse = function(callback) {
            this.onResponseCallback = callback
        }
        /**
         * 初始化地址映射对象
         * @param {Object} map 要替换的数据
         */
        request.setUriMap = function () {
            util.extend(uri_map,config.apis);
            var appData = config;
            if (appData && appData.biServer) {
                // 拼接biServer
                var protocol = appData.protocol || "http";
                var server;

                if (appData.biServer.indexOf("http") === -1) {
                    server = protocol + "://" + appData.biServer;
                } else {
                    server = appData.biServer;
                }

                Object.keys(uri_map).forEach(function(key){
                    //不包含域名的才需要解析
                    if(uri_map[key].indexOf("https")===-1 && uri_map[key].indexOf("http")===-1){
                        uri_map[key] = server + uri_map[key];
                    }
                });
            }

            if (appData && appData.returnCode) {
                err_code = appData.returnCode;
            }
        }
        
        return request
    })()
    Vue.http = request
    Vue.http.cancel = function(vm) {
        if (vm._requestQueue) {
            vm._requestQueue.forEach(function(req) {
                req.abort()
            })
            vm._requestQueue = null
        }
    }
    Vue.prototype.$request = request;
    Vue.prototype.$util = util;
    Vue.prototype.$config = config;
    
   
}
 export default ajxa