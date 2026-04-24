package login

import (
	"context"
	"regexp"
	"strings"
	"time"

	"Stream-StrictMode/config"

	"github.com/gofiber/fiber/v3"
)

var phonePattern = regexp.MustCompile(`^\+?[0-9]{8,16}$`)

type loginPayload struct {
	Identity      string
	Password      string
	PhoneIdentity string
}

type authIdentityRecord struct {
	AuthUserID     string
	Username      string
	Email         string
	Phone         string
	Password      string
	Authorization string
}

func Login(service *Service) fiber.Handler {
	return func(c fiber.Ctx) error {
		switch c.Method() {
		case fiber.MethodPost:
			return handleLoginPost(c, service)
		case fiber.MethodOptions:
			return c.SendStatus(fiber.StatusNoContent)
		default:
			return config.WriteError(c, config.NewAppError("Method tidak diizinkan untuk login.", fiber.StatusMethodNotAllowed), "Login gagal diproses.")
		}
	}
}

func handleLoginPost(c fiber.Ctx, service *Service) error {
	body, err := config.ParseJSONBody(c)
	if err != nil {
		return config.WriteError(c, err, "Login gagal diproses.")
	}

	loginInput, err := collectLoginRequest(body)
	if err != nil {
		return config.WriteError(c, err, "Login gagal diproses.")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	authRecord, err := service.FindAuthByIdentity(ctx, loginInput)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal query auth cloud."), "Login gagal diproses.")
	}

	if authRecord == nil || !config.VerifyPassword(loginInput.Password, authRecord.Password) {
		return config.WriteError(c, config.NewAppError("Identity atau password salah.", fiber.StatusUnauthorized), "Login gagal diproses.")
	}

	userRole, err := service.FindUserRoleByAuth(ctx, authRecord)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil role user cloud."), "Login gagal diproses.")
	}

	profileSnapshot, err := service.GetUserProfileSnapshot(ctx, authRecord)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil ringkasan profile cloud."), "Login gagal diproses.")
	}
	if profileSnapshot != nil && strings.TrimSpace(profileSnapshot.UserRole) != "" {
		userRole = config.NormalizeUserRole(profileSnapshot.UserRole)
	}

	issuedAt := time.Now().UnixMilli()
	expiresAt := issuedAt + config.SessionDurationMS

	renewedAuthToken, err := config.CreateAuthToken(struct {
		ID       string
		Username string
		Email    string
		Phone    string
	}{
		ID:       authRecord.AuthUserID,
		Username: authRecord.Username,
		Email:    authRecord.Email,
		Phone:    authRecord.Phone,
	})
	if err != nil {
		return config.WriteError(c, err, "Login gagal diproses.")
	}

	if err := service.UpdateAuthToken(ctx, authRecord, renewedAuthToken); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui sesi auth cloud."), "Login gagal diproses.")
	}

	cookieSecure := config.ResolveCookieSecure(service.cfg)
	c.Cookie(&fiber.Cookie{
		Name:     service.cfg.SessionCookieName,
		Value:    renewedAuthToken,
		HTTPOnly: true,
		SameSite: service.cfg.SessionCookieSameSite,
		Secure:   cookieSecure,
		MaxAge:   int(config.SessionDuration / time.Second),
		Path:     "/",
	})
	c.Cookie(&fiber.Cookie{
		Name:     service.cfg.RoleCookieName,
		Value:    userRole,
		HTTPOnly: true,
		SameSite: service.cfg.SessionCookieSameSite,
		Secure:   cookieSecure,
		MaxAge:   int(config.SessionDuration / time.Second),
		Path:     "/",
	})

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Login berhasil.",
		"data": fiber.Map{
			"session": fiber.Map{
				"accessToken": renewedAuthToken,
				"issuedAt":    issuedAt,
				"expiresAt":   expiresAt,
				"user": fiber.Map{
					"id":           authRecord.AuthUserID,
					"username":     authRecord.Username,
					"email":        firstNonEmptyProfileValue(profileSnapshot, authRecord.Email, func(item *userProfileSnapshot) string { return item.Email }),
					"phone":        firstNonEmptyProfileValue(profileSnapshot, authRecord.Phone, func(item *userProfileSnapshot) string { return item.Phone }),
					"fullname":     firstNonEmptyProfileValue(profileSnapshot, "", func(item *userProfileSnapshot) string { return item.Fullname }),
					"full_address": firstNonEmptyProfileValue(profileSnapshot, "", func(item *userProfileSnapshot) string { return item.FullAddress }),
					"user_role":    userRole,
				},
			},
			"authorization":       resolveAuthorization(authRecord.Authorization),
			"user_role":           userRole,
			"role_switch_enabled": config.IsRoleSwitchEnabled(userRole),
		},
	})
}

func collectLoginRequest(body map[string]any) (loginPayload, error) {
	identity := strings.ToLower(config.NormalizeString(body["identity"]))
	password := config.NormalizeString(body["password"])
	if identity == "" || password == "" {
		return loginPayload{}, config.NewAppError("Identity dan password wajib diisi.", fiber.StatusBadRequest)
	}

	payload := loginPayload{
		Identity: identity,
		Password: password,
	}

	if phonePattern.MatchString(identity) {
		payload.PhoneIdentity = strings.TrimPrefix(identity, "+")
	}

	return payload, nil
}

func resolveAuthorization(value string) string {
	if strings.TrimSpace(value) == "" {
		return "user"
	}

	return strings.TrimSpace(value)
}

func firstNonEmptyProfileValue(profile *userProfileSnapshot, fallback string, selector func(*userProfileSnapshot) string) string {
	if profile == nil {
		return strings.TrimSpace(fallback)
	}

	if value := strings.TrimSpace(selector(profile)); value != "" {
		return value
	}

	return strings.TrimSpace(fallback)
}
