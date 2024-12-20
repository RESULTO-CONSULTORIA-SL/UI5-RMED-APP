sap.ui.define([
    "sap/ui/core/mvc/Controller","sap/m/MessageToast","sap/m/Dialog","sap/m/Select","sap/ui/core/Item","sap/m/Button"
], function (Controller,
	MessageToast,
	Dialog,
	Select,
	Item,
	Button) {
    "use strict";

    return Controller.extend("com.resulto.prototype.controller.Master", {
        onInit: function () {
            var oModel = new sap.ui.model.odata.v2.ODataModel("/com/sap/MockData/");
            this.getView().setModel(oModel);

            // Initialize the router
             this._router = sap.ui.core.UIComponent.getRouterFor(this);

            
        }, 
        onDelete: function(oEvent) {
            var oView = this.getView();
            var oTable = oView.byId("idTable");
            var aSelectedItems = oTable.getSelectedItems();
        
            if (aSelectedItems.length === 0) {
                sap.m.MessageBox.warning("Por favor, seleccione al menos un elemento para eliminar.");
                return;
            }
        
            // Mostrar un cuadro de diálogo de confirmación
            sap.m.MessageBox.confirm("¿Está seguro de que desea eliminar los elementos seleccionados?", {
                title: "Confirmación de borrado",
                actions: [sap.m.MessageBox.Action.OK, sap.m.MessageBox.Action.CANCEL],
                onClose: function(oAction) {
                    if (oAction === sap.m.MessageBox.Action.OK) {
                        // Proceder con el borrado
                        var oModel = oView.byId("smartTable_ResponsiveTable").getModel();
                        oModel.setUseBatch(false);
        
                        aSelectedItems.forEach(function(oItem) {
                            var sId = oItem.getBindingContext().getProperty("EventID");
                            oModel.remove("/MedicationEventSet('" + encodeURIComponent(sId) + "')");
                        });
        
                        MessageToast.show("Elementos eliminados con éxito.");
                    }
                }
            });
        },
        onChangeState: function() {
            var oTable = this.byId("smartTable_ResponsiveTable").getTable();
            var aSelectedItems = oTable.getSelectedItems();
        
            if (aSelectedItems.length === 0) {
                MessageToast.show("No se ha seleccionado ningún evento.");
                return;
            }
        
            // Abre el diálogo para seleccionar el estado
            var oDialog = new Dialog({
                title: "Seleccionar Estado",
                content: new Select({
                    items: [
                        new Item({ text: "Pendiente (por preparar)", key: "Pendiente" }),
                        new Item({ text: "En preparación", key: "EnPreparacion" }),
                        new Item({ text: "Listo", key: "Listo" }),
                        new Item({ text: "Dispensado", key: "Dispensado" }),
                    ]
                }),
                beginButton: new Button({
                    text: "Aplicar",
                    press: function() {
                        var oSelect = oDialog.getContent()[0];
                        var sSelectedState = oSelect.getSelectedKey();
        
                        // Recorre los eventos seleccionados y actualiza su estado
                        aSelectedItems.forEach(function(oItem) {
                            var oContext = oItem.getBindingContext();
                            var oEventData = oContext.getObject();
        
                            // Actualiza el estado en el modelo local
                            oEventData.State = sSelectedState;
                            var sPath = oContext.getPath();
                            oContext.getModel().setProperty(sPath + "/Status", sSelectedState);
        
                            // Refresca la tabla para reflejar los cambios
                            oTable.getBinding("items").refresh();
                        });
        
                        oDialog.close();
                        MessageToast.show("Estado de los eventos seleccionados actualizado.");
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
        },
        
        onAssignCart:function(){
            var oTable = this.byId("smartTable_ResponsiveTable").getTable();
            var aSelectedItems = oTable.getSelectedItems();
        
            if (aSelectedItems.length === 0) {
                MessageToast.show("No se ha seleccionado ningún Evento.");
                return;
            }
        
            // Abre el diálogo para seleccionar el carro
            var oDialog = new Dialog({
                title: "Asignar carro",
                content: new Select({
                    items: [
                        new Item({ text: "Carro A", key: "CarroA" }),
                        new Item({ text: "Carro B", key: "CarroB" }),
                        new Item({ text: "Carro C", key: "CarroC" }),
                    ]
                }),
                beginButton: new Button({
                    text: "Aplicar",
                    press: function() {
                        var oSelect = oDialog.getContent()[0];
                        var sSelectedState = oSelect.getSelectedKey();
        
                        // Recorre los eventos seleccionados y actualiza su estado
                        aSelectedItems.forEach(function(oItem) {
                            var oContext = oItem.getBindingContext();
                            var oEventData = oContext.getObject();
        
                            // Actualiza el estado en el modelo local
                            oEventData.State = sSelectedState;
        
                            // Si es un modelo OData, puedes usar el método update
                            var sPath = oContext.getPath();
                            oContext.getModel().setProperty(sPath + "/AssignedCart", sSelectedState);
        
                            // Refresca la tabla para reflejar los cambios
                            oTable.getBinding("items").refresh();
                        });
        
                        oDialog.close();
                        MessageToast.show("Los Carros se han actualizado.");
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
        }, 
		onListItemPress: function(oEvent){
           // Recuperar el elemento seleccionado de la tabla
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext();
            var sEventID = oContext.getProperty("EventID"); 
            // Navega a la Detail.view con EventID
            this._router.navTo("Detail", {
                EventID: sEventID
            });
        }, 
        onNavCart: function(oEvent){
            this._router.navTo("Cart");
        }
        
    });
});
