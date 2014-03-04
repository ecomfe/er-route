/**
 * ER Route
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * @ignore
 * @file 插件主功能
 * @author otakustay
 */
define(
    function (require) {
        var controller = require('er/controller');
        var util = require('er/util');
        var compile = require('compileRoute');

        var actionConfigList = [];

        /**
         * 启用插件
         */
        function enable() {
            // 与ER的默认实现不同，路由中可能出现多个`path`相同的配置，
            // 进而通过`authority`来选择使用哪一个，因此要存为数组
            controller.registerAction = function (actionConfig) {
                actionConfigList.push(actionConfig);
            };

            controller.findActionConfig = function (actionContext) {
                var candidate = null;

                var path = actionContext.url.getPath();
                for (var i = 0; i < actionConfigList.length; i++) {
                    var actionConfig = actionConfigList[i];

                    var match = compile(actionConfig.path);
                    var args = match(path);
                    if (args) {
                        candidate = util.mix({}, actionConfig);
                        // 加上从URL里提取的参数
                        candidate.args = util.mix({}, candidate.args, args);

                        // 如果没有权限，则把当前的作为候选继续往下找，如果下面能找到有权限的就用，没有的话就用这个让系统返回无权限页
                        var hasAuthority = controller.checkAuthority(candidate, actionContext);
                        if (hasAuthority) {
                            break;
                        }
                    }
                }

                return candidate;
            };
        };

        var enabled = false;

        return {
            version: '0.8.0-beta.1',
            enable: function () {
                if (enabled) {
                    return;
                }

                enabled = true;

                enable();
            }
        };
    }
);
