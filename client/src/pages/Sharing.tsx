import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  Share2, Calendar as CalendarIcon, Plus, Edit, Trash2, Mail, User, Check, X 
} from "lucide-react";
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

// Mock sharing data
const mockSharing = [
  {
    id: 1,
    sharedWithName: "Dr. Johnson",
    sharedWithEmail: "dr.johnson@hospital.com",
    relationship: "Doctor",
    medications: true,
    appointments: true,
    profiles: false,
    expiryDate: new Date(2025, 9, 15), // October 15, 2025
    active: true,
  },
  {
    id: 2,
    sharedWithName: "Mary Smith",
    sharedWithEmail: "mary.smith@example.com",
    relationship: "Caregiver",
    medications: true,
    appointments: true,
    profiles: true,
    expiryDate: new Date(2025, 11, 31), // December 31, 2025
    active: true,
  },
  {
    id: 3,
    sharedWithName: "Robert Jones",
    sharedWithEmail: "robert@example.com",
    relationship: "Family Member",
    medications: true,
    appointments: false,
    profiles: false,
    expiryDate: null,
    active: false,
  },
];

// Form schema
const sharingFormSchema = z.object({
  sharedWithName: z.string().min(2, { message: "Name is required" }),
  sharedWithEmail: z.string().email({ message: "Valid email is required" }),
  relationship: z.string().min(1, { message: "Relationship is required" }),
  medications: z.boolean().default(true),
  appointments: z.boolean().default(true),
  profiles: z.boolean().default(false),
  expiryDate: z.date().nullable().optional(),
  active: z.boolean().default(true),
});

type SharingFormValues = z.infer<typeof sharingFormSchema>;

