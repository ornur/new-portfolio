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
    { property: "description", content: description},
    { property: "keywords", content: keywords },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:site_name", content: "Nurdaulet Orynbassarov" },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "twitter:title", content: title },
    { property: "twitter:description", content: description },
    { property: "twitter:card", content: image },
    { property: "twitter:image", content: image },
  ];

  return tags;
};
