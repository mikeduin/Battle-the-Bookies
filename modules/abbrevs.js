module.exports = {

  teamAbbrev: function(team) {
    var abbreviations = {
      "Arizona Diamondbacks": "ARI",
      "Atlanta Braves": "ATL",
      "Baltimore Orioles": "BAL",
      "Boston Red Sox": "BOS",
      "Chicago Cubs": "CHC",
      "Chicago White Sox": "CHW",
      "Cincinnati Reds": "CIN",
      "Cleveland Indians": "CLE",
      "Colorado Rockies": "COL",
      "Detroit Tigers": "DET",
      "Houston Astros": "HOU",
      "Kansas City Royals": "KAN",
      "Los Angeles Angels": "LAA",
      "Los Angeles Dodgers": "LAD",
      "Miami Marlins": "MIA",
      "Milwaukee Brewers": "MIL",
      "Minnesota Twins": "MIN",
      "New York Mets": "NYM",
      "New York Yankees": "NYY",
      "Oakland Athletics": "OAK",
      "Philadelphia Phillies": "PHI",
      "Pittsburgh Pirates": "PIT",
      "San Diego Padres": "SD",
      "San Francisco Giants": "SF",
      "Seattle Mariners": "SEA",
      "St. Louis Cardinals": "STL",
      "Tampa Bay Rays": "TB",
      "Texas Rangers": "TEX",
      "Toronto Blue Jays": "TOR",
      "Washington Nationals": "WAS"
    };
    
    return abbreviations[team]
  }
}
