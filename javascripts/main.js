

angular.module('MyApp', ['ui.bootstrap'])

.controller('DemoCtrl', function ($scope, AnimalsList ){
    var animalsFactory = new AnimalsList();
    animalsFactory.getData().then(function () {
        $scope.animals = animalsFactory.animals;
    });
})

.factory('AnimalsList', function ($http) {
    var apiUrl = 'https://prodhuntitems.s3.amazonaws.com/ShopicksTest/Animals/animals_collection.json';
    
    var AnimalsList = function () {
        this.animals = null;
    }
    
    AnimalsList.prototype.getData = function () {
        var self = this;
        var animalsList = [];
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
    
    return AnimalsList;
})
//define a filter for the table ng-repeat
.filter('slice', function() {
    return function(arr, start, end) {
        return arr.slice(start, end);
    };
})
.directive('customCarousel', function(){
    var template= '<carousel> <slide ng-repeat="animale in animals" active="$index == 0"><img ng-src="{{animale.animaleGroup[0].imageUrl}}"><div class="carousel-caption"><h4>Slide {{$index+1}}</h4> </div>  </slide> </carousel>';
   
    function link(scope){
        
     var a = 0
     a++;
        
    }
    return {
        restrict: "E",
        link: link,
        template: template,
        scope:{
    
            animals: '='
            
        }
    };
});

