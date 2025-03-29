document.addEventListener("DOMContentLoaded", load);

// Grab the input box, the buttons and paragraph
const input = document.querySelector("#refreshTime");
const btn = document.querySelector("#btn");
const btnStop = document.querySelector("#btn-stop");
const para = document.querySelector("#info");

// Create refresh variable
let refreshInterval = null;

function load() {
  tableau.extensions.initializeAsync().then(() => {
    console.log("Tableau object loaded");

    // Start Refresh Button
    btn.addEventListener("click", () => {
      const seconds = parseInt(input.value, 10);

      if (!isNaN(seconds) && seconds > 0) {
        para.innerHTML = `Refresh is running every ${seconds} seconds`;

        // Clear existing interval if one exists
        if (refreshInterval) {
          clearInterval(refreshInterval);
        }

        // Set new interval
        refreshInterval = setInterval(() => {
          refreshAllDataSources();
        }, seconds * 1000);

        // Optional: Do one immediate refresh
        refreshAllDataSources();
      } else {
        para.innerHTML = "Please specify seconds till refresh";
      }
    });

    // Stop Refresh Button
    btnStop.addEventListener("click", () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        refreshInterval = null;
        console.log("Stopped the refresh.");
        para.innerHTML = "Refresh is not running";
      }
    });
  });
}

function refreshAllDataSources() {
  const dashboard = tableau.extensions.dashboardContent.dashboard;

  dashboard.getDataSourcesAsync().then(dataSources => {
    console.log(`Found ${dataSources.length} data source(s).`);

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
