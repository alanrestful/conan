// $("#kw").click(function(){
//   alert("alan");
// });
chrome.storage.local.get('conan', function(result){
    var existWhite = false;
    if(result.conan.whiteLists.length != 0){
      var domainUrl = __local_domain(window.location.href);
      for(var i=0; i<result.conan.whiteLists.length; i++){
        if(domainUrl === result.conan.whiteLists[i]){
          existWhite = true;
        }
      }
    }else{
      //默认情况下所有页面都可以访问
      existWhite = true;
    }

    //加载页面处理
    if(existWhite){
      jQuery("<div id='tester_wait_body_view' class='tester_wait_body_view'>Wait ready web by Conan!</div>").prependTo(jQuery(document.body));

      jQuery(document).ready(function($) {
        $("#tester_wait_body_view").text("Conan加载页面成功!");

        setTimeout(function(){
          $("#tester_wait_body_view").hide();
        }, 1000);

        // alt|option + 鼠标左击(展示当前点击元素的信息)
        $("<div class='tester_theme_auto_window' id='tester_show_element_view'>"
          +"<div class='tester_theme_poptit'>"
            +"<a href='javascript:;' id='tester_show_close' title='关闭' class='close'>×</a>"
            +"<h3>Element Detail<span id='tester_element_tagName' style='color:red;margin-left:20px;'></span></h3>"
          +"</div>"
          +"<div class='tester_dform' style='text-align:left'>"
            +"<form class='tester_contact_form' name='queue_form' method='post'></form>"
          +"</div></div><div class='tester_theme_popover_mask'></div>").appendTo($(document.body));

        $('#tester_show_close').click(function(){
            $('.tester_theme_popover_mask').fadeOut(100);
            $('#tester_show_element_view').slideUp(200);
        });

        new ConanForm().initConanForm();

        // 监听元素事件
        $(document).mousedown(function(e){
          //show detail element info in window（alt|option + 鼠标左击）
          var event_obj = $(e.target);
          if(e.altKey && 1 == e.which){
            //left click
            $("#tester_element_tagName").text(event_obj[0].tagName);
            $(".tester_contact_form").empty();

            $(create_view(event_obj)).appendTo($(".tester_contact_form"));

            $('.tester_theme_popover_mask').fadeIn(100);
            $('#tester_show_element_view').slideDown(200);
          }

          //save element event for click（command + 鼠标左击）
          if(e.metaKey && 1 == e.which){
            create_t_obj(event_obj);
          }
        });

        // option无法锁定click事件，而change事件有无法获取event情况下的key情况，即无法确定e.altKey是否按下
        // 特意处理select情况
        $(document).change(function(e){

          var event_obj = $(e.target);

          //select的数据要做特殊处理用于选择特定value
          if(event_obj[0].tagName == "SELECT"){
            create_t_obj(event_obj);
          }
        });
      });
    }
});


/**
 * xpath构造器
 * 依据id&class往上查找的xpath路径, 理论上能够唯一定位元素
 * todo 后期可能需要增加上href之类的功能
 */
(function($) {
    $.fn.localXpath = function(uniqueIds) {
        var el = $(this)[0];
        var uniqIds = uniqueIds || [];
        var locator = { xpath: ''};
        var eloc = {
            // 获取class名称
            getClass: function(el) {
                var formatClass = '';
                var elementClass = $(el).attr('class');
                if(typeof elementClass != 'undefined' && elementClass != ''){
                    formatClass = '.' + elementClass.split(/[\s\n]+/).join('.');
                }
                return formatClass;
            },
            getDefaultPath: function(el , id, xpath){
              return '/' + el.tagName.toLowerCase() + '[' + idx + ']' + xpath;
            }
        };
        for (; el && el.nodeType == 1; el = el.parentNode) {
            // 在子节点组中的位置
            var idx = $(el.parentNode).children(el.tagName).index(el) + 1;
            if (el.tagName.substring(0,1) != "/") { //IE oddity: some tagNames can begin with backslash.
                if (el.hasAttribute("id")) {
                  // 找到全局唯一标记(或是当前元素为全局dom数组中的第一个元素)
                  if (__obj_index("id" , $(el)) == 0){
                    var idPath = "[@id=" + "'" + el.id + "'" + "]";
                    locator.xpath = '/*' + idPath + locator.xpath;
                    break;
                  } else {
                    locator.xpath = eloc.getDefaultPath(el , idx, locator.xpath);
                  }
                } else if (el.hasAttribute("class")) {
                  // 找到全局唯一标记(或是当前元素为全局dom数组中的第一个元素)
                  if (__obj_index("class" , $(el)) == 0){
                    var idPath = "[@class=" + "'" + el.getAttribute('class') + "'" + "]";
                    locator.xpath = '/*' + idPath + locator.xpath;
                    break;
                  } else {
                    locator.xpath = eloc.getDefaultPath(el , idx, locator.xpath);
                  }
                } else {
                  locator.xpath = eloc.getDefaultPath(el , idx, locator.xpath);
                }
            }
        }
        locator.xpath = '/' + locator.xpath;
        return locator;
    };
})(jQuery);

