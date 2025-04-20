import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger 
} from "@/components/ui/dialog";
import { 
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage 
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Bell, Clock, Plus, Edit, Trash2, Volume2, VolumeX, Mic
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";

// Mock medications for dropdown selection
const mockMedications = [
  { id: 1, name: "Lisinopril", dosage: "10mg" },
  { id: 2, name: "Metformin", dosage: "500mg" },
  { id: 3, name: "Atorvastatin", dosage: "20mg" },
  { id: 4, name: "Albuterol", dosage: "2 puffs" },
];

// Mock reminders data
const mockReminders = [
  {
    id: 1,
    medicationId: 1,
    medicationName: "Lisinopril",
    medicationDosage: "10mg",
    time: "08:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    audioEnabled: true,
    audioType: "default",
    active: true,
  },
  {
    id: 2,
    medicationId: 2,
    medicationName: "Metformin",
    medicationDosage: "500mg",
    time: "08:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    audioEnabled: true,
    audioType: "gentle",
    active: true,
  },
  {
    id: 3,
    medicationId: 2,
    medicationName: "Metformin",
    medicationDosage: "500mg",
    time: "20:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    audioEnabled: true,
    audioType: "default",
    active: true,
  },
  {
    id: 4,
    medicationId: 3,
    medicationName: "Atorvastatin",
    medicationDosage: "20mg",
    time: "21:00",
    days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    audioEnabled: false,
    audioType: "default",
    active: true,
  },
  {
    id: 5,
    medicationId: 4,
    medicationName: "Albuterol",
    medicationDosage: "2 puffs",
    time: "08:00",
    days: ["monday", "wednesday", "friday"],
    audioEnabled: true,
    audioType: "urgent",
    active: false,
  },
];

// Form schema
const reminderFormSchema = z.object({
  medicationId: z.number({
    required_error: "Please select a medication",
  }),
  time: z.string().min(1, { message: "Time is required" }),
  days: z.array(z.string()).min(1, { message: "Please select at least one day" }),
  audioEnabled: z.boolean().default(true),
  audioType: z.string().default("default"),
  useVoiceReminder: z.boolean().default(false),
  voiceRecording: z.string().optional(),
});

type ReminderFormValues = z.infer<typeof reminderFormSchema>;

// Days of the week for checkboxes
const daysOfWeek = [
  { id: "monday", label: "Monday" },
  { id: "tuesday", label: "Tuesday" },
  { id: "wednesday", label: "Wednesday" },
  { id: "thursday", label: "Thursday" },
  { id: "friday", label: "Friday" },
  { id: "saturday", label: "Saturday" },
  { id: "sunday", label: "Sunday" },
];

const Reminders = () => {
  const [reminders, setReminders] = useState(mockReminders);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Filter reminders
  const activeReminders = reminders.filter(reminder => reminder.active);
  const inactiveReminders = reminders.filter(reminder => !reminder.active);

  // Group reminders by time
  const groupedReminders = activeReminders.reduce((acc, reminder) => {
    const timeKey = reminder.time;
    if (!acc[timeKey]) {
      acc[timeKey] = [];
    }
    acc[timeKey].push(reminder);
    return acc;
  }, {} as Record<string, typeof activeReminders>);

  // Sort times
  const sortedTimes = Object.keys(groupedReminders).sort();

  // Form setup
  const form = useForm<ReminderFormValues>({
    resolver: zodResolver(reminderFormSchema),
    defaultValues: {
      days: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
      audioEnabled: true,
      audioType: "default",
    },
  });

  const onSubmit = (data: ReminderFormValues) => {
    console.log(data);
    // Get medication details
    const medication = mockMedications.find(med => med.id === data.medicationId);
    
    if (medication) {
      // Add the new reminder
      const newReminder = {
        id: reminders.length + 1,
        medicationId: data.medicationId,
        medicationName: medication.name,
        medicationDosage: medication.dosage,
        time: data.time,
        days: data.days,
        audioEnabled: data.audioEnabled,
        audioType: data.audioType,
        useVoiceReminder: data.useVoiceReminder,
        voiceRecording: data.voiceRecording,
        active: true,
      };
      
      console.log("New reminder with voice recording:", data.useVoiceReminder);
      if (data.useVoiceReminder && data.voiceRecording) {
        console.log("Voice recording added successfully!");
      }
      
      setReminders([...reminders, newReminder]);
      setIsDialogOpen(false);
      form.reset();
    }
  };

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Medication Reminders</h1>
            <p className="text-gray-600">Set up reminders for your medications</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="mr-2 h-4 w-4" /> Add Reminder
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[90%] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Reminder</DialogTitle>
                <DialogDescription>
                  Set up a reminder for your medication.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
                  <FormField
                    control={form.control}
                    name="medicationId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medication</FormLabel>
                        <Select 
                          onValueChange={(value) => field.onChange(parseInt(value))}
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a medication" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mockMedications.map(medication => (
                              <SelectItem 
                                key={medication.id} 
                                value={medication.id.toString()}
                              >
                                {medication.name} ({medication.dosage})
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
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Reminder Time</FormLabel>
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
                  
                  <FormField
                    control={form.control}
                    name="days"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Days of the Week</FormLabel>
                          <FormDescription>
                            Select the days when this reminder should be active.
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-7 gap-2">
                          {daysOfWeek.map((day) => (
                            <FormField
                              key={day.id}
                              control={form.control}
                              name="days"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={day.id}
                                    className="flex flex-col items-center space-y-1"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(day.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, day.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== day.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-xs">
                                      {day.label.substring(0, 3)}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="audioEnabled"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Audio Notification</FormLabel>
                          <FormDescription>
                            Enable audio alerts for this reminder.
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
                  
                  {form.watch("audioEnabled") && (
                    <FormField
                      control={form.control}
                      name="audioType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Audio Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select audio type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="default">Default</SelectItem>
                              <SelectItem value="gentle">Gentle</SelectItem>
                              <SelectItem value="chime">Chime</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the sound that will play when the reminder is triggered.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  
                  <FormField
                    control={form.control}
                    name="useVoiceReminder"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Voice Reminder</FormLabel>
                          <FormDescription>
                            Record a voice message to play when this reminder is triggered.
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
                  
                  {form.watch("useVoiceReminder") && (
                    <VoiceRecorder form={form} />
                  )}
                  
                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-teal-500 hover:bg-teal-600">
                      Save Reminder
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">All Reminders</TabsTrigger>
            <TabsTrigger value="daily">Daily Schedule</TabsTrigger>
            <TabsTrigger value="inactive">Inactive Reminders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {activeReminders.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No reminders set</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new reminder.</p>
                <Button 
                  className="mt-5 bg-teal-500 hover:bg-teal-600"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" /> Add Reminder
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeReminders.map(reminder => (
                  <ReminderCard 
                    key={reminder.id} 
                    reminder={reminder} 
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="daily">
            <div className="space-y-6">
              {sortedTimes.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No daily schedule</h3>
                  <p className="mt-1 text-sm text-gray-500">Add reminders to see your daily schedule.</p>
                  <Button 
                    className="mt-5 bg-teal-500 hover:bg-teal-600"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Reminder
                  </Button>
                </div>
              ) : (
                sortedTimes.map(time => (
                  <div key={time} className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="bg-teal-500 px-4 py-3 text-white font-medium flex items-center">
                      <Clock className="mr-2 h-5 w-5" />
                      <span>{formatTime(time)}</span>
                    </div>
                    <div className="p-4">
                      {groupedReminders[time].map(reminder => (
                        <div 
                          key={reminder.id} 
                          className="py-3 flex justify-between items-center border-b last:border-0"
                        >
                          <div>
                            <p className="font-medium text-gray-800">
                              {reminder.medicationName} ({reminder.medicationDosage})
                            </p>
                            <p className="text-sm text-gray-600">
                              {formatDays(reminder.days)}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 p-0 mr-1" 
                              onClick={() => {
                                // Create and play audio
                                const audio = new Audio();
                                audio.src = reminder.audioType === 'default' 
                                  ? "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3"
                                  : reminder.audioType === 'gentle'
                                  ? "https://assets.mixkit.co/active_storage/sfx/2471/2471-preview.mp3"
                                  : reminder.audioType === 'chime'
                                  ? "https://assets.mixkit.co/active_storage/sfx/1862/1862-preview.mp3"
                                  : "https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3";
                                audio.play().catch(e => console.error("Error playing sound:", e));
                              }}
                            >
                              <span>▶</span>
                            </Button>
                            <div className="mr-2">
                              {reminder.audioEnabled ? (
                                <Volume2 className="h-4 w-4 text-teal-500" />
                              ) : (
                                <VolumeX className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <Button variant="ghost" size="sm" className="mr-1">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-500">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="inactive">
            {inactiveReminders.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">No inactive reminders</h3>
                <p className="mt-1 text-sm text-gray-500">Disabled reminders will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {inactiveReminders.map(reminder => (
                  <ReminderCard 
                    key={reminder.id} 
                    reminder={reminder} 
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

// Helper functions
const formatTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  const hourInt = parseInt(hours, 10);
  const ampm = hourInt >= 12 ? 'PM' : 'AM';
  const hour12 = hourInt % 12 || 12;
  return `${hour12}:${minutes} ${ampm}`;
};

const formatDays = (days: string[]) => {
  if (days.length === 7) {
    return "Every day";
  }
  
  if (
    days.includes('monday') &&
    days.includes('tuesday') &&
    days.includes('wednesday') &&
    days.includes('thursday') &&
    days.includes('friday') &&
    !days.includes('saturday') &&
    !days.includes('sunday')
  ) {
    return "Weekdays";
  }
  
  if (
    !days.includes('monday') &&
    !days.includes('tuesday') &&
    !days.includes('wednesday') &&
    !days.includes('thursday') &&
    !days.includes('friday') &&
    days.includes('saturday') &&
    days.includes('sunday')
  ) {
    return "Weekends";
  }
  
  const dayNames = {
    monday: "Mon",
    tuesday: "Tue",
    wednesday: "Wed",
    thursday: "Thu",
    friday: "Fri",
    saturday: "Sat",
    sunday: "Sun"
  };
  
  return days.map(day => dayNames[day as keyof typeof dayNames]).join(", ");
};

// Reminder Card Component
interface ReminderCardProps {
  reminder: {
    id: number;
    medicationId: number;
    medicationName: string;
    medicationDosage: string;
    time: string;
    days: string[];
    audioEnabled: boolean;
    audioType: string;
    useVoiceReminder?: boolean;
    voiceRecording?: string;
    active: boolean;
  };
}

const ReminderCard: React.FC<ReminderCardProps> = ({ reminder }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(!reminder.audioEnabled);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Audio URLs for different sound types
  const audioSources = {
    default: "https://assets.mixkit.co/active_storage/sfx/212/212-preview.mp3",
    gentle: "https://assets.mixkit.co/active_storage/sfx/2471/2471-preview.mp3",
    chime: "https://assets.mixkit.co/active_storage/sfx/1862/1862-preview.mp3",
    urgent: "https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3"
  };
  
  // Handle playing the alarm sound
  const playSound = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setIsPlaying(false);
      } else {
        // If there's a voice recording, play that instead of the alarm sound
        if (reminder.useVoiceReminder && reminder.voiceRecording) {
          const audio = new Audio(reminder.voiceRecording);
          audio.onended = () => setIsPlaying(false);
          audio.play()
            .then(() => setIsPlaying(true))
            .catch(err => {
              console.error("Error playing voice recording:", err);
              // Fallback to regular alarm sound
              audioRef.current?.play()
                .then(() => setIsPlaying(true))
                .catch(err => console.error("Error playing audio:", err));
            });
        } else {
          audioRef.current.play()
            .then(() => setIsPlaying(true))
            .catch(err => console.error("Error playing audio:", err));
        }
      }
    }
  };
  
  // Handle toggling mute state
  const toggleMute = () => {
    setIsMuted(!isMuted);
  };
  
  // Handle when audio playback ends
  const handleAudioEnded = () => {
    setIsPlaying(false);
  };
  
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-medium">
            {formatTime(reminder.time)}
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0" 
              onClick={playSound}
            >
              {isPlaying ? (
                <span className="text-red-500 animate-pulse">▶</span>
              ) : (
                <span>▶</span>
              )}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 p-0" 
              onClick={toggleMute}
            >
              {isMuted ? (
                <VolumeX className="h-5 w-5 text-gray-400" />
              ) : (
                <Volume2 className="h-5 w-5 text-teal-500" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="mb-3">
          <p className="font-medium text-gray-800">
            {reminder.medicationName} ({reminder.medicationDosage})
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {formatDays(reminder.days)}
          </p>
        </div>
        {reminder.audioEnabled && (
          <div className="text-sm text-gray-600">
            <p>Audio type: {reminder.audioType}</p>
          </div>
        )}
        {reminder.useVoiceReminder && (
          <div className="text-sm text-gray-600 mt-1">
            <p className="flex items-center">
              <Mic className="h-4 w-4 mr-1 text-teal-500" /> Voice reminder enabled
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-1" /> Edit
        </Button>
        <Button variant="outline" size="sm" className="border-red-200 text-red-500 hover:bg-red-50">
          <Trash2 className="h-4 w-4 mr-1" /> Delete
        </Button>
      </CardFooter>
      
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src={audioSources[reminder.audioType as keyof typeof audioSources]} 
        onEnded={handleAudioEnded}
        muted={isMuted}
      />
    </Card>
  );
};

// Voice Recorder Component
interface VoiceRecorderProps {
  form: any;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ form }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioURL(url);
        
        // Convert blob to base64 string for form storage
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          form.setValue('voiceRecording', base64data);
        };
      };

      mediaRecorder.start();
      setIsRecording(true);
      
      // Start timer
      const startTime = Date.now();
      timerRef.current = window.setInterval(() => {
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        setRecordingTime(elapsedTime);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check your device permissions.');
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      // Stop all audio tracks
      if (mediaRecorderRef.current.stream) {
        mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      }
      
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Play recorded audio
  const playRecording = () => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.play();
    }
  };

  // Record a new audio
  const newRecording = () => {
    setAudioURL(null);
    form.setValue('voiceRecording', '');
  };

  // Format the time for display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
        if (mediaRecorderRef.current.stream) {
          mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
      }
    };
  }, []);

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div className="flex flex-col space-y-2">
        <p className="font-medium text-gray-700">Voice Reminder</p>
        <p className="text-sm text-gray-500">Record a voice message to be played when this reminder is triggered.</p>
      </div>

      {!audioURL ? (
        <div className="space-y-4">
          <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
            {isRecording ? (
              <p className="text-red-500 font-medium">Recording... {formatTime(recordingTime)}</p>
            ) : (
              <p className="text-gray-500">Press the button to start recording</p>
            )}
          </div>
          
          <div className="flex justify-center">
            {!isRecording ? (
              <Button 
                type="button"
                onClick={startRecording}
                className="bg-teal-500 hover:bg-teal-600"
              >
                <Mic className="mr-2 h-4 w-4" /> Start Recording
              </Button>
            ) : (
              <Button 
                type="button"
                onClick={stopRecording}
                variant="outline"
                className="border-red-200 text-red-500 hover:bg-red-50"
              >
                Stop Recording
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-center h-16 bg-gray-100 rounded-lg">
            <p className="text-teal-500 font-medium">Voice reminder recorded successfully!</p>
          </div>
          
          <div className="flex justify-center space-x-4">
            <Button 
              type="button"
              onClick={playRecording}
              variant="outline"
            >
              <Volume2 className="mr-2 h-4 w-4" /> Play
            </Button>
            <Button 
              type="button"
              onClick={newRecording}
              variant="outline"
              className="border-red-200 text-red-500 hover:bg-red-50"
            >
              Record New
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;