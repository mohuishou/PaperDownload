package cnki

import (
	"io"
	"io/ioutil"
	"log"
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
	queryID     int    //搜索id，搜索条件重置后+1
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

	tmp := strings.Split(strings.TrimSpace(doc.Find(".countPageMark").Text()), "/")
	if len(tmp) < 2 {
		log.Panicln("页码获取失败")
	} else {
		c.searchOption.allPage, _ = strconv.Atoi(tmp[1])
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
	param := url.Values{}
	param.Add("QueryID", strconv.Itoa(c.searchOption.queryID))
	if c.searchOption.currentPage > 1 {
		param.Add("turnpage", "1")
	}
	param.Add("tpagemode", "L")
	param.Add("dbPrefix", "SCDB")
	param.Add("dbCatalog", "中国学术文献网络出版总库")
	param.Add("ID", "")
	param.Add("Fields", "")
	param.Add("research", "off")
	param.Add("DisplayMode", "listmode")
	param.Add("PageName", "ASP.brief_result_aspx")
	param.Add("sorttype", c.searchOption.order)
	param.Add("recordsperpage", strconv.Itoa(c.searchOption.perPage))
	param.Add("curpage", strconv.Itoa(c.searchOption.currentPage))
	resp, err := c.Get(searchResultURL + param.Encode())
	if err != nil {
		panic("搜索结果获取失败: " + err.Error())
	}

	doc, err := goquery.NewDocumentFromReader(resp.Body)

	if err != nil {
		panic(err)
	}

	//获取结果
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

//SearchResultOrder 指定排序方式
//0: 主题： 倒序
//1: 时间：倒序
//2: 时间：顺序
//3: 被引：倒序
//4: 被引：顺序
//5: 下载：倒序
//6: 下载：顺序
func (c *Cnki) SearchResultOrder(order int) {
	orders := []string{
		"(FFD,'RANK') desc",
		"(发表时间,'TIME') desc",
		"(发表时间,'TIME')",
		"(被引频次,'INTEGER') desc",
		"(被引频次,'INTEGER')",
		"(下载频次,'INTEGER') desc",
		"(下载频次,'INTEGER')",
	}
	c.searchOption.queryID++
	c.searchOption.order = orders[order]
}

//SearchPage 搜索结果：指定页码
//@param page int 页码
func (c *Cnki) SearchPage(page int) []SearchResult {
	c.searchOption.currentPage = page
	return c.getSearchResult()
}

//SearchNext 搜索结果：下一页
func (c *Cnki) SearchNext() []SearchResult {
	if c.searchOption.currentPage < c.searchOption.allPage {
		c.searchOption.currentPage++
	} else {
		log.Panicln("警告：已经是最后一页了，总页数", c.searchOption.allPage, "当前页码：", c.searchOption.currentPage)
	}
	return c.getSearchResult()
}

//SearchPrev 搜索结果：前一页
func (c *Cnki) SearchPrev() []SearchResult {
	if c.searchOption.currentPage > 1 {
		c.searchOption.currentPage--
	} else {
		log.Panicln("警告：已经是第一页了，总页数", c.searchOption.allPage, "当前页码：", c.searchOption.currentPage)
	}
	return c.getSearchResult()
}

//Download 下载
func (c *Cnki) Download(url, dir, filename string) {
	for i := 0; i < 5; i++ {
		time.Sleep(2 * time.Second)

		resp, err := c.Get(url)

		if err != nil {
			log.Println(filename, ":", err)
			continue
		}

		if i == 0 {
			defer resp.Body.Close()
		}

		if resp.Header.Get("Content-Type") == "application/pdf" || resp.Header.Get("Content-Type") == "application/caj" {
			if resp.Header.Get("Content-Type") == "application/pdf" {
				filename += ".pdf"
			} else {
				filename += ".caj"
			}
			if ok, _ := pathExists(dir); !ok {
				os.MkdirAll(dir, os.ModePerm)
			}
			var f *os.File
			filename = strings.Replace(filename, "/", "_", -1)
			if ok, _ := pathExists(dir + "/" + filename); !ok {
				f, err = os.Create(dir + "/" + filename)
			} else {
				f, err = os.OpenFile(dir+"/"+filename, os.O_APPEND, 0666)
			}
			if err != nil {
				panic("文件打开或新建失败！" + err.Error())
			}
			io.Copy(f, resp.Body)
			log.Println("下载成功：", filename)
			break
		} else {
			log.Println("下载失败，等待重试")
			resp.Body.Close()
		}
	}
}

func pathExists(path string) (bool, error) {
	_, err := os.Stat(path)
	if err == nil {
		return true, nil
	}
	if os.IsNotExist(err) {
		return false, nil
	}
	return false, err
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
