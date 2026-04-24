package config

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

type Authentication struct {
	AuthUserID    string     `gorm:"column:auth_user_id;primaryKey"`
	Email         string     `gorm:"column:email"`
	Username      string     `gorm:"column:username"`
	Phone         string     `gorm:"column:phone"`
	Authorization string     `gorm:"column:authorization"`
	Password      *string    `gorm:"column:password"`
	AuthToken     *string    `gorm:"column:auth_token"`
	CreatedAt     *time.Time `gorm:"column:created_at"`
	UpdatedAt     *time.Time `gorm:"column:updated_at"`
}

func (Authentication) TableName() string {
	return "authentication"
}

type UserIdentification struct {
	AuthUserID    string     `gorm:"column:auth_user_id;primaryKey"`
	Email         string     `gorm:"column:email"`
	Username      string     `gorm:"column:username"`
	Phone         string     `gorm:"column:phone"`
	Fullname      *string    `gorm:"column:fullname"`
	Birthdate     *time.Time `gorm:"column:birthdate"`
	Province      *string    `gorm:"column:province"`
	City          *string    `gorm:"column:city"`
	District      *string    `gorm:"column:district"`
	SubDistrict   *string    `gorm:"column:sub_district"`
	PostalCode    *string    `gorm:"column:postal_code"`
	FullAddress   *string    `gorm:"column:full_address"`
	TagsSkill     *string    `gorm:"column:tags_skill"`
	Authorization *string    `gorm:"column:authorization"`
	UserRole      string     `gorm:"column:user_role"`
	CreatedAt     *time.Time `gorm:"column:created_at"`
	UpdatedAt     *time.Time `gorm:"column:updated_at"`
}

func (UserIdentification) TableName() string {
	return "user_identification"
}

type Quest struct {
	ID                 uuid.UUID       `gorm:"column:id;primaryKey"`
	GiverAuthUserID    uuid.UUID       `gorm:"column:giver_auth_user_id"`
	Title              string          `gorm:"column:title"`
	Description        string          `gorm:"column:description"`
	Category           *string         `gorm:"column:category"`
	SkillTags          json.RawMessage `gorm:"column:skill_tags;type:jsonb"`
	Mode               string          `gorm:"column:mode"`
	Status             string          `gorm:"column:status"`
	RewardAmount       float64         `gorm:"column:reward_amount"`
	RewardCurrency     string          `gorm:"column:reward_currency"`
	Province           *string         `gorm:"column:province"`
	City               *string         `gorm:"column:city"`
	District           *string         `gorm:"column:district"`
	SubDistrict        *string         `gorm:"column:sub_district"`
	FullAddress        *string         `gorm:"column:full_address"`
	PostalCode         *string         `gorm:"column:postal_code"`
	Lat                *float64        `gorm:"column:lat"`
	Lng                *float64        `gorm:"column:lng"`
	MaxRunner          int             `gorm:"column:max_runner"`
	CurrentRunnerCount int             `gorm:"column:current_runner_count"`
	StartsAt           *time.Time      `gorm:"column:starts_at"`
	EndsAt             *time.Time      `gorm:"column:ends_at"`
	CreatedAt          *time.Time      `gorm:"column:created_at"`
	UpdatedAt          *time.Time      `gorm:"column:updated_at"`
}

func (Quest) TableName() string {
	return "quests"
}

type QuestAssignment struct {
	ID               uuid.UUID  `gorm:"column:id;primaryKey"`
	QuestID          uuid.UUID  `gorm:"column:quest_id"`
	RunnerAuthUserID uuid.UUID  `gorm:"column:runner_auth_user_id"`
	AssignmentStatus string     `gorm:"column:assignment_status"`
	JoinedAt         *time.Time `gorm:"column:joined_at"`
	FinishedAt       *time.Time `gorm:"column:finished_at"`
	CreatedAt        *time.Time `gorm:"column:created_at"`
	UpdatedAt        *time.Time `gorm:"column:updated_at"`
}

func (QuestAssignment) TableName() string {
	return "quest_assignments"
}