const Sharing = () => {
  const [sharingList, setSharingList] = useState(mockSharing);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingShare, setEditingShare] = useState<typeof mockSharing[0] | null>(null);

  // Form setup
  const form = useForm<SharingFormValues>({
    resolver: zodResolver(sharingFormSchema),
    defaultValues: {
      sharedWithName: "",
      sharedWithEmail: "",
      relationship: "",
      medications: true,
      appointments: true,
      profiles: false,
      active: true,
    },
  });

  // Open dialog for editing
  const openEditDialog = (share: typeof mockSharing[0]) => {
    setEditingShare(share);
    form.reset({
      sharedWithName: share.sharedWithName,
      sharedWithEmail: share.sharedWithEmail,
      relationship: share.relationship,
      medications: share.medications,
      appointments: share.appointments,
      profiles: share.profiles,
      expiryDate: share.expiryDate,
      active: share.active,
    });
    setIsDialogOpen(true);
  };

  // Open dialog for new share
  const openNewDialog = () => {
    setEditingShare(null);
    form.reset({
      sharedWithName: "",
      sharedWithEmail: "",
      relationship: "",
      medications: true,
      appointments: true,
      profiles: false,
      active: true,
    });
    setIsDialogOpen(true);
  };

  const onSubmit = (data: SharingFormValues) => {
    console.log(data);
    
    if (editingShare) {
      // Update existing share
      const updatedSharing = sharingList.map(share => 
        share.id === editingShare.id 
          ? { 
              ...share, 
              ...data
            } 
          : share
      );
      setSharingList(updatedSharing);
    } else {
      // Add new share
      const newShare = {
        id: Math.max(0, ...sharingList.map(s => s.id)) + 1,
        ...data
      };
      setSharingList([...sharingList, newShare]);
    }
    
    setIsDialogOpen(false);
    form.reset();
  };

  // Toggle active status
  const toggleActive = (id: number) => {
    setSharingList(sharingList.map(share => 
      share.id === id ? { ...share, active: !share.active } : share
    ));
  };

  // Get active and inactive shares
  const activeShares = sharingList.filter(share => share.active);
  const inactiveShares = sharingList.filter(share => !share.active);

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Health Data Sharing</h1>
            <p className="text-gray-600">Share your health information with caregivers, family members, and healthcare providers</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600" onClick={openNewDialog}>
                <Plus className="mr-2 h-4 w-4" /> Share Data
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>
                  {editingShare ? "Edit Sharing" : "Share Health Data"}
                </DialogTitle>
                <DialogDescription>
                  {editingShare 
                    ? "Update your health data sharing preferences." 
                    : "Share your health data with someone you trust."}
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="sharedWithName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter recipient's name" {...field} />
                        </FormControl>
                        <FormDescription>
                          The person who will have access to your health data.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="sharedWithEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email"
                            placeholder="Enter recipient's email" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          We'll send them instructions on how to access your data.
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
                        <FormControl>
                          <Input 
                            placeholder="e.g., Doctor, Family Member, Caregiver" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="space-y-3">
                    <FormLabel className="text-base">Shared Information</FormLabel>
                    <FormDescription>
                      Select what health data you want to share.
                    </FormDescription>
                    
                    <FormField
                      control={form.control}
                      name="medications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Medications
                            </FormLabel>
                            <FormDescription>
                              Share your medication list and schedule.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="appointments"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              Appointments
                            </FormLabel>
                            <FormDescription>
                              Share your upcoming medical appointments.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="profiles"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              User Profiles
                            </FormLabel>
                            <FormDescription>
                              Share your profile information and health notes.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="expiryDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Expiry Date (Optional)</FormLabel>
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
                                  <span>Never expires</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <div className="p-2 border-b">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => field.onChange(null)}
                                className="text-xs"
                              >
                                Clear (Never Expires)
                              </Button>
                            </div>
                            <Calendar
                              mode="single"
                              selected={field.value || undefined}
                              onSelect={field.onChange}
                              initialFocus
                              disabled={date => date < new Date()}
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Access will automatically expire on this date. Leave empty for unlimited access.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="active"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Active
                          </FormLabel>
                          <FormDescription>
                            Toggle to enable or disable sharing.
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
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                      {editingShare ? "Update Sharing" : "Share Data"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-8">
          {/* Active Sharing */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Active Sharing</h2>
            
            {activeShares.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <Share2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No active sharing</h3>
                <p className="mt-1 text-sm text-gray-500">
                  You're not currently sharing your health data with anyone.
                </p>
                <Button 
                  className="mt-5 bg-teal-500 hover:bg-teal-600"
                  onClick={openNewDialog}
                >
                  <Plus className="mr-2 h-4 w-4" /> Share Data
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeShares.map(share => (
                  <ShareCard 
                    key={share.id} 
                    share={share}
                    onEdit={() => openEditDialog(share)}
                    onToggleActive={() => toggleActive(share.id)}
                  />
                ))}
              </div>
            )}
          </div>
          
          {/* Inactive Sharing */}
          {inactiveShares.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Inactive Sharing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inactiveShares.map(share => (
                  <ShareCard 
                    key={share.id} 
                    share={share}
                    onEdit={() => openEditDialog(share)}
                    onToggleActive={() => toggleActive(share.id)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Share Card Component
interface ShareCardProps {
  share: {
    id: number;
    sharedWithName: string;
    sharedWithEmail: string;
    relationship: string;
    medications: boolean;
    appointments: boolean;
    profiles: boolean;
    expiryDate: Date | null;
    active: boolean;
  };
  onEdit: () => void;
  onToggleActive: () => void;
}

const ShareCard: React.FC<ShareCardProps> = ({ share, onEdit, onToggleActive }) => {
  return (
    <Card className={`hover:shadow-md transition-shadow ${!share.active && 'opacity-75'}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-medium">{share.sharedWithName}</CardTitle>
            <CardDescription className="text-sm text-gray-500 mt-1">
              {share.relationship}
            </CardDescription>
          </div>
          <div>
            {share.active ? (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                Active
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">
                Inactive
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <Mail className="h-4 w-4 mr-2 text-gray-500" />
            <span className="text-gray-600">{share.sharedWithEmail}</span>
          </div>
          
          {share.expiryDate && (
            <div className="flex items-center text-sm">
              <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-600">
                Expires: {format(share.expiryDate, "MMMM d, yyyy")}
              </span>
            </div>
          )}
          
          <div className="pt-2">
            <p className="text-sm font-medium text-gray-700 mb-2">Shared Information:</p>
            <div className="space-y-1">
              <div className="flex items-center text-sm">
                {share.medications ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <X className="h-4 w-4 mr-2 text-red-500" />
                )}
                <span className="text-gray-600">Medications</span>
              </div>
              <div className="flex items-center text-sm">
                {share.appointments ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <X className="h-4 w-4 mr-2 text-red-500" />
                )}
                <span className="text-gray-600">Appointments</span>
              </div>
              <div className="flex items-center text-sm">
                {share.profiles ? (
                  <Check className="h-4 w-4 mr-2 text-green-500" />
                ) : (
                  <X className="h-4 w-4 mr-2 text-red-500" />
                )}
                <span className="text-gray-600">User Profiles</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          className={share.active 
            ? "border-red-200 text-red-500 hover:bg-red-50" 
            : "border-green-200 text-green-500 hover:bg-green-50"
          }
          onClick={onToggleActive}
        >
          {share.active ? (
            <>
              <X className="h-4 w-4 mr-1" /> Disable
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-1" /> Enable
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Sharing;