// enable fetch request mocking
require("jest-fetch-mock").enableMocks()

global.chrome = {
    runtime: {
        sendMessage: jest.fn()
    },
    storage: {
        local: {
            set: jest.fn(),
        }
    }
};

global.document = {
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(),
    body: jest.mock()
}

global.MutationObserver = class {
    constructor(callback) {}
    disconnect() {}
    observe(element, initObject) {
        // raise an error to complete the promise
        throw new Error("observe called");
    }
};
