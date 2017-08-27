package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"net/http/cookiejar"
	"strings"
)

//DOMAIN 域名
const DOMAIN = "http://www.yxaaa.cn"

func main() {
	c := http.Client{}
	jar, _ := cookiejar.New(nil)
	c.Jar = jar
	domain := "http://www.yxaaa.cn/pub/user/login.do"
	resp, err := c.Post(domain, "application/x-www-form-urlencoded", strings.NewReader("loginName=2704915525&password=404677"))
	if err != nil {
		panic(err)
	}

	body, _ := ioutil.ReadAll(resp.Body)

	fmt.Println(string(body))

	resp, err = c.Get(DOMAIN + "/pub/user/product/go/83.do")
	if err != nil {
		panic(err)
	}

	defer resp.Body.Close()
	body, _ = ioutil.ReadAll(resp.Body)

	fmt.Println(string(body))
	fmt.Println(jar)
}
