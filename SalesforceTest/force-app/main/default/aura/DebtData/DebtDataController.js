({ 
    // This method is being used to initialise table with headers and data
    init: function (component, event, helper) {
        component.set('v.isLoading', true);
        component.set('v.columns', helper.getColumnDefinitions());
        helper.getData(component);
    },  
    
    // This method is being used to get the selected rows on table
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
    
    // This method is being used to sort the table as per the column selected
    updateColumnSorting: function (component, event, helper) {
        component.set('v.isLoading', true);
        setTimeout($A.getCallback(function() {
            var fieldName = event.getParam('fieldName');
            var sortDirection = event.getParam('sortDirection');
            component.set("v.sortedBy", fieldName);
            component.set("v.sortedDirection", sortDirection);
            helper.sortData(component, fieldName, sortDirection);
            component.set('v.isLoading', false);
        }), 0);
    },
    
    // This method is being used to remove the selected row from the table
    removeDebt : function(component, event, helper) {
        var selectedRows = component.get('v.selectedRows');
        var totalRecords = component.get("v.data");
        
        for(let row in selectedRows) {
            totalRecords.splice(totalRecords.indexOf(selectedRows[row]), 1);
        }
        component.set("v.data", totalRecords);
        helper.getTotalAmount(component,totalRecords);
    },
    
    // This method is being used to open the modal box
    addDebt : function(component, event, helper) {
        component.set("v.showModal", true);
    },
    
    // This method is being used to handle the newData event and update the table
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