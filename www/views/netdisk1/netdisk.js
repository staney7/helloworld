angular.module('netdiskModule1', [])
.config(function($stateProvider){
	$stateProvider
		.state('netdisk1', {
			url: '/netdisk1',
			templateUrl: 'views/netdisk1/netdisk.html',
			controller: 'netdiskCtrl1'
		});
})
.controller('netdiskCtrl1', function($scope,  $cordovaVibration,$ionicLoading,$state,$rootScope,netdiskService,storageService,$ionicPopup,$cordovaFileTransfer,$timeout){
		var   image_types = ['gif', 'png', 'jpg', 'jpeg', 'bmp'];
		var  doc_types = ['bib', 'csv', 'dbf', 'dif', 'doc', 'docx', 'emf', 'eps', 'fodg', 'fodp', 'fods', 'fodt', 'htm', 'html', 'ltx', 'met', 'odd', 'odg', 'odp', 'ods', 'odt', 'otg', 'otp', 'ots', 'ott', 'pbm', 'pct', 'pct', 'pdb', 'pdf', 'pgm', 'pot', 'potm', 'ppm', 'pps', 'ppt', 'pptx', 'psw', 'pwp', 'pxl', 'ras', 'rtf', 'sda', 'sdc', 'sdd', 'sdw', 'slk', 'stc', 'std', 'sti', 'stw', 'svg', 'svm', 'sxc', 'sxd', 'sxi', 'sxw', 'tiff', 'txt', 'uop', 'uos', 'uot', 'vor', 'wmf', 'wps', 'xhtml', 'xls', 'xlsx', 'xlt', 'xml', 'xpm'];
		var  media_types = ['3g2', '3gp', '4xm', 'a64', 'aac', 'ac3', 'act', 'adf', 'adp', 'adts', 'adx', 'aea', 'afc', 'aiff', 'alaw', 'alsa', 'amr', 'anm', 'apc', 'ape', 'aqtitle', 'asf', 'ass', 'ast', 'au', 'avi', 'avm2', 'avr', 'avs', 'bfi', 'bin', 'bink', 'bit', 'bmv', 'boa', 'brstm', 'c93', 'caf', 'cavsvideo', 'cdg', 'cdxl', 'cine', 'concat', 'crc', 'data', 'daud', 'dfa', 'dirac', 'dnxhd', 'dsicin', 'dts', 'dtshd', 'dv', 'dv1394', 'dvd', 'dxa', 'ea', 'ea_cdata', 'eac3', 'epaf', 'f32be', 'f32le', 'f4v', 'f64be', 'f64le', 'fbdev', 'ffm', 'ffmetadata', 'film_cpk', 'filmstrip', 'flac', 'flic', 'flv', 'framecrc', 'framemd5', 'frm', 'g722', 'g723_1', 'g729', 'gsm', 'gxf', 'h261', 'h263', 'h264', 'hds', 'hevc', 'hls', 'hnm', 'ico', 'idcin', 'idf', 'iff', 'ilbc', 'image2', 'image2pipe', 'ingenient', 'ipmovie', 'ipod', 'ircam', 'ismv', 'iss', 'iv8', 'ivf', 'jacosub', 'jv', 'latm', 'lavfi', 'lmlm4', 'loas', 'lvf', 'lxf', 'm4a', 'm4v', 'matroska', 'md5', 'mgsts', 'microdvd', 'mj2', 'mjpeg', 'mkv', 'mlp', 'mm', 'mmf', 'mov', 'mp2', 'mp3', 'mp4', 'mpc', 'mpc8', 'mpeg', 'mpg', 'mpeg1video', 'mpeg2video', 'mpegts', 'mpegtsraw', 'mpegvideo', 'mpjpeg', 'mpl2', 'mpsub', 'msnwctcp', 'mtv', 'mulaw', 'mv', 'mvi', 'mxf', 'mxf_d10', 'mxg', 'nc', 'nistsphere', 'nsv', 'nut', 'nuv', 'ogg', 'oma', 'opus', 'oss', 'paf', 'pjs', 'pmp', 'psp', 'psxstr', 'pva', 'pvf', 'qcp', 'r3d', 'rawvideo', 'realtext', 'redspark', 'rl2', 'rm', 'rmvb', 'roq', 'rpl', 'rsd', 'rso', 'rtp', 'rtsp', 's16be', 's16le', 's24be', 's24le', 's32be', 's32le', 's8', 'sami', 'sap', 'sbg', 'sdl', 'sdp', 'sdr2', 'segment', 'shn', 'siff', 'smjpeg', 'smk', 'smoothstreaming', 'smush', 'sol', 'sox', 'spdif', 'speex', 'srt', 'subviewer', 'subviewer1', 'svcd', 'swf', 'tak', 'tedcaptions', 'tee', 'thp', 'tiertexseq', 'tmv', 'truehd', 'tta', 'tty', 'txd', 'u16be', 'u16le', 'u24be', 'u24le', 'u32be', 'u32le', 'u8', 'uncodedframecrc', 'v4l2', 'vc1', 'vc1test', 'vcd', 'v4l2', 'vivo', 'vmd', 'vob', 'vobsub', 'voc', 'vplayer', 'vqf', 'w64', 'wav', 'wmv', 'wc3movie', 'webm', 'webvtt', 'wsaud', 'wsvqa', 'wtv', 'wv', 'xa', 'xbin', 'xmv', 'xwma', 'yop', 'yuv4mpegpipe'];

		$rootScope.netdiskFileIndex=[];
		$scope.addPopup=null;

		$scope.addButtonClick=function(){
			$scope.addPopup = $ionicPopup.show({
				templateUrl: 'views/netdisk/popup.html',
				title:"请选择操作",
				scope: $scope,
			});
		}

		$scope.lengthof=function(a){
			return a.length;
		}

		$scope.isDisabled=function(buttonType){
			if ($rootScope.fids.length==0){
				return "disabled"
			}
			if (buttonType=="download"){
				var i;
				for (i=0;i<$rootScope.fids.length;i++){
					if ($rootScope.getOrderByID($rootScope.fids[i])!=-1) return "disabled"
				}
				return "";
			};
			if (buttonType=="move"){
				return "";
			}
			if (buttonType=="delete"){
				return "";
			}
		}

		$scope.deleteFileClick=function(){
			var confirmPopup = $ionicPopup.confirm({
				title: '删除',
				template: '你确定要删除多个文件么？',
				cancelText:"取消",
				okText:"确定"
			}).then(
				function(res){
					if (res){
					 $scope.deleteFile();
					}
				}
			);
		}

		$scope.deleteFile=function(){
			$ionicLoading.show({
					template: "删除中",
					delay:0
				}
			);
			//alert(angular.toJson($rootScope.fids));
			var i;
			for(i=0;i<$rootScope.fids.length;i++){
				now=$rootScope.getOrderByID($rootScope.fids[i]);
				if (now==-1) continue;
				$rootScope.fids[i]="f_"+$rootScope.fids[i];
			}
			//alert(angular.toJson($rootScope.fids));
			netdiskService.deleteFile($rootScope.fids).then(
				function(res){
					//alert(angular.toJson(res))
					$rootScope.fids=[];
					$rootScope.Refresh();
					$ionicLoading.hide();
					$state.go("tabs.netdisk");

				},function(error){
					$ionicLoading.hide();
					$ionicLoading.show({
						template: error.info,
						delay:0,
						duration:1000
					});
					//alert(angular.toJson(error));
				}
			);
		}

		var getFileByID=function(id){
			var i;
			for (i=0;i<$rootScope.netdiskFileIndex.length;i++){
				var file=$rootScope.netdiskFileIndex[i];
				if (file.id==id) return file;
			}
		}
		$scope.downloadClick=function(){
			var confirmPopup = $ionicPopup.confirm({
				title: '下载',
				template: '你确定要下载多个文件么？',
				cancelText:"取消",
				okText:"确定"
			});
			confirmPopup.then(function(res) {
				$ionicLoading.show({
						template: "已添加下载",
						delay:0,
						duration:1000
					}
				);
				if(res) {
					//alert(angular.toJson($rootScope.fids));
					var i;
					for (i=0;i<$rootScope.fids.length;i++) {

						//alert($rootScope.fids.length);
						$scope.fileDownload(i);
					}
					$state.go("tabs.netdisk");
				} else {

				}
			});
		}
		$scope.moveClick=function(){
			$rootScope.Refresh();
			$rootScope.netdiskCurrentFolderID=$rootScope.netdiskCurrentID;
			$rootScope.isTabsShow="tabs-item-hide";
			$state.go("tabs.move");
		}
		$scope.fileDownload=function(i,t){

			var id=$rootScope.fids[i];
			var file=getFileByID(id);
			var a={
				file:file,
				status:true,
				progress:0
			}
			$rootScope.downloadFileIndex.push(a);
			var temp= $rootScope.downloadFileIndex.length-1;
			var t=$rootScope.n;
			$rootScope.downloadOrder[$rootScope.n]=temp;
			$rootScope.n++;
			storageService.set("downloadFileIndex",$rootScope.downloadFileIndex);
			//alert(angular.toJson(file));
			if (file.type=="file") {
				var filename = file.name;
				netdiskService.getDownloadUrl(id).then(
					function (url) {
						//alert(filename);
						//alert(angular.toJson(url));
						netdiskService.downloadFile(url, filename,t).then(function(){
							var i;
							$rootScope.downloadFileIndex.splice($rootScope.downloadOrder[t],1);
							$rootScope.completeDownloadFileIndex.push(a);
							$rootScope.downloadOrder[t]=-1;
							for (i=t+1;i<$rootScope.downloadOrder.length;i++){
								$rootScope.downloadOrder[i]--;
							}
							storageService.set("downloadFileIndex",$rootScope.downloadFileIndex);
							storageService.set("completeDownloadFileIndex",$rootScope.completeDownloadFileIndex);
						},function(){
							$rootScope.downloadFileIndex[$rootScope.downloadOrder[t]].status=false;
						});
					},
					function (error) {
						//alert(angular.toJson(error));
					}
				);
			}
		}
		$scope.currentFileRoute=function(){
			var fileRoute="";
			var id=$rootScope.netdiskCurrentID;
			while (id!=null){
				var now=$rootScope.getOrderByID(id);
				var filename=$rootScope.rootFileTree[now].name;
				fileRoute=filename+"/"+fileRoute;
				id=$rootScope.rootFileTree[now].f_id;
			}
			return fileRoute;
		}
		$scope.selectAll=function(){
			var now=$rootScope.getOrderByID($rootScope.netdiskCurrentID);
			var fileIndex, i,folderIndex;
			fileIndex=$rootScope.netdiskFileIndex;
			folderIndex=$rootScope.netdiskFolderIndex;
			if ($scope.isSelectAll()=="全选") {
				$rootScope.fids=[];
				for (i = 0; i < fileIndex.length; i++) {
					$rootScope.fids.push(fileIndex[i].id);
				}
				for (i = 0; i < folderIndex.length; i++) {
					$rootScope.fids.push(folderIndex[i].id);
				}
			} else {
				$rootScope.fids=[];
			}
		}

		$scope.isSelectAll= function () {
			var now=$rootScope.getOrderByID($rootScope.netdiskCurrentID);
			var fileIndex, i,folderIndex;
			fileIndex=$rootScope.netdiskFileIndex;
			folderIndex=$rootScope.netdiskFolderIndex;
			if (fileIndex.length+folderIndex.length==$rootScope.fids.length) return "取消选择"
			else return "全选";
		}

		$scope.indexClick=function(file) {
			//alert(angular.toJson(file));
			var temp=$rootScope.fids.indexOf(file.id);
			//alert(temp);
			if (temp==-1) $rootScope.fids.push(file.id);
			else {
				$scope.fids.splice(temp,1);
			}
			//alert(angular.toJson($rootScope.fids));
		}
		$scope.isSelected=function(file){
			if ($rootScope.fids.indexOf(file.id)==-1){
				return "icon fa fa-square-o"
			} else return "icon fa fa-check-square-o"
		}

		$scope.itemOnHold=function(){
			$cordovaVibration.vibrate(100);
			$rootScope.fids=[];
			$rootScope.Refresh();
			$state.go('tabs.netdisk')
		}


		$scope.doRefresh=function(){
			$rootScope.Refresh();
			$scope.$broadcast('scroll.refreshComplete');
		}
		$rootScope.rootFileTree=storageService.get('rootFileTree');
		//alert(angular.toJson($rootScope.rootFileTree));
		if ($rootScope.rootFileTree==null){
			$rootScope.Refresh();
		}else {
			$rootScope.refreshIndex($rootScope.netdiskCurrentID);
			//alert(angular.toJson($rootScope.$rootScope.rootFileTree[now].children));
		}



});