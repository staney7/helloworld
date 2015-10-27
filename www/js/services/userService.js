angular.module('userModule')
    .constant('completeLoginAPI', 'http://rec.ustc.edu.cn/api/user/mplat_login')
    .constant('checkUserLoginInfoAPI','https://m.ustc.edu.cn/mobileplat/core/openapi/checkUserLoginInfo')
    .constant('getAppTokenAPI','https://m.ustc.edu.cn/mobileplat/core/openapi/getAppToken')
    .factory('userService', function ($q, $http, completeLoginAPI,getAppTokenAPI,checkUserLoginInfoAPI) {
        // user Service
        return {
            getAppToken:function(){
                var params =
                {
                    'code' : '1694',
                    'key' : '2b7f621c-5840-4c37-a8b8-639cafd08b87'
                };
                var delay = $q.defer();
                var url=getAppTokenAPI;
                $http.post(url, params).then(function (res) {
                    //s
                    var rs = res.data;
                    if(rs.retcode!=0){
                        delay.reject({info:rs.retmsg});
                    }else{
                        delay.resolve(rs);
                    }
                }, function (errinfo) {
                    delay.reject({info: '获取apptoken失败,请检查网络'});
                });
                return delay.promise;
            },
            auth: function(params){
                var delay = $q.defer();
                var url=checkUserLoginInfoAPI;
                $http.post(url, params).then(function (res) {
                    var rs = res.data;
                    //alert(angular.toJson(res));
                    if(rs.retcode!=0){
                       // alert(1);
                        delay.reject({info: rs.retmsg});
                    }else{
                        //alert(2);
                        delay.resolve(rs);
                    }
                }, function (errinfo) {
                    delay.reject({info: '验证失败，请检查网络'});
                });
                return delay.promise;
            },
            completeLogin:function(params){
                var delay = $q.defer();
                var url=completeLoginAPI
                $http.post(url,params).then(function (res) {
                    //alert(angular.toJson(res));
                    var rs = res.data;

                    if (rs.status) {
                        //alert(angular.toJson(rs.data));
                        delay.resolve(rs.data);
                    } else {
                        delay.reject({info: rs.message});
                    }
                }, function (errinfo) {
                    delay.reject({info: '获取用户信息失败，请检查网络'});
                });
                return delay.promise;
            }
        };
    });