sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"



], function (JSONModel, Controller, MessageToast) {
    "use strict";

    return Controller.extend("com.resulto.prototype.controller.Detail", {
        onInit: function () {
            var oModel = new sap.ui.model.odata.v2.ODataModel("/com/sap/MockData/");
            this.getView().setModel(oModel);
            var oOwnerComponent = this.getOwnerComponent();
            this.oModel= oOwnerComponent.getModel();
            this.oRouter= oOwnerComponent.getRouter();

            this.oRouter.getRoute("Master").attachPatternMatched(this._onObjectMatched, this);
            this.oRouter.getRoute("Detail").attachPatternMatched(this._onObjectMatched, this);

            
        },

        _onObjectMatched: function (oEvent) {            
            this._EventID = oEvent.getParameter("arguments")?.EventID || this._EventID || '0';
        
            // Obtener los datos del modelo
            var oModel = this.getView().getModel("detail");
            var oData = oModel.getProperty("/d/results");
        
        
            // Acceder al índice basado en EventID
            var selectedData = oData.find(event => event.EventID === this._EventID);
            
            

            if (selectedData) {

                var index= oData.indexOf(selectedData);

                if(index !=-1){
                this.getView().bindElement({
                    path: "/d/results/" + index,
                    model: "detail"
                })
            } else {
                console.log("No se encontraron datos para el EventID: " + this._EventID);
            }
        }},
        handleClose: function(oEvent){
            var sNextLayout= this.oModel.getProperty("/actionButtonsInfo/midColumn/closeColumn");
            this.oRouter.navTo("Master", {layout: sNextLayout});

        },

        onSaveChanges: function () {
            MessageToast.show("Cambios guardados con éxito.");
        },

        onChangeCart: function () {
            MessageToast.show("Asignación de carro cambiada.");
        },

        onAddNote: function () {
            MessageToast.show("Nota añadida.");
        },
        formatDate: function(value) {
            if (value) {
                    const milliseconds = parseInt(value.match(/\d+/)[0]); // Extrae milisegundos
                    const date = new Date(milliseconds); // Convierte a fecha
                    return date.toLocaleString(); // Formato legible según configuración regional
                }
            
            return value;
        }
       
    });
});
