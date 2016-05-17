/**
 * Created by Nirmal Solanki on 5/15/2016.
 */
(function () {
    'use strict';

    angular
        .module('crosstabulation')
        .config(config);

    /** @ngInject */
    function config($logProvider, $locationProvider, toastrConfig) {
        // Enable log
        $logProvider.debugEnabled(true);

        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });

        // Set options third-party lib
        toastrConfig.closeButton = true;
        toastrConfig.allowHtml = true;
        toastrConfig.timeOut = 3000;
        toastrConfig.positionClass = 'toast-top-right';
        toastrConfig.preventDuplicates = true;
        toastrConfig.progressBar = true;
    }

})();