// tagName为input&select的需要做特殊处理，设置Value其余的都作为click对象
var property = ["tagName" , "type", "id", "className", "name", "value", "placeholder", "baseURI", "innerText", "href"];

var form_element = [{"INPUT" : ["text", "password"]}, {"SELECT": []}];

/**
 * 判断元素是否是form输入元素(非事件元素)
 */
function is_form_element(test_obj){
  for(var i in form_element){
    var element = form_element[i];

    for(var tagName in element){
      if(test_obj.tagName == tagName){
        if(element[tagName].length == 0){
          return true;
        }

        for(var n in element[tagName]){
          if(test_obj.type == element[tagName][n]){
            return true;
          }
        }
      }
    }
  }

  return false;
}

/**
 * 构建测试对象
 */
function create_t_obj(event_obj){
  // 元素信息
  var obj_val = {};
  for (var pro in property){
    if(event_obj[0][property[pro]]){
      obj_val[property[pro]] = event_obj[0][property[pro]];
    }
  }
  // 元素xPath定位数据
  obj_val["xPath"] = event_obj.localXpath().xpath;

  // 元素是否是form输入元素({"INPUT" : ["text", "password"]}, {"SELECT": []})
  obj_val["isFormEl"] = is_form_element(obj_val);

  // 元素记录时间
  obj_val["inDate"] = new Date();

  __save_content(obj_val);
}

/**
 * 展示元素属性信息
 */
function create_view(event_obj){
  var ul = $("<ul></ul>");

  switch(event_obj[0].tagName){
    case "A":
      form_obj = __init_back_obj(create_a_view(ul, event_obj));
      break;
    case "BUTTON":
      form_obj = __init_back_obj(create_button_view(ul, event_obj));
      break;
    case "FORM":
      form_obj = __init_back_obj(create_form_view(ul, event_obj));
      break;
    case "IMG":
      form_obj = __init_back_obj(create_img_view(ul, event_obj));
      break;
    case "INPUT":
      form_obj = __init_back_obj(create_input_view(ul, event_obj));
      break;
    case "LINK":
      form_obj = __init_back_obj(create_link_view(ul, event_obj));
      break;
    case "SELECT":
      form_obj = __init_back_obj(create_select_view(ul, event_obj));
      break;
    default:
      form_obj = __init_back_obj(basic_view(ul, event_obj));
  }
  return ul;
}

function basic_view(ul, event_obj){
  return __set_li_back_obj(ul, ["id", "class", "style", "title", "xPath"], event_obj);
}


function create_a_view(ul, event_obj){
  // <a> href、 target、 ping、 rel、 media、 hreflang、 type
  var back_obj = basic_view(ul, event_obj);
  return back_obj.concat(__set_li_back_obj(ul, ["href", "target", "type"], event_obj));
}

function create_button_view(ul, event_obj){
  // <button>        autofocus、 disabled、 form、 formaction、 formenctype、 formmethod、 formnovalidate、 formtarget、 name、 type、 value
  var back_obj = basic_view(ul, event_obj);
  return back_obj.concat(__set_li_back_obj(ul, ["name", "type", "value"], event_obj));
}

function create_form_view(ul, event_obj){
  // <form>          accept-charset、 action、 autocomplete、 enctype、 method、 name、 novalidate、 target
  var back_obj = basic_view(ul, event_obj);
  return back_obj.concat(__set_li_back_obj(ul, ["name", "target", "action", "method"], event_obj));
}

