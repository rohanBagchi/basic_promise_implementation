var PENDING = 1;
var RESOLVED = 2;
var REJECTED = 3;

function Promise(executorFunction) {
    var status = PENDING;
    var success_callbacks = [];
    var error_callbacks = [];

    this.then = function (successCallback) {
        success_callbacks.push(successCallback);
        return this;
    };

    this.catch = function (errorCallback) {
        error_callbacks.push(errorCallback);
        return this;
    };

    var resolve = function (value) {
        if (status !== PENDING) return;

        try {
            success_callbacks.forEach(cb => cb.call(null, value));
            success_callbacks = [];
            status = RESOLVED;
        } catch (e) {
            this.reject(e);
        }
    };

    var reject = function (err) {
        if (status !== PENDING) return;

        error_callbacks.forEach(cb => cb.call(null, err));
        error_callbacks = [];
        status = REJECTED;
    };

    executorFunction && executorFunction.call(null, resolve, reject);
}

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
