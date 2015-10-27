angular.module('userModule', ['ngMessages'])
    .config(function ($stateProvider) {
            $stateProvider
                    .state('login', {
                        url: '/login',
                        templateUrl: 'views/login/login.html',
                        controller: 'loginCtrl'
                    });
        })
    .controller('loginCtrl', function ($scope, userService,$state,$rootScope,$ionicLoading) {
            // login controller
            // 用户的登录凭证


        var apptoken;
        $scope.credentials = {
            username: '',
            password: ''
        };
        $scope.login = function (loginForm) {
            $ionicLoading.show({
                    template: "正在登录，请稍后",
                    delay:0
                }
            );


            userService.getAppToken().then(function(data){
                    apptoken=data.retdata;
                    //alert(angular.toJson(appToken));
                },function(error){
                    $ionicLoading.show({
                        template: (angular.toJson(error)),
                        delay:0,
                        duration:1000
                    });
                }
            );

            var params = {
                'apptoken': apptoken,
                'username': $scope.credentials.username.toUpperCase(),
                'password': $scope.credentials.password
            }
            userService.auth(params).then(function (res) {
                //登录成功
                var gid=res.retdata.gid;
                var token=res.retdata.token;
                var completeParams={
                    'gid' : gid,
                    'token' : token
                }
                userService.completeLogin(completeParams).then(function(res){
                    $rootScope.Refresh();
                    $ionicLoading.hide();
                    $state.go("tabs.netdisk");
                },function(error){
                    $ionicLoading.show({
                            template: error.info,
                            delay:0,
                            duration:1000
                        }
                    );
                });
            }, function (error) {
                $ionicLoading.show({
                        template: error.info,
                        delay:0,
                        duration:1000
                    }
                );
            });
        }
    });