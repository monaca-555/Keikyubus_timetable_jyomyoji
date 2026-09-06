const DAY_LABELS = {
  weekday: "平日",
  saturday: "土曜",
  holiday: "日曜・祝日",
};

async function main() {
  const res = await fetch("data/timetable.json");
  const data = await res.json();

  const routeById = Object.fromEntries(data.routes.map((r) => [r.id, r]));

  document.title = `${data.stop} 発 ${data.via}方面 バス時刻表(統合)`;
  document.getElementById("notice").textContent = data.note;
  document.getElementById("updated").textContent = `データ更新: ${data.generatedAt}`;

  const legendList = document.getElementById("legend-list");
  legendList.innerHTML = "";
  for (const route of data.routes) {
    const li = document.createElement("li");
    li.innerHTML = `<span class="badge" style="--dep-color:${route.color}">${route.code}</span><span>${route.destination}</span>`;
    legendList.appendChild(li);
  }

  const tabs = Array.from(document.querySelectorAll(".tab"));
  const body = document.getElementById("timetable-body");

  function renderDay(key) {
    const rows = data.schedule[key] || [];
    body.innerHTML = "";
    for (const row of rows) {
      const tr = document.createElement("tr");

      const hourTd = document.createElement("td");
      hourTd.className = "hour";
      hourTd.textContent = row.hour;
      tr.appendChild(hourTd);

      const minutesTd = document.createElement("td");
      minutesTd.className = "minutes";
      const sorted = [...row.departures].sort((a, b) => a.minute - b.minute);
      for (const dep of sorted) {
        const route = routeById[dep.route];
        const span = document.createElement("span");
        span.className = "dep";
        span.style.setProperty("--dep-color", route.color);
        span.innerHTML = `<span class="badge">${route.code}</span>${String(dep.minute).padStart(2, "0")}`;
        minutesTd.appendChild(span);
      }
      tr.appendChild(minutesTd);

      body.appendChild(tr);
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      renderDay(tab.dataset.key);
    });
  });

  renderDay("weekday");
}

main().catch((err) => {
  document.getElementById("notice").textContent =
    "時刻表データの読み込みに失敗しました: " + err.message;
});
