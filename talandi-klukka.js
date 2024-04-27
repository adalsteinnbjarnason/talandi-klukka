// thooClock, a jQuery Clock
// by Thomas Haaf aka thooyork, http://www.smart-sign.com
// Twitter: @thooyork
// Version 1.0.2
// Copyright (c) 2013 thooyork

// MIT License, http://opensource.org/licenses/MIT

(function ($) {

    $.fn.thooClock = function (options) {

        this.each(function () {
            var cnv,
                ctx,
                jsps,
                defaults,
                settings,
                radius,
                y,
				globalDate;

            defaults = {
                size: 250,
                dialColor: '#000000',
                dialBackgroundColor: 'transparent',
                secondHandColor: '#F3A829',
                minuteHandColor: '#0000cc',
                hourHandColor: '#ff0000',
                showNumerals: true,
                numerals: [
                    { 1: 1 },
                    { 2: 2 },
                    { 3: 3 },
                    { 4: 4 },
                    { 5: 5 },
                    { 6: 6 },
                    { 7: 7 },
                    { 8: 8 },
                    { 9: 9 },
                    { 10: 10 },
                    { 11: 11 },
                    { 12: 12 }
                ],
                sweepingMinutes: true,
                sweepingSeconds: false,
                numeralFont: 'Sans-serif',
                brandFont: 'arial',
				facePlateColor: undefined,
				facePlateRimShading: '#333;white;#333',
				facePlateMetal: true
            };

            settings = $.extend({}, defaults, options);

            jsps = this;			// Javascript program settings

            jsps.size = settings.size;
            jsps.dialColor = settings.dialColor;
            jsps.dialBackgroundColor = settings.dialBackgroundColor;
            jsps.secondHandColor = settings.secondHandColor;
            jsps.minuteHandColor = settings.minuteHandColor;
            jsps.hourHandColor = settings.hourHandColor;
            jsps.timeCorrection = settings.timeCorrection;
            jsps.showNumerals = settings.showNumerals;
            jsps.numerals = settings.numerals;
            jsps.numeralFont = settings.numeralFont;

            jsps.brandText = settings.brandText;
            jsps.brandText2 = settings.brandText2;
            jsps.brandFont = settings.brandFont;

            jsps.onEverySecond = settings.onEverySecond;

            jsps.sweepingMinutes = settings.sweepingMinutes;
            jsps.sweepingSeconds = settings.sweepingSeconds;
			
			jsps.facePlateColor = settings.facePlateColor;
			jsps.facePlateRimShading = settings.facePlateRimShading;
			jsps.facePlateMetal = settings.facePlateMetal;

            cnv = document.createElement('canvas');
            ctx = cnv.getContext('2d');

            cnv.width = this.size;
            cnv.height = this.size;
            $(cnv).appendTo(jsps);						// append canvas to element

            radius = parseInt(jsps.size / 2, 10);
            ctx.translate(radius, radius); 				// translate 0,0 to center of circle:

            function toRadians(deg) {
                return (Math.PI / 180) * deg;
            }
			
			function face(radius) {
				ctx.save();
				drawFace(radius);
				
				if (jsps.facePlateMetal) {
					drawMetalPlate(radius);
				}
				
				ctx.restore();			
			}
			
			function drawMetalPlate(radius) {
				var metalFileName = "resources/lined-metal-background_53876-88838.jpg";
				ctx.beginPath();
				ctx.globalCompositeOperation = 'darken'; 
				ctx.arc(0, 0, radius+15, 0, 2 * Math.PI);
				ctx.clip();
				ctx.translate(-radius-20, -radius-20);
				var img = new Image();
				img.src = metalFileName;
				ctx.drawImage(img, 0, 0, 1380, 920, 0, 0, cnv.width, cnv.height);
				ctx.translate(-radius+20, -radius+20);
				ctx.closePath();
			}
			
			function drawFace(radius) {
				ctx.beginPath();
				
				ctx.arc(0, 0, radius, 0, 2 * Math.PI);

				if (jsps.facePlateColor !== undefined) {
					ctx.fillStyle = jsps.facePlateColor;
					ctx.fill();
				}
				
				var rimColors = [];
				if (jsps.facePlateRimShading) {
					rimColors = jsps.facePlateRimShading.split(';');
				}				
				
				if (rimColors.length == 3) {
					
					var grad = ctx.createRadialGradient(0, 0, radius * 0.95, 0, 0, radius * 1.05);
					
					grad.addColorStop(0, rimColors[0] || '#333'); // options.plates_inner_rim 
					grad.addColorStop(0.5, rimColors[1] || 'white'); // options.rim
					grad.addColorStop(1, rimColors[2] || '#333'); // options.outer_rim
					
					ctx.strokeStyle = grad;
					ctx.lineWidth = radius * 0.1;
					ctx.stroke();
				}
				
					ctx.beginPath();
					ctx.arc(0, 0, radius * 0.1, 0, 2 * Math.PI);
					ctx.fillStyle = '#333'; // options.knob ||
					ctx.fill();
				
				
				ctx.closePath();
			}			

            function drawDial(color, bgcolor) {
                var dialRadius,
                    dialBackRadius,
                    i,
                    ang,
                    sang,
                    cang,
                    sx,
                    sy,
                    ex,
                    ey,
                    nx,
                    ny,
                    text,
                    textSize,
                    textWidth,
                    brandtextWidth,
                    brandtextWidth2;

				dialRadius = parseInt(radius - (jsps.size / 10), 10);
				dialBackRadius = radius - (jsps.size / 500);

				face(radius * 0.9);

                for (i = 1; i <= 60; i += 1) {
                    ang = Math.PI / 30 * i;
                    sang = Math.sin(ang);
                    cang = Math.cos(ang);

                    // hour marker/numeral
                    if (i % 5 === 0) {
                        ctx.lineWidth = parseInt(jsps.size / 50, 10);
                        sx = sang * (dialRadius - dialRadius / 9);
                        sy = cang * -(dialRadius - dialRadius / 9);
                        ex = sang * dialRadius;
                        ey = cang * - dialRadius;
                        nx = sang * (dialRadius - dialRadius / 4.2);
                        ny = cang * -(dialRadius - dialRadius / 4.2);
                        marker = i / 5;

                        ctx.textBaseline = 'middle';
                        textSize = parseInt(jsps.size / 13, 10);
                        ctx.font = '100 ' + textSize + 'px ' + jsps.numeralFont;
                        ctx.beginPath();
                        ctx.fillStyle = color;

                        if (jsps.showNumerals && jsps.numerals.length > 0) {
                            jsps.numerals.map(function (numeral) {
                                if (marker == Object.keys(numeral)) {
                                    textWidth = ctx.measureText(numeral[marker]).width;
                                    ctx.fillText(numeral[marker], nx - (textWidth / 2), ny);
                                }
                            });
                        }
                        //minute marker
                    } else {
                        ctx.lineWidth = parseInt(jsps.size / 100, 10);
                        sx = sang * (dialRadius - dialRadius / 20);
                        sy = cang * -(dialRadius - dialRadius / 20);
                        ex = sang * dialRadius;
                        ey = cang * - dialRadius;
                    }

                    ctx.beginPath();
                    ctx.strokeStyle = color;
                    ctx.lineCap = "round";
                    ctx.moveTo(sx, sy);
                    ctx.lineTo(ex, ey);
                    ctx.stroke();
                }

                if (jsps.brandText !== undefined) {
                    ctx.font = '100 ' + parseInt(jsps.size / 28, 10) + 'px ' + jsps.brandFont;
                    brandtextWidth = ctx.measureText(jsps.brandText).width;
                    ctx.fillText(jsps.brandText, -(brandtextWidth / 2), (jsps.size / 6));
                }

                if (jsps.brandText2 !== undefined) {
                    ctx.textBaseline = 'middle';
                    ctx.font = '100 ' + parseInt(jsps.size / 44, 10) + 'px ' + jsps.brandFont;
                    brandtextWidth2 = ctx.measureText(jsps.brandText2).width;
                    ctx.fillText(jsps.brandText2, -(brandtextWidth2 / 2), (jsps.size / 5));
                }

            }
			
            function twelvebased(hour) {
                if (hour >= 12) {
                    hour = hour - 12;
                }
                return hour;
            }

            function drawHand(length) {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, length * -1);
                ctx.stroke();
            }

            function drawSecondHand(milliseconds, seconds, color) {
				var ang = toRadians((milliseconds * 0.006) + (seconds * 6));
				
				var path = sec_hand_path;
				
				ctx.save();
				ctx.rotate(ang);
				ctx.beginPath();
				ctx.moveTo(path[0][0], path[0][1]);

				for (i = 1; i < path.length; i++) {
					ctx.lineTo(path[i][0], path[i][1]);
				}
				ctx.closePath();
				ctx.fillStyle = color;
				ctx.fill();
				ctx.restore();

				// secondsPivot
				ctx.beginPath();
				ctx.arc(0, 0, 8, 0, 6.2831); //2*pi
				ctx.fillStyle = color;
				ctx.fill();
				ctx.closePath();
			}
			
			function drawSecondHand(milliseconds, seconds, color) {
				var shlength = (radius) - (jsps.size / 10);

                ctx.save();
                ctx.lineWidth = parseInt(jsps.size / 150, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;

                var ang = toRadians((milliseconds * 0.006) + (seconds * 6));
				ctx.rotate(ang);

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(jsps.size / 80, 10);
                ctx.shadowOffsetX = parseInt(jsps.size / 200, 10);
                ctx.shadowOffsetY = parseInt(jsps.size / 200, 10);

                drawHand(shlength);

                //tail of secondhand
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.lineTo(0, shlength / 15);
                ctx.lineWidth = parseInt(jsps.size / 30, 10);
                ctx.stroke();

                //round center
                ctx.beginPath();
                ctx.arc(0, 0, parseInt(jsps.size / 30, 10), 0, 360, false);
                ctx.fillStyle = color;

                ctx.fill();
                ctx.restore();
            }

            function drawMinuteHand(minutes, color) {
                // var mhlength = jsps.size / 2.2;
				var mhlength = jsps.size / 2.8;
                ctx.save();
                ctx.lineWidth = parseInt(jsps.size / 50, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;

                if (!jsps.sweepingMinutes) {
                    minutes.isInteger ? minutes : minutes = parseInt(minutes);
                }
                var ang = toRadians(minutes * 6);
				ctx.rotate(ang);

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(jsps.size / 50, 10);
                ctx.shadowOffsetX = parseInt(jsps.size / 250, 10);
                ctx.shadowOffsetY = parseInt(jsps.size / 250, 10);

                drawHand(mhlength);
                ctx.restore();
            }

            function drawHourHand(hours, color) {
				var hhlength = jsps.size / 4;
                ctx.save();
                ctx.lineWidth = parseInt(jsps.size / 25, 10);
                ctx.lineCap = "round";
                ctx.strokeStyle = color;
				var ang = toRadians(hours * 30);
                ctx.rotate(ang);

                ctx.shadowColor = 'rgba(0,0,0,.5)';
                ctx.shadowBlur = parseInt(jsps.size / 50, 10);
                ctx.shadowOffsetX = parseInt(jsps.size / 300, 10);
                ctx.shadowOffsetY = parseInt(jsps.size / 300, 10);

                drawHand(hhlength);
                ctx.restore();
            }
			
            function timeToDecimal(time) {
                var h,
                    m;
                if (time !== undefined) {
                    h = twelvebased(time.getHours());
                    m = time.getMinutes();
                }
                return parseInt(h, 10) + (m / 60);
            }
            //listener
            if (jsps.onEverySecond !== undefined) {
                $(jsps).on('onEverySecond', function (e) {
                    jsps.onEverySecond(globalDate);
                    e.preventDefault();
                });
            }

            y = 0;

            function startClock() {
                var theDate,
                    ms,
                    s,
                    m,
                    hours,
                    mins,
                    h,
					mc;

				theDate = new Date();
				globalDate = theDate;

				mc = $('#manualClock').val();

				if (mc !== undefined) {
					var hhmm = mc.split(':');
					if (hhmm.length === 2) {
						var hh = hhmm[0];
						var mm = hhmm[1];
						if ((hh >= 0 && hh < 24) && (mm >= 0 && mm < 60)) {
							
							// theDate = new Date(2024, 12, 1, hh, mm, 1);
							theDate.setHours(hh);
							theDate.setMinutes(mm);
							theDate.setSeconds(1);
							
							globalDate = theDate;
							$(jsps).trigger('onEverySecond');
						}
					}
                }
				
                s = theDate.getSeconds();
                jsps.sweepingSeconds ? ms = theDate.getMilliseconds() : ms = 0;
                mins = theDate.getMinutes();
                m = (mins + (s / 60));
                hours = theDate.getHours();
                h = twelvebased(hours + (m / 60));

                ctx.clearRect(-radius, -radius, jsps.size, jsps.size);

                drawDial(jsps.dialColor, jsps.dialBackgroundColor);

                drawHourHand(h, jsps.hourHandColor);
                drawMinuteHand(m, jsps.minuteHandColor);
                drawSecondHand(ms, s, jsps.secondHandColor);

                //trigger every second custom event
                if (y !== s) {
                    $(jsps).trigger('onEverySecond');
                    y = s;
                }

                window.requestAnimationFrame(function () { startClock() });

            }

            startClock();

        });//return each this;
    };

}(jQuery));