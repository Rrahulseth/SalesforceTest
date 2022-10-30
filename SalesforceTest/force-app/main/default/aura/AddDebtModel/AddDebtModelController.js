({
    // This method is being used to initialise the record
    init: function(component, event, helper) {
        let obj = {
            "id": component.get('v.dataLength'),
            "creditorName": "",
            "firstName": "",
            "lastName": "",
            "minPaymentPercentage": 0.00,
            "balance": 0.00
        };
        component.set("v.debtObject",obj);
    },
    
    // This method is being used to close the model box for Adding debt
    closeModel: function(component, event, helper) {
        var compEvent = component.getEvent("modelEvent");
        compEvent.fire();
    },
    
    // This method is being used for accepting data from fields on the screen and send to parent component using event
    submitDetails: function(component, event, helper) {
        var debtObject = component.get("v.debtObject");
        if(debtObject.creditorName == "" && debtObject.firstName == "" && debtObject.lastName == "" && debtObject.minPaymentPercentage == 0.00 && debtObject.balance == 0.00) {
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                mode: 'dismissible',
                message: 'Please fill the values in fields',
                type: 'error'
            });
            toastEvent.fire();
        }else {
            debtObject.minPaymentPercentage = debtObject.minPaymentPercentage/100;
            var compEvent = component.getEvent("modelEvent");
            compEvent.setParams({ "newData" : debtObject });
            compEvent.fire();
        }
    }
})