import { useState } from "react";
import { format, isToday, isTomorrow, addDays, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Clock, Plus, MapPin, Edit, Trash2, User } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Mock profiles data
const mockProfiles = [
  { id: 1, name: "Me (Primary)" },
  { id: 2, name: "Sarah (Wife)" },
];

// Mock appointments data
const mockAppointments = [
  {
    id: 1,
    userId: 1,
    profileId: 1,
    profileName: "Me (Primary)",
    title: "Annual Checkup",
    doctorName: "Dr. Johnson",
    location: "City Medical Center, Room 305",
    date: new Date(2025, 3, 22), // April 22, 2025
    time: "14:30",
    notes: "Bring medical history and insurance card",
    reminderEnabled: true,
    reminderTime: 60, // minutes before
  },
  {
    id: 2,
    userId: 1,
    profileId: 1,
    profileName: "Me (Primary)",
    title: "Cardiology Follow-up",
    doctorName: "Dr. Williams",
    location: "Heart Institute, West Wing",
    date: new Date(2025, 3, 30), // April 30, 2025
    time: "10:00",
    notes: "Discuss test results and medication adjustments",
    reminderEnabled: true,
    reminderTime: 120, // minutes before
  },
  {
    id: 3,
    userId: 1,
    profileId: 2,
    profileName: "Sarah (Wife)",
    title: "Dental Cleaning",
    doctorName: "Dr. Chen",
    location: "Smile Dental Clinic",
    date: new Date(2025, 3, 25), // April 25, 2025
    time: "09:15",
    notes: "",
    reminderEnabled: true,
    reminderTime: 30, // minutes before
  },
  {
    id: 4,
    userId: 1,
    profileId: 1,
    profileName: "Me (Primary)",
    title: "Physical Therapy",
    doctorName: "Dr. Martinez",
    location: "Rehabilitation Center",
    date: addDays(new Date(), 1), // Tomorrow
    time: "15:30",
    notes: "Wear comfortable clothes and athletic shoes",
    reminderEnabled: true,
    reminderTime: 60, // minutes before
  },
  {
    id: 5,
    userId: 1,
    profileId: 1,
    profileName: "Me (Primary)",
    title: "Blood Work",
    doctorName: "Lab Services",
    location: "Downtown Medical Lab",
    date: new Date(), // Today
    time: "08:00",
    notes: "Fasting required 8 hours before appointment",
    reminderEnabled: true,
    reminderTime: 120, // minutes before
  },
];

