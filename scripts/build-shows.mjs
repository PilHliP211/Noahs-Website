import { createSign } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { pathToFileURL } from "node:url";

const DEFAULT_RANGE = "'Form Responses 1'!A:K";
const DEFAULT_OUTPUT_PATH = "data/shows.json";
const DEFAULT_TIME_ZONE = "America/Chicago";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const TOKEN_URL = "https://oauth2.googleapis.com/token";

const HEADER_ALIASES = {
  date: ["show date", "date"],
  venue: ["venue", "venue name"],
  city: ["city"],
  state: ["state", "state or region", "region", "state region"],
  doors: ["doors", "doors time", "door time"],
  time: ["show time", "time", "start time"],
  ticketUrl: ["ticket url", "ticket link", "tickets", "tickets url"],
  eventUrl: ["event url", "event link", "venue url", "venue link", "details url"],
  notes: ["notes", "public notes", "note"],
  status: ["status"]
};

const REQUIRED_FIELDS = ["date", "venue", "city", "state", "status"];

function normalizeHeader(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function trimCell(value) {
  return String(value ?? "").trim();
}

function toBase64Url(value) {
  return Buffer.from(value)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function buildDateKey(year, month, day) {
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() + 1 !== month ||
    date.getUTCDate() !== day
  ) {
    return "";
  }

  return [
    String(year).padStart(4, "0"),
    String(month).padStart(2, "0"),
    String(day).padStart(2, "0")
  ].join("-");
}

function normalizeYear(year) {
  return year < 100 ? 2000 + year : year;
}

function parseSerialDate(value) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return "";
  }

  const milliseconds = Math.round((value - 25569) * 86400 * 1000);
  const date = new Date(milliseconds);

  return buildDateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function normalizeDate(value) {
  if (typeof value === "number") {
    return parseSerialDate(value);
  }

  const input = trimCell(value);

  if (!input) {
    return "";
  }

  const isoMatch = input.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);

  if (isoMatch) {
    return buildDateKey(Number(isoMatch[1]), Number(isoMatch[2]), Number(isoMatch[3]));
  }

  const slashMatch = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);

  if (slashMatch) {
    return buildDateKey(
      normalizeYear(Number(slashMatch[3])),
      Number(slashMatch[1]),
      Number(slashMatch[2])
    );
  }

  const parsed = new Date(input);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return buildDateKey(parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate());
}

export function normalizeUrl(value) {
  const input = trimCell(value);

  if (!input) {
    return "";
  }

  const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(input) ? input : `https://${input}`;

  try {
    const url = new URL(withProtocol);

    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "";
    }

    return url.href;
  } catch {
    return "";
  }
}

function getTodayKey(timeZone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

function addDays(dateKey, days) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days));

  return buildDateKey(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate());
}

export function buildHeaderMap(headerRow) {
  const normalizedHeaders = headerRow.map(normalizeHeader);
  const headerMap = {};

  for (const [field, aliases] of Object.entries(HEADER_ALIASES)) {
    const aliasSet = new Set(aliases.map(normalizeHeader));
    const index = normalizedHeaders.findIndex((header) => aliasSet.has(header));

    if (index !== -1) {
      headerMap[field] = index;
    }
  }

  const missing = REQUIRED_FIELDS.filter((field) => !Number.isInteger(headerMap[field]));

  if (missing.length) {
    throw new Error(`Missing required show headers: ${missing.join(", ")}`);
  }

  return headerMap;
}

function readField(row, headerMap, field) {
  const index = headerMap[field];

  if (!Number.isInteger(index)) {
    return "";
  }

  return trimCell(row[index]);
}

function normalizeShow(row, headerMap, rowNumber) {
  const status = readField(row, headerMap, "status").toLowerCase();

  if (status !== "published") {
    return {
      show: null,
      warnings: []
    };
  }

  const date = normalizeDate(row[headerMap.date]);
  const venue = readField(row, headerMap, "venue");
  const city = readField(row, headerMap, "city");
  const state = readField(row, headerMap, "state").toUpperCase();
  const ticketUrl = normalizeUrl(readField(row, headerMap, "ticketUrl"));
  const eventUrl = normalizeUrl(readField(row, headerMap, "eventUrl"));
  const warnings = [];

  if (!date) {
    warnings.push(`Row ${rowNumber}: invalid show date.`);
  }

  if (!venue) {
    warnings.push(`Row ${rowNumber}: missing venue.`);
  }

  if (!city) {
    warnings.push(`Row ${rowNumber}: missing city.`);
  }

  if (!state) {
    warnings.push(`Row ${rowNumber}: missing state or region.`);
  }

  if (warnings.length) {
    return {
      show: null,
      warnings
    };
  }

  const show = {
    date,
    venue,
    city,
    state
  };

  const doors = readField(row, headerMap, "doors");
  const time = readField(row, headerMap, "time");
  const notes = readField(row, headerMap, "notes");

  if (doors) {
    show.doors = doors;
  }

  if (time) {
    show.time = time;
  }

  if (ticketUrl) {
    show.ticketUrl = ticketUrl;
  }

  if (eventUrl) {
    show.eventUrl = eventUrl;
    show.venueUrl = eventUrl;
  }

  if (notes) {
    show.notes = notes;
  }

  return {
    show,
    warnings
  };
}

