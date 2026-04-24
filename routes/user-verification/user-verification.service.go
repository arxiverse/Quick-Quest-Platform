package userverification

import (
	"context"
	"encoding/json"
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
	Province    string
	City        string
	District    string
	SubDistrict string
	TagsSkill   string
	Birthdate   *time.Time
	PostalCode  string
}

type verificationProfileRecord struct {
	ID                    string
	AuthUserID            string
	FullLegalName         string
	NIK                   string
	BirthPlace            string
	BirthDate             *time.Time
	Gender                string
	Occupation            string
	Province              string
	City                  string
	District              string
	SubDistrict           string
	PostalCode            string
	FullAddress           string
	DomicileSameAsKTP     bool
	VerificationStatus    string
	VerificationStage     string
	RiskScore             string
	RiskFlags             []string
	SubmittedAt           *time.Time
	ReviewedAt            *time.Time
	ApprovedAt            *time.Time
	RejectedAt            *time.Time
	RejectionReasonCode   string
	RejectionReasonDetail string
	NeedsResubmission     bool
	CreatedAt             *time.Time
	UpdatedAt             *time.Time
}

type verificationDocumentRecord struct {
	ID               string
	VerificationID   string
	DocumentType     string
	FileKey          string
	FileURL          string
	MimeType         string
	FileSize         string
	DocumentNumber   string
	OCRName          string
	OCRNIK           string
	OCRBirthDate     *time.Time
	OCRAddress       string
	OCRConfidence    string
	IsPrimary        bool
	ValidationStatus string
	UploadedAt       *time.Time
	ValidatedAt      *time.Time
	CreatedAt        *time.Time
	UpdatedAt        *time.Time
}

type verificationReviewRecord struct {
	ID                   string
	VerificationID       string
	ReviewType           string
	ReviewResult         string
	ReviewerID           string
	ReviewerRole         string
	ReviewNotes          string
	DecisionReasonCode   string
	DecisionReasonDetail string
	CreatedAt            *time.Time
}

type verificationEventRecord struct {
	ID             string
	VerificationID string
	PreviousStatus string
	NewStatus      string
	ActorID        string
	ActorType      string
	Notes          string
	CreatedAt      *time.Time
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

	row, err := s.client.SelectFirst(ctx, "user_identification", "fullname,email,phone,full_address,user_role,province,city,district,sub_district,tags_skill,birthdate,postal_code", map[string]string{
		"auth_user_id": authRecord.AuthUserID,
	})
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, nil
	}

	return &userProfileRecord{
		Fullname:    config.NormalizeString(row["fullname"]),
		Email:       config.NormalizeString(row["email"]),
		Phone:       config.NormalizeString(row["phone"]),
		FullAddress: config.NormalizeString(row["full_address"]),
		UserRole:    config.NormalizeString(row["user_role"]),
		Province:    config.NormalizeString(row["province"]),
		City:        config.NormalizeString(row["city"]),
		District:    config.NormalizeString(row["district"]),
		SubDistrict: config.NormalizeString(row["sub_district"]),
		TagsSkill:   config.NormalizeString(row["tags_skill"]),
		Birthdate:   parseOptionalTime(row["birthdate"]),
		PostalCode:  config.NormalizeString(row["postal_code"]),
	}, nil
}

func (s *Service) EnsureVerificationProfile(ctx context.Context, authRecord *authSessionRecord, userRecord *userProfileRecord) (*verificationProfileRecord, error) {
	if authRecord == nil {
		return nil, nil
	}

	record, err := s.GetVerificationProfile(ctx, authRecord.AuthUserID)
	if err != nil {
		return nil, err
	}
	if record != nil {
		return record, nil
	}

	now := time.Now().UTC()
	payload := map[string]any{
		"auth_user_id":         authRecord.AuthUserID,
		"full_legal_name":      strings.TrimSpace(userRecord.Fullname),
		"birth_date":           optionalTimeValue(userRecord.Birthdate),
		"province":             strings.TrimSpace(userRecord.Province),
		"city":                 strings.TrimSpace(userRecord.City),
		"district":             strings.TrimSpace(userRecord.District),
		"sub_district":         strings.TrimSpace(userRecord.SubDistrict),
		"postal_code":          nullIfEmpty(userRecord.PostalCode),
		"full_address":         strings.TrimSpace(userRecord.FullAddress),
		"domicile_same_as_ktp": true,
		"verification_status":  "not_started",
		"verification_stage":   "identity_form",
		"needs_resubmission":   false,
		"risk_score":           0,
		"risk_flags":           []string{},
		"created_at":           now,
		"updated_at":           now,
	}

	if err := s.client.Insert(ctx, "user_verification_profiles", payload); err != nil {
		return nil, err
	}

	return s.GetVerificationProfile(ctx, authRecord.AuthUserID)
}

