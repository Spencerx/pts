/*! Pts.js is licensed under Apache License 2.0. Copyright © 2017-current William Ngan and contributors. (https://github.com/williamngan/pts) */

import {Pt, Bound} from "./Pt";
import {Util} from "./Util";
import {GroupLike, PtLikeIterable} from "./Types";

/** 
 * Typography provides helper functions to support typographic layouts. For a concrete example, see [a demo here](../demo/index.html?name=canvasform.textBox) that uses the [`CanvasForm.textBox`](#link) function.
 */
export class Typography {

  /**
   * Create a heuristic text width estimate function. It will be less accurate but faster.
   * @param fn a reference function that can measure text width accurately
   * @param samples a list of string samples. Default is ["M", "n", "."]
   * @param distribution a list of the samples' probability distribution. Default is [0.06, 0.8, 0.14].
   * @return a function that can estimate text width
   */
  static textWidthEstimator(  fn:( string ) => number, samples:string[] = ["M", "n", "."], distribution:number[] = [0.06, 0.8, 0.14] ):( string ) => number {
    let m = samples.map( fn );
    let avg = new Pt( distribution ).dot( m );
    return ( str:string ) => str.length * avg;
  }


  /**
   * Truncate text to fit width.
   * @param fn a function that can measure text width
   * @param str text to truncate
   * @param width width to fit
   * @param tail text to indicate overflow such as "...". Default is empty "".
   */
  static truncate( fn:( string ) => number, str:string, width:number, tail:string = "" ):[string, number] {
    let trim = Math.floor( str.length * Math.min( 1, width / fn( str ) ) );
    if ( trim < str.length ) {
      trim = Math.max( 0, trim - tail.length );
      return [str.substr( 0, trim ) + tail, trim];
    } else {
      return [str, str.length];
    }
  }


  /**
   * Get a function to scale font size proportionally to text box size changes.
   * @param box a Group or an Iterable<PtLike> representing the initial box
   * @param ratio font-size change ratio. Default is 1.
   * @returns a function where input parameter is a new box, and returns the new font size value
   */
  static fontSizeToBox( box:PtLikeIterable, ratio:number = 1, byHeight:boolean = true ): ( GroupLike ) => number {
    let bound = Bound.fromGroup( box );
    let h = byHeight ? bound.height : bound.width;
    let f = ratio * h;
    return function( box2:GroupLike ) {
      let bound2 = Bound.fromGroup( box2 );
      let nh = ( byHeight ? bound2.height : bound2.width ) / h;
      return f * nh;
    };
  }


  /**
   * Get a function to scale font size based on a threshold value.
   * @param defaultSize default font size to base on
   * @param threshold threshold value
   * @param direction if negative, get a font size <= defaultSize; if positive, get a font size >= defaultSize; Default is 0 which will scale font without min or max limits.
   * @returns a function where input parameter is the default font size and a value to compare with threshold, and returns new font size value
   */
  static fontSizeToThreshold( threshold:number, direction:number = 0 ): ( a:number, b:number ) => number {
    return function( defaultSize:number, val:number ) {
      let d = defaultSize * val / threshold; 
      if ( direction < 0 ) return Math.min( d, defaultSize );
      if ( direction > 0 ) return Math.max( d, defaultSize );
      return d;
    };
  }
}

