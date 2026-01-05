"""
Agency Client Model

Extends Plane Workspace with agency-specific client metadata.
Links to Plane's workspaces table via plane_workspace_id (UUID).
"""
from django.db import models
from .base import ExtensionBaseModel


class AgencyClient(ExtensionBaseModel):
    """
    Extension table that links to Plane Workspace.
    
    Plane Concept: Workspace
    Agency Concept: Client Account
    
    This model adds agency-specific metadata to Plane workspaces
    without modifying the Plane workspace table.
    """
    
    # Foreign key to Plane workspace (references workspaces.id)
    # NOT a Django FK - just stores the UUID to avoid coupling
    plane_workspace_id = models.UUIDField(
        unique=True,
        db_index=True,
        help_text="UUID of the linked Plane workspace"
    )
    
    # Client business information
    client_name = models.CharField(
        max_length=255,
        help_text="Client business name"
    )
    client_legal_name = models.CharField(
        max_length=255,
        blank=True,
        help_text="Legal entity name for contracts"
    )
    
    # SLA and billing
    sla_tier = models.ForeignKey(
        'SLATier',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='clients',
        help_text="SLA tier for this client"
    )
    
    # Billing contacts
    billing_contact_name = models.CharField(max_length=255, blank=True)
    billing_contact_email = models.EmailField(blank=True)
    billing_address = models.TextField(blank=True)
    
    # Contract details
    contract_start_date = models.DateField(
        null=True,
        blank=True,
        help_text="Start date of client contract"
    )
    contract_end_date = models.DateField(
        null=True,
        blank=True,
        help_text="End date of client contract"
    )
    is_active = models.BooleanField(
        default=True,
        help_text="Whether client is currently active"
    )
    
    # Industry and categorization
    industry = models.CharField(
        max_length=100,
        blank=True,
        help_text="Client's industry"
    )
    client_type = models.CharField(
        max_length=50,
        choices=[
            ('retainer', 'Retainer'),
            ('project', 'Project-Based'),
            ('hybrid', 'Hybrid'),
        ],
        default='retainer'
    )
    
    # Notes and metadata
    internal_notes = models.TextField(
        blank=True,
        help_text="Internal notes about this client"
    )
    metadata = models.JSONField(
        default=dict,
        help_text="Additional client metadata"
    )
    
    class Meta:
        db_table = 'agency_clients'
        verbose_name = 'Agency Client'
        verbose_name_plural = 'Agency Clients'
        ordering = ['client_name']
        
    def __str__(self):
        status = "active" if self.is_active else "inactive"
        return f"{self.client_name} ({status})"
    
    @property
    def contract_duration_days(self):
        """Calculate contract duration in days"""
        if self.contract_start_date and self.contract_end_date:
            return (self.contract_end_date - self.contract_start_date).days
        return None
    
    @property
    def is_contract_expired(self):
        """Check if contract has expired"""
        if self.contract_end_date:
            from django.utils import timezone
            return self.contract_end_date < timezone.now().date()
        return False
