
'use client';

import { useState, useMemo, useCallback } from 'react';

export type DialogState<T> = {
  visible: boolean;
} & T;

export function useDialog<T = {}>() {
  const [state, setState] = useState<DialogState<T>>({ visible: false } as DialogState<T>);

  const show = useCallback((props: T) => setState({ ...props, visible: true }), []);

  const hide = useCallback(() => setState((prevState) => {
    // Only change visibility, keep other state
    if (!prevState.visible) return prevState;
    return { ...prevState, visible: false };
  }), []);

  const setShow = useCallback((newState: Partial<DialogState<T>>) => {
    setState(s => ({...s, ...newState}));
  }, []);

  const context = useMemo(() => ({
    ...state,
    show,
    hide,
    setShow,
  }), [state, show, hide, setShow]);

  return context;
}
