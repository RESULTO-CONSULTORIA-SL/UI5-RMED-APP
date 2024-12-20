sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Select",
    "sap/ui/core/Item",
    "sap/m/Button",
    "sap/m/MessageBox"
], function (Controller,
	MessageToast,
	Dialog,
	Select,
	Item,
	Button,
	MessageBox) {
    "use strict";

    return Controller.extend("com.resulto.prototype.controller.Cart", {
        onInit: function(){
            var oModel = new sap.ui.model.odata.v2.ODataModel("/com/sap/MockData/");
            this.getView().setModel(oModel);

            this._router = sap.ui.core.UIComponent.getRouterFor(this);
        },
        onDelete: function () {
            var oView = this.getView();
            var oTable = oView.byId("idTable");
            var aSelectedItems = oTable.getSelectedItems();
        
            if (aSelectedItems.length === 0) {
                MessageBox.warning("Seleccione al menos un carro para eliminar.");
                return;
            }
        
            const oModel = this.getView().getModel();
            const aItemsToDelete = [];
        
            aSelectedItems.forEach(function (oItem) {
                const oContext = oItem.getBindingContext();
        
                if (oContext) {
                    const iAssignedEvents = oContext.getProperty("AssignedEvents");
                    const sPath = oContext.getPath(); 
                    if (iAssignedEvents === 0) {
                        // Agregar solo elementos sin eventos asignados
                        aItemsToDelete.push(sPath);
                    }
                }
            });
        
            if (aItemsToDelete.length === 0) {
                MessageToast.show("No hay elementos sin eventos asignados para eliminar.");
                return;
            }
        
            MessageBox.confirm(`¿Está seguro de eliminar los carros seleccionados sin eventos asignados?`, {
                title: "Confirmación de eliminación",
                actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
                onClose: function (oAction) {
                    if (oAction === MessageBox.Action.OK) {
                        aItemsToDelete.forEach(function (sPath) {
                            oModel.remove(sPath); // Eliminar usando el path
                        });
                        MessageToast.show("Elementos eliminados con éxito.");
                    }
                }
            });
        },
        
        onCreateCart: function(){
            this.fDialog ??= this.loadFragment({
                name: "com.resulto.prototype.view.fragments.DialogForm"
            });

            this.fDialog.then((oDialog)=> oDialog.open());

        },
        onNavMaster: function(oEvent){
            this._router.navTo("Master");
        },
       onCloseDialog: function () {
            // Busca el fragmento del diálogo y lo cierra
            if (this.fDialog) {
                this.fDialog.then((oDialog) => oDialog.close());
            }
        },
        onAddCart: function(){
           var oODataModel= this.getView().getModel();
           var oView= this.getView();
           var sName= oView.byId("Name").getValue();
           var sDescription = oView.byId("Description").getValue();
           var dValidityStart= oView.byId("ValidityStart").getDateValue();
           var dValidityEnd= oView.byId("ValidityEnd").getDateValue();
           var sStatus= oView.byId("Status").getSelectedKey();

            //Validamos los campos para que se rellenen todos
           if(!sName || !sDescription || !dValidityStart || !dValidityEnd || !sStatus){
            MessageToast.show("Por favor, todos los campos han de ser completados.");
            return;
           }
           var sValidityStart = dValidityStart ? `/Date(${dValidityStart.getTime()})/` : null;
           var sValidityEnd = dValidityEnd ? `/Date(${dValidityEnd.getTime()})/` : null;

           if (!sValidityStart || !sValidityEnd) {
                MessageToast.show("Error al procesar las fechas. Por favor, verifica los valores ingresados.");
                return;
           }

           var oNewCart= {
            CartID: null,
            Name: sName,
            Description: sDescription,
            ValidityStart: sValidityStart,
            ValidityEnd: sValidityEnd,
            Status: sStatus,
            AssignedEvents: 0,
           };

           oODataModel.create("/CartSet", oNewCart,{
            success: function(){
                MessageToast.show("Carro añadido con éxito.");
            },
            error: function(){
                MessageToast.show("Error al agregar el carro. Intenteló de nuevo.");
            }
           });
           this._clearDialogFields();
        },
        _clearDialogFields: function(){
            var oView= this.getView();
            oView.byId("Name").setValue("");
            oView.byId("Description").setValue("");
            oView.byId("ValidityStart").setDateValue(null);
            oView.byId("ValidityEnd").setDateValue(null);
            oView.byId("Status").setSelectedKey("");
        },
        formatDate: function (value) {
            if (value) {
                const timestamp = parseInt(value.match(/\d+/)[0], 10); // Extrae el timestamp
                const date = new Date(timestamp); // Convierte a objeto Date
                return date.toLocaleDateString() + " " + date.toLocaleTimeString(); // Devuelve fecha legible
            }
            return "";
        },
        onActivate: function(){
            var oTable= this.byId("smartTableCarts").getTable();
            var aSelectedItems= oTable.getSelectedItems();

            if (aSelectedItems.length === 0) {
                MessageToast.show("No se ha seleccionado ningún Evento.");
                return;
            }

            var oDialog= new Dialog({
                title: "Seleccionar Estado",
                content: new Select({
                    items:[
                        new Item({ text:"Activo", key: "Activo"}),
                        new Item({ text: "Inactivo", key: "Inactivo"}),
                    ]
                }),
                beginButton: new Button({
                    text:"Aplicar",
                    press: function(){
                        var oSelect= oDialog.getContent()[0];
                        var sSelectedState= oSelect.getSelectedKey();

                        aSelectedItems.forEach(function(oItem){
                            var oContext= oItem.getBindingContext();
                            var oEventData= oContext.getObject();

                            oEventData.State= sSelectedState;
                            var sPath= oContext.getPath();
                            oContext.getModel().setProperty(sPath+"/Status", sSelectedState);

                            oTable.getBinding("items").refresh();

                        });
                        oDialog.close();
                        MessageToast.show("Estado de los carros seleccionados actualizado.");
                    }
                }),
                endButton: new Button({
                    text: "Cancelar",
                    press: function() {
                        oDialog.close();
                    }
                })

            });
            oDialog.open();
        }
       
       
    });
});
