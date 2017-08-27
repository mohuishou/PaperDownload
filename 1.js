var StartArray = new Array();
var FrameArray = new Array();
var BLOCK = new Object();

function RegisterFrame(e, a, f) {
	a = a.toLowerCase();
	if (a == "ccjd" || a == "cjsf" || a == "fcjd") {
		a = "cjfq"
	} else {
		if (a == "cdsf" || a.indexOf("cdbf") > -1) {
			a = "cdfd"
		} else {
			if (a == "cmsf" || a == "cmzd" || a.indexOf("cmbf") > -1) {
				a = "cmfd"
			}
		}
	}
	f += "&curdbcode=" + a;
	if (document.getElementById("listv")) {
		var b = document.getElementById("listv").value;
		f += "&vl=" + b
	}
	var d = '<iframe id="{0}" name="{0}" width="100%" height="0" frameborder="no" scrolling="no" src=""></iframe> ';
	document.write(d.format(e));
	var c = new Object();
	c.id = e;
	c.src = f;
	FrameArray.push(c)
}
function RegisterFrame_knet(c, d) {
	var b = '<iframe id="{0}" name="{0}" width="100%" height="0" frameborder="no" scrolling="no" src=""></iframe> ';
	document.write(b.format(c));
	var a = new Object();
	a.id = c;
	a.src = d;
	FrameArray.push(a)
}
function getDataUrl(d, b, c, f, a, g, h) {
	var e = "/kcms/detail/frame/asynlist.aspx?dbcode={0}&dbname={1}&filename={2}&curdbcode={3}&page={4}&reftype={5}&pl={6}";
	e = e.format(b, c, encodeURIComponent(d), f, g, a, h);
	return e
}
function getlDataUrl(d, b, c, f, a, g, h) {
	var e = "/kcms/detail/frame/listlite.aspx?dbcode={0}&dbname={1}&filename={2}&curdbcode={3}&page={4}&reftype={5}&pl={6}";
	e = e.format(b, c, d, f, g, a, h);
	return e
}
function getJDataUrl(d, b, c, f, a, g, h) {
	var e = "/kcms/detail/frame/jdata.aspx?dbcode={0}&dbname={1}&filename={2}&curdbcode={3}&page={4}&reftype={5}&pl={6}";
	e = e.format(b, c, d, f, g, a, h);
	return e
}
function getJsonUrl(d, b, c, f, a, g, h) {
	var e = "/kcms/detail/frame/json.aspx?dbcode={0}&dbname={1}&filename={2}&curdbcode={3}&page={4}&reftype={5}&pl={6}";
	e = e.format(b, c, d, f, g, a, h);
	return e
}
function getKMCUrl(d, b, c, f, a, g, h) {
	var e = "/kcms/detail/frame/kmc.aspx?dbcode={0}&dbname={1}&filename={2}";
	e = e.format(b, c, d);
	return e
}
function getPicUrl(f, d, c) {
	var b = getOuterBaseLink("COVER");
	var a = "";
	var g = "cjfd/small/{0}.jpg";
	var e = "cjfd/small/{0}/{0}{1}{2}.jpg";
	if (d && c) {
		a = e.format(f, d, c)
	} else {
		a = g.format(f)
	}
	return b + a
}
function getPicErrUrl() {
	return "/kcms/detail/resource/gb/images/nopic1.gif"
}
function getBaseInfoUrl(b, c) {
	var a = "/kcms/detail/frame/journalinfo.aspx?pykm={0}&dbcode={1}";
	a = a.format(c, b);
	return a
}
function getHYJCheckUrl(a) {
	var b = "/kcms/detail/frame/hyjinfo.aspx?code={0}";
	b = b.format(a);
	return b
}
function getFileNameUrl(a) {
	var b = "/kcms/detail/block/getfilename.aspx?filename={0}";
	b = b.format(a);
	return b
}
function RegisterJDLBk(f, e, d, c, h, a, b) {
	var g = new Object();
	g.SendRequest = function() {
		kBlock.addDL(f, d, e, c, h, 10, getDLUrl, getJDataUrl, getDropListHtml, getListObj, getError, getWait)
	};
	StartArray.push(g)
}
function RegisterJBk(j, d, c, e, g, a, b, h) {
	var f = new Object();
	f.SendRequest = function() {
		kBlock.add(j, c, d, e, g, h, getJDataUrl, getListObj, getError, a, b, getWait)
	};
	StartArray.push(f)
}
function RegCCNDWeb(a, e, f, c, d) {
	var b = new Object();
	b.SendRequest = function() {
		kBlock.add(a, f, e, f, c, 1, getJsonUrl, function(h, p) {
			var k = getJsonObj(h);
			if (k == null || k.Count == 0) {
				return
			}
			var l = k.Rows[0].WEB;
			if (l == "") {
				return
			}
			var n = "<a href='{1}' target='_blank'>{0}</a>";
			var q = "";
			var j = l.split(";");
			for (var g = 0; g < j.length; g++) {
				if (j[g] == "") {
					continue
				}
				if (g > 0) {
					q += ";"
				}
				var m = j[g].split(",");
				if (m.length != 2) {
					continue
				}
				q += n.format(m[0], m[1])
			}
			if (q == "") {
				return
			}
			if (document.getElementById("func" + p)) {
				document.getElementById("func" + p).innerHTML = q
			}
			if (d && document.getElementById(d)) {
				document.getElementById(d).style.display = "block"
			}
		}, getError)
	};
	StartArray.push(b)
}
function getListObj(a, b, c) {
	var e = getJsonObj(a);
	if (e == null || (e.Count == 0 && kBlock.IsFirstLoad(b))) {
		return
	}
	var d = "";
	d += getListItem(e);
	if (document.getElementById("func" + b)) {
		document.getElementById("func" + b).innerHTML = d
	}
	if (document.getElementById("page" + b)) {
		document.getElementById("page" + b).innerHTML = getPagerHtml(b, e.Page, e.PL, e.Count)
	}
	if (document.getElementById("title" + b)) {
		document.getElementById("title" + b).innerHTML = e.SName
	}
	if (document.getElementById("block" + b)) {
		document.getElementById("block" + b).style.display = "block"
	}
	if (c && document.getElementById(c)) {
		document.getElementById(c).style.display = "block"
	}
}
function getWait(a) {
	if (document.getElementById("func" + a)) {
		document.getElementById("func" + a).innerHTML = "正在查找..."
	}
}
function LoadKnetTitle(a, b) {
	if (!b) {
		return
	}
	$(".KnetTitle").append("<li><a onclick=turnToId('" + a + "')>" + b + "</a></li>")
}
function turnToId(a) {
	$("html,body").animate({
		scrollTop: $("#" + a).offset().top
	}, 500)
}
function RegisterSBlock(a, f, h, d, c, e) {
	var b = new Object();
	b.SendRequest = function() {
		kBlock.add(a, h, f, d, c, 10, getDataUrl, getListHtml, getError, e)
	};
	StartArray.push(b)
}
function getListHtml(oReq, t, g) {
	var id = "func" + t;
	var con = document.getElementById(id);
	if (con == null) {
		return
	}
	if (oReq.responseText != "") {
		con.innerHTML = oReq.responseText;
		con.style.display = "block";
		if (g && document.getElementById(g)) {
			document.getElementById(g).display = "block"
		}
		if (t == "601") {
			if (document.getElementById("auinfodata")) {
				var auinfodata = document.getElementById("auinfodata").value;
				if (auinfodata != "") {
					auinfodata = eval(auinfodata);
					renderAu(auinfodata)
				}
			}
			if (document.getElementById("CoAuChartdata")) {
				var chartref = document.getElementById("CoAuChartdata").value;
				if (chartref != "") {
					RenderCoAuChart(chartref)
				}
			}
		}
		if (document.getElementById("kwinfodata") && t == "602") {
			var kwinfodata = document.getElementById("kwinfodata").value;
			if (kwinfodata != "") {
				kwinfodata = eval(kwinfodata);
				RenderLineChart(kwinfodata)
			}
		}
		if (document.getElementById("refchartdata") && t == "607") {
			var chartref = document.getElementById("refchartdata").value;
			if (chartref != "") {
				RenderRefChart(chartref)
			}
		}
		if (document.getElementById("CoAuChartdata") && t == "614") {
			var chartref = document.getElementById("CoAuChartdata").value;
			if (chartref != "") {
				RenderCoAuChart(chartref)
			}
		}
		if ($("#catalog_func" + t).html()) {
			$("#lcatalog_func" + t).show()
		}
	}
}
function RegImage(d, b, a, c) {
	var e = new Object();
	e.SendRequest = function() {
		ImageLoader(getPicUrl(d, b, a), c, getPicErrUrl())
	};
	StartArray.push(e)
}
function RegDujia(d, e, c, b, a) {
	var f = new Object();
	f.SendRequest = function() {
		ImageLoader(getPicUrl(e, c, b), a, getPicErrUrl());
		kSendRequset(getBaseInfoUrl(d, e), function(g) {
			var h = getJsonObj(g);
			if (h != null) {
				if (h.IsT.toLowerCase() == "true") {
					$(".cover").addClass("dujia")
				}
			}
		}, function(g) {})
	};
	StartArray.push(f)
}
function RegCheckJournal(d, e, c, b) {
	var f = new Object();
	var a = "<a target='_blank' href='{0}'>{1}</a>";
	f.SendRequest = function() {
		kSendRequset(getBaseInfoUrl(d, e), function(k) {
			var l = getJsonObj(k);
			if (l != null) {
				if (l.pykm.toLowerCase() == e.toLowerCase()) {
					var g = document.getElementById("jname");
					var h = document.getElementById("jnameen");
					var j = document.getElementById("jnq");
					if (g) {
						g.innerHTML = a.format(getNaviLink(d, e), g.innerHTML)
					}
					if (h) {
						h.innerHTML = a.format(getNaviLink(d, e), h.innerHTML)
					}
					if (j) {
						j.innerHTML = a.format(getNaviIssueLink(d, e, c, b), j.innerHTML)
					}
				}
			}
		}, function(g) {})
	};
	StartArray.push(f)
}
function RegCheckHYJ(b, c) {
	var d = new Object();
	var a = "<a target='_blank' href='{0}'>{1}</a>";
	d.SendRequest = function() {
		kSendRequset(getHYJCheckUrl(b), function(f) {
			var g = getJsonObj(f);
			if (g != null) {
				if (g.HYJCode.toLowerCase() == b.toLowerCase()) {
					var e = document.getElementById("jname");
					if (e) {
						e.innerHTML = a.format(getHYJNaviUrl(b, c), e.innerHTML)
					}
				}
			}
		}, function(e) {})
	};
	StartArray.push(d)
}
function RegFileName(a, b, c) {
	var e = new Object();
	var d = "detail.aspx?filename={0}&dbname={1}&dbcode=CJFQ";
	e.SendRequest = function() {
		kSendRequset(getFileNameUrl(a), function(f) {
			var g = getJsonObj(f);
			if (g != null) {
				if (g.fn != "" && g.dn != "") {
					d = d.format(g.fn, g.dn);
					document.getElementById(b).href = d;
					document.getElementById(c).style.display = ""
				}
			}
		}, function(f) {})
	};
	StartArray.push(e)
}
function RegisterKMC(a, e, f, d, c) {
	var b = new Object();
	b.SendRequest = function() {
		kBlock.add(a, f, e, d, c, 10, getKMCUrl, getKMCHtml, null)
	};
	StartArray.push(b)
}
function RegAd(b, g, c, d, f, h) {
	link = getOuterBaseLink("AD");
	if (link == "") {
		return
	}
	var e = link + "GetADInfo.aspx?area={0}&kw={1}&pykm={2}&sc={3}&title={4}";
	e = e.format(g, encodeURIComponent(c), d, f, encodeURIComponent(h));
	var a = new Object();
	a.SendRequest = function() {
		var j = document.getElementById(b);
		if (j) {
			var k = function() {
					j.style.display = "block"
				};
			if (j.attachEvent) {
				j.attachEvent("onload", k)
			} else {
				j.onload = k
			}
			j.src = e
		}
	};
	StartArray.push(a)
}
function getKMCHtml(g, d) {
	var j = getJsonObj(g);
	var e = "";
	var h = "";
	var s = "";
	var a = "";
	var u = new Object();
	for (var f = 0; f < j.Rows.length; f++) {
		var k = j.Rows[f];
		if (k.KMC_CN != "") {
			if (u[k.KMC_CN] == undefined) {
				u[k.KMC_CN] = 1;
				e += getKmLink(j.PC, k.KMC_CN, k.KMC_CODE);
				if (f != j.Rows.length - 1) {
					e += "；"
				}
			}
		}
		if (k.KMC_EN != "") {
			if (u[k.KMC_EN] == undefined) {
				u[k.KMC_EN] = 1;
				h += getKmLink(j.PC, k.KMC_EN, k.KMC_CODE);
				if (f != j.Rows.length - 1) {
					h += "；"
				}
			}
		}
		if (k.MKMC_CN != "") {
			if (u[k.MKMC_CN] == undefined) {
				u[k.MKMC_CN] = 1;
				s += getKmLink(j.PC, k.MKMC_CN, k.MKMC_CODE);
				if (f != j.Rows.length - 1) {
					e += "；"
				}
			}
		}
		if (k.MKMC_EN != "") {
			if (u[k.MKMC_EN] == undefined) {
				u[k.MKMC_EN] = 1;
				a += getKmLink(j.PC, k.MKMC_EN, k.MKMC_CODE);
				if (f != j.Rows.length - 1) {
					h += "；"
				}
			}
		}
	}
	var c = document.getElementById("kmccontentcn");
	var b = document.getElementById("kmccn");
	var r = document.getElementById("kmccontenten");
	var q = document.getElementById("kmcen");
	var p = document.getElementById("mkmccontentcn");
	var m = document.getElementById("mkmccn");
	var l = document.getElementById("mkmccontenten");
	var n = document.getElementById("mkmcen");
	if (c && b && e != "") {
		c.innerHTML = e;
		b.style.display = ""
	}
	if (r && q && h != "") {
		r.innerHTML = h;
		q.style.display = ""
	}
	if (p && b && s != "") {
		p.innerHTML = s;
		b.style.display = ""
	}
	if (l && q && a != "") {
		p.innerHTML = a;
		q.style.display = ""
	}
}
function RegItem(a, d, e, f) {
	var g = new Object();
	g.SendRequest = function() {
		kBlock.add(a, "CJFQ", "", "CJFQ", d, 1, getJsonUrl, getDataItem, null, f, e)
	};
	StartArray.push(g)
}
function getDataItem(a, e, f) {
	var d = getJsonObj(a);
	if (d == null) {
		return
	}
	if (d.Rows.length == 0) {
		return
	}
	d = d.Rows[0][f];
	document.getElementById(f).innerHTML += d;
	document.getElementById(e).style.display = "block"
}
function RegisterStartLoad(a) {
	StartArray.push(a)
}
function startLoad() {
	for (var a = 0; a < StartArray.length; a++) {
		StartArray[a].SendRequest()
	}
	for (a = 0; a < FrameArray.length; a++) {
		document.getElementById(FrameArray[a].id).src = FrameArray[a].src
	}
	FrameArray = null
}
window.onload = startLoad;

