describe("Midway: Testing modules", () => {
    describe("App module", () => {
        var module;

        beforeEach(() => {
            module = angular.module("App");
        });

        it("should be exist", () => {
            expect(module).not.toEqual(null);
            expect(module).not.toEqual(undefined);
        });
    });
});
