package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
	"quickquest-go/controller"
)

func main() {
	_ = godotenv.Load()

	databaseURL := strings.TrimSpace(os.Getenv("DATABASE_URL"))
	if databaseURL == "" {
		log.Fatal("DATABASE_URL wajib diisi untuk gateway Go")
	}

	pool, err := pgxpool.New(context.Background(), databaseURL)
	if err != nil {
		log.Fatalf("gagal bikin pool postgres: %v", err)
	}
	defer pool.Close()

	if shouldAutoMigrate(os.Getenv("AUTO_MIGRATE")) {
		if err := ensureCloudSchema(context.Background(), pool); err != nil {
			log.Fatalf("gagal ensure schema supabase: %v", err)
		}
	}

	mux := http.NewServeMux()
	mux.HandleFunc("GET /", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_, _ = w.Write([]byte(`{"success":true,"message":"Go gateway aktif"}`))
	})

	authController := controller.NewAuthController(pool)
	authController.RegisterRoutes(mux)

	server := &http.Server{
		Addr:              ":" + getEnv("PORT", "4460"),
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
		ReadTimeout:       10 * time.Second,
		WriteTimeout:      20 * time.Second,
		IdleTimeout:       60 * time.Second,
	}

	log.Printf("Go gateway running on %s", server.Addr)
	log.Fatal(server.ListenAndServe())
}

func getEnv(key, fallback string) string {
	value := strings.TrimSpace(os.Getenv(key))
	if value == "" {
		return fallback
	}
	return value
}

func shouldAutoMigrate(value string) bool {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "1", "true", "yes", "on":
		return true
	default:
		return false
	}
}

func ensureCloudSchema(ctx context.Context, pool *pgxpool.Pool) error {
	statements := []string{
		`CREATE TABLE IF NOT EXISTS user_identification (
			id UUID PRIMARY KEY,
			email VARCHAR(255) UNIQUE NOT NULL,
			username VARCHAR(255) UNIQUE NOT NULL,
			phone VARCHAR(32) UNIQUE NOT NULL,
			fullname VARCHAR(255) NOT NULL,
			birthdate DATE NOT NULL,
			province VARCHAR(255) NOT NULL,
			city VARCHAR(255) NOT NULL,
			district VARCHAR(255) NOT NULL,
			sub_district VARCHAR(255) NOT NULL,
			full_address TEXT NOT NULL,
			tags_skills TEXT NOT NULL,
			authorization VARCHAR(32) NOT NULL DEFAULT 'user',
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)`,
		`CREATE TABLE IF NOT EXISTS authentication (
			id UUID PRIMARY KEY,
			user_id UUID NOT NULL UNIQUE REFERENCES user_identification(id) ON DELETE CASCADE,
			email VARCHAR(255) UNIQUE NOT NULL,
			username VARCHAR(255) UNIQUE NOT NULL,
			phone VARCHAR(32) UNIQUE NOT NULL,
			authorization VARCHAR(32) NOT NULL DEFAULT 'user',
			password TEXT NOT NULL,
			auth_token TEXT,
			created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
			updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
		)`,
	}

	for _, statement := range statements {
		if _, err := pool.Exec(ctx, statement); err != nil {
			return err
		}
	}

	return nil
}
