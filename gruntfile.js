/*************************************************

  LiftApp

  Grrrrrrrunt!

  IQContent | Conor Luddy

*************************************************/
module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),


    //CSS
    compass: {    // Task
                  dev: { // Target
                    options: { // Target options
                      sassDir: 'sass',
                      cssDir: 'css',
                      environment: 'development',
                      outputStyle: 'expanded'
                    }
                  }
    },
    //JavaScript
    jshint: {
                  options: {
                    force: true
                  },
                  files: [
                    'js/maps/*.js',
                    'js/locations/*.js',
                    'js/store/*.js',
                    'js/controller/*.js'
                  ]
    },
    concat: {
                normal: {
                  options: {
                    separator: '\r\n;\r\n',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\r\n\r\n*/'
                  },
                  files: {
                    'js/liftapp.js': [
                        
                        //Mobile Boilerplate
                        'js/mbp/plugins.js',
                        'js/mbp/helper.js',

                        //Store
                        'js/store/coordinates.js',
                        'js/store/marker.js',
                        'js/store/message.js',
                        
                        //Maps
                        'js/maps/styles.js',
                        'js/maps/directions.js',
                        'js/maps/initialise.js',

                        //Locations
                        'js/locations/locate.js',
                        'js/locations/marker.js',

                        //Controller
                        'js/controller/story.js',
                        'js/controller/setMsg.js',
                        'js/controller/init.js'

                    ]
                  } 
                }
    },

    docco: {
                debug: {
                  src: ['js/**/*.js'],
                  options: {
                    output: 'docs/'
                  }
                }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-docco');

  grunt.registerTask('default', ['compass','jshint','concat', 'docco']);

};











