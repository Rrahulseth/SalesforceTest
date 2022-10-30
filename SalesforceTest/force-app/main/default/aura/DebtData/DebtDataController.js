({ 
    init: function (component, event, helper) {
        component.set('v.isLoading', true);
        component.set('v.columns', helper.getColumnDefinitions());
        helper.getData(component);
    },  
    
    updateSelectedText: function (component, event) {
        var selectedRows = event.getParam('selectedRows');
        component.set('v.selectedRows', selectedRows);
        component.set('v.selectedRowsCount', selectedRows.length);
        if(selectedRows.length > 0) {
            component.set('v.disableRemove', false);
        }else {
            component.set('v.disableRemove', true);
        }
    },
    
    updateColumnSorting: function (component, event, helper) {
        component.set('v.isLoading', true);
        // We use the setTimeout method here to simulate the async
        // process of the sorting data, so that user will see the
        // spinner loading when the data is being sorted.
        setTimeout($A.getCallback(function() {
            var fieldName = event.getParam('fieldName');
            var sortDirection = event.getParam('sortDirection');
            component.set("v.sortedBy", fieldName);
            component.set("v.sortedDirection", sortDirection);
            helper.sortData(component, fieldName, sortDirection);
            component.set('v.isLoading', false);
        }), 0);
    },
    
    removeDebt : function(component, event, helper) {
        var selectedRows = component.get('v.selectedRows');
        var totalRecords = component.get("v.data");
        
        for(let row in selectedRows) {
            totalRecords.splice(totalRecords.indexOf(selectedRows[row]), 1);
        }
        component.set("v.data", totalRecords);
        helper.getTotalAmount(component,totalRecords);
    },
    
    addDebt : function(component, event, helper) {
        component.set("v.showModal", true);
    },
    
    handleModelEvent : function(component, event, helper) {
        var newData = event.getParam("newData");
        if(newData != undefined) {
            let data = component.get('v.data');
        	data.push(newData);
            component.set('v.data', data);
            helper.getTotalAmount(component,data);
        }
        component.set("v.showModal", false);
        
    }
    
})