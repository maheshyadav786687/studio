
'use client';

import { useState, useMemo } from 'react';

export type DialogState<T> = {
  visible: boolean;
} & T;

export function useDialog<T = {}>() {
  const [state, setState] = useState<DialogState<T>>({ visible: false } as DialogState<T>);

  const context = useMemo(() => ({
    ...state,
    show: (props: T) => setState({ ...props, visible: true }),
    hide: () => setState({ ...state, visible: false }),
    setShow: (newState: Partial<DialogState<T>>) => setState(s => ({...s, ...newState}))
  }), [state]);

  return context;
}
