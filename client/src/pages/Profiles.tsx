import { useState } from "react";
import { format } from "date-fns";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Popover, PopoverContent, PopoverTrigger 
} from "@/components/ui/popover";
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from "@/components/ui/select";
import { 
  User, Calendar as CalendarIcon, Plus, Edit, Trash2, UserPlus 
} from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Mock profiles data
const mockProfiles = [
  {
    id: 1,
    name: "John Smith",
    dateOfBirth: new Date(1980, 5, 15),
    relationship: "self",
    notes: "Primary user account",
    medications: 3,
    appointments: 2,
  },
  {
    id: 2,
    name: "Sarah Smith",
    dateOfBirth: new Date(1982, 2, 10),
    relationship: "spouse",
    notes: "Allergic to penicillin",
    medications: 2,
    appointments: 1,
  },
];

// Form schema
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name is required" }),
  dateOfBirth: z.date().optional(),
  relationship: z.string(),
  notes: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// Relationship options
const relationshipOptions = [
  { value: "self", label: "Self" },
  { value: "spouse", label: "Spouse" },
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "grandparent", label: "Grandparent" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Other" },
];

const Profiles = () => {
  const [profiles, setProfiles] = useState(mockProfiles);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<typeof mockProfiles[0] | null>(null);

  // Form setup
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      relationship: "self",
      notes: "",
    },
  });

  // Open dialog for editing
  const openEditDialog = (profile: typeof mockProfiles[0]) => {
    setEditingProfile(profile);
    form.reset({
      name: profile.name,
      dateOfBirth: profile.dateOfBirth,
      relationship: profile.relationship,
      notes: profile.notes,
    });
    setIsDialogOpen(true);
  };

  // Open dialog for new profile
  const openNewDialog = () => {
    setEditingProfile(null);
    form.reset({
      name: "",
      relationship: "self",
      notes: "",
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: ProfileFormValues) => {
    console.log(data);
    
    if (editingProfile) {
      // Update existing profile
      const updatedProfiles = profiles.map(profile => 
        profile.id === editingProfile.id 
          ? { 
              ...profile, 
              name: data.name,
              dateOfBirth: data.dateOfBirth,
              relationship: data.relationship,
              notes: data.notes || "",
            } 
          : profile
      );
      setProfiles(updatedProfiles);
    } else {
      // Add new profile
      const newProfile = {
        id: Math.max(0, ...profiles.map(p => p.id)) + 1,
        name: data.name,
        dateOfBirth: data.dateOfBirth,
        relationship: data.relationship,
        notes: data.notes || "",
        medications: 0,
        appointments: 0,
      };
      setProfiles([...profiles, newProfile]);
    }
    
    setIsDialogOpen(false);
    form.reset();
  };

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">User Profiles</h1>
            <p className="text-gray-600">Manage profiles for yourself and family members</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600" onClick={openNewDialog}>
                <UserPlus className="mr-2 h-4 w-4" /> Add Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>
                  {editingProfile ? "Edit Profile" : "Add New Profile"}
                </DialogTitle>
                <DialogDescription>
                  {editingProfile 
                    ? "Update the profile information below." 
                    : "Create a new profile for your family member."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="dateOfBirth"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth (Optional)</FormLabel>
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
                              captionLayout="dropdown-buttons"
                              fromYear={1920}
                              toYear={2024}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          This helps with age-specific medication guidance.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="relationship"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Relationship</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select relationship" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {relationshipOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
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
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Notes (Optional)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any important health information or notes"
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Add any allergies, health conditions, or other important information.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                      {editingProfile ? "Update Profile" : "Add Profile"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {profiles.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">No profiles</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a profile for yourself.
            </p>
            <Button 
              className="mt-5 bg-teal-500 hover:bg-teal-600"
              onClick={openNewDialog}
            >
              <UserPlus className="mr-2 h-4 w-4" /> Add Profile
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profiles.map(profile => (
              <ProfileCard 
                key={profile.id} 
                profile={profile}
                onEdit={() => openEditDialog(profile)}
              />
            ))}
            
            {/* Add Profile Card */}
            <Card className="border-dashed hover:border-teal-500 hover:shadow-sm transition-all cursor-pointer flex flex-col items-center justify-center py-8" onClick={openNewDialog}>
              <UserPlus className="h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900">Add New Profile</p>
              <p className="text-sm text-gray-500 mt-1">Create a profile for a family member</p>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

// Profile Card Component
interface ProfileCardProps {
  profile: {
    id: number;
    name: string;
    dateOfBirth?: Date;
    relationship: string;
    notes?: string;
    medications: number;
    appointments: number;
  };
  onEdit: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onEdit }) => {
  const getRelationshipLabel = (value: string) => {
    const option = relationshipOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  };

  const getAge = (dateOfBirth?: Date) => {
    if (!dateOfBirth) return null;
    
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    const m = today.getMonth() - dateOfBirth.getMonth();
    
    if (m < 0 || (m === 0 && today.getDate() < dateOfBirth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-medium">{profile.name}</CardTitle>
          <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">
            {getRelationshipLabel(profile.relationship)}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {profile.dateOfBirth && (
            <div className="flex items-center text-sm">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
              <span>
                {format(profile.dateOfBirth, "MMMM d, yyyy")}
                {getAge(profile.dateOfBirth) !== null && (
                  <span className="text-gray-500"> ({getAge(profile.dateOfBirth)} years old)</span>
                )}
              </span>
            </div>
          )}
          
          {profile.notes && (
            <p className="text-sm text-gray-600 border-t pt-2 mt-2">
              {profile.notes}
            </p>
          )}
          
          <div className="pt-2 grid grid-cols-2 gap-2">
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-xl font-semibold text-teal-600">{profile.medications}</p>
              <p className="text-xs text-gray-500">Medications</p>
            </div>
            <div className="bg-gray-50 p-2 rounded text-center">
              <p className="text-xl font-semibold text-teal-600">{profile.appointments}</p>
              <p className="text-xs text-gray-500">Appointments</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Profiles;