import express, { json } from 'express';// Entonces, esta línea de código importa tanto el paquete principal de Express como el middleware json de Express para usarlos.
import fs from "fs"; // Con esta línea de código, puedes acceder a todas las funciones proporcionadas por el módulo fs, como leer archivos, escribir archivos, crear directorios, entre otras operaciones relacionadas con el sistema de archivos.
import bodyParser from "body-parser";

const app = express(); //creamos el objeto de la app

app.use(bodyParser.json());

const readData = () => {// aqui leemos el archivo 
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};

const writedata = (data) => { //aqui creamos la funcion para poder escribir los datos 
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
}

app.get("/", (req, res) => {
    res.send("Bienvenidos a mi API REST")
})

//Aqui creamos el Metodo GET Este metodo nos devuelve todo lo que tengamos en nuestra db 
app.get("/Peliculas", (req, res) => {// aqui creamos una funcion callback que recibe los parametros de requerir y respuesta 
    const data = readData(); //leemos los datos 
    res.json(data.Peliculas); //respondemos a la peticion  le enviamos una estructra json 
})

//metodo Get por ID 

app.get("/Peliculas/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);//Extrae el parámetro id de la URL de la solicitud y lo convierte en un número entero utilizando la función parseInt(). req.params.id contiene el valor del marcador de posición :id en la URL de la solicitud.
    const Peliculas = data.Peliculas.find((Peliculas) => Peliculas.id === id);
    res.json(Peliculas);
});

// Metodo POST 

app.post("/Peliculas", (req, res) => {
    const data = readData();
    const body = req.body;// extraer el body que va venir en el objeto de la peticion en body es donde vamos a enviar las peliculas nuevas 
    const newPeliculas = {
        id: data.Peliculas.length + 1,
        ...body,// aqui le decimos que todo lo que viene en body lo agrege en esa nueva  Peliculas 
    };
    data.Peliculas.push(newPeliculas);
    writedata(data);
    res.json(newPeliculas);
});

app.put("/Peliculas/:id", (req, res) => {
    const data = readData();
    const body = req.body;
    const id = parseInt(req.params.id);//Extrae el identificador (id) de la película de la URL de la solicitud y lo convierte en un número entero utilizando la función parseInt(). req.params.id contiene el valor del marcador de posición :id en la URL de la solicitud.
    const PeliculasIndex = data.Peliculas.findIndex((Peliculas) => Peliculas.id === id);
    //Busca el índice de la película en los datos obtenidos que coincida con el ID proporcionado en la solicitud. Utiliza el método Array.findIndex() para encontrar el índice del primer elemento en el array data.Peliculas que cumpla con la condición especificada en la función de callback. En este caso, busca un objeto de película cuyo id coincida con el id proporcionado en la solicitud.
    data.Peliculas[PeliculasIndex] = {
        ...data.Peliculas[PeliculasIndex],
        ...body,
    }; //Actualiza los detalles de la película en la posición encontrada en el array de películas. Combina los detalles existentes de la película con los nuevos detalles proporcionados en el cuerpo de la solicitud utilizando la propagación de objetos (...). Esto sobrescribe los campos existentes de la película con los nuevos valores proporcionados en la solicitud.
    writedata(data);
    res.json({ Message: "La pelicula fue Actualizada" });
});

app.delete("/Peliculas/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const PeliculasIndex = data.Peliculas.findIndex((Peliculas) => Peliculas.id === id);
    data.Peliculas.splice(PeliculasIndex, 1);//Elimina la película en la posición encontrada en el array de películas utilizando el método splice(). PeliculasIndex es el índice de la película a eliminar, y 1 indica cuántos elementos deben eliminarse a partir de esa posición.
    writedata(data);
    res.json({ Message: "La pelicula Fue eliminada" });
});

app.listen(3000, () => {
    console.log('Servidor escuchando peticiones en el puerto 3000');
});