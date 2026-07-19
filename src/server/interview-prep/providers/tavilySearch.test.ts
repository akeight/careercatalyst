import { afterEach, describe, expect, it, vi } from "vitest";
import { createTavilySearchProvider } from "./tavilySearch";

describe("createTavilySearchProvider", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("passes search_depth advanced and max_results for Brief-style opts", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          {
            url: "https://acme.com/newsroom/a",
            title: "News",
            content: "Hello",
            score: 0.9,
          },
        ],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const provider = createTavilySearchProvider("test-key");
    await provider.search("acme newsroom", {
      maxResults: 8,
      searchDepth: "advanced",
    });

    expect(fetchMock).toHaveBeenCalledOnce();
    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.search_depth).toBe("advanced");
    expect(body.max_results).toBe(8);
    expect(body.api_key).toBe("test-key");
  });

  it("defaults to basic depth", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ results: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const provider = createTavilySearchProvider("k");
    await provider.search("q");

    const body = JSON.parse(fetchMock.mock.calls[0][1].body as string);
    expect(body.search_depth).toBe("basic");
    expect(body.max_results).toBe(5);
  });
});
