$.getStore = function (url,option,fun,all,test) {//构造ajax
    var jsonpCallback = "";
    if(test=="test") {
        var indexF = url.lastIndexOf("/"),
            indexL = url.length//.lastIndexOf(".");
        if(indexF>-1&&indexL>-1) {
            jsonpCallback = url.substring(indexF+1,indexL); 
            url = "js/data/" + jsonpCallback + ".js";//获得测试接口名称  
        }            
    }
    $.ajax({
        type: "GET",
        url: url,
        data: option,
        dataType: 'jsonp',
        jsonpCallback: jsonpCallback,
        beforeSend:function(){
        },
        success:function(data){
            if(data){
                if(all) {
                    fun(data);
                } else {
                    var resultData = data.resultData;
                    if(resultData.success==true) {fun(resultData);console.log(data.resultMsg);}
                    else {
                        console.log(resultData.msg || '1网络连接出问题了，请稍后重试');
                    } 
                }
            } else {
                console.log('0网络连接出问题了，请稍后重试');
            }
        },
        error:function(){
            console.log('error 网络连接出问题了，请稍后重试');
        }
    });
}