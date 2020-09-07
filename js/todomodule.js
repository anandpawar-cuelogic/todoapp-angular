var todoapp = angular.module('todoApp', ["ngRoute"]);

//Setup Routing
todoapp.config(function($routeProvider,$locationProvider){
    $locationProvider.html5Mode(true);
    $routeProvider
        .when("/",{
            templateUrl:"login.html",
            controller:"loginController"
        })
        .when("/login",{
            templateUrl:"login.html",
            controller:"loginController"
        })
        .when("/register",{
            templateUrl:"register.html",
            controller:"registerController"
        })
        .when("/todos",{
            templateUrl:"todos.html",
            controller:"todoController"
        })
        .when("/myprofile",{
            templateUrl:"profile.html",
            controller:"profileController"
        })
})
.directive('isEmailExist', function() {
    return {
      restrict: 'A',
         scope: false,
         require: 'ngModel',
         link: function(scope, elem, attrs, ctrls) {
             var ngModel = ctrls;
             scope.$watch(attrs.ngModel, function(email) {
                var userList=JSON.parse(localStorage.getItem('userlist'));
                if(userList){
                    for(var i=0;i<userList.length;i++){
                        if(userList[i].email===email){
                            ngModel.$setValidity('emailExist', false);
                            break;
                        }
                        else{
                            ngModel.$setValidity('emailExist', true);
                        }
                    }
                }
                else{
                    ngModel.$setValidity('emailExist', true);
                }
             });
         }
   }
 })
.controller("registerController",function($scope,$location,$rootScope){
    $rootScope.showProfileNav=false;
    $rootScope.showLogoutNav=false;
    $rootScope.showTodosNav=false;

    $scope.gender="male";

    $scope.registerUser=function(){
        var userList=JSON.parse(localStorage.getItem("userlist"));
        if(!userList){
            userList=[];
        }
        var user={
            firstName:$scope.firstname,
            lastName:$scope.lastname,
            email:$scope.email,
            password:$scope.password,
            gender:$scope.gender,
            address:$scope.address,
            profilePic:$scope.profilePic,
            todos:[]
        };
        userList.push(user);
        localStorage.setItem('userlist',JSON.stringify(userList));
        alert("User registration done succesfully");
        $location.path("/login");
    }

    $scope.onFileChange=function(){
        var path=event.target.result;
        var imagereader = new FileReader();
        imagereader.readAsDataURL(event.target.files[0]);
        imagereader.onloadend = function(event) {
            $scope.profilePic = event.target.result;
       
        }
    }

    $scope.validateConfirmPwd=function(){
        if ($scope.password!=$scope.confirmpassword) {
            $scope.registerForm.confirmpassword.$setValidity("confirmPwd", false);
          }
          else{
            $scope.registerForm.confirmpassword.$setValidity("confirmPwd", true);
          }
    }
})
.controller("loginController",function($scope,$location,$rootScope){
    $rootScope.showProfileNav=false;
    $rootScope.showLogoutNav=false;
    $rootScope.showTodosNav=false;

    $scope.loginUser=function(){
        var logindetails={
            email:$scope.email,
            password:$scope.password
        };
        var isUserExist=false;
        var userList=JSON.parse(localStorage.getItem('userlist'));
        var loggedInUser;
        for(var i=0;i<userList.length;i++){
            if(userList[i].email===logindetails.email && userList[i].password===logindetails.password){
                isUserExist=true;
                loggedInUser=userList[i]
                break;
            }
        }
        if(isUserExist) {
            $scope.error = '';
            $scope.username = '';
            $scope.password = '';
            sessionStorage.setItem('loggedinuser',JSON.stringify(loggedInUser));
            $location.path("/todos");
          } else {
            $scope.error = "Incorrect username/password !";
          }
    }
    
})
.controller("todoController",function($scope,$rootScope){
    $rootScope.showProfileNav=true;
    $rootScope.showLogoutNav=true;
    $rootScope.showTodosNav=false;
})
.controller('logoutController', function($scope,$location){
    $scope.logout = function(){
        sessionStorage.removeItem('loggedinuser');
        $location.path('/login');
    }
  })
  .controller("profileController",function($scope,$rootScope,$location){
    $rootScope.showProfileNav=false;
    $rootScope.showLogoutNav=true;
    $rootScope.showTodosNav=true;
    var loggedInUser=JSON.parse(sessionStorage.getItem("loggedinuser"));
    $scope.firstname=loggedInUser.firstName;
    $scope.lastname=loggedInUser.lastName;
    $scope.email=loggedInUser.email;
    $scope.gender =loggedInUser.gender;
    $scope.address=loggedInUser.address;
    document.getElementById("imgProfile").src=loggedInUser.profilePic;
    document.getElementById("inputProfileImage").src=loggedInUser.profilePic;
    $scope.profilePic=loggedInUser.profilePic;

    $scope.updateProfile=function(){
        var user={
            firstName:$scope.firstname,
            lastName:$scope.lastname,
            email:$scope.email,
            gender:$scope.gender,
            address:$scope.address,
            profilePic:$scope.profilePic
        }

        var userList=JSON.parse(localStorage.getItem('userlist'));
        for(var i=0;i<userList.length;i++){
            if(userList[i].email===user.email){
                userList[i].firstName=user.firstName;
                userList[i].lastName=user.lastName;
                userList[i].address=user.address;
                userList[i].gender=user.gender;
                userList[i].profilePic=user.profilePic;
                localStorage.setItem("userlist",JSON.stringify(userList));
                sessionStorage.setItem("loggedinuser",JSON.stringify(userList[i]));
                break;
            }
        }
        alert("Profile updated succesfully");
        $location.path("/myprofile");

    }
    $scope.onFileChange=function(){
        var input = document.getElementById("inputProfileImage");
        var imagereader = new FileReader();
        imagereader.readAsDataURL(event.target.files[0]);
        imagereader.onloadend = function(event) {
            $scope.profilePic = event.target.result;
            var displayImg = document.getElementById("imgProfile");
            displayImg.src = URL.createObjectURL(input.files[0]);
        }
    }
})