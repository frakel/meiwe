var Meiwe = {};

Meiwe.url = "mei/editorial_markup.mei";
Meiwe.scorePage = 1;
Meiwe.vrvToolkit = new verovio.toolkit();
Meiwe.editor = ace.edit("editor");
Meiwe.scoreZoom = 30;
Meiwe.pageCount = 1;
Meiwe.editorText = "";
Meiwe.rightBoxState = 0;

/*
* 		Initalize Verovio Score
 */
Meiwe.initVerovio = (function() {
	console.log("init verovio toolkit...");
		setOptions = function() {
				var pageHeight = $(
								"#output_svg"
						).height() *
						100 /
						Meiwe.scoreZoom;
				var pageWidth = $(
								"#output_svg"
						).width() *
						100 /
						Meiwe.scoreZoom;
				if(isNaN(pageHeight) || isNaN(pageWidth)) console.error(pageHeight+"/"+pageWidth+": Pagewidth or -height is not a number");

				options = {
						pageHeight: pageHeight,
						pageWidth: pageWidth,
						scale: Meiwe.scoreZoom,
						adjustPageHeight: 1,
						ignoreLayout: 1
				};
					Meiwe.vrvToolkit.setOptions(
							options
						);



		}
		loadPage = function() {
			if(isNaN(Meiwe.scorePage) || Meiwe.scorePage < 1) console.error("Meiwe.scorePage: type error or null");
			console.log("load page...");
				svg = Meiwe.vrvToolkit.renderPage(
						Meiwe.scorePage, {}
				);
				$("#output_svg").html(
						svg);
		}

		loadVerovio = function() {
			console.log("load verovio toolkit...");
				setOptions();
				Meiwe.vrvToolkit.redoLayout();
				Meiwe.vrvToolkit.loadData(
						Meiwe.editorText
				);
				loadPage();
				pageCount =
						Meiwe.vrvToolkit.getPageCount();
				Meiwe.navigator.checkIfActive();
		}
		return {
				setOptions,
				loadPage,
				loadVerovio
		};
})();
/*
*				initalize Metadata editor
*/
Meiwe.initMeta = (function() {
	console.log("init metadata");
		var loadMeta = function() {
			var regexp =
					/\<meiHead\>([\s\S]*)\<\/meiHead\>/g;
			var metaData = Meiwe.editorText.match(regexp);  // geht das auch relativ?
			if(metaData[0] == "" || metaData[0] == null) console.log("Keine Metadaten gefunden");
			var xmlTreeDom = document.getElementById(
					"xml_tree");

			Xonomy.setMode("laic");
			Xonomy.render(metaData[0], xmlTreeDom,
					null);

		}
		return { loadMeta }
})();

/*
 *				navigator – Handles basic navigation functions of the score
 */
Meiwe.navigator = (function() {
		var navigateScore =
				function(action) {
					console.log(action);
						if (action ==
								"scoreZoomOut"
						) {
								if (Meiwe.scoreZoom <
										20) {
										return;
								}
								Meiwe.scoreZoom =
										Meiwe.scoreZoom /
										1.25;

						}
						else if(action ==
								"scoreZoomIn"
						) {
								if (Meiwe.scoreZoom >
										80) {
										return;
								}
								Meiwe.scoreZoom =
										Meiwe.scoreZoom *
										1.25;

						}
						else if(action ==
								"scoreNextPage"
						) {
								if (
										Meiwe.scorePage >=
										Meiwe.vrvToolkit
										.getPageCount()
								) {
										return;
								}
								Meiwe.scorePage
										+= 1;
						}
						else if(action ==
								"scorePrevPage"
						) {
								if (
										Meiwe.scorePage <=
										1) {
										return;
								}
								Meiwe.scorePage
										-= 1;
						}
						else {
							console.log("invalid action for navigateScore()");
						}
						Meiwe.initVerovio.loadVerovio();
				}
		var checkIfActive =
				function() {
						if (Meiwe.scorePage ==
								Meiwe.vrvToolkit.getPageCount()
						) {
								$("#nextpage")
										.addClass(
												"disabled"
										);
						} else {
								$("#nextpage")
										.removeClass(
												"disabled"
										);

						}
						if (Meiwe.scorePage == 1) {
								$("#prevpage")
										.addClass(
												"disabled"
										);
						} else {
								$("#prevpage")
										.removeClass(
												"disabled"
										);
						}
						if (Meiwe.scoreZoom < 20) {
								$("#zoomout").addClass(
										"disabled"
								);
						} else {
								$("#zoomout").removeClass(
										"disabled"
								);
						}
						if (Meiwe.scoreZoom > 80) {
								$("#zoomin").addClass(
										"disabled"
								);
						} else {
								$("#zoomin").removeClass(
										"disabled"
								);
						}
				}
				var toggleViewbox =
						function() {
					if (this.rightBoxState == 0) {
							$("#output_svg").css("display",
									"none");
							$("#output-navi").css(
									"display", "none");
							$("#output_meta").css(
									"display", "block");

							$("#viewboxi").removeClass(
									"fa-book").addClass(
									"fa-music");
							this.rightBoxState = 1;
					} else {
							$("#output_svg").css("display",
									"block");
							$("#output-navi").css(
									"display", "block");
							$("#output_meta").css(
									"display", "none");
							$("#viewboxi").removeClass(
									"fa-music").addClass(
									"fa-book");
							this.rightBoxState = 0;
					}
				}

		return {
				navigateScore,
				checkIfActive,
				toggleViewbox
		}

})();
Meiwe.initMei = function() {
	console.log("load mei-file...");
	$.ajax({
			url: this.url,
			dataType: "text",
			success: function(
					data) {
					Meiwe.editorText =
							data;

					Meiwe.editor.setValue(
							Meiwe.editorText
					);
					Meiwe.editor.gotoLine(
							1
					);

					Meiwe.initVerovio
							.loadVerovio();
					Meiwe.initMeta.loadMeta();
			}
	});

}
Meiwe.createPopup = function(name) {

	$("#"+name).css(
			"display", "none");
	$("#open"+name).click(function() {
			$("#"+name).css(
					"display", "block");
	});
	$("#close"+name).click(function() {
			$("#"+name).css(
					"display", "none");
	});
}
Meiwe.setMeiPath = function() {
	var url = $("#file-path").val();
	Meiwe.url = url;
	Meiwe.initMei();
	Meiwe.editor.getSession()
			.foldAll(2);
}
/* Init function for MEISE */
Meiwe.initalize = function()  {

		/*
		* ACE
		*/
		this.editor.setTheme(
				"ace/theme/monokai"
		);
		this.editor.getSession().setMode(
				"ace/mode/xml",
				function() {
						Meiwe.editor.getSession()
								.foldAll(2);
				});
				Meiwe.editor.getSession().on(
						'change',
						function(e) {
								//loadverovio(); nicht schnell genug
								Meiwe.editorText =
										Meiwe.editor.getValue();
						});

				var paneheight = $(document)
						.height() - $("#header")
						.height() - 20;

				$('.split-pane-divider').on(
						'mouseup',
						function() {
								Meiwe.editor.resize();
								Meiwe.initVerovio.loadVerovio();
						});
		$('div.split-pane').splitPane();


		Meiwe.initMei();


		$("#output_svg").click(
				function() {
						Meiwe.initVerovio.loadVerovio();
				});

		$(window).resize(function() {
				Meiwe.initVerovio.loadVerovio();
		});

		$("#colorprofile").change(
				function() {
						Meiwe.editor.setTheme($(
								this).val());
				});

}
