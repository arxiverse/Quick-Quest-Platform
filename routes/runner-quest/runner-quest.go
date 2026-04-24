package runnerquest

import (
	"context"
	"strconv"
	"strings"
	"time"

	"Stream-StrictMode/config"

	"github.com/gofiber/fiber/v3"
)

func RunnerQuest(service *Service) fiber.Handler {
	return func(c fiber.Ctx) error {
		switch c.Method() {
		case fiber.MethodGet:
			return handleRunnerQuestGet(c, service)
		case fiber.MethodPost:
			return handleRunnerQuestPost(c, service)
		case fiber.MethodOptions:
			return c.SendStatus(fiber.StatusNoContent)
		default:
			return config.WriteError(c, config.NewAppError("Method tidak diizinkan untuk runner quest.", fiber.StatusMethodNotAllowed), "Gagal memproses runner quest.")
		}
	}
}

func handleRunnerQuestGet(c fiber.Ctx, service *Service) error {
	ctx, cancel, authRecord, err := resolveRunnerQuestContext(c, service)
	if err != nil {
		return config.WriteError(c, err, "Gagal mengambil quest runner.")
	}
	defer cancel()

	assignments, err := service.ListRunnerAssignments(ctx, authRecord.AuthUserID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil assignment runner cloud."), "Gagal mengambil quest runner.")
	}

	items := make([]fiber.Map, 0)
	for _, assignment := range assignments {
		if !isRunnerActiveAssignment(assignment.AssignmentStatus) {
			continue
		}

		questRecord, err := service.FindQuestByID(ctx, assignment.QuestID)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil detail quest active cloud."), "Gagal mengambil quest runner.")
		}
		if questRecord == nil {
			continue
		}

		giver, err := service.FindGiverSummary(ctx, questRecord.GiverAuthUserID)
		if err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil ringkasan giver cloud."), "Gagal mengambil quest runner.")
		}

		items = append(items, fiber.Map{
			"assignment_id":     assignment.ID,
			"assignment_status": assignment.AssignmentStatus,
			"joined_at":         optionalTimeValue(assignment.JoinedAt),
			"started_at":        optionalTimeValue(assignment.StartedAt),
			"finished_at":       optionalTimeValue(assignment.FinishedAt),
			"quest":             toRunnerQuestItem(*questRecord, giver),
		})
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Quest aktif runner berhasil diambil.",
		"data": fiber.Map{
			"runner_auth_user_id": authRecord.AuthUserID,
			"items":               items,
			"total":               len(items),
		},
	})
}

func handleRunnerQuestPost(c fiber.Ctx, service *Service) error {
	ctx, cancel, authRecord, err := resolveRunnerQuestContext(c, service)
	if err != nil {
		return config.WriteError(c, err, "Gagal mengambil quest runner.")
	}
	defer cancel()

	questID := strings.TrimSpace(c.Params("id"))
	if questID == "" {
		return config.WriteError(c, config.NewAppError("Route runner quest belum valid.", fiber.StatusNotFound), "Gagal memproses runner quest.")
	}

	action := resolveRunnerQuestAction(c)
	if action == "start" {
		return handleRunnerQuestStart(c, service, ctx, authRecord, questID)
	}
	if action == "finish" {
		return handleRunnerQuestFinish(c, service, ctx, authRecord, questID)
	}

	existingAssignment, err := service.FindQuestAssignment(ctx, questID, authRecord.AuthUserID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil assignment runner cloud."), "Gagal mengambil quest runner.")
	}
	if existingAssignment != nil {
		return config.WriteError(c, config.NewAppError("Runner sudah pernah mengambil atau join quest ini.", fiber.StatusConflict), "Gagal mengambil quest runner.")
	}

	questRecord, err := service.FindQuestByID(ctx, questID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil detail quest cloud."), "Gagal mengambil quest runner.")
	}
	if questRecord == nil {
		return config.WriteError(c, config.NewAppError("Quest tidak ditemukan.", fiber.StatusNotFound), "Gagal mengambil quest runner.")
	}
	if questRecord.Status != "open" {
		return config.WriteError(c, config.NewAppError("Quest ini belum tersedia untuk diambil.", fiber.StatusConflict), "Gagal mengambil quest runner.")
	}
	if questRecord.GiverAuthUserID == authRecord.AuthUserID {
		return config.WriteError(c, config.NewAppError("Giver tidak bisa mengambil quest miliknya sendiri.", fiber.StatusForbidden), "Gagal mengambil quest runner.")
	}

	currentCount := parseOrZeroInt(questRecord.CurrentRunnerCount)
	maxRunner := parseOrZeroInt(questRecord.MaxRunner)
	if maxRunner <= 0 {
		maxRunner = 1
	}
	if currentCount >= maxRunner {
		return config.WriteError(c, config.NewAppError("Quest ini sudah penuh.", fiber.StatusConflict), "Gagal mengambil quest runner.")
	}

	if err := service.CreateQuestAssignment(ctx, questID, authRecord.AuthUserID, "accepted"); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal membuat assignment runner cloud."), "Gagal mengambil quest runner.")
	}

	nextCount := currentCount + 1
	nextStatus := "open"
	if questRecord.Mode == "solo" || nextCount >= maxRunner {
		nextStatus = "matched"
	}

	if err := service.UpdateQuestAfterTake(ctx, questRecord, nextStatus, nextCount); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui status quest cloud."), "Gagal mengambil quest runner.")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Quest berhasil diambil runner.",
		"data": fiber.Map{
			"quest_id":             questID,
			"mode":                 questRecord.Mode,
			"previous_status":      questRecord.Status,
			"next_status":          nextStatus,
			"current_runner_count": nextCount,
			"max_runner":           maxRunner,
			"assignment_status":    "accepted",
		},
	})
}

