// When the DOM has loaded, run the function load
document.addEventListener("DOMContentLoaded", load);

// Grab the input box, the buttons and paragraph
const input = document.querySelector("#refreshTime");
const btn = document.querySelector("#btn");
const btnStop = document.querySelector("#btn-stop");
const para = document.querySelector("#info");

// Create refresh variable
let refreshInterval = null;

function load() {
  // Initialise the Tableau extension
  tableau.extensions.initializeAsync().then(() => {
    console.log("Tableau object loaded");
    // Event listener on the start button
    btn.addEventListener("click", () => {
      if (input.value !== "") {
        para.innerHTML = `Refresh is running every ${input.value} seconds<br/>`;
        refreshInterval = setInterval(() => {
          initTableau();
        }, input.value * 1000);
      } else {
        para.innerHTML = "Please specify seconds till refresh<br/>";
      }
    });

    // Event listener on the stop button
    btnStop.addEventListener("click", () => {
      clearInterval(refreshInterval);
      para.innerHTML += "Refresh is not running<br/>";
    });
  });
}

function initTableau() {
  const dashboard = tableau.extensions.dashboardContent.dashboard;
  const worksheets = dashboard.worksheets;

  // Refresh the data on every worksheet
  const refreshPromises = worksheets.map(ws => {
    return ws.refreshDataAsync();
  });

  Promise.all(refreshPromises)
    .then(() => {
      console.log("All worksheets refreshed successfully.");
    })
    .catch(err => {
      console.error("Error refreshing worksheets: ", err);
    });
}
