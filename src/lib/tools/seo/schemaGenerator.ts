export type SchemaType = 'article' | 'product' | 'faq' | 'recipe' | 'event' | 'organization';

export interface ArticleSchema {
  headline: string;
  author: string;
  datePublished: string;
  image: string;
}

export interface ProductSchema {
  name: string;
  description: string;
  price: string;
  currency: string;
  brand: string;
}

export interface FAQSchema {
  questions: { question: string; answer: string }[];
}

export function generateSchema(type: SchemaType, data: any): string {
  switch (type) {
    case 'article':
      return generateArticleSchema(data);
    case 'product':
      return generateProductSchema(data);
    case 'faq':
      return generateFAQSchema(data);
    case 'recipe':
      return generateRecipeSchema(data);
    case 'event':
      return generateEventSchema(data);
    case 'organization':
      return generateOrganizationSchema(data);
    default:
      return '{}';
  }
}

function generateArticleSchema(data: ArticleSchema): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": data.headline,
    "author": {
      "@type": "Person",
      "name": data.author
    },
    "datePublished": data.datePublished,
    "image": data.image
  }, null, 2);
}

function generateProductSchema(data: ProductSchema): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": data.name,
    "description": data.description,
    "brand": {
      "@type": "Brand",
      "name": data.brand
    },
    "offers": {
      "@type": "Offer",
      "price": data.price,
      "priceCurrency": data.currency
    }
  }, null, 2);
}

function generateFAQSchema(data: FAQSchema): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": data.questions.map(q => ({
      "@type": "Question",
      "name": q.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": q.answer
      }
    }))
  }, null, 2);
}

function generateRecipeSchema(data: any): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Recipe",
    "name": data.name,
    "author": {
      "@type": "Person",
      "name": data.author
    },
    "prepTime": data.prepTime,
    "cookTime": data.cookTime,
    "recipeYield": data.yield,
    "recipeIngredient": data.ingredients || [],
    "recipeInstructions": data.instructions || []
  }, null, 2);
}

function generateEventSchema(data: any): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Event",
    "name": data.name,
    "startDate": data.startDate,
    "endDate": data.endDate,
    "location": {
      "@type": "Place",
      "name": data.location,
      "address": data.address
    },
    "description": data.description
  }, null, 2);
}

function generateOrganizationSchema(data: any): string {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": data.name,
    "url": data.url,
    "logo": data.logo,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": data.phone,
      "contactType": "customer service"
    }
  }, null, 2);
}

