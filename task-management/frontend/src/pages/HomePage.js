import React from 'react';
import WorkspaceList from "../components/WorkspaceList";

function HomePage() {


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Chào mừng đến Workspace!</h1>
      <WorkspaceList />
    </div>
  );
}

export default HomePage;
