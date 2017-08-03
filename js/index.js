(function (a) {
    "function" === typeof define && define.amd ? define(["exports"], function (b) {
        window.Orienter = a(b)
    }) : "undefined" !== typeof exports ? a(exports) : window.Orienter = a({})
})(function (a) {
    a = function () {
        this.initialize.apply(this, arguments)
    };
    a.prototype = {
        lon: 0,
        lat: 0,
        direction: 0,
        fix: 0,
        os: "",
        initialize: function (a) {
            a = a || {};
            this.onOrient = a.onOrient || function () {
                };
            this.onChange = a.onChange || function () {
                };
            this._orient = this._orient.bind(this);
            this._change = this._change.bind(this);
            this.lat = this.lon = 0;
            this.direction = window.orientation || 0;
            switch (this.direction) {
                case 0:
                    this.fix = 0;
                    break;
                case 90:
                    this.fix = -270;
                    break;
                case -90:
                    this.fix = -90
            }
            navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) ? this.os = "ios" : this.os = -1 < navigator.userAgent.indexOf("Android") || navigator.userAgent.indexOf("Linux") ? "android" : ""
        },
        init: function () {
            window.addEventListener("deviceorientation", this._orient, !1);
            window.addEventListener("orientationchange", this._change, !1)
        },
        destroy: function () {
            window.removeEventListener("deviceorientation", this._orient, !1);
            window.removeEventListener("orientationchange", this._change, !1)
        },
        _change: function (a) {
            this.direction = window.orientation;
            this.onChange(this.direction)
        },
        changeDirectionTo: function (a) {
            this.direction = a
        },
        _orient: function (a) {
            switch (this.os) {
                case "ios":
                    switch (this.direction) {
                        case 0:
                            this.lon = a.alpha + a.gamma;
                            0 < a.beta && (this.lat = a.beta - 90);
                            break;
                        case 90:
                            this.lon = 0 > a.gamma ? a.alpha - 90 : a.alpha - 270;
                            this.lat = 0 < a.gamma ? 90 - a.gamma : -90 - a.gamma;
                            break;
                        case -90:
                            this.lon = 0 > a.gamma ? a.alpha - 90 : a.alpha - 270, this.lat = 0 > a.gamma ? 90 + a.gamma : -90 + a.gamma
                    }
                    break;
                case "android":
                    switch (this.direction) {
                        case 0:
                            this.lon = a.alpha + a.gamma + 30;
                            this.lat = 90 < a.gamma ? 90 - a.beta : a.beta - 90;
                            break;
                        case 90:
                            this.lon = a.alpha - 230;
                            this.lat = 0 < a.gamma ? 270 - a.gamma : -90 - a.gamma;
                            break;
                        case -90:
                            this.lon = a.alpha - 180, this.lat = -90 + a.gamma
                    }
            }
            this.lon += this.fix;
            this.lon %= 360;
            0 > this.lon && (this.lon += 360);
            this.lon = Math.round(this.lon);
            this.lat = Math.round(this.lat);
            this.onOrient({
                a: Math.round(a.alpha),
                b: Math.round(a.beta),
                g: Math.round(a.gamma),
                lon: this.lon,
                lat: this.lat,
                dir: this.direction
            })
        }
    };
    return a
});
$.fn.extend({
    fiHandler:function(e){
        e.stopPropagation();
        this.removeClass("opacity "+this.tp.cls);
        if(this.tp.cb){this.tp.cb();};
        this.off("webkitAnimationEnd");
        this.tp.cb = undefined;
        this.tp.duration = this.tp.cls = "";
    },
    foHandler:function(e){
        e.stopPropagation();
        this.hide().removeClass(this.tp.cls);
        if(this.tp.cb){this.tp.cb();};
        this.off("webkitAnimationEnd");
        this.tp.cb = undefined;
        this.tp.duration = this.tp.cls = "";
    },
    fi:function(cb){
        this.tp = {
            cb:undefined,
            duration:"",
            cls:"",
        };
        this.tp.cls = "ani-fadeIn";
        if(arguments){
            for(var prop in arguments){
                switch(typeof arguments[prop]){
                    case "function":
                        this.tp.cb = arguments[prop];
                        break;
                    case "number":
                        this.tp.duration = arguments[prop];
                        this.tp.cls += this.tp.duration;
                        break;
                }
            }
        }
        this.on("webkitAnimationEnd", this.fiHandler.bind(this)).addClass("opacity " + this.tp.cls).show();
        return this;
    },
    fo:function(cb){
        this.tp = {
            cb:undefined,
            duration:"",
            cls:"",
        };
        this.tp.cls = "ani-fadeOut";
        if(arguments){
            for(var prop in arguments){
                switch(typeof arguments[prop]){
                    case "function":
                        this.tp.cb = arguments[prop];
                        break;
                    case "number":
                        this.tp.duration = arguments[prop];
                        this.tp.cls += this.tp.duration;
                }
            }
        }
        this.on("webkitAnimationEnd",this.foHandler.bind(this)).addClass(this.tp.cls);
        return this;
    }
});
var Utils = new function(){
    this.preloadImage = function(ImageURL,callback,realLoading){
        var rd = realLoading||false;
        var i,j,haveLoaded = 0;
        var $num = $(".num");
        for(i = 0,j = ImageURL.length;i<j;i++){
            (function(img, src) {
                img.onload = function() {
                    main.loader.haveLoad +=1;
                    var num = Math.ceil(main.loader.haveLoad / main.loader.total * 100);
                    if(rd){
                        $num.html(num+"%");
                    }
                    if (main.loader.haveLoad == main.loader.total) {
                            callback && callback()
                    }
                };
                img.onerror = function() {};
                img.onabort = function() {};

                img.src = src;
            }(new Image(), ImageURL[i]));
        }
    },//图片列表,图片加载完后回调函数，是否需要显示百分比
    this.lazyLoad = function(){
        var a = $(".lazy");
        var len = a.length;
        var imgObj;
        var Load = function(){
            for(var i=0;i<len;i++){
                imgObj = a.eq(i);
                imgObj.attr("src",imgObj.attr("data-src"));
            }
        };
        Load();
    };//将页面中带有.lazy类的图片进行加载
    this.browser = function(t){
        var u = navigator.userAgent;
        var u2 = navigator.userAgent.toLowerCase();
        var p = navigator.platform;
        var browserInfo = {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端或uc浏览器
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            iosv: u.substr(u.indexOf('iPhone OS') + 9, 3),
            weixin: u2.match(/MicroMessenger/i) == "micromessenger",
            taobao: u.indexOf('AliApp(TB') > -1,
            win: p.indexOf("Win") == 0,
            mac: p.indexOf("Mac") == 0,
            xll: (p == "X11") || (p.indexOf("Linux") == 0),
            ipad: (navigator.userAgent.match(/iPad/i) != null) ? true : false
        };
        return browserInfo[t];
    };//获取浏览器信息
    this.g=function(id){
        return document.getElementById(id);
    };
    this.limitNum=function(obj){//限制11位手机号
        var value = $(obj).val();
        var length = value.length;
        //假设长度限制为10
        if(length>11){
            //截取前10个字符
            value = value.substring(0,11);
            $(obj).val(value);
        }
    };
};
var Media = new function(){
    this.mutedEnd = false;
    this.WxMediaInit=function(){

        var _self = this;
        if(!Utils.browser("weixin")){
            this.mutedEnd = true;
            return;
        }
        if(!Utils.browser("iPhone")){
            _self.mutedEnd = true;
            return;
        }
        document.addEventListener("WeixinJSBridgeReady",function(){
            var $media = $(".iosPreload");
            $.each($media,function(index,value){
                _self.MutedPlay(value["id"]);
                if(index+1==$media.length){
                    _self.mutedEnd = true;
                }
            });
        },false)
    },
    this.MutedPlay=function(string){
        var str = string.split(",");//id数组
        var f = function(id){
            var media = Utils.g(id);
            media.volume = 0;
            media.play();
            // setTimeout(function(){
            media.pause();
            media.volume = 1;
            media.currentTime = 0;
            // },100)
        };
        if(!(str.length-1)){
            f(str[0]);
            return 0;
        }
        str.forEach(function(value,index){
            f(value);
        })
    },
    this.playMedia=function(id){
        var _self = this;
        var clock = setInterval(function(){
            if(_self.mutedEnd){
                Utils.g(id).play()
                clearInterval(clock);
            }
        },20)
    }
};
Media.WxMediaInit();
var options = {
    el:"#iCreative",
    data:{
        server_data:{
            is_end : !!parseInt($("#is_end").val()),//活动是否结束
            have_guanzhu : !!parseInt($("#have_guanzhu").val()),//是否关注了公众号
            isVip : !!parseInt($("#is_vip").val()),//是否注册过
            goRegist : !!parseInt($("#goRegist").val()),//出去注册了一下
            haveFill : !!parseInt($("#haveFill").val()),//是否填写过中奖信息
            province:[
                // {province:"江西省"},
                // {province:"浙江省"},
                // {province:"江苏省"}
            ],
            city:[
                // {city:"杭州市"},
                // {city:"嘉兴市"},
                // {city:"温州市"}
            ],
            address:[
                // {id:"1",name:"门店名称"},
                // {id:"2",name:"门店名称"},
                // {id:"3",name:"门店名称"}
            ],
            name:'',
            tel:'',

            select_province:'',//视图上选中省份String,该字段即时更新
            select_city:'',
            select_address:'',
            shop_id:0,
        },

        /*页面切换控制*/
        ploading:{
            visible:false,
        },
        pwebgl:{
            visible:false,
        },
        p1:{
            visible:false,
        },
        p2:{
            visible:false,
        },
        pfill:{
            visible:false,
        },
        paddress:{
            visible:false,
        },
        pvideo:{
            visible:false,
        },
        pend:{
            visible:false,
        },
        pshare:{
            visible:false,
        },
        pquery:{
            visible:false,
        },
        pguanzhu:{
            visible:false,
        },
        prule:{
            visible:false,
        },
        palert:{
            visible:false,
            type:"",
            choice:{
                fill:"fill",
                normal:"normal",
            },
            content:"",//主文字
            title:"",//标题
            txt: {
                fill:"你还未填写领奖信息，赶快去填写吧",
            }
        },
        hpwarn:{
            visible:false,
        },
        pwait:{
            visible:false,
        },
        /*页面切换控制*/
    },
    methods:{
                                                        /*webgl*/
        pwegbl_btn_chaxun:function(){
            this.pquery.visible = true;
        },
                                                        /*提交信息页*/
        pfill_btn_submit:function(){
            var number = this.server_data.tel;
            var name = this.server_data.name;
            var patt = /^1(3|4|5|7|8)\d{9}$/;

            if(name == ""){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请输入姓名";
                this.palert.visible = true;
                return;
            };
            if(!(patt.test(number))){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请输入正确的手机号";
                this.palert.visible = true;
                return;
            };
            if(this.server_data.select_province == ""){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请选择省份";
                this.palert.visible = true;
                return;
            }
            if(this.server_data.select_city == ""){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请选择城市";
                this.palert.visible = true;
                return;
            }
            if(this.server_data.select_address == ""){
                this.palert.type = this.palert.choice.normal;
                this.palert.content = "请选择门店";
                this.palert.visible = true;
                return;
            }

            // _uploadData.fillInfo();

        },
        onPfillProvinceChangeHandle:function(e){
            console.log(this.server_data.select_province)
            // _getData.getCity(this.server_data.select_province)
        },
        onPfillCityChangeHandle:function(e){
            console.log(this.server_data.select_city)
            // _getData.getAddress(this.server_data.select_city)
        },
        onPfillAddressChangeHandle:function(e){
            // this.server_data.shop_id = e.target.selectedOptions[0].getAttribute("shopid");
            console.log(this.server_data.select_address)
        },

                                                        /*查询可使用门店页*/
        onPaddress_btn_xx:function(){
            this.paddress.visible = false;
        },

                                                        /*后退*/
        back:function(){
            var len = this.router.length;
            if(len>0){
                var page = this.router[len-1];
                this[page].visible = true;
                this.router.splice(len-1,1)
            }
        },
        openAlert:function(type,content){
            this.palert.type = type;
            this.palert.content = content;
            this.palert.visible = true;
        },
        closeAlert:function(){
            this.palert.visible = false;
            this.palert.type = "";
            this.palert.content = "";

        },
    },
    delimiters: ['$[', ']']
}
var vm = new Vue(options);
vm.ploading.visible = true;

