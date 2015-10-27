/**
 * Created by jay on 2015/9/27.
 */
angular.module('moveModule', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('tabs.move', {
                url: '/move',
                views: {
                    'netdisk-tab': {
                        templateUrl: 'views/move/move.html',
                        controller: 'moveCtrl'
                    }
                }
            });
    })
    .controller('moveCtrl', function ($scope,$rootScope, $ionicLoading, $state, $ionicHistory,netdiskService,$ionicPopup) {
// move Controller
        function getOrderByID(id){
            var i=0;
            for (i=0;i<$rootScope.rootFileTree.length;i++){
                if ($rootScope.rootFileTree[i].id==id){
                    return i;
                }
            }
            return -1;
        }

        $scope.backClick=function(){
            if ($rootScope.netdiskCurrentFolderID==0) return;
            var now=getOrderByID($rootScope.netdiskCurrentFolderID);
            $rootScope.netdiskCurrentFolderID=$rootScope.rootFileTree[now].f_id;
            $rootScope.refreshIndex($rootScope.netdiskCurrentFolderID);
        }

        $scope.backButtonClick=function(){
            $rootScope.fids=[];
            $rootScope.refreshIndex($rootScope.netdiskCurrentID);
            $rootScope.isTabsShow="";
            $state.go("tabs.netdisk");
            //$ionicHistory.goBack(-2);
            //alert(angular.toJson($ionicHistory));
            //$ionicNavBarDelegate.back();
        }

        $scope.moveClick=function(){
            var confirmPopup = $ionicPopup.confirm({
                title: '移动',
                template: '你确定要移动多个文件么？',
                cancelText:"取消",
                okText:"确定"
            }).then(
                function(res){
                    if (res){
                        $ionicLoading.show({
                                template: "正在移动，请稍候",
                                delay:0
                            }
                        );
                        //alert(angular.toJson($rootScope.fids));
                        netdiskService.moveFile($rootScope.netdiskCurrentFolderID,$rootScope.fids).then(function(res){
                            $rootScope.Refresh();
                            $ionicLoading.hide();
                            $rootScope.isTabsShow="";
                            $state.go("tabs.netdisk");
                            //$ionicHistory.goBack(-2);
                        },function(error){
                            $ionicLoading.hide();
                            errorinfo=angular.toJson(error);
                            var alertPopup = $ionicPopup.alert({
                                title: '信息',
                                template:errorinfo
                            }).then(function(){
                                    $rootScope.isTabsShow="";
                                    //$ionicHistory.goBack(-2);
                                    $state.go("tabs.netdisk");
                                }
                            );
                        })
                    }
                }
            );

        }

        $scope.doRefresh=function(){
            $rootScope.Refresh();
            $scope.$broadcast('scroll.refreshComplete');
        }
        $scope.currentFileRoute=function(){
            var fileRoute="";
            var id=$rootScope.netdiskCurrentFolderID;
            while (id!=null){
                var now=getOrderByID(id);
                var filename=$rootScope.rootFileTree[now].name;
                fileRoute=filename+"/"+fileRoute;
                id=$rootScope.rootFileTree[now].f_id;
            }
            return fileRoute;
        }

        $scope.indexClick=function(file) {
                //alert(angular.toJson(file));
            $rootScope.netdiskCurrentFolderID = file.id;
            //alert($rootScope.netdiskCurrentID);
            //alert($rootScope.netdiskCurrentFolderID);
            $rootScope.refreshIndex($rootScope.netdiskCurrentFolderID);
        }
    })