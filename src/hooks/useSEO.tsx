import { Helmet } from "react-helmet-async";

interface SEOConfig {
  title: string;
  description: string;
  image?: string;
  url?: string;
}

/**
 * Hook for setting SEO meta tags for individual pages
 * Usage: useSEO({ title: "Blog - SnapExx", description: "Read our latest..." })
 */
export const useSEO = (config: SEOConfig) => {
  const { title, description, image = "https://snapexx.tech/SE_circlelogo.png", url } = config;
  
  return {
    title,
    description,
    image,
    url,
    Helmet: () => (
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={image} />
        {url && <meta property="og:url" content={url} />}
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={image} />
      </Helmet>
    ),
  };
};