/***********************three***********************/
var three = new function(){
    this.container;
    this.scene;
    this.camera;
    this.renderer;
    this.width;
    this.height;

    this.raycaster;//射线实例
};
three.init = function(){
    this.container = $("#WebGL");
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45,this.width/this.height,0.1,300000);
    this.camera.position.y = 50;
    this.camera.position.z = 1600;


    this.renderer = new THREE.WebGLRenderer({antialias:true});
    // this.renderer.setPixelRatio(window.devicePixelRatio);//移动端为了性能，关闭此功能
    this.renderer.setSize(this.width,this.height);
    // this.renderer.setClearColor(0x000000,1);
    this.renderer.autoClear = false;
    this.renderer.autoClearDepth =false;
    this.container.append(this.renderer.domElement);

    this.raycaster = new THREE.Raycaster();

    this.ddsloader = new THREE.DDSLoader();
    THREE.Loader.Handlers.add(/\.dds$/i,this.ddsloader);


};

three.loadOBJ = function(config){
    config = config ? config : {};
    config.modelName = config.modelName ? config.modelName : (function(){console.error("加载obj文件，modelName不能为空");return;}())
    config.objFile = config.objFile ? config.objFile :(function(){console.error("加载obj文件，fileName不能为空");return;}())
    config.material = config.material ? config.material : undefined;
    config.needTouch = typeof config.needTouch =="boolean" ? config.needTouch : true;//是否可以点击，如果可以，加入到touch搜索列表
    config.callback = config.callback ? config.callback : undefined;
    var objloader = new THREE.OBJLoader();

    if(config.material){
        objloader.setMaterials(config.material);
        console.log(config.material)
    }

    objloader.load(config.objFile,function(group){//加载路径,成功回调，参数可以是整个模型对象Group也可以是单个object(mesh)
        config.callback && config.callback(group)

        group.name = config.modelName;//给物体一个名字
        group.position.x = webgl.OBJData[config.modelName].position.x;
        group.position.y = webgl.OBJData[config.modelName].position.y;
        group.position.z = webgl.OBJData[config.modelName].position.z;

        group.rotation.x = webgl.OBJData[config.modelName].rotation.x;
        group.rotation.y = webgl.OBJData[config.modelName].rotation.y;
        group.rotation.z = webgl.OBJData[config.modelName].rotation.z;

        group.scale.x = webgl.OBJData[config.modelName].scale.x;
        group.scale.y = webgl.OBJData[config.modelName].scale.y;
        group.scale.z = webgl.OBJData[config.modelName].scale.z;


        webgl.OBJData[config.modelName].obj = group;//存入到全局OBJ数据中
        

        if(webgl.OBJData[config.modelName].needTouch){//根据需要加入touch搜索列表
            webgl.touchObjects.push(object);
        }

        main.loader.haveLoad++;
        var completePercent = Math.round(main.loader.haveLoad/main.loader.total*100);
        $(".num").html(completePercent+"%")
        if(main.loader.haveLoad == main.loader.total ){     
                main.loadCallBack();          
        }
    },function(progress){
        // console.log(progress)
    },function(error){
        console.log("加载obj出错")
    })
};
three.loadMTL = function(config){
    config = config ? config : {};
    config.modelName = config.modelName ? config.modelName : (function(){console.error("加载mtl文件，modelName不能为空");return;}());
    config.mtlFile = config.mtlFile ? config.mtlFile :(function(){console.error("加载mtl文件，文件名不能为空");return;}());

    var mtlloader = new THREE.MTLLoader();
    if(config.baseUrl){
        mtlloader.setPath(config.baseUrl);
    }

    mtlloader.load(config.mtlFile,function(materials){//加载mtl文件
        materials.preload();
        if(config.objFile){
            three.loadOBJ({
                modelName:config.modelName,
                objFile:config.objFile,
                material:materials,
            })
        }

    },function(res){
        // console.log(res)
    },function(res){
        console.log("加载mtl出错")
    })
};
three.loadCollada = function(config){
    config = config ? config : {};
    config.url = config.url;

    config.successCallback = typeof config.successCallback =="function" ? config.successCallback : function(collada){console.log(collada)};
    config.progressCallback = config.progressCallback ? config.progressCallback : function(progress){console.log(progress)};
    config.failCallback = config.failCallback ? config.failCallback : function(fail){console.log(fail)};
    var loader = new THREE.ColladaLoader();
    loader.load(config.url,config.successCallback,config.progressCallback,config.failCallback)
};
three.loadTexture = function(config){
    config = config ? config : {};
    config.url = config.url ? config.url : "";
    config.name = config.name ? config.name : "";
    config.wrapS = typeof config.wrapS == "boolean" ? config.wrapS :false;
    config.wrapT = typeof config.wrapT == "boolean" ? config.wrapT :false;
    config.SuccessCallback = typeof config.SuccessCallback == "function" ? config.SuccessCallback :function(){};

    var textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(config.url,function(texture){config.SuccessCallback(texture)},undefined,function(){});
    if(config.wrapS){
        texture.wrapS = THREE.RepeatWrapping;
    }
    if(config.wrapT){
        texture.wrapT = THREE.RepeatWrapping;
    }
    texture.name = config.name;
    return texture;

};
three.loadAudio = function(config){
    var audioLoader = new THREE.AudioLoader()
}

