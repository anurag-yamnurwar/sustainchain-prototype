import { useContext } from 'react';
import { PortalContext } from '../context/portalContextObject';

/** Access { state, dispatch } from any descendant component. */
export function usePortal() {
  const ctx = useContext(PortalContext);
  if (!ctx) throw new Error('usePortal must be used inside a <PortalProvider>');
  return ctx;
}
