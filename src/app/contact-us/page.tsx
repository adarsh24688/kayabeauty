import React from "react";
import ContactForm from "@/components/contactus/user-contact/ContactForm";
import ContactSection from "@/components/contactus/contactwhitecard/ContactSection";
import StaticMapHero from "@/components/contactus/contact-map/StaticMapHero";
import BusinessHours from "@/components/contactus/business-hours/BusinessHours";
import BookingSection from "@/components/contactus/booking-section/BookingSection";
import LocationDetails from "@/components/contactus/location-details/LocationDetails";

const contactus = () => {
  return (
    <>
      <StaticMapHero />
      <div className="hidden lg:block">
        <ContactForm />
      </div>
      <ContactSection />
      <BusinessHours />
      <BookingSection />
      <LocationDetails />
    </>
  );
};

export default contactus;
