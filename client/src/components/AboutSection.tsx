const AboutSection = () => {
  return (
    <section className="py-16 bg-white" id="about">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">About MediMate</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            MediMate is a free pill reminder and medication tracker app. You may make doctor's 
            appointments, learn more about the medications you're taking and their side effects, 
            track your health, and share your health status with your family and friends. Up to 
            three people profiles can be added in an account at once, and anyone from anywhere 
            in the world can view your loved one's account by invitation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
