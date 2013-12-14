///////////////////////////////////////////////////
/////////	INICIO			///////////
///////////////////////////////////////////////////
function onInit(){
    //
    // cuando inicio primera vez, creo todos, un año
    // no hace falta, como tenemos la dieta, se crea dia a dia, si el dia no esta creado se crea
    // 20130619 = 214365
    // 2 lacteos, 1 grasas, 4 hidratos, 3 proteinas, 6 verduras, 5 frutas
    //    localStorage.setItem(fecha, '214365');
    //      localStorage.setItem("dieta", '214365');			
    //     alert('Hey');
    //    
    //   localStorage.setItem('2013-06-19', '214365');
  
    if (localStorage.getItem('dieta')){
      crear_iconos();
      document.getElementById('fecha').value = hoy();		// poner fecha en hoy
      cargar_dia();
    }
    else{
	   woman_man();				    		// select man or woman and create dieta
    }
 
}
///////////////////////////////////////////////////
/////////	LOGICA			///////////
///////////////////////////////////////////////////
//
// carga valores para el dia selecionado
//
function cargar_dia(){
    var fecha =  document.getElementById('fecha').value;	// leer fecha
    actualizar_icono_fecha(fecha);
    if (localStorage.getItem(fecha)){
	    var alimentos_hoy = localStorage.getItem(fecha);		// leer del storage, los alimentos que quedan para el dia
	    var alimentos_dieta = localStorage.getItem('dieta');	// y los de siempre
	    rellenar_tabla(alimentos_hoy, alimentos_dieta);
    }
    else{
      if (compare_dates(fecha, hoy())){ 		
        var dieta_del_dia = localStorage.getItem('dieta');	// crear el item de ese dia igual que la dieta y volver a cargar el dia
 	localStorage.setItem(fecha, dieta_del_dia);
	cargar_dia();
      }else{  
    //    alert("No me conocias :(");				// if fecha es menor -> mensaje, nocreo nada
      }  
    }
}
//
// rellena la tabla con los alimentos dados
//
function rellenar_tabla(alimentos_restantes, alimentos_totales){
    var lacteos_restantes = Math.floor(alimentos_restantes / 100000);		// leer cada alimento lo que queda por comer
    	alimentos_restantes = alimentos_restantes % 100000; 
    
    var grasas_restantes = Math.floor(alimentos_restantes / 10000);
	alimentos_restantes = alimentos_restantes % 10000; 

    var hidratos_restantes = Math.floor(alimentos_restantes / 1000);
        alimentos_restantes = alimentos_restantes % 1000; 

    var proteinas_restantes = Math.floor(alimentos_restantes / 100);
        alimentos_restantes = alimentos_restantes % 100; 
    
    var verduras_restantes = Math.floor(alimentos_restantes / 10);
        alimentos_restantes = alimentos_restantes % 10; 
    
    var frutas_restantes = Math.floor(alimentos_restantes);


    var lacteos_totales = Math.floor(alimentos_totales / 100000);		// leer cada alimento el total diario
    	alimentos_totales = alimentos_totales % 100000; 
    
    var grasas_totales = Math.floor(alimentos_totales / 10000);
	alimentos_totales = alimentos_totales % 10000; 

    var hidratos_totales = Math.floor(alimentos_totales / 1000);
        alimentos_totales = alimentos_totales % 1000; 

    var proteinas_totales = Math.floor(alimentos_totales / 100);
        alimentos_totales = alimentos_totales % 100; 
    
    var verduras_totales = Math.floor(alimentos_totales / 10);
        alimentos_totales = alimentos_totales % 10; 
    
    var frutas_totales = Math.floor(alimentos_totales);

    										// rellenar tabla con alimentos
    	crear_fila('lacteos', lacteos_restantes, lacteos_totales);
	crear_fila('grasas', grasas_restantes, grasas_totales);
	crear_fila('hidratos', hidratos_restantes, hidratos_totales);
	crear_fila('proteinas', proteinas_restantes, proteinas_totales);
	crear_fila('verduras', verduras_restantes, verduras_totales);
	crear_fila('frutas', frutas_restantes, frutas_totales);
}
//
// resta un alimento del localStorage
//
function restar_alimento(alimento){
    var fecha =  document.getElementById('fecha').value;		// leer fecha
    var alimentos = localStorage.getItem(fecha);			// leer del storage
    localStorage.setItem("u" + fecha, alimentos);			// actualizar storage del undo

	switch (alimento){						// restar del alimento selecionado
	  case "lacteos":
	    alimentos = alimentos -100000;
	    break;
  	  case "grasas":
	    alimentos = alimentos -10000;
	    break;
	  case "hidratos":
	    alimentos = alimentos -1000;
	    break;
	  case "proteinas":
	    alimentos = alimentos -100;
	    break;
  	  case "verduras":
	    alimentos = alimentos -10;
	    break;
	  case "frutas":
	    alimentos = alimentos -1;
	    break;
	}
    localStorage.setItem(fecha, alimentos);				// actualizar storage
}
//
// restablece alimentos a estado anterior
//
function restablecer_alimento(){
    var fecha =  document.getElementById('fecha').value;		// leer fecha
    var alimentos = localStorage.getItem("u" + fecha);			// leer del storage undo
    localStorage.setItem(fecha, alimentos);				// actualizar storage
}
///////////////////////////////////////////////////
//////	GENERA HTML			///////
///////////////////////////////////////////////////
//
// escribo una fila
//
function crear_fila(nombre_fila, restantes, totales){
	var tr = document.createElement("tr");
        tr.setAttribute("id", nombre_fila);
        document.getElementById('tabla').appendChild(tr);
        for (var i = 0; i < totales; i++) {
          //
	        // escribo una columna
	        //
	        var td = document.createElement("td");
	        td.setAttribute("id", nombre_fila + i);
 	        //
	        // marca lacteos(todos), frutas(2) y verduras(3) obligatorias
	        //
	        if (nombre_fila=="lacteos"){
		      td.setAttribute("class", "obligado");
	        }		
	        if (nombre_fila=="verduras" && i>2){
		        td.setAttribute("class", "obligado");
	        }		
	        if (nombre_fila=="frutas" && i>2){
		        td.setAttribute("class", "obligado");
	        }
          if (i>=restantes){
            td.setAttribute("class", "comido");        // si ya lo hemos comido
          }

	        document.getElementById(nombre_fila).appendChild(td);
	        //
	        // inserto imagen en la celda
	        //
	        var img = document.createElement("img");
	        img.setAttribute("id", nombre_fila);
	        img.setAttribute("src", "images/" + nombre_fila + ".png"); 
	        if (i<restantes){
		        img.setAttribute("onclick", "comer(this)");			// si aun no lo hemos comido
	        }
	        else{
	  	      img.setAttribute("class", "comido");				// si ya lo hemos comido
	        }
	        document.getElementById(nombre_fila + i).appendChild(img);
	     }
}
//
// crear nav y pie
//
function crear_iconos(){
	crear_nav();
	crear_pie();
	crea_nav_icon();
 	crea_pie_icon();
 	inserta_date_input();
}
//
// inserta opciones menu nav { dia menos, dia mas, dia y mes, el dpt oculto se insertara despues }
//
function crea_nav_icon(ancho){
	var ico = document.createElement("img");
	ico.setAttribute("src", "images/left.png");
	ico.setAttribute("onclick", "retrasar1dia()");
	document.getElementById("nav1").appendChild(ico);

	var input = document.createElement("input");
        input.setAttribute("id", "dia");
        input.setAttribute("type", "text");
	input.setAttribute("size", "2");
	input.setAttribute("value", hoy_dia());
        document.getElementById('nav2').appendChild(input);

	var input = document.createElement("input");
       	input.setAttribute("id", "mes");
	input.setAttribute("type", "text");
	input.setAttribute("size", "2");
	input.setAttribute("value", hoy_mes());
	document.getElementById('nav3').appendChild(input);

  	var ico = document.createElement("img");
	ico.setAttribute("src", "images/right.png");
	ico.setAttribute("onclick", "adelantar1dia()");
	document.getElementById("nav4").appendChild(ico);
}
//
// crea menu nav en la cabecera
//
function crear_nav(){
 		var li = document.createElement("li");
		li.setAttribute("id", "nav1");
	  	document.getElementById("menu_cabeza").appendChild(li);

		var li = document.createElement("li");
		li.setAttribute("id", "nav2");
	  	document.getElementById("menu_cabeza").appendChild(li);

		var li = document.createElement("li");
		li.setAttribute("id", "nav3");
	  	document.getElementById("menu_cabeza").appendChild(li);
		
		var li = document.createElement("li");
		li.setAttribute("id", "nav4");
	  	document.getElementById("menu_cabeza").appendChild(li);
		
		var li = document.createElement("li");
		li.setAttribute("id", "nav5");
	  	document.getElementById("menu_cabeza").appendChild(li);
		document.getElementById('nav5').style.display='none';	// lo oculto aqui va el dpt date
}
//
// crea los iconos del pie
//
function crea_pie_icon(){
	var enlace = document.createElement("a");
	enlace.setAttribute("href", "./help.html");
	enlace.setAttribute("id", "help");
	document.getElementById("pie1").appendChild(enlace);
	  	var ico = document.createElement("img");
		ico.setAttribute("src", "images/help.png");
		document.getElementById("help").appendChild(ico);

	var ico = document.createElement("img");
	ico.setAttribute("src", "images/undo.png");
	ico.setAttribute("onclick", "deshacer()");
	document.getElementById("pie3").appendChild(ico);
}
//
// crea menu pie
//
function crear_pie(){
		var li = document.createElement("li");
		li.setAttribute("id", "pie1");
	  	document.getElementById("menu_pie").appendChild(li);

  		var li = document.createElement("li");
		li.setAttribute("id", "pie2");
	  	document.getElementById("menu_pie").appendChild(li);

		var li = document.createElement("li");
		li.setAttribute("id", "pie3");
	  	document.getElementById("menu_pie").appendChild(li);
}
//
// escribo una fila de 6 columnas
//
function add_6row6col(){
  for (var i = 0; i < 6; i++) {
    var tr = document.createElement("tr");
        tr.setAttribute("id", "row" + i);
        document.getElementById('tabla').appendChild(tr);
    
        for (var j = 0; j < 6; j++) {
          var td = document.createElement("td");
                td.setAttribute("id", "row" + i + "col" + j);
                document.getElementById("row" + i).appendChild(td);
        }
  }
}
//
// escribo las oes
//
function add_oes(){
  var p = document.createElement("p");
  p.setAttribute("id", "p0");
  p.setAttribute("align", "center");
  document.getElementById("row0col2").appendChild(p);
  var str=document.createTextNode('or');
  document.getElementById("p0").appendChild(str);
  var p = document.createElement("p");
  p.setAttribute("id", "p1");
  p.setAttribute("align", "center");
  document.getElementById("row1col2").appendChild(p);
  var str=document.createTextNode('o');
  document.getElementById("p1").appendChild(str);
  var p = document.createElement("p");
  p.setAttribute("id", "p2");
  p.setAttribute("align", "center");
  document.getElementById("row2col2").appendChild(p);
  var str=document.createTextNode('|');
  document.getElementById("p2").appendChild(str);
  var p = document.createElement("p");
  p.setAttribute("id", "p3");
  p.setAttribute("align", "center");
  document.getElementById("row3col2").appendChild(p);
  var str=document.createTextNode('或');
  document.getElementById("p3").appendChild(str);
  var p = document.createElement("p");
  p.setAttribute("id", "p4");
  p.setAttribute("align", "center");
  document.getElementById("row4col2").appendChild(p);
  var str=document.createTextNode('または');
  document.getElementById("p4").appendChild(str);
  var p = document.createElement("p");
  p.setAttribute("id", "p5");
  p.setAttribute("align", "center");
  document.getElementById("row5col2").appendChild(p);
  var str=document.createTextNode('или');
  document.getElementById("p5").appendChild(str);

}
//
// escribo seleccion  mujer o hombre
//
function woman_man(){
  add_6row6col();
  add_oes();
  
  var img = document.createElement("img");
  img.setAttribute("id", "mano_apunta_der");
  img.setAttribute("src", "images/mano_apunta_der.svg");
  document.getElementById("row2col0").appendChild(img);
	//
	// inserto imagen mujer
	//
	var img = document.createElement("img");
	img.setAttribute("id", "woman");
	img.setAttribute("src", "images/woman.gif");
  img.setAttribute("onclick", "crea_dieta(this)");
	document.getElementById("row2col1").appendChild(img);
  //
	// inserto imagen hombre
	//
	var img = document.createElement("img");
	img.setAttribute("id", "man");
	img.setAttribute("src", "images/man.gif");
 	img.setAttribute("onclick", "crea_dieta(this)");
	document.getElementById("row2col3").appendChild(img);
  
  var img = document.createElement("img");
  img.setAttribute("id", "mano_apunta_izq");
  img.setAttribute("src", "images/mano_apunta_izq.svg");
  document.getElementById("row2col4").appendChild(img);
}
//
// escribo date select picker como input tipo date pero lo dejo oculto, solo leer
//
function inserta_date_input(){
  //       <input type="date" name="fecha" id="fecha" onchange="cambio_dia()" />
  var dtp = document.createElement("input");
        dtp.setAttribute("id", "fecha");
        dtp.setAttribute("type", "date");
        dtp.setAttribute("name", "fecha");
        dtp.setAttribute("onchange", "cambio_dia()");
        document.getElementById('nav5').appendChild(dtp);
	document.getElementById('fecha').style.display='none';
}
//
// actualiza el icono de la fecha con la fecha nueva
//
function actualizar_icono_fecha(fecha){
        document.getElementById('dia').value = leer_dia(fecha);
        document.getElementById('mes').value = leer_mes(fecha);
   }
