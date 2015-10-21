module.exports = function(grunt) {

    grunt.initConfig({

        // Import package manifest
        pkg: grunt.file.readJSON("package.json"),

        // Banner definitions
        meta: {
            banner: "/*\n" +
            " *  <%= pkg.title || pkg.name %> - v<%= pkg.version %>\n" +
            " *  <%= pkg.description %>\n" +
            " *\n" +
            " *  Made by <%= pkg.author.name %>\n" +
            " *  Under <%= pkg.license %> License\n" +
            " */\n"
        },

        // Concat definitions
        concat: {
            options: {
                banner: "<%= meta.banner %>"
            },
            dist: {
                src: ["src/<%= pkg.name %>.js"],
                dest: "dist/<%= pkg.name %>.js"
            },
            en: {
                src: ["src/<%= pkg.name %>-en.js"],
                dest: "dist/<%= pkg.name %>-en.js"
            },
            fr: {
                src: ["src/<%= pkg.name %>-fr.js"],
                dest: "dist/<%= pkg.name %>-fr.js"
            }
        },

        // Lint definitions
        jshint: {
            files: ["src/<%= pkg.name %>.js"],
            options: {
                jshintrc: ".jshintrc"
            }
        },

        // Minify definitions
        uglify: {
            target: {
                src: ["dist/<%= pkg.name %>.js"],
                dest: "dist/<%= pkg.name %>.min.js"
            },
            options: {
                banner: "<%= meta.banner %>"
            }
        }

    });

    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.registerTask("build", ["concat", "uglify"]);
    grunt.registerTask("default", ["jshint", "build"]);

};