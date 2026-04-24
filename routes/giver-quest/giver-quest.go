package giverquest

import (
	"context"
	"regexp"
	"strconv"
	"strings"
	"time"

	"Stream-StrictMode/config"

	"github.com/gofiber/fiber/v3"
)

var postalCodePattern = regexp.MustCompile(`^[0-9]{5}$`)

func GiverQuest(service *Service) fiber.Handler {
	return func(c fiber.Ctx) error {
		switch c.Method() {
		case fiber.MethodGet:
			return handleGiverQuestGet(c, service)
		case fiber.MethodPost:
			return handleGiverQuestPost(c, service)
		case fiber.MethodOptions:
			return c.SendStatus(fiber.StatusNoContent)
		default:
			return config.WriteError(c, config.NewAppError("Method tidak diizinkan untuk giver quest.", fiber.StatusMethodNotAllowed), "Gagal memproses giver quest.")
		}
	}
}

func handleGiverQuestGet(c fiber.Ctx, service *Service) error {
	ctx, cancel, authRecord, roleRecord, err := resolveGiverQuestContext(c, service, false)
	if err != nil {
		return config.WriteError(c, err, "Gagal mengambil quest giver.")
	}
	defer cancel()

	quests, err := service.ListGiverQuests(ctx, authRecord.AuthUserID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil quest giver cloud."), "Gagal mengambil quest giver.")
	}

	items := make([]fiber.Map, 0, len(quests))
	for _, record := range quests {
		escrow, err := service.FindQuestEscrowByQuestID(ctx, record.ID)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil escrow quest cloud."), "Gagal mengambil quest giver.")
		}

		items = append(items, fiber.Map{
			"id":                   record.ID,
			"title":                record.Title,
			"description":          record.Description,
			"category":             record.Category,
			"skill_tags":           record.SkillTags,
			"mode":                 record.Mode,
			"status":               record.Status,
			"reward_amount":        record.RewardAmount,
			"reward_currency":      firstNonEmpty(record.RewardCurrency, "IDR"),
			"reward_display":       buildRewardDisplay(record.RewardAmount, record.RewardCurrency),
			"current_runner_count": parseOptionalInt(record.CurrentRunnerCount),
			"max_runner":           parseOptionalInt(record.MaxRunner),
			"city":                 record.City,
			"district":             record.District,
			"full_address":         record.FullAddress,
			"created_at":           optionalTimeValue(record.CreatedAt),
			"escrow":               toQuestEscrowPayload(escrow),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Quest giver berhasil diambil.",
		"data": fiber.Map{
			"giver_auth_user_id": authRecord.AuthUserID,
			"user_role":          roleRecord.UserRole,
			"items":              items,
			"total":              len(items),
		},
	})
}

