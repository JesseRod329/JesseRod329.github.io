import { r as reactExports, a as reactDomExports, R as React } from "./vendor-5407acc1.js";
import { m as motion } from "./motion-7cf5ffce.js";
import { s as select, z as zoom, o as ordinal, c as category10, a as simulation, l as link, m as manyBody, b as center, d as collide, e as drag, t as time, f as extent, g as linear, h as max, i as line, j as monotoneX, k as area, n as axisBottom, p as timeFormat, q as axisLeft, r as band, u as sequential, R as RdYlGn, v as arc, w as naturalEarth1, x as index$1, y as graticule, A as sqrt, B as Blues, C as axisRight, D as range } from "./d3-f1df2ee8.js";
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link2 of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link2);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link2) {
    const fetchOpts = {};
    if (link2.integrity)
      fetchOpts.integrity = link2.integrity;
    if (link2.referrerPolicy)
      fetchOpts.referrerPolicy = link2.referrerPolicy;
    if (link2.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link2.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link2) {
    if (link2.ep)
      return;
    link2.ep = true;
    const fetchOpts = getFetchOpts(link2);
    fetch(link2.href, fetchOpts);
  }
})();
var jsxRuntime = { exports: {} };
var reactJsxRuntime_production_min = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var f = reactExports, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
function q(c, a, g) {
  var b, d = {}, e = null, h = null;
  void 0 !== g && (e = "" + g);
  void 0 !== a.key && (e = "" + a.key);
  void 0 !== a.ref && (h = a.ref);
  for (b in a)
    m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
  if (c && c.defaultProps)
    for (b in a = c.defaultProps, a)
      void 0 === d[b] && (d[b] = a[b]);
  return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
}
reactJsxRuntime_production_min.Fragment = l;
reactJsxRuntime_production_min.jsx = q;
reactJsxRuntime_production_min.jsxs = q;
{
  jsxRuntime.exports = reactJsxRuntime_production_min;
}
var jsxRuntimeExports = jsxRuntime.exports;
var client = {};
var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}
const initialState = {
  data: [],
  wrestlers: [],
  venues: [],
  tagTeams: [],
  heroMetrics: {
    totalMatches: 0,
    totalWrestlers: 0,
    totalVenues: 0,
    totalPromotions: 0,
    averageMatchTime: 0,
    lastUpdated: /* @__PURE__ */ new Date()
  },
  isLoading: false,
  error: null,
  config: {
    filters: {
      promotions: [],
      wrestlers: [],
      venues: [],
      dateRange: {
        start: /* @__PURE__ */ new Date("2024-01-01"),
        end: /* @__PURE__ */ new Date()
      },
      matchType: "all",
      eventType: "all"
    },
    selectedWrestlers: [],
    selectedPromotions: [],
    timeRange: {
      start: /* @__PURE__ */ new Date("2024-01-01"),
      end: /* @__PURE__ */ new Date()
    },
    chartType: "network"
  }
};
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_DATA":
      return {
        ...state,
        data: action.payload,
        isLoading: false,
        error: null
      };
    case "SET_FILTERS":
      return {
        ...state,
        config: {
          ...state.config,
          filters: { ...state.config.filters, ...action.payload }
        }
      };
    case "SET_CONFIG":
      return {
        ...state,
        config: { ...state.config, ...action.payload }
      };
    case "RESET_FILTERS":
      return {
        ...state,
        config: {
          ...state.config,
          filters: initialState.config.filters,
          selectedWrestlers: [],
          selectedPromotions: []
        }
      };
    case "SELECT_WRESTLER":
      return {
        ...state,
        config: {
          ...state.config,
          selectedWrestlers: [...state.config.selectedWrestlers, action.payload]
        }
      };
    case "DESELECT_WRESTLER":
      return {
        ...state,
        config: {
          ...state.config,
          selectedWrestlers: state.config.selectedWrestlers.filter((w) => w !== action.payload)
        }
      };
    case "SET_CHART_TYPE":
      return {
        ...state,
        config: {
          ...state.config,
          chartType: action.payload
        }
      };
    default:
      return state;
  }
};
const DashboardContext = reactExports.createContext(void 0);
const DashboardProvider = ({ children }) => {
  const [state, dispatch] = reactExports.useReducer(dashboardReducer, initialState);
  const setLoading = reactExports.useCallback((loading) => {
    dispatch({ type: "SET_LOADING", payload: loading });
  }, []);
  const setError = reactExports.useCallback((error) => {
    dispatch({ type: "SET_ERROR", payload: error });
  }, []);
  const setData = reactExports.useCallback((data) => {
    dispatch({ type: "SET_DATA", payload: data });
  }, []);
  const setFilters = reactExports.useCallback((filters) => {
    dispatch({ type: "SET_FILTERS", payload: filters });
  }, []);
  const setConfig = reactExports.useCallback((config) => {
    dispatch({ type: "SET_CONFIG", payload: config });
  }, []);
  const resetFilters = reactExports.useCallback(() => {
    dispatch({ type: "RESET_FILTERS" });
  }, []);
  const selectWrestler = reactExports.useCallback((wrestler) => {
    dispatch({ type: "SELECT_WRESTLER", payload: wrestler });
  }, []);
  const deselectWrestler = reactExports.useCallback((wrestler) => {
    dispatch({ type: "DESELECT_WRESTLER", payload: wrestler });
  }, []);
  const setChartType = reactExports.useCallback((chartType) => {
    dispatch({ type: "SET_CHART_TYPE", payload: chartType });
  }, []);
  const value = {
    state,
    setLoading,
    setError,
    setData,
    setFilters,
    setConfig,
    resetFilters,
    selectWrestler,
    deselectWrestler,
    setChartType
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardContext.Provider, { value, children });
};
const useDashboard = () => {
  const context = reactExports.useContext(DashboardContext);
  if (context === void 0) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};
const Header = ({ darkMode, toggleDarkMode }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-50 glassmorphism border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "container mx-auto px-4 py-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, x: -20 },
        animate: { opacity: 1, x: 0 },
        transition: { duration: 0.5 },
        className: "flex items-center space-x-3",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: "🥊" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-display font-bold text-gray-900 dark:text-gray-100", children: "Wrestling Analytics" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Data Visualization Dashboard" })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "hidden md:flex items-center space-x-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#overview",
          className: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200",
          children: "Overview"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#visualizations",
          className: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200",
          children: "Visualizations"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "#analytics",
          className: "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200",
          children: "Analytics"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.button,
        {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          onClick: toggleDarkMode,
          className: "p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200",
          "aria-label": "Toggle dark mode",
          children: darkMode ? /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            "path",
            {
              fillRule: "evenodd",
              d: "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z",
              clipRule: "evenodd"
            }
          ) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 20 20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" }) })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.a,
        {
          whileHover: { scale: 1.05 },
          whileTap: { scale: 0.95 },
          href: "/",
          className: "btn-secondary",
          children: "← Portfolio"
        }
      )
    ] })
  ] }) }) });
};
const parseMultipleCSVs = async () => {
  const matches = [];
  const processedMatches = /* @__PURE__ */ new Set();
  try {
    const wrestlerFiles = await getWrestlerFiles();
    for (const fileName of wrestlerFiles) {
      try {
        const response = await fetch(`/wrestling-analytics-dashboard/data/${fileName}`);
        if (!response.ok)
          continue;
        const csvText = await response.text();
        const wrestlerMatches = parseWrestlerCSV(csvText, fileName);
        wrestlerMatches.forEach((match) => {
          const matchKey = `${match.date}-${match.id}`;
          if (!processedMatches.has(matchKey)) {
            matches.push(match);
            processedMatches.add(matchKey);
          }
        });
      } catch (error) {
        console.warn(`Error processing ${fileName}:`, error);
      }
    }
  } catch (error) {
    console.error("Error loading wrestler data:", error);
  }
  return matches.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};
