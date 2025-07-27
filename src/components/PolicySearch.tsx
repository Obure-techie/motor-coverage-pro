import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  Download, 
  Edit, 
  RefreshCw, 
  FileText, 
  Car, 
  User,
  Calendar,
  DollarSign
} from "lucide-react";

interface PolicySearchProps {
  onBack: () => void;
}

interface Policy {
  id: string;
  policyNumber: string;
  customerName: string;
  idNumber: string;
  phoneNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  registrationNumber: string;
  coverType: string;
  premium: number;
  sumInsured: number;
  status: "active" | "pending" | "expired" | "cancelled";
  startDate: string;
  endDate: string;
  lastUpdated: string;
}

export const PolicySearch = ({ onBack }: PolicySearchProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [coverFilter, setCoverFilter] = useState("all");
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);

  // Mock policy data
  const mockPolicies: Policy[] = [
    {
      id: "1",
      policyNumber: "POL-2024-001",
      customerName: "John Doe",
      idNumber: "12345678",
      phoneNumber: "+254712345678",
      vehicleMake: "Toyota",
      vehicleModel: "Camry",
      vehicleYear: "2020",
      registrationNumber: "KCA 123A",
      coverType: "comprehensive",
      premium: 45000,
      sumInsured: 1200000,
      status: "active",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      policyNumber: "POL-2024-002",
      customerName: "Mary Smith",
      idNumber: "87654321",
      phoneNumber: "+254723456789",
      vehicleMake: "Honda",
      vehicleModel: "Civic",
      vehicleYear: "2019",
      registrationNumber: "KBZ 456B",
      coverType: "third-party-fire-theft",
      premium: 28000,
      sumInsured: 800000,
      status: "pending",
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      lastUpdated: "2024-01-25"
    },
    {
      id: "3",
      policyNumber: "POL-2023-145",
      customerName: "Peter Johnson",
      idNumber: "11223344",
      phoneNumber: "+254734567890",
      vehicleMake: "Nissan",
      vehicleModel: "X-Trail",
      vehicleYear: "2021",
      registrationNumber: "KCD 789C",
      coverType: "comprehensive",
      premium: 52000,
      sumInsured: 1500000,
      status: "expired",
      startDate: "2023-03-10",
      endDate: "2024-03-10",
      lastUpdated: "2023-03-10"
    },
    {
      id: "4",
      policyNumber: "POL-2024-003",
      customerName: "Sarah Wilson",
      idNumber: "55667788",
      phoneNumber: "+254745678901",
      vehicleMake: "Subaru",
      vehicleModel: "Forester",
      vehicleYear: "2018",
      registrationNumber: "KAB 321D",
      coverType: "comprehensive",
      premium: 38000,
      sumInsured: 950000,
      status: "active",
      startDate: "2024-01-20",
      endDate: "2025-01-20",
      lastUpdated: "2024-01-20"
    }
  ];

  const filteredPolicies = mockPolicies.filter(policy => {
    const matchesSearch = 
      policy.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.policyNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.idNumber.includes(searchTerm);
    
    const matchesStatus = statusFilter === "all" || policy.status === statusFilter;
    const matchesCover = coverFilter === "all" || policy.coverType === coverFilter;
    
    return matchesSearch && matchesStatus && matchesCover;
  });

  const getStatusColor = (status: string) => {
    const colors = {
      active: "success",
      pending: "warning", 
      expired: "destructive",
      cancelled: "secondary"
    };
    return colors[status as keyof typeof colors] || "secondary";
  };

  const getCoverTypeLabel = (type: string) => {
    const labels = {
      "comprehensive": "Comprehensive",
      "third-party": "Third Party",
      "third-party-fire-theft": "Third Party Fire & Theft"
    };
    return labels[type as keyof typeof labels] || type;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const isExpiringSoon = (endDate: string) => {
    const today = new Date();
    const expiry = new Date(endDate);
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button onClick={onBack} variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Policy Management</h1>
            <p className="text-muted-foreground">Search, view and manage insurance policies</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Policies
            </CardTitle>
            <CardDescription>Search by customer name, policy number, registration number, or ID number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Enter search term..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cover">Cover Type</Label>
                <Select value={coverFilter} onValueChange={setCoverFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    <SelectItem value="third-party">Third Party</SelectItem>
                    <SelectItem value="third-party-fire-theft">Third Party Fire & Theft</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPolicies.length} of {mockPolicies.length} policies
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Advanced Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Results
            </Button>
          </div>
        </div>

        {/* Policy List */}
        <div className="grid gap-4">
          {filteredPolicies.map((policy) => (
            <Card 
              key={policy.id} 
              className={`shadow-md border-0 cursor-pointer transition-all hover:shadow-lg ${
                selectedPolicy?.id === policy.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => setSelectedPolicy(selectedPolicy?.id === policy.id ? null : policy)}
            >
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                  {/* Customer & Policy Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">{policy.customerName}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Policy: {policy.policyNumber}</p>
                    <p className="text-sm text-muted-foreground">ID: {policy.idNumber}</p>
                    <p className="text-sm text-muted-foreground">Phone: {policy.phoneNumber}</p>
                  </div>

                  {/* Vehicle Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">
                        {policy.vehicleMake} {policy.vehicleModel}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">Year: {policy.vehicleYear}</p>
                    <p className="text-sm text-muted-foreground">Reg: {policy.registrationNumber}</p>
                    <Badge variant="outline">{getCoverTypeLabel(policy.coverType)}</Badge>
                  </div>

                  {/* Financial Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold text-foreground">Financial Details</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Premium: KSh {policy.premium.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Sum Insured: KSh {policy.sumInsured.toLocaleString()}
                    </p>
                  </div>

                  {/* Status & Dates */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <Badge variant={getStatusColor(policy.status) as any}>
                        {policy.status.toUpperCase()}
                      </Badge>
                      {isExpiringSoon(policy.endDate) && (
                        <Badge variant="secondary">Expiring Soon</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Start: {formatDate(policy.startDate)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      End: {formatDate(policy.endDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Updated: {formatDate(policy.lastUpdated)}
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {selectedPolicy?.id === policy.id && (
                  <>
                    <Separator className="my-4" />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Button variant="outline" className="justify-start">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Policy
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Renew Policy
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <FileText className="h-4 w-4 mr-2" />
                        View Documents
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Download Certificate
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Download Policy
                      </Button>
                      <Button variant="outline" className="justify-start">
                        <Download className="h-4 w-4 mr-2" />
                        Download Sticker
                      </Button>
                    </div>
                    
                    <div className="mt-4 p-4 rounded-lg bg-muted/50">
                      <h4 className="font-semibold mb-2">Quick Actions</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                        <Button size="sm" variant="outline">Send Reminder</Button>
                        <Button size="sm" variant="outline">Update Contact</Button>
                        <Button size="sm" variant="outline">Add Note</Button>
                        <Button size="sm" variant="outline">View History</Button>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPolicies.length === 0 && (
          <Card className="shadow-md border-0">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No policies found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search criteria or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};