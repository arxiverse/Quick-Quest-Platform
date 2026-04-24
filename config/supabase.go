package config

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type SupabaseClient struct {
	baseURL    string
	apiKey     string
	httpClient *http.Client
}

type SupabaseAuthUser struct {
	ID    string `json:"id"`
	Email string `json:"email"`
	Phone string `json:"phone"`
}

type SupabaseRequestError struct {
	StatusCode int
	Message    string
}

type SelectOptions struct {
	Limit   int
	OrderBy string
	Desc    bool
}

func (e *SupabaseRequestError) Error() string {
	if e == nil {
		return "supabase request error"
	}
	if strings.TrimSpace(e.Message) == "" {
		return fmt.Sprintf("supabase request error (status %d)", e.StatusCode)
	}
	return e.Message
}

func NewSupabaseClient(baseURL string, apiKey string) (*SupabaseClient, error) {
	trimmedURL := strings.TrimRight(strings.TrimSpace(baseURL), "/")
	trimmedKey := strings.TrimSpace(apiKey)

	if trimmedURL == "" {
		return nil, errors.New("SUPABASE_URL wajib diisi untuk CLOUD_TRAFFIC=true")
	}
	if trimmedKey == "" {
		return nil, errors.New("SUPABASE key wajib diisi untuk CLOUD_TRAFFIC=true")
	}

	return &SupabaseClient{
		baseURL: trimmedURL,
		apiKey:  trimmedKey,
		httpClient: &http.Client{
			Timeout: 20 * time.Second,
		},
	}, nil
}

func (c *SupabaseClient) Health(ctx context.Context) error {
	_, _, err := c.request(ctx, http.MethodGet, "/rest/v1/authentication?select=auth_user_id&limit=1", nil, nil)
	return err
}

func (c *SupabaseClient) CreateAuthUser(ctx context.Context, email string, password string) (*SupabaseAuthUser, error) {
	payload := map[string]any{
		"email":         strings.TrimSpace(email),
		"password":      password,
		"email_confirm": true,
	}

	body, _, err := c.request(ctx, http.MethodPost, "/auth/v1/admin/users", payload, nil)
	if err != nil {
		return nil, err
	}

	out := SupabaseAuthUser{}
	if err := json.Unmarshal(body, &out); err != nil {
		return nil, err
	}

	return &out, nil
}

func (c *SupabaseClient) DeleteAuthUser(ctx context.Context, authUserID string) error {
	path := "/auth/v1/admin/users/" + url.PathEscape(strings.TrimSpace(authUserID))
	_, _, err := c.request(ctx, http.MethodDelete, path, nil, nil)
	return err
}

func (c *SupabaseClient) Insert(ctx context.Context, table string, payload interface{}) error {
	path := "/rest/v1/" + url.PathEscape(strings.TrimSpace(table))
	_, _, err := c.request(ctx, http.MethodPost, path, payload, map[string]string{
		"Prefer": "return=minimal",
	})
	return err
}

func (c *SupabaseClient) Update(ctx context.Context, table string, filters map[string]string, payload interface{}) error {
	path := buildFilterPath(table, filters)
	_, _, err := c.request(ctx, http.MethodPatch, path, payload, map[string]string{
		"Prefer": "return=minimal",
	})
	return err
}

func (c *SupabaseClient) Delete(ctx context.Context, table string, filters map[string]string) error {
	path := buildFilterPath(table, filters)
	_, _, err := c.request(ctx, http.MethodDelete, path, nil, map[string]string{
		"Prefer": "return=minimal",
	})
	return err
}

func (c *SupabaseClient) SelectFirst(ctx context.Context, table string, selectColumns string, filters map[string]string) (map[string]any, error) {
	rows, err := c.SelectMany(ctx, table, selectColumns, filters, &SelectOptions{Limit: 1})
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return nil, nil
	}
	return rows[0], nil
}

func (c *SupabaseClient) SelectMany(ctx context.Context, table string, selectColumns string, filters map[string]string, options *SelectOptions) ([]map[string]any, error) {
	query := url.Values{}
	query.Set("select", selectColumns)
	for key, value := range filters {
		query.Set(key, "eq."+value)
	}

	if options != nil {
		if options.Limit > 0 {
			query.Set("limit", fmt.Sprintf("%d", options.Limit))
		}
		if strings.TrimSpace(options.OrderBy) != "" {
			direction := "asc"
			if options.Desc {
				direction = "desc"
			}
			query.Set("order", strings.TrimSpace(options.OrderBy)+"."+direction)
		}
	}

	path := fmt.Sprintf("/rest/v1/%s?%s", url.PathEscape(strings.TrimSpace(table)), query.Encode())
	body, _, err := c.request(ctx, http.MethodGet, path, nil, nil)
	if err != nil {
		return nil, err
	}

	rows := []map[string]any{}
	if err := decodeJSONUseNumber(body, &rows); err != nil {
		return nil, err
	}

	return rows, nil
}

func decodeJSONUseNumber(input []byte, target interface{}) error {
	decoder := json.NewDecoder(bytes.NewReader(input))
	decoder.UseNumber()
	return decoder.Decode(target)
}

func (c *SupabaseClient) request(ctx context.Context, method string, path string, payload interface{}, extraHeaders map[string]string) ([]byte, int, error) {
	var body io.Reader
	if payload != nil {
		encoded, err := json.Marshal(payload)
		if err != nil {
			return nil, 0, err
		}
		body = bytes.NewReader(encoded)
	}

	req, err := http.NewRequestWithContext(ctx, method, c.baseURL+path, body)
	if err != nil {
		return nil, 0, err
	}

	req.Header.Set("apikey", c.apiKey)
	req.Header.Set("Authorization", "Bearer "+c.apiKey)
	req.Header.Set("Accept", "application/json")
	if payload != nil {
		req.Header.Set("Content-Type", "application/json")
	}
	for key, value := range extraHeaders {
		req.Header.Set(key, value)
	}

	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, 0, err
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, resp.StatusCode, err
	}

	if resp.StatusCode >= http.StatusBadRequest {
		return respBody, resp.StatusCode, &SupabaseRequestError{
			StatusCode: resp.StatusCode,
			Message:    extractErrorMessage(respBody, resp.Status),
		}
	}

	return respBody, resp.StatusCode, nil
}

func buildFilterPath(table string, filters map[string]string) string {
	query := url.Values{}
	for key, value := range filters {
		query.Set(key, "eq."+value)
	}
	return fmt.Sprintf("/rest/v1/%s?%s", url.PathEscape(strings.TrimSpace(table)), query.Encode())
}

func extractErrorMessage(body []byte, fallback string) string {
	type errPayload struct {
		Message string `json:"message"`
		Hint    string `json:"hint"`
		Details string `json:"details"`
	}

	var payload errPayload
	if err := json.Unmarshal(body, &payload); err == nil {
		parts := []string{}
		if strings.TrimSpace(payload.Message) != "" {
			parts = append(parts, payload.Message)
		}
		if strings.TrimSpace(payload.Details) != "" {
			parts = append(parts, payload.Details)
		}
		if strings.TrimSpace(payload.Hint) != "" {
			parts = append(parts, payload.Hint)
		}
		if len(parts) > 0 {
			return strings.Join(parts, " | ")
		}
	}

	trimmed := strings.TrimSpace(string(body))
	if trimmed != "" {
		return trimmed
	}
	return fallback
}
