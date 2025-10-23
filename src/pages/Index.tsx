import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  { id: 3, name: 'Креативная комната', capacity: 8, available: false, floor: 2 },
  { id: 4, name: 'Зал совещаний', capacity: 20, available: true, floor: 1 },
];

const timeSlots: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '12:00', available: true },
  { time: '13:00', available: true },
  { time: '14:00', available: false },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: true },
  { time: '18:00', available: true },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<'home' | 'booking' | 'rooms' | 'schedule'>('home');
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  const handleBooking = () => {
    if (selectedRoom && selectedTime) {
      const room = rooms.find(r => r.id === selectedRoom);
      if (room) {
        const newBooking: Booking = {
          roomId: room.id,
          roomName: room.name,
          time: selectedTime,
          date: new Date().toLocaleDateString('ru-RU'),
        };
        setBookings([...bookings, newBooking]);
        setSelectedRoom(null);
        setSelectedTime(null);
      }
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
            <div className="flex gap-1">
              {[
                { id: 'home', label: 'Главная', icon: 'Home' },
                { id: 'booking', label: 'Бронирование', icon: 'Calendar' },
                { id: 'rooms', label: 'Комнаты', icon: 'DoorOpen' },
                { id: 'schedule', label: 'Расписание', icon: 'Clock' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  <Icon name={tab.icon as any} size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'home' && (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                Система бронирования переговорных
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Быстро и удобно бронируйте переговорные комнаты для ваших встреч
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Calendar" className="text-primary" size={24} />
                  </div>
                  <h3 className="font-semibold mb-2">Быстрое бронирование</h3>
                  <p className="text-sm text-muted-foreground">
                    Забронируйте комнату за пару кликов
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Users" className="text-primary" size={24} />
                  </div>
                  <h3 className="font-semibold mb-2">Разная вместимость</h3>
                  <p className="text-sm text-muted-foreground">
                    От 6 до 20 человек
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Icon name="Clock" className="text-primary" size={24} />
                  </div>
                  <h3 className="font-semibold mb-2">Удобное расписание</h3>
                  <p className="text-sm text-muted-foreground">
                    Видите все свободные слоты
                  </p>
                </CardContent>
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Доступные комнаты</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rooms.map((room) => (
                  <Card key={room.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-semibold text-lg mb-1">{room.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Icon name="Users" size={14} />
                              {room.capacity} мест
                            </span>
                            <span className="flex items-center gap-1">
                              <Icon name="Building" size={14} />
                              {room.floor} этаж
                            </span>
                          </div>
                        </div>
                        <Badge variant={room.available ? 'default' : 'secondary'}>
                          {room.available ? 'Свободна' : 'Занята'}
                        </Badge>
                      </div>
                      <Button 
                        className="w-full" 
                        disabled={!room.available}
                        onClick={() => {
                          setSelectedRoom(room.id);
                          setActiveTab('booking');
                        }}
                      >
                        Забронировать
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'booking' && (
          <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Бронирование комнаты</h1>
            
            <Card>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-3">Выберите комнату</label>
                  <div className="grid grid-cols-1 gap-3">
                    {rooms.filter(r => r.available).map((room) => (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room.id)}
                        className={`p-4 rounded-lg border-2 text-left transition-all ${
                          selectedRoom === room.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{room.name}</div>
                            <div className="text-sm text-muted-foreground flex items-center gap-3 mt-1">
                              <span className="flex items-center gap-1">
                                <Icon name="Users" size={14} />
                                {room.capacity} мест
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="Building" size={14} />
                                {room.floor} этаж
                              </span>
                            </div>
                          </div>
                          {selectedRoom === room.id && (
                            <Icon name="CheckCircle2" className="text-primary" size={24} />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-3">Выберите время</label>
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot.time}
                        onClick={() => slot.available && setSelectedTime(slot.time)}
                        disabled={!slot.available}
                        className={`p-3 rounded-lg border-2 font-medium transition-all ${
                          selectedTime === slot.time
                            ? 'border-primary bg-primary text-white'
                            : slot.available
                            ? 'border-border hover:border-primary/50'
                            : 'border-border bg-muted text-muted-foreground cursor-not-allowed'
                        }`}
                      >
                        {slot.time}
                      </button>
                    ))}
                  </div>
                </div>

                <Button 
                  className="w-full h-12 text-base" 
                  disabled={!selectedRoom || !selectedTime}
                  onClick={handleBooking}
                >
                  Забронировать
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'rooms' && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Все переговорные комнаты</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-32 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent flex items-center justify-center">
                    <Icon name="DoorOpen" className="text-primary" size={48} />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-semibold text-lg">{room.name}</h3>
                      <Badge variant={room.available ? 'default' : 'secondary'}>
                        {room.available ? 'Свободна' : 'Занята'}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Icon name="Users" size={16} />
                        <span>Вместимость: {room.capacity} человек</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Building" size={16} />
                        <span>Этаж: {room.floor}</span>
                      </div>
                    </div>
                    <Button 
                      className="w-full" 
                      variant={room.available ? 'default' : 'secondary'}
                      disabled={!room.available}
                      onClick={() => {
                        setSelectedRoom(room.id);
                        setActiveTab('booking');
                      }}
                    >
                      {room.available ? 'Забронировать' : 'Недоступна'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'schedule' && (
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-3xl font-bold">Расписание бронирований</h1>
            
            {bookings.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Icon name="Calendar" className="mx-auto mb-4 text-muted-foreground" size={48} />
                  <h3 className="text-lg font-medium mb-2">Нет бронирований</h3>
                  <p className="text-muted-foreground mb-6">
                    Забронируйте переговорную комнату
                  </p>
                  <Button onClick={() => setActiveTab('booking')}>
                    Создать бронирование
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon name="Calendar" className="text-primary" size={24} />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{booking.roomName}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <span className="flex items-center gap-1">
                                <Icon name="Clock" size={14} />
                                {booking.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Icon name="CalendarDays" size={14} />
                                {booking.date}
                              </span>
                            </div>
                          </div>
                        </div>
                        <Badge>Забронировано</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
