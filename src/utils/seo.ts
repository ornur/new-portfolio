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
    { content: description, name: "description" },
    { content: keywords, name: "keywords" },
    { content: "website", property: "og:type" },
    { content: url, property: "og:url" },
    {
      content: "Nurdaulet Orynbassarov",
      property: "og:site_name",
    },
    { content: title, property: "og:title" },
    {
      content: description,
      property: "og:description",
    },
    { content: image, property: "og:image" },
    { content: title, name: "twitter:title" },
    {
      content: description,
      name: "twitter:description",
    },
    { content: "summary_large_image", name: "twitter:card" },
    { content: image, name: "twitter:image" },
  ];

  return tags;
};
