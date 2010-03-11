#!/usr/bin/env ringo

// main script to start application

if (require.main == module.id) {
    addToClasspath('./lib/mysql-connector-java-5.1.12-bin.jar');
    require('ringo/webapp').start();
}
