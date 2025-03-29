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
  // Initialise the Tableau object
  tableau.extensions.initializeAsync().then(() => {
    console.log("Tableau object loaded");

    // Event listener on the start button
    btn.addEventListener("click", () => {
      if (input.value !== "") {
        para.innerHTML = `Refresh is running every ${input.value} seconds`;

        // Clear existing interval if any
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }

        // Start the refresh interval
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
        refreshInterval = null;
        console.log("Stopped the refresh..");
        para.innerHTML = "Refresh is not running";
      }
    });
  });
}

// ✅ Updated to refresh all data sources in the dashboard
function initTableau() {
  const dashboard = tableau.extensions.dashboardContent.dashboard;

  dashboard.getDataSourcesAsync().then(dataSources => {
    console.log(`Refreshing all ${dataSources.length} data sources...`);

    dataSources.forEach(ds => {
      console.log(`Refreshing data source: ${ds.name}`);
      ds.refreshAsync()
        .then(() => {
          console.log(`✅ Successfully refreshed: ${ds.name}`);
        })
        .catch(error => {
          console.error(`❌ Error refreshing ${ds.name}:`, error);
        });
    });
  });
}
