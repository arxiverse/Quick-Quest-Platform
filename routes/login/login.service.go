package login

import (
	"context"
	"time"

	"Stream-StrictMode/config"
)

type Service struct {
	client *config.SupabaseClient
	cfg    config.AppConfig
}

type userProfileSnapshot struct {
	Fullname    string
	Email       string
	Phone       string
	FullAddress string
	UserRole    string
}

func NewService(client *config.SupabaseClient, cfg config.AppConfig) *Service {
	return &Service{
		client: client,
		cfg:    cfg,
	}
}

func (s *Service) FindAuthByIdentity(ctx context.Context, payload loginPayload) (*authIdentityRecord, error) {
	candidates := []map[string]string{
		{"username": payload.Identity},
		{"email": payload.Identity},
	}

	if payload.PhoneIdentity != "" {
		candidates = append(candidates, map[string]string{"phone": payload.PhoneIdentity})
	}

	for _, filter := range candidates {
		row, err := s.client.SelectFirst(ctx, "authentication", "auth_user_id,username,email,phone,password,authorization", filter)
		if err != nil {
			return nil, err
		}
		if row == nil {
			continue
		}

		return &authIdentityRecord{
			AuthUserID:     config.NormalizeString(row["auth_user_id"]),
			Username:      config.NormalizeString(row["username"]),
			Email:         config.NormalizeString(row["email"]),
			Phone:         config.NormalizeString(row["phone"]),
			Password:      config.NormalizeString(row["password"]),
			Authorization: config.NormalizeString(row["authorization"]),
		}, nil
	}

	return nil, nil
}

func (s *Service) FindUserRoleByAuth(ctx context.Context, authRecord *authIdentityRecord) (string, error) {
	if authRecord == nil {
		return config.UserRoleRunner, nil
	}

	row, err := s.client.SelectFirst(ctx, "user_identification", "user_role", map[string]string{
		"auth_user_id": authRecord.AuthUserID,
	})
	if err != nil {
		return "", err
	}
	if row == nil {
		return config.UserRoleRunner, nil
	}

	return config.NormalizeUserRole(config.NormalizeString(row["user_role"])), nil
}

func (s *Service) GetUserProfileSnapshot(ctx context.Context, authRecord *authIdentityRecord) (*userProfileSnapshot, error) {
	if authRecord == nil {
		return nil, nil
	}

	row, err := s.client.SelectFirst(ctx, "user_identification", "fullname,email,phone,full_address,user_role", map[string]string{
		"auth_user_id": authRecord.AuthUserID,
	})
	if err != nil {
		return nil, err
	}
	if row == nil {
		return &userProfileSnapshot{
			Email:    authRecord.Email,
			Phone:    authRecord.Phone,
			UserRole: config.UserRoleRunner,
		}, nil
	}

	return &userProfileSnapshot{
		Fullname:    config.NormalizeString(row["fullname"]),
		Email:       config.NormalizeString(row["email"]),
		Phone:       config.NormalizeString(row["phone"]),
		FullAddress: config.NormalizeString(row["full_address"]),
		UserRole:    config.NormalizeUserRole(config.NormalizeString(row["user_role"])),
	}, nil
}

func (s *Service) UpdateAuthToken(ctx context.Context, authRecord *authIdentityRecord, renewedAuthToken string) error {
	if authRecord == nil {
		return nil
	}

	return s.client.Update(ctx, "authentication", map[string]string{
		"auth_user_id": authRecord.AuthUserID,
	}, map[string]any{
		"auth_token": renewedAuthToken,
		"updated_at": time.Now().UTC(),
	})
}
