"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { mockSubscriptions, mockPolicyInitiatives, mockPolicyDefinitions } from "@/lib/mock-data";
import { Filter, X } from "lucide-react";
import React from "react";

export function Filters() {
  const [filters, setFilters] = React.useState({
    subscriptionId: "",
    policyInitiativeId: "",
    policyDefinitionId: "",
    tagKey: "",
    tagValue: "",
  });

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    // Placeholder for applying filters
    console.log("Applying filters:", filters);
  };

  const handleClearFilters = () => {
    setFilters({
      subscriptionId: "",
      policyInitiativeId: "",
      policyDefinitionId: "",
      tagKey: "",
      tagValue: "",
    });
    // Placeholder for clearing filters and refetching data
    console.log("Filters cleared");
  };
  
  const activeFilterCount = Object.values(filters).filter(Boolean).length;


  return (
    <Card className="shadow-lg rounded-lg">
      <CardHeader className="border-b">
        <CardTitle className="text-lg flex items-center">
          <Filter className="mr-2 h-5 w-5 text-primary" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Select value={filters.subscriptionId} onValueChange={(value) => handleFilterChange("subscriptionId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Subscription" />
            </SelectTrigger>
            <SelectContent>
              {mockSubscriptions.map((sub) => (
                <SelectItem key={sub.id} value={sub.id}>
                  {sub.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.policyInitiativeId} onValueChange={(value) => handleFilterChange("policyInitiativeId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Policy Initiative" />
            </SelectTrigger>
            <SelectContent>
              {mockPolicyInitiatives.map((initiative) => (
                <SelectItem key={initiative.id} value={initiative.id}>
                  {initiative.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.policyDefinitionId} onValueChange={(value) => handleFilterChange("policyDefinitionId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by Policy" />
            </SelectTrigger>
            <SelectContent>
              {mockPolicyDefinitions.map((policy) => (
                <SelectItem key={policy.id} value={policy.id}>
                  {policy.displayName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <Input 
            placeholder="Filter by Tag Key (e.g., environment)" 
            value={filters.tagKey}
            onChange={(e) => handleFilterChange("tagKey", e.target.value)}
          />
          <Input 
            placeholder="Filter by Tag Value (e.g., production)" 
            value={filters.tagValue}
            onChange={(e) => handleFilterChange("tagValue", e.target.value)}
            disabled={!filters.tagKey}
          />
        </div>
        <div className="flex justify-end space-x-2 pt-2">
           {activeFilterCount > 0 && (
            <Button variant="outline" onClick={handleClearFilters}>
              <X className="mr-2 h-4 w-4" />
              Clear Filters ({activeFilterCount})
            </Button>
          )}
          <Button onClick={handleApplyFilters}>
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
