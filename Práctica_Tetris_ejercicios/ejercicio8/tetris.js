// ************************************
// *     EJERCICIO 1                   *
// ************************************


// ============== Point =======================

function Point (x, y) {
	this.x = x;
	this.y = y;    
}

// ============== Rectangle ====================
function Rectangle() {}

Rectangle.prototype.init = function(p1,p2) {
	this.px = p1.x;
	this.py = p1.y;
	this.width = p2.x - p1.x;
	this.height = p2.y - p1.y;
	this.lineWidth= 1;
	this.color = 'black';
}

Rectangle.prototype.draw = function() {

	// TU CÓDIGO AQUÍ:
	// pinta un rectángulo del color actual en pantalla en la posición px,py, con
	// la anchura y altura actual y una línea de anchura=lineWidth. Ten en cuenta que 
	// en este ejemplo la variable ctx es global y que guarda el contexto (context) 
	// para pintar en el canvas.
	ctx.fillStyle = this.color;
	ctx.fillRect(this.px, this.py, this.width, this.height);
	ctx.strokeStyle = "black";
	ctx.lineWidth = this.lineWidth;
	ctx.strokeRect(this.px, this.py, this.width, this.height);
}


Rectangle.prototype.setLineWidth = function(width) { this.lineWidth=width}
Rectangle.prototype.setFill = function(color) { this.color = color}

/** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.move = function(x,y){
	this.px += x;
	this.py += y;
	this.draw();
}

/** Método introducido en el EJERCICIO 4 */

Rectangle.prototype.erase = function(){
	ctx.beginPath();
	ctx.lineWidth = this.lineWidth+2;
	ctx.strokeStyle = Tetris.BOARD_COLOR;
	ctx.rect(this.px, this.py, this.width, this.height);
	ctx.stroke();
	ctx.fillStyle = Tetris.BOARD_COLOR;
	ctx.fill()

}


// ============== Block ===============================

function Block (pos, color) {

	// TU CÓDIGO AQUÍ: este es el constructor de la clase Block. Recibe dos parámetros, pos y color. Pos = posición de la casilla, por ejemplo, (9,19).
	// color = color que hay que emplear para pintar el bloque.
	// Internamente este método crea dos puntos (empleando las coordenadas del pixel)
	// y llama al método init de la clase Rectangle, pasándole como parámetro,
	// estos dos puntos.
	// Sería interesante que emplearas las constantes Block.BLOCK_SIZE y Block.OUTLINE_WIDTH,
	// para establecer la anchura del bloque y la anchura de la línea, respectivamente.
	this.x=pos.x;
	this.y=pos.y;
	punto1=new Point(pos.x*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH,pos.y*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH);
	punto2=new Point((pos.x*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH)+Block.BLOCK_SIZE,(pos.y*Block.BLOCK_SIZE+Block.OUTLINE_WIDTH)+Block.BLOCK_SIZE);
	this.init(punto1, punto2);
	this.color=color;
	this.lineWidth=Block.OUTLINE_WIDTH;
}

Block.BLOCK_SIZE = 30;
Block.OUTLINE_WIDTH = 2;

// TU CÓDIGO AQUÍ: emplea el patrón de herencia (Block es un Rectangle)
Block.prototype = new Rectangle();
Block.prototype.constructor=Block;

/** Método introducido en el EJERCICIO 4 */

