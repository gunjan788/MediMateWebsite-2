import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Pill, Clock, Edit, Trash2, Plus } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Form schema
const medicationFormSchema = z.object({
  name: z.string().min(2, { message: "Medication name is required" }),
  dosage: z.string().min(1, { message: "Dosage is required" }),
  frequency: z.string().min(1, { message: "Frequency is required" }),
  instructions: z.string().optional(),
  startDate: z.date({ required_error: "Start date is required" }),
  endDate: z.date().optional(),
  notes: z.string().optional(),
});

type MedicationFormValues = z.infer<typeof medicationFormSchema>;

// Mock data for medications
const mockMedications = [
  {
    id: 1,
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    instructions: "Take in the morning with food",
    startDate: new Date("2023-01-15"),
    endDate: new Date("2023-12-31"),
    active: true,
  },
  {
    id: 2,
    name: "Metformin",
    dosage: "500mg",
    frequency: "Twice daily",
    instructions: "Take with meals",
    startDate: new Date("2023-02-10"),
    active: true,
  },
  {
    id: 3,
    name: "Atorvastatin",
    dosage: "20mg",
    frequency: "Once daily",
    instructions: "Take at bedtime",
    startDate: new Date("2023-03-05"),
    active: true,
  },
  {
    id: 4,
    name: "Albuterol",
    dosage: "2 puffs",
    frequency: "As needed",
    instructions: "Use for shortness of breath",
    startDate: new Date("2023-01-20"),
    active: true,
  },
  {
    id: 5,
    name: "Ibuprofen",
    dosage: "600mg",
    frequency: "Every 6 hours as needed",
    instructions: "Take with food for pain",
    startDate: new Date("2023-04-10"),
    endDate: new Date("2023-04-17"),
    active: false,
  }
];

