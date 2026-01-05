"""
Agency OS Extension Models

These models extend Plane's functionality with agency-specific concepts.
They reference Plane entities via UUIDs without modifying Plane's schema.

Concept Mapping:
- AgencyClient → extends Plane Workspace
- AgencyCampaign → extends Plane Project
- CampaignChannel → agency-specific entity
- SLATier → agency-specific entity
"""

from .base import ExtensionBaseModel
from .agency_clients import AgencyClient
from .agency_campaigns import AgencyCampaign
from .campaign_channels import CampaignChannel
from .sla_tiers import SLATier

__all__ = [
    'ExtensionBaseModel',
    'AgencyClient',
    'AgencyCampaign',
    'CampaignChannel',
    'SLATier',
]