three.getSpotLight = function(config){
    config = config ? config : {};
    config.color = config.color ? config.color : 0xffffff;//灯光颜色
    config.intensity = config.intensity ? config.intensity : 1;//灯光强度
    config.distance = config.distance ? config.distance : 100;//灯光的照射长度
    config.angle = config.angle ? config.angle : Math.PI/3;//灯光角度，默认60度对应的弧度
    config.exponent = config.exponent ? config.exponent : 10;//灯光衰减速度，默认是10

    var light = new THREE.SpotLight(config.color,config.intensity,config.distance,config.angle,config.exponent);
    light.position.x = 100;
    light.position.y = 100;
    light.position.z = 0;
    return light;
};//聚光灯
three.getPointLightHelper = function(spotLight){
    if(spotLight instanceof THREE.Light){
        return new THREE.SpotLightHelper(spotLight);
    }
};//增加聚光灯辅助工具,便与调试,return一个helper实例
three.getDirectionalLight = function(config){
    config = config ? config : {};
    config.color = config.color ? config.color : 0xffffff;//颜色
    config.intensity = config.intensity ? config.intensity : 1;//光线强度

    var light = new THREE.DirectionalLight(config.color,config.intensity);

    if(config.position){
        light.position.set(config.position.x,config.position.y,config.position.z);
    }
    return light;
};//平行方向光,return光线实例
three.getAmbientLight = function(config){
    config = config ? config : {};
    config.color = config.color ? config.color : 0xffffff;//颜色
    config.intensity = config.intensity ? config.intensity : 1;
    var light = new THREE.AmbientLight( config.color, config.intensity );

    return light;
};//环境光,return光线实例

