const showList = document.querySelector("#show-list");

const emptyShowsMarkup = `
  <div class="empty-state">
    <p class="empty-state__label">Shows coming soon.</p>
    <p>Upcoming dates will be posted here.</p>
  </div>
`;

function getTodayKey() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseShowDate(dateKey) {
  if (typeof dateKey !== "string") {
    return null;
  }

  const [year, month, day] = dateKey.split("-").map(Number);

  if (!year || !month || !day) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (getDateKey(date) !== dateKey) {
    return null;
  }

  return date;
}

function formatShowDate(dateKey) {
  const date = parseShowDate(dateKey);

  if (!date) {
    return {
      month: "",
      day: "",
      year: ""
    };
  }

  const parts = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).formatToParts(date);

  return {
    month: parts.find((part) => part.type === "month")?.value ?? "",
    day: parts.find((part) => part.type === "day")?.value ?? "",
    year: parts.find((part) => part.type === "year")?.value ?? ""
  };
}

function isValidShow(show) {
  return Boolean(parseShowDate(show?.date ?? "") && show?.venue && show?.city && (show?.state || show?.region));
}

function isUpcomingShow(show) {
  return show.date >= getTodayKey();
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);

  if (className) {
    element.className = className;
  }

  element.textContent = text;

  return element;
}

function createShowAction(url, label, variant) {
  const link = document.createElement("a");
  link.className = `show-card__action show-card__action--${variant}`;
  link.href = url;
  link.rel = "noreferrer";
  link.textContent = label;

  return link;
}

function createShowCard(show) {
  const dateParts = formatShowDate(show.date);
  const card = document.createElement("article");
  card.className = "show-card";
  const region = show.state || show.region || "";
  const location = [show.city, region].filter(Boolean).join(", ");
  const timeDetails = [
    show.doors ? `Doors ${show.doors}` : "",
    show.time ? `Show ${show.time}` : ""
  ].filter(Boolean).join(" / ");

  const date = document.createElement("time");
  date.className = "show-card__date";
  date.dateTime = show.date;
  date.append(
    createTextElement("span", "", dateParts.month),
    createTextElement("strong", "", dateParts.day),
    createTextElement("span", "", dateParts.year)
  );

  const details = document.createElement("div");
  details.className = "show-card__details";
  details.append(
    createTextElement("h3", "", show.venue),
    createTextElement(
      "p",
      "show-card__meta",
      [location, timeDetails].filter(Boolean).join(" - ")
    )
  );

  if (show.notes) {
    details.append(createTextElement("p", "show-card__notes", show.notes));
  }

  const actions = document.createElement("div");
  actions.className = "show-card__actions";

  if (show.ticketUrl) {
    actions.append(createShowAction(show.ticketUrl, "Tickets", "primary"));
  }

  if (show.eventUrl || show.venueUrl) {
    actions.append(createShowAction(show.eventUrl || show.venueUrl, "Event details", "secondary"));
  }

  card.append(date, details);

  if (actions.children.length) {
    card.append(actions);
  }

  return card;
}

async function renderShows() {
  if (!showList) {
    return;
  }

  try {
    const response = await fetch("data/shows.json", { cache: "no-store" });

    if (!response.ok) {
      throw new Error("Unable to load shows.");
    }

    const shows = await response.json();
    const upcomingShows = Array.isArray(shows)
      ? shows
        .filter(isValidShow)
        .filter(isUpcomingShow)
        .sort((first, second) => first.date.localeCompare(second.date))
      : [];

    if (!upcomingShows.length) {
      showList.innerHTML = emptyShowsMarkup;
      return;
    }

    showList.replaceChildren(...upcomingShows.map(createShowCard));
  } catch {
    showList.innerHTML = emptyShowsMarkup;
  }
}

renderShows();
