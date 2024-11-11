  import React from 'react'
  
  export default function Footer() {
    return (
        <footer>
        <div className="footer-container">
          <div className="footer-section">
            <h4 className='font-bold'>Free Tools</h4>
            <ul>
              <li><a href="#">Youtube Video Downloder</a></li>
              <li><a href="#">Instagram Video Downloder</a></li>
              <li><a href="#">Facebook Video Downloder</a></li>
              <li><a href="#">X Video Downloder</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4 className='font-bold'>Quick Links</h4>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">About</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
          <div className="footer-section flex flex-col gap-1 mb-4">
            <h4 className='font-bold'>Follow Us</h4>
            <a href="#" className='hover:underline'>Youtube</a>
            <a href="#" className='hover:underline'>Instagram</a>
            <a href="#" className='hover:underline'>Facebook</a> 
            <a href="#" className='hover:underline'>Twitter</a> 
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Downloader | All Rights Reserved</p>
        </div>
      </footer>
    )
  }
  