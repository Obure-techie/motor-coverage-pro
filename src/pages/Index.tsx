import { useState } from "react";
import { Dashboard } from "@/components/Dashboard";
import { PolicyForm } from "@/components/PolicyForm";
import { PolicySearch } from "@/components/PolicySearch";

type View = "dashboard" | "new-policy" | "search-policies";

const Index = () => {
  const [currentView, setCurrentView] = useState<View>("dashboard");

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case "new-policy":
        return <PolicyForm onBack={() => handleNavigate("dashboard")} />;
      case "search-policies":
        return <PolicySearch onBack={() => handleNavigate("dashboard")} />;
      default:
        return (
          <Dashboard
            onNewPolicy={() => handleNavigate("new-policy")}
            onSearchPolicies={() => handleNavigate("search-policies")}
          />
        );
    }
  };

  return renderCurrentView();
};

export default Index;
