import React, { useState } from 'react'
import f_img from '../Images/ss.png'
import s_img from '../Images/ss2.png'

function Guide_of_downloader() {

  const data = [
    {
      question: "Is this tool free?",
      answer: "Yes! This tool is entirely free. You don't need a Publer account to use it, but we would appreciate a shout-out or some coffee 😉"
    },
    {
      question: "How does this tool work?",
      answer: "Simply go to the post you would like to download the media content from, copy the URL from your browser address bar into the input field, and press the download button. On success, you will be able to download the photos and videos from the post to your device"
    },
    {
      question: "Is there downlod limit?",
      answer: "No! You can download as many media as you wish, as long as you don't spam our servers. That's why we limit you to one download job at a time."
    },
    {
      question: "what channels does this tool support?",
      answer: "This tool supports photos and videos from Facebook, Instagram, Twitter/X, YouTube, Please contact us if you're having issues with a specific URL."
    },
    {
      question: "what is the quality of the downloaded videos?",
      answer: "We will download videos in their highest quality possible."
    },
    {
      question: "Is downloading pulic videos from the internet legal?",
      answer: "Downloading copyrighted photos and videos without permission is illegal. It's also against the law when you share these files with someone else. Please use this tool at your best judgement. We're not responsible for your actions."
    },
  ]

  const [selected,setSelected]=useState(null)
  const toggle=(i)=>{
    if(selected==i)
    {
      return setSelected(null)
    }
    setSelected(i)
  }
  return (
    <>
      <div className="img-slider">

        <p className='text-3xl font-bold text-center'>How to Download the video from our downloder?</p>
        <p className='text-xl font-semibold text-center'>here is the simplest steps that need to follow</p>

        <div className="slide rounded-3xl">
          <img src={f_img} alt="first_imge" className='slider-1 img-fluid' />
          <img src={s_img} alt="second_imge" className='slider-2 img-fluid' />
          <img src={f_img} alt="first_imge" className='slider-1 img-fluid' />
        </div>

        <div className="slide-nav">
          <a href=".slider-1"></a>
          <a href=".slider-2"></a>
          <a href=".slider-1"></a>
        </div>

        <div className="faq text-center">
          <p className='text-3xl font-bold'>Frequently Asked Questions</p>
          <p className='text-xl'>Most common questions and answers related to the media downloader.<br />If you’re still not finding what you need, <a href="#" className='text-red-500'>chat with us</a> or <a href="#" className='text-red-500'>visit our Help Center</a></p>


          <div className='faq-container'>
            {
              data.map((item,i) => (
                <div className="faq-contain">

                  <div className="title-2 font-semibold text-xl flex w-[100%]" onClick={()=>toggle(i)}>
                    <p className='faq-question'>{item.question}</p>
                    <span className='font-light text-6xl h-16 w-14 flex justify-center items-center'>{selected===i?'-':'+'}</span>
                  </div>

                  <div className={selected===i?'faq-answer-show':'faq-answer'}>{item.answer}</div>

                </div>
              ))
            }

          </div>

        </div>
      </div>
    </>
  )
}
export default Guide_of_downloader
