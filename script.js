function xmlrpc() {         
       var options =  xcom_params();
       if(!options) {
          alert('No function selected');
          return false; 
        }  
       var func = options[0];
       var params =  'params=' + JSON.stringify(options);
       var jobj = xcom_json_ini('xcom_pwd','xcom_url','xcom_user');
       str =JSON.stringify(jobj); 
       params += '&credentials=' + str;      
  
 //alert(params + "\n" + func);
 // return; 
         jQuery.ajax({
            url: DOKU_BASE + 'lib/plugins/xcom/scripts/xml.php',
            async: false,
            data: params,         
            type: 'POST',
            dataType: 'html',         
            success: function(data)
            {  
               data = decodeURIComponent(data);                  
               xcom_show('xcom_results');
               xcom_print_data(func, data);   
            }
        });
         return false;
}
function xcom_print_data(fn, data) {
   var id = 'xcom_pre';
   
        switch(fn) 
         {
             case 'wiki.getPage':                 // (string) raw Wiki text                 
            case 'wiki.getPageVersion':      // (string) raw Wiki text 
              id = 'xcom_editable' ;
              break;   
            case 'wiki.getPageHTML':      // (string) rendered HTML 
             id = 'xcom_htm';
                break;
            case 'dokuwiki.getPagelist':
                 id = 'xcom_htm';
                 var obj = jQuery.parseJSON(data);    
                     if(obj) {   
                         data = xcom_thead('id','rev', 'mtime' ,'size');
                         for(var i in obj) {                            
                              data +="\n<tr>";
                             // alert(data);                            
                             for(var j in obj[i]) {                                 
                                 var r = obj[i][j];
                                 data += xcom_td(j,r);            
                             }
                 
            
                        } 
                    }                   
                   data += xcom_tclose();
                   
                  
                  
                 break;           
    }
    
    var d = document.getElementById(id);  
    if(id == 'xcom_editable') {
        xcom_setValue(id,data);
    }    
    else {
        d.innerHTML=  data;
        }
    xcom_show(id);
}

function xcom_thead() {
  var row = "<table>\n<tr>";
  for (i=0; i<arguments.length; i++) {
     row += '<th>' + arguments[i] + '</th>';
  }
   return row + "</tr>\n";
}

function xcom_td(type,val) {
    if(type == 'rev' || type == 'mtime') {
       var d = new Date(val);
       val = d.toUTCString();
    }
    else if(type == 'size') {
        val += ' bytes';
    }
     return '<td>' + val + '</td>'      
}

function xcom_tclose() {
  return "</table>\n";
}

function xcom_params() {
    var params = new Array(),i=0;
    var opts =  xcom_getInputValue('xcom_opts');
    opts = opts.replace(/^\s+/,"");
    opts = opts.replace(/\s+$/,"");
    if(opts) opts = opts.split(/,/);
    
    var fn_sel = document.getElementById('xcom_sel');       
    if(fn_sel.selectedIndex > 0) {
    params[i]  = fn_sel.options[fn_sel.selectedIndex].value;
     }
     else {
       if(!opts) return false;      
       return params[i] = opts;
     }     
    
    var page = document.getElementById('xcom_pageid').value;
    if(page) params[++i] = page;
    if(opts.length) {
          for(j=0;j<opts.length;j++) {
            params[++i] = opts[j]; 
          }
}
    fn_sel.selectedIndex = 0;
    return params;
}

function xcom_select(t) {
//alert(t.selectedIndex + " \n" + t.options[t.selectedIndex].value);
}

function xcom_toggle(which) {
  jQuery(which).toggle();
}

function xcom_show(which) {
   document.getElementById(which).style.display = 'block'; 
}

function xcom_hide(which) {
  document.getElementById(which).style.display = 'none'; 
}

function xcom_clear(which) {
  if(which == 'xcom_editable') {
     xcom_setValue(which,"");     
     return;
  }
  document.getElementById(which).innerHTML= '';   
  xcom_hide(which);
/**
      creates credentials array for Json encoding
*/
function xcom_json_ini() {
    jobj = {};
     for (i=0; i<arguments.length; i++) {
        var val = xcom_getInputValue(arguments[i]);
        var key = (arguments[i].split(/_/))[1];
        jobj[key] = val;
     }
     return jobj;
}

function xcom_getInputValue(item) {  
    var d = document.getElementById(item);
    if(!d) return;
    return  d.value;
}


function xcom_setValue(item,val) {  
   var d = document.getElementById(item);
   if(!d) return;
   d.value = val; 
}


/**
   JSON.stringify combines elements from both of below:
      http://blogs.sitepointstatic.com/examples/tech/json-serialization/json-serialization.js
      https://gist.github.com/chicagoworks/754454
*/
var JSON = JSON || {};
// implement JSON.stringify serialization
JSON.stringify = JSON.stringify || function (obj) {
	var t = typeof (obj);
	if (t != "object" || obj === null) {
		// simple data type
		if (t == "string") obj = '"'+obj+'"';
		return String(obj);
	} else {
    
		// recurse array or object
		var n, v, json = [], arr = (obj && obj.constructor == Array);
		for (n in obj) {
                v = obj[n];
                t = typeof(v);
                if (obj.hasOwnProperty(n)) {
                    if (t == "string") {
                        v = '"' + v + '"';
                    } else if (t == "object" && v !== null){
                        v = jQuery.stringify(v);
                    }

			json.push((arr ? "" : '"' + n + '":') + String(v));
		}
            }

		return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
	}
};


jQuery( document ).ready(function() {     
       var sel = document.getElementById('xcom_sel');   
       for(i=0; i<xcom_opts.length; i++) {
           var text = xcom_opts[i].match(/^plugin\./) ? xcom_opts[i].replace(/^plugin\./,"") : (xcom_opts[i].split('.'))[1]; 
           sel.add(new Option(text,xcom_opts[i]));
       }
       var ini = { 'xcom_user': 'rpcuser', 'xcom_pwd': 'rpcpwd', 'xcom_url': 'http://192.168.0.77/adora'};  
        for (var key in ini) {  
           xcom_setValue(key,ini[key]);        
       }
});

var xcom_opts=new Array(
'dokuwiki.getPagelist',
'dokuwiki.search',
'dokuwiki.getTitle',
'dokuwiki.appendPage',
'wiki.aclCheck',
'wiki.getPage',
'wiki.getPageVersion',
'wiki.getPageInfo',
'wiki.getPageHTML',
'wiki.putPage',
'wiki.listLinks',
'wiki.getAllPages',
'wiki.getAttachments',
'wiki.getAttachmentInfo',
'wiki.putAttachment',
'plugin.acl.addAcl',
'plugin.acl.delAcl'

);