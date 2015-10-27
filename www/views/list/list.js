/**
 * Created by jay on 2015/8/28.
 */
angular.module("listModule", [])
    .config(function($stateProvider){
        $stateProvider
            .state('tabs.list', {
                url: '/list',
                views: {
                    'netdisk-tab': {
                        templateUrl: 'views/list/list.html',
                        controller: 'listCtrl'
                    }
                }
            });
    })
    .controller('listCtrl', function($scope,$ionicPopup,$rootScope,storageService,netdiskService){
        $scope.card=[false,false,false,false];
        $scope.click=function(id){

            $scope.card[id]=!$scope.card[id];
        };
        $scope.icon=function(id){
            if ($scope.card[id]==false){
                return "fa-angle-right"
            }
            return "fa-angle-down";
        };
        $scope.progressbarColor=function(file){
            if (file.status) return "progress-bar-info";
            else return "progress-bar-danger"
        };

        $scope.completeDownloadListItemClick=function(file){
            var myPopup = $ionicPopup.show({
                template: '',
                title: '你确定要删除么',
                scope: $scope,
                buttons: [
                    {text: '取消'},
                   {
                        text: "删除",
                        type: 'button-assertive',
                        onTap: function (e) {
                            var t,i;
                            for (i=0;i<$rootScope.completeDownloadFileIndex.length;i++){
                                if ($rootScope.completeDownloadFileIndex[i]==file) t=i;
                            }
                            alert(t);
                            $rootScope.completeDownloadFileIndex.splice(t, 1);
                            storageService.set("completeDownloadFileIndex", $rootScope.completeDownloadFileIndex);
                        }
                    }
                ]
            });
        }

        $scope.downloadListItemClick=function(file){
            if (!file.status) {
                var myPopup = $ionicPopup.show({
                    template: '',
                    title: '文件下载失败',
                    scope: $scope,
                    buttons: [
                        {text: '取消'},
                        {
                            text: '重新',
                            type: 'button-positive',
                            onTap: function (e) {
                                var id = file.file.id;
                                var filename = file.file.name;
                                file.status = true;
                                file.progress = 0;
                                var t = -1, i, j;
                                for (j = 0; j < $rootScope.n; j++) {
                                    var temp = $rootScope.downloadOrder[j];
                                    //alert(temp);
                                    if ($rootScope.downloadFileIndex[temp] == file) t = j;
                                }
                                var a = {
                                    file: file.file,
                                    status: true,
                                    progress: 0
                                }
                                storageService.set("downloadFileIndex", $rootScope.downloadFileIndex);
                                netdiskService.getDownloadUrl(id).then(
                                    function (url) {
                                        //alert(angular.toJson(url));
                                        netdiskService.downloadFile(url, filename, t).then(function () {
                                                var i;
                                                $rootScope.downloadFileIndex.splice($rootScope.downloadOrder[t], 1);
                                                $rootScope.completeDownloadFileIndex.push(a);
                                                $rootScope.downloadOrder[t] = -1;
                                                for (i = t + 1; i < $rootScope.downloadOrder.length; i++) {
                                                    $rootScope.downloadOrder[i]--;
                                                }
                                                //alert(angular.toJson($rootScope.downloadFileIndex));
                                                storageService.set("downloadFileIndex", $rootScope.downloadFileIndex);
                                                storageService.set("completeDownloadFileIndex", $rootScope.completeDownloadFileIndex);
                                            }, function (errorinfo) {
                                                $rootScope.downloadFileIndex[$rootScope.downloadOrder[t]].status = false;
                                                alert(angular.toJson(errorinfo));
                                            }
                                        );
                                    },
                                    function (error) {
                                        //alert(angular.toJson(error));
                                    }
                                )
                            }
                        }, {
                            text: "删除",
                            type: 'button-assertive',
                            onTap: function (e) {
                                //alert(angular.toJson(file));
                                var t = -1, i, j;
                                for (j = 0; j < $rootScope.n; j++) {
                                    var temp = $rootScope.downloadOrder[j];
                                    //alert(temp);
                                    if ($rootScope.downloadFileIndex[temp] == file) t = j;
                                }
                                //alert(angular.toJson($rootScope.downloadFileIndex));
                                //alert(angular.toJson($rootScope.downloadOrder));
                                //alert(t);
                                if (t != -1) {
                                    $rootScope.downloadFileIndex.splice($rootScope.downloadOrder[t], 1);
                                    $rootScope.downloadOrder[t] = 0;
                                    for (i = t + 1; i < $rootScope.downloadOrder.length; i++) {
                                        $rootScope.downloadOrder[i]--;
                                    }
                                    storageService.set("downloadFileIndex", $rootScope.downloadFileIndex);
                                }
                                //alert(angular.toJson($rootScope.downloadFileIndex));
                                //alert(angular.toJson($rootScope.downloadOrder));
                            }
                        }
                    ]
                });
            }
        };

        $scope.progressLength=function(file,t){
            if (t==1) {
                //alert(angular.toJson(file));
                return "width:" + file.progress + "%;height:10px;";
            }  else if (t==2){
                //alert(angular.toJson(file));
                return   "width:" + file.progress + "%;height:10px";
            }
        };
        $scope.getFileType= function(fileName){
            var temp=fileName.split(".");
            // alert(angular.toJson(temp));
            if (temp.length==1) return "OTHERS"

            var lastName=temp[temp.length-1];
            return lastName;
        };
       $scope.remainBytes=function(file){

           var a=Math.ceil(file.progress/100*file.file.bytes);
           var temp=$rootScope.bytesToOthers(a)+"/"+$rootScope.bytesToOthers(file.file.bytes);

           if (file.status)
           return temp;
           else return "下载失败";
       };

    });