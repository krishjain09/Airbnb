package middlewares

import (
	"fmt"
	"net/http"
	"time"

	"golang.org/x/time/rate"
)

var limiter = rate.NewLimiter(rate.Every(1*time.Minute), 5)

func RateLimiter(next http.Handler) http.Handler {
	fmt.Println("Rate Limiter executed...")
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if !limiter.Allow() {
			http.Error(w, "Too many requests", http.StatusTooManyRequests)
			return
		}
		next.ServeHTTP(w, r)
	})
}
