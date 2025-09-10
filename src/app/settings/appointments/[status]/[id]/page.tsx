"use client";

import { useParams, useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hook";
import { fetchServicesByLocation } from "@/store/slices/servicesSlice";
import { fetchAppointments } from "@/store/slices/appointmentsSlice";
import { FiArrowLeft, FiCalendar, FiUser, FiClock } from "react-icons/fi";
import { useMemo, useEffect, useRef, useState } from "react";
import { IoCutSharp } from "react-icons/io5";
import Image from "next/image";
import ContactDetails from "@/components/Home/contactDetails/ContactDetails";

// --- HELPER FUNCTIONS ---

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

const parseTimeStringToDate = (timeString: string, baseDate: Date): Date => {
  const time = timeString.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!time) return baseDate;
  let hours = Number.parseInt(time[1], 10);
  const minutes = Number.parseInt(time[2], 10);
  const ampm = time[3].toUpperCase();
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;
  const date = new Date(baseDate);
  date.setHours(hours, minutes, 0, 0);
  return date;
};

const formatTimeFromDate = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatToGoogleCalendarDate = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d{3}/g, "");
};

export default function AppointmentDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { id, status } = params;
  const [isLoading, setIsLoading] = useState(false);

  const { selectedLocationUuid, allServices, selectedLocationByName } =
    useAppSelector((state) => state.services);
  const { upcoming, completed, cancelled } = useAppSelector(
    (state) => state.appointments
  );
  const initialLocationId = useRef(selectedLocationUuid);

  // Define the Appointment type based on your data structure
  interface Appointment {
    id: string;
    date: string;
    time: string;
    booking_status: string;
    booking_comment?: string;
    services: {
      service_id: string;
      service_name: string;
      operator_name: string;
      duration: string;
    }[];
  }

  const appointment = useMemo(() => {
    const list: Appointment[] =
      status === "upcoming"
        ? upcoming
        : status === "completed"
        ? completed
        : cancelled;
    return list.find((app) => app.id === id);
  }, [id, status, upcoming, completed, cancelled]);

  // FIXED: Fetch appointment data if not found (handles page refresh)
  useEffect(() => {
    const fetchAppointmentData = async () => {
      // If appointment is not found and we have selectedLocationUuid, fetch the appointments
      if (!appointment && selectedLocationUuid && !isLoading) {
        setIsLoading(true);
        try {
          let booking_type: number;
          switch (status) {
            case "completed":
              booking_type = 3;
              break;
            case "cancelled":
              booking_type = 2;
              break;
            default:
              booking_type = 1;
              break;
          }

          await dispatch(
            fetchAppointments({
              vendor_location_uuid: selectedLocationUuid,
              booking_type,
              page: 1,
              limit: 10,
            })
          );
        } catch (error) {
          console.error("Failed to fetch appointments:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAppointmentData();
  }, [appointment, selectedLocationUuid, status, dispatch, isLoading]);

  useEffect(() => {
    if (selectedLocationUuid && allServices.length === 0) {
      dispatch(fetchServicesByLocation(selectedLocationUuid));
    }
  }, [dispatch, selectedLocationUuid, allServices.length]);

  // FIXED: Only redirect if location actually changes (not on initial load)
  useEffect(() => {
    if (
      initialLocationId.current &&
      selectedLocationUuid &&
      initialLocationId.current !== selectedLocationUuid
    ) {
      router.push("/settings/appointments/upcoming");
    }
  }, [selectedLocationUuid, router]);

  const handleAddToCalendar = () => {
    if (!appointment) {
      alert("Appointment details not found.");
      return;
    }

    const startDate = parseTimeStringToDate(
      appointment.time,
      new Date(appointment.date)
    );
    const totalDuration = appointment.services.reduce(
      (total, service) => total + (Number.parseInt(service.duration, 10) || 0),
      0
    );
    const endDate = new Date(startDate.getTime());
    endDate.setMinutes(endDate.getMinutes() + totalDuration);

    const googleCalendarStartDate = formatToGoogleCalendarDate(startDate);
    const googleCalendarEndDate = formatToGoogleCalendarDate(endDate);

    const title = `Appointment at The Belle Femme Salon`;
    const details = `Services: ${appointment.services
      .map((s) => s.service_name)
      .join(", ")}\n\nInstructions: ${appointment.booking_comment || "None"}`;
    const location = selectedLocationByName || "The Belle Femme Salon";

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      title
    )}&dates=${googleCalendarStartDate}/${googleCalendarEndDate}&details=${encodeURIComponent(
      details
    )}&location=${encodeURIComponent(location)}`;

    window.open(calendarUrl, "_blank");
  };

  // Show loading state while fetching appointment data
  if (isLoading) {
    return (
      <div className="lg:w-3/4 text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c59d5f] mx-auto mb-4"></div>
        <div className="loader"></div>
      </div>
    );
  }

  // Show not found only after we've tried to fetch the data
  if (!appointment && !isLoading) {
    return (
      <div className="lg:w-3/4 text-center py-20">
        <h2 className="text-2xl font-playfair font-bold text-[#B11C5F]">
          Appointment Not Found
        </h2>
        <p className="text-[#C59D5F] mt-2 font-lato">
          The appointment may have been moved or does not exist.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-6 flex items-center gap-2 mx-auto text-[#C59D5F]/80 hover:text-[#B11C5F] transition-all duration-300 font-lato font-semibold hover:scale-105">
          <FiArrowLeft /> Go Back
        </button>
      </div>
    );
  }

  if (!appointment) return null;

  const runningTime = parseTimeStringToDate(
    appointment.time,
    new Date(appointment.date)
  );
  const services = appointment?.services || [];

  return (
    <div className="lg:w-3/4 space-y-3 animate-fadeIn">
      <div className="bg-white/95 backdrop-blur-sm shadow-sm border-2 border-[#F28C8C]/30 rounded-2xl p-2">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[#C59D5F]/80 hover:text-[#B11C5F] transition-all duration-300 group font-lato font-semibold">
          <FiArrowLeft className="w-7 h-7 transition-transform duration-300 group-hover:-translate-x-1" />
          <span className="font-medium text-xl">Back to Appointments</span>
        </button>
      </div>
      <div className="bg-white/95 backdrop-blur-sm shadow-sm border-2 border-[#F28C8C]/30 rounded-2xl">
        <ContactDetails />
      </div>

      <div className="bg-white/95 backdrop-blur-sm shadow-sm border-2 border-[#F28C8C]/30 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4 border-b border-[#F28C8C]/30 pb-4 -z-1">
          <h3 className="text-xl font-playfair font-semibold text-[#B11C5F]">
            Appointment Details
          </h3>
          <span
            className={`text-xs px-3 py-1 rounded-full capitalize font-lato font-semibold ${
              appointment.booking_status === "Confirmed"
                ? "bg-green-100 text-green-700 border border-green-300"
                : "bg-purple-100 text-purple-700 border border-purple-300"
            }`}>
            {appointment.booking_status}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[#C59D5F] mb-6 font-lato">
          <FiCalendar className="w-4 h-4 text-[#B11C5F] flex-shrink-0" />
          <span>
            {formatDate(appointment.date)}, starting at {appointment.time}
          </span>
        </div>

        <div className="space-y-3">
          {services.map((service, index) => {
            const fullServiceDetails = allServices.find(
              (s: { id: string; image?: string }) => s.id === service.service_id
            );
            const imageUrl = fullServiceDetails?.image;
            const serviceStartTime = formatTimeFromDate(runningTime);
            const durationInMinutes =
              Number.parseInt(service.duration, 10) || 0;
            runningTime.setMinutes(
              runningTime.getMinutes() + durationInMinutes
            );

            return (
              <div
                key={index}
                className="bg-[#FFF6F8] p-4 rounded-2xl flex justify-between items-center border border-[#F28C8C]/30">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#F28C8C]/20 rounded-2xl flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                    {imageUrl ? (
                      <Image
                        src={imageUrl || "/placeholder.svg"}
                        alt={service.service_name}
                        layout="fill"
                        className="object-cover"
                      />
                    ) : (
                      <IoCutSharp className="text-[#B11C5F] text-2xl" />
                    )}
                  </div>
                  <div>
                    <p className="font-playfair font-bold text-[#B11C5F]">
                      {service.service_name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-[#C59D5F] mt-1 font-lato">
                      <span>With</span>
                      <FiUser className="w-3 h-3" />
                      <span>
                        {service.operator_name} at{" "}
                        <span>{serviceStartTime}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-right text-[#C59D5F] flex-shrink-0 font-lato">
                  <div className="flex items-center gap-1.5">
                    <FiClock className="w-3 h-3" />
                    <span>{service.duration}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white/95 backdrop-blur-sm shadow-sm border-2 border-[#F28C8C]/30 rounded-2xl p-6">
        <h3 className="text-xl font-playfair font-semibold text-[#B11C5F] mb-3">
          Instruction
        </h3>
        <p className="text-[#C59D5F] italic font-lato">
          {appointment.booking_comment || "No instructions were provided."}
        </p>
      </div>

      <button
        onClick={handleAddToCalendar}
        className="w-full bg-gradient-to-r from-[#F28C8C] to-[#C59D5F] text-white font-lato font-bold text-lg py-4 rounded-2xl  hover:from-[#B11C5F] hover:to-[#F28C8C] transition-all duration-300 shadow-lg hover:shadow-[#C59D5F]/40">
        Add To My Calendar
      </button>
    </div>
  );
}
