"""
Campaign Channel Model

Tracks individual marketing channels within a campaign.
Pure extension entity - links to AgencyCampaign.
"""
from django.db import models
from .base import ExtensionBaseModel


class CampaignChannel(ExtensionBaseModel):
    """
    Tracks individual marketing channels within a campaign.
    
    Examples:
    - SEO: Organic Search, Local SEO, Technical SEO
    - PPC: Google Ads, Meta Ads, LinkedIn Ads
    - Social: Instagram, Facebook, LinkedIn, Twitter
    """
    
    CHANNEL_TYPES = [
        # SEO Channels
        ('seo_organic', 'Organic Search'),
        ('seo_local', 'Local SEO'),
        ('seo_technical', 'Technical SEO'),
        
        # Paid Channels
        ('ppc_google', 'Google Ads'),
        ('ppc_meta', 'Meta Ads'),
        ('ppc_linkedin', 'LinkedIn Ads'),
        ('ppc_tiktok', 'TikTok Ads'),
        ('ppc_other', 'Other Paid'),
        
        # Social Channels
        ('social_instagram', 'Instagram'),
        ('social_facebook', 'Facebook'),
        ('social_linkedin', 'LinkedIn'),
        ('social_twitter', 'Twitter/X'),
        ('social_tiktok', 'TikTok'),
        ('social_youtube', 'YouTube'),
        
        # Content Channels
        ('content_blog', 'Blog'),
        ('content_video', 'Video'),
        ('content_podcast', 'Podcast'),
        
        # Email
        ('email_newsletter', 'Newsletter'),
        ('email_drip', 'Drip Campaigns'),
        ('email_transactional', 'Transactional'),
        
        # Other
        ('geo_targeted', 'Geo-Targeted'),
        ('affiliate', 'Affiliate'),
        ('pr', 'PR/Media'),
        ('other', 'Other'),
    ]
    
    campaign = models.ForeignKey(
        'AgencyCampaign',
        on_delete=models.CASCADE,
        related_name='channels',
        help_text="Parent campaign"
    )
    
    channel_type = models.CharField(
        max_length=50,
        choices=CHANNEL_TYPES,
        help_text="Marketing channel type"
    )
    
    # Budget allocation
    budget_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0,
        help_text="Percentage of campaign budget for this channel"
    )
    budget_amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Fixed budget amount (overrides percentage if set)"
    )
    
    # Status
    is_active = models.BooleanField(
        default=True,
        help_text="Whether this channel is currently active"
    )
    
    # Performance data (updated periodically)
    performance_data = models.JSONField(
        default=dict,
        help_text="Channel performance metrics, e.g., {'impressions': 50000, 'clicks': 2500, 'ctr': 5.0}"
    )
    
    # Platform-specific IDs (for API integrations)
    external_account_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="External platform account ID"
    )
    external_campaign_id = models.CharField(
        max_length=255,
        blank=True,
        help_text="External platform campaign ID"
    )
    
    # Notes
    notes = models.TextField(
        blank=True,
        help_text="Channel-specific notes"
    )
    
    class Meta:
        db_table = 'agency_campaign_channels'
        verbose_name = 'Campaign Channel'
        verbose_name_plural = 'Campaign Channels'
        ordering = ['-budget_percentage']
        unique_together = ['campaign', 'channel_type']
        
    def __str__(self):
        return f"{self.campaign} - {self.get_channel_type_display()}"
    
    @property
    def calculated_budget(self):
        """Calculate actual budget for this channel"""
        if self.budget_amount:
            return self.budget_amount
        if self.campaign.budget_allocated:
            return (self.campaign.budget_allocated * self.budget_percentage) / 100
        return 0