const Medications = () => {
  const [medications, setMedications] = useState(mockMedications);
  const [activeTab, setActiveTab] = useState("active");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter medications based on active status
  const activeMedications = medications.filter(med => med.active);
  const inactiveMedications = medications.filter(med => !med.active);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingMedicationId, setEditingMedicationId] = useState<number | null>(null);

  // Form setup
  const form = useForm<MedicationFormValues>({
    resolver: zodResolver(medicationFormSchema),
    defaultValues: {
      name: "",
      dosage: "",
      frequency: "",
      instructions: "",
      notes: "",
    },
  });

  // Edit medication
  const editMedication = (medication: any) => {
    setIsEditMode(true);
    setEditingMedicationId(medication.id);
    form.reset({
      name: medication.name,
      dosage: medication.dosage,
      frequency: medication.frequency,
      instructions: medication.instructions || "",
      startDate: medication.startDate,
      endDate: medication.endDate,
      notes: medication.notes || "",
    });
    setIsDialogOpen(true);
  };

  // Delete medication
  const deleteMedication = (id: number) => {
    if (window.confirm("Are you sure you want to delete this medication?")) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const onSubmit = (data: MedicationFormValues) => {
    console.log(data);
    
    if (isEditMode && editingMedicationId) {
      // Update existing medication
      setMedications(medications.map(med => 
        med.id === editingMedicationId 
          ? { ...med, ...data } 
          : med
      ));
    } else {
      // Add new medication
      const newMedication = {
        id: medications.length + 1,
        ...data,
        active: true,
      };
      setMedications([...medications, newMedication]);
    }
    
    setIsDialogOpen(false);
    setIsEditMode(false);
    setEditingMedicationId(null);
    form.reset();
  };

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Medications</h1>
            <p className="text-gray-600">Manage your medication list</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="mr-2 h-4 w-4" /> Add Medication
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Medication</DialogTitle>
                <DialogDescription>
                  Enter the details for your new medication below.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter medication name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="dosage"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Dosage</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 10mg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Frequency</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Once daily">Once daily</SelectItem>
                              <SelectItem value="Twice daily">Twice daily</SelectItem>
                              <SelectItem value="Three times daily">Three times daily</SelectItem>
                              <SelectItem value="Four times daily">Four times daily</SelectItem>
                              <SelectItem value="Every 6 hours">Every 6 hours</SelectItem>
                              <SelectItem value="Every 8 hours">Every 8 hours</SelectItem>
                              <SelectItem value="Every 12 hours">Every 12 hours</SelectItem>
                              <SelectItem value="As needed">As needed</SelectItem>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="instructions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Take with food" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Start Date</FormLabel>
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
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>End Date (Optional)</FormLabel>
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
                  </div>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional notes about this medication"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600">Save Medication</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="active" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="active">Active Medications</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Medications</TabsTrigger>
          </TabsList>
          <TabsContent value="active">
            {activeMedications.length === 0 ? (
              <div className="text-center py-12">
                <Pill className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No active medications</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by adding a new medication.</p>
                <Button 
                  className="mt-5 bg-teal-500 hover:bg-teal-600"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Medication
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeMedications.map(medication => (
                  <MedicationCard 
                    key={medication.id} 
                    medication={medication} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="inactive">
            {inactiveMedications.length === 0 ? (
              <div className="text-center py-12">
                <Pill className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No inactive medications</h3>
                <p className="mt-1 text-sm text-gray-500">Medications you discontinue will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inactiveMedications.map(medication => (
                  <MedicationCard 
                    key={medication.id} 
                    medication={medication} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Medication Card Component
interface MedicationCardProps {
  medication: {
    id: number;
    name: string;
    dosage: string;
    frequency: string;
    instructions?: string;
    startDate: Date;
    endDate?: Date;
    active: boolean;
  };
}

const MedicationCard: React.FC<MedicationCardProps> = ({ medication }) => {
  // Set up the dialog for adding a reminder
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false);
  const [medications, setMedications] = useState(mockMedications);
  
  const handleAddReminder = () => {
    // Display dialog to add a reminder
    setIsReminderDialogOpen(true);
    console.log(`Adding reminder for medication: ${medication.name}`);
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-medium">{medication.name}</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {medication.dosage} • {medication.frequency}
            </CardDescription>
          </div>
          <Pill className="h-6 w-6 text-teal-600" />
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {medication.instructions && (
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-700">Instructions:</p>
            <p className="text-sm text-gray-600">{medication.instructions}</p>
          </div>
        )}
        <div className="flex items-center text-sm text-gray-600 mt-2">
          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
          <span>
            Started: {format(medication.startDate, "MMM dd, yyyy")}
            {medication.endDate && ` • Ends: ${format(medication.endDate, "MMM dd, yyyy")}`}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => editMedication(medication)}
        >
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-red-200 text-red-500 hover:bg-red-50"
          onClick={() => deleteMedication(medication.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="border-teal-200 text-teal-600 hover:bg-teal-50"
          onClick={handleAddReminder}
        >
          <Clock className="h-4 w-4 mr-1" /> Add Reminder
        </Button>
      </CardFooter>
      
      {/* Reminder Dialog */}
      <Dialog open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Reminder for {medication.name}</DialogTitle>
            <DialogDescription>
              Set up reminders for when to take this medication.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reminder-time">Time</Label>
                <input 
                  id="reminder-time"
                  type="time" 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              
              <div className="space-y-2">
                <Label>Days</Label>
                <div className="grid grid-cols-7 gap-2">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <Checkbox id={`day-${index}`} defaultChecked />
                      <Label htmlFor={`day-${index}`} className="mt-1 text-xs">{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch id="audio-enabled" defaultChecked />
                <Label htmlFor="audio-enabled">Audio notifications</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="bg-teal-500 hover:bg-teal-600"
              onClick={() => {
                console.log("Reminder saved!");
                setIsReminderDialogOpen(false);
              }}
            >
              Save Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default Medications;