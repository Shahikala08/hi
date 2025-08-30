// Load timetable JSON
fetch("timetable.json")
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById("timetable");
    const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

    if (data[today]) {
      data[today].forEach(([start, end, subject]) => {
        const li = document.createElement("li");
        li.textContent = `${start} - ${end}: ${subject}`;
        list.appendChild(li);
      });
    } else {
      list.innerHTML = "<li>No classes today 🎉</li>";
    }
  });

// ✅ Register Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch(err => console.error("SW registration failed:", err));
}

// ✅ Enable Notifications
document.getElementById("enable-notifications").addEventListener("click", () => {
  Notification.requestPermission().then(permission => {
    if (permission === "granted") {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification("✅ Notifications enabled!", {
          body: "You will get class reminders 10 minutes before.",
          icon: "icon.png"
        });
      });
    } else {
      alert("❌ Please allow notifications in your browser.");
    }
  });
});

// ✅ Class reminder checker (every minute)
setInterval(() => {
  const now = new Date();
  const today = now.toLocaleDateString("en-US", { weekday: "long" });

  fetch("timetable.json")
    .then(res => res.json())
    .then(data => {
      if (!data[today]) return;

      data[today].forEach(([start, , subject]) => {
        const [h, m] = start.split(":");
        const classTime = new Date(now);
        classTime.setHours(h, m, 0, 0);

        const diff = Math.round((classTime - now) / 60000);

        if (diff === 10) {
          navigator.serviceWorker.ready.then(registration => {
            registration.showNotification("Class Reminder", {
              body: `${subject} starts at ${start}`,
              icon: "icon.png"
            });
          });
        }
      });
    });
}, 60000);
