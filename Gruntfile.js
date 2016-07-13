module.exports = function (grunt) {
    grunt.initConfig({
        jasmine: {
            src: 'src/**/*.js',
            options: {
                specs: 'tests/**/*.spec.js'
            }
        }
    });

    // Register tasks.
    grunt.loadNpmTasks('grunt-contrib-jasmine');

    // Default task.
    grunt.registerTask('test', 'jasmine');
    grunt.registerTask('build', ['test']);
};