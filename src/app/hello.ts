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

    angular.module("app", ["rx"])
        .controller("HelloController", HelloController);
}
