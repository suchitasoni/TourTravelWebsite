import './Contact.css';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import EnquiryForm from './EnquiryForm';
import { use, useEffect } from 'react';

export default function ContactUs({recordVisit}) {
    const encoded = encodeURIComponent("Hi, I would like to enquire about your travel packages.");
    const adminPhone = "919300304422";
    useEffect(() => {
      recordVisit("Contact-us-page");
    }, []);
    return (
        <div className="contact-us-page">
            <section className="contact-details-flex">
                <iframe title='google-map' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3637.3875189431947!2d80.75526037513198!3d24.26319167832397!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39838b0634340593%3A0x8c4e6ace37d6cc08!2sMaihar%20Online%20Service!5e0!3m2!1sen!2sin!4v1762446599057!5m2!1sen!2sin"
                 width="400" height="300" allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
                <div>
                    <h1>Reach Us </h1>
                    <div>Main Off - Maihar Online Shukla Complex Devi Ji Road Maihar</div>
                    <div className="contact-info-div">
                        <h3>Name :</h3>
                        <span>Prabhakar Mishra</span>
                        <h3>Tel :</h3>
                        <span>7674292040</span>
                        <h3>Mobile :</h3>
                        <span>919300304422 &nbsp;
                            <a href='tel:919300304422'><CallRoundedIcon sx={{verticalAlign:'middle'}}/></a>
                            <a onClick={()=> window.open(`https://wa.me/${adminPhone}?text=${encoded}`, "_blank")}> <WhatsAppIcon sx={{verticalAlign:'middle'}}/></a>
                        </span> 
                        <h3>Email :</h3>
                        <span>maiharonline2016@gmail.com</span>
                        <h3>Office hours:</h3>
                        <span>Monday to Saturday, Between 10:00 AM - 7:00 PM </span>
                        <h3></h3>
                        <span>Sunday, Between 10:00 AM - 6:00 PM</span>
                    </div>                    
                </div>
            </section>
            <section style={{marginBottom:'20px'}}><EnquiryForm /></section>
        </div>
    )
}