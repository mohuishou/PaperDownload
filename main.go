package main

import (
	"runtime"
	"time"

	"github.com/mohuishou/PaperDownload/controller"
)

func main() {
	runtime.GOMAXPROCS(2)
	end, err := time.Parse("2006-01-02", "2017-09-01")
	start, err := time.Parse("2006-01-02", "2017-01-01")
	if err != nil {
		panic(err)
	}
	// ch := make(chan int, 2)
	// go (func() {
	controller.Journal("中国电化教育", "/home/lxl/work/lxl/Download/中国电化教育", start, end)
	// ch <- 0
	// })()
	// go (func() {
	controller.Journal("电化教育研究", "/home/lxl/work/lxl/Download/电化教育研究", start, end)
	// ch <- 0
	// })()
	// for i := 0; i < 2; i++ {
	// <-ch
	// }
}
