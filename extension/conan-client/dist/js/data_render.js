// alert(localStorage.tester_arrays);
var back_env = chrome.extension.getBackgroundPage();

$(document).ready(function() {
  var tArrays = back_env.__storage_to_obj(localStorage.tester_arrays);
  $("#local_t_arrays").text(tArrays.length);
  $("#local_t_objs").text(count_t_objs(tArrays));

  time_line_view(tArrays);
});

function count_t_objs(tArrays){
  var count = 0;
  for(var i in tArrays){
    count += tArrays[i].tArray.length;
  }
  return count;
}

function time_line_view(tArrays){
  var timeLine = $(".timeline");

  for(var i in tArrays){
    var tArray = tArrays[i].tArray;
    for(var n in tArray){
      timeLine.append(
      '<li class="'+(is_form_element(tArray[n]) ? "" : "timeline-inverted")+'">'+
        '<div class="timeline-badge '+(is_form_element(tArray[n]) ? "info" : "danger")+'">'+
            '<i class="fa '+(is_form_element(tArray[n]) ? "fa-save" : "fa-bomb")+'"></i>'+
        '</div>'+
        '<div class="timeline-panel">'+
            '<div class="timeline-heading">'+
                '<h4 class="timeline-title">'+tArray[n]["tagName"]+'</h4>'+
                '<p><small class="text-muted"><i class="fa fa-clock-o"></i> 11 hours ago</small>'+
                '</p>'+
            '</div>'+
            '<div class="timeline-body">'+
                '<p>'+render_obj(tArray[n])+'</p>'+
            '</div>'+
        '</div>'+
      '</li>');
    }
  }
}

/*
{
    "tagName": "INPUT",
    "type": "text",
    "id": "loginId",
    "className": "form-control",
    "name": "loginBy",
    "value": "jdsncgf2",
    "placeholder": "请输入用户名",
    "baseURI": "http://mallt.jidd.com.cn:8888/",
    "xPath": "//*[@id='loginId']"
}
*/

var display_p = [{"id": "fa fa-comments fa-1x"}, {"className": "fa fa-tasks fa-1x"},
                  {"name": "fa fa-shopping-cart fa-1x"}, {"placeholder": "fa fa-support fa-1x"},
                   {"innerText": "fa fa-arrow-circle-right fa-1x"}, {"href": "fa fa-credit-card fa-1x"},
                   {"xPath": "fa fa-clock-o fa-1x"}];

var form_element = ["INPUT", "SELECT"];

function is_form_element(test_obj){
  for(var i in form_element){
    if(test_obj.tagName == form_element[i]){
      return true;
    }
  }

  return false;
}

/**
 *  渲染测试用例数据
 */
function render_obj(test_obj){
  switch(test_obj.tagName){
    case "INPUT":
      return __input_render(test_obj);
    default :
      return __default_render(test_obj);
  }
}

/**
 *  渲染展示input输入元素的样式数据
 */
function __input_render(test_obj){
  return '<div>'+
            __property_render(test_obj)+
            '<input class="form-control" type="'+test_obj.type+'" value="'+test_obj.value+'"></input>'+
         '</div>';
}

/**
 *  渲染默认的样式数据
 */
function __default_render(test_obj){
  return '<div>'+
            __property_render(test_obj)+
         '</div>';

}

/**
 *  渲染元素的属性数据
 */

function __property_render(test_obj){
  var view = "";
  for(var dis in display_p){
    for(var key in display_p[dis]){
      if(test_obj[key]){
        view += '<span title="'+key+'" style="padding-right:20px;height:25px;" class="'+display_p[dis][key]+'"> '+test_obj[key]+'</span>';
      }
    }
  }
  if(test_obj.tagName != "INPUT" && test_obj.value){
    view += '<span title="value" style="padding-right:20px;height:25px;" class="fa fa-save fa-1x"> '+test_obj.value+'</span>';
  }
  return view;
}
