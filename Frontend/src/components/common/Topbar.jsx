import { useEffect, useRef, useState } from "react";
import { images } from "../constants/images";
import { useDispatch, useSelector } from "react-redux";
import NotificationBell from "../notifications/NotificationBell";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import toast from "react-hot-toast";
import { getDistanceInMeters } from "../../utils/helpingFns";
import { createPortal } from "react-dom";
import { clockInOut } from "../../service/apis/employee";
import { ButtonLoader } from "./Loading";
import { setClockedStatus } from "../../store/authSlice";

export const Topbar = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [isPunchOpen, setIsPunchOpen] = useState(false);

  return (
    <div
      className={`bg-white drop-shadow-sm p-1 fixed  top-0 w-full left-0 z-40`}
    >
      <div className="flex justify-end items-center gap-6 mr-5">
        <button
          onClick={() => setIsPunchOpen(true)}
          className={`py-1 px-2 rounded-sm text-white ${
            user.isClockIn ? "bg-red-500" : "bg-blue-500"
          }`}
        >
          {user.isClockIn ? "Clock Out" : "Clock In"}
        </button>
        <NotificationBell />
        <div
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2.5 hover:bg-gray-200 cursor-pointer transition p-1 rounded-md"
        >
          <img className="rounded-full w-7" src={user.icon} alt="proflie" />
          <span>{user.name}</span>
        </div>
      </div>

      {isPunchOpen && <PunchModal onClose={() => setIsPunchOpen(false)} />}
    </div>
  );
};

const OFFICE_LOCATION = {
  // exact location
  lat: 22.7639296,
  lng: 75.8874112,
  
  // 51m away in north
  // lat: 22.7643876,
  // lng: 75.8874112,
};

const ALLOWED_DISTANCE = 50; // meters

export default function PunchModal({ onClose }) {
  const { user } = useSelector((state) => state.auth);
  const modalRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  // console.log("location", location);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => toast.error("Unable to fetch location"),
    );
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const handleClockIn = async () => {
    if (!location || loading) return;

    const distance = getDistanceInMeters(
      location.lat,
      location.lng,
      OFFICE_LOCATION.lat,
      OFFICE_LOCATION.lng,
    );

    if (distance > ALLOWED_DISTANCE) {
      toast.error("You can't clock in/out outside office");
      return;
    }

    setLoading(true);
    try {
      const timestamp = new Date().toISOString();
      const payload = user.isClockIn
        ? { clockOut: { timestamp, lat: location.lat, lng: location.lng } }
        : { clockIn: { timestamp, lat: location.lat, lng: location.lng } };

      await clockInOut(payload);
      toast.success(
        `${user.isClockIn ? "Clock-out" : "Clock-in"} successful ✅`,
      );
      dispatch(setClockedStatus(!user.isClockIn));
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div ref={modalRef} className="bg-white rounded-xl w-full max-w-md p-4">
        <h2 className="text-lg font-semibold mb-2">Punch In / Out</h2>

        {location && (
          <MapContainer
            center={[location.lat, location.lng]}
            zoom={16}
            className="h-48 rounded-lg mb-4"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[location.lat, location.lng]} />
          </MapContainer>
        )}

        <button
          onClick={handleClockIn}
          disabled={loading}
          className={`w-full text-white py-2 rounded-lg mb-2 ${
            loading
              ? "bg-gray-400"
              : user.isClockIn
                ? "bg-red-600"
                : "bg-green-600"
          }`}
        >
          {loading ? (
            <ButtonLoader />
          ) : user.isClockIn ? (
            "Clock Out"
          ) : (
            "Clock In"
          )}
        </button>

        <button
          onClick={onClose}
          className="w-full bg-gray-200 py-2 rounded-lg"
        >
          Close
        </button>
      </div>
    </div>,
    document.body,
  );
}
