'use strict';

function Joueur(nom, niveau, equipe)
{
  this.nom = nom;
  this.niveau = niveau;
  this.equipe = equipe;
  this.buts = 0;
}


function MainCtrl($scope, Wfk) {
  // competition
  $scope.currentView = 'competition';

  $scope.startCompetition = function (competition) {
    $scope.competition = COMPETITIONS[competition];
    $scope.groupes = tirageAuSort($scope.competition);
    $scope.goToGroupes();
  }

  // groupes
  $scope.setCurrentGroupe = function () {
    $scope.currentGroupe = $scope.groupes[$scope.currentGroupeIndex];
  }

  $scope.nextGroupe = function () {
    ++$scope.currentGroupeIndex;
    $scope.setCurrentGroupe();
  }

  $scope.previousGroupe = function () {
    --$scope.currentGroupeIndex;
    $scope.setCurrentGroupe();
  }

  $scope.currentGroupeIndex = 0;

  $scope.goToGroupes = function () {
    $scope.currentView = 'groupe';
    $scope.setCurrentGroupe();
  }

  // tableau final
  $scope.goToTableauFinal = function () {
    if (!$scope.coupe) {
      var nbQualified = $scope.groupes.length * 2;
      var qualified = [];
      $scope.groupes.forEach((groupe, index) => {
        qualified[index] = groupe.classement[index%2 ? 1 : 0].equipe;
        qualified[nbQualified-index-1] = groupe.classement[index%2 ? 0 : 1].equipe;
      });
      $scope.coupe = new Coupe(qualified, $scope.competition);
    }
    $scope.currentView = 'coupe';
  }



  $scope.joueursParClub = {};
  // JOUEURS.forEach(club => {
  //   var key = $scope.equipes.find(e => club.name.match(e.nom)).nom;
  //   var value = club.players.map(p => new Joueur(p.name, p.rating, club.name));
  //   $scope.joueursParClub[key] = value;
  // });
  
  $scope.buteurs = [];
  
  $scope.nbButs = function(joueur)
  {
    return joueur.buts;
  }
  
  $scope.simulate = function(groupe, match)
  {	
	  var dom = match.dom;
	  var ext = match.ext;
		  
	  var score = Score.get(dom, ext, $scope.competition);
	  
	  match.butsDom = score.dom;
	  match.butsExt = score.ext;
    match.equipeTab = score.equipeTab;

    if (groupe) {

      var statsDom = groupe.statsEquipes[dom.nom];
      var statsExt = groupe.statsEquipes[ext.nom];

      // var joueursDom = $scope.joueursParClub[dom.nom];
      // for (var i=0; i<score.dom; ++i) {
      //   var buteur = Score.getButeur(joueursDom);
      //   match.buteursDom.push(buteur.nom);
      //   buteur.buts++;
      // }

      // var joueursExt = $scope.joueursParClub[ext.nom];
      // for (var i=0; i<score.ext; ++i) {
      //   var buteur = Score.getButeur(joueursExt);
      //   match.buteursExt.push(buteur.nom);
      //   buteur.buts++;
      // }

      refreshButeurs();
  	  
  	  statsDom.bp += score.dom;
  	  statsExt.bp += score.ext;
  	  statsDom.bc += score.ext;
  	  statsExt.bc += score.dom;
    
  	  if (score.dom > score.ext)
  	  {
  		  statsDom.v += 1;
  		  statsExt.d += 1;
  	  }
  	  else if (score.ext > score.dom)
  	  {
  		  statsExt.v += 1;
  		  statsDom.d += 1;
  	  }
  	  else
  	  {
  		  statsDom.n += 1;
  		  statsExt.n += 1;
  	  }
    
      groupe.computeClassement();
    }
  }
  
  $scope.simulateAll = function(groupe)
  {
    groupe.journees.forEach(j => j.forEach(m => $scope.simulate(groupe, m)));
  }

  function refreshButeurs() {
    $scope.buteurs = [];
    Object.values($scope.joueursParClub).forEach(joueurs => {
      joueurs.forEach(j => {
        if (j.buts > 0) {
          $scope.buteurs.push(j);
        }
      });
    });
  }


 
}


