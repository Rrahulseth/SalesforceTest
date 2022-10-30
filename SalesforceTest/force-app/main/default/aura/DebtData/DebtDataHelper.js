({
    // This method is being used to set the columns of table
    getColumnDefinitions: function () {
        var columns = [
            { label: 'Creditor', fieldName: 'creditorName', type: 'text', sortable: true },
            { label: 'First Name', fieldName: 'firstName', type: 'text', sortable: true },
            { label: 'Last Name', fieldName: 'lastName', type: 'text', sortable: true },
            { label: 'Min Pay%', fieldName: 'minPaymentPercentage', type: 'percent', typeAttributes: { step: '0.01', minimumFractionDigits: '2', maximumFractionDigits: '2' }, sortable: true },
            { label: 'Balance', fieldName: 'balance', type: 'currency', sortable: true }
        ];
        return columns;
    },

    //This method is being used to fetch data from Controller using callout
    getData: function (component) {
        var action = component.get("c.getData");
        action.setCallback(this, function (response) {
            var state = response.getState();
            var responseData = response.getReturnValue();
            if (state == "SUCCESS") {
                component.set('v.data', responseData);
                this.getTotalAmount(component, responseData);
                component.set('v.isLoading', false);
            } else if (state === "ERROR") {
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    mode: 'dismissible',
                    message: response.getError(),
                    type: 'error'
                });
                toastEvent.fire();
            }
        });
        $A.enqueueAction(action);
    },

    // This method is being used as helper for sorting column
    sortData: function (component, fieldName, sortDirection) {
        var data = component.get("v.data");
        var reverse = sortDirection !== 'asc';

        data = Object.assign([], data.sort(this.sortBy(fieldName, reverse ? -1 : 1)));
        component.set("v.data", data);
    },

    // This method is being used to sort column by comparing field values
    sortBy: function (field, reverse, primer) {
        var key = primer
            ? function (x) {
                return primer(x[field]);
            }
            : function (x) {
                return x[field];
            };

        return function (a, b) {
            var A = key(a);
            var B = key(b);
            return reverse * ((A > B) - (B > A));
        };
    },

    // This method is being used to sum all the balance in table
    getTotalAmount: function (component, data) {
        var totalAmount = 0;
        for (let key in data) {
            totalAmount += parseFloat(data[key].balance);
        }
        component.set("v.totalAmount", totalAmount.toFixed(2));
    },


});