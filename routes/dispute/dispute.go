package dispute

import (
	"context"
	"os"
	"slices"
	"strconv"
	"strings"
	"time"

	"Stream-StrictMode/config"

	"github.com/gofiber/fiber/v3"
	"github.com/google/uuid"
)

func Dispute(service *Service) fiber.Handler {
	return func(c fiber.Ctx) error {
		switch c.Method() {
		case fiber.MethodGet:
			return handleDisputeGet(c, service)
		case fiber.MethodPost:
			return handleDisputePost(c, service)
		case fiber.MethodOptions:
			return c.SendStatus(fiber.StatusNoContent)
		default:
			return config.WriteError(c, config.NewAppError("Method tidak diizinkan untuk dispute.", fiber.StatusMethodNotAllowed), "Gagal memproses dispute.")
		}
	}
}

func handleDisputeGet(c fiber.Ctx, service *Service) error {
	ctx, cancel, authRecord, err := resolveDisputeContext(c, service)
	if err != nil {
		return config.WriteError(c, err, "Gagal mengambil dispute.")
	}
	defer cancel()

	disputeID := strings.TrimSpace(c.Params("id"))
	if disputeID != "" {
		return handleDisputeDetailGet(c, service, ctx, authRecord, disputeID)
	}

	giverItems, err := service.ListDisputesByGiver(ctx, authRecord.AuthUserID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil dispute giver cloud."), "Gagal mengambil dispute.")
	}
	runnerItems, err := service.ListDisputesByRunner(ctx, authRecord.AuthUserID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil dispute runner cloud."), "Gagal mengambil dispute.")
	}

	combined := mergeDisputeCases(giverItems, runnerItems)
	items := make([]fiber.Map, 0, len(combined))
	for _, record := range combined {
		payload, err := buildDisputePayload(ctx, service, record)
		if err != nil {
			return config.WriteError(c, err, "Gagal mengambil dispute.")
		}
		items = append(items, payload)
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Daftar dispute berhasil diambil.",
		"data": fiber.Map{
			"items": items,
			"total": len(items),
		},
	})
}

func handleDisputeDetailGet(c fiber.Ctx, service *Service, ctx context.Context, authRecord *authSessionRecord, disputeID string) error {
	record, err := service.FindDisputeByID(ctx, disputeID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil detail dispute cloud."), "Gagal mengambil dispute.")
	}
	if record == nil {
		return config.WriteError(c, config.NewAppError("Dispute tidak ditemukan.", fiber.StatusNotFound), "Gagal mengambil dispute.")
	}
	if !isDisputeParticipant(record, authRecord.AuthUserID) {
		return config.WriteError(c, config.NewAppError("Dispute ini bukan milik akun yang sedang login.", fiber.StatusForbidden), "Gagal mengambil dispute.")
	}

	payload, err := buildDisputePayload(ctx, service, *record)
	if err != nil {
		return config.WriteError(c, err, "Gagal mengambil dispute.")
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Detail dispute berhasil diambil.",
		"data":    payload,
	})
}

func handleDisputePost(c fiber.Ctx, service *Service) error {
	body, err := config.ParseJSONBody(c)
	if err != nil {
		return config.WriteError(c, err, "Gagal memproses dispute.")
	}

	ctx, cancel, authRecord, err := resolveDisputeContext(c, service)
	if err != nil {
		return config.WriteError(c, err, "Gagal memproses dispute.")
	}
	defer cancel()

	action := resolveDisputeAction(c)
	switch action {
	case "create":
		return handleDisputeCreate(c, service, ctx, authRecord, body)
	case "evidence":
		return handleDisputeEvidence(c, service, ctx, authRecord, body)
	case "mediate":
		return handleDisputeMediate(c, service, ctx, authRecord, body)
	default:
		return config.WriteError(c, config.NewAppError("Aksi dispute tidak dikenal.", fiber.StatusNotFound), "Gagal memproses dispute.")
	}
}

