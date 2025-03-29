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
  // initialise the tableau object
  tableau.extensions.initializeAsync().then(() => {
    console.log("Tableau object loaded");
    // Event listener on the start button
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

    // Event listener on the stop button
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
  // Get the Tableau dashboard and all its worksheets
  const dashboard = tableau.extensions.dashboardContent.dashboard;
  const worksheets = dashboard.worksheets;

  // For each worksheet, get its datasources.
  // Use Promise.all to wait for all getDataSourcesAsync calls to finish.
  const datasourcePromises = worksheets.map(ws => ws.getDataSourcesAsync());

  Promise.all(datasourcePromises)
    .then(allDatasourcesArrays => {
      // Use a Map to hold unique datasources keyed by their id
      const uniqueDatasources = new Map();

      // Flatten the arrays and add each datasource to the map if not already present.
      allDatasourcesArrays.forEach(datasourceArray => {
        datasourceArray.forEach(ds => {
          if (!uniqueDatasources.has(ds.id)) {
            uniqueDatasources.set(ds.id, ds);
          }
        });
      });

      console.log("Refreshing all unique datasources...");

      // Refresh each unique datasource and collect the refresh promises.
      const refreshPromises = Array.from(uniqueDatasources.values()).map(ds => {
        console.log("Refreshing datasource: " + ds.name);
        return ds.refreshAsync();
      });

      // Wait for all refresh actions to complete.
      return Promise.all(refreshPromises);
    })
    .then(() => {
      console.log("All datasources refreshed successfully.");
    })
    .catch(err => {
      console.error("Error refreshing datasources: ", err);
    });
}
