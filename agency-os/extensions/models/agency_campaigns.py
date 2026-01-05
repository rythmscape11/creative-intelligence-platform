"""
Agency Campaign Model

Extends Plane Project with agency-specific campaign metadata.
Links to Plane's projects table via plane_project_id (UUID).
"""
from django.db import models
from .base import ExtensionBaseModel


class AgencyCampaign(ExtensionBaseModel):
    """
    Extension table that links to Plane Project.
    
    Plane Concept: Project
    Agency Concept: Campaign
    
    This model adds agency-specific campaign data to Plane projects
    without modifying the Plane project table.
    """
    
    # Foreign key to Plane project (references projects.id)
    # NOT a Django FK - just stores the UUID to avoid coupling
    plane_project_id = models.UUIDField(
        unique=True,
        db_index=True,
        help_text="UUID of the linked Plane project"
    )
    
    # Link to agency client
    client = models.ForeignKey(
        'AgencyClient',
        on_delete=models.CASCADE,
        related_name='campaigns',
        help_text="Parent client for this campaign"
    )
    
    # Campaign type
    CAMPAIGN_TYPES = [
        ('seo', 'SEO Campaign'),
        ('ppc', 'PPC / Paid Search'),
        ('social', 'Social Media'),
        ('email', 'Email Marketing'),
        ('content', 'Content Marketing'),
        ('branding', 'Branding'),
        ('web', 'Web Development'),
        ('integrated', 'Integrated Campaign'),
        ('other', 'Other'),
    ]
    campaign_type = models.CharField(
        max_length=50,
        choices=CAMPAIGN_TYPES,
        default='integrated',
        help_text="Type of marketing campaign"
    )
    
    # Budget tracking
    budget_allocated = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Total budget allocated for this campaign"
    )
    budget_spent = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0,
        help_text="Budget spent to date"
    )
    
    # Timeline
    start_date = models.DateField(
        null=True,
        blank=True,
        help_text="Campaign start date"
    )
    end_date = models.DateField(
        null=True,
        blank=True,
        help_text="Campaign end date"
    )
    
    # Status
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='draft'
    )
    
    # KPIs and goals
    target_kpis = models.JSONField(
        default=dict,
        help_text="Target KPIs for this campaign, e.g., {'impressions': 100000, 'clicks': 5000}"
    )
    actual_kpis = models.JSONField(
        default=dict,
        help_text="Actual achieved KPIs"
    )
    
    # Brief and notes
    campaign_brief = models.TextField(
        blank=True,
        help_text="Campaign brief and objectives"
    )
    internal_notes = models.TextField(
        blank=True,
        help_text="Internal notes"
    )
    
    # Metadata
    metadata = models.JSONField(
        default=dict,
        help_text="Additional campaign metadata"
    )
    
    class Meta:
        db_table = 'agency_campaigns'
        verbose_name = 'Agency Campaign'
        verbose_name_plural = 'Agency Campaigns'
        ordering = ['-created_at']
        
    def __str__(self):
        return f"{self.client.client_name} - {self.get_campaign_type_display()}"
    
    @property
    def budget_remaining(self):
        """Calculate remaining budget"""
        if self.budget_allocated:
            return self.budget_allocated - self.budget_spent
        return None
    
    @property
    def budget_utilization_percent(self):
        """Calculate budget utilization percentage"""
        if self.budget_allocated and self.budget_allocated > 0:
            return (self.budget_spent / self.budget_allocated) * 100
        return 0
    
    @property
    def is_over_budget(self):
        """Check if campaign is over budget"""
        if self.budget_allocated:
            return self.budget_spent > self.budget_allocated
        return False
