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

    // Start Refresh Button
    btn.addEventListener("click", () => {
      if (input.value !== "") {
        para.innerHTML = `Refresh is running every ${input.value} seconds`;
        
        // Clear any existing interval
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }

        // Set new interval
        refreshInterval = setInterval(() => {
          initTableau();
        }, input.value * 1000);

        // Run one refresh immediately
        initTableau();
      } else {
        para.innerHTML = "Please specify seconds till refresh";
      }
    });

    // Stop Refresh Button
    btnStop.addEventListener("click", () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        console.log("Stopped the refresh..");
        para.innerHTML = "Refresh is not running";
      }
    });
  });
}

function initTableau() {
  const dashboard = tableau.extensions.dashboardContent.dashboard;

  // Loop through all worksheets
  dashboard.worksheets.forEach(worksheet => {
    worksheet.getDataSourcesAsync().then(dataSources => {
      dataSources.forEach(ds => {
        console.log(`Refreshing data source: ${ds.name}`);
        
        ds.refreshAsync()
          .then(() => {
            console.log(`Successfully refreshed: ${ds.name}`);
          })
          .catch(error => {
            console.error(`Error refreshing ${ds.name}:`, error);
          });
      });
    });
  });
}
