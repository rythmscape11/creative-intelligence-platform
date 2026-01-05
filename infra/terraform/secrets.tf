# Store Supabase credentials in Secret Manager
resource "google_secret_manager_secret" "supabase_url" {
  secret_id = "supabase-url"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "supabase_url_version" {
  secret      = google_secret_manager_secret.supabase_url.id
  secret_data = var.supabase_url
}

resource "google_secret_manager_secret" "supabase_anon_key" {
  secret_id = "supabase-anon-key"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "supabase_anon_key_version" {
  secret      = google_secret_manager_secret.supabase_anon_key.id
  secret_data = var.supabase_anon_key
}

resource "google_secret_manager_secret" "supabase_service_role_key" {
  secret_id = "supabase-service-role-key"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "supabase_service_role_key_version" {
  secret      = google_secret_manager_secret.supabase_service_role_key.id
  secret_data = var.supabase_service_role_key
}

resource "google_secret_manager_secret" "db_password" {
  secret_id = "db-password"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "db_password_version" {
  secret      = google_secret_manager_secret.db_password.id
  secret_data = var.db_password
}
