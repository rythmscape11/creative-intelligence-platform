resource "google_cloud_run_v2_service" "default" {
  name     = var.service_name
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloud_run_sa.email

    scaling {
      min_instance_count = 0 # Frugal: Scale to zero
      max_instance_count = 1 # Frugal: Limit max instances to control cost
    }

    containers {
      image = "us-docker.pkg.dev/cloudrun/container/hello" # Placeholder image

      resources {
        limits = {
          cpu    = "1000m" # 1 vCPU
          memory = "512Mi" # 512 MiB
        }
        cpu_idle = true # Frugal: CPU only allocated during request processing
      }

      env {
        name = "SUPABASE_URL"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.supabase_url.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "SUPABASE_ANON_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.supabase_anon_key.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "SUPABASE_SERVICE_ROLE_KEY"
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.supabase_service_role_key.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "DATABASE_URL" # Constructed from secrets if needed, or passed directly
        value_source {
          secret_key_ref {
            secret  = google_secret_manager_secret.db_password.secret_id # Placeholder for full connection string or part of it
            version = "latest"
          }
        }
      }
    }
  }
}

# Allow unauthenticated access (public API)
resource "google_cloud_run_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.default.location
  service  = google_cloud_run_v2_service.default.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
