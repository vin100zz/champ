function Match(dom, ext, matchRetour)
{
  this.dom = dom;
  this.ext = ext;
  this.butsDom = null;
  this.butsExt = null;
  this.equipeTab = null;
  this.buteursDom = [];
  this.buteursExt = [];
  this.matchRetour = matchRetour;
}

function Equipe(nom, niveau, flag, maillot)
{
  this.nom = nom;
  this.niveau = niveau;
  this.flag = flag;
  this.maillot = maillot;
}

function StatsEquipe(equipe)
{
  this.equipe = equipe;
  this.v = 0;
  this.n = 0;
  this.d = 0;
  this.bp = 0;
  this.bc = 0;
}

class Groupe {
  constructor(equipes, allerRetour) {
    this.statsEquipes = {};
    equipes.forEach(e => this.statsEquipes[e.nom] = new StatsEquipe(e));

    this.computeClassement();

    this.journees = computeJournees(equipes, allerRetour);
  }

  computeClassement() {
    this.classement = Object.values(this.statsEquipes).sort((stat1, stat2) => {
      var nbPoints1 = 1000000*(stat1.v*3 + stat1.n)+1000*(stat1.bp-stat1.bc)+stat1.bp;
      var nbPoints2 = 1000000*(stat2.v*3 + stat2.n)+1000*(stat2.bp-stat2.bc)+stat2.bp;
      return nbPoints2 - nbPoints1;
    });
  }
}

function Coupe(equipes, competition) {
  this.computeNextRound = function () {
    var lastRound = this.rounds[this.rounds.length-1];
    var equipes = [];
    lastRound.forEach(match => {
      var qualified;
      if (match.matchRetour) {
        var buts1 = 1000*(match.butsDom + match.matchRetour.butsExt) + match.matchRetour.butsExt;
        var buts2 = 1000*(match.butsExt + match.matchRetour.butsDom) + match.butsExt;
        qualified = buts1 == buts2 ? match.matchRetour.equipeTab : (buts1 >= buts2 ? match.dom : match.ext);

        console.log(match.dom, buts1, match.ext, buts2, 'tab', match.matchRetour.equipeTab);
      } else {
        qualified = match.butsDom == match.butsExt ? match.equipeTab : (match.butsDom >= match.butsExt ? match.dom : match.ext);
      }
      equipes.push(qualified);
    });
    this.rounds.push(this.computeMatches(equipes));
  }

  this.computeMatches = function (equipes) {
    var matches = [];
    for (let i=0; i<equipes.length; i=i+2) {
      var matchRetour = competition.allerRetour ? new Match(equipes[i+1], equipes[i]) : null;
      var match = new Match(equipes[i], equipes[i+1], matchRetour);
      matches.push(match);
    }
    return matches;
  }

  this.rounds = [];
  this.rounds.push(this.computeMatches(equipes));
}

function tirageAuSort(competition) {
  if (competition.equipes) {
    return [new Groupe(competition.equipes, competition.allerRetour)];
  }

  var pots = competition.pots;
  var nbPots = pots.length;
  var nbGroupes = pots[0].length;

  var groupes = [];

  for (let j=0; j<nbPots; ++j) {
    shuffle(pots[j]);
  }

  for (let i=0; i<nbGroupes; ++i) {
    var equipesGroupe = [];
    for (let j=0; j<nbPots; ++j) {
      equipesGroupe.push(pots[j].pop());
    }
    groupes.push(new Groupe(equipesGroupe, competition.allerRetour));
  }
  return groupes;
}