Block.prototype.move = function(dx, dy) {
	this.x += dx;
	this.y += dy;

	Rectangle.prototype.move.call(this, dx * Block.BLOCK_SIZE, dy * Block.BLOCK_SIZE);
}

 /**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Block.prototype.can_move = function(board, dx, dy) {
   // TU CÓDIGO AQUÍ: toma como parámetro un increment (dx,dy)
  // e indica si es posible mover el bloque actual si 
 // incrementáramos su posición en ese valor
	var xNueva=this.x+dx;
	var yNueva=this.y+dy;
	if(board.can_move(xNueva,yNueva)){
		return true;
	}else{
		return false;
	}

}


// ************************************
// *      EJERCICIO 2                  *
// ************************************

function Shape() {}


Shape.prototype.init = function(coords, color) {

	// TU CÓDIGO AQUÍ: método de inicialización de una Pieza del tablero
	// Toma como parámetros: coords, un array de posiciones de los bloques
	// que forman la Pieza y color, un string que indica el color de los bloques
	// Post-condición: para cada coordenada, crea un bloque de ese color y lo guarda en un bloque-array
	this.blocks=[];
	var var1=this.blocks;
	for (var i1 = 0; i1 < coords.length; i1++) {
		var1.push(new Block(coords[i1],color));
	}
	this.blocks=var1
	/*8 Atributo introducido en el EJERCICIO 8*/
	this.rotation_dir = 1;
	this.shift_rotation_dir = true;
};

Shape.prototype.draw = function() {

	// TU CÓDIGO AQUÍ: método que debe pintar en pantalla todos los bloques
	// que forman la Pieza
	for(var i = 0; i < this.blocks.length; i++){
		ctx.fillStyle = this.blocks[i].color;
		ctx.fillRect(this.blocks[i].px, this.blocks[i].py, this.blocks[i].width, this.blocks[i].height);
		console.log(this.blocks[i].px);
		console.log(this.blocks[i].py);
		ctx.strokeStyle = "black";
		ctx.lineWidth = this.blocks[i].lineWidth;
		ctx.strokeRect(this.blocks[i].px, this.blocks[i].py, this.blocks[i].width, this.blocks[i].height);
	}
};

/**************************************************
 *	 Código que se da dado para el EJERCICIO 5 *
 ***************************************************/

Shape.prototype.can_move = function(board, dx, dy) {

// TU CÓDIGO AQUÍ: comprobar límites para cada bloque de la pieza
	var seguir=true;
	var i=0;
		while (i < this.blocks.length && seguir == true) {
			var blockAct = this.blocks[i];
			if (blockAct.can_move(board, dx, dy) == false) {
				seguir = false;
			}
			i++;
		}
		return seguir;

};

/* Método introducido en el EJERCICIO 8 */

Shape.prototype.can_rotate = function(board) {

//  TU CÓDIGO AQUÍ: calcula la fórmula de rotación para cada uno de los bloques de
// la pieza. Si alguno de los bloques no se pudiera mover a la nueva posición,
// devolver false. En caso contrario, true.
	var i=0;
	var seguir=true;
	while(i<this.blocks.length && seguir){
		var block=this.blocks[i];
		var centre = this.center_block;
		var x1 = centre.x -this.rotation_dir*centre.y + this.rotation_dir*block.y;
		var y1 = centre.y + this.rotation_dir*centre.x -this.rotation_dir*block.x;
		var block1=new Block(new Point(x1,y1),block.color);
		if(block1.can_move(board,0,0)){
			if((this.igualdad(block1))){
				i++;
			}else{
				i++;
			}
		}else{
			seguir=false;
		}
	}
	return seguir;
};



Shape.prototype.sobrepasaAltura = function(board){
    var i=0;
    var salir=false;
    while(i<this.blocks.length && !salir){
        var blockAct=this.blocks[i];
        if(blockAct.y==(Tetris.BOARD_HEIGHT-1) || !board.can_move(blockAct.x,(blockAct.y+1))){
            salir=true;
        }else{
            i++;
        }
    }
    return salir;
}
/* Método introducido en el EJERCICIO 8 */
Shape.prototype.igualdad = function(block){
	var i=0;
	var salir=false;
	while(i<this.blocks.length && !salir){
		var blockyAct=this.blocks[i];
		if(blockyAct.x==block.x && blockyAct.y==block.y && blockyAct.px==block.px && blockyAct.py==block.py && blockyAct.weight==block.weight && blockyAct.weight==block.weight && blockyAct.lineWidth==block.lineWidth && blockyAct.color==block.color){
			salir=true;
		}else{
			i++;
		}
	}
	return salir;
}

