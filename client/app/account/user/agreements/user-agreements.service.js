angular
    .module("UserAccount")
    .service("UserAccountAgreements", class UserAccountAgreements {
        constructor ($cacheFactory, $http, $q) {
            this.$cacheFactory = $cacheFactory;
            this.$http = $http;
            this.$q = $q;

            this.userAgreementsCache = this.$cacheFactory("USER_AGREEMENTS");
        }

        getSuccessDataOrReject (response) {
            return response.status < 300 ? response.data : this.$q.reject(response.data);
        }

        getList (count, offset) {
            return this.$http
                .get("/sws/agreements", {
                    cache: this.userAgreementsCache,
                    params: {
                        count,
                        offset
                    },
                    serviceType: "aapi"
                })
                .then(this.getSuccessDataOrReject);
        }

        getToValidate () {
            return this.$http
                .get("/sws/agreements", {
                    cache: this.userAgreementsCache,
                    params: {
                        count: 0,
                        offset: 0,
                        agreed: "todo"
                    },
                    serviceType: "aapi"
                })
                .then(this.getSuccessDataOrReject);
        }
    });
