var cheerio = require('cheerio');
var request = require('request');
var fs = require('fs');

// league
function getLeagueData (link) {
  console.log('League', link);
	request(link, scrapLeague);
}

function scrapLeague (err, resp, html) {
	if (err) {
  	return console.error(err);
  }
  var parsedHTML = cheerio.load(html);

  parsedHTML('.table a.item-title').map((i, link) => {
  	var name = trim(cheerio(link).text());
  	var link = cheerio(link).attr('href');
  	var club = {
    	name: name,
    	players: []
    };
    clubs.push(club);
    getClubData(link, club, 'players');
  });
}

// club
function getClubData (link, holder, key) {
	console.log('Club', link);
	request(link, scrapClub.bind(this, holder, key));
}

function scrapClub (holder, key, err, resp, html) {
	if (err) {
  	return console.error(err);
  }
  var parsedHTML = cheerio.load(html);

  parsedHTML('.table tr')
  .map((i, row) => {
    var name = trim(cheerio('td.row-title > a', row).text());

    if (!name) {
      return null;
    }
    name = name.replace('\n', '').trim();

    var poste = trim(cheerio('td:nth-child(4)', row).text());
    if (!poste.match('ST') || !poste.match('AM')) {
      return null;
    }

    var rating = cheerio('td:nth-child(9)', row).children().length;
    
    //console.log(name, rating);

    holder[key].push({
    	name: name,
      poste: poste,
    	rating: rating
    });
  })
  .filter(x => !!x);
}

function trim(str) {
  if (!str) {
    return null;
  }
  return str.replace('\n', '').trim();
}

var clubs = [];
getLeagueData('https://sortitoutsi.net/football-manager-2021/competition/16/ligue-1-conforama');

setTimeout(() => {
	// filter
	clubs.forEach(club => {
		club.players = club.players.sort((player1, player2) => {return player2.rating - player1.rating;}).slice(0, 6);
	});


	// dump
	fs.writeFileSync('data.json', JSON.stringify(clubs, null, 2), 'utf8');
}, 3000);