three.getSkyByCubeGeo = function(config){
    var path = "assets/texture/"
    config = config ? config : {};
    config.size = config.size ? config.size : 1024;
    config.format = config.format ? config.format : ".jpg";
    config.urls = config.urls ? config.urls : [
        path+"right"+config.format,
        path+"left"+config.format,
        path+"up"+config.format,
        path+"down"+config.format,
        path+"front"+config.format,
        path+"back"+config.format,
    ];

    var materials = [];
    for(var i = 0;i<config.urls.length;i++){
        materials.push(new THREE.MeshBasicMaterial({
            map:this.loadTexture({url:config.urls[i]}),
            side:THREE.BackSide
        }))
    }

    var mesh = new THREE.Mesh(new THREE.CubeGeometry(config.size,config.size,config.size),new THREE.MeshFaceMaterial(materials));//天空盒Mesh已经生成
    return mesh;
};//六面立方体CubeGeometry+多面材质组合MeshFaceMaterial,return mesh
three.getSkyBySphere = function(config){
    config = config ? config : {};
    config.R = config.R ? config.R : 50;//球体半径,说明:在2:1的长图素材中，r取值为short/PI
    config.Ws = config.Ws ? config.Ws :8;//分段数
    config.Hs = config.Hs ? config.Hs :6;//分段数
    config.phiStart = config.phiStart ? config.phiStart : 0;//0-2PI,x轴起点
    config.phiLength = config.phiLength ? config.phiLength : 2*Math.PI;//0-2PI,2PI代表画整个球
    config.thetaStart = config.thetaStart ? config.thetaStart : 0;//0-PI,y轴起点
    config.thetaLength = config.thetaLength ? config.thetaLength : Math.PI;//0-PI,0.5PI代表上半个球
    config.texture = config.texture ? config.texture : new THREE.Texture();

    var geometry = new THREE.SphereGeometry(config.R,config.Ws,config.Hs,config.phiStart,config.phiLength,config.thetaStart,config.thetaLength);
    var material = new THREE.MeshBasicMaterial({
        map:config.texture,
        side:THREE.DoubleSide
    })
    var mesh = new THREE.Mesh(geometry,material);
    return mesh;
};