func handleGiverQuestPost(c fiber.Ctx, service *Service) error {
	body, err := config.ParseJSONBody(c)
	if err != nil {
		return config.WriteError(c, err, "Gagal membuat quest giver.")
	}

	ctx, cancel, authRecord, _, err := resolveGiverQuestContext(c, service, true)
	if err != nil {
		return config.WriteError(c, err, "Gagal membuat quest giver.")
	}
	defer cancel()

	action := resolveGiverQuestAction(c)
	switch action {
	case "create":
		payload, err := collectCreateQuestRequest(body)
		if err != nil {
			return config.WriteError(c, err, "Gagal membuat draft quest giver.")
		}

		questID, err := service.CreateQuestDraft(ctx, authRecord, payload)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal membuat draft quest giver cloud."), "Gagal membuat draft quest giver.")
		}

		escrow, err := service.FindQuestEscrowByQuestID(ctx, questID)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil escrow quest cloud."), "Gagal membuat draft quest giver.")
		}

		return c.Status(fiber.StatusCreated).JSON(fiber.Map{
			"success": true,
			"message": "Draft quest giver berhasil dibuat.",
			"data": fiber.Map{
				"quest_id":        questID,
				"title":           payload.Title,
				"mode":            payload.Mode,
				"status":          "draft",
				"reward_amount":   payload.RewardAmount,
				"reward_currency": firstNonEmpty(payload.RewardCurrency, "IDR"),
				"max_runner":      payload.MaxRunner,
				"escrow":          toQuestEscrowPayload(escrow),
			},
		})
	case "lock":
		questID := strings.TrimSpace(c.Params("id"))
		paymentMethod := normalizePaymentMethod(config.NormalizeString(body["payment_method"]))
		if questID == "" {
			return config.WriteError(c, config.NewAppError("Quest ID wajib dikirim untuk lock escrow.", fiber.StatusBadRequest), "Gagal mengunci escrow quest.")
		}

		questRecord, err := service.FindQuestByID(ctx, questID)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil quest giver cloud."), "Gagal mengunci escrow quest.")
		}
		if questRecord == nil {
			return config.WriteError(c, config.NewAppError("Quest tidak ditemukan.", fiber.StatusNotFound), "Gagal mengunci escrow quest.")
		}
		if questRecord.GiverAuthUserID != authRecord.AuthUserID {
			return config.WriteError(c, config.NewAppError("Quest ini bukan milik giver login.", fiber.StatusForbidden), "Gagal mengunci escrow quest.")
		}
		if questRecord.Status != "draft" {
			return config.WriteError(c, config.NewAppError("Escrow hanya bisa dikunci saat quest masih draft.", fiber.StatusConflict), "Gagal mengunci escrow quest.")
		}

		escrow, err := service.FindQuestEscrowByQuestID(ctx, questID)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil escrow quest cloud."), "Gagal mengunci escrow quest.")
		}
		if escrow == nil {
			return config.WriteError(c, config.NewAppError("Escrow quest belum tersedia.", fiber.StatusNotFound), "Gagal mengunci escrow quest.")
		}
		if escrow.EscrowState != "unpaid" {
			return config.WriteError(c, config.NewAppError("Escrow quest sudah pernah dikunci atau diproses.", fiber.StatusConflict), "Gagal mengunci escrow quest.")
		}

		if err := service.UpdateQuestEscrowLock(ctx, questID, paymentMethod); err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengunci escrow quest cloud."), "Gagal mengunci escrow quest.")
		}

		updatedEscrow, err := service.FindQuestEscrowByQuestID(ctx, questID)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil escrow quest cloud."), "Gagal mengunci escrow quest.")
		}

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Escrow quest berhasil dikunci.",
			"data": fiber.Map{
				"quest_id": questID,
				"escrow":   toQuestEscrowPayload(updatedEscrow),
			},
		})
	case "publish":
		questID := strings.TrimSpace(c.Params("id"))
		if questID == "" {
			return config.WriteError(c, config.NewAppError("Quest ID wajib dikirim untuk publish.", fiber.StatusBadRequest), "Gagal publish quest giver.")
		}

		questRecord, err := service.FindQuestByID(ctx, questID)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil quest giver cloud."), "Gagal publish quest giver.")
		}
		if questRecord == nil {
			return config.WriteError(c, config.NewAppError("Quest tidak ditemukan.", fiber.StatusNotFound), "Gagal publish quest giver.")
		}
		if questRecord.GiverAuthUserID != authRecord.AuthUserID {
			return config.WriteError(c, config.NewAppError("Quest ini bukan milik giver login.", fiber.StatusForbidden), "Gagal publish quest giver.")
		}
		if questRecord.Status != "draft" {
			return config.WriteError(c, config.NewAppError("Quest hanya bisa dipublish dari status draft.", fiber.StatusConflict), "Gagal publish quest giver.")
		}

		escrow, err := service.FindQuestEscrowByQuestID(ctx, questID)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil escrow quest cloud."), "Gagal publish quest giver.")
		}
		if escrow == nil {
			return config.WriteError(c, config.NewAppError("Escrow quest belum tersedia.", fiber.StatusNotFound), "Gagal publish quest giver.")
		}
		if escrow.EscrowState != "locked" {
			return config.WriteError(c, config.NewAppError("Quest belum bisa dipublish sebelum escrow terkunci.", fiber.StatusConflict), "Gagal publish quest giver.")
		}

		if err := service.PublishQuest(ctx, questID); err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal publish quest giver cloud."), "Gagal publish quest giver.")
		}

		return c.JSON(fiber.Map{
			"success": true,
			"message": "Quest giver berhasil dipublish ke feed runner.",
			"data": fiber.Map{
				"quest_id":      questID,
				"quest_status":  "open",
				"escrow_status": "locked",
			},
		})
	default:
		return config.WriteError(c, config.NewAppError("Aksi giver quest tidak dikenal.", fiber.StatusNotFound), "Gagal memproses giver quest.")
	}
}

