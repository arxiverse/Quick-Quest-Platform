package dispute

import (
	"context"
	"encoding/json"
	"strings"
	"time"

	"Stream-StrictMode/config"

	"github.com/google/uuid"
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

type questRecord struct {
	ID              string
	GiverAuthUserID string
	Title           string
	Status          string
}

type questAssignmentRecord struct {
	ID               string
	QuestID          string
	RunnerAuthUserID string
	AssignmentStatus string
	JoinedAt         *time.Time
	StartedAt        *time.Time
	FinishedAt       *time.Time
}

type questEscrowRecord struct {
	QuestID      string
	EscrowState  string
	TotalAmount  string
	RewardAmount string
}

type disputeCaseRecord struct {
	ID                     string
	QuestID                string
	AssignmentID           string
	GiverAuthUserID        string
	RunnerAuthUserID       string
	RaisedBy               string
	RaisedByAuthUserID     string
	Reason                 string
	Status                 string
	EscrowAmount           string
	GiverSettlementAmount  string
	RunnerSettlementAmount string
	MediationFeeAmount     string
	EvidenceDeadlineAt     *time.Time
	MediatorNote           string
	ResolvedAt             *time.Time
	CreatedAt              *time.Time
	UpdatedAt              *time.Time
}

type disputeEvidenceRecord struct {
	ID                 string
	DisputeID          string
	UploaderAuthUserID string
	UploaderParty      string
	EvidenceType       string
	Label              string
	NoteText           string
	FileName           string
	FileURL            string
	Metadata           map[string]any
	UploadedAt         *time.Time
	CreatedAt          *time.Time
	UpdatedAt          *time.Time
}

type disputeEventRecord struct {
	ID          string
	DisputeID   string
	ActorParty  string
	Status      string
	Description string
	EventTime   *time.Time
	CreatedAt   *time.Time
	UpdatedAt   *time.Time
}

type createDisputePayload struct {
	AssignmentID string
	RaisedBy     string
	RaisedByAuth string
	Reason       string
	EscrowAmount float64
}

type createDisputeEvidencePayload struct {
	DisputeID          string
	UploaderAuthUserID string
	UploaderParty      string
	EvidenceType       string
	Label              string
	NoteText           string
	FileName           string
	FileURL            string
	Metadata           map[string]any
}

type mediateDisputePayload struct {
	DisputeID              string
	NextStatus             string
	MediatorNote           string
	GiverSettlementAmount  float64
	RunnerSettlementAmount float64
	MediationFeeAmount     float64
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

func (s *Service) FindQuestByID(ctx context.Context, questID string) (*questRecord, error) {
	row, err := s.client.SelectFirst(ctx, "quests", "id,giver_auth_user_id,title,status", map[string]string{
		"id": questID,
	})
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, nil
	}

	return &questRecord{
		ID:              config.NormalizeString(row["id"]),
		GiverAuthUserID: config.NormalizeString(row["giver_auth_user_id"]),
		Title:           config.NormalizeString(row["title"]),
		Status:          config.NormalizeString(row["status"]),
	}, nil
}

func (s *Service) FindQuestAssignmentByID(ctx context.Context, assignmentID string) (*questAssignmentRecord, error) {
	row, err := s.client.SelectFirst(
		ctx,
		"quest_assignments",
		"id,quest_id,runner_auth_user_id,assignment_status,joined_at,started_at,finished_at",
		map[string]string{"id": assignmentID},
	)
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, nil
	}

	return &questAssignmentRecord{
		ID:               config.NormalizeString(row["id"]),
		QuestID:          config.NormalizeString(row["quest_id"]),
		RunnerAuthUserID: config.NormalizeString(row["runner_auth_user_id"]),
		AssignmentStatus: config.NormalizeString(row["assignment_status"]),
		JoinedAt:         parseOptionalTime(row["joined_at"]),
		StartedAt:        parseOptionalTime(row["started_at"]),
		FinishedAt:       parseOptionalTime(row["finished_at"]),
	}, nil
}

func (s *Service) FindQuestEscrowByQuestID(ctx context.Context, questID string) (*questEscrowRecord, error) {
	row, err := s.client.SelectFirst(ctx, "quest_escrows", "quest_id,escrow_state,total_amount,reward_amount", map[string]string{
		"quest_id": questID,
	})
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, nil
	}

	return &questEscrowRecord{
		QuestID:      config.NormalizeString(row["quest_id"]),
		EscrowState:  config.NormalizeString(row["escrow_state"]),
		TotalAmount:  config.NormalizeString(row["total_amount"]),
		RewardAmount: config.NormalizeString(row["reward_amount"]),
	}, nil
}

