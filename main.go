package main

import (
	"fmt"
	"io"
	"io/ioutil"
	"math"
	"math/rand"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"os"
	"strconv"
	"strings"
	"time"

	goquery "github.com/PuerkitoBio/goquery.git"
)

//SpiderLine 抓取线路
type SpiderLine struct {
	//链接
	URL string
	//线路名称
	Name string
	//线路类型:
	//	0: 知网; 1: 万方; 2: 读秀; 3: 超星
	Type int
}

//DOMAIN 域名
const DOMAIN = "http://www.yxaaa.cn"

var redirectCount = 0
var jar, _ = cookiejar.New(nil)
var enReq string

func myRedirect(req *http.Request, via []*http.Request) (e error) {
	fmt.Println("sadasd")
	fmt.Println(req.Cookies())
	// req.RequestURI
	req.URL, _ = url.Parse(strings.Replace(req.URL.String(), "\n", "", -1))
	fmt.Println(req.URL.String())
	return nil
}

func main() {

	c := http.Client{CheckRedirect: myRedirect}

	ul, err := url.Parse("http://cnki.net")
	if err != nil {
		panic(err)
	}
	cookie := make([]*http.Cookie, 1)
	cookie[0] = &http.Cookie{
		Name:     "cnkiUserKey",
		Value:    "8b55c056-d466-9d48-fc54-189d08446301",
		HttpOnly: false,
		Domain:   ".cnki.net",
	}
	jar.SetCookies(ul, cookie)

	c.Jar = jar
	// c.Get("http://epub.cnki.net/kns")

	domain := "http://epub.cnki.net/kns/loginid.aspx?p=default.aspx"
	param := url.Values{}
	param.Add("username", "sh0130")
	param.Add("password", "shjdts")

	req, err := http.NewRequest("POST", domain, strings.NewReader(param.Encode()))
	if err != nil {
		panic(err)
	}
	req.Header.Set("User-Agent", "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Safari/537.36")
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	resp, err := c.Do(req)

	// params := url.Values{}
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")
	// params.Add("", "")

	// resp, err = c.Post("http://epub.cnki.net/kns/brief/default_result.aspx", "application/x-www-form-urlencoded", strings.NewReader("txt_1_sel=FT%24%25%3D%7C&txt_1_value1=%E7%88%B1%E7%9A%84&txt_1_special1=%25&txt_extension=&expertvalue=&cjfdcode=&currentid=txt_1_value1&dbJson=coreJson&dbPrefix=SCDB&db_opt=CJFQ%2CCJRF%2CCDFD%2CCMFD%2CCPFD%2CIPFD%2CCCND&db_value=&hidTabChange=&hidDivIDS=&singleDB=SCDB&db_codes=&singleDBName=&againConfigJson=false&action=scdbsearch&ua=1.11"))
	// bs, _ := ioutil.ReadAll(resp.Body)
	// fmt.Println(string(bs))

	// resp, err = c.Get("http://epub.cnki.net/kns/Request/GetAptitude_searchHandler.ashx?action=Recommend_tip&kw=%u7535%u5316%u6559%u80B2%u7814%u7A76&dbcode=SCDB&selectedField=%E6%96%87%E7%8C%AE%E6%9D%A5%E6%BA%90&valueFiled=FT%24%25%3D%7C%2CSU%24%25%3D%7C%2CTI%24%25%3D%7C%2CAU%24%3D%7C%2CAF%24%25%2CKY%24%3D%7C%2CAB%24%25%3D%7C%2CRF%24%25%3D%7C%2CCLC%24%3D%7C%3F%3F%2CLY%24%3D%7C%2C&__=Sun%20Aug%2027%202017%2016%3A20%3A04%20GMT%2B0800%20(CST)")
	resp, err = c.Get("http://kns.cnki.net/kns/request/SearchHandler.ashx?action=&NaviCode=*&ua=1.21&PageName=ASP.brief_result_aspx&DbPrefix=SCDB&DbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&db_opt=CJFQ%2CCJRF%2CCDFD%2CCMFD%2CCPFD%2CIPFD%2CCCND&magazine_value1=%E7%94%B5%E5%8C%96%E6%95%99%E8%82%B2%E7%A0%94%E7%A9%B6&magazine_special1=%25&his=0&__=Sun%20Aug%2027%202017%2017%3A28%3A15%20GMT%2B0800%20(CST)")
	resp, err = c.Get("http://kns.cnki.net/kns/brief/brief.aspx?pagename=ASP.brief_result_aspx&dbPrefix=SCDB&dbCatalog=%e4%b8%ad%e5%9b%bd%e5%ad%a6%e6%9c%af%e6%96%87%e7%8c%ae%e7%bd%91%e7%bb%9c%e5%87%ba%e7%89%88%e6%80%bb%e5%ba%93&ConfigFile=SCDB.xml&research=off&t=1503826095601&keyValue=&S=1&sorttype=(%e5%8f%91%e8%a1%a8%e6%97%b6%e9%97%b4%2c%27TIME%27)+desc&queryid=17")

	if err != nil {
		panic(err)
	}

	// fmt.Println(resp)

	// bs, _ := ioutil.ReadAll(resp.Body)
	// fmt.Println(string(bs))

	defer resp.Body.Close()
	defer c.Get("http://epub.cnki.net/kns/logout.aspx?q=1")

	// return

	doc, err := goquery.NewDocumentFromReader(resp.Body)

	var st string
	doc.Find("a.briefDl_D").Each(func(i int, s *goquery.Selection) {
		a, b := s.Attr("href")
		if b {
			st = "http://kns.cnki.net/kns/brief/" + a +"&dflag=pdfdown"
			fmt.Println(a)
		}
	})
	// return
	// u, err := url.Parse("http://cnki.net")
	// if err != nil {
	// 	panic(err)
	// }
	// uid := ""
	// co := jar.Cookies(u)
	// for _, v := range co {
	// 	if v.Name == "LID" {
	// 		uid = v.Value
	// 	}
	// }
	// u, err = url.Parse("http://navi.cnki.net/KNavi/" + st)
	// time.Sleep(1 * time.Second)
	// resp, err = c.Get("http://kns.cnki.net/kcms/detail/detail.aspx?" + u.RawQuery + "&uid=" + uid)
	// fmt.Println("http://kns.cnki.net/kcms/detail/detail.aspx?" + u.RawQuery + "&uid=" + uid)

	// doc, err = goquery.NewDocumentFromReader(resp.Body)
	// if err != nil {
	// 	panic(err)
	// }
	// st = ""
	// doc.Find("#pdfDown").Each(func(i int, s *goquery.Selection) {
	// 	a, b := s.Attr("href")
	// 	if b {
	// 		st = a
	// 		fmt.Println(a)
	// 	}
	// })

	// fmt.Println("http://kns.cnki.net/" + st)

	// http://kns.cnki.net/

	for i := 0; i < 5; i++ {
		time.Sleep(2 * time.Second)
		// resp, err = c.Post("http://kns.cnki.net/KLogin/login.aspx?ReturnUrl="+st, "application/x-www-form-urlencoded", strings.NewReader(param.Encode()))
		resp, err = c.Get(st)
		// resp, err = c.Get("http://kns.cnki.net/kns/download.aspx?filename=0THFGVt1UckVTYQJWYrVncDpHV250bsJjYzRHbFl3Y1I2M6pkeWR3V55WRykTTtd1VTREbvtEVPF2R=0TTMtGOFNDWkNkRKRGZjJVdoZmNxplSJxUVmNTUIJXa5NzazJXe1dmQ5kVazYDclJ3Q5ZUcjNGMyl&tablename=CJFDTEMP&dflag=pdfdown")
		if err != nil {
			fmt.Println(err)
			continue
		}
		for k, v := range resp.Header {
			fmt.Println(k, ":", v)
		}
		// fmt.Println("http://navi.cnki.net/KNavi/" + st)

		// defer response.Body.Close()
		//
		if resp.Header.Get("Content-Type") == "application/pdf" {
			f, _ := os.Create("a.pdf")
			io.Copy(f, resp.Body)
			break
		} else {
			b, _ := ioutil.ReadAll(resp.Body)
			fmt.Println(string(b))
		}

		fmt.Println(jar)

	}

}

func SetNewGuid() string {
	guid := ""
	for i := 1; i <= 32; i++ {
		n := math.Floor(rand.Float64() * 16.0)
		guid += strconv.FormatInt(int64(n), 16)
		if (i == 8) || (i == 12) || (i == 16) || (i == 20) {
			guid = guid + "-"
		}
	}
	return guid
}
