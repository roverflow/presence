"use client";

import Image from "next/image";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <section className="bg-neutral-100 min-h-screen">
      <div className="container relative h-screen md:flex md:flex-row lg:grid lg:max-w-full lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium gap-6">
            <div className="flex flex-col w-30">
              <Image src="/main-logo.png" alt="Logo" width={180} height={180} />
            </div>
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <footer className="text-sm">
                <p>
                  Powered by <strong>Presence</strong>
                </p>
                <ul className="list-disc list-inside"></ul>
              </footer>
            </blockquote>
          </div>
        </div>
        <div className="flex items-center justify-center h-full">
          <div className="w-full flex justify-center items-center px-4 lg:px-0">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthLayout;