function CallRequest(a) {
	var b = new Object();
	b.SendRequest = function() {
		a()
	};
	StartArray.push(b)
}
function _sendRequset(c, b, d) {
	var a = zXmlHttp.createRequest();
	if (a != null) {
		a.open("get", c, true);
		a.onreadystatechange = function() {
			if (a.readyState == 4) {
				if (a.status == 200) {
					b(a, d)
				}
			}
		};
		a.send(null)
	}
}
function getNodeValue(c, a) {
	if (c == null) {
		return ""
	}
	var b = c.getElementsByTagName(a);
	if (b == null) {
		return ""
	}
	if (b.length > 0) {
		if (b[0].text != "undefined" && b[0].text != undefined) {
			return b[0].text
		} else {
			return b[0].textContent
		}
	}
	return ""
}
function RefCountClass() {
	this.DataUrl = null;
	this.FileName = null;
	this.DbCode = null;
	this.DbName = null;
	this.Year = null;
	this.Link = null;
	this.Target = null;
	this.TargetLink = null;
	this.ParamListV = document.getElementById("listv").value;
	this.getRefChartDataUrl = function() {
		var url = this.DataUrl + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
		return url
	};
	this.getRefUrlBase = function() {
		var url = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
		return url
	};
	this.getRefUrl = function(reftype) {
		var url = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&dbname=" + this.DbName + "&RefType=" + reftype + "&vl=" + this.ParamListV;
		return url
	};
	this.setRefLinkResult = function(reftype, count) {
		var nCount = Number(count);
		if (nCount < 1) {
			return
		}
		var linkid = "rl" + reftype;
		var countid = "rc" + reftype;
		var oA = document.getElementById(linkid);
		var oC = document.getElementById(countid);
		oA.href = this.getRefUrl(reftype);
		oA.target = this.Target;
		var sFunc = "return ChangeReferType('" + reftype + "')";
		oA.onclick = Function(sFunc);
		oC.innerHTML = "(" + count + ")";
		if (this.TargetLink == null) {
			this.TargetLink = oA.href;
			document.getElementById(this.Target).src = this.TargetLink;
			oA.className = "ReferLinkOn"
		}
	};
	this.setTotalCount = function(oRef) {
		this.setRefLinkResult(1, oRef.REFERENCE);
		this.setRefLinkResult(2, oRef.SUB_REFERENCE);
		this.setRefLinkResult(3, oRef.CITING);
		this.setRefLinkResult(4, oRef.SUB_CITING);
		this.setRefLinkResult(5, oRef.CO_CITING);
		this.setRefLinkResult(6, oRef.CO_CITED);
		if (oRef.REFERENCE == "0" && oRef.CITING == "0") {
			$("#MapTitle").hide();
			$("#MapArea").hide();
			$("#catalog_ref").hide();
			$("#ref_nodata").show()
		} else {
			$("#ref_nodata").hide();
			$("#MapTitle").show();
			$("#MapArea").show();
			$("#catalog_ref").show()
		}
	};
	this.OnRefChartDataReceive = function(oXmlDom, obj) {
		var strJson = oXmlDom.responseText;
		if (strJson == "") {
			return
		}
		var oRef = eval("(" + strJson + ")");
		obj.setTotalCount(oRef)
	};
	this.SendRequest = function() {
		_sendRequset(this.getRefChartDataUrl(), this.OnRefChartDataReceive, this)
	}
}
function RefYearClass() {
	this.DataUrl = null;
	this.FileName = null;
	this.DbCode = null;
	this.DbName = null;
	this.Year = null;
	this.Link = null;
	this.Target = null;
	this.TargetLink = null;
	this.ParamListV = document.getElementById("listv").value;
	this.getRefChartDataUrl = function() {
		var a = this.DataUrl + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
		return a
	};
	this.getRefUrlBase = function() {
		var a = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
		return a
	};
	this.getRefUrl = function(a) {
		var b = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&dbname=" + this.DbName + "&RefType=" + a + "&vl=" + this.ParamListV;
		return b
	};
	this.setTimeItem = function(a, c, d) {
		var b = Number(getNodeValue(a, d));
		if (b > 0) {
			if (this.Year != c) {
				AddToTimeArray(c, b, d)
			} else {
				AddCurTime(b, d)
			}
		}
	};
	this.setYearItem = function(a) {
		var b = getNodeValue(a, "YEAR");
		this.setTimeItem(a, b, "REFERENCE");
		this.setTimeItem(a, b, "SUB_REFERENCE");
		this.setTimeItem(a, b, "CITING");
		this.setTimeItem(a, b, "SUB_CITING")
	};
	this.setYearCount = function(c) {
		if (!c) {
			return
		}
		var a = c.getElementsByTagName("Item");
		for (var b = 0; b < a.length; b++) {
			this.setYearItem(a[b])
		}
		if (this.Year != "" && this.Year != null) {
			RenderTimeAxis(this.Year, this.getRefUrlBase(), this.Target)
		}
	};
	this.OnRefChartDataReceive = function(b, e) {
		var d = b.responseXML.documentElement;
		if (d == null) {
			return
		}
		var a = d.nodeName;
		if (a == "Error") {
			alert(a + ":" + d.text);
			return
		}
		var c = d.getElementsByTagName("YEARCOUNT");
		if (c == null) {
			return
		}
		e.setYearCount(c[0])
	};
	this.SendRequest = function() {
		_sendRequset(this.getRefChartDataUrl(), this.OnRefChartDataReceive, this)
	}
}
function RefChartObj() {
	this.DataUrl = null;
	this.FileName = null;
	this.DbCode = null;
	this.DbName = null;
	this.Year = null;
	this.Link = null;
	this.Target = null;
	this.TargetLink = null;
	this.ParamListV = document.getElementById("listv").value;
	this.getRefChartDataUrl = function() {
		var a = this.DataUrl + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
		return a
	};
	this.getRefUrlBase = function() {
		var a = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&vl=" + this.ParamListV;
		return a
	};
	this.getRefUrl = function(a) {
		var b = this.Link + "?dbcode=" + this.DbCode + "&filename=" + this.FileName + "&dbname=" + this.DbName + "&RefType=" + a + "&vl=" + this.ParamListV;
		return b
	};
	this.setRefLinkResult = function(d, h) {
		var a = Number(h);
		if (a < 1) {
			return
		}
		var g = "rl" + d;
		var c = "rc" + d;
		var e = document.getElementById(g);
		var f = document.getElementById(c);
		e.href = this.getRefUrl(d);
		e.target = this.Target;
		var b = "return ChangeReferType('" + d + "')";
		e.onclick = Function(b);
		f.innerHTML = "(" + h + ")";
		if (this.TargetLink == null) {
			this.TargetLink = e.href;
			document.getElementById(this.Target).src = this.TargetLink;
			e.className = "ReferLinkOn"
		}
	};
	this.setTotalCount = function(a) {
		this.setRefLinkResult(1, getNodeValue(a, "REFERENCE"));
		this.setRefLinkResult(2, getNodeValue(a, "SUB_REFERENCE"));
		this.setRefLinkResult(3, getNodeValue(a, "CITING"));
		this.setRefLinkResult(4, getNodeValue(a, "SUB_CITING"));
		this.setRefLinkResult(5, getNodeValue(a, "CO_CITING"));
		this.setRefLinkResult(6, getNodeValue(a, "CO_CITED"))
	};
	this.setTimeItem = function(a, c, d) {
		var b = Number(getNodeValue(a, d));
		if (b > 0) {
			AddToTimeArray(c, b, d)
		}
	};
	this.setYearItem = function(a) {
		var b = getNodeValue(a, "YEAR");
		this.setTimeItem(a, b, "REFERENCE");
		this.setTimeItem(a, b, "SUB_REFERENCE");
		this.setTimeItem(a, b, "CITING");
		this.setTimeItem(a, b, "SUB_CITING")
	};
	this.setYearCount = function(c) {
		var a = c.getElementsByTagName("Item");
		for (var b = 0; b < a.length; b++) {
			this.setYearItem(a[b])
		}
		if (this.Year != "" && this.Year != null) {
			RenderTimeAxis(this.Year, this.getRefUrlBase(), this.Target)
		}
	};
	this.OnRefChartDataReceive = function(b, f) {
		var d = b.responseXML.documentElement;
		if (d == null) {
			return
		}
		var a = d.nodeName;
		if (a == "Error") {
			alert(a + ":" + d.text);
			return
		}
		var e = d.getElementsByTagName("TOTAL");
		if (e == null) {
			return
		}
		f.setTotalCount(e[0]);
		var c = d.getElementsByTagName("YEARCOUNT");
		if (c == null) {
			return
		}
		f.setYearCount(c[0])
	};
	this.SendRequest = function() {
		_sendRequset(this.getRefChartDataUrl(), this.OnRefChartDataReceive, this)
	}
}
function SetRefChartData(c, b, e, a) {
	var d = new RefChartObj();
	d.DataUrl = "/kcms/detail/block/refchartdata.aspx";
	d.DbCode = c;
	d.FileName = b;
	d.Link = "/kcms/detail/frame/list.aspx";
	d.Target = "frame1";
	if (a == null || a == "") {}
	d.Year = a;
	RegisterStartLoad(d)
}
function SetRefChartDataEx(d, c, f, b) {
	var a = new RefCountClass();
	a.DataUrl = "/kcms/detail/block/refcount.aspx";
	a.DbCode = d;
	a.FileName = c;
	a.DbName = f;
	a.Link = "/kcms/detail/frame/list.aspx";
	a.Target = "frame1";
	a.Year = b;
	RegisterStartLoad(a);
	var e = new RefYearClass();
	e.DataUrl = "/kcms/detail/block/refyear.aspx";
	e.DbCode = d;
	e.FileName = c;
	e.Link = "/kcms/detail/frame/list.aspx";
	e.Target = "frame1";
	e.Year = b;
	RegisterStartLoad(e)
}
function OpenUrl(a) {
	window.open(a)
}
function HideAd(a, b) {
	document.getElementById(b).style.display = "none";
	document.getElementById(a).style.width = "100%"
}
function ReplaceRedMark(e) {
	var c = /###/g;
	var d = /\$\$\$/g;
	var a = /###[^#]+\$\$\$/g;
	var b = /title=\"[^\"]*\"/gi;
	e = e.replace(b, function(f) {
		f = f.replace(c, "");
		f = f.replace(d, "");
		return f
	});
	e = e.replace(a, function(f) {
		f = f.replace(c, "<font class='Mark'>");
		f = f.replace(d, "</font>");
		return f
	});
	e = e.replace(c, "");
	e = e.replace(d, "");
	return e
}
var g_ssenable = false;

