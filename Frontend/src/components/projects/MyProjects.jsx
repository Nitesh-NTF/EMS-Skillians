import { useState, useEffect, useRef, useCallback } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { LinearProgress } from "@mui/material";
import { Box } from "@mui/system";
import { BackButton } from "../BackButton";
import { Button } from "../Button";
import { AvatarGroup } from "../AvatarGroup";
import { Loader } from "../Loading";
import { ReactIcons } from "../constants/react_icons";
import { fetchProjects } from "../../service/project";
import { getColorOnPercentage } from "../../utils/helpingFns";

export const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loadng, setLoadng] = useState(true);
  const loggedUser = useSelector((state) => state.auth.user);
  const [query, setQuery] = useState({
    search: "",
  });
  const timerRef = useRef();

  function handleSearch(e) {
    setLoadng(true);
    const { name, value } = e.target;
    setQuery({ ...query, [name]: value });
  }

  const fetchProjectsFn = useCallback(async () => {
    try {
      const res = await fetchProjects({ ...query, employees: loggedUser._id });
      setProjects(res.data.projects);
    } catch (error) {
      console.log("error: ", error);
      toast(error.response.data.message);
    } finally {
      setLoadng(false);
    }
  }, [query]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => fetchProjectsFn(), 1000);
  }, [query, fetchProjectsFn]);

  return (
    <div>
      <BackButton title="My Projects" className={{ title: "font-medium" }} />
      <div className="bg-[#EEEEF0] rounded-2xl flex items-center px-7 my-7">
        <ReactIcons.IoSearchSharp className="text-[#7a7c8f] text-xl" />
        <input
          type="search"
          name="search"
          value={query.search}
          onChange={handleSearch}
          className="w-full rounded-2xl px-3 py-2"
          placeholder="Search projects"
        />
      </div>

      <div className="grid grid-cols-2 gap-10 mb-10">
        {loadng ? (
          <div className="col-span-2">
            <Loader />
          </div>
        ) : !projects.length ? (
          <div className="py-8 text-[#666666] text-center col-span-2">
            No Exists
          </div>
        ) : (
          projects.map((p) => (
            <div
              key={p._id}
              className="bg-[#EAFAFF] hover:shadow-xl transition rounded-md p-7"
            >
              <div className="flex">
                <div className="text-[12px] w-full font-medium">
                  <h1 className="py-1 text-base font-medium ">{p.name}</h1>
                  <p className="p-0.5">Client: {p.client}</p>
                  <p className="p-0.5">Hours in Month: {p.duration}</p>
                  <p className="p-0.5">Status: {p.status}</p>
                </div>
                <div className="flex flex-col-reverse">
                  <Button className="py-1 px-2 w-max rounded-xs text-[10px] bg-[#F7BE4A]">
                    Track Time
                  </Button>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 my-3">
                  <Box className="w-full">
                    <LinearProgress
                      variant="determinate"
                      value={p.progressPercentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#e5e7eb",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: getColorOnPercentage(
                            p.progressPercentage
                          ),
                          transition: "transform 0.5s ease",
                        },
                      }}
                    />
                  </Box>
                  <span style={{ color: p.progressColor }}>
                    {p.progressPercentage}%
                  </span>
                </div>
                <AvatarGroup avatars={p.employees} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
