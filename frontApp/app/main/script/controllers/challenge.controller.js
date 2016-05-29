"use strict";

angular.module('easyVimWeb')
  .controller('challengeController', function ($scope, userService, mainService, $rootScope,$timeout,
                                               challengeDifficulties){

    var $ctrl = this;

    $ctrl.showModal = true;

    $scope.localTheme = $rootScope.user.currentTheme;
    $ctrl.challengeDifficulties = challengeDifficulties;
    $ctrl.user = $rootScope.user;
    $ctrl.friends = [];

    $ctrl.invitations = [];
    $ctrl.keysPressed ='';
    $ctrl.currentQuest = {};
    $ctrl.targetText = '';

    $ctrl.getInvitations = function(){
      mainService.getInvitations().then(function(res){
        console.log('get invitations')
        console.log(res);
        $ctrl.invitations = res;
      },function(err){
        console.log("Error: "+ err);
      })
    };
    $ctrl.getInvitations();

    $ctrl.sendInvitation = function(user){
      console.log("inside send invite");
       var invitation = {
        challenge: {_id: $ctrl.currentQuest._id},
        sender: {_id: $ctrl.user._id},
        receiver:{_id: user._id}
      };
      mainService.addInvitation(invitation).then(function(){
        console.log("Invitation send");
      },function(err){
        console.log("Error: "+err)
      });
    }

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
    $ctrl.setCurrentQuest($ctrl.challengeDifficulties[0],$ctrl.challengeDifficulties[0].challenges[1]);

    $ctrl.addKeyPressed = function(e){
      console.log('inside add key pressed' + String.fromCharCode(e.keyCode));
      $ctrl.keysPressed += String.fromCharCode(e.keyCode);
    };

    $scope.$watch('initialContent', function(event){
      console.log('Modificare in editor');
      if ($scope.initialContent == $ctrl.targetText){
        console.log("Congrats! You reached target");
      }
    });

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
