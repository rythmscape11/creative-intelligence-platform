import { gql } from 'graphql-tag';

export const typeDefs = gql`
  scalar DateTime
  scalar JSON

  enum UserRole {
    ADMIN
    EDITOR
    USER
  }

  enum PostStatus {
    DRAFT
    PUBLISHED
    SCHEDULED
    ARCHIVED
  }

  enum ExportFormat {
    PPTX
    DOCX
    XLSX
  }

  enum JobStatus {
    PENDING
    PROCESSING
    COMPLETED
    FAILED
  }

  type User {
    id: ID!
    email: String!
    name: String!
    role: UserRole!
    avatar: String
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type MarketingStrategy {
    id: ID!
    userId: String!
    user: User!
    input: JSON!
    output: JSON
    generatedBy: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    exportJobs: [ExportJob!]!
  }

  type BlogPost {
    id: ID!
    title: String!
    slug: String!
    content: String!
    excerpt: String!
    featuredImage: String
    authorId: String!
    author: User!
    categoryId: String!
    category: Category!
    tags: [Tag!]!
    status: PostStatus!
    seoTitle: String
    seoDescription: String
    publishedAt: DateTime
    createdAt: DateTime!
    updatedAt: DateTime!
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    color: String
    createdAt: DateTime!
    updatedAt: DateTime!
    blogPosts: [BlogPost!]!
  }

  type Tag {
    id: ID!
    name: String!
    slug: String!
    createdAt: DateTime!
    updatedAt: DateTime!
    blogPosts: [BlogPost!]!
  }

  type ExportJob {
    id: ID!
    userId: String!
    user: User!
    strategyId: String!
    strategy: MarketingStrategy!
    format: ExportFormat!
    status: JobStatus!
    fileUrl: String
    error: String
    createdAt: DateTime!
    completedAt: DateTime
  }

  input StrategyInput {
    businessName: String!
    industry: String!
    targetAudience: String!
    budget: Float!
    objectives: [String!]!
    timeframe: String!
    currentChallenges: String!
    competitorInfo: String
    existingMarketing: String
  }

  input BlogPostInput {
    title: String!
    content: String!
    excerpt: String!
    featuredImage: String
    categoryId: String!
    tagIds: [String!]!
    status: PostStatus!
    seoTitle: String
    seoDescription: String
    publishedAt: DateTime
  }

  input CategoryInput {
    name: String!
    description: String
    color: String
  }

  input TagInput {
    name: String!
  }

  type Query {
    # User queries
    me: User
    
    # Strategy queries
    strategies(limit: Int, offset: Int): [MarketingStrategy!]!
    strategy(id: ID!): MarketingStrategy
    
    # Blog queries
    blogPosts(
      limit: Int
      offset: Int
      categoryId: String
      tagId: String
      status: PostStatus
      search: String
    ): [BlogPost!]!
    blogPost(id: ID, slug: String): BlogPost
    categories: [Category!]!
    category(id: ID, slug: String): Category
    tags: [Tag!]!
    tag(id: ID, slug: String): Tag
    
    # Export queries
    exportJobs(limit: Int, offset: Int): [ExportJob!]!
    exportJob(id: ID!): ExportJob
  }

  type Mutation {
    # Strategy mutations
    createStrategy(input: StrategyInput!): MarketingStrategy!
    updateStrategy(id: ID!, input: StrategyInput!): MarketingStrategy!
    deleteStrategy(id: ID!): Boolean!
    
    # Export mutations
    exportStrategy(strategyId: ID!, format: ExportFormat!): ExportJob!
    
    # Blog mutations (admin only)
    createBlogPost(input: BlogPostInput!): BlogPost!
    updateBlogPost(id: ID!, input: BlogPostInput!): BlogPost!
    deleteBlogPost(id: ID!): Boolean!
    
    createCategory(input: CategoryInput!): Category!
    updateCategory(id: ID!, input: CategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
    
    createTag(input: TagInput!): Tag!
    updateTag(id: ID!, input: TagInput!): Tag!
    deleteTag(id: ID!): Boolean!
  }

  type Subscription {
    # Export job status updates
    exportJobUpdated(jobId: ID!): ExportJob!
  }
`;
