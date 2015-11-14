

angular.module('MyApp', ['ngAnimate'])//'ui.bootstrap',

.controller('DemoCtrl', function ($scope, AnimalsList ){
    var animalsFactory = new AnimalsList();
    animalsFactory.getData().then(function () {
        $scope.animals = animalsFactory.animals;
        $scope.images = [];
        $scope.images[0] = {};
        $scope.images[0].src = $scope.animals[0].animaleGroup[0].imageUrl;
        $scope.images[1] = {};
        $scope.images[1].src = $scope.animals[1].animaleGroup[0].imageUrl;
        $scope.images[2] = {};
        $scope.images[2].src = $scope.animals[2].animaleGroup[0].imageUrl;
        $scope.images[3] = {};
        $scope.images[3].src = $scope.animals[3].animaleGroup[0].imageUrl;
    });
})
.directive('slider', function ($timeout) {
  return {
    restrict: 'E',
	replace: true,
	scope:{
		images: '='
	},
    link: function (scope, elem, attrs) {
	
		scope.currentIndex=0;

		scope.next=function(){
			scope.currentIndex<scope.images.length-1?scope.currentIndex++:scope.currentIndex=0;
		};
		
		scope.prev=function(){
			scope.currentIndex>0?scope.currentIndex--:scope.currentIndex=scope.images.length-1;
		};
		
		scope.$watch('currentIndex',function(){
			if(scope.images == undefined) return;
			scope.images.forEach(function(image){
				image.visible=false;
			});
			scope.images[scope.currentIndex].visible=true;
		});
		
		/* Start: For Automatic slideshow*/
		
		var timer;
		
		var sliderFunc=function(){
			timer=$timeout(function(){
				scope.next();
				timer=$timeout(sliderFunc,5000);
			},5000);
		};
		
		sliderFunc();
		
		scope.$on('$destroy',function(){
			$timeout.cancel(timer);
		});
		
		/* End : For Automatic slideshow*/
		
    },
	templateUrl:'sliderTemplate.html'
  }
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
});

