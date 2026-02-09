import BlogPageClient from "./BlogPageClient";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: string;
}

const blogPosts: { [key: string]: BlogPost } = {
  "3-questions-before-buying-recycled-car-parts": {
    id: "1",
    title:
      "3 Questions You Need to Ask Before Buying Recycled Car Parts Online",
    content: `
      <p>When it comes to purchasing recycled car parts online, there are several important factors to consider to ensure you get the best value and quality for your money. At S-Twins, we understand the importance of making informed decisions when it comes to your vehicle's maintenance and repairs.</p>
      
      <h2>1. Is the part compatible with your vehicle?</h2>
      <p>Before making any purchase, it's crucial to verify that the recycled part is compatible with your specific vehicle make, model, and year. This includes checking:</p>
      <ul>
        <li>Engine specifications</li>
        <li>Transmission type</li>
        <li>Body style and trim level</li>
        <li>Manufacturing year and VIN compatibility</li>
      </ul>
      
      <p>At S-Twins, we maintain detailed records of all our recycled parts, including their original vehicle information, to help you make the right choice.</p>
      
      <h2>2. What is the specific condition of the part?</h2>
      <p>Understanding the condition of a recycled part is essential for making an informed purchase decision. We provide detailed condition reports for all our parts, including:</p>
      <ul>
        <li>Visual inspection results</li>
        <li>Functional testing outcomes</li>
        <li>Wear and tear assessment</li>
        <li>Estimated remaining lifespan</li>
      </ul>
      
      <p>Our experienced technicians thoroughly inspect each part before it's added to our inventory, ensuring you know exactly what you're getting.</p>
      
      <h2>3. What warranty and return policy does the seller offer?</h2>
      <p>Reputable sellers of recycled car parts should offer some form of warranty or return policy. At S-Twins, we stand behind our parts with:</p>
      <ul>
        <li>30-day return policy for most parts</li>
        <li>Warranty coverage based on part condition</li>
        <li>Customer support throughout the process</li>
        <li>Quality guarantee on all recycled parts</li>
      </ul>
      
      <p>By asking these three critical questions before purchasing recycled car parts online, you can ensure you're making a smart investment in your vehicle's maintenance while supporting sustainable automotive practices.</p>
      
      <p>At S-Twins, we're committed to providing high-quality recycled car parts with full transparency about their condition and compatibility. Contact us today to learn more about our inventory and how we can help you find the perfect parts for your vehicle.</p>
    `,
    author: "S-Twins Team",
    date: "19 March 2024",
    image: "/yard.png",
    category: "Auto Parts",
    readTime: "5 min read",
  },
};

import type { Metadata } from "next";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts[slug];
  
  if (!post) {
    return {
      title: "Blog Post Not Found - S-Twins",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `${post.title} - S-Twins`,
    description: post.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 160),
    alternates: {
      canonical: `https://stwins.com.au/blog/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
    openGraph: {
      title: `${post.title} - S-Twins`,
      description: post.content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().substring(0, 160),
      url: `https://stwins.com.au/blog/${slug}`,
      type: "article",
      images: post.image ? [{ url: post.image }] : undefined,
    },
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = blogPosts[slug];

  return <BlogPageClient post={post} slug={slug} />;
}

