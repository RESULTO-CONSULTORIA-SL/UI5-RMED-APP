sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";

	return {
        init:function(){
            var oMockServer = new MockServer({
                rootUri:"/com/sap/MockData/"
            });
        
            MockServer.config(({
                autoRespond: true,
                autoRespondAfter: 500
            }));

            var sPath = sap.ui.require.toUrl("com/resulto/prototype/localService");
            
                oMockServer.simulate(sPath + "/recoletasMedMockMetadata.xml", {
                    sMockdataBaseUrl: sPath + "/mockdata",
                    bGenerateMissingMockData: true
                });
                
           

            oMockServer.start();

        }
    };
});
