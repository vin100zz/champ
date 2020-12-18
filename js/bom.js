var Score = {}

/*

Probabilite de victoire - nul - defaite:
[+10] 85 - 10 - 5
  [0] 35 - 40 - 25 
[-10] 10 - 15 - 75

Ecart de score:
      [+6] [+5] [+4] [+3] [+2] [+1] [0] [-1] [-2] []
[+10] +6 - -1
  [0] +3 - +2
[-10] +1 - +5

*/

// probas d'ecart de score pour une diff de niveau de +10, 0, et -10

var probas = [
// [+7, +6, +5, +4, +3, +2, +1,  0, -1,  -2,  -3,  -4,  -5]
   [ 2,  7, 15, 25, 40, 60, 85, 95, 98, 100, 100, 100, 100],
   [ 0,  0,  0,  0,  5, 15, 35, 75, 90, 100, 100, 100, 100],
   [ 0,  0,  0,  0,  0,  2, 10, 25, 55,  75,  85,  95, 100]
];

var probas = [
// [+7, +6, +5, +4, +3, +2, +1,  0, -1,  -2,  -3,  -4,  -5]
   [ 3,  9, 18, 29, 45, 66, 95, 98, 99, 100, 100, 100, 100],
   [ 0,  0,  0,  0,  5, 15, 35, 75, 90, 100, 100, 100, 100],
   [ 0,  0,  0,  0,  0,  2, 10, 20, 50,  70,  80,  90, 100]
];

Score.get = function(equipeDom, equipeExt, competition)
{
  var yRnd = Math.floor(Math.random() * 1000) / 10;
  var equipeTab = yRnd < 50 ? equipeDom : equipeExt;

  var diffNiveau = equipeDom.niveau - equipeExt.niveau;

  var max = probas[diffNiveau >= 0 ? 0 : 1];
  var min = probas[diffNiveau >= 0 ? 1 : 2];

  var diffNiveauFromTenToZero = diffNiveau >= 0 ? diffNiveau : (10 - Math.abs(diffNiveau));

  var nbEcarts = probas[0].length;

  var bases = [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 2, 2, 3];
  var base = bases[Math.floor(Math.random()*bases.length)];

  var ecart = 7 - nbEcarts;

  for (var i=0; i<nbEcarts; ++i) {
    var tmpEcart = 7-i;

    var yLimite = (max[i] - min[i])/10 * diffNiveauFromTenToZero + min[i];
    if (yRnd < yLimite) {
      ecart = tmpEcart;
      break; 
    }
  }

  // TODO: terrainNeutre

  console.log('Score', equipeDom.nom, equipeDom.niveau, ",", equipeExt.nom, equipeExt.niveau, ", rnd", yRnd, ", ecart", ecart, ", base", base);

  return {dom: ecart >= 0 ? ecart + base : base, ext: ecart <= 0 ? -ecart + base : base, equipeTab: equipeTab};
}

Score.getButeur = function (joueurs) {
  return joueurs[Math.floor(Math.random() * 100) % joueurs.length];
}

