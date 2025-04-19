import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Pill, Clock, Calendar, Users, Share2, Settings, Info, BookOpen, BellRing 
} from "lucide-react";

const Dashboard = () => {
  const mockData = {
    medications: 5,
    reminders: 8,
    appointments: 2,
    profiles: 2,
  };

  const featureCards = [
    {
      title: "Medications",
      description: "Add and manage your medications",
      icon: <Pill className="h-8 w-8 text-teal-600" />,
      count: mockData.medications,
      link: "/medications",
      action: "Manage Medications",
    },
    {
      title: "Reminders",
      description: "Set up medication reminders",
      icon: <BellRing className="h-8 w-8 text-teal-600" />,
      count: mockData.reminders,
      link: "/reminders",
      action: "Manage Reminders",
    },
    {
      title: "Appointments",
      description: "Schedule doctor appointments",
      icon: <Calendar className="h-8 w-8 text-teal-600" />,
      count: mockData.appointments,
      link: "/appointments",
      action: "Manage Appointments",
    },
    {
      title: "User Profiles",
      description: "Manage profiles for family members",
      icon: <Users className="h-8 w-8 text-teal-600" />,
      count: mockData.profiles,
      link: "/profiles",
      action: "Manage Profiles",
    },
    {
      title: "Share Health Data",
      description: "Share data with family and caregivers",
      icon: <Share2 className="h-8 w-8 text-teal-600" />,
      link: "/sharing",
      action: "Manage Sharing",
    },
    {
      title: "Settings",
      description: "Customize your app experience",
      icon: <Settings className="h-8 w-8 text-teal-600" />,
      link: "/settings",
      action: "Manage Settings",
    },
    {
      title: "Medication Info",
      description: "Learn about your medications",
      icon: <Info className="h-8 w-8 text-teal-600" />,
      link: "/med-info",
      action: "View Info",
    },
    {
      title: "Tutorials",
      description: "Learn how to use MediMate",
      icon: <BookOpen className="h-8 w-8 text-teal-600" />,
      link: "/tutorials",
      action: "View Tutorials",
    },
  ];

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome to MediMate. Manage your medications and health data.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureCards.map((card, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-xl font-medium">{card.title}</CardTitle>
                {card.icon}
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm text-gray-500">
                  {card.description}
                </CardDescription>
                {card.count !== undefined && (
                  <p className="mt-2 text-2xl font-bold text-teal-600">{card.count}</p>
                )}
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-teal-500 hover:bg-teal-600">
                  <Link href={card.link}>
                    {card.action}
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Today's Schedule</h2>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <h3 className="font-medium text-lg">Morning Medications</h3>
                <span className="text-teal-600 font-medium">8:00 AM</span>
              </div>
              <p className="text-gray-600 mt-1">2 medications due</p>
            </div>
            <div className="mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between">
                <h3 className="font-medium text-lg">Dr. Johnson Appointment</h3>
                <span className="text-teal-600 font-medium">2:30 PM</span>
              </div>
              <p className="text-gray-600 mt-1">Annual checkup</p>
            </div>
            <div>
              <div className="flex justify-between">
                <h3 className="font-medium text-lg">Evening Medications</h3>
                <span className="text-teal-600 font-medium">8:00 PM</span>
              </div>
              <p className="text-gray-600 mt-1">3 medications due</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;