define(
    function (require) {
        var controller = require('er/controller');

        require('main').enable();

        // 普通映射
        controller.registerAction({ path: '/users', type: 'A' });

        // 带参数
        controller.registerAction({ path: '/users/:id', type: 'B' });

        // 根据权限继续找
        controller.registerAction({ path: '/posts/:id', type: 'C', authority: 'EDIT' });
        controller.registerAction({ path: '/posts/:id', type: 'D', authority: 'VIEW' });
        controller.registerAction({ path: '/posts/:id', type: 'E' });

        // ~id转为/:id
        controller.registerAction({ path: '/comments', movedTo: '/comments/${id}' });
        controller.registerAction({ path: '/comments/:id', type: 'F' });

        // /:id转为~id
        controller.registerAction({ path: '/pings/:id', movedTo: '/pings~id=${id}' });
        controller.registerAction({ path: '/pings', type: 'G' });

        function findActionConfig(path) {
            var actionContext = {
                url: require('er/URL').parse(path)
            };
            return controller.findActionConfig(actionContext);
        }

        function testSingleRoute(path, expectedAction, args) {
            var actionConfig = findActionConfig(path);
            expect(actionConfig.type).toBe(expectedAction);

            if (args) {
                for (var key in args) {
                    expect(actionConfig.args[key]).toBe(args[key]);
                }
            }
        }

        describe('The route', function () {
            it('should find action config by testing path pattern', function () {
                testSingleRoute('/users', 'A');
                testSingleRoute('/users/123', 'B', { id: '123' });
            });

            it('should fail through if authority is not matched', function () {
                testSingleRoute('/posts/123', 'E', { id: '123' });
                var permission = require('er/permission');
                var isAllow = permission.isAllow;
                permission.isAllow = function (auth) {
                    return auth === 'VIEW';
                };
                testSingleRoute('/posts/123', 'D', { id: '123' });
                permission.isAllow = isAllow;
            });

            it('should process redirection from normal path to new route', function (done) {
                var resolveActionConfig = controller.resolveActionConfig;
                controller.resolveActionConfig = function (config, context) {
                    expect(config.type).toBe('F');
                    expect(config.args.id).toBe('123');
                    expect(context.url.toString()).toBe('/comments/123');
                    controller.resolveActionConfig = resolveActionConfig;
                    done();
                };
                controller.renderAction('/comments~id=123');
            });

            it('should process redirection from new route to normal path', function (done) {
                var resolveActionConfig = controller.resolveActionConfig;
                controller.resolveActionConfig = function (config, context) {
                    expect(config.type).toBe('G');
                    expect(context.url.toString()).toBe('/pings~id=123');
                    controller.resolveActionConfig = resolveActionConfig;
                    done();
                };
                controller.renderAction('/pings/123');
            });
        });
    }
);
