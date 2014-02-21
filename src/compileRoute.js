/**
 * ER Route
 * Copyright 2013 Baidu Inc. All rights reserved.
 * 
 * @ignore
 * @file 将URL规则编译为正则的函数
 * @author otakustay
 */
define(
    function (require) {
        var cache = {};

        /**
         * 将一个配置的URL规则编译成一个匹配函数
         *
         * 匹配函数接受一个URL的路径部分作为输入，
         * 当匹配成功时返回一个包含所有参数的对象，不成功则返回`null`
         *
         * **本模块是内部模块，切勿直接使用，不保证后续升级的兼容性**
         *
         * @param {string} configuredPath 配置的URL规则
         * @return {Function} 匹配函数
         */
        function compile(configuredPath) {
            if (typeof configuredPath !== 'string' || !configuredPath) {
                throw new Error(
                    'Unexpected path pattern <' + configuredPath + '>');
            }

            // if (cache.hasOwnProperty(configuredPath)) {
            //     return cache[configuredPath];
            // }

            // 感谢[path-to-regexp](https://github.com/component/path-to-regexp)
            var keys = [];

            // 替换URL中的参数
            function replacer(s, slash, format, key, capture, optional, star) {
                keys.push({ name: key, optional: !!optional });
                slash = slash || '';
                return ''
                    + (optional ? '' : slash)
                    + '(?:'
                    + (optional ? slash : '')
                    + (format || '')
                    + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')'
                    + (optional || '')
                    + (star ? '(/*)?' : '');
            }

            var pattern = (configuredPath + '/?')
                .replace(/\/\(/g, '(?:/')
                .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?(\*)?/g, replacer)
                .replace(/([\/.])/g, '\\$1')
                .replace(/\*/g, '(.*)');
            var regex = new RegExp('^' + pattern + '$', '');

            var matcher = function (path) {
                var matches = regex.exec(path);
                if (!matches) {
                    return null;
                }

                var args = {};
                for (var i = 0; i < keys.length; i++) {
                    var key = keys[i];
                    var value = matches[i + 1];

                    // 非可选参数必须有值
                    if (!key.optional && value == null) {
                        return null;
                    }

                    args[key.name] = value;
                }

                return args;
            };
            cache[configuredPath] = matcher;
            return matcher;
        }

        return compile;
    }
);