func (s *Service) GetVerificationProfile(ctx context.Context, authUserID string) (*verificationProfileRecord, error) {
	row, err := s.client.SelectFirst(ctx, "user_verification_profiles", "id,auth_user_id,full_legal_name,nik,birth_place,birth_date,gender,occupation,province,city,district,sub_district,postal_code,full_address,domicile_same_as_ktp,verification_status,verification_stage,risk_score,risk_flags,submitted_at,reviewed_at,approved_at,rejected_at,rejection_reason_code,rejection_reason_detail,needs_resubmission,created_at,updated_at", map[string]string{
		"auth_user_id": authUserID,
	})
	if err != nil {
		return nil, err
	}
	if row == nil {
		return nil, nil
	}

	return mapVerificationProfile(row), nil
}

func (s *Service) UpdateVerificationDraft(ctx context.Context, record *verificationProfileRecord, payload draftPayload) error {
	if record == nil {
		return nil
	}

	stage := resolveDraftVerificationStage(payload, nil)
	status := record.VerificationStatus
	switch status {
	case "", "not_started":
		status = "draft"
	case "rejected":
		status = "resubmission_required"
	}

	updates := map[string]any{
		"full_legal_name":      payload.FullLegalName,
		"nik":                  payload.NIK,
		"birth_place":          payload.BirthPlace,
		"birth_date":           optionalTimeValue(payload.BirthDate),
		"gender":               nullIfEmpty(payload.Gender),
		"occupation":           nullIfEmpty(payload.Occupation),
		"province":             payload.Province,
		"city":                 payload.City,
		"district":             payload.District,
		"sub_district":         payload.SubDistrict,
		"postal_code":          nullIfEmpty(payload.PostalCode),
		"full_address":         payload.FullAddress,
		"domicile_same_as_ktp": payload.DomicileSameAsKTP,
		"verification_status":  status,
		"verification_stage":   stage,
		"updated_at":           time.Now().UTC(),
	}

	return s.client.Update(ctx, "user_verification_profiles", map[string]string{
		"id": record.ID,
	}, updates)
}

func (s *Service) UpsertVerificationDocument(ctx context.Context, profileRecord *verificationProfileRecord, payload documentPayload) error {
	if profileRecord == nil {
		return nil
	}

	now := time.Now().UTC()
	documentRow, err := s.client.SelectFirst(ctx, "user_verification_documents", "id", map[string]string{
		"verification_profile_id": profileRecord.ID,
		"document_type":           payload.DocumentType,
	})
	if err != nil {
		return err
	}

	documentRowPayload := map[string]any{
		"verification_profile_id": profileRecord.ID,
		"document_type":           payload.DocumentType,
		"file_key":                payload.FileKey,
		"file_url":                nullIfEmpty(payload.FileURL),
		"mime_type":               nullIfEmpty(payload.MimeType),
		"document_number":         nullIfEmpty(payload.DocumentNumber),
		"ocr_name":                nullIfEmpty(payload.OCRName),
		"ocr_nik":                 nullIfEmpty(payload.OCRNIK),
		"ocr_birth_date":          optionalTimeValue(payload.OCRBirthDate),
		"ocr_address":             nullIfEmpty(payload.OCRAddress),
		"ocr_confidence":          optionalFloat64Value(payload.OCRConfidence),
		"is_primary":              payload.IsPrimary,
		"validation_status":       payload.ValidationStatus,
		"uploaded_at":             now,
		"updated_at":              now,
	}
	documentRowPayload["file_size"] = optionalInt64Value(payload.FileSize)

	if documentRow == nil {
		documentRowPayload["created_at"] = now
		if err := s.client.Insert(ctx, "user_verification_documents", documentRowPayload); err != nil {
			return err
		}
	} else {
		documentRowPayload["validated_at"] = nil
		if err := s.client.Update(ctx, "user_verification_documents", map[string]string{
			"id": config.NormalizeString(documentRow["id"]),
		}, documentRowPayload); err != nil {
			return err
		}
	}

	documents, err := s.ListVerificationDocuments(ctx, profileRecord.ID)
	if err != nil {
		return err
	}

	status := profileRecord.VerificationStatus
	switch status {
	case "", "not_started":
		status = "draft"
	case "rejected":
		status = "resubmission_required"
	}

	return s.client.Update(ctx, "user_verification_profiles", map[string]string{
		"id": profileRecord.ID,
	}, map[string]any{
		"verification_status": status,
		"verification_stage":  resolveStageFromDocuments(profileRecord.VerificationStage, documents),
		"updated_at":          time.Now().UTC(),
	})
}

