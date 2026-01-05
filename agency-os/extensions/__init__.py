# Agency OS Extensions for Plane
# This is a Django-based extension layer that adds agency-specific 
# functionality to Plane without modifying Plane core.

"""
Extension Layer Architecture:
- Uses separate Django app connected to same PostgreSQL database as Plane
- References Plane entities via UUID foreign keys
- All agency-specific business logic lives here
- Plane remains upgrade-safe
"""
