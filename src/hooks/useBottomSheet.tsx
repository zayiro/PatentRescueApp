// hooks/useBottomSheet.js
import { useState } from 'react';

export const useBottomSheet = () => {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);
  const toggle = () => setVisible(!visible);

  return {
    visible,
    open,
    close,
    toggle,
  };
};