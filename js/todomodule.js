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
        .when("/createtodo",{
            templateUrl:"createtodo.html",
            controller:"createtodoController"
        })
        .when("/edittodo/:id",{
            templateUrl:"edittodo.html",
            controller:"edittodoController"
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
        if(userList){
        for(var i=0;i<userList.length;i++){
            if(userList[i].email===logindetails.email && userList[i].password===logindetails.password){
                isUserExist=true;
                loggedInUser=userList[i]
                break;
            }
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

    $scope.status="all";

    var users = JSON.parse(localStorage.getItem("userlist"));
    var loggedinuser=JSON.parse(sessionStorage.getItem("loggedinuser"));
    var todoList=users.find( a => a.email == loggedinuser.email).todos;

    $scope.todos=todoList;
    $scope.filteredtodos=todoList

    $scope.categories = [{
        name: 'Office',
        selected: false
    }, {
        name: 'Home',
        selected: false
    }, {
        name: 'Personal',
        selected: false
    }];

    $scope.markAsDone=function(todo){
        var users = JSON.parse(localStorage.getItem("userlist"));
        var loggedinuser=JSON.parse(sessionStorage.getItem("loggedinuser"));
        
        todo.isDone=true;

        for(var i=0;i<users.length;i++){
            if(users[i].email==loggedinuser.email){
                users[i].todos=$scope.todos;
                break;
            }
            
        }
        localStorage.setItem("userlist",JSON.stringify(users));
    }

    $scope.deleteTodos = function () {
        var r = confirm("Are you sure you want to delete selected todos?");
        if(r==true){
            var selected = new Array();
        for (var i = 0; i < $scope.todos.length; i++) {
            if ($scope.todos[i].deleteSelected) {
                selected.push(i);
            }
        }
        for (var i = selected.length - 1; i >= 0; i--) {
            $scope.todos.splice(selected[i], 1);
        }

        var users = JSON.parse(localStorage.getItem("userlist"));
        var loggedinuser=JSON.parse(sessionStorage.getItem("loggedinuser"));
        for(var i=0;i<users.length;i++){
            if(users[i].email==loggedinuser.email){
                users[i].todos=$scope.todos;
                break;
            }
        }
        localStorage.setItem("userlist",JSON.stringify(users));
        }
        else{
            return false;
        }
        
    };

    $scope.filterByStatus=function(category){
        if(category=="all"){
            $scope.filteredtodos=$scope.todos;
        }
        else if(category=="completed"){
            $scope.filteredtodos=$scope.todos.filter(function(value, index, arr){ return value.isDone == true;});
        }
        else if(category=="pending"){
            $scope.filteredtodos=$scope.todos.filter(function(value, index, arr){ return value.isDone == false;});
        }
           
    }

    $scope.filterByCategory=function(category){
        var catVals=[];
        for(var i=0;i<$scope.categories.length;i++){
            if( $scope.categories[i].selected==true){
                catVals.push($scope.categories[i].name);
            }
            
        }
        
        if(catVals.length>0){
            $scope.filteredtodos=$scope.todos.filter(function(value, index, arr){ return value.categories.some(r=>catVals.includes(r))});
        }
        else{
            $scope.filteredtodos=$scope.todos;
        }
    }
    // $scope.$watch('modelName', function(newValue, oldValue){
    //     // Do anything you like here
    // });

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
.controller("createtodoController",function($scope,$rootScope,$location){
    $rootScope.showProfileNav=false;
    $rootScope.showLogoutNav=true;
    $rootScope.showTodosNav=true;

    $scope.public="no";
    $scope.reminder="no";

    if(localStorage.getItem("lasttodoid")==null){
        localStorage.setItem("lasttodoid",0);
    }

    $scope.categories = [{
        name: 'Office',
        selected: false
    }, {
        name: 'Home',
        selected: false
    }, {
        name: 'Personal',
        selected: false
    }];

    $scope.categoryError=false;

    $scope.createTodo=function(){
        

        var selectedCat=$scope.categories.filter(function(value, index, arr){ return value.selected == true;});

        if(selectedCat && selectedCat.length>0){
            $scope.categoryError=false;
            
            var lasttodoid=Number(localStorage.getItem("lasttodoid"));

        var isReminder=$scope.reminder;
        var reminderDate;
        if(isReminder=='yes'){
            reminderDate=$scope.reminderDate;
        }
        else{
            reminderDate='';
        }

        var catVals = [];
        for(var i = 0; i < selectedCat.length; i++)
        {
            catVals.push(selectedCat[i].name);
        }

        var new_todo={
            id:(lasttodoid+1),
            title:$scope.title,
            targetDate:$scope.targetDate,
            isDone:false,
            isPublic:$scope.public,
            reminderDate:reminderDate,
            categories:catVals,
            deleteSelected:false
        }
        var users = JSON.parse(localStorage.getItem("userlist"));
        var loggedinuser=JSON.parse(sessionStorage.getItem("loggedinuser"));
        var todos=users.find( a => a.email == loggedinuser.email).todos;
        if(!todos){
            todos=[];
        }
        
        todos.push(new_todo);
        for(var i=0;i<users.length;i++){
            if(users[i].email==loggedinuser.email){
                users[i].todos=todos;
                break;
            }
        }
        localStorage.setItem("userlist",JSON.stringify(users));
        localStorage.setItem("lasttodoid",lasttodoid+1);
        alert("Todo item added succesfully!");
        $location.path("/todos");
    }
          else{
           $scope.categoryError=true;
           return false;
          }
        }
})
.controller("edittodoController",function($scope,$rootScope,$location){
    $rootScope.showProfileNav=false;
    $rootScope.showLogoutNav=true;
    $rootScope.showTodosNav=true;
})
