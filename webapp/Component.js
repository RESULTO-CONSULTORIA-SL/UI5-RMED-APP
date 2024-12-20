sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel"
], function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("com.resulto.prototype.Component", {
        metadata: {
            manifest: "json"
        },

        init: function () {
            // Llama a la función base del componente
            UIComponent.prototype.init.apply(this, arguments);

            // Configuración del modelo
            var oModel = new JSONModel("/localService/mockdata/MedicationEventSet.json");
            this.setModel(oModel);
            this.getRouter().initialize();
            this.setModel(oModel, 'detail');
        },


    });
});
