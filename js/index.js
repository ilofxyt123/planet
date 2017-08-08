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
function Scroll(obj){
    this.$container = $(obj.container);//外层容器
    this.$scrollObj = $(obj.scrollObj);

    this.visibleWidth  = parseFloat(this.$container.css("width"));
    this.visibleHeight = parseFloat(this.$container.css("height"));

    this.scrollWidth = parseFloat(this.$scrollObj.css("width"));
    this.scrollHeight = parseFloat(this.$scrollObj.css("height"));

    this.newY = 0;
    this.lastY = 0;
    this.deltaY = 0;
    this.scrollY = 0;//当前的位置
    this.limitY = 0;//边界
    this.overlimitY = 0;//超出的距离
    this.slideK = 1;

    this.startTime = 0;
    this.offsetTime = 0;

    this.isBottom = false;
    this.refresh = obj.refresh ? obj.refresh : undefined;
    this.isRefreshing = false;//正在刷新
    this.preloader;//加载器ui
    if(this.refresh){
        this.preloader = this.$container.find(".scroll-preloader");
        this.preloader.remove();
        this.refresh();
    }
    // this.refreshDistance = obj.refreshDistance ? obj.refreshDistance : 50

    this.init();
}
$.extend(Scroll.prototype,{//是否深度合并，二级同名对象进行合并，而不是简单覆盖
    init:function(){
        this.newY = 0;
        this.lastY = 0;
        this.deltaY = 0;
        this.scrollY = 0;

        this.update();

        if(this.scrollY == this.limitY){
            this.isBottom = true;
        }

        this.bindEvent();
    },
    update:function(){//重新计算limitY
        this.visibleWidth  = parseFloat(this.$container.css("width"));
        this.visibleHeight = parseFloat(this.$container.css("height"));

        this.scrollWidth = parseFloat(this.$scrollObj.css("width"));
        this.scrollHeight = parseFloat(this.$scrollObj.css("height"));

        this.limitY = (this.scrollHeight > this.visibleHeight) ? -(this.scrollHeight - this.visibleHeight) : 0;

        var paddingTop = parseFloat(this.$container.css("paddingTop"));
        var paddingBottom = parseFloat(this.$container.css("paddingBottom"));
        this.limitY -= (paddingTop+paddingBottom)
    },
    set:function(number){
        this.scrollY = number;
        this.$scrollObj[0].style.webkitTransform="translate3d(0,"+this.scrollY+"px,0)";
    },
    bindEvent:function(){
        this.$container.on({
            touchstart:this.onTouchstart.bind(this),
            touchmove:this.onTouchmove.bind(this),
            touchend:this.onTouchend.bind(this),
        })
    },
    onTouchstart:function(e){
        e.stopPropagation();
        this.newY = e.originalEvent.changedTouches[0].pageY;
        this.lastY = this.newY;
        this.startTime = new Date().getTime();
    },
    onTouchmove:function(e){
        e.stopPropagation();
        e.preventDefault();
        this.offsetTime = new Date().getTime() - this.startTime;

        this.newY = e.originalEvent.changedTouches[0].pageY;
        this.deltaY = this.newY - this.lastY;//touch变化量


        if(this.scrollY + this.deltaY < 0){//上边界限制
            if(this.scrollY + this.deltaY > this.limitY){//下边界限制
                this.scrollY += this.deltaY * this.slideK;
            }
            else{//超出,滑动系数逐渐减小
                this.scrollY = this.limitY
                if(this.refresh && !this.isRefreshing){
                    this.processRefresh();
                }
            }

        }else{
            this.scrollY = 0;
        }

        this.$scrollObj[0].style.webkitTransform="translate3d(0,"+this.scrollY+"px,0)";



        //得到deltaY,处理业务

        this.lastY = this.newY;
    },
    onTouchend:function(e){
        e.stopPropagation();
        this.offsetTime = new Date().getTime() - this.startTime;
    },

    processRefresh:function(){
        this.isRefreshing = true;
        // this.$scrollObj.append(this.preloader);
        // this.preloader.show();
        this.refresh();
    },
    onTransitionEndToBottom:function(){
        console.log("1")
        this.isBottom = false;
        this.scrollY = this.limitY;
        this.slideK = 2;
        this.$scrollObj.off("webkitTransitionEnd");
    },
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
                        $num.html(num);
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
    this.preloadImage2 = function(ImageURL,callback){
            var i,j,haveLoaded = 0;
            for(i = 0,j = ImageURL.length;i<j;i++){
                (function(img, src) {
                    img.onload = function() {
                        haveLoaded+=1;
                        if (haveLoaded == ImageURL.length && callback) {
                            callback();
                        }
                    };
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
            prizeType:parseInt($("#prizeType").val()),//奖品类型
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
            myInfo:{
                province:"",
                city:"",
                shop:"",
            },
            gameData:{
                hlbe:{
                    get:false,
                    needAnimation:false,
                },
                spanish:{
                    get:false,
                    needAnimation:false,
                },
                wz:{
                    get:false,
                    needAnimation:false,
                },
                
                currentPoint:"",
            },
        },
        ios:Utils.browser("ios"),
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
        pprize:{
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
                reg:"reg"
            },
            content:"",//主文字
            title:"",//标题
            txt: {
                fill:"你还未填写领奖信息，赶快去填写吧",
                reg:"为了确保星球领奖者的真实性,<br>系统需要进行实名认证,<br>请填写个人真实信息领取奖品!"
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
                                                        /*活动规则*/
        top_btn_rule:function(){
            this.prule.visible = true;
            if(!main.scroll){
                main.scroll = new Scroll({
                    container:".scroll-area",
                    scrollObj:".scroller"
                })
            }
        },
        after_leave_rule:function(){
            main.scroll.set( 0 );
        },
        after_enter_rule:function(){
            main.scroll.update();
        },

                                                        /*webgl*/
        pwegbl_btn_chaxun:function(){
            this.pquery.visible = true;
        },
        pwebgl_btn_getPrize:function(){
            var _vm = this;
            var callback = function( data ){
                if( data.status ){
                    _vm.server_data.prizeType = data.data;
                    _vm.pprize.visible = true;
                    _vm.pwebgl.visible = false;
                    main.stopRender();
                }else{
                    console.log( "抽奖后台出问题了"+data )
                }
            };
            _getData.getPrize( callback );
        },
               
                                                        /*中奖结果页*/
        pprize_btn_paddress:function(){
            this.paddress.visible = true;
        },/*中奖结果页*/
        pprize_btn_share:function(){
            this.pshare.visible = true;
        },
        pprize_btn_pfill:function(){
            this.pfill.visible = true;
            this.pprize.visible = false;
        },
                                                        /*中奖查询页*/
        pquery_btn_paddress:function(){
            this.paddress.visible = true;
        },
        pquery_btn_share:function(){
            this.pshare.visible = true;
        },
        pquery_btn_xx:function(){
            this.pquery.visible = false;
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

                                                        /*alert页面*/
        palert_btn_gofill:function(){
            this.pfill.visible = true;
            this.closeAlert();
        },
        palert_btn_goregist:function(){
            // window.location.href = "";
            console.log("前往注册");
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
    computed:{
        key_index:function(){
            var number = 0;
            var data = this.server_data.gameData;
            for(var a in data){
                if(data[a].get){
                   number++; 
                }
            }
            return number;
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

    this.ocamera = new THREE.OrthographicCamera(-this.width/2,this.width/2,this.height/2,-this.height/2,1,1000);
    this.ocamera.position.y = 50;
    this.ocamera.position.z = 5;
    this.scene2 = new THREE.Scene();


    this.renderer = new THREE.WebGLRenderer({antialias:true});
    // this.renderer.setPixelRatio(window.devicePixelRatio);//移动端为了性能，关闭此功能
    this.renderer.setSize(this.width,this.height);
    // this.renderer.setClearColor(0x000000,1);
    this.renderer.autoClear = false;
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
        $(".num").html(completePercent)
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
        path+"right"+config.format+"?v"+config.version,
        path+"left"+config.format+"?v"+config.version,
        path+"up"+config.format+"?v"+config.version,
        path+"down"+config.format+"?v"+config.version,
        path+"front"+config.format+"?v"+config.version,
        path+"back"+config.format+"?v"+config.version,
    ];

    var materials = [];
    for(var i = 0;i<config.urls.length;i++){
        materials.push(new THREE.MeshLambertMaterial({
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
    this.renderer.clear()
    this.renderer.render(this.scene,this.camera);
    this.renderer.clearDepth();
    this.renderer.render(this.scene2,this.ocamera);
};
three.onresize = function(){
    this.width = this.container.width();
    this.height = this.container.height();

    this.camera.aspect = this.width/this.height;
    this.camera.updateProjectionMatrix();
    
    this.ocamera.left = -this.width/2;
    this.ocamera.right = this.width/2;
    this.ocamera.top = this.height/2;
    this.ocamera.bottom = -this.height/2;
    this.ocamera.updateProjectionMatrix();

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

    this.assetsUrl = "assets/"

    this.picUrl = this.assetsUrl+"images/";//图片路径
    this.texturePath = this.assetsUrl+"images/"; //纹理路径
    this.modelsUrl = this.assetsUrl+"models/";//模型基础路径
    this.videoUrl = "video/";//视频序列帧路径

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
        hlbe:{
            name:"hlbe",
            texture:this.picUrl+"hl.png",
            position:new THREE.Vector3(320/SQ3,320/SQ3,-320/SQ3),
            obj:undefined,
            frames:"hlbe",
            width:224,
            height:44,
            img:$(".player-container .img1"),
            music:$("#hl")[0],
            icon:$(".right-box .icon2").eq(0)
        },
        spanish:{
            name:"spanish",
            texture:this.picUrl+"sp.png",
            position:new THREE.Vector3(320/SQ3,320/SQ3,320/SQ3),
            obj:undefined,
            frames:"spanish",
            width:154,
            height:48,
            img:$(".player-container .img2"),
            music:$("#sp")[0],
            icon:$(".right-box .icon2").eq(1)
        },
        wz:{
            name:"wz",
            texture:this.picUrl+"wz.png",
            position:new THREE.Vector3(-320/SQ3,-320/SQ3,-320/SQ3),
            obj:undefined,
            frames:"wz",
            width:224,
            height:48,
            img:$(".player-container .img3"),
            music:$("#wz")[0],
            icon:$(".right-box .icon2").eq(2)
        }
    };
    this.currentPointName = "";

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

    //时钟
    this.clock = new THREE.Clock();
};
webgl.init = function(){
    this.loader.total = Object.keys(this.OBJData).length;
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
    if(this.debug){
        this.addFps();
    }
    for(var i=1;i<=75;i++){
        var texture = three.loadTexture({
                            url:main.modelsUrl+"scene/ls/"+i+".png"
                        })

        this.earthChangeTexture.push(texture)
    }
    this.addAmbientLight();//加环境光
    this.addDirectionLight();//加方向光
    this.addEarth();//加地球
    this.addSky();//加天空
    this.addCross();
    this.addOrbit();//加控制器
    this.addGravity();
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
        // three.scene.add(helper)
    }

};//加平行光
webgl.addOrbit = function(){
    this.orbit = new THREE.OrbitControls( three.camera , three.renderer.domElement);
    this.orbit.enableZoom = true;
    this.orbit.target = webgl.earthGroup.position;
};//加控制器
webgl.addGravity = function(){
    this.gravity = new THREE.DeviceOrientationControls(this.sky)
};
webgl.addEarth = function(){
    var group = new THREE.Group();
    group.scale.set(0,0,0);
    group.position.set(0,50,-200)
    group.rotation.y = 4*Math.PI
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
                        url:"assets/models/scene/ls/1.png",
                    }),
                    side:THREE.DoubleSide,
                   depthWrite:false,
                   transparent:true,
                   opacity:0.9
                });
    this.liusu_up.material = material3;
    this.liusu_up.scale.set(1.01,1.01,1.01)
    group.add(this.liusu_up)

    var material4 = new THREE.MeshLambertMaterial({
                    color:"white",
                    map:three.loadTexture({
                        url:"assets/models/scene/ls/1.png",
                    }),
                    side:THREE.DoubleSide,
                   depthWrite:false,
                   transparent:true,
                   opacity:0.9
                });
    this.liusu_center.material = material4;
    this.liusu_center.scale.set(1.01,1.01,1.01)
    group.add(this.liusu_center)


    // group.add(cloudMesh);
    this.earthGroup = group;
    three.scene.add(group);

    for(point in this.PointData){
        var points = this.PointData;
        var point = points[point]; 
        
        point.texture= three.loadTexture({
            url:point.texture+"?v2"
        })

        var RedPoint = new THREE.Mesh(new THREE.PlaneGeometry(point.width,point.height),new THREE.MeshBasicMaterial({map:point.texture,transparent:true,}))

        var geo = new THREE.Geometry();
        geo.vertices.push( point.position );
        var RedPoint2 = new THREE.Sprite(new THREE.SpriteMaterial({map:point.texture,depthWrite:false}))
        
        RedPoint2.position.set( point.position.x, point.position.y, point.position.z )
        RedPoint2.scale.set(point.width*1.2,point.width*1.2,1)
        group.add(RedPoint2);
        RedPoint2.name = point.name;
        point.obj = RedPoint2;
    }


};//加地球
webgl.addSky = function(){
    var skyMesh = three.getSkyByCubeGeo({
        size:2048,
        version:6,
    })
    this.sky = skyMesh;

    three.scene.add(skyMesh);

    // var texture = three.loadTexture({
    //     url:main.picUrl+"sky.jpg"
    // })
    // var sky = three.getSkyBySphere({
    //     R:4096,
    //     Ws:8,
    //     Hs:8,
    //     texture:texture
    // })
    // this.sky = sky
    // three.scene.add( sky );

};//加天空
webgl.addCross = function(){
    var texture = three.loadTexture({
        url:main.picUrl + "p1-miaozhun.png",
    })
    var material = new THREE.SpriteMaterial({
        map:texture
    })
    var sprite = new THREE.Sprite( material );
    sprite.position.set(0,50,0)
    sprite.scale.set(60,60,60)
    three.scene2.add(sprite)

};//加准心

webgl.addFps = function(){
    this.fps = three.getFps();
    document.getElementById("FPS").appendChild(this.fps.domElement);
};
webgl.addAxisHelper = function(){
    var helper = new THREE.AxisHelper(1000);
    three.scene.add(helper);
};
webgl.updateTexture = function(){
    this.liusu_center.material.map = this.earthChangeTexture[this.textureIndex];
    this.liusu_up.material.map = this.earthChangeTexture[this.textureIndex];
    this.liusu_center.material.needsUpdate = true;
    this.liusu_up.material.needsUpdate = true;  

    this.liusu_center.rotation.x+=0.002;
    this.liusu_center.rotation.y+=0.002;
    this.liusu_center.rotation.z+=0.002;

    this.liusu_up.rotation.x+=0.002;
    this.liusu_up.rotation.y+=0.002;
    this.liusu_up.rotation.z+=0.002;


    if(this.textureIndex<this.earthChangeTexture.length-1){
        this.textureIndex++;
    }else{
        this.textureIndex = 0;
    }


};
webgl.rotateToCenter = function(){
    var camera_pos = new THREE.Vector3().copy( three.camera.position );
            
    var min_distance = undefined;//最近的点与相机的距离，用点的世界坐标
    var min_obj = undefined;//最近的点的mesh

    var angle = undefined;//两个向量夹角

    for(var prop in this.PointData){//遍历点，找到最近的点
        var obj = this.PointData[prop].obj;
        var distance = obj.getWorldPosition().distanceTo(camera_pos)
        if(!min_distance){
            min_distance = distance;
            min_obj = obj;//最近的点
            this.currentPointName = this.PointData[prop].name;
            vm.server_data.gameData.currentPoint = this.currentPointName;
        }
        else{
            if(distance < min_distance){
                min_distance = distance;
                min_obj = obj;//最近的点
                this.currentPointName = this.PointData[prop].name;
                vm.server_data.gameData.currentPoint = this.currentPointName;
            }
        }
    }

    
    if(!main.frames[webgl.currentPointName].load_complete&&main.frames[webgl.currentPointName].once){//图片没加载过
        main.frames[webgl.currentPointName].once = false;
        main.loadFrames( main.frames[webgl.currentPointName], function(){
            
        })
    }



    var pointPos = new THREE.Vector3().copy(min_obj.getWorldPosition())//球心到红点方向向量
   
    var PointToOVec = new THREE.Vector3().subVectors( pointPos, this.earthGroup.position )
    var CameraToOvec = new THREE.Vector3().subVectors( camera_pos, this.earthGroup.position )

    angle = PointToOVec.angleTo( CameraToOvec )//向量夹角
    var RotateVec = new THREE.Vector3().copy( PointToOVec );
    RotateVec.cross( CameraToOvec ).normalize();//旋转轴的单位法向量

    var q1 = new THREE.Quaternion().setFromAxisAngle( RotateVec, angle )//变换quaternion
    var q2 = new THREE.Quaternion();
    q2.copy( this.earthGroup.quaternion );//得到球体初始quaternion
    q1.multiply( q2 );//算出终点quaternion

    var new_quaternion = new THREE.Quaternion();

    var obj = { t : 0 };
    TweenMax.to( obj, 1,{ t:1,onUpdate:function(){
        THREE.Quaternion.slerp( q2, q1, new_quaternion,obj.t);
        webgl.earthGroup.quaternion.set( new_quaternion.x, new_quaternion.y, new_quaternion.z, new_quaternion.w)
    },onComplete:function(){
        if(main.touch.isTouch){
            main.stage = 2;
            main.player1.direction = 1;
            if(false){
                main.player1.repeat = 1;
                main.player1.callback1 = function(){
                    main.stage = 3;
                    $(main.frames[webgl.currentPointName].video).show();
                    $("#player1").fo();
                    main.frames[webgl.currentPointName].video.play();
                    webgl.PointData[webgl.currentPointName].img.fi();
                };
            }else{//安卓
                var callback1 = function(){
                    main.stage = 3;
                    $("#player1").fo();
                    $("#player2").show();
                    main.player2.init( main.frames[webgl.currentPointName].urls )
                    main.player2.repeat = 0;
                    main.player2.callback1 = function(){
                        if( vm.server_data.gameData[webgl.currentPointName].get == false){
                            webgl.PointData[webgl.currentPointName].icon.css({
                                opacity:0,
                            })
                            vm.server_data.gameData[webgl.currentPointName].get = true;
                            vm.server_data.gameData[webgl.currentPointName].needAnimation = true;
                        }
                        main.player2.set( 0 )
                        main.player2.play();
                        webgl.PointData[webgl.currentPointName].music.play();
                    }
                    main.player2.play();
                    webgl.PointData[webgl.currentPointName].img.fi();
                    webgl.PointData[webgl.currentPointName].music.play();
                }
                main.player1.callback1 = callback1;
                if(!main.frames[webgl.currentPointName].load_complete&&main.frames[webgl.currentPointName].once){//图片没加载过
                    main.player1.loop = true;
                    main.frames[webgl.currentPointName].once = false;
                    main.loadFrames( main.frames[webgl.currentPointName], function(){
                        main.player1.repeat = 0;
                    })
                }else{
                    main.player1.repeat = 0;
                }
            }
            
            $("#player1").show()
            $(".player-container").fi();
            main.player1.play();
            main.stopRender();
            
        }
    }})
};

webgl.render = function(){
    // if(this.fps){
        if(this.debug){
            this.fps.update();
        }
        

        // this.sky.rotation.y += 0.0002;
        // if( this.clock.getDelta() > 17){
        //     // this.updateTexture();
        // }
        this.clock.startTime = Date.now();
        if(this.clock.startTime - this.clock.oldTime >30){
           this.updateTexture();
           this.clock.oldTime = this.clock.startTime;
        }
        // if(this.gravity){
        //     this.gravity.update();
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
        isTouch:false,
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
    this.tl_galaxy = undefined;
    this.assetsUrl = "assets/"
    this.picUrl = this.assetsUrl+"images/";//图片路径
    this.textureUrl = this.assetsUrl+"texture/";//天空盒路径
    this.modelsUrl =this.assetsUrl+"models/";//模型基础路径
    this.videoUrl = "video/";//视频序列帧路径
    this.ImageList = [
        this.picUrl+"phone.png",
        this.modelsUrl+"scene/planet.png",
        this.modelsUrl+"scene/normal_planet.png",
        this.modelsUrl+"scene/stone1.png",
        this.modelsUrl+"scene/normal_stone1.png",
        this.modelsUrl+"scene/stone2.png",
        this.modelsUrl+"scene/normal_stone2.png",

        this.textureUrl+"left.jpg",
        this.textureUrl+"right.jpg",
        this.textureUrl+"up.jpg",
        this.textureUrl+"down.jpg",
        this.textureUrl+"front.jpg",
        this.textureUrl+"back.jpg",
    ];
    this.clouds = [];
    for(var i=1;i<=75;i++){
        this.ImageList.push(this.modelsUrl+"scene/ls/"+i+".png")
    }
    
    for(var i=1;i<=25;i++){
        this.clouds.push(this.picUrl+"cloud/"+i+".jpg");
    }
    this.ImageList = new Array().concat(this.ImageList,this.clouds)
    this.RAF = undefined;

    this.loader = {
        haveLoad:0,
        total:0,
        complete:false,
    };

    this.orient = undefined;
    this.scroll = undefined;
    this.player1 = undefined;//云的播放器
    this.player2 = undefined;//视频播放器

    this.frames = {
        hlbe:{
            urls:[],
            load_complete:false,
            once:true,
            // video:$("#video1")[0]
        },
        spanish:{
            urls:[],
            load_complete:false,
            once:true,
            // video:$("#video2")[0]
        },
        wz:{
            urls:[],
            load_complete:false,
            once:true,
            // video:$("#video3")[0]
        }
    }

    for(var i=1;i<=124;i++){
        this.frames.hlbe.urls.push(this.videoUrl+"hlbe/"+i+".jpg");
    }
    for(var i=1;i<=124;i++){
        this.frames.spanish.urls.push(this.videoUrl+"spanish/"+i+".jpg");
    }
    for(var i=1;i<=151;i++){
        this.frames.wz.urls.push(this.videoUrl+"wz/"+i+".jpg");
    }

    this.stage = 1;//当前阶段1
    
};
main.init=function(){
    // this.TranslateBg();
    $("#translateBg").addClass("ani-bg")
    three.init();
    webgl.init();
    this.loader.total = this.ImageList.length + webgl.loader.total;
};
main.start=function(){
    this.tl_galaxy = new TimelineMax();
    this.tl_galaxy.to(".galaxy",45,{rotation:20,scale:1.5,ease:"Linear.easeNone"})
    setTimeout(function(){
        if(!main.tl_galaxy.paused){
            main.tl_galaxy.timeScale( 10 )
        }
       
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
    // for(var a in this.frames){
    //     main.loadFrames(this.frames[a],function(){})
    // }  
    
    for(var i = 0;i<this.clouds.length;i++){
        var img = new Image();
        img.src = this.clouds[i];
        this.clouds[i] = img;
    }
    this.player1 = new Player("player1");
    this.player1.init(this.clouds);
    this.player1.callback2 = function(){//退出过度动画后重新开始回调 + 清理当前点的名字
        main.startRender();
        main.stage = 1;
        if(vm.server_data.gameData[webgl.currentPointName].needAnimation){
            webgl.PointData[webgl.currentPointName].icon.css({opacity:1});
            $(".animation-box").fi();
            
            setTimeout(function(){
                $(".animation-box").fo();
                webgl.PointData[webgl.currentPointName].icon.css({
                    transform:"translate3d(0,0,0) scale(1)",
                })
            },1000)


        }else{
            webgl.currentPointName = "";
            vm.server_data.gameData.currentPoint = "";
        }
        $(".player-container").fo(function(){
            $("#player1").hide();
        });
        
        
    };
    // if(!vm.ios){
    if(true){
        main.player2 = new Player("player2");
        main.player2.speed = 80;
    }
    if(!vm.server_data.haveFill){
        var type = vm.palert.choice.fill;
        var content = vm.palert.txt[type];
        vm.openAlert( type, content );
        return;
    }

    main.addEvent();
    webgl.loadCallback();
    main.startRender();
    
    setTimeout(function(){
        main.tl_galaxy.pause()
        vm.ploading.visible = false;
        vm.pwebgl.visible = true;
        $(".bg1").fo();
        $(".bg2").fi();
        $(".rule").show();
    },2000)

    // vm.pshare.visible = true;
    // vm.pend.visible = true;
    // vm.pguanzhu.visible = true;
    // vm.pfill.visible = true;
    // vm.paddress.visible = true;

    // _getData.getPrize(function( data ){
    //     if( data.status ){
    //         vm.pprize.visible = true;
    //         vm.server_data.prizeType = data.data;
    //     }
        
    // })

    // vm.pquery.visible = true;

        // var type = vm.palert.choice.reg;
        // var content = vm.palert.txt[type];
        // vm.openAlert( type, content );

    setTimeout(function(){
        TweenLite.to(webgl.earthGroup.position,4,{x:0,y:50,z:0,ease:"Linear.easeNone"})
        TweenLite.to(webgl.earthGroup.scale,4,{x:1,y:1,z:1,ease:"Linear.easeNone"})
        // TweenMax.to(three.camera.rotation,4,{x:0,y:0,z:0,ease:"Linear.easeNone"})
        TweenLite.to(webgl.earthGroup.rotation,4,{x:0,y:2 * Math.PI,z:0,ease:"Linear.easeNone",onComplete:function(){
            TweenLite.to(webgl.earthGroup.rotation,6,{x:0,y:0,z:0,ease:"Power2.easeOut"})
        }})
    },2000)
};
main.loadFrames = function( object, callback){
    var urls = object.urls;
    var len = urls.length;
    Utils.preloadImage2(urls,function(){
        object.load_complete = true;
        for(var i=0;i<len;i++){
            var img = new Image();
            img.src = urls[i];
            urls[i] = img;
        }
        callback();
    });
}

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
    var onIconTransitionEnd = function( e ){
        vm.server_data.gameData[webgl.currentPointName].needAnimation = false;
        webgl.currentPointName = "";
        vm.server_data.gameData.currentPoint = "";
        if( vm.key_index ==3){
            $(".animation-box .tip-all,.animation-box .big-icon").show();
            $(".animation-box .number").hide();
            $(".animation-box").fi();
        }
    }
    $(".right-box .icon2").on("transitionend",onIconTransitionEnd)
    document.body.ontouchmove = function( e ){
        e.preventDefault();
    };
    window.onresize = function(){
        three.onresize();
    }
    $(window).on("orientationchange",function( e ){
        if(window.orientation == 0 || window.orientation == 180 )
        {
            vm.hpwarn.visible = false;
        }
        else if(window.orientation == 90 || window.orientation == -90)
        {
            vm.hpwarn.visible = true;
        }
    });

    var Stage2ToStage1 = function(){
        main.player1.direction = -1;
        main.player1.repeat = 0;
    };
    var Stage3ToStage2 = function(){
        main.stage = 2;
        if( false ){
            main.frames[webgl.currentPointName].video.pause()
            main.frames[webgl.currentPointName].video.currentTime = 0;
            $("#player1").show();
            $(main.frames[webgl.currentPointName].video).hide();
            webgl.PointData[webgl.currentPointName].img.hide();
        }else{
            $("#player2").hide();
            main.player2.pause();
            main.player2.set( 0 );
            $("#player1").show();
            webgl.PointData[webgl.currentPointName].img.hide();
            webgl.PointData[webgl.currentPointName].music.pause();
            webgl.PointData[webgl.currentPointName].music.currentTime = 0;
        }

        main.player1.direction = -1;
        main.player1.repeat = 0;
        main.player1.set( main.player1.framesLength-1 );
        main.player1.play();
        $("#player1").show();
    };
    var Stage2ToStage3 = function(){
        if( false ){
            main.player1.direction = 1;
            main.player1.repeat = 0;  
        }else{
            main.player1.direction = 1;
            if( !main.frames[webgl.currentPointName].load_complete ){
                main.player1.loop = true;
            }else{
                main.player1.repeat = 0;
            }
        }
    };

    $(".long-press").on({
        touchstart:function(e){
            e.preventDefault();
            main.touch.isTouch = true;
            switch( main.stage ){
                case 1:
                    break;
                case 2:
                    Stage2ToStage3();
                    return;
                    break;   
            }
            // if(!main.player1.paused){
            //     main.player1.loop = true;
            //     main.player1.direction = 1;
            //     return;
            // }

            webgl.rotateToCenter()

            // webgl.earthGroup.quaternion.copy( q1 )

        },
        touchmove:function(){},
        touchend:function(){
            main.touch.isTouch = false;
            switch( main.stage ){
                case 1://还在Tween阶段
                    break;
                case 2://过渡反向序列帧
                    Stage2ToStage1();
                    break;
                case 3://视频退回过度
                    Stage3ToStage2();
                    break;
            }
            // if(!main.player1.paused){
            //     main.player1.repeat = 1;
            //     main.player1.direction = -1;
            // }
        },
    });

    $(".P_webgl .btn-box").on("touchstart",function(e){
        e.preventDefault();
    })
    // $(".video").on({
    //     play: function( e ){

    //         console.log( e );
    //         console.log( this );
            
    //     },
    //     end: function( e ){

    //         console.log( this );

    //     }
    // })
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








