"use client";

import React, { useState } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { Button } from '@/components/ui/button';

const TestSupabasePage = () => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testConnection = async () => {
    setLoading(true);
    setTestResults([]);
    
    try {
      // Test 1: Basic connection
      addResult('Testing basic Supabase connection...');
      const { data, error } = await supabase.from('users').select('count').limit(1);
      if (error) {
        addResult(`❌ Database connection failed: ${error.message}`);
      } else {
        addResult('✅ Database connection successful');
      }

      // Test 2: Auth connection
      addResult('Testing auth connection...');
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        addResult(`❌ Auth connection failed: ${sessionError.message}`);
      } else {
        addResult('✅ Auth connection successful');
      }

      // Test 3: Try password reset (without actually sending)
      addResult('Testing password reset function...');
      try {
        // This will fail but we can see the error
        const { error: resetError } = await supabase.auth.resetPasswordForEmail('test@example.com', {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });
        
        if (resetError) {
          addResult(`⚠️ Password reset test: ${resetError.message}`);
        } else {
          addResult('✅ Password reset function works');
        }
      } catch (err: any) {
        addResult(`❌ Password reset test failed: ${err.message}`);
      }

    } catch (error: any) {
      addResult(`❌ General error: ${error.message}`);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Supabase Connection Test</h1>
        
        <Button 
          onClick={testConnection} 
          disabled={loading}
          className="mb-6"
        >
          {loading ? 'Testing...' : 'Run Tests'}
        </Button>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Test Results:</h2>
          <div className="space-y-2">
            {testResults.length === 0 ? (
              <p className="text-gray-500">Click "Run Tests" to start testing</p>
            ) : (
              testResults.map((result, index) => (
                <div key={index} className="font-mono text-sm">
                  {result}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestSupabasePage;
