var app;
(function (app) {
    var HelloController = (function () {
        function HelloController(scope, obs) {
            this.scope = scope;
            this.obs = obs;
            obs(scope, 'name').subscribe(function (change) {
                scope.newValue = change.newValue;
                scope.oldValue = change.oldValue;
            });
            this.initVars();
        }
        HelloController.prototype.initVars = function () {
            this.scope.name = "Hello, world!";
        };
        HelloController.$inject = ["$scope", "observeOnScope"];
        return HelloController;
    })();
    angular.module("app", ["rx"])
        .controller("HelloController", HelloController);
})(app || (app = {}));
