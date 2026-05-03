import RevealOnScroll from "../animations/Reveal";

const Info = () => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-12 text-center sm:gap-8 sm:py-14 md:gap-10 md:py-16 lg:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center font-uber sm:px-6 md:px-8 lg:px-0">
        <RevealOnScroll>
          <p className="font-uber text-[18px] leading-8 text-gray-700">
            At Easeway Medicare Physiotherapy Clinic, we believe that everyone
            deserves to live without pain and move freely. Our dedicated team
            provides personalized, evidence-based treatments that address the
            root cause of your condition.
          </p>
        </RevealOnScroll>
      </div>
      <RevealOnScroll>
        <button
          onClick={() =>
            document
              .getElementById("services")
              ?.scrollIntoView({ behavior: "smooth" })
          }
          className="btn-dark"
        >
          Learn More About Our Services
        </button>
      </RevealOnScroll>
    </div>
  );
};

export default Info;