Shape.prototype.rotate = function() {

// TU CÓDIGO AQUÍ: básicamente tienes que aplicar la fórmula de rotación
// (que se muestra en el enunciado de la práctica) a todos los bloques de la pieza
	var i=0;
	for (block of this.blocks) {
		if (block != this.center_block) {
			var centre = this.center_block;
			var x1 = centre.x - this.rotation_dir * centre.y + this.rotation_dir * block.y;
			var y1 = centre.y + this.rotation_dir * centre.x - this.rotation_dir * block.x;
			var block1= new Block(new Point(x1,y1),block.color);
			console.log(this.igualdad(block1));
			if (!this.igualdad(block1)) {
				block.erase();
			}
			block1.draw();
			this.blocks[i]=block1;
		}
		i++;
	}
  /* Deja este código al final. Por defecto las piezas deben oscilar en su
     movimiento, aunque no siempre es así (de ahí que haya que comprobarlo) */
    if (this.shift_rotation_dir) {
		this.rotation_dir *= -1
	}
};

/* Método introducido en el EJERCICIO 4 */

Shape.prototype.move = function(dx, dy) {
   
	for (block of this.blocks) {
		block.erase();
	}

	for (block of this.blocks) {
		block.move(dx,dy);
	}
};


// ============= I_Shape ================================
function I_Shape(center) {
	var coords = [new Point(center.x - 2, center.y),
		new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1, center.y)];
    
	Shape.prototype.init.call(this, coords, "blue");   

	/* Atributo introducido en el ejercicio 8*/

	this.shift_rotation_dir = true;
	this.center_block = this.blocks[2];

}

// TU CÓDIGO AQUÍ: La clase I_Shape hereda de la clase Shape
I_Shape.prototype = new Shape();
I_Shape.prototype.constructor=I_Shape;

// =============== J_Shape =============================
function J_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar J_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x  , center.y),
		new Point(center.x +1  , center.y),
		new Point(center.x +1 , center.y+1)];
	Shape.prototype.init.call(this, coords, "orange");
	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = true;
	this.center_block = this.blocks[1];
	
}

// TU CÓDIGO AQUÍ: La clase J_Shape hereda de la clase Shape
J_Shape.prototype = new Shape();
J_Shape.prototype.constructor=J_Shape;

// ============ L Shape ===========================
function L_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar L_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x-1  , center.y),
		new Point(center.x  , center.y),
		new Point(center.x+1  , center.y),
		new Point(center.x -1, center.y+1)];

	Shape.prototype.init.call(this, coords, "cyan");
	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = true;
	this.center_block = this.blocks[1];
 
}

// TU CÓDIGO AQUÍ: La clase L_Shape hereda de la clase Shape
L_Shape.prototype = new Shape();
L_Shape.prototype.constructor=L_Shape;


// ============ O Shape ===========================
function O_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar O_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x , center.y),
		new Point(center.x , center.y + 1),
		new Point(center.x-1  , center.y),
		new Point(center.x-1 , center.y + 1)];

	Shape.prototype.init.call(this, coords, "red");
	/* atributo introducido en el EJERCICIO 8 */

       this.center_block = this.blocks[0];

}

// TU CÓDIGO AQUÍ: La clase O_Shape hereda de la clase Shape
O_Shape.prototype = new Shape();
O_Shape.prototype.constructor=O_Shape;
/* Código introducido en el EJERCICIO 8*/
// O_Shape la pieza no rota. Sobreescribiremos el método can_rotate que ha heredado de la clase Shape

O_Shape.prototype.can_rotate = function(board){
	return false;
};

// ============ S Shape ===========================
function S_Shape(center) {

	// TU CÓDIGO AQUÍ: Para programar S_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x , center.y),
		new Point(center.x  , center.y+1),
		new Point(center.x -1  , center.y+1),
		new Point(center.x +1 , center.y)];

	Shape.prototype.init.call(this, coords, "green");
	/* atributo introducido en el EJERCICIO 8 */


	this.shift_rotation_dir = true;
	this.center_block = this.blocks[0];


}

