package cnki

import (
	"testing"
)

func TestSearch(t *testing.T) {
	c := NewCnki()
	c.Login("sh0130", "shjdts")
	res := c.Search("", "", "电化教育研究")
	for _, v := range res {
		c.Download(v.DownloadURL, "/home/lxl/Downloads/test", v.Title)
	}
}