func (s *Service) FindDisputeByID(ctx context.Context, disputeID string) (*disputeCaseRecord, error) {
	row, err := s.client.SelectFirst(
		ctx,
		"dispute_cases",
		"id,quest_id,assignment_id,giver_auth_user_id,runner_auth_user_id,raised_by,raised_by_auth_user_id,reason,status,escrow_amount,giver_settlement_amount,runner_settlement_amount,mediation_fee_amount,evidence_deadline_at,mediator_note,resolved_at,created_at,updated_at",
		map[string]string{"id": disputeID},
	)
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, nil
	}

	record := mapDisputeCaseRecord(row)
	return &record, nil
}

func (s *Service) FindDisputeByAssignmentID(ctx context.Context, assignmentID string) (*disputeCaseRecord, error) {
	row, err := s.client.SelectFirst(
		ctx,
		"dispute_cases",
		"id,quest_id,assignment_id,giver_auth_user_id,runner_auth_user_id,raised_by,raised_by_auth_user_id,reason,status,escrow_amount,giver_settlement_amount,runner_settlement_amount,mediation_fee_amount,evidence_deadline_at,mediator_note,resolved_at,created_at,updated_at",
		map[string]string{"assignment_id": assignmentID},
	)
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, nil
	}

	record := mapDisputeCaseRecord(row)
	return &record, nil
}

func (s *Service) ListDisputesByGiver(ctx context.Context, authUserID string) ([]disputeCaseRecord, error) {
	rows, err := s.client.SelectMany(
		ctx,
		"dispute_cases",
		"id,quest_id,assignment_id,giver_auth_user_id,runner_auth_user_id,raised_by,raised_by_auth_user_id,reason,status,escrow_amount,giver_settlement_amount,runner_settlement_amount,mediation_fee_amount,evidence_deadline_at,mediator_note,resolved_at,created_at,updated_at",
		map[string]string{"giver_auth_user_id": authUserID},
		&config.SelectOptions{OrderBy: "created_at", Desc: true, Limit: 100},
	)
	if err != nil {
		return nil, err
	}

	items := make([]disputeCaseRecord, 0, len(rows))
	for _, row := range rows {
		items = append(items, mapDisputeCaseRecord(row))
	}
	return items, nil
}

func (s *Service) ListDisputesByRunner(ctx context.Context, authUserID string) ([]disputeCaseRecord, error) {
	rows, err := s.client.SelectMany(
		ctx,
		"dispute_cases",
		"id,quest_id,assignment_id,giver_auth_user_id,runner_auth_user_id,raised_by,raised_by_auth_user_id,reason,status,escrow_amount,giver_settlement_amount,runner_settlement_amount,mediation_fee_amount,evidence_deadline_at,mediator_note,resolved_at,created_at,updated_at",
		map[string]string{"runner_auth_user_id": authUserID},
		&config.SelectOptions{OrderBy: "created_at", Desc: true, Limit: 100},
	)
	if err != nil {
		return nil, err
	}

	items := make([]disputeCaseRecord, 0, len(rows))
	for _, row := range rows {
		items = append(items, mapDisputeCaseRecord(row))
	}
	return items, nil
}

func (s *Service) ListDisputeEvidences(ctx context.Context, disputeID string) ([]disputeEvidenceRecord, error) {
	rows, err := s.client.SelectMany(
		ctx,
		"dispute_evidences",
		"id,dispute_id,uploader_auth_user_id,uploader_party,evidence_type,label,note_text,file_name,file_url,metadata,uploaded_at,created_at,updated_at",
		map[string]string{"dispute_id": disputeID},
		&config.SelectOptions{OrderBy: "uploaded_at", Desc: false, Limit: 200},
	)
	if err != nil {
		return nil, err
	}

	items := make([]disputeEvidenceRecord, 0, len(rows))
	for _, row := range rows {
		items = append(items, mapDisputeEvidenceRecord(row))
	}
	return items, nil
}

func (s *Service) ListDisputeEvents(ctx context.Context, disputeID string) ([]disputeEventRecord, error) {
	rows, err := s.client.SelectMany(
		ctx,
		"dispute_events",
		"id,dispute_id,actor_party,status,description,event_time,created_at,updated_at",
		map[string]string{"dispute_id": disputeID},
		&config.SelectOptions{OrderBy: "event_time", Desc: false, Limit: 200},
	)
	if err != nil {
		return nil, err
	}

	items := make([]disputeEventRecord, 0, len(rows))
	for _, row := range rows {
		items = append(items, mapDisputeEventRecord(row))
	}
	return items, nil
}

