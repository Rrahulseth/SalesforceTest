/**
* @author      : Rahul Seth
* @date        : 30/10/2022
* @description : DebtDataController class used for getting response from the git and displaying that data after parsing to the User Interface
*/

public class DebtDataController {
	
	//Initializing variables for making web callout    
    public final static String endPoint = 'https://raw.githubusercontent.com/StrategicFS/Recruitment/master/data.json';
    public final static String methodType = 'GET';
    public final static String contentType = 'application/json;charset=UTF-8';
    
    /*		
    * @methodName  : getData
    * @description : Method to get Data from callount and send to the aura Component    
    * @param 	   : void
    * @return 	   : List<DebtDataWrapper>
    */
    @AuraEnabled
    public static List<DebtDataWrapper> getData () {
        List<DebtDataWrapper> listDebtDataWrapper = new List<DebtDataWrapper>();
        try {
            //Making Callout
            Http http = new Http();
            HttpRequest request = new HttpRequest();
            request.setEndpoint(endPoint);
            request.setMethod(methodType);
            request.setHeader('Content-Type', contentType);
            
            //Receving response from the callout
            HttpResponse response = http.send(request);
            String responseBody = response.getBody();
            //Deserializing response into the Wrapper Class List
            listDebtDataWrapper = (List<DebtDataWrapper>)JSON.deserialize(responseBody, List<DebtDataWrapper>.class);
            if(!listDebtDataWrapper.isEmpty()) {
                for(DebtDataWrapper objDebtDataWrapper : listDebtDataWrapper) {
                    if(objDebtDataWrapper.minPaymentPercentage != 0) {
                    	objDebtDataWrapper.minPaymentPercentage = objDebtDataWrapper.minPaymentPercentage/100;
                    }
                }
            }
            return listDebtDataWrapper;
        }catch(Exception ex) {
            return null;
        }
        
    }
    
    /*		
    * @description : Wrapper class to hold the data received from the callout   
    */
    public class DebtDataWrapper {
        @AuraEnabled public Integer id;
        @AuraEnabled public String creditorName;
        @AuraEnabled public String firstName;
        @AuraEnabled public String lastName;
        @AuraEnabled public Decimal minPaymentPercentage;
        @AuraEnabled public Decimal balance;
    }
}