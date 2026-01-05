"""
Database Connection Utilities for Agency OS Extensions

Provides async database connections for FastAPI endpoints.
"""
import os
from contextlib import asynccontextmanager
from typing import AsyncGenerator, Optional

import asyncpg
from asyncpg import Pool, Connection


class Database:
    """Async database connection pool manager"""
    
    _pool: Optional[Pool] = None
    
    @classmethod
    def get_connection_string(cls) -> str:
        """Build connection string from environment"""
        db_url = os.getenv('DATABASE_URL')
        if db_url:
            return db_url
            
        host = os.getenv('POSTGRES_HOST', 'localhost')
        port = os.getenv('POSTGRES_PORT', '5432')
        user = os.getenv('POSTGRES_USER', 'plane')
        password = os.getenv('POSTGRES_PASSWORD', 'plane')
        database = os.getenv('POSTGRES_DB', 'plane')
        
        return f"postgresql://{user}:{password}@{host}:{port}/{database}"
    
    @classmethod
    async def connect(cls, min_size: int = 5, max_size: int = 20) -> Pool:
        """Create connection pool"""
        if cls._pool is None:
            cls._pool = await asyncpg.create_pool(
                cls.get_connection_string(),
                min_size=min_size,
                max_size=max_size,
            )
        return cls._pool
    
    @classmethod
    async def disconnect(cls) -> None:
        """Close connection pool"""
        if cls._pool:
            await cls._pool.close()
            cls._pool = None
    
    @classmethod
    async def get_pool(cls) -> Pool:
        """Get existing pool or create new one"""
        if cls._pool is None:
            await cls.connect()
        return cls._pool
    
    @classmethod
    @asynccontextmanager
    async def connection(cls) -> AsyncGenerator[Connection, None]:
        """Get a connection from the pool"""
        pool = await cls.get_pool()
        async with pool.acquire() as conn:
            yield conn
    
    @classmethod
    @asynccontextmanager
    async def transaction(cls) -> AsyncGenerator[Connection, None]:
        """Get a connection with transaction"""
        async with cls.connection() as conn:
            async with conn.transaction():
                yield conn


# =============================================================================
# Repository Pattern - Base
# =============================================================================

class BaseRepository:
    """Base class for database repositories"""
    
    @staticmethod
    async def execute(query: str, *args) -> str:
        """Execute a query and return status"""
        async with Database.connection() as conn:
            return await conn.execute(query, *args)
    
    @staticmethod
    async def fetch_one(query: str, *args) -> Optional[dict]:
        """Fetch a single row"""
        async with Database.connection() as conn:
            row = await conn.fetchrow(query, *args)
            return dict(row) if row else None
    
    @staticmethod
    async def fetch_all(query: str, *args) -> list[dict]:
        """Fetch all rows"""
        async with Database.connection() as conn:
            rows = await conn.fetch(query, *args)
            return [dict(row) for row in rows]
    
    @staticmethod
    async def fetch_val(query: str, *args):
        """Fetch a single value"""
        async with Database.connection() as conn:
            return await conn.fetchval(query, *args)


# =============================================================================
# Entity Repositories
# =============================================================================

class SLATierRepository(BaseRepository):
    """Repository for SLA tier operations"""
    
    TABLE = "agency_sla_tiers"
    
    @classmethod
    async def get_all(cls, include_deleted: bool = False) -> list[dict]:
        """Get all SLA tiers"""
        query = f"""
            SELECT * FROM {cls.TABLE}
            WHERE {'1=1' if include_deleted else 'deleted_at IS NULL'}
            ORDER BY priority DESC, name
        """
        return await cls.fetch_all(query)
    
    @classmethod
    async def get_by_id(cls, tier_id: str) -> Optional[dict]:
        """Get SLA tier by ID"""
        query = f"""
            SELECT * FROM {cls.TABLE}
            WHERE id = $1 AND deleted_at IS NULL
        """
        return await cls.fetch_one(query, tier_id)
    
    @classmethod
    async def create(cls, **data) -> dict:
        """Create a new SLA tier"""
        query = f"""
            INSERT INTO {cls.TABLE} (
                name, description, response_time_hours, monthly_hours_included,
                hourly_rate, monthly_retainer, features, priority
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        """
        return await cls.fetch_one(
            query,
            data['name'],
            data.get('description', ''),
            data.get('response_time_hours', 24),
            data.get('monthly_hours_included', 20),
            data['hourly_rate'],
            data.get('monthly_retainer'),
            data.get('features', []),
            data.get('priority', 0),
        )


