angular.module("UserAccount").service("UserAccount.services.doubleAuth.sms", function ($q, OvhHttp, featureAvailability) {
    "use strict";

    /**
     *  Get SMS accounts ids.
     * @return {Promise}
     */
    this.query = () =>
        OvhHttp.get("/me/accessRestriction/sms", {
            rootPath: "apiv6"
        });

    /**
     *  Get SMS account.
     * @param  {Integer} id
     * @return {Promise}
     */
    this.get = (id) =>
        OvhHttp.get("/me/accessRestriction/sms/{id}", {
            rootPath: "apiv6",
            urlParams: {
                id
            }
        });

    /**
     * Add new SMS account.
     * @param  {String} phone international phone number.
     * @return {Promise}
     */
    this.post = (phone) =>
        OvhHttp.post("/me/accessRestriction/sms", {
            rootPath: "apiv6",
            data: {
                phone
            }
        });

    /**
     * Edit description from a given SMS account.
     * @param  {Integer} id
     * @param  {String} description
     * @return {Promise}
     */
    this.edit = (id, description) =>
        OvhHttp.put("/me/accessRestriction/sms/{id}", {
            rootPath: "apiv6",
            urlParams: {
                id
            },
            data: {
                description
            }
        });

    /**
     * Delete a given SMS account.
     * @param  {Integer} id
     * @return {Promise}
     */
    this.delete = (id) =>
        OvhHttp.delete("/me/accessRestriction/sms/{id}", {
            rootPath: "apiv6",
            urlParams: {
                id
            }
        });

    /**
     * Disable a given SMS account.
     * @param  {Integer} id
     * @param  {String} code
     * @return {Promise}
     */
    this.disable = (id, code) =>
        OvhHttp.post("/me/accessRestriction/sms/{id}/disable", {
            rootPath: "apiv6",
            urlParams: {
                id
            },
            data: {
                code
            }
        });

    /**
     * Enable a given SMS account.
     * @param  {Integer} id
     * @param  {String} code
     * @return {Promise}
     */
    this.enable = (id, code) =>
        OvhHttp.post("/me/accessRestriction/sms/{id}/enable", {
            rootPath: "apiv6",
            urlParams: {
                id
            },
            data: {
                code
            }
        });

    /**
     * Send code to a given SMS account.
     * @param  {Integer} id
     * @return {Promise}
     */
    this.sendCode = (id) =>
        OvhHttp.post("/me/accessRestriction/sms/{id}/sendCode", {
            rootPath: "apiv6",
            urlParams: {
                id
            }
        });

    /**
     * Validate a given SMS account.
     * @param  {Integer} id
     * @param  {String} code
     * @return {Promise}
     */
    this.validate = (id, code) =>
        OvhHttp.post("/me/accessRestriction/sms/{id}/validate", {
            rootPath: "apiv6",
            urlParams: {
                id
            },
            data: {
                code
            }
        });

    /**
     * Does double auth SMS is supported.
     * @return {Boolean}
     */
    this.isSupported = () => featureAvailability.hasTwoFactorAuthenticationBySms();
});
