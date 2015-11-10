

angular.module('MyApp', ['ui.bootstrap'])

.controller('DemoCtrl', function ($scope, AnimalsList ){
    var animalsFactory = new AnimalsList();
    animalsFactory.getData().then(function () {
        $scope.animals = animalsFactory.animals;
    });
})

.factory('AnimalsList', function ($http) {
    var apiUrl = 'https://prodhuntitems.s3.amazonaws.com/ShopicksTest/Animals/animals_collection.json';
    var self = this;
    var animalsList = [];
    
    AnimalsList.prototype.getData = function () {
        var self = this;
        return $http.get(apiUrl).then(function (response) {
            // we store the API result in AnimalsList.animals. 
            var animalsData = response.data.Data;
            animalsData.forEach(function (animaleGroup) {
                var animaleGroup = new AnimaleGroup( animaleGroup.animale, animaleGroup.instances);
                animalsList.push(animaleGroup);
            });
            self.animals = animalsList;
            // promises success should always return something in order to allow promise chaining
            return response;
        });
    };
    
    var Animale = function (id, name, imageUrl) {
        this.id = id;
        this.name = name;
        this.imageUrl = imageUrl;
    };
    
    var AnimaleGroup = function (name, animaleGroup) {
        this.name = name;
        
        var animaleGroupArr = [];
        animaleGroup.forEach(function (animale) {
            var animale = new Animale( animale.id, animale.name, animale.imageUrl);
            animaleGroupArr.push(animale);
        });
        
        this.animaleGroup = animaleGroupArr;
    };
    
    var AnimalsList = function () {
        this.animals = null;
    }
    
    return AnimalsList;
})

.factory('SimpleGithubUser', function ($http) {
    var apiUrl = 'https://api.github.com/';
    
    // instantiate our object
    var SimpleGithubUser = function (username) {
        this.username = username;
        this.profile = null;
    };
    // this method will fetch data from GH API and return a promise
    SimpleGithubUser.prototype.getProfile = function () {
    // Generally, javascript callbacks, like here the $http.get callback, change the value of the "this" variable inside callbacks so we need ot keep a reference to the current instance "this", and we do it with the following :
        var self = this;
        return $http.get(apiUrl + 'users/' + this.username).then(function (response) {
            // we store the API result in user.profile. 
            self.profile = response.data
            // promises success should always return something in order to allow promise  chaining
            return response;
        });
    };
    return SimpleGithubUser;
})

// we inject our original service so we can extend it properly
.factory('AdvancedGithubUser', function ($http, SimpleGithubUser) {
    var apiUrl = 'https://api.github.com/';

    // instantiate our custom object with original object constructor
    var AdvancedGithubUser = function (username) {
        SimpleGithubUser.apply(this, arguments);
    };

    // duplicate the original object prototype
    AdvancedGithubUser.prototype = new SimpleGithubUser();

    // define a new internal method for this object
    function getUserEvents() {
        var self = this;
        return $http.get(apiUrl + 'users/' + this.username + '/events').then(function (response) {
            self.profile.events = response.data;
            return response;
        });
    }
    // we'll override our original getProfile
    AdvancedGithubUser.prototype.getProfile = function () {
        // first call the original getProfile method
        var originalGetProfile = SimpleGithubUser.prototype.getProfile.apply(this, arguments);
        // then once profile fetched, add some more user data
        var self = this;
        return originalGetProfile.then(function () {
            // call our private method, binding "this" to "self";
            return getUserEvents.call(self);
        });
    };
    return AdvancedGithubUser;
})
.filter('slice', function() {
  return function(arr, start, end) {
    return arr.slice(start, end);
  };
});

