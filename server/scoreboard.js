// Fetch scoreboard data from the server
function fetchScoreboardData() { 
  // The scoreboard from server, Please replace it here
  fetch('/scoreboard')
    .then(response => response.json())
    .then(data => {
      // The function written at the bottom for populating the scoreboard
      populateScoreboard(data);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}


function populateScoreboard(data) {
  const scoreboard = document.getElementById('scoreboard');
  
  const tbody = scoreboard.querySelector('tbody');
  tbody.innerHTML = '';

  // Sorting according the #of kills, HP remaining and survival time
  data.sort((a, b) => {
    if (a.statistics.kills !== b.statistics.kills) {
      return b.statistics.kills - a.statistics.kills; // Sort by kills in descending order
    } else if (a.statistics.hpRemaining !== b.statistics.hpRemaining) {
      return b.statistics.hpRemaining - a.statistics.hpRemaining; // Sort by HP remaining in descending order
    } else {
      return a.statistics.survivalTime - b.statistics.survivalTime; // Sort by survive time in ascending order
    }
  });

  // Input the row according to the rank and number of players
  data.forEach((player, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${player.name}</td>
      <td>${player.statistics.kills}</td>
      <td>${player.statistics.hpRemaining}</td>
      <td>${player.statistics.survivalTime}</td>
      <td>${player.statistics.shotsFired}</td>
      <td>${player.statistics.numberOfItemsPickedUp}</td>
    `;
    tbody.appendChild(row);
  });
}

// Fetch again
fetchScoreboardData();