func handleRunnerQuestStart(c fiber.Ctx, service *Service, ctx context.Context, authRecord *authSessionRecord, questID string) error {
	assignment, err := service.FindQuestAssignment(ctx, questID, authRecord.AuthUserID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil assignment runner cloud."), "Gagal memulai quest runner.")
	}
	if assignment == nil {
		return config.WriteError(c, config.NewAppError("Assignment runner untuk quest ini tidak ditemukan.", fiber.StatusNotFound), "Gagal memulai quest runner.")
	}
	if assignment.AssignmentStatus != "accepted" {
		return config.WriteError(c, config.NewAppError("Quest hanya bisa dimulai dari status accepted.", fiber.StatusConflict), "Gagal memulai quest runner.")
	}

	questRecord, err := service.FindQuestByID(ctx, questID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil detail quest cloud."), "Gagal memulai quest runner.")
	}
	if questRecord == nil {
		return config.WriteError(c, config.NewAppError("Quest tidak ditemukan.", fiber.StatusNotFound), "Gagal memulai quest runner.")
	}

	escrow, err := service.FindQuestEscrowByQuestID(ctx, questID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil escrow quest cloud."), "Gagal memulai quest runner.")
	}
	if escrow == nil {
		return config.WriteError(c, config.NewAppError("Escrow quest tidak ditemukan.", fiber.StatusNotFound), "Gagal memulai quest runner.")
	}
	if escrow.EscrowState != "locked" && escrow.EscrowState != "in_progress" {
		return config.WriteError(c, config.NewAppError("Quest belum siap dimulai karena escrow belum locked.", fiber.StatusConflict), "Gagal memulai quest runner.")
	}

	now := time.Now().UTC()
	if err := service.UpdateQuestAssignmentLifecycle(ctx, assignment.ID, "active", map[string]any{
		"started_at": now,
	}); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui assignment runner cloud."), "Gagal memulai quest runner.")
	}

	if err := service.UpdateQuestStatus(ctx, questID, "in_progress"); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui status quest cloud."), "Gagal memulai quest runner.")
	}
	if err := service.UpdateQuestEscrowState(ctx, questID, "in_progress", ""); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui escrow quest cloud."), "Gagal memulai quest runner.")
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Quest runner berhasil dimulai.",
		"data": fiber.Map{
			"quest_id":          questID,
			"previous_status":   assignment.AssignmentStatus,
			"assignment_status": "active",
			"quest_status":      "in_progress",
			"escrow_status":     "in_progress",
			"started_at":        now,
		},
	})
}