func resolveGiverQuestContext(c fiber.Ctx, service *Service, enforceUnlocked bool) (context.Context, context.CancelFunc, *authSessionRecord, *userRoleRecord, error) {
	sessionToken := config.ResolveSessionToken(c, service.cfg.SessionCookieName)
	if sessionToken == "" {
		return nil, nil, nil, nil, config.NewAppError("Token sesi tidak ditemukan. Kirim bearer token atau cookie sesi.", fiber.StatusUnauthorized)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	authRecord, err := service.FindAuthBySessionToken(ctx, sessionToken)
	if err != nil {
		cancel()
		return nil, nil, nil, nil, config.MapSupabaseError(err, "Gagal mengambil data auth cloud.")
	}
	if authRecord == nil {
		cancel()
		return nil, nil, nil, nil, config.NewAppError("Token sesi tidak valid atau sudah kadaluarsa.", fiber.StatusUnauthorized)
	}

	roleRecord, err := service.GetUserRole(ctx, authRecord.AuthUserID)
	if err != nil {
		cancel()
		return nil, nil, nil, nil, config.MapSupabaseError(err, "Gagal mengambil role user cloud.")
	}
	if roleRecord == nil {
		cancel()
		return nil, nil, nil, nil, config.NewAppError("Role user tidak ditemukan.", fiber.StatusNotFound)
	}

	if enforceUnlocked && roleRecord.UserRole != config.UserRoleUnlocked {
		cancel()
		return nil, nil, nil, nil, config.NewAppError("Akun belum unlocked untuk memposting quest. Lengkapi verifikasi profile terlebih dahulu.", fiber.StatusForbidden)
	}

	return ctx, cancel, authRecord, roleRecord, nil
}

func collectCreateQuestRequest(body map[string]any) (createQuestPayload, error) {
	payload := createQuestPayload{
		Title:          config.NormalizeString(body["title"]),
		Description:    config.NormalizeString(body["description"]),
		Category:       config.NormalizeString(body["category"]),
		SkillTags:      collectStringArray(body["skill_tags"]),
		Mode:           normalizeQuestMode(config.NormalizeString(body["mode"])),
		Status:         normalizeQuestStatus(config.NormalizeString(body["status"])),
		RewardCurrency: firstNonEmpty(config.NormalizeString(body["reward_currency"]), "IDR"),
		Province:       config.NormalizeString(body["province"]),
		City:           config.NormalizeString(body["city"]),
		District:       config.NormalizeString(body["district"]),
		SubDistrict:    config.NormalizeString(body["sub_district"]),
		FullAddress:    config.NormalizeString(body["full_address"]),
		PostalCode:     config.NormalizeString(body["postal_code"]),
		MaxRunner:      parseOrDefaultInt(config.NormalizeString(body["max_runner"]), 1),
	}

	if payload.Title == "" {
		return createQuestPayload{}, config.NewAppError("Judul quest wajib diisi.", fiber.StatusBadRequest)
	}
	if payload.Description == "" {
		return createQuestPayload{}, config.NewAppError("Deskripsi quest wajib diisi.", fiber.StatusBadRequest)
	}

	rewardAmount, err := strconv.ParseFloat(strings.TrimSpace(config.NormalizeString(body["reward_amount"])), 64)
	if err != nil || rewardAmount < 0 {
		return createQuestPayload{}, config.NewAppError("Reward amount wajib berupa angka valid.", fiber.StatusBadRequest)
	}
	payload.RewardAmount = rewardAmount

	if payload.PostalCode != "" && !postalCodePattern.MatchString(payload.PostalCode) {
		return createQuestPayload{}, config.NewAppError("Postal code quest harus 5 digit.", fiber.StatusBadRequest)
	}

	if lat := strings.TrimSpace(config.NormalizeString(body["lat"])); lat != "" {
		parsed, err := strconv.ParseFloat(lat, 64)
		if err != nil {
			return createQuestPayload{}, config.NewAppError("Latitude quest tidak valid.", fiber.StatusBadRequest)
		}
		payload.Lat = &parsed
	}

	if lng := strings.TrimSpace(config.NormalizeString(body["lng"])); lng != "" {
		parsed, err := strconv.ParseFloat(lng, 64)
		if err != nil {
			return createQuestPayload{}, config.NewAppError("Longitude quest tidak valid.", fiber.StatusBadRequest)
		}
		payload.Lng = &parsed
	}

	if startsAt := strings.TrimSpace(config.NormalizeString(body["starts_at"])); startsAt != "" {
		parsed, err := parseRequestTime(startsAt)
		if err != nil {
			return createQuestPayload{}, err
		}
		payload.StartsAt = &parsed
	}

	if endsAt := strings.TrimSpace(config.NormalizeString(body["ends_at"])); endsAt != "" {
		parsed, err := parseRequestTime(endsAt)
		if err != nil {
			return createQuestPayload{}, err
		}
		payload.EndsAt = &parsed
	}

	if payload.EndsAt != nil && payload.StartsAt != nil && payload.EndsAt.Before(*payload.StartsAt) {
		return createQuestPayload{}, config.NewAppError("Akhir waktu quest tidak boleh sebelum waktu mulai.", fiber.StatusBadRequest)
	}

	if payload.Mode == "solo" {
		payload.MaxRunner = 1
	}

	return payload, nil
}

func collectStringArray(value any) []string {
	switch typed := value.(type) {
	case []any:
		out := make([]string, 0, len(typed))
		for _, item := range typed {
			if normalized := config.NormalizeString(item); normalized != "" {
				out = append(out, normalized)
			}
		}
		return out
	case string:
		if trimmed := strings.TrimSpace(typed); trimmed != "" {
			return []string{trimmed}
		}
	}
	return []string{}
}

func normalizeQuestMode(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "group":
		return "group"
	default:
		return "solo"
	}
}

