import React, { useState } from 'react';

interface Tool {
  id: string;
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const EmailListTools = () => {
  const [activeTab, setActiveTab] = useState('cleaner');
  
  // Tool data
  const tools: Tool[] = [
    {
      id: 'cleaner',
      title: 'Email List Cleaner',
      description: 'Clean and validate your email list',
      badge: 'Popular',
      badgeColor: 'blue'
    },
    {
      id: 'duplicate',
      title: 'Duplicate Finder',
      description: 'Find and remove duplicate emails',
      badge: 'New',
      badgeColor: 'green'
    },
    {
      id: 'invalid',
      title: 'Invalid Email Detector',
      description: 'Identify invalid email addresses',
      badge: 'Essential',
      badgeColor: 'red'
    },
    {
      id: 'domain',
      title: 'Domain Filter',
      description: 'Filter emails by domain',
      badge: 'Advanced',
      badgeColor: 'purple'
    },
    {
      id: 'bulk',
      title: 'Bulk Processor',
      description: 'Process multiple email lists',
      badge: 'Pro',
      badgeColor: 'yellow'
    }
  ];

  // Render tab content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'cleaner':
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">Clean Your Email List</h3>
            <p className="text-gray-600 mb-4">Paste your email list below to clean and validate it.</p>
            <textarea 
              className="w-full p-2 border rounded" 
              rows={10} 
              placeholder="Enter one email per line..."
            />
            <div className="mt-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Clean Emails
              </button>
            </div>
          </div>
        );
      default:
        const currentTool = tools.find(t => t.id === activeTab);
        return (
          <div className="p-4">
            <h3 className="text-lg font-medium mb-4">{currentTool?.title}</h3>
            <p className="text-gray-600">This feature is coming soon.</p>
          </div>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px">
          {tools.map((tool) => (
            <button
              key={tool.id}
              type="button"
              onClick={() => setActiveTab(tool.id)}
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === tool.id
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tool.title}
              {tool.badge && tool.badgeColor && (
                <span 
                  className={`ml-2 px-2 py-0.5 text-xs rounded-full bg-${tool.badgeColor}-100 text-${tool.badgeColor}-800`}
                >
                  {tool.badge}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>
      
      {/* Tab Content */}
      <div>
        {renderTabContent()}
      </div>
    </div>
  );
};

export default EmailListTools;
