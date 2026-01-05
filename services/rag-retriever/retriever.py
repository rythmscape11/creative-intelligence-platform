import os
from supabase import create_client, Client
from openai import OpenAI

# Initialize clients
supabase: Client = create_client(
    os.environ.get("SUPABASE_URL"),
    os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
)
openai = OpenAI(apiKey=os.environ.get("OPENAI_API_KEY"))

def get_embedding(text: str) -> list[float]:
    """Generates embedding for the query."""
    response = openai.embeddings.create(
        model="text-embedding-3-small", # Frugal model
        input=text
    )
    return response.data[0].embedding

def retrieve_context(query: str, match_threshold: float = 0.7, match_count: int = 3) -> str:
    """
    Retrieves relevant document snippets using pgvector.
    Minimizes context window usage by returning only top matches.
    """
    try:
        query_embedding = get_embedding(query)
        
        # Call Supabase RPC function 'match_documents' (assumed to be set up in DB)
        response = supabase.rpc(
            "match_documents",
            {
                "query_embedding": query_embedding,
                "match_threshold": match_threshold,
                "match_count": match_count,
            }
        ).execute()
        
        if not response.data:
            return ""
            
        # Concatenate snippets
        context_snippets = [doc['content'] for doc in response.data]
        return "\n---\n".join(context_snippets)
        
    except Exception as e:
        print(f"Error retrieving context: {e}")
        return ""

def generate_answer_with_rag(query: str):
    """
    Generates an answer using RAG to save tokens.
    """
    context = retrieve_context(query)
    
    # If no context found, we might want to fail or fallback, 
    # but for frugality, we proceed with limited context or standard knowledge
    # if the user allows it. Here we just use what we have.
    
    prompt = f"""
    Context:
    {context}
    
    Question: {query}
    
    Answer based ONLY on the context provided. If the answer is not in the context, say "I don't know".
    """
    
    # Call to CMS Governor would happen here in production
    # ...
    
    return prompt
