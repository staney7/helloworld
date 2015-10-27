angular.module('netdiskModule', [])
.config(function($stateProvider){
	$stateProvider
		.state('tabs.netdisk', {
			url: '/netdisk',
			views: {
				'netdisk-tab': {
					templateUrl: 'views/netdisk/netdisk.html',
					controller: 'netdiskCtrl'
				}
			}
		});
})
.controller('netdiskCtrl', function($scope,$cordovaDialogs,localdiskService,$ionicLoading, shareService,$cordovaProgress, $cordovaVibration,$state,$rootScope,netdiskService,storageService,$ionicPopup,$cordovaFileTransfer,$timeout){
		var   image_types = ['gif', 'png', 'jpg', 'jpeg', 'bmp'];
		var  doc_types = ['bib', 'csv', 'dbf', 'dif', 'doc', 'docx', 'emf', 'eps', 'fodg', 'fodp', 'fods', 'fodt', 'htm', 'html', 'ltx', 'met', 'odd', 'odg', 'odp', 'ods', 'odt', 'otg', 'otp', 'ots', 'ott', 'pbm', 'pct', 'pct', 'pdb', 'pdf', 'pgm', 'pot', 'potm', 'ppm', 'pps', 'ppt', 'pptx', 'psw', 'pwp', 'pxl', 'ras', 'rtf', 'sda', 'sdc', 'sdd', 'sdw', 'slk', 'stc', 'std', 'sti', 'stw', 'svg', 'svm', 'sxc', 'sxd', 'sxi', 'sxw', 'tiff', 'txt', 'uop', 'uos', 'uot', 'vor', 'wmf', 'wps', 'xhtml', 'xls', 'xlsx', 'xlt', 'xml', 'xpm'];
		var  media_types = ['3g2', '3gp', '4xm', 'a64', 'aac', 'ac3', 'act', 'adf', 'adp', 'adts', 'adx', 'aea', 'afc', 'aiff', 'alaw', 'alsa', 'amr', 'anm', 'apc', 'ape', 'aqtitle', 'asf', 'ass', 'ast', 'au', 'avi', 'avm2', 'avr', 'avs', 'bfi', 'bin', 'bink', 'bit', 'bmv', 'boa', 'brstm', 'c93', 'caf', 'cavsvideo', 'cdg', 'cdxl', 'cine', 'concat', 'crc', 'data', 'daud', 'dfa', 'dirac', 'dnxhd', 'dsicin', 'dts', 'dtshd', 'dv', 'dv1394', 'dvd', 'dxa', 'ea', 'ea_cdata', 'eac3', 'epaf', 'f32be', 'f32le', 'f4v', 'f64be', 'f64le', 'fbdev', 'ffm', 'ffmetadata', 'film_cpk', 'filmstrip', 'flac', 'flic', 'flv', 'framecrc', 'framemd5', 'frm', 'g722', 'g723_1', 'g729', 'gsm', 'gxf', 'h261', 'h263', 'h264', 'hds', 'hevc', 'hls', 'hnm', 'ico', 'idcin', 'idf', 'iff', 'ilbc', 'image2', 'image2pipe', 'ingenient', 'ipmovie', 'ipod', 'ircam', 'ismv', 'iss', 'iv8', 'ivf', 'jacosub', 'jv', 'latm', 'lavfi', 'lmlm4', 'loas', 'lvf', 'lxf', 'm4a', 'm4v', 'matroska', 'md5', 'mgsts', 'microdvd', 'mj2', 'mjpeg', 'mkv', 'mlp', 'mm', 'mmf', 'mov', 'mp2', 'mp3', 'mp4', 'mpc', 'mpc8', 'mpeg', 'mpg', 'mpeg1video', 'mpeg2video', 'mpegts', 'mpegtsraw', 'mpegvideo', 'mpjpeg', 'mpl2', 'mpsub', 'msnwctcp', 'mtv', 'mulaw', 'mv', 'mvi', 'mxf', 'mxf_d10', 'mxg', 'nc', 'nistsphere', 'nsv', 'nut', 'nuv', 'ogg', 'oma', 'opus', 'oss', 'paf', 'pjs', 'pmp', 'psp', 'psxstr', 'pva', 'pvf', 'qcp', 'r3d', 'rawvideo', 'realtext', 'redspark', 'rl2', 'rm', 'rmvb', 'roq', 'rpl', 'rsd', 'rso', 'rtp', 'rtsp', 's16be', 's16le', 's24be', 's24le', 's32be', 's32le', 's8', 'sami', 'sap', 'sbg', 'sdl', 'sdp', 'sdr2', 'segment', 'shn', 'siff', 'smjpeg', 'smk', 'smoothstreaming', 'smush', 'sol', 'sox', 'spdif', 'speex', 'srt', 'subviewer', 'subviewer1', 'svcd', 'swf', 'tak', 'tedcaptions', 'tee', 'thp', 'tiertexseq', 'tmv', 'truehd', 'tta', 'tty', 'txd', 'u16be', 'u16le', 'u24be', 'u24le', 'u32be', 'u32le', 'u8', 'uncodedframecrc', 'v4l2', 'vc1', 'vc1test', 'vcd', 'v4l2', 'vivo', 'vmd', 'vob', 'vobsub', 'voc', 'vplayer', 'vqf', 'w64', 'wav', 'wmv', 'wc3movie', 'webm', 'webvtt', 'wsaud', 'wsvqa', 'wtv', 'wv', 'xa', 'xbin', 'xmv', 'xwma', 'yop', 'yuv4mpegpipe'];

		// netdisk1 controller
		$scope.addPopup=null;
		$scope.file=null;
		$scope.popup=null;

		/*
		 *开始进入网盘界面
		 * 有网络时进行检查是否登录状态
		 */
		var isFirst=storageService.get("isFirst");
		if (isFirst=null){
			$state.go("login");
		}
		storageService.set("isFirst",false);


		netdiskService.getUserInfo().then(function(res){
			//alert("getUserInfoSuccess");
			$scope.updateRootFileTree();
		},function(error){
			if (error.info=="用户未登录"){
				$state.go('login');
			} else {
				$rootScope.rootFileTree = storageService.get('rootFileTree');
				$ionicLoading.show({
						template: error.info,
						delay: 0,
						duration: 1000
					}
				);
			}

		});
		var addPopup=null;
		//alert(angular.toJson($scope.addIconPosition));
		$scope.addButtonClick=function(){
			addPopup = $ionicPopup.show({
				template: '<ion-list> <ion-item ng-click="newFolderClick()">新建文件夹 </ion-item> <ion-item ng-click="goLocaldisk()">上传文件 </ion-item> </ion-list>',
				title:"请选择操作",
				scope: $scope,
			});
		};

		$scope.currentFileRoute=function(){
			var fileRoute="";
			var id=$rootScope.netdiskCurrentID;
			while (id!=null){
				var now=getOrderByID(id);
				var filename=$rootScope.rootFileTree[now].name;
				fileRoute=filename+"/"+fileRoute;
				id=$rootScope.rootFileTree[now].f_id;
			}
			return fileRoute;
		}

		$scope.goLocaldisk=function(){
			addPopup.close();
			if ($rootScope.rootEntry!=null) {
				$rootScope.currentEntry = $rootScope.rootEntry;
				localdiskService.EntryDisplay($rootScope.currentEntry);
			}
			$rootScope.f_id=$rootScope.netdiskCurrentID;
			$rootScope.isTabsShow="tabs-item-hide";
			$state.go("tabs.localdisk");
		};

		$scope.newFolderClick=function(){
			addPopup.close();
			$cordovaDialogs.prompt("提示", '请输入新建文件夹名字', ['取消','确定'], '新建文件夹')
				.then(function(result) {
					//alert(angular.toJson(result));
					var input = result.input1;
					var btnIndex = result.buttonIndex;
					if (btnIndex==2){
						//alert(input);
						$ionicLoading.show({
								template: "正在新建文件夹，请稍候",
								delay:0
							}
						);
						netdiskService.createNewFolder(input).then(function(success){
							//alert(angular.toJson(success));
							$rootScope.Refresh();
							$ionicLoading.hide();
						},function(error){
							//alert(angular.toJson(error));
							$ionicLoading.hide();
							$ionicLoading.show({
								template: (error.info),
								delay:0,
								duration:1000
							});
						});
					}
				});

		};
		$scope.itemOnHold=function(file){
			$cordovaVibration.vibrate(100);
			$rootScope.fids=[];
			$rootScope.fids.push(file.id);
			$state.go('netdisk1');
			//alert(angular.toJson($rootScope.fids));
		}
		$scope.downloadListClick=function(){
			$state.go("tabs.list");
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

/*
   公开分享文件
 */
		$scope.shareFile=function(file,t){
			$scope.popup.close();
			$ionicLoading.show({
					template: "分享中，请稍候...",
					delay:0
				}
			);
			var mod="";
			if (t==0) {
				mod="public";
			} else mod="pwd";
			var id=file.id;
			shareService.shareFile(id,mod).then(
				function(){
					$ionicLoading.hide();
					$rootScope.RefreshShareFile();
					$state.go("tabs.share");
				},function(error){
					$ionicLoading.hide();
					//alert(angular.toJson(error));
					$ionicLoading.show({
						template: (error.info),
						delay:0,
						duration:1000
					});
				}

			)

		}

		/*
		文件分享
		 */
		$scope.itemShareClick=function(file){
			$scope.file=file;
			$scope.popup = $ionicPopup.show({
				template: '<ion-list> <ion-item ng-click="shareFile(file,0)">公开分享 </ion-item>'
				+'<ion-item ng-click="shareFile(file,1)">私密分享 </ion-item>'+
					' <ion-item ng-click="popup.close()">取消 </ion-item></ion-list>',
				title:"请选择操作",
				scope: $scope,
			});
		}

		$scope.itemDeleteClick=function(file){
			var filename=file.name;
			var id=file.id;
			var confirmPopup = $ionicPopup.confirm({
				title: '删除文件',
				template: '你确定要删除'+filename+"？",
				cancelText:"取消",
				okText:"确定"
			}).then(function(res){
					if (res){
						var id=file.id;
						$ionicLoading.show({
								template: "删除中,请稍候",
								delay:0
							}
						);
						netdiskService.deleteFile(id).then(
							function(res){
								$rootScope.fids=[];
								$rootScope.Refresh();
								$ionicLoading.hide();
							},function(error){
								//alert(angular.toJson(error));
								$ionicLoading.hide();
								$ionicLoading.show({
									template: error.info,
									delay:0,
									duration:1000
								});
							}
						);
					}
				}

			);
		}

		$scope.itemDownloadClick = function(file) {
			var filename=file.name;
			var id=file.id;
			var confirmPopup = $ionicPopup.confirm({
				title: '下载',
				template: '你确定要下载'+filename+"",
				cancelText:"取消",
				okText:"确定"
			});
			confirmPopup.then(function(res) {
				if(res) {
					$ionicLoading.show({
							template: "已添加下载",
							delay:0,
							duration:1000
						}
					);
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

					netdiskService.getDownloadUrl(id).then(
						function(url){
							//alert(angular.toJson(url));
							netdiskService.downloadFile(url,filename,t).then(function(){
									var i;
									$rootScope.downloadFileIndex.splice($rootScope.downloadOrder[t],1);
									$rootScope.completeDownloadFileIndex.push(a);
									$rootScope.downloadOrder[t]=-1;
									for (i=t+1;i<$rootScope.downloadOrder.length;i++){
										$rootScope.downloadOrder[i]--;
									};

									storageService.set("downloadFileIndex",$rootScope.downloadFileIndex);
									storageService.set("completeDownloadFileIndex",$rootScope.completeDownloadFileIndex);
								},function(){
									$rootScope.downloadFileIndex[$rootScope.downloadOrder[t]].status=false;
								}
							);
						},
						function(error){
							//alert(angular.toJson(error));
						}
					);
				} else {

				}
			});
		};

		$scope.indexClick=function(file) {
			if (file.type == "folder") {
				//alert(angular.toJson(file));
				$rootScope.netdiskCurrentID = file.id;
				//alert($rootScope.netdiskCurrentID);
				$rootScope.refreshIndex($rootScope.netdiskCurrentID);
			} else {
				var i,t;
				for (i=0;i<$rootScope.netdiskFileIndex.length;i++){
					if (file==$rootScope.netdiskFileIndex[i]){
						$rootScope.isFileItemShow[i]=!$rootScope.isFileItemShow[i];
					} else {
						$rootScope.isFileItemShow[i]=false;
					}
				}
				//$scope.downloadConfirm(file);

			}
		}

		$scope.isFileMenuShow=function(file){
			var i,t;
			for (i=0;i<$rootScope.netdiskFileIndex.length;i++){
				if (file==$rootScope.netdiskFileIndex[i]) {
					return $rootScope.isFileItemShow[i];
				}
			}
			return false;
		}


		$rootScope.Refresh=function(){
			netdiskService.getFileTree().then(function(res){
				//alert(angular.toJson(res));
				$rootScope.rootFileTree=res;
				$rootScope.refreshIndex($rootScope.netdiskCurrentID);
				storageService.set('rootFileTree',res);
			},function(error){
				//alert(angular.toJson(error));
				$ionicLoading.show({
					template: error.info,
					delay:0,
					duration:1000
				});
			});
		}




		$scope.doRefresh=function(){
			$rootScope.Refresh();
			$scope.$broadcast('scroll.refreshComplete');
		}

		//$scope.backClick=function(){
		//	if ($rootScope.netdiskCurrentID==0) return;
		//	var now=getOrderByID($rootScope.netdiskCurrentID);
		//	$rootScope.netdiskCurrentID=$rootScope.rootFileTree[now].f_id;
		//	$rootScope.refreshIndex($rootScope.netdiskCurrentID);
		//	$rootScope.fids=[];
		//}
		$scope.cancelButtonClick=function(){
			
		}
		$scope.updateRootFileTree=function(){
			//alert(1);
			$rootScope.rootFileTree=storageService.get('rootFileTree');
			//alert(angular.toJson($rootScope.rootFileTree));
			if ($rootScope.rootFileTree==null){
				$rootScope.Refresh();
			}else {
				$rootScope.netdiskCurrentID=0;
				$rootScope.refreshIndex($rootScope.netdiskCurrentID);
				//alert(angular.toJson($rootScope.netdiskFileIndex));
				//alert(angular.toJson($rootScope.rootFileTree[now].children));
			}
		}
});