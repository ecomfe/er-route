define(
    function (require) {
        var compile = require('compileRoute');

        describe('compileRoute function', function () {
            it('should exist', function () {
                expect(compile).toBeDefined();
            });

            it('should accept string input', function () {
                expect(function () { compile('/'); }).not.toThrow();
            });

            it('should deny any non-string input', function () {
                expect(function () { compile(1); }).toThrow();
                expect(function () { compile([]); }).toThrow();
                expect(function () { compile({}); }).toThrow();
                expect(function () { compile(true); }).toThrow();
            });

            it('should check the length of input', function () {
                expect(function () { compile(); }).toThrow();
            });

            it('should return a matcher function', function () {
                var matcher = compile('/');
                expect(typeof matcher).toBe('function');
            });

            describe('The matcher function', function () {
                it('should match static path with no parameter', function () {
                    var match = compile('/user/list');
                    expect(match('/user/list')).toEqual({});
                    expect(match('/foo/bar')).toBe(null);
                });

                it('should allow trailing slash in path', function () {
                    var match = compile('/user/list');
                    var path = '/user/list/';
                    expect(match(path)).toEqual({});
                });

                it('should match named parameters', function () {
                    var match = compile('/user/:id/:viewType');
                    expect(match('/user/123/edit')).toEqual({ id: '123', viewType: 'edit' });
                    expect(match('/user/123/edit/name')).toBe(null);
                    expect(match('/user/123/')).toBe(null);
                });

                it('should force parameter to has non-null value', function () {
                    var match = compile('/user/:id');
                    expect(match('/user/')).toBe(null);
                    expect(match('/user')).toBe(null);
                })

                it('should match regexp constrained parameter', function () {
                    var match = compile('/user/:id([0-9]+)');
                    expect(match('/user/123')).toEqual({ id: '123' });
                    expect(match('/user/wtf')).toBe(null);
                });

                it('should allow optional parameter', function () {
                    var match = compile('/user/:id?');
                    expect(match('/user/')).toEqual({ id: undefined });
                    expect(match('/foo/')).toBe(null);
                });

                it('should allow trailing star to accept custom path', function () {
                    var match = compile('/user/:id*');
                    expect(match('/user/123/edit')).toEqual({ id: '123' });
                    expect(match('/user/123/edit/name')).toEqual({ id: '123' });
                });
            });
        });
    }
);