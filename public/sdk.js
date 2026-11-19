(() => {
  const script = document.currentScript;
  if (!script || window.stallpoint?.loaded) return;

  const key = script.getAttribute("data-key");
  if (!key) return;

  const endpoint = new URL("/api/v1/events", script.src).toString();
  const STORAGE_KEY = "stallpoint_vid";
  const FLUSH_DELAY_MS = 2000;
  const FLUSH_SIZE = 20;
  const BATCH_LIMIT = 50;

  let memoryVisitorId = null;
  let userId = null;
  let lastPath = null;
  let timer = null;
  const queue = [];

  const randomId = () =>
    crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;

  const visitorId = () => {
    try {
      let id = localStorage.getItem(STORAGE_KEY);
      if (!id) {
        id = randomId();
        localStorage.setItem(STORAGE_KEY, id);
      }
      return id;
    } catch {
      memoryVisitorId = memoryVisitorId || randomId();
      return memoryVisitorId;
    }
  };

  const referrerOrigin = () => {
    try {
      return document.referrer ? new URL(document.referrer).origin : null;
    } catch {
      return null;
    }
  };

  const send = (events, useBeacon) => {
    const body = JSON.stringify({ key, events });
    if (useBeacon && navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([body], { type: "text/plain" }));
      return;
    }
    fetch(endpoint, {
      method: "POST",
      body,
      keepalive: true,
      headers: { "Content-Type": "text/plain" },
    }).catch(() => {});
  };

  const flush = (useBeacon) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    while (queue.length) send(queue.splice(0, BATCH_LIMIT), useBeacon);
  };

  const enqueue = (name, properties) => {
    queue.push({
      name: String(name),
      visitorId: visitorId(),
      userId,
      path: location.pathname,
      referrer: referrerOrigin(),
      properties: properties || {},
      timestamp: Date.now(),
    });
    if (queue.length >= FLUSH_SIZE) flush(false);
    else if (!timer) timer = setTimeout(() => flush(false), FLUSH_DELAY_MS);
  };

  const pageView = () => {
    if (location.pathname === lastPath) return;
    lastPath = location.pathname;
    enqueue("page_view");
  };

  for (const method of ["pushState", "replaceState"]) {
    const original = history[method];
    history[method] = function patched(...args) {
      const result = original.apply(this, args);
      setTimeout(pageView, 0);
      return result;
    };
  }

  addEventListener("popstate", pageView);
  addEventListener("pagehide", () => flush(true));
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(true);
  });

  window.stallpoint = {
    loaded: true,
    track: (name, properties) => enqueue(name, properties),
    identify: (id) => {
      userId = id == null ? null : String(id);
    },
    reset: () => {
      userId = null;
      memoryVisitorId = null;
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    },
  };

  pageView();
})();
