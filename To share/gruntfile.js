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
                      cssDir: 'sinatra/public/css',
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
                    'sinatra/public/js/maps/*.js',
                    'sinatra/public/js/locations/*.js',
                    'sinatra/public/js/store/*.js',
                    'sinatra/public/js/controller/*.js'
                  ]
    },
    concat: {
                normal: {
                  options: {
                    separator: '\r\n;\r\n',
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\r\n\r\n*/'
                  },
                  files: {
                    'sinatra/public/js/liftapp.js': [
                        
                        //Mobile Boilerplate
                        'sinatra/public/js/mbp/*.js',

                        //Store
                        'sinatra/public/js/store/*.js',

                        //Maps
                        'sinatra/public/js/maps/*.js',

                        //Locations
                        'sinatra/public/js/locations/*.js',

                        //Controller
                        'sinatra/public/js/controller/trip.js',
                        'sinatra/public/js/controller/story.js',
                        'sinatra/public/js/controller/setMsg.js',
                        'sinatra/public/js/controller/friends.js',
                        'sinatra/public/js/controller/notifications.js',
                        'sinatra/public/js/controller/init.js'

                    ]
                  } 
                }
    },

    docco: {
                debug: {
                  src: ['sinatra/public/js/**/*.js'],
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











