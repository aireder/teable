import { ReactNode } from 'react';

export interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="h-screen w-full bg-gray-50">
      {children}
    </div>
  );
};