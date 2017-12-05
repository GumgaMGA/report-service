
function gumgaReports($scope, $window, gumgaController, $, $timeout, $gumgaReportProvider, $attrs) {
    let ctrl = this;
    var headerfooter = {};
    var variable = {};

    ctrl.options = ctrl.options || {
        appearance: {
            fullScreenMode: false
        },
        height: "940px"
    };


    let changeQuery = (query, filter) => {
        var queryBegin = '',
            queryEnd = '',
            index;

        var where = '';
        if (!query.match(/where/i)) {
            where = ' where 1=1 ';
        }

        if (query.match(/group by/i)) {
            index = query.match(/group by/i).index;
            queryBegin = query.substring(0, index - 1);
            queryEnd = query.substring(index, query.length);
        } else if (query.match(/order by/i)) {
            index = query.match(/order by/i).index;
            queryBegin = query.substring(0, index - 1);
            queryEnd = query.substring(index, query.length);
        } else {
            index = query.length;
            queryBegin = query.substring(0, index);
        }

        return queryBegin + where + filter + (ctrl.additionalFilter ? ` and (${ctrl.additionalFilter}) ` : "") + queryEnd;
    }


    let changeOnCreate = (designer) => {
        designer.onCreateReport = function (event) {
            if (headerfooter && headerfooter.jsonReport) {
                var report = new $window.Stimulsoft.Report.StiReport();
                event.isWizardUsed = false;
                event.report = entity.name.definition;
                event.report.reportFile = entity.name;
            }
        };
    };

    let changeOnBeginProcessData = (viewer) => {
        viewer.onBeginProcessData = function (event) {
            if ($gumgaReportProvider.isEnableOi()) {
                //TODO
                // let reservedKeys = ["inner", "join", "where", "left", "right", "union"]
                // let match = event.queryString.match(/from.*where/)
                // let alias = "";
                // if (match && match[0]) {
                //     alias = match.split(" ")[2]
                //     if (reservedKeys.includes(alias)) {
                //         alias = match.split(" ")[1]
                //     } else {
                //         alias = alias + "."
                //     }
                // }
                // let filter = (ctrl.entity ? ` and (oi is null or oi like '${ctrl.entity.id} %')` : '');
                // event.queryString = changeQuery(event.queryString, filter);
            }
        };
    }


    let changeSaveReport = (designer) => {
        designer.onSaveReport = function (event) {
            event.report.reportName = event.fileName;
            event.report.reportAlias = event.fileName;
            var jsonStr = event.report.saveToJsonString();
            ctrl.entity.name = event.fileName;
            ctrl.entity.definition = jsonStr;
            $gumgaReportProvider.save(ctrl.entity)
                .then(response => {
                    if (ctrl.onSave) {
                        ctrl.onSave({ $value: response.data.data })
                    }
                });
        };
    }

    let configureOptions = () => {
        StiOptions.WebServer.url = $gumgaReportProvider.connectionLocal;
        StiOptions.Services._databases = [];
        if (!ctrl.databases) {
            ctrl.databases = 'postgresql,mysql,oracle,json,xml,csv,excel'
        }
        if (ctrl.databases.includes('postgresql')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiPostgreSQLDatabase());
        if (ctrl.databases.includes('mysql')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiMySqlDatabase());
        if (ctrl.databases.includes('oracle')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiOracleDatabase());
        if (ctrl.databases.includes('json')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiJsonDatabase());
        if (ctrl.databases.includes('xml')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiXmlDatabase());
        if (ctrl.databases.includes('csv')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiCsvDatabase());
        if (ctrl.databases.includes('excel')) StiOptions.Services._databases.add(new Stimulsoft.Report.Dictionary.StiExcelDatabase());

    }


    function changeOptions(opt, compare) {
        if (opt && compare) {
            Object.keys(opt).forEach(key => {
                if (opt[key] instanceof Object) {
                    changeOptions(opt[key], compare[key])
                } else {
                    if (compare[key]) {
                        opt[key] = compare[key]
                    }
                }
            })
        }
    }

    $scope.configureEntity = () => {
        if (ctrl.entity) {
            configureOptions();
            var defaultOptions = new $window.Stimulsoft.Designer.StiDesignerOptions();

            changeOptions(defaultOptions, ctrl.options)

            var designer = new $window.Stimulsoft.Designer.StiDesigner(defaultOptions, 'StiDesigner', false);
            var report = new $window.Stimulsoft.Report.StiReport();
            if (ctrl.entity.id) {
                report.load(ctrl.entity.definition);
            } else {
                var databaseMysqlExample = new Stimulsoft.Report.Dictionary.StiMySqlDatabase("Security MySQL", "", "url=jdbc:mysql://localhost:3306/security?zeroDateTimeBehavior=convertToNull; user = root; password = senha;", false);
                var databaseOracleExample = new Stimulsoft.Report.Dictionary.StiOracleDatabase("Security Oracle", "", "url=jdbc:oracle:thin:@localhost:1521/orcl;user = root;password = senha;", false);

                report.dictionary.databases.clear();
                // var parameter = new Stimulsoft.Report.Dictionary.StiVariable("Gumga Examples", "oi", "oi", "Organization ID", Stimulsoft.System.Type.valueOf(), "[[oi]]", true, Stimulsoft.Report.Dictionary.StiVariableInitBy.Value, false);
                // report.dictionary.variables.add(parameter)

                if (ctrl.dictionaryDatabases) {
                    if (ctrl.dictionaryDatabases instanceof Array) {
                        ctrl.dictionaryDatabases
                            .forEach(obj => {
                                report.dictionary.databases.add(obj);
                            })
                    } else {
                        report.dictionary.databases.add(ctrl.dictionaryDatabases);
                    }
                }

                if (ctrl.dictionaryVariables) {
                    if (ctrl.dictionaryVariables instanceof Array) {
                        ctrl.dictionaryVariables
                            .forEach(obj => {
                                report.dictionary.variables.add(obj);
                            })
                    } else {
                        report.dictionary.variables.add(ctrl.dictionaryVariables);
                    }
                }

                report.dictionary.databases.add(databaseMysqlExample);
                report.dictionary.databases.add(databaseOracleExample);
                report.dictionary.synchronize();
            }

            changeSaveReport(designer);
            changeOnCreate(designer);
            changeOnBeginProcessData(designer);
            designer.report = report;
            if ($gumgaReportProvider.licenseKey()) {
                $window.Stimulsoft.Base.StiLicense.key = $gumgaReportProvider.licenseKey()
            }
            designer.renderHtml('designer')
        }
    };

    $scope.init = (value) => {
        $timeout(function () {
            if (value) {
                ctrl.entity = value
            } else {
                $gumgaReportProvider.getNew().then(function (response) {
                    ctrl.entity = response.data
                })
            }
            $scope.configureEntity()
        })
    }

    $scope.configureEntityViewer = () => {
        if (ctrl.entity) {
            StiOptions.WebServer.url = $gumgaReportProvider.connectionLocal;
            var viewer = new $window.Stimulsoft.Viewer.StiViewer(null, 'StiViewer', false);
            var report = new $window.Stimulsoft.Report.StiReport();
            report.load(ctrl.entity.definition);
            report.dictionary.variable = ctrl.variables;
            changeOnBeginProcessData(viewer);
            viewer.report = report;
            viewer.renderHtml('viewer');
        }
    }

    $scope.initViewer = function (value) {
        $timeout(function () {
            if (value) {
                ctrl.entity = value
            } else {
                $gumgaReportProvider.getNew().then(function (response) {
                    ctrl.entity = response.data
                })
            }
            $scope.configureEntityViewer()
        })
    };

    ctrl.updateReport = function (change) {
        if (ctrl.viewer) {
            $scope.initViewer(change)
        } else {
            $scope.init(change)
        }
    }

    ctrl.$onChanges = function (change) {
        if (change.viewer && change.viewer.currentValue && ctrl.entity) {
            ctrl.updateReport(ctrl.entity)
        }

        if (change.entity && (change.entity.currentValue && change.entity.currentValue.id)) {
            ctrl.updateReport(change.entity.currentValue)
        }
    }

    $scope.$watch('$ctrl.options', opt => {
        $scope.configureEntity()
    }, true)

}
gumgaReports.$inject = ['$scope', '$window', 'gumgaController', '$q', '$timeout', '$gumgaReport', '$attrs'];

let template = require('./gumga-report.html');

const Report = {
    bindings: {
        viewer: '<?',
        entity: '<',
        onSave: '&?',
        options: '<?',
        databases: '<?',
        additionalFilter: '<?',
        dictionaryDatabases: '<?',
        dictionaryVariables: '<?'
    },
    templateUrl: template,
    controller: gumgaReports
};

export default Report;