function EnableSnapShot(a) {
	a.value = "";
	g_ssenable = true
}
function StartSnapShotSearch(e, a, f) {
	var c = "block/snapshotdata.aspx?fn={0}&dn={1}&dc={2}&kw={3}";
	var b = document.getElementById("SnapshotSearchItem").value;
	if (b == "" || g_ssenable == false) {
		return alert(SNAPSHOT_ALERT)
	}
	var d = c.format(a, f, e, encodeURIComponent(b));
	kSendRequset(d, function(h) {
		var k = h.responseText;
		if (k != "") {
			var g = document.getElementById("divSnapshotSearchText");
			var j = document.getElementById("divSnapshotSearchContent");
			j.style.display = "block";
			k = ReplaceRedMark(k);
			g.innerHTML = k
		}
	}, function(g) {})
}
function ResetSnapShot() {
	var b = document.getElementById("divSnapshotSearchContent");
	b.style.display = "none";
	var a = document.getElementById("divSnapshotSearchText");
	a.innerHTML = "";
	check = 0;
	document.getElementById("SnapshotSearchItem").value = ""
}
function ShowAd(c, b) {
	var e = document.getElementById(c);
	var d = document.getElementById(b);
	if (e == null || d == null) {
		return
	}
	var a = d.innerHTML;
	if (a.length < 200) {
		return
	}
	e.innerHTML = a;
	e.style.display = "block"
}
function SearchLink(e, f, j, c) {
	var b = "search.aspx?dbcode={0}&sfield={1}&skey={2}&filename={3}";
	var h = '<a href="{0}" target="_blank">{1}</a>';
	var g = e.split(";");
	var d = "";
	for (var a = 0; a < g.length; a++) {
		if (g[a] != "") {
			d += h.format(b.format(j, f, encodeURIComponent(g[a]), c), g[a]);
			if (a != g.length - 1) {
				d += "；"
			}
		}
	}
	document.write(d)
}
function kwPop(a, b, e, f) {
	g_Keep1++;
	var m = "kmc";
	if (e == "") {
		m = "kw"
	}
	var k = f.srcElement ? f.srcElement : f.target;
	var g = document.getElementById("kwPop");
	if (!g) {
		return
	}
	var l = "search.aspx?dbcode={0}&sfield={1}&skey={2}&code={3}";
	var j = '<a href="{0}" target="_blank">{1}</a>';
	var c = j.format(l.format(b, "meta", encodeURIComponent(a), ""), "• 知识元");
	var h = GetRefBookLink(encodeURIComponent(a));
	if (h != "") {
		h = j.format(h, "• 工具书")
	}
	var d = j.format(l.format(b, m, encodeURIComponent(a), e), "• 文献检索");
	g.innerHTML = c + h + d;
	g.style.left = getElementLeft(k) + "px";
	g.style.top = Number(getElementTop(k)) + 13 + "px";
	setTimeout(function() {
		g.style.display = "block"
	}, 100)
}
var g_Keep1 = 0;
var g_Keep2 = 0;

