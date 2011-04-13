(function(a,b){a.namespace("REFINERYCMS.dialog");a.dialog.ImageDialog=function(c){this.name="ImageDialog";this.version="0.1";this.callback=c||null;this.init();};a.dialog.ImageDialog.prototype={validation_rules:{"image-url":[{op:":filled",msg:"Url must be filled"},{op:":url",msg:"Is not valid url"}]},submit_image_choice:function(){$(parent.document.getElementById("wym_dialog_submit")).click();},set_image:function(d){var h=this,i=$("#existing_image_size_area"),e=$("#existing_image_area_content"),g=d||[];if(g.length>0){e.find("li.selected").removeClass("selected");var f=i.find("li.selected a");var k=f.attr("data-geometry"),l=f.attr("data-size"),c=$("#wants_to_resize_image").is(":checked"),j=c?g.attr("data-"+l):g.attr("data-original");g.parent().addClass("selected");h.set_wym_values(j,g.attr("alt"),g.attr("title"),k);}},set_wym_values:function(f,e,g,j){if(parent){var d=parent.document.getElementById("wym_src"),c=parent.document.getElementById("wym_alt"),i=parent.document.getElementById("wym_title"),h=parent.document.getElementById("wym_size");j=j||null;if(d!==null&&f!==null){d.value=f;}if(c!==null&&e!==null){c.value=e;}if(i!==null&&g!==null){i.value=g;}if(h!==null&&j!==null){h.value=j.replace(/[<>=]/g,"");}}},init_actions:function(){this.init_include_existing_image();this.init_include_url_image();},init_include_existing_image:function(){var f=this,g=[],c=$("#existing_image_submit_button"),d=$("#existing_image_size_area"),h=$("#existing_image_area_content"),e=$("#wants_to_resize_image");c.click(function(i){i.preventDefault();f.submit_loader_on();f.submit_image_choice();});d.find("a").click(function(i){d.find("li").removeClass("selected");$(this).parent().addClass("selected");e.attr("checked","checked");f.set_image(h.find("li.selected img"));i.preventDefault();});e.change(function(){if($(this).is(":checked")){d.find("li:first a").click();}else{d.find("li").removeClass("selected");f.set_image(h.find("li.selected img"));}});h.find("img").click(function(i){i.preventDefault();f.set_image($(this));return false;});g=h.find("li.selected img");g=g.length===0?h.find("img").first():g;if(g.length>0){f.set_image(g);}},init_include_url_image:function(){var c=this;$("#url_image_submit_button").click(function(j){var h=$("#image-url"),d=$("#image-url-alt"),g=h.val(),f=d.val(),i=a.form.validateControl(h.get(0),this.validation_rules["image-url"],false);j.preventDefault();if(i){c.set_wym_values(g,f,f,null);c.submit_image_choice();}});},init:function(){try{this.init_actions();this.init_tabs();this.initialised=true;}catch(c){}}};a.extendObject(a.dialog.ImageDialog,a.Dialog);}(REFINERYCMS,window));