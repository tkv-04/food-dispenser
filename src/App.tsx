import React, { useState, useEffect } from 'react';
import { GaugeCircle, Droplets, Thermometer, Power } from 'lucide-react';
import { ref, onValue, set } from 'firebase/database';
import { database } from './firebaseConfig'; // Import the database from the new config file

// Simulate sensor data
const getSensorData = () => ({
  weight: Math.round(Math.random() * (1000 - 100) + 100) / 100,
  humidity: Math.round(Math.random() * (100 - 30) + 30),
  temperature: Math.round((Math.random() * (30 - 18) + 18) * 10) / 10
});

function App() {
  const [sensorData, setSensorData] = useState({
    weight: 0,
    humidity: 0,
    temperature: 0
  });
  const [notification, setNotification] = useState('');
  const [isDispensing, setIsDispensing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    // Set up real-time listeners for dispenser data
    const dispenserRef = ref(database, 'dispenser');
    const unsubscribe = onValue(dispenserRef, (snapshot) => {
      const data = snapshot.val() || {};
      setSensorData({
        weight: data.weight || 0,
        humidity: data.humidity || 0,
        temperature: data.temperature || 0
      });
      setNotification(data.notification || '');
      setLastUpdated(new Date());
    });

    // Listen for dispense status changes
    const dispensingRef = ref(database, 'dispensing');
    const dispensingUnsubscribe = onValue(dispensingRef, (snapshot) => {
      setIsDispensing(snapshot.val() === true);
    });

    // Clean up listeners on component unmount
    return () => {
      unsubscribe();
      dispensingUnsubscribe();
    };
  }, []);

  const handleDispense = async () => {
    // Update dispensing status in Firebase
    const dispensingRef = ref(database, 'dispensing');
    await set(dispensingRef, true);
    
    // After 2 seconds, set dispensing back to false
    setTimeout(async () => {
      await set(dispensingRef, false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Food Dispenser Monitor</h1>
          <p className="text-gray-600">Real-time monitoring and control system</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Weight Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Weight</h2>
              <GaugeCircle className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{sensorData.weight} g</p>
          </div>

          {/* Humidity Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Humidity</h2>
              <Droplets className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{sensorData.humidity}%</p>
          </div>

          {/* Temperature Card */}
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all hover:shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-700">Temperature</h2>
              <Thermometer className="text-blue-500" size={24} />
            </div>
            <p className="text-3xl font-bold text-gray-900">{sensorData.temperature}°C</p>
          </div>
        </div>

        {/* Control Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <button
            onClick={handleDispense}
            disabled={isDispensing}
            className={`
              flex items-center justify-center mx-auto
              px-8 py-4 rounded-full text-lg font-semibold
              transition-all duration-300
              ${isDispensing 
                ? 'bg-green-500 text-white cursor-not-allowed'
                : 'bg-blue-500 hover:bg-blue-600 text-white'
              }
            `}
          >
            <Power className="mr-2" size={24} />
            {isDispensing ? 'Dispensing...' : 'Dispense Food'}
          </button>
        </div>

        {/* Notification Section */}
        {notification && (
          <div className="mt-8 text-center">
            <p className="text-sm text-red-500 font-semibold">{notification}</p>
          </div>
        )}

        {/* Status Bar */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            System Status: <span className="text-green-500 font-semibold">Online</span> • 
            Last Updated: <span className="font-semibold">{lastUpdated.toLocaleTimeString()}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
