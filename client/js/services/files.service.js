/**
 * Created by Nirmal Solanki on 5/15/2016.
 */
(function () {
    'use strict';

    angular
        .module('crosstabulation')
        .factory('FilesService', fnFiles);

    /** @ngInject */
    function fnFiles($q, $http) {

        this.fnSaveFile = function (data) {
            var defer = $q.defer();
            var fd = new FormData();
            fd.append('file', data);
            $http.post('/api/files/upload', fd, {
                transformRequest: angular.identity,
                headers: {'Content-Type': undefined}
            }).success(function (data) {
                defer.resolve(data);
            }).error(function (error) {
                defer.resolve(error);
            });
            return defer.promise;
        };

        this.fnGetFiles = function () {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: '/api/files/list'
            }).then(function successCallback(response) {
                defer.resolve(response);
            }, function errorCallback(error) {
                defer.resolve(error);
            });
            return defer.promise;
        };

        this.fnGetCSV = function (fileName) {
            var defer = $q.defer();
            $http({
                method: 'GET',
                url: '/api/files/csv/'+fileName
            }).then(function successCallback(response) {
                defer.resolve(response);
            }, function errorCallback(error) {
                defer.resolve(error);
            });
            return defer.promise;
        };

        this.fnRemoveFile = function (fileName) {
            var defer = $q.defer();
            $http({
                method: 'DELETE',
                url: '/api/files/remove/'+fileName
            }).then(function successCallback(response) {
                defer.resolve(response);
            }, function errorCallback(error) {
                defer.resolve(error);
            });
            return defer.promise;
        };

        return this;
    }
})();