three.getCubeGeometry = function(config){
    //默认创建一个长宽高100的立方体，分段数为1
    config = config ? config : {};
    config.sizeX = config.sizeX ? config.sizeX : 100;//X方向大小
    config.sizeY = config.sizeY ? config.sizeY :100;//Y方向大小
    config.sizeZ = config.sizeZ ? config.sizeZ :100;//Z方向大小
    config.Xs = config.Xs ? config.Xs : 1;
    config.Ys = config.Ys ? config.Ys : 1;
    config.Zs = config.Zs ? config.Zs : 1;

    var geometry = new THREE.CubeGeometry(config.sizeX,config.sizeY,config.sizeZ,config.Xs,config.Ys,config.Zs);
    return geometry;
};//return geometry
three.getPlaneGeo = function(config){
    config = config ? config : {};
    config.width = config.width ? config.width : 50;//平面默认宽50
    config.height = config.height ? config.height : 50;//平面默认高50
    config.Ws = config.Ws ? config.Ws : 1;//平面默认X方向段数为1
    config.Hs = config.Hs ? config.Hs : 1;//平面默认Y方向段数为1

    var planeGeo = new THREE.PlaneGeometry(config.width,config.height,config.Ws,config.Hs);
    return planeGeo;
};//return geometry
three.getSphereGeometry = function(config){
    config = config ? config : {};
    config.R = config.R ? config.R : 50;//球体半径,说明:在2:1的长图素材中，r取值为short/PI
    config.Ws = config.Ws ? config.Ws :8;//分段数
    config.Hs = config.Hs ? config.Hs :6;//分段数
    config.phiStart = config.phiStart ? config.phiStart : 0;//0-2PI,x轴起点
    config.phiLength = config.phiLength ? config.phiLength : 2*Math.PI;//0-2PI,2PI代表画整个球
    config.thetaStart = config.thetaStart ? config.thetaStart : 0;//0-PI,y轴起点
    config.thetaLength = config.thetaLength ? config.thetaLength : Math.PI;//0-PI,0.5PI代表上半个球

    var geometry = new THREE.SphereGeometry(config.R,config.Ws,config.Hs,config.phiStart,config.phiLength,config.thetaStart,config.thetaLength);
    return geometry;
};//return geometry
three.getPointMaterial = function(config){
    config = config ? config : {};
    config.size = config.size ? config.size : 4;
    config.map = config.map ? config.map : undefined;
    config.blending = config.blending ? config.blending : THREE.AdditiveBlending;

};

three.getOrbitControls = function(config){
    config = config ? config : {};
    return new THREE.OrbitControls(this.camera,this.renderer.domElement);
};
three.addPerspectiveCameraHelper = function(camera){
    camera = camera ? camera : this.camera;
    var helper = new THREE.CameraHelper(camera);
    this.scene.add(helper);
    return helper;
};

three.getFps = function(){
    var s = new Stats();
    return s;
};//return Stats实例
three.getObjectByName = function(config){
    config = config ? config : {};
    config.name = config.name ? config.name : (function(){console.error("getObjectByName时缺少name");}())
    config.scene = config.scene ? config.scene : this.scene;

    return config.scene.getObjectByName(config.name)
};//return scene.children
three.raycasterResult = function(config){//返回点到的第一个
    config = config ? config :{};
    config.coords = config.coords ? config.coords : new THREE.Vector2();
    config.searchFrom = config.searchFrom ? config.searchFrom : this.scene;
    config.recursive = config.recursive ? config.recursive : false;//是否需要递归查找到子对象
    config.needGroup = config.needGroup ? config.needGroup : false;//是否需要返回整个模型group

    config.coords.x = (config.coords.x/this.width)*2-1;
    config.coords.y = 2 * -(config.coords.y / this.height) + 1;

    this.raycaster.setFromCamera(config.coords,this.camera);
    var result;
    result = this.raycaster.intersectObjects(config.searchFrom,config.recursive);
    if(result.length>0){//有点到东西
        if(config.needGroup){//需要返回整个模型Group
            if(result[0].object.parent && result[0].object.parent instanceof THREE.Group){
                result = result[0].object.parent;
            }
        }
        else{
            result = result[0];
        }
    }
    else{
        result = undefined;
    }
    return result;
};
three.getTime = function(){
    return new Date().getTime();
};//return 时间戳1213432534213123
three.getTouchCoords = function(event){
    return {x:event.offsetX,y:event.offsetY};
};//传入touch回调参数,return{x:0,y:0}

three.render = function(){
    this.renderer.render(this.scene,this.camera);
};
three.onresize = function(){
    this.width = this.container.width();
    this.height = this.container.height();

    this.camera.aspect = this.width/this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width,this.height);
};

