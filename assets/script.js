const DAY_LABELS = {
  weekday: "平日",
  saturday: "土曜",
  holiday: "日曜・祝日",
};

const DATA_SOURCES = {
  outbound: "data/timetable.json",
  inbound: "data/timetable_inbound.json",
};

const dataCache = {};
let currentDirection = "inbound";
let currentDay = "weekday";
let renderDay = () => {};

async function loadData(direction) {
  if (!dataCache[direction]) {
    const res = await fetch(DATA_SOURCES[direction]);
    dataCache[direction] = await res.json();
  }
  return dataCache[direction];
}

function renderBoard(data) {
  const routeById = Object.fromEntries(data.routes.map((r) => [r.id, r]));

  document.title = `${data.stop} 発 ${data.via}方面 バス時刻表(統合)`;
  document.getElementById("stop-name").textContent = data.stop;
  document.getElementById("via-name").textContent = `${data.via} 方面`;
  document.getElementById("notice").textContent = data.note;
  document.getElementById("updated").textContent = `データ更新: ${data.generatedAt}`;

  const legendList = document.getElementById("legend-list");
  legendList.innerHTML = "";
  for (const route of data.routes) {
    const li = document.createElement("li");
    const platform = route.platform ? `<span class="platform">${route.platform}番のりば</span>` : "";
    li.innerHTML = `<span class="badge" style="--dep-color:${route.color}">${route.code}</span><span>${route.destination}</span>${platform}`;
    legendList.appendChild(li);
  }

  const body = document.getElementById("timetable-body");
  renderDay = (key) => {
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
        span.title = route.platform
          ? `${route.code} ${route.destination}(${route.platform}番のりば)`
          : `${route.code} ${route.destination}`;
        span.innerHTML = `<span class="dep-dot"></span>${String(dep.minute).padStart(2, "0")}`;
        minutesTd.appendChild(span);
      }
      tr.appendChild(minutesTd);

      body.appendChild(tr);
    }
  };

  renderDay(currentDay);
}

async function showDirection(direction) {
  currentDirection = direction;
  const data = await loadData(direction);
  renderBoard(data);
}

async function main() {
  await showDirection(currentDirection);

  const directionTabs = Array.from(document.querySelectorAll("#direction-tabs .tab"));
  directionTabs.forEach((tab) => {
    tab.addEventListener("click", async () => {
      if (tab.dataset.direction === currentDirection) return;
      directionTabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      await showDirection(tab.dataset.direction);
    });
  });

  const dayTabs = Array.from(document.querySelectorAll("#tabs .tab"));
  dayTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      dayTabs.forEach((t) => {
        t.classList.remove("is-active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("is-active");
      tab.setAttribute("aria-selected", "true");
      currentDay = tab.dataset.key;
      renderDay(currentDay);
    });
  });
}

main().catch((err) => {
  document.getElementById("notice").textContent =
    "時刻表データの読み込みに失敗しました: " + err.message;
});
