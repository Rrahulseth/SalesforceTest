/**
* @author      : Rahul Seth
* @date        : 30/10/2022
* @description : Mock Test class for DebtDataController and DebtDataController_Test
*/
@isTest
global class DebtDataMock  implements HttpCalloutMock {
    
    global HTTPResponse respond(HTTPRequest request) {
        // Creating a fake response
        HttpResponse response = new HttpResponse();
        response.setHeader('Content-Type', 'application/json');
        response.setBody('[{"id":1,"creditorName":"CBNA","firstName":"Suman","lastName":"Tester79","minPaymentPercentage":2.00,"balance":1363.00},{"id":2,"creditorName":"AMEX","firstName":"Suman","lastName":"Tester79","minPaymentPercentage":2.00,"balance":2763.00}]');
        response.setStatusCode(200);
        return response; 
    }
}