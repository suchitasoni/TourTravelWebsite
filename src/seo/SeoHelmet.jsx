import { Helmet } from "react-helmet-async";
import { useRenderCount } from "../TourDataContext";
import { memo } from "react";

function SEOHelmet({ title, description, image, url }) {
  useRenderCount("SEOHelmet");
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      {image && <meta property="og:image" content={image} />}
      {url && <meta property="og:url" content={url} />}
    </Helmet>
  );
}
export default memo(SEOHelmet);