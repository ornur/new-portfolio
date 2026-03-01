export const seo = ({
  description,
  image,
  keywords,
  title,
  url = "https://nurda.vercel.app",
}: {
  title: string;
  description?: string;
  image?: string;
  keywords?: string;
  url?: string;
}) => {
  const tags = [
    { title },
    { content: description, name: "description" },
    { content: keywords, name: "keywords" },
    { content: "website", name: "og:type" },
    { content: url, name: "og:url" },
    { content: title, name: "og:title" },
    { content: description, name: "og:description" },
    { content: title, name: "twitter:title" },
    { content: description, name: "twitter:description" },
    { content: "summary_large_image", name: "twitter:card" },
    ...(image
      ? [
          { content: image, name: "og:image" },
          { content: image, name: "twitter:image" },
        ]
      : []),
  ];

  return tags;
};
