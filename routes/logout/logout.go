package logout

import (
	"time"

	"Stream-StrictMode/config"

	"github.com/gofiber/fiber/v3"
)

func Logout(service *Service) fiber.Handler {
	return func(c fiber.Ctx) error {
		switch c.Method() {
		case fiber.MethodPost:
			return handleLogoutPost(c, service)
		case fiber.MethodOptions:
			return c.SendStatus(fiber.StatusNoContent)
		default:
			return config.WriteError(c, config.NewAppError("Method tidak diizinkan untuk logout.", fiber.StatusMethodNotAllowed), "Logout gagal diproses.")
		}
	}
}

func handleLogoutPost(c fiber.Ctx, service *Service) error {
	settings := service.Settings()
	cookieSecure := config.ResolveCookieSecure(settings.AppConfig)

	c.Cookie(&fiber.Cookie{
		Name:     settings.SessionCookieName,
		Value:    "",
		HTTPOnly: true,
		SameSite: settings.SessionCookieSameSite,
		Secure:   cookieSecure,
		MaxAge:   -1,
		Expires:  time.Now().Add(-1 * time.Hour),
		Path:     "/",
	})
	c.Cookie(&fiber.Cookie{
		Name:     settings.RoleCookieName,
		Value:    "",
		HTTPOnly: true,
		SameSite: settings.SessionCookieSameSite,
		Secure:   cookieSecure,
		MaxAge:   -1,
		Expires:  time.Now().Add(-1 * time.Hour),
		Path:     "/",
	})

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Logout dan wipe cookie berhasil.",
	})
}
