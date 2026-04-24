package register

import (
	"context"
	"regexp"
	"strings"
	"time"

	"Stream-StrictMode/config"

	"github.com/gofiber/fiber/v3"
)

var (
	emailPattern = regexp.MustCompile(`^[^\s@]+@[^\s@]+\.[^\s@]+$`)
	phonePattern = regexp.MustCompile(`^\+?[0-9]{8,16}$`)
)

type registerPayload struct {
	Username        string
	Email           string
	Phone           string
	Fullname        string
	Birthdate       string
	Province        string
	City            string
	District        string
	SubDistrict     string
	FullAddress     string
	TagsSkills      string
	Password        string
	ParsedBirthdate time.Time
}

func Register(service *Service) fiber.Handler {
	return func(c fiber.Ctx) error {
		switch c.Method() {
		case fiber.MethodPost:
			return handleRegisterPost(c, service)
		case fiber.MethodOptions:
			return c.SendStatus(fiber.StatusNoContent)
		default:
			return config.WriteError(c, config.NewAppError("Method tidak diizinkan untuk register.", fiber.StatusMethodNotAllowed), "Register gagal diproses.")
		}
	}
}

func handleRegisterPost(c fiber.Ctx, service *Service) error {
	body, err := config.ParseJSONBody(c)
	if err != nil {
		return config.WriteError(c, err, "Register gagal diproses.")
	}

	registerInput, err := collectRegisterRequest(body)
	if err != nil {
		return config.WriteError(c, err, "Register gagal diproses.")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	duplicateExists, err := service.HasDuplicateIdentity(ctx, registerInput)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memeriksa duplikasi identity."), "Register gagal diproses.")
	}
	if duplicateExists {
		return config.WriteError(c, config.NewAppError("Username, email, atau nomor HP sudah terdaftar.", fiber.StatusConflict), "Register gagal diproses.")
	}

	authUser, err := service.CreateAuthUser(ctx, registerInput)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal membuat user auth cloud."), "Register gagal diproses.")
	}

	authUserID := strings.TrimSpace(authUser.ID)
	if authUserID == "" {
		return config.WriteError(c, config.NewAppError("User auth cloud tidak mengembalikan auth_user_id yang valid.", fiber.StatusBadGateway), "Register gagal diproses.")
	}

	passwordHash, err := config.HashPassword(registerInput.Password)
	if err != nil {
		_ = service.DeleteAuthUser(context.Background(), authUserID)
		return config.WriteError(c, err, "Register gagal diproses.")
	}

	authToken, err := config.CreateAuthToken(struct {
		ID       string
		Username string
		Email    string
		Phone    string
	}{
		ID:       authUserID,
		Username: registerInput.Username,
		Email:    registerInput.Email,
		Phone:    registerInput.Phone,
	})
	if err != nil {
		_ = service.DeleteAuthUser(context.Background(), authUserID)
		return config.WriteError(c, err, "Register gagal diproses.")
	}

	currentDate := time.Now().UTC()
	if err := service.CreateUserIdentification(ctx, authUserID, registerInput, currentDate); err != nil {
		_ = service.DeleteAuthUser(context.Background(), authUserID)
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal menyimpan data user cloud."), "Register gagal diproses.")
	}

	if err := service.CreateAuthentication(ctx, authUserID, registerInput, passwordHash, authToken, currentDate); err != nil {
		_ = service.RollbackUserIdentification(context.Background(), authUserID)
		_ = service.DeleteAuthUser(context.Background(), authUserID)
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal menyimpan data auth cloud."), "Register gagal diproses.")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Register cloud berhasil disimpan.",
		"data": fiber.Map{
			"user": fiber.Map{
				"id":        authUserID,
				"username":  registerInput.Username,
				"email":     registerInput.Email,
				"phone":     registerInput.Phone,
				"user_role": config.UserRoleRunner,
			},
			"auth": fiber.Map{
				"id":         authUserID,
				"auth_token": authToken,
			},
			"role_switch_enabled": config.IsRoleSwitchEnabled(config.UserRoleRunner),
			"sync":                nil,
			"sync_enabled":        false,
		},
	})
}

func collectRegisterRequest(body map[string]any) (registerPayload, error) {
	if config.NormalizeString(body["user_role"]) != "" {
		return registerPayload{}, config.NewAppError("Field user_role diatur otomatis oleh sistem.", fiber.StatusBadRequest)
	}

	phone, err := normalizePhone(config.NormalizeString(body["phone"]))
	if err != nil {
		return registerPayload{}, err
	}

	payload := registerPayload{
		Username:    config.NormalizeString(body["username"]),
		Email:       strings.ToLower(config.NormalizeString(body["email"])),
		Phone:       phone,
		Fullname:    config.NormalizeString(body["fullname"]),
		Birthdate:   config.NormalizeString(body["birthdate"]),
		Province:    config.NormalizeString(body["province"]),
		City:        config.NormalizeString(body["city"]),
		District:    config.NormalizeString(body["district"]),
		SubDistrict: config.NormalizeString(body["sub_district"]),
		FullAddress: config.NormalizeString(body["full_address"]),
		TagsSkills:  normalizeSkills(body["tags_skills"]),
		Password:    config.NormalizeString(body["password"]),
	}

	required := []struct {
		key   string
		value string
	}{
		{"username", payload.Username},
		{"email", payload.Email},
		{"phone", payload.Phone},
		{"fullname", payload.Fullname},
		{"birthdate", payload.Birthdate},
		{"province", payload.Province},
		{"city", payload.City},
		{"district", payload.District},
		{"sub_district", payload.SubDistrict},
		{"full_address", payload.FullAddress},
		{"password", payload.Password},
	}

	for _, item := range required {
		if strings.TrimSpace(item.value) == "" {
			return registerPayload{}, config.NewAppError("Field "+item.key+" wajib diisi.", fiber.StatusBadRequest)
		}
	}

	if !emailPattern.MatchString(payload.Email) {
		return registerPayload{}, config.NewAppError("Format email belum valid.", fiber.StatusBadRequest)
	}

	if len(payload.Password) < 8 {
		return registerPayload{}, config.NewAppError("Password minimal 8 karakter.", fiber.StatusBadRequest)
	}

	parsedBirthdate, err := parseBirthdate(payload.Birthdate)
	if err != nil {
		return registerPayload{}, config.NewAppError("Tanggal lahir belum valid.", fiber.StatusBadRequest)
	}
	payload.ParsedBirthdate = parsedBirthdate

	return payload, nil
}

func parseBirthdate(value string) (time.Time, error) {
	normalized := strings.TrimSpace(value)
	if normalized == "" {
		return time.Time{}, config.NewAppError("Tanggal lahir wajib diisi.", fiber.StatusBadRequest)
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

func normalizePhone(value string) (string, error) {
	normalized := strings.TrimSpace(value)
	if !phonePattern.MatchString(normalized) {
		return "", config.NewAppError("Nomor HP harus angka 8-16 digit.", fiber.StatusBadRequest)
	}

	return strings.TrimPrefix(normalized, "+"), nil
}
