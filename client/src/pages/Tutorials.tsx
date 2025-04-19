import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  BookOpen, Search, PlayCircle, ChevronRight, Filter, CheckCircle2 
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

// Mock tutorials data
const mockTutorials = [
  {
    id: 1,
    title: "Getting Started with MediMate",
    description: "Learn the basics of using MediMate to manage your medications.",
    content: "This tutorial covers all the essential features of MediMate and how to navigate the app. You'll learn how to add medications, set up reminders, and access important medication information.",
    category: "Basics",
    videoUrl: "https://example.com/tutorials/getting-started",
    order: 1,
    completed: true,
  },
  {
    id: 2,
    title: "Setting Up Medication Reminders",
    description: "Learn how to create effective medication reminders so you never miss a dose.",
    content: "In this tutorial, we'll show you how to create reminders for your medications, set custom schedules, and enable audio notifications. You'll learn how to customize reminder frequency and set up multiple reminders for complex medication schedules.",
    category: "Medications",
    videoUrl: "https://example.com/tutorials/reminders",
    order: 2,
    completed: true,
  },
  {
    id: 3,
    title: "Managing Multiple User Profiles",
    description: "Learn how to set up and manage profiles for family members.",
    content: "This tutorial explains how to create and manage multiple user profiles within a single account. You'll learn how to customize each profile, add specific medications and appointments for each family member, and switch between profiles easily.",
    category: "Family Care",
    videoUrl: "https://example.com/tutorials/profiles",
    order: 3,
    completed: false,
  },
  {
    id: 4,
    title: "Scheduling Doctor Appointments",
    description: "Learn how to schedule and manage doctor appointments in the app.",
    content: "In this tutorial, you'll learn how to add new doctor appointments, set up reminder notifications, and track your appointment history. We'll also cover how to add important details like doctor information, location, and appointment notes.",
    category: "Appointments",
    videoUrl: "https://example.com/tutorials/appointments",
    order: 4,
    completed: false,
  },
  {
    id: 5,
    title: "Understanding Medication Information",
    description: "Learn how to use the medication information feature to stay informed.",
    content: "This tutorial explains how to use the Medication Information feature to learn about your medications, side effects, drug interactions, and proper usage. You'll discover how to search for specific medications and understand the medical information provided.",
    category: "Medications",
    videoUrl: "https://example.com/tutorials/med-info",
    order: 5,
    completed: false,
  },
  {
    id: 6,
    title: "Sharing Health Data Securely",
    description: "Learn how to securely share your health information with caregivers and healthcare providers.",
    content: "In this tutorial, you'll learn how to share your medication schedule and health data with family members, caregivers, or healthcare providers. We'll cover privacy settings, controlling what information is shared, and setting expiry dates for shared access.",
    category: "Sharing",
    videoUrl: "https://example.com/tutorials/sharing",
    order: 6,
    completed: false,
  },
  {
    id: 7,
    title: "Customizing App Settings",
    description: "Learn how to personalize MediMate with language and theme options.",
    content: "This tutorial shows you how to customize app settings to suit your preferences. You'll learn how to change display languages, switch between light and dark themes, adjust notification settings, and configure other personalization options.",
    category: "Settings",
    videoUrl: "https://example.com/tutorials/settings",
    order: 7,
    completed: false,
  },
  {
    id: 8,
    title: "Advanced Reminder Features",
    description: "Discover advanced reminder options for complex medication schedules.",
    content: "In this advanced tutorial, you'll learn about specialized reminder features like medication refill reminders, dose-specific instructions, and how to handle medications that need to be taken on specific schedules (like every other day or weekly).",
    category: "Medications",
    videoUrl: "https://example.com/tutorials/advanced-reminders",
    order: 8,
    completed: false,
  },
];

// Tutorial categories
const tutorialCategories = [
  "All",
  "Basics", 
  "Medications", 
  "Family Care", 
  "Appointments", 
  "Sharing", 
  "Settings"
];

