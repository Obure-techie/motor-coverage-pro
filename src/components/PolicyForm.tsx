import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calculator, FileText, Upload, Car, User, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PolicyFormProps {
  onBack: () => void;
}

interface FormData {
  // Customer Details
  customerName: string;
  idNumber: string;
  phoneNumber: string;
  email: string;
  kraPin: string;
  address: string;
  
  // Vehicle Details
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  registrationNumber: string;
  chassisNumber: string;
  engineNumber: string;
  currentValue: string;
  
  // Policy Details
  coverType: string;
  installments: string;
  policyFromDate: string;
  policyToDate: string;
  vehicleUse: string;
  
  // Calculated Fields
  premium: number;
  sumInsured: number;
}

export const PolicyForm = ({ onBack }: PolicyFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    customerName: "",
    idNumber: "",
    phoneNumber: "",
    email: "",
    kraPin: "",
    address: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    registrationNumber: "",
    chassisNumber: "",
    engineNumber: "",
    currentValue: "",
    coverType: "",
    installments: "",
    policyFromDate: new Date().toISOString().split('T')[0],
    policyToDate: "",
    vehicleUse: "",
    premium: 0,
    sumInsured: 0
  });

  // Mock data for dropdowns
  const vehicleMakes = [
    "Toyota", "Honda", "Nissan", "Subaru", "Mercedes-Benz", "BMW", "Audi", 
    "Volkswagen", "Ford", "Chevrolet", "Hyundai", "Kia", "Mazda", "Mitsubishi"
  ];

  const getVehicleModels = (make: string) => {
    const models: { [key: string]: string[] } = {
      "Toyota": ["Camry", "Corolla", "RAV4", "Prado", "Hilux", "Vitz", "Harrier", "Fielder"],
      "Honda": ["Civic", "Accord", "CR-V", "HR-V", "Pilot", "Fit", "Insight"],
      "Nissan": ["Altima", "X-Trail", "Sentra", "Patrol", "Note", "Tiida", "Juke"],
      "Subaru": ["Outback", "Forester", "Impreza", "Legacy", "XV", "Tribeca"],
      "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "GLA", "GLE", "GLS"],
      "BMW": ["3 Series", "5 Series", "X3", "X5", "X1", "7 Series"]
    };
    return models[make] || [];
  };

  const coverTypes = [
    { value: "comprehensive", label: "Comprehensive Cover" },
    { value: "third-party", label: "Third Party Only" },
    { value: "third-party-fire-theft", label: "Third Party Fire & Theft" }
  ];

  const vehicleUses = [
    { value: "private", label: "Private Use" },
    { value: "commercial", label: "Commercial Use" },
    { value: "psv", label: "Public Service Vehicle (PSV)" }
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-calculate policy end date (1 year from start)
      if (field === "policyFromDate") {
        const startDate = new Date(value);
        const endDate = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate());
        updated.policyToDate = endDate.toISOString().split('T')[0];
      }
      
      // Auto-calculate premium and sum insured when relevant fields change
      if (["coverType", "currentValue", "vehicleUse", "vehicleYear"].includes(field)) {
        const calculated = calculatePremium(updated);
        updated.premium = calculated.premium;
        updated.sumInsured = calculated.sumInsured;
      }
      
      return updated;
    });
  };

  const calculatePremium = (data: FormData) => {
    const currentValue = parseFloat(data.currentValue) || 0;
    let baseRate = 0.035; // 3.5% base rate
    
    // Adjust rate based on cover type
    switch (data.coverType) {
      case "comprehensive":
        baseRate = 0.035;
        break;
      case "third-party-fire-theft":
        baseRate = 0.02;
        break;
      case "third-party":
        baseRate = 15000; // Fixed amount for third party
        break;
    }
    
    // Adjust for vehicle use
    const useMultiplier = {
      "private": 1.0,
      "commercial": 1.3,
      "psv": 1.5
    }[data.vehicleUse] || 1.0;
    
    // Adjust for vehicle age
    const currentYear = new Date().getFullYear();
    const vehicleAge = currentYear - parseInt(data.vehicleYear);
    const ageMultiplier = vehicleAge > 10 ? 1.2 : vehicleAge > 5 ? 1.1 : 1.0;
    
    let premium = 0;
    let sumInsured = currentValue;
    
    if (data.coverType === "third-party") {
      premium = baseRate * useMultiplier * ageMultiplier;
      sumInsured = 0; // Third party doesn't cover own vehicle
    } else {
      premium = currentValue * baseRate * useMultiplier * ageMultiplier;
    }
    
    return {
      premium: Math.round(premium),
      sumInsured: data.coverType === "third-party" ? 0 : currentValue
    };
  };

  const handleSubmit = () => {
    toast({
      title: "Policy Created Successfully",
      description: `Policy for ${formData.customerName} has been created with premium KSh ${formData.premium.toLocaleString()}`,
    });
    onBack();
  };

  const steps = [
    { id: 1, title: "Customer Details", icon: User },
    { id: 2, title: "Vehicle Information", icon: Car },
    { id: 3, title: "Coverage & Premium", icon: Shield },
    { id: 4, title: "Review & Submit", icon: FileText }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">New Policy Creation</h1>
            <p className="text-muted-foreground">Create a new motor vehicle insurance policy</p>
          </div>
        </div>

        {/* Progress Steps */}
        <Card className="shadow-md border-0">
          <CardContent className="p-6">
            <div className="flex justify-between items-center">
              {steps.map((s, index) => {
                const Icon = s.icon;
                const isActive = s.id === step;
                const isCompleted = s.id < step;
                
                return (
                  <div key={s.id} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                      isActive ? "border-primary bg-primary text-primary-foreground" :
                      isCompleted ? "border-success bg-success text-success-foreground" :
                      "border-muted bg-background text-muted-foreground"
                    }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="ml-3">
                      <p className={`text-sm font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>
                        {s.title}
                      </p>
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`mx-4 h-0.5 w-16 ${isCompleted ? "bg-success" : "bg-muted"}`} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Form Content */}
        {step === 1 && (
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Customer Information
              </CardTitle>
              <CardDescription>Enter the customer's personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange("customerName", e.target.value)}
                    placeholder="Enter customer's full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number *</Label>
                  <Input
                    id="idNumber"
                    value={formData.idNumber}
                    onChange={(e) => handleInputChange("idNumber", e.target.value)}
                    placeholder="Enter ID number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">Phone Number *</Label>
                  <Input
                    id="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                    placeholder="Enter phone number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kraPin">KRA PIN</Label>
                  <Input
                    id="kraPin"
                    value={formData.kraPin}
                    onChange={(e) => handleInputChange("kraPin", e.target.value)}
                    placeholder="Enter KRA PIN"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Physical Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter customer's physical address"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Vehicle Information
              </CardTitle>
              <CardDescription>Enter the vehicle details and specifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicleMake">Vehicle Make *</Label>
                  <Select 
                    value={formData.vehicleMake} 
                    onValueChange={(value) => {
                      handleInputChange("vehicleMake", value);
                      handleInputChange("vehicleModel", ""); // Reset model when make changes
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle make" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicleMakes.map((make) => (
                        <SelectItem key={make} value={make}>{make}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                  <Select 
                    value={formData.vehicleModel} 
                    onValueChange={(value) => handleInputChange("vehicleModel", value)}
                    disabled={!formData.vehicleMake}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle model" />
                    </SelectTrigger>
                    <SelectContent>
                      {getVehicleModels(formData.vehicleMake).map((model) => (
                        <SelectItem key={model} value={model}>{model}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="vehicleYear">Year of Manufacture *</Label>
                  <Select 
                    value={formData.vehicleYear} 
                    onValueChange={(value) => handleInputChange("vehicleYear", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 25 }, (_, i) => 2024 - i).map((year) => (
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="registrationNumber">Registration Number *</Label>
                  <Input
                    id="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={(e) => handleInputChange("registrationNumber", e.target.value.toUpperCase())}
                    placeholder="e.g., KCA 123A"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentValue">Current Market Value (KSh) *</Label>
                  <Input
                    id="currentValue"
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) => handleInputChange("currentValue", e.target.value)}
                    placeholder="Enter current market value"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="chassisNumber">Chassis Number</Label>
                  <Input
                    id="chassisNumber"
                    value={formData.chassisNumber}
                    onChange={(e) => handleInputChange("chassisNumber", e.target.value)}
                    placeholder="Enter chassis number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="engineNumber">Engine Number</Label>
                  <Input
                    id="engineNumber"
                    value={formData.engineNumber}
                    onChange={(e) => handleInputChange("engineNumber", e.target.value)}
                    placeholder="Enter engine number"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Coverage Selection
                </CardTitle>
                <CardDescription>Select coverage type and policy duration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coverType">Cover Type *</Label>
                    <Select 
                      value={formData.coverType} 
                      onValueChange={(value) => handleInputChange("coverType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select cover type" />
                      </SelectTrigger>
                      <SelectContent>
                        {coverTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleUse">Vehicle Use *</Label>
                    <Select 
                      value={formData.vehicleUse} 
                      onValueChange={(value) => handleInputChange("vehicleUse", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle use" />
                      </SelectTrigger>
                      <SelectContent>
                        {vehicleUses.map((use) => (
                          <SelectItem key={use.value} value={use.value}>{use.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="installments">Premium Payment *</Label>
                    <Select 
                      value={formData.installments} 
                      onValueChange={(value) => handleInputChange("installments", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Payment option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual Payment</SelectItem>
                        <SelectItem value="quarterly">Quarterly Installments</SelectItem>
                        <SelectItem value="monthly">Monthly Installments</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="policyFromDate">Policy Start Date *</Label>
                    <Input
                      id="policyFromDate"
                      type="date"
                      value={formData.policyFromDate}
                      onChange={(e) => handleInputChange("policyFromDate", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="policyToDate">Policy End Date</Label>
                    <Input
                      id="policyToDate"
                      type="date"
                      value={formData.policyToDate}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Premium Calculation */}
            {formData.coverType && formData.currentValue && formData.vehicleUse && (
              <Card className="shadow-md border-0 bg-gradient-to-r from-premium/5 to-accent/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5" />
                    Premium Calculation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-4 rounded-lg bg-card">
                      <p className="text-sm text-muted-foreground">Sum Insured</p>
                      <p className="text-2xl font-bold text-primary">
                        KSh {formData.sumInsured.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-card">
                      <p className="text-sm text-muted-foreground">Annual Premium</p>
                      <p className="text-2xl font-bold text-premium">
                        KSh {formData.premium.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-card">
                      <p className="text-sm text-muted-foreground">Cover Type</p>
                      <Badge variant="outline" className="text-sm">
                        {coverTypes.find(t => t.value === formData.coverType)?.label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {step === 4 && (
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Policy Review
              </CardTitle>
              <CardDescription>Review all details before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Customer Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Name:</strong> {formData.customerName}</p>
                      <p><strong>ID Number:</strong> {formData.idNumber}</p>
                      <p><strong>Phone:</strong> {formData.phoneNumber}</p>
                      <p><strong>Email:</strong> {formData.email}</p>
                      <p><strong>KRA PIN:</strong> {formData.kraPin}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Vehicle Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Make & Model:</strong> {formData.vehicleMake} {formData.vehicleModel}</p>
                      <p><strong>Year:</strong> {formData.vehicleYear}</p>
                      <p><strong>Registration:</strong> {formData.registrationNumber}</p>
                      <p><strong>Current Value:</strong> KSh {parseFloat(formData.currentValue || "0").toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Policy Details</h4>
                    <div className="space-y-1 text-sm">
                      <p><strong>Cover Type:</strong> {coverTypes.find(t => t.value === formData.coverType)?.label}</p>
                      <p><strong>Vehicle Use:</strong> {vehicleUses.find(u => u.value === formData.vehicleUse)?.label}</p>
                      <p><strong>Payment:</strong> {formData.installments}</p>
                      <p><strong>Policy Period:</strong> {formData.policyFromDate} to {formData.policyToDate}</p>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="p-4 rounded-lg bg-gradient-to-r from-premium/10 to-accent/10">
                    <h4 className="font-semibold text-foreground mb-2">Premium Summary</h4>
                    <div className="space-y-1">
                      <p className="text-lg"><strong>Sum Insured:</strong> KSh {formData.sumInsured.toLocaleString()}</p>
                      <p className="text-xl font-bold text-premium">
                        <strong>Annual Premium:</strong> KSh {formData.premium.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 mb-4">
                  <Upload className="h-5 w-5 text-muted-foreground" />
                  <h4 className="font-semibold text-foreground">Supporting Documents</h4>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["Copy of ID", "Vehicle Logbook", "Valuation Report", "Previous Policy"].map((doc) => (
                    <Button key={doc} variant="outline" className="h-20 flex-col">
                      <Upload className="h-6 w-6 mb-2" />
                      <span className="text-xs">{doc}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Click to upload supporting documents (optional for this demo)
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button 
            onClick={() => setStep(Math.max(1, step - 1))} 
            variant="outline" 
            disabled={step === 1}
          >
            Previous
          </Button>
          
          <div className="flex gap-2">
            {step < 4 ? (
              <Button 
                onClick={() => setStep(Math.min(4, step + 1))}
                className="bg-gradient-to-r from-primary to-accent"
              >
                Next Step
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-success to-premium"
              >
                Create Policy
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};