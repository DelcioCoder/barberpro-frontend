'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Clock, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import axios from "axios";

interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: number;
}

interface CalendarSchedulerProps {
  barberId: number;
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
  onSelectTime: (time: string) => void;
  selectedTime: string | null;
}

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
];

export default function CalendarScheduler({
  barberId,
  selectedDate,
  onSelectDate,
  onSelectTime,
  selectedTime
}: CalendarSchedulerProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek, { locale: ptBR }),
    end: endOfWeek(currentWeek, { locale: ptBR })
  });

  useEffect(() => {
    if (selectedDate && barberId) {
      fetchAvailableTimes();
    }
  }, [selectedDate, barberId]);

  const fetchAvailableTimes = async () => {
    if (!selectedDate || !barberId) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      
      const response = await axios.get(
        `http://127.0.0.1:8000/api/barbers/${barberId}/hours/${dateStr}/`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      const availableTimes = response.data.available_times || [];
      
      const slots = TIME_SLOTS.map(time => ({
        time,
        available: availableTimes.includes(time),
        appointmentId: undefined
      }));

      setTimeSlots(slots);
    } catch (error) {
      console.error('Erro ao buscar horários disponíveis:', error);
      // Fallback: todos os horários disponíveis
      setTimeSlots(TIME_SLOTS.map(time => ({
        time,
        available: true,
        appointmentId: undefined
      })));
    } finally {
      setLoading(false);
    }
  };

  const nextWeek = () => {
    setCurrentWeek(addDays(currentWeek, 7));
  };

  const prevWeek = () => {
    setCurrentWeek(addDays(currentWeek, -7));
  };

  const handleDateClick = (date: Date) => {
    onSelectDate(date);
  };

  const handleTimeClick = (time: string) => {
    const slot = timeSlots.find(s => s.time === time);
    if (slot && slot.available) {
      onSelectTime(time);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CalendarIcon className="h-5 w-5 text-orange-500" />
          <span>Agendar Horário</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calendário Semanal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={prevWeek}
              className="p-2"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <h3 className="font-semibold text-gray-800">
              {format(weekDays[0], 'dd MMM', { locale: ptBR })} - {format(weekDays[6], 'dd MMM yyyy', { locale: ptBR })}
            </h3>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextWeek}
              className="p-2"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <Button
                key={day.toISOString()}
                variant={selectedDate && isSameDay(day, selectedDate) ? "default" : "outline"}
                className={`h-16 flex-col p-2 ${
                  selectedDate && isSameDay(day, selectedDate)
                    ? 'bg-orange-600 hover:bg-orange-700 text-white'
                    : 'hover:bg-orange-50 hover:border-orange-300'
                }`}
                onClick={() => handleDateClick(day)}
              >
                <span className="text-xs font-medium">
                  {format(day, 'EEE', { locale: ptBR })}
                </span>
                <span className="text-lg font-bold">
                  {format(day, 'dd')}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {/* Horários disponíveis */}
        {selectedDate && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <h4 className="font-medium text-gray-800">
                Horários disponíveis para {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
              </h4>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={slot.available ? "outline" : "ghost"}
                    size="sm"
                    className={`h-12 text-sm ${
                      slot.available
                        ? selectedTime === slot.time
                          ? 'bg-orange-600 hover:bg-orange-700 text-white border-orange-600'
                          : 'hover:bg-orange-50 hover:border-orange-300'
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                    disabled={!slot.available}
                    onClick={() => handleTimeClick(slot.time)}
                  >
                    {slot.time}
                  </Button>
                ))}
              </div>
            )}

            {timeSlots.length > 0 && !timeSlots.some(slot => slot.available) && (
              <div className="text-center py-4 text-gray-500">
                <p>Nenhum horário disponível para esta data.</p>
              </div>
            )}
          </div>
        )}

        {/* Resumo da seleção */}
        {selectedDate && selectedTime && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Data e hora selecionada:</p>
                <p className="font-semibold text-gray-800">
                  {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })} às {selectedTime}
                </p>
              </div>
              <Badge className="bg-orange-600 text-white">
                Confirmado
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
