// Real wrestling ratings data - Last 52 weeks
// Generated from scraped cable viewership data
// Data source: Various wrestling ratings websites
// Run "node scraper.js" then "node process-data.js" to update

const ratingsData = [
  {
    "date": "2024-11-05",
    "dateFormatted": "Nov 4, 2024",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2024-11-12",
    "dateFormatted": "Nov 11, 2024",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2024-11-19",
    "dateFormatted": "Nov 18, 2024",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2024-11-26",
    "dateFormatted": "Nov 25, 2024",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2024-12-03",
    "dateFormatted": "Dec 2, 2024",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2024-12-10",
    "dateFormatted": "Dec 9, 2024",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2024-12-17",
    "dateFormatted": "Dec 16, 2024",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2024-12-24",
    "dateFormatted": "Dec 23, 2024",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2024-12-31",
    "dateFormatted": "Dec 30, 2024",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-01-07",
    "dateFormatted": "Jan 6, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-01-14",
    "dateFormatted": "Jan 13, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-01-21",
    "dateFormatted": "Jan 20, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-01-28",
    "dateFormatted": "Jan 27, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-02-04",
    "dateFormatted": "Feb 3, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-02-11",
    "dateFormatted": "Feb 10, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-02-18",
    "dateFormatted": "Feb 17, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-02-25",
    "dateFormatted": "Feb 24, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-03-04",
    "dateFormatted": "Mar 3, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-03-11",
    "dateFormatted": "Mar 10, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-03-18",
    "dateFormatted": "Mar 17, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-03-25",
    "dateFormatted": "Mar 24, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-04-01",
    "dateFormatted": "Mar 31, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-04-08",
    "dateFormatted": "Apr 7, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-04-15",
    "dateFormatted": "Apr 14, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-04-22",
    "dateFormatted": "Apr 21, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-04-29",
    "dateFormatted": "Apr 28, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-05-06",
    "dateFormatted": "May 5, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-05-13",
    "dateFormatted": "May 12, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-05-20",
    "dateFormatted": "May 19, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-05-27",
    "dateFormatted": "May 26, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-06-03",
    "dateFormatted": "Jun 2, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-06-10",
    "dateFormatted": "Jun 9, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-06-17",
    "dateFormatted": "Jun 16, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-06-24",
    "dateFormatted": "Jun 23, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-07-01",
    "dateFormatted": "Jun 30, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-07-08",
    "dateFormatted": "Jul 7, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-07-15",
    "dateFormatted": "Jul 14, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-07-22",
    "dateFormatted": "Jul 21, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-07-29",
    "dateFormatted": "Jul 28, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-08-05",
    "dateFormatted": "Aug 4, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-08-12",
    "dateFormatted": "Aug 11, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-08-19",
    "dateFormatted": "Aug 18, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-08-26",
    "dateFormatted": "Aug 25, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-09-02",
    "dateFormatted": "Sep 1, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-09-09",
    "dateFormatted": "Sep 8, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-09-16",
    "dateFormatted": "Sep 15, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-09-23",
    "dateFormatted": "Sep 22, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-09-30",
    "dateFormatted": "Sep 29, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-10-07",
    "dateFormatted": "Oct 6, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-10-14",
    "dateFormatted": "Oct 13, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-10-21",
    "dateFormatted": "Oct 20, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  },
  {
    "date": "2025-10-28",
    "dateFormatted": "Oct 27, 2025",
    "WWE": 0,
    "AEW": 0,
    "TNA": 0
  }
];
