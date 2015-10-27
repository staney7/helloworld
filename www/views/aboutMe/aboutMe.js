angular.module('aboutMeModule', [])
.config(function($stateProvider){
	$stateProvider
		.state('tabs.aboutMe', {
			url: '/aboutMe',
			views: {
				'aboutMe-tab': {
					templateUrl: 'views/aboutMe/aboutMe.html',
					controller: 'aboutMeCtrl'
				}
			}
		});
})
	.constant('logoutAPI','http://rec.ustc.edu.cn/logout')
	.controller('aboutMeCtrl', function($scope, aboutMeService,logoutAPI,$http,$state,$ionicLoading,$q){
	// aboutMe controller

		$scope.getUserInfo=function () {
			var delay = $q.defer();
			var url="http://rec.ustc.edu.cn/api/user/info";
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

		$scope.exit=function() {
			$ionicLoading.show({
					template: "正在登出，请稍候...",
					delay:0
				}
			);
			$http.get(logoutAPI).then(
				function (res) {
					$ionicLoading.hide();
					$ionicLoading.show({
							template: "登出成功",
							delay:0,
							duration:1000
						}
					);
					$state.go("login");
				},
				function (error) {
					$ionicLoading.hide();
					$ionicLoading.show({
							template: "登出失败，请检查网络",
							delay:0,
							duration:1000
						}
					);
				}
			)
		}
});