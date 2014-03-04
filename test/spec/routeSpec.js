define(
    function (require) {
        var controller = require('er/controller');

        require('main').enable();

        controller.registerAction({ path: '/users', action: 'A' });
        controller.registerAction({ path: '/users/:id', action: 'B' });
        controller.registerAction({ path: '/posts/:id', action: 'C', authority: 'EDIT' });
        controller.registerAction({ path: '/posts/:id', action: 'D', authority: 'VIEW' });
        controller.registerAction({ path: '/posts/:id', action: 'E' });
        controller.registerAction({ path: '/comments', movedTo: '/comments/:id' });
        controller.registerAction({ path: '/comments/:id', action: 'F' });

        function findActionConfig(path) {
            var actionContext = {
                url: require('er/URL').parse(path)
            };
            return controller.findActionConfig(actionContext);
        }

        function testSingleRoute(path, expectedAction) {
            var actionConfig = findActionConfig(path);
            expect(actionConfig.action).toBe(expectedAction);
        }

        describe('The route', function () {
            it('should find action config by testing path pattern', function () {
                testSingleRoute('/users', 'A');
                testSingleRoute('/users/123', 'B');
            });
        });
    }
);
