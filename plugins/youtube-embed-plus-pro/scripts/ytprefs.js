(function (window, $)
{
    window._EPYT_ = window._EPYT_ || {
        ajaxurl: "\/wp-admin\/admin-ajax.php",
        security: "",
        gallery_scrolloffset: 100,
        eppathtoscripts: "\/wp-content\/plugins\/youtube-embed-plus-pro\/scripts\/",
        eppath: "\/wp-content\/plugins\/youtube-embed-plus-pro\/",
        epresponsiveselector: ["iframe.__youtube_prefs_widget__"],
        epdovol: true,
        evselector: 'iframe.__youtube_prefs__[src], iframe[src*="youtube.com/embed/"], iframe[src*="youtube-nocookie.com/embed/"]',
        stopMobileBuffer: true,
        ajax_compat: false,
        usingdefault: true,
        ytapi_load: 'light',
        pause_others: false,
        facade_mode: false,
        not_live_on_channel: false,
        not_live_showtime: 180,
        maxres_facade: 'eager'
    };

    window._EPYT_.touchmoved = false;
    window._EPYT_.lityOpen = false;

    window._EPYT_.apiVideos = window._EPYT_.apiVideos || {};

    if (window.location.toString().indexOf('https://') === 0)
    {
        window._EPYT_.ajaxurl = window._EPYT_.ajaxurl.replace("http://", "https://");
    }

    window._EPYT_.pageLoaded = false;
    $(window).on('load._EPYT_', function ()
    {
        window._EPYT_.pageLoaded = true;
    });

    if (!document.querySelectorAll)
    {
        document.querySelectorAll = function (selector)
        {
            var doc = document, head = doc.documentElement.firstChild, styleTag = doc.createElement('STYLE');
            head.appendChild(styleTag);
            doc.__qsaels = [];
            styleTag.styleSheet.cssText = selector + "{x:expression(document.__qsaels.push(this))}";
            window.scrollBy(0, 0);
            return doc.__qsaels;
        };
    }

    if (typeof window._EPADashboard_ === 'undefined')
    {
        window._EPADashboard_ =
                {
                    initStarted: false,
                    checkCount: 0,
                    onPlayerReady: function (event)
                    {
                        try
                        {
                            if (typeof _EPYT_.epdovol !== "undefined" && _EPYT_.epdovol)
                            {
                                var vol = parseInt(event.target.getIframe().getAttribute("data-vol"));
                                if (!isNaN(vol))
                                {
                                    if (vol === 0)
                                    {
                                        event.target.mute();
                                    }
                                    else
                                    {
                                        if (event.target.isMuted())
                                        {
                                            event.target.unMute();
                                        }
                                        event.target.setVolume(vol);
                                    }
                                }
                            }

                            var epautoplay = parseInt(event.target.getIframe().getAttribute("data-epautoplay"));
                            if (!isNaN(epautoplay) && epautoplay === 1 && !$(event.target.getIframe()).closest('.lity-hide').length)
                            {
                                event.target.playVideo();
                            }

                        }
                        catch (err)
                        {
                        }

                        try
                        {
                            var $ifm = $(event.target.getIframe());
                            if ($ifm.hasClass('epyt-lbif') && $ifm.hasClass('epyt-thumbplay') && $ifm.closest('.lity-content').length)
                            {
                                // https://github.com/Modernizr/Modernizr/blob/master/feature-detects/video/autoplay.js
                                if (!(navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) && window._EPYT_.stopMobileBuffer))
                                {
                                    event.target.playVideo();
                                }
                            }
                        }
                        catch (err2)
                        {
                        }

                        try
                        {
                            var apiVideoIframe = event.target.getIframe();
                            var apiVideoId = apiVideoIframe.getAttribute("id");
                            window._EPYT_.apiVideos[apiVideoId] = event.target;
                            window._EPADashboard_.doLiveChat(event.target);

                            if (window._EPYT_.not_live_on_channel && event.target.getVideoUrl().indexOf('live_stream') > 0)
                            {
                                window._EPADashboard_.doLiveFallback(apiVideoIframe);
                            }
                        }
                        catch (liveErr)
                        {
                        }
                        finally
                        {
                            $(event.target.getIframe()).css('opacity', 1);
                        }

                        setTimeout(function ()
                        {
                            try
                            {
                                var ytid = window._EPADashboard_.justid(event.target.getVideoUrl());
                                window._EPADashboard_.yt_dash("ytid=" + ytid);

                            }
                            catch (err)
                            {
                            }
                        }, 1700);

                    },
                    onPlayerStateChange: function (event)
                    {
                        var ifm = event.target.getIframe();

                        if (window._EPYT_.pause_others && event.data === window.YT.PlayerState.PLAYING)
                        {
                            window._EPADashboard_.pauseOthers(event.target);
                        }

                        if (event.data === window.YT.PlayerState.PLAYING && event.target.ponce !== true && ifm.src.indexOf('autoplay=1') === -1)
                        {
                            event.target.ponce = true;

                            try
                            {
                                var ytid = window._EPADashboard_.justid(event.target.getVideoUrl());
                                window._EPADashboard_.yt_dash("ytid=" + ytid + "&p=1");

                            }
                            catch (err)
                            {
                            }
                        }

                        if (event.data === window.YT.PlayerState.ENDED && $(ifm).data('relstop') == '1')
                        {
                            if (typeof event.target.stopVideo === 'function')
                            {
                                event.target.stopVideo();
                            }
                            else
                            {
                                var $iframeTemp = $(ifm).clone(true).off();
                                $iframeTemp.attr('src', window._EPADashboard_.cleanSrc($iframeTemp.attr('src').replace('autoplay=1', 'autoplay=0')));
                                $(ifm).replaceWith($iframeTemp);
                                window._EPADashboard_.setupevents($iframeTemp.attr('id'));
                                ifm = $iframeTemp.get(0);
                            }
                        }

                        var $gallery = $(ifm).closest('.epyt-gallery');
                        if (!$gallery.length)
                        {
                            $gallery = $('#' + $(ifm).data('epytgalleryid'));
                        }
                        if ($gallery.length)
                        {
                            var autonext = $gallery.find('.epyt-pagebutton').first().data('autonext') == '1';
                            if (autonext && event.data === window.YT.PlayerState.ENDED)
                            {
                                var $currvid = $gallery.find('.epyt-current-video');
                                if (!$currvid.length)
                                {
                                    $currvid = $gallery.find('.epyt-gallery-thumb').first();
                                }
                                var $nextvid = $currvid.find(' ~ .epyt-gallery-thumb').first();
                                var $lityopen = $('div.lity-wrap[data-lity-close]');
                                if ($nextvid.length)
                                {
                                    if ($lityopen.length)
                                    {
                                        window._EPADashboard_.lb.close();
                                        setTimeout(function ()
                                        {
                                            $nextvid.trigger('click');
                                        }, 1000);

                                    }
                                    else
                                    {
                                        $nextvid.trigger('click');
                                    }
                                }
                                else
                                {
                                    if ($lityopen.length)
                                    {
                                        window._EPADashboard_.lb.close();
                                        setTimeout(function ()
                                        {
                                            $gallery.find('.epyt-pagebutton.epyt-next[data-pagetoken!=""][data-pagetoken]').first().trigger('click');
                                        }, 1000);

                                    }
                                    else
                                    {
                                        $gallery.find('.epyt-pagebutton.epyt-next[data-pagetoken!=""][data-pagetoken]').first().trigger('click');
                                    }

                                }
                            }
                        }

                    },
                    isMobile: function ()
                    {
                        return /Mobi|Android/i.test(navigator.userAgent);
                    },
                    base64DecodeUnicode: function (str)
                    {
                        str = str.replace(/\s/g, '');
                        return decodeURIComponent(Array.prototype.map.call(atob(str), function (c)
                        {
                            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
                        }).join(''))
                    },
                    findSwapBlock: function (playerIframe)
                    {
                        var $swapBlock = $(playerIframe).closest('.wp-block-embed');
                        if (!$swapBlock.length)
                        {
                            $swapBlock = $(playerIframe).closest('.epyt-live-chat-wrapper');
                        }
                        if (!$swapBlock.length)
                        {
                            $swapBlock = $(playerIframe).closest('.epyt-video-wrapper');
                        }
                        if (!$swapBlock.length)
                        {
                            $swapBlock = $(playerIframe);
                        }
                        return $swapBlock;
                    },
                    doLiveFallback: function (playerIframe)
                    {
                        var $swapBlock = _EPADashboard_.findSwapBlock(playerIframe);

                        if ($swapBlock.length)
                        {
                            var $liveFallbackBlock = $('#epyt-live-fallback');
                            if ($liveFallbackBlock.length)
                            {
                                var fallbackHtml = '';
                                try
                                {
                                    fallbackHtml = window._EPADashboard_.base64DecodeUnicode($liveFallbackBlock.get(0).innerHTML);
                                }
                                catch (fallbackErr)
                                {
                                }
                                if (fallbackHtml)
                                {
                                    var $swapBlockParent = $swapBlock.parent();
                                    window._EPADashboard_.loadYTAPI();
                                    $swapBlock.replaceWith(fallbackHtml);
                                    window._EPADashboard_.apiInit();
                                    window._EPADashboard_.pageReady();
                                    setTimeout(function ()
                                    {
                                        if (typeof $.fn.fitVidsEP !== 'undefined')
                                        {
                                            $swapBlockParent.fitVidsEP();
                                        }
                                    }, 1);
                                }
                            }
                        }
                    },
                    doLiveChat: function (player)
                    {
                        var $chatWrapper = $(player.getIframe()).closest('.epyt-live-chat-wrapper');
                        if ($chatWrapper.length)
                        {
                            try
                            {
                                var currentId = typeof player.getVideoData == 'function' ? player.getVideoData().video_id || window._EPADashboard_.justid(player.getVideoUrl()) : window._EPADashboard_.justid(player.getVideoUrl());
                                var chatIframe = document.createElement('iframe');
                                $(chatIframe).addClass('epyt-live-chat').attr('src', 'https://www.youtube.com/live_chat?v=' + currentId + '&embed_domain=' + window.location.hostname);
                                $chatWrapper.find('.epyt-live-chat-box').empty().append(chatIframe);
                                if ($chatWrapper.width() > 964)
                                {
                                    $chatWrapper.addClass('epyt-live-chat-wrapper--wide');
                                }
                                $(window).on('resize', function ()
                                {
                                    if ($chatWrapper.width() > 964)
                                    {
                                        $chatWrapper.addClass('epyt-live-chat-wrapper--wide');
                                        if (navigator.userAgent.indexOf('MSIE') !== -1
                                                || navigator.appVersion.indexOf('Trident/') > -1)
                                        {
// ie 11 doesn't do height: 100%;
                                        }

                                    }
                                    else
                                    {
                                        $chatWrapper.removeClass('epyt-live-chat-wrapper--wide');
                                        if (navigator.userAgent.indexOf('MSIE') !== -1
                                                || navigator.appVersion.indexOf('Trident/') > -1)
                                        {
// ie 11 doesn't do height: 100%;
                                        }
                                    }
                                });
                            }
                            catch (err)
                            {
                            }
                        }
                    },
                    videoEqual: function (a, b)
                    {
                        if (a.getIframe && b.getIframe && a.getIframe().id === b.getIframe().id)
                        {
                            return true;
                        }
                        return false;
                    },
                    pauseOthers: function (currentVid)
                    {
                        if (!currentVid)
                        {
                            return;
                        }
                        for (var vidKey in window._EPYT_.apiVideos)
                        {
                            var vid = window._EPYT_.apiVideos[vidKey];
                            if (
                                    vid &&
                                    typeof vid.pauseVideo === 'function' &&
                                    vid != currentVid &&
                                    !_EPADashboard_.videoEqual(vid, currentVid) &&
                                    typeof vid.getPlayerState === 'function' &&
                                    [YT.PlayerState.BUFFERING, window.YT.PlayerState.PLAYING].indexOf(vid.getPlayerState()) >= 0
                                    )
                            {
                                vid.pauseVideo();
                            }
                        }
                    },
                    justid: function (s, queryParam = 'v')
                    {
                        return new RegExp("[\\?&]" + queryParam + "=([^&#]*)").exec(s)[1];
                    },
                    setupevents: function (iframeid)
                    {
                        if (typeof (window.YT) !== 'undefined' && window.YT !== null && window.YT.loaded)
                        {
                            var thisvid = document.getElementById(iframeid);

                            if (!thisvid.epytsetupdone)
                            {
                                window._EPADashboard_.log('Setting up YT API events: ' + iframeid);
                                thisvid.epytsetupdone = true;
                                var ytOptions = {
                                    events: {
                                        "onReady": window._EPADashboard_.onPlayerReady,
                                        "onStateChange": window._EPADashboard_.onPlayerStateChange
                                    },
                                    host: (thisvid.src || '').indexOf('nocookie') > 0 ? 'https://www.youtube-nocookie.com' : 'https://www.youtube.com'
                                };
                                return new window.YT.Player(iframeid, ytOptions);
                            }
                        }
                    },
                    yt_dash: function (q)
                    {
                        if (window._EPYT_.dshpre)
                        {
                            $.post(_EPYT_.ajaxurl, {
                                action: 'my_embedplus_yt_dash',
                                security: _EPYT_.security,
                                qstring: "es=w&u=" + encodeURIComponent(window.location.href.split("#")[0]) + "&" + q
                            });
                        }
                    },
                    apiInit: function ()
                    {
                        if (typeof (window.YT) !== 'undefined')
                        {
                            window._EPADashboard_.initStarted = true;
                            var __allytifr = document.querySelectorAll(_EPYT_.evselector);
                            for (var i = 0; i < __allytifr.length; i++)
                            {
                                if (!__allytifr[i].hasAttribute("id"))
                                {
                                    __allytifr[i].id = "_dytid_" + Math.round(Math.random() * 8999 + 1000);
                                }
                                window._EPADashboard_.setupevents(__allytifr[i].id);
                            }
                        }
                    },
                    log: function (msg)
                    {
                        try
                        {
                            console.log(msg);
                        }
                        catch (err)
                        {
                        }
                    },
                    doubleCheck: function ()
                    {
                        window._EPADashboard_.checkInterval = setInterval(function ()
                        {
                            window._EPADashboard_.checkCount++;
                            if (window._EPADashboard_.checkCount >= 5 || window._EPADashboard_.initStarted)
                            {
                                clearInterval(window._EPADashboard_.checkInterval);
                            }
                            else
                            {
                                window._EPADashboard_.apiInit();
                                window._EPADashboard_.log('YT API init check');
                            }

                        }, 1000);
                    },
                    selectText: function (ele)
                    {
                        if (document.selection)
                        {
                            var range = document.body.createTextRange();
                            range.moveToElementText(ele);
                            range.select();
                        }
                        else if (window.getSelection)
                        {
                            var selection = window.getSelection();
                            var range = document.createRange();
                            range.selectNode(ele);
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    },
                    lb: typeof (window.lity) !== 'undefined' ? window.lity() : function ()
                    {
                    },
                    fixDims: function (lity_event, lity_instance)
                    {
                        var $ifm = $(lity_event.target).find('iframe');
                        if (($ifm.height() === 0 || $ifm.width() === 0 || $ifm.css('position') !== 'absolute') && !$ifm.parent().parent().hasClass('lity-content'))
                        {
                            var fwvwrap = document.createElement('div');
                            fwvwrap.className = 'fluid-width-video-wrapper';

                            $ifm.unwrap();
                            $ifm.wrap(fwvwrap).parent('.fluid-width-video-wrapper').attr('style', 'padding-top: 56.25% !important;');
                            $ifm.width('100%');
                            $ifm.height('100%');
                        }
                    },
                    setVidSrc: function ($iframe, vidSrc)
                    {
                        if ($iframe.is('.epyt-facade'))
                        {
                            $iframe.attr('data-facadesrc', window._EPADashboard_.cleanSrc(vidSrc));
                            $iframe.trigger('click');
                        }
                        else
                        {
                            var cleanSrcValue = window._EPADashboard_.cleanSrc(vidSrc);
                            if (!$iframe.is('.epyt-lbif') && $iframe.get(0).src && $iframe.get(0).contentWindow && $iframe.get(0).contentWindow.location)
                            {
                                try
                                {
                                    $iframe.get(0).contentWindow.location.replace(cleanSrcValue);

                                }
                                catch (err)
                                {
                                    $iframe.attr('src', cleanSrcValue);
                                }
                            }
                            else
                            {
                                $iframe.attr('src', cleanSrcValue);
                            }
                            $iframe.get(0).epytsetupdone = false;
                            window._EPADashboard_.setupevents($iframe.attr('id'));
                        }
                        $iframe.css('opacity', '1');
                    },
                    cleanSrc: function (srcInput)
                    {
                        var cleanedUrl = srcInput.replace('enablejsapi=1?enablejsapi=1', 'enablejsapi=1');
                        return cleanedUrl;
                    },
                    loadYTAPI: function ()
                    {
                        if (typeof window.YT === 'undefined')
                        {
                            if (window._EPYT_.ytapi_load !== 'never' && (window._EPYT_.ytapi_load === 'always' || $('iframe[src*="youtube.com/embed/"], iframe[data-src*="youtube.com/embed/"], .__youtube_prefs__').length))//, iframe[src*="youtube-nocookie.com/embed/"], iframe[data-src*="youtube-nocookie.com/embed/"]').length))
                            {
                                var iapi = document.createElement('script');
                                iapi.src = "https://www.youtube.com/iframe_api";
                                iapi.type = "text/javascript";
                                document.getElementsByTagName('head')[0].appendChild(iapi);
                            }
                        }
                        else if (window.YT.loaded)
                        {
                            if (window._EPYT_.pageLoaded)
                            {
                                window._EPADashboard_.apiInit();
                                window._EPADashboard_.log('YT API available');
                            }
                            else
                            {
                                $(window).on('load._EPYT_', function ()
                                {
                                    window._EPADashboard_.apiInit();
                                    window._EPADashboard_.log('YT API available 2');
                                });
                            }
                        }
                    },
                    resolveFacadeQuality: function (img, isError)
                    {
                        img.epytFacadeCount = typeof (img.epytFacadeCount) === 'undefined' ? 0 : img.epytFacadeCount + 1;
                        if (isError || img.naturalHeight < 200)
                        {
                            var facadeOldSrc = $(img).attr("src");
                            if (facadeOldSrc)
                            {
                                $(img).attr("src", facadeOldSrc.replace('maxresdefault', 'hqdefault'));
                                $(img).off('load.epyt');
                            }
                        }
                        if (img.epytFacadeCount > 2)
                        {
                            $(img).off('load.epyt');
                        }
                    },
                    maximizeFacadeQuality: function (img)
                    {
                        var facadeOldSrc = $(img).attr("src");
                        if (facadeOldSrc && facadeOldSrc.indexOf('maxresdefault') < 0)
                        {
                            var maxResSrc = facadeOldSrc.replace('hqdefault', 'maxresdefault');
                            var maxRes = new Image();
                            maxRes.src = maxResSrc;
                            $(maxRes).on("load.epyt", function ()
                            {
                                $(maxRes).off('load.epyt');
                                if (maxRes.naturalHeight > 200)
                                {
                                    $(img).off('load.epyt');
                                    $(img).attr("src", maxRes.src);
                                }
                            }).on('error', function ()
                            {
                                $(maxRes).off('load.epyt');
                            }).each(function ()
                            {
                                if (maxRes.complete)
                                {
                                    $(maxRes).trigger('load');
                                }
                            });

                        }
                    },
                    dateDiffInMinutes: function (a, b)
                    {
                        var x = a;
                        var y = b;
                        if (typeof (a) === 'string')
                        {
                            x = new Date(a);
                        }
                        if (typeof (b) === 'string')
                        {
                            y = new Date(b);
                        }

                        var diff = y - x;
                        return Math.floor(diff / (1000 * 60));
                    },
                    realtimeLiveCheck: function (channelId, streams)
                    {
                        var ajaxData = {
                            action: 'my_embedplus_realtimeLiveCheck',
                            security: _EPYT_.security,
                            channelId: channelId,
                            streams: streams
                        };

                        $.post(_EPYT_.ajaxurl, ajaxData, function (response)
                        {
                            var responseJSON = response;
                            if (typeof response === 'string')
                            {
                                responseJSON = JSON.parse(response);

                            }
                            if (responseJSON.fresh_live && confirm("The live stream may have started. Click OK to refresh the page."))
                            {
                                window.location.reload();
                            }
                        });

                    },
                    pageReady: function ()
                    {
                        var $channelStreams = $('.epyt-live-channel, .epyt-do-live-fallback');
                        if ((window._EPYT_.not_live_on_channel || $channelStreams.length) && window._EPYT_.ytapi_load !== 'never')
                        {
                            $channelStreams.each(function ()
                            {
                                var $ch = $(this);
                                if (!$ch.data('eypt-live-processed'))
                                {
                                    $ch.data('eypt-live-processed', true);
                                    $ch.css('opacity', 0);
                                    setTimeout(function ()
                                    {
                                        $ch.css('opacity', 1);
                                    }, 4000);

                                    var allStreamsAttr = $ch.data('streams');
                                    var allStreamsList = allStreamsAttr ? JSON.parse(atob(allStreamsAttr)) : [];
                                    var embedStream = null;
                                    var isActiveStream = false;
                                    var found = false;
                                    var foundIdx = 0;
                                    var passNum = 0;
                                    var channelId = $ch.data('channel') || $ch.data('src') ? window._EPADashboard_.justid($ch.data('src'), 'channel') : window._EPADashboard_.justid($ch.attr('src'), 'channel');

                                    if (!window._EPYT_.alreadyCheckingRealtimeLivestreams)
                                    {
                                        window._EPYT_.alreadyCheckingRealtimeLivestreams = 1;
                                        window._EPADashboard_.realtimeLiveCheck(channelId, allStreamsList);
                                        window._EPYT_.realtimeLivestreamCheckInterval = setInterval(function ()
                                        {
                                            window._EPYT_.alreadyCheckingRealtimeLivestreams++;
                                            window._EPADashboard_.realtimeLiveCheck(channelId, allStreamsList);
                                            if (window._EPYT_.alreadyCheckingRealtimeLivestreams >= 30)
                                            {
                                                clearInterval(window._EPYT_.realtimeLivestreamCheckInterval);
                                            }
                                        }, 30000);
                                    }

                                    if (allStreamsList.length)
                                    {
                                        var now = new Date().toISOString();
                                        var lateGracePeriodMinutes = 180;

                                        // Filter out 'upcoming' streams that are over lateGracePeriodMinutes late according to their schedule, and still haven't actually started yet.
                                        // Also filter out any that have actually ended.
                                        allStreamsList = allStreamsList.filter(function (val)
                                        {
                                            if ((val.liveBroadcastContent === 'upcoming'
                                                    && !val.actualStart
                                                    && val.start < now
                                                    && _EPADashboard_.dateDiffInMinutes(val.start, now) > lateGracePeriodMinutes)
                                                    || val.actualEnd)
                                            {
                                                return false;
                                            }
                                            return true;
                                        });

                                        allStreamsList.sort((a, b) => {
                                            if (a.start < b.start)
                                            {
                                                return -1;
                                            }
                                            if (a.start > b.start)
                                            {
                                                return 1;
                                            }
                                            return 0;
                                        });

                                        //window._EPADashboard_.log(allStreamsList);

                                        // find active stream: strict
                                        while (foundIdx < allStreamsList.length)
                                        {
                                            embedStream = allStreamsList[foundIdx];
                                            if (embedStream.actualStart && now > embedStream.actualStart && embedStream.actualEnd == null && embedStream.liveBroadcastContent === 'live')
                                            {
                                                found = true;
                                                isActiveStream = true;
                                                passNum = 1;
                                                break;
                                            }
                                            foundIdx++;
                                        }

                                        // otherwise, find active stream: loose
                                        if (!found)
                                        {
                                            foundIdx = 0;
                                            while (foundIdx < allStreamsList.length)
                                            {
                                                embedStream = allStreamsList[foundIdx];
                                                if (embedStream.actualStart && now > embedStream.actualStart && (embedStream.actualEnd == null || now < embedStream.actualEnd))
                                                {
                                                    found = true;
                                                    isActiveStream = true;
                                                    passNum = 2;

                                                    break;
                                                }
                                                foundIdx++;
                                            }
                                        }

                                        // otherwise, find soonest stream that's scheduled to start in the future
                                        if (!found)
                                        {
                                            foundIdx = 0;
                                            while (foundIdx < allStreamsList.length)
                                            {
                                                embedStream = allStreamsList[foundIdx];
                                                if (embedStream.start && now < embedStream.start)
                                                {
                                                    found = true;
                                                    passNum = 3;

                                                    break;
                                                }
                                                foundIdx++;
                                            }
                                        }

                                        // otherwise, find past stream that was scheduled to start most recently
                                        if (!found)
                                        {
                                            foundIdx = allStreamsList.length - 1;
                                            while (foundIdx >= 0)
                                            {
                                                embedStream = allStreamsList[foundIdx];
                                                if (embedStream.start && now > embedStream.start)
                                                {
                                                    found = true;
                                                    passNum = 4;

                                                    break;
                                                }
                                                foundIdx--;
                                            }
                                        }

                                        if (found && embedStream)
                                        {
                                            // if live fallback feature is on and it's not countdown showtime yet, do live fallback
                                            if (window._EPYT_.not_live_on_channel
                                                    && (window._EPADashboard_.dateDiffInMinutes(now, embedStream.start) > parseInt(window._EPYT_.not_live_showtime) // scheduled start is still far enough in the future
                                                            && (!embedStream.actualStart || window._EPADashboard_.dateDiffInMinutes(now, embedStream.actualStart) > parseInt(window._EPYT_.not_live_showtime))) // and either actual start is null, or it is also far enough in the future
                                                    )
                                            {
                                                window._EPADashboard_.doLiveFallback($ch.get(0));
                                            }
                                            else
                                            {
                                                var liveSrc = $ch.data('src').replace('live_stream', embedStream.id);
                                                //window._EPADashboard_.log('Pass ' + passNum + ' #' + $ch.attr('id') + ' ' + liveSrc);

                                                // if it's definitely actively streaming now, embed it right away
                                                if (isActiveStream)
                                                {
                                                    window._EPADashboard_.setVidSrc($ch, liveSrc);
                                                }
                                                // or if it just started late
                                                else if (window._EPADashboard_.dateDiffInMinutes(embedStream.start, now) < lateGracePeriodMinutes)
                                                {
                                                    window._EPADashboard_.setVidSrc($ch, liveSrc);
                                                }
                                                // otherwise, it's valid but probably just not streaming yet.
                                                // At this point either the fallback feature is off, or it's on but we're within the showtime window, so embed the default countdown embed
                                                else
                                                {
                                                    window._EPADashboard_.setVidSrc($ch, liveSrc);
                                                }
                                            }
                                        }
                                    }

                                    if (!embedStream)
                                    {
                                        if (window._EPYT_.not_live_on_channel)
                                        {
                                            window._EPADashboard_.doLiveFallback($ch.get(0));
                                        }
                                        else
                                        {
                                            var $swapBlock = window._EPADashboard_.findSwapBlock($ch.get(0));
                                            $swapBlock.replaceWith($('<div class="epyt-video-wrapper epyt-do-live-fallback"></div>').attr('data-channel', channelId));

                                        }
                                    }

                                    if ($('body.wp-admin, body.logged-in.epyt-edit-posts').length)
                                    {
                                        var $livestreamAdvice = $('#epyt-livestream-advice-template');
                                        if ($livestreamAdvice.length)
                                        {
                                            var adviceHtml = '';
                                            try
                                            {
                                                adviceHtml = window._EPADashboard_.base64DecodeUnicode($livestreamAdvice.get(0).innerHTML);
                                                $ch.closest('.epyt-video-wrapper').before(adviceHtml);
                                            }
                                            catch (e)
                                            {
                                            }
                                        }
                                    }
                                }
                            });
                        }

                        if ($('body.wp-admin, body.logged-in.epyt-edit-posts').length)
                        {
                            $(document).on('click.epytLivestreamAdvice', '.epyt-livestream-advice-close', function ()
                            {
                                $.post(_EPYT_.ajaxurl, {
                                    action: 'my_embedplus_livestream_advice_close',
                                    security: _EPYT_.security
                                });
                                $('.epyt-livestream-advice-close').each(function ()
                                {
                                    $(this).closest('.epyt-livestream-advice').remove();
                                });
                            });
                        }

                        $('.epyt-gallery').each(function ()
                        {
                            var $container = $(this);
                            if (!$container.data('epytevents') || !$('body').hasClass('block-editor-page'))
                            {
                                $container.data('epytevents', '1');
                                var $iframe = $(this).find('iframe, div.__youtube_prefs_gdpr__, div.epyt-facade').first();
                                var contentlbid = 'content' + $iframe.attr('id');
                                $container.find('.lity-hide').attr('id', contentlbid);
                                var initSrc = $iframe.data('src') || $iframe.data('facadesrc') || $iframe.data('lbsrc') || $iframe.attr('src');
                                if (!initSrc)
                                {
                                    initSrc = $iframe.data('ep-src');
                                }
                                var firstId = $(this).find('.epyt-gallery-list .epyt-gallery-thumb').first().data('videoid');
                                if (typeof (initSrc) !== 'undefined')
                                {
                                    initSrc = initSrc.replace(firstId, 'GALLERYVIDEOID');
                                    $container.data('ep-gallerysrc', initSrc);
                                }
                                else if ($iframe.hasClass('__youtube_prefs_gdpr__'))
                                {
                                    $container.data('ep-gallerysrc', '');
                                }

                                var $listgallery = $container.find('.epyt-gallery-list');
                                var pagenumsalign = function ()
                                {
                                    try
                                    {
                                        if ($listgallery.hasClass('epyt-gallery-style-carousel'))
                                        {
                                            var thumbheight = $($listgallery.find('.epyt-gallery-thumb').get(0)).height();
                                            var topval = thumbheight / 2;
                                            var $pagenums = $listgallery.find('.epyt-pagination:first-child .epyt-pagenumbers');
                                            $pagenums.css('top', (topval + 15) + "px");
                                        }
                                    }
                                    catch (e)
                                    {
                                    }
                                };
                                setTimeout(function ()
                                {
                                    pagenumsalign();
                                }, 300);
                                $(window).on('resize', pagenumsalign);


                                $container.on('click touchend', '.epyt-gallery-list .epyt-gallery-thumb', function (e)
                                {
                                    if (window._EPYT_.lityOpen)
                                    {
                                        return;
                                    }

                                    $iframe = $container.find('iframe, div.__youtube_prefs_gdpr__, div.epyt-facade').first();
                                    if (window._EPYT_.touchmoved)
                                    {
                                        return;
                                    }
                                    if (!$(this).hasClass('epyt-current-video') || $container.hasClass('epyt-lb'))
                                    {
                                        $container.find('.epyt-gallery-list .epyt-gallery-thumb').removeClass('epyt-current-video');
                                        $(this).addClass('epyt-current-video');
                                        var vid = $(this).data('videoid');
                                        $container.data('currvid', vid);
                                        var vidSrc = $container.data('ep-gallerysrc').replace('GALLERYVIDEOID', vid);

                                        var thumbplay = $container.find('.epyt-pagebutton').first().data('thumbplay');
                                        if (thumbplay !== '0' && thumbplay !== 0)
                                        {
                                            if (vidSrc.indexOf('autoplay') > 0)
                                            {
                                                vidSrc = vidSrc.replace('autoplay=0', 'autoplay=1');
                                            }
                                            else
                                            {
                                                vidSrc += '&autoplay=1';
                                            }

                                            $iframe.addClass('epyt-thumbplay');
                                        }


                                        if ($container.hasClass('epyt-lb'))
                                        {
                                            window._EPADashboard_.lb('#' + contentlbid);
                                            window._EPYT_.lityOpen = true;
                                            vidSrc = vidSrc.replace('autoplay=1', 'autoplay=0');
                                            window._EPADashboard_.loadYTAPI();
                                            window._EPADashboard_.setVidSrc($iframe, vidSrc);
                                            $('.lity-close').trigger('focus');
                                        }
                                        else
                                        {
                                            if ($container.find('.epyt-gallery-style-carousel').length === 0)
                                            {
                                                // https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
                                                var bodyScrollTop = Math.max($('body').scrollTop(), $('html').scrollTop());
                                                var scrollNext = $iframe.offset().top - parseInt(_EPYT_.gallery_scrolloffset);
                                                if (bodyScrollTop > scrollNext)
                                                {
                                                    $('html, body').animate({
                                                        scrollTop: scrollNext
                                                    }, 500, function ()
                                                    {
                                                        window._EPADashboard_.setVidSrc($iframe, vidSrc);
                                                    });
                                                }
                                                else
                                                {
                                                    window._EPADashboard_.setVidSrc($iframe, vidSrc);
                                                }
                                            }
                                            else
                                            {
                                                window._EPADashboard_.setVidSrc($iframe, vidSrc);
                                            }
                                        }
                                    }

                                }).on('touchmove', function (e)
                                {
                                    window._EPYT_.touchmoved = true;
                                }).on('touchstart', function ()
                                {
                                    window._EPYT_.touchmoved = false;
                                }).on('keydown', '.epyt-gallery-list .epyt-gallery-thumb, .epyt-pagebutton', function (e)
                                {
                                    var code = e.which;
                                    if ((code === 13) || (code === 32))
                                    {
                                        e.preventDefault();
                                        $(this).trigger('click');

                                    }
                                });

                                $container.on('mouseenter', '.epyt-gallery-list .epyt-gallery-thumb', function ()
                                {
                                    $(this).addClass('hover');
                                    if ($listgallery.hasClass('epyt-gallery-style-carousel') && $container.find('.epyt-pagebutton').first().data('showtitle') == 1)
                                    {
                                        $container.find('.epyt-pagenumbers').addClass('hide');
                                        var ttl = $(this).find('.epyt-gallery-notitle span').text();
                                        $container.find('.epyt-gallery-rowtitle').text(ttl).addClass('hover');
                                    }
                                });

                                $container.on('mouseleave', '.epyt-gallery-list .epyt-gallery-thumb', function ()
                                {
                                    $(this).removeClass('hover');
                                    if ($listgallery.hasClass('epyt-gallery-style-carousel') && $container.find('.epyt-pagebutton').first().data('showtitle') == 1)
                                    {
                                        $container.find('.epyt-gallery-rowtitle').text('').removeClass('hover');
                                        if ($container.find('.epyt-pagebutton[data-pagetoken!=""]').length > 0)
                                        {
                                            $container.find('.epyt-pagenumbers').removeClass('hide');
                                        }
                                    }
                                });

                                $container.on('click touchend', '.epyt-pagebutton', function (ev)
                                {
                                    if (window._EPYT_.touchmoved)
                                    {
                                        return;
                                    }
                                    if (!$container.find('.epyt-gallery-list').hasClass('epyt-loading'))
                                    {
                                        $container.find('.epyt-gallery-list').addClass('epyt-loading');
                                        var humanClick = typeof (ev.originalEvent) !== 'undefined';
                                        var pageData = {
                                            action: 'my_embedplus_gallery_page',
                                            security: _EPYT_.security,
                                            options: {
                                                playlistId: $(this).data('playlistid'),
                                                pageToken: $(this).data('pagetoken'),
                                                pageSize: $(this).data('pagesize'),
                                                columns: $(this).data('epcolumns'),
                                                showTitle: $(this).data('showtitle'),
                                                showPaging: $(this).data('showpaging'),
                                                autonext: $(this).data('autonext'),
                                                hidethumbimg: $(this).data('hidethumbimg'),
                                                style: $(this).data('style'),
                                                thumbcrop: $(this).data('thumbcrop'),
                                                showDsc: $(this).data('showdsc'),
                                                thumbplay: $(this).data('thumbplay')
                                            }
                                        };
                                        if ($(this).data('showdsc'))
                                        {
                                            pageData.options.showDsc = $(this).data('showdsc');
                                        }

                                        var forward = $(this).hasClass('epyt-next');
                                        var currpage = parseInt($container.data('currpage') + "");
                                        currpage += forward ? 1 : -1;
                                        $container.data('currpage', currpage);

                                        $.post(_EPYT_.ajaxurl, pageData, function (response)
                                        {
                                            $container.find('.epyt-gallery-list').html(response);
                                            $container.find('.epyt-current').each(function ()
                                            {
                                                $(this).text($container.data('currpage'));
                                            });
                                            $container.find('.epyt-gallery-thumb[data-videoid="' + $container.data('currvid') + '"]').addClass('epyt-current-video');


                                            if ($container.find('.epyt-pagebutton').first().data('autonext') == '1' && !humanClick)
                                            {
                                                $container.find('.epyt-gallery-thumb').first().trigger('click');
                                            }

                                        }).fail(function ()
                                        {
                                            alert('Sorry, there was an error loading the next page.');
                                        }).always(function ()
                                        {
                                            $container.find('.epyt-gallery-list').removeClass('epyt-loading');
                                            pagenumsalign();

                                            if ($container.find('.epyt-gallery-style-carousel').length === 0 && $container.find('.epyt-pagebutton').first().data('autonext') != '1')
                                            {
                                                // https://github.com/jquery/jquery-ui/blob/master/ui/scroll-parent.js
                                                var bodyScrollTop = Math.max($('body').scrollTop(), $('html').scrollTop());
                                                var scrollNext = $container.find('.epyt-gallery-list').offset().top - parseInt(_EPYT_.gallery_scrolloffset);
                                                if (bodyScrollTop > scrollNext)
                                                {
                                                    $('html, body').animate({
                                                        scrollTop: scrollNext
                                                    }, 500);
                                                }
                                            }
                                        });
                                    }
                                }).on('touchmove', function (e)
                                {
                                    window._EPYT_.touchmoved = true;
                                }).on('touchstart', function ()
                                {
                                    window._EPYT_.touchmoved = false;
                                });
                            }
                        });

                        $('.__youtube_prefs_gdpr__.epyt-is-override').each(function ()
                        {
                            $(this).parent('.wp-block-embed__wrapper').addClass('epyt-is-override__wrapper');
                        });

                        $('button.__youtube_prefs_gdpr__').on('click', function (e)
                        {
                            e.preventDefault();
                            if ($.cookie)
                            {
                                $.cookie("ytprefs_gdpr_consent", '1', {expires: 30, path: '/'});
                                window.top.location.reload();
                            }
                        });

                        if (window._EPYT_.maxres_facade === 'eager')
                        {
                            $('img.epyt-facade-poster').on("load.epyt", function ()
                            {
                                window._EPADashboard_.resolveFacadeQuality(this, false);
                            }).on('error', function ()
                            {
                                window._EPADashboard_.resolveFacadeQuality(this, true);
                            }).each(function ()
                            {
                                if (this.complete)
                                {
                                    $(this).trigger('load');
                                }
                            });
                        }
                        else if (window._EPYT_.maxres_facade === 'soft')
                        {

                            $('img.epyt-facade-poster').on("load.epyt", function ()
                            {
                                window._EPADashboard_.maximizeFacadeQuality(this);
                            }).each(function ()
                            {
                                if (this.complete)
                                {
                                    $(this).trigger('load');
                                }
                            });
                        }

                        $('.epyt-facade-play').each(function ()
                        {
                            if (!$(this).find('svg').length)
                            {
                                $(this).append('<svg data-no-lazy="1" height="100%" version="1.1" viewBox="0 0 68 48" width="100%"><path class="ytp-large-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="#f00"></path><path d="M 45,24 27,14 27,34" fill="#fff"></path></svg>');
                            }
                        });

                        $('.epyt-facade-poster[data-facadeoembed]').each(function ()
                        {
                            var $facadePoster = $(this);
                            if (!$facadePoster.data('facadeoembedcomplete'))
                            {
                                $facadePoster.data('facadeoembedcomplete', '1');
                                var facadeOembedUrl = 'https://www.youtube.com/' + $facadePoster.data('facadeoembed');
                                $.get('https://youtube.com/oembed', {url: facadeOembedUrl, format: 'json'},
                                        function (response)
                                        {
                                            var newSrc = window._EPYT_.maxres_facade === 'eager' ? response.thumbnail_url.replace('hqdefault', 'maxresdefault') : response.thumbnail_url;
                                            $facadePoster.attr('src', newSrc);
                                        }, 'json')
                                        .fail(function ()
                                        {
                                        })
                                        .always(function ()
                                        {
                                        });
                            }

                        });

                        $(document).on('click', '.epyt-facade', function (e)
                        {
                            var $facade = $(this);
                            var srcTemp = $facade.attr('data-facadesrc');
                            srcTemp = window._EPADashboard_.cleanSrc(srcTemp);
                            var iframe = document.createElement('iframe');
                            for (var i = 0; i < this.attributes.length; i++)
                            {
                                var attrib = this.attributes[i];
                                if (['allow', 'class', 'height', 'id', 'width'].indexOf(attrib.name.toLowerCase()) >= 0 || attrib.name.toLowerCase().indexOf('data-') == 0)
                                {
                                    $(iframe).attr(attrib.name, attrib.value);
                                }
                            }
                            $(iframe).removeClass('epyt-facade');
                            $(iframe).attr('allowfullscreen', '').attr('title', $facade.find('img').attr('alt')).attr('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');

                            window._EPADashboard_.loadYTAPI();
                            $facade.replaceWith(iframe);
                            window._EPADashboard_.setVidSrc($(iframe), srcTemp);
                            setTimeout(function ()
                            {
                                if (typeof $.fn.fitVidsEP !== 'undefined')
                                {
                                    $($(iframe).parent()).fitVidsEP();
                                }
                            }, 1);
                        });
                    }
                };
    }

    window.onYouTubeIframeAPIReady = typeof window.onYouTubeIframeAPIReady !== 'undefined' ? window.onYouTubeIframeAPIReady : function ()
    {
        if (window._EPYT_.pageLoaded)
        {
            window._EPADashboard_.apiInit();
            window._EPADashboard_.log('YT API ready');
        }
        else
        {
            $(window).on('load._EPYT_', function ()
            {
                window._EPADashboard_.apiInit();
                window._EPADashboard_.log('YT API ready 2');
            });
        }
    };

    if (!window._EPYT_.facade_mode || (window._EPYT_.not_live_on_channel && $('iframe[src*="youtube.com/embed/live_stream"], iframe[data-src*="youtube.com/embed/live_stream"]').length))
    {
        window._EPADashboard_.loadYTAPI();
    }

    if (window._EPYT_.pageLoaded)
    {
        window._EPADashboard_.doubleCheck();
    }
    else
    {
        $(window).on('load._EPYT_', function ()
        {
            window._EPADashboard_.doubleCheck();
        });
    }

    $(document).ready(function ()
    {
        $(document).on('lity:ready', function (event, instance)
        {
            try
            {
                window._EPADashboard_.fixDims(event, instance);
            }
            catch (err)
            {
            }
        });
        $(document).on('lity:close', function (event, instance)
        {
            window._EPYT_.lityOpen = false;
        });

        window._EPADashboard_.pageReady();

        if (!window._EPYT_.facade_mode || (window._EPYT_.not_live_on_channel && $('iframe[src*="youtube.com/embed/live_stream"], iframe[data-src*="youtube.com/embed/live_stream"]').length))
        {
            window._EPADashboard_.loadYTAPI();
        }

        if (window._EPYT_.ajax_compat)
        {
            $(window).on('load._EPYT_', function ()
            {
                $(document).ajaxSuccess(function (e, xhr, settings)
                {
                    if (xhr && xhr.responseText && (xhr.responseText.indexOf('<iframe ') !== -1 || xhr.responseText.indexOf('enablejsapi') !== -1))
                    {
                        window._EPADashboard_.loadYTAPI();
                        window._EPADashboard_.apiInit();
                        window._EPADashboard_.log('YT API AJAX');
                        window._EPADashboard_.pageReady();
                    }
                });
            });
        }

        ////////////////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////////////////
        $(window).on('load._EPYT_', function ()
        {
            $('script[type="text/javascript/ytdefer"]').each(function ()
            {
                $(this).clone().attr('type', '').insertAfter(this);
            });
        });

    });
})(window, jQuery);
