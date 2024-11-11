import React, { useEffect, useState, useCallback } from 'react'

function Sidebar() {

    const [visible,setvisible]=useState('none')

    const toggle= ()=>{
        if(visible==='none')
        {
            setvisible("block")
        }
        else
        {
            setvisible("none")
        }
    }
    const API_KEY = 'cc2ed1e89f044f7aaa8107f5fb47ed0e';

    const [weather, setWeather] = useState('');
    const [dateTime, setDateTime] = useState({ time: '', date: '' });

    // Function to get the current date and time
    const getCurrentDateTime = () => {
        const now = new Date();
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        };
        const dateOptions = {
            weekday: 'short',
            day: 'numeric',
            month: 'short'
        };

        const time = now.toLocaleString(undefined, timeOptions);
        const date = now.toLocaleString(undefined, dateOptions);
        return { time, date };
    };

    // Function to fetch weather data
    const fetchWeatherData = async (lat, lon) => {
        try {
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
            );
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            const roundedTemp = Math.round(data.main.temp);
            setWeather(`${roundedTemp}°C`);
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setWeather('Error loading weather');
        }
    };

    // Memoize getLocation function
    const getLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    fetchWeatherData(position.coords.latitude, position.coords.longitude);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    // alert('Turn on the location');
                }
            );
        } else {
            setWeather('Geolocation not supported');
        }
    }, []); // Add dependencies if needed

    // Update weather and date/time on component mount
    useEffect(() => {
        getLocation();
        setDateTime(getCurrentDateTime());

        // Update time every minute
        const interval = setInterval(() => {
            setDateTime(getCurrentDateTime());
        }, 60000);

        return () => clearInterval(interval); // Cleanup on unmount
    }, [getLocation]); // Include getLocation in dependencies
    return (
        <>
            <div className="Navbar rounded-full font-semibold text-xl
            ">

                <div className="company-logo">
                    Logo
                </div>

                <ul className='flex gap-4 sidebar-ul'>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>

                <ul className='xgap-4 mobile-sidebar-ul' style={{display:visible}}>
                    <li><a href="#">Home</a></li>
                    <li><a href="#">About us</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>

                <div className="hemburger">
                <svg  width="30"
                        height="30"
                        viewBox="0 0 30 30"
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg" onClick={toggle}
                    >
                        <rect width="30" height="30" rx="5" fill="transparent" />
                        <path d="M4 7H26" stroke="black" stroke-width="2" stroke-linecap="round" />
                        <path d="M4 15H26" stroke="black" stroke-width="2" stroke-linecap="round" />
                        <path d="M4 23H26" stroke="black" stroke-width="2" stroke-linecap="round" />
                    </svg>
                </div>

            </div>

            <div className="container bg-purple-500">
                <div className="weather">{weather}</div>
                <div className="date-time flex flex-col">
                    <div className='Time'>{dateTime.time}</div>
                    <div className='Date'>{dateTime.date}</div>
                </div>
            </div>


        </>
    )
}

export default Sidebar
