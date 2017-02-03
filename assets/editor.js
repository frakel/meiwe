var url = "mei/editorial_markup.mei";
var page = 1;
var vrvToolkit = new verovio.toolkit();
var editor = ace.edit("editor");
var zoom = 30;
var page_count = 1;
var editor_text = "";
var xml_tree_f = "";
$(function() {
	var paneheight = $(document)
		.height() - $("#header")
		.height() - 20;
	editor.setTheme(
		"ace/theme/monokai"
	);
	editor.getSession().setMode(
		"ace/mode/xml",
		function() {
      editor.getSession().foldAll(2);

		});

	$('.split-pane-divider').on(
		'mouseup',
		function() {
			editor.resize();
			loadverovio();
			console.log(
				"resize"
			);
		})

	$('div.split-pane').splitPane();
	editor.getSession().on(
		'change',
		function(e) {
			//loadverovio(); nicht schnell genug
      editor_text = editor.getValue();
		});
	$.ajax({
		url: url,
		dataType: "text",
		success: function(
			data ) {
        editor_text = data;
			editor.setValue(
				editor_text
			);
			editor.gotoLine(
				1
			);
      load_metadata();
			loadverovio();

		}
	});

	$("#output_svg").click(function() {
		loadverovio();
	});
	$(window).resize(function() {
		loadverovio();
	})
$("#colorprofile").change(function() {

  editor.setTheme($(this).val());

});


//$('#jstree_demo_div').jstree();
});

function setOptions() {
	pageHeight = $("#output_svg").height() *
		100 / zoom;
	pageWidth = $("#output_svg").width() *
		100 / zoom;
	options = {
		pageHeight: pageHeight,
		pageWidth: pageWidth,
		scale: zoom,
		adjustPageHeight: 1,
		ignoreLayout: 1
	};
	vrvToolkit.setOptions(options);
}

function loadPage() {
	svg = vrvToolkit.renderPage(page, {});
	$("#output_svg").html(svg);
}

function loadverovio() {

	setOptions();
	vrvToolkit.redoLayout();
	vrvToolkit.loadData(editor_text);
	loadPage();
	page_count = vrvToolkit.getPageCount();
	check_active();
	console.log(page);
	console.log(page_count);
}

function zoomOut() {
	if (zoom < 20) {
		return;
	}
	zoom = zoom / 1.25;
	loadverovio();
	console.log(zoom);
}

function zoomIn() {
	if (zoom > 80) {
		return;
	}
	zoom = zoom * 1.25;
	loadverovio();
	console.log(zoom);
}

function nextPage() {
	if (page >= vrvToolkit.getPageCount()) {
		return;
	}
	page = page + 1;

	loadverovio();
}

function prevPage() {
	if (page <= 1) {
		return;
	}
	page = page - 1;
	loadverovio();
}

function check_active() {

	if (page == vrvToolkit.getPageCount()) {
		$("#nextpage").addClass(
			"disabled");
	} else {
		$("#nextpage").removeClass(
			"disabled");
		console.log("count pages: " +
			vrvToolkit.getPageCount()
		);
	}
	if (page == 1) {
		$("#prevpage").addClass(
			"disabled");
	} else {
		$("#prevpage").removeClass(
			"disabled");
	}
	if (zoom < 20) {
		$("#zoomout").addClass(
			"disabled");
	} else {
		$("#zoomout").removeClass(
			"disabled");
	}
	if (zoom > 80) {
		$("#zoomin").addClass(
			"disabled");
	} else {
		$("#zoomin").removeClass(
			"disabled");
	}
}

function loadsettings() {
  $("#settings").css("display","block");

}

$("#closesettings").click(function() {
  $("#settings").css("display","none");
});
var right_box_state = 0;
function toggle_viewbox() {
  if(right_box_state == 0) {
    $("#output_svg").css("display","none");
    $("#output-navi").css("display","none");
    $("#output_meta").css("display","block");

    $("#viewboxi").removeClass("fa-book").addClass("fa-music");
    right_box_state = 1;
}
else {
  $("#output_svg").css("display","block");
  $("#output-navi").css("display","block");
  $("#output_meta").css("display","none");
  $("#viewboxi").removeClass("fa-music").addClass("fa-book");
  right_box_state = 0;
}
}

function load_metadata () {
  var regexp = /\<meiHead\>([\s\S]*)\<\/meiHead\>/g;
  var xmld = editor_text.match(regexp);
  xml_tree_f = xmld[0];
  var xml_tree = document.getElementById("xml_tree");

  console.log(xml_tree_f);
  Xonomy.setMode("laic");

  Xonomy.render(xml_tree_f, xml_tree, null);
}
