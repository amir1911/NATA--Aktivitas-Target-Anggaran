import React from 'react';

/**
 * Context to propagate the mobile sidebar toggle function
 * from DashboardLayout down to any nested Header component.
 */
export const MobileMenuContext = React.createContext<() => void>(() => {});
