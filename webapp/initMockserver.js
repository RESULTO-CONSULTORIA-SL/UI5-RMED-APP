sap.ui.define([
	"com/resulto/prototype/localService/mockserver"
], function(mockserver) {
	"use strict";

	mockserver.init();

    sap.ui.require(["sap/ui/core/ComponentSupport"]);
});