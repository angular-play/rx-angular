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
    var ClickConroller = (function () {
        function ClickConroller(scope, http, rx) {
            this.scope = scope;
            this.http = http;
            this.rx = rx;
            function searchWikipedia(term) {
                var url = "http://en.wikipedia.org/w/api.php&callback=JSON_CALLBACK";
                var req = {
                    action: "opensearch",
                    search: term,
                    format: "json"
                };
                var promise = http.jsonp(url, req);
                return rx.Observable.fromPromise(promise).map(function (res) {
                    return res.data[1];
                });
            }
            scope.$createObservableFunction("click")
                .map(function () { return scope.search; })
                .flatMapLatest(searchWikipedia)
                .subscribe(function (rs) {
                scope.results = rs;
            });
        }
        ClickConroller.$inject = [
            "$scope",
            "$http",
            "rx"
        ];
        return ClickConroller;
    })();
    angular.module("app", ["rx"])
        .controller("ClickController", ClickConroller)
        .controller("HelloController", HelloController);
})(app || (app = {}));
