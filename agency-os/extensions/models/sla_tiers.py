"""
SLA Tier Model

Defines service level agreement tiers for agency clients.
This is a pure extension entity - no Plane FK required.
"""
from django.db import models
from .base import ExtensionBaseModel


class SLATier(ExtensionBaseModel):
    """
    Defines SLA tiers for agency retainer clients.
    
    Examples:
    - Enterprise: 4hr response, 40 hrs/month, $250/hr
    - Growth: 24hr response, 20 hrs/month, $200/hr
    - Starter: 48hr response, 10 hrs/month, $175/hr
    """
    
    name = models.CharField(
        max_length=100,
        help_text="Tier name, e.g., Enterprise, Growth, Starter"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of what this tier includes"
    )
    
    # Response time SLA
    response_time_hours = models.PositiveIntegerField(
        default=24,
        help_text="Maximum response time in hours"
    )
    
    # Monthly allocation
    monthly_hours_included = models.PositiveIntegerField(
        default=20,
        help_text="Hours included per month in retainer"
    )
    
    # Billing
    hourly_rate = models.DecimalField(
        max_digits=8, 
        decimal_places=2,
        help_text="Hourly rate for overage hours"
    )
    monthly_retainer = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Fixed monthly retainer fee"
    )
    
    # Features included (JSON array)
    features = models.JSONField(
        default=list,
        help_text="List of features included in this tier"
    )
    
    # Priority (for ordering in UI)
    priority = models.PositiveIntegerField(
        default=0,
        help_text="Display priority (higher = more prominent)"
    )
    
    class Meta:
        db_table = 'agency_sla_tiers'
        verbose_name = 'SLA Tier'
        verbose_name_plural = 'SLA Tiers'
        ordering = ['-priority', 'name']
        
    def __str__(self):
        return f"{self.name} ({self.response_time_hours}hr response)"
