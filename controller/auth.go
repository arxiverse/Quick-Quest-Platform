package controller

import (
	"context"
	"encoding/json"
	"errors"
	"net/http"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthController struct {
	db *pgxpool.Pool
}

type RegisterForwardRequest struct {
	User UserPayload `json:"user"`
	Auth AuthPayload `json:"auth"`
}

type UserPayload struct {
	ID            string `json:"id"`
	Email         string `json:"email"`
	Username      string `json:"username"`
	Phone         string `json:"phone"`
	Fullname      string `json:"fullname"`
	Birthdate     string `json:"birthdate"`
	Province      string `json:"province"`
	City          string `json:"city"`
	District      string `json:"district"`
	SubDistrict   string `json:"sub_district"`
	FullAddress   string `json:"full_address"`
	TagsSkills    string `json:"tags_skills"`
	Authorization string `json:"authorization"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}

type AuthPayload struct {
	ID            string `json:"id"`
	UserID        string `json:"user_id"`
	Email         string `json:"email"`
	Username      string `json:"username"`
	Phone         string `json:"phone"`
	Authorization string `json:"authorization"`
	Password      string `json:"password"`
	AuthToken     string `json:"auth_token"`
	CreatedAt     string `json:"created_at"`
	UpdatedAt     string `json:"updated_at"`
}

type apiResponse struct {
	Success bool        `json:"success"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

func NewAuthController(db *pgxpool.Pool) *AuthController {
	return &AuthController{db: db}
}

func (controller *AuthController) RegisterRoutes(mux *http.ServeMux) {
	mux.HandleFunc("POST /auth/register", controller.handleRegister)
}

func (controller *AuthController) handleRegister(writer http.ResponseWriter, request *http.Request) {
	writer.Header().Set("Content-Type", "application/json")

	var payload RegisterForwardRequest
	if err := json.NewDecoder(request.Body).Decode(&payload); err != nil {
		writeJSON(writer, http.StatusBadRequest, apiResponse{Success: false, Message: "Payload register dari Express nggak valid."})
		return
	}

	if err := validateRegisterForwardRequest(payload); err != nil {
		writeJSON(writer, http.StatusBadRequest, apiResponse{Success: false, Message: err.Error()})
		return
	}

	birthdate, err := parseDate(payload.User.Birthdate)
	if err != nil {
		writeJSON(writer, http.StatusBadRequest, apiResponse{Success: false, Message: "birthdate dari Express belum valid."})
		return
	}

	createdAt := parseOptionalTime(payload.User.CreatedAt)
	updatedAt := parseOptionalTime(payload.User.UpdatedAt)
	authCreatedAt := parseOptionalTime(payload.Auth.CreatedAt)
	authUpdatedAt := parseOptionalTime(payload.Auth.UpdatedAt)

	ctx, cancel := context.WithTimeout(request.Context(), 15*time.Second)
	defer cancel()

	tx, err := controller.db.BeginTx(ctx, pgx.TxOptions{})
	if err != nil {
		writeJSON(writer, http.StatusInternalServerError, apiResponse{Success: false, Message: "Gagal memulai transaksi Supabase."})
		return
	}
	defer tx.Rollback(ctx)

	_, err = tx.Exec(ctx, `
		INSERT INTO user_identification (
			id, email, username, phone, fullname, birthdate, province, city, district, sub_district,
			full_address, tags_skills, authorization, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
			$11, $12, $13, $14, $15
		)
	`,
		payload.User.ID,
		payload.User.Email,
		payload.User.Username,
		payload.User.Phone,
		payload.User.Fullname,
		birthdate,
		payload.User.Province,
		payload.User.City,
		payload.User.District,
		payload.User.SubDistrict,
		payload.User.FullAddress,
		payload.User.TagsSkills,
		fallbackAuthorization(payload.User.Authorization),
		createdAt,
		updatedAt,
	)
	if err != nil {
		statusCode, message := mapDatabaseError(err, "Gagal menulis user_identification ke Supabase.")
		writeJSON(writer, statusCode, apiResponse{Success: false, Message: message})
		return
	}

	_, err = tx.Exec(ctx, `
		INSERT INTO authentication (
			id, user_id, email, username, phone, authorization, password, auth_token, created_at, updated_at
		) VALUES (
			$1, $2, $3, $4, $5, $6, $7, $8, $9, $10
		)
	`,
		payload.Auth.ID,
		payload.Auth.UserID,
		payload.Auth.Email,
		payload.Auth.Username,
		payload.Auth.Phone,
		fallbackAuthorization(payload.Auth.Authorization),
		payload.Auth.Password,
		nullIfEmpty(payload.Auth.AuthToken),
		authCreatedAt,
		authUpdatedAt,
	)
	if err != nil {
		statusCode, message := mapDatabaseError(err, "Gagal menulis authentication ke Supabase.")
		writeJSON(writer, statusCode, apiResponse{Success: false, Message: message})
		return
	}

	if err := tx.Commit(ctx); err != nil {
		writeJSON(writer, http.StatusInternalServerError, apiResponse{Success: false, Message: "Commit transaksi Supabase gagal."})
		return
	}

	writeJSON(writer, http.StatusCreated, apiResponse{
		Success: true,
		Message: "Data register berhasil dipindah ke Supabase.",
		Data: map[string]string{
			"user_id": payload.User.ID,
			"auth_id": payload.Auth.ID,
		},
	})
}

func validateRegisterForwardRequest(payload RegisterForwardRequest) error {
	checks := map[string]string{
		"user.id":           strings.TrimSpace(payload.User.ID),
		"user.email":        strings.TrimSpace(payload.User.Email),
		"user.username":     strings.TrimSpace(payload.User.Username),
		"user.phone":        strings.TrimSpace(payload.User.Phone),
		"user.fullname":     strings.TrimSpace(payload.User.Fullname),
		"user.birthdate":    strings.TrimSpace(payload.User.Birthdate),
		"user.province":     strings.TrimSpace(payload.User.Province),
		"user.city":         strings.TrimSpace(payload.User.City),
		"user.district":     strings.TrimSpace(payload.User.District),
		"user.sub_district": strings.TrimSpace(payload.User.SubDistrict),
		"user.full_address": strings.TrimSpace(payload.User.FullAddress),
		"user.tags_skills":  strings.TrimSpace(payload.User.TagsSkills),
		"auth.id":           strings.TrimSpace(payload.Auth.ID),
		"auth.user_id":      strings.TrimSpace(payload.Auth.UserID),
		"auth.email":        strings.TrimSpace(payload.Auth.Email),
		"auth.username":     strings.TrimSpace(payload.Auth.Username),
		"auth.phone":        strings.TrimSpace(payload.Auth.Phone),
		"auth.password":     strings.TrimSpace(payload.Auth.Password),
	}

	for key, value := range checks {
		if value == "" {
			return errors.New(key + " wajib diisi")
		}
	}

	return nil
}

func parseDate(value string) (time.Time, error) {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return time.Time{}, errors.New("empty date")
	}

	if parsed, err := time.Parse(time.RFC3339, trimmed); err == nil {
		return parsed, nil
	}

	return time.Parse(time.DateOnly, trimmed)
}

func parseOptionalTime(value string) time.Time {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return time.Now().UTC()
	}

	if parsed, err := time.Parse(time.RFC3339, trimmed); err == nil {
		return parsed
	}

	return time.Now().UTC()
}

func fallbackAuthorization(value string) string {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return "user"
	}
	return trimmed
}

func nullIfEmpty(value string) interface{} {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}
	return trimmed
}

func mapDatabaseError(err error, fallback string) (int, string) {
	var pgError *pgconn.PgError
	if errors.As(err, &pgError) {
		if pgError.Code == "23505" {
			return http.StatusConflict, "Data Supabase bentrok karena email, username, phone, atau relasi sudah ada."
		}
	}

	return http.StatusBadGateway, fallback
}

func writeJSON(writer http.ResponseWriter, statusCode int, payload apiResponse) {
	writer.WriteHeader(statusCode)
	_ = json.NewEncoder(writer).Encode(payload)
}