func normalizeQuestStatus(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "draft":
		return "draft"
	default:
		return "draft"
	}
}

func parseOrDefaultInt(value string, defaultValue int) int {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return defaultValue
	}
	parsed, err := strconv.Atoi(trimmed)
	if err != nil || parsed <= 0 {
		return defaultValue
	}
	return parsed
}

func parseRequestTime(value string) (time.Time, error) {
	layouts := []string{
		time.RFC3339,
		time.RFC3339Nano,
		time.DateOnly,
		"2006-01-02 15:04:05",
	}
	for _, layout := range layouts {
		if parsed, err := time.Parse(layout, value); err == nil {
			return parsed, nil
		}
	}
	return time.Time{}, config.NewAppError("Format waktu quest tidak valid.", fiber.StatusBadRequest)
}

func buildRewardDisplay(amount string, currency string) string {
	normalizedAmount := strings.TrimSpace(amount)
	if normalizedAmount == "" {
		return ""
	}
	return firstNonEmpty(strings.TrimSpace(currency), "IDR") + " " + normalizedAmount
}

func parseOptionalInt(value string) any {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}
	parsed, err := strconv.Atoi(trimmed)
	if err != nil {
		return nil
	}
	return parsed
}

func resolveGiverQuestAction(c fiber.Ctx) string {
	path := strings.TrimSuffix(strings.ToLower(c.Path()), "/")
	if strings.HasSuffix(path, "/escrow/lock") {
		return "lock"
	}
	if strings.HasSuffix(path, "/publish") {
		return "publish"
	}
	return "create"
}

func normalizePaymentMethod(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "wallet":
		return "wallet"
	case "qris":
		return "qris"
	default:
		return "virtual_account"
	}
}

func toQuestEscrowPayload(record *escrowRecord) fiber.Map {
	if record == nil {
		return fiber.Map{}
	}

	return fiber.Map{
		"id":                  record.ID,
		"quest_id":            record.QuestID,
		"escrow_state":        record.EscrowState,
		"reward_amount":       record.RewardAmount,
		"platform_fee_amount": record.PlatformFeeAmount,
		"total_amount":        record.TotalAmount,
		"payment_method":      record.PaymentMethod,
		"payment_reference":   record.PaymentReference,
		"paid_at":             optionalTimeValue(record.PaidAt),
		"locked_at":           optionalTimeValue(record.LockedAt),
		"released_at":         optionalTimeValue(record.ReleasedAt),
		"disputed_at":         optionalTimeValue(record.DisputedAt),
		"refunded_at":         optionalTimeValue(record.RefundedAt),
	}
}
