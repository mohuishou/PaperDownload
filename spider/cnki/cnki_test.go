package cnki

import (
	"fmt"
	"testing"
)

func TestSearch(t *testing.T) {
	c := NewCnki()
	fmt.Println(c.Search("", "", "电化教育研究"))
}
