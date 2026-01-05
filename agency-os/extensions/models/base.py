"""
Base model for Agency OS extension tables.
Uses UUID primary key to match Plane's convention.
"""
import uuid
from django.db import models


class ExtensionBaseModel(models.Model):
    """
    Abstract base model for all Agency OS extension tables.
    Matches Plane's BaseModel pattern with UUID primary keys.
    """
    id = models.UUIDField(
        default=uuid.uuid4, 
        unique=True, 
        editable=False, 
        db_index=True, 
        primary_key=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Soft delete support to match Plane's pattern
    deleted_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        abstract = True
        
    def soft_delete(self):
        """Soft delete the record by setting deleted_at timestamp"""
        from django.utils import timezone
        self.deleted_at = timezone.now()
        self.save(update_fields=['deleted_at'])
        
    @property
    def is_deleted(self):
        """Check if the record is soft deleted"""
        return self.deleted_at is not None
