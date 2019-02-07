export function routes($stateProvider, $urlServiceProvider, $uiRouterProvider): void {
    $stateProvider
        .state("root", {
            url: "",
            abstract: true,
            views: {
                content: {
                    templateUrl: 'appTemplates/layouts/index.html',
                    controller: 'AppController',
                    controllerAs: 'ac'
                }
            }
        });
}

routes.$inject = ['$stateProvider', '$urlServiceProvider', '$uiRouterProvider'];