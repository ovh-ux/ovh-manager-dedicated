angular
    .module("Module.search")
    .controller("SearchCtrl", class SearchCtrl {
        constructor ($http, $location, $q, $scope, $translate, Alerter, constants, SEARCH_TARGET_URL, SEARCH_MAPPING_API_ENDPOINTS) {
            this.$http = $http;
            this.$location = $location;
            this.$scope = $scope;
            this.$translate = $translate;
            this.$q = $q;
            this.Alerter = Alerter;
            this.constants = constants;
            this.SEARCH_TARGET_URL = SEARCH_TARGET_URL;
            this.SEARCH_MAPPING_API_ENDPOINTS = SEARCH_MAPPING_API_ENDPOINTS;
        }

        $onInit () {
            this.queryValue = this.getQueryParam();
            this.results = [];
            this.isSearching = false;
            this.pagination = {
                offset: 1,
                size: 5
            };

            if (_.isEmpty(this.queryValue)) {
                return null;
            }

            this.addQueryParamListener();

            return this.fetchData(this.queryValue);
        }

        getQueryParam () {
            const searchObject = this.$location.search();

            return searchObject.q;
        }

        addQueryParamListener () {
            this.$scope.$on("$locationChangeSuccess", () => {
                this.queryValue = this.getQueryParam();

                if (_.isEmpty(this.queryValue)) {
                    return null;
                }

                return this.fetchData(this.queryValue);
            });
        }

        onSearchChange (modelValue) {
            this.updateQueryParam(modelValue);

            return this.fetchData(modelValue);
        }

        updateQueryParam (modelValue) {
            return this.$location.search({ q: modelValue });
        }

        onSearchReset () {
            this.results = [];
        }

        fetchData (query) {
            this.isSearching = true;

            return this.$q
                .all({
                    name: this.$http.get(`apiv7/service/*?$aggreg=1&resource.name:like=%25${query}%25&$fields=route,resource`),
                    displayName: this.$http.get(`apiv7/service/*?$aggreg=1&resource.displayName:like=%25${query}%25&$fields=route,resource`)
                })
                .then(({ name, displayName }) => {
                    const results = _.chain(name.data)
                        .union(displayName.data)
                        .uniq("key") // value.resource.name
                        .value();

                    return results;
                })
                .then((results) => {
                    // console.log("results", results);
                    const promises = _.chain(results).map((result) => {
                        const path = _.get(result, "value.route.path");
                        const name = _.get(result, "value.resource.name");
                        const mappedApiEndpoint = _.get(this.SEARCH_MAPPING_API_ENDPOINTS, path);

                        let queryUrl = _.get(mappedApiEndpoint, "queryUrl");

                        if (queryUrl) {
                            queryUrl = queryUrl.replace("{serviceName}", name);
                            result.value.details = {};

                            return this.$http.get(queryUrl)
                                .then(({ data }) => {

                                    if (_.isArray(data) && !_.isEmpty(data)) {
                                        const dataFiltered = _.filter(data, (d) => !_.has(d, "value.message"));
                                        if (_.isEmpty(dataFiltered)) {
                                            return null;
                                        }
                                        const dataPath = _.get(_.first(dataFiltered), "path", "");

                                        result.value.details[mappedApiEndpoint.tplRouteParams] = dataPath.match(_.get(mappedApiEndpoint, "tplRoute"))[1];

                                        result.value.details.url = mappedApiEndpoint.url
                                            .replace(`{${mappedApiEndpoint.tplRouteParams}}`, dataPath.match(_.get(mappedApiEndpoint, "tplRoute"))[1])
                                            .replace("{serviceName}", name)
                                            .replace(`{${mappedApiEndpoint.urlParams}}`, _.get(_.first(data), mappedApiEndpoint.urlParams));
                                    } else {
                                        result.value.details[mappedApiEndpoint.tplRouteParams] = _.get(_.get(data, mappedApiEndpoint.tplRouteParams), "name");
                                        result.value.details.url = mappedApiEndpoint.url
                                            .replace(`{${mappedApiEndpoint.tplRouteParams}}`, _.get(_.get(data, mappedApiEndpoint.tplRouteParams), "name"))
                                            .replace("{serviceName}", name);
                                    }

                                    result.value.details.univers = mappedApiEndpoint.univers;

                                    return result;
                                });
                        }

                        return null;
                    }).compact().value();

                    if (_.chain(promises).compact().isEmpty().value()) {
                        return results;
                    }

                    return this.$q
                        .all(promises)
                        .then(_.compact);
                })
                .then((results) => {
                    this.results = _.map(results, "value");
                })
                .catch((err) => {
                    console.log("fetchData.catch err", err);
                    return this.Alerter.error(this.$translate.instant("search_error"));
                })
                .finally(() => {
                    this.isSearching = false;
                });
        }

        buildTargetUrl (result) {
            const details = _.get(result, "details");
            if (_.isEmpty(details)) {
                const target = _.get(this.SEARCH_TARGET_URL, _.get(result, "route.path"));
                const basePath = _.get(this.constants.MANAGER_URLS, target.univers);

                return basePath + target.url.replace("{serviceName}", _.get(result, "resource.name"));
            }

            return this.constants.MANAGER_URLS[details.univers] + details.url;
        }

        getPaginatedResults () {
            return _.slice(this.results, this.pagination.offset - 1, (this.pagination.offset - 1) + this.pagination.size);
        }

        onPaginationChange ($event) {
            this.pagination.offset = $event.offset;
            this.pagination.size = $event.pageSize;
            this.getPaginatedResults();
        }

        static buildBreadcrumb (result) {
            const productType = _.get(result, "route.path", "").replace(/\/\{.+\}/g, "").replace(/\//g, " / ");
            return `Product ${productType}`;
        }

        static buildTitle (result) {
            const displayName = _.get(result, "resource.displayName");
            const name = _.get(result, "resource.name");
            const title = displayName !== name ? `${displayName} (${name})` : name;

            return title;
        }
    });
