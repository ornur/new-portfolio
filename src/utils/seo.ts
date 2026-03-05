export const seo = ({
  description,
  image = "https://nurda.vercel.app/opengraph-image.png",
  keywords = "Nurdaulet Orynbassarov, software engineer, web developer, personal website, frontend developer, portfolio, react, typescript, frontend, Нурдаулет Орынбасаров, Разработчик, Нұрдәулет Орынбасаров",
  title,
  url = "https://nurda.vercel.app",
}: {
  description?: string;
  image?: string;
  keywords?: string;
  title: string;
  url?: string;
}) => {
  const tags = [
    { title },
    { content: description, name: "description", property: "description" },
    { content: keywords, name: "keywords", property: "keywords" },
    { content: "website", name: "og:type", property: "og:type" },
    { content: url, name: "og:url", property: "og:url" },
    {
      content: "Nurdaulet Orynbassarov",
      name: "og:site_name",
      property: "og:site_name",
    },
    { content: title, name: "og:title", property: "og:title" },
    {
      content: description,
      name: "og:description",
      property: "og:description",
    },
    { content: image, name: "og:image", property: "og:image" },
    { content: title, name: "twitter:title", property: "twitter:title" },
    {
      content: description,
      name: "twitter:description",
      property: "twitter:description",
    },
    { content: image, name: "twitter:card", property: "twitter:card" },
    { content: image, name: "twitter:image", property: "twitter:image" },
  ];

  return tags;
};
