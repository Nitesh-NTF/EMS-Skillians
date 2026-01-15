import React from "react";
import { BackButton } from "../common/BackButton";
import { ReactIcons } from "../constants/react_icons";
import { Card } from "../common/Card";
import { MultiTabs } from "../common/MultiTabs";
import { BarChart } from "@mui/x-charts/BarChart";

const cardsData = [
  {
    header: "Total Hours",
    icon: <ReactIcons.FaRegClock />,
    value: "393.0",
    caption: "Total Hours Logged",
    color: "#215675",
  },
  {
    header: "Avg Hour/Day",
    icon: <ReactIcons.CgLoadbarSound />,
    value: "18.7",
    caption: "Average daily hours per periods",
    color: "#215675",
  },
  {
    header: "Active Employees",
    icon: <ReactIcons.FaRegClock />,
    value: "10",
    caption: "Employees with logged time",
    color: "#17C500",
  },
];

const COLORS = {
  1: "#4F6BED",
  2: "#3DB5AD",
  3: "#ED8C3A",
  4: "#A9B4C2",
};

const projectChartData = [
  { label: "Frontend", hours: "142.5" },
  { label: "Backend", hours: "98.0" },
  { label: "API", hours: "74.5" },
  { label: "Database", hours: "32" },
];

const clientChartData = [
  { label: "Alice", hours: "190" },
  { label: "Williams", hours: "75.4" },
  { label: "Charlie", hours: "74.5" },
  { label: "Elizabeth", hours: "32" },
];

const projectLabels = projectChartData.map((item) => item.label);
const clientLabels = clientChartData.map((item) => item.label);

const projectSeries = projectChartData.map((item, index) => ({
  data: projectLabels.map((label) =>
    label === item.label ? item.hours : null
  ),
  color: COLORS[index + 1] || "#CBD5E1",
}));
const clientSeries = clientChartData.map((item, index) => ({
  data: clientLabels.map((label) => (label === item.label ? item.hours : null)),
  color: COLORS[index + 1] || "#CBD5E1",
}));

const multiTabData = [
  {
    header: "Summary",
    render: () => (
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-5">
          <h1>Hours by Project</h1>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: projectLabels,
                tickLabelStyle: {
                  fill: "#7A8A99",
                  fontSize: 12,
                },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: {
                  fill: "#7A8A99",
                  fontSize: 12,
                },
              },
            ]}
            series={projectSeries}
            height={260}
            sx={{
              "& .MuiBarElement-root": {
                rx: 5,
              },
            }}
            barLabel="value"
          />
        </Card>
        <Card className="p-5">
          <h1>Hours by Project</h1>
          <BarChart
            xAxis={[
              {
                scaleType: "band",
                data: clientLabels,
                tickLabelStyle: {
                  fill: "#7A8A99",
                  fontSize: 12,
                },
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: {
                  fill: "#7A8A99",
                  fontSize: 12,
                },
              },
            ]}
            series={clientSeries}
            height={300}
            borderRadius={3}
            categoryGapRatio={0.5}
            barLabel="value"
            slotProps={{
              barLabel: {
                style: {
                  fontSize: 14,
                  fontWeight: 500,
                },
                width: 0,
              },
            }}
          />
        </Card>
      </div>
    ),
  },
  {
    header: "By Employee",
    render: (tab) => <>tab content 2</>,
  },
  { header: "By Project", render: (tab) => <>tab content 3</> },
  { header: "By Client", render: (tab) => <>tab content 4</> },
];

export const TimeReports = () => {
  return (
    <div>
      <BackButton title="Time Report" className={{ container: "my-5" }} />
      <div className="grid grid-cols-3 gap-5 text-[#535151]">
        <div className="w-full">
          <h1 className="mb-1">Date Range</h1>
          <input
            name="timeRange"
            type="date"
            className="input text-[#757575] bg-transparent"
          />
        </div>
        <div className="w-full">
          <h1 className="mb-1">Project</h1>
          <select
            name="project"
            className="input text-[#757575] bg-transparent"
          >
            <option value="all">All Projects</option>
            <option value="1">Project one</option>
            <option value="2">Project two</option>
            <option value="3">Project three</option>
          </select>
        </div>
        <div className="w-full">
          <h1 className="mb-1">Employee</h1>
          <select
            name="employee"
            className="input text-[#757575] bg-transparent"
          >
            <option value="all">All employees</option>
            <option value="1">Employee one</option>
            <option value="2">Employee two</option>
            <option value="3">Employee three</option>
          </select>
        </div>
        {cardsData.map((card, index) => (
          <Card key={index} className="p-3.5 rounded-md border border-gray-300">
            <span className="flex justify-between items-center">
              {card.header}{" "}
              <span className={`text-[${card.color}]`}>{card.icon}</span>
            </span>
            <h2 className={`text-[${card.color}] text-lg mt-1.5`}>
              {card.value}
            </h2>
            <p className="text-[10px]">{card.caption}</p>
          </Card>
        ))}
      </div>

      <div className="my-5">
        <MultiTabs
          tabs={multiTabData}
          className={{
            tHead:
              "text-center bg-[#DFE5EA] p-1 text-[#757575] font-normal border border-gray-300 rounded-md",
            tHeaders: "py-2 rounded-md",
            activeTabHeader: "bg-[#F8FAFC]",
          }}
        />
      </div>
    </div>
  );
};
