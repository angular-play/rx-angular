module app {

    interface IHelloScope extends ng.IScope {
        newValue: string;
        oldValue: string;
        name: string;
    }

    class HelloController {
        static $inject = ["$scope", "observeOnScope"];
        constructor(private scope: IHelloScope, private obs){
            obs(scope, 'name').subscribe(function(change) {
              scope.newValue = change.newValue;
              scope.oldValue = change.oldValue;
          });

          this.initVars();
        }

        initVars(): void {
            this.scope.name = "Hello, world!";
        }
    }

    interface  IClickScope extends ng.IScope {
        search: string;
        results: any[];
        $createObservableFunction: Function;
    }

    interface RxObj {
        Observable: Rx.ObservableStatic;
    }

    class ClickConroller {

        static $inject = [
            "$scope",
            "$http",
            "rx"
        ];
        constructor(
            private scope: IClickScope,
            private http: ng.IHttpService,
            private rx: RxObj) {

                function searchWikipedia(term: string) {
                    var url = "http://en.wikipedia.org/w/api.php&callback=JSON_CALLBACK";
                    var req = {
                        action: "opensearch",
                        search: term,
                        format: "json"
                    };
                    var promise = http.jsonp(url, req);
                    return rx.Observable.fromPromise(promise).map( res => {
                         return res.data[1];
                     });
                }

                scope.$createObservableFunction("click")
                    .map(() => scope.search)
                    .flatMapLatest(searchWikipedia)
                    .subscribe( (rs) => {
                        scope.results = rs;
                    });
        }
    }

    angular.module("app", ["rx"])
        .controller("ClickController", ClickConroller)
        .controller("HelloController", HelloController);
}
