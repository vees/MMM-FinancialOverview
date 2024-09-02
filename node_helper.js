const NodeHelper = require("node_helper");
const http = require("http");

module.exports = NodeHelper.create({
    start: function() {
        console.log("MMM-FinancialOverview helper started...");
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FETCH_FINANCIAL_DATA") {
            this.fetchFinancialData();
        }
    },

    fetchFinancialData: function() {
        const url = "http://localhost:8000/financial.json"; // Update this with your actual URL

        http.get(url, (resp) => {
            let data = '';

            // A chunk of data has been received.
            resp.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            resp.on('end', () => {
                try {
                    const financialData = JSON.parse(data);
                    this.sendSocketNotification("FINANCIAL_DATA", financialData);
                } catch (error) {
                    console.error("Error parsing JSON data: ", error);
                }
            });

        }).on("error", (err) => {
            console.error("Error fetching financial data: " + err.message);
        });
    }
});
