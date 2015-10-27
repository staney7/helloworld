// Ionic Rec App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('RecApp', ['ionic','shareModule','indexSelectModule','moveModule','listModule', 'userModule', 'netdiskModule', 'aboutMeModule','localdiskModule','ngCordova','netdiskModule1'])
        .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, $httpProvider) {
            $ionicConfigProvider.tabs.position('bottom');
            $stateProvider
                    .state('tabs', {
                        abstract: true,
                        url: '/tabs',
                        templateUrl: 'views/tabs/tabs.html'
                    });


            $urlRouterProvider.otherwise('tabs/netdisk');
            $httpProvider.defaults.transformRequest = function (data) {
                if (!angular.isObject(data)) {
                    return ((data == null) ? "" : data.toString());
                }
                var buffer = [];
                for (var p in data) {
                    if (!data.hasOwnProperty(p))
                        continue;
                    buffer.push(encodeURIComponent(p) + "=" +
                            encodeURIComponent((data[p] == null) ? "" : data[p]));
                }
                return buffer.join("&");
            };
            $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        })
    .run(function ($ionicPlatform, $ionicLoading,$rootScope, $location, $timeout, $ionicHistory, $cordovaToast,storageService,localdiskService,shareService) {
        $rootScope.isTabsShow="";
        $rootScope.shareFileIndex=[];
        $rootScope.netdiskFileIndex=[];
        $rootScope.netdiskFolderIndex=[];
        $rootScope.f_id=0;
        $rootScope.fids=[];

        $rootScope.rootFileTree=[];
        $rootScope.netdiskCurrentID=0;
        $rootScope.netdiskCurrentFolderID=0;

        $rootScope.rootEntry=null;
        $rootScope.fileIndex=[];
        $rootScope.fileRoute=[];
        $rootScope.currentEntry=null;
        $rootScope.selectedFile=[];

        $rootScope.isFileItemShow=[];
        $rootScope.isShareFileItemShow=[];

        $rootScope.downloadFileIndex=[];
        $rootScope.uploadFileIndex=[];
        $rootScope.completeDownloadFileIndex=[];
        $rootScope.completeUploadFileIndex=[];
        $rootScope.downloadOrder=[];
        $rootScope.uploadOrder=[];
        $rootScope.m=0;
        $rootScope.n=0;

        $rootScope.appInitial=function(){
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, onFileSystemSuccess, onFileSystemFail);
            }
            function onFileSystemSuccess(fileSystem) {
                $rootScope.rootEntry=fileSystem.root;
                $rootScope.currentEntry=$rootScope.rootEntry;
                $rootScope.fileRoute.push($rootScope.rootEntry);

                //alert(angular.toJson($rootScope.rootEntry));
            }
            function onFileSystemFail(err) {
                //alert(1);
            }
            var temp=storageService.get("downloadFileIndex");
            if (temp!=null) $rootScope.downloadFileIndex=temp;
            temp=storageService.get("completeDownloadFileIndex");
            if (temp!=null) $rootScope.completeDownloadFileIndex=temp;
            $rootScope.n=$rootScope.downloadFileIndex.length;

            var i;
            for (i=0;i<$rootScope.n;i++){
                $rootScope.downloadFileIndex[i].status=false;
                $rootScope.downloadOrder[i]=i;
            }
        };
        $rootScope.appInitial();




        $ionicPlatform.ready(function ($rootScope) {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                // org.apache.cordova.statusbar required
                StatusBar.styleDefault();
            }
        });
        //双击退出
        $ionicPlatform.registerBackButtonAction(function (e) {
            $rootScope.fids=[];
            //判断处于哪个页面时双击退出
            if (($location.path() == '/tabs/netdisk'&&$rootScope.netdiskCurrentID==0)||$location.path() == '/login') {
                if ($rootScope.backButtonPressedOnceToExit) {
                    ionic.Platform.exitApp();
                } else {
                    $rootScope.backButtonPressedOnceToExit = true;
                    $cordovaToast.showShortCenter('再按一次退出系统');
                    setTimeout(function () {
                        $rootScope.backButtonPressedOnceToExit = false;
                    }, 2000);
                }
            }
            else if($location.path() == '/tabs/netdisk'&&$rootScope.netdiskCurrentID!=0){
                $rootScope.$apply(function(){
                    $rootScope.backClick();
                })

            } else if( $location.path() == '/tabs/localdisk'&& $rootScope.currentEntry!=$rootScope.rootEntry) {
                if ($rootScope.currentEntry==$rootScope.rootEntry) return;
                $rootScope.fileIndex=[];
                $rootScope.fileRoute.pop();
                $rootScope.currentEntry=$rootScope.fileRoute[$rootScope.fileRoute.length-1];
                // alert(angular.toJson($rootScope.currentEntry));
                localdiskService.EntryDisplay($rootScope.currentEntry);
            }
            else if ($ionicHistory.backView()) {
                //alert(angular.toJson($location.path()));
                $rootScope.historyBack();
            } else {
                $rootScope.backButtonPressedOnceToExit = true;
                $cordovaToast.showShortCenter('再按一次退出系统');
                setTimeout(function () {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
            return false;
        }, 101);
        var   image_types = ['gif', 'png', 'jpg', 'jpeg', 'bmp'];
        var  doc_types = ['bib', 'csv', 'dbf', 'dif', 'doc', 'docx', 'emf', 'eps', 'fodg', 'fodp', 'fods', 'fodt', 'htm', 'html', 'ltx', 'met', 'odd', 'odg', 'odp', 'ods', 'odt', 'otg', 'otp', 'ots', 'ott', 'pbm', 'pct', 'pct', 'pdb', 'pdf', 'pgm', 'pot', 'potm', 'ppm', 'pps', 'ppt', 'pptx', 'psw', 'pwp', 'pxl', 'ras', 'rtf', 'sda', 'sdc', 'sdd', 'sdw', 'slk', 'stc', 'std', 'sti', 'stw', 'svg', 'svm', 'sxc', 'sxd', 'sxi', 'sxw', 'tiff', 'txt', 'uop', 'uos', 'uot', 'vor', 'wmf', 'wps', 'xhtml', 'xls', 'xlsx', 'xlt', 'xml', 'xpm'];
        var  media_types = ['3g2', '3gp', '4xm', 'a64', 'aac', 'ac3', 'act', 'adf', 'adp', 'adts', 'adx', 'aea', 'afc', 'aiff', 'alaw', 'alsa', 'amr', 'anm', 'apc', 'ape', 'aqtitle', 'asf', 'ass', 'ast', 'au', 'avi', 'avm2', 'avr', 'avs', 'bfi', 'bin', 'bink', 'bit', 'bmv', 'boa', 'brstm', 'c93', 'caf', 'cavsvideo', 'cdg', 'cdxl', 'cine', 'concat', 'crc', 'data', 'daud', 'dfa', 'dirac', 'dnxhd', 'dsicin', 'dts', 'dtshd', 'dv', 'dv1394', 'dvd', 'dxa', 'ea', 'ea_cdata', 'eac3', 'epaf', 'f32be', 'f32le', 'f4v', 'f64be', 'f64le', 'fbdev', 'ffm', 'ffmetadata', 'film_cpk', 'filmstrip', 'flac', 'flic', 'flv', 'framecrc', 'framemd5', 'frm', 'g722', 'g723_1', 'g729', 'gsm', 'gxf', 'h261', 'h263', 'h264', 'hds', 'hevc', 'hls', 'hnm', 'ico', 'idcin', 'idf', 'iff', 'ilbc', 'image2', 'image2pipe', 'ingenient', 'ipmovie', 'ipod', 'ircam', 'ismv', 'iss', 'iv8', 'ivf', 'jacosub', 'jv', 'latm', 'lavfi', 'lmlm4', 'loas', 'lvf', 'lxf', 'm4a', 'm4v', 'matroska', 'md5', 'mgsts', 'microdvd', 'mj2', 'mjpeg', 'mkv', 'mlp', 'mm', 'mmf', 'mov', 'mp2', 'mp3', 'mp4', 'mpc', 'mpc8', 'mpeg', 'mpg', 'mpeg1video', 'mpeg2video', 'mpegts', 'mpegtsraw', 'mpegvideo', 'mpjpeg', 'mpl2', 'mpsub', 'msnwctcp', 'mtv', 'mulaw', 'mv', 'mvi', 'mxf', 'mxf_d10', 'mxg', 'nc', 'nistsphere', 'nsv', 'nut', 'nuv', 'ogg', 'oma', 'opus', 'oss', 'paf', 'pjs', 'pmp', 'psp', 'psxstr', 'pva', 'pvf', 'qcp', 'r3d', 'rawvideo', 'realtext', 'redspark', 'rl2', 'rm', 'rmvb', 'roq', 'rpl', 'rsd', 'rso', 'rtp', 'rtsp', 's16be', 's16le', 's24be', 's24le', 's32be', 's32le', 's8', 'sami', 'sap', 'sbg', 'sdl', 'sdp', 'sdr2', 'segment', 'shn', 'siff', 'smjpeg', 'smk', 'smoothstreaming', 'smush', 'sol', 'sox', 'spdif', 'speex', 'srt', 'subviewer', 'subviewer1', 'svcd', 'swf', 'tak', 'tedcaptions', 'tee', 'thp', 'tiertexseq', 'tmv', 'truehd', 'tta', 'tty', 'txd', 'u16be', 'u16le', 'u24be', 'u24le', 'u32be', 'u32le', 'u8', 'uncodedframecrc', 'v4l2', 'vc1', 'vc1test', 'vcd', 'v4l2', 'vivo', 'vmd', 'vob', 'vobsub', 'voc', 'vplayer', 'vqf', 'w64', 'wav', 'wmv', 'wc3movie', 'webm', 'webvtt', 'wsaud', 'wsvqa', 'wtv', 'wv', 'xa', 'xbin', 'xmv', 'xwma', 'yop', 'yuv4mpegpipe'];
        $rootScope.getOrderByID=function(id){
            var i=0;
            for (i=0;i<$rootScope.rootFileTree.length;i++){
                if ($rootScope.rootFileTree[i].id==id){
                    return i;
                }
            }
            return -1;
        }

        $rootScope.historyBack=function(){

            if (($location.path() == '/tabs/localdisk') || ($location.path()=='/netdisk1')){
                $rootScope.isTabsShow="";
                //alert($rootScope.isTabsShow);
            }
            $ionicHistory.goBack();
        }
        $rootScope.refreshIndex=function(id){
            //alert(id);
            var now = $rootScope.getOrderByID(id);
            var index=$rootScope.rootFileTree[now].children;
            //alert(angular.toJson(index));

            $rootScope.netdiskFileIndex=[];
            $rootScope.netdiskFolderIndex=[];
            var i;
            for (i=0;i<index.length;i++){
                if (index[i].f_id==id&&index[i].type=="file"){
                    $rootScope.netdiskFileIndex.push(index[i]);
                }
            }
            for (i=0;i<$rootScope.rootFileTree.length;i++){
                if ($rootScope.rootFileTree[i].f_id==id){
                    $rootScope.netdiskFolderIndex.push($rootScope.rootFileTree[i]);
                }
            }
            for (i=0;i<$rootScope.netdiskFileIndex.length;i++){
                $rootScope.isFileItemShow[i]=false
            }
            //if ($rootScope.netdiskCurrentID==0) $rootScope.netdiskFolderIndex.shift();
        }
        $rootScope.backClick=function(){
            if ($rootScope.netdiskCurrentID==0) return;
            var now=$rootScope.getOrderByID($rootScope.netdiskCurrentID);
            $rootScope.netdiskCurrentID=$rootScope.rootFileTree[now].f_id;
            $rootScope.refreshIndex($rootScope.netdiskCurrentID);
            $rootScope.fids=[];
        }
        $rootScope.RefreshShareFile=function(){
            shareService.getShareFileTree().then(function(res){
                //alert(angular.toJson(res));
                $rootScope.shareFileIndex=res;
                storageService.set('shareFile',res);
            },function(error){
                //alert(angular.toJson(error));
                $ionicLoading.show({
                    template: error.info,
                    delay:0,
                    duration:1000
                });
            });
        };

        $rootScope.fileType=function(filetype){
            if (image_types.indexOf(filetype) != -1) {
                return "icon fa fa-file-image-o"
            }
            if (doc_types.indexOf(filetype) != -1) {
                return "icon fa fa-file-text";
            }
            if (media_types.indexOf(filetype) != -1) {
                return "icon fa fa-file-video-o";
            }
            return "icon fa fa-file fa-2x"
        }
        $rootScope.fileIconType=function(entry){
            if (entry.type=="file") {
                return $rootScope.fileType(entry.file_ext);
            } else
                return "icon ion-ios-folder";
        }
        $rootScope.shareFileIconType=function(file){
            if (file.object_type==0){
                return "icon fa fa-file fa-2x"
            } else if (file.object_type==1){
                return "icon fa fa-file-text";
            } else if (file.object_type==2){
                return "icon fa fa-file-video-o";
            } else if (file.object_type==3){
                return "icon fa fa-file-image-o"
            }
        }

        $rootScope.isBackShow=function(){
            //alert(angular.toJson($location.path()));
            if($location.path()=="/tabs/netdisk"||$location.path()=="/netdisk1"){
                //alert(1);
                if ($rootScope.netdiskCurrentID==0) return false ;
                else return true;

            } else if ($location.path()=="/tabs/localdisk"){
                //alert(angular.toJson($rootScope.currentEntry));
                //alert(angular.toJson($rootScope.rootEntry));
                if ($rootScope.currentEntry==$rootScope.rootEntry){
                    return false ;
                } else return true;
            } else if ($location.path()=="/tabs/indexSelect"){
                if ($rootScope.f_id==0) return false;
                else return true;
            } else if ($location.path()=="/tabs/move"){
                if ($rootScope.netdiskCurrentFolderID==0) return false;
                else return true;
            }
        }

        $rootScope.bytesToOthers=function(t){
            t=t*1.0;
            if (t>0&&t<1024) return t.toFixed(2)+"bytes";
            t=t/1024;
            if (t>0&&t<1024) return t.toFixed(2)+"KB";
            t=t/1024;
            if (t>0&&t<1024) return t.toFixed(2)+"MB";
            t=t/1024;
            if (t>0&&t<1024) return t.toFixed(2)+"GB";
            return t;
        }

        $rootScope.filenameChange=function(filename){
            if (filename.length>28){
                return filename.substr(0,12)+"..."+filename.substr(filename.length-12,filename.length);
            }
            return filename;
        }

    })