let COMPETITIONS = {
  c1: {
    allerRetour: true,
    pots: [
      [
        new Equipe("Bayern", 9, null, generateMaillot(0, 'red', 100)),
        new Equipe("Barcelone", 7, null, generateStripeMaillot('#004D98', '#A50044')),
        new Equipe("Real Madrid", 7, null, generateMaillot(0, 'white', 100)),
        new Equipe("Liverpool", 7, null, generateMaillot(0, 'red', 100)),
        new Equipe("Man City", 7, null, generateMaillot(0, 'lightblue', 100)),
        new Equipe("Juventus", 7, null, generateStripeMaillot('white', 'black')),
        new Equipe("Paris SG", 6, null, generateMaillot(90, 'blue', 30, 'white', 35, 'red', 65, 'white', 70, 'blue', 100)),
        new Equipe("Bor. Dortmund", 6, null, generateStripeMaillot('yellow', 'black'))
      ], [
        new Equipe("Inter Milan", 6, null, generateStripeMaillot('blue', 'black')),
        new Equipe("Lazio Rome", 5, null, generateMaillot(0, 'lightblue', 100)),
        new Equipe("Seville", 5, null, generateStripeMaillot('white', 'red')),
        new Equipe("Atletico", 7, null, generateStripeMaillot('white', 'red')),
        new Equipe("Porto", 6, null, generateStripeMaillot('white', 'blue')),
        new Equipe("Shakhtar", 5, null, generateStripeMaillot('orange', 'black')),
        new Equipe("Chelsea", 6, null, generateMaillot(0, 'blue', 100)),
        new Equipe("Tottenham", 6, null, generateMaillot(0, 'white', 100))
      ], [
        new Equipe("Benfica", 5, null, generateMaillot(0, 'red', 100)),
        new Equipe("Celtic", 5, null, generateStripeMaillotHorizontal('white', 'lightgreen')),
        new Equipe("RB Leipzig", 6, null, generateMaillot(0, 'white', 100)),
        new Equipe("RB Salzbourg", 4, null, generateMaillot(0, 'white', 100)),
        new Equipe("Lokomotiv", 5, null, generateStripeMaillot('red', 'green')),
        new Equipe("Olympiakos", 5, null, generateStripeMaillot('white', 'red')),
        new Equipe("Ajax Amsterdam", 6, null, generateMaillot(90, 'white', 30, 'red', 70, 'white', 100)),
        new Equipe("FC Midtjylland", 4, null, generateMaillot(0, 'red', 100))
      ], [
        new Equipe("Lille", 5, null, generateMaillot(0, 'red', 100)),
        new Equipe("Marseille", 5, null, generateMaillot(0, 'white', 100)),
        new Equipe("Atalanta", 6, null, generateStripeMaillot('blue', 'black')),
        new Equipe("Zenit", 6, null, generateMaillot(0, 'white', 100)),
        new Equipe("Club Bruges", 4, null, generateStripeMaillot('blue', 'black')),
        new Equipe("Basaksehir", 5, null, generateMaillot(0, 'orange', 100)),
        new Equipe("Ferencvaros", 4, null, generateMaillot(0, 'green', 100)),
        new Equipe("Dynamo Kiev", 5, null, generateMaillot(0, 'white', 100))
      ]
    ]
  },
  worldCup: {
    allerRetour: false,
    pots: [
      [
        new Equipe("France", 8, 'FR'),
        new Equipe("Espagne", 8, 'ES'),
        new Equipe("Allemagne", 7, 'DE'),
        new Equipe("Portugal", 7, 'PT'),
        new Equipe("Argentine", 7, 'AR'),
        new Equipe("Bresil", 7, 'BR'),
        new Equipe("Belgique", 7, 'BE'),
        new Equipe("Angleterre", 6, 'GB')
      ], [
        new Equipe("Italie", 6, 'IT'),
        new Equipe("Croatie", 6, 'HR'),
        new Equipe("Danemark", 5, 'DK'),
        new Equipe("Pays-Bas", 6, 'NL'),
        new Equipe("Russie", 5, 'RU'),
        new Equipe("Suisse", 5, 'CH'),
        new Equipe("Suede", 5, 'SE'),
        new Equipe("Pologne", 5, 'PL')
      ], [
        new Equipe("Cote d'Ivoire", 4, 'CI'),
        new Equipe("Senegal", 5, 'SN'),
        new Equipe("Cameroun", 4, 'CM'),
        new Equipe("Tunisie", 4, 'TN'),
        new Equipe("Mexique", 5, 'MX'),
        new Equipe("USA", 5, 'US'),
        new Equipe("Costa-Rica", 4, 'CR'),
        new Equipe("Nlle-Zelande", 3, 'NZ')
      ], [
        new Equipe("Chili", 6, 'CL'),
        new Equipe("Colombie", 5, 'CO'),
        new Equipe("Uruguay", 5, 'UY'),
        new Equipe("Australie", 4, 'AU'),
        new Equipe("Japon", 5, 'JP'),
        new Equipe("Coree du Sud", 4, 'KR'),
        new Equipe("Iran", 3, 'IR'),
        new Equipe("Birmanie", 2, 'MM')
      ]
    ]
  },
  ligue1: {
    allerRetour: true,
    equipes: [
        new Equipe("Angers", 4),
        new Equipe("Bordeaux", 4),
        new Equipe("Brest", 3),
        new Equipe("Dijon", 3),
        new Equipe("Lens", 4),
        new Equipe("Lille", 8),
        new Equipe("Lorient", 3),
        new Equipe("Lyon", 7),
        new Equipe("Marseille", 7),
        new Equipe("Metz", 3),
        new Equipe("Monaco", 7),
        new Equipe("Montpellier", 5),
        new Equipe("Nantes", 4),
        new Equipe("Nice", 6),
        new Equipe("Nîmes", 4),
        new Equipe("Paris", 9),
        new Equipe("Reims", 4),
        new Equipe("Renn", 7),
        new Equipe("Saint-Etienne", 4),
        new Equipe("Strasbourg", 4)
    ]
  }
};

function generateStripeMaillot(color1, color2) {
  return generateMaillot(90, color1, 19, color2, 41, color1, 59, color2, 81, color1, 100);
}

function generateStripeMaillotHorizontal(color1, color2) {
  return generateMaillot(0, color1, 19, color2, 41, color1, 59, color2, 81, color1, 100);
}

function generateMaillot(angle) {

  var background = `linear-gradient(${angle}deg, `;

  var args = Array.from(arguments).splice(1);

  var currentStop = 0;
  var colors = [];
  for (var i=0; i<args.length; i=i+2) {
    var color = args[i];
    var stop = args[i+1];
    colors.push(`${color} ${currentStop}%`);
    colors.push(`${color} ${stop}%`);
  }

  background += colors.join(', ') + ')';
  return background;
}


function shuffle(array) {
  array.sort(() => Math.random() - 0.5);
}

function computeJournees(equipes, allerRetour) {

  shuffle(equipes);

  const pivot = equipes[0];

  let journees = [];

  for (let i=0; i<equipes.length-1; ++i) {
    let matches = [];
    let j=0;
    while (j<equipes.length/2) {
      let equipe1 = equipes[j];
      let equipe2 = equipes[equipes.length-j-1];
      matches.push(new Match(i%2 ? equipe1 : equipe2, i%2 ? equipe2 : equipe1));
      ++j;
    }
    shuffle(matches);
    journees.push(matches);

    const last = equipes.pop();
    equipes.splice(1, 0, last);
  }

  if (allerRetour) {
    const nbJournees = journees.length;
    for (let i=0; i<nbJournees; ++i) {
      journees.push(journees[i].map(match => new Match(match.ext, match.dom)));
    }
  }

  return journees;
}

