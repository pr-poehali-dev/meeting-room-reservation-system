import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';

type Room = {
  id: number;
  name: string;
  capacity: number;
  available: boolean;
  floor: number;
};

type TimeSlot = {
  time: string;
  available: boolean;
};

type Booking = {
  roomId: number;
  roomName: string;
  time: string;
  date: string;
};

const rooms: Room[] = [
  { id: 1, name: 'Конференц-зал А', capacity: 12, available: true, floor: 1 },
  { id: 2, name: 'Переговорная Б', capacity: 6, available: true, floor: 2 },
  { id: 3, name: 'Креативная комната', capacity: 8, available: true, floor: 2 },
  { id: 4, name: 'Зал совещаний', capacity: 20, available: true, floor: 1 },
];

const timeSlots: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: true },
  { time: '12:00', available: true },
  { time: '13:00', available: true },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: true },
  { time: '18:00', available: true },
];

export default function Index() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [dialogRoom, setDialogRoom] = useState<Room | null>(null);
  const [dialogTime, setDialogTime] = useState<string | null>(null);
  const [dialogDate, setDialogDate] = useState<Date>(new Date());
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const formatDateShort = (date: Date) => {
    return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isTomorrow = (date: Date) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.toDateString() === tomorrow.toDateString();
  };

  const openBookingDialog = (room: Room, time: string, date: Date) => {
    setDialogRoom(room);
    setDialogTime(time);
    setDialogDate(date);
    setIsBookingDialogOpen(true);
  };

  const handleBooking = () => {
    if (dialogRoom && dialogTime && dialogDate) {
      const newBooking: Booking = {
        roomId: dialogRoom.id,
        roomName: dialogRoom.name,
        time: dialogTime,
        date: formatDate(dialogDate),
      };
      setBookings([...bookings, newBooking]);
      setIsBookingDialogOpen(false);
      setDialogRoom(null);
      setDialogTime(null);
    }
  };

  const openCancelDialog = (booking: Booking) => {
    setBookingToCancel(booking);
    setIsCancelDialogOpen(true);
  };

  const handleCancelBooking = () => {
    if (bookingToCancel) {
      setBookings(bookings.filter(b => 
        !(b.roomId === bookingToCancel.roomId && 
          b.time === bookingToCancel.time && 
          b.date === bookingToCancel.date)
      ));
      setIsCancelDialogOpen(false);
      setBookingToCancel(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <Icon name="CalendarDays" className="text-white" size={24} />
              </div>
              <span className="text-xl font-semibold text-foreground">RoomBook</span>
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Icon name="CalendarDays" size={16} />
                  <span className="hidden sm:inline">
                    {isToday(selectedDate) ? 'Сегодня' : isTomorrow(selectedDate) ? 'Завтра' : formatDateShort(selectedDate)}
                  </span>
                  <Icon name="ChevronDown" size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6 animate-fade-in">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">Расписание бронирований</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name="Calendar" className="text-primary" size={20} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold">{bookings.length}</div>
                      <div className="text-sm text-muted-foreground">Всего броней</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-4 font-semibold text-sm border-b sticky left-0 bg-muted/50 min-w-[180px]">
                      Время
                    </th>
                    {rooms.map((room) => (
                      <th key={room.id} className="text-left p-4 font-semibold text-sm border-b min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <Icon name="DoorOpen" size={16} className="text-primary" />
                          <div>
                            <div>{room.name}</div>
                            <div className="text-xs font-normal text-muted-foreground">
                              {room.capacity} мест · {room.floor} этаж
                            </div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot.time} className="border-b hover:bg-accent/50 transition-colors">
                      <td className="p-4 font-medium sticky left-0 bg-background">
                        <div className="flex items-center gap-2">
                          <Icon name="Clock" size={16} className="text-muted-foreground" />
                          {slot.time}
                        </div>
                      </td>
                      {rooms.map((room) => {
                        const booking = bookings.find(
                          b => b.roomId === room.id && 
                               b.time === slot.time && 
                               b.date === formatDate(selectedDate)
                        );
                        return (
                          <td key={room.id} className="p-2">
                            {booking ? (
                              <button
                                onClick={() => openCancelDialog(booking)}
                                className="w-full bg-primary/10 border-l-4 border-primary rounded p-3 hover:bg-primary/20 transition-colors text-left"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2">
                                    <Icon name="CheckCircle2" size={14} className="text-primary" />
                                    <span className="font-medium text-sm">Забронировано</span>
                                  </div>
                                  <Icon name="X" size={14} className="text-muted-foreground" />
                                </div>
                              </button>
                            ) : (
                              <button
                                onClick={() => openBookingDialog(room, slot.time, selectedDate)}
                                className="w-full p-3 rounded border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-all text-sm text-muted-foreground hover:text-foreground"
                              >
                                Свободно
                              </button>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>

      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Подтверждение бронирования</DialogTitle>
            <DialogDescription>
              Вы уверены, что хотите забронировать эту переговорную?
            </DialogDescription>
          </DialogHeader>
          {dialogRoom && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                <Icon name="DoorOpen" size={24} className="text-primary" />
                <div>
                  <div className="font-semibold">{dialogRoom.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {dialogRoom.capacity} мест · {dialogRoom.floor} этаж
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Icon name="CalendarDays" size={20} className="text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Дата</div>
                    <div className="font-medium">{formatDate(dialogDate)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <Icon name="Clock" size={20} className="text-primary" />
                  <div>
                    <div className="text-xs text-muted-foreground">Время</div>
                    <div className="font-medium">{dialogTime}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsBookingDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleBooking}>
              Забронировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Отменить бронирование?</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие нельзя будет отменить. Бронирование будет удалено из расписания.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {bookingToCancel && (
            <div className="space-y-2 py-2">
              <div className="flex items-center gap-2 text-sm">
                <Icon name="DoorOpen" size={16} />
                <span className="font-medium">{bookingToCancel.roomName}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Icon name="CalendarDays" size={14} />
                  {bookingToCancel.date}
                </span>
                <span className="flex items-center gap-1">
                  <Icon name="Clock" size={14} />
                  {bookingToCancel.time}
                </span>
              </div>
            </div>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancelBooking} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить бронирование
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
