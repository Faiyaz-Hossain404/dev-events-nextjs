export type EventItem = {
  image: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  time: string;
};

export const events: EventItem[] = [
  {
    image: "/images/event1.png",
    title: "React Summit US 2025",
    slug: "react-summit-us-2025",
    location: "San Francisco, CA, USA",
    date: "2024-07-01",
    time: "10:00 AM",
  },
  {
    image: "/images/event2.png",
    title: "JavaScript World Conference 2024",
    slug: "javascript-world-conference-2024",
    location: "New York, NY, USA",
    date: "2024-09-15",
    time: "9:00 AM",
  },
  {
    image: "/images/event3.png",
    title: "Full-Stack Dev Meetup",
    slug: "Full-Stack Dev Meetup",
    location: "London, UK",
    date: "2024-08-20",
    time: "9:00 AM",
  },
  {
    image: "/images/event4.png",
    title: "AI & ML Conference 2024",
    slug: "AI & ML Conference 2024",
    location: "Berlin, Germany",
    date: "2024-11-05",
    time: "10:00 AM",
  },
  {
    image: "/images/event5.png",
    title: "Open Source Summit 2024",
    slug: "Open Source Summit 2024",
    location: "Tokyo, Japan",
    date: "2024-10-10",
    time: "11:00 AM",
  },
  {
    image: "/images/event6.png",
    title: "Cloud Computing Expo 2024",
    slug: "Cloud Computing Expo 2024",
    location: "Sydney, Australia",
    date: "2024-12-01",
    time: "9:30 AM",
  },
  {
    image: "/images/event-full.png",
    title: "Open Source Summit North America 2026",
    slug: "oss-na-2026",
    location: "Vancouver, Canada",
    date: "2026-05-12",
    time: "10:00 AM",
  },
];
