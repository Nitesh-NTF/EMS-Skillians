import { useState, useEffect } from "react";
import { Box, LinearProgress } from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts";
import CountUp from "react-countup"
import { Table } from "../common/Table";
import { BackButton } from "../common/BackButton";
import { Card } from "../common/Card";
import { AvatarGroup } from "../common/AvatarGroup";
import { FilterBox } from "../common/FilterBox";
import { ReactIcons } from "../constants/react_icons";
import { images } from "../constants/images";
import {
  getColorOnPercentage,
  getPercentage,
  getTime,
  getToday,
} from "../../utils/helpingFns";
import { fetchProjects } from "../../service/apis/project";
import { useSelector } from "react-redux";
import { getAdminStats } from "../../service/apis/admin";
import toast from "react-hot-toast";
import { ButtonLoader, PulseLoader, SkeletonLoader } from "../common/Loading";
import { EMPLOYEE_DISPLAY_TYPES } from "../constants/employeeDisplayTypes";
import { PROJECT_DISPLAY_TYPES } from "../constants/projectDisplayTypes";

const graphData = [
  2.5,
  3.8,
  2.2,
  1.9,
  2.6,
  3.9, // Apr 29 – May 4
  5.5, // May 5 (highlighted)
  4.6,
  3.7,
  2.6,
  3.8,
  2.9,
  1.2, // Next days
];

const labels = [
  "Sat",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
];

const ProjectCol = [
  {
    key: "name",
    header: "Project",
    render: (row, index) => (
      <div className="w-full text-left flex items-center">
        {" "}
        <span
          className={`mx-2 py-1 rounded-xs flex items center`}
          // style={{ backgroundColor: row.color }}
        >
          {index + 1} <img src={row.icon} alt="icon" className="w-5 h-5 ml-2" />
        </span>{" "}
        {row.name}
      </div>
    ),
  },
  {
    key: "date",
    header: "Date",
    render: (row) => <>{getToday(row.createdAt)}</>,
  },
  {
    key: "startDate",
    header: "Start Date",
    render: (row) => <>{row.startDate}</>,
  },
  {
    key: "endDate",
    header: "End Date",
    render: (row) => <>{row.endDate}</>,
  },
  {
    key: "duration",
    header: "Duration",
    render: (row) => <>{row.duration}</>,
  },
];

