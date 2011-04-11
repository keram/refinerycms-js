// create private environment
(function() {

	// create shorthand
	if (typeof REFINERYCMS !== 'undefined') {
		var cms = REFINERYCMS;
	}

	var refinerycmsDialogTestCase = new YUITest.TestCase({

		//name of the test case - if not provided, one is auto-generated
		name : "REFINERYCMS Dialog Tests",

		//---------------------------------------------------------------------
		// setUp and tearDown methods - optional
		//---------------------------------------------------------------------

		/*
         * Sets up data that is needed by each test.
         */
		setUp : function () {
			this.data = {
			};
		},

		/*
         * Cleans up everything that was created by setUp().
         */
		tearDown : function () {
			delete this.data;
		},

		//---------------------------------------------------------------------
		// Test methods - names must begin with "test"
		//---------------------------------------------------------------------

		testInitialization : function () {
			var Assert = YUITest.Assert;

			Assert.isObject(cms.Dialog);
			Assert.areEqual(cms.Dialog.name, 'dialog');
		},

		testYell : function () {
			var Assert = YUITest.Assert;

			Assert.isFunction(cms.Dialog.yell);
			
		}
	});

	suite.add(refinerycmsDialogTestCase);


})();