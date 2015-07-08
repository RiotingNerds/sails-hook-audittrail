'use strict';


module.export = function(updatedRecord, cb, originalCB) {
	console.log("testing");
	console.log(updatedRecord);

	if(!_.isUndefined(originalCB))
		originalCB(updatedRecord,cb);
	else {
		cb();
	}
}