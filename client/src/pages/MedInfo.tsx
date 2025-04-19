import { useState } from "react";
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, TabsContent, TabsList, TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Search, Database, AlertCircle, Pill, Info, ChevronRight, ChevronDown, Plus, RefreshCw 
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

// Mock medications database
const mockMedications = [
  {
    id: 1,
    name: "Lisinopril",
    description: "Lisinopril is an ACE inhibitor used to treat high blood pressure (hypertension) and heart failure. It helps to prevent future heart attacks in patients who have had a heart attack.",
    sideEffects: "Dry cough, dizziness, headache, drowsiness, nausea, weakness, tiredness. Rarely can cause serious side effects like severe allergic reactions or kidney problems.",
    interactions: "Can interact with potassium supplements, salt substitutes containing potassium, diuretics, lithium, NSAIDs, and other drugs.",
    contraindications: "Should not be taken during pregnancy. Use with caution if you have kidney disease, liver disease, or are at risk for low blood pressure.",
    usage: "Take exactly as prescribed by your doctor. Take with or without food at the same time each day.",
    category: "Blood Pressure Medications",
  },
  {
    id: 2,
    name: "Metformin",
    description: "Metformin is used to treat high blood sugar levels caused by type 2 diabetes. It helps your body respond better to the insulin it produces naturally.",
    sideEffects: "Nausea, vomiting, stomach upset, diarrhea, weakness, or a metallic taste in the mouth. These side effects usually go away as your body adjusts to the medicine.",
    interactions: "Can interact with certain contrast dyes used for X-rays and CT scans. May also interact with certain heart medications, antibiotics, and other drugs.",
    contraindications: "Not suitable for people with severe kidney disease, liver disease, or conditions that may cause low oxygen levels or dehydration.",
    usage: "Take with meals to help reduce stomach or bowel side effects. Follow your doctor's instructions for dosing and timing.",
    category: "Diabetes Medications",
  },
  {
    id: 3,
    name: "Atorvastatin",
    description: "Atorvastatin (Lipitor) belongs to a group of drugs called statins. It reduces levels of bad cholesterol (LDL) and triglycerides in the blood, while increasing levels of good cholesterol (HDL).",
    sideEffects: "Mild muscle pain, joint pain, stomach pain, constipation, or diarrhea. Rare but serious side effects include muscle breakdown (rhabdomyolysis) and liver problems.",
    interactions: "Many potential drug interactions including with certain antibiotics, antifungals, HIV medications, and other heart medications.",
    contraindications: "Should not be taken during pregnancy or if you have active liver disease.",
    usage: "Can be taken at any time of day, with or without food. Many doctors recommend taking it in the evening.",
    category: "Cholesterol Medications",
  },
  {
    id: 4,
    name: "Levothyroxine",
    description: "Levothyroxine is used to treat an underactive thyroid (hypothyroidism). It replaces the hormone normally produced by your thyroid gland to regulate the body's energy and metabolism.",
    sideEffects: "Usually minimal at the correct dose. May include headache, nervousness, irritability, sweating, chest pain, or rapid heartbeat if dose is too high.",
    interactions: "Many possible interactions with other medications, supplements, and even certain foods. Take on an empty stomach 30-60 minutes before breakfast.",
    contraindications: "Should be used with caution in patients with heart disease, adrenal gland problems, or other endocrine disorders.",
    usage: "Take at the same time each day, usually in the morning on an empty stomach. Wait at least 4 hours before taking other medications that may interfere with absorption.",
    category: "Hormone Medications",
  },
  {
    id: 5,
    name: "Albuterol",
    description: "Albuterol is a bronchodilator that relaxes muscles in the airways and increases air flow to the lungs. It's used to treat or prevent bronchospasm in people with reversible obstructive airway disease.",
    sideEffects: "Nervousness, shaking, headache, throat irritation, increased heart rate. Overuse can lead to worsening symptoms or decreased effectiveness.",
    interactions: "May interact with blood pressure medications, certain antidepressants, and other similar bronchodilators or stimulants.",
    contraindications: "Use with caution if you have heart disease, high blood pressure, seizures, or diabetes.",
    usage: "For quick relief of asthma symptoms or before exercise to prevent symptoms. Follow your doctor's instructions carefully.",
    category: "Respiratory Medications",
  },
  {
    id: 6,
    name: "Omeprazole",
    description: "Omeprazole is a proton pump inhibitor that decreases the amount of acid produced in the stomach. It's used to treat heartburn, acid reflux, and other conditions involving excessive stomach acid.",
    sideEffects: "Headache, nausea, vomiting, diarrhea, stomach pain, or gas. Long-term use may increase risk of bone fractures, vitamin B-12 deficiency, or certain infections.",
    interactions: "May interact with blood thinners, certain antifungals, HIV medications, methotrexate, and other drugs.",
    contraindications: "Tell your doctor if you have severe liver disease, low magnesium levels, or are taking certain other medications.",
    usage: "Take before eating, usually once daily in the morning. Swallow capsules whole; do not crush, chew, or open unless specifically instructed.",
    category: "Gastrointestinal Medications",
  },
];