export const AdminDashboard = () => {
  // const data = useContextData();
  const [avatarsData, setAvatarsData] = useState([]);
  // const [projectStatus] = useState({
  //   Start: {
  //     color: "#DE29A7",
  //     status: "Projects not Start",
  //     description: "⚠️ 0 projects at risk of missing deadlines",
  //   },
  //   Pending: {
  //     color: "#3B8BE7",
  //     status: "Totol Pending projects",
  //     description: "🔥 3 high priority projects in progress",
  //   },
  //   "In progress": {
  //     color: "#E7873B",
  //     status: "In Progress/Active projects",
  //     description: "📊 5 active projects this month.",
  //   },
  //   Complete: {
  //     color: "#09883E",
  //     status: "Completed Projects",
  //     description: "⚠️ 1 project is delayed.",
  //   },
  //   Blocked: {
  //     color: "#09883E",
  //     status: "Delayed Projects",
  //     description: "⚠️ 1 project is Blocked.",
  //   },
  // });
  const loggedUser = useSelector((state) => state.auth.user);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalWorkHours: 0,
    projectsByStatus: {},
  });
  const [loading, setLoading] = useState({ projectTable: true, stats: true });

  const fetchProjectsFn = async () => {
    try {
      const res = await fetchProjects({ 
        display: PROJECT_DISPLAY_TYPES.DASHBOARD,
      });
      setProjects(res.data.projects);
    } catch (error) {
      console.log("error: ", error);
      toast(error.response.data.message);
    } finally {
      setLoading((prev) => ({ ...prev, projectTable: false }));
    }
  };

  const fetchDashboardStatsFn = async () => {
    try {
      const res = await getAdminStats();
      console.log("res.data", res.data);
      setStats(res.data);
    } catch (error) {
      console.log("error: ", error);
      toast(error.response.data.message);
    } finally {
      setLoading((prev) => ({ ...prev, stats: false }));
    }
  };

  useEffect(() => {
    fetchProjectsFn();
    fetchDashboardStatsFn();
  }, []);

  return (
    <div>
      <BackButton
        title="Admin Dashboard"
        caption="Overview of system performance and activity"
      />
      <div className="flex gap-13 my-4">
        <Card className="text-xs p-5 min-w-max h-full">
          {loading.stats ? (
            <div className="space-y-4 animate-pulse w-28">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          ) : (
            <>
              <p>Total Employee</p>
              <p className="text-[#215675] text-4xl my-3">
                 <CountUp end={stats.totalEmployees} duration={1}/>
              </p>
              <p className="flex items-center gap-1 text-[#E7873B]">
                <ReactIcons.FaUsers /> this month
              </p>
            </>
          )}
        </Card>
        <Card className="text-xs p-5 min-w-max h-full">
          {loading.stats ? (
            <div className="space-y-4 animate-pulse w-28">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-full"></div>
            </div>
          ) : (
            <>
              <p>Work Hours (Month)</p>
              <p className="text-[#215675] text-4xl my-3">
               <CountUp end={stats.totalWorkHours} duration={1}/>
              </p>
              <p className="flex items-center gap-1 text-[#E7873B]">
                <ReactIcons.FaClock /> this month
              </p>
            </>
          )}
        </Card>
        <Card className="text-xs w-full h-full">
          {loading.stats ? (
            <SkeletonLoader />
          ) : (
            <>
              <div className="flex justify-between pt-2 px-5 border-b-2 border-gray-300">
                <h1 className="text-base">Active Projects</h1>
                <div className="text-[8px] text-center font-light">
                  Totol Projects
                  <p className="text-sm"> <CountUp end={stats.totalProjects} duration={1}/></p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2.5 py-2.5 px-5 text-[#6E7176]">
                {Object.entries(stats.projectsByStatus).map(
                  ([key, content]) => (
                    <div key={key}>
                      <h2 style={{ color: content.color }}>{content.status}</h2>
                      <p className="text-xs">{content.description}</p>
                    </div>
                  ),
                )}
              </div>
            </>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-6">
        <div className="col-span-4">
          <FilterBox
            title="Project Sheet"
            // options={[
            //   { title: "1 week", value: "1" },
            //   { title: "2 week", value: "2" },
            //   { title: "3 week", value: "3" },
            // ]}
          >
            <Table
              loading={loading.projectTable}
              columns={ProjectCol}
              data={projects}
              path="/projects"
              rowClickable={loggedUser.role.includes("Admin")}
              className={{
                table:
                  "text-center text-[#303031] my-5 border-separate border-spacing-y-3 w-full",
                th: "bg-white p-2.5",
                tr: "bg-white hover:drop-shadow-lg",
                td: "p-2 text-center",
              }}
            />
          </FilterBox>
        </div>
        <div className="col-span-2">
          <FilterBox
            title="Report"
            // options={[
            //   { title: "1 week", value: "1" },
            //   { title: "2 week", value: "2" },
            //   { title: "3 week", value: "3" },
            // ]}
          >
            <PieChart
              series={[
                {
                  paddingAngle: 0,
                  innerRadius: "60%",
                  outerRadius: "90%",
                  // data: ProjectsData,
                  data: projects.map((p) => ({
                    value: p.duration,
                    color: getColorOnPercentage(
                      getPercentage(p.duration, p.estimatedHours),
                    ),
                  })),
                },
              ]}
              hideLegend
            >
              <text
                x="50%"
                y="50%"
                textAnchor="middle"
                dominantBaseline="middle"
                style={{ fontSize: 20, fontWeight: 400 }}
              >
                {parseFloat(
                  projects
                    .reduce((acc, item) => acc + item.duration, 0)
                    .toFixed(2),
                )}{" "}
                hr
              </text>
            </PieChart>

            {projects.map((item) => (
              <div key={item._id} className="my-3">
                <div className="flex justify-between">
                  <span>{item.name}</span>
                  <span>
                    {getPercentage(item.duration, item.estimatedHours)} %
                  </span>
                </div>
                <Box className="w-full mt-1 mb-2">
                  <LinearProgress
                    variant="determinate"
                    value={getPercentage(item.duration, item.estimatedHours)}
                    sx={{
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#e5e7eb",
                      "& .MuiLinearProgress-bar": {
                        backgroundColor: `${getColorOnPercentage(
                          getPercentage(item.duration, item.estimatedHours),
                        )}`,
                        transition: "transform 0.5s ease",
                      },
                    }}
                  />
                </Box>
              </div>
            ))}
          </FilterBox>
        </div>
      </div>

      {/* <div className="flex gap-10">
        <FilterBox
          title="Weekly hours Tracked"
          // options={[
          //   { title: "1 week", value: "1" },
          //   { title: "2 week", value: "2" },
          //   { title: "3 week", value: "3" },
          // ]}
          className="bg-white"
        >
          <BarChart
            height={260}
            series={[
              {
                data: graphData,
                color: "#00E096",
                highlightScope: {
                  highlighted: "item",
                  faded: "global",
                },
              },
            ]}
            xAxis={[
              {
                data: labels,
                scaleType: "band",
              },
            ]}
            yAxis={[
              {
                data: ["19 dec", "20 dec", "21 dec", "22 dec", "23 dec"],
              },
            ]}
            sx={{
              "& .MuiBarElement-root": {
                rx: 5,
              },
            }}
          />
        </FilterBox>
        <Card className="p-8 w-full">
          <PieChart
            height={220}
            series={[
              {
                data: [
                  { id: 0, value: 35, label: "Frontend" },
                  { id: 1, value: 20, label: "API" },
                  { id: 2, value: 15, label: "QA" },
                  { id: 3, value: 5, label: "Database" },
                  { id: 4, value: 25, label: "Backend" },
                ],
                innerRadius: 0,
                outerRadius: 90,
                paddingAngle: 2,
                cornerRadius: 6,
                startAngle: -90,
                highlightScope: { faded: "global", highlighted: "item" },
              },
            ]}
            colors={["#E53935", "#4F6BED", "#26A69A", "#F2994A", "#7E57C2"]}
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "bottom", horizontal: "middle" },
                padding: 8,
              },
            }}
          />
        </Card>
      </div> */}
    </div>
  );
};
