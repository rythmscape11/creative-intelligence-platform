/**
 * ConvertKit Integration Library
 * 
 * Provides functions for interacting with the ConvertKit API v3
 * - Subscriber management
 * - Tag management
 * - Form subscriptions
 * - Sequence enrollment
 * - Broadcast sending
 * - Analytics
 */

const CONVERTKIT_API_BASE_URL = 'https://api.convertkit.com/v3';

export interface ConvertKitConfig {
  apiKey: string;
  apiSecret: string;
}

export interface ConvertKitSubscriber {
  id: number;
  first_name?: string;
  email_address: string;
  state: 'active' | 'inactive' | 'bounced' | 'complained';
  created_at: string;
  fields?: Record<string, any>;
}

export interface ConvertKitTag {
  id: number;
  name: string;
  created_at: string;
}

export interface ConvertKitForm {
  id: number;
  name: string;
  created_at: string;
  type: string;
}

export interface ConvertKitSequence {
  id: number;
  name: string;
  hold: boolean;
  repeat: boolean;
  created_at: string;
}

/**
 * Test ConvertKit API connection
 */
export async function testConvertKitConnection(config: ConvertKitConfig): Promise<boolean> {
  try {
    const response = await fetch(`${CONVERTKIT_API_BASE_URL}/account?api_secret=${config.apiSecret}`);
    
    if (!response.ok) {
      console.error('ConvertKit connection test failed:', response.status, response.statusText);
      return false;
    }

    const data = await response.json();
    console.log('ConvertKit connection successful:', data);
    return true;
  } catch (error) {
    console.error('ConvertKit connection test error:', error);
    return false;
  }
}

/**
 * Get account information
 */
export async function getAccountInfo(config: ConvertKitConfig) {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/account?api_secret=${config.apiSecret}`);
  
  if (!response.ok) {
    throw new Error(`Failed to get account info: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * List all subscribers
 */
export async function listSubscribers(
  config: ConvertKitConfig,
  options?: {
    page?: number;
    from?: string; // Date in YYYY-MM-DD format
    to?: string; // Date in YYYY-MM-DD format
    updated_from?: string;
    updated_to?: string;
    sort_order?: 'asc' | 'desc';
    sort_field?: 'id' | 'cancelled_at';
    email_address?: string;
  }
): Promise<{ total_subscribers: number; page: number; total_pages: number; subscribers: ConvertKitSubscriber[] }> {
  const params = new URLSearchParams({
    api_secret: config.apiSecret,
    ...(options?.page && { page: options.page.toString() }),
    ...(options?.from && { from: options.from }),
    ...(options?.to && { to: options.to }),
    ...(options?.updated_from && { updated_from: options.updated_from }),
    ...(options?.updated_to && { updated_to: options.updated_to }),
    ...(options?.sort_order && { sort_order: options.sort_order }),
    ...(options?.sort_field && { sort_field: options.sort_field }),
    ...(options?.email_address && { email_address: options.email_address }),
  });

  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/subscribers?${params.toString()}`);
  
  if (!response.ok) {
    throw new Error(`Failed to list subscribers: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Add a subscriber
 */
export async function addSubscriber(
  config: ConvertKitConfig,
  data: {
    email: string;
    first_name?: string;
    fields?: Record<string, any>;
    tags?: number[];
  }
): Promise<{ subscription: ConvertKitSubscriber }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_secret: config.apiSecret,
      email: data.email,
      first_name: data.first_name,
      fields: data.fields,
      tags: data.tags,
    }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Failed to add subscriber: ${response.statusText} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

/**
 * Update a subscriber
 */
export async function updateSubscriber(
  config: ConvertKitConfig,
  subscriberId: number,
  data: {
    first_name?: string;
    email_address?: string;
    fields?: Record<string, any>;
  }
): Promise<{ subscriber: ConvertKitSubscriber }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/subscribers/${subscriberId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_secret: config.apiSecret,
      ...data,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to update subscriber: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * List all tags
 */
export async function listTags(config: ConvertKitConfig): Promise<{ tags: ConvertKitTag[] }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/tags?api_key=${config.apiKey}`);
  
  if (!response.ok) {
    throw new Error(`Failed to list tags: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Create a tag
 */
export async function createTag(
  config: ConvertKitConfig,
  name: string
): Promise<{ tag: ConvertKitTag }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_secret: config.apiSecret,
      tag: { name },
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to create tag: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Tag a subscriber
 */
export async function tagSubscriber(
  config: ConvertKitConfig,
  tagId: number,
  email: string
): Promise<{ subscription: any }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/tags/${tagId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_secret: config.apiSecret,
      email,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to tag subscriber: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Untag a subscriber
 */
export async function untagSubscriber(
  config: ConvertKitConfig,
  tagId: number,
  email: string
): Promise<{ subscription: any }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/tags/${tagId}/unsubscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_secret: config.apiSecret,
      email,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to untag subscriber: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * List all forms
 */
export async function listForms(config: ConvertKitConfig): Promise<{ forms: ConvertKitForm[] }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/forms?api_key=${config.apiKey}`);
  
  if (!response.ok) {
    throw new Error(`Failed to list forms: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Subscribe to a form
 */
export async function subscribeToForm(
  config: ConvertKitConfig,
  formId: number,
  data: {
    email: string;
    first_name?: string;
    fields?: Record<string, any>;
    tags?: number[];
  }
): Promise<{ subscription: any }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/forms/${formId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_secret: config.apiSecret,
      ...data,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to subscribe to form: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * List all sequences
 */
export async function listSequences(config: ConvertKitConfig): Promise<{ courses: ConvertKitSequence[] }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/sequences?api_key=${config.apiKey}`);
  
  if (!response.ok) {
    throw new Error(`Failed to list sequences: ${response.statusText}`);
  }

  return await response.json();
}

/**
 * Add subscriber to a sequence
 */
export async function addToSequence(
  config: ConvertKitConfig,
  sequenceId: number,
  email: string
): Promise<{ subscription: any }> {
  const response = await fetch(`${CONVERTKIT_API_BASE_URL}/sequences/${sequenceId}/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      api_secret: config.apiSecret,
      email,
    }),
  });
  
  if (!response.ok) {
    throw new Error(`Failed to add to sequence: ${response.statusText}`);
  }

  return await response.json();
}

