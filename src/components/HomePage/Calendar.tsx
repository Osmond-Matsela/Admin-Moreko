"use client";
import React, { useState } from "react";
import { Card } from "../ui/card";
import styles from "@/components/styles/Calendar.module.css";
import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";
import { X } from "lucide-react";

const exampleRange: DateRange = {
  from: new Date(2025, 8, 6), // September 16, 2025
  to: new Date(2025, 9, 20),   // September 20, 2025
};

const CalendarComponent = ({ close } : { close: (open: boolean) => void}) => {
   
    const closeCalendar = () => {
      close(false);
    }
    const [dateRange, setDateRange] = useState<DateRange | undefined>();
  return (
    <div
      className={`${styles.main} min-h-screen min-w-screen flex justify-center p-4 absolute`}
    >
        
      <Card className={`${styles.calendar}`}>
        <span className="absolute top-[-50] right-[-50] cursor-pointer text-white" onClick={closeCalendar}>
            <X className="w-10 h-10" />
        </span>
        <Calendar
            
          mode="range"
          selected={exampleRange}
          onSelect={setDateRange}
          modifiers={{
            start: exampleRange?.from,
            end: exampleRange?.to,
          }}
          
          className="rounded-lg border m-auto w-full"
        />
      </Card>
    </div>
  );
};

export default CalendarComponent;
