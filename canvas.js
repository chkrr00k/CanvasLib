// canvas library by chkrr00k

"use strict"

class Canvas{
    constructor(canvasObj){
        this.canvasObj = canvasObj;
        this.objects = {};
        this.canvasObj.onclick = (e) => {
            Object.values(this.objects).forEach((o) => {
                try{
                    if(o.isClicked(this.canvasObj, e)){
                        o.onclick(e, this);
                    }
                }catch(e){
                    ;
                }
            });
        };
    }
    
    register(obj){
        this.objects[obj.name] = obj;
    }
    
    getElementByName(name){
        return this.objects.filter((i) => {i.name == name});
    }
    
    unregister(name){
        delete this.objects[name]/* = null*/;
    }
    
    draw(){
        this.canvasObj.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
        Object.values(this.objects).forEach((o) => {
            try{
                o.draw(this.canvasObj);
            }catch(e){
                ;
            }
        });
    }

}

//just because OOP patern and no interfaces
class CanvasObject{
    constructor(){
        //throw new Error("Can't instanciate abstract class!");
    }
    
    draw(ctx){
        ;
    }
    
    isClicked(canvas, e){
        return false;
    }
    
    onclick(e){
        ;
    }
    
    get(){
        throw new Error("No inner object!");
    }
}

class CanvasPath2DObject extends CanvasObject{
    constructor(path2d, onclick, name){
        super();
        this.path2d = path2d;
        if(onclick){
            this.onclick = onclick;
        }
        this.name = name || "";
    }
    
    draw(canvas){
        canvas.getContext("2d").stroke(this.path2d);
    }
    
    isClicked(canvas, e){
        return canvas.getContext("2d").isPointInPath(this.path2d, e.clientX, e.clientY);
    }
    
    get(){
        return this.path2d;
    }   
}

class ImageOptions{
    constructor(type, sx=null,sy=null,swidth=null,sheight=null,x=null,y=null,width=null,height=null){
        this.sx = sx;
        this.sy = sy;
        this.swidth = swidth;
        this.sheight = sheight
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.type = type;
    }
    static of(a, b, c, d, e, f, g, h){
        if(a && b && c && d && e && f && g && h){
            return new ImageOptions(0, a, b, c, d, e, f, g, h);
        }else if(a && b && c && d){
            return new ImageOptions(1, null, null, null, null, a, b, c, d);
        }else if(a && b){
            return new ImageOptions(2, null, null, null, null, a, b);
        }else{
            throw new Error("Unsupported combination");
        }
    }
}

class CanvasImageObject extends CanvasObject{
    constructor(image, onclick, name="", opt=new ImageOptions(null)){
        super();
        this.image = image;
        if(onclick){
            this.onclick = onclick;
        }
        this.name = name;
        this.opt = opt;
    }
    
    draw(canvas){
       switch(this.opt.type){
           case 0:
               canvas.getContext("2d").drawImage(this.image, this.opt.sx, this.opt.sy, this.opt.swidth, this.opt.sheight, this.opt.x, this.opt.y, this.opt.width, this.opt.heigth);
               break;
           case 1:
               canvas.getContext("2d").drawImage(this.image, this.opt.x, this.opt.y, this.opt.width, this.opt.heigth);
               break;
           case 2:
               canvas.getContext("2d").drawImage(this.image, this.opt.x, this.opt.y);
               break;
           default:
               canvas.getContext("2d").drawImage(this.image, 0, 0);
       }
    }
    
    isClicked(canvas, e){
        //FIXME with all the option
        return (this.opt.x < e.clientX && this.opt.x + this.image.width > e.clientX && this.opt.y < e.clientY && this.opt.y + this.image.height > e.clientY);
    }
    
    get(){
        return this.image;
    }   
}

class CObFactory{
    
    static of(obj, func, name, opt){
        if(obj instanceof Path2D){
            return new CanvasPath2DObject(obj, func, name);
        }else if(obj instanceof Image){
            return new CanvasImageObject(obj, func, name, opt);
        }else{
            throw new Error("Unsupported canvas type");
        }
    }
}

(() => {
    let c = document.getElementById("canvas");
    let ctx = c.getContext("2d");
    
    let canvas = new Canvas(c);
    let circle = new Path2D();
    circle.arc(170, 60, 50, 0, 2 * Math.PI);
    let canvasCircle = CObFactory.of(circle, () =>{
        console.log("Click");
    }, "Circle1");
    canvas.register(canvasCircle);
    
    let circle2 = new Path2D();
    circle2.arc(10, 40, 10, 0, 2 * Math.PI);
    let canvasCircle2 = CObFactory.of(circle2, () =>{
        console.log("Clock");
    }, "Circle2"); 
    canvas.register(canvasCircle2);
    let img = new Image();
    img.src = "c.png";
    canvas.register(CObFactory.of(img, (e, canvas) => {
        canvas.unregister("Boop");
        canvas.draw();
    }, "Boop", ImageOptions.of(100,100)));
    //canvas.unregister("");
    
    canvas.draw();
})();