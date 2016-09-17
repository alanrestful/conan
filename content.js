jQuery("<div id='tester_wait_body_view' class='tester_wait_body_view'>Wait ready web by Conan!</div>").prependTo(jQuery(document.body));

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

  // 监听元素事件
  $(document).mousedown(function(e){
    //show detail element info in window（alt|option + 鼠标左击）
    if(e.altKey && 1 == e.which){
      //left click
      obj = $(e.target);

      $("#tester_element_tagName").text(obj[0].tagName);
      $(".tester_contact_form").empty();

      $(create_view(obj)).appendTo($(".tester_contact_form"));

      $('.tester_theme_popover_mask').fadeIn(100);
      $('#tester_show_element_view').slideDown(200);
    }

    //save element event for click（command + 鼠标左击）
    if(e.metaKey && 1 == e.which){
      obj = $(e.target);
      create_view(obj);
    }
  });

  // option无法锁定click事件，而change事件有无法获取event情况下的key情况，即无法确定e.altKey是否按下
  // 特意处理select情况
  $(document).change(function(e){

    var event_obj = $(e.target);

    //select的数据要做特殊处理用于选择特定value
    if(event_obj[0].tagName == "SELECT"){
      create_view(event_obj);
    }
  });
});

// tagName为input&select的需要做特殊处理，设置Value其余的都作为click对象
var property = ["tagName" , "type", "id", "className", "name", "value", "placeholder", "baseURI", "innerText", "href"];

function create_view(event_obj){
  var ul = $("<ul></ul>");

  // 元素信息
  var obj_val = {};
  for (var pro in property){
    if(event_obj[0][property[pro]]){
      obj_val[property[pro]] = event_obj[0][property[pro]];
    }
  }
  // 元素xPath定位数据
  obj_val["xPath"] = event_obj.localXpath().xpath;

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

  __save_content(obj_val);
  return ul;
}

function basic_view(ul, event_obj){
  return __set_li_back_obj(ul, ["id", "class", "style", "title"], event_obj);
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
        return event_obj.attr(attr_v).replace(/\s/g, ".");
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
      obj_list = $("."+__attr_obj(attr_v , event_obj));
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

function __save_action(){
  var send_obj = {
    test_type:"form",
    params:{
      el_name:"INPUT",
      el_type:"text"
    }
  };
  chrome.extension.sendRequest({data:send_obj}, function(data) {});
}

/*
 * Form: {
  test_type:"form",
  el_name,
  id,
  class,
  name,
  type
 }
 */
function __save_content(obj_val){
  chrome.extension.sendRequest({data:obj_val}, function(data) {});
}