S_Shape.prototype = new Shape();
S_Shape.prototype.constructor=S_Shape;
// ============ T Shape ===========================
function T_Shape(center) {

	// TU CÓDIGO AQUÍ: : Para programar T_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x + 1 , center.y),
		new Point(center.x, center.y+1)];

	Shape.prototype.init.call(this, coords, "yellow");

	/* atributo introducido en el EJERCICIO 8 */
	this.shift_rotation_dir = true;
       this.center_block = this.blocks[1];


}

T_Shape.prototype = new Shape();
T_Shape.prototype.constructor=T_Shape;

// ============ Z Shape ===========================
function Z_Shape(center) {

	// TU CÓDIGO AQUÍ: : Para programar Z_Shape toma como ejemplo el código de la clase I_Shape
	var coords = [new Point(center.x - 1, center.y),
		new Point(center.x , center.y),
		new Point(center.x , center.y+1),
		new Point(center.x + 1, center.y+1)];

	Shape.prototype.init.call(this, coords, "magenta");

	/* atributo introducido en el EJERCICIO 8 */

       this.shift_rotation_dir = true;
       this.center_block = this.blocks[1];
}

// TU CÓDIGO AQUÍ: La clase Z_Shape hereda de la clase Shape
Z_Shape.prototype = new Shape();
Z_Shape.prototype.constructor=Z_Shape;

// ************************************
// *     EJERCICIO 3               *
// ************************************

// ====================== BOARD ================

function Board(width, height) {
	this.width = width;
	this.height = height;
	this.grid = {}; /* 6. Estructura de datos introducida en el EJERCICIO 6 */
}


// Si la pieza nueva puede entrar en el tablero, pintarla y devolver true.
// Si no, devoler false

Board.prototype.draw_shape = function(shape){
	if (shape.can_move(this,0,0)){
		shape.draw();
		return true;
	}
	return false;
}

 /*****************************
 *	 EJERCICIO 6          *
 *****************************/

Board.prototype.add_shape = function(shape){

	// TU CÓDIGO AQUÍ: meter todos los bloques de la pieza que hemos recibido por parámetro en la estructura de datos grid
	for(var i=0;i<shape.blocks.length;i++){
		var posX=shape.blocks[i].x;
		var posY=shape.blocks[i].y;
		var bloqueAct= shape.blocks[i];
		var coord=(posX+","+posY);
		this.grid[coord]=bloqueAct;
	}
}

// ****************************
// *     EJERCICIO 5          *
// ****************************

Board.prototype.can_move = function(x,y){

 	// TU CÓDIGO AQUÍ: 
 	// hasta ahora, este método siempre devolvía el valor true. Ahora,
 	// comprueba si la posición que se le pasa como párametro está dentro de los  
	// límites del tablero y en función de ello, devuelve true o false.

	/* EJERCICIO 7 */
	// TU CÓDIGO AQUÍ: código para detectar colisiones. Si la posición x,y está en el diccionario grid, devolver false y true en cualquier otro caso.
	if((x>=0 && x<this.width) && (y>=0 && y<this.height) && !(x+","+y in this.grid)){
		return true;
	}else{
		return false;
	}
};
Board.prototype.is_row_complete = function(y){
// TU CÓDIGO AQUÍ: comprueba si la línea que se le pasa como parámetro
// es completa o no (se busca en el grid).
	var i=0;
	var seguir=true;
	while(i<this.width && seguir){
		if(i+","+y in this.grid){
			i++;
		}else{
			seguir=false;
		}
	}
	return seguir;
};

Board.prototype.delete_row = function(y){
// TU CÓDIGO AQUÍ: Borra del grid y de pantalla todos los bloques de la fila y
	for (var i=0;i<this.width;i++){
		if(i+","+y in this.grid){
			var blckAct=this.grid[(i+","+y)];
			blckAct.erase();
			delete this.grid[(i+","+y)];
		}
	}
};