function create_img_view(ul, event_obj){
  // <img>           alt、 src、 usemap、 ismap、 width、 height
  var back_obj = basic_view(ul, event_obj);
  return back_obj.concat(__set_li_back_obj(ul, ["src", "width", "height"], event_obj));
}

function create_input_view(ul, event_obj){
  // <input>   checked、 dirname、 disabled、 form、 formaction、 formenctype、 formmethod、 formnovalidate、 formtarget、 height、 list、 max、 maxlength、 min、 multiple、 name、 pattern、 placeholder、 readonly、 required、 size、 src、 step、 type、 value、 width
  var back_obj = basic_view(ul, event_obj);
  return back_obj.concat(__set_li_back_obj(ul, ["name", "src", "type", "value", "checked"], event_obj));
}

function create_link_view(ul, event_obj){
  // <link>          href、 rel、 media、 hreflang、 type、 sizes
  var back_obj = basic_view(ul, event_obj);
  return back_obj.concat(__set_li_back_obj(ul, ["href", "rel", "type"], event_obj));
}

function create_select_view(ul, event_obj){
  // <select>        autofocus、 disabled、 form、 multiple、 name、 required、 size
  var back_obj = basic_view(ul, event_obj);
  return back_obj.concat(__set_li_back_obj(ul, ["name", "value"], event_obj));
}

function ElementObj(attrName, attrValue){
  this.attrName = attrName;
  this.attrValue = attrValue;
}

function __li_view(attr_v, event_obj){
  var view_val = new Array();
  var li_view = "<li><span>"+attr_v+":</span>";
  if(attr_v == "value"){
    if(event_obj.val() == "undefined" || event_obj.val() == null){
      li_view += "<span>"+event_obj.val()+"</span></li>";
      view_val.push(li_view);
    }else{
      li_view += "<span style='color:red'>"+event_obj.val()+"</span></li>";
      view_val.push(li_view);
      if(attr_v != "style"){
        view_val.push(JSON.parse("{\""+attr_v+"\":\""+event_obj.val()+"\"}"));
      }
    }
  }else if(attr_v == "xPath") {
    li_view += "<span style='color:red'>"+event_obj.localXpath().xpath+"</span></li>";
    view_val.push(li_view);
  }else{
    if(event_obj.attr(attr_v) == "undefined" || event_obj.attr(attr_v) == null){
      li_view += "<span>"+event_obj.attr(attr_v)+"</span></li>";
      view_val.push(li_view);
    }else{
      li_view += "<span style='color:red'>"+__attr_obj(attr_v , event_obj)+"</span></li>";
      view_val.push(li_view);
      if(attr_v != "style"){
        view_val.push(JSON.parse("{\""+attr_v+"\":\""+__attr_obj(attr_v , event_obj)+"\",\""+attr_v+"_index\":\""+__obj_index(attr_v, event_obj)+"\"}"));
      }
    }
  }

  return view_val;
}

function __attr_obj(attr_v, event_obj){
    if(attr_v == "class"){
      var formatClass = '';
      var elementClass = event_obj.attr(attr_v);
      if(typeof elementClass != 'undefined' && elementClass != ''){
          formatClass = '.' + elementClass.replace(/^\s+|\s+$/g, "").split(/[\s\n]+/).join('.');
      }

      return formatClass;
    }else{
      return event_obj.attr(attr_v);
    }
}

function __obj_index(attr_v, event_obj){
  var obj_index = -1;
  var obj_list = [];
  switch(attr_v){
    case "id":
      obj_list = $("#"+event_obj.attr(attr_v));
      break;

    case "class":
      obj_list = $(__attr_obj(attr_v, event_obj));
      break;

    case "name":
      obj_list = $("input[name='"+event_obj.attr(attr_v)+"']");
      break;

    case "href":
      obj_list = $("[href='"+event_obj.attr(attr_v)+"']");
      break;
  }

  for(var index=0; index<obj_list.length; index++){
    if(event_obj[0] == obj_list[index]){
      obj_index = index;
      break;
    }
  }
  return obj_index;
}

function __li_list_view(attr_s, event_obj){
  var obj_list = new Array();
  for(var i=0; i<attr_s.length; i++){
    obj_list.push(__li_view(attr_s[i], event_obj))
  }
  return obj_list;
}

