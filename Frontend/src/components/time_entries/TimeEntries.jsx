import { images } from "../constants/images";

const cards = [
  {
    title: "Weekly Activity",
    icon: images.weeklyActivityIcon,
    time: "12h 24m",
  },
  { title: "Productive Time", icon: images.productiveTimeIcon, time: "5h 45m" },
  { title: "Research Activity", icon: images.researchTimeIcon, time: "9h 14m" },
];

const ProjectsData = [
  {
    name: "Homepage Design",
    value: 50,
    color: "#FE7050",
    date: "26/4/25",
    startTime: "01:30 PM",
    endTime: "03:20 PM",
    duration: "01:50 hr",
  },
  {
    name: "Mobile Application",
    value: 55,
    color: "#58CBA6",
    date: "26/4/25",
    startTime: "01:30 PM",
    endTime: "03:20 PM",
    duration: "01:50 hr",
  },
  {
    name: "Web Application",
    value: 70,
    color: "#FEAB44",
    date: "26/4/25",
    startTime: "01:30 PM",
    endTime: "03:20 PM",
    duration: "01:50 hr",
  },
];

export const TimeEntries = () => {
  return (
    <div>
      <div className="flex justify-between my-10">
        {cards.map((c, index) => (
          <div key={index} className="flex items-center gap-3">
            <img src={c.icon} className="w-10" />
            <div>
              <h1 className="text-lg">{c.title}</h1>
              <p className="text-[#757575] text-md">{c.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
