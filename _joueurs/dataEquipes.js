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
      equipes.push(qualified || match.dom);
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
        new Equipe("Bayern", 10, null, generateMaillot(0, 'red', 100)),
        new Equipe("Barcelone", 8, null, generateStripeMaillot('#004D98', '#A50044')),
        new Equipe("Real Madrid", 8, null, generateMaillot(0, 'white', 100)),
        new Equipe("Liverpool", 9, null, generateMaillot(0, 'red', 100)),
        new Equipe("Man City", 8, null, generateMaillot(0, 'lightblue', 100)),
        new Equipe("Juventus", 8, null, generateStripeMaillot('white', 'black')),
        new Equipe("Paris SG", 7, null, generateMaillot(90, 'blue', 30, 'white', 35, 'red', 65, 'white', 70, 'blue', 100)),
        new Equipe("Bor. Dortmund", 7, null, generateStripeMaillot('yellow', 'black'))
      ], [
        new Equipe("Inter Milan", 6, null, generateStripeMaillot('blue', 'black')),
        new Equipe("Lazio Rome", 5, null, generateMaillot(0, 'lightblue', 100)),
        new Equipe("Seville", 5, null, generateStripeMaillot('white', 'red')),
        new Equipe("Atletico", 7, null, generateStripeMaillot('white', 'red')),
        new Equipe("Porto", 6, null, generateStripeMaillot('white', 'blue')),
        new Equipe("Shakhtar", 5, null, generateStripeMaillot('orange', 'black')),
        new Equipe("Chelsea", 7, null, generateMaillot(0, 'blue', 100)),
        new Equipe("Tottenham", 7, null, generateMaillot(0, 'white', 100))
      ], [
        new Equipe("Benfica", 5, null, generateMaillot(0, 'red', 100)),
        new Equipe("Celtic", 4, null, generateStripeMaillotHorizontal('white', 'lightgreen')),
        new Equipe("RB Leipzig", 6, null, generateMaillot(0, 'white', 100)),
        new Equipe("RB Salzbourg", 4, null, generateMaillot(0, 'white', 100)),
        new Equipe("Lokomotiv", 4, null, generateStripeMaillot('red', 'green')),
        new Equipe("Olympiakos", 3, null, generateStripeMaillot('white', 'red')),
        new Equipe("Ajax Amsterdam", 6, null, generateMaillot(90, 'white', 30, 'red', 70, 'white', 100)),
        new Equipe("FC Midtjylland", 1, null, generateMaillot(0, 'red', 100))
      ], [
        new Equipe("Lille", 5, null, generateMaillot(0, 'red', 100)),
        new Equipe("Marseille", 4, null, generateMaillot(0, 'white', 100)),
        new Equipe("Atalanta", 6, null, generateStripeMaillot('blue', 'black')),
        new Equipe("Zenit", 5, null, generateMaillot(0, 'white', 100)),
        new Equipe("Club Bruges", 2, null, generateStripeMaillot('blue', 'black')),
        new Equipe("Basaksehir", 3, null, generateMaillot(0, 'orange', 100)),
        new Equipe("Ferencvaros", 1, null, generateMaillot(0, 'green', 100)),
        new Equipe("Dynamo Kiev", 2, null, generateMaillot(0, 'white', 100))
      ]
    ]
  },
  worldCup: {
    allerRetour: false,
    pots: [
      [
        new Equipe("France", 10, 'FR'),
        new Equipe("Espagne", 10, 'ES'),
        new Equipe("Allemagne", 9, 'DE'),
        new Equipe("Portugal", 9, 'PT'),
        new Equipe("Argentine", 8, 'AR'),
        new Equipe("Brésil", 8, 'BR'),
        new Equipe("Belgique", 8, 'BE'),
        new Equipe("Angleterre", 8, 'GB')
      ], [
        new Equipe("Italie", 7, 'IT'),
        new Equipe("Croatie", 7, 'HR'),
        new Equipe("Danemark", 5, 'DK'),
        new Equipe("Pays-Bas", 7, 'NL'),
        new Equipe("Russie", 5, 'RU'),
        new Equipe("Suisse", 5, 'CH'),
        new Equipe("Suède", 5, 'SE'),
        new Equipe("Pologne", 5, 'PL')
      ], [
        new Equipe("Cote d'Ivoire", 4, 'CI'),
        new Equipe("Senegal", 4, 'SN'),
        new Equipe("Cameroun", 3, 'CM'),
        new Equipe("Tunisie", 3, 'TN'),
        new Equipe("Mexique", 5, 'MX'),
        new Equipe("USA", 4, 'US'),
        new Equipe("Costa-Rica", 3, 'CR'),
        new Equipe("Nlle-Zelande", 1, 'NZ')
      ], [
        new Equipe("Chili", 6, 'CL'),
        new Equipe("Colombie", 5, 'CO'),
        new Equipe("Uruguay", 5, 'UY'),
        new Equipe("Australie", 4, 'AU'),
        new Equipe("Japon", 5, 'JP'),
        new Equipe("Corée du Sud", 4, 'KR'),
        new Equipe("Iran", 2, 'IR'),
        new Equipe("Birmanie", 1, 'MM')
      ]
    ]
  },
  euro: {
    allerRetour: true,
    pots: [
      [
        new Equipe("Belgique", 9, 'BE'),
        new Equipe("France", 10, 'FR'),
        new Equipe("Angleterre", 9, 'GB'),
        new Equipe("Portugal", 9, 'PT'),
        new Equipe("Espagne", 9, 'ES'),
        new Equipe("Italie", 8, 'IT'),
        new Equipe("Croatie", 7, 'HR'),
        new Equipe("Allemagne", 9, 'DE')
      ], [
        new Equipe("Danemark", 6, 'DK'),
        new Equipe("Pays-Bas", 8, 'NL'),
        new Equipe("Suisse", 6, 'CH'),
        new Equipe("Pays de Galles", 6, 'WALES'),
        new Equipe("Pologne", 6, 'PL'),
        new Equipe("Suède", 5, 'SE'),
        new Equipe("Autriche", 4, 'AT'),
        new Equipe("Ukraine", 5, 'UA')
      ], [  
        new Equipe("Serbie", 5, 'RS'),
        new Equipe("Turquie", 5, 'TR'),
        new Equipe("Slovaquie", 4, 'SK'),
        new Equipe("Roumanie", 4, 'RO'),        
        new Equipe("Russie", 5, 'RU'),
        new Equipe("Hongrie", 4, 'HU'),
        new Equipe("Irlande", 5, 'IE'),
        new Equipe("Rép. Tchèque", 5, 'CZ')
      ], [        
        new Equipe("Norvège", 4, 'NO'),
        new Equipe("Irlande Nd", 3, 'NORTHERN-IRELAND'),
        new Equipe("Islande", 5, 'IS'),
        new Equipe("Écosse", 5, 'SCOTLAND'),
        new Equipe("Grèce", 5, 'GR'),
        new Equipe("Finlande", 4, 'FI'),
        new Equipe("Bosnie", 4, 'BA'),
        new Equipe("Slovénie", 3, 'SI')
      ], [
        new Equipe("Monténégro", 3, 'ME'),
        new Equipe("Macédoine", 2, 'MK'),
        new Equipe("Albanie", 3, 'AL'),
        new Equipe("Bulgarie", 3, 'BG'),
        new Equipe("Israël", 3, 'IL'),
        new Equipe("Biélorussie", 2, 'BY'),
        new Equipe("Géorgie", 2, 'GE'),
        new Equipe("Luxembourg", 1, 'LU')
      ], [        
        new Equipe("Arménie", 3, 'AM'),
        new Equipe("Chypre", 2, 'CY'),
        new Equipe("Îles Féroé", 1, 'FO'),
        new Equipe("Azerbaïdjan", 2, 'AZ'),
        new Equipe("Estonie", 1, 'EE'),
        new Equipe("Kosovo", 1, 'KOSOVO'),
        new Equipe("Kazakhstan", 1, 'KZ'),
        new Equipe("Lituanie", 1, 'LT')
      ]/*, [
        new Equipe("Lettonie", 1, 'LV'),
        new Equipe("Andorre", 0, 'AD'),
        new Equipe("Malte", 0, 'MT'),
        new Equipe("Moldavie", 0, 'MD'),
        new Equipe("Liechtenstein", 0, 'LI'),
        new Equipe("Gibraltar", 0, 'GI'),
        new Equipe("St-Marin", 0, 'SM'),
        new Equipe("Monaco", 0, 'PL')
      ]*/
    ]
  },
  ligue1: {
    allerRetour: true,
    equipes: [
        new Equipe("Angers", 3),
        new Equipe("Bordeaux", 4),
        new Equipe("Brest", 2),
        new Equipe("Dijon", 1),
        new Equipe("Lens", 4),
        new Equipe("Lille", 8),
        new Equipe("Lorient", 3),
        new Equipe("Lyon", 7),
        new Equipe("Marseille", 7),
        new Equipe("Metz", 2),
        new Equipe("Monaco", 6),
        new Equipe("Montpellier", 5),
        new Equipe("Nantes", 4),
        new Equipe("Nice", 5),
        new Equipe("Nîmes", 2),
        new Equipe("Paris", 10),
        new Equipe("Reims", 3),
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