func handleRunnerQuestFinish(c fiber.Ctx, service *Service, ctx context.Context, authRecord *authSessionRecord, questID string) error {
	assignment, err := service.FindQuestAssignment(ctx, questID, authRecord.AuthUserID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil assignment runner cloud."), "Gagal menyelesaikan quest runner.")
	}
	if assignment == nil {
		return config.WriteError(c, config.NewAppError("Assignment runner untuk quest ini tidak ditemukan.", fiber.StatusNotFound), "Gagal menyelesaikan quest runner.")
	}
	if assignment.AssignmentStatus != "active" {
		return config.WriteError(c, config.NewAppError("Quest hanya bisa diselesaikan dari status active.", fiber.StatusConflict), "Gagal menyelesaikan quest runner.")
	}

	questRecord, err := service.FindQuestByID(ctx, questID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil detail quest cloud."), "Gagal menyelesaikan quest runner.")
	}
	if questRecord == nil {
		return config.WriteError(c, config.NewAppError("Quest tidak ditemukan.", fiber.StatusNotFound), "Gagal menyelesaikan quest runner.")
	}

	escrow, err := service.FindQuestEscrowByQuestID(ctx, questID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil escrow quest cloud."), "Gagal menyelesaikan quest runner.")
	}
	if escrow == nil {
		return config.WriteError(c, config.NewAppError("Escrow quest tidak ditemukan.", fiber.StatusNotFound), "Gagal menyelesaikan quest runner.")
	}
	if escrow.EscrowState != "in_progress" {
		return config.WriteError(c, config.NewAppError("Quest belum bisa selesai karena escrow belum in_progress.", fiber.StatusConflict), "Gagal menyelesaikan quest runner.")
	}

	now := time.Now().UTC()
	updates := map[string]any{
		"finished_at": now,
	}
	if assignment.StartedAt == nil {
		updates["started_at"] = now
	}

	if err := service.UpdateQuestAssignmentLifecycle(ctx, assignment.ID, "finished", updates); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui assignment runner cloud."), "Gagal menyelesaikan quest runner.")
	}

	if err := service.UpdateQuestStatus(ctx, questID, "pending_review"); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui status quest cloud."), "Gagal menyelesaikan quest runner.")
	}
	if err := service.UpdateQuestEscrowState(ctx, questID, "pending", ""); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui escrow quest cloud."), "Gagal menyelesaikan quest runner.")
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Quest runner berhasil ditandai selesai.",
		"data": fiber.Map{
			"quest_id":          questID,
			"previous_status":   assignment.AssignmentStatus,
			"assignment_status": "finished",
			"quest_status":      "pending_review",
			"escrow_status":     "pending",
			"started_at":        optionalTimeValue(assignment.StartedAt),
			"finished_at":       now,
		},
	})
}

func resolveRunnerQuestAction(c fiber.Ctx) string {
	path := strings.TrimSuffix(strings.ToLower(c.Path()), "/")
	if strings.HasSuffix(path, "/start") {
		return "start"
	}
	if strings.HasSuffix(path, "/finish") {
		return "finish"
	}
	return "take"
}

func resolveRunnerQuestContext(c fiber.Ctx, service *Service) (context.Context, context.CancelFunc, *authSessionRecord, error) {
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

func isRunnerActiveAssignment(status string) bool {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "accepted", "active", "finished":
		return true
	default:
		return false
	}
}

func toRunnerQuestItem(record questRecord, giver *giverSummaryRecord) fiber.Map {
	return fiber.Map{
		"id":              record.ID,
		"title":           record.Title,
		"description":     record.Description,
		"category":        record.Category,
		"skill_tags":      record.SkillTags,
		"mode":            record.Mode,
		"status":          record.Status,
		"reward_amount":   record.RewardAmount,
		"reward_currency": firstNonEmpty(record.RewardCurrency, "IDR"),
		"reward_display":  buildRewardDisplay(record.RewardAmount, record.RewardCurrency),
		"giver": fiber.Map{
			"auth_user_id": record.GiverAuthUserID,
			"fullname":     resolveDisplayName(giver),
			"username":     resolveUsername(giver),
		},
		"location": fiber.Map{
			"province":     record.Province,
			"city":         record.City,
			"district":     record.District,
			"sub_district": record.SubDistrict,
			"full_address": record.FullAddress,
			"postal_code":  record.PostalCode,
			"lat":          parseOptionalFloat(record.Lat),
			"lng":          parseOptionalFloat(record.Lng),
		},
		"capacity": fiber.Map{
			"max_runner":           parseOrZeroInt(record.MaxRunner),
			"current_runner_count": parseOrZeroInt(record.CurrentRunnerCount),
		},
		"starts_at": optionalTimeValue(record.StartsAt),
		"ends_at":   optionalTimeValue(record.EndsAt),
	}
}

func resolveDisplayName(giver *giverSummaryRecord) string {
	if giver == nil {
		return ""
	}
	if strings.TrimSpace(giver.Fullname) != "" {
		return giver.Fullname
	}
	return giver.Username
}

func resolveUsername(giver *giverSummaryRecord) string {
	if giver == nil {
		return ""
	}
	return giver.Username
}

func buildRewardDisplay(amount string, currency string) string {
	normalizedAmount := strings.TrimSpace(amount)
	if normalizedAmount == "" {
		return ""
	}
	return firstNonEmpty(strings.TrimSpace(currency), "IDR") + " " + normalizedAmount
}

func parseOrZeroInt(value string) int {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return 0
	}
	parsed, err := strconv.Atoi(trimmed)
	if err != nil {
		return 0
	}
	return parsed
}

func parseOptionalFloat(value string) any {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}
	parsed, err := strconv.ParseFloat(trimmed, 64)
	if err != nil {
		return nil
	}
	return parsed
}

func optionalTimeValue(value *time.Time) any {
	if value == nil || value.IsZero() {
		return nil
	}
	return value.UTC()
}

func firstNonEmpty(values ...string) string {
	for _, value := range values {
		if strings.TrimSpace(value) != "" {
			return strings.TrimSpace(value)
		}
	}
	return ""
}
