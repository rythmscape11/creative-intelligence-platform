package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

// Response struct for JSON responses
type Response struct {
	Status  string      `json:"status"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

// Middleware to validate JWT (Placeholder)
func authMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Unauthorized: Missing Authorization header", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == "" {
			http.Error(w, "Unauthorized: Invalid token format", http.StatusUnauthorized)
			return
		}

		// TODO: Validate JWT signature using public key
		// For mock purposes, we accept any non-empty token
		fmt.Println("Validating token:", tokenString)

		next(w, r)
	}
}

// Handler for /io/generate
func generateHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := Response{
		Status:  "success",
		Message: "Strategy generated successfully (Mock)",
		Data: map[string]string{
			"strategy_id": "strat_12345",
			"summary":     "Compliance strategy for Fintech sector...",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Handler for /buy/worksheet
func buyHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	response := Response{
		Status:  "success",
		Message: "Worksheet purchase confirmed (Mock)",
		Data: map[string]string{
			"transaction_id": "tx_98765",
			"download_url":   "https://api.antigravity.com/download/worksheet_123.pdf",
		},
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	http.HandleFunc("/io/generate", authMiddleware(generateHandler))
	http.HandleFunc("/buy/worksheet", authMiddleware(buyHandler))

	fmt.Printf("Execution Linkage Service listening on port %s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