function kwHide(g, c) {
	if (g == 1) {
		g_Keep1--
	}
	if (g == 2) {
		g_Keep2--
	}
	var f = document.getElementById("kwPop");
	if (!f) {
		return
	}
	var d = c;
	var b = (document.all) ? d.srcElement : d.target;
	var a = (document.all) ? d.toElement : d.relatedTarget;
	setTimeout(function() {
		if ((g == 2 && g_Keep1 < 1)) {
			if (b.nodeName != "DIV") {
				return
			}
			while (a != b && a.nodeName != "BODY") {
				a = a.parentNode
			}
			if (a == b) {
				return
			}
			f.style.display = "none"
		} else {
			if ((g == 1 && g_Keep2 < 1)) {
				f.style.display = "none"
			}
		}
	}, 100)
}
function kwKeep() {
	g_Keep2++
}
function RegisterKw(c, b) {
	var a = new Object();
	a.SendRequest = function() {
		var e = document.getElementById(b);
		if (!e) {
			return
		}
		var g = e.innerHTML.split("；");
		var d = "";
		for (var f = 0; f < g.length; f++) {
			g[f] = g[f].replace(/[\s]*/g, "");
			if (g[f] != "") {
				d += getKmLink(c, g[f], "") + "； "
			}
		}
		e.innerHTML = d
	};
	StartArray.push(a)
}
function getKmLink(d, b, c) {
	var a = "<a onmouseover=\"kwPop('{0}','{1}','{2}',event)\" onmouseout='kwHide(1,event)' >{0}<a>";
	return a.format(b, d, c)
}
function mousePosition(a) {
	if (a.pageX || a.pageY) {
		return {
			x: a.pageX,
			y: a.pageY
		}
	}
	if (document.body.scrollTop) {
		return {
			x: a.clientX - document.body.clientLeft + document.body.scrollLeft,
			y: a.clientY - document.body.clientTop + document.body.scrollTop
		}
	}
	return {
		x: a.clientX - document.body.clientLeft + document.documentElement.scrollLeft,
		y: a.clientY - document.body.clientTop + document.documentElement.scrollTop
	}
}
function getElementLeft(b) {
	var c = b.offsetLeft;
	var a = b.offsetParent;
	while (a !== null) {
		c += a.offsetLeft;
		a = a.offsetParent
	}
	return c
}
function getElementTop(b) {
	var c = b.offsetTop;
	var a = b.offsetParent;
	while (a !== null) {
		c += a.offsetTop;
		a = a.offsetParent
	}
	return c
}
function GetRelKw(a, b) {
	CallRequest(function() {
		var g = "";
		var l = '<tr><td align="center">{0}</td><td>{1}</td><td align="center">{2}</td></tr>';
		var d = '<a target="_blank" href="keyword.aspx?v={0}">{1}</a> ';
		var f = a.split(";");
		var e = 10;
		if (f.length < e) {
			e = f.length
		}
		for (var c = 0; c < e; c++) {
			var h = f[c].split(":");
			if (h.length == 2) {
				var k = h[0];
				var m = h[1];
				g += l.format(c + 1, d.format(encodeURIComponent(k), k), m)
			}
		}
		var j = '<tr><th width="40">序号</th><th>关键词</th><th width="100">共现频次↓</th></tr>';
		document.getElementById(b).innerHTML = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tabinfo" >' + j + g + "</table>"
	})
}
function getExplanUrl(a) {
	return "block/explan.aspx?v=" + encodeURIComponent(a)
}
function RegTranslate(a, c, b) {
	CallRequest(function() {
		kSendRequset(getTranslateUrl(a, c), function(d) {
			document.getElementById(b).innerHTML = d.responseText
		}, null)
	})
}
function getTranslateUrl(a, b) {
	return "block/translate.aspx?v={0}&l={1}".format(encodeURIComponent(a), b)
}
function RegKwAuthor(a, c) {
	var b = "block/kwauthor.aspx?v={0}".format(encodeURIComponent(a));
	CallRequest(function() {
		kSendRequset(b, function(n) {
			var j = getJsonObj(n);
			var g = "";
			var m = '<tr><td align="center">{0}</td><td>{1}</td><td align="center">{2}</td></tr>';
			var l = 0;
			for (var d = 0; d < j.Rows.length; d++) {
				var f = j.Rows[d];
				var k = f.AU_CN;
				var h = f.AU_CODE;
				var o = f.c;
				if (k == h) {
					continue
				}
				g += m.format(d + 1, k, o);
				l++;
				if (l == 10) {
					break
				}
			}
			var e = '<tr><th width="40">序号</th><th>作者</th><th width="100">引词频次↓</th></tr>';
			document.getElementById(c).innerHTML = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tabinfo" >' + e + g + "</table>"
		}, null)
	})
}
function RegKwSub(a, c) {
	var b = "block/kwsub.aspx?v={0}".format(encodeURIComponent(a));
	CallRequest(function() {
		kSendRequset(b, function(g) {
			var j = getJsonObj(g);
			var h = "";
			var n = '<td  width="50" align="center"><a href="javascript:void(0)" onclick="RequSubFile(\'{2}\',\'{3}\',\'subfile\',1)">{0}{1}</a></td>';
			var m = "<tr>{0}</tr>";
			var l = 0;
			var f = "";
			var o = j.Count;
			var k = "";
			for (var d = 0; d < 5; d++) {
				if (d < o) {
					var e = j.Rows[d];
					if (k == "") {
						k = e.ZT_CODE
					}
					f += n.format(e.专题名, "(" + e.c + ")", a, e.ZT_CODE)
				}
			}
			if (f != "") {
				h += m.format(f)
			}
			if (o > 5) {
				f = "";
				for (var d = 5; d < 10; d++) {
					if (d < o) {
						var e = j.Rows[d];
						f += n.format(e.专题名, "(" + e.c + ")", a, e.ZT_CODE)
					} else {
						f += n.format("", "", "", "")
					}
				}
				h += m.format(f)
			}
			document.getElementById(c).innerHTML = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tabinfo" >' + h + "</table>";
			if (k != "") {
				RequSubFile(a, k, "subfile", 1)
			}
		}, null)
	})
}
function RequSubFile(b, a, d, e) {
	var c = "block/kwsubfile.aspx?v={0}&s={1}&p={2}".format(encodeURIComponent(b), a, e);
	document.getElementById(d).innerHTML = "正在请求...";
	kSendRequset(c, function(f) {
		var h = getJsonObj(f);
		var l = '<li>[{7}].{0}.<a target="_blank" href="detail.aspx?dbcode=CJFQ&dbname={2}&filename={3}">{1}</a>. {4}. {5}({6})</li>';
		var g = "";
		for (var j = 0; j < h.Rows.length; j++) {
			var k = h.Rows[j];
			g += l.format(k.AU_CN, k.TI_CN, k.TABLE, k.FN, k.SRC, k.YEAR, k.ISSUE, j + 1)
		}
		if (g != "") {
			document.getElementById(d).innerHTML = g
		}
	}, null)
}
function RegChart(a, b) {
	CallRequest(function() {
		var c = document.getElementById(b);
		c.onload = function() {};
		c.src = "frame/ztchart.aspx?kw=" + encodeURIComponent(a)
	})
}
function GetWbTitle() {
	var b = encodeURIComponent(document.title.substring(0, 76));
	var a = document.title.split("-")[0].toString().replace(/[ ]/g, "");
	var c = document.getElementById("hidtitle").value;
	if (c != "") {
		b = encodeURIComponent(a + "-" + c)
	}
	b = b + "--文献出自中国知网";
	return b
}
function ShareWeibo_xl() {
	var a = GetWbTitle();
	window.open("http://v.t.sina.com.cn/share/share.php?title=" + a + "&url=" + encodeURIComponent(location.href) + "&source=bookmark", "_blank", "width=450,height=400, menubar=no, scrollbars=no,resizable=yes,location=no, status=no")
}
function ShareWeibo_wy() {
	var a = GetWbTitle();
	var b = "link=http://news.163.com/&source=" + encodeURIComponent("网易新闻") + "&info=" + a + " " + encodeURIComponent(document.location.href);
	window.open("http://t.163.com/article/user/checkLogin.do?" + b + "&" + new Date().getTime(), "newwindow", "height=330,width=550,top=" + (screen.height - 280) / 2 + ",left=" + (screen.width - 550) / 2 + ",toolbar=no, menubar=no, scrollbars=no,resizable=yes,location=no, status=no")
}
function ShareWeibo_tx() {
	var e = encodeURIComponent(document.title);
	var g = document.title.split("-")[0].toString().replace(/[ ]/g, "");
	var h = document.getElementById("hidtitle").value;
	if (h != "") {
		e = encodeURIComponent(g + "-" + h)
	}
	var j = encodeURIComponent(document.title);
	var f = encodeURIComponent(document.location);
	var d = encodeURI("appkey");
	var b = encodeURI("");
	var a = "";
	var c = "http://v.t.qq.com/share/share.php?title=" + e + "&url=" + f + "&appkey=" + d + "&site=" + a + "&pic=" + b;
	window.open(c, "转播到腾讯微博", "width=700, height=680, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, location=yes, resizable=no, status=no")
}
function ShareWeibo_rr() {
	var a = GetWbTitle();
	window.open("http://share.renren.com/share/buttonshare.do?link=" + encodeURIComponent(document.location.href) + "&title=" + a, "_blank", "scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes")
}
function ShareWeibo_kx() {
	var a = GetWbTitle();
	window.open("http://www.kaixin001.com/repaste/share.php?rtitle=" + a + "&rurl=" + encodeURIComponent(location.href) + "&rcontent=", "_blank", "scrollbars=no,width=600,height=450,left=75,top=20,status=no,resizable=yes")
}
function ShareWeibo_db(b) {
	var a = GetWbTitle();
	window.open("http://www.douban.com/recommend/?url=" + encodeURIComponent(location.href) + "&V=1&title=" + a, "douban", "toolbar=0,resizable=1,scrollbars=yes,status=1,width=450,height=330")
}
function GetShareWeibosRight(a) {
	var b = "<div id='common_box' class='shareDiv' onmouseover='showshare()' onmouseout='closeshare()'><div id='cli_on' class='sharehd'>分享到</div>" + ShareAstr("sharebd") + "</div>";
	document.write(b)
}
function showshare() {
	document.getElementById("common_box").style.width = "232px"
}
function closeshare() {
	document.getElementById("common_box").style.width = "32px"
}
function ge(a) {
	return document.getElementById(a)
}
function newsetCookie(h, c) {
	var a = 7;
	var j = new Date();
	j.setTime(j.getTime() + a * 24 * 60 * 60 * 1000);
	var k = "";
	if (newgetCookie(h) != null) {
		k = newgetCookie(h)
	}
	var e;
	var d;
	if (c == "") {
		e = getTestTitle();
		d = document.URL;
		var g = getQueryString("dbcode");
		var f = getQueryString("dbname");
		var b = getQueryString("filename");
		c = e + "!" + g + "!" + f + "!" + b
	}
	if (!IsIndexOfTheValue(k, e)) {
		document.cookie = h + "=" + escape(c + "|" + k) + ";expires=" + j.toGMTString() + ";path=/"
	}
}
function IsSupHTML5() {
	return window.localStorage ? true : false
}
function newsetCookie7(d, c) {
	var a = 7;
	var g = new Date();
	g.setTime(g.getTime() + a * 24 * 60 * 60 * 1000);
	var h = "";
	if (newgetCookie7(d) != null) {
		h = newgetCookie7(d)
	}
	if (c == "") {
		title = getTestTitle();
		url = document.URL;
		var f = getQueryString("dbcode");
		var e = getQueryString("dbname");
		var b = getQueryString("filename");
		c = title + "!" + f + "!" + e + "!" + b;
		c = b + "!" + f + "!" + e + "<!>" + title + "<!>" + url
	}
	if (h != null && h != "" && h != "<#>") {
		if (!IsIndexOfTheValue(h, $.trim(c))) {
			if (IsSupHTML5()) {
				localStorage.setItem(d, c + "<#>" + h)
			} else {
				document.cookie = d + "=" + escape(c + "<#>" + h) + ";expires=" + g.toGMTString() + ";path=/"
			}
		}
	} else {
		if (this.IsSupHTML5()) {
			localStorage.setItem(d, c + "<#>")
		} else {
			document.cookie = d + "=" + escape(c + "<#>") + ";expires=" + g.toGMTString() + ";path=/"
		}
	}
}
function newgetCookie7(a) {
	var d = "";
	if (IsSupHTML5()) {
		d = localStorage.getItem(a)
	} else {
		var b, c = new RegExp("(^| )" + a + "=([^;]*)(;|$)");
		if (b = document.cookie.match(c)) {
			d = unescape(b[2])
		}
	}
	if (d == null) {
		d = ""
	}
	return d
}
function getTestTitle() {
	var a = document.title;
	var c = a.split("-");
	if (c.length > 2) {
		a = "";
		for (var b = 0; b < c.length - 1; b++) {
			a += c[b].toString()
		}
	} else {
		a = document.title.split("-")[0].toString().replace(/[ ]/g, "")
	}
	return a.replace("!", "")
}
function IsIndexOfTheValue(b, f) {
	var a = b;
	var e = false;
	var c = "";
	if (a != null) {
		for (var d = 0; d < a.length; d++) {
			if (a[d] != "|") {
				c += a[d]
			} else {
				if (c.indexOf(f) > -1) {
					e = true;
					return e
				}
				c = ""
			}
		}
	}
	return e
}
function newgetCookie(a) {
	var b, c = new RegExp("(^| )" + a + "=([^;]*)(;|$)");
	if (b = document.cookie.match(c)) {
		return unescape(b[2])
	} else {
		return null
	}
}
function newdelCookie(b) {
	var a = new Date();
	a.setTime(a.getTime() - 1);
	var c = newgetCookie(b);
	if (c != null) {
		document.cookie = b + "=|;expires=" + a.toGMTString() + ";path=/"
	}
	if (b == "UserSeesKcms") {
		ge("usersee_hiscontent").innerHTML = ""
	} else {
		if (b == "UserDownLoadsKcms") {
			ge("userdowmn_hiscontent").innerHTML = ""
		}
	}
}
function newhisresult_ll() {
	var l;
	var m;
	m = newgetCookie("UserSeesKcms");
	newsetC("UserSeesKcms", m);
	m = newgetCookie("UserSeesKcms");
	var j = 0;
	if (m != null) {
		l = "<ul class='listSpan' >";
		var e = "";
		var k = "";
		var a = "http://epub.cnki.net/kns/detail/detail.aspx?dbcode={0}&dbname={1}&filename={2}";
		var b = m.split("|");
		var g = 0;
		for (var h = 0; h < b.length; h++) {
			if (!b[h] || b[h] == "") {
				continue
			} else {
				var f = b[h].split("!");
				var d = "<li><a href='" + a.format(f[1], f[2], f[3]) + "'>" + f[0] + "</a></li>";
				l += d
			}
			g++
		}
		l += "</ul>";
		l += "<span><a onclick=\"newdelCookie('UserSeesKcms')\"  href='javascript:void(0)' style='margin-left:160px;'>清空</a></span>";
		if (g > 0) {
			ge("usersee_hiscontent").innerHTML = l;
			ge("usersee_his").style.display = "block"
		} else {
			ge("usersee_his").style.display = "none"
		}
	}
}
function newsetC(d, h) {
	var g = "";
	if (h != null && h != "") {
		var c = h.split("|");
		for (var a = 0; a < c.length; a++) {
			if (a < 10) {
				var e = c[a].split("!");
				if (g.indexOf(e[0]) < 0) {
					g += c[a] + "|"
				}
			}
		}
		newdelCookie(d);
		var b = 7;
		var f = new Date();
		f.setTime(f.getTime() + b * 24 * 60 * 60 * 1000);
		document.cookie = d + "=" + escape(g) + ";expires=" + f.toGMTString() + ";path=/"
	}
}
function newhisresult_down() {
	var l;
	var m;
	m = newgetCookie("UserDownLoadsKcms");
	newsetC("UserDownLoadsKcms", m);
	m = newgetCookie("UserDownLoadsKcms");
	var j = 0;
	if (m != null) {
		l = "<ul class='listSpan' >";
		var e = "";
		var k = "";
		var a = "/kcms/detail/detail.aspx?dbcode={0}&dbname={1}&filename={2}";
		var b = m.split("|");
		var g = 0;
		for (var h = 0; h < b.length; h++) {
			if (!b[h] || b[h] == "") {
				continue
			} else {
				var f = b[h].split("!");
				var d = "<li><a href='" + a.format(f[1], f[2], f[3]) + "'>" + f[0] + "</a></li>";
				l += d;
				g++
			}
		}
		l += "</ul>";
		l += "<span><a onclick=\"newdelCookie('UserDownLoadsKcms')\"  href='javascript:void(0)' style='margin-left:160px;'>清空</a></span>";
		if (g > 0) {
			ge("userdowmn_hiscontent").innerHTML = l;
			ge("userdown_his").style.display = "block"
		} else {
			ge("userdown_his").style.display = "none"
		}
	} else {
		ge("userdown_his").style.display = "none"
	}
}
function BindOnClick_DownLoad() {
	var a = document.getElementsByTagName("a");
	if (a && a.length > 0) {
		for (var c = 0; c < a.length; c++) {
			if (a[c].href.toString().indexOf("download.aspx?") > -1) {
				var b = a[c];
				if (window.attachEvent) {
					b.attachEvent("onclick", function() {
						addTitToCookic(event.srcElement)
					})
				} else {
					b.addEventListener("click", function() {
						addTitToCookic(this)
					}, false)
				}
			}
		}
	}
}
function addTitToCookic(a) {
	newsetCookie("UserDownLoadsKcms", "")
}
function WriteKrsDownLog() {
	newsetCookie7("UserDownLoads", "");
	var curUrl = "download.aspx?dbCode=" + getQueryString("dbcode") + "&fileName=" + getQueryString("filename");
	var referUrl = window.location.href;
	try {
		var userName = "";
		if (window.parent.$("#klogin_isPersonal").val() == "1") {
			userName = window.parent.$("#klogin_userName").val()
		} else {
			if ($("#klogin_isPersonal").val() == "1") {
				userName = $("#klogin_userName").val()
			}
		}
		if (typeof(eval(WriteActionLog)) == "function") {
			WriteActionLog(userName, GetCookie("cnkiUserKey"), curUrl, referUrl)
		}
	} catch (e) {}
}
function GetImgPath(a) {
	if (a == null || a == "") {
		a = getQueryString("filename")
	}
	var c = "http://image.cnki.net";
	src = c + "/getimage.ashx?fnbyIdAndName=" + encodeURIComponent(a);
	try {
		var b = new CoreDomainLoadJson();
		b.Load(src, function() {
			if (typeof oJson != "undefined") {
				var e = oJson.IDs;
				if (e != null && e != "") {
					RenderImages(e, a)
				}
			}
		}, "imgjosnhtml")
	} catch (d) {}
}
function RenderImages(p, s) {
	var a = "";
	if (document.getElementById("loginuserid") != null) {
		a = document.getElementById("loginuserid").value
	}
	var o = p;
	var j = "http://image.cnki.net/detail.aspx?ref=kcms&id=";
	var b = "http://image.cnki.net/getimage.ashx?id=";
	var r = "http://image.cnki.net/Document/{0}.html";
	var c = "http://image.cnki.net/TurnPage.aspx?ref=kcms&docid={0}&uid={1}";
	var f = "";
	var m = "";
	if (o != null) {
		var h = o.split("||");
		for (i = 0; i < h.length; i++) {
			if (i < 8) {
				var n = h[i].split("##")[0];
				var q = h[i].split("##")[1];
				if (n != "") {
					var k = j + n + "&uid=" + a;
					f += "<a target='_blank' onclick=OpenWindowsUrl('" + k + "') title='点击查看图片信息'><div class='imgbox'><div class='imgmask'><img src='" + b + n + "' id=" + n + "/></div></div><p class='imgtxt'>" + q + "</p></a>"
				}
			}
			m = h[0].split("##")[0]
		}
		var d = c.replace("{0}", s).replace("{1}", a);
		if (h.length > 8) {
			f += "<div class='zwjdown' style='margin-right:20px;'><a href='" + d + "' target='_blank'>更多图片...</a><div>"
		}
	}
	var g = $("#imgdiv");
	var l = $("#catalog_divimg");
	var e = $("#lcatalog_divimg");
	if (g.length > 0 && l.length > 0) {
		e.show();
		l.show();
		g.html(f)
	}
}
function OpenWindowsUrl(a) {
	window.open(a, "newwindow")
}
function getQueryString(b) {
	var c = new RegExp("(^|&)" + b + "=([^&]*)(&|$)", "i");
	var d = window.location.search.substr(1).toLowerCase();
	var a = d.match(c);
	if (a != null) {
		return unescape(a[2])
	}
	return ""
}
var C;

