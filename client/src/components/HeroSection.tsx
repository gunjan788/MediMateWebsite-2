const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-teal-500" id="hero">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why be worried about forgetting to take your medicine when you have MediMate
            </h1>
            <div className="flex justify-center md:justify-start mt-8 space-x-4">
              <a
                href="#"
                className="inline-block"
                onClick={(e) => e.preventDefault()}
              >
                <img
                  src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-preferred.png"
                  alt="Download on App Store"
                  className="h-12"
                />
              </a>
              <a
                href="#"
                className="inline-block"
                onClick={(e) => e.preventDefault()}
              >
                <img
                  src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
                  alt="Get it on Google Play"
                  className="h-12"
                />
              </a>
            </div>
          </div>
          <div className="md:w-1/2 relative">
            {/* Phone mockups */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="rounded-3xl shadow-2xl transform -rotate-6 z-0 w-48 h-96 bg-gray-900 border-4 border-gray-800 overflow-hidden">
                  <div className="bg-teal-200 h-full flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-pills text-teal-600 text-5xl mb-4"></i>
                      <p className="text-teal-700 font-bold">Medication Tracker</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl shadow-2xl absolute top-8 -right-16 z-10 w-48 h-96 bg-gray-900 border-4 border-gray-800 overflow-hidden">
                  <div className="bg-teal-300 h-full flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-bell text-teal-700 text-5xl mb-4"></i>
                      <p className="text-teal-800 font-bold">Reminders</p>
                    </div>
                  </div>
                </div>
                <div className="rounded-3xl shadow-2xl absolute -top-4 -left-16 z-20 w-48 h-96 bg-gray-900 border-4 border-gray-800 overflow-hidden">
                  <div className="bg-teal-400 h-full flex items-center justify-center">
                    <div className="text-center">
                      <i className="fas fa-calendar-alt text-teal-800 text-5xl mb-4"></i>
                      <p className="text-teal-900 font-bold">Calendar</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
