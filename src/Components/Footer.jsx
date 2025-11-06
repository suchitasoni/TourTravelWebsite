import React from 'react';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Footer = () => {
    const encoded = encodeURIComponent("Hi, I would like to enquire about your travel packages.");
    const adminPhone = "919300304422";
    
    return(
        <div style={{border:'solid',marginTop:'10px'}}>
            <div style={{display:'flex',justifyContent:'space-around'}}>
                <div style={{display: 'flex', flexDirection: 'column', rowGap: '10px'}}>
                    <a href='tel:919300304422'><CallRoundedIcon sx={{verticalAlign:'middle'}}/>&nbsp; +91-9300304422</a>
                    <a href='tel:07674292040'><CallRoundedIcon sx={{verticalAlign:'middle'}}/>&nbsp; 07674-292040</a>
                    <a onClick={()=> window.open(`https://wa.me/${adminPhone}?text=${encoded}`, "_blank")}> <WhatsAppIcon sx={{verticalAlign:'middle'}}/> Enquire on WhatsApp</a>
                </div>
                <div style={{display: 'flex',flexDirection: 'column'}}>
                    <h3>Home</h3>
                    <h3>Packages</h3>
                    <h3>Send Enquiry</h3>
                </div>
                <div style={{display: 'flex',flexDirection: 'column'}}>
                    <h3>Contact Us</h3>
                    <h3>Reviews</h3>
                    <h3>Gallery</h3>
                </div>
                <div style={{display: 'flex',flexDirection: 'column'}}>
                    <h3>Char Dham Yatra</h3>
                    <h3>Shimla Tour Packages</h3>
                    <h3>Rameshwaram Tour Packages</h3>
                </div>
            </div>
        </div>
    );
};
export default Footer;