func handleDisputeCreate(c fiber.Ctx, service *Service, ctx context.Context, authRecord *authSessionRecord, body map[string]any) error {
	assignmentID := strings.TrimSpace(config.NormalizeString(body["assignment_id"]))
	reason := strings.TrimSpace(config.NormalizeString(body["reason"]))
	if assignmentID == "" {
		return config.WriteError(c, config.NewAppError("Assignment ID wajib dikirim.", fiber.StatusBadRequest), "Gagal membuat dispute.")
	}

	existingDispute, err := service.FindDisputeByAssignmentID(ctx, assignmentID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil dispute assignment cloud."), "Gagal membuat dispute.")
	}
	if existingDispute != nil {
		return config.WriteError(c, config.NewAppError("Dispute untuk assignment ini sudah pernah dibuat.", fiber.StatusConflict), "Gagal membuat dispute.")
	}

	assignment, err := service.FindQuestAssignmentByID(ctx, assignmentID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil assignment cloud."), "Gagal membuat dispute.")
	}
	if assignment == nil {
		return config.WriteError(c, config.NewAppError("Assignment tidak ditemukan.", fiber.StatusNotFound), "Gagal membuat dispute.")
	}

	questRecord, err := service.FindQuestByID(ctx, assignment.QuestID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil quest cloud."), "Gagal membuat dispute.")
	}
	if questRecord == nil {
		return config.WriteError(c, config.NewAppError("Quest tidak ditemukan.", fiber.StatusNotFound), "Gagal membuat dispute.")
	}

	raisedBy := resolveDisputePartyFromAuth(authRecord.AuthUserID, questRecord, assignment)
	if raisedBy == "" {
		return config.WriteError(c, config.NewAppError("Akun login bukan giver atau runner untuk assignment ini.", fiber.StatusForbidden), "Gagal membuat dispute.")
	}

	escrow, err := service.FindQuestEscrowByQuestID(ctx, assignment.QuestID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil escrow quest cloud."), "Gagal membuat dispute.")
	}
	if escrow == nil {
		return config.WriteError(c, config.NewAppError("Escrow quest tidak ditemukan.", fiber.StatusNotFound), "Gagal membuat dispute.")
	}

	if questRecord.Status != "disputed" {
		if err := service.UpdateQuestStatus(ctx, questRecord.ID, "disputed"); err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui quest cloud."), "Gagal membuat dispute.")
		}
	}
	if assignment.AssignmentStatus != "disputed" {
		if err := service.UpdateQuestAssignmentStatus(ctx, assignment.ID, "disputed"); err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui assignment cloud."), "Gagal membuat dispute.")
		}
	}
	if escrow.EscrowState != "disputed" {
		if err := service.UpdateQuestEscrowState(ctx, assignment.QuestID, "disputed", "disputed_at"); err != nil {
			return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui escrow cloud."), "Gagal membuat dispute.")
		}
	}

	disputeID := uuid.NewString()
	if err := service.CreateDisputeCaseResolvedContext(
		ctx,
		disputeID,
		assignment,
		questRecord,
		raisedBy,
		authRecord.AuthUserID,
		reason,
		parseOrZeroFloat(escrow.TotalAmount),
	); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal membuat dispute case cloud."), "Gagal membuat dispute.")
	}

	if err := service.CreateDisputeEvent(ctx, disputeID, raisedBy, "evidence_submission", buildDisputeRaisedDescription(raisedBy, reason, questRecord.Title)); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal membuat event dispute cloud."), "Gagal membuat dispute.")
	}

	record, err := service.FindDisputeByID(ctx, disputeID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil detail dispute cloud."), "Gagal membuat dispute.")
	}

	payload, err := buildDisputePayload(ctx, service, *record)
	if err != nil {
		return config.WriteError(c, err, "Gagal membuat dispute.")
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"success": true,
		"message": "Dispute berhasil dibuat.",
		"data":    payload,
	})
}

