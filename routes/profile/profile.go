package profile

import (
	"context"
	"strings"
	"time"

	"Stream-StrictMode/config"

	"github.com/gofiber/fiber/v3"
)

type profileUpdatePayload struct {
	Fullname    string
	Birthdate   *time.Time
	Province    string
	City        string
	District    string
	SubDistrict string
	FullAddress string
	TagsSkills  string
}

func Profile(service *Service) fiber.Handler {
	return func(c fiber.Ctx) error {
		switch c.Method() {
		case fiber.MethodGet:
			return handleProfileGet(c, service)
		case fiber.MethodPut:
			return handleProfilePut(c, service)
		case fiber.MethodOptions:
			return c.SendStatus(fiber.StatusNoContent)
		default:
			return config.WriteError(c, config.NewAppError("Method tidak diizinkan untuk profile.", fiber.StatusMethodNotAllowed), "Gagal memproses profile.")
		}
	}
}

func handleProfileGet(c fiber.Ctx, service *Service) error {
	ctx, cancel, authRecord, err := resolveProfileContext(c, service)
	if err != nil {
		return config.WriteError(c, err, "Gagal mengambil data profile.")
	}
	defer cancel()

	userRecord, err := service.GetUserProfile(ctx, authRecord)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil profile cloud."), "Gagal mengambil data profile.")
	}
	if userRecord == nil {
		return config.WriteError(c, config.NewAppError("Data profile user tidak ditemukan.", fiber.StatusNotFound), "Gagal mengambil data profile.")
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Profile berhasil diambil.",
		"data":    toProfileResponse(userRecord),
	})
}

func handleProfilePut(c fiber.Ctx, service *Service) error {
	sessionToken := config.ResolveSessionToken(c, service.cfg.SessionCookieName)
	if sessionToken == "" {
		return config.WriteError(c, config.NewAppError("Token sesi tidak ditemukan. Kirim bearer token atau cookie sesi.", fiber.StatusUnauthorized), "Gagal memperbarui profile.")
	}

	body, err := config.ParseJSONBody(c)
	if err != nil {
		return config.WriteError(c, err, "Gagal memperbarui profile.")
	}

	updatePayload, err := collectProfileUpdateRequest(body)
	if err != nil {
		return config.WriteError(c, err, "Gagal memperbarui profile.")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	authRecord, err := service.FindAuthBySessionToken(ctx, sessionToken)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil data auth cloud."), "Gagal memperbarui profile.")
	}
	if authRecord == nil {
		return config.WriteError(c, config.NewAppError("Token sesi tidak valid atau sudah kadaluarsa.", fiber.StatusUnauthorized), "Gagal memperbarui profile.")
	}

	if err := service.UpdateUserProfile(ctx, authRecord, updatePayload); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui profile cloud."), "Gagal memperbarui profile.")
	}

	userRecord, err := service.GetUserProfile(ctx, authRecord)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil profile cloud."), "Gagal memperbarui profile.")
	}
	if userRecord == nil {
		return config.WriteError(c, config.NewAppError("Data profile user tidak ditemukan.", fiber.StatusNotFound), "Gagal memperbarui profile.")
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Profile berhasil diperbarui.",
		"data":    toProfileResponse(userRecord),
	})
}

func resolveProfileContext(c fiber.Ctx, service *Service) (context.Context, context.CancelFunc, *authSessionRecord, error) {
	sessionToken := config.ResolveSessionToken(c, service.cfg.SessionCookieName)
	if sessionToken == "" {
		return nil, nil, nil, config.NewAppError("Token sesi tidak ditemukan. Kirim bearer token atau cookie sesi.", fiber.StatusUnauthorized)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	authRecord, err := service.FindAuthBySessionToken(ctx, sessionToken)
	if err != nil {
		cancel()
		return nil, nil, nil, config.MapSupabaseError(err, "Gagal mengambil data auth cloud.")
	}
	if authRecord == nil {
		cancel()
		return nil, nil, nil, config.NewAppError("Token sesi tidak valid atau sudah kadaluarsa.", fiber.StatusUnauthorized)
	}

	return ctx, cancel, authRecord, nil
}

func collectProfileUpdateRequest(body map[string]any) (profileUpdatePayload, error) {
	payload := profileUpdatePayload{
		Fullname:    config.NormalizeString(body["fullname"]),
		Province:    config.NormalizeString(body["province"]),
		City:        config.NormalizeString(body["city"]),
		District:    config.NormalizeString(body["district"]),
		SubDistrict: config.NormalizeString(body["sub_district"]),
		FullAddress: config.NormalizeString(body["full_address"]),
		TagsSkills:  normalizeSkills(body["tags_skills"]),
	}

	if birthdate := strings.TrimSpace(config.NormalizeString(body["birthdate"])); birthdate != "" {
		parsed, err := parseBirthdate(birthdate)
		if err != nil {
			return profileUpdatePayload{}, err
		}
		payload.Birthdate = &parsed
	}

	if payload.Fullname == "" && payload.Birthdate == nil && payload.Province == "" && payload.City == "" && payload.District == "" && payload.SubDistrict == "" && payload.FullAddress == "" && payload.TagsSkills == "" {
		return profileUpdatePayload{}, config.NewAppError("Minimal satu field profile harus dikirim untuk update.", fiber.StatusBadRequest)
	}

	return payload, nil
}

func toProfileResponse(record *userProfileRecord) fiber.Map {
	if record == nil {
		return fiber.Map{}
	}

	normalizedUserRole := config.NormalizeUserRole(record.UserRole)

	return fiber.Map{
		"fullname":            record.Fullname,
		"email":               record.Email,
		"phone":               record.Phone,
		"full_address":        record.FullAddress,
		"authorization":       resolveProfileAuthorization(record.Authorization),
		"user_role":           normalizedUserRole,
		"role_switch_enabled": config.IsRoleSwitchEnabled(normalizedUserRole),
		"province":            record.Province,
		"city":                record.City,
		"district":            record.District,
		"sub_district":        record.SubDistrict,
		"tags_skills":         record.TagsSkill,
		"postal_code":         record.PostalCode,
	}
}

func resolveProfileAuthorization(value string) string {
	normalized := strings.TrimSpace(value)
	if normalized == "" {
		return "user"
	}

	return normalized
}

func parseBirthdate(value string) (time.Time, error) {
	normalized := strings.TrimSpace(value)
	if normalized == "" {
		return time.Time{}, config.NewAppError("Tanggal lahir belum valid.", fiber.StatusBadRequest)
	}

	layouts := []string{
		time.RFC3339,
		time.DateOnly,
		"2006-01-02T15:04:05.000Z07:00",
		"2006-01-02 15:04:05",
	}

	for _, layout := range layouts {
		if parsed, err := time.Parse(layout, normalized); err == nil {
			return parsed, nil
		}
	}

	return time.Time{}, config.NewAppError("Tanggal lahir belum valid.", fiber.StatusBadRequest)
}

func normalizeSkills(value any) string {
	switch typed := value.(type) {
	case []any:
		out := make([]string, 0, len(typed))
		for _, item := range typed {
			if normalized := config.NormalizeString(item); normalized != "" {
				out = append(out, normalized)
			}
		}
		return strings.Join(out, ", ")
	default:
		return config.NormalizeString(value)
	}
}
