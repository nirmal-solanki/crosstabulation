/**
 * Created by Nirmal Solanki on 5/15/2016.
 */
(function () {
    'use strict';

    angular
        .module('crosstabulation')
        .directive('fileModel', fnFileModel);

    /** @ngInject */
    function fnFileModel($parse) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                var model = $parse(attrs.fileModel);
                var modelSetter = model.assign;

                element.bind('change', function(){
                    scope.$apply(function(){
                        modelSetter(scope, element[0].files[0]);
                    });
                });
            }
        };
    }
})();
