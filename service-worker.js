self.addEventListener("install", event => {
  console.log("Service Worker installed");
});

self.addEventListener("activate", event => {
  console.log("Service Worker activated");
});

self.addEventListener("push", event => {
  const data = event.data ? event.data.json() : {};
  event.waitUntil(
    self.registration.showNotification(data.title || "Notification", {
      body: data.body || "New update",
      icon: "icon.png"
    })
  );
});
