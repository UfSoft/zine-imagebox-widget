/**
 * Imgbox 1.0 (Requires -my- _a_ center-plugin)
 *
 * Open links that point to images in the same scope in the "ImgBox"
 * Also groupds images in the same scope and adds navigation
 *
 * Usage: $('#random-images, #holiday-photos').imgbox();
 *
 * @class imgbox
 * @param {Object} conf, custom config-object
 *
 * Copyright (c) 2008 Andreas Lagerkvist (andreaslagerkvist.com)
 * Released under a GNU General Public License v3 (http://creativecommons.org/licenses/by/3.0/)
 */
jQuery.fn.imgbox = function(conf) {
	// Config for plug-in
	var config = {
		id: 'imgbox', 				// Id of imgbox container
		show: 'show', 				// Show-animation for imgbox
		hide: 'hide', 				// Hide-animation for imgbox
		speed: 0, 					// Animation-speed
		loadingText: 'Loading...'
	};
	config = jQuery.extend(config, conf);

	// These are LinksThatPointToImages
	var ltpti = 'a[href$=".jpg"], a[href$=".bmp"], a[href$=".gif"], a[href$=".png"]';

	// Create imgbox container, loader and underlay if not already created
	if(!$('#' +config.id).length) {
		jQuery('<div id="' +config.id +'"></div>').appendTo('body').hide();
		jQuery('<div id="' +config.id +'-loading">' +config.loadingText +'</div>').appendTo('body').hide();
	//	jQuery('<div id="' +config.id +'-underlay"></div>').appendTo('body').css({position: 'fixed', left: '0', top: '0', width: '100%', height: '100%', backgroundColor: '#000', opacity: '0.8', zIndex: '10'}).hide();
	}

	var doImgbox = function() {
		// Create list of images in this scope that will be used as navigation in this "album"
		var loi	= '<ul>', 
			j	= 0;

		jQuery(this).find(ltpti).each(function() {
			var alt		= jQuery(this).find('img').attr('alt') || '';
			var	title	= jQuery(this).attr('title') || '';
			var	href	= jQuery(this).attr('href');
			var thumb	= href;

			// You can remove this if-statement if you like, in my framework (aFramework) all images
			// with a _small suffix are run through Thumb.php, if you have a thumb.php of your own
			// then alter the thumb-var accordingly to speed things up. Firefox gets really slow
			// displaying more than ~10 ~>=800x600 images, i've set my thumb-script to 100x* and quality=10.
			// Because I use the same files as those up for download this is unfortunately needed. Sorry!
			if(typeof(aFramework) === 'object') {
				thumb = href.substr(0, href.length - 4) +'_small' +href.substr(href.length - 4) +'?w=100&amp;q=10';
			}

			loi += '<li><a href="' +href +'" title="' +title +'"><img src="' +thumb +'" alt="' +alt +'" /></a></li>';
			j++;
		});

		loi += '</ul>';

		// No need for navigation if there's just one image
		if(j === 1) {
			loi = '';
		}

		var applyImgbox = function() {
			// Get information to display in imgbox
			var href		= jQuery(this).attr('href'), 
				title		= jQuery(this).attr('title'), 
				alt			= jQuery(this).find('img').attr('alt'), 
				imgTitle	= (title === undefined) ? '' : '<h2>' +title +'</h2>', 
				imgSrc		= (href === undefined) ? '' : '<p><a href="#" id="' +config.id +'-image" title="View only image"><img src="' +href +'" alt="" /></a></p>', 
				imgDesc		= (alt === undefined) ? '' : '<p>' +alt +'</p>', 
				close		= '<a href="#" id="' +config.id +'-close" title="Close">Close</a>', 
				imgboxHtml	= imgTitle +imgSrc +imgDesc +loi + close;

			// Hide loading, display imgbox and run self on #imgbox (so the list of images acts
			// as navigation) also add .selected class to currently displayed image in list of images
			var displayImgbox = function() {
				jQuery('#' +config.id +'-loading').hide();
				jQuery('#' +config.id).html(imgboxHtml)[config.show](config.speed).center().imgbox();
				jQuery('#' +config.id +' a[href="' +href +'"]').addClass('selected');

				// Close-link
				jQuery('#' +config.id +'-close').click(function() {
					jQuery('#' +config.id)[config.hide](config.speed);
					jQuery('#' +config.id +'-loading').hide();
				//	jQuery('#' +config.id +'-underlay').hide();
					return false;
				});

				// Image-link
				jQuery('#' +config.id +'-image').click(function() {
					window.location = jQuery(this).find('img').attr('src');
					return false;
				});
			};

			// Preload image
			var preload = new Image();
			preload.src = jQuery(this).attr('href');

			if(preload.complete) {
			//	jQuery('#' +config.id +'-underlay').show();
				displayImgbox();
			}
			else {
			//	jQuery('#' +config.id +'-underlay').show();
				jQuery('#' +config.id +'-loading').show().center();

				preload.onload = function() {
					displayImgbox();
				};
			}

			return false;
		};

		// Apply imgbox click-event to all links in the scope, but first unbind same
		// function in case plugin is run twice (after ajax-generated content for example)
		jQuery(this).find(ltpti).unbind('click', applyImgbox).click(applyImgbox);
	};

	// Always return each...
	return this.each(doImgbox);
};