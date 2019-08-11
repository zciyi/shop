<template>
    <div  :id="'container'" class="M-mapqq">
    </div>
</template>
<script>
import TMap from "@/components_module/qqmaps.js"
let mapMod;
var DEF_CONF = {
    // 显示省会、特区界别
    "provinceZoom": 6
    // 街道级别
    ,"streetZoom": 16
}
let hasLocal = false
let geoActive = true

export default {
    name:"mapqq",
    props:{
        config:{
            type:Object,
            default(){
                return{

                }
            }
        },
        data:{
            type:Object,
            default(){
                return{

                }
            }
        },
        geo:{
            type:String,
            default:""
        }
    },
    data(){
        return{
            ready:false
        }
    },
    beforeCreate(){
        let me = this;
        TMap("http://map.qq.com/api/js?v=2.exp&key=4CYBZ-CCJ3X-C274F-ZTRFV-JUJ6V-5BBWX&callback=init").then(()=>{
            me.ready = true
            let config ={
                zoom:this.config.zoom||DEF_CONF.provinceZoom
            }
            if(this.data.lat&&this.data.lng){
                config.center = new qq.maps.LatLng(
                    this.data.lat, this.data.lng
                );
                config.zoom = DEF_CONF.streetZoom
                hasLocal = true
            }
            
            mapMod = new qq.maps.Map(document.getElementById("container"),config);
            mapMod.geocoder = new qq.maps.Geocoder({
                complete: function(result){
                    if (result && result.detail) {
                        var loc = result.detail.location;
                        if (loc) {
                            hasLocal = true;
                            mapMod.setCenter(loc);
                            if (mapMod.marker) {
                                mapMod.marker.setPosition(loc);
                            } else {
                                mapMod.center = new qq.maps.LatLng(
                                    loc.lat, loc.lng
                                );
                                me.buildLocal( hasLocal, mapMod);
                            }
                            if (loc.lat > 0 && loc.lng > 0) {
                                mapMod.setZoom(DEF_CONF.streetZoom);
                                setTimeout(function(){
                                    me.$emit("updateData",loc)
                                },50);
                            } else {
                                mapMod.setZoom(DEF_CONF.provinceZoom);
                            }
                        } else {
                            mapMod.setZoom(DEF_CONF.provinceZoom);
                        }
                    }
                }
                
            })
            if(this.geo&&(!this.data.lat || !this.data.lng)){
                hasLocal = true
                mapMod.geocoder.getLocation(this.geo);
            }
            this.buildLocal(hasLocal, config);
        })
    },
    mounted(){
        
    },
    methods:{
        buildLocal(hasLocal,config){
            let me = this
            var localConf = {
                "map": mapMod
                ,"draggable": true
                ,"animation": qq.maps.MarkerAnimation.DROP
            };
            if(!hasLocal){
                var citylocation = new qq.maps.CityService();
                citylocation.setComplete(function(result) {
                    var pos = result.detail.latLng;
                    mapMod.setCenter(pos);

                    localConf.position = new qq.maps.LatLng(
                        pos.lat, pos.lng
                    );
                    mapMod.marker = new qq.maps.Marker(localConf);
                    me.bindMarker();

                    setTimeout(function(){
                        me.$emit("updateData",pos)
                    },50);
                });
                citylocation.searchLocalCity();
            }else if(config.center){
                localConf.position = config.center;
                mapMod.marker = new qq.maps.Marker(localConf);
                this.bindMarker()
            }
        },
        bindMarker() {
            let me = this
            var cityGeoService = new qq.maps.Geocoder({
                complete: function(re){
                    if (re && re.detail) {
                        geoActive = false
                        me.$emit("updateGeo", re.detail.address)
                        setTimeout(()=>{
                            geoActive = true
                        },50)
                    }
                }
            });
            // 绑定标记拖拽事件
            qq.maps.event.addListener(mapMod.marker, "position_changed", function(e) {
                setTimeout(function(){
                    var pos = mapMod.marker.getPosition();
                    cityGeoService.getAddress(new qq.maps.LatLng(
                        pos.lat, pos.lng
                    ));
                    me.$emit("updateData",pos)
                    pos = null;
                },50);
            });
        }
    },
    watch:{
        "geo":function(nval,oval){
            if(geoActive && nval !== oval && mapMod){
                if (nval) {
                    mapMod.geocoder.getLocation(nval);
                } else {
                    mapMod.setZoom(DEF_CONF.provinceZoom);
                }
            }else if(!nval){
                hasLocal = false
                this.buildLocal();
            }
        },
        "data":{
            handler(nval,oval){
                if(nval && mapMod){
                    if(Number(nval.lat)>0&& Number(nval.lng)>0){
                        let loc = nval
                        loc.lat = Number(nval.lat)
                        loc.lng = Number(nval.lng)
                        let pos = new qq.maps.LatLng(loc.lat, loc.lng)
                        mapMod.setCenter(pos);
                        mapMod.marker.setPosition(pos);
                        setTimeout(function(){
                            mapMod.setZoom(DEF_CONF.streetZoom);
                        }, 200);
                    }
                   
                }
            },
            deep:true
        }
    }
}
</script>
<style>
.M-mapqq{
    height: 300px;
    margin-top: 10px;
    padding-bottom: 10px
}
</style>


