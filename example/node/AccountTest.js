var bank = require("./Account.js");
if (typeof(global.Jarvis) === "undefined") {
	//if --no-global option is given
	console.log("loading local version of jarvis");
	Jarvis = require("jarvis");
	Assert = Jarvis.Framework.Assert;
	Is = Jarvis.Framework.Is;
}

module.exports = (function() {
	var account;

	return {
		setup: function() {
			account = new bank.Account(100);
		},

		test: function Account_tests() {
			return [
				function Cannot_withdraw_negative_amount() {
					Assert.willThrow(new bank.BankError("Withdrawal amount must be a positive number"));
					account.withdraw(-10);
				},

				function Cannot_deposit_negative_amount() {
					Assert.willThrow(new bank.BankError("Deposit amount must be a positive number"));
					account.deposit(-10);
				},

				function Should_deposit_some_money() {
					var statement = account.deposit(10);
					Assert.that(statement.balance, Is.equalTo(110));
					Assert.that(statement.lastTransaction, Is.equalTo("deposited $10"));
				},

				function Should_withdraw_some_money() {
					var statement = account.withdraw(10);
					Assert.that(statement.balance, Is.equalTo(90));
					Assert.that(statement.lastTransaction, Is.equalTo("withdrew $10"));
				}
			];
		}
	};
}());