function BankError(message) {
	this.message = message;
	this.stack = new Error().stack;
}

BankError.prototype = Error.prototype;

function Statement(balance, lastTransaction) {
	this.__defineGetter__("balance", function() { return balance; });
	this.__defineGetter__("lastTransaction", function() { return lastTransaction; });
}

function Account(balance) {
	var initialBalance = balance;

	this.__defineGetter__("initialBalance", function() {
		return initialBalance;
	});

	this.__defineGetter__("balance", function() {
		return balance;
	});

	this.withdraw = function(amount) {
		if (isNaN(amount) || amount <= 0) {
			throw new BankError("Withdrawal amount must be a positive number");
		}
		if (balance - amount < 0) {
			throw new BankError("You don't have enough money!");
		}

		balance -= amount;
		return new Statement(balance, "withdrew $" + amount);
	};

	this.deposit = function(amount) {
		if (isNaN(amount) || amount <= 0) {
			throw new BankError("Deposit amount must be a positive number");
		}

		balance += amount;
		return new Statement(balance, "deposited $" + amount);
	};
}

module.exports = {
	BankError: BankError,
	Statement: Statement,
	Account: Account
};