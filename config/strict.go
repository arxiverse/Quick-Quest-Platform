package config

import (
	"crypto/rand"
	"crypto/sha256"
	"crypto/subtle"
	"encoding/base64"
	"encoding/hex"
	"encoding/json"
	"errors"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/google/uuid"
	"golang.org/x/crypto/argon2"
)

const (
	hashVersion             = "v1"
	hashAlgorithm           = "argon2id"
	hashPrefix              = hashAlgorithm + ":" + hashVersion
	SessionDuration         = 8 * time.Hour
	SessionDurationMS int64 = int64(SessionDuration / time.Millisecond)
)

var (
	errInvalidHashFormat = errors.New("Invalid Format")
)

type authIdentityPayload struct {
	ID       string `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
	Phone    string `json:"phone"`
}

func deriveArgon2(password string, salt []byte) []byte {
	return argon2.IDKey([]byte(password), salt, 3, 65536, 4, 32)
}

func GenerateUUIDV4() string {
	return uuid.NewString()
}

func HashPassword(password string) (string, error) {
	salt := make([]byte, 16)
	if _, err := rand.Read(salt); err != nil {
		return "", err
	}

	hashed := deriveArgon2(password, salt)
	return hashPrefix + ":" + base64.RawURLEncoding.EncodeToString(salt) + ":" + base64.RawURLEncoding.EncodeToString(hashed), nil
}

func VerifyPassword(password string, encodedHash string) bool {
	algorithm, version, saltEncoded, hashEncoded, err := parseEncodedHash(encodedHash)
	if err != nil {
		return false
	}
	if algorithm != hashAlgorithm || version != hashVersion {
		return false
	}

	salt, err := base64.RawURLEncoding.DecodeString(saltEncoded)
	if err != nil {
		return false
	}
	expectedHash, err := base64.RawURLEncoding.DecodeString(hashEncoded)
	if err != nil {
		return false
	}

	actualHash := deriveArgon2(password, salt)
	return len(actualHash) == len(expectedHash) && subtle.ConstantTimeCompare(actualHash, expectedHash) == 1
}

func parseEncodedHash(encodedHash string) (string, string, string, string, error) {
	parts := strings.Split(encodedHash, ":")
	if len(parts) != 4 {
		return "", "", "", "", errInvalidHashFormat
	}

	return parts[0], parts[1], parts[2], parts[3], nil
}

func CreateAuthToken(identityPayload struct {
	ID       string
	Username string
	Email    string
	Phone    string
}) (string, error) {
	entropy := make([]byte, 24)
	if _, err := rand.Read(entropy); err != nil {
		return "", err
	}

	issuedAt := strconv.FormatInt(time.Now().UnixMilli(), 10)
	serializedIdentity, err := json.Marshal(authIdentityPayload{
		ID:       identityPayload.ID,
		Username: identityPayload.Username,
		Email:    identityPayload.Email,
		Phone:    identityPayload.Phone,
	})
	if err != nil {
		return "", err
	}

	authTokenSecret := os.Getenv("AUTH_TOKEN_SECRET")
	if strings.TrimSpace(authTokenSecret) == "" {
		authTokenSecret = "qqm-local-dev-secret"
	}

	hash := sha256.New()
	hash.Write(serializedIdentity)
	hash.Write([]byte(issuedAt))
	hash.Write([]byte(hex.EncodeToString(entropy)))
	hash.Write([]byte(authTokenSecret))

	return hex.EncodeToString(hash.Sum(nil)), nil
}
