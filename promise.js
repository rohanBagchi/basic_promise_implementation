var PENDING = 1;
var RESOLVED = 2;
var REJECTED = 3;

function Promise(executorFunction) {
    this.status = PENDING;
    this.success_callbacks = [];
    this.error_callbacks = [];

    executorFunction && executorFunction.call(null, this.resolve.bind(this), this.reject.bind(this));
}

Promise.prototype.then = function (successCallback) {
    this.success_callbacks.push(successCallback);
    return this;
};
Promise.prototype.catch = function (errorCallback) {
    this.error_callbacks.push(errorCallback);
    return this;
};
Promise.prototype.resolve = function (value) {
    if (this.status !== PENDING) return;

    try {
        this.success_callbacks.forEach(cb => cb.call(null, value));
        this.success_callbacks = [];
        this.status = RESOLVED;
    } catch (e) {
        this.reject(e);
    }
};
Promise.prototype.reject = function (err) {
    if (this.status !== PENDING) return;

    this.error_callbacks.forEach(cb => cb.call(null, err));
    this.error_callbacks = [];
    this.status = REJECTED;
};

(function main() {
    getLargeNumber()
        .then(function (number) {
            console.log('We got ' + number);
        });
})();

function getLargeNumber() {
    return new Promise(function (resolve, reject) {
        setTimeout(() => {
            var value = Math.floor(Math.random() * 20000);
            resolve(value);
        }, 2000);
    });
}