///////////////////////////////////////////////////
//////	EVENTOS				///////
///////////////////////////////////////////////////
//
// seleciona un dia
//
function cambio_dia(){
    limpia_tabla('tabla');
    cargar_dia();
}
//
// va un dia atras
//
function retrasar1dia(){
    document.getElementById('fecha').value = restar1dia();		// poner fecha en hayer
    limpia_tabla('tabla');
    cargar_dia();
}
//
// va un dia alante
//
function adelantar1dia(){
    document.getElementById('fecha').value = sumar1dia();		// poner fecha en hayer
    limpia_tabla('tabla');
    cargar_dia();
}
//
// click en alimento, marca una imagen, quita onclick y resta 1 al localStorage
//
function comer(imagen){
	restar_alimento(imagen.id);
    	limpia_tabla('tabla');
    	cargar_dia();
}    
//
// click en deshacer, marca una imagen, quita onclick y resta 1 al localStorage
//
function deshacer(){
	restablecer_alimento();
	limpia_tabla('tabla');
	cargar_dia();
}    
//
// click en persona, creo dieta en el localStorage y borro fila de mujer hombre y llamo al inicio
//
function crea_dieta(sexso){
	switch (sexso.id){						// crea dieta segun sexo selecionado
	  case "woman":
	    localStorage.setItem("dieta", '214365');
	    break;
  	  case "man":
	    localStorage.setItem("dieta", '324465');
	    break;
	}
	limpia_tabla('tabla');						// borra mujer hombre
	onInit();						
}
///////////////////////////////////////////////////
//////	FUNCIONES SECUNDARIAS		///////
///////////////////////////////////////////////////
//
// ajustar a dos digitos
//
function leadingZero(value){
   if(value < 10){
      return "0" + value.toString();
   }
   return value.toString();    
}
//
// coger fecha de hoy
//
function hoy(){
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  var dia = curr_year + "-" + leadingZero(curr_month) + "-" + leadingZero(curr_date);
  return dia;
}
//
// lee dia de la cadena de fecha
//
function leer_dia(fecha){
	var fragmentos =  fecha.split('-');
      	return fragmentos[2];
}
//
// lee mes de la cadena de fecha
//
function leer_mes(fecha){
	var fragmentos =  fecha.split('-');
      	return fragmentos[1];
}
//
// coger fecha de hoy
//
function hoy_dia(){
  var d = new Date();
  var curr_date = d.getDate();
  var dia = leadingZero(curr_date);
  return dia;
}
function hoy_mes(){
  var d = new Date();
  var curr_month = d.getMonth() + 1;
  var dia = leadingZero(curr_month);
  return dia;
}
//
// sumar un dia a la fecha actual del date
//
// restar un dia a la fecha actual del date
//
function restar1dia(){
  var fecha_texto =  document.getElementById('fecha').value;	// leer fecha
  var fecha_date = Date.parse(fecha_texto);
 
  var d = new Date(fecha_date);
  d.setDate(d.getDate()-1);
 
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  var dia = curr_year + "-" + leadingZero(curr_month) + "-" + leadingZero(curr_date);
  return dia;
}
//
// sumar un dia a la fecha actual del date
//
function sumar1dia(){
  var fecha_texto =  document.getElementById('fecha').value;	// leer fecha
  var fecha_date = Date.parse(fecha_texto);
 
  var d = new Date(fecha_date);
  d.setDate(d.getDate()+1);
 
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1;
  var curr_year = d.getFullYear();
  var dia = curr_year + "-" + leadingZero(curr_month) + "-" + leadingZero(curr_date);
  return dia;
}
//
//
//
function limpia_tabla(id_table) {
	var table = document.getElementById(id_table);
	 var rowCount = table.rows.length;
	 for(var i=0; i<rowCount; i++) {
                    table.deleteRow(i);
                    rowCount--;
                    i--;
                }
   
}
//
// compara fechas, true si es mayor o igual
//
 function compare_dates(fecha, fecha2)  
  {  
    var xMonth=fecha.substring(3, 5);  
    var xDay=fecha.substring(0, 2);  
    var xYear=fecha.substring(6,10);  
    var yMonth=fecha2.substring(3, 5);  
    var yDay=fecha2.substring(0, 2);  
    var yYear=fecha2.substring(6,10);  
    if (xYear> yYear)  
    {  
        return(true)  
    }  
    else  
    {  
      if (xYear == yYear)  
      {   
        if (xMonth> yMonth)  
        {  
            return(true)  
        }  
        else  
        {   
          if (xMonth == yMonth)  
          {  
            if (xDay>= yDay)  
              return(true);  
            else  
              return(false);  
          }  
          else  
            return(false);  
        }  
      }  
      else  
        return(false);  
    }  
}  