/***********************webgl***********************/
var webgl = new function(){
    /*debug模式
     * 增加fps工具:webgl.fps = three.addFps()
     *
     *
     * */
    this.debug = true;

    this.fps = undefined;//左上角fps
    this.orbit = undefined;//键盘+鼠标控制器
    this.gravity = undefined;//重力控制器

    //加载计数器
    this.loader = {
        haveLoad:0,
        total:0,
        complete:false,
    };

    //可被touch到的物体,this.touchObjects.indexOf(testObj) !=-1
    this.touchObjects = [];

    //一般为带纹理的整个模型,配置信息
    this.OBJData = {
        scene:{
            name:"scene",
            baseUrl:"assets/",
            mtlFile:"models/scene/scene.mtl",
            objFile:"assets/models/scene/scene.obj",
            // texture:"assets/models/scene/scene.png",

            position:{x:0,y:0,z:0},
            rotation:{x:0,y:0,z:0},
            scale:{x:0.07,y:0.07,z:0.07},

            needTouch:false,
            liusu_center:undefined,
            liusu_up:undefined,
        }
    };

    //待加载的纹理--配置信息
    this.TextureData={

    };

    


    const SQ3 = Math.sqrt(3);
    const SQ2 = Math.sqrt(2);

    //点位信息
    this.PointData = {
        point1:{
            name:"point1",
            position:new THREE.Vector3(300,0,0),
            obj:undefined,
        },
        point2:{
            name:"point2",
            position:new THREE.Vector3(300/SQ3,300/SQ3,300/SQ3),
            obj:undefined,
        }
    };

    //背景天空
    this.sky = undefined;
    //云
    this.cloud = undefined;
    this.stone1 = undefined;
    this.stone2 = undefined;
    
    
    //云+地球的整体
    this.earthGroup = undefined;
    //纹理序列
    this.earthChangeTexture = [];
    //切换到第几张纹理
    this.textureIndex = 0;


    //纹理路径
    this.texturePath = "assets/images/";
    //时钟
    this.clock = new THREE.Clock();
};
webgl.init = function(){
    this.loader.total = Object.keys(this.OBJData).length;
    for(var i=0;i<3;i++){
        var texture = three.loadTexture({
                            url:this.texturePath + "cloud"+[i] +".png"
                        })

        this.earthChangeTexture.push(texture)
    }

    




};
webgl.load = function(){
    for(var prop in this.OBJData){
        var config = this.OBJData[prop];
        // three.loadMTL({
        //     modelName:config.name,
        //     mtlFile:config.mtlFile,
        //     objFile:config.objFile,
        //     baseUrl:config.baseUrl,
        // })
        three.loadOBJ({
           modelName:config.name, 
           objFile:config.objFile,
            callback:function(group){
                console.log(group)
                webgl.stone1 = group.children[0];
                webgl.stone2 = group.children[1]; 
                webgl.liusu_up = group.children[2];
                webgl.liusu_center = group.children[3];
                webgl.planet = group.children[4];
                
                // object.children[0].material = material;
            }
        })
    }

};
webgl.loadCallback = function(){
    // if(this.debug){
    //     this.addFps();
    // }
    this.addAmbientLight();//加环境光
    this.addDirectionLight();//加方向光
    this.addOrbit();//加控制器
    this.addEarth();//加地球
    this.addSky();//加天空
    // if(this.debug){
    //     this.addAxisHelper();//增加坐标轴辅助线
    // }
};
webgl.addAmbientLight = function(){
    var ambientLight = three.getAmbientLight({
        color:0x000000,
        intensity:1,
    });//可被移除的对象
    three.scene.add(ambientLight);
};//加环境光
webgl.addDirectionLight = function(){
    var directionLight = three.getDirectionalLight({
        color:0x111111,
        intensity:0.1,
        position:{x:0,y:300,z:0}
    });

    three.scene.add(directionLight);


    if(this.debug){
        var helper = new THREE.DirectionalLightHelper(directionLight)
        three.scene.add(helper)
    }

};//加平行光
webgl.addOrbit = function(){
    this.orbit = new THREE.OrbitControls( three.camera , three.renderer.domElement);
    this.orbit.enableZoom = true;
};//加控制器
webgl.addEarth = function(){
    var group = new THREE.Group();
    group.scale.set(1,1,1);
    group.position.set(0,50,0)
    group.rotation.y = 0
    var material = new THREE.MeshPhongMaterial({
                        color:0xffffff,
                        map:three.loadTexture({
                            url:"assets/models/scene/planet.png",
                        }),
                        normalMap:three.loadTexture({
                            url:"assets/models/scene/normal_planet.png",
                        }),
                        shininess:100,
                        specular:0x888888,
                        emissive:0x888888,
                        emissiveIntensity:0.1,
                    });
    
    this.planet.material = material;

    group.add(this.planet)

    var material1 = new THREE.MeshPhongMaterial({
                        map:three.loadTexture({
                            url:"assets/models/scene/stone1.png",
                        }),
                        normalMap:three.loadTexture({
                            url:"assets/models/scene/normal_stone1.png",
                        }),
                        shininess:30,
                    
                    });
        this.stone1.material = material1;
        three.scene.add(this.stone1)
        
    var material2 = new THREE.MeshPhongMaterial({
                    map:three.loadTexture({
                        url:"assets/models/scene/stone2.png",
                    }),
                    normalMap:three.loadTexture({
                        url:"assets/models/scene/normal_stone2.png",
                    }),
                    shininess:0,
                });
    this.stone2.material = material2;
    three.scene.add(this.stone2)

    var material3 = new THREE.MeshLambertMaterial({
                    color:"white",
                    map:three.loadTexture({
                        url:"assets/models/scene/liusu1.png",
                    }),
                    side:THREE.DoubleSide,
                    transparent:true,
                   alpha:0.5,
                   depthWrite:false,
                });
    this.liusu_up.material = material3;
    this.liusu_up.position.set(0,50,0)
    
    three.scene.add(this.liusu_up)

    var material4 = new THREE.MeshLambertMaterial({
                    color:"white",
                    map:three.loadTexture({
                        url:"assets/models/scene/liusu1.png",
                    }),
                    side:THREE.DoubleSide,
                   transparent:true,
                   alpha:0.5,
                   depthWrite:false,
                });
    this.liusu_center.material = material4;
    this.liusu_center.position.set(0,50,0)
    three.scene.add(this.liusu_center)


    
    // var geometry = new THREE.SphereGeometry(20,100,100);
    // var material = new THREE.MeshLambertMaterial({
    //     map:texture,
    //     wireframe:true,
    // });

    // var skyMesh = new THREE.Mesh( geometry, material );
    // group.add(skyMesh);


    var geometry = new THREE.SphereGeometry(21,100,100);
    var material = new THREE.MeshLambertMaterial({
        transparent:true,
        map:this.earthChangeTexture[0],
    });


    var cloudMesh = new THREE.Mesh( geometry, material);
    this.cloud = cloudMesh;

    // group.add(cloudMesh);
    this.earthGroup = group;
    three.scene.add(group);

    for(point in this.PointData){
        var all = this.PointData;
        var point = all[point];

        var RedPoint = new THREE.Mesh(new THREE.SphereGeometry(20,10,10),new THREE.MeshBasicMaterial({color:0xff0000}))
        group.add(RedPoint);
        RedPoint.position.set( point.position.x, point.position.y, point.position.z );
        RedPoint.name = point.name;
        point.obj = RedPoint;
    }


};//加地球
webgl.addSky = function(){
    var texture = three.loadTexture({
        url:this.texturePath + "sky.png",
    });

    

    // three.scene.background = texture
    var geometry = new THREE.SphereGeometry(10000,50,50);
    var material = new THREE.MeshLambertMaterial({
        map:texture,
        side:THREE.DoubleSide
    });

    // var skyMesh = new THREE.Mesh( geometry, material);
    var skyMesh = three.getSkyByCubeGeo({
        size:40960
    })
    this.sky = skyMesh;
    skyMesh.position.set(0,0,0)

    three.scene.add(skyMesh);
};//加天空