func (s *Service) SubmitVerification(ctx context.Context, profileRecord *verificationProfileRecord, documents []verificationDocumentRecord, isResubmission bool) error {
	if profileRecord == nil {
		return nil
	}
	_ = documents

	now := time.Now().UTC()
	updates := map[string]any{
		"verification_status":    "submitted",
		"verification_stage":     "review",
		"submitted_at":           now,
		"updated_at":             now,
		"needs_resubmission":     false,
		"rejection_reason_code":  nil,
		"rejection_reason_detail": nil,
	}

	if isResubmission {
		updates["rejected_at"] = nil
		updates["reviewed_at"] = nil
	}

	return s.client.Update(ctx, "user_verification_profiles", map[string]string{
		"id": profileRecord.ID,
	}, updates)
}

func (s *Service) ListVerificationDocuments(ctx context.Context, verificationProfileID string) ([]verificationDocumentRecord, error) {
	rows, err := s.client.SelectMany(ctx, "user_verification_documents", "id,verification_profile_id,document_type,file_key,file_url,mime_type,file_size,document_number,ocr_name,ocr_nik,ocr_birth_date,ocr_address,ocr_confidence,is_primary,validation_status,uploaded_at,validated_at,created_at,updated_at", map[string]string{
		"verification_profile_id": verificationProfileID,
	}, &config.SelectOptions{OrderBy: "created_at", Desc: false})
	if err != nil {
		return nil, err
	}

	documents := make([]verificationDocumentRecord, 0, len(rows))
	for _, row := range rows {
		documents = append(documents, verificationDocumentRecord{
			ID:               config.NormalizeString(row["id"]),
			VerificationID:   config.NormalizeString(row["verification_profile_id"]),
			DocumentType:     config.NormalizeString(row["document_type"]),
			FileKey:          config.NormalizeString(row["file_key"]),
			FileURL:          config.NormalizeString(row["file_url"]),
			MimeType:         config.NormalizeString(row["mime_type"]),
			FileSize:         config.NormalizeString(row["file_size"]),
			DocumentNumber:   config.NormalizeString(row["document_number"]),
			OCRName:          config.NormalizeString(row["ocr_name"]),
			OCRNIK:           config.NormalizeString(row["ocr_nik"]),
			OCRBirthDate:     parseOptionalTime(row["ocr_birth_date"]),
			OCRAddress:       config.NormalizeString(row["ocr_address"]),
			OCRConfidence:    config.NormalizeString(row["ocr_confidence"]),
			IsPrimary:        parseBool(row["is_primary"]),
			ValidationStatus: config.NormalizeString(row["validation_status"]),
			UploadedAt:       parseOptionalTime(row["uploaded_at"]),
			ValidatedAt:      parseOptionalTime(row["validated_at"]),
			CreatedAt:        parseOptionalTime(row["created_at"]),
			UpdatedAt:        parseOptionalTime(row["updated_at"]),
		})
	}

	return documents, nil
}

func (s *Service) ListVerificationReviews(ctx context.Context, verificationProfileID string) ([]verificationReviewRecord, error) {
	rows, err := s.client.SelectMany(ctx, "user_verification_reviews", "id,verification_profile_id,review_type,review_result,reviewer_id,reviewer_role,review_notes,decision_reason_code,decision_reason_detail,created_at", map[string]string{
		"verification_profile_id": verificationProfileID,
	}, &config.SelectOptions{OrderBy: "created_at", Desc: true, Limit: 20})
	if err != nil {
		return nil, err
	}

	reviews := make([]verificationReviewRecord, 0, len(rows))
	for _, row := range rows {
		reviews = append(reviews, verificationReviewRecord{
			ID:                   config.NormalizeString(row["id"]),
			VerificationID:       config.NormalizeString(row["verification_profile_id"]),
			ReviewType:           config.NormalizeString(row["review_type"]),
			ReviewResult:         config.NormalizeString(row["review_result"]),
			ReviewerID:           config.NormalizeString(row["reviewer_id"]),
			ReviewerRole:         config.NormalizeString(row["reviewer_role"]),
			ReviewNotes:          config.NormalizeString(row["review_notes"]),
			DecisionReasonCode:   config.NormalizeString(row["decision_reason_code"]),
			DecisionReasonDetail: config.NormalizeString(row["decision_reason_detail"]),
			CreatedAt:            parseOptionalTime(row["created_at"]),
		})
	}

	return reviews, nil
}

