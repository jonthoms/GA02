
    
    //debugger;
    function coord(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
        this.r = 20.0;
        this.m = 1.0;
        this.color = 'f00';
        return this;
    }

//    var points = [];
    
    var app = {};
    /**
     * Constructor 
     * 
     * @returns {_L3.App}
     */
    function App(){
//        this.init();
    }
    
//    App.prototype.construct = App;
    App.prototype.c;
    App.prototype.points = [];
    
    App.prototype.init = function (){
        console.log('App.init');
        var pt, size = 1000;
        
//        this.points = new Array(size);
        
        this.can = document.getElementById("myCanvas");
        this.c = this.can.getContext("2d");
        
        for(var i = 0; i < size; ++i){
            pt = new coord();

            pt.x = 600 * Math.random() - 300;
            pt.y = 600 * Math.random() - 300;
            pt.z = 600 * Math.random() - 300;

            pt.color = '#' + ('000000' + Math.floor(Math.random()*0xffffff).toString(16)).slice(-6);
            //console.log(pt.color);
            this.points.push(pt);

            //console.log(pt.vx);

        }
        
        /*var rAF = window.requestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           window.mozRequestAnimationFrame ||
           window.oRequestAnimationFrame ||
           window.msRequestAnimationFrame ||
           function(callback) {
               window.setTimeout(callback, 1000 / 60);
           };*/
        
        this.onFrame();
    };
    
    
    /*function coord(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
        this.vx = 0;
        this.vy = 0;
        this.vz = 0;
        this.ax = 0;
        this.ay = 0;
        this.az = 0;
        this.r = 20.0;
        this.m = 1.0;
        this.color = 'f00';
        return this;
    }*/
    

    App.prototype.onFrame = function(){
//        console.log('onFrame');
        var pts = this.points;
        var pt, x0, z0, theta, pl;
        var c = this.c;
        
        window.requestAnimationFrame(this.onFrame.bind(this));
        if(!c){
            return;
        }
        
        c.clearRect ( 0 , 0 , 600 , 600 );

        // draw floor
        this.drawFloor(c);

        this.updateAcceleration();
        this.updateVelocity();
        this.updatePosition();

        
        /*for(var i = 0, pl = pts.length; i < pl; ++i){
            pt = pts[i];
            x0 = pt.x;
            z0 = pt.z;
            theta = 0.01;
            pt.x = x0 * Math.cos(theta) - z0 * Math.sin(theta);
            pt.z = x0 * Math.sin(theta) + z0 * Math.cos(theta);
        }*/

        pts.sort(function(a,b){return b.z - a.z;});
        
        for(var i = 0, pl = pts.length; i < pl; ++i){
            pt = pts[i];
            this.drawCircle(c, pt);
        } 
    };
    

    App.prototype.updateAcceleration = function(){
        var pts = this.points;
        var pt, pt0, dx, dy, dz, dr, i, j, rr, pl;
        
        for(i = 0, pl = pts.length; i < pl; ++i){
            pt = pts[i];
            pt.ay += 0.1;

            for(j = 0; j < pl; ++j){
               if(i === j) continue;
               pt0 = pts[j];

               rr = pt.r + pt0.r;

               dx = pt.x - pt0.x;
               dy = pt.y - pt0.y;
               dz = pt.z - pt0.z;
               dr = Math.sqrt(dx * dx + dy * dy + dz * dz);
               if(dr === 0) continue;

               if(dr < rr){
                   pt.ax += dx / dr * 10 / dr;
                   pt.ay += dy / dr * 10 / dr;
                   pt.az += dz / dr * 10 / dr;
               }
            }
            //if(Math.random() < 0.01) console.log(pt.ay);
        }
    };

    App.prototype.updateVelocity = function (){
        var pts = this.points;
        var pt;
        for(var i = 0, pl = pts.length; i < pl; ++i){
            pt = this.points[i];
            pt.vx += pt.ax;
            pt.vy += pt.ay;
            pt.vz += pt.az;

            pt.ax = 0;
            pt.ay = 0;
            pt.az = 0;

            pt.vx *= 0.99;
            pt.vy *= 0.99;
            pt.vz *- 0.99;
        }
    };

    App.prototype.updatePosition = function (){
        var pts = this.points;
        var i, pt, pl;
        for(i = 0, pl = pts.length; i < pl; ++i){
            pt = pts[i];

            pt.x += pt.vx;
            pt.y += pt.vy;
            pt.z += pt.vz;

            if(pt.x < -300 + pt.r) {
                pt.x = -300 + pt.r;
                pt.vx = 0.7 * Math.abs(pt.vx);
            }

            if(pt.y < -300 + pt.r) {
                pt.y = -300 + pt.r;
                pt.vy = 0.7 * Math.abs(pt.vy);
            }

            if(pt.z < -300 + pt.r) {
                pt.z = -300 + pt.r;
                pt.vz = 0.7 * Math.abs(pt.vy);
            }

            if(pt.x > 300 - pt.r) {
                pt.x = 300 - pt.r;
                pt.vx = -0.7 * Math.abs(pt.vx);
            }

            if(pt.y > 300 - pt.r) {
                pt.y = 300 - pt.r;
                pt.vy = -0.7 * Math.abs(pt.vy);
            }

            if(pt.z > 300 - pt.r) {
                pt.z = 300 - pt.r;
                pt.vz = -0.7 * Math.abs(pt.vz);
            }


        }
    };

    /**
     * 
     * @param {Context} c
     * @param {coord} pt
     * @returns {undefined}
     */
    App.prototype.drawCircle = function (c, pt){    
        var px = 300 + pt.x * 600 / (pt.z + 900);
        var py = 300 + pt.y * 600 / (pt.z + 900);
        var pr = pt.r * 600 / (pt.z + 900);

        c.fillStyle = pt.color;
        c.beginPath();
        c.arc(px,py,pr,0, Math.PI*2,true);
        c.fill(); 
    };
    
    /**
     * 
     * @param {type} c
     * @returns {_L3.drawFloor}
     */
    App.prototype.drawFloor = function (c){
        c.fillStyle = "#83f";
        c.moveTo(0,600);
        c.lineTo(600,600);
        c.lineTo(450, 450);
        c.lineTo(150, 450);
        c.closePath();
        c.fill();
    };
    
    app = new App();
    
//    window.addEventListener('load', function() { 
//        app.init();
//    }, false);
    
    app.init();

    // Starts App
