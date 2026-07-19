const BLOCKED_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "::1",
  "metadata.google.internal",
]);

function isPrivateIp(hostname: string): boolean {
  if (
    /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^192\.168\.\d+\.\d+$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[0-1])\.\d+\.\d+$/.test(hostname) ||
    /^169\.254\.\d+\.\d+$/.test(hostname) ||
    /^100\.(6[4-9]|[7-9]\d|1[0-1]\d|12[0-7])\.\d+\.\d+$/.test(hostname)
  ) {
    return true;
  }
  return false;
}

export function normalizeUrl(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    url.hash = "";
    // Drop common tracking params
    for (const key of [...url.searchParams.keys()]) {
      if (key.startsWith("utm_") || key === "fbclid" || key === "gclid") {
        url.searchParams.delete(key);
      }
    }
    let normalized = url.toString();
    if (normalized.endsWith("/") && url.pathname === "/") {
      // keep root slash
    } else if (normalized.endsWith("/")) {
      normalized = normalized.slice(0, -1);
    }
    return normalized;
  } catch {
    return null;
  }
}

export function assertSafeUrl(
  raw: string,
): { ok: true; url: URL } | { ok: false; reason: string } {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return { ok: false, reason: "invalid_url" };
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return { ok: false, reason: "unsupported_protocol" };
  }
  const host = url.hostname.toLowerCase();
  if (
    BLOCKED_HOSTS.has(host) ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    return { ok: false, reason: "blocked_host" };
  }
  if (isPrivateIp(host)) {
    return { ok: false, reason: "private_network" };
  }
  return { ok: true, url };
}

export type ContentSourceType =
  "NEWSROOM" | "ENGINEERING_BLOG" | "OFFICIAL" | "WEB" | "JOB_DESCRIPTION";

/** Path/host signals for newsroom and engineering blog content. */
export function classifyContentSourceType(url: string): ContentSourceType {
  let host = "";
  let path = "";
  try {
    const parsed = new URL(url);
    host = parsed.hostname.toLowerCase();
    path = parsed.pathname.toLowerCase();
  } catch {
    return "WEB";
  }

  const hostAndPath = `${host}${path}`;

  if (
    host.startsWith("news.") ||
    host.startsWith("newsroom.") ||
    host.includes("newsroom") ||
    path.includes("/newsroom") ||
    path.includes("/press") ||
    /\/news(\/|$)/.test(path)
  ) {
    return "NEWSROOM";
  }

  if (
    host.startsWith("blog.") ||
    host.startsWith("engineering.") ||
    host.startsWith("tech.") ||
    path.includes("/engineering") ||
    path.includes("/developers") ||
    path.includes("/tech-blog") ||
    (path.includes("/blog") &&
      (hostAndPath.includes("engineer") ||
        hostAndPath.includes("tech") ||
        hostAndPath.includes("developer") ||
        path.includes("/blog")))
  ) {
    // Prefer ENGINEERING_BLOG when eng/tech signals exist; plain /blog on company domain is still valuable.
    if (
      hostAndPath.includes("engineer") ||
      hostAndPath.includes("tech") ||
      hostAndPath.includes("developer") ||
      path.includes("/engineering")
    ) {
      return "ENGINEERING_BLOG";
    }
    return "ENGINEERING_BLOG";
  }

  if (
    path.includes("/about") ||
    path.includes("/careers") ||
    path.includes("/company") ||
    path === "/" ||
    path === ""
  ) {
    return "OFFICIAL";
  }

  return "WEB";
}

export function isNewsOrBlogSourceType(sourceType: string): boolean {
  return (
    sourceType === "NEWSROOM" ||
    sourceType === "ENGINEERING_BLOG" ||
    sourceType === "NEWS"
  );
}

export function isGeneralOfficialSourceType(sourceType: string): boolean {
  return (
    sourceType === "OFFICIAL" ||
    sourceType === "JOB_DESCRIPTION" ||
    /about|career/i.test(sourceType)
  );
}

export function classifyEvidenceTier(
  url: string,
  companyDomain?: string | null,
): "PRIMARY" | "CREDIBLE_SECONDARY" | "ANECDOTAL" {
  const host = (() => {
    try {
      return new URL(url).hostname.toLowerCase();
    } catch {
      return "";
    }
  })();

  if (
    host.includes("reddit.com") ||
    host.includes("glassdoor.") ||
    host.includes("teamblind.com") ||
    host.includes("levels.fyi") ||
    host.includes("fishbowlapp.com")
  ) {
    return "ANECDOTAL";
  }

  if (companyDomain) {
    const domain = companyDomain.replace(/^www\./, "").toLowerCase();
    if (host === domain || host.endsWith(`.${domain}`)) {
      return "PRIMARY";
    }
  }

  if (
    host.includes("newsroom") ||
    host.includes("investor") ||
    host.includes("github.com") ||
    host.endsWith(".gov")
  ) {
    return "PRIMARY";
  }

  if (
    host.includes("nytimes.com") ||
    host.includes("wsj.com") ||
    host.includes("reuters.com") ||
    host.includes("bloomberg.com") ||
    host.includes("techcrunch.com") ||
    host.includes("theverge.com") ||
    host.includes("wired.com") ||
    host.includes("forbes.com") ||
    host.includes("bbc.") ||
    host.includes("cnn.com")
  ) {
    return "CREDIBLE_SECONDARY";
  }

  return "CREDIBLE_SECONDARY";
}
