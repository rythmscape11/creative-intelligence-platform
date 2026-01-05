variable "project_id" {
  description = "The GCP project ID"
  type        = string
}

variable "region" {
  description = "The GCP region to deploy to"
  type        = string
  default     = "us-central1"
}

variable "service_name" {
  description = "The name of the Cloud Run service"
  type        = string
  default     = "antigravity-api"
}

variable "supabase_url" {
  description = "The Supabase project URL"
  type        = string
  sensitive   = true
}

variable "supabase_anon_key" {
  description = "The Supabase anonymous key"
  type        = string
  sensitive   = true
}

variable "supabase_service_role_key" {
  description = "The Supabase service role key"
  type        = string
  sensitive   = true
}

variable "db_password" {
  description = "The database password"
  type        = string
  sensitive   = true
}
