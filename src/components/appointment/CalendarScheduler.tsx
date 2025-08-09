'use client';

import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

interface Props {
  onSelect: (date: Date) => void;
  error?: string;
}

export default function CalendarScheduler({ onSelect, error }: Props) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
      onSelect(selectedDate);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-2">Selecione uma Data</h3>
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        className="rounded-md border"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
}
