/**
 * Created by Nirmal Solanki on 5/15/2016.
 */
(function() {
    'use strict';

    angular
        .module('crosstabulation')
        .directive('pageHeight', fnPageHeight);

    /** @ngInject */
    function fnPageHeight($window) {
        return{
            link:function(scope, element){
                var styleProp = "min-height";
                element.css(styleProp, angular.element($window).height() - 140);
                angular.element($window).on('resize',function(){
                    element.css(styleProp, angular.element($window).height()  - 140);
                });
            }
        };
    }
})();