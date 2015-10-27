angular.module('netdiskModule')
	.constant('fileTreeAPI','http://rec.ustc.edu.cn/api/file/tree')
	.constant('fileDownloadAPI','http://rec.ustc.edu.cn/api/file/get_download_url?id=')
	.constant('fileUploadAPI','http://rec.ustc.edu.cn/api/file/get_upload_params')
	.constant('fileUploadCompleteAPI','http://rec.ustc.edu.cn/api/file/upfile_complete')
	.constant('folderCreateAPI','http://rec.ustc.edu.cn/api/folder/create')
	.constant('fileDeleteAPI','http://rec.ustc.edu.cn/api/file/multi_del')
	.constant('fileMoveAPI','http://rec.ustc.edu.cn/api/file/move')
	.constant('userInfoAPI','http://rec.ustc.edu.cn/api/user/info')
	.factory('netdiskService', function($q, fileMoveAPI,fileDeleteAPI,folderCreateAPI,$rootScope,$http,userInfoAPI,fileTreeAPI,fileDownloadAPI, fileUploadAPI, $cordovaFileTransfer,$timeout,fileUploadCompleteAPI){
	// netdisk Service

		function addGroupJson(targetJson, packJson){
			if(targetJson && packJson){
				for(var p in packJson){
					targetJson[p] = packJson[p];
				}
			}

		}
		return {
			getFileTree: function () {
				var delay = $q.defer();
				$http.get(fileTreeAPI).then(function (res) {
					var rs = res.data;
					//alert(angular.toJson(rs));
					if (rs.state) {
						//alert(angular.toJson(rs.data));
						delay.resolve(rs.data);
					} else {
						delay.reject({info: rs.message});
					}
				}, function (errinfo) {
					delay.reject({info: '获取文件目录失败,请检查网络问题'});
				});
				return delay.promise;
			},
			getDownloadUrl:function(id){
				var delay = $q.defer();
				$http.get(fileDownloadAPI+id).then(function (res) {
					var rs = res.data;
					//alert(angular.toJson(rs));
					if (rs.status) {
						//alert(angular.toJson(rs.data));
						delay.resolve(rs.data);
					} else {
						delay.reject({info: rs.message});
					}
				}, function (errinfo) {
					delay.reject({info: '获取文件目录失败，请检查网络'});
				});
				return delay.promise;
			},
			downloadFile:function(url,filename ,t){
				//getUserInfo();
				//alert(listI);
				var delay = $q.defer();
				var targetPath = "file:///storage/sdcard0/rec/" + filename;
				var trustHosts = true;
				var options = {};
				//alert(url);
				$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
					.then(function(result) {
						// Success!
						//alert(angular.toJson(result));
						delay.resolve(result);
					}, function(err) {
						// Error
						delay.reject({info:err});
					}, function (progress) {
						$timeout(function () {
							//alert(angular.toJson($rootScope.downloadFileIndex[listI]));
							$rootScope.downloadFileIndex[$rootScope.downloadOrder[t]].progress= (progress.loaded / progress.total)*100 ;
							//alert(1);
						})
						//alert(angular.toJson(progress));
					});
				return delay.promise;

			},
			getFileUploadUrl:function(files){
				//alert(angular.toJson(files));
				var server=fileUploadAPI;
				//alert($rootScope.f_id);
				var msg={fid:$rootScope.f_id
				};
				var i;
				//alert(angular.toJson(msg));
				for (i=0;i<files.length;i++){
					var json= {};
					json["files["+i+"][id]"]=files[i].name + i;
					json["files["+i+"][name]"]=files[i].name;
					json["files["+i+"][size]"]=0;
					//alert(angular.toJson(json));
					addGroupJson(msg,json);
				}

				//alert(angular.toJson(msg));
				var delay = $q.defer();
				$http.post(server, msg).
					success(function(data, status, headers, config) {
						if (data.status) {
							//alert(angular.toJson(data));
							delay.resolve(data.params);
						} else {
							delay.reject({info: data.message});
						}
					}).
					error(function(data, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						delay.reject({info:"获取上传地址失败，请检查网络问题"});
					})
				return delay.promise;
			},
			fileUpload:function(filePath,url,params,t){
						var delay=$q.defer();
						//filePath="file:///storage/sdcard0/Download/2.txt";
						//alert(url);
						//alert(angular.toJson(params));
						var options={
							params:params,
							headers:["Content-Type: multipart/form-data"]
						};
						//alert(angular.toJson(options));
						$cordovaFileTransfer.upload(url, filePath, options)
							.then(function(result) {
								// Success!
								delay.resolve(result);
								//alert("success      "+angular.toJson(result));
							}, function(err) {
								// Error
								delay.reject(err);
								alert("error    "+angular.toJson(err));
							}, function (progress) {
								$rootScope.uploadFileIndex[$rootScope.uploadOrder[t]].progress= (progress.loaded / progress.total)*100 ;

								// constant progress updates
							});
				return delay.promise;
				},
			fileUploadCompleteAPI:function(token){
				var delay = $q.defer();
				var server=fileUploadCompleteAPI;
				msg={
					fid:$rootScope.f_id,
					token:token
				}
				$http.post(server, msg).
					success(function(data, status, headers, config) {
						if (data.status) {
							delay.resolve(data.message);
						} else {
							delay.reject({info: data.message});
						}
						//alert("")
					}).
					error(function(data, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						delay.reject({info:"完成上传失败,请检查网络问题"});
					})
				return delay.promise;
			},
			getUserInfo: function () {
				var delay = $q.defer();
				var url=userInfoAPI;
				alert(url);
				$http.get(url).then(function (res) {
					alert(angular.toJson(res));
					var rs = res.data;
					//alert(angular.toJson(rs));
					if (rs.status) {
						//alert(angular.toJson(rs.data));
						delay.resolve(rs.data);
					} else {
						delay.reject({info: rs.message});
					}
				}, function (errinfo) {
					alert(angular.toJson(errinfo));
					delay.reject({info: '获取用户信息失败，请检查网络'});
				});
				return delay.promise;
			},
			createNewFolder:function(foldername){
				var delay = $q.defer();
				var server=folderCreateAPI;
				msg={
					fid:$rootScope.netdiskCurrentID,
					name:foldername
				}
				$http.post(server, msg).
					success(function(data, status, headers, config) {
						if (data.status) {
							delay.resolve(data.message);
						} else {
							delay.reject({info: data.message});
						}
					}).
					error(function(data, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						delay.reject({info:"新建文件夹失败，请检查网络"});
					})
				return delay.promise;
			},
			deleteFile:function(fids){
				//alert(angular.toJson(fids));
				var delay = $q.defer();
				var server=fileDeleteAPI;
				msg={
					ids:fids
				}
				$http.post(server, msg).
					success(function(data, status, headers, config) {
						if (data.status) {
							delay.resolve({info: "删除文件成功"});
						} else {
							delay.reject({info: "删除文件失败"});
						}
					}).
					error(function(data, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						delay.reject({info:"删除文件失败，请检查网络问题"});
					})
				return delay.promise;
			},
			moveFile:function(f_id,ids){
				var delay = $q.defer();
				var i;
				for (i=0;i<ids.length;i++){
					if ($rootScope.getOrderByID(ids[i])!=-1){
						ids[i]="f_"+ids[i];
					}
				}
				var server=fileMoveAPI;
				msg={
					f_id:f_id,
					ids:ids
				}
				$http.post(server, msg).
					success(function(data, status, headers, config) {
						//alert(angular.toJson(data));
						if (data.status) {
							delay.resolve({info: "success"});
						} else {
							delay.reject({info:data.message});
						}
					}).
					error(function(data, status, headers, config) {
						// called asynchronously if an error occurs
						// or server returns response with an error status.
						delay.reject({info:"移动失败，请检查网络"});
					})
				return delay.promise;
			}

		};

	});