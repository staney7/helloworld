angular.module('RecApp')
        .factory('storageService', function () {
            var storage = {};
            if (window.localStorage) {
                storage = {
                    setItem: function (keyName, keyValue) {
                        return window.localStorage.setItem(keyName, keyValue);
                    },
                    getItem: function (keyName) {
                        return window.localStorage.getItem(keyName);
                    },
                    set: function (keyName, keyValue) {
                        var value = angular.toJson(keyValue);
                        this.setItem(keyName, value);
                    },
                    get: function (keyName) {
                        var value = this.getItem(keyName);
                        if ((value === undefined) || (value == null) || (value == "undefined")) {
                            return null;
                        } else {
                            return JSON.parse(value);
                        }
                    },
                    getObjItem: function (keyName, objkey) {
                        var obj = this.get(keyName);
                        if (obj == null) {
                            return null;
                        } else if (typeof (obj[objkey]) != 'undefined') {
                            return obj[objkey];
                        } else {
                            return null;
                        }
                    },
                    setObjItem: function (keyName, objkey, objvalue) {
                        var obj = this.get(keyName);
                        if (obj == null) {
                            obj = {}
                        }
                        obj[objkey] = objvalue;
                        this.set(keyName, obj);
                        return obj;
                    },
                    removeObjItem: function (keyName, objkey) {
                        var obj = this.get(keyName);
                        if (obj == null) {
                            return {}
                        }
                        delete obj[objkey];
                        this.set(keyName, obj);
                        return obj;
                    }
                }
            }
            return storage;
        });