export function normalizeRows(rows, options = {}) {
  if (!Array.isArray(rows) || rows.length < 2) {
    return {
      shows: [],
      warnings: []
    };
  }

  const headerMap = buildHeaderMap(rows[0]);
  const timeZone = options.timeZone ?? DEFAULT_TIME_ZONE;
  const todayKey = options.todayKey ?? getTodayKey(timeZone);
  const oldestVisibleDate = addDays(todayKey, -1);
  const warnings = [];
  const shows = [];

  rows.slice(1).forEach((row, index) => {
    const rowNumber = index + 2;

    if (!row.some((value) => trimCell(value))) {
      return;
    }

    const result = normalizeShow(row, headerMap, rowNumber);

    warnings.push(...result.warnings);

    if (result.show && result.show.date >= oldestVisibleDate) {
      shows.push(result.show);
    }
  });

  shows.sort((first, second) => {
    const dateSort = first.date.localeCompare(second.date);

    if (dateSort !== 0) {
      return dateSort;
    }

    return first.venue.localeCompare(second.venue);
  });

  return {
    shows,
    warnings
  };
}

function parseServiceAccount(rawJson) {
  const credentials = JSON.parse(rawJson);

  if (!credentials.client_email || !credentials.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON must include client_email and private_key.");
  }

  return credentials;
}

function createAssertion(credentials) {
  const now = Math.floor(Date.now() / 1000);
  const encodedHeader = toBase64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const encodedClaims = toBase64Url(JSON.stringify({
    iss: credentials.client_email,
    scope: SHEETS_SCOPE,
    aud: TOKEN_URL,
    exp: now + 3600,
    iat: now
  }));
  const payload = `${encodedHeader}.${encodedClaims}`;
  const signature = createSign("RSA-SHA256").update(payload).sign(credentials.private_key);

  return `${payload}.${toBase64Url(signature)}`;
}

async function getAccessToken(credentials) {
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: createAssertion(credentials)
    })
  });

  if (!response.ok) {
    throw new Error(`Google token request failed with ${response.status}.`);
  }

  const token = await response.json();

  if (!token.access_token) {
    throw new Error("Google token response did not include access_token.");
  }

  return token.access_token;
}

async function fetchSheetRows({ accessToken, sheetId, range }) {
  const params = new URLSearchParams({
    majorDimension: "ROWS",
    valueRenderOption: "FORMATTED_VALUE"
  });
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(sheetId)}/values/${encodeURIComponent(range)}?${params}`;
  const response = await fetch(url, {
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Google Sheets request failed with ${response.status}.`);
  }

  const data = await response.json();

  return data.values ?? [];
}

async function writeShows(outputPath, shows) {
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify(shows, null, 2)}\n`);
}

export async function buildShowsFromGoogle(options = {}) {
  const serviceAccountJson = options.serviceAccountJson ?? process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const sheetId = options.sheetId ?? process.env.GOOGLE_SHEET_ID;
  const range = options.range ?? process.env.GOOGLE_SHEET_RANGE ?? DEFAULT_RANGE;
  const outputPath = options.outputPath ?? process.env.SHOWS_OUTPUT_PATH ?? DEFAULT_OUTPUT_PATH;
  const timeZone = options.timeZone ?? process.env.SHOWS_TIME_ZONE ?? DEFAULT_TIME_ZONE;

  if (!serviceAccountJson || !sheetId) {
    await writeShows(outputPath, []);
    console.warn(`Google Sheets show sync is not configured. Wrote an empty show list to ${outputPath}.`);
    return {
      skipped: true,
      shows: [],
      warnings: []
    };
  }

  const credentials = parseServiceAccount(serviceAccountJson);
  const accessToken = await getAccessToken(credentials);
  const rows = await fetchSheetRows({ accessToken, sheetId, range });
  const { shows, warnings } = normalizeRows(rows, { timeZone });

  await writeShows(outputPath, shows);

  warnings.forEach((warning) => console.warn(warning));
  console.log(`Wrote ${shows.length} published show${shows.length === 1 ? "" : "s"} to ${outputPath}.`);

  return {
    skipped: false,
    shows,
    warnings
  };
}

async function main() {
  await buildShowsFromGoogle();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
