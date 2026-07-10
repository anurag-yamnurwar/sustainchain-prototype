import { usePortal } from './usePortal';

export function useActiveVendor() {
  const { state } = usePortal();
  return state.activeVendorIndex !== null ? state.vendors[state.activeVendorIndex] : null;
}
