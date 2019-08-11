export default function TMap(url) {
    return new Promise(function(resolve, reject) {
        window.init = function() {
            resolve(qq) //注意这里
        }
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = url;
        script.onerror = reject;
        document.head.appendChild(script);
    })
}