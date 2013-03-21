module.exports = (grunt) ->

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    meta:
      banner: "/*!\n" + " * <%= pkg.name %>.js v<%= pkg.version %> - <%= grunt.template.today('yyyy-mm-dd') %>\n" + " * Copyright 2012, Raymond Julin (@nervetattoo)\n" + " * backbone.keys.js may be freely distributed under" + " the MIT license.\n */"

    watch:
      scripts:
        files: ['backbone.keys.js']
        tasks: 'jshint'

    uglify:
      options:
        banner: '<%= meta.banner %>'
      all:
        files:
          'dist/backbone.keys.min.js': ['backbone.keys.js']

    jshint:
      all: ['backbone.keys.js']
      options:
        boss: true
        curly: false
        eqeqeq: true
        immed: false
        latedef: true
        newcap: true
        noarg: true
        sub: true
        undef: true
        eqnull: true
        node: true

        globals:
          define: true
          _: true
          Backbone: true
          $: true
          document: true

  grunt.loadNpmTasks 'grunt-contrib-jshint'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-watch'

  # Tasks
  grunt.registerTask 'default', ['jshint', 'uglify']