// Categories for grouping medications
const medicationCategories = [
  "All Medications",
  "Blood Pressure Medications",
  "Diabetes Medications",
  "Cholesterol Medications",
  "Hormone Medications",
  "Respiratory Medications",
  "Gastrointestinal Medications",
  "Pain Medications",
  "Antibiotics",
  "Other",
];

const MedInfo = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Medications");
  const [selectedMedication, setSelectedMedication] = useState<typeof mockMedications[0] | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Filter medications based on search query and selected category
  const filteredMedications = mockMedications.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         med.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === "All Medications" || 
                           med.category === selectedCategory;
                           
    return matchesSearch && matchesCategory;
  });
  
  // Open medication details dialog
  const openMedicationDetails = (medication: typeof mockMedications[0]) => {
    setSelectedMedication(medication);
    setIsDialogOpen(true);
  };

  return (
    <div className="pt-20 pb-10 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Medication Information</h1>
            <p className="text-gray-600">Learn about medications, side effects, and proper usage</p>
          </div>
          <div className="mt-4 md:mt-0 w-full md:w-auto">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search medications..."
                className="pl-8 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Database className="h-5 w-5 mr-2" />
                  Categories
                </CardTitle>
                <CardDescription>
                  Browse medications by category
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0.5">
                  {medicationCategories.map(category => (
                    <Button
                      key={category}
                      variant="ghost"
                      className={`w-full justify-start rounded-none px-4 ${
                        selectedCategory === category ? "bg-gray-100" : ""
                      }`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                      {selectedCategory === category && (
                        <ChevronRight className="ml-auto h-4 w-4" />
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  Important Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This information is for educational purposes only and is not intended 
                  as medical advice. Always consult your healthcare provider for proper 
                  medical guidance about your medications.
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-3">
            <Tabs defaultValue="grid" className="w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  {selectedCategory} {searchQuery && `- Search: "${searchQuery}"`}
                </h2>
                <TabsList>
                  <TabsTrigger value="grid">Grid</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>
              </div>
              
              {filteredMedications.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg shadow">
                  <Pill className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-4 text-lg font-medium text-gray-900">No medications found</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Try adjusting your search or category filter.
                  </p>
                  <Button 
                    className="mt-5 text-teal-600 hover:text-teal-700"
                    variant="ghost"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("All Medications");
                    }}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Reset filters
                  </Button>
                </div>
              ) : (
                <>
                  <TabsContent value="grid">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredMedications.map(medication => (
                        <Card key={medication.id} className="hover:shadow-md transition-shadow overflow-hidden">
                          <CardHeader className="bg-teal-50 pb-2">
                            <CardTitle className="flex justify-between items-start">
                              <div className="flex items-center">
                                <Pill className="h-5 w-5 mr-2 text-teal-600" />
                                <span>{medication.name}</span>
                              </div>
                              <span className="text-xs bg-teal-100 text-teal-800 px-2 py-1 rounded-full">
                                {medication.category.split(" ")[0]}
                              </span>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="pt-4">
                            <p className="text-sm text-gray-600 line-clamp-3">
                              {medication.description}
                            </p>
                          </CardContent>
                          <CardFooter>
                            <Button 
                              variant="outline" 
                              className="w-full text-teal-600 border-teal-200 hover:bg-teal-50"
                              onClick={() => openMedicationDetails(medication)}
                            >
                              <Info className="h-4 w-4 mr-2" /> View Details
                            </Button>
                          </CardFooter>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="list">
                    <Card>
                      <CardContent className="p-0">
                        <div className="divide-y">
                          {filteredMedications.map(medication => (
                            <div 
                              key={medication.id} 
                              className="p-4 hover:bg-gray-50 cursor-pointer flex justify-between items-center"
                              onClick={() => openMedicationDetails(medication)}
                            >
                              <div>
                                <h3 className="font-medium flex items-center">
                                  <Pill className="h-4 w-4 mr-2 text-teal-600" />
                                  {medication.name}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1 line-clamp-1">
                                  {medication.description}
                                </p>
                              </div>
                              <ChevronRight className="h-5 w-5 text-gray-400" />
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </>
              )}
            </Tabs>
          </div>
        </div>
      </div>
      
      {/* Medication Details Dialog */}
      {selectedMedication && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Pill className="h-5 w-5 mr-2 text-teal-600" />
                {selectedMedication.name}
              </DialogTitle>
              <DialogDescription>
                {selectedMedication.category}
              </DialogDescription>
            </DialogHeader>
            
            <div className="mt-2">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="description">
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-700">
                      {selectedMedication.description}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="usage">
                  <AccordionTrigger>How to Use</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-700">
                      {selectedMedication.usage}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="sideEffects">
                  <AccordionTrigger>Side Effects</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-700">
                      {selectedMedication.sideEffects}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="interactions">
                  <AccordionTrigger>Drug Interactions</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-700">
                      {selectedMedication.interactions}
                    </p>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="contraindications">
                  <AccordionTrigger>Warnings & Precautions</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-700">
                      {selectedMedication.contraindications}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded-md mt-2">
              <p className="text-xs text-yellow-800 flex items-start">
                <AlertCircle className="h-4 w-4 mr-1 mt-0.5 flex-shrink-0" />
                <span>
                  This information is for educational purposes only. Always follow your doctor's advice and 
                  the instructions provided with your medication.
                </span>
              </p>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default MedInfo;