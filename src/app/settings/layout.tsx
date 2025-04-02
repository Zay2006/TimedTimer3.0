"use client";

import React from 'react';

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-start min-h-screen py-8 px-4">
      <div className="w-full max-w-2xl">
        {children}
      </div>
    </div>
  );
}
