import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-bl from-gray-200 to-red-500 select-none">
      <div className="border-8 border-gray-300  transition-all transform hover:scale-105 hover:shadow-xl rounded-full w-[48rem] h-[28rem] flex items-center justify-center p-8 bg-red-500 shadow-lg">
        <div className="text-center">
          <h1 className="text-6xl font-bold font-kerem mb-4">
            Sayfa Bulunamadı !
          </h1>
          <h2 className="text-5xl font-kerem text-gray-700 mb-2">404 !</h2>
          <p className="text-3xl font-kerem text-gray-500">Not Found Page !</p>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
