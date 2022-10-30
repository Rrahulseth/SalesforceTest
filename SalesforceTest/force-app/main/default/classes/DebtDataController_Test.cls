/**
* @author      : Rahul Seth
* @date        : 30/10/2022
* @description : Test class for DebtDataController
*/
@isTest
public class DebtDataController_Test {

    //Method to test getData method
    @isTest
    public static void unitTest() {
        // Set mock callout class 
        DebtDataMock objDebtDataMock = new DebtDataMock();
        Test.setMock(HttpCalloutMock.class,objDebtDataMock);

        Test.startTest();
        	// This causes a fake response to be sent from DebtDataMock class
        	List<DebtDataController.DebtDataWrapper> response = DebtDataController.getData();
        Test.stopTest();
        System.assertEquals(response.size() > 0, true);
    }
}