'use strict';

const fs = require( 'fs' );
const path = require( 'path' );
const argv = require( 'yargs' ).argv;
const pretty = require( 'pretty' );

class TidyJigsawOutput {

    constructor( options = {} ) {
        this.options     = options;
        this.env         = this.options.env || argv.env || 'local';
        this.allowedEnvs = this.options.allowedEnvs || '*'; // Only process if environment matches. Accepts string or array. Astrix for all environments.
        this.pattern     = this.options.test || /\.html$/;
        this.encoding    = this.options.encoding || 'utf8';
        this.rules       = this.options.rules || { ocd: true };
    }

    getPath( string ) {
        if ( fs.existsSync( string ) ) {
            return path.normalize( string );
        }
    }
    
    getInPath() {
        return this.getPath( this.options.input || `./build_${this.env}` );
    }

    getOutPath() {
        return this.getPath( this.options.output || this.getInPath() );
    }

    log( string, type = 'log' ) {
        if ( this.options.verbose ) {
            console[ type ]( `[TidyJigsawOutput] ${string}` );
        }
    }

    tidyOutput( inDir, outDir ) {

        outDir = outDir || inDir;

        fs.readdir( inDir, ( error, files ) => {
            if ( error ) {
                throw error;
            }

            files.forEach( file => {
                let inputFile = path.resolve( inDir, file );

                if ( fs.statSync( inputFile ).isDirectory() ) {
                    this.tidyOutput( inputFile, path.resolve( outDir, file ) );
                } else {

                    let source = fs.readFileSync( inputFile, this.encoding );

                    if ( this.pattern.test( inputFile ) ) {
                        this.log( `Tidying ${inputFile}` );
                        let result = pretty( source, this.rules );
                        let outputFile = path.resolve( outDir, file );
                        fs.writeFileSync( outputFile, result );
                    }
                }
            } );
        } );
    }

    apply( compiler ) {

        if ( !compiler.hooks.jigsawDone ) {
            throw new Error( "Jigsaw hook doesn't exist. Please update tightenco/laravel-mix-jigsaw to ^1.2.0" );
        }

        compiler.hooks.jigsawDone.tap( 'TidyJigsawOutput', () => {

            if ( !this.allowedEnvs || this.allowedEnvs && ( this.allowedEnvs === '*' || Array.isArray( this.allowedEnvs ) && this.allowedEnvs.includes( this.env ) || this.allowedEnvs === this.env ) ) {
                this.log( 'Starting to tidy output...' );

                if ( !this.getInPath() ) {
                    var err = `Input location "${this.options.input || 'build_' + this.env}" does not exist.`;
                    this.log( err, 'warn' );
                    throw new Error( err );
                }

                const inDir = path.resolve( this.getInPath() );
                const outDir = path.resolve( this.getOutPath() );

                this.tidyOutput( inDir, outDir );
            } else {
                this.log( `Tidying skipped because "${this.env}" enviroment is excluded from the allowed list.` );
            }

        } );
    }
}

module.exports = TidyJigsawOutput;
