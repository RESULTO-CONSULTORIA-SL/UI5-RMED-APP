sap.ui.define([
    "sap/ui/core/mvc/Controller"
], function (Controller) {
    "use strict";

    return Controller.extend("com.resulto.prototype.controller.App", {
        onInit: function () {
            this.oOwnerComponent= this.getOwnerComponent();
            this.oRouter = this.oOwnerComponent.getRouter();
            this.oRouter.attachRouteMatched(this.onRouteMatched, this);

        },
        onRouteMatched: function(oEvent){
            var sRouteName = oEvent.getParameter("name"),
                oArguments = oEvent.getParameter("arguments");

                this.currentRouteName= sRouteName;
                this.currentState = oArguments.EventID;
            
        },
        

        
    });
});