func handleDisputeEvidence(c fiber.Ctx, service *Service, ctx context.Context, authRecord *authSessionRecord, body map[string]any) error {
	disputeID := strings.TrimSpace(c.Params("id"))
	if disputeID == "" {
		return config.WriteError(c, config.NewAppError("Dispute ID wajib dikirim.", fiber.StatusBadRequest), "Gagal mengirim evidence dispute.")
	}

	record, err := service.FindDisputeByID(ctx, disputeID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil dispute cloud."), "Gagal mengirim evidence dispute.")
	}
	if record == nil {
		return config.WriteError(c, config.NewAppError("Dispute tidak ditemukan.", fiber.StatusNotFound), "Gagal mengirim evidence dispute.")
	}
	if !isDisputeParticipant(record, authRecord.AuthUserID) {
		return config.WriteError(c, config.NewAppError("Akun login bukan peserta dispute ini.", fiber.StatusForbidden), "Gagal mengirim evidence dispute.")
	}
	if isDisputeResolved(record.Status) {
		return config.WriteError(c, config.NewAppError("Dispute yang sudah selesai tidak bisa menerima evidence baru.", fiber.StatusConflict), "Gagal mengirim evidence dispute.")
	}

	evidenceType := normalizeDisputeEvidenceType(config.NormalizeString(body["type"]))
	label := strings.TrimSpace(config.NormalizeString(body["label"]))
	if label == "" {
		return config.WriteError(c, config.NewAppError("Label evidence wajib diisi.", fiber.StatusBadRequest), "Gagal mengirim evidence dispute.")
	}

	uploaderParty := resolveParticipantParty(record, authRecord.AuthUserID)
	metadata := map[string]any{}
	if rawMetadata, ok := body["metadata"].(map[string]any); ok {
		metadata = rawMetadata
	}

	if _, err := service.CreateDisputeEvidence(ctx, createDisputeEvidencePayload{
		DisputeID:          disputeID,
		UploaderAuthUserID: authRecord.AuthUserID,
		UploaderParty:      uploaderParty,
		EvidenceType:       evidenceType,
		Label:              label,
		NoteText:           config.NormalizeString(body["note_text"]),
		FileName:           config.NormalizeString(body["file_name"]),
		FileURL:            config.NormalizeString(body["file_url"]),
		Metadata:           metadata,
	}); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal menyimpan evidence dispute cloud."), "Gagal mengirim evidence dispute.")
	}

	if err := service.CreateDisputeEvent(ctx, disputeID, uploaderParty, "evidence_submission", buildEvidenceEventDescription(uploaderParty, evidenceType, label)); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal membuat event evidence dispute cloud."), "Gagal mengirim evidence dispute.")
	}

	if record.Status == "evidence_submission" {
		_ = service.UpdateDisputeCaseStatus(ctx, disputeID, "under_review", record.MediatorNote)
	}

	updatedRecord, err := service.FindDisputeByID(ctx, disputeID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil detail dispute cloud."), "Gagal mengirim evidence dispute.")
	}
	payload, err := buildDisputePayload(ctx, service, *updatedRecord)
	if err != nil {
		return config.WriteError(c, err, "Gagal mengirim evidence dispute.")
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Evidence dispute berhasil disimpan.",
		"data":    payload,
	})
}

