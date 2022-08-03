import { Condicion } from "./condicion.models";
import { Contacto } from "./contacto.models";
import { Contribuyente } from "./contribuyente.models";
import { Domicilio } from "./domicilio.models";
import { Relacionado } from "./relacionado.models";

export class contribuyenteCrear{
contribuyente: Contribuyente;
condicion: Condicion;
domicilio: Domicilio;
relacionado: Relacionado;
contactos: Contacto;
}
