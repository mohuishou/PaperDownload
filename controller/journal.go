package controller

import (
	"log"
	"strconv"
	"strings"
	"time"

	"github.com/mohuishou/PaperDownload/spider/cnki"
)

//Journal 期刊下载
func Journal(name, dir string, start, end time.Time) {
	c := cnki.NewCnki()
	c.Login("sh0130", "shjdts")
	c.Search("", "", name)
	c.SearchResultOrder(1)
	res := c.SearchPage(1)
	for {
		log.Println("搜索结果获取成功，等待下载中...")
		for _, v := range res {
			t, err := time.Parse("2006-01-02", strings.Split(v.Time, " ")[0])
			if err != nil {
				log.Panicln(err)
				continue
			}
			if t.Unix() < start.Unix() {
				log.Println("成功： 下载完成")
				return
			}
			if t.Unix() > end.Unix() {
				continue
			}
			d := dir + "/" + strconv.Itoa(t.Year()) + "/" + strconv.Itoa(int(t.Month()))

			c.Download(v.DownloadURL, d, v.Title)
		}
		res = c.SearchNext()
	}

}
