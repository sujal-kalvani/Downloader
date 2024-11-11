import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedIcon, setSelectedIcon] = useState('youtube');  // State to track selected icon

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleIconClick = (icon) => {
        setSelectedIcon(icon);
        setDropdownVisible(false);  // Close dropdown after selecting an icon
    };

    const icons = {
        youtube: {
            src: "https://www.pngplay.com/wp-content/uploads/8/Youtube-Red-Logo-Background-PNG-Image.png",
            label: "YouTube",
            path: "/"
        },
        instagram: {
            src: "https://www.pnguniverse.com/wp-content/uploads/2020/10/Logo-de-instagram-original.png",
            label: "Instagram",
            path: "/InstaDownloader"
        },
        facebook: {
            src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
            label: "Facebook",
            path: "/fbDownloader"
        },
        x: {
            src: "https://img.freepik.com/premium-vector/x-new-social-network-black-white-round-app-icon-twitter-rebranded-as-x-twitter-s-logo-changed_277909-595.jpg?w=2000",
            label: "X (Twitter)",
            path: "/xDownloader"
        }
    };

    const availableIcons = Object.keys(icons).filter(icon => icon !== selectedIcon);

    return (
        <nav className="social-icon rounded-full">
            <div className="drag-icon h-10 w-10 flex justify-center items-center">
                <img 
                    src={icons[selectedIcon].src} 
                    alt={icons[selectedIcon].label} 
                    className='logo' 
                    onClick={toggleDropdown}
                    style={{ cursor: 'pointer', width: '40px', height: '40px', objectFit: 'contain' }}  // Add objectFit property
                />
            </div>

            {dropdownVisible && (
                <div className="circles flex-col gap-2">
                    {availableIcons.map((icon) => (
                        <div key={icon} className="drag-icon h-10 w-10 flex justify-center items-center gap-1">
                            <Link to={icons[icon].path}>
                                <img 
                                    src={icons[icon].src} 
                                    alt={icons[icon].label} 
                                    onClick={() => handleIconClick(icon)}
                                    style={{ cursor: 'pointer', width: '40px', height: '40px', objectFit:'contain' }}  // Add objectFit property
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </nav>
    );
}

