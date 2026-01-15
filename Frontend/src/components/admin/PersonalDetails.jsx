import { useState } from "react";
import { Img } from "../Img";
import { Button } from "../Button";
import { ReactIcons } from "../constants/react_icons";

export const PersonalDetails = () => {
  // const data = useContextData();
  const [user, setUser] = useState({});

  return (
    <div className="bg-white">
      <div className="flex justify-between px-13 pt-5 pb-5">
        <div>
          <h1 className="text-2xl font-bold">Personal Information</h1>
          <div className="text-black text-xs">
            <p className="my-2.5">
              Gender: <span className="text-[#666666]"> Female</span>
            </p>
            <p className="my-2.5">
              Marital status: <span className="text-[#666666]"> Single </span>
            </p>
            <p className="my-2.5">
              Mobile No: <span className="text-[#666666]"> 6546354165</span>
            </p>
            <p className="my-2.5">
              Local address:{" "}
              <span className="text-[#666666]"> Indore Madhya Pradesh</span>
            </p>
            <p className="my-2.5">
              Permanent address:{" "}
              <span className="text-[#666666]">
                {" "}
                Sagar Madhya Pradesh India
              </span>
            </p>
            <p className="my-2.5">
              Date of birth:{" "}
              <span className="text-[#666666]">
                {" "}
                Wednesday, August 25, 2025
              </span>
            </p>
          </div>
        </div>
        <div>
          <div className="flex justify-center items-center flex-col gap-3 text-[#215675]">
            <img src={user.icon} alt="user profile" className="w-30" />
            <strong>{user.name}</strong>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center px-13 py-3 border-b border-gray-300 text-sm">
        <b>Work Experience</b>
        <Button className="flex items-center text-[#1177BD] text-xs font-bold gap-1">
          <ReactIcons.IoAdd /> Add
        </Button>
      </div>
      <div className="flex justify-between items-center px-13 py-3 border-b border-gray-300 text-sm">
        <b>Salary</b>
        <Button className="flex items-center text-[#1177BD] text-xs font-bold gap-1">
          <ReactIcons.IoAdd /> Add
        </Button>
      </div>
      <div className="flex justify-between items-center px-13 py-3 border-b border-gray-300 text-sm">
        <b>Bank Details</b>
        <Button className="flex items-center text-[#1177BD] text-xs font-bold gap-1">
          <ReactIcons.IoAdd /> Add
        </Button>
      </div>
      <div className="flex justify-between items-center px-13 py-3 border-b border-gray-300 text-sm">
        <b>Attachments</b>
        <Button className="flex items-center text-[#1177BD] text-xs font-bold gap-1">
          <ReactIcons.IoAdd /> Add
        </Button>
      </div>
      <div className="flex justify-between items-center px-13 py-3 border-b border-gray-300 text-sm">
        <b>Skills</b>
        <Button className="flex items-center text-[#1177BD] text-xs font-bold gap-1">
          <ReactIcons.IoAdd /> Add
        </Button>
      </div>
      <div className="flex justify-between items-center px-13 py-3 border-b border-gray-300 text-sm">
        <b>ID Proof</b>
        <Button className="flex items-center text-[#1177BD] text-xs font-bold gap-1">
          <ReactIcons.IoAdd /> Add
        </Button>
      </div>
    </div>
  );
};
