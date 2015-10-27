/**
 * Created by jay on 2015/8/28.
 */
angular.module('localdiskModule', [])
    .config(function($stateProvider){
        $stateProvider
            .state('tabs.localdisk', {
                url: '/localdisk',
                views: {
                    'netdisk-tab': {
                        templateUrl: 'views/localdisk/localdisk.html',
                        controller: 'localdiskctrl'
                    }
                }

            });
    })
    .controller('localdiskctrl', function($scope,localdiskService,$rootScope,netdiskService,$state,$ionicModal,$ionicLoading){
        /*
         rootEntry:根目录；
         fileIndex：当前目录下的文件和目录信息；
         fileRoute:记录目录的路径；
         currentENtry：当前目录；
         nextEntry：点击的下有一个目录；
         selectedFile：被选择的文件数组。
         */
        $scope.nextEntry=null;
        localdiskService.EntryDisplay($rootScope.rootEntry);
        $scope.isBackshowOnLocal=function(){

        }

        $scope.doRefresh=function(){
            $scope.doRefresh = function() {
                $rootScope.fileIndex=[];
                localdiskService.EntryDisplay($rootScope.currentEntry);
                $scope.$broadcast('scroll.refreshComplete');
            };
        }

        $scope.fileUpload=function(fileOrder,res){
            //alert(angular.toJson(res));
            var i=fileOrder;
            var files=$rootScope.selectedFile;

            var a={
                file:files[i],
                status:true,
                progress:0
            }
            $rootScope.uploadFileIndex.push(a);
            var temp= $rootScope.uploadFileIndex.length-1;
            var t=$rootScope.m;
            $rootScope.uploadOrder[$rootScope.m]=temp;
            $rootScope.m++;

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
            netdiskService.fileUpload(data.filePath, data.url, data.params,t).then(function () {
                //alert(token);
                netdiskService.fileUploadCompleteAPI(data.token).then(
                    function () {
                        var i;
                        $rootScope.uploadFileIndex.splice($rootScope.uploadOrder[t],1);
                        $rootScope.completeUploadFileIndex.push(a);
                        $rootScope.uploadOrder[t]=0;
                        for (i=t+1;i<$rootScope.uploadOrder.length;i++){
                            $rootScope.uploadOrder[i]--;
                        }
                        //alert("success");
                        $rootScope.Refresh();
                    }
                );
            }, function (error) {
                $ionicLoading.show({
                        template: "上传失败，请检查网络",
                        delay:0,
                        duration:1000
                    }
                );
            });
        }

        $scope.fileUploadClick=function(){
           var files=$rootScope.selectedFile;
            //alert(angular.toJson(files));
            netdiskService.getFileUploadUrl(files).then(
                function(res){
                    $ionicLoading.show({
                            template: "已添加上传",
                            delay:0,
                            duration:1000
                        }
                    );
                    //alert(angular.toJson(res));
                    var i;
                    for (i=0;i<files.length;i++) {
                        $scope.fileUpload(i,res);
                    }
                    //$rootScope.Refresh();
                    $rootScope.selectedFile=[];
                    $rootScope.isTabsShow="";
                    $state.go("tabs.netdisk");
                },function(error){
                    $ionicLoading.show({
                        template: error.info,
                        delay:0,
                        duration:1000
                    });
                }
            )

        }

        $scope.indexSelectClick=function(){
            $rootScope.isTabsShow="tabs-item-hide";
            $state.go("tabs.indexSelect");

        }

        /*
         获取目录成功过函数和失败函数；
         */
        function getDirectorysuccess(dir){
            $scope.nextEntry=dir;
            $rootScope.fileIndex=[];
            $rootScope.selectedFile=[];
            $rootScope.currentEntry=$scope.nextEntry;
            $rootScope.fileRoute.push($rootScope.currentEntry);
            //alert(angular.toJson($rootScope.currentEntry));
            localdiskService.EntryDisplay($rootScope.currentEntry);
        }
        function getDirectoryfail(err){
            $ionicLoading.show({
                template: "获取目录失败",
                delay:0,
                duration:1000
            });
        }

        function getFilesuccess(dir){
            var name=dir.name;
            var index=$rootScope.fileIndex;
            var i;
            //alert(angular.toJson(index));
            for (i=0;i<index.length;i++){
                if (index[i].type==1&&index[i].name==dir.name){
                    $scope.$apply(function(){
                        if (index[i].selectedBox!="icon fa fa-check-square-o pull-right fa-lg") {
                            index[i].selectedBox = "icon fa fa-check-square-o pull-right fa-lg";
                            $rootScope.selectedFile.push(dir);
                        } else {
                            index[i].selectedBox = "";
                            $rootScope.selectedFile.pop();
                        }
                    });
                    // alert(angular.toJson(index[i])+"  "+name);
                }
            }
        }


        function getFilefail(err){
            //alert("error getDirectory");
            $ionicLoading.show({
                template: "获取目录失败",
                delay:0,
                duration:1000
            });
        }




        /*
         点击目录条目的函数；
         */
        $scope.indexClick=function(fileName){
            //alert(angular.toJson($rootScope.fileIndex));
            //alert(angular.toJson(localdiskService.isFileorEntry(fileName)))
            var fileType=localdiskService.fileType(fileName);
            // alert(fileType);
            if (fileType=="ENTRY"){
                $rootScope.currentEntry.getDirectory(fileName, {
                    create: false,
                    exclusive: false
                }, getDirectorysuccess, getDirectoryfail);
            }else {
                $rootScope.currentEntry.getFile(fileName,{
                    create: false,
                    exclusive: false
                }, getFilesuccess, getFilefail);
            }
        }



        /*
         返回上一层的函数
         */
        $scope.backClick=function(){
            if ($rootScope.currentEntry==$rootScope.rootEntry) return;
            $rootScope.fileIndex=[];
            $rootScope.fileRoute.pop();
            $rootScope.currentEntry=$rootScope.fileRoute[$rootScope.fileRoute.length-1];
            // alert(angular.toJson($rootScope.currentEntry));
            localdiskService.EntryDisplay($rootScope.currentEntry);
        }


    });