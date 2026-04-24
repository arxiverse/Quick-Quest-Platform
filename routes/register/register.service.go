package register

import (
	"context"
	"strings"
	"time"

	"Stream-StrictMode/config"
)

type Service struct {
	client *config.SupabaseClient
}

func NewService(client *config.SupabaseClient) *Service {
	return &Service{client: client}
}

func (s *Service) HasDuplicateIdentity(ctx context.Context, payload registerPayload) (bool, error) {
	for _, filter := range []map[string]string{
		{"username": payload.Username},
		{"email": payload.Email},
		{"phone": payload.Phone},
	} {
		row, err := s.client.SelectFirst(ctx, "authentication", "auth_user_id", filter)
		if err != nil {
			return false, err
		}
		if row != nil {
			return true, nil
		}
	}

	return false, nil
}

func (s *Service) CreateAuthUser(ctx context.Context, payload registerPayload) (*config.SupabaseAuthUser, error) {
	return s.client.CreateAuthUser(ctx, payload.Email, payload.Password)
}

func (s *Service) DeleteAuthUser(ctx context.Context, authUserID string) error {
	if strings.TrimSpace(authUserID) == "" {
		return nil
	}

	return s.client.DeleteAuthUser(ctx, authUserID)
}

func (s *Service) CreateUserIdentification(ctx context.Context, authUserID string, payload registerPayload, currentDate time.Time) error {
	return s.client.Insert(ctx, "user_identification", map[string]any{
		"auth_user_id":  authUserID,
		"email":         payload.Email,
		"username":      payload.Username,
		"phone":         payload.Phone,
		"fullname":      payload.Fullname,
		"birthdate":     payload.ParsedBirthdate,
		"province":      payload.Province,
		"city":          payload.City,
		"district":      payload.District,
		"sub_district":  payload.SubDistrict,
		"full_address":  payload.FullAddress,
		"tags_skill":    nullIfEmpty(payload.TagsSkills),
		"authorization": "user",
		"user_role":     config.UserRoleRunner,
		"created_at":    currentDate,
		"updated_at":    currentDate,
	})
}

func (s *Service) CreateAuthentication(ctx context.Context, authUserID string, payload registerPayload, passwordHash string, authToken string, currentDate time.Time) error {
	return s.client.Insert(ctx, "authentication", map[string]any{
		"auth_user_id":  authUserID,
		"username":      payload.Username,
		"email":         payload.Email,
		"phone":         payload.Phone,
		"password":      passwordHash,
		"authorization": "user",
		"auth_token":    authToken,
		"created_at":    currentDate,
		"updated_at":    currentDate,
	})
}

func (s *Service) RollbackUserIdentification(ctx context.Context, authUserID string) error {
	return s.client.Delete(ctx, "user_identification", map[string]string{
		"auth_user_id": authUserID,
	})
}

func nullIfEmpty(value string) any {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}
	return trimmed
}
