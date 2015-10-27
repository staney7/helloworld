/**
 * Created by jay on 2015/9/27.
 */
angular.module('indexSelectModule', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('tabs.indexSelect', {
                url: '/indexSelect',
                views: {
                    'netdisk-tab': {
                        templateUrl: 'views/localdisk/indexSelect.html',
                        controller: 'indexSelectCtrl'
                    }
                }
            });
    })
    .controller('indexSelectCtrl', function ($scope,$rootScope,  $state, $ionicNavBarDelegate,netdiskService,$ionicLoading) {


        $scope.fileUpload=function(fileOrder,res){
            //alert(angular.toJson(res));
            var i=fileOrder;
            var files=$rootScope.selectedFile;
            var data={};
            data["id"]=files[i].name + i;
            data["url"]=res[data.id].url;
            data["token"]=res[data.id].token;
            data["params"] = {
                name: files[i].name,
                max_file_size: res[data.id].max_file_size,
                max_file_count: res[data.id].max_file_count,
                expires: res[data.id].expires,
                signature: res[data.id].signature,
                redirect: ""
            };
            data["filePath"]=files[i].nativeURL;
            //alert(angular.toJson(data));
            netdiskService.fileUpload(data.filePath, data.url, data.params).then(function () {
                //alert(token);
                netdiskService.fileUploadCompleteAPI(data.token).then(
                    function () {
                        //alert("success");
                        $rootScope.Refresh();
                    }
                );
            }, function (error) {
                $ionicLoading.show({
                    template: error.info,
                    delay:0,
                    duration:1000
                });
            });
        }

        $scope.fileUploadClick=function(){
            var confirmPopup = $ionicPopup.confirm({
                title: '上传文件',
                template: "你确定要上传这些文件么？",
                cancelText:"取消",
                okText:"确定"
            }).then(function(res){
                if (res) {
                    var files=$rootScope.selectedFile;
                    //alert(angular.toJson(files));
                    netdiskService.getFileUploadUrl(files).then(
                        function(res){
                            $ionicLoading.show({
                                template: "已添加上传",
                                delay:0,
                                duration:1000
                            });
                            //alert(angular.toJson(res));
                            var i;
                            for (i=0;i<files.length;i++) {
                                $scope.fileUpload(i,res);
                            }
                            $rootScope.Refresh();
                            $rootScope.selectedFile=[];
                            $rootScope.isTabsShow="";
                            $state.go("tabs.netdisk");
                        },function(error){
                            //alert(angular.toJson(error));
                            $ionicLoading.show({
                                template: error.info,
                                delay:0,
                                duration:1000
                            });
                        }
                    )

                }
            });

        }

        $scope.backClick=function(){
            if ($rootScope.f_id==0) return;
            var now=getOrderByID($rootScope.f_id);
            $rootScope.f_id=$rootScope.rootFileTree[now].f_id;
            $rootScope.refreshIndex($rootScope.f_id);
            $rootScope.fids=[];
        }

        function getOrderByID(id){
            var i=0;
            for (i=0;i<$rootScope.rootFileTree.length;i++){
                if ($rootScope.rootFileTree[i].id==id){
                    return i;
                }
            }
            return -1;
        }
        $scope.backButtonClick=function(){
            $rootScope.fids=[];
            $rootScope.refreshIndex($rootScope.netdiskCurrentID);
            $ionicNavBarDelegate.back();
        }

        $scope.doRefresh=function(){
            $rootScope.Refresh();
            $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.currentFileRoute=function(){
            var fileRoute="";
            var id=$rootScope.f_id;
            while (id!=null){
                var now=getOrderByID(id);
                var filename=$rootScope.rootFileTree[now].name;
                fileRoute=filename+"/"+fileRoute;
                id=$rootScope.rootFileTree[now].f_id;
            }
            return fileRoute;
        }

        $scope.indexClick=function(file) {
            $rootScope.f_id = file.id;
            $rootScope.refreshIndex($rootScope.f_id);
        }
    })