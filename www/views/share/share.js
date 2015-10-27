angular.module('shareModule', [])
    .config(function($stateProvider){
        $stateProvider
            .state('tabs.share', {
                url: '/share',
                views: {
                    'share-tab': {
                        templateUrl: 'views/share/share.html',
                        controller: 'shareCtrl'
                    }
                }
            });
    })
    .controller('shareCtrl', function($scope,shareService,storageService,$rootScope,$ionicPopup,$ionicLoading){
      //share ctrl
        $scope.selectedShareFiles=[];
        $scope.shareFileTree=[];
        $rootScope.isShareFileItemShow=[];

        $scope.RefreshByShareTree=function(){
            var tree=storageService.get('shareFile');
            if (tree!=null) {
                $rootScope.shareFileIndex=tree;
            } else {
                $rootScope.RefreshShareFile();
            }
        }
        $scope.doRefresh=function(){
            $rootScope.RefreshShareFile();
            $scope.$broadcast('scroll.refreshComplete');
        }

        $scope.deleteShareFile=function(file){
            //var ids=$scope.selectedShareFiles;
            var filename=file.name;
            var confirmPopup = $ionicPopup.confirm({
                title: '取消分享',
                template: '你确定要取消分享么'+filename+"？",
                cancelText:"取消",
                okText:"确定"
            }).then(
                function(res){
                    $ionicLoading.show({
                            template: "正在取消分享...",
                            delay:0
                        }
                    )
                    if (res){
                        var ids=file.id;
                        shareService.deleteShareFile(ids).then(function(res){
                                $rootScope.RefreshShareFile();
                                $ionicLoading.hide();
                                //alert(angular.toJson(res));
                            },function(error){
                                $ionicLoading.hide();
                                $ionicLoading.show({
                                    template: error.info,
                                    delay:0,
                                    duration:1000
                                });
                            }
                        )
                    }
                }
            )

        };
        $scope.copyShareFileLink=function(){

        };

        $scope.indexClick=function(){
            var i;
            for (i=0;i<$rootScope.shareFileIndex.length;i++){
                if (file==$rootScope.shareFileIndex[i]){
                    $rootScope.isShareFileItemShow[i]=!$rootScope.isShareFileItemShow[i];
                } else {
                    $rootScope.isShareFileItemShow[i]=false;
                }
            }
        }

        $scope.isFileMenuShow=function(file){
            var i,t;
            for (i=0;i<$rootScope.shareFileIndex.length;i++){
                if (file==$rootScope.shareFileIndex[i]) {
                    return $rootScope.isShareFileItemShow[i];
                }
            }
            return false;
        }



        $scope.RefreshByShareTree();
    });