// Form schema
const appointmentFormSchema = z.object({
  profileId: z.number({
    required_error: "Please select a profile",
  }),
  title: z.string().min(1, { message: "Title is required" }),
  doctorName: z.string().min(1, { message: "Doctor name is required" }),
  location: z.string().min(1, { message: "Location is required" }),
  date: z.date({
    required_error: "Appointment date is required",
  }),
  time: z.string().min(1, { message: "Appointment time is required" }),
  notes: z.string().optional(),
  reminderEnabled: z.boolean().default(true),
  reminderTime: z.number().min(5).max(1440).default(60),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

const Appointments = () => {
  const [appointments, setAppointments] = useState(mockAppointments);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter appointments for the selected date
  const dateAppointments = selectedDate 
    ? appointments.filter(apt => isSameDay(apt.date, selectedDate))
    : [];

  // Filter upcoming appointments (today and future)
  const upcomingAppointments = appointments
    .filter(apt => {
      // Get today's date with time set to midnight
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return apt.date >= today;
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get today's appointments
  const todayAppointments = appointments.filter(apt => isToday(apt.date));
  
  // Get tomorrow's appointments
  const tomorrowAppointments = appointments.filter(apt => isTomorrow(apt.date));
  
  // Form setup
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      profileId: 1, // Default to primary profile
      reminderEnabled: true,
      reminderTime: 60,
    },
  });

  const onSubmit = (data: AppointmentFormValues) => {
    console.log(data);
    
    // Get profile name
    const profile = mockProfiles.find(p => p.id === data.profileId);
    
    if (profile) {
      // Add the new appointment
      const newAppointment = {
        id: appointments.length + 1,
        userId: 1, // Assuming current user id is 1
        profileId: data.profileId,
        profileName: profile.name,
        title: data.title,
        doctorName: data.doctorName,
        location: data.location,
        date: data.date,
        time: data.time,
        notes: data.notes || "",
        reminderEnabled: data.reminderEnabled,
        reminderTime: data.reminderTime,
      };
      
      setAppointments([...appointments, newAppointment]);
      setIsDialogOpen(false);
      form.reset();
    }
  };

  // Function to get appointment date display text
  const getAppointmentDateText = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isTomorrow(date)) {
      return "Tomorrow";
    } else {
      return format(date, "EEEE, MMMM d, yyyy");
    }
  };

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Appointments</h1>
            <p className="text-gray-600">Schedule and manage your doctor appointments</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="mr-2 h-4 w-4" /> New Appointment
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Appointment</DialogTitle>
                <DialogDescription>
                  Schedule a new doctor or medical appointment.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="profileId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>For Whom</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a profile" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockProfiles.map(profile => (
                              <SelectItem 
                                key={profile.id} 
                                value={profile.id.toString()}
                              >
                                {profile.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Annual Checkup" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="doctorName"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Doctor Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Dr. Johnson" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., City Medical Center" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Time</FormLabel>
                          <FormControl>
                            <input 
                              type="time" 
                              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional notes about this appointment"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="reminderEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Reminder</FormLabel>
                          <FormDescription>
                            Enable a reminder for this appointment.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  {form.watch("reminderEnabled") && (
                    <FormField
                      control={form.control}
                      name="reminderTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Remind me before</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseInt(value))}
                            defaultValue={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select time" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="60">1 hour</SelectItem>
                              <SelectItem value="120">2 hours</SelectItem>
                              <SelectItem value="1440">1 day</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                      Save Appointment
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Calendar</CardTitle>
                <CardDescription>Select a date to view appointments</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {todayAppointments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No appointments scheduled for today.</p>
                ) : (
                  <div className="space-y-3">
                    {todayAppointments.map(apt => (
                      <div 
                        key={apt.id}
                        className="p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex justify-between">
                          <p className="font-medium">{apt.title}</p>
                          <p className="text-teal-600">{formatTime(apt.time)}</p>
                        </div>
                        <p className="text-sm text-gray-600">{apt.doctorName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tomorrow's Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {tomorrowAppointments.length === 0 ? (
                  <p className="text-gray-500 text-sm">No appointments scheduled for tomorrow.</p>
                ) : (
                  <div className="space-y-3">
                    {tomorrowAppointments.map(apt => (
                      <div 
                        key={apt.id}
                        className="p-3 border rounded-md hover:bg-gray-50"
                      >
                        <div className="flex justify-between">
                          <p className="font-medium">{apt.title}</p>
                          <p className="text-teal-600">{formatTime(apt.time)}</p>
                        </div>
                        <p className="text-sm text-gray-600">{apt.doctorName}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Tabs defaultValue="selected" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="selected">Selected Date</TabsTrigger>
                <TabsTrigger value="upcoming">All Upcoming</TabsTrigger>
              </TabsList>
              
              <TabsContent value="selected">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {selectedDate ? getAppointmentDateText(selectedDate) : "Select a date"}
                  </h2>
                </div>
                
                {dateAppointments.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">No appointments scheduled for this date.</p>
                    <Button 
                      className="mt-5 bg-teal-500 hover:bg-teal-600"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> New Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {dateAppointments.map(appointment => (
                      <AppointmentCard 
                        key={appointment.id} 
                        appointment={appointment} 
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="upcoming">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Upcoming Appointments
                  </h2>
                </div>
                
                {upcomingAppointments.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-lg shadow">
                    <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No upcoming appointments</h3>
                    <p className="mt-1 text-sm text-gray-500">You don't have any upcoming appointments scheduled.</p>
                    <Button 
                      className="mt-5 bg-teal-500 hover:bg-teal-600"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Plus className="mr-2 h-4 w-4" /> New Appointment
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {upcomingAppointments.map(appointment => (
                      <div key={appointment.id}>
                        <div className="mb-2 pb-1 border-b border-gray-200">
                          <p className="text-md font-medium text-gray-500">
                            {getAppointmentDateText(appointment.date)}
                          </p>
                        </div>
                        <AppointmentCard appointment={appointment} />
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hourInt = parseInt(hours, 10);
  const ampm = hourInt >= 12 ? 'PM' : 'AM';
  const hour12 = hourInt % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

// Appointment Card Component
interface AppointmentCardProps {
  appointment: {
    id: number;
    profileId: number;
    profileName: string;
    title: string;
    doctorName: string;
    location: string;
    date: Date;
    time: string;
    notes?: string;
    reminderEnabled: boolean;
    reminderTime: number;
  };
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-medium">{appointment.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {formatTime(appointment.time)} • {appointment.doctorName}
            </CardDescription>
          </div>
          <div className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
            {isToday(appointment.date) ? "Today" : ""}
            {isTomorrow(appointment.date) ? "Tomorrow" : ""}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="space-y-2">
          <div className="flex items-start">
            <User className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
            <span className="text-sm text-gray-600">{appointment.profileName}</span>
          </div>
          <div className="flex items-start">
            <MapPin className="h-4 w-4 mr-2 mt-0.5 text-gray-500" />
            <span className="text-sm text-gray-600">{appointment.location}</span>
          </div>
          {appointment.notes && (
            <div className="pt-2">
              <p className="text-sm text-gray-600">{appointment.notes}</p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-1" /> Cancel
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Appointments;