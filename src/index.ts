import colors from 'colors'
import server from "./server";

const PORT = process.env.PORT || 4000;

server.listen(PORT, ()=>{
    console.log(colors.cyan.bold('Rest API en el puerto 4000'))
})