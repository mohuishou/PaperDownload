package cnki

import (
	"io/ioutil"
	"math"
	"math/rand"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"strconv"
	"strings"

	goquery "github.com/PuerkitoBio/goquery.git"
	"github.com/mohuishou/PaperDownload/spider"
)

//Cnki 知网
type Cnki struct {
	spider.Base
	searchOption *searchOption
}

//SearchResult 搜索结果
type SearchResult struct {
	Title       string
	Author      string
	From        string
	Time        string
	DB          string
	DownloadNum string
	DownloadURL string
}

type searchOption struct {
	currentPage int    //当前页码
	allPage     int    //总页数
	url         string //搜索结果的地址
	perPage     int    //每页显示条数
	order       string //排序方式
}

//NewCnki 新建知网
func NewCnki() *Cnki {
	//new cnki
	c := new(Cnki)

	//new client
	c.Client = new(http.Client)

	//new searchOption
	c.searchOption = &searchOption{
		currentPage: 1,
		order:       "(发表时间,'TIME') desc",
		perPage:     20,
	}

	//new cookieJar
	c.Client.Jar, _ = cookiejar.New(nil)
	u, err := url.Parse("http://cnki.net")
	if err != nil {
		panic(err)
	}
	cookie := make([]*http.Cookie, 1)
	cookie[0] = &http.Cookie{
		Name:     "cnkiUserKey",
		Value:    setNewGUID(),
		HttpOnly: false,
		Domain:   "cnki.net",
	}
	c.Client.Jar.SetCookies(u, cookie)

	return c
}

//Login 登录
func (c *Cnki) Login(username, password string) {
	param := url.Values{}
	param.Add("username", username)
	param.Add("password", password)

	_, err := c.Post(loginURL, param)
	if err != nil {
		panic("登录失败: " + err.Error())
	}
}

//Search 搜索
func (c *Cnki) Search(title, author, from string) []SearchResult {
	param := url.Values{}
	param.Add("action", "")
	param.Add("NaviCode", "*")
	param.Add("ua", "1.21")
	param.Add("PageName", "ASP.brief_result_aspx")
	param.Add("DbPrefix", "SCDB")
	param.Add("DbCatalog", "中国学术文献网络出版总库")
	param.Add("ConfigFile", "SCDB.xml")
	param.Add("db_opt", "CJFQ,CJRF,CDFD,CMFD,CPFD,IPFD,CCND")
	if from != "" {
		param.Add("magazine_value1", from)
		param.Add("magazine_special1", "%")
	}
	if title != "" {
		param.Add("txt_1_sel", "SU")
		param.Add("txt_1_value1", title)
		param.Add("txt_1_relation", "#CNKI_AND")
		param.Add("txt_1_special1", "%")
	}
	if author != "" {
		param.Add("au_1_sel", "AU")
		param.Add("au_1_sel2", "AF")
		param.Add("au_1_value1", author)
		param.Add("au_1_special1", "=")
		param.Add("au_1_special2", "%")
	}
	param.Add("his", "0")

	resp, err := c.Post(searchURL, param)
	if err != nil {
		panic("搜索失败: " + err.Error())
	}
	body, _ := ioutil.ReadAll(resp.Body)
	defer resp.Body.Close()

	resp, err = c.Get(searchResultURL + "pagename=" + strings.Trim(string(body), " "))
	if err != nil {
		panic("搜索结果获取失败: " + err.Error())
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		panic(err)
	}
	searchLists := make([]SearchResult, 0)
	doc.Find("table.GridTableContent tbody tr").Each(func(i int, s *goquery.Selection) {
		url, ok := s.Find("a.briefDl_D").Attr("href")
		if !ok {
			return
		}
		url = downloadDomain + url + "&dflag=pdfdown"
		searchList := SearchResult{
			DownloadURL: url,
			Title:       strings.TrimSpace(string(s.Find("td").Eq(1).Find("a").Text())),
			Author:      strings.TrimSpace(string(s.Find("td").Eq(2).Text())),
			From:        strings.TrimSpace(string(s.Find("td").Eq(3).Text())),
			Time:        strings.TrimSpace(string(s.Find("td").Eq(4).Text())),
			DB:          strings.TrimSpace(string(s.Find("td").Eq(5).Text())),
			DownloadNum: strings.TrimSpace(string(s.Find("td").Eq(7).Text())),
		}
		searchLists = append(searchLists, searchList)
	})
	return searchLists
}

func (c *Cnki) getSearchResult() []SearchResult {
	resp, err := c.Get(searchResultURL + "QueryID=0&ID=&turnpage=1&tpagemode=L&dbPrefix=SCDB&Fields=&DisplayMode=listmode&PageName=ASP.brief_result_aspx" + "&sorttype=" + c.searchOption.order + "&recordsperpage=" + strconv.Itoa(c.searchOption.perPage) + "&curpage=" + strconv.Itoa(c.searchOption.currentPage))
	if err != nil {
		panic("搜索结果获取失败: " + err.Error())
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)
	if err != nil {
		panic(err)
	}
	searchLists := make([]SearchResult, 0)
	doc.Find("table.GridTableContent tbody tr").Each(func(i int, s *goquery.Selection) {
		url, ok := s.Find("a.briefDl_D").Attr("href")
		if !ok {
			return
		}
		url = downloadDomain + url + "&dflag=pdfdown"
		searchList := SearchResult{
			DownloadURL: url,
			Title:       strings.TrimSpace(string(s.Find("td").Eq(1).Find("a").Text())),
			Author:      strings.TrimSpace(string(s.Find("td").Eq(2).Text())),
			From:        strings.TrimSpace(string(s.Find("td").Eq(3).Text())),
			Time:        strings.TrimSpace(string(s.Find("td").Eq(4).Text())),
			DB:          strings.TrimSpace(string(s.Find("td").Eq(5).Text())),
			DownloadNum: strings.TrimSpace(string(s.Find("td").Eq(7).Text())),
		}
		searchLists = append(searchLists, searchList)
	})
	return searchLists
}

func (c *Cnki) SearchResultOrder() []SearchResult {
	return c.getSearchResult()
}

func (c *Cnki) SearchPage(page int) []SearchResult {
	c.searchOption.currentPage = page
	return c.getSearchResult()
}

func (c *Cnki) SearchNext() []SearchResult {
	if c.searchOption.currentPage < c.searchOption.allPage {
		c.searchOption.currentPage++
	}
	return c.getSearchResult()
}

func (c *Cnki) SearchPrev() []SearchResult {
	if c.searchOption.currentPage > 1 {
		c.searchOption.currentPage--
	}
	return c.getSearchResult()
}

//新建一个guid，按照知网js实现方式重现
func setNewGUID() string {
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
