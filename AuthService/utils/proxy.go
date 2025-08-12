package utils

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

func ProxyToService(targetBaseUrl string, pathPrefix string) http.HandlerFunc {

	target, err := url.Parse(targetBaseUrl)

	if err != nil {
		fmt.Println("Error parsing target URL", err)
		return nil
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

	originalDirector := proxy.Director

	proxy.Director = func(r *http.Request) {
		fmt.Println("Before originalDirector:", r.URL.String())
		originalDirector(r)
		fmt.Println("After originalDirector:", r.URL.String())
		
		fmt.Println("Proxying request to:", targetBaseUrl)

		originalPath := r.URL.Path
		fmt.Println("Original Path:", originalPath)

		strippedPath := strings.TrimPrefix(originalPath, pathPrefix)
		fmt.Println("Stripped Path:", strippedPath)

		r.URL.Path = strippedPath
		r.Host = target.Host
		r.URL.Host = target.Host
		r.URL.Scheme = target.Scheme


		fmt.Println("Entire url:", r.URL.String())
		if userId, ok := r.Context().Value("UserId").(string); ok {
			r.Header.Set("X-User-ID", userId)
		}
	}

	return proxy.ServeHTTP
}
