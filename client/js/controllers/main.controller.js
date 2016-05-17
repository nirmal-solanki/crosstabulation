/**
 * Created by Nirmal Solanki on 5/15/2016.
 */
(function () {
    'use strict';

    angular
        .module('crosstabulation')
        .controller('MainController', MainController);

    /** @ngInject */
    function MainController(toastr, FilesService) {
        var vm = this;
        vm.uploadFile = '';
        vm.filesArr = vm.csvArr = [];
        vm.crossTabOptions = ['Gender', 'Handedness']; // Set Cross Tabulation Options here
        vm.ctObj = {
            horizontally: {name: 'Handedness', cols: []},
            vertically: {name: 'Gender', cols: []},
            data: {}
        };
        vm.isFilesLoad =  vm.isReportDisplay = false;
        vm.isReadCSV = true;

        vm.fnScrollTo = function (eID) {
            angular.element('html, body').animate({scrollTop: $('#' + eID).offset().top - 5}, 1000);
        };

        vm.fnSaveFile = function (data) {
            if (angular.isUndefined(data)) {
                toastr.error('Please select csv file.');
            } else {
                var fileType = ['application/vnd.ms-excel'];
                if (fileType.indexOf(data.type) === -1) {
                    toastr.error('Only csv file');
                } else {
                    FilesService.fnSaveFile(data)
                        .then(function (res) {
                            vm.fnGetFiles();
                            toastr.success(res);
                        });
                }
            }
        };

        vm.fnGetFiles = function () {
            vm.isFilesLoad = false;
            FilesService.fnGetFiles()
                .then(function (res) {
                    vm.isFilesLoad = true;
                    vm.filesArr = res.data;
                    if(vm.filesArr.length > 0){
                        vm.fnGetCSV(vm.filesArr[0]);
                    }
                });
        };

        vm.fnRemoveFile = function (fileName) {
            if(confirm("Are you sure you want to delete this file?")) {
                FilesService.fnRemoveFile(fileName)
                    .then(function () {
                        vm.fnGetFiles();
                        toastr.success('successfully deleted.');
                    });
            }
        };

        vm.fnGetCSV = function (fileName) {
            vm.isReadCSV = false;
            FilesService.fnGetCSV(fileName)
                .then(function (res) {
                    vm.isReadCSV = true;
                    vm.csvArr = res.data;
                });
        };

        /*----- START : Select CT before result-----*/
        vm.fnChangeCT = function(){
            vm.ctObj.horizontally.cols = [];
            vm.ctObj.vertically.cols = [];
            vm.ctObj.data = {};
            vm.isReportDisplay = false;
        };
        /*----- END : Select CT before result-----*/

        /*----- START : CT Report -----*/
        vm.fnCreateCTReportCols = function (data) {
            vm.isReportDisplay = true;
            angular.forEach(data, function (obj) {
                angular.forEach(obj, function (value, key) {
                    if (key === vm.ctObj.horizontally.name) {
                        var hIndex = vm.ctObj.horizontally.cols.indexOf(value);
                        if (hIndex === -1) {
                            vm.ctObj.horizontally.cols.push(value);
                        }
                    }
                    if (key === vm.ctObj.vertically.name) {
                        var vIndex = vm.ctObj.vertically.cols.indexOf(value);
                        if (vIndex === -1) {
                            vm.ctObj.vertically.cols.push(value);
                        }
                    }
                });
            });
        };

        vm.fnReturnColWiseTotal = function (data, vCol, hCol) {
            var count = 0, str = null;
            angular.forEach(data, function (obj) {
                if (obj[vm.ctObj.vertically.name] === vCol && obj[vm.ctObj.horizontally.name] === hCol) {
                    str = vCol + '_' + hCol;
                    count++;
                }
            });
            vm.ctObj.data[str] = count;
            return count;
        };

        vm.fnReturnVerticalTotal = function (vCol) {
                var count = 0;
                angular.forEach(vm.ctObj.horizontally.cols, function (val) {
                    var str = vCol + '_' + val;
                    count = count + vm.ctObj.data[str];
                });
                return count;

        };

        vm.fnReturnHorizontalTotal = function (hCol) {
            var count = 0;
            angular.forEach(vm.ctObj.vertically.cols, function (val) {
                var str = val + '_' + hCol;
                count = count + vm.ctObj.data[str];
            });
            return count;

        };

        vm.fnReturnTotal = function () {
            var count = 0;
            angular.forEach(vm.ctObj.data, function (val) {
                count = count + val;
            });
            return count;

        };

        /*----- END : CT Report -----*/

        vm.fnInitMain = function () {
            vm.fnGetFiles();
        };
    }
})();