func handleDisputeMediate(c fiber.Ctx, service *Service, ctx context.Context, authRecord *authSessionRecord, body map[string]any) error {
	disputeID := strings.TrimSpace(c.Params("id"))
	if disputeID == "" {
		return config.WriteError(c, config.NewAppError("Dispute ID wajib dikirim.", fiber.StatusBadRequest), "Gagal memediasi dispute.")
	}

	if err := validateMediationKey(c, body); err != nil {
		return config.WriteError(c, err, "Gagal memediasi dispute.")
	}

	record, err := service.FindDisputeByID(ctx, disputeID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil dispute cloud."), "Gagal memediasi dispute.")
	}
	if record == nil {
		return config.WriteError(c, config.NewAppError("Dispute tidak ditemukan.", fiber.StatusNotFound), "Gagal memediasi dispute.")
	}

	nextStatus := normalizeDisputeResolution(config.NormalizeString(body["resolution"]))
	if nextStatus == "" {
		return config.WriteError(c, config.NewAppError("Resolution dispute tidak valid.", fiber.StatusBadRequest), "Gagal memediasi dispute.")
	}

	questRecord, err := service.FindQuestByID(ctx, record.QuestID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil quest cloud."), "Gagal memediasi dispute.")
	}
	if questRecord == nil {
		return config.WriteError(c, config.NewAppError("Quest dispute tidak ditemukan.", fiber.StatusNotFound), "Gagal memediasi dispute.")
	}

	assignment, err := service.FindQuestAssignmentByID(ctx, record.AssignmentID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil assignment cloud."), "Gagal memediasi dispute.")
	}
	if assignment == nil {
		return config.WriteError(c, config.NewAppError("Assignment dispute tidak ditemukan.", fiber.StatusNotFound), "Gagal memediasi dispute.")
	}

	escrowAmount := parseOrZeroFloat(record.EscrowAmount)
	giverSettlementAmount, runnerSettlementAmount, mediationFeeAmount := resolveMediationAmounts(nextStatus, escrowAmount)
	mediatorNote := strings.TrimSpace(config.NormalizeString(body["mediator_note"]))

	if err := service.UpdateDisputeCaseForMediation(ctx, mediateDisputePayload{
		DisputeID:              disputeID,
		NextStatus:             nextStatus,
		MediatorNote:           mediatorNote,
		GiverSettlementAmount:  giverSettlementAmount,
		RunnerSettlementAmount: runnerSettlementAmount,
		MediationFeeAmount:     mediationFeeAmount,
	}); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui dispute cloud."), "Gagal memediasi dispute.")
	}

	nextQuestStatus, nextAssignmentStatus, nextEscrowStatus, escrowTimestampField := resolveMediationLifecycle(nextStatus)
	if err := service.UpdateQuestStatus(ctx, questRecord.ID, nextQuestStatus); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui quest cloud."), "Gagal memediasi dispute.")
	}
	if err := service.UpdateQuestAssignmentStatus(ctx, assignment.ID, nextAssignmentStatus); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui assignment cloud."), "Gagal memediasi dispute.")
	}
	if err := service.UpdateQuestEscrowState(ctx, questRecord.ID, nextEscrowStatus, escrowTimestampField); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal memperbarui escrow cloud."), "Gagal memediasi dispute.")
	}

	eventDescription := buildMediationEventDescription(nextStatus, mediatorNote)
	if err := service.CreateDisputeEvent(ctx, disputeID, "mediator", nextStatus, eventDescription); err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal membuat event mediasi cloud."), "Gagal memediasi dispute.")
	}

	updatedRecord, err := service.FindDisputeByID(ctx, disputeID)
	if err != nil {
		return config.WriteError(c, config.MapSupabaseError(err, "Gagal mengambil detail dispute cloud."), "Gagal memediasi dispute.")
	}
	payload, err := buildDisputePayload(ctx, service, *updatedRecord)
	if err != nil {
		return config.WriteError(c, err, "Gagal memediasi dispute.")
	}

	return c.JSON(fiber.Map{
		"success": true,
		"message": "Mediasi dispute berhasil diproses.",
		"data": fiber.Map{
			"mediated_by_auth_user_id": authRecord.AuthUserID,
			"dispute":                  payload,
		},
	})
}