webgl.addFps = function(){
    this.fps = three.getFps();
    document.getElementById("FPS").appendChild(this.fps.domElement);
};
webgl.addAxisHelper = function(){
    var helper = new THREE.AxisHelper(1000);
    three.scene.add(helper);
};
webgl.updateTexture = function(){
    var index = this.textureIndex;
    var textures = this.earthChangeTexture;
    this.cloud.material.map = textures[index];
    if(index<textures.length-1){
        this.textureIndex++;
    }else{
        this.textureIndex = 0;
    }


};

webgl.render = function(){
    // if(this.fps){
        // if(this.debug){
        //     this.fps.update();
        // }
        // this.cloud.rotation.x+=0.0002;
        // this.cloud.rotation.y+=0.0002;
        // this.cloud.rotation.z+=0.0002;

        // this.sky.rotation.y += 0.0002;
        // if( this.clock.getDelta() > 17){
        //     // this.updateTexture();
        // }
        this.clock.startTime = Date.now();
        // if(this.clock.startTime - this.clock.oldTime >5000){
        //    this.updateTexture();
        //    this.clock.oldTime = this.clock.startTime;
        // }

    // }
};

/***********************main***********************/
var main = new function(){
    this.scale = window.innerWidth/640;
    this.touch ={
        ScrollObj:undefined,
        isScroll:false,
        limitUp:0,
        limitDown:undefined,
        overlimit:false,
        lastX:0,
        lastY:0,
        newX:0,
        newY:0,
        delta_X:0,
        delta_Y:0,
        scrollY:0,
        touchAllow:true,
        fingerNumber:0,
        distance:0,
        angle:0,
        delta_angle:0,
        time:0,
        offsetTime:0,
    };

    this.bgm ={
        obj:document.getElementById("bgm"),
        id:"bgm",
        isPlay:false,
        button:$(".music-btn")
    };
    this.V = {//视频
        id:"video",
        currentTime:0,
        isPlay:false,
        obj:document.getElementById("video")
    };

    this.picUrl = "assets/images/";//图片路径
    this.textureUrl = "assets/models/"
    this.ImageList = [
        this.picUrl+"phone.png",
        this.textureUrl+"scene/planet.png",
        this.textureUrl+"scene/normal_planet.png",
        this.textureUrl+"scene/stone1.png",
        this.textureUrl+"scene/normal_stone1.png",
        this.textureUrl+"scene/stone2.png",
        this.textureUrl+"scene/normal_stone2.png",
    ];
    this.RAF = undefined;

    this.loader = {
        haveLoad:0,
        total:0,
        complete:false,
    };

    this.orient = undefined;
};
main.init=function(){
    // this.TranslateBg();
    $("#translateBg").addClass("ani-bg")
    three.init();
    webgl.init();
    this.loader.total = this.ImageList.length + webgl.loader.total;
};
main.start=function(){
    var galaxy = new TimelineMax();
    galaxy.to(".galaxy",45,{rotation:20,scale:1.5,ease:"Linear.easeNone"})
    setTimeout(function(){
        galaxy.timeScale( 10 )
    },3000)
    Utils.preloadImage(this.ImageList,function(){
        main.loadCallBack();
    },true);
    webgl.load();
};
main.TranslateBg = function(){
    var config = {
        speed:2,
        obj:$("#bg"),
        lastGamma:undefined,
        lastBeta:undefined,
        offsetGamma:undefined,
        offsetBeta:undefined,
        xMax:60,
        xMin:-60,
        yMax:30,
        yMin:-30,
        nowX:0,
        nowY:0,
    };
    this.orient = new Orienter();
    this.orient.onOrient = function(data){
        if(config.lastGamma){
            config.offsetGamma = data.g - config.lastGamma;

            if(Math.abs(config.offsetGamma)<30){
                if( config.nowX + config.offsetGamma > config.xMax){//右边界
                    config.nowX = config.xMax;
                }else if(config.nowX + config.offsetGamma < config.xMin){
                    config.nowX = config.xMin;
                }else{
                    config.nowX +=config.offsetGamma;
                }
            }
        }
        if(config.lastBeta){
            config.offsetBeta = data.b - config.lastBeta;

            if(Math.abs(config.offsetBeta)<30){
                if( config.nowY + config.offsetBeta > config.yMax){//右边界
                    config.nowY = config.yMax;
                } else if( config.nowY + config.offsetBeta < config.yMin){//左边界
                    config.nowY = config.yMin;
                }else{
                    config.nowY += config.offsetBeta;
                }
            }
        }

        config.obj.css({
            transform:"translate3d("+config.nowX+"px,"+config.nowY+"px,0)"
        })


        config.lastGamma = data.g;
        config.lastBeta = data.b;
    };
    this.orient.init();

    // setTimeout(function(){
    //     main.orient.destroy();
    //     config.obj.css({
    //         transition:"transform 0.5s",
    //         transform:"translate3d(0,0,0)"
    //     })
    // },3000)
};
main.loadCallBack = function(){
    webgl.loadCallback();
    vm.ploading.visible = false;
    $(".bg1").fo();
    $(".bg2").fi();
    vm.pwebgl.visible = true;
    this.startRender();

    // vm.pshare.visible = true;
    // vm.pend.visible = true;
    // vm.pguanzhu.visible = true;
    // vm.pfill.visible = true;

    // var type = vm.palert.choice.fill;
    // var content = vm.palert.txt[type];
    // vm.openAlert( type, content );



    main.addEvent();
// setTimeout(function(){
//     TweenMax.to(webgl.earthGroup.position,4,{x:0,y:0,z:0,ease:"Linear.easeNone"})
//     TweenMax.to(webgl.earthGroup.scale,4,{x:1,y:1,z:1,ease:"Linear.easeNone"})
//     TweenMax.to(webgl.earthGroup.rotation,4,{x:0,y:2 * Math.PI,z:0,ease:"Linear.easeNone",onComplete:function(){
//         TweenMax.to(webgl.earthGroup.rotation,6,{x:0,y:0,z:0,ease:"Power2.easeOut"})
//     }})
// },2000)



};

