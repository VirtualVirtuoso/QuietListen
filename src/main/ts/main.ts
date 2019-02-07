import angular = require('angular');
import { routes } from './routes';

export let app = angular.module('app', [
    'ngRoute',
    'ui.router',
    'ng',
    'ngDialog'
]);

app.config(routes);