const getWrestlerFiles = async () => {
  const priorityWrestlers = [
    "CM_Punk_matches.csv",
    "John_Cena_matches.csv",
    "Roman_Reigns_matches.csv",
    "Seth_Rollins_matches.csv",
    "Cody_Rhodes_matches.csv",
    "Drew_McIntyre_matches.csv",
    "Brock_Lesnar_matches.csv",
    "Becky_Lynch_matches.csv",
    "Charlotte_Flair_matches.csv",
    "Bayley_matches.csv",
    "Bianca_Belair_matches.csv",
    "Rhea_Ripley_matches.csv",
    "Finn_Balor_matches.csv",
    "AJ_Styles_matches.csv",
    "Adam_Cole_matches.csv",
    "Johnny_Gargano_matches.csv",
    "Adam_Copeland_matches.csv",
    "Jon_Moxley_matches.csv",
    "Bryan_Danielson_matches.csv",
    "Kenny_Omega_matches.csv",
    "Adam_Page_matches.csv",
    "Darby_Allin_matches.csv",
    "Orange_Cassidy_matches.csv",
    "Eddie_Kingston_matches.csv",
    "CM_Punk_matches.csv",
    "Jade_Cargill_matches.csv",
    "Hikaru_Shida_matches.csv",
    "Dr._Britt_Baker_DMD_matches.csv",
    "Thunder_Rosa_matches.csv",
    "Toni_Storm_matches.csv",
    "Hiroshi_Tanahashi_matches.csv",
    "Kazuchika_Okada_matches.csv",
    "Will_Ospreay_matches.csv",
    "Kota_Ibushi_matches.csv",
    "Jay_White_matches.csv",
    "Tetsuya_Naito_matches.csv",
    "Shingo_Takagi_matches.csv",
    "Tomohiro_Ishii_matches.csv",
    "Hiromu_Takahashi_matches.csv",
    "EVIL_matches.csv",
    "KUSHIDA_matches.csv",
    "Zack_Sabre_Jr._matches.csv",
    "Samoa_Joe_matches.csv",
    "Kurt_Angle_matches.csv",
    "Mick_Foley_matches.csv",
    "The_Rock_matches.csv",
    "Steve_Austin_matches.csv",
    "Triple_H_matches.csv",
    "The_Undertaker_matches.csv"
  ];
  return priorityWrestlers;
};
const searchWrestlerFiles = async (searchTerm) => {
  const allWrestlers = [
    "CM_Punk_matches.csv",
    "John_Cena_matches.csv",
    "Roman_Reigns_matches.csv",
    "Seth_Rollins_matches.csv",
    "Cody_Rhodes_matches.csv",
    "Drew_McIntyre_matches.csv",
    "Brock_Lesnar_matches.csv",
    "Becky_Lynch_matches.csv",
    "Charlotte_Flair_matches.csv",
    "Bayley_matches.csv",
    "Bianca_Belair_matches.csv",
    "Rhea_Ripley_matches.csv"
    // Add more as needed
  ];
  const searchLower = searchTerm.toLowerCase().replace(/\s+/g, "_");
  return allWrestlers.filter(
    (file) => file.toLowerCase().includes(searchLower)
  );
};
const parseWrestlerCSV = (csvText, fileName) => {
  const lines = csvText.split("\n").filter((line2) => line2.trim());
  const matches = [];
  for (let i = 1; i < lines.length; i++) {
    try {
      const values = parseCSVLine(lines[i]);
      if (values.length < 4)
        continue;
      const match = parseRealMatchData(values, fileName);
      if (match) {
        matches.push(match);
      }
    } catch (error) {
      console.warn(`Error parsing line ${i + 1} in ${fileName}:`, error);
    }
  }
  return matches;
};
const parseCSVLine = (line2) => {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line2.length; i++) {
    const char = line2[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
};
const parseRealMatchData = (values, fileName) => {
  try {
    if (values.length < 4)
      return null;
    const [, dateStr, , eventStr] = values;
    const dateParts = dateStr.split(".");
    if (dateParts.length !== 3)
      return null;
    const date = `${dateParts[2]}-${dateParts[1].padStart(2, "0")}-${dateParts[0].padStart(2, "0")}`;
    const wrestlerName = fileName.replace("_matches.csv", "").replace(/_/g, " ");
    const matchInfo = parseEventString(eventStr, wrestlerName);
    if (!matchInfo)
      return null;
    const match = {
      id: `${date}-${matchInfo.winners.join("-")}-${matchInfo.losers.join("-")}`,
      date,
      winners: matchInfo.winners,
      losers: matchInfo.losers,
      matchTime: matchInfo.matchTime,
      event: matchInfo.event,
      isTagTeam: matchInfo.isTagTeam,
      isPPV: matchInfo.isPPV
    };
    return match;
  } catch (error) {
    console.warn("Error parsing real match data:", error);
    return null;
  }
};
const parseEventString = (eventStr, wrestlerName) => {
  var _a, _b, _c, _d, _e, _f;
  try {
    const timeMatch = eventStr.match(/\((\d{1,2}:\d{2})\)/);
    const matchTime = timeMatch ? timeMatch[1] : "0:00";
    const venueMatch = eventStr.match(/@\s*([^@]+)$/);
    const venueInfo = venueMatch ? venueMatch[1].trim() : "Unknown Venue";
    const venueParts = venueInfo.split(" in ");
    const venue = ((_a = venueParts[0]) == null ? void 0 : _a.trim()) || "Unknown Venue";
    const locationParts = ((_b = venueParts[1]) == null ? void 0 : _b.split(", ")) || [];
    const city = ((_c = locationParts[0]) == null ? void 0 : _c.trim()) || "Unknown City";
    const country = ((_d = locationParts[locationParts.length - 1]) == null ? void 0 : _d.trim()) || "Unknown Country";
    const eventMatch = eventStr.match(/(?:WWE|AEW|NJPW|Impact|TNA)\s+([^@]+?)(?:\s*@|$)/);
    const eventInfo = eventMatch ? eventMatch[1].trim() : "Unknown Event";
    const eventParts = eventInfo.split(" - ");
    const eventName = ((_e = eventParts[0]) == null ? void 0 : _e.trim()) || "Unknown Event";
    const eventType = ((_f = eventParts[1]) == null ? void 0 : _f.trim()) || "Unknown Type";
    let promotion = "Unknown";
    if (eventStr.includes("WWE"))
      promotion = "WWE";
    else if (eventStr.includes("AEW"))
      promotion = "AEW";
    else if (eventStr.includes("NJPW"))
      promotion = "NJPW";
    else if (eventStr.includes("Impact") || eventStr.includes("TNA"))
      promotion = "Impact Wrestling";
    const isPPV = eventStr.includes("Premium Live Event") || eventStr.includes("Pay-Per-View") || eventStr.includes("PPV") || eventName.includes("WrestleMania") || eventName.includes("SummerSlam") || eventName.includes("Royal Rumble") || eventName.includes("Survivor Series") || eventName.includes("Money In The Bank") || eventName.includes("Hell In A Cell") || eventName.includes("Elimination Chamber") || eventName.includes("Forbidden Door") || eventName.includes("All Out") || eventName.includes("Revolution") || eventName.includes("Double or Nothing");
    const { winners, losers, isTagTeam } = parseMatchResult(eventStr, wrestlerName);
    const isSpecialEvent = eventName.includes("Forbidden Door") || eventName.includes("WrestleMania") || eventName.includes("G1 Climax") || eventName.includes("Royal Rumble");
    const event = {
      promotion,
      eventName,
      eventType,
      venue,
      city,
      country,
      isSpecialEvent
    };
    return {
      winners,
      losers,
      matchTime,
      event,
      isTagTeam,
      isPPV
    };
  } catch (error) {
    console.warn("Error parsing event string:", error);
    return null;
  }
};
const parseMatchResult = (eventStr, wrestlerName) => {
  const winners = [];
  const losers = [];
  try {
    if (eventStr.includes("defeats")) {
      const defeatMatch = eventStr.match(/^([^@]+?)\s+defeats?\s+([^@(]+?)(?:\s*\(|\s*@|$)/i);
      if (defeatMatch) {
        const winnerText = defeatMatch[1].trim();
        const loserText = defeatMatch[2].trim();
        const winnerNames = parseWrestlerNames(winnerText);
        winners.push(...winnerNames);
        const loserNames = parseWrestlerNames(loserText);
        losers.push(...loserNames);
      }
    } else if (eventStr.includes(" vs ")) {
      const vsMatch = eventStr.match(/^([^@]+?)\s+vs\.?\s+([^@(]+?)(?:\s*\(|\s*@|$)/i);
      if (vsMatch) {
        const participant1 = vsMatch[1].trim();
        const participant2 = vsMatch[2].trim();
        if (participant1.toLowerCase().includes(wrestlerName.toLowerCase())) {
          winners.push(...parseWrestlerNames(participant1));
          losers.push(...parseWrestlerNames(participant2));
        } else {
          winners.push(...parseWrestlerNames(participant2));
          losers.push(...parseWrestlerNames(participant1));
        }
      }
    }
    if (winners.length === 0 && losers.length === 0) {
      winners.push(wrestlerName);
      losers.push("Unknown Opponent");
    }
    const isTagTeam = winners.length > 1 || losers.length > 1 || eventStr.includes("&") || eventStr.includes(" and ");
    return { winners, losers, isTagTeam };
  } catch (error) {
    console.warn("Error parsing match result:", error);
    return { winners: [wrestlerName], losers: ["Unknown Opponent"], isTagTeam: false };
  }
};
const parseWrestlerNames = (namesStr) => {
  if (!namesStr)
    return [];
  let cleaned = namesStr.replace(/[()]/g, "").trim();
  const names = cleaned.split(/[&,]/).map((name) => name.trim()).filter((name) => name.length > 0);
  return names;
};
const calculateWrestlerStats = (matches) => {
  const wrestlerMap = /* @__PURE__ */ new Map();
  matches.forEach((match) => {
    match.winners.forEach((wrestler) => {
      updateWrestlerStats(wrestlerMap, wrestler, match, true);
    });
    match.losers.forEach((wrestler) => {
      updateWrestlerStats(wrestlerMap, wrestler, match, false);
    });
  });
  return Array.from(wrestlerMap.values()).sort((a, b) => b.totalMatches - a.totalMatches);
};
const updateWrestlerStats = (wrestlerMap, wrestler, match, isWinner) => {
  if (!wrestlerMap.has(wrestler)) {
    wrestlerMap.set(wrestler, {
      name: wrestler,
      totalMatches: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      averageMatchTime: 0,
      opponents: [],
      venues: [],
      promotions: [],
      tagPartners: [],
      ppvMatches: 0
    });
  }
  const stats = wrestlerMap.get(wrestler);
  stats.totalMatches++;
  if (isWinner) {
    stats.wins++;
    match.losers.forEach((opponent) => {
      if (!stats.opponents.includes(opponent)) {
        stats.opponents.push(opponent);
      }
    });
    match.winners.forEach((partner) => {
      if (partner !== wrestler && !stats.tagPartners.includes(partner)) {
        stats.tagPartners.push(partner);
      }
    });
  } else {
    stats.losses++;
    match.winners.forEach((opponent) => {
      if (!stats.opponents.includes(opponent)) {
        stats.opponents.push(opponent);
      }
    });
    match.losers.forEach((partner) => {
      if (partner !== wrestler && !stats.tagPartners.includes(partner)) {
        stats.tagPartners.push(partner);
      }
    });
  }
  if (!stats.venues.includes(match.event.venue)) {
    stats.venues.push(match.event.venue);
  }
  if (!stats.promotions.includes(match.event.promotion)) {
    stats.promotions.push(match.event.promotion);
  }
  if (match.isPPV) {
    stats.ppvMatches++;
  }
  stats.winRate = stats.totalMatches > 0 ? stats.wins / stats.totalMatches * 100 : 0;
  const matchMinutes = parseMatchTime(match.matchTime);
  stats.averageMatchTime = (stats.averageMatchTime * (stats.totalMatches - 1) + matchMinutes) / stats.totalMatches;
};
const parseMatchTime = (timeStr) => {
  if (!timeStr || timeStr === "0:00")
    return 0;
  const parts = timeStr.split(":");
  if (parts.length !== 2)
    return 0;
  const minutes = parseInt(parts[0], 10) || 0;
  const seconds = parseInt(parts[1], 10) || 0;
  return minutes + seconds / 60;
};
const calculateVenueStats = (matches) => {
  const venueMap = /* @__PURE__ */ new Map();
  matches.forEach((match) => {
    const venueKey = `${match.event.venue}-${match.event.city}`;
    if (!venueMap.has(venueKey)) {
      venueMap.set(venueKey, {
        name: match.event.venue,
        city: match.event.city,
        country: match.event.country,
        totalMatches: 0,
        wrestlers: [],
        averageMatchTime: 0,
        promotions: []
      });
    }
    const venue = venueMap.get(venueKey);
    venue.totalMatches++;
    [...match.winners, ...match.losers].forEach((wrestler) => {
      if (!venue.wrestlers.includes(wrestler)) {
        venue.wrestlers.push(wrestler);
      }
    });
    if (!venue.promotions.includes(match.event.promotion)) {
      venue.promotions.push(match.event.promotion);
    }
    const matchMinutes = parseMatchTime(match.matchTime);
    venue.averageMatchTime = (venue.averageMatchTime * (venue.totalMatches - 1) + matchMinutes) / venue.totalMatches;
  });
  return Array.from(venueMap.values()).sort((a, b) => b.totalMatches - a.totalMatches);
};
const calculateHeroMetrics = (matches) => {
  const wrestlers = /* @__PURE__ */ new Set();
  const venues = /* @__PURE__ */ new Set();
  const promotions = /* @__PURE__ */ new Set();
  let totalMatchTime = 0;
  let validMatches = 0;
  matches.forEach((match) => {
    [...match.winners, ...match.losers].forEach((wrestler) => wrestlers.add(wrestler));
    venues.add(`${match.event.venue}-${match.event.city}`);
    promotions.add(match.event.promotion);
    const matchMinutes = parseMatchTime(match.matchTime);
    if (matchMinutes > 0) {
      totalMatchTime += matchMinutes;
      validMatches++;
    }
  });
  return {
    totalMatches: matches.length,
    totalWrestlers: wrestlers.size,
    totalVenues: venues.size,
    totalPromotions: promotions.size,
    averageMatchTime: validMatches > 0 ? totalMatchTime / validMatches : 0,
    lastUpdated: /* @__PURE__ */ new Date()
  };
};
const filterMatches = (matches, filters) => {
  return matches.filter((match) => {
    const matchDate = new Date(match.date);
    if (filters.dateRange) {
      if (matchDate < filters.dateRange.start || matchDate > filters.dateRange.end) {
        return false;
      }
    }
    if (filters.promotions && filters.promotions.length > 0) {
      if (!filters.promotions.includes(match.event.promotion)) {
        return false;
      }
    }
    if (filters.wrestlers && filters.wrestlers.length > 0) {
      const matchWrestlers = [...match.winners, ...match.losers];
      const hasWrestler = filters.wrestlers.some((w) => matchWrestlers.includes(w));
      if (!hasWrestler) {
        return false;
      }
    }
    if (filters.matchType && filters.matchType !== "all") {
      if (filters.matchType === "singles" && match.isTagTeam)
        return false;
      if (filters.matchType === "tag" && !match.isTagTeam)
        return false;
    }
    if (filters.eventType && filters.eventType !== "all") {
      if (filters.eventType === "ppv" && !match.isPPV)
        return false;
      if (filters.eventType === "tv" && match.isPPV)
        return false;
    }
    return true;
  });
};
const HeroMetrics = () => {
  const { state } = useDashboard();
  const filteredData = reactExports.useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);
  const metrics = reactExports.useMemo(() => {
    return calculateHeroMetrics(filteredData);
  }, [filteredData]);
  const formatNumber = (num) => {
    return new Intl.NumberFormat().format(Math.round(num));
  };
  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };
  const metricCards = [
    {
      label: "Total Matches",
      value: formatNumber(metrics.totalMatches),
      icon: "🥊",
      color: "bg-blue-500",
      change: "+12%"
    },
    {
      label: "Wrestlers",
      value: formatNumber(metrics.totalWrestlers),
      icon: "👥",
      color: "bg-green-500",
      change: "+5%"
    },
    {
      label: "Venues",
      value: formatNumber(metrics.totalVenues),
      icon: "🏟️",
      color: "bg-purple-500",
      change: "+3%"
    },
    {
      label: "Promotions",
      value: formatNumber(metrics.totalPromotions),
      icon: "🏆",
      color: "bg-yellow-500",
      change: "+1%"
    },
    {
      label: "Avg Match Time",
      value: formatTime(metrics.averageMatchTime),
      icon: "⏱️",
      color: "bg-red-500",
      change: "-2%"
    }
  ];
  if (state.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8", children: Array.from({ length: 5 }).map((_, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "metric-card", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton h-8 w-16 mb-2" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton h-4 w-24" })
    ] }, index2)) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8", children: metricCards.map((metric, index2) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay: index2 * 0.1 },
      className: "metric-card hover:shadow-lg transition-shadow duration-200",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between mb-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl", children: metric.icon }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: `w-3 h-3 rounded-full ${metric.color}` })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "metric-value", children: metric.value }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "metric-label", children: metric.label }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: `text-xs font-medium ${metric.change.startsWith("+") ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`, children: metric.change }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-500 dark:text-gray-400", children: "vs last period" })
          ] })
        ] })
      ]
    },
    metric.label
  )) });
};
const WrestlerSearch = ({ onWrestlerSelect, isLoading }) => {
  const [searchTerm, setSearchTerm] = reactExports.useState("");
  const [searchResults, setSearchResults] = reactExports.useState([]);
  const [isSearching, setIsSearching] = reactExports.useState(false);
  const handleSearch = reactExports.useCallback(async (term) => {
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }
    setIsSearching(true);
    try {
      const results = await searchWrestlerFiles(term);
      setSearchResults(results);
    } catch (error) {
      console.error("Error searching wrestlers:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    handleSearch(value);
  };
  const handleWrestlerClick = (wrestlerFile) => {
    onWrestlerSelect(wrestlerFile);
    setSearchTerm("");
    setSearchResults([]);
  };
  const formatWrestlerName = (fileName) => {
    return fileName.replace("_matches.csv", "").replace(/_/g, " ").replace(/\./g, ". ");
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "text",
          value: searchTerm,
          onChange: handleInputChange,
          placeholder: "Search for a wrestler (e.g., CM Punk, John Cena)...",
          disabled: isLoading,
          className: "w-full px-4 py-2 pl-10 pr-4 text-sm border border-gray-300 dark:border-gray-600 rounded-lg \n                   bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 \n                   placeholder-gray-500 dark:placeholder-gray-400\n                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent\n                   disabled:opacity-50 disabled:cursor-not-allowed"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { className: "w-4 h-4 text-gray-400", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: /* @__PURE__ */ jsxRuntimeExports.jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }),
      isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-y-0 right-0 pr-3 flex items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        motion.div,
        {
          animate: { rotate: 360 },
          transition: { duration: 1, repeat: Infinity, ease: "linear" },
          className: "w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full"
        }
      ) })
    ] }),
    searchResults.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -10 },
        className: "absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto",
        children: searchResults.map((wrestlerFile, index2) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.button,
          {
            initial: { opacity: 0, x: -10 },
            animate: { opacity: 1, x: 0 },
            transition: { delay: index2 * 0.05 },
            onClick: () => handleWrestlerClick(wrestlerFile),
            className: "w-full px-4 py-2 text-left text-sm text-gray-900 dark:text-gray-100 \n                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150\n                       first:rounded-t-lg last:rounded-b-lg",
            children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🥊" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: formatWrestlerName(wrestlerFile) })
            ] })
          },
          wrestlerFile
        ))
      }
    ),
    searchTerm.length >= 2 && searchResults.length === 0 && !isSearching && /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0, y: -10 },
        animate: { opacity: 1, y: 0 },
        className: "absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4",
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center text-gray-500 dark:text-gray-400", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-lg", children: "🔍" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-sm", children: [
            'No wrestlers found for "',
            searchTerm,
            '"'
          ] })
        ] })
      }
    )
  ] });
};
const FilterPanel = () => {
  const { state, setFilters, resetFilters } = useDashboard();
  const filterOptions = reactExports.useMemo(() => {
    const promotions = [...new Set(state.data.map((match) => match.event.promotion))];
    const wrestlers = [...new Set(state.data.flatMap((match) => [...match.winners, ...match.losers]))];
    const venues = [...new Set(state.data.map((match) => match.event.venue))];
    return {
      promotions: promotions.sort(),
      wrestlers: wrestlers.sort(),
      venues: venues.sort()
    };
  }, [state.data]);
  const handlePromotionToggle = (promotion) => {
    const current = state.config.filters.promotions;
    const updated = current.includes(promotion) ? current.filter((p2) => p2 !== promotion) : [...current, promotion];
    setFilters({ promotions: updated });
  };
  const handleMatchTypeChange = (matchType) => {
    setFilters({ matchType });
  };
  const handleEventTypeChange = (eventType) => {
    setFilters({ eventType });
  };
  const handleWrestlerSelect = reactExports.useCallback((wrestlerFile) => {
    console.log("Selected wrestler file:", wrestlerFile);
  }, []);
  const getPromotionColor = (promotion) => {
    if (promotion.includes("AEW"))
      return "promotion-aew";
    if (promotion.includes("NJPW"))
      return "promotion-njpw";
    if (promotion.includes("WWE"))
      return "promotion-wwe";
    return "filter-chip";
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.5, delay: 0.2 },
      className: "card mb-8",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "card-header", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100", children: "Filters & Settings" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: resetFilters,
              className: "text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200",
              children: "Reset All"
            }
          )
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "card-content space-y-6", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "Search Wrestlers" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              WrestlerSearch,
              {
                onWrestlerSelect: handleWrestlerSelect,
                isLoading: state.isLoading
              }
            )
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "Promotions" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: filterOptions.promotions.map((promotion) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handlePromotionToggle(promotion),
                className: `${getPromotionColor(promotion)} ${state.config.filters.promotions.includes(promotion) ? "active" : ""}`,
                children: promotion
              },
              promotion
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "Match Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [
              { value: "all", label: "All Matches" },
              { value: "singles", label: "Singles" },
              { value: "tag", label: "Tag Team" },
              { value: "multi", label: "Multi-Person" }
            ].map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleMatchTypeChange(option.value),
                className: `filter-chip ${state.config.filters.matchType === option.value ? "active" : ""}`,
                children: option.label
              },
              option.value
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3", children: "Event Type" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2", children: [
              { value: "all", label: "All Events" },
              { value: "ppv", label: "Pay-Per-View" },
              { value: "tv", label: "TV Shows" },
              { value: "house", label: "House Shows" }
            ].map((option) => /* @__PURE__ */ jsxRuntimeExports.jsx(
              "button",
              {
                onClick: () => handleEventTypeChange(option.value),
                className: `filter-chip ${state.config.filters.eventType === option.value ? "active" : ""}`,
                children: option.label
              },
              option.value
            )) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-blue-600 dark:text-blue-400", children: state.config.filters.promotions.length || filterOptions.promotions.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Promotions" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-green-600 dark:text-green-400", children: state.data.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Total Matches" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-purple-600 dark:text-purple-400", children: filterOptions.wrestlers.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Wrestlers" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-2xl font-bold text-yellow-600 dark:text-yellow-400", children: filterOptions.venues.length }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-sm text-gray-500 dark:text-gray-400", children: "Venues" })
            ] })
          ] })
        ] })
      ]
    }
  );
};
const VisualizationTabs = () => {
  const { state, setChartType } = useDashboard();
  const tabs = [
    {
      id: "network",
      label: "Network Graph",
      icon: "🕸️",
      description: "Wrestler relationships and match connections"
    },
    {
      id: "timeline",
      label: "Timeline",
      icon: "📈",
      description: "Performance trends over time"
    },
    {
      id: "radial",
      label: "Radial Chart",
      icon: "🎯",
      description: "Winner's circle and victory patterns"
    },
    {
      id: "map",
      label: "Venue Map",
      icon: "🗺️",
      description: "Global wrestling venues and events"
    },
    {
      id: "matrix",
      label: "Match Matrix",
      icon: "📊",
      description: "Head-to-head comparison matrix"
    }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "-mb-px flex space-x-8 overflow-x-auto scrollbar-hide", children: tabs.map((tab) => {
    const isActive = state.config.chartType === tab.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.button,
      {
        whileHover: { y: -2 },
        whileTap: { y: 0 },
        onClick: () => setChartType(tab.id),
        className: `group relative min-w-0 flex-1 overflow-hidden py-4 px-1 text-center font-medium focus:outline-none transition-all duration-200 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center space-y-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-2xl", children: tab.icon }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: tab.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs text-gray-400 dark:text-gray-500 max-w-32 leading-tight", children: tab.description })
          ] }),
          isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              layoutId: "activeTab",
              className: "absolute inset-x-0 bottom-0 h-0.5 bg-blue-600 dark:bg-blue-400",
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              transition: { duration: 0.2 }
            }
          )
        ]
      },
      tab.id
    );
  }) }) }) });
};
const NetworkGraph = () => {
  const svgRef = reactExports.useRef(null);
  const { state } = useDashboard();
  const filteredData = reactExports.useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);
  const { nodes, links } = reactExports.useMemo(() => {
    const wrestlerStats = /* @__PURE__ */ new Map();
    const connections = /* @__PURE__ */ new Map();
    filteredData.forEach((match) => {
      const allWrestlers = [...match.winners, ...match.losers];
      [...match.winners, ...match.losers].forEach((wrestler) => {
        if (!wrestlerStats.has(wrestler)) {
          wrestlerStats.set(wrestler, { wins: 0, losses: 0, opponents: /* @__PURE__ */ new Set() });
        }
        const stats = wrestlerStats.get(wrestler);
        if (match.winners.includes(wrestler)) {
          stats.wins++;
          match.losers.forEach((opponent) => stats.opponents.add(opponent));
        } else {
          stats.losses++;
          match.winners.forEach((opponent) => stats.opponents.add(opponent));
        }
      });
      for (let i = 0; i < allWrestlers.length; i++) {
        for (let j = i + 1; j < allWrestlers.length; j++) {
          const key = [allWrestlers[i], allWrestlers[j]].sort().join("-");
          connections.set(key, (connections.get(key) || 0) + 1);
        }
      }
    });
    const nodes2 = Array.from(wrestlerStats.entries()).filter(([_, stats]) => stats.wins + stats.losses >= 2).slice(0, 50).map(([name, stats]) => ({
      id: name,
      name,
      group: getWrestlerGroup(name),
      totalMatches: stats.wins + stats.losses,
      wins: stats.wins,
      radius: Math.max(5, Math.min(25, (stats.wins + stats.losses) * 2))
    }));
    const nodeIds = new Set(nodes2.map((n2) => n2.id));
    const links2 = Array.from(connections.entries()).filter(([key, count]) => {
      const [wrestler1, wrestler2] = key.split("-");
      return nodeIds.has(wrestler1) && nodeIds.has(wrestler2) && count >= 1;
    }).map(([key, count]) => {
      const [source, target] = key.split("-");
      return {
        source,
        target,
        value: Math.min(10, count * 2),
        matchCount: count
      };
    });
    return { nodes: nodes2, links: links2 };
  }, [filteredData]);
  const getWrestlerGroup = (name) => {
    if (name.includes("Elite") || name.includes("Young Bucks") || name.includes("Kenny Omega"))
      return "elite";
    if (name.includes("FTR") || name.includes("Dax") || name.includes("Cash"))
      return "ftr";
    if (name.includes("Matriarchy") || name.includes("Killswitch") || name.includes("Kip"))
      return "matriarchy";
    if (name.includes("Thunder Rosa") || name.includes("Hikaru") || name.includes("Jade"))
      return "women";
    if (name.includes("Reigns") || name.includes("Rollins") || name.includes("Drew"))
      return "wwe";
    if (name.includes("Okada") || name.includes("Tanahashi") || name.includes("Ospreay"))
      return "njpw";
    return "independent";
  };
  reactExports.useEffect(() => {
    var _a;
    if (!svgRef.current || nodes.length === 0)
      return;
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const container = (_a = svg.node()) == null ? void 0 : _a.getBoundingClientRect();
    if (!container)
      return;
    const width = container.width;
    const height = Math.max(400, container.height);
    const zoom$1 = zoom().scaleExtent([0.1, 4]).on("zoom", (event) => {
      g.attr("transform", event.transform);
    });
    svg.call(zoom$1);
    const g = svg.append("g");
    const colorScale = ordinal(category10);
    const simulation$1 = simulation(nodes).force("link", link(links).id((d) => d.id).distance(50)).force("charge", manyBody().strength(-300)).force("center", center(width / 2, height / 2)).force("collision", collide().radius((d) => d.radius + 2));
    const link$1 = g.append("g").selectAll("line").data(links).join("line").attr("stroke", "#999").attr("stroke-opacity", 0.6).attr("stroke-width", (d) => Math.sqrt(d.value));
    const node = g.append("g").selectAll("circle").data(nodes).join("circle").attr("r", (d) => d.radius).attr("fill", (d) => colorScale(d.group)).attr("stroke", "#fff").attr("stroke-width", 2).style("cursor", "pointer");
    const labels = g.append("g").selectAll("text").data(nodes.filter((d) => d.totalMatches > 5)).join("text").text((d) => d.name).attr("font-size", "12px").attr("font-family", "Inter, sans-serif").attr("fill", "currentColor").attr("text-anchor", "middle").attr("dy", ".3em").style("pointer-events", "none");
    const tooltip = select("body").append("div").attr("class", "tooltip").style("position", "absolute").style("padding", "10px").style("background", "rgba(0, 0, 0, 0.8)").style("color", "white").style("border-radius", "5px").style("pointer-events", "none").style("opacity", 0);
    node.on("mouseover", function(event, d) {
      select(this).attr("stroke-width", 4);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`
          <strong>${d.name}</strong><br/>
          Matches: ${d.totalMatches}<br/>
          Wins: ${d.wins}<br/>
          Win Rate: ${(d.wins / d.totalMatches * 100).toFixed(1)}%
        `).style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
    }).on("mouseout", function() {
      select(this).attr("stroke-width", 2);
      tooltip.transition().duration(500).style("opacity", 0);
    });
    const drag$1 = drag().on("start", (event, d) => {
      if (!event.active)
        simulation$1.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }).on("drag", (event, d) => {
      d.fx = event.x;
      d.fy = event.y;
    }).on("end", (event, d) => {
      if (!event.active)
        simulation$1.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    });
    node.call(drag$1);
    simulation$1.on("tick", () => {
      link$1.attr("x1", (d) => d.source.x).attr("y1", (d) => d.source.y).attr("x2", (d) => d.target.x).attr("y2", (d) => d.target.y);
      node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      labels.attr("x", (d) => d.x).attr("y", (d) => d.y + d.radius + 15);
    });
    return () => {
      tooltip.remove();
      simulation$1.stop();
    };
  }, [nodes, links]);
  if (state.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chart-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton w-full h-full" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 },
      className: "chart-container",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "Wrestler Network Graph" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Interactive network showing wrestler relationships and match connections" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400", children: "• Circle size = total matches • Drag to move • Zoom to explore" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            ref: svgRef,
            width: "100%",
            height: "100%",
            className: "w-full h-full",
            style: { minHeight: "500px" }
          }
        )
      ]
    }
  );
};
const TimelineChart = () => {
  const svgRef = reactExports.useRef(null);
  const { state } = useDashboard();
  const filteredData = reactExports.useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);
  const timelineData = reactExports.useMemo(() => {
    const monthlyStats = /* @__PURE__ */ new Map();
    filteredData.forEach((match) => {
      const date = new Date(match.date);
      const monthKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, "0")}`;
      if (!monthlyStats.has(monthKey)) {
        monthlyStats.set(monthKey, { wins: 0, losses: 0, totalMatches: 0 });
      }
      const stats = monthlyStats.get(monthKey);
      stats.totalMatches++;
      if (match.isPPV) {
        stats.wins += 2;
      } else {
        stats.wins += 1;
      }
    });
    return Array.from(monthlyStats.entries()).map(([month, stats]) => ({
      date: /* @__PURE__ */ new Date(month + "-01"),
      totalMatches: stats.totalMatches,
      value: stats.totalMatches
    })).sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [filteredData]);
  reactExports.useEffect(() => {
    var _a;
    if (!svgRef.current || timelineData.length === 0)
      return;
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const container = (_a = svg.node()) == null ? void 0 : _a.getBoundingClientRect();
    if (!container)
      return;
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = container.width - margin.left - margin.right;
    const height = Math.max(300, container.height - margin.top - margin.bottom);
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const xScale = time().domain(extent(timelineData, (d) => d.date)).range([0, width]);
    const yScale = linear().domain([0, max(timelineData, (d) => d.value) || 0]).nice().range([height, 0]);
    const line$1 = line().x((d) => xScale(d.date)).y((d) => yScale(d.value)).curve(monotoneX);
    const area$1 = area().x((d) => xScale(d.date)).y0(height).y1((d) => yScale(d.value)).curve(monotoneX);
    const gradient = svg.append("defs").append("linearGradient").attr("id", "timelineGradient").attr("gradientUnits", "userSpaceOnUse").attr("x1", 0).attr("y1", height).attr("x2", 0).attr("y2", 0);
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.1);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.6);
    g.append("path").datum(timelineData).attr("fill", "url(#timelineGradient)").attr("d", area$1);
    g.append("path").datum(timelineData).attr("fill", "none").attr("stroke", "#3b82f6").attr("stroke-width", 3).attr("d", line$1);
    g.selectAll(".dot").data(timelineData).join("circle").attr("class", "dot").attr("cx", (d) => xScale(d.date)).attr("cy", (d) => yScale(d.value)).attr("r", 4).attr("fill", "#3b82f6").attr("stroke", "#fff").attr("stroke-width", 2).style("cursor", "pointer");
    g.append("g").attr("transform", `translate(0,${height})`).call(axisBottom(xScale).tickFormat(timeFormat("%b %Y")));
    g.append("g").call(axisLeft(yScale));
    g.append("text").attr("transform", "rotate(-90)").attr("y", 0 - margin.left).attr("x", 0 - height / 2).attr("dy", "1em").style("text-anchor", "middle").style("font-size", "12px").style("fill", "currentColor").text("Number of Matches");
    g.append("text").attr("transform", `translate(${width / 2}, ${height + margin.bottom})`).style("text-anchor", "middle").style("font-size", "12px").style("fill", "currentColor").text("Time Period");
    const tooltip = select("body").append("div").attr("class", "tooltip").style("position", "absolute").style("padding", "10px").style("background", "rgba(0, 0, 0, 0.8)").style("color", "white").style("border-radius", "5px").style("pointer-events", "none").style("opacity", 0);
    g.selectAll(".dot").on("mouseover", function(event, d) {
      select(this).attr("r", 6);
      tooltip.transition().duration(200).style("opacity", 0.9);
      tooltip.html(`
          <strong>${timeFormat("%B %Y")(d.date)}</strong><br/>
          Matches: ${d.totalMatches}
        `).style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
    }).on("mouseout", function() {
      select(this).attr("r", 4);
      tooltip.transition().duration(500).style("opacity", 0);
    });
    return () => {
      tooltip.remove();
    };
  }, [timelineData]);
  if (state.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chart-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton w-full h-full" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 },
      className: "chart-container",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "Match Timeline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Wrestling match frequency over time" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            ref: svgRef,
            width: "100%",
            height: "100%",
            className: "w-full h-full",
            style: { minHeight: "400px" }
          }
        )
      ]
    }
  );
};
const RadialChart = () => {
  const svgRef = reactExports.useRef(null);
  const { state } = useDashboard();
  const filteredData = reactExports.useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);
  const radialData = reactExports.useMemo(() => {
    const wrestlerStats = calculateWrestlerStats(filteredData);
    return wrestlerStats.filter((wrestler) => wrestler.totalMatches >= 3).slice(0, 20).map((wrestler) => ({
      name: wrestler.name,
      wins: wrestler.wins,
      losses: wrestler.losses,
      totalMatches: wrestler.totalMatches,
      winRate: wrestler.winRate
    }));
  }, [filteredData]);
  reactExports.useEffect(() => {
    var _a;
    if (!svgRef.current || radialData.length === 0)
      return;
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const container = (_a = svg.node()) == null ? void 0 : _a.getBoundingClientRect();
    if (!container)
      return;
    const width = container.width;
    const height = Math.max(400, container.height);
    const radius = Math.min(width, height) / 2 - 40;
    const g = svg.append("g").attr("transform", `translate(${width / 2},${height / 2})`);
    const angleScale = band().domain(radialData.map((d) => d.name)).range([0, 2 * Math.PI]).padding(0.1);
    const radiusScale = linear().domain([0, max(radialData, (d) => d.totalMatches) || 0]).range([50, radius]);
    const colorScale = sequential(RdYlGn).domain([0, 100]);
    const gridLevels = [25, 50, 75, 100];
    gridLevels.forEach((level) => {
      const gridRadius = radiusScale(level);
      g.append("circle").attr("r", gridRadius).attr("fill", "none").attr("stroke", "#e5e7eb").attr("stroke-width", 1).attr("opacity", 0.5);
      g.append("text").attr("x", 5).attr("y", -gridRadius).attr("dy", "0.35em").style("text-anchor", "start").style("font-size", "10px").style("fill", "#6b7280").text(`${level} matches`);
    });
    const arc$1 = arc().innerRadius(50).outerRadius((d) => radiusScale(d.totalMatches)).startAngle((d) => angleScale(d.name)).endAngle((d) => angleScale(d.name) + angleScale.bandwidth()).cornerRadius(2);
    const arcs = g.selectAll(".arc").data(radialData).join("g").attr("class", "arc");
    arcs.append("path").attr("d", arc$1).attr("fill", (d) => colorScale(d.winRate)).attr("stroke", "#fff").attr("stroke-width", 1).style("cursor", "pointer").on("mouseover", function(event, d) {
      select(this).attr("opacity", 0.8);
      const tooltip = select("body").append("div").attr("class", "radial-tooltip tooltip").style("position", "absolute").style("padding", "10px").style("background", "rgba(0, 0, 0, 0.8)").style("color", "white").style("border-radius", "5px").style("pointer-events", "none");
      tooltip.style("opacity", 1).html(`
            <strong>${d.name}</strong><br/>
            Total Matches: ${d.totalMatches}<br/>
            Wins: ${d.wins}<br/>
            Losses: ${d.losses}<br/>
            Win Rate: ${d.winRate.toFixed(1)}%
          `).style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
    }).on("mouseout", function() {
      select(this).attr("opacity", 1);
      select(".radial-tooltip").style("opacity", 0);
    });
    arcs.append("text").attr("transform", (d) => {
      const angle = angleScale(d.name) + angleScale.bandwidth() / 2;
      const labelRadius = radiusScale(d.totalMatches) + 10;
      const x = Math.sin(angle) * labelRadius;
      const y = -Math.cos(angle) * labelRadius;
      return `translate(${x},${y}) rotate(${angle * 180 / Math.PI - 90})`;
    }).attr("text-anchor", (d) => {
      const angle = angleScale(d.name) + angleScale.bandwidth() / 2;
      return angle > Math.PI ? "end" : "start";
    }).attr("dy", "0.35em").style("font-size", "11px").style("font-weight", "500").style("fill", "currentColor").text((d) => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name);
    g.append("text").attr("text-anchor", "middle").attr("dy", "-0.5em").style("font-size", "14px").style("font-weight", "bold").style("fill", "currentColor").text("Wrestler");
    g.append("text").attr("text-anchor", "middle").attr("dy", "1em").style("font-size", "14px").style("font-weight", "bold").style("fill", "currentColor").text("Performance");
    const legend = svg.append("g").attr("transform", `translate(20, ${height - 80})`);
    const legendScale = linear().domain([0, 100]).range([0, 200]);
    const legendAxis = axisBottom(legendScale).tickSize(-15).tickValues([0, 25, 50, 75, 100]);
    legend.append("g").attr("transform", "translate(0, 15)").call(legendAxis);
    const gradientId = "radial-legend-gradient";
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient").attr("id", gradientId).attr("x1", "0%").attr("y1", "0%").attr("x2", "100%").attr("y2", "0%");
    for (let i = 0; i <= 100; i += 10) {
      gradient.append("stop").attr("offset", `${i}%`).attr("stop-color", colorScale(i));
    }
    legend.append("rect").attr("width", 200).attr("height", 15).style("fill", `url(#${gradientId})`);
    legend.append("text").attr("x", 100).attr("y", -5).attr("text-anchor", "middle").style("font-size", "12px").style("fill", "currentColor").text("Win Rate (%)");
  }, [radialData]);
  if (state.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chart-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton w-full h-full" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 },
      className: "chart-container",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "Winner's Circle" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Radial chart showing wrestler performance and win rates" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400", children: "• Arc length = total matches • Color = win rate" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            ref: svgRef,
            width: "100%",
            height: "100%",
            className: "w-full h-full",
            style: { minHeight: "500px" }
          }
        )
      ]
    }
  );
};
const VenueMap = () => {
  const svgRef = reactExports.useRef(null);
  const { state } = useDashboard();
  const filteredData = reactExports.useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);
  const venueData = reactExports.useMemo(() => {
    const venueStats = calculateVenueStats(filteredData);
    const venueCoordinates = {
      "The O2": [-0.1278, 51.5074],
      // London
      "Daily's Place": [-81.6557, 30.337],
      // Jacksonville
      "Korakuen Hall": [139.6917, 35.6895],
      // Tokyo
      "Allegiant Stadium": [-115.1398, 36.1699],
      // Las Vegas
      "Wembley Stadium": [-0.2795, 51.556],
      // London
      "United Center": [-87.6298, 41.8781],
      // Chicago
      "MetLife Stadium": [-74.0059, 40.8135],
      // New Jersey
      "Tokyo Dome": [139.7518, 35.7056],
      // Tokyo
      "Ryogoku Kokugikan": [139.7928, 35.6966]
      // Tokyo
    };
    return venueStats.map((venue) => {
      const coords = venueCoordinates[venue.name] || [0, 0];
      return {
        ...venue,
        longitude: coords[0],
        latitude: coords[1]
      };
    }).filter((venue) => venue.longitude !== 0 && venue.latitude !== 0);
  }, [filteredData]);
  reactExports.useEffect(() => {
    var _a;
    if (!svgRef.current || venueData.length === 0)
      return;
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const container = (_a = svg.node()) == null ? void 0 : _a.getBoundingClientRect();
    if (!container)
      return;
    const width = container.width;
    const height = Math.max(400, container.height);
    const projection = naturalEarth1().scale(100).translate([width / 2, height / 2]);
    const path = index$1().projection(projection);
    const graticule$1 = graticule();
    svg.append("path").datum(graticule$1).attr("d", path).attr("fill", "none").attr("stroke", "#e5e7eb").attr("stroke-width", 0.5);
    const landFeatures = [
      { type: "Feature", geometry: { type: "Polygon", coordinates: [[[-180, -90], [-180, 90], [180, 90], [180, -90], [-180, -90]]] } }
    ];
    svg.selectAll(".land").data(landFeatures).join("path").attr("class", "land").attr("d", path).attr("fill", "#f3f4f6").attr("stroke", "#d1d5db").attr("stroke-width", 0.5);
    const sizeScale = sqrt().domain([0, max(venueData, (d) => d.totalMatches) || 0]).range([4, 20]);
    const colorScale = sequential(Blues).domain([0, max(venueData, (d) => d.totalMatches) || 0]);
    const venues = svg.selectAll(".venue").data(venueData).join("g").attr("class", "venue").attr("transform", (d) => {
      const coords = projection([d.longitude, d.latitude]);
      return coords ? `translate(${coords[0]},${coords[1]})` : "translate(0,0)";
    });
    venues.append("circle").attr("r", (d) => sizeScale(d.totalMatches)).attr("fill", (d) => colorScale(d.totalMatches)).attr("stroke", "#fff").attr("stroke-width", 2).attr("opacity", 0.8).style("cursor", "pointer").on("mouseover", function(event, d) {
      select(this).attr("stroke-width", 4);
      const tooltip = select("body").selectAll(".venue-tooltip").data([d]);
      const tooltipEnter = tooltip.enter().append("div").attr("class", "venue-tooltip tooltip");
      tooltipEnter.merge(tooltip).style("opacity", 1).html(`
            <strong>${d.name}</strong><br/>
            ${d.city}, ${d.country}<br/>
            Total Matches: ${d.totalMatches}<br/>
            Wrestlers: ${d.wrestlers.length}<br/>
            Promotions: ${d.promotions.join(", ")}
          `).style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
    }).on("mouseout", function() {
      select(this).attr("stroke-width", 2);
      select(".venue-tooltip").style("opacity", 0);
    });
    venues.filter((d) => d.totalMatches > 5).append("text").attr("dy", (d) => sizeScale(d.totalMatches) + 15).attr("text-anchor", "middle").style("font-size", "10px").style("font-weight", "500").style("fill", "currentColor").style("pointer-events", "none").text((d) => d.name);
    const legend = svg.append("g").attr("transform", `translate(${width - 200}, 20)`);
    const legendData = [
      { size: 5, matches: 5, label: "5 matches" },
      { size: 10, matches: 10, label: "10 matches" },
      { size: 15, matches: 15, label: "15+ matches" }
    ];
    const legendItems = legend.selectAll(".legend-item").data(legendData).join("g").attr("class", "legend-item").attr("transform", (d, i) => `translate(0, ${i * 25})`);
    legendItems.append("circle").attr("r", (d) => d.size).attr("fill", (d) => colorScale(d.matches)).attr("stroke", "#fff").attr("stroke-width", 1);
    legendItems.append("text").attr("x", 25).attr("y", 0).attr("dy", "0.35em").style("font-size", "12px").style("fill", "currentColor").text((d) => d.label);
    legend.append("text").attr("x", 0).attr("y", -10).style("font-size", "12px").style("font-weight", "bold").style("fill", "currentColor").text("Venue Activity");
    const zoom$1 = zoom().scaleExtent([0.5, 8]).on("zoom", (event) => {
      svg.selectAll("path, circle, text").attr("transform", event.transform);
    });
    svg.call(zoom$1);
  }, [venueData]);
  if (state.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chart-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton w-full h-full" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 },
      className: "chart-container",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "Global Venue Map" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Wrestling venues around the world" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400", children: "• Circle size = total matches • Color intensity = activity level" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            ref: svgRef,
            width: "100%",
            height: "100%",
            className: "w-full h-full",
            style: { minHeight: "500px" }
          }
        )
      ]
    }
  );
};
const WrestlerMatrix = () => {
  const svgRef = reactExports.useRef(null);
  const { state } = useDashboard();
  const filteredData = reactExports.useMemo(() => {
    return filterMatches(state.data, state.config.filters);
  }, [state.data, state.config.filters]);
  const matrixData = reactExports.useMemo(() => {
    const wrestlerStats = calculateWrestlerStats(filteredData);
    const topWrestlers = wrestlerStats.slice(0, 15);
    const matrix = [];
    const wrestlerNames = topWrestlers.map((w) => w.name);
    for (let i = 0; i < wrestlerNames.length; i++) {
      matrix[i] = new Array(wrestlerNames.length).fill(0);
    }
    filteredData.forEach((match) => {
      match.winners.forEach((winner) => {
        match.losers.forEach((loser) => {
          const winnerIndex = wrestlerNames.indexOf(winner);
          const loserIndex = wrestlerNames.indexOf(loser);
          if (winnerIndex !== -1 && loserIndex !== -1) {
            matrix[winnerIndex][loserIndex]++;
          }
        });
      });
    });
    return {
      matrix,
      wrestlers: wrestlerNames,
      stats: topWrestlers
    };
  }, [filteredData]);
  reactExports.useEffect(() => {
    var _a;
    if (!svgRef.current || matrixData.wrestlers.length === 0)
      return;
    const svg = select(svgRef.current);
    svg.selectAll("*").remove();
    const container = (_a = svg.node()) == null ? void 0 : _a.getBoundingClientRect();
    if (!container)
      return;
    const margin = { top: 80, right: 20, bottom: 20, left: 120 };
    const cellSize = Math.min(
      (container.width - margin.left - margin.right) / matrixData.wrestlers.length,
      (container.height - margin.top - margin.bottom) / matrixData.wrestlers.length,
      30
    );
    const width = cellSize * matrixData.wrestlers.length;
    const height = cellSize * matrixData.wrestlers.length;
    const g = svg.append("g").attr("transform", `translate(${margin.left},${margin.top})`);
    const maxValue = max(matrixData.matrix.flat()) || 1;
    const colorScale = sequential(Blues).domain([0, maxValue]);
    const rows = g.selectAll(".row").data(matrixData.matrix).join("g").attr("class", "row").attr("transform", (d, i) => `translate(0, ${i * cellSize})`);
    rows.selectAll(".cell").data((d, i) => d.map((value, j) => ({ value, row: i, col: j }))).join("rect").attr("class", "cell").attr("x", (d) => d.col * cellSize).attr("width", cellSize).attr("height", cellSize).attr("fill", (d) => d.value > 0 ? colorScale(d.value) : "#f9fafb").attr("stroke", "#fff").attr("stroke-width", 1).style("cursor", "pointer").on("mouseover", function(event, d) {
      if (d.value === 0)
        return;
      select(this).attr("stroke-width", 2).attr("stroke", "#000");
      rows.selectAll(".cell").filter((cell) => cell.row === d.row || cell.col === d.col).attr("opacity", 0.7);
      const tooltip = select("body").selectAll(".matrix-tooltip").data([d]);
      const tooltipEnter = tooltip.enter().append("div").attr("class", "matrix-tooltip tooltip");
      tooltipEnter.merge(tooltip).style("opacity", 1).html(`
            <strong>${matrixData.wrestlers[d.row]}</strong><br/>
            defeated<br/>
            <strong>${matrixData.wrestlers[d.col]}</strong><br/>
            ${d.value} time${d.value !== 1 ? "s" : ""}
          `).style("left", event.pageX + 10 + "px").style("top", event.pageY - 28 + "px");
    }).on("mouseout", function() {
      select(this).attr("stroke-width", 1).attr("stroke", "#fff");
      rows.selectAll(".cell").attr("opacity", 1);
      select(".matrix-tooltip").style("opacity", 0);
    });
    rows.selectAll(".cell-text").data((d, i) => d.map((value, j) => ({ value, row: i, col: j }))).join("text").attr("class", "cell-text").attr("x", (d) => d.col * cellSize + cellSize / 2).attr("y", (d) => cellSize / 2).attr("dy", "0.35em").attr("text-anchor", "middle").style("font-size", Math.min(cellSize / 3, 12) + "px").style("font-weight", "600").style("fill", (d) => d.value > maxValue / 2 ? "#fff" : "#1f2937").style("pointer-events", "none").text((d) => d.value > 0 ? d.value : "");
    g.selectAll(".row-label").data(matrixData.wrestlers).join("text").attr("class", "row-label").attr("x", -10).attr("y", (d, i) => i * cellSize + cellSize / 2).attr("dy", "0.35em").attr("text-anchor", "end").style("font-size", Math.min(cellSize / 2.5, 11) + "px").style("font-weight", "500").style("fill", "currentColor").text((d) => d.length > 12 ? d.substring(0, 12) + "..." : d);
    g.selectAll(".col-label").data(matrixData.wrestlers).join("text").attr("class", "col-label").attr("x", (d, i) => i * cellSize + cellSize / 2).attr("y", -10).attr("dy", "0.35em").attr("text-anchor", "start").attr("transform", (d, i) => `rotate(-45, ${i * cellSize + cellSize / 2}, -10)`).style("font-size", Math.min(cellSize / 2.5, 11) + "px").style("font-weight", "500").style("fill", "currentColor").text((d) => d.length > 12 ? d.substring(0, 12) + "..." : d);
    svg.append("text").attr("x", margin.left / 2).attr("y", margin.top + height / 2).attr("text-anchor", "middle").attr("transform", `rotate(-90, ${margin.left / 2}, ${margin.top + height / 2})`).style("font-size", "14px").style("font-weight", "bold").style("fill", "currentColor").text("Winners");
    svg.append("text").attr("x", margin.left + width / 2).attr("y", margin.top / 2).attr("text-anchor", "middle").style("font-size", "14px").style("font-weight", "bold").style("fill", "currentColor").text("Defeated");
    const legend = svg.append("g").attr("transform", `translate(${margin.left + width + 20}, ${margin.top})`);
    const legendHeight = 150;
    const legendWidth = 20;
    const legendScale = linear().domain([0, maxValue]).range([legendHeight, 0]);
    const legendAxis = axisRight(legendScale).tickSize(legendWidth).tickValues(range(0, maxValue + 1).filter((d) => d % Math.ceil(maxValue / 5) === 0));
    legend.append("g").attr("transform", `translate(${legendWidth}, 0)`).call(legendAxis);
    const gradientId = "matrix-legend-gradient";
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient").attr("id", gradientId).attr("x1", "0%").attr("y1", "100%").attr("x2", "0%").attr("y2", "0%");
    for (let i = 0; i <= 100; i += 10) {
      gradient.append("stop").attr("offset", `${i}%`).attr("stop-color", colorScale(maxValue * i / 100));
    }
    legend.append("rect").attr("width", legendWidth).attr("height", legendHeight).style("fill", `url(#${gradientId})`);
    legend.append("text").attr("x", legendWidth / 2).attr("y", -10).attr("text-anchor", "middle").style("font-size", "12px").style("font-weight", "bold").style("fill", "currentColor").text("Victories");
  }, [matrixData]);
  if (state.isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "chart-container", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "loading-skeleton w-full h-full" }) }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 },
      transition: { duration: 0.5 },
      className: "chart-container",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-4 left-4 z-10", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "Head-to-Head Matrix" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: "Direct competition results between top wrestlers" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 text-xs text-gray-500 dark:text-gray-400", children: "• Rows = winners • Columns = defeated • Color intensity = frequency" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "svg",
          {
            ref: svgRef,
            width: "100%",
            height: "100%",
            className: "w-full h-full",
            style: { minHeight: "600px" }
          }
        )
      ]
    }
  );
};
const LoadingSpinner = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-96", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        animate: { rotate: 360 },
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        },
        className: "w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full mx-auto mb-4"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.h3,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.2 },
        className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2",
        children: "Loading Wrestling Data"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.p,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.4 },
        className: "text-gray-600 dark:text-gray-400",
        children: "Analyzing matches and preparing visualizations..."
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.6 },
        className: "mt-4 text-sm text-gray-500 dark:text-gray-400",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            animate: { opacity: [0.5, 1, 0.5] },
            transition: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            children: "🥊 Loading 594 wrestler datasets..."
          }
        )
      }
    )
  ] }) });
};
class ErrorBoundary extends reactExports.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }
  render() {
    var _a;
    if (this.state.hasError) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-96", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center max-w-md mx-auto p-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-4xl mb-4", children: "⚠️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-gray-100 mb-2", children: "Something went wrong" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 dark:text-gray-400 mb-4", children: "An error occurred while rendering the visualization. Please try refreshing the page." }),
        this.state.error && /* @__PURE__ */ jsxRuntimeExports.jsxs("details", { className: "text-left bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("summary", { className: "cursor-pointer font-medium mb-2", children: "Error Details (Development)" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("pre", { className: "text-red-600 dark:text-red-400 whitespace-pre-wrap", children: [
            this.state.error.toString(),
            (_a = this.state.errorInfo) == null ? void 0 : _a.componentStack
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            onClick: () => window.location.reload(),
            className: "btn-primary mt-4",
            children: "Refresh Page"
          }
        )
      ] }) });
    }
    return this.props.children;
  }
}
const DashboardContent = () => {
  const { state, setLoading, setError, setData } = useDashboard();
  const [darkMode, setDarkMode] = reactExports.useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("darkMode") === "true" || !localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  reactExports.useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log("Loading wrestling data from multiple CSV files...");
        const matches = await parseMultipleCSVs();
        if (matches.length === 0) {
          throw new Error("No valid match data found");
        }
        console.log(`Loaded ${matches.length} matches from wrestling data`);
        setData(matches);
        setError(null);
      } catch (error) {
        console.error("Error loading wrestling data:", error);
        setError(error instanceof Error ? error.message : "Failed to load wrestling data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [setLoading, setError, setData]);
  reactExports.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  const renderVisualization = () => {
    if (state.isLoading) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx(LoadingSpinner, {});
    }
    if (state.error) {
      return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center justify-center h-96", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-500 text-xl mb-2", children: "⚠️" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2", children: "Error Loading Data" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-gray-600 dark:text-gray-400", children: state.error })
      ] }) });
    }
    switch (state.config.chartType) {
      case "network":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkGraph, {});
      case "timeline":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(TimelineChart, {});
      case "radial":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(RadialChart, {});
      case "map":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(VenueMap, {});
      case "matrix":
        return /* @__PURE__ */ jsxRuntimeExports.jsx(WrestlerMatrix, {});
      default:
        return /* @__PURE__ */ jsxRuntimeExports.jsx(NetworkGraph, {});
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Header, { darkMode, toggleDarkMode }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "container mx-auto px-4 py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center mb-12", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-4xl md:text-6xl font-display font-bold text-gray-900 dark:text-gray-100 mb-4", children: [
              "Wrestling Analytics",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient block", children: "Dashboard" })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto", children: "Transform raw wrestling match data into compelling, interactive visual narratives. Explore patterns, analyze performance, and discover insights in professional wrestling." })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(HeroMetrics, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPanel, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(VisualizationTabs, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              initial: { opacity: 0, scale: 0.95 },
              animate: { opacity: 1, scale: 1 },
              transition: { duration: 0.3 },
              className: "mb-8",
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: renderVisualization() })
            },
            state.config.chartType
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx("footer", { className: "text-center text-gray-500 dark:text-gray-400 py-8 border-t border-gray-200 dark:border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
            "Built with ❤️ for wrestling fans • Data visualization by",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "a",
              {
                href: "https://jesserodriguez.me",
                target: "_blank",
                rel: "noopener noreferrer",
                className: "text-blue-600 dark:text-blue-400 hover:underline",
                children: "Jesse Rodriguez"
              }
            )
          ] }) })
        ]
      }
    ) })
  ] });
};
const App = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ErrorBoundary, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardProvider, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DashboardContent, {}) }) });
};
const index = "";
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
);
