const {collectResult, waitForElement} = require("./connections");

describe("scripts - connections", () => {

    test("collectResult", () => {
        document.querySelectorAll = jest.fn(() =>
            [
                {value: "word1"},
                {value: "word2"},
                {value: "word3"},
                {value: "word4"}
            ]
        );

        let result = collectResult();

        expect(result).toEqual(["word1", "word2", "word3", "word4"]);
    });

    describe("waitForElement", function() {
        test("element already on page", async function() {
            jest.spyOn(MutationObserver, "constructor");
            let mockElement = {
                element: "button[data-testid='submit-btn']"
            };
            document.querySelector = jest.fn(() => mockElement);

            let result = await waitForElement("button[data-testid='submit-btn']");

            expect(result).toEqual(mockElement);
            expect(MutationObserver.constructor).not.toHaveBeenCalled();
        });

        test("element not yet page", async function() {
            document.querySelector = jest.fn(() => null);

            await expect(async () => {
                await waitForElement("button[data-testid='submit-btn']");
            }).rejects.toThrow("observe called");
        });
    });

});