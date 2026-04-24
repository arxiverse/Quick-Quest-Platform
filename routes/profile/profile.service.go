package profile

import (
	"context"
	"strings"
	"time"

	"Stream-StrictMode/config"
)

type Service struct {
	client *config.SupabaseClient
	cfg    config.AppConfig
}

type authSessionRecord struct {
	AuthUserID string
	Username   string
	Email      string
	Phone      string
}

type userProfileRecord struct {
	Fullname    string
	Email       string
	Phone       string
	FullAddress string
	UserRole    string
	Authorization string
	Province    string
	City        string
	District    string
	SubDistrict string
	TagsSkill   string
	Birthdate   *time.Time
	PostalCode  string
}

func NewService(client *config.SupabaseClient, cfg config.AppConfig) *Service {
	return &Service{
		client: client,
		cfg:    cfg,
	}
}

func (s *Service) FindAuthBySessionToken(ctx context.Context, token string) (*authSessionRecord, error) {
	row, err := s.client.SelectFirst(ctx, "authentication", "auth_user_id,username,email,phone", map[string]string{
		"auth_token": token,
	})
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, nil
	}

	return &authSessionRecord{
		AuthUserID: config.NormalizeString(row["auth_user_id"]),
		Username:   config.NormalizeString(row["username"]),
		Email:      config.NormalizeString(row["email"]),
		Phone:      config.NormalizeString(row["phone"]),
	}, nil
}

func (s *Service) GetUserProfile(ctx context.Context, authRecord *authSessionRecord) (*userProfileRecord, error) {
	if authRecord == nil {
		return nil, nil
	}

	row, err := s.client.SelectFirst(ctx, "user_identification", "fullname,email,phone,full_address,user_role,authorization,province,city,district,sub_district,tags_skill,birthdate,postal_code", map[string]string{
		"auth_user_id": authRecord.AuthUserID,
	})
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, nil
	}

	return &userProfileRecord{
		Fullname:      config.NormalizeString(row["fullname"]),
		Email:         config.NormalizeString(row["email"]),
		Phone:         config.NormalizeString(row["phone"]),
		FullAddress:   config.NormalizeString(row["full_address"]),
		UserRole:      config.NormalizeString(row["user_role"]),
		Authorization: config.NormalizeString(row["authorization"]),
		Province:      config.NormalizeString(row["province"]),
		City:          config.NormalizeString(row["city"]),
		District:      config.NormalizeString(row["district"]),
		SubDistrict:   config.NormalizeString(row["sub_district"]),
		TagsSkill:     config.NormalizeString(row["tags_skill"]),
		Birthdate:     parseOptionalTime(row["birthdate"]),
		PostalCode:    config.NormalizeString(row["postal_code"]),
	}, nil
}

func (s *Service) UpdateUserProfile(ctx context.Context, authRecord *authSessionRecord, payload profileUpdatePayload) error {
	if authRecord == nil {
		return nil
	}

	updates := map[string]any{
		"updated_at": time.Now().UTC(),
	}
	if payload.Fullname != "" {
		updates["fullname"] = payload.Fullname
	}
	if payload.Birthdate != nil {
		updates["birthdate"] = *payload.Birthdate
	}
	if payload.Province != "" {
		updates["province"] = payload.Province
	}
	if payload.City != "" {
		updates["city"] = payload.City
	}
	if payload.District != "" {
		updates["district"] = payload.District
	}
	if payload.SubDistrict != "" {
		updates["sub_district"] = payload.SubDistrict
	}
	if payload.FullAddress != "" {
		updates["full_address"] = payload.FullAddress
	}
	if payload.TagsSkills != "" {
		updates["tags_skill"] = payload.TagsSkills
	}

	return s.client.Update(ctx, "user_identification", map[string]string{
		"auth_user_id": authRecord.AuthUserID,
	}, updates)
}

func parseOptionalTime(value any) *time.Time {
	normalized := strings.TrimSpace(config.NormalizeString(value))
	if normalized == "" {
		return nil
	}

	layouts := []string{
		time.RFC3339Nano,
		time.RFC3339,
		time.DateOnly,
		"2006-01-02 15:04:05-07",
		"2006-01-02 15:04:05",
	}

	for _, layout := range layouts {
		if parsed, err := time.Parse(layout, normalized); err == nil {
			return &parsed
		}
	}

	return nil
}
