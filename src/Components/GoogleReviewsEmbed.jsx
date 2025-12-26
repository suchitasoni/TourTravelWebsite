import React from "react";
import { useRenderCount } from "../TourDataContext";

const GoogleReviewsEmbed = () => {
  const iframeSrc =
    "https://3a5fb4d78bd04ff1824630f8bc174a40.elf.site";
  useRenderCount("GoogleReviewsEmbed");
  return (
    <div style={{marginTop:'73px'}}>
      <div></div>
      <div >
        <iframe
          src={iframeSrc}
          style={{
            border: '0px',
            width: '92vw',
            height: '97vh'
          }}
          loading="lazy"
          allowFullScreen=""
          referrerPolicy="no-referrer-when-downgrade"
          title="Google Reviews"
        ></iframe>
      </div>
    </div>
  );
};

export default GoogleReviewsEmbed;