func (s *Service) CreateDisputeCase(ctx context.Context, payload createDisputePayload) (string, error) {
	now := time.Now().UTC()
	disputeID := uuid.NewString()
	return disputeID, s.client.Insert(ctx, "dispute_cases", map[string]any{
		"id":                     disputeID,
		"assignment_id":          payload.AssignmentID,
		"quest_id":               "",
		"giver_auth_user_id":     "",
		"runner_auth_user_id":    "",
		"raised_by":              payload.RaisedBy,
		"raised_by_auth_user_id": payload.RaisedByAuth,
		"reason":                 nullIfEmpty(payload.Reason),
		"status":                 "evidence_submission",
		"escrow_amount":          payload.EscrowAmount,
		"evidence_deadline_at":   now.Add(24 * time.Hour),
		"created_at":             now,
		"updated_at":             now,
	})
}

func (s *Service) CreateDisputeCaseResolvedContext(ctx context.Context, disputeID string, assignment *questAssignmentRecord, quest *questRecord, raisedBy string, raisedByAuth string, reason string, escrowAmount float64) error {
	now := time.Now().UTC()
	return s.client.Insert(ctx, "dispute_cases", map[string]any{
		"id":                     disputeID,
		"assignment_id":          assignment.ID,
		"quest_id":               quest.ID,
		"giver_auth_user_id":     quest.GiverAuthUserID,
		"runner_auth_user_id":    assignment.RunnerAuthUserID,
		"raised_by":              raisedBy,
		"raised_by_auth_user_id": raisedByAuth,
		"reason":                 nullIfEmpty(reason),
		"status":                 "evidence_submission",
		"escrow_amount":          escrowAmount,
		"evidence_deadline_at":   now.Add(24 * time.Hour),
		"created_at":             now,
		"updated_at":             now,
	})
}

func (s *Service) CreateDisputeEvidence(ctx context.Context, payload createDisputeEvidencePayload) (string, error) {
	now := time.Now().UTC()
	evidenceID := uuid.NewString()
	return evidenceID, s.client.Insert(ctx, "dispute_evidences", map[string]any{
		"id":                    evidenceID,
		"dispute_id":            payload.DisputeID,
		"uploader_auth_user_id": payload.UploaderAuthUserID,
		"uploader_party":        payload.UploaderParty,
		"evidence_type":         payload.EvidenceType,
		"label":                 payload.Label,
		"note_text":             nullIfEmpty(payload.NoteText),
		"file_name":             nullIfEmpty(payload.FileName),
		"file_url":              nullIfEmpty(payload.FileURL),
		"metadata":              payload.Metadata,
		"uploaded_at":           now,
		"created_at":            now,
		"updated_at":            now,
	})
}

func (s *Service) CreateDisputeEvent(ctx context.Context, disputeID string, actorParty string, status string, description string) error {
	now := time.Now().UTC()
	return s.client.Insert(ctx, "dispute_events", map[string]any{
		"id":          uuid.NewString(),
		"dispute_id":  disputeID,
		"actor_party": actorParty,
		"status":      status,
		"description": description,
		"event_time":  now,
		"created_at":  now,
		"updated_at":  now,
	})
}

func (s *Service) UpdateDisputeCaseForMediation(ctx context.Context, payload mediateDisputePayload) error {
	now := time.Now().UTC()
	return s.client.Update(ctx, "dispute_cases", map[string]string{
		"id": payload.DisputeID,
	}, map[string]any{
		"status":                   payload.NextStatus,
		"mediator_note":            nullIfEmpty(payload.MediatorNote),
		"giver_settlement_amount":  payload.GiverSettlementAmount,
		"runner_settlement_amount": payload.RunnerSettlementAmount,
		"mediation_fee_amount":     payload.MediationFeeAmount,
		"resolved_at":              now,
		"updated_at":               now,
	})
}

func (s *Service) UpdateDisputeCaseStatus(ctx context.Context, disputeID string, nextStatus string, mediatorNote string) error {
	return s.client.Update(ctx, "dispute_cases", map[string]string{
		"id": disputeID,
	}, map[string]any{
		"status":        nextStatus,
		"mediator_note": nullIfEmpty(mediatorNote),
		"updated_at":    time.Now().UTC(),
	})
}

func (s *Service) UpdateQuestStatus(ctx context.Context, questID string, nextStatus string) error {
	return s.client.Update(ctx, "quests", map[string]string{
		"id": questID,
	}, map[string]any{
		"status":     nextStatus,
		"updated_at": time.Now().UTC(),
	})
}

