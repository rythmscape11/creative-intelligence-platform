import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/utils'; // Assuming this exists, otherwise I'll implement a simple one

const openai = new OpenAI({
    apiKey: (process.env.OPENAI_API_KEY || '').trim(),
});

export class BlogEngineService {
    /**
     * 1. Research Trends
     * Scans for trending topics in the specified niche.
     */
    static async researchTrends(niche: string = 'Marketing, AI, and Machine Learning', userId: string): Promise<string[]> {
        // Import GovernorService dynamically
        const { GovernorService } = await import('@/lib/governor');

        const model = "gpt-4-turbo-preview";
        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: "You are a trend researcher. Identify 3 high-potential, specific blog post topics based on current trends."
                },
                {
                    role: "user",
                    content: `Find 3 trending topics in "${niche}" that would appeal to professionals interested in this category. Return only the topics as a JSON array of strings.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content;

        // Track usage
        if (response.usage) {
            await GovernorService.trackUsage(
                userId,
                model,
                response.usage.prompt_tokens,
                response.usage.completion_tokens,
                'blog-research'
            );
        }

        if (!content) return [];

        try {
            const parsed = JSON.parse(content);
            return parsed.topics || parsed.trends || [];
        } catch (e) {
            console.error('Failed to parse trends:', e);
            return [];
        }
    }

    /**
     * 2. Generate Content
     * Writes a full 2000-word blog post with award-winning article format.
     */
    static async generateContent(topic: string, userId: string, wordCount: number = 2000): Promise<{ title: string; content: string; excerpt: string; seoTitle: string; seoDescription: string; imagePrompt: string }> {
        // Import GovernorService dynamically
        const { GovernorService } = await import('@/lib/governor');

        const model = "gpt-4-turbo-preview";
        const response = await openai.chat.completions.create({
            model: model,
            messages: [
                {
                    role: "system",
                    content: `You are an award-winning content writer for a premium marketing technology blog. Write content that rivals publications like Harvard Business Review, McKinsey Insights, and TechCrunch.

CRITICAL FORMATTING REQUIREMENTS FOR SEO & GEO (Generative Engine Optimization):
1. **Title**: Create a compelling, SEO-optimized title. NO asterisks or special characters. Clean, professional.

2. **Content Structure** (Use proper HTML):
   - Start with a captivating <p class="lead">hook paragraph</p> (2-3 sentences that grab attention)
   - **GEO OPTIMIZATION**: Include a direct answer block immediately after the intro. Use <h2>What is [Topic]?</h2> followed by a concise <p>definition</p>. This helps AI models cite your content.
   - Include a <div class="key-takeaways"> section with <h3>Key Takeaways</h3> and <ul> bullet points
   - Use <h2> for main sections (4-6 sections)
   - Use <h3> for subsections where needed
   - **GEO OPTIMIZATION**: Use structured data formats. Include comparisons in simple HTML tables <table> if relevant (e.g., Pros vs Cons, Old Method vs New Method).
   - Include <blockquote> for important quotes or statistics. **GEO**: AI loves statistics. Cite specific numbers/percentages.
   - Use <strong> for emphasis on key terms (Entities).
   - Include numbered lists <ol> and bullet lists <ul> for clarity
   - End with a <div class="conclusion"> section with <h2>Conclusion</h2>
   - Add a <div class="cta">Call to Action</div> at the end

3. **Quality Standards**:
   - Director-level depth with real data, statistics, and actionable insights
   - Include specific examples and case studies where relevant
   - No generic filler content - every sentence should add value
   - Professional tone, conversational where appropriate
   - Minimum ${wordCount} words

4. **Image Prompt**: Create a highly detailed, artistic DALL-E 3 prompt that:
   - Represents the core theme visually
   - Is modern, abstract, and tech-focused
   - Uses a cohesive color palette (Soft Midnight: slate, blue, violet)
   - Is suitable for a premium marketing blog header
   - Aspect ratio: Wide (16:9)

Output JSON format:
{
  "title": "Clean, SEO-friendly title (no asterisks or special characters)",
  "seoTitle": "Title tag (under 60 chars)",
  "seoDescription": "Meta description (under 160 chars)",
  "excerpt": "Short summary (2-3 sentences)",
  "content": "Full blog post in properly formatted HTML. Length: approx ${wordCount} words.",
  "imagePrompt": "A detailed DALL-E 3 prompt for a stunning header image"
}`
                },
                {
                    role: "user",
                    content: `Write an award-winning blog post about: "${topic}". Make it deep, analytical, and actionable. Ensure proper HTML formatting throughout.`
                }
            ],
            response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) throw new Error('Failed to generate content');

        // Track usage
        if (response.usage) {
            await GovernorService.trackUsage(
                userId,
                model,
                response.usage.prompt_tokens,
                response.usage.completion_tokens,
                'blog-writing'
            );
        }

        return JSON.parse(content);
    }

    /**
     * 3. Generate Image
     * Creates a featured image using DALL-E 3 and uploads to S3.
     * Falls back to Unsplash if S3 upload fails.
     */
    static async generateImage(topic: string, userId: string, customPrompt?: string): Promise<string | null> {
        try {
            // Import GovernorService dynamically
            const { GovernorService } = await import('@/lib/governor');

            console.log(`Generating image for topic: ${topic}`);

            const prompt = customPrompt || `A professional, modern, and abstract representation of "${topic}". Minimalist, tech-focused, high quality, suitable for a corporate marketing blog. 4k resolution, soft midnight colors (slate, blue, violet).`;

            const response = await openai.images.generate({
                model: "dall-e-3",
                prompt: prompt,
                n: 1,
                size: "1024x1024",
                quality: "hd",
                style: "vivid"
            });

            // Track usage for DALL-E (1 image = 1 unit)
            await GovernorService.trackUsage(
                userId,
                'dall-e-3',
                1, // 1 image
                0,
                'blog-image'
            );

            const dalleUrl = response.data?.[0]?.url;
            if (!dalleUrl) {
                console.error('DALL-E 3 returned no image URL');
                return this.getUnsplashFallback(topic);
            }

            // Try to upload to S3 for persistence
            try {
                const { S3Service } = await import('./s3-service');
                const s3Service = new S3Service();

                const imageRes = await fetch(dalleUrl);
                if (!imageRes.ok) throw new Error(`Failed to fetch image: ${imageRes.statusText}`);

                const arrayBuffer = await imageRes.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                const filename = `blog-images/${slugify(topic)}-${Date.now()}.png`;

                const uploadResult = await s3Service.uploadFile(filename, buffer, {
                    contentType: 'image/png',
                    acl: 'public-read'
                });

                console.log('Image uploaded to S3:', uploadResult.location);
                return uploadResult.location;

            } catch (uploadError: unknown) {
                console.error('Failed to upload image to S3, using Unsplash fallback:', uploadError);
                // Return Unsplash image as reliable fallback (DALL-E URLs expire!)
                return this.getUnsplashFallback(topic);
            }

        } catch (e) {
            console.error('Image generation failed:', e);
            return this.getUnsplashFallback(topic);
        }
    }

    /**
     * Get a reliable Unsplash image based on topic
     */
    private static getUnsplashFallback(topic: string): string {
        // Marketing-focused Unsplash images that never expire
        const unsplashImages = [
            'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop', // Marketing analytics
            'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop', // Data dashboard
            'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=1200&h=630&fit=crop', // Strategy
            'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=630&fit=crop', // Team meeting
            'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=630&fit=crop', // Workspace
            'https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=1200&h=630&fit=crop', // Abstract tech
            'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=1200&h=630&fit=crop', // Charts
            'https://images.unsplash.com/photo-1556155092-490a1ba16284?w=1200&h=630&fit=crop', // Digital marketing
        ];

        // Use topic to deterministically select an image
        const hash = topic.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return unsplashImages[hash % unsplashImages.length];
    }

    /**
     * 4. Publish Post
     * Saves the post to the database.
     */
    static async publishPost(data: { title: string; content: string; excerpt: string; seoTitle: string; seoDescription: string; imageUrl: string | null }, authorId: string, categoryId?: string) {
        // Ensure a category exists
        let category;

        if (categoryId) {
            category = await prisma.category.findUnique({ where: { id: categoryId } });
        }

        // Fallback if no category provided or found
        if (!category) {
            category = await prisma.category.findFirst({ where: { slug: 'ai-marketing' } });
            if (!category) {
                category = await prisma.category.create({
                    data: {
                        name: 'AI & Marketing',
                        slug: 'ai-marketing',
                        description: 'Automated insights on AI and Marketing.'
                    }
                });
            }
        }

        // Create unique slug
        let slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const existing = await prisma.blogPost.findUnique({ where: { slug } });
        if (existing) {
            slug = `${slug}-${Date.now()}`;
        }

        return await prisma.blogPost.create({
            data: {
                title: data.title,
                slug,
                content: data.content,
                excerpt: data.excerpt,
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
                featuredImage: data.imageUrl,
                status: 'PUBLISHED',
                publishedAt: new Date(),
                authorId,
                categoryId: category.id,
            }
        });
    }
}