Board.prototype.move_down_rows = function(y_start){
/// TU CÓDIGO AQUÍ: 
//  empezando en la fila y_start y hasta la fila 0
//    para todas las casillas de esa fila
//       si la casilla está en el grid  (hay bloque en esa casilla)
//          borrar el bloque del grid
//          
//          mientras se pueda mover el bloque hacia abajo
//              mover el bloque hacia abajo
//          
//          meter el bloque en la nueva posición del grid
	for (var y=y_start;y>=0;y--){
		for(var i=0;i<this.width;i++){
			if ((i + "," + y in this.grid)){
				var sal=false;
				var x=0;
				while(!sal){
					if(this.can_move(i,y+(x+1)) && y+(x+1)<y_start+2){
						x++;
					}else{
                        this.grid[(i+","+(y+x))]=this.grid[(i+","+y)];
                        this.grid[(i+","+(y))].erase();
                        delete this.grid[(i+","+(y))];
                        this.grid[(i+","+(y+x))].move(0,x);

						sal=true;
					}
				}

			}
		}
	}
};

Board.prototype.remove_complete_rows = function(){
// TU CÓDIGO AQUÍ:
// Para toda fila y del tablero
//   si la fila y está completa
//      borrar fila y
//      mover hacia abajo las filas superiores (es decir, move_down_rows(y-1) )
	var y=0;
	while(y<this.height){
		if(this.is_row_complete(y)){
			this.delete_row(y);
			this.move_down_rows(y-1);
		}
		y++;
	}
};
Board.prototype.gameOver=function(){
	clearInterval(Tetris.timer);
	window.alert("Game Over");
}


// ==================== Tetris ==========================

function Tetris() {
	this.board = new Board(Tetris.BOARD_WIDTH, Tetris.BOARD_HEIGHT);
}

Tetris.SHAPES = [I_Shape, J_Shape, L_Shape, O_Shape, S_Shape, T_Shape, Z_Shape];
Tetris.DIRECTION = {'Left':[-1, 0], 'Right':[1, 0], 'Down':[0, 1]};
Tetris.BOARD_WIDTH = 10;
Tetris.timer=null;
Tetris.BOARD_HEIGHT = 20;
Tetris.BOARD_COLOR='white';
Tetris.prototype.create_new_shape = function(){

	// TU CÓDIGO AQUÍ: 
	// Elegir un nombre de pieza al azar del array Tetris.SHAPES
	// Crear una instancia de ese tipo de pieza (x = centro del tablero, y = 0)
	// Devolver la referencia de esa pieza nueva
	const rand=getRndInteger(0,Tetris.SHAPES.length);
	var shap=Tetris.SHAPES[rand].name;
	var res=null;
	if(shap ==="I_Shape"){
		res=new I_Shape(new Point(Tetris.BOARD_WIDTH/2,0));
	}else if(shap ==="J_Shape"){
		res=new J_Shape(new Point(Tetris.BOARD_WIDTH/2,0));
	}
	else if(shap ==="L_Shape"){
		res=new L_Shape(new Point(Tetris.BOARD_WIDTH/2,0));
	}
	else if(shap ==="O_Shape"){
		res=new O_Shape(new Point(Tetris.BOARD_WIDTH/2,0));
	}
	else if(shap ==="S_Shape"){
		res=new S_Shape(new Point(Tetris.BOARD_WIDTH/2,0));
	}else if(shap ==="T_Shape"){
		res=new T_Shape(new Point(Tetris.BOARD_WIDTH/2,0));
	}
	else if(shap ==="Z_Shape"){
		res=new Z_Shape(new Point(Tetris.BOARD_WIDTH/2,0));
	}
	return res;
}
function getRndInteger(min, max) {
	return Math.floor(Math.random() * (max - min) ) + min;
}
Tetris.prototype.init = function() {

	/**************
	 EJERCICIO 4
	 ***************/

	// gestor de teclado

	document.addEventListener('keydown', this.key_pressed.bind(this), false);

	// Obtener una nueva pieza al azar y asignarla como pieza actual 

	this.current_shape = this.create_new_shape();

	// TU CÓDIGO AQUÍ: 
	// Pintar la pieza actual en el tablero
	// Aclaración: (Board tiene un método para pintar)
	Board.prototype.draw_shape(this.current_shape);
	this.timer=setInterval(function(){
		this.game.animate_Shape();
	},1000);
}

