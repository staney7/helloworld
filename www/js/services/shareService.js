angular.module('shareModule')
    .constant("getShareFileTreeAPI","http://rec.ustc.edu.cn/api/share/items")
    .constant("deleteShareFileAPI","http://rec.ustc.edu.cn/api/share/delete")
    .constant("shareFileAPI","http://rec.ustc.edu.cn/api/share/create")
    .factory('shareService', function(getShareFileTreeAPI,deleteShareFileAPI,shareFileAPI,$http,$q){
        // share Service
        return{
            //获取分享文件目录树
            getShareFileTree:function(){
                var delay = $q.defer();
                var server=getShareFileTreeAPI;
                $http.get(server).
                    success(function(res, status, headers, config) {
                        if (res.status) {
                            delay.resolve(res.data);
                        } else {
                            delay.reject({info:res.message});
                        }
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        delay.reject({info:"获取分享目录树失败，请检查网络"});
                    })
                return delay.promise;
            },
            //删除分享文件
            //ids：删除文件的id的数组
            deleteShareFile:function(ids){
                var delay = $q.defer();
                var server=deleteShareFileAPI;
                msg={
                    ids:ids
                }
                $http.post(server, msg).
                    success(function(data, status, headers, config) {
                        if (data.status) {
                            delay.resolve({info: "取消分享成功"});
                        } else {
                            delay.reject({info:data.message});
                        }
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        delay.reject({info:"取消分享失败，请检查网络"});
                    })
                return delay.promise;
            },
            //分享文件的接口
            //id：分享文件的id
            //mod：分享文件的形式包括public和pwd：
            shareFile:function(id,mod){
                var delay = $q.defer();
                var server=shareFileAPI;
                msg={
                    id:id,
                    mod: mod,
                    type: "file"
                }
                $http.post(server, msg).
                    success(function(data, status, headers, config) {
                        //alert(angular.toJson(data));
                        if (data.status) {
                            delay.resolve({info: "分享成功"});
                        } else {

                            delay.reject({info:data.message});
                        }
                    }).
                    error(function(data, status, headers, config) {
                        // called asynchronously if an error occurs
                        // or server returns response with an error status.
                        delay.reject({info:"分享失败,请检查网络问题"});
                    })
                return delay.promise;

            }

        }
    });