"use client";
import { useState, createContext, useContext } from "react";
import { LocationType } from "@/components/unimap";


type InputContextType = {
  fromLocation: LocationType | null;
  setFromLocation: React.Dispatch<React.SetStateAction<LocationType | null>>;
  toLocation: LocationType | null;
  setToLocation: React.Dispatch<React.SetStateAction<LocationType | null>>
};


export const InputContext = createContext<InputContextType|null>(null);

export function InputProvider({ children }:{children:React.ReactNode}) {
  const [fromLocation, setFromLocation] = useState<LocationType|null>(null);
  const [toLocation, setToLocation] = useState<LocationType|null>(null);
  return (
    <InputContext.Provider
      value={{
        fromLocation,
        setFromLocation,
        toLocation,
        setToLocation
      }}
    >
      {children}
    </InputContext.Provider>
  )
}


export function useInputContext() {
  const context = useContext(InputContext);
  if (!context) {
    throw new Error("useInputContext must be used inside InputProvider")
  }
  return context;
}