Tetris.prototype.key_pressed = function(e) { 

	var key = e.keyCode ? e.keyCode : e.which;

        // TU CÓDIGO AQUÍ:
	// en la variable key se guardará el código ASCII de la tecla que
	// ha pulsado el usuario. ¿Cuál es el código key que corresponde 
	// a mover la pieza hacia la izquierda, la derecha, abajo o a rotarla?
	if(e.keyCode==39){
		console.log("Has pulsado la tecla: Right");
		this.do_move('Right');
	}
	if(e.keyCode==37){
		console.log("Has pulsado la tecla: Left");
		this.do_move('Left');
	}
	if(e.keyCode==40){
		console.log("Has pulsado la tecla: Down");
		this.do_move('Down');
	}
    /* Introduce el código para realizar la rotación en el EJERCICIO 8. Es decir, al pulsar la flecha arriba, rotar la pieza actual */
    if(e.keyCode==38){
		console.log("Has pulsado la tecla: Rotate");
		this.do_rotate();
	}
	if(e.keyCode==32){
		console.log("Has pulsado la tecla: Space");
		var salir=false;
		while(salir==false){
			if(this.current_shape.can_move(this.board,0,1)){
				this.current_shape.move(0,1);
			}else{
				this.board.add_shape(this.current_shape);
				this.current_shape=this.create_new_shape();
				if(this.current_shape.can_move(this.board,0,0)) {
					this.current_shape.draw();
				}
				salir=true;
			}
		}
	}
	}

Tetris.prototype.do_move = function(direction) {

	// TU CÓDIGO AQUÍ: el usuario ha pulsado la tecla Left, Right o Down (izquierda,
	// derecha o abajo). Tenemos que mover la pieza en la dirección correspondiente
	// a esa tecla. Recuerda que el array Tetris.DIRECTION guarda los desplazamientos 
	// en cada dirección, por tanto, si accedes a Tetris.DIRECTION[direction], 
	// obtendrás el desplazamiento (dx, dy). A continuación analiza si la pieza actual 
	// se puede mover con ese desplazamiento. En caso afirmativo, mueve la pieza. 

	/* Código que se pide en el EJERCICIO 6 */
	// else if(direction=='Down')
	// TU CÓDIGO AQUÍ: añade la pieza actual al grid. Crea una nueva pieza y dibújala en el tablero.
	var pX=Tetris.DIRECTION[direction][0];
	var pY=Tetris.DIRECTION[direction][1];
	if(this.current_shape.can_move(this.board,pX,pY)){
		this.current_shape.move(pX,pY);
	}else if(direction==='Down'){
		this.board.add_shape(this.current_shape);
		this.current_shape=this.create_new_shape();
		if(this.current_shape.can_move(this.board,0,0)) {
			this.current_shape.draw();
		}
	}
	this.board.remove_complete_rows();
	if(!this.current_shape.can_move(this.board,0,0)) {
		this.board.gameOver();
	}
}

/***** EJERCICIO 8 ******/
Tetris.prototype.do_rotate = function(){

	// TU CÓDIGO AQUÍ: si la pieza actual se puede rotar, rótala. Recueda que Shape.can_rotate y Shape.rotate ya están programadas.
	if(this.current_shape.can_rotate(this.board)){
		this.current_shape.rotate();
	}
}
Tetris.prototype.animate_Shape=function(){
	console.log(this.timer);
	this.do_move("Down");

}
