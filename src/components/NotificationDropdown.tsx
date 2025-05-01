"use client";
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import SendNotificationForm from './forms/SendNotificationForm';

export default function NotificationDropdown() {

  {/* Notification box */}
  const [isOpen, setIsOpen] = useState(false);

  {/* Listener lors du click lbara mel notification box */}
  const dropdownRef = useRef<HTMLDivElement>(null);

  {/* Form (envoyer notification) */}
  const [showSendForm, setShowSendForm] = useState(false);


  
  {/* Exemple de notifications */}
  const [notifications, setNotifications] = useState([
    { id: '1', message: 'Le directeur des études a validé la session de sa part', time: '04-04-2025', read: false },
    { id: '2', message: 'Le chef de département (Informatique) a validé la session de sa part', time: '01-04-2025', read: false },
    { id: '3', message: 'Le chef de département (Technologique) a validé la session de sa part', time: '29-03-2025', read: true },
    { id: '4', message: 'Le chef de département (Mathématiques) a validé la session de sa part', time: '25-03-2025', read: true },
  ]);

  {/* Nombre de notifications non lu */}
  const unreadCount = notifications.filter(n => !n.read).length;
  {/* Si nombre de notifications non lu yfout 100 afficher "99+" sinon afficher nombre de notifications non lu */}
  const displayCount = unreadCount > 99 ? '99+' : unreadCount;

  {/*Close notification box when you click outside */}
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSendForm(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

   {/* Marquer un seul notifications comme lu lors du click sur le souris */}
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };

   {/* Marquer tous les notifications comme lu */}
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

   {/* Effacer tous les notifications */}
  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification icon in the navbar */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          setShowSendForm(false);
        }}
        className='rounded-full w-7 h-7 flex items-center justify-center cursor-pointer relative'
      >
        <Image src="/announcement.png" alt="Notifications" width={22} height={22} />
        {/* Ken fama des notifications non lus, afficher ce nombre fou9 l icon */}
        {unreadCount > 0 && (
          <div className='absolute -top-3 -right-3 min-w-[20px] h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs px-1'>
            {displayCount}
          </div>
        )}
      </button>

      {/* 1. Cas ou notification box ma7loul */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg z-50 border border-gray-200">
          {/* 1.1 Cas ou form ta3 envoi de notification ma7loula */}
          {showSendForm ? (
            <SendNotificationForm 
            onClose={() => setShowSendForm(false)} 
            onSuccess={() => {setShowSendForm(false); setIsOpen(false);}}
          />
          ) : (
            <>
            {/* 1.2 Cas ou form ta3 envoi de notification msakra (Notifications 3adiyin) */}
              <div className="p-3 border-b border-gray-200 flex justify-between">
                <h3 className="font-medium">Notifications</h3>
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-purple-600 font-semibold"
                  disabled={unreadCount === 0}
                >
                  Marquer tout comme lu
                </button>
              </div>

              {/* Ken fama des notifications affichehom */}
              <div className="max-h-60 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div
                      key={notification.id}
                      onClick={() => markAsRead(notification.id)}
                      className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                  ))
                ) : (
                  // Sinon mafamech des notifications
                  <div className="p-6 text-center text-sm text-gray-500">
                    Pas de notifications
                  </div>
                )}
              </div>

              <div className="border-t">

                {/* Button effacer */}
                <button 
                  onClick={clearAllNotifications}
                  className="w-full flex items-center justify-center gap-2 text-xs text-purple-600 font-semibold p-3 hover:bg-gray-50"
                  disabled={notifications.length === 0}
                >
                  
                  <span>Effacer tous</span>
                </button>

                {/* Button envoyer notification*/}
                <button 
                  onClick={() => setShowSendForm(true)}
                  className="w-full flex items-center justify-center gap-2 text-xs rounded-b-md text-white font-semibold p-3 bg-purple-600 hover:bg-purple-700"
                >
                  <Image src="/addnotification.png" alt="Add Icon" width={16} height={16} />
                  <span>Envoyer une notification</span>
                </button>

              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}