class ClientRepository(BaseRepository):
    """Repository for agency client operations"""
    
    TABLE = "agency_clients"
    
    @classmethod
    async def get_all(cls, active_only: bool = False, skip: int = 0, limit: int = 50) -> list[dict]:
        """Get all clients with optional filter"""
        conditions = ["deleted_at IS NULL"]
        if active_only:
            conditions.append("is_active = TRUE")
            
        query = f"""
            SELECT c.*, t.name as sla_tier_name
            FROM {cls.TABLE} c
            LEFT JOIN agency_sla_tiers t ON c.sla_tier_id = t.id
            WHERE {' AND '.join(conditions)}
            ORDER BY c.client_name
            OFFSET $1 LIMIT $2
        """
        return await cls.fetch_all(query, skip, limit)
    
    @classmethod
    async def get_by_id(cls, client_id: str) -> Optional[dict]:
        """Get client by ID"""
        query = f"""
            SELECT c.*, t.name as sla_tier_name
            FROM {cls.TABLE} c
            LEFT JOIN agency_sla_tiers t ON c.sla_tier_id = t.id
            WHERE c.id = $1 AND c.deleted_at IS NULL
        """
        return await cls.fetch_one(query, client_id)
    
    @classmethod
    async def get_by_workspace_id(cls, workspace_id: str) -> Optional[dict]:
        """Get client by Plane workspace ID"""
        query = f"""
            SELECT c.*, t.name as sla_tier_name
            FROM {cls.TABLE} c
            LEFT JOIN agency_sla_tiers t ON c.sla_tier_id = t.id
            WHERE c.plane_workspace_id = $1 AND c.deleted_at IS NULL
        """
        return await cls.fetch_one(query, workspace_id)
    
    @classmethod
    async def count(cls, active_only: bool = False) -> int:
        """Count clients"""
        conditions = ["deleted_at IS NULL"]
        if active_only:
            conditions.append("is_active = TRUE")
            
        query = f"SELECT COUNT(*) FROM {cls.TABLE} WHERE {' AND '.join(conditions)}"
        return await cls.fetch_val(query)


class CampaignRepository(BaseRepository):
    """Repository for agency campaign operations"""
    
    TABLE = "agency_campaigns"
    
    @classmethod
    async def get_all(
        cls, 
        client_id: Optional[str] = None,
        status: Optional[str] = None,
        skip: int = 0, 
        limit: int = 50
    ) -> list[dict]:
        """Get all campaigns with optional filters"""
        conditions = ["c.deleted_at IS NULL"]
        params = []
        param_idx = 1
        
        if client_id:
            conditions.append(f"c.client_id = ${param_idx}")
            params.append(client_id)
            param_idx += 1
            
        if status:
            conditions.append(f"c.status = ${param_idx}")
            params.append(status)
            param_idx += 1
            
        params.extend([skip, limit])
        
        query = f"""
            SELECT c.*, cl.client_name
            FROM {cls.TABLE} c
            LEFT JOIN agency_clients cl ON c.client_id = cl.id
            WHERE {' AND '.join(conditions)}
            ORDER BY c.created_at DESC
            OFFSET ${param_idx} LIMIT ${param_idx + 1}
        """
        return await cls.fetch_all(query, *params)
    
    @classmethod
    async def get_by_id(cls, campaign_id: str) -> Optional[dict]:
        """Get campaign by ID"""
        query = f"""
            SELECT c.*, cl.client_name
            FROM {cls.TABLE} c
            LEFT JOIN agency_clients cl ON c.client_id = cl.id
            WHERE c.id = $1 AND c.deleted_at IS NULL
        """
        return await cls.fetch_one(query, campaign_id)
    
    @classmethod
    async def count(cls, status: Optional[str] = None) -> int:
        """Count campaigns"""
        if status:
            query = f"SELECT COUNT(*) FROM {cls.TABLE} WHERE deleted_at IS NULL AND status = $1"
            return await cls.fetch_val(query, status)
        
        query = f"SELECT COUNT(*) FROM {cls.TABLE} WHERE deleted_at IS NULL"
        return await cls.fetch_val(query)
    
    @classmethod
    async def get_budget_totals(cls) -> dict:
        """Get total budget allocated and spent"""
        query = f"""
            SELECT 
                COALESCE(SUM(budget_allocated), 0) as total_allocated,
                COALESCE(SUM(budget_spent), 0) as total_spent
            FROM {cls.TABLE}
            WHERE deleted_at IS NULL
        """
        return await cls.fetch_one(query)