func resolveDisputeContext(c fiber.Ctx, service *Service) (context.Context, context.CancelFunc, *authSessionRecord, error) {
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

func buildDisputePayload(ctx context.Context, service *Service, record disputeCaseRecord) (fiber.Map, error) {
	questRecord, err := service.FindQuestByID(ctx, record.QuestID)
	if err != nil {
		return nil, config.MapSupabaseError(err, "Gagal mengambil quest dispute cloud.")
	}
	if questRecord == nil {
		return nil, config.NewAppError("Quest dispute tidak ditemukan.", fiber.StatusNotFound)
	}

	evidences, err := service.ListDisputeEvidences(ctx, record.ID)
	if err != nil {
		return nil, config.MapSupabaseError(err, "Gagal mengambil evidence dispute cloud.")
	}
	events, err := service.ListDisputeEvents(ctx, record.ID)
	if err != nil {
		return nil, config.MapSupabaseError(err, "Gagal mengambil event dispute cloud.")
	}

	giverEvidence := make([]fiber.Map, 0)
	runnerEvidence := make([]fiber.Map, 0)
	for _, evidence := range evidences {
		payload := toDisputeEvidencePayload(evidence)
		if normalizeDisputePartyPayload(evidence.UploaderParty) == "GIVER" {
			giverEvidence = append(giverEvidence, payload)
		} else {
			runnerEvidence = append(runnerEvidence, payload)
		}
	}

	timeline := make([]fiber.Map, 0, len(events))
	for _, event := range events {
		timeline = append(timeline, fiber.Map{
			"status":      normalizeDisputeStatusPayload(event.Status),
			"time":        optionalTimeValue(event.EventTime),
			"description": event.Description,
		})
	}

	return fiber.Map{
		"id":                   record.ID,
		"questId":              record.QuestID,
		"questTitle":           questRecord.Title,
		"assignmentId":         record.AssignmentID,
		"amount":               buildCurrencyDisplay(record.EscrowAmount),
		"raisedBy":             normalizeDisputePartyPayload(record.RaisedBy),
		"raisedAt":             optionalTimeValue(record.CreatedAt),
		"status":               normalizeDisputeStatusPayload(record.Status),
		"autoReleaseHoursLeft": computeEvidenceDeadlineHours(record.EvidenceDeadlineAt),
		"evidenceDeadline":     optionalTimeValue(record.EvidenceDeadlineAt),
		"mediatorNote":         record.MediatorNote,
		"resolvedAt":           optionalTimeValue(record.ResolvedAt),
		"reason":               record.Reason,
		"giverEvidence":        giverEvidence,
		"runnerEvidence":       runnerEvidence,
		"timeline":             timeline,
		"settlement": fiber.Map{
			"giver_amount":  buildCurrencyDisplay(record.GiverSettlementAmount),
			"runner_amount": buildCurrencyDisplay(record.RunnerSettlementAmount),
			"mediation_fee": buildCurrencyDisplay(record.MediationFeeAmount),
		},
	}, nil
}

func mergeDisputeCases(left []disputeCaseRecord, right []disputeCaseRecord) []disputeCaseRecord {
	seen := map[string]bool{}
	merged := make([]disputeCaseRecord, 0, len(left)+len(right))
	for _, item := range append(left, right...) {
		if seen[item.ID] {
			continue
		}
		seen[item.ID] = true
		merged = append(merged, item)
	}

	slices.SortFunc(merged, func(a disputeCaseRecord, b disputeCaseRecord) int {
		aTime := resolveRecordTime(a.CreatedAt)
		bTime := resolveRecordTime(b.CreatedAt)
		if aTime.Equal(bTime) {
			return strings.Compare(a.ID, b.ID)
		}
		if aTime.After(bTime) {
			return -1
		}
		return 1
	})
	return merged
}

func resolveRecordTime(value *time.Time) time.Time {
	if value == nil || value.IsZero() {
		return time.Time{}
	}
	return value.UTC()
}

func resolveDisputeAction(c fiber.Ctx) string {
	path := strings.TrimSuffix(strings.ToLower(c.Path()), "/")
	if strings.HasSuffix(path, "/evidence") {
		return "evidence"
	}
	if strings.HasSuffix(path, "/mediate") {
		return "mediate"
	}
	return "create"
}

func isDisputeParticipant(record *disputeCaseRecord, authUserID string) bool {
	if record == nil {
		return false
	}
	return record.GiverAuthUserID == authUserID || record.RunnerAuthUserID == authUserID
}

func resolveDisputePartyFromAuth(authUserID string, quest *questRecord, assignment *questAssignmentRecord) string {
	if quest != nil && quest.GiverAuthUserID == authUserID {
		return "giver"
	}
	if assignment != nil && assignment.RunnerAuthUserID == authUserID {
		return "runner"
	}
	return ""
}

func resolveParticipantParty(record *disputeCaseRecord, authUserID string) string {
	if record.GiverAuthUserID == authUserID {
		return "giver"
	}
	return "runner"
}

func normalizeDisputeEvidenceType(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "video":
		return "video"
	case "note":
		return "note"
	case "file":
		return "file"
	default:
		return "photo"
	}
}

func normalizeDisputeResolution(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "resolved_runner":
		return "resolved_runner"
	case "resolved_giver":
		return "resolved_giver"
	case "resolved_partial":
		return "resolved_partial"
	case "dismissed":
		return "dismissed"
	default:
		return ""
	}
}

func normalizeDisputeStatusPayload(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "under_review":
		return "UNDER_REVIEW"
	case "resolved_runner":
		return "RESOLVED_RUNNER"
	case "resolved_giver":
		return "RESOLVED_GIVER"
	case "resolved_partial":
		return "RESOLVED_PARTIAL"
	case "dismissed":
		return "DISMISSED"
	default:
		return "EVIDENCE_SUBMISSION"
	}
}

func normalizeDisputePartyPayload(value string) string {
	switch strings.ToLower(strings.TrimSpace(value)) {
	case "giver":
		return "GIVER"
	case "mediator":
		return "MEDIATOR"
	default:
		return "RUNNER"
	}
}

func toDisputeEvidencePayload(record disputeEvidenceRecord) fiber.Map {
	return fiber.Map{
		"id":         record.ID,
		"uploader":   normalizeDisputePartyPayload(record.UploaderParty),
		"type":       strings.ToUpper(strings.TrimSpace(record.EvidenceType)),
		"label":      record.Label,
		"uploadedAt": optionalTimeValue(record.UploadedAt),
		"url":        record.FileURL,
		"file_name":  record.FileName,
		"note_text":  record.NoteText,
		"metadata":   record.Metadata,
	}
}

