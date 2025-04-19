interface FeatureProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureProps) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 transition duration-300 hover:shadow-lg">
      <div className="flex items-start mb-4">
        <div className="bg-teal-500 rounded-full p-3 mr-4">
          <i className={`${icon} text-white text-xl`}></i>
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
      </div>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const FeaturesSection = () => {
  const features: FeatureProps[] = [
    {
      icon: "fas fa-pills",
      title: "Add/Edit Medications",
      description: "Easily manage your medication list with our intuitive interface. Add new prescriptions or update existing ones."
    },
    {
      icon: "fas fa-user-friends",
      title: "Multiple User Profiles",
      description: "Create and manage up to 3 different user profiles within a single account for family members."
    },
    {
      icon: "fas fa-volume-up",
      title: "Audio Reminders",
      description: "Get personalized audio notifications when it's time to take your medications."
    },
    {
      icon: "fas fa-calendar-alt",
      title: "Schedule Appointments",
      description: "Book and manage doctor appointments directly from the app. Never miss a checkup."
    },
    {
      icon: "fas fa-bell",
      title: "Medication Reminders",
      description: "Set customized reminders for each medication. Get notified at the right time, every time."
    },
    {
      icon: "fas fa-share-alt",
      title: "Share Health Data",
      description: "Securely share your medication schedule and health data with family members or caregivers."
    },
    {
      icon: "fas fa-language",
      title: "Language & Theme Options",
      description: "Customize your experience with multiple languages and theme options."
    },
    {
      icon: "fas fa-info-circle",
      title: "Medication Information",
      description: "Access detailed information about your medications, including side effects and interactions."
    },
    {
      icon: "fas fa-book",
      title: "App Tutorials",
      description: "Comprehensive guides and tutorials to help you get the most out of MediMate."
    }
  ];

  return (
    <section className="py-16 bg-teal-50" id="features">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to track and manage your medications effectively.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
