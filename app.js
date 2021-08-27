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
  //initialise the tableau object
  tableau.extensions.initializeAsync().then(() => {
    console.log("Tableau object loaded");
    // Eventlistener on the start button
    btn.addEventListener("click", () => {
      if (input.value !== "") {
        para.innerHTML = `Refresh is running every ${input.value} seconds`;
        refreshInterval = setInterval(() => {
          initTableau();
        }, input.value * 1000);
      } else {
        para.innerHTML = "Please specify seconds till refresh";
      }
    });

    btnStop.addEventListener("click", () => {
      if (input.value !== "") {
        clearInterval(refreshInterval);
        console.log("Stopped the refresh..");
        para.innerHTML = "Refresh is not running";
      }
    });
  });
}

function initTableau() {
  // get the Tableau elements
  const dashboard = tableau.extensions.dashboardContent.dashboard;
  const sheets = dashboard.worksheets[0];
  const datasource = sheets.getDataSourcesAsync();
  // refresh said data source
  console.log("Refreshing Datasource..");
  datasource.then(source => source[0].refreshAsync());
}