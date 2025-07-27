import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Users, 
  Car, 
  DollarSign, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Plus,
  Search,
  RefreshCw
} from "lucide-react";

interface DashboardProps {
  onNewPolicy: () => void;
  onSearchPolicies: () => void;
}

export const Dashboard = ({ onNewPolicy, onSearchPolicies }: DashboardProps) => {
  const stats = [
    {
      title: "Active Policies",
      value: "2,847",
      change: "+12%",
      icon: FileText,
      color: "success"
    },
    {
      title: "Total Customers",
      value: "1,923",
      change: "+8%",
      icon: Users,
      color: "primary"
    },
    {
      title: "Vehicles Insured",
      value: "3,156",
      change: "+15%",
      icon: Car,
      color: "accent"
    },
    {
      title: "Premium Collected",
      value: "KSh 45.2M",
      change: "+22%",
      icon: DollarSign,
      color: "premium"
    }
  ];

  const recentActivities = [
    {
      id: 1,
      action: "New Policy Created",
      customer: "John Doe",
      vehicle: "Toyota Camry 2020",
      status: "pending",
      time: "2 hours ago"
    },
    {
      id: 2,
      action: "Policy Renewed",
      customer: "Mary Smith",
      vehicle: "Honda Civic 2019",
      status: "active",
      time: "4 hours ago"
    },
    {
      id: 3,
      action: "Premium Calculated",
      customer: "Peter Johnson",
      vehicle: "Nissan X-Trail 2021",
      status: "pending",
      time: "6 hours ago"
    },
    {
      id: 4,
      action: "Policy Amended",
      customer: "Sarah Wilson",
      vehicle: "Subaru Forester 2018",
      status: "active",
      time: "1 day ago"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-success" />;
      case "pending":
        return <Clock className="h-4 w-4 text-warning" />;
      case "expired":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      pending: "secondary",
      expired: "destructive"
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Motor Coverage Pro</h1>
            <p className="text-muted-foreground">Underwriter Dashboard</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={onSearchPolicies} variant="outline">
              <Search className="h-4 w-4 mr-2" />
              Search Policies
            </Button>
            <Button onClick={onNewPolicy} className="bg-gradient-to-r from-primary to-accent">
              <Plus className="h-4 w-4 mr-2" />
              New Policy
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="shadow-md border-0 bg-gradient-to-br from-card to-secondary/20">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-5 w-5 text-${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs text-success">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Quick Actions</CardTitle>
              <CardDescription>Common underwriter tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={onNewPolicy} 
                className="w-full justify-start bg-gradient-to-r from-primary to-accent"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Policy
              </Button>
              <Button 
                onClick={onSearchPolicies} 
                variant="outline" 
                className="w-full justify-start"
              >
                <Search className="h-4 w-4 mr-2" />
                Search & Manage Policies
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <RefreshCw className="h-4 w-4 mr-2" />
                Process Renewals
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activities */}
          <Card className="lg:col-span-2 shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-foreground">Recent Activities</CardTitle>
              <CardDescription>Latest underwriting activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 rounded-lg border bg-card/50">
                    <div className="flex items-center space-x-4">
                      {getStatusIcon(activity.status)}
                      <div>
                        <p className="font-medium text-foreground">{activity.action}</p>
                        <p className="text-sm text-muted-foreground">
                          {activity.customer} - {activity.vehicle}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      {getStatusBadge(activity.status)}
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};