function O(a, b, c) {
	var d = navigator.userAgent.indexOf("MSIE") != -1 && !window.opera;
	if (d) {
		if (b == "load") {
			a.onreadystatechange = function() {
				if (this.readyState == "loaded") {
					c()
				}
			}
		} else {
			a.attachEvent("on" + b, (function(e) {
				return function() {
					c.call(e)
				}
			})(a))
		}
	} else {
		a.addEventListener(b, c, false)
	}
}
function RequestJsonObject(b, a) {
	if (C) {
		document.body.removeChild(C)
	}
	C = J("SCRIPT");
	C.src = b + "&td=" + (new Date()).getTime();
	C.charset = "utf-8";
	document.body.appendChild(C);
	O(C, "load", a)
}
function J(a) {
	return document.createElement(a)
}
function CoreDomainLoadJson() {
	this.C;
	this.J = J;
	this.O = O;
	this.Load = function(d, a, b) {
		var c = document.getElementById(b);
		if (c) {
			document.body.removeChild(c)
		}
		this.C = J("SCRIPT");
		this.C.type = "text/javascript";
		if (typeof b == "string" && b.length > 0) {
			this.C.id = b
		} else {
			this.C.id = "callScriptE"
		}
		this.C.src = d + "&td=" + (new Date()).getTime();
		this.C.charset = "utf-8";
		document.body.appendChild(this.C);
		O(this.C, "load", a)
	}
}
function RenderYbylHtml(d) {
	var a = "CAST";
	var c = "/kcms/Detail/ReadRedirectPage.aspx?filename={0}&dbcode={1}&tablename={2}";
	var f = getQueryString("filename");
	var g = getQueryString("dbname");
	var e = getQueryString("dbcode");
	if (f) {
		f = f.toUpperCase();
		g = g.toUpperCase();
		e = e.toUpperCase()
	}
	if (!d) {
		d = "gb"
	}
	c = c.format(f, e, g);
	var b = document.getElementById("ybyl");
	if (e != "" && a.indexOf(e) > -1) {
		if (b) {
			b.style.display = "";
			b.setAttribute("class", "mlyll");
			if (d.toLocaleLowerCase() == "en") {
				b.innerHTML = "<a href='" + c + "' target='_blank'>View</a>"
			} else {
				b.innerHTML = "<a href='" + c + "' target='_blank'>在线阅读</a>"
			}
		}
	} else {
		if (b) {
			b.style.display = "none"
		}
	}
}
function SetDownLoadFlag(b) {
	var h = "";
	if (document.getElementById("loginuserid") != null) {
		h = document.getElementById("loginuserid").value
	}
	if (h != "") {
		if (b != "1") {
			var d = "page|chapter|whole|readol|caj|pdf|cajNew";
			var g = d.split("|");
			var e = document.getElementsByTagName("li");
			for (var f = 0; f < e.length; f++) {
				var a = e[f].className.replace("/n", "");
				a = a.replace(/[ ]/g, "");
				a = a.replace(/(^\s*)|(\s*$)/g, "");
				if (d.indexOf(a) > -1) {
					e[f].className = "pdfN"
				}
			}
			var c = document.getElementsByTagName("a");
			for (var f = 0; f < c.length; f++) {
				var j = c[f].href;
				if (j.indexOf("download.aspx?") > 0) {
					c[f].href = "javascript:alert('此帐号无权限下载');close();";
					c[f].title = "此帐号无权限下载"
				}
			}
		} else {
			return
		}
	} else {
		return
	}
}
function ShowDownLoadFlag(a) {
	var b = "";
	if (document.getElementById("loginuserid") != null) {
		b = document.getElementById("loginuserid").value
	}
	if (b != "") {
		if (a != "1") {
			$("#cajDown").removeClass("icon-dlcaj").addClass("icon-dlcaj-grey");
			$("#pdfDown").removeClass("icon-dlpdf").addClass("icon-dlpdf-grey")
		} else {
			$("#cajDown").removeClass("icon-dlcaj-grey").addClass("icon-dlcaj");
			$("#pdfDown").removeClass("icon-dlpdf-grey").addClass("icon-dlpdf")
		}
	} else {
		$("#cajDown").removeClass("icon-dlcaj").addClass("icon-dlcaj-grey");
		$("#pdfDown").removeClass("icon-dlpdf").addClass("icon-dlpdf-grey")
	}
}
function GetEwmImage() {
	var b = getQueryString("filename");
	var a = "<img alt='' width='150px' height='150px'style='position:fixed;top:317px;right:0;' src='http://app.cnki.net/Parts/QRCode/Get?source=KCMS&amp;text=http://i.cnki.net/Mobile/HD/Detail?instanceID=journals:" + b + "'/>";
	document.write(a)
}
function submitSearch() {
	var c = $("#searchinput").val();
	var a = "scdb";
	var b = encodeURIComponent(c);
	var g = getOuterBaseLink("TOKNS") + "/kns/RedirectPage.aspx?action=indexpage&code={dbcode}&kw=" + b + "&korder=0";
	var f = getOuterBaseLink("TOKNET") + "/kcms/detail/knetsearch.aspx?sfield={type}&skey={kw}";
	var e = "kcmstarget";
	var d = getQueryString("sfield");
	if (c == "" || c == "undefined" || c == "请输入搜索内容" || c == "请输入机构名称" || c == "请输入作者名称" || c == "请输入基金名称" || c == "请输入关键词") {
		return
	} else {
		if (d) {
			d = d.toLocaleLowerCase();
			if (d == "au") {
				g = f.replace("{type}", "au").replace("{kw}", b);
				e = "_self"
			} else {
				if (d == "fu") {
					a = "fund"
				} else {
					if (d == "in") {
						a = "orgd"
					} else {
						if (d == "kw") {
							g = f.replace("{type}", "kw").replace("{kw}", b);
							e = "_self"
						}
					}
				}
			}
		}
		g = g.replace("{dbcode}", a);
		window.open(g, e)
	}
}
function setLibraryLink(a) {
	var e = $("#LibInfo_username").val();
	if (e == "") {
		return
	}
	var d = $("#LibInfo_link").val() + e;
	try {
		var b = new CoreDomainLoadJson();
		b.Load(d, function() {
			if (typeof json_result[0] != "undefined") {
				var f = json_result[0].LibName;
				var g = json_result[0].LibLink;
				if (f == "" || g == "" || f == "null" || g == "null") {
					return
				} else {
					g = decodeURIComponent(g);
					g = decodeURIComponent(g);
					g = g.replace(/{lisbn}/ig, a);
					g = g.replace(/{sisbn}/ig, a.replace(/-/g, ""));
					setLibraryLinkShow(f, g)
				}
			}
		}, "bookjosnHtml")
	} catch (c) {}
}
function setLibraryLinkShow(b, a) {
	$("#LibDownloadPart").removeClass("dllinkVarShort");
	$(".dllinkVarP1").append("<a target='_blank' href='" + decodeURIComponent(a) + "'>" + b + "</a>")
}
function GetFileHot(a) {
	$(document).ready(function() {
		if (a == "" || a == "null") {
			return
		}
		var c = getOuterBaseLink("KREDIS") + a;
		try {
			var d = new CoreDomainLoadJson();
			d.Load(c, function() {
				if (typeof josnresult != "undefined") {
					var f = josnresult[0].fn;
					var e = josnresult[0].value;
					var g = parseInt(e * 100);
					$(".HotSpotValue").html(g / 10);
					$(".HotSpotPower").attr("style", "width:" + g + "%")
				}
			}, "hotposthtml")
		} catch (b) {}
	})
}
function FloatDownloadPartCantrol() {
	var a = $("#DownLoadParts");
	var b = $("#wxDlToolbar");
	if (a.offset().top < $(window).height()) {
		b.hide()
	}
	$(document).ready(function() {
		$(window).scroll(function() {
			var c = a.offset().top - $(window).height();
			if ($(window).scrollTop() >= c) {
				b.hide()
			} else {
				b.show()
			}
		})
	})
}
function showBqsm(b) {
	if (!b) {
		return
	}
	var a = document.getElementById("bkbqsm");
	if (!a) {
		return
	}
	a.innerHTML = getBqsmHtml(b);
	a.style.display = "block"
}
function getBqsmHtml(c) {
	var b = "<a class='close' href='javascript:closeBqsm()'>X</a>";
	var a = "<div><img src='" + c + "'/></div>";
	return b + a
}
function closeBqsm() {
	document.getElementById("bkbqsm").style.display = "none"
};