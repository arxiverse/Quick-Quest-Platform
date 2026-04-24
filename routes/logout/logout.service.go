package logout

import "Stream-StrictMode/config"

type Service struct {
	settings SessionSettings
}

type SessionSettings struct {
	config.AppConfig
	SessionCookieName     string
	RoleCookieName        string
	SessionCookieSameSite string
}

func NewService(cfg config.AppConfig) *Service {
	return &Service{
		settings: SessionSettings{
			AppConfig:             cfg,
			SessionCookieName:     cfg.SessionCookieName,
			RoleCookieName:        cfg.RoleCookieName,
			SessionCookieSameSite: cfg.SessionCookieSameSite,
		},
	}
}

func (s *Service) Settings() SessionSettings {
	return s.settings
}
