import React from "react";

export default function FrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between px-8 py-4 bg-white shadow">
        <div className="text-2xl font-bold">Kre.TN</div>
        <div className="flex-1 mx-8">
          <input
            type="text"
            placeholder="Search..."
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-600 hover:text-black">❤️ Favorites</button>
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="font-semibold">P</span>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}
