import React from "react";
import { MyFillButton } from "../reusables/Button";

const HeroSection: React.FC = () => {
  return (
    <section
      className="relative flex min-h-[640px] items-center overflow-hidden bg-cover bg-center bg-no-repeat py-20 sm:min-h-[760px] lg:min-h-[820px]"
      style={{
        backgroundImage: `url(/images/fx4.jpg)`,
      }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="site-container relative z-10 w-full">
        <div className="max-w-2xl">
          <h1 className="mb-4 font-axiforma text-[38px] leading-tight text-white sm:mb-6 sm:text-[50px] lg:text-[58px]">
            Musculoskeletal Physiotherapy
          </h1>

          <p className="mb-7 max-w-xl font-uber text-[18px] leading-8 text-gray-100 sm:mb-9">
            Overcome pain, regain mobility, and live life to the fullest with
            Easeway Medicare Physiotherapy Clinic.
          </p>

          <div>
            <MyFillButton
              text="Book Appointment"
              link="/booking"
              bgColor="#FF3133"
              hoverBgColor="#e62a2c"
              color="white"
              hoverTextColor="white"
              ariaLabel="Book Appointment"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
