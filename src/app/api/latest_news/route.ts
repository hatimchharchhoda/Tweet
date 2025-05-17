import { NextResponse } from "next/server";

const NEWS_API_KEY = process.env.NEWS_API_KEY;

export interface Article {
  title: string;
  description: string;
  url?: string;
  publishedAt?: string;
  source: {
    name: string;
  };
}

export async function GET() {
  try {
    const urlIndia = `https://newsapi.org/v2/top-headlines?country=in&pageSize=10&apiKey=${NEWS_API_KEY}`;
    const urlGlobal = `https://newsapi.org/v2/top-headlines?language=en&pageSize=10&apiKey=${NEWS_API_KEY}`;

    const [indiaRes, globalRes] = await Promise.all([
      fetch(urlIndia),
      fetch(urlGlobal),
    ]);

    const [indiaData, globalData] = await Promise.all([
      indiaRes.json(),
      globalRes.json(),
    ]);

    const formatArticles = (articles: Article[]) =>
      articles.map((a) => ({
        title: a.title,
        description: a.description,
        url: a.url,
        source: { name: a.source.name },
        publishedAt: a.publishedAt,
      }));

    const responseData = [
      ...formatArticles(indiaData.articles),
      ...formatArticles(globalData.articles),
    ];

    return NextResponse.json(responseData);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json(
      { message: "Failed to fetch news.", error },
      { status: 500 }
    );
  }
}