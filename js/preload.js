/**
 * Created by Administrator on 2017/8/12.
 */
if ( Object.assign === undefined ) {

    // Missing in IE
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign

    ( function () {

        Object.assign = function ( target ) {

            'use strict';

            if ( target === undefined || target === null ) {

                throw new TypeError( 'Cannot convert undefined or null to object' );

            }

            var output = Object( target );

            for ( var index = 1; index < arguments.length; index ++ ) {

                var source = arguments[ index ];

                if ( source !== undefined && source !== null ) {

                    for ( var nextKey in source ) {

                        if ( Object.prototype.hasOwnProperty.call( source, nextKey ) ) {

                            output[ nextKey ] = source[ nextKey ];

                        }

                    }

                }

            }

            return output;

        };

    } )();

}
var picUrl = "assets/images/"
var arr = [
    {
        url:picUrl+"bg2.jpg",
        group:"clouds"
    }, {
        url:picUrl+"bg3.jpg",
        group:"scene"
    }, {
        url:picUrl+"box.png",
    }, {
        url:picUrl+"box-btn-1.png",
    }, {
        url:picUrl+"box-btn-2.png",
    }, {
        url:picUrl+"close.png",
    }, {
        url:picUrl+"hl.png",
    }, {
        url:picUrl+"kuang.png",
    }, {
        url:picUrl+"liuxing.png",
    },


];


function ImageLoader(){
    this.total = 0;
    this.haveload = 0;
    this.percent = 0;
    this.complete = false;
    this.version = "?v1";
}

Object.assign( ImageLoader.prototype,{

    load: function( urls, onEveryLoad, onComplete){
        var result = {
            0:[]
        };

        this.total = urls.length;

        var _this = this;

        start();

        function onLoad( e ){

            if( Object.prototype.hasOwnProperty.call( urls[_this.haveload], "group" ) ){
                var group = urls[_this.haveload].group;
                if(result[group] instanceof Array == false){
                    result[group] = [];
                }
                result[group].push(this)
            }else{
                result[0].push( this );
            }

            _this.haveload++;
            _this.percent = Math.floor(_this.haveload/_this.total*100);
            onEveryLoad(_this.percent);
            this.onload = null;

            if(_this.percent == 100){
                _this.complete = true;
                onComplete(result)
                return;
            }
            var img = new Image();
            img.onload = onLoad;
            img.src = urls[_this.haveload].url+_this.version;


        }

        function start(){
            var img = new Image();
            img.onload = onLoad;
            img.src = urls[_this.haveload].url+_this.version;
        }

    }

});



// var loader = new ImageLoader();
//
// loader.load(arr,function(progress){
//     console.log(progress)
// },function(result){
//     console.log(result)
// });