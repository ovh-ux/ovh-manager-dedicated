"use strict";

var config = browser.params;

describe("MANAGER: DEDICATED", function () {
    var page;

    beforeEach(function () {
        // browser.get(config.baseUrl + "/");
        page = require("./main.po");
    });

    describe("simple test", function () {
        // browser.pause(5860);

        it("should login.", function () {
            // Because login page is not in Angular....
            browser.ignoreSynchronization = true;
            browser.get(config.baseUrl + "/login/");

            browser.wait(function() {
                return page.loginEl.isPresent();
            }, 10000, "Login should be displayed within 20 seconds.").then(function () {
                page.loginEl.sendKeys(config.login);
                page.passwordEl.sendKeys(config.password);
                page.loginSubmitBtnEl.click();

                expect(true).toBe(true);
                browser.sleep(5000);

            });
        });

        it("should test if NIC is present.", function () {

            expect(page.nicEl.getText()).toBe("(ls148374-ovh)");

        });

    });

});
