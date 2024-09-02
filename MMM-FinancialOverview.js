Module.register("MMM-FinancialOverview", {
    // Default module config.
    defaults: {
        updateInterval: 60000, // 1 minute
    },

    start: function() {
        this.financialData = null;
        this.getFinancialData();
        this.scheduleUpdate();
    },

    getFinancialData: function() {
        this.sendSocketNotification("FETCH_FINANCIAL_DATA");
    },

    scheduleUpdate: function() {
        var self = this;
        setInterval(function() {
            self.getFinancialData();
        }, this.config.updateInterval);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "FINANCIAL_DATA") {
            this.financialData = payload;
            this.updateDom();
        }
    },

    getDom: function() {
        var wrapper = document.createElement("div");

        if (!this.financialData) {
            wrapper.innerHTML = "Loading financial data...";
            return wrapper;
        }

        var items = [
            { label: "Net Balance Since Earliest Date", value: this.financialData["Net Balance Since Earliest Date"] },
            { label: "Net Balance Last 30 Days", value: this.financialData["Net Balance Last 30 Days"] },
            { label: "Earning Per Day (Last 30 Days)", value: this.financialData["Earning Per Day (Last 30 Days)"] },
            { label: "Spending Per Day (Last 30 Days)", value: this.financialData["Spending Per Day (Last 30 Days)"] }
        ];

        items.forEach(function(item) {
            var itemWrapper = document.createElement("div");

            var label = document.createElement("div");
            label.innerHTML = item.label;
            label.style.fontSize = "medium";
            itemWrapper.appendChild(label);

            var value = document.createElement("div");
            value.innerHTML = item.value;
            value.style.fontSize = "2.5em";

            // Check if the value is negative and apply red color
            if (parseFloat(item.value) < 0) {
                value.style.color = "red";
            }

            itemWrapper.appendChild(value);
            wrapper.appendChild(itemWrapper);
        });

        return wrapper;
    }
});