func (s *Service) UpdateQuestAssignmentStatus(ctx context.Context, assignmentID string, nextStatus string) error {
	return s.client.Update(ctx, "quest_assignments", map[string]string{
		"id": assignmentID,
	}, map[string]any{
		"assignment_status": nextStatus,
		"updated_at":        time.Now().UTC(),
	})
}

func (s *Service) UpdateQuestEscrowState(ctx context.Context, questID string, nextState string, timestampField string) error {
	payload := map[string]any{
		"escrow_state": nextState,
		"updated_at":   time.Now().UTC(),
	}
	if timestampField != "" {
		payload[timestampField] = time.Now().UTC()
	}

	return s.client.Update(ctx, "quest_escrows", map[string]string{
		"quest_id": questID,
	}, payload)
}

func mapDisputeCaseRecord(row map[string]any) disputeCaseRecord {
	return disputeCaseRecord{
		ID:                     config.NormalizeString(row["id"]),
		QuestID:                config.NormalizeString(row["quest_id"]),
		AssignmentID:           config.NormalizeString(row["assignment_id"]),
		GiverAuthUserID:        config.NormalizeString(row["giver_auth_user_id"]),
		RunnerAuthUserID:       config.NormalizeString(row["runner_auth_user_id"]),
		RaisedBy:               config.NormalizeString(row["raised_by"]),
		RaisedByAuthUserID:     config.NormalizeString(row["raised_by_auth_user_id"]),
		Reason:                 config.NormalizeString(row["reason"]),
		Status:                 config.NormalizeString(row["status"]),
		EscrowAmount:           config.NormalizeString(row["escrow_amount"]),
		GiverSettlementAmount:  config.NormalizeString(row["giver_settlement_amount"]),
		RunnerSettlementAmount: config.NormalizeString(row["runner_settlement_amount"]),
		MediationFeeAmount:     config.NormalizeString(row["mediation_fee_amount"]),
		EvidenceDeadlineAt:     parseOptionalTime(row["evidence_deadline_at"]),
		MediatorNote:           config.NormalizeString(row["mediator_note"]),
		ResolvedAt:             parseOptionalTime(row["resolved_at"]),
		CreatedAt:              parseOptionalTime(row["created_at"]),
		UpdatedAt:              parseOptionalTime(row["updated_at"]),
	}
}

func mapDisputeEvidenceRecord(row map[string]any) disputeEvidenceRecord {
	return disputeEvidenceRecord{
		ID:                 config.NormalizeString(row["id"]),
		DisputeID:          config.NormalizeString(row["dispute_id"]),
		UploaderAuthUserID: config.NormalizeString(row["uploader_auth_user_id"]),
		UploaderParty:      config.NormalizeString(row["uploader_party"]),
		EvidenceType:       config.NormalizeString(row["evidence_type"]),
		Label:              config.NormalizeString(row["label"]),
		NoteText:           config.NormalizeString(row["note_text"]),
		FileName:           config.NormalizeString(row["file_name"]),
		FileURL:            config.NormalizeString(row["file_url"]),
		Metadata:           parseObject(row["metadata"]),
		UploadedAt:         parseOptionalTime(row["uploaded_at"]),
		CreatedAt:          parseOptionalTime(row["created_at"]),
		UpdatedAt:          parseOptionalTime(row["updated_at"]),
	}
}

func mapDisputeEventRecord(row map[string]any) disputeEventRecord {
	return disputeEventRecord{
		ID:          config.NormalizeString(row["id"]),
		DisputeID:   config.NormalizeString(row["dispute_id"]),
		ActorParty:  config.NormalizeString(row["actor_party"]),
		Status:      config.NormalizeString(row["status"]),
		Description: config.NormalizeString(row["description"]),
		EventTime:   parseOptionalTime(row["event_time"]),
		CreatedAt:   parseOptionalTime(row["created_at"]),
		UpdatedAt:   parseOptionalTime(row["updated_at"]),
	}
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

func parseObject(value any) map[string]any {
	switch typed := value.(type) {
	case nil:
		return map[string]any{}
	case map[string]any:
		return typed
	case string:
		trimmed := strings.TrimSpace(typed)
		if trimmed == "" {
			return map[string]any{}
		}
		out := map[string]any{}
		if err := json.Unmarshal([]byte(trimmed), &out); err == nil {
			return out
		}
	}
	return map[string]any{}
}

func nullIfEmpty(value string) any {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}
	return trimmed
}
