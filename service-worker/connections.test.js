import {
  expect,
  jest,
  test,
  describe,
  beforeEach,
  afterAll,
  beforeAll,
} from "@jest/globals";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import { storeResult, checkResult } from "./connections.js";

const server = setupServer(
  http.get("https://www.nytimes.com/svc/connections/v2/2024-09-21.json", () =>
    HttpResponse.json({ answers: "abc" }),
  ),
  http.get(
    "https://www.nytimes.com/svc/connections/v2/2024-09-20.json",
    () => new HttpResponse(null, { status: 500 }),
  ),
);

describe("service worker - connections", function () {
  describe("storeResult", function () {
    beforeAll(function () {
      jest.useFakeTimers();
      console.error = jest.fn();
      server.listen();
    });

    afterAll(function () {
      server.close();
    });

    beforeEach(function () {
      jest.clearAllMocks();
      server.resetHandlers();
    });

    test("ok fetch", async () => {
      jest.setSystemTime(new Date(2024, 8, 21));
      jest.spyOn(chrome.storage.local, "set");

      await storeResult();

      expect(chrome.storage.local.set).toHaveBeenCalledWith({
        connections_result: { answers: "abc" },
      });
      expect(console.error).not.toHaveBeenCalled();
    });

    test("failed fetch", async () => {
      jest.setSystemTime(new Date(2024, 8, 20));
      jest.spyOn(chrome.storage.local, "set");

      await storeResult();

      expect(chrome.storage.local.set).not.toHaveBeenCalled();
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("checkResult", function () {
    beforeEach(function () {
      chrome.storage.local.get = jest.fn().mockReturnValue(
        Promise.resolve({
          connections_result: {
            categories: [
              {
                cards: [
                  { content: "card1-word1" },
                  { content: "card1-word2" },
                  { content: "card1-word3" },
                  { content: "card1-word4" },
                ],
              },
              {
                cards: [
                  { content: "card2-word1" },
                  { content: "card2-word2" },
                  { content: "card2-word3" },
                  { content: "card2-word4" },
                ],
              },
              {
                cards: [
                  { content: "card3-word1" },
                  { content: "card3-word2" },
                  { content: "card3-word3" },
                  { content: "card3-word4" },
                ],
              },
              {
                cards: [
                  { content: "card4-word1" },
                  { content: "card4-word2" },
                  { content: "card4-word3" },
                  { content: "card4-word4" },
                ],
              },
            ],
          },
        }),
      );
    });

    test.each([
      [["card1-word1", "card1-word2", "card1-word3", "card1-word4"]],
      [["card2-word1", "card2-word2", "card2-word3", "card2-word4"]],
      [["card3-word1", "card3-word2", "card3-word3", "card3-word4"]],
      [["card4-word1", "card4-word2", "card4-word3", "card4-word4"]],
    ])("All words correct", async function (guess) {
      expect(await checkResult({ guess: guess })).toBeTruthy();
    });

    test.each([
      [["card2-word1", "card1-word2", "card1-word3", "card1-word4"]],
      [["card2-word1", "card3-word2", "card2-word3", "card2-word4"]],
      [["card3-word1", "card3-word2", "card4-word3", "card3-word4"]],
      [["card4-word1", "card4-word2", "card4-word3", "card1-word4"]],
    ])("One word wrong", async function (guess) {
      expect(await checkResult({ guess: guess })).toBeFalsy();
    });

    test.each([
      [["card2-word1", "card2-word2", "card1-word3", "card1-word4"]],
      [["card2-word1", "card3-word2", "card3-word3", "card2-word4"]],
      [["card3-word1", "card3-word2", "card4-word3", "card4-word4"]],
      [["card1-word1", "card4-word2", "card4-word3", "card1-word4"]],
    ])("Two words wrong", async function (guess) {
      expect(await checkResult({ guess: guess })).toBeFalsy();
    });
  });
});
