$(document).ready(function() {
    function generateCatalog() {
        var container = $('.split-tocs');
        var content = $('.content-wrapper');
        if (container.length === 0 || content.length === 0) return;

        container.empty();

        var headers = content.find('h2, h3');
        if (headers.length === 0) return;

        var bookToc = $('<div class="split-toc book"></div>');
        var bookTocTitle = $('<div class="title"><label for="--verso-manual-toc-----bookRoot" class="toggle-split-toc"><input type="checkbox" class="toggle-split-toc" id="--verso-manual-toc-----bookRoot" checked="checked"></label><span class="">Table of Contents</span></div>');
        var bookTocTable = $('<table><tbody></tbody></table>');
        bookToc.append(bookTocTitle).append(bookTocTable);
        container.append(bookToc);
        var mainTocBody = bookTocTable.find('tbody');
        var h2Counter = 0;

        headers.filter('h2').each(function() {
            h2Counter++;
            var h2 = $(this);
            var h2_id = h2.attr('id') || 'gen-h2-' + h2Counter;
            h2.attr('id', h2_id);

            var mainTr = $('<tr class="numbered"></tr>')
                .append($('<td class="num"></td>').text(h2Counter + '.'))
                .append($('<td></td>').append($('<a href="#' + h2_id + '"></a>').text(h2.text())));
            mainTocBody.append(mainTr);

            var chapterToc = $('<div class="split-toc"></div>');
            var chapterTitle = $('<div class="title"></div>')
                .append('<label for="--verso-manual-toc-Intro' + h2Counter + '" class="toggle-split-toc"><input type="checkbox" class="toggle-split-toc" id="--verso-manual-toc-Intro' + h2Counter + '" checked="checked"></label>')
                .append('<span class="number">' + h2Counter + '.</span>&nbsp;')
                .append($('<span></span>').addClass('chapter-title-span').attr('data-h2-id', h2_id).text(h2.text()));
            chapterToc.append(chapterTitle);

            var h3s = h2.nextUntil('h2').filter('h3');
            if (h3s.length > 0) {
                var chapterTable = $('<table><tbody></tbody></table>');
                var h3Counter = 0;
                h3s.each(function() {
                    h3Counter++;
                    var h3 = $(this);
                    var h3_id = h3.attr('id') || 'gen-h3-' + h2Counter + '-' + h3Counter;
                    h3.attr('id', h3_id);

                    var subTr = $('<tr class="numbered"></tr>')
                        .append($('<td class="num"></td>').text(h2Counter + '.' + h3Counter + '.'))
                        .append($('<td></td>').append($('<a href="#' + h3_id + '"></a>').text(h3.text())));
                    chapterTable.find('tbody').append(subTr);
                });
                chapterToc.append(chapterTable);
            }
            container.append(chapterToc);
        });
    }

    generateCatalog();

    var mainNavContainer = $('.split-tocs');

    function updateHighlighting($element) {
        var $currentLink = $element.is('a') ? $element : $element.find('a');

        if (!$currentLink || $currentLink.length === 0) return;

        mainNavContainer.find('tr').removeClass('current');
        mainNavContainer.find('.chapter-title-span').removeClass('current');

        var activeTr = $currentLink.closest('tr');
        activeTr.addClass('current');
        var href = $currentLink.attr('href');
        var targetId = href.substring(1);
        var $targetHeader = $('#' + targetId);

        var $activeH2 = $targetHeader.is('h2') ? $targetHeader : $targetHeader.prevAll('h2').first();
        var activeH2Id = $activeH2.attr('id');
        mainNavContainer.find('.chapter-title-span[data-h2-id="' + activeH2Id + '"]').addClass('current');
    }

    if (mainNavContainer.find('a').length > 0) {
        // Handle highlighting on click
        mainNavContainer.on('click', 'a', function() {
            updateHighlighting($(this));
        });

        // Handle highlighting on scroll and animation
        mainNavContainer.onePageNav({
            currentClass: 'current',
            navItems: 'a',
            changeHash: false,
            scrollSpeed: 750,
            scrollThreshold: 0.2,
            padding: 40,
            scrollChange: function($current) {
                updateHighlighting($current);
            }
        });
    }
});