func buildCurrencyDisplay(value string) string {
	amount := parseOrZeroFloat(value)
	return "Rp " + formatNumberID(amount)
}

func formatNumberID(value float64) string {
	text := strconv.FormatFloat(value, 'f', 0, 64)
	if strings.HasSuffix(text, ".00") {
		text = strings.TrimSuffix(text, ".00")
	}
	number := strings.TrimSpace(text)
	if number == "" {
		return "0"
	}

	parts := strings.Split(number, ".")
	whole := parts[0]
	sign := ""
	if strings.HasPrefix(whole, "-") {
		sign = "-"
		whole = strings.TrimPrefix(whole, "-")
	}
	if whole == "" {
		whole = "0"
	}

	chunks := make([]string, 0)
	for len(whole) > 3 {
		chunks = append([]string{whole[len(whole)-3:]}, chunks...)
		whole = whole[:len(whole)-3]
	}
	chunks = append([]string{whole}, chunks...)

	return sign + strings.Join(chunks, ".")
}

func computeEvidenceDeadlineHours(value *time.Time) int {
	if value == nil || value.IsZero() {
		return 0
	}
	remaining := time.Until(value.UTC())
	if remaining <= 0 {
		return 0
	}
	return int(remaining.Hours())
}

func optionalTimeValue(value *time.Time) any {
	if value == nil || value.IsZero() {
		return nil
	}
	return value.UTC()
}

func buildDisputeRaisedDescription(raisedBy string, reason string, questTitle string) string {
	actor := "Runner"
	if raisedBy == "giver" {
		actor = "Giver"
	}
	if strings.TrimSpace(reason) == "" {
		return actor + " membuka dispute untuk quest " + questTitle + "."
	}
	return actor + " membuka dispute: " + reason
}

func buildEvidenceEventDescription(uploaderParty string, evidenceType string, label string) string {
	actor := "Runner"
	if uploaderParty == "giver" {
		actor = "Giver"
	}
	return actor + " mengunggah bukti " + strings.ToUpper(evidenceType) + ": " + label
}

func isDisputeResolved(status string) bool {
	switch strings.ToLower(strings.TrimSpace(status)) {
	case "resolved_runner", "resolved_giver", "resolved_partial", "dismissed":
		return true
	default:
		return false
	}
}

func validateMediationKey(c fiber.Ctx, body map[string]any) error {
	expectedKey := strings.TrimSpace(os.Getenv("QQM_DISPUTE_MEDIATION_KEY"))
	if expectedKey == "" {
		expectedKey = "dev-mediation-key"
	}
	providedKey := strings.TrimSpace(c.Get("X-Mediation-Key"))
	if providedKey == "" {
		providedKey = strings.TrimSpace(config.NormalizeString(body["mediation_key"]))
	}
	if providedKey != expectedKey {
		return config.NewAppError("Kunci mediasi dispute tidak valid.", fiber.StatusForbidden)
	}
	return nil
}

func resolveMediationAmounts(nextStatus string, escrowAmount float64) (float64, float64, float64) {
	switch nextStatus {
	case "resolved_giver":
		return escrowAmount, 0, 0
	case "resolved_partial":
		half := escrowAmount / 2
		return half, half, 0
	default:
		return 0, escrowAmount, 0
	}
}

func resolveMediationLifecycle(nextStatus string) (string, string, string, string) {
	switch nextStatus {
	case "resolved_giver":
		return "cancelled", "cancelled", "refund", "refunded_at"
	case "resolved_partial":
		return "completed", "finished", "released", "released_at"
	case "dismissed":
		return "completed", "finished", "released", "released_at"
	default:
		return "completed", "finished", "released", "released_at"
	}
}

func buildMediationEventDescription(nextStatus string, mediatorNote string) string {
	base := "Mediator menyelesaikan dispute dengan hasil " + strings.ToUpper(nextStatus) + "."
	if strings.TrimSpace(mediatorNote) == "" {
		return base
	}
	return base + " Catatan: " + mediatorNote
}

func parseOrZeroFloat(value string) float64 {
	trimmed := strings.TrimSpace(strings.ReplaceAll(value, ",", ""))
	if trimmed == "" {
		return 0
	}
	parsed, err := strconv.ParseFloat(trimmed, 64)
	if err != nil {
		return 0
	}
	return parsed
}
