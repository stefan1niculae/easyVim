"use strict";

angular.module('easyVimWeb')
  .controller('challengeController', function ($scope, userService, mainService, $rootScope,$timeout,
                                               challengeDifficulties, SweetAlert){

    var $ctrl = this;

    $ctrl.showModal = true;

    $scope.localTheme = $rootScope.user.currentTheme;
    $ctrl.challengeDifficulties = challengeDifficulties;
    $ctrl.user = $rootScope.user;
    $ctrl.friends = [];

    $ctrl.invitations = [];
    $ctrl.targetText = 'textTarget luat din model';
    $ctrl.keysPressed ='';
    $ctrl.currentQuest = {};

    $ctrl.sendInvitation = function(user){
      mainService.addInvitation(invitation)
    };

    $ctrl.getFriends = function(){
      userService.getFriends().then(function(res){
        $ctrl.friends = res;
        console.log($ctrl.friends[0]);
      },function(err){
        console.log("Error: "+ err);
      });
    };

    $ctrl.getFriends();

    $ctrl.setCurrentQuest = function(difficulty, quest){
      quest.difficulty = difficulty;
      console.log(quest.difficulty);
      $ctrl.currentQuest = quest;
      $ctrl.targetText = quest.targetText;
      $scope.initialContent = quest.startingText;
      $ctrl.keysPressed ='';
    };

    $ctrl.addKeyPressed = function(e){
      console.log('inside add key pressed' + String.fromCharCode(e.keyCode));
      $ctrl.keysPressed += String.fromCharCode(e.keyCode);
    };

    $scope.$watch('initialContent', function(){
      if ($scope.initialContent == $ctrl.targetText){
        console.log("congrats")
        SweetAlert.swal({
          title: "Congratulations",
          text: "Challenge completed!",
          type: "success",
          confirmButtonText: "Ok",
          closeOnConfirm: true
        }, function () {

        });
      }
    });

    $timeout(function(){$scope.initialContent = "Au trecut 10 secunde"}, 10000);

    $ctrl.stopPasteEvent = function (ev) {
      console.log("PASTE")
      ev.preventDefault();
      ev.stopPropagation();
    };

    $ctrl.putAchievements = function (achievements) {
      userService.putAchievements(achievements)
        .then(function (res) {
          $ctrl.user.achievementsUnlocked += res;
        })
        .catch(function (err) {
          console.error("error on put achievement", err);
        })
    };

    return $ctrl;

  });
