REFINERYCMS.Dialog=function(){throw new Error(this.name+"_is_not_instantiable");};REFINERYCMS.Dialog.prototype={name:"Dialog",version:"0.1",callback:null,active_area:null,initialised:false,validation_rules:[],init_tabs:function(){var d=this,e=$("#dialog_menu_left input:radio"),b=$("#errorExplanation"),c=e.parent().filter(".selected_radio").find("input:radio").first()||e.first();if(b.length>0){var a=b.closest("div.dialog_area");if(a.length>0){c=$("#"+a.attr("id").replace("_area","_radio")).find("input:radio").first();}}c.attr("checked","true");d.switch_area(c);e.click(function(){d.switch_area($(this));});},disable_submit:function(){},enable_submit:function(){},submit_loader_off:function(){$("img.save-loader").remove();},submit_loader_on:function(){$('<img src="/images/refinery/ajax-loader.gif" width="16" height="16" class="save-loader" />').appendTo($("div.form-actions-left"));},switch_area:function(a){var b=$(a);$("#dialog_menu_left .selected_radio").removeClass("selected_radio");b.parent().addClass("selected_radio");$("#dialog_main .dialog_area").hide();$("#"+b.val()+"_area").show();this.active_area=b.val();},validate_active_tab:function(){var b=true,a=null,c=null;if(this.validation_rules&&this.validation_rules[this.active_area]){for(a in this.validation_rules[this.active_area]){c=document.getElementById(a);if(c){b=REFINERYCMS.form.validateControl(c,this.validation_rules[this.active_area][a],true);}if(!b){break;}}}return b;},iframed:function(){return(parent&&parent.document&&parent.document.location.href!==document.location.href&&$.isFunction(parent.$));},close:function(){var b,a;if(!$(document.body).hasClass("wym_iframe_body")){b=this.iframed()?$(parent.document.body):$(document.body);a=b.find(".ui-dialog-content");b.removeClass("hide-overflow");a.filter(":data(dialog)").dialog("close");a.remove();}return false;},init_close:function(){var a=this;$(".close_dialog").click(function(b){b.preventDefault();a.close();});},init:function(){}};