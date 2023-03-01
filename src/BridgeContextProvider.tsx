import React, { FC } from 'react';
import type Bridge from './utils/Bridge';

interface BridgeContextValue {
  bridges: Map<string, Bridge<any, any>>;
  getBridge: (key: string) => Bridge<any, any> | undefined;
}
const initialValue: BridgeContextValue = {
  bridges: new Map<string, Bridge<any, any>>(),
  getBridge: () => undefined,
};
export const BridgeContext = React.createContext(initialValue);
export const BridgeContextProvider: FC<{}> = (props) => {
  const bridges = React.useRef<Map<string, Bridge<any, any>>>(
    new Map<string, Bridge<any, any>>()
  );
  const value: BridgeContextValue = React.useMemo(() => {
    return {
      bridges: bridges.current,
      getBridge: (key: string) => bridges.current.get(key),
    };
  }, []);

  return (
    <BridgeContext.Provider value={value}>
      {props.children}
    </BridgeContext.Provider>
  );
};
