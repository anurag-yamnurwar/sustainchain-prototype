import { useEffect, useReducer } from 'react';
import { portalReducer } from '../reducers/portalReducer';
import { initialPortalState } from './initialState';
import { PortalContext } from './portalContextObject';
import { saveVendorRegistry } from '../utils/storage';

export function PortalProvider({ children }) {
  const [state, dispatch] = useReducer(portalReducer, initialPortalState);

  // Persist the vendor registry (and which one is active) on every
  // change so a refresh doesn't wipe out what was just registered.
  useEffect(() => {
    saveVendorRegistry(state.vendors, state.activeVendorIndex);
  }, [state.vendors, state.activeVendorIndex]);

  return <PortalContext.Provider value={{ state, dispatch }}>{children}</PortalContext.Provider>;
}
