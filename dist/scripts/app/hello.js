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
                var url = "http://en.wikipedia.org/w/api.php?&callback=JSON_CALLBACK";
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
    var ClickController2 = (function () {
        function ClickController2(scope, http, rx) {
            this.scope = scope;
            this.http = http;
            this.rx = rx;
            this.init();
        }
        ClickController2.prototype.searchWikipedia = function (term) {
            var url = "http://en.wikipedia.org/w/api.php?&callback=JSON_CALLBACK";
            var req = {
                action: "opensearch",
                search: term,
                format: "json"
            };
            var promise = this.http.jsonp(url, req);
            return this.rx.Observable.fromPromise(promise).map(function (res) {
                return res.data[1];
            });
        };
        ClickController2.prototype.init = function () {
            var _this = this;
            this.scope.$createObservableFunction("click")
                .map(function () { return _this.scope.search; })
                .flatMapLatest(this.searchWikipedia)
                .subscribe(function (rs) {
                _this.scope.results = rs;
            });
        };
        ClickController2.$inject = [
            "$scope",
            "$http",
            "rx"
        ];
        return ClickController2;
    })();
    angular.module("app", ["rx"])
        .controller("ClickController", ClickController2)
        .controller("HelloController", HelloController);
})(app || (app = {}));
