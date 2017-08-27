package spider

import (
	"io"
	"net/http"
	"net/url"
	"strings"
)

type Base struct {
	Client *http.Client
}

func (b *Base) Post(url string, param url.Values) (*http.Response, error) {
	return b.Request("POST", url, strings.NewReader(param.Encode()))
}

func (b *Base) Get(url string) (*http.Response, error) {
	return b.Request("GET", url, nil)
}

func (b *Base) Request(method, url string, body io.Reader) (*http.Response, error) {
	req, err := http.NewRequest(method, url, body)
	if err != nil {
		panic(err)
	}
	req = b.setHeader(req)
	return b.Client.Do(req)
}

func (b *Base) setHeader(req *http.Request) *http.Request {
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	return req
}

type Spider interface {
}
