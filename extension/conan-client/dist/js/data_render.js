// alert(localStorage.tester_arrays);
var back_env = chrome.extension.getBackgroundPage();

// 对storage做监听，实时刷新TimeLine数据
chrome.storage.onChanged.addListener(function(changes, namespace) {
  for (key in changes) {
    var storageChange = changes[key];

    if(storageChange.oldValue.tester_arrays != storageChange.newValue.tester_arrays){
      $("#local_t_arrays").text(storageChange.newValue.tester_arrays.length);
      $("#local_t_objs").text(count_t_objs(storageChange.newValue.tester_arrays));
      // 测试数据改动
      __diff_t_arrays(storageChange.oldValue.tester_arrays , storageChange.newValue.tester_arrays);
    }
  }
});


/**
 * 判断两个对象是否相同
 */
function __is_diff(old_obj, new_obj){
  for(p in old_obj) {
      if(typeof(new_obj[p])=='undefined') {return true;}
  }

  for(p in old_obj) {
    if (old_obj[p]) {
      switch(typeof(old_obj[p])) {
        case 'object':
          if (__is_diff(old_obj[p], new_obj[p])) { return true;} break;
        case 'function':
          break;
        default:
          if (old_obj[p] != new_obj[p]) { return true;}
      }
    } else {
      if (new_obj[p]){
        return true;
      }
    }
  }
  for(p in new_obj) {
    if(typeof(old_obj[p]) == 'undefined') {return true;}
  }
  return false;
}

/**
 * 获取数据是否有改动
 */
function __diff_t_arrays(old_arrays , new_arrays){
  for(var newI in new_arrays){
    if(!old_arrays[newI]){
      //新增的测试组
      time_line_layout(new_arrays[newI] , newI);
      time_line_view(new_arrays[newI], newI);
    }else if(__is_diff(old_arrays[newI], new_arrays[newI])){
      var oldArray = old_arrays[newI]["tArray"];
      var newArray = new_arrays[newI]["tArray"];
      for(var diffI in newArray){
        if(!oldArray[diffI]){
          append_time_line(newArray[diffI] , newI);
        }
      }
    }
  }
}

/**
 * 页面信息加载
 */
$(document).ready(function() {
  chrome.storage.local.get('conan', function(result){
    var conanConfig = result.conan;

    var tArrays = conanConfig.tester_arrays;

    $("#local_t_arrays").text(tArrays.length);
    $("#local_t_objs").text(count_t_objs(tArrays));

    for(var i in tArrays){
      time_line_layout(tArrays[i], i);
      time_line_view(tArrays[i], i);
    }
  });

  // 清空测试组数据
  $('#clear_t_arrays').click(function(e) {
    chrome.storage.local.get('conan', function(result){
      var conanConfig = result.conan;

      conanConfig.tester_arrays = [];
      chrome.storage.local.set(result);

      //清空页面数据
      $(".panel-body").html("");
    });
  });
});

function count_t_objs(tArrays){
  var count = 0;
  for(var i in tArrays){
    count += tArrays[i].tArray.length;
  }
  return count;
}

/**
 * 构建一个测试组的timeLine
 */
function time_line_layout(tArray, line_index){
  $(".panel-body").append($('<a class="accordion-toggle" style="line-height:35px;" data-toggle="collapse" href="#test_line'+line_index+'">'+tArray["url"]+'</a>'));

  var jsonBut = $('<button type="button" style="float:right" data-toggle="modal" data-t-index="'+line_index+'" data-target="#myModal" class="btn btn-success">JSON</button>');
  jsonBut.click(function(e){
    var index = $(this).attr("data-t-index");
    chrome.storage.local.get('conan', function(result){
      var conanConfig = result.conan;

      var tArrays = conanConfig.tester_arrays;
      $("#t_array_json").val(JSON.stringify(tArrays[index]));
      // $("#t_array_json").val(JSON.stringify(tArrays[index], null, "\t"));
    });
  });
  $(".panel-body").append(jsonBut);
  $(".panel-body").append($('<ul class="timeline accordion-body collapse" id="test_line'+line_index+'"></ul><hr>'));
}

/**
 * 构建测试组的timeLine展示
 */
function time_line_view(tArrayObj , line_index){
  var timeLine = $(line_index ? "#test_line"+line_index : "#test_line0");

  var tArray = tArrayObj.tArray;
  for(var n in tArray){
    timeLine.append(
    '<li class="'+(tArray[n]["isFormEl"] ? "" : "timeline-inverted")+'">'+
      '<div class="timeline-badge '+(tArray[n]["isFormEl"] ? "info" : "danger")+'">'+
          '<i class="fa '+(tArray[n]["isFormEl"] ? "fa-save" : "fa-bomb")+'"></i>'+
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

/**
 * 新增timeLine数据
 */
function append_time_line(tObj , line_index){
  var timeLine = $(line_index ? "#test_line"+line_index : "#test_line0");

  timeLine.append(
  '<li class="'+(tObj["isFormEl"] ? "" : "timeline-inverted")+'">'+
    '<div class="timeline-badge '+(tObj["isFormEl"] ? "info" : "danger")+'">'+
        '<i class="fa '+(tObj["isFormEl"] ? "fa-save" : "fa-bomb")+'"></i>'+
    '</div>'+
    '<div class="timeline-panel">'+
        '<div class="timeline-heading">'+
            '<h4 class="timeline-title">'+tObj["tagName"]+'</h4>'+
            '<p><small class="text-muted"><i class="fa fa-clock-o"></i> 11 hours ago</small>'+
            '</p>'+
        '</div>'+
        '<div class="timeline-body">'+
            '<p>'+render_obj(tObj)+'</p>'+
        '</div>'+
    '</div>'+
  '</li>');
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

/**
 *  渲染测试用例数据
 */
function render_obj(test_obj){
  switch(test_obj.tagName){
    case "INPUT":
      if(test_obj.type && (test_obj.type == "text" || test_obj.type == "password")){

      }
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
            '<input class="form-control" type="'+test_obj.type+'" value="'+(test_obj.value ? test_obj.value : "")+'"></input>'+
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
