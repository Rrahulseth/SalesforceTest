import { LightningElement, wire, api, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent'; 
import getData from '@salesforce/apex/DebtDataController.getData';

export default class DebtData extends LightningElement {
    
    @track data = [] ;
    sortedDirection = 'asc';
    sortedBy;
    selectedRows = [] ;
    selectedRowsCount = 0 ;
    disableRemove = true ;
    showModal = false;
    totalAmount = 0;
    isLoading = false;
    columns = [
        { label: 'Creditor', fieldName: 'creditorName', type: 'text', sortable: true },
        { label: 'First Name', fieldName: 'firstName', type: 'text', sortable: true },
        { label: 'Last Name', fieldName: 'lastName', type: 'text', sortable: true },
        { label: 'Min Pay%', fieldName: 'minPaymentPercentage', type: 'percent', typeAttributes: { step: '0.01', minimumFractionDigits: '2', maximumFractionDigits: '2' }, sortable: true },
        { label: 'Balance', fieldName: 'balance', type: 'currency', sortable: true }
    ];
    @track debtObject ;
    
    
    connectedCallback() {
        this.isLoading = true;
        getData({})
        .then(result=>{
            this.data = result; 
            this.getTotalAmount(result);
            this.isLoading = false;
        })
        .catch(error=>{
            this.isLoading = false;
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error occurred while Fetching record!',
                    message: error.body.message,
                    variant: 'error',
                    mode:'dismissable'
                }),
            );
        });
    }

    // Used to sort the selected column
    sortBy(field, reverse, primer) {
        const key = primer
            ? function (x) {
                  return primer(x[field]);
              }
            : function (x) {
                  return x[field];
              };

        return function (a, b) {
            a = key(a);
            b = key(b);
            return reverse * ((a > b) - (b > a));
        };
    }

    // This method is being used to sort the table as per the column selected
    updateColumnSorting(event) {
        const { fieldName: sortedBy, sortDirection } = event.detail;
        const cloneData = [...this.data];

        cloneData.sort(this.sortBy(sortedBy, sortDirection === 'asc' ? 1 : -1));
        this.data = cloneData;
        this.sortDirection = sortDirection;
        this.sortedBy = sortedBy;
    }
    
    // This method is being used to get the selected rows on table
    handleRowAction(event) {
        this.selectedRows = event.detail.selectedRows;
        this.selectedRowsCount = this.selectedRows.length;
        if(this.selectedRows.length > 0) {
            this.disableRemove = false;
        }else {
            this.disableRemove = true;
        }
    }

    // This method is being used to open the modal box and initialize values in it
    addDebt() {
        this.debtObject = {
            "id": "",
            "creditorName": "",
            "firstName": "",
            "lastName": "",
            "minPaymentPercentage": 0.00,
            "balance": 0.00
        };
        this.showModal = true;
    }
        
    // This method is being used to remove the selected row from the table and calculate Total amount
    removeDebt() {
        this.isLoading = true;
        var selectedRows = this.selectedRows;
        for(let row in selectedRows) {
            this.data = this.data.filter(account => selectedRows[row].id !== account.id);
        }
        this.getTotalAmount(this.data);
    }
    
    // This method is being used to sum all the balance and calculate Total amount in table
    getTotalAmount(data) {
        var totalAmount = 0;
        for (let key in data) {
            totalAmount += parseFloat(data[key].balance);
        }
        this.totalAmount = totalAmount.toFixed(2);
        this.isLoading = false;
    }

    // This method is being used for assigning values to fields from UI and later adding in table
    handleDataChange(event) {
        this.debtObject[event.target.name] = event.target.value;
    }

    // This method is being used for accepting data from fields on the screen and send to parent component using event
    submitDetails() {
        if(this.debtObject.creditorName == "" && this.debtObject.firstName == "" && 
            this.debtObject.lastName == "" && this.debtObject.minPaymentPercentage == 0.00 && this.debtObject.balance == 0.00) {
            this.dispatchEvent(
                new ShowToastEvent({
                    message: 'Please fill the values in fields',
                    variant: 'error',
                    mode:'dismissible'
                }),
            );
        }else {
            this.debtObject.id = this.data[this.data.length-1].id + 1;
            this.debtObject.minPaymentPercentage = this.debtObject.minPaymentPercentage/100;
            this.data = [...this.data, this.debtObject];
            this.getTotalAmount(this.data);
            this.showModal = false;
        }
    }

    // This method is being used to close the model box for Adding debt
    closeModel() {
        this.showModal = !this.showModal;
    }

}