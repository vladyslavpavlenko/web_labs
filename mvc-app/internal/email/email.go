package email

import "net/mail"

type Email string

// Validate validates the email address.
func (e Email) Validate() bool {
	_, err := mail.ParseAddress(string(e))
	return err == nil
}