type UserVerificationDocuments struct {
	ID                    uuid.UUID  `gorm:"column:id;primaryKey"`
	VerificationProfileID uuid.UUID  `gorm:"column:verification_profile_id"`
	DocumentType          string     `gorm:"column:document_type"`
	FileKey               string     `gorm:"column:file_key"`
	FileURL               *string    `gorm:"column:file_url"`
	MimeType              *string    `gorm:"column:mime_type"`
	FileSize              *int64     `gorm:"column:file_size"`
	DocumentNumber        *string    `gorm:"column:document_number"`
	OcrName               *string    `gorm:"column:ocr_name"`
	OcrNik                *string    `gorm:"column:ocr_nik"`
	OcrBirthDate          *time.Time `gorm:"column:ocr_birth_date"`
	OcrAddress            *string    `gorm:"column:ocr_address"`
	OcrConfidence         *float64   `gorm:"column:ocr_confidence"`
	IsPrimary             bool       `gorm:"column:is_primary"`
	ValidationStatus      string     `gorm:"column:validation_status"`
	UploadedAt            *time.Time `gorm:"column:uploaded_at"`
	ValidatedAt           *time.Time `gorm:"column:validated_at"`
	CreatedAt             *time.Time `gorm:"column:created_at"`
	UpdatedAt             *time.Time `gorm:"column:updated_at"`
}

func (UserVerificationDocuments) TableName() string {
	return "user_verification_documents"
}

type UserVerificationProfiles struct {
	ID                    uuid.UUID       `gorm:"column:id;primaryKey"`
	AuthUserID            uuid.UUID       `gorm:"column:auth_user_id"`
	FullLegalName         *string         `gorm:"column:full_legal_name"`
	Nik                   *string         `gorm:"column:nik"`
	BirthPlace            *string         `gorm:"column:birth_place"`
	BirthDate             *time.Time      `gorm:"column:birth_date"`
	Gender                *string         `gorm:"column:gender"`
	Occupation            *string         `gorm:"column:occupation"`
	Province              *string         `gorm:"column:province"`
	City                  *string         `gorm:"column:city"`
	District              *string         `gorm:"column:district"`
	SubDistrict           *string         `gorm:"column:sub_district"`
	PostalCode            *string         `gorm:"column:postal_code"`
	FullAddress           *string         `gorm:"column:full_address"`
	DomicileSameAsKtp     bool            `gorm:"column:domicile_same_as_ktp"`
	VerificationStatus    string          `gorm:"column:verification_status"`
	VerificationStage     string          `gorm:"column:verification_stage"`
	RiskScore             float64         `gorm:"column:risk_score"`
	RiskFlags             json.RawMessage `gorm:"column:risk_flags;type:jsonb"`
	SubmittedAt           *time.Time      `gorm:"column:submitted_at"`
	ReviewedAt            *time.Time      `gorm:"column:reviewed_at"`
	ApprovedAt            *time.Time      `gorm:"column:approved_at"`
	RejectedAt            *time.Time      `gorm:"column:rejected_at"`
	RejectionReasonCode   *string         `gorm:"column:rejection_reason_code"`
	RejectionReasonDetail *string         `gorm:"column:rejection_reason_detail"`
	NeedsResubmission     bool            `gorm:"column:needs_resubmission"`
	CreatedAt             *time.Time      `gorm:"column:created_at"`
	UpdatedAt             *time.Time      `gorm:"column:updated_at"`
}

func (UserVerificationProfiles) TableName() string {
	return "user_verification_profiles"
}

type UserVerificationReviews struct {
	ID                    uuid.UUID  `gorm:"column:id;primaryKey"`
	VerificationProfileID uuid.UUID  `gorm:"column:verification_profile_id"`
	ReviewType            string     `gorm:"column:review_type"`
	ReviewResult          string     `gorm:"column:review_result"`
	ReviewerID            *uuid.UUID `gorm:"column:reviewer_id"`
	ReviewerRole          *string    `gorm:"column:reviewer_role"`
	ReviewNotes           *string    `gorm:"column:review_notes"`
	DecisionReasonCode    *string    `gorm:"column:decision_reason_code"`
	DecisionReasonDetail  *string    `gorm:"column:decision_reason_detail"`
	CreatedAt             *time.Time `gorm:"column:created_at"`
}

func (UserVerificationReviews) TableName() string {
	return "user_verification_reviews"
}

type UserVerificationEvents struct {
	ID                    uuid.UUID  `gorm:"column:id;primaryKey"`
	VerificationProfileID uuid.UUID  `gorm:"column:verification_profile_id"`
	PreviousStatus        *string    `gorm:"column:previous_status"`
	NewStatus             *string    `gorm:"column:new_status"`
	ActorID               *uuid.UUID `gorm:"column:actor_id"`
	ActorType             *string    `gorm:"column:actor_type"`
	Notes                 *string    `gorm:"column:notes"`
	CreatedAt             *time.Time `gorm:"column:created_at"`
}

func (UserVerificationEvents) TableName() string {
	return "user_verification_events"
}