func (s *Service) ListVerificationEvents(ctx context.Context, verificationProfileID string) ([]verificationEventRecord, error) {
	rows, err := s.client.SelectMany(ctx, "user_verification_events", "id,verification_profile_id,previous_status,new_status,actor_id,actor_type,notes,created_at", map[string]string{
		"verification_profile_id": verificationProfileID,
	}, &config.SelectOptions{OrderBy: "created_at", Desc: true, Limit: 30})
	if err != nil {
		return nil, err
	}

	events := make([]verificationEventRecord, 0, len(rows))
	for _, row := range rows {
		events = append(events, verificationEventRecord{
			ID:             config.NormalizeString(row["id"]),
			VerificationID: config.NormalizeString(row["verification_profile_id"]),
			PreviousStatus: config.NormalizeString(row["previous_status"]),
			NewStatus:      config.NormalizeString(row["new_status"]),
			ActorID:        config.NormalizeString(row["actor_id"]),
			ActorType:      config.NormalizeString(row["actor_type"]),
			Notes:          config.NormalizeString(row["notes"]),
			CreatedAt:      parseOptionalTime(row["created_at"]),
		})
	}

	return events, nil
}

func mapVerificationProfile(row map[string]any) *verificationProfileRecord {
	if row == nil {
		return nil
	}

	return &verificationProfileRecord{
		ID:                    config.NormalizeString(row["id"]),
		AuthUserID:            config.NormalizeString(row["auth_user_id"]),
		FullLegalName:         config.NormalizeString(row["full_legal_name"]),
		NIK:                   config.NormalizeString(row["nik"]),
		BirthPlace:            config.NormalizeString(row["birth_place"]),
		BirthDate:             parseOptionalTime(row["birth_date"]),
		Gender:                config.NormalizeString(row["gender"]),
		Occupation:            config.NormalizeString(row["occupation"]),
		Province:              config.NormalizeString(row["province"]),
		City:                  config.NormalizeString(row["city"]),
		District:              config.NormalizeString(row["district"]),
		SubDistrict:           config.NormalizeString(row["sub_district"]),
		PostalCode:            config.NormalizeString(row["postal_code"]),
		FullAddress:           config.NormalizeString(row["full_address"]),
		DomicileSameAsKTP:     parseBool(row["domicile_same_as_ktp"]),
		VerificationStatus:    config.NormalizeString(row["verification_status"]),
		VerificationStage:     config.NormalizeString(row["verification_stage"]),
		RiskScore:             config.NormalizeString(row["risk_score"]),
		RiskFlags:             parseStringArray(row["risk_flags"]),
		SubmittedAt:           parseOptionalTime(row["submitted_at"]),
		ReviewedAt:            parseOptionalTime(row["reviewed_at"]),
		ApprovedAt:            parseOptionalTime(row["approved_at"]),
		RejectedAt:            parseOptionalTime(row["rejected_at"]),
		RejectionReasonCode:   config.NormalizeString(row["rejection_reason_code"]),
		RejectionReasonDetail: config.NormalizeString(row["rejection_reason_detail"]),
		NeedsResubmission:     parseBool(row["needs_resubmission"]),
		CreatedAt:             parseOptionalTime(row["created_at"]),
		UpdatedAt:             parseOptionalTime(row["updated_at"]),
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

func parseBool(value any) bool {
	switch typed := value.(type) {
	case bool:
		return typed
	case string:
		normalized := strings.ToLower(strings.TrimSpace(typed))
		return normalized == "true" || normalized == "1"
	default:
		return strings.EqualFold(config.NormalizeString(value), "true")
	}
}

func parseStringArray(value any) []string {
	switch typed := value.(type) {
	case nil:
		return []string{}
	case []any:
		out := make([]string, 0, len(typed))
		for _, item := range typed {
			if normalized := config.NormalizeString(item); normalized != "" {
				out = append(out, normalized)
			}
		}
		return out
	case []string:
		out := make([]string, 0, len(typed))
		for _, item := range typed {
			if normalized := strings.TrimSpace(item); normalized != "" {
				out = append(out, normalized)
			}
		}
		return out
	case string:
		trimmed := strings.TrimSpace(typed)
		if trimmed == "" {
			return []string{}
		}

		var arr []string
		if err := json.Unmarshal([]byte(trimmed), &arr); err == nil {
			return arr
		}

		return []string{trimmed}
	default:
		return []string{}
	}
}

func optionalTimeValue(value *time.Time) any {
	if value == nil || value.IsZero() {
		return nil
	}
	return value.UTC()
}

func optionalInt64Value(value *int64) any {
	if value == nil {
		return nil
	}
	return *value
}

func optionalFloat64Value(value *float64) any {
	if value == nil {
		return nil
	}
	return *value
}

func nullIfEmpty(value string) any {
	trimmed := strings.TrimSpace(value)
	if trimmed == "" {
		return nil
	}
	return trimmed
}
