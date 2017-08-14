var _getData = {
    getProvince:function( callback ){
        // $.post(
        //     "index.php",
        //     {action : "get_province" },
        //     function (data) {
        //         data = eval("("+data+")");
        //         if(callback){
        //             callback(data)
        //         }
        //     }
        // );

        $.post(
            "province.json",
            function (data) {
                if(callback){
                    callback(data)
                }
            }
        );
    },
    getCity:function( callback ){
        //更新vm.server_data.city这个数组
        // $.post(
        //     "index.php",
        //     {action : "get_city" , province : vm.server_data.province},
        //     function (data) {
        //         callback && callback(data)
        //     }
        // );


        $.post(
            "city.json",
            function (data) {
                if(callback){
                    callback(data)
                }
            }
        );
    },
    getShop:function( callback ){
        //更新vm.server_data.address这个数组
        $.post(
            "index.php",
            {action : "get_shop" , city : vm.server_data.city},
            function (data) {
                data = eval("("+data+")");
                callback && callback();
            }
        );
    },
    getPrize:function( callback ){
        // $.getJSON("index.php",{action:"lottery"},function( data ){
        //     if( callback ){
        //         callback( data );
        //     }
        // });

        $.getJSON("getprize.json",function( data ){
            if( callback ){
                callback( data );
            }
        });
    },
    getMyInfo:function( callback ){
        $.getJSON("myinfo.json",function( data ){
            if( callback ){
                callback( data );
            }
        });

        // $.getJSON("index.php",{action:"my_info"},function( data ){
        //     if( callback ){
        //         callback( data );
        //     }
        // });
    },
    getVipInfo:function(callback){
        $.getJSON("vipInfo.json",function(data){
            callback&&callback(data);
        })
    },
};

var _uploadData = {
    addInfo:function( callback ){
        // $.getJSON("index.php",{action:"add_info"},function( data ){
        //     if( callback ){
        //         callback( data );
        //     }
        // });

        console.log("上传数据")
    }
};