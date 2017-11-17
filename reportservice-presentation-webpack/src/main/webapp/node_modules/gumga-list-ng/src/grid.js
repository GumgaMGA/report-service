(function () {

    function scanTable($table) {
        var m = [];
        $table.children("tr").each(function (y, row) {
            angular.element(row).children("td, th").each(function (x, cell) {
                var $cell = angular.element(cell),
                    cspan = $cell.attr("colspan") | 0,
                    rspan = $cell.attr("rowspan") | 0,
                    tx, ty;
                cspan     = cspan ? cspan : 1;
                rspan     = rspan ? rspan : 1;
                for (; m[y] && m[y][x]; ++x);  //skip already occupied cells in current row
                for (tx = x; tx < x + cspan; ++tx) {  //mark matrix elements occupied by current cell with true
                    for (ty = y; ty < y + rspan; ++ty) {
                        if (!m[ty]) {  //fill missing rows
                            m[ty] = [];
                        }
                        m[ty][tx] = true;
                    }
                }
                var pos = {top: y, left: x};
                $cell.data("cellPos", pos);
            });
        });
    };

    angular.element.fn.cellPos = function (rescan) {
        var $cell = this.first(),
            pos   = $cell.data("cellPos");
        if (!pos || rescan) {
            var $table = $cell.closest("table, thead, tbody, tfoot");
            scanTable($table);
        }
        pos = $cell.data("cellPos");
        return pos;
    }

    angular.element.fn.smartGrid = function (param) {
        return this.each(function () {
            SmartGrid.call(this);
        });

        function SmartGrid ()  {

            {
                var defaults = {
                    head: true,
                    foot: false,
                    left: 0,
                    right: 0,
                    class: 'smart-grid-fixed',
                    'z-index': 0
                };

                var settings = angular.element.extend({}, defaults, param);

                settings.table  = this;
                settings.parent = $(settings.table).parent();
                setParent();

                if (settings.head == true)
                    fixHead();

                if (settings.foot == true)
                    fixFoot();

                if (settings.left > 0)
                    fixLeft();

                if (settings.right > 0)
                    fixRight();

                setCorner();

                angular.element(settings.parent).trigger("scroll");

                window.onresize = () => angular.element(settings.parent).trigger("scroll");

                function setCorner() {
                    var table = angular.element(settings.table);

                    if (settings.head) {
                        if (settings.left > 0) {
                            var tr = table.find("thead tr");

                            tr.each(function (k, row) {
                                solverLeftColspan(row, function (cell) {
                                    angular.element(cell).css("z-index", settings['z-index'] + 1);
                                });
                            });
                        }

                        if (settings.right > 0) {
                            var tr = table.find("thead tr");

                            tr.each(function (k, row) {
                                solveRightColspan(row, function (cell) {
                                    angular.element(cell).css("z-index", settings['z-index'] + 1);
                                });
                            });
                        }
                    }

                    if (settings.foot) {
                        if (settings.left > 0) {
                            var tr = table.find("tfoot tr");

                            tr.each(function (k, row) {
                                solverLeftColspan(row, function (cell) {
                                    angular.element(cell).css("z-index", settings['z-index']);
                                });
                            });
                        }

                        if (settings.right > 0) {
                            var tr = table.find("tfoot tr");

                            tr.each(function (k, row) {
                                solveRightColspan(row, function (cell) {
                                    angular.element(cell).css("z-index", settings['z-index']);
                                });
                            });
                        }
                    }
                }

                function handlingFixed(parent, e){
                    var scrollWidth  = parent[0].scrollWidth;
                    var clientWidth  = parent[0].clientWidth;
                    var scrollHeight = parent[0].scrollHeight;
                    var clientHeight = parent[0].clientHeight;
                    var top          = parent.scrollTop();
                    var left         = parent.scrollLeft();

                    if (settings.head)
                        parent.find("thead tr > *").css("top", top);

                    if (settings.foot)
                        parent.find("tfoot tr > *").css("bottom", scrollHeight - clientHeight - top);

                    if (settings.left > 0){
                      settings.leftColumns.css("left", (left));
                      if(settings.class)
                        settings.leftColumns.addClass(settings.class);
                    }

                    if (settings.right > 0){
                      settings.rightColumns.css("right", scrollWidth - clientWidth - left);
                      if(settings.class)
                        settings.rightColumns.addClass(settings.class);
                    }
                }

                function setParent() {
                    var parent = angular.element(settings.parent);
                    var table  = angular.element(settings.table);
                    parent
                        .css({
                            'overflow-x': 'auto',
                            'overflow-y': 'auto'
                        });

                    var lastMoment = 0;

                    angular.element(parent).bind('touchmove', function(ev) {
                      handlingFixed(parent, ev);
                    });

                    parent.scroll(function (ev) {
                        ev.stopPropagation(); ev.preventDefault();
                        handlingFixed(parent, ev);
                    });

                }

                // Set table head fixed
                function fixHead() {
                    var thead = angular.element(settings.table).find("thead");
                    var tr    = thead.find("tr");
                    var cells = thead.find("tr > *");
                    setBackground(cells);
                    cells.css({
                        'position': 'relative'
                    });
                }

                // Set table foot fixed
                function fixFoot() {
                    var tfoot = angular.element(settings.table).find("tfoot");
                    var tr    = tfoot.find("tr");
                    var cells = tfoot.find("tr > *");

                    setBackground(cells);
                    cells.css({
                        'position': 'relative'
                    });
                }

                // Set table left column fixed
                function fixLeft() {
                    var table = angular.element(settings.table);
                    settings.leftColumns = angular.element();
                    var tr = table.find("tr"), count = 0;
                    tr.each(function (k, row) {
                        solverLeftColspan(row, function (cell) {
                            if(settings.top == undefined || (count < (settings.top*settings.left)))
                              settings.leftColumns = settings.leftColumns.add(cell);
                            if(cell[0] && cell[0].nodeName == 'TD') count++;
                        });
                    });
                    var column = settings.leftColumns;
                    column.each(function (k, cell) {
                        var cell = angular.element(cell);
                        setBackground(cell);
                        cell.css({
                            'position': 'relative'
                        });
                    });
                }

                // Set table right column fixed
                function fixRight() {
                    var table = angular.element(settings.table);

                    var fixColumn = settings.right;

                    settings.rightColumns = angular.element();

                    var tr = table.find("tr");
                    tr.each(function (k, row) {
                        solveRightColspan(row, function (cell) {
                            settings.rightColumns = settings.rightColumns.add(cell);
                        });
                    });

                    var column = settings.rightColumns;

                    column.each(function (k, cell) {
                        var cell = angular.element(cell);

                        setBackground(cell);
                        cell.css({
                            'position': 'relative'
                        });
                    });

                }

                // Set fixed cells backgrounds
                function setBackground(elements) {
                    elements.each(function (k, element) {
                        var element = angular.element(element);
                        var parent  = angular.element(element).parent();
                        if(element[0].style.backgroundColor) return;

                        var elementBackground = element.css("background-color");
                        elementBackground     = (elementBackground == "transparent" || elementBackground == "rgba(0, 0, 0, 0)") ? null : elementBackground;

                        var parentBackground = parent.css("background-color");
                        parentBackground     = (parentBackground == "transparent" || parentBackground == "rgba(0, 0, 0, 0)") ? null : parentBackground;

                        var background = parentBackground ? parentBackground : "white";
                        background     = elementBackground ? elementBackground : background;
                        // element.css("background-color", background);
                        element.css("touch-action", "manipulation");
                        // element.css("border-top", "1px solid rgba(168, 159, 159, 0.12)");
                        element.css("background-clip", "padding-box");
                    });
                }

                function solverLeftColspan(row, action) {
                    var fixColumn = settings.left;
                    var inc       = 1;

                    for (var i = 1; i <= fixColumn; i = i + inc) {
                        var nth = inc > 1 ? i - 1 : i;

                        var cell    = angular.element(row).find("> *:nth-child(" + nth + ")");
                        var colspan = cell.prop("colspan");

                        if (cell.cellPos().left < fixColumn) {
                            action(cell);
                        }

                        inc = colspan;
                    }
                }

                function solveRightColspan(row, action) {
                    var fixColumn = settings.right;
                    var inc       = 1;

                    for (var i = 1; i <= fixColumn; i = i + inc) {
                        var nth = inc > 1 ? i - 1 : i;

                        var cell    = angular.element(row).find("> *:nth-last-child(" + nth + ")");
                        var colspan = cell.prop("colspan");

                        action(cell);

                        inc = colspan;
                    }
                }
            }

        }
    };

})();