const Tutorials = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedTutorial, setSelectedTutorial] = useState<typeof mockTutorials[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter tutorials based on search query and selected category
  const filteredTutorials = mockTutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All" || 
                           tutorial.category === selectedCategory;
                           
    return matchesSearch && matchesCategory;
  });
  
  // Get completed and incomplete tutorials
  const completedTutorials = filteredTutorials.filter(tutorial => tutorial.completed);
  const incompleteTutorials = filteredTutorials.filter(tutorial => !tutorial.completed);
  
  // Open tutorial details dialog
  const openTutorialDetails = (tutorial: typeof mockTutorials[0]) => {
    setSelectedTutorial(tutorial);
    setIsDialogOpen(true);
  };
  
  // Toggle tutorial completion status
  const toggleTutorialCompletion = (id: number) => {
    const updatedTutorials = mockTutorials.map(tutorial => 
      tutorial.id === id ? { ...tutorial, completed: !tutorial.completed } : tutorial
    );
    // In a real app, you would update this in the database
    console.log("Updated tutorial completion status", updatedTutorials.find(t => t.id === id));
  };

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">App Tutorials</h1>
            <p className="text-gray-600">Learn how to get the most out of MediMate with our helpful guides</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto flex gap-2">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search tutorials..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="dropdown relative">
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter: </span>
                {selectedCategory}
              </Button>
              <div className="dropdown-menu absolute z-10 mt-1 right-0 bg-white rounded-md shadow-lg p-1 hidden">
                {tutorialCategories.map(category => (
                  <Button
                    key={category}
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {tutorialCategories.map(category => (
            <button
              key={category}
              className={`px-4 py-1.5 rounded-full text-sm ${
                selectedCategory === category
                  ? "bg-teal-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="all">All Tutorials</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="incomplete">Incomplete</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {filteredTutorials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No tutorials found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or category filter.
                </p>
                <Button 
                  className="mt-5 text-teal-600 hover:text-teal-700"
                  variant="ghost"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTutorials.map(tutorial => (
                  <TutorialCard 
                    key={tutorial.id} 
                    tutorial={tutorial}
                    onView={() => openTutorialDetails(tutorial)}
                    onToggleComplete={() => toggleTutorialCompletion(tutorial.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="completed">
            {completedTutorials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <CheckCircle2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No completed tutorials</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You haven't completed any tutorials yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedTutorials.map(tutorial => (
                  <TutorialCard 
                    key={tutorial.id} 
                    tutorial={tutorial}
                    onView={() => openTutorialDetails(tutorial)}
                    onToggleComplete={() => toggleTutorialCompletion(tutorial.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="incomplete">
            {incompleteTutorials.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">All tutorials completed</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Great job! You've completed all the tutorials.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {incompleteTutorials.map(tutorial => (
                  <TutorialCard 
                    key={tutorial.id} 
                    tutorial={tutorial}
                    onView={() => openTutorialDetails(tutorial)}
                    onToggleComplete={() => toggleTutorialCompletion(tutorial.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Tutorial Details Dialog */}
      {selectedTutorial && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle className="text-xl">{selectedTutorial.title}</DialogTitle>
            </DialogHeader>
            
            <div className="mt-2">
              <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center mb-4">
                <div className="text-center">
                  <PlayCircle className="h-16 w-16 text-teal-500 mx-auto" />
                  <p className="mt-2 text-sm text-gray-500">Video tutorial would play here</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h3 className="font-medium text-lg mb-2">About this tutorial</h3>
                <p className="text-gray-700">
                  {selectedTutorial.content}
                </p>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 mr-2">Category:</span>
                  <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
                    {selectedTutorial.category}
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      toggleTutorialCompletion(selectedTutorial.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    {selectedTutorial.completed ? "Mark as Incomplete" : "Mark as Complete"}
                  </Button>
                  
                  <Button 
                    className="bg-teal-500 hover:bg-teal-600"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

// Tutorial Card Component
interface TutorialCardProps {
  tutorial: {
    id: number;
    title: string;
    description: string;
    category: string;
    completed: boolean;
  };
  onView: () => void;
  onToggleComplete: () => void;
}

const TutorialCard: React.FC<TutorialCardProps> = ({ tutorial, onView, onToggleComplete }) => {
  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="pb-2 flex flex-row items-start justify-between">
        <div className="pr-4">
          <CardTitle className="text-lg">{tutorial.title}</CardTitle>
          <CardDescription className="mt-1">
            {tutorial.description}
          </CardDescription>
        </div>
        {tutorial.completed && (
          <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
        )}
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center text-sm text-gray-500">
          <span className="bg-teal-100 text-teal-800 text-xs px-2 py-0.5 rounded-full">
            {tutorial.category}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className={tutorial.completed ? "text-green-600" : "text-gray-600"}
          onClick={onToggleComplete}
        >
          {tutorial.completed ? "Completed" : "Mark Complete"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center text-teal-600 border-teal-200 hover:bg-teal-50"
          onClick={onView}
        >
          View Tutorial
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Tutorials;