function __set_li_back_obj(ul, attr_s, event_obj){
  var obj_list = __li_list_view(attr_s, event_obj);

  var back_obj = new Array();
  for(var i=0; i<obj_list.length; i++){
    $(obj_list[i][0]).appendTo(ul);
    if(obj_list[i].length > 1){
      back_obj.push(obj_list[i][1]);
    }
  }

  return back_obj;
}

function __init_back_obj(back_obj){
  var obj = new Object();
  for(var n=0; n<back_obj.length; n++){
    for(key in back_obj[n]){
      obj[key] = back_obj[n][key];
    }
  }

  return obj;
}

/**
 * 保存content获取到的数据
 */
function __save_content(obj_val){
  chrome.extension.sendRequest({data:obj_val}, function(data) {});
}

function __local_domain(urlPath){
  var reg = new RegExp('^(https?|ftp|file)://[-a-zA-Z0-9+&@#%?=~_|!:,.;]*[/]', 'gm');

  var oldDomainP = urlPath.match(reg)[0];
  var domain = oldDomainP.substring(0, oldDomainP.length-1);
  return domain;
}

/** 
 * Conan Form
 * 记录
 * 记录页面input输入数据，并以列表方式展示。
 * 依据xPath来定位页面元素
 * 依据页面url&页面加载时间点作为form表单归集索引
 * 回写
 * 数据回写检索页面所有input元素
 * 比对xPath 对应的form数据回写到页面元素
 */