main.prule = function(){
    $(".P_rule").fi();
    main.scrollInit(".rule-txt",0)
};
main.pruleleave = function(){
    $(".P_rule").fo(function(){
        $(".rule-txt")[0].style.webkitTransform="translate3d(0,0,0)";
    });
};

main.scrollInit=function(selector){
    this.touch.ScrollObj = $(selector);
    this.touch.container = $(selector).parent();
    this.touch.StartY = 0;
    this.touch.NewY = 0;
    this.touch.addY = 0;
    this.touch.scrollY = 0;
    this.touch.limitDown = this.touch.ScrollObj.height() < this.touch.container.height() ? 0 :(this.touch.container.height()-this.touch.ScrollObj.height());
};
main.limitNum = function(obj){//限制11位手机号
    var value = obj.value;
    var length = value.length;
    //假设长度限制为10
    if(length>11){
        //截取前10个字符
        value = value.substring(0,11);
        obj.value = value;
    }
};//限制手机号长度
main.playbgm=function(){
    Media.playMedia(this.bgm.id);
    this.bgm.button.addClass("ani-bgmRotate");
    this.bgm.isPlay = true;
};
main.pausebgm=function(){
    this.bgm.obj.pause();
    this.bgm.button.removeClass("ani-bgmRotate");
    this.bgm.isPlay = false;
};
main.startRender = function(){
    var loop = function(){
        three.render();
        webgl.render();
        main.RAF = window.requestAnimationFrame(loop);
    };
    loop();
};//开始渲染
main.stopRender = function(){
    window.cancelAnimationFrame(main.RAF);
};
main.addEvent=function(){
    document.body.ontouchmove = function(e){
        e.preventDefault();
    };
    window.onresize = function(){
        three.onresize();
    }
    $(window).on("orientationchange",function(e){
        if(window.orientation == 0 || window.orientation == 180 )
        {
            vm.hpwarn.visible = false;
        }
        else if(window.orientation == 90 || window.orientation == -90)
        {
            vm.hpwarn.visible = true;
        }
    });

    $(".long-press").on({
        touchstart:function(e){
            e.preventDefault();
            // TweenMax.to(webgl.earthGroup.rotation,1,{x:Math.PI/6,y:Math.PI/6,z:Math.PI/6,ease:"Power2.easeOut"})

            var camera_pos = new THREE.Vector3().copy(three.camera.position);
            
            //球心与相机连线向量
            var min_distance = undefined;//最近的点与相机的距离，用点的世界坐标
            var min_obj = undefined;//最近的点的mesh

            var angle = undefined;//两个向量夹角

            for(var prop in webgl.PointData){//遍历点，找到最近的点
                var obj = webgl.PointData[prop].obj;
                if(!min_distance){
                    min_distance = obj.getWorldPosition().distanceTo(camera_pos);
                    min_obj = obj;//最近的点
                }
                else{
                    if(obj.getWorldPosition().distanceTo(camera_pos) < min_distance){
                        min_distance = obj.getWorldPosition().distanceTo(camera_pos);
                        min_obj = obj;//最近的点
                    }
                }
            }

            // console.log(min_distance)
            // console.log(min_obj)


            var vec_pointPos = new THREE.Vector3().copy(min_obj.getWorldPosition())//球心到红点方向向量
            vec_pointPos.y-=50;
            var vec_rotate = new THREE.Vector3().copy(camera_pos);//球心与相机连线的方向向量
            vec_rotate.y-=50;

            angle = vec_pointPos.angleTo( vec_rotate )//向量夹角
            vec_rotate.cross(vec_pointPos).normalize();//旋转轴的单位法向量



            var q1 = new THREE.Quaternion().setFromAxisAngle(vec_rotate.negate(),angle)//变换quaternion

            var q2 = new THREE.Quaternion();
            q2.copy(webgl.earthGroup.quaternion);//得到球体初始quaternion
            q1.multiply(q2);//算出终点quaternion

            var new_quaternion = new THREE.Quaternion();

            var obj = { t : 0};
            TweenMax.to( obj, 1,{t:1,onUpdate:function(){
                THREE.Quaternion.slerp(q2,q1,new_quaternion,obj.t);
                webgl.earthGroup.quaternion.set( new_quaternion.x,new_quaternion.y,new_quaternion.z,new_quaternion.w)
            }})

            // webgl.earthGroup.quaternion.copy( q1 )

        },
        touchmove:function(){},
        touchend:function(){
            // TweenMax.to(webgl.earthGroup.rotation,1,{x:0,y:0,z:0})
        },
    });

    $(".P_webgl .btn-box").on("touchstart",function(e){
        e.preventDefault();
    })
};
main.scrollInit = function(selector,start){
    this.touch.ScrollObj = $(selector);
    this.touch.container = $(selector).parent();
    this.touch.StartY = 0;
    this.touch.NewY = 0;
    this.touch.addY = 0;
    this.touch.scrollY = 0;
    this.touch.limitDown = this.touch.ScrollObj.height()<this.touch.container.height()?0:(this.touch.container.height()-this.touch.ScrollObj.height());
};

main.init();
main.start();








