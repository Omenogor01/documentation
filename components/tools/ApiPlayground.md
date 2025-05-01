# API Playground Component

A React component for testing API endpoints. Allows users to select an endpoint, send a request, and view the response in a clean and accessible layout.

## Features

- Endpoint Selection: Choose from multiple API endpoints
- Request Execution: Send requests with a single click
- Response Visualization: View detailed API responses
- Accessibility: Screen reader and keyboard navigation support
- Error Handling: Graceful error management

## Installation

```bash
npm install api-playground-component
```

## Usage

```jsx
import { ApiPlayground } from 'api-playground-component';

const endpoints = [
  { id: '1', method: 'GET', path: '/users', url: 'https://api.example.com/users' },
  { id: '2', method: 'POST', path: '/users', url: 'https://api.example.com/users' }
];

function App() {
  return <ApiPlayground endpoints={endpoints} />;
}
```

## Component Code

```jsx
import React, { useState } from 'react';

/**
 * ApiPlayground Component
 * Description: A React component for testing API endpoints. Allows users to select an endpoint, send a request, and view the response in a clean and accessible layout.
 * Author: Your Name
 * Last Updated: 2025-04-29
 * Tags: ["API Playground", "React Component", "API Testing", "SEO", "Accessibility"]
 */

export const ApiPlayground = ({ endpoints }) => {
  const [selectedEndpoint, setEndpoint] = useState(endpoints[0]);
  const [response, setResponse] = useState(null);

  const executeRequest = async () => {
    try {
      const res = await fetch(selectedEndpoint.url, {
        method: selectedEndpoint.method,
      });
      setResponse({
        status: res.status,
        data: await res.json(),
      });
    } catch (error) {
      setResponse({
        status: 'Error',
        data: { message: 'Failed to fetch the API endpoint.' },
      });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-bold mb-4" aria-label="API Playground">
        API Playground
      </h3>
      <div className="flex items-center space-x-4 mb-6">
        <label htmlFor="endpoint-select" className="sr-only">
          Select API Endpoint
        </label>
        <select
          id="endpoint-select"
          onChange={(e) =>
            setEndpoint(endpoints.find((ep) => ep.id === e.target.value))
          }
          className="p-2 border rounded"
          aria-label="Select API Endpoint"
        >
          {endpoints.map((ep) => (
            <option key={ep.id} value={ep.id}>
              {ep.method.toUpperCase()} {ep.path}
            </option>
          ))}
        </select>
        <button
          onClick={executeRequest}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          aria-label="Send API Request"
        >
          Send Request
        </button>
      </div>
      {response && (
        <div className="border rounded overflow-hidden">
          <div
            className={`p-3 ${
              response.status >= 400 ? 'bg-red-100' : 'bg-green-100'
            }`}
            aria-label={`Response Status: ${
              response.status >= 400 ? 'Error' : 'Success'
            }`}
          >
            Status: {response.status}
          </div>
          <pre
            className="p-4 overflow-x-auto"
            aria-label="API Response Data"
          >
            {JSON.stringify(response.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Example Usage
// <ApiPlayground
//   endpoints={[
//     { id: '1', method: 'GET', path: '/users', url: 'https://api.example.com/users' },
//     { id: '2', method: 'POST', path: '/users', url: 'https://api.example.com/users' },
//   ]}
// />