__select_status = false;
__indexDate = new Date().getTime();
function ConanForm(){
  this.initConanForm = function(){
    $("input").focus(function(e){
      var event_obj = $(e.target);
      var form_obj = __pml_form_obj(event_obj);

      // 获取extension资源
      var imagePath = chrome.extension.getURL("assest/images/logo.png");
      var new_obj = $("<div style='cursor:pointer;background-size:16px 16px;width:16px;height:16px;position:absolute;z-index:1000;background-image:url(\""+imagePath+"\"');'></div>")
      
      //获取相对定位及event_obj高度
      var absolute_top = event_obj.height() + Number(event_obj.css('padding-top').replace("px","")) + Number(event_obj.css('padding-bottom').replace("px",""));
      //设置相对定位
      new_obj.css("top", event_obj.position().top + (absolute_top - new_obj.height())/2);
      new_obj.css("left", event_obj.position().left + event_obj.width() + Number(event_obj.css('padding-left').replace("px","")) - new_obj.width());

      event_obj.after(new_obj);

      //数据归集
      chrome.storage.local.get('conanForm', function(result){
        var html = '<ul class="list-group"'+' indexXPath="'+form_obj["xPath"]+'">';
        for(index in result.conanForm.formList){
          var index_form = result.conanForm.formList[index];
          if(form_obj["formIndex"] == index_form["formIndex"]){
            for(f_index in index_form["formArray"]){
              if(form_obj["xPath"] == index_form["formArray"][f_index]["xPath"]){
                html+='<li indexDate="'+index_form["formArray"][f_index]["indexDate"]+'" formDataVal='+index_form["formArray"][f_index]["value"]+' class="list-group-item">'
                    + index_form["formArray"][f_index]["value"]+'</li>'; 
              }
            }
          }
        }
        html+='</ul>';

        __initPopover(new_obj , html, form_obj);
      });
    });

    $("input").blur(function(e){
        var event_obj = $(e.target);

        __save_form_obj(event_obj);
    });
  }

  /**
   * 获取表单元素
   */
  function __pml_form_obj(event_obj){
    // 元素信息
    var obj_val = {};
    for (var pro in property){
      if(event_obj[0][property[pro]]){
        obj_val[property[pro]] = event_obj[0][property[pro]];
      }
    }
    // 元素xPath定位数据
    obj_val["xPath"] = event_obj.localXpath().xpath;

    // 元素是否是form输入元素({"INPUT" : ["text", "password"]}, {"SELECT": []})
    obj_val["isFormEl"] = is_form_element(obj_val);

    // 元素记录时间
    obj_val["inDate"] = new Date();

    // form时间索引
    obj_val["indexDate"] = __indexDate;

    //截取不包含请求参数部分url
    var end_index = obj_val["baseURI"].indexOf("?") != -1 ? obj_val["baseURI"].indexOf("?") : obj_val["baseURI"].length;
    obj_val["formIndex"] = obj_val["baseURI"].substring(0 , end_index);

    return obj_val;
  }

  /**
   * 表单数据记录
   */
  function __save_form_obj(event_obj){
    var obj_val = pml_form_obj(event_obj);

    //是否是输入元素
    if(!obj_val["isFormEl"]){
      return;
    }

    //空数据
    if(!obj_val["value"] || obj_val["value"] == ""){
      return;
    }

    chrome.storage.local.get('conanForm', function(result){
        if(!result.conanForm){
          result.conanForm = {};
        }

        // 测试同步服务端
        if(!result.conanForm.formList){
          result.conanForm.formList = [];
        }

        var indexForm = null;
        for(index in result.conanForm.formList){
          if(result.conanForm.formList[index]["formIndex"] == obj_val["formIndex"] 
            && result.conanForm.formList[index]["indexDate"] == __indexDate){
            indexForm = result.conanForm.formList[index];
            break;
          }
        }

        if(indexForm){
          //相同数据去重
          if(obj_val["isFormEl"]){
            for(fIndex in indexForm["formArray"]){
              if(obj_val["xPath"] == indexForm["formArray"][fIndex]["xPath"] 
                && obj_val["value"] == indexForm["formArray"][fIndex]["value"]){
                return;
              }
            }
          }
          indexForm["formArray"].push(obj_val);
        } else {
          indexForm = {"formIndex" : obj_val["formIndex"], "indexDate" : __indexDate, "formArray": []};
          indexForm["formArray"].push(obj_val);
          result.conanForm.formList.push(indexForm);
        }

        chrome.storage.local.set(result);
    });
  }

  function __initPopover(ent_obj, data_html, form_obj){   
    var settings = {
      trigger:'click',
      title:'Coana Form',
      width:200,
      height:323,          
      multi:true,
      closeable:true,
      style:'',
      padding:true,
      backdrop:true,
      content: data_html,
      onShow: function(e){
        var a_objs = e.find("li");

        __select_status = false;
        var form_index = form_obj["formIndex"];
        a_objs.map(function(){
          var index_date_id = $(this).attr("indexDate");
          $(this).click(function(){
            __select_status = true;
            ent_obj.webuiPopover("hide");
          });

          $(this).on("mouseover", function(){  
            var data_val = $(this).attr("formDataVal");
            var index_date = $(this).attr("indexDate");
            var eve_xpath = form_obj["xPath"];

            chrome.storage.local.get('conanForm', function(result){
              var form_vals = [];
              for(index in result.conanForm.formList){
                var index_form = result.conanForm.formList[index];
                if(form_obj["formIndex"] == index_form["formIndex"]){
                  for(f_index in index_form["formArray"]){
                    if(index_date == index_form["formArray"][f_index]["indexDate"] &&
                      eve_xpath != index_form["formArray"][f_index]["xPath"]){
                      form_vals.push(index_form["formArray"][f_index]);
                    } else if(index_date == index_form["formArray"][f_index]["indexDate"] &&
                      eve_xpath == index_form["formArray"][f_index]["xPath"] && 
                      data_val == index_form["formArray"][f_index]["value"]){
                      form_vals.push(index_form["formArray"][f_index]);
                    }
                  }
                }
              }

              $("input").map(function(){
                var input_obj = $(this);
                var exist = false;
                for(index in form_vals){
                  if(input_obj.localXpath().xpath == form_vals[index]["xPath"]){
                    exist = true;
                    break;
                  }
                }

                if(exist){
                  input_obj.css("background-color","#b6d7a8");
                  input_obj.val(form_vals[index]["value"]);
                }else{
                  input_obj.css("background-color","white");
                  input_obj.val("");
                }
              });
            });
          });
        });
      },
      onHide: function(e){
        //未选择 则去除全部的选择
        if(!__select_status){
          $("input").map(function(){
            var input_obj = $(this);
            input_obj.css("background-color","white");
            input_obj.val("");
          });
        }

        ent_obj.remove();
      }
    };

    ent_obj.webuiPopover('destroy').webuiPopover(settings);
  }
}

