'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SavedResults } from './SavedResults';
import { SubscriptionManagement } from './SubscriptionManagement';
import { AccountSettings } from './AccountSettings';
import { Save, CreditCard, Settings, TrendingUp } from 'lucide-react';

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState('results');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-8">
        <TabsTrigger value="results" className="flex items-center gap-2">
          <Save className="w-4 h-4" />
          <span className="hidden sm:inline">Saved Results</span>
          <span className="sm:hidden">Results</span>
        </TabsTrigger>
        <TabsTrigger value="subscription" className="flex items-center gap-2">
          <CreditCard className="w-4 h-4" />
          <span className="hidden sm:inline">Subscription</span>
          <span className="sm:hidden">Plan</span>
        </TabsTrigger>
        <TabsTrigger value="usage" className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span className="hidden sm:inline">Usage</span>
        </TabsTrigger>
        <TabsTrigger value="settings" className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
        </TabsTrigger>
      </TabsList>

      <TabsContent value="results">
        <SavedResults />
      </TabsContent>

      <TabsContent value="subscription">
        <SubscriptionManagement />
      </TabsContent>

      <TabsContent value="usage">
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8 text-center">
          <TrendingUp className="w-12 h-12 text-text-tertiary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-text-primary mb-2">
            Usage Analytics
          </h3>
          <p className="text-text-secondary">
            Coming soon! Track your tool usage and performance metrics.
          </p>
        </div>
      </TabsContent>

      <TabsContent value="settings">
        <AccountSettings />
      </TabsContent>
    </Tabs>
  );
}

